import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Download,
  FileText,
  Loader2,
  Lock,
  Play,
  Plus,
  Presentation,
  Trash2,
  X,
  Check,
  AlertCircle,
} from 'lucide-react'
import {
  downloadOriginalMaterial,
  getClassMaterials,
  getMaterialShares,
  getMyMaterials,
  syncMaterialShares,
  unshareClassMaterial,
  updateClassMaterialDownload,
  type ClassMaterialItem,
  type MaterialSummary,
} from '../../api/material'

interface ClassMaterialsTabProps {
  classId: number
  isTeacher: boolean
  isArchived: boolean
  token: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const ClassMaterialsTab: React.FC<ClassMaterialsTabProps> = ({
  classId,
  isTeacher,
  isArchived,
  token,
}) => {
  const navigate = useNavigate()
  const [items, setItems] = useState<ClassMaterialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null)
  const [removingId, setRemovingId] = useState<number | null>(null)

  // Teacher Slide-over Drawer: chọn giáo trình từ kho cá nhân chia sẻ vào lớp này
  const [pickerOpen, setPickerOpen] = useState(false)
  const [myMaterials, setMyMaterials] = useState<MaterialSummary[]>([])
  const [loadingMyMaterials, setLoadingMyMaterials] = useState(false)
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [shareAllowDownload, setShareAllowDownload] = useState(false)
  const [shareNote, setShareNote] = useState('')
  const [sharing, setSharing] = useState(false)

