import React from 'react'
import { Languages, Type, ChevronRight, LayoutGrid } from 'lucide-react'
import { type MatchMode } from '../../api/vocabPractice'
import { SlideOverDrawer } from './SlideOverDrawer'

interface MatchModeDrawerProps {
  open: boolean
  onClose: () => void
  readyWordCount: number
  onSelectMode: (mode: MatchMode) => void
}

interface MatchOptionItem {
  mode: MatchMode
  title: string
  description: string
  icon: React.ReactNode
  cardClass: string
  iconWrapClass: string
}

const MATCH_MODE_OPTIONS: MatchOptionItem[] = [
  {
    mode: 'MATCH_MEANING',
    title: 'Nối với nghĩa',
    description: 'Ghép từ tiếng Trung với nghĩa tiếng Việt tương ứng (có tùy chọn ẩn/hiện pinyin).',
    icon: <Languages className="w-5 h-5" />,
    cardClass: 'bg-sky-50/85 border-sky-200 hover:border-sky-400 hover:bg-sky-50 text-sky-950',
    iconWrapClass: 'bg-sky-100 text-sky-600',
  },
  {
    mode: 'MATCH_PINYIN',
    title: 'Nối với pinyin',
    description: 'Ghép chữ Hán với phiên âm Pinyin chuẩn (ẩn phiên âm gợi ý để thử thách trí nhớ).',
    icon: <Type className="w-5 h-5" />,
    cardClass: 'bg-amber-50/85 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-950',
    iconWrapClass: 'bg-amber-100 text-amber-600',
  },
]

export const MatchModeDrawer: React.FC<MatchModeDrawerProps> = ({
  open,
  onClose,
  readyWordCount,
  onSelectMode,
}) => {
  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      ariaLabel="Chọn chế độ Nối từ"
      title="Chọn chế độ Nối từ"
      headerIcon={
        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          <LayoutGrid className="w-5 h-5" />
        </div>
      }
      subtitle={
        <>
          Bộ lọc hiện tại có <span className="font-bold text-emerald-700">{readyWordCount} từ sẵn sàng</span>
        </>
      }
      footer={
        <p className="text-[11px] text-slate-500">
          Mỗi bảng tối đa <strong>8 cặp từ</strong>, tự động chia nhiều lượt nếu bạn chọn nhiều từ và có <strong>5 trái tim</strong> cho toàn ván.
        </p>
      }
    >
      <div className="space-y-3">
        {MATCH_MODE_OPTIONS.map((item) => (
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
