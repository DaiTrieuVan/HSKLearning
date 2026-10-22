import React, { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Calendar,
  BrainCircuit,
  Info
} from 'lucide-react'
import {
  type SrsCardItem,
  type SrsSummary,
  getSrsDueCards,
  getSrsSummary,
  submitSrsReview
} from '../../api/srs'

interface SrsFlashcardViewProps {
  token: string
  onBack: () => void
}

export const SrsFlashcardView: React.FC<SrsFlashcardViewProps> = ({ token, onBack }) => {
  const [cards, setCards] = useState<SrsCardItem[]>([])
  const [summary, setSummary] = useState<SrsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [dueCards, sum] = await Promise.all([
        getSrsDueCards(token),
        getSrsSummary(token)
      ])
      setCards(dueCards)
      setSummary(sum)
      setCurrentIndex(0)
      setIsFlipped(false)
      setSessionReviewedCount(0)
      setSessionCompleted(dueCards.length === 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu ôn tập')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  const handleReview = useCallback(
    async (result: 'REMEMBERED' | 'FORGOTTEN') => {
      if (cards.length === 0 || currentIndex >= cards.length || submitting) return

      const currentCard = cards[currentIndex]
      try {
        setSubmitting(true)
        await submitSrsReview(token, {
          vocabularyId: currentCard.vocabularyId,
          result
        })

        setSessionReviewedCount((prev) => prev + 1)
        setIsFlipped(false)

        if (currentIndex + 1 < cards.length) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          // Hoàn thành phiên, reload summary
          const updatedSummary = await getSrsSummary(token).catch(() => null)
          if (updatedSummary) setSummary(updatedSummary)
          setSessionCompleted(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi lưu kết quả ôn tập')
      } finally {
        setSubmitting(false)
      }
    },
    [cards, currentIndex, submitting, token]
  )

  // Xử lý phím tắt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionCompleted || loading || cards.length === 0) return

      if (e.code === 'Space') {
        e.preventDefault()
        setIsFlipped((prev) => !prev)
      } else if (e.key === '1' || e.key === 'ArrowLeft') {
        e.preventDefault()
        handleReview('FORGOTTEN')
      } else if (e.key === '2' || e.key === 'ArrowRight') {
        e.preventDefault()
        handleReview('REMEMBERED')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleReview, sessionCompleted, loading, cards.length])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] p-8 text-slate-500">
        <BrainCircuit className="w-12 h-12 text-emerald-500 animate-pulse mb-4" />
        <p className="text-base font-medium">Đang tải lịch ôn tập ngắt quãng (SRS)...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center max-w-xl mx-auto my-8">
        <p className="text-rose-700 font-medium mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
        >
          Thử lại
        </button>
      </div>
    )
  }

  // Màn hình kết thúc / Không còn từ cần ôn
  if (sessionCompleted || cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại tổng quan
        </button>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-sm text-center">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            {sessionReviewedCount > 0
              ? 'Hoàn thành phiên ôn tập hôm nay!'
              : 'Hôm nay không có từ nào cần ôn!'}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8">
            {sessionReviewedCount > 0
              ? `Bạn đã hoàn thành ôn luyện ${sessionReviewedCount} thẻ từ vựng theo thuật toán ngắt quãng SM-2. Trí nhớ của bạn đang ngày càng vững vàng!`
              : 'Toàn bộ từ vựng đã được ôn tập đúng hạn. Hãy tiếp tục học bài mới hoặc quay lại vào ngày mai theo lịch SRS nhé.'}
          </p>

          {summary && (
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 text-left">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-xs font-medium text-slate-500 block mb-1">Cần ôn hôm nay</span>
                <span className="text-2xl font-bold text-slate-800">{summary.dueTodayCount}</span>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <span className="text-xs font-medium text-emerald-700 block mb-1">Đã thuộc vững</span>
                <span className="text-2xl font-bold text-emerald-800">{summary.masteredCount}</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                <span className="text-xs font-medium text-amber-700 block mb-1">Đang rèn luyện</span>
                <span className="text-2xl font-bold text-amber-800">{summary.learningCount}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition shadow-sm hover:shadow"
            >
              Quay lại không gian học
            </button>
            <button
              onClick={loadData}
              className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-semibold hover:bg-slate-200 transition"
            >
              Kiểm tra lại lịch
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  const progressPercent = Math.round(((currentIndex) / cards.length) * 100)

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Thoát phiên ôn tập
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            Lặp lại ngắt quãng (SM-2)
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            Tiến độ: {currentIndex + 1} / {cards.length} thẻ
          </span>
          <span className="text-emerald-700 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* SRS Meta Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Cấp độ nhớ: <strong className="text-slate-700">{currentCard.repetitionLevel}</strong>
          {currentCard.repetitionLevel >= 3 && (
            <span className="text-emerald-600 font-medium ml-1">(Đã thuộc)</span>
          )}
        </span>
        <span>
          Chu kỳ ôn tập: <strong className="text-slate-700">{currentCard.intervalDays} ngày</strong>
        </span>
      </div>

      {/* Flashcard Area (Click to flip) */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative cursor-pointer min-h-[340px] sm:min-h-[380px] bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between select-none group"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            {isFlipped ? 'Mặt sau • Nghĩa & Ví dụ' : 'Mặt trước • Từ vựng'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              speakText(currentCard.hanzi)
            }}
            className="p-2.5 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 transition"
            title="Nghe phát âm chuẩn"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        {!isFlipped ? (
          <div className="my-auto text-center py-6">
            <h1 className="text-5xl sm:text-6xl font-bold font-serif text-slate-900 tracking-wide mb-3">
              {currentCard.hanzi}
            </h1>
            <p className="text-2xl font-medium text-emerald-600 tracking-wide mb-1">
              {currentCard.pinyin}
            </p>
            {currentCard.partOfSpeech && (
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-md">
                {currentCard.partOfSpeech}
              </span>
            )}
          </div>
        ) : (
          <div className="my-auto text-center py-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {currentCard.meaning}
            </h2>
            <p className="text-lg font-medium text-emerald-600 mb-4">
              {currentCard.hanzi} • {currentCard.pinyin}
            </p>

            {currentCard.exampleSentence && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                <p className="text-base font-medium text-slate-800 mb-1">
                  {currentCard.exampleSentence}
                </p>
                {currentCard.examplePinyin && (
                  <p className="text-xs text-emerald-600 font-mono mb-1">
                    {currentCard.examplePinyin}
                  </p>
                )}
                {currentCard.exampleMeaning && (
                  <p className="text-xs text-slate-600 italic">
                    {currentCard.exampleMeaning}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Footer Hint */}
        <div className="text-center pt-4 border-t border-slate-100 text-xs text-slate-400 group-hover:text-slate-600 transition">
          Nhấn vào thẻ hoặc phím <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border text-slate-600">Space</kbd> để {isFlipped ? 'xem mặt trước' : 'lật xem nghĩa'}
        </div>
      </div>

      {/* Review Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          type="button"
          disabled={submitting}
          onClick={() => handleReview('FORGOTTEN')}
          className="flex flex-col items-center justify-center gap-1 py-4 px-6 bg-white border border-rose-200 text-rose-600 rounded-2xl hover:bg-rose-50/80 active:scale-95 transition disabled:opacity-50 shadow-sm"
        >
          <div className="flex items-center gap-2 font-bold text-base">
            <RotateCcw className="w-5 h-5 text-rose-500" />
            Chưa nhớ (Quên)
          </div>
          <span className="text-xs text-rose-400">
            Lịch ôn: Ngày mai • Phím <kbd className="px-1 py-0.2 bg-rose-100 rounded text-rose-600">1</kbd>
          </span>
        </button>

        <button
          type="button"
          disabled={submitting}
          onClick={() => handleReview('REMEMBERED')}
          className="flex flex-col items-center justify-center gap-1 py-4 px-6 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 active:scale-95 transition disabled:opacity-50 shadow-sm hover:shadow"
        >
          <div className="flex items-center gap-2 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
            Đã nhớ
          </div>
          <span className="text-xs text-emerald-100">
            Tăng chu kỳ ngắt quãng • Phím <kbd className="px-1 py-0.2 bg-emerald-700/60 rounded text-white">2</kbd>
          </span>
        </button>
      </div>

      {/* Information Tip */}
      <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Thuật toán SuperMemo SM-2 tự động tính toán thời điểm vàng trước khi bạn chuẩn bị quên từ để nhắc ôn lại, giúp khắc sâu từ vựng vào trí nhớ dài hạn.
        </span>
      </div>
    </div>
  )
}