  const loadClassMaterials = useCallback(async () => {
    if (!token || !classId) return
    setLoading(true)
    try {
      const data = await getClassMaterials(token, classId)
      setItems(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách giáo trình')
    } finally {
      setLoading(false)
    }
  }, [token, classId])

  useEffect(() => {
    loadClassMaterials()
  }, [loadClassMaterials])

  const openPicker = async () => {
    setPickerOpen(true)
    setLoadingMyMaterials(true)
    setSelectedMaterialId(null)
    setShareNote('')
    setShareAllowDownload(false)
    try {
      const list = await getMyMaterials(token)
      const alreadySharedIds = new Set(items.map((i) => i.materialId))
      setMyMaterials(list.filter((m) => !alreadySharedIds.has(m.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải kho giáo trình')
    } finally {
      setLoadingMyMaterials(false)
    }
  }

  const handleAddMaterialToClass = async () => {
    if (!selectedMaterialId) return
    setSharing(true)
    setError(null)
    try {
      const existingShares = await getMaterialShares(token, selectedMaterialId)
      const nextShares = [
        ...existingShares.map((s) => ({
          classId: s.classId,
          allowDownload: s.allowDownload,
          note: s.note || undefined,
        })),
        {
          classId,
          allowDownload: shareAllowDownload,
          note: shareNote.trim() || undefined,
        },
      ]
      await syncMaterialShares(token, selectedMaterialId, nextShares)
      setPickerOpen(false)
      await loadClassMaterials()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chia sẻ giáo trình vào lớp thất bại')
    } finally {
      setSharing(false)
    }
  }

  const handleToggleDownload = async (item: ClassMaterialItem) => {
    setTogglingId(item.materialId)
    const nextValue = !item.allowDownload
    try {
      await updateClassMaterialDownload(token, classId, item.materialId, nextValue)
      setItems((prev) =>
        prev.map((row) =>
          row.materialId === item.materialId
            ? { ...row, allowDownload: nextValue, canDownload: isTeacher || nextValue }
            : row
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cập nhật quyền tải thất bại')
    } finally {
      setTogglingId(null)
    }
  }

  const handleRemoveFromClass = async (materialId: number) => {
    setRemovingId(materialId)
    try {
      await unshareClassMaterial(token, classId, materialId)
      setItems((prev) => prev.filter((item) => item.materialId !== materialId))
      setConfirmRemoveId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gỡ giáo trình khỏi lớp thất bại')
    } finally {
      setRemovingId(null)
    }
  }

  const handleDownload = async (item: ClassMaterialItem) => {
    setDownloadingId(item.materialId)
    try {
      await downloadOriginalMaterial(token, item.materialId, item.originalFilename)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tải giáo trình thất bại')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Giáo trình & Tài liệu trình chiếu</h3>
          <p className="text-xs text-slate-500">
            {isTeacher
              ? 'Chia sẻ slide bài giảng PDF/PowerPoint vào lớp và tùy chỉnh quyền tải về cho học sinh.'
              : 'Mở xem rõ nét từng trang bài giảng trực tiếp trên trình chiếu.'}
          </p>
        </div>
        {isTeacher && !isArchived && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/materials')}
              className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kho giáo trình
            </button>
            <button
              type="button"
              onClick={openPicker}
              className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              <Plus size={15} />
              <span>Chia sẻ giáo trình vào lớp</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError(null)} className="text-xs font-bold underline">
            Đóng
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 text-slate-500">
          <Loader2 size={26} className="animate-spin text-emerald-600" />
          <p className="mt-2 text-xs font-medium">Đang tải giáo trình của lớp...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-12 text-center">
          <BookOpen size={28} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-bold text-slate-700">Lớp học chưa có giáo trình nào</p>
          <p className="mt-1 text-xs text-slate-500">
            {isTeacher
              ? 'Bấm "Chia sẻ giáo trình vào lớp" để gắn tài liệu PDF hoặc PowerPoint cho học sinh.'
              : 'Khi giáo viên chia sẻ tài liệu bài giảng, danh sách sẽ hiển thị tại đây.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const isPdf = item.fileType === 'PDF'
            const isReady = item.status === 'READY'

            return (
              <article
                key={item.materialId}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-w-0"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isPdf ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {isPdf ? <FileText size={20} /> : <Presentation size={20} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="line-clamp-2 text-sm font-bold text-slate-900">{item.title}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{item.fileType}</span>
                        {item.hskLevel != null && <span>• HSK {item.hskLevel}</span>}
                        <span>• {isReady ? `${item.totalPages} trang` : formatBytes(item.fileSizeBytes)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Permission Pill */}
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold ${
                      item.allowDownload
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {item.allowDownload ? <Download size={11} /> : <Lock size={11} />}
                    {item.allowDownload ? 'Cho tải' : 'Chỉ xem'}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-2.5 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                )}

                {item.note && (
                  <div className="mt-2.5 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 border border-slate-100">
                    Ghi chú: {item.note}
                  </div>
                )}

                {isTeacher && !isArchived && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Cho phép học sinh tải file gốc
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.allowDownload}
                      disabled={togglingId === item.materialId}
                      onClick={() => handleToggleDownload(item)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors disabled:opacity-50 ${
                        item.allowDownload ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          item.allowDownload ? 'translate-x-4.5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                )}

                <div className="mt-auto pt-3">
                  {confirmRemoveId === item.materialId ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
                      <span className="text-xs font-semibold text-rose-700">Gỡ khỏi lớp?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConfirmRemoveId(null)}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          disabled={removingId === item.materialId}
                          onClick={() => handleRemoveFromClass(item.materialId)}
                          className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-rose-700"
                        >
                          Gỡ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {isReady ? (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/materials/${item.materialId}/present?classId=${classId}`)
                          }
                          className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          <Play size={14} />
                          <span>{isTeacher ? 'Trình chiếu' : 'Đọc giáo trình'}</span>
                        </button>
                      ) : (
                        <span className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                          {item.status === 'PROCESSING' ? 'Đang xử lý slide...' : 'Tệp bị lỗi'}
                        </span>
                      )}

                      {item.canDownload && (
                        <button
                          type="button"
                          disabled={downloadingId === item.materialId}
                          onClick={() => handleDownload(item)}
                          title="Tải file gốc"
                          className="inline-flex min-h-[40px] items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          {downloadingId === item.materialId ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Download size={14} />
                          )}
                          <span>Tải về</span>
                        </button>
                      )}

                      {isTeacher && !isArchived && (
                        <button
                          type="button"
                          onClick={() => setConfirmRemoveId(item.materialId)}
                          title="Gỡ khỏi lớp"
                          aria-label="Gỡ khỏi lớp"
                          className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Slide-over Drawer: Chọn giáo trình từ kho cá nhân chia sẻ vào lớp */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
            onClick={() => !sharing && setPickerOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex h-full w-full max-w-full flex-col bg-white shadow-2xl sm:max-w-[460px] md:max-w-[500px]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Chọn giáo trình chia sẻ</h3>
                <p className="text-xs text-slate-500">Chọn từ kho giáo trình cá nhân của bạn</p>
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
              {loadingMyMaterials ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Loader2 size={26} className="animate-spin text-emerald-600" />
                  <p className="mt-2 text-xs">Đang tải kho giáo trình...</p>
                </div>
              ) : myMaterials.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    Không còn giáo trình nào chưa chia sẻ vào lớp này
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/materials')}
                    className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    Tới Kho giáo trình để tải lên
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {myMaterials.map((m) => {
                      const selected = selectedMaterialId === m.id
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setSelectedMaterialId(m.id)
                            setShareAllowDownload(m.defaultAllowDownload)
                          }}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-colors ${
                            selected
                              ? 'border-emerald-500 bg-emerald-50/50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                selected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {selected && <Check size={12} strokeWidth={3} />}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">{m.title}</p>
                              <p className="text-xs text-slate-500">
                                {m.fileType} • {m.totalPages > 0 ? `${m.totalPages} trang` : formatBytes(m.fileSizeBytes)}
                              </p>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {selectedMaterialId != null && (
                    <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {shareAllowDownload ? (
                            <Download size={16} className="text-emerald-600" />
                          ) : (
                            <Lock size={16} className="text-amber-600" />
                          )}
                          <span className="text-xs font-semibold text-slate-800">
                            {shareAllowDownload
                              ? 'Cho phép học sinh tải file gốc'
                              : 'Chỉ xem trình chiếu (Không cho tải)'}
                          </span>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={shareAllowDownload}
                          onClick={() => setShareAllowDownload((v) => !v)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                            shareAllowDownload ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              shareAllowDownload ? 'translate-x-4.5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={500}
                        value={shareNote}
                        onChange={(e) => setShareNote(e.target.value)}
                        placeholder="Ghi chú cho lớp (tùy chọn)..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                disabled={sharing}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!selectedMaterialId || sharing}
                onClick={handleAddMaterialToClass}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {sharing && <Loader2 size={15} className="animate-spin" />}
                <span>Chia sẻ vào lớp</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
