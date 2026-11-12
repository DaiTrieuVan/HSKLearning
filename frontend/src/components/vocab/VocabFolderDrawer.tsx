import React, { useState, useEffect } from 'react'
import { X, Folder, Palette, Loader2 } from 'lucide-react'
import type { VocabFolder, CreateVocabFolderPayload } from '../../api/vocabManagement'

interface VocabFolderDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CreateVocabFolderPayload) => Promise<void>
  initialFolder?: VocabFolder | null
}

const PRESET_COLORS = [
  '#F59E0B', // Amber / Gold
  '#3B82F6', // Blue
  '#10B981', // Emerald green
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
]

export const VocabFolderDrawer: React.FC<VocabFolderDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialFolder,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialFolder) {
      setTitle(initialFolder.title || '')
      setDescription(initialFolder.description || '')
      setColor(initialFolder.color || PRESET_COLORS[0])
    } else {
      setTitle('')
      setDescription('')
      setColor(PRESET_COLORS[0])
    }
    setError(null)
  }, [initialFolder, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Tên thư mục không được để trống')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        color,
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu thư mục')
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
                <Folder className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {initialFolder ? 'Chỉnh sửa Folder' : 'Tạo Folder mới'}
                </h2>
                <p className="text-xs text-slate-500">
                  Phân nhóm và sắp xếp các bộ từ vựng gọn gàng
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
          <form id="vocab-folder-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Tên Folder <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Từ vựng Boya, HSK 1 Căn bản..."
                maxLength={100}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Mô tả ngắn
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú về nhóm bộ từ vựng này..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                <span>Màu sắc đại diện</span>
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
              form="vocab-folder-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialFolder ? 'Lưu thay đổi' : 'Tạo Folder'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
