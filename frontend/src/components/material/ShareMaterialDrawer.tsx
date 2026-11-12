import React, { useEffect, useState } from 'react'
import { X, Share2, Lock, Download, Check, Loader2, Users, AlertCircle } from 'lucide-react'
import { getTeachingClasses, type ClassItem } from '../../api/classroom'
import {
  getMaterialShares,
  syncMaterialShares,
  type MaterialSharePayloadItem,
  type MaterialSummary,
} from '../../api/material'

interface ShareMaterialDrawerProps {
  open: boolean
  token: string
  material: MaterialSummary | null
  onClose: () => void
  onSynced: (sharedClassCount: number) => void
}

interface DraftClassShare {
  selected: boolean
  allowDownload: boolean
  note: string
}

export const ShareMaterialDrawer: React.FC<ShareMaterialDrawerProps> = ({
  open,
  token,
  material,
  onClose,
  onSynced,
}) => {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [drafts, setDrafts] = useState<Record<number, DraftClassShare>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !material) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([getTeachingClasses(token), getMaterialShares(token, material.id)])
      .then(([teachingClasses, currentShares]) => {
        if (cancelled) return
        const activeClasses = teachingClasses.filter((c) => c.status === 'ACTIVE')
        setClasses(activeClasses)

        const shareMap = new Map(currentShares.map((s) => [s.classId, s]))
        const nextDrafts: Record<number, DraftClassShare> = {}
        for (const cls of activeClasses) {
          const existing = shareMap.get(cls.id)
          nextDrafts[cls.id] = {
            selected: Boolean(existing),
            allowDownload: existing ? existing.allowDownload : material.defaultAllowDownload,
            note: existing?.note || '',
          }
        }
        setDrafts(nextDrafts)
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách lớp học')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, material, token])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, saving, onClose])

  if (!open || !material) return null

  const toggleClass = (classId: number) => {
    setDrafts((prev) => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || { selected: false, allowDownload: material.defaultAllowDownload, note: '' }),
        selected: !prev[classId]?.selected,
      },
    }))
  }

  const toggleDownload = (classId: number) => {
    setDrafts((prev) => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || { selected: true, allowDownload: false, note: '' }),
        allowDownload: !prev[classId]?.allowDownload,
      },
    }))
  }

  const updateNote = (classId: number, note: string) => {
    setDrafts((prev) => ({
      ...prev,
      [classId]: {
        ...(prev[classId] || { selected: true, allowDownload: false, note: '' }),
        note,
      },
    }))
  }

  const selectedCount = Object.values(drafts).filter((d) => d.selected).length

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const payload: MaterialSharePayloadItem[] = Object.entries(drafts)
        .filter(([, draft]) => draft.selected)
        .map(([classId, draft]) => ({
          classId: Number(classId),
          allowDownload: draft.allowDownload,
          note: draft.note.trim() || undefined,
        }))
      const updated = await syncMaterialShares(token, material.id, payload)
      onSynced(updated.length)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu cấu hình chia sẻ thất bại')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={() => !saving && onClose()}
        aria-hidden="true"
      />

      <aside
        className="relative z-10 flex h-full w-full max-w-full flex-col bg-white shadow-2xl sm:max-w-[460px] md:max-w-[500px]"
        aria-label="Chia sẻ giáo trình vào lớp học"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Share2 size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-slate-900">Chia sẻ giáo trình vào lớp</h2>
              <p className="truncate text-xs text-slate-500">{material.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <AlertCircle size={17} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 size={26} className="animate-spin text-emerald-600" />
              <p className="mt-2 text-sm">Đang tải danh sách lớp học...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <Users size={28} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">Bạn chưa có lớp học đang hoạt động</p>
              <p className="mt-1 text-xs text-slate-500">Hãy tạo lớp học trước khi chia sẻ giáo trình.</p>
            </div>
          ) : (
            classes.map((cls) => {
              const draft = drafts[cls.id] || {
                selected: false,
                allowDownload: material.defaultAllowDownload,
                note: '',
              }
              return (
                <div
                  key={cls.id}
                  className={`rounded-2xl border p-3.5 transition-colors ${
                    draft.selected
                      ? 'border-emerald-300 bg-emerald-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleClass(cls.id)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          draft.selected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {draft.selected && <Check size={13} strokeWidth={3} />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">{cls.title}</p>
                        <p className="text-xs text-slate-500">
                          {cls.memberCount} học sinh • Mã {cls.joinCode}
                        </p>
                      </div>
                    </div>
                  </button>

                  {draft.selected && (
                    <div className="mt-3 space-y-2.5 border-t border-emerald-200/70 pt-3">
                      <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 border border-slate-200">
                        <div className="flex items-center gap-2 min-w-0">
                          {draft.allowDownload ? (
                            <Download size={15} className="shrink-0 text-emerald-600" />
                          ) : (
                            <Lock size={15} className="shrink-0 text-amber-600" />
                          )}
                          <span className="truncate text-xs font-semibold text-slate-700">
                            {draft.allowDownload
                              ? 'Cho phép học sinh tải file gốc'
                              : 'Chỉ xem trình chiếu (Không cho tải)'}
                          </span>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={draft.allowDownload}
                          onClick={() => toggleDownload(cls.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                            draft.allowDownload ? 'bg-emerald-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              draft.allowDownload ? 'translate-x-4.5' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <input
                        type="text"
                        maxLength={500}
                        value={draft.note}
                        onChange={(e) => updateNote(cls.id, e.target.value)}
                        placeholder="Ghi chú ngắn cho lớp (tùy chọn)..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3.5 sm:px-6">
          <span className="text-xs font-semibold text-slate-600">
            Đã chọn {selectedCount} lớp
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {saving && <Loader2 size={15} className="animate-spin" />}
              <span>Lưu chia sẻ</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
