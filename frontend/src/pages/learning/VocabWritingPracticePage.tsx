import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Eye,
  EyeOff,
  Loader2,
  PenTool,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Square,
  Volume2,
  X,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  generateWritingSession,
  submitWritingSession,
  type WritingWordItemDto,
} from '../../api/vocabPractice'
import {
  MultiHanziWritingBoard,
  type MultiHanziWritingBoardHandle,
} from '../../components/practice/MultiHanziWritingBoard'
import { GameSettingsDrawer } from '../../components/practice/GameSettingsDrawer'
import {
  PracticeSummaryView,
  type PracticeSummaryWordItem,
} from '../../components/practice/PracticeSummaryView'
import { PracticeFilterNoticeBanner } from '../../components/practice/PracticeFilterNoticeBanner'
import {
  loadPracticeSettings,
  type PracticeGameSettings,
} from '../../utils/practiceSettings'
import { formatPartOfSpeechLabel, speakChinese } from '../../utils/vocabFormat'
import {
  playCoinSound,
  playCorrectSound,
  playTimeoutSound,
  playWrongSound,
} from '../../utils/gameSounds'
import {
  buildUpdatedFilterSearchParams,
  fetchPracticeItemsWithFallback,
  normalizePracticeFilterStatus,
} from '../../utils/practiceFilter'

type ActiveWritingMode = 'TRACE' | 'RECALL'
type WordStage = 'writing' | 'completed' | 'revealed' | 'timeout'

interface WordOutcomeRecord {
  word: WritingWordItemDto
  completedCleanly: boolean
  mistakesCount: number
  reason: 'clean' | 'with_mistakes' | 'revealed' | 'timeout' | 'skipped'
}

