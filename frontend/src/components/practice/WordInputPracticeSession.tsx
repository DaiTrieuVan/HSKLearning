import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowLeftRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Coins,
  Eye,
  EyeOff,
  Headphones,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Type,
  Volume2,
  XCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  generateDictationSession,
  generateTypingSession,
  submitDictationSession,
  submitTypingSession,
  type GenerateTypingParams,
  type TypingMode,
  type TypingSessionResponse,
  type TypingSubmitRequest,
  type TypingSubmitResponse,
  type TypingWordItemDto,
} from '../../api/vocabPractice'
import {
  loadPracticeSettings,
  type PracticeGameSettings,
} from '../../utils/practiceSettings'
import {
  playCoinSound,
  playCorrectSound,
  playTimeoutSound,
  playWrongSound,
} from '../../utils/gameSounds'
import { formatPartOfSpeechLabel, speakChinese } from '../../utils/vocabFormat'
import {
  buildProgressiveTypingHint,
  extractPrimaryMeaning,
  isHanziMatch,
  isMeaningMatch,
  isPinyinMatch,
  type TypingDirection,
} from '../../utils/typingAnswerMatcher'
import { GameSettingsDrawer } from './GameSettingsDrawer'
import { PracticeFilterNoticeBanner } from './PracticeFilterNoticeBanner'
import {
  PracticeSummaryView,
  type PracticeSummaryWordItem,
} from './PracticeSummaryView'
import {
  buildUpdatedFilterSearchParams,
  fetchPracticeItemsWithFallback,
  normalizePracticeFilterStatus,
  type PracticeFilterStatus,
} from '../../utils/practiceFilter'

export type WordInputVariant = 'TYPING' | 'DICTATION'

type GamePhase = 'PLAYING' | 'SUMMARY'
type AnswerStatus = 'CORRECT' | 'WRONG' | 'TIMEOUT'

interface WordInputAnsweredRecord {
  item: TypingWordItemDto
  direction: TypingDirection
  userAnswer: string
  correct: boolean
  status: AnswerStatus
  hintsUsed: number
}

interface VariantRuleConfig {
  xpPerCorrect: number
  xpBonus: number
  xpFormulaText: string
  loadingLabel: string
  loadErrorTitle: string
  fallbackLoadError: string
  fallbackSaveError: string
  emptyIcon: React.ReactNode
  summaryTitle: (mode: TypingMode) => string
  headerModeLabel: (mode: TypingMode) => string
  placeholder: (mode: TypingMode, direction: TypingDirection) => string
  fetchSession: (token: string, params: GenerateTypingParams) => Promise<TypingSessionResponse>
  submitSession: (token: string, payload: TypingSubmitRequest) => Promise<TypingSubmitResponse>
}

const MAX_HINTS_PER_QUESTION = 3
const COMPLETION_THRESHOLD_PERCENT = 50

const VARIANT_CONFIG: Record<WordInputVariant, VariantRuleConfig> = {
  TYPING: {
    xpPerCorrect: 2,
    xpBonus: 10,
    xpFormulaText:
      'Đúng: +2 XP/câu | Thưởng hoàn thành (≥ 50% đúng): +10 XP (dùng gợi ý không bị trừ XP)',
    loadingLabel: 'Đang chuẩn bị bài luyện gõ từ...',
    loadErrorTitle: 'Không thể tải bài luyện gõ từ',
    fallbackLoadError: 'Không thể tải danh sách từ luyện gõ',
    fallbackSaveError: 'Không thể lưu kết quả lượt gõ từ',
    emptyIcon: <Type className="w-10 h-10 text-emerald-500 mx-auto" />,
    summaryTitle: (mode) => `Tổng kết ${mode === 'PINYIN' ? 'Gõ pinyin' : 'Gõ từ'}`,
    headerModeLabel: (mode) => (mode === 'PINYIN' ? 'Gõ pinyin' : 'Gõ từ'),
    placeholder: (mode, direction) =>
      mode === 'PINYIN'
        ? 'Gõ pinyin (vd: nǐ hǎo hoặc ni3 hao3)...'
        : direction === 'HANZI_TO_MEANING'
          ? 'Gõ nghĩa tiếng Việt...'
          : 'Gõ từ tiếng Trung...',
    fetchSession: generateTypingSession,
    submitSession: submitTypingSession,
  },
  DICTATION: {
    xpPerCorrect: 3,
    xpBonus: 15,
    xpFormulaText:
      'Đúng: +3 XP/câu | Thưởng hoàn thành (≥ 50% đúng): +15 XP (dùng gợi ý không bị trừ XP)',
    loadingLabel: 'Đang chuẩn bị bài luyện nghe viết...',
    loadErrorTitle: 'Không thể tải bài luyện nghe viết',
    fallbackLoadError: 'Không thể tải danh sách từ luyện nghe viết',
    fallbackSaveError: 'Không thể lưu kết quả lượt nghe viết',
    emptyIcon: <Headphones className="w-10 h-10 text-blue-500 mx-auto" />,
    summaryTitle: (mode) =>
      `Tổng kết Nghe viết · ${mode === 'PINYIN' ? 'Gõ pinyin' : 'Gõ từ'}`,
    headerModeLabel: (mode) =>
      `Nghe viết · ${mode === 'PINYIN' ? 'Gõ pinyin' : 'Gõ từ'}`,
    placeholder: (mode) =>
      mode === 'PINYIN'
        ? 'Gõ pinyin bạn nghe được...'
        : 'Gõ từ tiếng Trung bạn nghe được...',
    fetchSession: generateDictationSession,
    submitSession: submitDictationSession,
  },
}

