import React, { useState, useEffect } from 'react'
import { X, BookOpen, Palette, Globe, Lock, Loader2, Folder } from 'lucide-react'
import type { VocabFolder, VocabSetSummary, CreateVocabSetPayload } from '../../api/vocabManagement'

interface VocabSetDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateVocabSetPayload) => Promise<void>
  folders: VocabFolder[]
  currentFolderId?: number | null
  initialSet?: VocabSetSummary | null
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald green
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
]

export const VocabSetDrawer: React.FC<VocabSetDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  folders,
  currentFolderId,
  initialSet,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [folderId, setFolderId] = useState<number | null>(null)
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialSet) {
      setTitle(initialSet.title || '')
      setDescription(initialSet.description || '')
      setFolderId(initialSet.folderId ?? null)
      setColor(initialSet.color || PRESET_COLORS[0])
      setIsPublic(initialSet.isPublic ?? false)
    } else {
      setTitle('')
      setDescription('')
      setFolderId(currentFolderId ?? null)
      setColor(PRESET_COLORS[0])
      setIsPublic(false)
    }
    setError(null)
  }, [initialSet, currentFolderId, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tên bộ từ vựng không được để trống')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        folderId,
        color,
        isPublic,
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu bộ từ')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-800">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: color }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {initialSet ? 'Chỉnh sửa bộ từ vựng' : 'Tạo bộ từ vựng mới'}
                </h2>
                <p className="text-xs text-slate-500">
                  Tập hợp từ vựng theo chủ đề hoặc bài học
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form id="vocab-set-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Tên bộ từ vựng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Giao tiếp tại nhà hàng, Từ vựng HSK 2 bài 1..."
                maxLength={150}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Mô tả
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú thêm về bộ từ vựng..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            {/* Folder Select */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                <span>Nằm trong Folder</span>
              </label>
              <select
                value={folderId ?? ''}
                onChange={(e) => setFolderId(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
              >
                <option value="">(Không có folder - Thư mục gốc)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Palette */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                <span>Màu sắc nhãn</span>
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center relative shadow-sm"
                    style={{ backgroundColor: c }}
                  >
                    {color === c && (
                      <div className="w-3 h-3 rounded-full bg-white shadow-md ring-2 ring-black/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                id="isPublicCheckbox"
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isPublicCheckbox" className="cursor-pointer text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  {isPublic ? (
                    <>
                      <Globe className="w-4 h-4 text-emerald-600" />
                      <span>Công khai cho cộng đồng</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-500" />
                      <span>Chỉ mình tôi (Riêng tư)</span>
                    </>
                  )}
                </div>
                <p className="text-slate-500 leading-relaxed">
                  Khi bật công khai, các học sinh khác trong cộng đồng có thể xem và nhập bộ từ này vào tài khoản của họ để học.
                </p>
              </label>
            </div>
          </form>

          {/* Footer actions */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50/70">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 text-sm font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="vocab-set-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialSet ? 'Lưu thay đổi' : 'Tạo bộ từ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
