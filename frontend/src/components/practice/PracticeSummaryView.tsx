import React from 'react'
import {
  CheckCircle2,
  XCircle,
  Volume2,
  Coins,
  Save,
  RotateCcw,
  Target,
  Check,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { speakChinese } from '../../utils/vocabFormat'

export interface PracticeSummaryWordItem {
  vocabularyId: number
  hanzi: string
  pinyin?: string | null
  meaning: string
  audioUrl?: string | null
  note?: string | null
}

interface PracticeSummaryViewProps {
  title: string
  subtitle: string
  correctItems: PracticeSummaryWordItem[]
  wrongItems: PracticeSummaryWordItem[]
  selectedMasteredIds: Set<number>
  onToggleMasteredId: (vocabId: number) => void
  onToggleSelectAllMastered: () => void
  estimatedBaseXp: number
  estimatedBonusXp: number
  savedXp: number | null
  saving: boolean
  saved: boolean
  endReasonNote?: string | null
  itemUnitLabel?: string
  xpFormulaText?: string
  onSaveAndFinish: () => void
  onRetryWrong?: () => void
  onReplayAll: () => void
  onBackToHub: () => void
}

export const PracticeSummaryView: React.FC<PracticeSummaryViewProps> = ({
  title,
  subtitle,
  correctItems,
  wrongItems,
  selectedMasteredIds,
  onToggleMasteredId,
  onToggleSelectAllMastered,
  estimatedBaseXp,
  estimatedBonusXp,
  savedXp,
  saving,
  saved,
  endReasonNote,
  itemUnitLabel = 'cặp',
  xpFormulaText,
  onSaveAndFinish,
  onRetryWrong,
  onReplayAll,
  onBackToHub,
}) => {
  const totalCount = correctItems.length + wrongItems.length
  const accuracyPercent = totalCount > 0 ? Math.round((correctItems.length * 100) / totalCount) : 0
  const estimatedTotalXp = estimatedBaseXp + estimatedBonusXp
  const displayedXp = savedXp !== null ? savedXp : estimatedTotalXp

  const allSelected =
    correctItems.length > 0 && correctItems.every((item) => selectedMasteredIds.has(item.vocabularyId))

  const ringColor =
    accuracyPercent >= 80 ? '#10b981' : accuracyPercent >= 50 ? '#f59e0b' : '#f43f5e'
  const ringTrack = '#e2e8f0'
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (accuracyPercent / 100) * circumference

  const headline =
    accuracyPercent >= 85 ? 'Xuất sắc!' : accuracyPercent >= 50 ? 'Làm tốt lắm!' : 'Cố gắng hơn nhé!'

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-4">
      {/* 1. Header Score Banner (Theo thiết kế ảnh mẫu, đồng bộ Light Theme & SVG Icons) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Circular % Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 68 68">
              <circle
                cx="34"
                cy="34"
                r={radius}
                fill="none"
                stroke={ringTrack}
                strokeWidth="6"
              />
              <circle
                cx="34"
                cy="34"
                r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-sm font-extrabold text-slate-800">{accuracyPercent}%</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">{headline}</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {title} • {subtitle}
              </span>
            </div>

            {endReasonNote && (
              <p className="text-xs font-semibold text-rose-600 mt-0.5">{endReasonNote}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold mt-1.5">
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {correctItems.length} đúng
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600">
                <XCircle className="w-3.5 h-3.5" />
                {wrongItems.length} sai
              </span>
              <span className="inline-flex items-center gap-1 text-sky-700">
                <Target className="w-3.5 h-3.5" />
                {totalCount} {itemUnitLabel}
              </span>
            </div>
          </div>
        </div>

        {/* XP / Coin Pill */}
        <div className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 self-start sm:self-center shrink-0">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 sm:hidden">
              {saved ? 'XP đã nhận' : 'Dự tính XP'}
            </span>
          </div>
          <div className="text-right">
            <div className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-amber-600">
              {saved ? 'XP đã nhận' : 'Dự tính XP'}
            </div>
            <div className="text-base font-extrabold leading-tight">+{displayedXp} XP</div>
          </div>
        </div>
      </div>

      {/* 2. Hai Bảng Chi Tiết Song Song: Trả lời đúng (kèm tick Đã thuộc) & Trả lời sai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cột Trái: Trả lời đúng */}
        <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 bg-emerald-50/90 border-b border-emerald-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-950">
                  Trả lời đúng ({correctItems.length})
                </h3>
                <p className="text-[11px] font-medium text-emerald-700">
                  Chọn từ đánh dấu &quot;Đã thuộc&quot;
                </p>
              </div>
            </div>

            {correctItems.length > 0 && (
              <button
                type="button"
                disabled={saved}
                onClick={onToggleSelectAllMastered}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold border transition-colors disabled:opacity-60 ${
                  allSelected
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Tất cả</span>
              </button>
            )}
          </div>

          <div className="flex-1 max-h-[260px] sm:max-h-[340px] overflow-y-auto divide-y divide-slate-100">
            {correctItems.length === 0 ? (
              <div className="py-10 px-4 text-center text-xs text-slate-400">
                Chưa có từ nào được ghép đúng hoàn toàn trong lượt này.
              </div>
            ) : (
              correctItems.map((item) => {
                const checked = selectedMasteredIds.has(item.vocabularyId)
                return (
                  <label
                    key={item.vocabularyId}
                    className={`px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3 cursor-pointer hover:bg-emerald-50/40 transition-colors ${
                      saved ? 'cursor-default' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <input
                        type="checkbox"
                        disabled={saved}
                        checked={checked}
                        onChange={() => onToggleMasteredId(item.vocabularyId)}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <span
                            className="text-base font-extrabold text-slate-900"
                            style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                          >
                            {item.hanzi}
                          </span>
                          {item.pinyin && (
                            <span className="text-[11px] font-mono text-slate-400 truncate">
                              {item.pinyin}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          speakChinese(item.hanzi, item.audioUrl)
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-100/70 transition-colors shrink-0"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-xs font-semibold text-slate-700 text-right line-clamp-2 max-w-[44%] leading-snug">
                      {item.meaning}
                    </span>
                  </label>
                )
              })
            )}
          </div>
        </div>

        {/* Cột Phải: Trả lời sai / Cần ôn lại */}
        <div className="bg-white border border-rose-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="px-4 py-3 bg-rose-50/90 border-b border-rose-200/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-rose-950">
                Trả lời sai ({wrongItems.length})
              </h3>
              <p className="text-[11px] font-medium text-rose-700">
                Cần ôn lại trong các lượt sau
              </p>
            </div>
          </div>

          <div className="flex-1 max-h-[260px] sm:max-h-[340px] overflow-y-auto divide-y divide-slate-100">
            {wrongItems.length === 0 ? (
              <div className="py-10 px-4 text-center text-xs font-semibold text-emerald-600 flex flex-col items-center gap-1.5">
                <Sparkles className="w-5 h-5" />
                <span>Tuyệt vời! Bạn không nhầm từ nào.</span>
              </div>
            ) : (
              wrongItems.map((item) => (
                <div
                  key={item.vocabularyId}
                  className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3 hover:bg-rose-50/35 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span
                          className="text-base font-extrabold text-rose-700"
                          style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                        >
                          {item.hanzi}
                        </span>
                        {item.pinyin && (
                          <span className="text-[11px] font-mono text-slate-400 truncate">
                            {item.pinyin}
                          </span>
                        )}
                      </div>
                      {item.note && (
                        <div className="text-[10px] font-semibold text-rose-500">{item.note}</div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => speakChinese(item.hanzi, item.audioUrl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-100/70 transition-colors shrink-0"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs font-semibold text-slate-700 text-right line-clamp-2 max-w-[44%] leading-snug">
                    {item.meaning}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Bảng Dự tính XP & Nút Hành Động */}
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>{saved ? 'XP đã cộng vào tài khoản' : 'Dự tính XP nhận được'}</span>
          </div>
          <p className="text-[11px] text-amber-800/80 mt-0.5">
            {xpFormulaText ??
              `Ghép đúng: +${estimatedBaseXp} XP (+2 XP/${itemUnitLabel}) • Thưởng hoàn thành trọn ván: +${estimatedBonusXp} XP`}
          </p>
        </div>
        <div className="text-xl font-extrabold text-amber-700">+{displayedXp} XP</div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
        {!saved ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onSaveAndFinish}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Đang lưu...' : 'Lưu & Hoàn thành'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={onReplayAll}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại</span>
            </button>
          </>
        ) : (
          <>
            {wrongItems.length > 0 && onRetryWrong && (
              <button
                type="button"
                onClick={onRetryWrong}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-sm active:scale-95 transition-all inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ôn lại {wrongItems.length} từ sai</span>
              </button>
            )}

            <button
              type="button"
              onClick={onReplayAll}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Chơi lại toàn bộ</span>
            </button>

            <button
              type="button"
              onClick={onBackToHub}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại Trung tâm Luyện tập</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

