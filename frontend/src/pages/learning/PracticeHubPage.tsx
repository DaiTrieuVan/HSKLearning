import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  Sparkles,
  HelpCircle,
  GitCompare,
  PenTool,
  Keyboard,
  Headphones,
  BrainCircuit,
  ArrowRight,
  Shuffle,
  SlidersHorizontal,
  Flame,
  BookOpen,
  Clock,
  Zap,
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
      .catch((err) => console.error('Failed to load stats:', err))
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

  const selectedSetTitle = useMemo(() => {
    if (selectedSetId === 'all') return 'Tất cả từ vựng của tôi'
    const found = vocabSets.find((s) => s.id.toString() === selectedSetId)
    return found ? found.title : 'Bộ từ vựng'
  }, [selectedSetId, vocabSets])

  // Handler to launch Flashcard session
  const handleStartFlashcard = () => {
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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. Header & Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Zap className="w-4 h-4" />
              <span>Trung tâm Luyện tập Phản xạ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Luyện tập Từ vựng
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Chọn bộ từ, thiết lập chế độ và rèn luyện phản xạ ghi nhớ qua các dạng trò chơi thông minh.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold">Từ sẵn sàng học</div>
              <div className="text-sm font-extrabold text-slate-800">
                {loadingStats ? '...' : `${readyWordCount} từ`}
                <span className="text-xs font-medium text-emerald-600 ml-1.5">
                  ({stats ? `${stats.progressPercent}% đã thuộc` : '0%'})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Top Practice Configuration Bar (Vocapy-style Filter Toolbar) */}
        <div className="mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 2.1 Chọn Bộ từ vựng */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Bộ từ vựng
              </label>
              <div className="relative">
                <select
                  value={selectedSetId}
                  onChange={(e) => setSelectedSetId(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                >
                  <option value="all">Tất cả từ vựng của tôi</option>
                  {vocabSets.map((set) => (
                    <option key={set.id} value={set.id.toString()}>
                      {set.title} ({set.wordCount} từ)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 2.2 Bộ lọc trạng thái */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Bộ lọc
              </label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                >
                  <option value="UNMASTERED">Chưa thuộc (Mặc định)</option>
                  <option value="ALL">Tất cả từ</option>
                  <option value="MASTERED">Đã thuộc</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 2.3 Thứ tự */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Thứ tự
              </label>
              <div className="relative">
                <select
                  value={order}
                  onChange={(e) => setOrder(e.target.value as any)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                >
                  <option value="RANDOM">Ngẫu nhiên (Khuyên dùng)</option>
                  <option value="DEFAULT">Mặc định theo thứ tự</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <Shuffle className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 2.4 Số lượng từ */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Số lượng từ
              </label>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                >
                  <option value="10">10 từ</option>
                  <option value="20">20 từ (Tiêu chuẩn)</option>
                  <option value="50">50 từ (Thử thách)</option>
                  <option value="all">Tất cả các từ</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Status info bar */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Đang chọn: <strong className="text-slate-700">{selectedSetTitle}</strong>
              </span>
            </div>
            <div className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {readyWordCount} từ phù hợp với thiết lập hiện tại
            </div>
          </div>
        </div>

        {/* 3. Game Cards Grid (6+ Practice Modes) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Các Dạng Luyện tập
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              Chọn dạng bài để bắt đầu luyện phản xạ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {/* 3.1 Dạng 1: Flashcard (Active) */}
            <div className="group bg-white rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    +5 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Flashcard
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Lật thẻ 3D học từ vựng, tự đánh giá Thuộc/Quên kèm phiên âm, dịch nghĩa và phát âm chuẩn.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">Sẵn sàng luyện</span>
                <button
                  type="button"
                  onClick={handleStartFlashcard}
                  disabled={readyWordCount === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>Bắt đầu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3.2 Dạng 2: Trắc nghiệm (Milestone 2) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shadow-sm">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    +10 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800">
                  Trắc nghiệm
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Chọn đáp án đúng qua 4 chế độ: Từ sang Nghĩa, Nghĩa sang Từ, Hỗn hợp và Đoán từ trong ngữ cảnh.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Dạng 2 (Sắp có)
                </span>
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                >
                  Chưa mở
                </button>
              </div>
            </div>

            {/* 3.3 Dạng 3: Nối từ (Milestone 3) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold shadow-sm">
                    <GitCompare className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    +10 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800">
                  Nối từ
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Trò chơi ghép cặp phản xạ nhanh: Nối chữ Hán với nghĩa tiếng Việt hoặc nối chữ Hán với phiên âm Pinyin.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Dạng 3 (Sắp có)
                </span>
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                >
                  Chưa mở
                </button>
              </div>
            </div>

            {/* 3.4 Dạng 4: Viết chữ (Milestone 4) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shadow-sm">
                    <PenTool className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    +15 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800">
                  Viết chữ
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Luyện viết ô chữ điền tự: Đồ nét theo mẫu, Viết nhớ từ trí óc và Xuất file PDF giấy tập viết chữ Hán.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Dạng 4 (Sắp có)
                </span>
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                >
                  Chưa mở
                </button>
              </div>
            </div>

            {/* 3.5 Dạng 5: Gõ từ (Milestone 5) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shadow-sm">
                    <Keyboard className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    +10 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800">
                  Gõ từ
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Nhìn nghĩa tiếng Việt hoặc gợi ý để gõ chữ Hán hoặc gõ chính xác pinyin phiên âm.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Dạng 5 (Sắp có)
                </span>
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                >
                  Chưa mở
                </button>
              </div>
            </div>

            {/* 3.6 Dạng 6: Nghe viết (Milestone 6) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between opacity-80 hover:opacity-100 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shadow-sm">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    +15 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-800">
                  Nghe viết
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Nghe âm thanh phát âm bản xứ và gõ lại đúng từ tiếng Trung hoặc phiên âm pinyin tương ứng.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  Dạng 6 (Sắp có)
                </span>
                <button
                  type="button"
                  disabled
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                >
                  Chưa mở
                </button>
              </div>
            </div>

            {/* 3.7 Dạng 7: Game đặc biệt AI (Bonus) */}
            <div className="bg-gradient-to-br from-purple-50/70 to-pink-50/70 rounded-2xl border border-purple-200 shadow-sm p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white text-purple-600 flex items-center justify-center font-bold shadow-sm">
                    <Flame className="w-6 h-6 text-pink-500" />
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    HOT +20 XP
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  Game AI Đặc biệt
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Thử thách dịch câu thông minh, ghép ngữ cảnh và hội thoại đối đáp với trợ lý AI HSK.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-purple-100/80 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700">Dành cho HSK Master</span>
                <span className="text-xs font-semibold text-purple-500">Khám phá</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Banner Ôn tập Ngắt quãng (SRS) */}
        <div className="mt-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-500/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-purple-200 mb-1">
                Thuật toán ghi nhớ khoa học
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                Ôn tập ngắt quãng (SRS)
              </h3>
              <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl leading-relaxed">
                Hệ thống tự động tính toán thời điểm vàng để nhắc lại những từ vựng bạn sắp quên. Học ít nhưng nhớ lâu trọn đời!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/srs/review')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <span>Bắt đầu ôn tập</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
