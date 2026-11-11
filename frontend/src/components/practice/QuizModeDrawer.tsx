import React, { useEffect } from 'react'
import { CheckSquare, Languages, Shuffle, BookOpenText, ChevronRight, X } from 'lucide-react'
import { type QuizMode } from '../../api/vocabPractice'

interface QuizModeDrawerProps {
  open: boolean
  onClose: () => void
  readyWordCount: number
  onSelectMode: (mode: QuizMode) => void
}

interface ModeOptionItem {
  mode: QuizMode
  title: string
  description: string
  icon: React.ReactNode
  cardClass: string
  iconWrapClass: string
}

const QUIZ_MODE_OPTIONS: ModeOptionItem[] = [
  {
    mode: 'HANZI_TO_MEANING',
    title: 'Từ → Nghĩa',
    description: 'Nhìn từ tiếng Trung (kèm pinyin), chọn nghĩa tiếng Việt đúng.',
    icon: <CheckSquare className="w-5 h-5" />,
    cardClass: 'bg-sky-50/80 border-sky-200 hover:border-sky-400 hover:bg-sky-50 text-sky-950',
    iconWrapClass: 'bg-sky-100 text-sky-600',
  },
  {
    mode: 'MEANING_TO_HANZI',
    title: 'Nghĩa → Từ',
    description: 'Nhìn nghĩa tiếng Việt, chọn đúng chữ Hán tương ứng.',
    icon: <Languages className="w-5 h-5" />,
    cardClass: 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-950',
    iconWrapClass: 'bg-emerald-100 text-emerald-600',
  },
  {
    mode: 'MIXED',
    title: 'Hỗn hợp',
    description: 'Trộn ngẫu nhiên 2 chế độ Từ → Nghĩa và Nghĩa → Từ trong một ván.',
    icon: <Shuffle className="w-5 h-5" />,
    cardClass: 'bg-violet-50/80 border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-950',
    iconWrapClass: 'bg-violet-100 text-violet-600',
  },
  {
    mode: 'CONTEXT',
    title: 'Ngữ cảnh',
    description: 'Đọc câu ví dụ đã che chỗ trống và chọn từ tiếng Trung phù hợp nhất.',
    icon: <BookOpenText className="w-5 h-5" />,
    cardClass: 'bg-amber-50/80 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-950',
    iconWrapClass: 'bg-amber-100 text-amber-600',
  },
]

export const QuizModeDrawer: React.FC<QuizModeDrawerProps> = ({
  open,
  onClose,
  readyWordCount,
  onSelectMode,
}) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right Slide-over Drawer (GEMINI.md Rule 4: Không dùng Modal/Popup) */}
      <aside
        role="dialog"
        aria-label="Chọn chế độ Quiz"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Chọn chế độ Trắc nghiệm</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Bộ lọc hiện tại có <span className="font-bold text-emerald-700">{readyWordCount} từ sẵn sàng</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Chế độ */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {QUIZ_MODE_OPTIONS.map((item) => (
            <button
              key={item.mode}
              type="button"
              disabled={readyWordCount === 0}
              onClick={() => onSelectMode(item.mode)}
              className={`w-full text-left p-4 rounded-2xl border transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 group ${item.cardClass}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconWrapClass}`}>
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-extrabold tracking-tight">{item.title}</div>
                <div className="text-xs opacity-80 leading-relaxed mt-0.5">{item.description}</div>
              </div>

              <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 group-hover:opacity-90 transition-all shrink-0" />
            </button>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500">
          Mẹo: Chế độ <strong>Ngữ cảnh</strong> sẽ tự động chuyển nhẹ sang <strong>Nghĩa → Từ</strong> nếu từ vựng do bạn tự tạo chưa có câu ví dụ đi kèm.
        </div>
      </aside>
    </div>
  )
}
