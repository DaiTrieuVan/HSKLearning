import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Volume2,
  RotateCcw,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Flame,
  Check,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getFlashcards,
  reviewFlashcard,
  type FlashcardItem,
} from '../../api/flashcard'
import { PracticeFilterNoticeBanner } from '../../components/practice/PracticeFilterNoticeBanner'
import {
  buildUpdatedFilterSearchParams,
  fetchPracticeItemsWithFallback,
  normalizePracticeFilterStatus,
  type PracticeFilterStatus,
} from '../../utils/practiceFilter'

export const VocabFlashcardPracticePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const vocabSetIdParam = searchParams.get('vocabSetId')
  const filterStatusParam = normalizePracticeFilterStatus(searchParams.get('filterStatus'))
  const orderParam = (searchParams.get('order') as 'RANDOM' | 'DEFAULT') || 'RANDOM'
  const limitParam = searchParams.get('limit')

  const [cards, setCards] = useState<FlashcardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoFilterNotice, setAutoFilterNotice] = useState<string | null>(null)
  const skipNextFilterReloadRef = useRef<PracticeFilterStatus | null>(null)

  // Session state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [flipMode, setFlipMode] = useState<'HANZI_TO_MEANING' | 'MEANING_TO_HANZI'>('HANZI_TO_MEANING')
  const [submitting, setSubmitting] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  // Tracking in current session
  const [rememberedIds, setRememberedIds] = useState<Set<number>>(new Set())
  const [forgottenIds, setForgottenIds] = useState<Set<number>>(new Set())
  const [earnedXp, setEarnedXp] = useState(0)

  // 1. Load Flashcards (auto-fallback UNMASTERED -> ALL when all cards are already mastered)
  const loadCards = useCallback(
    async (overrideFilter?: PracticeFilterStatus) => {
      if (!user) return
      const targetFilter = typeof overrideFilter === 'string' ? overrideFilter : filterStatusParam
      try {
        setLoading(true)
        setError(null)
        const parsedSetId =
          vocabSetIdParam && !isNaN(Number(vocabSetIdParam)) ? parseInt(vocabSetIdParam, 10) : undefined
        const parsedLimit =
          limitParam && limitParam !== 'all' && !isNaN(Number(limitParam)) ? parseInt(limitParam, 10) : undefined

        const result = await fetchPracticeItemsWithFallback(
          targetFilter,
          (fs) =>
            getFlashcards(user.token, {
              vocabSetId: parsedSetId,
              filterStatus: fs,
              order: orderParam,
              limit: parsedLimit,
            }),
          (items) => items.length === 0
        )

        if (result.switchedFromUnmasteredToAll) {
          setAutoFilterNotice('Đã thuộc hết từ chưa học — đang ôn tập với Tất cả từ.')
        } else {
          setAutoFilterNotice(null)
        }

        if (result.resolvedFilter !== filterStatusParam) {
          skipNextFilterReloadRef.current = result.resolvedFilter
          setSearchParams(buildUpdatedFilterSearchParams(searchParams, result.resolvedFilter), {
            replace: true,
          })
        }

        setCards(result.data)
        setCurrentIndex(0)
        setIsFlipped(false)
        setRememberedIds(new Set())
        setForgottenIds(new Set())
        setEarnedXp(0)
        setSessionCompleted(false)
      } catch (err: any) {
        setError(err?.message || 'Không thể tải danh sách thẻ từ vựng')
      } finally {
        setLoading(false)
      }
    },
    [user, vocabSetIdParam, filterStatusParam, orderParam, limitParam, searchParams, setSearchParams]
  )

  useEffect(() => {
    if (skipNextFilterReloadRef.current === filterStatusParam) {
      skipNextFilterReloadRef.current = null
      return
    }
    void loadCards()
  }, [loadCards, filterStatusParam])

  // Current Card
  const currentCard = useMemo(() => {
    if (cards.length === 0 || currentIndex >= cards.length) return null
    return cards[currentIndex]
  }, [cards, currentIndex])

  // Audio pronunciation
  const speakText = useCallback((text?: string) => {
    if (!text) return
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  // Auto-speak when flipping to back (if hanzi is revealed)
  const handleFlipCard = useCallback(() => {
    setIsFlipped((prev) => {
      const next = !prev
      if (next && currentCard?.hanzi) {
        speakText(currentCard.hanzi)
      }
      return next
    })
  }, [currentCard, speakText])

  // Review handler (Thuộc / Quên)
  const handleReview = useCallback(
    async (result: 'REMEMBERED' | 'FORGOTTEN') => {
      if (!user || !currentCard || submitting) return

      try {
        setSubmitting(true)
        await reviewFlashcard(user.token, {
          vocabularyId: currentCard.id,
          result,
        })

        if (result === 'REMEMBERED') {
          setRememberedIds((prev) => new Set(prev).add(currentCard.id))
          setEarnedXp((prev) => prev + 5)
        } else {
          setForgottenIds((prev) => new Set(prev).add(currentCard.id))
        }

        // Chuyển sang thẻ tiếp theo
        setIsFlipped(false)
        if (currentIndex + 1 < cards.length) {
          setCurrentIndex((prev) => prev + 1)
        } else {
          setSessionCompleted(true)
        }
      } catch (err: any) {
        console.error('Failed to submit review:', err)
      } finally {
        setSubmitting(false)
      }
    },
    [user, currentCard, submitting, currentIndex, cards.length]
  )

  // Previous card
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  // Next card (skip without score change)
  const handleNext = useCallback(() => {
    if (currentIndex + 1 < cards.length) {
      setIsFlipped(false)
      setCurrentIndex((prev) => prev + 1)
    } else {
      setSessionCompleted(true)
    }
  }, [currentIndex, cards.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focusing an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return
      }

      if (sessionCompleted || loading || !currentCard) return

      switch (e.code) {
        case 'Space':
        case 'Enter':
          e.preventDefault()
          handleFlipCard()
          break
        case 'KeyS':
          e.preventDefault()
          speakText(currentCard.hanzi)
          break
        case 'Digit1':
        case 'KeyX':
          e.preventDefault()
          handleReview('FORGOTTEN')
          break
        case 'Digit2':
        case 'KeyC':
          e.preventDefault()
          handleReview('REMEMBERED')
          break
        case 'ArrowLeft':
          e.preventDefault()
          handlePrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          handleNext()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [sessionCompleted, loading, currentCard, handleFlipCard, handleReview, handlePrev, handleNext, speakText])

  // Relearn forgotten cards
  const handleRelearnForgotten = () => {
    const forgottenCards = cards.filter((c) => forgottenIds.has(c.id))
    if (forgottenCards.length > 0) {
      setCards(forgottenCards)
      setCurrentIndex(0)
      setIsFlipped(false)
      setRememberedIds(new Set())
      setForgottenIds(new Set())
      setSessionCompleted(false)
    }
  }

  // Progress percentage
  const progressPercent = cards.length > 0 ? Math.round(((currentIndex + 1) / cards.length) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-bold text-slate-600">Đang chuẩn bị bộ thẻ Flashcard...</p>
      </div>
    )
  }

  if (error || cards.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {error ? 'Không thể tải thẻ từ vựng' : 'Không có từ vựng phù hợp'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {error || 'Bộ từ này không có từ vựng nào khớp với bộ lọc bạn đã chọn (ví dụ: tất cả từ đã thuộc).'}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {!error && filterStatusParam !== 'ALL' && (
              <button
                type="button"
                onClick={() => void loadCards('ALL')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
              >
                Ôn tập với Tất cả từ
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${
                !error && filterStatusParam !== 'ALL'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              Quay lại Trung tâm Luyện tập
            </button>
            <button
              type="button"
              onClick={() => void loadCards()}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Thử tải lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Session Completed Screen
  if (sessionCompleted) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-2 sm:p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 text-center shadow-lg shadow-slate-200/50">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-5 shadow-sm">
            <Award className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Hoàn thành Lượt Luyện!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Bạn vừa hoàn thành ôn luyện xong {cards.length} thẻ từ vựng.
          </p>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
              <div className="text-xs font-bold text-emerald-600">Đã thuộc</div>
              <div className="text-xl font-extrabold text-emerald-700 mt-0.5">
                {rememberedIds.size}
              </div>
            </div>

            <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
              <div className="text-xs font-bold text-rose-600">Chưa thuộc</div>
              <div className="text-xl font-extrabold text-rose-700 mt-0.5">
                {forgottenIds.size}
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl">
              <div className="text-xs font-bold text-amber-600">XP nhận được</div>
              <div className="text-xl font-extrabold text-amber-700 mt-0.5">
                +{earnedXp}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {forgottenIds.size > 0 && (
              <button
                type="button"
                onClick={handleRelearnForgotten}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ôn lại {forgottenIds.size} từ chưa thuộc</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => void loadCards()}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Luyện lại toàn bộ danh sách
            </button>

            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
            >
              Quay lại Trung tâm Luyện tập
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto pb-8 sm:pb-12 space-y-4">
      {autoFilterNotice && (
        <PracticeFilterNoticeBanner
          message={autoFilterNotice}
          tone="emerald"
          onDismiss={() => setAutoFilterNotice(null)}
        />
      )}
      {/* 1. Top Control Card (Gọn gàng trên Mobile/Tablet/Desktop, không chồng sticky header) */}
      <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm flex flex-wrap items-center justify-between gap-2.5">
        {/* Back & Exit */}
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-bold text-xs sm:text-sm px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Thoát</span>
        </button>

        {/* Progress & Card Count */}
        <div className="flex-1 min-w-[110px] max-w-xs flex flex-col items-center order-3 basis-full sm:order-none sm:basis-auto">
          <div className="flex items-center justify-between w-full text-[11px] sm:text-xs font-bold text-slate-500 mb-1">
            <span>Tiến độ</span>
            <span className="text-emerald-700">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Right Toolbar: XP Pill, Flip Direction Toggle & Reset */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* XP Pill */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-extrabold shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>+{earnedXp} XP</span>
          </div>

          {/* Flip Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setFlipMode((prev) => (prev === 'HANZI_TO_MEANING' ? 'MEANING_TO_HANZI' : 'HANZI_TO_MEANING'))
              setIsFlipped(false)
            }}
            title="Đổi chiều lật thẻ"
            className="text-[11px] sm:text-xs font-bold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap"
          >
            {flipMode === 'HANZI_TO_MEANING' ? 'Từ → Nghĩa' : 'Nghĩa → Từ'}
          </button>

          {/* Reset Session */}
          <button
            type="button"
            onClick={() => void loadCards()}
            title="Chơi lại từ đầu"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main 3D Flip Card Container (CSS Grid overlay giúp card tự giãn vừa nội dung trên mobile/tablet không bao giờ tràn chữ) */}
      <div className="max-w-2xl w-full mx-auto flex flex-col justify-center items-center pt-1 sm:pt-3">
        {currentCard && (
          <div
            onClick={handleFlipCard}
            style={{ perspective: '1000px' }}
            className="w-full cursor-pointer select-none group"
          >
            <div
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              className="relative w-full min-h-[290px] sm:min-h-[360px] md:min-h-[390px] grid grid-cols-1 rounded-3xl bg-white border border-slate-200 shadow-md group-hover:shadow-xl transition-shadow"
            >
              {/* === MẶT TRƯỚC (FRONT FACE) === */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
                className={`col-start-1 row-start-1 p-5 sm:p-8 md:p-10 flex flex-col justify-between items-center text-center ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Top Badge: Part of speech */}
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {currentCard.partOfSpeech || 'TỪ VỰNG'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText(currentCard.hanzi)
                    }}
                    className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors shadow-sm shrink-0"
                    title="Phát âm (phím S)"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Center Content */}
                <div className="my-auto py-4 sm:py-6 w-full px-1">
                  {flipMode === 'HANZI_TO_MEANING' ? (
                    <div>
                      <h2
                        className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-wide mb-2 break-words"
                        style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                      >
                        {currentCard.hanzi}
                      </h2>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2 break-words">
                        {currentCard.meaning}
                      </h2>
                    </div>
                  )}
                </div>

                {/* Bottom Prompt Hint */}
                <div className="text-[11px] sm:text-xs font-semibold text-slate-400 flex items-center gap-2">
                  <span className="hidden md:inline">Nhấn Space hoặc chạm vào thẻ để lật xem đáp án</span>
                  <span className="md:hidden">Chạm vào thẻ để lật xem đáp án</span>
                </div>
              </div>

              {/* === MẶT SAU (BACK FACE) === */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
                className={`col-start-1 row-start-1 p-5 sm:p-8 md:p-10 flex flex-col justify-between items-center text-center bg-white rounded-3xl ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Top Details */}
                <div className="w-full flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {currentCard.partOfSpeech || 'TỪ VỰNG'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      speakText(currentCard.hanzi)
                    }}
                    className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors shadow-sm shrink-0"
                    title="Phát âm (phím S)"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Center Details */}
                <div className="my-auto py-3 sm:py-4 w-full px-1">
                  <div
                    className="text-3xl sm:text-5xl font-extrabold text-slate-900 mb-1 break-words"
                    style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                  >
                    {currentCard.hanzi}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-emerald-600 mb-2 sm:mb-3 tracking-wide">
                    {currentCard.pinyin}
                  </div>
                  <div className="text-lg sm:text-2xl font-extrabold text-slate-800 leading-snug break-words">
                    {currentCard.meaning}
                  </div>

                  {/* Example Sentence */}
                  {currentCard.exampleSentence && (
                    <div className="mt-4 sm:mt-5 p-3 sm:p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-left max-w-lg mx-auto">
                      <div className="text-xs sm:text-sm font-semibold text-slate-800 break-words">
                        {currentCard.exampleSentence}
                      </div>
                      {currentCard.examplePinyin && (
                        <div className="text-[11px] sm:text-xs text-emerald-600 font-medium mt-0.5 break-words">
                          {currentCard.examplePinyin}
                        </div>
                      )}
                      {currentCard.exampleMeaning && (
                        <div className="text-[11px] sm:text-xs text-slate-500 mt-1 break-words">
                          {currentCard.exampleMeaning}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Prompt Hint */}
                <div className="text-[11px] sm:text-xs font-semibold text-slate-400">
                  <span>Chạm vào thẻ để lật lại mặt trước</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Bottom Action Bar (Mobile: 2 hàng tối ưu ngón tay cái | Tablet/Desktop: 1 hàng ngang) */}
        <div className="w-full mt-4 sm:mt-6 bg-white p-2.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-6 sm:flex sm:items-center sm:justify-between gap-2 sm:gap-3">
          {/* Nút Trước (ArrowLeft) */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitting}
            className="order-3 col-span-2 sm:order-none min-h-[42px] flex sm:flex-col items-center justify-center gap-1 sm:gap-0 px-2.5 sm:px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Lùi lại thẻ trước (Phím ←)"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-[11px] font-bold sm:mt-0.5">Trước</span>
            <span className="text-[9px] text-slate-400 font-medium hidden md:inline">Phím ←</span>
          </button>

          {/* Nút Loa phát âm (S) */}
          <button
            type="button"
            onClick={() => speakText(currentCard?.hanzi)}
            disabled={!currentCard || submitting}
            className="order-4 col-span-2 sm:order-none min-h-[42px] flex sm:flex-col items-center justify-center gap-1 sm:gap-0 px-2.5 sm:px-4 py-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:scale-95 transition-all shadow-xs"
            title="Phát âm (Phím S)"
          >
            <Volume2 className="w-5 h-5 text-emerald-600" />
            <span className="text-[11px] font-bold sm:mt-0.5">Phát âm</span>
            <span className="text-[9px] text-emerald-600/70 font-medium hidden md:inline">Phím S</span>
          </button>

          {/* Nút Quên (1 / X) */}
          <button
            type="button"
            onClick={() => handleReview('FORGOTTEN')}
            disabled={submitting}
            className="order-1 col-span-3 sm:order-none sm:flex-1 sm:max-w-[140px] min-h-[48px] flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 active:scale-95 disabled:opacity-50 transition-all"
            title="Đánh dấu Quên (Phím 1 hoặc X)"
          >
            <div className="flex items-center gap-1.5 font-extrabold text-sm">
              <X className="w-4 h-4 text-rose-500" />
              <span>Quên</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium mt-0.5 hidden md:inline">
              Phím 1 / X
            </span>
          </button>

          {/* Nút Thuộc (2 / C) */}
          <button
            type="button"
            onClick={() => handleReview('REMEMBERED')}
            disabled={submitting}
            className="order-2 col-span-3 sm:order-none sm:flex-1 sm:max-w-[140px] min-h-[48px] flex flex-col items-center justify-center py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 disabled:opacity-50 shadow-md shadow-emerald-600/20 transition-all"
            title="Đánh dấu Đã thuộc (Phím 2 hoặc C)"
          >
            <div className="flex items-center gap-1.5 font-extrabold text-sm">
              <Check className="w-4 h-4 text-white" />
              <span>Thuộc</span>
            </div>
            <span className="text-[10px] text-emerald-100 font-medium mt-0.5 hidden md:inline">
              Phím 2 / C
            </span>
          </button>

          {/* Nút Tiếp (ArrowRight) */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex + 1 >= cards.length || submitting}
            className="order-5 col-span-2 sm:order-none min-h-[42px] flex sm:flex-col items-center justify-center gap-1 sm:gap-0 px-2.5 sm:px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Chuyển thẻ tiếp theo (Phím →)"
          >
            <span className="text-[11px] font-bold sm:order-2 sm:mt-0.5">Tiếp</span>
            <ChevronRight className="w-5 h-5 sm:order-1" />
            <span className="text-[9px] text-slate-400 font-medium hidden md:inline sm:order-3">Phím →</span>
          </button>
        </div>
      </div>
    </div>
  )
}
