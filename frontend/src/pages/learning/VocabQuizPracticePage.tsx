import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
    ArrowLeft,
    RotateCcw,
    Volume2,
    Eye,
    EyeOff,
    Clock,
    Pause,
    Play,
    CheckCircle2,
    XCircle,
    Award,
    Settings,
    Coins,
    Sparkles,
    CheckSquare,
    AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
    generateQuizSession,
    submitQuizSession,
    type QuizMode,
    type QuizOptionDto,
    type QuizQuestionDto,
    type QuizSubmitResponse,
    type QuizAnswerSubmitItem,
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
import { GameSettingsDrawer } from '../../components/practice/GameSettingsDrawer'

type AnswerStatus = 'CORRECT' | 'WRONG' | 'TIMEOUT'

interface AnsweredRecord {
    question: QuizQuestionDto
    correct: boolean
    status: AnswerStatus
    selectedOptionId: number | null
}

function createIdempotencyKey(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID()
    }
    return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function formatModeLabel(mode: string): string {
    switch (mode) {
        case 'HANZI_TO_MEANING':
            return 'Từ → Nghĩa'
        case 'MEANING_TO_HANZI':
            return 'Nghĩa → Từ'
        case 'MIXED':
            return 'Hỗn hợp'
        case 'CONTEXT':
            return 'Ngữ cảnh'
        default:
            return 'Trắc nghiệm'
    }
}