function createIdempotencyKey(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

interface WordInputPracticeSessionProps {
  variant: WordInputVariant
}

export const WordInputPracticeSession: React.FC<WordInputPracticeSessionProps> = ({
  variant,
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const cfg = VARIANT_CONFIG[variant]

  const vocabSetIdParam = searchParams.get('vocabSetId')
  const lessonIdParam = searchParams.get('lessonId')
  const filterStatusParam = normalizePracticeFilterStatus(searchParams.get('filterStatus'))
  const orderParam = (searchParams.get('order') as 'RANDOM' | 'DEFAULT') || 'RANDOM'
  const limitParam = searchParams.get('limit')
  const modeParam: TypingMode = searchParams.get('mode') === 'PINYIN' ? 'PINYIN' : 'WORD'

  const parsedSetId = useMemo(
    () =>
      vocabSetIdParam && !isNaN(Number(vocabSetIdParam))
        ? parseInt(vocabSetIdParam, 10)
        : undefined,
    [vocabSetIdParam]
  )
  const parsedLessonId = useMemo(
    () =>
      lessonIdParam && !isNaN(Number(lessonIdParam))
        ? parseInt(lessonIdParam, 10)
        : undefined,
    [lessonIdParam]
  )
  const parsedLimit = useMemo(
    () =>
      limitParam && limitParam !== 'all' && !isNaN(Number(limitParam))
        ? parseInt(limitParam, 10)
        : undefined,
    [limitParam]
  )

  const [settings, setSettings] = useState<PracticeGameSettings>(() => loadPracticeSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [vocabSetTitle, setVocabSetTitle] = useState('Tất cả bộ từ')
  const [items, setItems] = useState<TypingWordItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoFilterNotice, setAutoFilterNotice] = useState<string | null>(null)
  const skipNextFilterReloadRef = useRef<PracticeFilterStatus | null>(null)

  const [phase, setPhase] = useState<GamePhase>('PLAYING')
  const [sessionRunId, setSessionRunId] = useState(0)
  const [wordDirection, setWordDirection] = useState<TypingDirection>('MEANING_TO_HANZI')
  const [hidePinyin, setHidePinyin] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [listenCount, setListenCount] = useState(0)
  const [showExample, setShowExample] = useState(false)
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus | null>(null)
  const [answeredRecords, setAnsweredRecords] = useState<WordInputAnsweredRecord[]>([])

  const [timeLeft, setTimeLeft] = useState<number>(() => loadPracticeSettings().timePerQuestion)
  const [autoAdvancePaused, setAutoAdvancePaused] = useState(false)
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0)

  const [selectedMasteredIds, setSelectedMasteredIds] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedXp, setSavedXp] = useState<number | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [finalDurationSeconds, setFinalDurationSeconds] = useState(0)

  const inputRef = useRef<HTMLInputElement | null>(null)
  const isComposingRef = useRef(false)
  const startTimeRef = useRef<number>(0)
  const idempotencyKeyRef = useRef<string>('')
  const answerLockedRef = useRef(false)

  const currentItem = items[currentIndex] ?? null

  const resetSessionState = useCallback(
    (nextItems: TypingWordItemDto[]) => {
      setItems(nextItems)
      setPhase('PLAYING')
      setSessionRunId((id) => id + 1)
      setCurrentIndex(0)
      setUserInput('')
      setHintsUsed(0)
      setListenCount(0)
      setShowExample(false)
      setAnswerStatus(null)
      setAnsweredRecords([])
      setTimeLeft(settings.timePerQuestion)
      setAutoAdvancePaused(false)
      setAutoAdvanceCountdown(0)
      setSelectedMasteredIds(new Set())
      setSaving(false)
      setSaved(false)
      setSavedXp(null)
      setSaveError(null)
      setFinalDurationSeconds(0)
      answerLockedRef.current = false
      startTimeRef.current = Date.now()
      idempotencyKeyRef.current = createIdempotencyKey(variant.toLowerCase())
    },
    [settings.timePerQuestion, variant]
  )

  const loadSession = useCallback(
    async (overrideFilter?: PracticeFilterStatus) => {
      if (!user) return
      const targetFilter = typeof overrideFilter === 'string' ? overrideFilter : filterStatusParam
      try {
        setLoading(true)
        setError(null)
        const result = await fetchPracticeItemsWithFallback<TypingSessionResponse>(
          targetFilter,
          (fs) =>
            cfg.fetchSession(user.token, {
              lessonId: parsedLessonId,
              vocabSetId: parsedSetId,
              filterStatus: fs,
              order: orderParam,
              limit: parsedLimit,
              mode: modeParam,
            }),
          (sessionData) => !sessionData.items || sessionData.items.length === 0
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

        setVocabSetTitle(result.data.vocabSetTitle || 'Tất cả bộ từ')
        resetSessionState(result.data.items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : cfg.fallbackLoadError)
      } finally {
        setLoading(false)
      }
    },
    [
      user,
      filterStatusParam,
      cfg,
      parsedLessonId,
      parsedSetId,
      orderParam,
      parsedLimit,
      modeParam,
      searchParams,
      setSearchParams,
      resetSessionState,
    ]
  )

  useEffect(() => {
    if (skipNextFilterReloadRef.current === filterStatusParam) {
      skipNextFilterReloadRef.current = null
      return
    }
    void loadSession()
  }, [filterStatusParam, loadSession])

  // Auto-focus input whenever moving to a new unanswered question
  useEffect(() => {
    if (!loading && phase === 'PLAYING' && answerStatus === null) {
      const id = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 40)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [loading, phase, currentIndex, answerStatus, wordDirection])

  // Dictation: auto-play pronunciation 1x when opening each new question
  useEffect(() => {
    if (
      variant !== 'DICTATION' ||
      loading ||
      phase !== 'PLAYING' ||
      !currentItem ||
      answerStatus !== null
    ) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setListenCount(1)
      void speakChinese(currentItem.hanzi, currentItem.audioUrl)
    }, 80)

    return () => window.clearTimeout(timer)
  }, [variant, loading, phase, sessionRunId, currentIndex, currentItem, answerStatus])

  const handleReplayDictationAudio = useCallback(() => {
    if (!currentItem) return
    setListenCount((count) => count + 1)
    void speakChinese(currentItem.hanzi, currentItem.audioUrl)
    inputRef.current?.focus()
  }, [currentItem])

  const finishToSummary = useCallback((records: WordInputAnsweredRecord[]) => {
    const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
    const defaultMastered = new Set<number>()
    records.forEach((rec) => {
      if (rec.correct) {
        defaultMastered.add(rec.item.vocabularyId)
      }
    })
    setSelectedMasteredIds(defaultMastered)
    setFinalDurationSeconds(duration)
    setPhase('SUMMARY')
  }, [])

  const evaluateCurrentAnswer = useCallback(
    (timedOut = false) => {
      if (!currentItem || answerLockedRef.current || answerStatus !== null) return
      if (!timedOut && !userInput.trim()) return

      answerLockedRef.current = true

      let isCorrect = false
      if (!timedOut) {
        if (modeParam === 'PINYIN') {
          isCorrect = isPinyinMatch(userInput, currentItem.pinyin)
        } else if (variant === 'TYPING' && wordDirection === 'HANZI_TO_MEANING') {
          isCorrect = isMeaningMatch(userInput, currentItem.meaning)
        } else {
          isCorrect = isHanziMatch(userInput, currentItem.hanzi)
        }
      }

      const nextStatus: AnswerStatus = timedOut ? 'TIMEOUT' : isCorrect ? 'CORRECT' : 'WRONG'
      setAnswerStatus(nextStatus)
      setAutoAdvancePaused(false)
      setAutoAdvanceCountdown(settings.autoAdvanceDelay)

      if (settings.soundEffects) {
        if (isCorrect) {
          playCorrectSound(settings.volume)
          if (settings.coinSound) {
            window.setTimeout(() => playCoinSound(settings.volume), 140)
          }
        } else if (timedOut) {
          playTimeoutSound(settings.volume)
        } else {
          playWrongSound(settings.volume)
        }
      }

      void speakChinese(currentItem.hanzi, currentItem.audioUrl)

      setAnsweredRecords((prev) => [
        ...prev,
        {
          item: currentItem,
          direction: variant === 'DICTATION' ? 'MEANING_TO_HANZI' : wordDirection,
          userAnswer: timedOut ? '' : userInput.trim(),
          correct: isCorrect,
          status: nextStatus,
          hintsUsed,
        },
      ])
    },
    [
      currentItem,
      answerStatus,
      userInput,
      modeParam,
      variant,
      wordDirection,
      settings.autoAdvanceDelay,
      settings.soundEffects,
      settings.coinSound,
      settings.volume,
      hintsUsed,
    ]
  )

  const handleNextQuestion = useCallback(() => {
    if (phase !== 'PLAYING' || answerStatus === null) return

    if (currentIndex + 1 >= items.length) {
      finishToSummary(answeredRecords)
      return
    }

    answerLockedRef.current = false
    setCurrentIndex((idx) => idx + 1)
    setUserInput('')
    setHintsUsed(0)
    setListenCount(0)
    setShowExample(false)
    setAnswerStatus(null)
    setTimeLeft(settings.timePerQuestion)
    setAutoAdvancePaused(false)
    setAutoAdvanceCountdown(0)
  }, [
    phase,
    answerStatus,
    currentIndex,
    items.length,
    finishToSummary,
    answeredRecords,
    settings.timePerQuestion,
  ])

  const handleTriggerHint = useCallback(() => {
    if (phase !== 'PLAYING' || answerStatus !== null || hintsUsed >= MAX_HINTS_PER_QUESTION) return
    setHintsUsed((h) => Math.min(MAX_HINTS_PER_QUESTION, h + 1))
    inputRef.current?.focus()
  }, [phase, answerStatus, hintsUsed])

  const handleToggleExample = useCallback(() => {
    if (phase !== 'PLAYING') return
    setShowExample((prev) => !prev)
  }, [phase])

  const handleToggleWordDirection = useCallback(() => {
    if (variant !== 'TYPING' || modeParam !== 'WORD' || phase !== 'PLAYING') return
    const nextDirection: TypingDirection =
      wordDirection === 'MEANING_TO_HANZI' ? 'HANZI_TO_MEANING' : 'MEANING_TO_HANZI'
    setWordDirection(nextDirection)

    if (answerStatus === null) {
      setUserInput('')
      setHintsUsed(0)
      setShowExample(false)
      setTimeLeft(settings.timePerQuestion)
    }
  }, [variant, modeParam, phase, wordDirection, answerStatus, settings.timePerQuestion])

  // Question countdown timer
  useEffect(() => {
    if (loading || phase !== 'PLAYING' || !currentItem || answerStatus !== null || settingsOpen) {
      return undefined
    }
    if (settings.timePerQuestion <= 0) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          evaluateCurrentAnswer(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [
    loading,
    phase,
    currentItem,
    answerStatus,
    settingsOpen,
    settings.timePerQuestion,
    evaluateCurrentAnswer,
  ])

  // Auto-advance banner countdown
  useEffect(() => {
    if (
      phase !== 'PLAYING' ||
      answerStatus === null ||
      !settings.autoAdvance ||
      autoAdvancePaused
    ) {
      return undefined
    }

    if (autoAdvanceCountdown <= 0) {
      const nextTimer = window.setTimeout(() => handleNextQuestion(), 80)
      return () => window.clearTimeout(nextTimer)
    }

    const interval = window.setInterval(() => {
      setAutoAdvanceCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [
    phase,
    answerStatus,
    settings.autoAdvance,
    autoAdvancePaused,
    autoAdvanceCountdown,
    handleNextQuestion,
  ])

  // Global keyboard shortcuts (Ctrl + X, Ctrl + E, Ctrl + Space, Enter/Space after answer)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (loading || phase !== 'PLAYING' || settingsOpen) return
      if (isComposingRef.current || e.isComposing) return

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
        e.preventDefault()
        handleReplayDictationAudio()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        handleToggleExample()
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
        e.preventDefault()
        handleTriggerHint()
        return
      }

      if (answerStatus !== null && (e.key === 'Enter' || e.code === 'Space')) {
        e.preventDefault()
        handleNextQuestion()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    loading,
    phase,
    settingsOpen,
    answerStatus,
    handleReplayDictationAudio,
    handleToggleExample,
    handleTriggerHint,
    handleNextQuestion,
  ])

  const handleToggleMasteredId = useCallback((vocabId: number) => {
    setSelectedMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(vocabId)) {
        next.delete(vocabId)
      } else {
        next.add(vocabId)
      }
      return next
    })
  }, [])

  const handleToggleSelectAllMastered = useCallback(() => {
    const correctIds = answeredRecords
      .filter((r) => r.correct)
      .map((r) => r.item.vocabularyId)
    if (correctIds.length === 0) return

    setSelectedMasteredIds((prev) => {
      const allSelected = correctIds.every((id) => prev.has(id))
      if (allSelected) {
        return new Set()
      }
      return new Set(correctIds)
    })
  }, [answeredRecords])

  const handleSaveAndFinish = useCallback(async () => {
    if (!user || saving || saved || answeredRecords.length === 0) return
    try {
      setSaving(true)
      setSaveError(null)
      const response = await cfg.submitSession(user.token, {
        vocabSetId: parsedSetId,
        mode: modeParam,
        durationSeconds: finalDurationSeconds,
        idempotencyKey: idempotencyKeyRef.current,
        results: answeredRecords.map((rec) => ({
          vocabularyId: rec.item.vocabularyId,
          correct: rec.correct,
          hintsUsed: rec.hintsUsed,
          markMastered: rec.correct && selectedMasteredIds.has(rec.item.vocabularyId),
        })),
      })
      setSavedXp(response.xpEarned)
      setSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : cfg.fallbackSaveError)
    } finally {
      setSaving(false)
    }
  }, [
    user,
    saving,
    saved,
    answeredRecords,
    cfg,
    parsedSetId,
    modeParam,
    finalDurationSeconds,
    selectedMasteredIds,
  ])

  const handleRetryWrongWords = useCallback(() => {
    const wrongWords = answeredRecords.filter((r) => !r.correct).map((r) => r.item)
    if (wrongWords.length === 0) return
    resetSessionState(wrongWords)
  }, [answeredRecords, resetSessionState])

  const correctCount = useMemo(
    () => answeredRecords.filter((r) => r.correct).length,
    [answeredRecords]
  )
  const liveEarnedXp = correctCount * cfg.xpPerCorrect

  const currentHint = useMemo(() => {
    if (!currentItem || hintsUsed <= 0) return null
    const effectiveDirection: TypingDirection =
      variant === 'DICTATION' ? 'MEANING_TO_HANZI' : wordDirection
    const targetText =
      modeParam === 'PINYIN'
        ? currentItem.pinyin
        : effectiveDirection === 'HANZI_TO_MEANING'
          ? extractPrimaryMeaning(currentItem.meaning)
          : currentItem.hanzi

    return buildProgressiveTypingHint(targetText, hintsUsed, {
      extraPinyin: currentItem.pinyin,
      direction: effectiveDirection,
      isPinyinMode: modeParam === 'PINYIN',
    })
  }, [currentItem, hintsUsed, variant, modeParam, wordDirection])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-600">{cfg.loadingLabel}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white border border-rose-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-800">{cfg.loadErrorTitle}</h2>
            <p className="text-sm text-rose-600">{error}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => void loadSession()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              Thử lại
            </button>
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Quay lại Trung tâm Luyện tập
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center space-y-4 shadow-sm">
          {cfg.emptyIcon}
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-slate-800">
              Không có từ phù hợp với bộ lọc hiện tại
            </h2>
            <p className="text-sm text-slate-500">
              Hãy đổi bộ từ hoặc chọn bộ lọc &quot;Tất cả&quot; để bắt đầu luyện tập nhé.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/practice')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            Quay lại Trung tâm Luyện tập
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'SUMMARY') {
    const summaryCorrect: PracticeSummaryWordItem[] = answeredRecords
      .filter((r) => r.correct)
      .map((r) => ({
        vocabularyId: r.item.vocabularyId,
        hanzi: r.item.hanzi,
        pinyin: r.item.pinyin,
        meaning: r.item.meaning,
        audioUrl: r.item.audioUrl,
        note: r.hintsUsed > 0 ? `Đã dùng ${r.hintsUsed} gợi ý` : null,
      }))

    const summaryWrong: PracticeSummaryWordItem[] = answeredRecords
      .filter((r) => !r.correct)
      .map((r) => ({
        vocabularyId: r.item.vocabularyId,
        hanzi: r.item.hanzi,
        pinyin: r.item.pinyin,
        meaning: r.item.meaning,
        audioUrl: r.item.audioUrl,
        note:
          r.status === 'TIMEOUT'
            ? 'Hết thời gian'
            : r.userAnswer
              ? `Bạn gõ: ${r.userAnswer}`
              : null,
      }))

    const totalCount = answeredRecords.length
    const accuracyPercent = totalCount > 0 ? Math.round((summaryCorrect.length * 100) / totalCount) : 0
    const estimatedBaseXp = summaryCorrect.length * cfg.xpPerCorrect
    const estimatedBonusXp =
      summaryCorrect.length > 0 && accuracyPercent >= COMPLETION_THRESHOLD_PERCENT
        ? cfg.xpBonus
        : 0

    return (
      <div className="max-w-5xl mx-auto pb-10 space-y-3">
        {saveError && (
          <div className="px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {saveError}
          </div>
        )}
        <PracticeSummaryView
          title={cfg.summaryTitle(modeParam)}
          subtitle={`${vocabSetTitle} • Thời gian: ${finalDurationSeconds}s`}
          correctItems={summaryCorrect}
          wrongItems={summaryWrong}
          selectedMasteredIds={selectedMasteredIds}
          onToggleMasteredId={handleToggleMasteredId}
          onToggleSelectAllMastered={handleToggleSelectAllMastered}
          estimatedBaseXp={estimatedBaseXp}
          estimatedBonusXp={estimatedBonusXp}
          savedXp={savedXp}
          saving={saving}
          saved={saved}
          itemUnitLabel="câu"
          xpFormulaText={cfg.xpFormulaText}
          onSaveAndFinish={() => void handleSaveAndFinish()}
          onRetryWrong={summaryWrong.length > 0 ? handleRetryWrongWords : undefined}
          onReplayAll={() => void loadSession()}
          onBackToHub={() => navigate('/practice')}
        />
      </div>
    )
  }

  const questionProgressPercent = Math.round(((currentIndex + 1) / items.length) * 100)
  const timerPercent =
    settings.timePerQuestion > 0
      ? Math.max(0, Math.min(100, Math.round((timeLeft / settings.timePerQuestion) * 100)))
      : 0
  const timerColorClass =
    timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 25 ? 'bg-amber-500' : 'bg-rose-500'
  const timerTextClass =
    timerPercent > 50
      ? 'text-emerald-700'
      : timerPercent > 25
        ? 'text-amber-700'
        : 'text-rose-600 animate-pulse'

  const hintsRemaining = MAX_HINTS_PER_QUESTION - hintsUsed
  const isMeaningToHanziWord =
    variant === 'TYPING' && modeParam === 'WORD' && wordDirection === 'MEANING_TO_HANZI'
  const shouldMaskExample = variant === 'DICTATION' || isMeaningToHanziWord

  return (
    <div className="max-w-3xl mx-auto pb-8 sm:pb-12 space-y-3 sm:space-y-4">
      {autoFilterNotice && (
        <PracticeFilterNoticeBanner
          message={autoFilterNotice}
          tone="emerald"
          onDismiss={() => setAutoFilterNotice(null)}
        />
      )}

      {/* 1. Header Tiến độ + Công tắc hướng (Typing) + Bộ đếm thời gian */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 whitespace-nowrap">
              Câu {currentIndex + 1} / {items.length}
            </span>
            <span className="inline-flex px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-bold truncate max-w-[180px] sm:max-w-xs">
              {vocabSetTitle} • {cfg.headerModeLabel(modeParam)}
            </span>

            {variant === 'TYPING' && modeParam === 'WORD' && (
              <button
                type="button"
                onClick={handleToggleWordDirection}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-extrabold transition-colors"
                title="Đảo chiều hỏi Nghĩa > Từ hoặc Từ > Nghĩa"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>{wordDirection === 'MEANING_TO_HANZI' ? 'Nghĩa > Từ' : 'Từ > Nghĩa'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Cài đặt game"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => void loadSession()}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chơi lại</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>

        {/* Thanh tiến độ số câu */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{ width: `${questionProgressPercent}%` }}
          />
        </div>

        {/* XP + Bộ đếm thời gian */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>+{liveEarnedXp} XP</span>
          </div>

          {settings.timePerQuestion > 0 && (
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <Clock className={`w-3.5 h-3.5 shrink-0 ${timerTextClass}`} />
              <span className={`text-xs font-extrabold tabular-nums w-8 shrink-0 ${timerTextClass}`}>
                {timeLeft}s
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-linear rounded-full ${timerColorClass}`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Thẻ Câu hỏi chính */}
      {currentItem && (
        <div className="relative bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 md:p-7 shadow-sm space-y-5">
          {variant === 'DICTATION' && (
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                Nghe: <strong className="text-slate-900">{listenCount}x</strong> | Ctrl+X
              </span>
            </div>
          )}

          {/* Prompt Section */}
          <div className="text-center space-y-2.5">
            {variant === 'DICTATION' ? (
              <>
                <div className="flex flex-col items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleReplayDictationAudio}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center"
                    title="Nghe lại phát âm (Ctrl + X)"
                  >
                    <Headphones className="w-7 h-7 sm:w-8 sm:h-8" />
                  </button>
                  <span className="-mt-2.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-white text-[10px] font-extrabold tracking-wider uppercase shadow">
                    CTRL + X
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 pt-1">
                  {modeParam === 'PINYIN'
                    ? 'Nghe và gõ pinyin'
                    : 'Nghe và gõ từ tiếng Trung'}
                </p>
                <div className="flex items-center justify-center pt-0.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-extrabold uppercase">
                    {formatPartOfSpeechLabel(currentItem.partOfSpeech)}
                  </span>
                </div>
              </>
            ) : modeParam === 'PINYIN' ? (
              <>
                <h2
                  className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-wide pt-1 break-words"
                  style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                >
                  {currentItem.hanzi}
                </h2>
                <p className="text-sm sm:text-base font-medium text-slate-500">
                  {currentItem.meaning}
                </p>
                <div className="flex items-center justify-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => speakChinese(currentItem.hanzi, currentItem.audioUrl)}
                    className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-extrabold uppercase">
                    {formatPartOfSpeechLabel(currentItem.partOfSpeech)}
                  </span>
                </div>
              </>
            ) : wordDirection === 'HANZI_TO_MEANING' ? (
              <>
                <h2
                  className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-wide pt-1 break-words"
                  style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                >
                  {currentItem.hanzi}
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => speakChinese(currentItem.hanzi, currentItem.audioUrl)}
                    className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                    title="Nghe phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-extrabold uppercase">
                    {formatPartOfSpeechLabel(currentItem.partOfSpeech)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setHidePinyin((p) => !p)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    {hidePinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{hidePinyin ? 'Hiện pinyin' : 'Ẩn pinyin'}</span>
                  </button>
                </div>
                {!hidePinyin && (
                  <p className="text-sm sm:text-base font-mono italic text-slate-500">
                    {currentItem.pinyin}
                  </p>
                )}
              </>
            ) : (
              /* TYPING · WORD · MEANING_TO_HANZI */
              <>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight pt-1 break-words">
                  {currentItem.meaning}
                </h2>
                <div className="flex items-center justify-center gap-2.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => speakChinese(currentItem.hanzi, currentItem.audioUrl)}
                    className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                    title="Nghe phát âm từ này"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-extrabold uppercase">
                    {formatPartOfSpeechLabel(currentItem.partOfSpeech)}
                  </span>
                </div>
              </>
            )}

            {/* Vùng Gợi ý tiến triển */}
            <div className="min-h-[2rem] flex flex-col items-center justify-center pt-1">
              {currentHint ? (
                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-mono font-extrabold tracking-wider text-amber-600 break-words">
                    {currentHint.maskedText}
                  </div>
                  {currentHint.extraNote && (
                    <div className="text-xs font-mono text-slate-500">{currentHint.extraNote}</div>
                  )}
                </div>
              ) : (
                <p className="text-xs italic text-slate-400">Chưa có gợi ý</p>
              )}
            </div>
          </div>

          {/* Inline Expandable Example Card (Không dùng Modal) */}
          {showExample && (
            <div className="rounded-2xl bg-slate-50 border border-slate-200/90 px-4 py-3 text-center space-y-1.5">
              {currentItem.exampleSentence ? (
                <>
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className="text-sm sm:text-base font-bold text-slate-800 break-words"
                      style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                    >
                      {shouldMaskExample
                        ? currentItem.maskedExampleSentence || currentItem.exampleSentence
                        : currentItem.exampleSentence}
                    </span>
                    {!shouldMaskExample && (
                      <button
                        type="button"
                        onClick={() => speakChinese(currentItem.exampleSentence)}
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors shrink-0"
                        title="Nghe câu ví dụ"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {variant === 'TYPING' &&
                    modeParam !== 'PINYIN' &&
                    !shouldMaskExample &&
                    currentItem.examplePinyin && (
                      <div className="text-xs font-mono text-slate-500">
                        {currentItem.examplePinyin}
                      </div>
                    )}
                  {currentItem.exampleMeaning && (
                    <div className="text-xs italic text-slate-600">{currentItem.exampleMeaning}</div>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500">Từ vựng này chưa có câu ví dụ đi kèm.</p>
              )}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (isComposingRef.current) return
              if (answerStatus === null) {
                evaluateCurrentAnswer(false)
              } else {
                handleNextQuestion()
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                readOnly={answerStatus !== null}
                onChange={(e) => setUserInput(e.target.value)}
                onCompositionStart={() => {
                  isComposingRef.current = true
                }}
                onCompositionEnd={() => {
                  isComposingRef.current = false
                }}
                placeholder={cfg.placeholder(modeParam, wordDirection)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                className={`w-full px-4 py-3.5 rounded-2xl border-2 text-center text-base sm:text-lg font-bold transition-all outline-none ${
                  answerStatus === 'CORRECT'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : answerStatus !== null
                      ? 'border-rose-400 bg-rose-50 text-rose-900'
                      : 'border-slate-200 bg-slate-50/70 text-slate-900 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'
                }`}
              />
              {modeParam === 'PINYIN' && answerStatus === null && (
                <p className="text-[11px] text-center text-slate-400">
                  Bắt buộc gõ đúng dấu thanh (<code>fāng biàn</code>) hoặc số thanh (
                  <code>fang1 bian4</code>).
                </p>
              )}
            </div>

            {/* 3 Action Buttons & Keyboard Shortcut Captions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={handleToggleExample}
                  className={`w-full py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors ${
                    showExample
                      ? 'border-sky-300 bg-sky-50 text-sky-800'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{showExample ? 'Ẩn ví dụ' : 'Xem ví dụ'}</span>
                </button>
                <span className="hidden md:inline text-[10px] font-semibold text-slate-400">
                  Ctrl + E
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  disabled={hintsRemaining <= 0 || answerStatus !== null}
                  onClick={handleTriggerHint}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-amber-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Gợi ý ({hintsRemaining})</span>
                </button>
                <span className="hidden md:inline text-[10px] font-semibold text-slate-400">
                  Ctrl + Space
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button
                  type="submit"
                  disabled={!userInput.trim() || answerStatus !== null}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kiểm tra</span>
                </button>
                <span className="hidden md:inline text-[10px] font-semibold text-slate-400">
                  Enter
                </span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 3. Sticky Bottom Feedback Banner */}
      {answerStatus !== null && currentItem && (
        <div
          className={`sticky bottom-2 sm:bottom-4 z-30 rounded-2xl shadow-xl border transition-all ${
            answerStatus === 'CORRECT'
              ? 'bg-emerald-600 border-emerald-500 text-white'
              : 'bg-rose-600 border-rose-500 text-white'
          }`}
        >
          <div className="px-3.5 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakChinese(currentItem.hanzi, currentItem.audioUrl)}
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
                  title="Nghe lại phát âm từ"
                >
                  <Volume2 className="w-4 h-4 text-white" />
                </button>
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/15">
                  {answerStatus === 'CORRECT' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Chính xác (+{cfg.xpPerCorrect} XP)</span>
                    </>
                  ) : answerStatus === 'TIMEOUT' ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Hết thời gian</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Chưa chính xác</span>
                    </>
                  )}
                </span>
                <span className="text-xs sm:text-sm font-bold">
                  Từ:{' '}
                  <strong
                    className="text-sm sm:text-base"
                    style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                  >
                    {currentItem.hanzi}
                  </strong>{' '}
                  <span className="text-[11px] sm:text-xs opacity-90">
                    ({formatPartOfSpeechLabel(currentItem.partOfSpeech)})
                  </span>
                </span>
                <span className="text-xs font-mono opacity-90">/{currentItem.pinyin}/</span>
              </div>

              <div className="text-xs sm:text-sm font-semibold sm:pl-9">
                <span className="opacity-85">Nghĩa:</span> {currentItem.meaning}
              </div>

              {currentItem.exampleSentence && (
                <div className="flex items-start gap-1.5 text-xs sm:pl-9 opacity-95">
                  <button
                    type="button"
                    onClick={() => speakChinese(currentItem.exampleSentence)}
                    className="mt-0.5 hover:opacity-80 shrink-0"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="line-clamp-2 sm:line-clamp-none">
                    <span className="font-bold">Ví dụ:</span> {currentItem.exampleSentence}
                    {currentItem.exampleMeaning ? ` (${currentItem.exampleMeaning})` : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2.5 shrink-0">
              {settings.autoAdvance && (
                <button
                  type="button"
                  onClick={() => setAutoAdvancePaused((p) => !p)}
                  className="w-10 h-10 rounded-full border border-white/40 bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
                  title={
                    autoAdvancePaused
                      ? 'Tiếp tục đếm ngược chuyển câu'
                      : 'Tạm dừng tự động chuyển câu'
                  }
                >
                  {autoAdvancePaused ? (
                    <Play className="w-4 h-4 fill-current" />
                  ) : (
                    <Pause className="w-4 h-4 fill-current" />
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={handleNextQuestion}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs sm:text-sm shadow-sm transition-colors whitespace-nowrap"
              >
                {currentIndex + 1 >= items.length
                  ? settings.autoAdvance && !autoAdvancePaused
                    ? `Xem tổng kết (${autoAdvanceCountdown}s)`
                    : 'Xem tổng kết'
                  : settings.autoAdvance && !autoAdvancePaused
                    ? `Tiếp tục (${autoAdvanceCountdown}s)`
                    : 'Tiếp tục'}
              </button>
            </div>
          </div>
        </div>
      )}

      <GameSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />
    </div>
  )
}

