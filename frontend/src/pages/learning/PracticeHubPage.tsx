import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Layers,
    Sparkles,
    CheckSquare,
    LayoutGrid,
    PenTool,
    Type,
    Headphones,
    RefreshCw,
    Play,
    SlidersHorizontal,
    Shuffle,
    Clock,
    Filter,
    TrendingUp,
    History,
    Gamepad2,
    Coins,
    Settings,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
    getPracticeAccessibleVocabSets,
    getStudentWords,
    type VocabSetSummary,
    type StudentWordsStats,
} from '../../api/vocabManagement'
import {
    getPracticeHistory,
    type MatchMode,
    type PracticeSessionHistoryItem,
    type QuizMode,
    type WritingMode,
} from '../../api/vocabPractice'
import {
    loadPracticeSettings,
    type PracticeGameSettings,
} from '../../utils/practiceSettings'
import { GameSettingsDrawer } from '../../components/practice/GameSettingsDrawer'
import { QuizModeDrawer } from '../../components/practice/QuizModeDrawer'
import { MatchModeDrawer } from '../../components/practice/MatchModeDrawer'
import { WritingModeDrawer } from '../../components/practice/WritingModeDrawer'
import { PracticeFilterNoticeBanner } from '../../components/practice/PracticeFilterNoticeBanner'
import {
    normalizePracticeFilterStatus,
    type PracticeFilterStatus,
} from '../../utils/practiceFilter'

