import React from 'react'
import { CheckSquare, Languages, Shuffle, BookOpenText, ChevronRight } from 'lucide-react'
import { type QuizMode } from '../../api/vocabPractice'
import { SlideOverDrawer } from './SlideOverDrawer'

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
  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      ariaLabel="Chọn chế độ Quiz"
      title="Chọn chế độ Trắc nghiệm"
      subtitle={
        <>
          Bộ lọc hiện tại có <span className="font-bold text-emerald-700">{readyWordCount} từ sẵn sàng</span>
        </>
      }
      footer={
        <p className="text-[11px] text-slate-500">
          Mẹo: Chế độ <strong>Ngữ cảnh</strong> sẽ tự động chuyển nhẹ sang <strong>Nghĩa → Từ</strong> nếu từ vựng do bạn tự tạo chưa có câu ví dụ đi kèm.
        </p>
      }
    >
      <div className="space-y-3">
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
    </SlideOverDrawer>
  )
}
