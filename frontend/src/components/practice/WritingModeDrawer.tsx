import React from 'react'
import { PenTool, EyeOff, FileText, ChevronRight } from 'lucide-react'
import { type WritingMode } from '../../api/vocabPractice'
import { SlideOverDrawer } from './SlideOverDrawer'

interface WritingModeDrawerProps {
  open: boolean
  onClose: () => void
  readyWordCount: number
  onSelectMode: (mode: WritingMode) => void
}

interface WritingOptionItem {
  mode: WritingMode
  title: string
  badge?: string
  description: string
  icon: React.ReactNode
  cardClass: string
  iconWrapClass: string
}

const WRITING_MODE_OPTIONS: WritingOptionItem[] = [
  {
    mode: 'TRACE',
    title: 'Đồ nét',
    description: 'Xem thứ tự nét chuẩn theo ô Mễ tự cách rồi đồ theo từng nét.',
    icon: <PenTool className="w-5 h-5" />,
    cardClass: 'bg-teal-50/90 border-teal-200 hover:border-teal-400 hover:bg-teal-50 text-teal-950',
    iconWrapClass: 'bg-teal-100 text-teal-600',
  },
  {
    mode: 'RECALL',
    title: 'Viết nhớ',
    description: 'Ô viết trống để tự viết từ trí nhớ, cần thiết mới xem đáp án.',
    icon: <EyeOff className="w-5 h-5" />,
    cardClass: 'bg-violet-50/90 border-violet-200 hover:border-violet-400 hover:bg-violet-50 text-violet-950',
    iconWrapClass: 'bg-violet-100 text-violet-600',
  },
  {
    mode: 'PDF',
    title: 'Tạo file Luyện viết',
    badge: 'PDF',
    description: 'Chọn tối đa 100 từ để tạo phiếu luyện viết A4 (Chữ viết tay / Chữ in) và in trực tiếp.',
    icon: <FileText className="w-5 h-5" />,
    cardClass: 'bg-amber-50/90 border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-950',
    iconWrapClass: 'bg-amber-100 text-amber-600',
  },
]

export const WritingModeDrawer: React.FC<WritingModeDrawerProps> = ({
  open,
  onClose,
  readyWordCount,
  onSelectMode,
}) => {
  return (
    <SlideOverDrawer
      open={open}
      onClose={onClose}
      ariaLabel="Chọn chế độ Viết chữ"
      title="Chọn chế độ Viết chữ"
      headerIcon={
        <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
          <PenTool className="w-5 h-5" />
        </div>
      }
      subtitle={
        <>
          Bộ lọc hiện tại có <span className="font-bold text-emerald-700">{readyWordCount} từ sẵn sàng</span>
        </>
      }
      footer={
        <p className="text-[11px] text-slate-500">
          Chế độ <strong>Đồ nét</strong> &amp; <strong>Viết nhớ</strong> cộng <strong>+2 XP/từ</strong> đạt và thưởng hoàn thành; <strong>Tạo file PDF</strong> hỗ trợ xuất tối đa 100 từ chuẩn khổ A4.
        </p>
      }
    >
      <div className="space-y-3">
        {WRITING_MODE_OPTIONS.map((item) => {
          const disabled = readyWordCount === 0 && item.mode !== 'PDF'
          return (
            <button
              key={item.mode}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMode(item.mode)}
              className={`w-full text-left p-4 rounded-2xl border transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 group ${item.cardClass}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconWrapClass}`}>
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold tracking-tight">{item.title}</span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-white tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs opacity-80 leading-relaxed mt-0.5">{item.description}</div>
              </div>

              <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 group-hover:opacity-90 transition-all shrink-0" />
            </button>
          )
        })}
      </div>
    </SlideOverDrawer>
  )
}
