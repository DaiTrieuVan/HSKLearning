import React from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

interface PracticeFilterNoticeBannerProps {
  message: string
  tone?: 'emerald' | 'amber'
  actionLabel?: string
  onAction?: () => void
  onDismiss?: () => void
}

/**
 * Compact inline banner communicating automatic filter fallbacks or empty-filter recovery
 * without blocking overlays or modals.
 */
export const PracticeFilterNoticeBanner: React.FC<PracticeFilterNoticeBannerProps> = ({
  message,
  tone = 'emerald',
  actionLabel,
  onAction,
  onDismiss,
}) => {
  const toneClasses =
    tone === 'amber'
      ? 'bg-amber-50 border-amber-200 text-amber-800'
      : 'bg-emerald-50 border-emerald-200 text-emerald-800'

  const actionClasses =
    tone === 'amber'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white'

  return (
    <div
      className={`border rounded-xl px-3 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 ${toneClasses}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {tone === 'amber' ? (
          <Info className="w-4 h-4 shrink-0 text-amber-600" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
        )}
        <span className="leading-snug">{message}</span>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors whitespace-nowrap ${actionClasses}`}
          >
            {actionLabel}
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Đóng thông báo"
            className="p-1 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