export const PracticeHubPage: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [vocabSets, setVocabSets] = useState<VocabSetSummary[]>([])

    // Practice configurations
    const [selectedSetId, setSelectedSetId] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<PracticeFilterStatus>('UNMASTERED')
    const [order, setOrder] = useState<'RANDOM' | 'DEFAULT'>('RANDOM')
    const [limit, setLimit] = useState<string>('20')

    // Track whether the user deliberately selected a filter for the active vocab set
    const manualFilterRef = useRef(false)
    const [autoFilterNotice, setAutoFilterNotice] = useState<string | null>(null)

    // Stats for the chosen set & filter
    const [stats, setStats] = useState<StudentWordsStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [reloadTick, setReloadTick] = useState(0)

    // Game settings, mode drawer & practice history
    const [gameSettings, setGameSettings] = useState<PracticeGameSettings>(() => loadPracticeSettings())
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [quizDrawerOpen, setQuizDrawerOpen] = useState(false)
    const [matchDrawerOpen, setMatchDrawerOpen] = useState(false)
    const [writingDrawerOpen, setWritingDrawerOpen] = useState(false)
    const [historyItems, setHistoryItems] = useState<PracticeSessionHistoryItem[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)

    // 1. Load available vocab sets (owned + active enrolled classroom sets)
    useEffect(() => {
        if (!user) return
        let isMounted = true
        setLoadError(null)
        getPracticeAccessibleVocabSets(user.token)
            .then((sets: VocabSetSummary[]) => {
                if (isMounted) {
                    setVocabSets(sets)
                }
            })
            .catch((err: unknown) => {
                console.error('Failed to load vocab sets for practice:', err)
                if (isMounted) {
                    setLoadError(err instanceof Error ? err.message : 'Không thể tải danh sách bộ từ vựng')
                }
            })
        return () => {
            isMounted = false
        }
    }, [user, reloadTick])

    // 2. Load stats for selected set
    useEffect(() => {
        if (!user) return
        let isMounted = true
        setLoadingStats(true)
        setLoadError(null)
        const setIdNum = selectedSetId === 'all' ? undefined : parseInt(selectedSetId, 10)
        getStudentWords(user.token, { vocabSetId: setIdNum, page: 0, size: 1 })
            .then((res) => {
                if (isMounted) {
                    setStats(res.stats)
                }
            })
            .catch((err: unknown) => {
                console.error('Failed to load stats:', err)
                if (isMounted) {
                    setStats(null)
                    setLoadError(err instanceof Error ? err.message : 'Không thể tải thống kê từ vựng')
                }
            })
            .finally(() => {
                if (isMounted) setLoadingStats(false)
            })
        return () => {
            isMounted = false
        }
    }, [user, selectedSetId, reloadTick])

    // Tự động chuyển sang 'Tất cả từ' khi bộ từ đã đạt 100% (hết từ chưa thuộc) để tránh khóa hết game
    useEffect(() => {
        if (!stats) return
        if (
            !manualFilterRef.current &&
            filterStatus === 'UNMASTERED' &&
            stats.totalWords > 0 &&
            stats.unmasteredWords === 0
        ) {
            setFilterStatus('ALL')
            setAutoFilterNotice(
                `Bạn đã thuộc 100% (${stats.totalWords} từ) — tự động chuyển sang "Tất cả từ" để tiếp tục ôn tập.`
            )
        }
    }, [stats, filterStatus])

    // 3. Load practice session history
    useEffect(() => {
        if (!user) return
        let isMounted = true
        setLoadingHistory(true)
        getPracticeHistory(user.token, 5)
            .then((items) => {
                if (isMounted) setHistoryItems(items)
            })
            .catch((err: unknown) => console.error('Failed to load practice history:', err))
            .finally(() => {
                if (isMounted) setLoadingHistory(false)
            })
        return () => {
            isMounted = false
        }
    }, [user])

    // Count available words based on filterStatus
    const readyWordCount = useMemo(() => {
        if (!stats) return 0
        if (filterStatus === 'UNMASTERED') return stats.unmasteredWords
        if (filterStatus === 'MASTERED') return stats.masteredWords
        return stats.totalWords
    }, [stats, filterStatus])

        const buildFilterQueryParams = () => {
            const params = new URLSearchParams()
            if (selectedSetId !== 'all') {
                params.append('vocabSetId', selectedSetId)
            }
            params.append('filterStatus', filterStatus)
            params.append('order', order)
            if (limit !== 'all') {
                params.append('limit', limit)
            }
            return params
        }

        // Launch Flashcard session directly
        const handleStartFlashcard = () => {
            if (readyWordCount === 0) return
            navigate(`/practice/flashcard?${buildFilterQueryParams().toString()}`)
        }

        // Launch Quiz with chosen mode
        const handleStartQuiz = (mode: QuizMode) => {
            if (readyWordCount === 0) return
            const params = buildFilterQueryParams()
            params.append('mode', mode)
            setQuizDrawerOpen(false)
            navigate(`/practice/quiz?${params.toString()}`)
        }

        // Launch Match with chosen mode
        const handleStartMatch = (mode: MatchMode) => {
            if (readyWordCount === 0) return
            const params = buildFilterQueryParams()
            params.append('mode', mode)
            setMatchDrawerOpen(false)
            navigate(`/practice/match?${params.toString()}`)
        }

        // Launch Writing Practice (TRACE / RECALL) or PDF Worksheet Generator
        const handleStartWriting = (mode: WritingMode) => {
            if (mode === 'PDF') {
                const params = new URLSearchParams()
                if (selectedSetId !== 'all') {
                    params.append('vocabSetId', selectedSetId)
                }
                params.append('filterStatus', filterStatus)
                params.append('order', order)
                setWritingDrawerOpen(false)
                navigate(`/practice/writing/pdf?${params.toString()}`)
                return
            }

            if (readyWordCount === 0) return
            const params = buildFilterQueryParams()
            params.append('mode', mode)
            setWritingDrawerOpen(false)
            navigate(`/practice/writing?${params.toString()}`)
        }

        return (
            <div className="max-w-7xl mx-auto space-y-4">
                {/* 1. Thanh 4 ô Cấu hình nhỏ gọn trên cùng (Responsive 2x2 Mobile/Tablet -> 4x1 Desktop) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {/* Bộ từ vựng */}
                    <div className="bg-white border border-slate-200 rounded-2xl px-2.5 sm:px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors min-w-0">
                        <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Bộ từ vựng</div>
                        <div className="relative flex items-center">
                            <select
                                id="practice-vocab-set"
                                name="vocabSetId"
                                aria-label="Chọn bộ từ vựng"
                                value={selectedSetId}
                                onChange={(e) => {
                                    manualFilterRef.current = false
                                    setAutoFilterNotice(null)
                                    setSelectedSetId(e.target.value)
                                }}
                                className="w-full min-h-[34px] appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer truncate"
                            >
                                <option value="all">Tất cả bộ từ</option>
                                {vocabSets.map((set) => (
                                    <option key={set.id} value={set.id.toString()}>
                                        {set.title} ({set.wordCount})
                                    </option>
                                ))}
                            </select>
                            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0.5" />
                        </div>
                    </div>

                    {/* Bộ lọc */}
                    <div className="bg-white border border-slate-200 rounded-2xl px-2.5 sm:px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors min-w-0">
                        <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Bộ lọc</div>
                        <div className="relative flex items-center">
                            <select
                                id="practice-filter-status"
                                name="filterStatus"
                                aria-label="Chọn bộ lọc trạng thái từ"
                                value={filterStatus}
                                onChange={(e) => {
                                    manualFilterRef.current = true
                                    setAutoFilterNotice(null)
                                    setFilterStatus(normalizePracticeFilterStatus(e.target.value))
                                }}
                                className="w-full min-h-[34px] appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer"
                            >
                                <option value="UNMASTERED">Chưa thuộc</option>
                                <option value="ALL">Tất cả từ</option>
                                <option value="MASTERED">Đã thuộc</option>
                            </select>
                            <Filter className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0.5" />
                        </div>
                    </div>

                    {/* Thứ tự */}
                    <div className="bg-white border border-slate-200 rounded-2xl px-2.5 sm:px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors min-w-0">
                        <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Thứ tự</div>
                        <div className="relative flex items-center">
                            <select
                                id="practice-order"
                                name="order"
                                aria-label="Chọn thứ tự từ"
                                value={order}
                                onChange={(e) => setOrder(e.target.value === 'DEFAULT' ? 'DEFAULT' : 'RANDOM')}
                                className="w-full min-h-[34px] appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer"
                            >
                                <option value="RANDOM">Ngẫu nhiên</option>
                                <option value="DEFAULT">Mặc định</option>
                            </select>
                            <Shuffle className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0.5" />
                        </div>
                    </div>

                    {/* Số lượng */}
                    <div className="bg-white border border-slate-200 rounded-2xl px-2.5 sm:px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors min-w-0">
                        <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Số lượng</div>
                        <div className="relative flex items-center">
                            <select
                                id="practice-limit"
                                name="limit"
                                aria-label="Chọn số lượng từ luyện tập"
                                value={limit}
                                onChange={(e) => setLimit(e.target.value)}
                                className="w-full min-h-[34px] appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer"
                            >
                                <option value="10">10 từ</option>
                                <option value="20">20 từ</option>
                                <option value="50">50 từ</option>
                                <option value="all">Tất cả</option>
                            </select>
                            <Clock className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0.5" />
                        </div>
                    </div>
                </div>

                {/* 2. Dòng trạng thái Chọn game + Cài đặt & Số từ sẵn sàng */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-extrabold text-slate-700">
                        <span>Chọn game:</span>
                        <button
                            type="button"
                            onClick={() => setSettingsOpen(true)}
                            title="Cài đặt âm thanh & thời gian"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-600 hover:text-emerald-700 bg-white sm:bg-transparent hover:bg-emerald-50 border border-slate-200 sm:border-transparent hover:border-emerald-200 transition-colors text-xs font-bold"
                        >
                            <Settings className="w-4 h-4" />
                            <span>{gameSettings.timePerQuestion}s</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-lg bg-slate-200/70 text-slate-700 text-[11px] sm:text-xs font-extrabold">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            {stats ? `${stats.progressPercent}%` : '0%'}
                        </span>
                        <span className="px-2 sm:px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-extrabold tracking-wide uppercase">
                            {loadingStats ? '...' : `${readyWordCount} từ sẵn sàng`}
                        </span>
                    </div>
                </div>

                {loadError && (
                    <PracticeFilterNoticeBanner
                        message={loadError}
                        tone="amber"
                        actionLabel="Thử lại"
                        onAction={() => setReloadTick((prev) => prev + 1)}
                    />
                )}

                {autoFilterNotice && (
                    <PracticeFilterNoticeBanner
                        message={autoFilterNotice}
                        tone="emerald"
                        onDismiss={() => setAutoFilterNotice(null)}
                    />
                )}

                {!loadingStats && stats && stats.totalWords > 0 && readyWordCount === 0 && (
                    <PracticeFilterNoticeBanner
                        message={
                            filterStatus === 'UNMASTERED'
                                ? `Bạn đã thuộc hết ${stats.totalWords} từ trong bộ này.`
                                : 'Chưa có từ nào trong bộ này được đánh dấu đã thuộc.'
                        }
                        tone="amber"
                        actionLabel="Ôn Tất cả từ"
                        onAction={() => {
                            manualFilterRef.current = true
                            setAutoFilterNotice(null)
                            setFilterStatus('ALL')
                        }}
                    />
                )}

                {/* 3. Lưới 7 Thẻ Game Responsive: Mobile 2 cột -> Tablet 3/4 cột -> Desktop XL 7 cột */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
                    {/* 3.1 Flashcard (Active & Clickable) */}
                    <button
                        type="button"
                        onClick={handleStartFlashcard}
                        disabled={readyWordCount === 0}
                        className="group relative rounded-2xl p-3 sm:p-3.5 bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:-translate-y-1 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex flex-col items-center justify-between text-center min-h-[140px] sm:min-h-[158px] xl:min-h-[168px]"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Layers className="w-5 h-5 text-white" />
                        </div>

                        <div className="my-2">
                            <div className="text-sm font-extrabold tracking-tight">Flashcard</div>
                            <div className="text-[11px] text-indigo-100 leading-tight mt-1">
                                Lật thẻ học từ vựng
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-bold">
                            <span>+5</span>
                            <Coins className="w-3 h-3 text-amber-300" />
                        </div>
                    </button>

                        {/* 3.2 Trắc nghiệm (Active & Clickable -> QuizModeDrawer) */}
        <button
                        type="button"
                        onClick={() => setQuizDrawerOpen(true)}
                        disabled={readyWordCount === 0}
                        className="group relative rounded-2xl p-3 sm:p-3.5 bg-gradient-to-b from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20 hover:-translate-y-1 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex flex-col items-center justify-between text-center min-h-[140px] sm:min-h-[158px] xl:min-h-[168px]"
                    >
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                <CheckSquare className="w-5 h-5 text-white" />
                            </div>

                            <div className="my-2">
                                <div className="text-sm font-extrabold tracking-tight">Trắc nghiệm</div>
                                    <div className="text-[11px] text-amber-100 leading-tight mt-1">
                                        Chọn đáp án đúng
                                    </div>
                                </div>

                                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-bold">
                                        <span>+10</span>
                                        <Coins className="w-3 h-3 text-amber-300" />
                                    </div>
                            </button>

                            {/* 3.3 Nối từ (Active & Clickable -> MatchModeDrawer) */}
                            <button
                                type="button"
                                onClick={() => setMatchDrawerOpen(true)}
                                disabled={readyWordCount === 0}
                                className="group relative rounded-2xl p-3 sm:p-3.5 bg-gradient-to-b from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20 hover:-translate-y-1 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex flex-col items-center justify-between text-center min-h-[140px] sm:min-h-[158px] xl:min-h-[168px]"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                                    <LayoutGrid className="w-5 h-5 text-white" />
                                </div>

                                <div className="my-2">
                                    <div className="text-sm font-extrabold tracking-tight">Nối từ</div>
                                    <div className="text-[11px] text-sky-100 leading-tight mt-1">
                                        Nối nghĩa hoặc pinyin
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/20 text-[11px] font-bold">
                                    <span>+10</span>
                                    <Coins className="w-3 h-3 text-amber-300" />
                                </div>
                            </button>

                            {/* 3.4 Viết chữ (Active — SlideOver Drawer) */}
                            <button
                                type="button"
                                onClick={() => setWritingDrawerOpen(true)}
                                disabled={loadingStats}
                                className="group relative rounded-2xl p-3 sm:p-3.5 bg-teal-500 hover:bg-teal-600 border border-teal-500 text-white shadow-md shadow-teal-500/20 flex flex-col items-center justify-between text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed min-h-[140px] sm:min-h-[158px] xl:min-h-[168px]"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <PenTool className="w-5 h-5" />
                                </div>

                                <div className="my-2">
                                    <div className="text-sm font-extrabold tracking-tight">Viết chữ</div>
                                    <div className="text-[11px] text-teal-50/90 leading-tight mt-1">
                                        Đồ nét, viết nhớ &amp; PDF
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                                    <span>+15</span>
                                    <Coins className="w-3 h-3 text-amber-300" />
                                </div>
                            </button>

                            {/* 3.5 Gõ từ (Sắp có) */}
                            <div
                                title="Sắp ra mắt trong Milestone 5"
                                className="relative rounded-2xl p-3 sm:p-3.5 bg-emerald-50 border border-emerald-200/90 text-emerald-950 flex flex-col items-center justify-between text-center min-h-[140px] sm:min-h-[158px] xl:min-h-[168px] opacity-80 select-none"
                            >
                                <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900">
                                    Sắp có
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Type className="w-5 h-5" />
                                </div>

                                <div className="my-2">
                                    <div className="text-sm font-extrabold tracking-tight">Gõ từ</div>
                                    <div className="text-[11px] text-emerald-800/80 leading-tight mt-1">
                                        Nhìn nghĩa và gõ từ
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 text-[11px] font-bold">
                                    <span>+10</span>
                                    <Coins className="w-3 h-3 text-amber-600" />
                                </div>
                            </div>

                            {/* 3.6 Nghe viết (Sắp có) */}
                            <div
                                title="Sắp ra mắt trong Milestone 6"
                                className="relative rounded-2xl p-3 sm:p-3.5 bg-blue-50 border border-blue-200/90 text-blue-950 flex flex-col items-center justify-between text-center min-h-[140px] sm:min-h-[158px] xl:min-h-[168px] opacity-80 select-none"
                            >
                                <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-200/80 text-blue-900">
                                    Sắp có
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Headphones className="w-5 h-5" />
                                </div>

                                <div className="my-2">
                                    <div className="text-sm font-extrabold tracking-tight">Nghe viết</div>
                                    <div className="text-[11px] text-blue-800/80 leading-tight mt-1">
                                        Nghe phát âm và gõ
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-200/60 text-blue-900 text-[11px] font-bold">
                                    <span>+15</span>
                                    <Coins className="w-3 h-3 text-amber-600" />
                                </div>
                            </div>

                            {/* 3.7 Game đặc biệt (Tự động dàn đều hàng cuối trên mobile & tablet) */}
                            <div
                                title="Sắp ra mắt"
                                className="col-span-2 sm:col-span-3 md:col-span-2 xl:col-span-1 relative rounded-2xl p-3 sm:p-3.5 bg-rose-50 border border-rose-200/90 text-rose-950 flex flex-col items-center justify-between text-center min-h-[120px] sm:min-h-[136px] md:min-h-[158px] xl:min-h-[168px] opacity-80 select-none"
                            >
                                <span className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">
                                    HOT
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>

                                <div className="my-2">
                                    <div className="text-sm font-extrabold tracking-tight">Game đặc biệt</div>
                                    <div className="text-[11px] text-rose-800/80 leading-tight mt-1">
                                        Dịch câu, đặt câu AI
                                    </div>
                                </div>

                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-200/60 text-rose-900 text-[11px] font-bold">
                                    <span>+20</span>
                                    <Coins className="w-3 h-3 text-amber-600" />
                                </div>
                            </div>
                        </div>

                        {/* 4. Banner Ôn tập ngắt quãng (SRS) Nhỏ Gọn 1 Hàng */}
                        <div className="rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 px-5 py-4 text-white shadow-md shadow-purple-500/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                    <RefreshCw className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
                                        Ôn tập ngắt quãng (SRS)
                                    </h3>
                                    <p className="text-xs text-purple-100">
                                        Hệ thống tự động nhắc lại các từ vựng bạn sắp quên. Học ít, nhớ lâu!
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/srs/review')}
                                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-purple-700 font-extrabold text-xs shadow-sm active:scale-95 transition-all inline-flex items-center justify-center gap-1.5 whitespace-nowrap flex-shrink-0"
                            >
                                <Play className="w-3.5 h-3.5 fill-purple-700" />
                                <span>Bắt đầu ôn tập</span>
                            </button>
                        </div>

                        {/* 5. Lịch sử luyện tập Gọn gàng bên dưới */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                                <History className="w-4 h-4" />
                                            </div>
                                            <h3 className="text-sm font-extrabold text-slate-800">Lịch sử luyện tập</h3>
                                        </div>
                                        {historyItems.length > 0 && (
                                            <span className="text-[11px] font-bold text-slate-400">
                                                {historyItems.length} lượt gần nhất
                                            </span>
                                        )}
                                    </div>

                                    {loadingHistory ? (
                                        <div className="py-4 text-center text-xs font-medium text-slate-400">
                                            Đang tải lịch sử...
                                        </div>
                                    ) : historyItems.length === 0 ? (
                                        <div className="py-5 border border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                                            <Gamepad2 className="w-4 h-4 text-slate-300" />
                                            <span>Chưa có lịch sử luyện tập. Hãy chơi thử một game nhé!</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2.5">
                                            {historyItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-2 flex flex-col justify-between gap-1"
                                                >
                                                    <div className="flex items-center justify-between gap-1.5">
                                                        <span
                                                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md truncate ${
                                                                item.gameType === 'MATCH'
                                                                    ? 'text-sky-700 bg-sky-100/90'
                                                                    : item.gameType === 'WRITING'
                                                                        ? 'text-teal-800 bg-teal-100/90'
                                                                        : 'text-amber-700 bg-amber-100/80'
                                                            }`}
                                                        >
                                                            {item.gameType === 'QUIZ'
                                                                ? 'Trắc nghiệm'
                                                                : item.gameType === 'MATCH'
                                                                    ? 'Nối từ'
                                                                    : item.gameType === 'WRITING'
                                                                        ? item.gameMode === 'RECALL'
                                                                            ? 'Viết nhớ'
                                                                            : 'Đồ nét'
                                                                        : item.gameType}
                                                        </span>
                                                        <span className="text-[11px] font-extrabold text-emerald-700">
                                                            +{item.xpEarned} XP
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-800 truncate" title={item.vocabSetTitle}>
                                                        {item.vocabSetTitle}
                                                    </div>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                        <span>
                                                            {item.correctCount}/{item.totalCount} đúng ({item.accuracyPercent}%)
                                                        </span>
                                                        <span>{item.durationSeconds}s</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Drawers (GEMINI.md Rule 4: Slide-over Drawer, không dùng Modal/Popup) */}
                                <GameSettingsDrawer
                                    open={settingsOpen}
                                    onClose={() => setSettingsOpen(false)}
                                    settings={gameSettings}
                                    onChange={setGameSettings}
                                />

                                <QuizModeDrawer
                                    open={quizDrawerOpen}
                                    onClose={() => setQuizDrawerOpen(false)}
                                    readyWordCount={readyWordCount}
                                    onSelectMode={handleStartQuiz}
                                />

                                <MatchModeDrawer
                                    open={matchDrawerOpen}
                                    onClose={() => setMatchDrawerOpen(false)}
                                    readyWordCount={readyWordCount}
                                    onSelectMode={handleStartMatch}
                                />

                                <WritingModeDrawer
                                    open={writingDrawerOpen}
                                    onClose={() => setWritingDrawerOpen(false)}
                                    readyWordCount={readyWordCount}
                                    onSelectMode={handleStartWriting}
                                />
                            </div>
                            )
}
