import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Clock,
  Coins,
  Eye,
  EyeOff,
  Heart,
  LayoutGrid,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Volume2,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  generateMatchSession,
  submitMatchSession,
  type MatchCardSideDto,
  type MatchMode,
  type MatchPairItemDto,
  type MatchRoundDto,
  type MatchSessionResponse,
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
import { speakChinese } from '../../utils/vocabFormat'
import { GameSettingsDrawer } from '../../components/practice/GameSettingsDrawer'
import {
  PracticeSummaryView,
  type PracticeSummaryWordItem,
} from '../../components/practice/PracticeSummaryView'

type GamePhase = 'PLAYING' | 'SUMMARY'
type PickSide = 'LEFT' | 'RIGHT'

interface VocabMatchRecord {
  matched: boolean
  mistakesCount: number
}

interface WrongFlashState {
  leftId: number
  rightId: number
}

const MAX_PAIRS_PER_ROUND = 8
const XP_PER_CLEAN_MATCH = 2
const XP_COMPLETION_BONUS = 10

function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `match-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function normalizeCollisionKey(value?: string | null): string {
  return (value ?? '').trim().toLowerCase()
}

/**
 * Packs a list of vocab pairs into <=8-pair rounds locally (used when retrying wrong words),
 * avoiding duplicate hanzi or duplicate target labels inside the same round.
 */
function buildMatchRoundsFromPairs(pairs: MatchPairItemDto[], mode: MatchMode): MatchRoundDto[] {
  const remaining = shuffleArray(pairs)
  const rounds: MatchRoundDto[] = []

  while (remaining.length > 0) {
    const bucket: MatchPairItemDto[] = []
    const usedHanzi = new Set<string>()
    const usedTargets = new Set<string>()

    for (let i = 0; i < remaining.length && bucket.length < MAX_PAIRS_PER_ROUND; i += 1) {
      const candidate = remaining[i]
      const hanziKey = normalizeCollisionKey(candidate.hanzi)
      const targetKey = normalizeCollisionKey(
        mode === 'MATCH_PINYIN' ? candidate.pinyin : candidate.meaning
      )

      if (!usedHanzi.has(hanziKey) && !usedTargets.has(targetKey)) {
        usedHanzi.add(hanziKey)
        usedTargets.add(targetKey)
        bucket.push(candidate)
        remaining.splice(i, 1)
        i -= 1
      }
    }

    // Fallback when only colliding items remain
    if (bucket.length === 0) {
      const count = Math.min(MAX_PAIRS_PER_ROUND, remaining.length)
      bucket.push(...remaining.splice(0, count))
    }

    const leftCards: MatchCardSideDto[] = shuffleArray(bucket).map((pair) => ({
      vocabularyId: pair.vocabularyId,
      primaryText: pair.hanzi,
      secondaryText: mode === 'MATCH_MEANING' ? pair.pinyin : null,
    }))

    const rightCards: MatchCardSideDto[] = shuffleArray(bucket).map((pair) => ({
      vocabularyId: pair.vocabularyId,
      primaryText: mode === 'MATCH_PINYIN' ? pair.pinyin : pair.meaning,
      secondaryText: null,
    }))

    rounds.push({
      roundIndex: rounds.length,
      pairsCount: bucket.length,
      pairs: bucket,
      leftCards,
      rightCards,
    })
  }

  return rounds
}

function formatMatchModeLabel(mode: MatchMode): string {
  return mode === 'MATCH_PINYIN' ? 'Nối với pinyin' : 'Nối với nghĩa'
}

export const VocabMatchPracticePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const vocabSetIdParam = searchParams.get('vocabSetId')
  const filterStatusParam =
    (searchParams.get('filterStatus') as 'ALL' | 'UNMASTERED' | 'MASTERED') || 'UNMASTERED'
  const orderParam = (searchParams.get('order') as 'RANDOM' | 'DEFAULT') || 'RANDOM'
  const limitParam = searchParams.get('limit')
  const modeParam: MatchMode =
    searchParams.get('mode') === 'MATCH_PINYIN' ? 'MATCH_PINYIN' : 'MATCH_MEANING'

  const parsedSetId = useMemo(
    () =>
      vocabSetIdParam && !isNaN(Number(vocabSetIdParam))
        ? parseInt(vocabSetIdParam, 10)
        : undefined,
    [vocabSetIdParam]
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

  const [sessionMeta, setSessionMeta] = useState<{
    vocabSetId?: number | null
    vocabSetTitle: string
    mode: MatchMode
    maxHearts: number
  }>({
    vocabSetId: parsedSetId,
    vocabSetTitle: 'Tất cả bộ từ',
    mode: modeParam,
    maxHearts: 5,
  })
  const [rounds, setRounds] = useState<MatchRoundDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [phase, setPhase] = useState<GamePhase>('PLAYING')
  const [roundIndex, setRoundIndex] = useState(0)
  const [remainingHearts, setRemainingHearts] = useState(5)
  const [timeLeft, setTimeLeft] = useState<number>(() => loadPracticeSettings().timePerQuestion)
  const [paused, setPaused] = useState(false)
  const [hidePinyin, setHidePinyin] = useState(false)
  const [transitioningRound, setTransitioningRound] = useState(false)

  // Card interaction states
  const [leftSelectedId, setLeftSelectedId] = useState<number | null>(null)
  const [rightSelectedId, setRightSelectedId] = useState<number | null>(null)
  const [firstPickSide, setFirstPickSide] = useState<PickSide | null>(null)
  const [roundMatchedIds, setRoundMatchedIds] = useState<Set<number>>(new Set())
  const [justMatchedId, setJustMatchedId] = useState<number | null>(null)
  const [wrongFlash, setWrongFlash] = useState<WrongFlashState | null>(null)
  const [totalMatchedCount, setTotalMatchedCount] = useState(0)
  const [liveCleanXp, setLiveCleanXp] = useState(0)

  // Summary & Save state
  const [endReasonNote, setEndReasonNote] = useState<string | null>(null)
  const [correctItems, setCorrectItems] = useState<PracticeSummaryWordItem[]>([])
  const [wrongItems, setWrongItems] = useState<PracticeSummaryWordItem[]>([])
  const [selectedMasteredIds, setSelectedMasteredIds] = useState<Set<number>>(new Set())
  const [estimatedBaseXp, setEstimatedBaseXp] = useState(0)
  const [estimatedBonusXp, setEstimatedBonusXp] = useState(0)
  const [finalDurationSeconds, setFinalDurationSeconds] = useState(0)
  const [finalTimedOut, setFinalTimedOut] = useState(false)
  const [finalRemainingHearts, setFinalRemainingHearts] = useState(5)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedXp, setSavedXp] = useState<number | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Mutable refs for race-free timers & submission
  const resultsMapRef = useRef<Map<number, VocabMatchRecord>>(new Map())
  const remainingHeartsRef = useRef<number>(5)
  const endingRef = useRef<boolean>(false)
  const sessionStartMsRef = useRef<number>(Date.now())
  const idempotencyKeyRef = useRef<string>(createIdempotencyKey())
  const roundsRef = useRef<MatchRoundDto[]>([])
  const matchFlashTimerRef = useRef<number | null>(null)
  const wrongFlashTimerRef = useRef<number | null>(null)
  const roundAdvanceTimerRef = useRef<number | null>(null)

  const clearPendingTimers = useCallback(() => {
    if (matchFlashTimerRef.current !== null) {
      window.clearTimeout(matchFlashTimerRef.current)
      matchFlashTimerRef.current = null
    }
    if (wrongFlashTimerRef.current !== null) {
      window.clearTimeout(wrongFlashTimerRef.current)
      wrongFlashTimerRef.current = null
    }
    if (roundAdvanceTimerRef.current !== null) {
      window.clearTimeout(roundAdvanceTimerRef.current)
      roundAdvanceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearPendingTimers()
  }, [clearPendingTimers])

  const allPairs = useMemo(() => rounds.flatMap((round) => round.pairs), [rounds])
  const currentRound = useMemo(
    () => (rounds.length > 0 && roundIndex < rounds.length ? rounds[roundIndex] : null),
    [rounds, roundIndex]
  )

  const startSessionWithRounds = useCallback(
    (
      nextRounds: MatchRoundDto[],
      meta: {
        vocabSetId?: number | null
        vocabSetTitle: string
        mode: MatchMode
        maxHearts: number
      }
    ) => {
      clearPendingTimers()
      const activeSettings = loadPracticeSettings()
      setSettings(activeSettings)
      setSessionMeta(meta)
      setRounds(nextRounds)
      roundsRef.current = nextRounds

      const initialResults = new Map<number, VocabMatchRecord>()
      for (const r of nextRounds) {
        for (const p of r.pairs) {
          initialResults.set(p.vocabularyId, { matched: false, mistakesCount: 0 })
        }
      }
      resultsMapRef.current = initialResults

      const startingHearts = meta.maxHearts || 5
      remainingHeartsRef.current = startingHearts
      endingRef.current = false
      sessionStartMsRef.current = Date.now()
      idempotencyKeyRef.current = createIdempotencyKey()

      setPhase('PLAYING')
      setRoundIndex(0)
      setRemainingHearts(startingHearts)
      setTimeLeft(activeSettings.timePerQuestion)
      setPaused(false)
      setTransitioningRound(false)

      setLeftSelectedId(null)
      setRightSelectedId(null)
      setFirstPickSide(null)
      setRoundMatchedIds(new Set())
      setJustMatchedId(null)
      setWrongFlash(null)
      setTotalMatchedCount(0)
      setLiveCleanXp(0)

      setEndReasonNote(null)
      setCorrectItems([])
      setWrongItems([])
      setSelectedMasteredIds(new Set())
      setEstimatedBaseXp(0)
      setEstimatedBonusXp(0)
      setFinalDurationSeconds(0)
      setFinalTimedOut(false)
      setFinalRemainingHearts(startingHearts)
      setSaving(false)
      setSaved(false)
      setSavedXp(null)
      setSaveError(null)
    },
    [clearPendingTimers]
  )

  const loadSession = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      setError(null)
      const data: MatchSessionResponse = await generateMatchSession(user.token, {
        vocabSetId: parsedSetId,
        filterStatus: filterStatusParam,
        order: orderParam,
        limit: parsedLimit,
        mode: modeParam,
      })
      startSessionWithRounds(data.rounds, {
        vocabSetId: data.vocabSetId,
        vocabSetTitle: data.vocabSetTitle,
        mode: data.mode,
        maxHearts: data.maxHearts,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu trò chơi Nối từ'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [
    user,
    parsedSetId,
    filterStatusParam,
    orderParam,
    parsedLimit,
    modeParam,
    startSessionWithRounds,
  ])

  useEffect(() => {
    void loadSession()
  }, [loadSession])

  const finalizeGame = useCallback(
    (options: { timedOut: boolean; endReason: string | null }) => {
      if (endingRef.current) return
      endingRef.current = true
      clearPendingTimers()

      const durationSeconds = Math.max(
        1,
        Math.round((Date.now() - sessionStartMsRef.current) / 1000)
      )
      const heartsLeft = remainingHeartsRef.current
      const pairsSnapshot = roundsRef.current.flatMap((r) => r.pairs)

      const nextCorrect: PracticeSummaryWordItem[] = []
      const nextWrong: PracticeSummaryWordItem[] = []
      const nextChecked = new Set<number>()

      for (const pair of pairsSnapshot) {
        const rec = resultsMapRef.current.get(pair.vocabularyId) ?? {
          matched: false,
          mistakesCount: 0,
        }
        const cleanlyMatched = rec.matched && rec.mistakesCount === 0
        const baseItem: PracticeSummaryWordItem = {
          vocabularyId: pair.vocabularyId,
          hanzi: pair.hanzi,
          pinyin: pair.pinyin,
          meaning: pair.meaning,
          audioUrl: pair.audioUrl,
        }

        if (cleanlyMatched) {
          nextCorrect.push(baseItem)
          nextChecked.add(pair.vocabularyId)
        } else {
          let note: string | null = null
          if (!rec.matched && rec.mistakesCount > 0) {
            note = `Ghép nhầm ${rec.mistakesCount} lần · Chưa kịp ghép`
          } else if (rec.mistakesCount > 0) {
            note = `Ghép nhầm ${rec.mistakesCount} lần`
          } else if (!rec.matched) {
            note = 'Chưa kịp ghép'
          }
          nextWrong.push({ ...baseItem, note })
        }
      }

      const completedCleanly =
        nextCorrect.length > 0 &&
        nextWrong.length === 0 &&
        !options.timedOut &&
        heartsLeft > 0

      setCorrectItems(nextCorrect)
      setWrongItems(nextWrong)
      setSelectedMasteredIds(nextChecked)
      setEstimatedBaseXp(nextCorrect.length * XP_PER_CLEAN_MATCH)
      setEstimatedBonusXp(completedCleanly ? XP_COMPLETION_BONUS : 0)
      setFinalDurationSeconds(durationSeconds)
      setFinalTimedOut(options.timedOut)
      setFinalRemainingHearts(heartsLeft)
      setEndReasonNote(options.endReason)
      setPhase('SUMMARY')
    },
    [clearPendingTimers]
  )

  // Per-board countdown timer
  useEffect(() => {
    if (
      phase !== 'PLAYING' ||
      loading ||
      paused ||
      settingsOpen ||
      transitioningRound ||
      rounds.length === 0 ||
      endingRef.current
    ) {
      return
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [phase, loading, paused, settingsOpen, transitioningRound, rounds.length])

  // Trigger timeout ending immediately when timer hits 0
  useEffect(() => {
    if (
      phase === 'PLAYING' &&
      !loading &&
      !paused &&
      !transitioningRound &&
      rounds.length > 0 &&
      timeLeft <= 0 &&
      !endingRef.current
    ) {
      if (settings.soundEffects) {
        playTimeoutSound(settings.volume)
      }
      finalizeGame({
        timedOut: true,
        endReason: 'Đã hết thời gian cho lượt ghép hiện tại.',
      })
    }
  }, [
    phase,
    loading,
    paused,
    transitioningRound,
    rounds.length,
    timeLeft,
    settings.soundEffects,
    settings.volume,
    finalizeGame,
  ])

  const recomputeMatchedStats = useCallback(() => {
    let matchedCount = 0
    let cleanCount = 0
    for (const rec of resultsMapRef.current.values()) {
      if (rec.matched) matchedCount += 1
      if (rec.matched && rec.mistakesCount === 0) cleanCount += 1
    }
    setTotalMatchedCount(matchedCount)
    setLiveCleanXp(cleanCount * XP_PER_CLEAN_MATCH)
  }, [])

  const evaluatePair = useCallback(
    (leftId: number, rightId: number, sidePickedFirst: PickSide | null) => {
      if (!currentRound || endingRef.current || transitioningRound || paused) return

      setLeftSelectedId(null)
      setRightSelectedId(null)
      setFirstPickSide(null)

      if (leftId === rightId) {
        const prev = resultsMapRef.current.get(leftId) ?? { matched: false, mistakesCount: 0 }
        resultsMapRef.current.set(leftId, { ...prev, matched: true })
        recomputeMatchedStats()

        const nextRoundMatched = new Set(roundMatchedIds)
        nextRoundMatched.add(leftId)
        setRoundMatchedIds(nextRoundMatched)
        setJustMatchedId(leftId)
        if (matchFlashTimerRef.current !== null) {
          window.clearTimeout(matchFlashTimerRef.current)
        }
        matchFlashTimerRef.current = window.setTimeout(() => {
          setJustMatchedId(null)
          matchFlashTimerRef.current = null
        }, 420)

        if (settings.soundEffects) {
          playCorrectSound(settings.volume)
        }

        // Approved Audio Rule: auto-pronounce ONLY after a correct match so pinyin is never leaked early
        const matchedPair = currentRound.pairs.find((p) => p.vocabularyId === leftId)
        if (matchedPair) {
          speakChinese(matchedPair.hanzi, matchedPair.audioUrl)
        }

        if (nextRoundMatched.size === currentRound.pairsCount) {
          if (roundIndex + 1 < rounds.length) {
            setTransitioningRound(true)
            roundAdvanceTimerRef.current = window.setTimeout(() => {
              roundAdvanceTimerRef.current = null
              setRoundIndex((prevIdx) => prevIdx + 1)
              setRoundMatchedIds(new Set())
              setLeftSelectedId(null)
              setRightSelectedId(null)
              setFirstPickSide(null)
              setTimeLeft(settings.timePerQuestion)
              setTransitioningRound(false)
            }, 650)
          } else {
            if (settings.coinSound) {
              playCoinSound(settings.volume)
            }
            finalizeGame({ timedOut: false, endReason: null })
          }
        }
        return
      }

      // Mismatch branch: record mistake against the anchor word first picked, deduct 1 heart
      const mistakeTargetId = sidePickedFirst === 'RIGHT' ? rightId : leftId
      const prevRec = resultsMapRef.current.get(mistakeTargetId) ?? {
        matched: false,
        mistakesCount: 0,
      }
      resultsMapRef.current.set(mistakeTargetId, {
        ...prevRec,
        mistakesCount: prevRec.mistakesCount + 1,
      })

      const nextHearts = Math.max(0, remainingHeartsRef.current - 1)
      remainingHeartsRef.current = nextHearts
      setRemainingHearts(nextHearts)
      setWrongFlash({ leftId, rightId })

      if (settings.soundEffects) {
        playWrongSound(settings.volume)
      }

      if (wrongFlashTimerRef.current !== null) {
        window.clearTimeout(wrongFlashTimerRef.current)
      }

      if (nextHearts <= 0) {
        wrongFlashTimerRef.current = window.setTimeout(() => {
          wrongFlashTimerRef.current = null
          setWrongFlash(null)
          finalizeGame({
            timedOut: false,
            endReason: 'Bạn đã dùng hết 5 trái tim. Hãy ôn lại các từ chưa thuộc nhé.',
          })
        }, 300)
      } else {
        wrongFlashTimerRef.current = window.setTimeout(() => {
          wrongFlashTimerRef.current = null
          setWrongFlash(null)
        }, 450)
      }
    },
    [
      currentRound,
      transitioningRound,
      paused,
      roundMatchedIds,
      roundIndex,
      rounds.length,
      settings.soundEffects,
      settings.volume,
      settings.coinSound,
      settings.timePerQuestion,
      recomputeMatchedStats,
      finalizeGame,
    ]
  )

  const handleLeftCardClick = (vocabularyId: number) => {
    if (
      endingRef.current ||
      paused ||
      transitioningRound ||
      roundMatchedIds.has(vocabularyId)
    ) {
      return
    }
    setWrongFlash(null)
    if (rightSelectedId !== null) {
      evaluatePair(vocabularyId, rightSelectedId, firstPickSide ?? 'RIGHT')
      return
    }
    if (leftSelectedId === vocabularyId) {
      setLeftSelectedId(null)
      setFirstPickSide(null)
    } else {
      setLeftSelectedId(vocabularyId)
      setFirstPickSide('LEFT')
    }
  }

  const handleRightCardClick = (vocabularyId: number) => {
    if (
      endingRef.current ||
      paused ||
      transitioningRound ||
      roundMatchedIds.has(vocabularyId)
    ) {
      return
    }
    setWrongFlash(null)
    if (leftSelectedId !== null) {
      evaluatePair(leftSelectedId, vocabularyId, firstPickSide ?? 'LEFT')
      return
    }
    if (rightSelectedId === vocabularyId) {
      setRightSelectedId(null)
      setFirstPickSide(null)
    } else {
      setRightSelectedId(vocabularyId)
      setFirstPickSide('RIGHT')
    }
  }

  const handleToggleMasteredId = useCallback((vocabId: number) => {
    setSelectedMasteredIds((prev) => {
      const next = new Set(prev)
      if (next.has(vocabId)) next.delete(vocabId)
      else next.add(vocabId)
      return next
    })
  }, [])

  const handleToggleSelectAllMastered = useCallback(() => {
    setSelectedMasteredIds((prev) => {
      if (correctItems.length > 0 && prev.size === correctItems.length) {
        return new Set()
      }
      return new Set(correctItems.map((item) => item.vocabularyId))
    })
  }, [correctItems])

  const handleSaveAndFinish = async () => {
    if (!user || saving || saved || allPairs.length === 0) return
    try {
      setSaving(true)
      setSaveError(null)
      const res = await submitMatchSession(user.token, {
        vocabSetId: sessionMeta.vocabSetId ?? parsedSetId,
        mode: sessionMeta.mode,
        durationSeconds: finalDurationSeconds,
        remainingHearts: finalRemainingHearts,
        timedOut: finalTimedOut,
        idempotencyKey: idempotencyKeyRef.current,
        results: allPairs.map((pair) => {
          const rec = resultsMapRef.current.get(pair.vocabularyId) ?? {
            matched: false,
            mistakesCount: 0,
          }
          const cleanlyMatched = rec.matched && rec.mistakesCount === 0
          return {
            vocabularyId: pair.vocabularyId,
            matched: rec.matched,
            mistakesCount: rec.mistakesCount,
            markMastered: cleanlyMatched && selectedMasteredIds.has(pair.vocabularyId),
          }
        }),
      })
      setSaved(true)
      setSavedXp(res.xpEarned)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu kết quả trò chơi Nối từ'
      setSaveError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleRetryWrong = () => {
    const wrongIdSet = new Set(wrongItems.map((item) => item.vocabularyId))
    const pairsToRetry = allPairs.filter((pair) => wrongIdSet.has(pair.vocabularyId))
    if (pairsToRetry.length === 0) return

    const retryRounds = buildMatchRoundsFromPairs(pairsToRetry, sessionMeta.mode)
    startSessionWithRounds(retryRounds, sessionMeta)
  }

  if (loading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
        <p className="mt-4 text-sm font-bold text-slate-600">Đang chuẩn bị bảng Nối từ...</p>
      </div>
    )
  }

  if (error || rounds.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center mb-4">
            <LayoutGrid className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {error ? 'Không thể tạo trò chơi Nối từ' : 'Chưa có từ vựng phù hợp'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            {error ||
              'Bộ lọc hiện tại chưa có từ nào đủ dữ liệu (Chữ Hán & Nghĩa / Pinyin) để ghép đôi.'}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
            >
              Quay lại Trung tâm Luyện tập
            </button>
            <button
              type="button"
              onClick={() => void loadSession()}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Thử tải lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'SUMMARY') {
    return (
      <div className="py-2 sm:py-4 space-y-4">
        {saveError && (
          <div className="max-w-4xl mx-auto px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        <PracticeSummaryView
          title={`Kết quả Nối từ · ${formatMatchModeLabel(sessionMeta.mode)}`}
          subtitle={sessionMeta.vocabSetTitle}
          correctItems={correctItems}
          wrongItems={wrongItems}
          selectedMasteredIds={selectedMasteredIds}
          onToggleMasteredId={handleToggleMasteredId}
          onToggleSelectAllMastered={handleToggleSelectAllMastered}
          estimatedBaseXp={estimatedBaseXp}
          estimatedBonusXp={estimatedBonusXp}
          savedXp={savedXp}
          saving={saving}
          saved={saved}
          endReasonNote={endReasonNote}
          onSaveAndFinish={() => void handleSaveAndFinish()}
          onRetryWrong={wrongItems.length > 0 ? handleRetryWrong : undefined}
          onReplayAll={() => void loadSession()}
          onBackToHub={() => navigate('/practice')}
        />
      </div>
    )
  }

  const totalPairsCount = allPairs.length
  const sessionProgressPercent =
    totalPairsCount > 0 ? Math.round((totalMatchedCount / totalPairsCount) * 100) : 0
  const timerPercent =
    settings.timePerQuestion > 0
      ? Math.max(0, Math.min(100, Math.round((timeLeft / settings.timePerQuestion) * 100)))
      : 0
  const timerBarClass =
    timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 25 ? 'bg-amber-500' : 'bg-rose-500'
  const timerBadgeClass =
    timerPercent > 50
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : timerPercent > 25
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'

  const maxHearts = sessionMeta.maxHearts || 5

  return (
    <div className="max-w-3xl mx-auto pb-8 sm:pb-12 space-y-3 sm:space-y-4">
      {/* 1. Header Tiến độ, Pinyin toggle & Thanh Thời gian */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5 sm:space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <span className="text-xs sm:text-sm font-extrabold text-slate-800 whitespace-nowrap">
              Đã ghép {roundMatchedIds.size} / {currentRound?.pairsCount ?? 0}
            </span>
            {rounds.length > 1 && (
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] sm:text-[11px] font-bold">
                Lượt {roundIndex + 1}/{rounds.length}
              </span>
            )}
            <span className="hidden md:inline-flex px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
              {sessionMeta.vocabSetTitle} · {formatMatchModeLabel(sessionMeta.mode)}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap shrink-0">
            {sessionMeta.mode === 'MATCH_MEANING' && (
              <button
                type="button"
                onClick={() => setHidePinyin((prev) => !prev)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-colors ${
                  hidePinyin
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Ẩn hoặc hiện phiên âm Pinyin gợi ý"
              >
                {hidePinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{hidePinyin ? 'Hiện' : 'Ẩn'} pinyin</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title={paused ? 'Tiếp tục' : 'Tạm dừng'}
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{paused ? 'Tiếp tục' : 'Tạm dừng'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Cài đặt game"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => void loadSession()}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Chơi lại từ đầu"
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

        {/* Tiến độ tổng ván */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${sessionProgressPercent}%` }}
          />
        </div>

        {/* XP + Thanh đếm ngược */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold shrink-0">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span>+{liveCleanXp} XP</span>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold tabular-nums shrink-0 text-slate-700">
              <Clock className="w-3.5 h-3.5" />
              {timeLeft}s
            </span>
            <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${timerBarClass}`}
                style={{ width: `${timerPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bảng Nối Từ (2 cột đối xứng trên Mobile/Tablet/Desktop, 5 trái tim & đồng hồ nổi bật) */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3 sm:p-5 md:p-6 shadow-sm space-y-4 sm:space-y-5">
        {/* Hearts Bar & Timer Badge */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 bg-slate-50/90 border border-slate-200/80 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center gap-1 sm:gap-1.5" aria-label={`Còn ${remainingHearts} trái tim`}>
            {Array.from({ length: maxHearts }).map((_, idx) => {
              const active = idx < remainingHearts
              return (
                <Heart
                  key={idx}
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                    active
                      ? 'text-rose-500 fill-rose-500 scale-100'
                      : 'text-slate-300 fill-slate-100 scale-90'
                  }`}
                />
              )
            })}
            <span className="ml-1 sm:ml-1.5 text-[11px] sm:text-xs font-bold text-slate-500 hidden sm:inline">
              {remainingHearts}/{maxHearts} tim
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl border text-xs font-extrabold tabular-nums ${timerBadgeClass}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}S</span>
          </div>
        </div>

        {/* Inline Paused State or Round Transition Banner */}
        {paused ? (
          <div className="py-16 px-4 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/80 text-slate-700 mx-auto flex items-center justify-center">
              <Pause className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Trò chơi đang tạm dừng</h3>
              <p className="text-xs text-slate-500 mt-1">
                Đồng hồ đã tạm dừng để bạn nghỉ ngơi hoặc xem lại cài đặt.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPaused(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Tiếp tục chơi</span>
            </button>
          </div>
        ) : transitioningRound ? (
          <div className="py-16 px-4 text-center rounded-2xl border border-emerald-200 bg-emerald-50/70 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-emerald-900">
              Hoàn thành Lượt {roundIndex + 1}!
            </h3>
            <p className="text-xs font-semibold text-emerald-700">
              Đang mở bảng Lượt {roundIndex + 2} / {rounds.length}...
            </p>
          </div>
        ) : (
          currentRound && (
            <div className="grid grid-cols-2 gap-2 sm:gap-4 md:gap-5">
              {/* Cột Trái: Tiếng Trung */}
              <div className="space-y-2 sm:space-y-2.5 min-w-0">
                <div className="text-center text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-0.5 sm:pb-1">
                  Tiếng Trung
                </div>

                {currentRound.leftCards.map((card) => {
                  const isMatched = roundMatchedIds.has(card.vocabularyId)
                  const isSelected = leftSelectedId === card.vocabularyId
                  const isWrong = wrongFlash?.leftId === card.vocabularyId
                  const isJustMatched = justMatchedId === card.vocabularyId
                  const pairObj = currentRound.pairs.find((p) => p.vocabularyId === card.vocabularyId)

                  let cardClass =
                    'bg-white border-slate-200 text-slate-900 hover:border-sky-300 hover:bg-sky-50/40 shadow-xs'
                  if (isJustMatched) {
                    cardClass =
                      'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                  } else if (isMatched) {
                    cardClass =
                      'bg-emerald-50/40 border-emerald-200/70 text-emerald-700 opacity-45'
                  } else if (isWrong) {
                    cardClass =
                      'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                  } else if (isSelected) {
                    cardClass =
                      'bg-sky-50 border-sky-500 text-sky-950 ring-2 ring-sky-500/25 shadow-sm'
                  }

                  return (
                    <div
                      key={`left-${card.vocabularyId}`}
                      role="button"
                      tabIndex={isMatched ? -1 : 0}
                      onClick={() => handleLeftCardClick(card.vocabularyId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleLeftCardClick(card.vocabularyId)
                        }
                      }}
                      className={`w-full min-h-[52px] sm:min-h-[60px] px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border flex items-center justify-between gap-1.5 sm:gap-2 transition-all duration-150 select-none ${
                        isMatched ? 'cursor-default' : 'cursor-pointer active:scale-[0.985]'
                      } ${cardClass}`}
                    >
                      <div className="min-w-0 text-left">
                        <div
                          className="text-sm sm:text-base md:text-lg font-extrabold leading-tight break-words line-clamp-2"
                          style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                        >
                          {card.primaryText}
                        </div>
                        {sessionMeta.mode === 'MATCH_MEANING' && !hidePinyin && card.secondaryText && (
                          <div className="text-[10px] sm:text-[11px] font-mono text-slate-500 truncate mt-0.5">
                            {card.secondaryText}
                          </div>
                        )}
                      </div>

                      {isMatched && (
                        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                          {pairObj && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                speakChinese(pairObj.hanzi, pairObj.audioUrl)
                              }}
                              className="p-1 sm:p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors"
                              title="Nghe lại phát âm"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Cột Phải: Tiếng Việt hoặc Pinyin */}
              <div className="space-y-2 sm:space-y-2.5 min-w-0">
                <div className="text-center text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-500 pb-0.5 sm:pb-1">
                  {sessionMeta.mode === 'MATCH_PINYIN' ? 'Pinyin' : 'Tiếng Việt'}
                </div>

                {currentRound.rightCards.map((card) => {
                  const isMatched = roundMatchedIds.has(card.vocabularyId)
                  const isSelected = rightSelectedId === card.vocabularyId
                  const isWrong = wrongFlash?.rightId === card.vocabularyId
                  const isJustMatched = justMatchedId === card.vocabularyId

                  let cardClass =
                    'bg-white border-slate-200 text-slate-800 hover:border-sky-300 hover:bg-sky-50/40 shadow-xs'
                  if (isJustMatched) {
                    cardClass =
                      'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                  } else if (isMatched) {
                    cardClass =
                      'bg-emerald-50/40 border-emerald-200/70 text-emerald-700 opacity-45'
                  } else if (isWrong) {
                    cardClass =
                      'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20'
                  } else if (isSelected) {
                    cardClass =
                      'bg-sky-50 border-sky-500 text-sky-950 ring-2 ring-sky-500/25 shadow-sm'
                  }

                  return (
                    <button
                      key={`right-${card.vocabularyId}`}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleRightCardClick(card.vocabularyId)}
                      className={`w-full min-h-[52px] sm:min-h-[60px] px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border flex items-center justify-center text-center transition-all duration-150 select-none ${
                        isMatched ? 'cursor-default' : 'cursor-pointer active:scale-[0.985]'
                      } ${cardClass}`}
                    >
                      <span
                        className={`text-[11px] sm:text-sm leading-tight sm:leading-snug break-words line-clamp-3 ${
                          sessionMeta.mode === 'MATCH_PINYIN'
                            ? 'font-mono font-bold tracking-wide'
                            : 'font-bold'
                        }`}
                      >
                        {card.primaryText}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        )}

        {/* Footer Bảng */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-xs font-bold text-slate-500">
          <span>
            Đã ghép: <span className="text-slate-800">{roundMatchedIds.size} / {currentRound?.pairsCount ?? 0}</span>
            {rounds.length > 1 && (
              <span className="text-slate-400 font-semibold">
                {' '}· Tổng ván: {totalMatchedCount}/{totalPairsCount}
              </span>
            )}
          </span>
          <span className="hidden sm:inline text-[11px] font-medium text-slate-400">
            Chọn cặp tương ứng giữa 2 cột · Tự đọc phát âm sau khi ghép đúng
          </span>
        </div>
      </div>

      {/* Side Drawer Cài đặt game */}
      <GameSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={setSettings}
      />
    </div>
  )
}
