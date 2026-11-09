import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Plus,
  Search,
  Volume2,
  CheckCircle2,
  Clock,
  Layers,
  Percent,
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getStudentWords,
  toggleWordMastered,
  getMyVocabSets,
  createVocabSet,
  type StudentWordsPage,
  type StudentVocabWordItem,
  type VocabSetSummary,
  type CreateVocabSetPayload,
} from '../../api/vocabManagement'
import { BatchAddWordsDrawer } from '../../components/vocab/BatchAddWordsDrawer'
import { AiTopicGenerateDrawer } from '../../components/vocab/AiTopicGenerateDrawer'
import { VocabSetDrawer } from '../../components/vocab/VocabSetDrawer'

export const StudentWordsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token } = useAuth()

  const vocabSetIdParam = searchParams.get('vocabSetId')
  const initialSetId = vocabSetIdParam ? Number(vocabSetIdParam) : undefined

  const [selectedSetId, setSelectedSetId] = useState<number | undefined>(initialSetId)
  const [vocabSets, setVocabSets] = useState<VocabSetSummary[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MASTERED' | 'UNMASTERED'>('ALL')
  const [page, setPage] = useState(0)

  const [data, setData] = useState<StudentWordsPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Drawers
  const [isBatchDrawerOpen, setIsBatchDrawerOpen] = useState(false)
  const [isAiTopicOpen, setIsAiTopicOpen] = useState(false)
  const [isCreateSetDrawerOpen, setIsCreateSetDrawerOpen] = useState(false)

  // Speech TTS
  const speakHanzi = (hanzi: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(hanzi)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const loadSets = async () => {
    if (!token) return
    try {
      const sets = await getMyVocabSets(token)
      setVocabSets(sets)
    } catch {
      // ignore
    }
  }

  const loadWords = async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const res = await getStudentWords(token, {
        vocabSetId: selectedSetId,
        search: search.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page,
        size: 20,
      })
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi tải danh sách từ vựng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSets()
  }, [token])

  useEffect(() => {
    loadWords()
  }, [token, selectedSetId, statusFilter, page])

  // Handle Search Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0)
      loadWords()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleToggleMastered = async (word: StudentVocabWordItem) => {
    if (!token) return
    // Optimistic UI update
    setData((prev) => {
      if (!prev) return prev
      const updatedItems = prev.items.map((item) =>
        item.id === word.id ? { ...item, isMastered: !item.isMastered } : item
      )
      const diff = !word.isMastered ? 1 : -1
      const newMastered = Math.max(0, prev.stats.masteredWords + diff)
      const newUnmastered = Math.max(0, prev.stats.unmasteredWords - diff)
      const newPercent = prev.stats.totalWords > 0
        ? Math.min(100, Math.round((newMastered / prev.stats.totalWords) * 100))
        : 0

      return {
        ...prev,
        stats: {
          ...prev.stats,
          masteredWords: newMastered,
          unmasteredWords: newUnmastered,
          progressPercent: newPercent,
        },
        items: updatedItems,
      }
    })

    try {
      await toggleWordMastered(word.id, token)
    } catch {
      // Revert if error
      loadWords()
    }
  }

  const handleQuickCreateSet = async (payload: CreateVocabSetPayload) => {
    if (!token) return
    const created = await createVocabSet(payload, token)
    await loadSets()
    setSelectedSetId(created.id)
    setIsCreateSetDrawerOpen(false)
  }

  const currentSetTitle = selectedSetId
    ? vocabSets.find((s) => s.id === selectedSetId)?.title || 'Bộ từ đã chọn'
    : 'Tất cả từ vựng'

  const stats = data?.stats || { totalWords: 0, masteredWords: 0, unmasteredWords: 0, progressPercent: 0 }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 p-6 md:p-8 space-y-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/vocab-sets')}
              className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bộ từ vựng</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-600 font-bold">{currentSetTitle}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            Danh Sách Từ Vựng
          </h1>
        </div>

        {/* Action Buttons styled in clean Light Theme */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAiTopicOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Thêm từ với AI</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBatchDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>Thêm nhiều từ</span>
          </button>
        </div>
      </div>

      {/* 4 Vocapy-style Stat Cards in Light Theme */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TỔNG</div>
            <div className="text-2xl font-black text-slate-900">{stats.totalWords}</div>
          </div>
        </div>

        {/* Mastered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">THUỘC</div>
            <div className="text-2xl font-black text-emerald-600">{stats.masteredWords}</div>
          </div>
        </div>

        {/* Unmastered */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CHƯA</div>
            <div className="text-2xl font-black text-amber-600">{stats.unmasteredWords}</div>
          </div>
        </div>

        {/* Progress % */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">TIẾN ĐỘ</div>
            <div className="text-2xl font-black text-purple-600">{stats.progressPercent}%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm từ theo chữ Hán, Pinyin hoặc Nghĩa..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Status Select */}
          <div className="shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'ALL' | 'MASTERED' | 'UNMASTERED')
                setPage(0)
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="MASTERED">Đã thuộc</option>
              <option value="UNMASTERED">Chưa thuộc</option>
            </select>
          </div>
        </div>

        {/* Vocab Set Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <select
            value={selectedSetId ?? ''}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : undefined
              setSelectedSetId(val)
              setPage(0)
              if (val) {
                setSearchParams({ vocabSetId: String(val) })
              } else {
                setSearchParams({})
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
          >
            <option value="">Tất cả các bộ từ</option>
            {vocabSets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.wordCount} từ)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Words Table */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="text-sm font-medium text-slate-600">Đang tải danh sách từ vựng...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-sm">
            {error}
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="py-20 text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Chưa có từ vựng nào phù hợp</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {search
                ? 'Không tìm thấy từ vựng nào khớp với từ khóa tìm kiếm.'
                : 'Bộ từ vựng này hiện chưa có từ nào. Hãy bấm nút "Thêm nhiều từ" để nhập từ vựng mới!'}
            </p>
            <button
              type="button"
              onClick={() => setIsBatchDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm từ ngay</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-52">TỪ VỰNG</th>
                  <th className="py-3.5 px-4 w-60">NGHĨA</th>
                  <th className="py-3.5 px-4 w-32">LOẠI TỪ</th>
                  <th className="py-3.5 px-4 min-w-[280px]">VÍ DỤ</th>
                  <th className="py-3.5 px-4 w-28 text-center">THUỘC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {data.items.map((word) => (
                  <tr
                    key={word.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Từ vựng with Audio Speaker */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => speakHanzi(word.hanzi)}
                          title="Phát âm từ này"
                          className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-50 text-slate-500 group-hover:text-emerald-600 flex items-center justify-center transition-colors shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <div>
                          <div className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {word.hanzi}
                          </div>
                          <div className="text-xs text-slate-500 font-mono">
                            {word.pinyin || '—'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Nghĩa */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {word.meaning}
                    </td>

                    {/* Loại từ Badge */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                        {word.partOfSpeech === 'noun'
                          ? 'DANH TỪ'
                          : word.partOfSpeech === 'verb'
                          ? 'ĐỘNG TỪ'
                          : word.partOfSpeech === 'adjective'
                          ? 'TÍNH TỪ'
                          : word.partOfSpeech === 'phrase'
                          ? 'CỤM TỪ'
                          : word.partOfSpeech?.toUpperCase() || 'TỪ'}
                      </span>
                    </td>

                    {/* Ví dụ */}
                    <td className="py-3.5 px-4 text-xs text-slate-700 leading-relaxed">
                      {word.exampleSentence ? (
                        <div>
                          <span className="text-slate-900 font-semibold">{word.exampleSentence}</span>
                          {word.exampleMeaning && (
                            <span className="text-slate-500 ml-1.5 font-normal">({word.exampleMeaning})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Thuộc Switch Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleMastered(word)}
                        role="switch"
                        aria-checked={word.isMastered}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          word.isMastered ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            word.isMastered ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
            <div>
              Hiển thị trang {page + 1} / {data.totalPages} ({data.totalElements} từ)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                disabled={page >= data.totalPages - 1}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawers */}
      <BatchAddWordsDrawer
        isOpen={isBatchDrawerOpen}
        onClose={() => setIsBatchDrawerOpen(false)}
        onSuccess={() => {
          loadWords()
          loadSets()
        }}
        vocabSets={vocabSets}
        defaultVocabSetId={selectedSetId}
        onRequestCreateSet={() => setIsCreateSetDrawerOpen(true)}
      />

      <AiTopicGenerateDrawer
        isOpen={isAiTopicOpen}
        onClose={() => setIsAiTopicOpen(false)}
        onAddWords={() => {
          // Open batch drawer to show the new words
          setIsBatchDrawerOpen(true)
        }}
      />

      <VocabSetDrawer
        isOpen={isCreateSetDrawerOpen}
        onClose={() => setIsCreateSetDrawerOpen(false)}
        onSubmit={handleQuickCreateSet}
        folders={[]}
      />
    </div>
  )
}
