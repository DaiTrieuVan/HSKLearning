import React from 'react'
import { Type, Keyboard, ChevronRight } from 'lucide-react'
import { type TypingMode } from '../../api/vocabPractice'
import { SlideOverDrawer } from './SlideOverDrawer'

interface TypingModeDrawerProps {
  open: boolean
  onClose: () => void
  readyWordCount: number
  onSelectMode: (mode: TypingMode) => void
}

interface TypingOptionItem {
  mode: TypingMode
  title: string
  description: string
  icon: React.ReactNode
  cardClass: string
  iconWrapClass: string
}

const TYPING_MODE_OPTIONS: TypingOptionItem[] = [
  {
    mode: 'WORD',
    title: 'Gõ từ',
    description: 'Nhìn nghĩa và gõ từ tiếng Trung (hỗ trợ đảo chiều Nghĩa > Từ và Từ > Nghĩa ngay khi chơi).',
    icon: <Type className="w-5 h-5" />,
    cardClass: 'bg-emerald-50/90 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 text-emerald-950',
    iconWrapClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    mode: 'PINYIN',
    title: 'Gõ pinyin',
    description: 'Nhìn từ tiếng Trung và gõ phiên âm Pinyin chuẩn thanh điệu (hỗ trợ dấu hoặc số thanh 1–4).',
    icon: <Keyboard className="w-5 h-5" />,
    cardClass: 'bg-amber-50/90 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-950',
    iconWrapClass: 'bg-amber-100 text-amber-700',
  },
]

export const TypingModeDrawer: React.FC<TypingModeDrawerProps> = ({
  open,
  onClose,
  readyWordCount,
  onSelectMode,
}) => {
  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      ariaLabel="Chọn chế độ Gõ từ"
      title="Chọn chế độ Gõ từ"
      headerIcon={
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <Type className="w-5 h-5" />
        </div>
      }
      subtitle={
        <>
          Bộ lọc hiện tại có <span className="font-bold text-emerald-700">{readyWordCount} từ sẵn sàng</span>
        </>
      }
      footer={
        <p className="text-[11px] text-slate-500">
          Mỗi câu có tối đa <strong>3 lần Gợi ý</strong> không bị trừ XP. Ở chế độ <strong>Gõ pinyin</strong>, vui lòng nhập đúng dấu thanh (<code>nǐ hǎo</code>) hoặc số thanh (<code>ni3 hao3</code>).
        </p>
      }
    >
      <div className="space-y-3">
        {TYPING_MODE_OPTIONS.map((item) => (
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