export const VocabQuizPracticePage: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const vocabSetIdParam = searchParams.get('vocabSetId')
    const filterStatusParam = (searchParams.get('filterStatus') as 'ALL' | 'UNMASTERED' | 'MASTERED') || 'UNMASTERED'
    const orderParam = (searchParams.get('order') as 'RANDOM' | 'DEFAULT') || 'RANDOM'
    const limitParam = searchParams.get('limit')
    const modeParam = (searchParams.get('mode') as QuizMode) || 'HANZI_TO_MEANING'

    const parsedSetId = useMemo(
        () => (vocabSetIdParam && !isNaN(Number(vocabSetIdParam)) ? parseInt(vocabSetIdParam, 10) : undefined),
        [vocabSetIdParam]
    )
    const parsedLimit = useMemo(
        () => (limitParam && limitParam !== 'all' && !isNaN(Number(limitParam)) ? parseInt(limitParam, 10) : undefined),
        [limitParam]
    )

    const [settings, setSettings] = useState<PracticeGameSettings>(() => loadPracticeSettings())
    const [settingsOpen, setSettingsOpen] = useState(false)

    const [questions, setQuestions] = useState<QuizQuestionDto[]>([])
    const [vocabSetTitle, setVocabSetTitle] = useState<string>('Tất cả bộ từ')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [currentIndex, setCurrentIndex] = useState(0)
    const [hidePinyin, setHidePinyin] = useState(false)

    // Answer & timer state per question
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
    const [answerStatus, setAnswerStatus] = useState<AnswerStatus | null>(null)
    const [timeLeft, setTimeLeft] = useState<number>(() => loadPracticeSettings().timePerQuestion)
    const [autoAdvanceLeft, setAutoAdvanceLeft] = useState<number>(() => loadPracticeSettings().autoAdvanceDelay)
    const [autoAdvancePaused, setAutoAdvancePaused] = useState(false)

    // Session progress & submission state
    const [records, setRecords] = useState<AnsweredRecord[]>([])
    const [liveXp, setLiveXp] = useState(0)
    const [sessionCompleted, setSessionCompleted] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState<QuizSubmitResponse | null>(null)

    const idempotencyKeyRef = useRef<string>(createIdempotencyKey())
    const sessionStartMsRef = useRef<number>(Date.now())
    const submittingRef = useRef<boolean>(false)
    const recordsRef = useRef<AnsweredRecord[]>([])

    const currentQuestion = useMemo(() => {
        if (questions.length === 0 || currentIndex >= questions.length) return null
        return questions[currentIndex]
    }, [questions, currentIndex])

    const resetSessionWithQuestions = useCallback(
        (nextQuestions: QuizQuestionDto[], title?: string) => {
            const activeSettings = loadPracticeSettings()
            setSettings(activeSettings)
            setQuestions(nextQuestions)
            if (title) setVocabSetTitle(title)
            setCurrentIndex(0)
            setSelectedOptionId(null)
            setAnswerStatus(null)
            setTimeLeft(activeSettings.timePerQuestion)
            setAutoAdvanceLeft(activeSettings.autoAdvanceDelay)
            setAutoAdvancePaused(false)
            recordsRef.current = []
            setRecords([])
            setLiveXp(0)
            setSessionCompleted(false)
            setSubmitResult(null)
            setSubmitting(false)
            submittingRef.current = false
            idempotencyKeyRef.current = createIdempotencyKey()
            sessionStartMsRef.current = Date.now()
        },
        []
    )

    const loadQuiz = useCallback(async () => {
        if (!user) return
        try {
            setLoading(true)
            setError(null)
            const data = await generateQuizSession(user.token, {
                vocabSetId: parsedSetId,
                filterStatus: filterStatusParam,
                order: orderParam,
                limit: parsedLimit,
                mode: modeParam,
            })
            resetSessionWithQuestions(data.questions, data.vocabSetTitle)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Không thể tải bộ câu hỏi trắc nghiệm'
            setError(msg)
        } finally {
            setLoading(false)
        }
    }, [user, parsedSetId, filterStatusParam, orderParam, parsedLimit, modeParam, resetSessionWithQuestions])

    useEffect(() => {
        void loadQuiz()
    }, [loadQuiz])

    // Speak target Hanzi when entering HANZI_TO_MEANING question
    useEffect(() => {
        if (!loading && !sessionCompleted && currentQuestion && answerStatus === null) {
            if (currentQuestion.mode === 'HANZI_TO_MEANING') {
                speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)
            }
        }
    }, [loading, sessionCompleted, currentQuestion, answerStatus])

    const triggerAnswerEffects = useCallback(
        (isCorrect: boolean, isTimeout: boolean, question: QuizQuestionDto) => {
            if (settings.soundEffects) {
                if (isCorrect) {
                    playCorrectSound(settings.volume)
                } else if (isTimeout) {
                    playTimeoutSound(settings.volume)
                } else {
                    playWrongSound(settings.volume)
                }
            }
            if (isCorrect && settings.coinSound) {
                window.setTimeout(() => {
                    playCoinSound(settings.volume)
                }, 120)
            }
            // Luôn phát âm từ đúng khi xem đáp án để ghi nhớ phát âm chuẩn
            if (question.mode !== 'HANZI_TO_MEANING') {
                speakChinese(question.hanzi, question.audioUrl)
            }
        },
        [settings]
    )

    const recordQuestionOutcome = useCallback(
        (status: AnswerStatus, optionId: number | null) => {
            if (!currentQuestion || answerStatus !== null || sessionCompleted) return
            const isCorrect = status === 'CORRECT'

            setSelectedOptionId(optionId)
            setAnswerStatus(status)
            setAutoAdvanceLeft(settings.autoAdvanceDelay)
            setAutoAdvancePaused(false)

            if (isCorrect) {
                setLiveXp((prev) => prev + 2)
            }

            const nextRecord: AnsweredRecord = {
                question: currentQuestion,
                correct: isCorrect,
                status,
                selectedOptionId: optionId,
            }
            const nextRecords = [...recordsRef.current, nextRecord]
            recordsRef.current = nextRecords
            setRecords(nextRecords)

            triggerAnswerEffects(isCorrect, status === 'TIMEOUT', currentQuestion)
        },
        [currentQuestion, answerStatus, sessionCompleted, settings.autoAdvanceDelay, triggerAnswerEffects]
    )

    const handleSelectOption = useCallback(
        (option: QuizOptionDto) => {
            recordQuestionOutcome(option.correct ? 'CORRECT' : 'WRONG', option.id)
        },
        [recordQuestionOutcome]
    )

    const handleTimeout = useCallback(() => {
        recordQuestionOutcome('TIMEOUT', null)
    }, [recordQuestionOutcome])

    const finishAndSubmitSession = useCallback(
        async (finalRecords: AnsweredRecord[]) => {
            setSessionCompleted(true)
            if (!user || submittingRef.current || finalRecords.length === 0) return

            submittingRef.current = true
            setSubmitting(true)
            try {
                const answers: QuizAnswerSubmitItem[] = finalRecords.map((r) => ({
                    vocabularyId: r.question.vocabularyId,
                    correct: r.correct,
                }))
                const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStartMsRef.current) / 1000))
                const res = await submitQuizSession(user.token, {
                    vocabSetId: parsedSetId,
                    mode: modeParam,
                    durationSeconds,
                    idempotencyKey: idempotencyKeyRef.current,
                    answers,
                })
                setSubmitResult(res)
                if (settings.coinSound && res.xpEarned > 0) {
                    playCoinSound(settings.volume)
                }
            } catch (err) {
                console.error('Failed to submit quiz session:', err)
            } finally {
                setSubmitting(false)
            }
        },
        [user, parsedSetId, modeParam, settings.coinSound, settings.volume]
    )

    const handleNextQuestion = useCallback(() => {
        if (answerStatus === null) return

        if (currentIndex + 1 < questions.length) {
            setCurrentIndex((prev) => prev + 1)
            setSelectedOptionId(null)
            setAnswerStatus(null)
            setTimeLeft(settings.timePerQuestion)
            setAutoAdvanceLeft(settings.autoAdvanceDelay)
            setAutoAdvancePaused(false)
        } else {
            void finishAndSubmitSession(recordsRef.current)
        }
    }, [
        answerStatus,
        currentIndex,
        questions.length,
        settings.timePerQuestion,
        settings.autoAdvanceDelay,
        finishAndSubmitSession,
    ])

    // Countdown timer cho mỗi câu hỏi
    useEffect(() => {
        if (loading || sessionCompleted || !currentQuestion || answerStatus !== null || settingsOpen) {
            return
        }
        if (timeLeft <= 0) {
            handleTimeout()
            return
        }
        const timer = window.setTimeout(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1))
        }, 1000)
        return () => window.clearTimeout(timer)
    }, [loading, sessionCompleted, currentQuestion, answerStatus, settingsOpen, timeLeft, handleTimeout])

    // Auto-advance timer sau khi hiện đáp án
    useEffect(() => {
        if (
            loading ||
            sessionCompleted ||
            answerStatus === null ||
            !settings.autoAdvance ||
            autoAdvancePaused ||
            settingsOpen
        ) {
            return
        }
        if (autoAdvanceLeft <= 0) {
            handleNextQuestion()
            return
        }
        const timer = window.setTimeout(() => {
            setAutoAdvanceLeft((prev) => Math.max(0, prev - 1))
        }, 1000)
        return () => window.clearTimeout(timer)
    }, [
        loading,
        sessionCompleted,
        answerStatus,
        settings.autoAdvance,
        autoAdvancePaused,
        settingsOpen,
        autoAdvanceLeft,
        handleNextQuestion,
    ])

    // Keyboard shortcuts: 1-4 chọn đáp án, Ctrl+X hoặc S phát âm, Enter/Space chuyển tiếp
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
                return
            }
            if (settingsOpen || loading || sessionCompleted || !currentQuestion) return

            // Ctrl + X hoặc S để phát âm
            if ((e.ctrlKey && e.key.toLowerCase() === 'x') || (!e.ctrlKey && !e.metaKey && e.code === 'KeyS')) {
                e.preventDefault()
                speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)
                return
            }

            if (answerStatus === null) {
                const keyMap: Record<string, number> = {
                    Digit1: 0,
                    Numpad1: 0,
                    Digit2: 1,
                    Numpad2: 1,
                    Digit3: 2,
                    Numpad3: 2,
                    Digit4: 3,
                    Numpad4: 3,
                }
                const idx = keyMap[e.code]
                if (idx !== undefined && currentQuestion.options[idx]) {
                    e.preventDefault()
                    handleSelectOption(currentQuestion.options[idx])
                }
            } else if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                handleNextQuestion()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [
        settingsOpen,
        loading,
        sessionCompleted,
        currentQuestion,
        answerStatus,
        handleSelectOption,
        handleNextQuestion,
    ])

    const handleRetryWrongOnly = () => {
        const wrongQuestions = records.filter((r) => !r.correct).map((r) => r.question)
        if (wrongQuestions.length > 0) {
            resetSessionWithQuestions(wrongQuestions)
        }
    }

    const wrongRecords = useMemo(() => records.filter((r) => !r.correct), [records])
    const correctCount = records.length - wrongRecords.length
    const totalCount = questions.length
    const accuracyPercent = totalCount > 0 ? Math.round((correctCount * 100) / totalCount) : 0

    if (loading) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                <p className="mt-4 text-sm font-bold text-slate-600">Đang tạo bộ câu hỏi Trắc nghiệm...</p>
            </div>
        )
    }

    if (error || questions.length === 0) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-4">
                        <CheckSquare className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800">
                        {error ? 'Không thể tạo bài Trắc nghiệm' : 'Chưa có từ vựng phù hợp'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                        {error || 'Bộ từ bạn chọn hiện không có từ nào khớp với bộ lọc (ví dụ: tất cả từ đã thuộc).'}
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
                            onClick={() => void loadQuiz()}
                            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                        >
                            Thử tải lại
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Màn hình Tổng kết sau khi hoàn thành
    if (sessionCompleted) {
        const displayedCorrect = submitResult?.correctCount ?? correctCount
        const displayedTotal = submitResult?.totalCount ?? totalCount
        const displayedAccuracy = submitResult?.accuracyPercent ?? accuracyPercent
        const displayedXp = submitResult?.xpEarned ?? liveXp

        return (
            <div className="max-w-2xl mx-auto py-2 sm:py-4 px-1 sm:px-2 space-y-5">
                <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                        <Award className="w-9 h-9" />
                    </div>

                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                        Hoàn thành Trắc nghiệm!
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {vocabSetTitle} • Chế độ {formatModeLabel(modeParam)}
                    </p>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 sm:mt-6">
                        <div className="p-2.5 sm:p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                            <div className="text-[11px] sm:text-xs font-bold text-emerald-700">Chính xác</div>
                            <div className="text-base sm:text-xl font-extrabold text-emerald-700 mt-0.5">
                                {displayedCorrect} / {displayedTotal}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-600">{displayedAccuracy}%</div>
                        </div>

                        <div className="p-2.5 sm:p-3.5 bg-rose-50/70 border border-rose-100 rounded-2xl">
                            <div className="text-[11px] sm:text-xs font-bold text-rose-700">Cần ôn lại</div>
                            <div className="text-base sm:text-xl font-extrabold text-rose-700 mt-0.5">{wrongRecords.length}</div>
                            <div className="text-[10px] sm:text-[11px] font-semibold text-rose-600">Sai / hết giờ</div>
                        </div>

                        <div className="p-2.5 sm:p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
                            <div className="text-[11px] sm:text-xs font-bold text-amber-700">XP nhận được</div>
                            <div className="text-base sm:text-xl font-extrabold text-amber-700 mt-0.5">
                                {submitting ? '...' : `+${displayedXp}`}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-semibold text-amber-600">
                                {displayedAccuracy >= 50 ? 'Gồm +10 XP hoàn thành' : 'Cố lên nhé!'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {wrongRecords.length > 0 && (
                            <button
                                type="button"
                                onClick={handleRetryWrongOnly}
                                className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Ôn {wrongRecords.length} câu sai</span>
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => void loadQuiz()}
                            className={`py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors ${wrongRecords.length === 0 ? 'sm:col-span-1' : ''
                                }`}
                        >
                            Chơi lại bộ này
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/practice')}
                            className={`py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors ${wrongRecords.length === 0 ? 'sm:col-span-2' : ''
                                }`}
                        >
                            Quay lại Luyện tập
                        </button>
                    </div>
                </div>

                {/* Xem lại các câu sai ngay trên trang (Inline - Không Modal) */}
                {wrongRecords.length > 0 && (
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            <h3 className="text-sm font-extrabold text-slate-800">
                                Danh sách từ cần xem lại ({wrongRecords.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {wrongRecords.map((item, idx) => (
                                <div key={`${item.question.vocabularyId}-${idx}`} className="py-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-lg font-extrabold text-slate-900"
                                                style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                                            >
                                                {item.question.hanzi}
                                            </span>
                                            <span className="text-xs font-mono text-slate-500">{item.question.pinyin}</span>
                                            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                                                {formatPartOfSpeechLabel(item.question.partOfSpeech)}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-600 mt-0.5">{item.question.meaning}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => speakChinese(item.question.hanzi, item.question.audioUrl)}
                                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors shrink-0"
                                        title="Nghe phát âm"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )
    }

    const questionProgressPercent = Math.round(((currentIndex + 1) / questions.length) * 100)
    const timerPercent =
        settings.timePerQuestion > 0 ? Math.max(0, Math.min(100, Math.round((timeLeft / settings.timePerQuestion) * 100))) : 0
    const timerColorClass =
        timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 25 ? 'bg-amber-500' : 'bg-rose-500'
    const timerTextClass =
        timerPercent > 50 ? 'text-emerald-700' : timerPercent > 25 ? 'text-amber-700' : 'text-rose-600 animate-pulse'

    return (
        <div className="max-w-3xl mx-auto pb-8 sm:pb-12 space-y-3 sm:space-y-4">
            {/* 1. Header Tiến độ + Bộ đếm thời gian */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm space-y-2.5 sm:space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-800 whitespace-nowrap">
                            Câu {currentIndex + 1} / {questions.length}
                        </span>
                        <span className="inline-flex px-2 sm:px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-bold truncate max-w-[160px] sm:max-w-xs">
                            {vocabSetTitle} • {formatModeLabel(modeParam)}
                        </span>
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
                            onClick={() => void loadQuiz()}
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

                {/* Thanh tiến độ tổng số câu */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                        style={{ width: `${questionProgressPercent}%` }}
                    />
                </div>

                {/* Hàng XP hiện tại + Thanh đếm ngược thời gian */}
                <div className="flex items-center gap-3 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold shrink-0">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>+{liveXp}</span>
                    </div>

                    <div className="flex-1 flex items-center gap-2.5">
                        <span className={`inline-flex items-center gap-1 text-xs font-extrabold w-11 ${timerTextClass}`}>
                            <Clock className="w-3.5 h-3.5" />
                            {timeLeft}s
                        </span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${timerColorClass}`}
                                style={{ width: `${timerPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Thẻ Câu Hỏi Trung Tâm */}
            {currentQuestion && (
                <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm space-y-5 sm:space-y-6">
                    {/* Prompt Section tùy biến theo 3 layout hiệu lực */}
                    <div className="text-center space-y-2.5 sm:space-y-3">
                        {currentQuestion.mode === 'CONTEXT' ? (
                            <>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold tracking-wider uppercase">
                                    <Sparkles className="w-3 h-3" />
                                    Ngữ cảnh
                                </span>
                                <p className="text-xs font-semibold text-slate-500">
                                    Chọn từ phù hợp để điền vào chỗ trống
                                </p>

                                <div
                                    className="text-lg sm:text-2xl font-bold text-slate-900 leading-relaxed py-1 sm:py-2 break-words"
                                    style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                                >
                                    {(currentQuestion.maskedSentence || '').split('____').map((part, idx, arr) => (
                                        <React.Fragment key={idx}>
                                            <span>{part}</span>
                                            {idx < arr.length - 1 && (
                                                <span className="inline-flex items-center justify-center min-w-[3.5rem] sm:min-w-[4rem] px-2 sm:px-2.5 py-0.5 mx-1 sm:mx-1.5 rounded-lg border-b-2 border-amber-500 bg-amber-50 text-amber-700 font-extrabold text-base sm:text-lg">
                                                    {answerStatus !== null ? currentQuestion.hanzi : '____'}
                                                </span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {currentQuestion.exampleMeaning && (
                                    <p className="text-xs sm:text-sm italic text-slate-500 max-w-xl mx-auto">
                                        {currentQuestion.exampleMeaning}
                                    </p>
                                )}

                                <div className="flex items-center justify-center gap-2.5 pt-1">
                                    <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-extrabold uppercase">
                                        {formatPartOfSpeechLabel(currentQuestion.partOfSpeech)}
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
                            </>
                        ) : currentQuestion.mode === 'HANZI_TO_MEANING' ? (
                            <>
                                <h2
                                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-wide pt-1 sm:pt-2 break-words"
                                    style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                                >
                                    {currentQuestion.hanzi}
                                </h2>

                                <div className="flex items-center justify-center gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)}
                                        className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                                        title="Phát âm từ này"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <span className="px-2.5 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-extrabold uppercase">
                                        {formatPartOfSpeechLabel(currentQuestion.partOfSpeech)}
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
                                        {currentQuestion.pinyin}
                                    </p>
                                )}

                                <div className="hidden md:block">
                                    <button
                                        type="button"
                                        onClick={() => speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition-colors"
                                    >
                                        <span>Phím tắt: Ctrl + X hoặc S để phát âm</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* MEANING_TO_HANZI */
                            <>
                                <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight pt-1 sm:pt-2 break-words">
                                    {currentQuestion.meaning}
                                </h2>

                                <div className="flex items-center justify-center gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)}
                                        className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors"
                                        title="Gợi ý phát âm"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHidePinyin((p) => !p)}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                    >
                                        {hidePinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                        <span>{hidePinyin ? 'Hiện pinyin' : 'Ẩn pinyin'}</span>
                                    </button>
                                </div>

                                <div className="hidden md:block">
                                    <button
                                        type="button"
                                        onClick={() => speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition-colors"
                                    >
                                        <span>Phím tắt: Ctrl + X hoặc S để phát âm</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 4 Phương án lựa chọn */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                        {currentQuestion.options.map((opt, idx) => {
                            const isAnswered = answerStatus !== null
                            const isSelected = selectedOptionId === opt.id

                            let cardStyle =
                                'bg-slate-50/70 hover:bg-emerald-50/60 border-slate-200 hover:border-emerald-400 text-slate-800'
                            let badgeStyle = 'bg-white border-slate-200 text-slate-500'

                            if (isAnswered) {
                                if (opt.correct) {
                                    cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                                    badgeStyle = 'bg-emerald-600 border-emerald-600 text-white'
                                } else if (isSelected && !opt.correct) {
                                    cardStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-500/20'
                                    badgeStyle = 'bg-rose-600 border-rose-600 text-white'
                                } else {
                                    cardStyle = 'bg-slate-50/40 border-slate-200/70 text-slate-400 opacity-60'
                                    badgeStyle = 'bg-slate-100 border-slate-200 text-slate-400'
                                }
                            }

                            return (
                                <button
                                    key={`${currentQuestion.vocabularyId}-${opt.id}-${idx}`}
                                    type="button"
                                    disabled={isAnswered}
                                    onClick={() => handleSelectOption(opt)}
                                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 active:scale-[0.99] disabled:active:scale-100 ${cardStyle}`}
                                >
                                    <span
                                        className={`w-7 h-7 rounded-full border text-xs font-extrabold flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                                    >
                                        {idx + 1}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="text-sm sm:text-base font-bold leading-snug break-words"
                                            style={
                                                currentQuestion.mode !== 'HANZI_TO_MEANING'
                                                    ? { fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }
                                                    : undefined
                                            }
                                        >
                                            {opt.label}
                                        </div>
                                        {opt.subLabel && !hidePinyin && (
                                            <div className="text-xs font-mono opacity-75 mt-0.5 truncate">{opt.subLabel}</div>
                                        )}
                                    </div>

                                    {isAnswered && opt.correct && (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                    )}
                                    {isAnswered && isSelected && !opt.correct && (
                                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div className="hidden md:block text-center text-[11px] font-medium text-slate-400">
                        Sử dụng phím số <span className="font-bold text-slate-600">1–4</span> để chọn nhanh đáp án
                        {answerStatus !== null && (
                            <>
                                {' '}
                                • Nhấn <span className="font-bold text-slate-600">Enter / Space</span> để sang câu tiếp
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 3. Sticky Bottom Feedback Banner căn gọn theo chiều rộng nội dung (không bị AppSidebar che trên Tablet/Desktop) */}
            {answerStatus !== null && currentQuestion && (
                <div
                    className={`sticky bottom-2 sm:bottom-4 z-30 rounded-2xl shadow-xl border transition-all ${answerStatus === 'CORRECT'
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-rose-600 border-rose-500 text-white'
                        }`}
                >
                    <div className="px-3.5 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => speakChinese(currentQuestion.hanzi, currentQuestion.audioUrl)}
                                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
                                    title="Nghe lại phát âm từ"
                                >
                                    <Volume2 className="w-4 h-4 text-white" />
                                </button>
                                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-black/15">
                                    {answerStatus === 'CORRECT'
                                        ? 'Chính xác'
                                        : answerStatus === 'TIMEOUT'
                                            ? 'Hết thời gian'
                                            : 'Chưa chính xác'}
                                </span>
                                <span className="text-xs sm:text-sm font-bold">
                                    Từ:{' '}
                                    <strong
                                        className="text-sm sm:text-base"
                                        style={{ fontFamily: `'Noto Serif SC', 'PingFang SC', serif` }}
                                    >
                                        {currentQuestion.hanzi}
                                    </strong>{' '}
                                    <span className="text-[11px] sm:text-xs opacity-90">
                                        ({formatPartOfSpeechLabel(currentQuestion.partOfSpeech)})
                                    </span>
                                </span>
                                <span className="text-xs font-mono opacity-90">/{currentQuestion.pinyin}/</span>
                            </div>

                            <div className="text-xs sm:text-sm font-semibold sm:pl-9">
                                <span className="opacity-85">Nghĩa:</span> {currentQuestion.meaning}
                            </div>

                            {currentQuestion.exampleSentence && (
                                <div className="flex items-start gap-1.5 text-xs sm:pl-9 opacity-95">
                                    <button
                                        type="button"
                                        onClick={() => speakChinese(currentQuestion.exampleSentence)}
                                        className="mt-0.5 hover:opacity-80 shrink-0"
                                        title="Nghe câu ví dụ"
                                    >
                                        <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="line-clamp-2 sm:line-clamp-none">
                                        <span className="font-bold">Ví dụ:</span> {currentQuestion.exampleSentence}
                                        {currentQuestion.exampleMeaning ? ` (${currentQuestion.exampleMeaning})` : ''}
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
                                    title={autoAdvancePaused ? 'Tiếp tục đếm ngược chuyển câu' : 'Tạm dừng tự động chuyển câu'}
                                >
                                    {autoAdvancePaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleNextQuestion}
                                className={`flex-1 sm:flex-none min-h-[42px] px-5 py-2.5 rounded-xl bg-white font-extrabold text-sm shadow-md active:scale-95 transition-all whitespace-nowrap ${answerStatus === 'CORRECT' ? 'text-emerald-700 hover:bg-emerald-50' : 'text-rose-700 hover:bg-rose-50'
                                    }`}
                            >
                                {currentIndex + 1 >= questions.length ? 'Xem kết quả' : 'Tiếp tục'}
                                {settings.autoAdvance && !autoAdvancePaused ? ` (${autoAdvanceLeft}s)` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Slide-over Cài đặt game ngay khi cần chỉnh trong lúc chơi */}
            <GameSettingsDrawer
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={settings}
                onChange={setSettings}
            />
        </div>
    )
}