import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  FileText,
  Presentation,
  Play,
  Share2,
  Pencil,
  Trash2,
  Download,
  Lock,
  Loader2,
  AlertCircle,
  RefreshCw,
  Users,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  deleteMaterial,
  downloadOriginalMaterial,
  getMyMaterials,
  retryRenderMaterial,
  type MaterialFileType,
  type MaterialSummary,
} from '../../api/material'
import { ProtectedSlideCanvas } from '../../components/material/ProtectedSlideCanvas'
import { MaterialUploadDrawer } from '../../components/material/MaterialUploadDrawer'
import { ShareMaterialDrawer } from '../../components/material/ShareMaterialDrawer'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const MaterialManagementPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const token = user?.token || ''

  const [materials, setMaterials] = useState<MaterialSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [keyword, setKeyword] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<MaterialFileType | ''>('')
  const [hskFilter, setHskFilter] = useState<string>('')

  // Drawers & inline states
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<MaterialSummary | null>(null)
  const [sharingMaterial, setSharingMaterial] = useState<MaterialSummary | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [retryingId, setRetryingId] = useState<number | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  const fetchMaterials = useCallback(
    async (silent = false) => {
      if (!token) return
      if (!silent) setLoading(true)
      try {
        const list = await getMyMaterials(token)
        setMaterials(list)
        setError(null)
      } catch (err) {
        if (!silent) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách giáo trình')
        }
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [token]
  )

  useEffect(() => {
    fetchMaterials(false)
  }, [fetchMaterials])

  // Tự động poll trạng thái nếu có giáo trình đang xử lý slide
  const hasProcessing = useMemo(
    () => materials.some((m) => m.status === 'PROCESSING'),
    [materials]
  )

  useEffect(() => {
    if (!hasProcessing) return
    const timer = window.setInterval(() => {
      fetchMaterials(true)
    }, 2500)
    return () => window.clearInterval(timer)
  }, [hasProcessing, fetchMaterials])

  const filteredMaterials = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    const levelNum = hskFilter ? Number(hskFilter) : null
    return materials.filter((m) => {
      if (q && !m.title.toLowerCase().includes(q) && !m.originalFilename.toLowerCase().includes(q)) {
        return false
      }
      if (fileTypeFilter && m.fileType !== fileTypeFilter) {
        return false
      }
      if (levelNum != null && m.hskLevel !== levelNum) {
        return false
      }
      return true
    })
  }, [materials, keyword, fileTypeFilter, hskFilter])

  const handleSavedMaterial = (saved: MaterialSummary) => {
    setMaterials((prev) => {
      const idx = prev.findIndex((item) => item.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
  }

  const handleDelete = async (materialId: number) => {
    setDeletingId(materialId)
    try {
      await deleteMaterial(token, materialId)
      setMaterials((prev) => prev.filter((m) => m.id !== materialId))
      setConfirmDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xóa giáo trình thất bại')
    } finally {
      setDeletingId(null)
    }
  }

  const handleRetry = async (materialId: number) => {
    setRetryingId(materialId)
    try {
      const updated = await retryRenderMaterial(token, materialId)
      handleSavedMaterial(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thử xử lý lại thất bại')
    } finally {
      setRetryingId(null)
    }
  }

  const handleDownload = async (m: MaterialSummary) => {
    setDownloadingId(m.id)
    try {
      await downloadOriginalMaterial(token, m.id, m.originalFilename)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tải giáo trình thất bại')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-5 overflow-x-hidden">
      {/* Compact Responsive Filter & Action Toolbar */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-0">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm theo tên giáo trình hoặc tên tệp..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <select
              value={fileTypeFilter}
              onChange={(e) => setFileTypeFilter(e.target.value as MaterialFileType | '')}
              aria-label="Lọc theo định dạng tệp"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none sm:w-36"
            >
              <option value="">Tất cả tệp</option>
              <option value="PDF">PDF</option>
              <option value="PPTX">PowerPoint</option>
            </select>

            <select
              value={hskFilter}
              onChange={(e) => setHskFilter(e.target.value)}
              aria-label="Lọc theo cấp độ HSK"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none sm:w-36"
            >
              <option value="">Mọi cấp HSK</option>
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <option key={lvl} value={lvl}>
                  HSK {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingMaterial(null)
            setUploadDrawerOpen(true)
          }}
          className="inline-flex min-h-[44px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-700 lg:w-auto"
        >
          <Plus size={18} />
          <span>Tải lên giáo trình</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-bold underline"
          >
            Đóng
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-slate-500">
          <Loader2 size={30} className="animate-spin text-emerald-600" />
          <p className="mt-3 text-sm font-medium">Đang tải kho giáo trình...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-14 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BookOpen size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {materials.length === 0 ? 'Chưa có giáo trình nào' : 'Không tìm thấy giáo trình phù hợp'}
          </h3>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            {materials.length === 0
              ? 'Tải lên tệp PDF hoặc PowerPoint (.pptx) để trình chiếu giảng dạy trực tiếp và chia sẻ an toàn cho các lớp học.'
              : 'Thử đổi từ khóa tìm kiếm hoặc bộ lọc định dạng/cấp độ HSK.'}
          </p>
          {materials.length === 0 && (
            <button
              type="button"
              onClick={() => {
                setEditingMaterial(null)
                setUploadDrawerOpen(true)
              }}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              <Plus size={18} />
              <span>Tải giáo trình đầu tiên</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMaterials.map((m) => {
            const isPdf = m.fileType === 'PDF'
            const isReady = m.status === 'READY'
            const isProcessing = m.status === 'PROCESSING'
            const isFailed = m.status === 'FAILED'

            return (
              <article
                key={m.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md min-w-0"
              >
                {/* Preview Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-100 bg-slate-100">
                  {isReady && isPdf ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/materials/${m.id}/present`)}
                      className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-slate-50 px-4 text-center transition-colors hover:from-rose-100/70"
                    >
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm">
                        <FileText size={26} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Tài liệu PDF • {m.totalPages} trang</span>
                      <span className="mt-0.5 text-[11px] font-medium text-emerald-700">Bấm để trình chiếu toàn màn hình</span>
                    </button>
                  ) : isReady && m.totalPages > 0 ? (
                    <div
                      onClick={() => navigate(`/materials/${m.id}/present`)}
                      className="h-full w-full cursor-pointer overflow-hidden p-1.5"
                    >
                      <ProtectedSlideCanvas
                        token={token}
                        materialId={m.id}
                        pageNumber={1}
                        protectFromDownload={false}
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
                      {isProcessing ? (
                        <>
                          <Loader2 size={28} className="animate-spin text-emerald-600" />
                          <span className="mt-2 text-xs font-semibold text-slate-600">
                            {isPdf ? 'Đang kiểm tra tài liệu PDF...' : 'Đang chuyển đổi slide...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={28} className="text-rose-500" />
                          <span className="mt-2 text-xs font-semibold text-rose-700">
                            {isPdf ? 'Không thể đọc tài liệu PDF' : 'Lỗi chuyển đổi slide'}
                          </span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-bold shadow-sm ${
                        isPdf
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {isPdf ? <FileText size={12} /> : <Presentation size={12} />}
                      {m.fileType}
                    </span>
                    {m.hskLevel != null && (
                      <span className="rounded-lg bg-slate-900/80 px-2 py-0.5 text-[11px] font-bold text-white">
                        HSK {m.hskLevel}
                      </span>
                    )}
                  </div>

                  {/* Download Protection Badge */}
                  <div className="pointer-events-none absolute right-2.5 top-2.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold shadow-sm ${
                        m.defaultAllowDownload
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-white/95 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {m.defaultAllowDownload ? <Download size={11} /> : <Lock size={11} />}
                      {m.defaultAllowDownload ? 'Cho tải' : 'Chỉ xem'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-3.5">
                  <h3 className="line-clamp-2 text-sm font-bold text-slate-900" title={m.title}>
                    {m.title}
                  </h3>
                  {m.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{m.description}</p>
                  )}

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{isReady ? `${m.totalPages} trang` : formatBytes(m.fileSizeBytes)}</span>
                    {isReady && <span>• {formatBytes(m.fileSizeBytes)}</span>}
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <Users size={12} />
                      {m.sharedClassCount} lớp
                    </span>
                  </div>

                  {isFailed && m.errorMessage && (
                    <div className="mt-2.5 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-700">
                      {m.errorMessage}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-3">
                    {confirmDeleteId === m.id ? (
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                        <span className="text-xs font-semibold text-rose-700">Xác nhận xóa?</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={deletingId === m.id}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(m.id)}
                            disabled={deletingId === m.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-700"
                          >
                            {deletingId === m.id && <Loader2 size={12} className="animate-spin" />}
                            Xóa
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isReady ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/materials/${m.id}/present`)}
                            className="inline-flex min-h-[38px] flex-1 whitespace-nowrap items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <Play size={14} />
                            <span>Trình chiếu</span>
                          </button>
                        ) : isFailed ? (
                          <button
                            type="button"
                            onClick={() => handleRetry(m.id)}
                            disabled={retryingId === m.id}
                            className="inline-flex min-h-[38px] flex-1 whitespace-nowrap items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-60"
                          >
                            <RefreshCw size={14} className={retryingId === m.id ? 'animate-spin' : ''} />
                            <span>Thử lại</span>
                          </button>
                        ) : isPdf ? (
                          <button
                            type="button"
                            onClick={() => handleRetry(m.id)}
                            disabled={retryingId === m.id}
                            className="inline-flex min-h-[38px] flex-1 whitespace-nowrap items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            <RefreshCw size={14} className={retryingId === m.id ? 'animate-spin' : ''} />
                            <span>Kích hoạt ngay</span>
                          </button>
                        ) : (
                          <span className="inline-flex min-h-[38px] flex-1 whitespace-nowrap items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                            Đang xử lý...
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => setSharingMaterial(m)}
                          title="Chia sẻ vào lớp học"
                          className="inline-flex min-h-[38px] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Share2 size={14} />
                          <span className="sm:hidden lg:inline">Chia sẻ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingMaterial(m)
                            setUploadDrawerOpen(true)
                          }}
                          title="Chỉnh sửa thông tin"
                          aria-label="Chỉnh sửa thông tin"
                          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownload(m)}
                          disabled={downloadingId === m.id}
                          title="Tải tệp gốc của bạn"
                          aria-label="Tải tệp gốc"
                          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {downloadingId === m.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Download size={14} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(m.id)}
                          title="Xóa giáo trình"
                          aria-label="Xóa giáo trình"
                          className="inline-flex min-h-[38px] min-w-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <MaterialUploadDrawer
        open={uploadDrawerOpen}
        token={token}
        editingMaterial={editingMaterial}
        onClose={() => setUploadDrawerOpen(false)}
        onSaved={handleSavedMaterial}
      />

      <ShareMaterialDrawer
        open={Boolean(sharingMaterial)}
        token={token}
        material={sharingMaterial}
        onClose={() => setSharingMaterial(null)}
        onSynced={(sharedCount) => {
          if (!sharingMaterial) return
          setMaterials((prev) =>
            prev.map((item) =>
              item.id === sharingMaterial.id ? { ...item, sharedClassCount: sharedCount } : item
            )
          )
        }}
      />
    </div>
  )
}

