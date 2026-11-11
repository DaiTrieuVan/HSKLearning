import React, { useState, useEffect, useMemo } from 'react'
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
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyVocabSets,
  getStudentWords,
  type VocabSetSummary,
  type StudentWordsStats,
} from '../../api/vocabManagement'

export const PracticeHubPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [vocabSets, setVocabSets] = useState<VocabSetSummary[]>([])

  // Practice configurations
  const [selectedSetId, setSelectedSetId] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'UNMASTERED' | 'MASTERED' | 'ALL'>('UNMASTERED')
  const [order, setOrder] = useState<'RANDOM' | 'DEFAULT'>('RANDOM')
  const [limit, setLimit] = useState<string>('20')

  // Stats for the chosen set & filter
  const [stats, setStats] = useState<StudentWordsStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)

  // 1. Load available vocab sets
  useEffect(() => {
    if (!user) return
    let isMounted = true
    getMyVocabSets(user.token)
      .then((sets: VocabSetSummary[]) => {
        if (isMounted) {
          setVocabSets(sets)
        }
      })
      .catch((err: unknown) => console.error('Failed to load vocab sets for practice:', err))
    return () => {
      isMounted = false
    }
  }, [user])

  // 2. Load stats for selected set
  useEffect(() => {
    if (!user) return
    let isMounted = true
    setLoadingStats(true)
    const setIdNum = selectedSetId === 'all' ? undefined : parseInt(selectedSetId, 10)
    getStudentWords(user.token, { vocabSetId: setIdNum, page: 0, size: 1 })
      .then((res) => {
        if (isMounted) {
          setStats(res.stats)
        }
      })
      .catch((err: unknown) => console.error('Failed to load stats:', err))
      .finally(() => {
        if (isMounted) setLoadingStats(false)
      })
    return () => {
      isMounted = false
    }
  }, [user, selectedSetId])

  // Count available words based on filterStatus
  const readyWordCount = useMemo(() => {
    if (!stats) return 0
    if (filterStatus === 'UNMASTERED') return stats.unmasteredWords
    if (filterStatus === 'MASTERED') return stats.masteredWords
    return stats.totalWords
  }, [stats, filterStatus])

  // Launch Flashcard session directly
  const handleStartFlashcard = () => {
    if (readyWordCount === 0) return
    const params = new URLSearchParams()
    if (selectedSetId !== 'all') {
      params.append('vocabSetId', selectedSetId)
    }
    params.append('filterStatus', filterStatus)
    params.append('order', order)
    if (limit !== 'all') {
      params.append('limit', limit)
    }
    navigate(`/practice/flashcard?${params.toString()}`)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {/* 1. Thanh 4 ô Cấu hình nhỏ gọn trên cùng (Không có header cồng kềnh) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Bộ từ vựng */}
        <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Bộ từ vựng</div>
          <div className="relative flex items-center">
            <select
              value={selectedSetId}
              onChange={(e) => setSelectedSetId(e.target.value)}
              className="w-full appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer truncate"
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
        <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Bộ lọc</div>
          <div className="relative flex items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="UNMASTERED">Chưa thuộc</option>
              <option value="ALL">Tất cả từ</option>
              <option value="MASTERED">Đã thuộc</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0.5" />
          </div>
        </div>

        {/* Thứ tự */}
        <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Thứ tự</div>
          <div className="relative flex items-center">
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as any)}
              className="w-full appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="RANDOM">Ngẫu nhiên</option>
              <option value="DEFAULT">Mặc định</option>
            </select>
            <Shuffle className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-0.5" />
          </div>
        </div>

        {/* Số lượng */}
        <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 shadow-sm hover:border-slate-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-400 text-center mb-0.5">Số lượng</div>
          <div className="relative flex items-center">
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full appearance-none bg-transparent text-slate-800 font-bold text-xs sm:text-sm text-center pr-5 py-0.5 focus:outline-none cursor-pointer"
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

      {/* 2. Dòng trạng thái Chọn game & Số từ sẵn sàng */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-700">
          <span>Chọn game:</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-200/70 text-slate-700 text-xs font-extrabold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            {stats ? `${stats.progressPercent}%` : '0%'}
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wide uppercase">
            {loadingStats ? '...' : `${readyWordCount} từ sẵn sàng`}
          </span>
        </div>
      </div>

      {/* 3. Lưới 7 Thẻ Game Nằm Gọn 1 Hàng Ngang */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 3.1 Flashcard (Active & Clickable) */}
        <button
          type="button"
          onClick={handleStartFlashcard}
          disabled={readyWordCount === 0}
          className="group relative rounded-2xl p-3.5 bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:-translate-y-1 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex flex-col items-center justify-between text-center min-h-[168px]"
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

        {/* 3.2 Trắc nghiệm (Sắp có) */}
        <div
          title="Sắp ra mắt trong Milestone 2"
          className="relative rounded-2xl p-3.5 bg-amber-50 border border-amber-200/90 text-amber-950 flex flex-col items-center justify-between text-center min-h-[168px] opacity-80 select-none"
        >
          <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
            Sắp có
          </span>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>

          <div className="my-2">
            <div className="text-sm font-extrabold tracking-tight">Trắc nghiệm</div>
            <div className="text-[11px] text-amber-800/80 leading-tight mt-1">
              Chọn đáp án đúng
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[11px] font-bold">
            <span>+10</span>
            <Coins className="w-3 h-3 text-amber-600" />
          </div>
        </div>

        {/* 3.3 Nối từ (Sắp có) */}
        <div
          title="Sắp ra mắt trong Milestone 3"
          className="relative rounded-2xl p-3.5 bg-sky-50 border border-sky-200/90 text-sky-950 flex flex-col items-center justify-between text-center min-h-[168px] opacity-80 select-none"
        >
          <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-200/80 text-sky-900">
            Sắp có
          </span>
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5" />
          </div>

          <div className="my-2">
            <div className="text-sm font-extrabold tracking-tight">Nối từ</div>
            <div className="text-[11px] text-sky-800/80 leading-tight mt-1">
              Nối nghĩa hoặc pinyin
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-200/60 text-sky-900 text-[11px] font-bold">
            <span>+10</span>
            <Coins className="w-3 h-3 text-amber-600" />
          </div>
        </div>

        {/* 3.4 Viết chữ (Sắp có) */}
        <div
          title="Sắp ra mắt trong Milestone 4"
          className="relative rounded-2xl p-3.5 bg-teal-50 border border-teal-200/90 text-teal-950 flex flex-col items-center justify-between text-center min-h-[168px] opacity-80 select-none"
        >
          <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-200/80 text-teal-900">
            Sắp có
          </span>
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
            <PenTool className="w-5 h-5" />
          </div>

          <div className="my-2">
            <div className="text-sm font-extrabold tracking-tight">Viết chữ</div>
            <div className="text-[11px] text-teal-800/80 leading-tight mt-1">
              Đồ nét hoặc viết nhớ
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-200/60 text-teal-900 text-[11px] font-bold">
            <span>+15</span>
            <Coins className="w-3 h-3 text-amber-600" />
          </div>
        </div>

        {/* 3.5 Gõ từ (Sắp có) */}
        <div
          title="Sắp ra mắt trong Milestone 5"
          className="relative rounded-2xl p-3.5 bg-emerald-50 border border-emerald-200/90 text-emerald-950 flex flex-col items-center justify-between text-center min-h-[168px] opacity-80 select-none"
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
          className="relative rounded-2xl p-3.5 bg-blue-50 border border-blue-200/90 text-blue-950 flex flex-col items-center justify-between text-center min-h-[168px] opacity-80 select-none"
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

        {/* 3.7 Game đặc biệt */}
        <div
          title="Sắp ra mắt"
          className="relative rounded-2xl p-3.5 bg-rose-50 border border-rose-200/90 text-rose-950 flex flex-col items-center justify-between text-center min-h-[168px] opacity-80 select-none"
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
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800">Lịch sử luyện tập</h3>
        </div>

        <div className="py-5 border border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <Gamepad2 className="w-4 h-4 text-slate-300" />
          <span>Chưa có lịch sử luyện tập. Hãy chơi thử một game nhé!</span>
        </div>
      </div>
    </div>
  )
}
