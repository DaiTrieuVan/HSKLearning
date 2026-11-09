import React from 'react'
import { BookOpen, Pencil, Share2, Trash2, Globe, Lock, CheckCircle2 } from 'lucide-react'
import type { VocabSetSummary } from '../../api/vocabManagement'

interface VocabSetCardProps {
  set: VocabSetSummary
  onView: (set: VocabSetSummary) => void
  onEdit?: (set: VocabSetSummary) => void
  onShare?: (set: VocabSetSummary) => void
  onDelete?: (set: VocabSetSummary) => void
  isReadOnly?: boolean
}

export const VocabSetCard: React.FC<VocabSetCardProps> = ({
  set,
  onView,
  onEdit,
  onShare,
  onDelete,
  isReadOnly = false,
}) => {
  const setColor = set.color || '#3B82F6'
  const progressPercent = set.wordCount > 0
    ? Math.min(100, Math.round((set.masteredCount / set.wordCount) * 100))
    : 0

  return (
    <div className="flex flex-col justify-between p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
              style={{ backgroundColor: setColor }}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white truncate hover:text-emerald-400 cursor-pointer" onClick={() => onView(set)}>
                {set.title}
              </h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {set.description || 'Không có mô tả'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {set.isPublic ? (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <Globe className="w-3 h-3" />
                <span>Cộng đồng</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-400 border border-slate-600/30">
                <Lock className="w-3 h-3" />
                <span>Riêng tư</span>
              </span>
            )}
          </div>
        </div>

        {/* Word count & Progress */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">{set.wordCount} từ</span>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {set.masteredCount}/{set.wordCount} đã thuộc ({progressPercent}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-700/80 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onView(set)}
          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          Xem từ
        </button>

        {!isReadOnly && (
          <div className="flex items-center gap-1">
            {onShare && (
              <button
                type="button"
                onClick={() => onShare(set)}
                title="Chia sẻ bộ từ"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4 text-sky-400" />
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(set)}
                title="Chỉnh sửa bộ từ"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Pencil className="w-4 h-4 text-emerald-400" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(set)}
                title="Xóa bộ từ"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