function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `writing-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getWordTimeLimit(
  baseSeconds: number,
  word: WritingWordItemDto | undefined
): number {
  if (!word) return baseSeconds
  const extraChars = Math.max(0, word.characters.length - 2)
  return baseSeconds + extraChars * 10
}

export const VocabWritingPracticePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const vocabSetIdParam = searchParams.get('vocabSetId')
  const lessonIdParam = searchParams.get('lessonId')
  const filterStatus = normalizePracticeFilterStatus(searchParams.get('filterStatus'))
  const order = (searchParams.get('order') as 'RANDOM' | 'DEFAULT') || 'RANDOM'
  const limitParam = searchParams.get('limit')
  const rawMode = searchParams.get('mode')
  const mode: ActiveWritingMode = rawMode === 'RECALL' ? 'RECALL' : 'TRACE'

  const parsedVocabSetId = vocabSetIdParam ? Number(vocabSetIdParam) : undefined
  const parsedLessonId = lessonIdParam ? Number(lessonIdParam) : undefined
  const parsedLimit = limitParam ? Number(limitParam) : undefined

  const boardRef = useRef<MultiHanziWritingBoardHandle>(null)
  const sessionStartRef = useRef<number>(0)
  const idempotencyKeyRef = useRef<string>(createIdempotencyKey())
  const lastSpokenWordIdRef = useRef<number | null>(null)

  const [settings, setSettings] = useState<PracticeGameSettings>(() =>
    loadPracticeSettings()
  )
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vocabSetTitle, setVocabSetTitle] = useState('Luyện viết chữ Hán')
  const [words, setWords] = useState<WritingWordItemDto[]>([])
  const [autoSwitchedFilterNotice, setAutoSwitchedFilterNotice] = useState<
    string | null
  >(null)

  const [currentIdx, setCurrentIdx] = useState(0)
  const [wordStage, setWordStage] = useState<WordStage>('writing')
  const [mistakesInCurrentWord, setMistakesInCurrentWord] = useState(0)
  const [charProgress, setCharProgress] = useState({ done: 0, total: 1 })
  const [hidePinyin, setHidePinyin] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const [remainingSeconds, setRemainingSeconds] = useState(settings.timePerQuestion)
  const [autoAdvanceLeft, setAutoAdvanceLeft] = useState<number | null>(null)

  const [outcomes, setOutcomes] = useState<WordOutcomeRecord[]>([])
  const [showSummary, setShowSummary] = useState(false)
  const [sessionNonce, setSessionNonce] = useState(0)

  // Summary saving states
  const [selectedMasteredIds, setSelectedMasteredIds] = useState<Set<number>>(
    new Set()
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedXp, setSavedXp] = useState<number | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const currentWord = words[currentIdx]
  const currentTimeLimit = useMemo(
    () => getWordTimeLimit(settings.timePerQuestion, currentWord),
    [settings.timePerQuestion, currentWord]
  )

  const startWithWordList = useCallback(
    (wordList: WritingWordItemDto[], title: string) => {
      sessionStartRef.current = Date.now()
      idempotencyKeyRef.current = createIdempotencyKey()
      lastSpokenWordIdRef.current = null
      setVocabSetTitle(title)
      setWords(wordList)
      setCurrentIdx(0)
      setWordStage('writing')
      setMistakesInCurrentWord(0)
      setCharProgress({
        done: 0,
        total: wordList[0]?.characters.length || 1,
      })
      setIsPreviewing(false)
      setAutoAdvanceLeft(null)
      setOutcomes([])
      setShowSummary(false)
      setSelectedMasteredIds(new Set())
      setSaved(false)
      setSavedXp(null)
      setSaveError(null)
      setRemainingSeconds(
        getWordTimeLimit(settings.timePerQuestion, wordList[0])
      )
      setSessionNonce((n) => n + 1)
    },
    [settings.timePerQuestion]
  )

  const fetchSession = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    setAutoSwitchedFilterNotice(null)

    try {
      const result = await fetchPracticeItemsWithFallback(
        filterStatus,
        (effectiveFilter) =>
          generateWritingSession(user.token, {
            vocabSetId: parsedVocabSetId,
            lessonId: parsedLessonId,
            filterStatus: effectiveFilter,
            order,
            limit: parsedLimit,
            mode,
          }),
        (res) => res.words.length === 0
      )

      if (result.switchedFromUnmasteredToAll) {
        setAutoSwitchedFilterNotice(
          'Tất cả từ trong bộ lọc "Chưa thuộc" đã hoàn thành — tự động chuyển sang "Tất cả từ" để bạn tiếp tục luyện viết.'
        )
        setSearchParams(
          (prev) => buildUpdatedFilterSearchParams(prev, 'ALL'),
          { replace: true }
        )
      }

      startWithWordList(result.data.words, result.data.vocabSetTitle)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải danh sách từ luyện viết'
      )
    } finally {
      setLoading(false)
    }
  }, [
    user,
    filterStatus,
    parsedVocabSetId,
    parsedLessonId,
    order,
    parsedLimit,
    mode,
    startWithWordList,
    setSearchParams,
  ])

  useEffect(() => {
    void fetchSession()
  }, [fetchSession])

  // Speak Chinese word cleanly when a new word appears
  useEffect(() => {
    if (!currentWord || showSummary || loading) return
    if (lastSpokenWordIdRef.current !== currentWord.vocabularyId) {
      lastSpokenWordIdRef.current = currentWord.vocabularyId
      speakChinese(currentWord.hanzi, currentWord.audioUrl)
    }
  }, [currentWord, showSummary, loading])

  const finalizeSessionToSummary = useCallback(
    (finalOutcomes: WordOutcomeRecord[]) => {
      const cleanIds = new Set(
        finalOutcomes
          .filter((item) => item.completedCleanly)
          .map((item) => item.word.vocabularyId)
      )
      setSelectedMasteredIds(cleanIds)
      setShowSummary(true)
    },
    []
  )

  const recordOutcomeAndAdvance = useCallback(
    (record: WordOutcomeRecord) => {
      const updated = [
        ...outcomes.filter(
          (item) => item.word.vocabularyId !== record.word.vocabularyId
        ),
        record,
      ]
      setOutcomes(updated)

      const nextIdx = currentIdx + 1
      if (nextIdx >= words.length) {
        finalizeSessionToSummary(updated)
      } else {
        const nextWord = words[nextIdx]
        setCurrentIdx(nextIdx)
        setWordStage('writing')
        setMistakesInCurrentWord(0)
        setCharProgress({
          done: 0,
          total: nextWord?.characters.length || 1,
        })
        setRemainingSeconds(
          getWordTimeLimit(settings.timePerQuestion, nextWord)
        )
        setIsPreviewing(false)
        setAutoAdvanceLeft(null)
      }
    },
    [
      outcomes,
      currentIdx,
      words,
      settings.timePerQuestion,
      finalizeSessionToSummary,
    ]
  )

  const handleContinueNext = useCallback(() => {
    if (!currentWord) return
    setAutoAdvanceLeft(null)

    let completedCleanly = false
    let reason: WordOutcomeRecord['reason'] = 'revealed'
    if (wordStage === 'completed') {
      completedCleanly = mistakesInCurrentWord === 0
      reason = completedCleanly ? 'clean' : 'with_mistakes'
    } else if (wordStage === 'timeout') {
      reason = 'timeout'
    }

    recordOutcomeAndAdvance({
      word: currentWord,
      completedCleanly,
      mistakesCount: mistakesInCurrentWord,
      reason,
    })
  }, [currentWord, wordStage, mistakesInCurrentWord, recordOutcomeAndAdvance])

  // Countdown timer per word
  useEffect(() => {
    if (loading || showSummary || !currentWord || wordStage !== 'writing') {
      return
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setWordStage('timeout')
          if (settings.soundEffects) {
            playTimeoutSound(settings.volume)
          }
          speakChinese(currentWord.hanzi, currentWord.audioUrl)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [
    loading,
    showSummary,
    currentWord,
    wordStage,
    settings.soundEffects,
    settings.volume,
  ])

  // Auto-advance ONLY when completed cleanly (never skip timeout or Xem đáp án before user inspects)
  useEffect(() => {
    if (
      wordStage !== 'completed' ||
      mistakesInCurrentWord > 0 ||
      !settings.autoAdvance ||
      showSummary
    ) {
      return
    }

    const tick = window.setInterval(() => {
      setAutoAdvanceLeft((prev) => {
        if (prev === null) return null
        if (prev <= 1) {
          window.clearInterval(tick)
          handleContinueNext()
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(tick)
  }, [
    wordStage,
    mistakesInCurrentWord,
    settings.autoAdvance,
    showSummary,
    handleContinueNext,
  ])

  const handleWordCompleted = useCallback(() => {
    if (!currentWord || wordStage !== 'writing') return
    setWordStage('completed')
    if (mistakesInCurrentWord === 0 && settings.autoAdvance) {
      setAutoAdvanceLeft(settings.autoAdvanceDelay)
    }
    if (settings.soundEffects) {
      playCorrectSound(settings.volume)
    }
    speakChinese(currentWord.hanzi, currentWord.audioUrl)
  }, [
    currentWord,
    wordStage,
    mistakesInCurrentWord,
    settings.autoAdvance,
    settings.autoAdvanceDelay,
    settings.soundEffects,
    settings.volume,
  ])

  const handleMistake = useCallback(() => {
    setMistakesInCurrentWord((m) => m + 1)
  }, [])

  const handleRevealAnswer = () => {
    if (!currentWord || wordStage !== 'writing') return
    setWordStage('revealed')
    if (settings.soundEffects) {
      playWrongSound(settings.volume)
    }
    speakChinese(currentWord.hanzi, currentWord.audioUrl)
  }

  const handleSkipWord = () => {
    if (!currentWord) return
    setAutoAdvanceLeft(null)
    recordOutcomeAndAdvance({
      word: currentWord,
      completedCleanly: false,
      mistakesCount: mistakesInCurrentWord,
      reason: 'skipped',
    })
  }

  // Keyboard Enter shortcut to advance when inline detail panel is open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !showSummary &&
        !settingsOpen &&
        wordStage !== 'writing'
      ) {
        e.preventDefault()
        handleContinueNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [wordStage, showSummary, settingsOpen, handleContinueNext])

  const { correctSummaryItems, wrongSummaryItems, estimatedBaseXp, estimatedBonusXp } =
    useMemo(() => {
      const cleanList: PracticeSummaryWordItem[] = []
      const wrongList: PracticeSummaryWordItem[] = []

      for (const item of outcomes) {
        const mapped: PracticeSummaryWordItem = {
          vocabularyId: item.word.vocabularyId,
          hanzi: item.word.hanzi,
          pinyin: item.word.pinyin,
          meaning: item.word.meaning,
          audioUrl: item.word.audioUrl,
          note:
            item.reason === 'revealed'
              ? 'Đã xem đáp án'
              : item.reason === 'timeout'
                ? 'Hết thời gian'
                : item.reason === 'skipped'
                  ? 'Đã bỏ qua'
                  : item.mistakesCount > 0
                    ? `Viết nhầm ${item.mistakesCount} nét`
                    : null,
        }
        if (item.completedCleanly) {
          cleanList.push(mapped)
        } else {
          wrongList.push(mapped)
        }
      }

      const base = cleanList.length * 2
      const total = outcomes.length
      const acc = total > 0 ? Math.round((cleanList.length * 100) / total) : 0
      const bonus = total > 0 && acc >= 50 ? 10 : 0

      return {
        correctSummaryItems: cleanList,
        wrongSummaryItems: wrongList,
        estimatedBaseXp: base,
        estimatedBonusXp: bonus,
      }
    }, [outcomes])

  const liveEarnedXp = useMemo(() => {
    const cleanCount = outcomes.filter((o) => o.completedCleanly).length
    const currentBonus =
      wordStage === 'completed' && mistakesInCurrentWord === 0 ? 2 : 0
    return cleanCount * 2 + currentBonus
  }, [outcomes, wordStage, mistakesInCurrentWord])

  const handleToggleMasteredId = (vocabId: number) => {
    setSelectedMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(vocabId)) next.delete(vocabId)
      else next.add(vocabId)
      return next
    })
  }

  const handleToggleSelectAllMastered = () => {
    if (selectedMasteredIds.size === correctSummaryItems.length) {
      setSelectedMasteredIds(new Set())
    } else {
      setSelectedMasteredIds(
        new Set(correctSummaryItems.map((i) => i.vocabularyId))
      )
    }
  }

  const handleSaveAndFinish = async () => {
    if (!user || saving || saved) return
    setSaving(true)
    setSaveError(null)
    try {
      const elapsedSeconds = Math.max(
        1,
        sessionStartRef.current > 0
          ? Math.round((Date.now() - sessionStartRef.current) / 1000)
          : 1
      )
      const res = await submitWritingSession(user.token, {
        vocabSetId: parsedVocabSetId,
        mode,
        durationSeconds: elapsedSeconds,
        idempotencyKey: idempotencyKeyRef.current,
        results: outcomes.map((o) => ({
          vocabularyId: o.word.vocabularyId,
          completedCleanly: o.completedCleanly,
          mistakesCount: o.mistakesCount,
          markMastered:
            o.completedCleanly && selectedMasteredIds.has(o.word.vocabularyId),
        })),
      })
      setSaved(true)
      setSavedXp(res.xpEarned)
      if (settings.coinSound && res.xpEarned > 0) {
        playCoinSound(settings.volume)
      }
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : 'Không thể lưu kết quả luyện viết'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleRetryWrong = () => {
    const wrongWords = outcomes
      .filter((o) => !o.completedCleanly)
      .map((o) => o.word)
    if (wrongWords.length === 0) return
    startWithWordList(wrongWords, `${vocabSetTitle} (Ôn từ cần luyện)`)
  }

  const handleReplayAll = () => {
    void fetchSession()
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-sm font-bold text-slate-600">
          Đang chuẩn bị dữ liệu nét chữ Hán...
        </p>
      </div>
    )
  }

  if (error || words.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Không thể tải danh sách từ luyện viết
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {error ?? 'Không có từ vựng nào có ký tự Hán phù hợp với bộ lọc hiện tại.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold"
            >
              Quay lại Trung tâm Luyện tập
            </button>
            <button
              type="button"
              onClick={() => void fetchSession()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Thử tải lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showSummary) {
    return (
      <div className="px-3 sm:px-6 py-4 sm:py-6">
        {saveError && (
          <div className="max-w-4xl mx-auto mb-3 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
            {saveError}
          </div>
        )}
        <PracticeSummaryView
          title={mode === 'TRACE' ? 'Đồ nét' : 'Viết nhớ'}
          subtitle={vocabSetTitle}
          correctItems={correctSummaryItems}
          wrongItems={wrongSummaryItems}
          selectedMasteredIds={selectedMasteredIds}
          onToggleMasteredId={handleToggleMasteredId}
          onToggleSelectAllMastered={handleToggleSelectAllMastered}
          estimatedBaseXp={estimatedBaseXp}
          estimatedBonusXp={estimatedBonusXp}
          savedXp={savedXp}
          saving={saving}
          saved={saved}
          itemUnitLabel="từ"
          xpFormulaText={`Viết đạt: +${estimatedBaseXp} XP (+2 XP/từ) • Thưởng hoàn thành (>= 50%): +${estimatedBonusXp} XP`}
          onSaveAndFinish={() => void handleSaveAndFinish()}
          onRetryWrong={wrongSummaryItems.length > 0 ? handleRetryWrong : undefined}
          onReplayAll={handleReplayAll}
          onBackToHub={() => navigate('/practice')}
        />
      </div>
    )
  }

  const wordProgressPercent = Math.round(
    ((currentIdx + (wordStage !== 'writing' ? 1 : 0)) * 100) / words.length
  )
  const timeProgressPercent = Math.max(
    0,
    Math.min(100, Math.round((remainingSeconds * 100) / currentTimeLimit))
  )

  const canPreview =
    Boolean(currentWord.characters.some((c) => c.supported)) &&
    (mode === 'TRACE' || wordStage !== 'writing')

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-5 space-y-3 sm:space-y-4">
      {autoSwitchedFilterNotice && (
        <PracticeFilterNoticeBanner
          message={autoSwitchedFilterNotice}
          onDismiss={() => setAutoSwitchedFilterNotice(null)}
        />
      )}

      {/* 1. Compact Header Card: Mode/Char Badges + Action Controls + Word & Time Progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Back + Mode badge + Chars badge + XP */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Quay lại"
              aria-label="Quay lại Trung tâm Luyện tập"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wide uppercase ${
                mode === 'TRACE'
                  ? 'bg-teal-100 text-teal-800 border border-teal-200'
                  : 'bg-violet-100 text-violet-800 border border-violet-200'
              }`}
            >
              {mode === 'TRACE' ? 'ĐỒ NÉT' : 'VIẾT NHỚ'}
            </span>

            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border ${
                charProgress.done >= charProgress.total
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {charProgress.done}/{charProgress.total} CHỮ
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-extrabold">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>+{liveEarnedXp}</span>
            </span>
          </div>

          {/* Right: Ẩn pinyin, Nghe từ, Settings, Replay, Thoát */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHidePinyin((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                hidePinyin
                  ? 'bg-slate-800 border-slate-800 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {hidePinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{hidePinyin ? 'Hiện pinyin' : 'Ẩn pinyin'}</span>
            </button>

            <button
              type="button"
              onClick={() => speakChinese(currentWord.hanzi, currentWord.audioUrl)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Nghe từ</span>
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Cài đặt game"
              aria-label="Mở cài đặt game"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleReplayAll}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Chơi lại"
              aria-label="Chơi lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>
          </div>
        </div>

        {/* Word Progress + Timer Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
              <span>
                Từ {currentIdx + 1}/{words.length}
              </span>
              <span>{wordProgressPercent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-500 transition-all duration-300"
                style={{ width: `${wordProgressPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
              <span className="text-slate-600">Thời gian</span>
              <span
                className={
                  remainingSeconds <= 5
                    ? 'text-rose-600 font-extrabold'
                    : remainingSeconds <= 10
                      ? 'text-amber-600 font-extrabold'
                      : 'text-emerald-700 font-extrabold'
                }
              >
                {remainingSeconds}s
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  remainingSeconds <= 5
                    ? 'bg-rose-500'
                    : remainingSeconds <= 10
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                }`}
                style={{ width: `${timeProgressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Prompt + Multi-Hanzi Rice Grid Board + Action Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-sm space-y-4">
        {/* Meaning + Pinyin Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
                Nghĩa tiếng Việt
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-600">
                {formatPartOfSpeechLabel(currentWord.partOfSpeech)}
              </span>
            </div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              {currentWord.meaning}
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5">
            <div className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400">
              Pinyin
            </div>
            <div className="text-sm sm:text-base font-bold text-teal-700 mt-0.5">
              {hidePinyin ? '••••••' : currentWord.pinyin}
            </div>
          </div>
        </div>

        {/* Multi-character Writing Board */}
        <MultiHanziWritingBoard
          key={`${sessionNonce}-${currentWord.vocabularyId}`}
          ref={boardRef}
          wordId={currentWord.vocabularyId}
          characters={currentWord.characters}
          mode={mode}
          answerRevealed={wordStage !== 'writing'}
          disabled={wordStage !== 'writing'}
          soundEffects={settings.soundEffects}
          volume={settings.volume}
          onCharProgressChange={(done, total) => setCharProgress({ done, total })}
          onMistake={handleMistake}
          onPreviewStateChange={setIsPreviewing}
          onWordCompleted={handleWordCompleted}
        />

        {/* Bottom 4 Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-2 sm:gap-2.5 pt-1">
          <button
            type="button"
            disabled={!canPreview}
            onClick={() => boardRef.current?.previewActiveChar()}
            className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed ${
              mode === 'TRACE' || wordStage !== 'writing'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            {isPreviewing ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Dừng preview</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Preview cách viết</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={wordStage !== 'writing'}
            onClick={() => boardRef.current?.clearStrokes()}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-45 disabled:cursor-not-allowed text-slate-700 inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa nét</span>
          </button>

          <button
            type="button"
            disabled={wordStage !== 'writing'}
            onClick={handleRevealAnswer}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold bg-teal-600 hover:bg-teal-700 disabled:opacity-45 disabled:cursor-not-allowed text-white inline-flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem đáp án</span>
          </button>

          <button
            type="button"
            disabled={wordStage !== 'writing'}
            onClick={handleSkipWord}
            className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 disabled:opacity-45 disabled:cursor-not-allowed text-slate-600 inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Bỏ qua từ</span>
          </button>
        </div>
      </div>

      {/* 3. Inline Answer / Word Detail Panel (GEMINI.md Rule 4: Zero Modals) */}
      {wordStage !== 'writing' && (
        <div
          className={`rounded-2xl border p-4 shadow-sm space-y-3 transition-all ${
            wordStage === 'completed' && mistakesInCurrentWord === 0
              ? 'bg-emerald-50/90 border-emerald-200'
              : wordStage === 'completed'
                ? 'bg-amber-50/90 border-amber-200'
                : wordStage === 'timeout'
                  ? 'bg-rose-50/90 border-rose-200'
                  : 'bg-sky-50/90 border-sky-200'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {wordStage === 'completed' && mistakesInCurrentWord === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <PenTool className="w-5 h-5 text-sky-600 shrink-0" />
              )}
              <span className="text-sm font-extrabold text-slate-900">
                {wordStage === 'completed' && mistakesInCurrentWord === 0
                  ? 'Hoàn thành chính xác!'
                  : wordStage === 'completed'
                    ? `Hoàn thành từ (nhầm ${mistakesInCurrentWord} nét — sẽ xếp vào Cần ôn)`
                    : wordStage === 'timeout'
                      ? 'Hết thời gian — hãy xem lại đáp án bên trên'
                      : 'Đã mở đáp án — xem lại thứ tự nét mẫu'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => speakChinese(currentWord.hanzi, currentWord.audioUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Phát âm</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 bg-white/85 border border-white rounded-xl p-3 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Từ</div>
              <div className="text-lg font-extrabold text-slate-900 leading-tight mt-0.5">
                {currentWord.hanzi}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Loại từ</div>
              <div className="font-bold text-slate-700 mt-1">
                {formatPartOfSpeechLabel(currentWord.partOfSpeech)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Pinyin</div>
              <div className="font-bold text-teal-700 mt-1">{currentWord.pinyin}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase text-slate-400">Nghĩa</div>
              <div className="font-bold text-slate-800 mt-1">{currentWord.meaning}</div>
            </div>
          </div>

          {currentWord.exampleSentence && (
            <div className="bg-white/75 border border-white rounded-xl px-3.5 py-2.5 text-xs space-y-0.5">
              <div className="text-[10px] font-bold uppercase text-slate-400">Ví dụ</div>
              <div className="font-bold text-slate-900">{currentWord.exampleSentence}</div>
              {currentWord.examplePinyin && (
                <div className="text-slate-600">{currentWord.examplePinyin}</div>
              )}
              {currentWord.exampleMeaning && (
                <div className="text-slate-700 italic">{currentWord.exampleMeaning}</div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleContinueNext}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold shadow-sm inline-flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>
                {currentIdx + 1 >= words.length
                  ? 'Xem tổng kết'
                  : autoAdvanceLeft !== null
                    ? `Tiếp tục (${autoAdvanceLeft}s)`
                    : 'Tiếp tục'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
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
