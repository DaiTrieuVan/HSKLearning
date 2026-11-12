import React from 'react'
import { Headphones, Type, Keyboard, ChevronRight } from 'lucide-react'
import { type TypingMode } from '../../api/vocabPractice'
import { SlideOverDrawer } from './SlideOverDrawer'

interface DictationModeDrawerProps {
  open: boolean
  onClose: () => void
  readyWordCount: number
  onSelectMode: (mode: TypingMode) => void
}

interface DictationOptionItem {
  mode: TypingMode
  title: string
  description: string
  icon: React.ReactNode
  cardClass: string
  iconWrapClass: string
}

const DICTATION_MODE_OPTIONS: DictationOptionItem[] = [
  {
    mode: 'WORD',
    title: 'Gõ từ',
    description: 'Nghe phát âm tiếng Trung và gõ lại chính xác chữ Hán.',
    icon: <Type className="w-5 h-5" />,
    cardClass: 'bg-teal-50/90 border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-teal-950',
    iconWrapClass: 'bg-teal-100 text-teal-700',
  },
  {
    mode: 'PINYIN',
    title: 'Gõ pinyin',
    description: 'Nghe phát âm tiếng Trung và gõ phiên âm Pinyin chuẩn thanh điệu.',
    icon: <Keyboard className="w-5 h-5" />,
    cardClass: 'bg-amber-50/90 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-950',
    iconWrapClass: 'bg-amber-100 text-amber-700',
  },
]

export const DictationModeDrawer: React.FC<DictationModeDrawerProps> = ({
  open,
  onClose,
  readyWordCount,
  onSelectMode,
}) => {
  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      ariaLabel="Chọn chế độ Nghe viết"
      title="Chọn chế độ Nghe viết"
      headerIcon={
        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
      }
      subtitle={
        <>
          Bộ lọc hiện tại có <span className="font-bold text-emerald-700">{readyWordCount} từ sẵn sàng</span>
        </>
      }
      footer={
        <p className="text-[11px] text-slate-500">
          Tự động phát <strong>1 lần</strong> khi mở câu, bấm <strong>Ctrl + X</strong> để nghe lại không giới hạn. Thưởng <strong>+3 XP/câu đúng</strong> &amp; <strong>+15 XP</strong> hoàn thành.
        </p>
      }
    >
      <div className="space-y-3">
        {DICTATION_MODE_OPTIONS.map((item) => (
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

