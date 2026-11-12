import React, { useEffect, useState } from 'react'
import { X, Upload, FileText, Presentation, Lock, Download, Loader2, AlertCircle } from 'lucide-react'
import {
  uploadMaterial,
  updateMaterial,
  type MaterialSummary,
} from '../../api/material'

interface MaterialUploadDrawerProps {
  open: boolean
  token: string
  editingMaterial?: MaterialSummary | null
  onClose: () => void
  onSaved: (material: MaterialSummary) => void
}

const MAX_SIZE_BYTES = 50 * 1024 * 1024

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export const MaterialUploadDrawer: React.FC<MaterialUploadDrawerProps> = ({
  open,
  token,
  editingMaterial,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(editingMaterial)

  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [hskLevel, setHskLevel] = useState<string>('')
  const [defaultAllowDownload, setDefaultAllowDownload] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (editingMaterial) {
      setTitle(editingMaterial.title)
      setDescription(editingMaterial.description || '')
      setHskLevel(editingMaterial.hskLevel != null ? String(editingMaterial.hskLevel) : '')
      setDefaultAllowDownload(editingMaterial.defaultAllowDownload)
      setFile(null)
    } else {
      setTitle('')
      setDescription('')
      setHskLevel('')
      setDefaultAllowDownload(false)
      setFile(null)
    }
    setError(null)
    setSubmitting(false)
  }, [open, editingMaterial])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, submitting, onClose])

  if (!open) return null

  const handleSelectFile = (selected: File | null) => {
    setError(null)
    if (!selected) return
    const lower = selected.name.toLowerCase()
    if (!lower.endsWith('.pdf') && !lower.endsWith('.pptx')) {
      setError('Chỉ hỗ trợ tệp định dạng .pdf hoặc .pptx (nếu là .ppt cũ, vui lòng lưu lại sang .pptx hoặc .pdf).')
      return
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setError('Dung lượng tệp vượt quá giới hạn tối đa 50 MB.')
      return
    }
    setFile(selected)
    if (!title.trim()) {
      const stripped = selected.name.replace(/\.(pdf|pptx)$/i, '')
      setTitle(stripped.slice(0, 200))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanTitle = title.trim()
    if (!cleanTitle) {
      setError('Vui lòng nhập tiêu đề giáo trình.')
      return
    }

    const parsedLevel = hskLevel ? Number(hskLevel) : null

    setSubmitting(true)
    try {
      let saved: MaterialSummary
      if (editingMaterial) {
        saved = await updateMaterial(token, editingMaterial.id, {
          title: cleanTitle,
          description: description.trim() || null,
          hskLevel: parsedLevel,
          defaultAllowDownload,
        })
      } else {
        if (!file) {
          setError('Vui lòng chọn tệp .pdf hoặc .pptx để tải lên.')
          setSubmitting(false)
          return
        }
        saved = await uploadMaterial(token, {
          file,
          title: cleanTitle,
          description: description.trim() || undefined,
          hskLevel: parsedLevel,
          defaultAllowDownload,
        })
      }
      onSaved(saved)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu giáo trình thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={() => !submitting && onClose()}
        aria-hidden="true"
      />

      <aside
        className="relative z-10 flex h-full w-full max-w-full flex-col bg-white shadow-2xl sm:max-w-[460px] md:max-w-[500px]"
        aria-label={isEditing ? 'Chỉnh sửa giáo trình' : 'Tải lên giáo trình'}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              {isEditing ? <FileText size={18} /> : <Upload size={18} />}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-slate-900">
                {isEditing ? 'Cập nhật giáo trình' : 'Tải lên giáo trình mới'}
              </h2>
              <p className="truncate text-xs text-slate-500">
                Hỗ trợ PDF và PowerPoint (.pptx) tối đa 50 MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex-1 space-y-4 px-4 py-4 sm:px-6">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!isEditing && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Tệp giáo trình (.pdf, .pptx) <span className="text-rose-500">*</span>
                </label>
                <label
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                    handleSelectFile(e.dataTransfer.files?.[0] ?? null)
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/70'
                      : 'border-slate-300 bg-slate-50/60 hover:border-emerald-400 hover:bg-emerald-50/30'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    className="sr-only"
                    onChange={(e) => handleSelectFile(e.target.files?.[0] ?? null)}
                  />
                  {file ? (
                    <div className="flex w-full items-center gap-3 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-left">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        {file.name.toLowerCase().endsWith('.pdf') ? (
                          <FileText size={20} />
                        ) : (
                          <Presentation size={20} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{file.name}</p>
                        <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-emerald-600">Đổi tệp</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={26} className="mb-2 text-emerald-600" />
                      <p className="text-sm font-semibold text-slate-800">
                        Kéo thả tệp vào đây hoặc bấm để chọn
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Hệ thống tự chuyển thành từng slide ảnh sắc nét để trình chiếu
                      </p>
                    </>
                  )}
                </label>
              </div>
            )}

            <div>
              <label htmlFor="material-title" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Tiêu đề giáo trình <span className="text-rose-500">*</span>
              </label>
              <input
                id="material-title"
                type="text"
                maxLength={200}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Giáo trình HSK 2 - Bài 5 Ngữ pháp cốt lõi"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label htmlFor="material-hsk" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Cấp độ HSK (tùy chọn)
              </label>
              <select
                id="material-hsk"
                value={hskLevel}
                onChange={(e) => setHskLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Tổng hợp / Tất cả cấp độ</option>
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    HSK {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="material-desc" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Mô tả nội dung
              </label>
              <textarea
                id="material-desc"
                rows={3}
                maxLength={2000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ghi chú nội dung chính, bài tập đi kèm hoặc hướng dẫn ôn tập..."
                className="w-full resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 rounded-lg p-1.5 ${defaultAllowDownload ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {defaultAllowDownload ? <Download size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {defaultAllowDownload ? 'Cho phép học sinh tải file gốc' : 'Chỉ xem trực tuyến (Chặn tải về)'}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {defaultAllowDownload
                        ? 'Học sinh mặc định có thể tải tệp PDF/PPTX gốc khi bạn chia sẻ vào lớp.'
                        : 'Học sinh đọc rõ nét trên trình chiếu nhưng không tải được tệp gốc. Bạn vẫn có thể bật riêng cho từng lớp khi chia sẻ.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={defaultAllowDownload}
                  onClick={() => setDefaultAllowDownload((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    defaultAllowDownload ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      defaultAllowDownload ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{isEditing ? 'Lưu thay đổi' : 'Tải lên & xử lý slide'}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  )
}
