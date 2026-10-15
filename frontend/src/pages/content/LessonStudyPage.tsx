import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  GraduationCap,
  Layers,
  ChevronRight,
  RotateCw,
  Search,
  Check,
  RotateCcw,
  Award,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getLessonStudy, type LessonStudyData, type VocabularyItem } from '../../api/content'
import {
  getLessonProgress,
  markLessonComplete,
  unmarkLessonComplete,
  type LessonProgressResponse,
} from '../../api/roadmap'
import { getFlashcards, reviewFlashcard, type FlashcardItem } from '../../api/flashcard'
import { PandaMascot } from '../../components/common/PandaMascot'

export const LessonStudyPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { token } = useAuth()

  const [lessonData, setLessonData] = useState<LessonStudyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorStatus, setErrorStatus] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Active tab: 'VOCAB' | 'GRAMMAR' | 'FLASHCARD'
  const [activeTab, setActiveTab] = useState<'VOCAB' | 'GRAMMAR' | 'FLASHCARD'>('VOCAB')

  // Lesson completion states (HTT-04-CN-004)
  const [progressData, setProgressData] = useState<LessonProgressResponse | null>(null)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  // Search filter inside vocabulary list
  const [vocabSearch, setVocabSearch] = useState('')

  // Flashcard mode states (HTT-04-CN-005)
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])
  const [flashcardsLoading, setFlashcardsLoading] = useState(false)
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  const [isRelearningOnlyForgotten, setIsRelearningOnlyForgotten] = useState(false)
  const [sessionRememberedCount, setSessionRememberedCount] = useState(0)
  const [sessionForgottenCount, setSessionForgottenCount] = useState(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Audio error toast state (TC-03: Báo lỗi khi tệp hỏng/mất, KHÔNG DÙNG MODAL)
  const [audioErrorMessage, setAudioErrorMessage] = useState<string | null>(null)
  const toastTimeoutRef = useRef<any>(null)

  const showAudioError = useCallback((message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }
    setAudioErrorMessage(message)
    toastTimeoutRef.current = setTimeout(() => {
      setAudioErrorMessage(null)
    }, 4000)
  }, [])

  // Cleanup audio playback and toast timer on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  // Load lesson study data
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      if (!lessonId) return
      setLoading(true)
      setErrorStatus(null)
      setErrorMessage(null)

      try {
        const idNum = parseInt(lessonId, 10)
        if (isNaN(idNum)) {
          setErrorStatus(404)
          setErrorMessage('Mã bài học không hợp lệ.')
          setLoading(false)
          return
        }

        const [data, prog] = await Promise.all([
          getLessonStudy(idNum, token || undefined),
          token ? getLessonProgress(idNum, token).catch(() => null) : Promise.resolve(null),
        ])
        if (isMounted) {
          setLessonData(data)
          setProgressData(prog)
          // TC-03: If grammar points are empty, default to VOCAB tab
          setActiveTab('VOCAB')
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorStatus(err.status || 500)
          setErrorMessage(err.message || 'Đã có lỗi xảy ra khi tải bài học.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [lessonId, token])

  // HTT-04-CN-004: Xử lý đánh dấu hoàn thành bài học
  const handleToggleComplete = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    if (!lessonId) return
    const idNum = parseInt(lessonId, 10)
    if (isNaN(idNum)) return

    try {
      setIsCompleting(true)
      if (progressData?.completed) {
        await unmarkLessonComplete(idNum, token)
        setProgressData((prev) =>
          prev
            ? {
                ...prev,
                completed: false,
                completedAt: undefined,
                completedLessonsInLevel: Math.max(0, prev.completedLessonsInLevel - 1),
                levelProgressPercent:
                  prev.totalLessonsInLevel > 0
                    ? Math.round(
                        (Math.max(0, prev.completedLessonsInLevel - 1) * 100) /
                          prev.totalLessonsInLevel
                      )
                    : 0,
              }
            : null
        )
        setShowCelebration(false)
      } else {
        const updated = await markLessonComplete(idNum, token)
        setProgressData(updated)
        setShowCelebration(true)
      }
    } catch (err: any) {
      showAudioError(err?.message || 'Không thể cập nhật tiến độ bài học.')
    } finally {
      setIsCompleting(false)
    }
  }

  // Pronunciation handler: HTT-04-CN-003 Play/Stop audio
  const togglePronunciation = useCallback((vocab: VocabularyItem | FlashcardItem) => {
    if (!vocab.audioUrl || !vocab.audioUrl.trim()) {
      return
    }

    // Nếu đang phát chính từ này -> Dừng lại (Stop)
    if (playingAudioId === vocab.id) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current.currentTime = 0
        currentAudioRef.current = null
      }
      setPlayingAudioId(null)
      return
    }

    // Dừng audio cũ nếu đang phát từ khác
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }

    const audioUrl = vocab.audioUrl.trim()
    const resolvedUrl = audioUrl.startsWith('http://') || audioUrl.startsWith('https://') || audioUrl.startsWith('/')
      ? audioUrl
      : `/${audioUrl}`

    try {
      const audio = new Audio(resolvedUrl)
      currentAudioRef.current = audio
      setPlayingAudioId(vocab.id)

      audio.onended = () => {
        setPlayingAudioId((curr) => (curr === vocab.id ? null : curr))
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null
        }
      }

      audio.onerror = () => {
        setPlayingAudioId((curr) => (curr === vocab.id ? null : curr))
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null
        }
        showAudioError(`Không thể phát âm thanh của từ "${vocab.hanzi}". Tệp âm thanh bị lỗi hoặc không tồn tại.`)
      }

      audio.play().catch((err) => {
        if (err?.name === 'AbortError') return
        setPlayingAudioId((curr) => (curr === vocab.id ? null : curr))
        if (currentAudioRef.current === audio) {
          currentAudioRef.current = null
        }
        showAudioError(`Không thể phát âm thanh của từ "${vocab.hanzi}". Tệp âm thanh không khả dụng.`)
      })
    } catch {
      setPlayingAudioId(null)
      showAudioError(`Không thể phát âm thanh của từ "${vocab.hanzi}". Vui lòng thử lại sau.`)
    }
  }, [playingAudioId, showAudioError])

  // TTS phát âm cho câu ví dụ ngữ pháp
  const speakGrammarExample = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  // Filtered vocabularies
  const filteredVocabs = (lessonData?.vocabularies || []).filter((v) => {
    if (!vocabSearch.trim()) return true
    const q = vocabSearch.toLowerCase()
    return (
      v.hanzi.toLowerCase().includes(q) ||
      v.pinyin.toLowerCase().includes(q) ||
      v.meaning.toLowerCase().includes(q)
    )
  })

  // Flashcard API loading & review logic (HTT-04-CN-005)
  const loadFlashcards = useCallback(async (onlyForgotten: boolean = false) => {
    if (!lessonId) return
    setFlashcardsLoading(true)
    try {
      const idNum = parseInt(lessonId, 10)
      if (isNaN(idNum)) return
      if (token) {
        const data = await getFlashcards(token, { lessonId: idNum, onlyForgotten })
        setFlashcards(data)
      } else {
        const fallbackCards: FlashcardItem[] = (lessonData?.vocabularies || []).map(v => ({
          id: v.id,
          hanzi: v.hanzi,
          pinyin: v.pinyin,
          meaning: v.meaning,
          partOfSpeech: v.partOfSpeech,
          audioUrl: v.audioUrl,
          exampleSentence: v.exampleSentence,
          examplePinyin: v.examplePinyin,
          exampleMeaning: v.exampleMeaning,
          lastResult: null,
        }))
        setFlashcards(fallbackCards)
      }
      setFlashcardIndex(0)
      setIsFlipped(false)
      setIsSessionFinished(false)
      setIsRelearningOnlyForgotten(onlyForgotten)
      setSessionRememberedCount(0)
      setSessionForgottenCount(0)
    } catch (err: any) {
      console.error('Failed to load flashcards:', err)
    } finally {
      setFlashcardsLoading(false)
    }
  }, [lessonId, token, lessonData])

  useEffect(() => {
    if (activeTab === 'FLASHCARD') {
      loadFlashcards(false)
    }
  }, [activeTab, loadFlashcards])

  // TC-02: Đánh dấu đã nhớ hoặc chưa nhớ
  const handleReviewCard = async (result: 'REMEMBERED' | 'FORGOTTEN') => {
    if (flashcards.length === 0 || isSubmittingReview) return
    const currentCard = flashcards[flashcardIndex]
    if (!currentCard) return

    setIsSubmittingReview(true)
    try {
      if (token) {
        await reviewFlashcard(token, { vocabularyId: currentCard.id, result })
      }

      setFlashcards(prev =>
        prev.map((c, i) => (i === flashcardIndex ? { ...c, lastResult: result } : c))
      )

      if (result === 'REMEMBERED') {
        setSessionRememberedCount(prev => prev + 1)
      } else {
        setSessionForgottenCount(prev => prev + 1)
      }

      // TC-02: Chuyển sang thẻ kế tiếp
      if (flashcardIndex < flashcards.length - 1) {
        setIsFlipped(false)
        setFlashcardIndex(prev => prev + 1)
      } else {
        // TC-03: Đã đi hết các thẻ -> Kết thúc lượt học
        setIsSessionFinished(true)
      }
    } catch (err: any) {
      showAudioError(err?.message || 'Không thể lưu kết quả học từ.')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const prevFlashcard = () => {
    if (flashcards.length === 0) return
    setIsFlipped(false)
    setFlashcardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const nextFlashcard = () => {
    if (flashcards.length === 0) return
    setIsFlipped(false)
    setFlashcardIndex((prev) => (prev + 1) % flashcards.length)
  }

  // ==================== RENDERING STATES ====================

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <PandaMascot size={80} className="animate-bounce mb-4" />
        <div className="flex items-center gap-2 text-emerald-700 font-semibold text-lg">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Đang tải nội dung bài học...</span>
        </div>
        <p className="text-gray-500 text-sm mt-1">Chuẩn bị từ vựng và ngữ pháp cho bạn</p>
      </div>
    )
  }

  // TC-04: Sai trạng thái / QTN-14: Bài ẩn hoặc không tìm thấy (404)
  if (errorStatus === 404 || !lessonData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
          <div className="relative mx-auto w-24 h-24 mb-4 flex items-center justify-center">
            <PandaMascot size={84} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-3 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Thông báo nội dung</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài học</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Bài học này không tồn tại hoặc đã được chuyển sang trạng thái tạm ẩn theo chính sách hệ thống.
          </p>
          <button
            onClick={() => navigate('/curriculum')}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Lộ trình HSK</span>
          </button>
        </div>
      </div>
    )
  }

  // Other server errors
  if (errorStatus) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-red-100 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 text-sm mb-6">{errorMessage || 'Không thể kết nối đến máy chủ.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    )
  }

  const hasGrammar = lessonData.grammarPoints && lessonData.grammarPoints.length > 0
  const currentCard = flashcards[flashcardIndex] || (lessonData.vocabularies && lessonData.vocabularies[flashcardIndex])

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 pb-16">
      {/* Top sticky header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-emerald-100/80 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/curriculum')}
              className="p-2 rounded-xl text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              title="Quay lại lộ trình"
              aria-label="Quay lại lộ trình"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {lessonData.levelTitle || 'HSK 1'}
                </span>
                <span className="text-xs text-gray-400">Bài {lessonData.sortOrder}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                {lessonData.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <BookOpen className="w-3.5 h-3.5" />
                {lessonData.vocabularies.length} từ mới
              </span>
              {hasGrammar && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 font-medium text-blue-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    {lessonData.grammarPoints.length} ngữ pháp
                  </span>
                </>
              )}
            </div>
            <button
              onClick={() => navigate('/vocab-search')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors border border-emerald-200"
              title="Tra cứu từ vựng"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tra từ</span>
            </button>
            <PandaMascot size={38} className="drop-shadow-sm" />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Lesson Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-700/10 mb-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
            <GraduationCap className="w-64 h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Chương trình học HSK chuẩn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {lessonData.title}
            </h2>
            {lessonData.description && (
              <p className="text-emerald-50 text-sm sm:text-base leading-relaxed line-clamp-2">
                {lessonData.description}
              </p>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('VOCAB')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'VOCAB'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Từ vựng ({lessonData.vocabularies.length})</span>
            </button>

            {/* TC-03: Ẩn hoặc disable mục ngữ pháp nếu bài học không có ngữ pháp */}
            {hasGrammar ? (
              <button
                onClick={() => setActiveTab('GRAMMAR')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'GRAMMAR'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ngữ pháp ({lessonData.grammarPoints.length})</span>
              </button>
            ) : null}

            <button
              onClick={() => {
                setActiveTab('FLASHCARD')
                setIsFlipped(false)
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'FLASHCARD'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Flashcard ôn tập</span>
            </button>
          </div>

          {activeTab === 'VOCAB' && lessonData.vocabularies.length > 3 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm chữ Hán, pinyin, nghĩa..."
                value={vocabSearch}
                onChange={(e) => setVocabSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          )}
        </div>

        {/* TAB 1: DANH SÁCH TỪ VỰNG */}
        {activeTab === 'VOCAB' && (
          <div className="space-y-4">
            {filteredVocabs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <PandaMascot size={64} className="mx-auto mb-3 opacity-60" />
                <p className="text-gray-500 font-medium">Không tìm thấy từ vựng phù hợp</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVocabs.map((vocab, index) => (
                  <div
                    key={vocab.id}
                    className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Top row: Index & Pronunciation button */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                        <div className="flex items-center gap-2">
                          {vocab.partOfSpeech && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {vocab.partOfSpeech}
                            </span>
                          )}
                          {/* TC-02: Ẩn nút nghe nếu từ vựng chưa có audio */}
                          {vocab.audioUrl && vocab.audioUrl.trim() && (
                            <button
                              type="button"
                              onClick={() => togglePronunciation(vocab)}
                              className={`p-2 rounded-xl transition-all ${
                                playingAudioId === vocab.id
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              }`}
                              title={playingAudioId === vocab.id ? 'Dừng phát âm' : 'Nghe phát âm chuẩn'}
                              aria-label={playingAudioId === vocab.id ? `Dừng phát âm từ ${vocab.hanzi}` : `Nghe phát âm từ ${vocab.hanzi}`}
                            >
                              {playingAudioId === vocab.id ? (
                                <VolumeX className="w-4 h-4" />
                              ) : (
                                <Volume2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Main Hanzi & Pinyin (TC-02: Font và Pinyin có dấu thanh điệu chuẩn) */}
                      <div className="mb-3">
                        <div className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-wide font-sans mb-1">
                          {vocab.hanzi}
                        </div>
                        <div className="text-base font-semibold text-emerald-700 tracking-wider">
                          {vocab.pinyin}
                        </div>
                      </div>

                      {/* Vietnamese Meaning */}
                      <div className="text-sm font-medium text-gray-800 leading-snug mb-3">
                        {vocab.meaning}
                      </div>

                      {/* Example sentence if present */}
                      {vocab.exampleSentence && (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1">
                          <div className="font-semibold text-gray-900 font-sans text-sm">
                            {vocab.exampleSentence}
                          </div>
                          {vocab.examplePinyin && (
                            <div className="text-emerald-700 font-medium">{vocab.examplePinyin}</div>
                          )}
                          {vocab.exampleMeaning && (
                            <div className="text-gray-600">{vocab.exampleMeaning}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ĐIỂM NGỮ PHÁP (TC-01, TC-03) */}
        {activeTab === 'GRAMMAR' && (
          <div className="space-y-6">
            {lessonData.grammarPoints.map((gp, idx) => (
              <div
                key={gp.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{gp.title}</h3>
                </div>

                {/* Structure / Formula */}
                {gp.structure && (
                  <div className="mb-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
                    <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      Cấu trúc ngữ pháp
                    </div>
                    <div className="text-base font-bold text-emerald-950 font-sans">{gp.structure}</div>
                  </div>
                )}

                {/* Explanation */}
                <div className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                  {gp.explanation}
                </div>

                {/* Grammar Examples */}
                {gp.examples && gp.examples.length > 0 && (
                  <div className="border-t border-gray-100 pt-5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Ví dụ minh họa
                    </h4>
                    <div className="space-y-3">
                      {gp.examples.map((ex, exIdx) => (
                        <div
                          key={ex.id || exIdx}
                          className="bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-2xl p-4 border border-slate-200/60 flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="text-base sm:text-lg font-bold text-gray-900 font-sans tracking-wide">
                              {ex.hanzi}
                            </div>
                            <div className="text-sm font-semibold text-emerald-700">{ex.pinyin}</div>
                            <div className="text-sm text-gray-600">{ex.meaning}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => speakGrammarExample(ex.hanzi)}
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Nghe câu ví dụ"
                            aria-label={`Nghe câu ví dụ ${ex.hanzi}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: FLASHCARD ÔN TẬP TƯƠNG TÁC (HTT-04-CN-005) */}
        {activeTab === 'FLASHCARD' && (
          <div className="max-w-md mx-auto">
            {/* Case 1: Loading */}
            {flashcardsLoading && (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
                <p className="text-gray-600 font-medium text-sm">Đang tải danh sách thẻ flashcard...</p>
              </div>
            )}

            {/* Case 2: Dữ liệu rỗng (HTT-04-CN-005-TC-04) */}
            {!flashcardsLoading && flashcards.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm space-y-4">
                <PandaMascot size={64} className="mx-auto opacity-70" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Không có từ để học</h3>
                  <p className="text-xs text-gray-500">
                    {isRelearningOnlyForgotten
                      ? 'Tuyệt vời! Bạn không còn từ nào ở trạng thái chưa nhớ.'
                      : 'Bài học này hiện chưa có từ vựng nào trong danh sách ôn tập flashcard.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (isRelearningOnlyForgotten) {
                        loadFlashcards(false)
                      } else {
                        setActiveTab('VOCAB')
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
                  >
                    {isRelearningOnlyForgotten ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Học lại toàn bộ thẻ</span>
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Xem danh sách từ vựng</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Case 3: Kết thúc lượt học - Màn hình tổng kết (HTT-04-CN-005-TC-03, KHÔNG DÙNG MODAL) */}
            {!flashcardsLoading && flashcards.length > 0 && isSessionFinished && (
              <div className="bg-white rounded-3xl p-8 border-2 border-emerald-300 shadow-xl text-center space-y-6 animate-fadeIn">
                <div className="flex justify-center">
                  <div className="p-3.5 rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50">
                    <Award className="w-10 h-10" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">Hoàn thành lượt học!</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {isRelearningOnlyForgotten
                      ? 'Bạn đã hoàn thành lượt ôn tập riêng các từ chưa nhớ.'
                      : 'Bạn đã đi hết toàn bộ các thẻ từ vựng trong lượt học này.'}
                  </p>
                </div>

                {/* Thống kê số từ đã nhớ và chưa nhớ (TC-03) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50/90 border border-emerald-200/90 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-extrabold text-3xl">
                      <Check className="w-6 h-6" />
                      <span>{sessionRememberedCount}</span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-800 mt-1">Đã nhớ</div>
                  </div>

                  <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-amber-700 font-extrabold text-3xl">
                      <X className="w-6 h-6" />
                      <span>{sessionForgottenCount}</span>
                    </div>
                    <div className="text-xs font-semibold text-amber-800 mt-1">Chưa nhớ</div>
                  </div>
                </div>

                {/* Các nút hành động sau khi hoàn thành */}
                <div className="space-y-3 pt-2">
                  {/* TC-03: Cho phép học lại riêng các từ chưa nhớ */}
                  {sessionForgottenCount > 0 && (
                    <button
                      type="button"
                      onClick={() => loadFlashcards(true)}
                      className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-all shadow-md shadow-amber-600/25 active:scale-[0.98] inline-flex items-center justify-center gap-2 text-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Học lại riêng {sessionForgottenCount} từ chưa nhớ</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => loadFlashcards(false)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md shadow-emerald-600/25 active:scale-[0.98] inline-flex items-center justify-center gap-2 text-sm"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Học lại từ đầu (Toàn bộ thẻ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('VOCAB')}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all text-xs inline-flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Xem lại danh sách từ vựng</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case 4: Giao diện học Flashcard đang diễn ra (TC-01, TC-02) */}
            {!flashcardsLoading && flashcards.length > 0 && !isSessionFinished && currentCard && (
              <div className="space-y-4">
                {/* Header thanh tiến trình & thông tin thẻ */}
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-800">
                        Thẻ {flashcardIndex + 1} / {flashcards.length}
                      </span>
                      {isRelearningOnlyForgotten && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-semibold">
                          Ôn từ chưa nhớ
                        </span>
                      )}
                    </div>

                    {currentCard.lastResult && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          currentCard.lastResult === 'REMEMBERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {currentCard.lastResult === 'REMEMBERED' ? (
                          <>
                            <Check className="w-3 h-3" /> Đã nhớ
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Chưa nhớ
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Thanh tiến độ học flashcard */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${((flashcardIndex + 1) / flashcards.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Flip Card Container */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full min-h-[320px] bg-white rounded-3xl border-2 border-emerald-300 shadow-xl p-8 flex flex-col items-center justify-center cursor-pointer text-center select-none hover:shadow-2xl transition-all relative overflow-hidden"
                >
                  {/* Nút phát âm (TC-02: Ẩn nếu từ không có audio) */}
                  {currentCard.audioUrl && currentCard.audioUrl.trim() && (
                    <div className="absolute top-4 right-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePronunciation(currentCard)
                        }}
                        className={`p-2.5 rounded-full transition-all ${
                          playingAudioId === currentCard.id
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-400'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={playingAudioId === currentCard.id ? 'Dừng phát âm' : 'Nghe phát âm'}
                        aria-label={
                          playingAudioId === currentCard.id
                            ? `Dừng phát âm từ ${currentCard.hanzi}`
                            : `Nghe phát âm từ ${currentCard.hanzi}`
                        }
                      >
                        {playingAudioId === currentCard.id ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}

                  {!isFlipped ? (
                    // MẶT TRƯỚC (TC-01): Chữ Hán
                    <div className="space-y-4">
                      <div className="text-5xl sm:text-6xl font-bold text-gray-900 font-sans tracking-wide">
                        {currentCard.hanzi}
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Bấm để lật xem Pinyin & Nghĩa</span>
                      </div>
                    </div>
                  ) : (
                    // MẶT SAU (TC-01): Pinyin và Nghĩa
                    <div className="space-y-3 animate-fadeIn w-full max-w-sm">
                      <div className="text-3xl font-bold text-gray-900 font-sans">{currentCard.hanzi}</div>
                      <div className="text-2xl font-bold text-emerald-700">{currentCard.pinyin}</div>
                      <div className="text-lg font-semibold text-gray-800">{currentCard.meaning}</div>
                      {currentCard.partOfSpeech && (
                        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {currentCard.partOfSpeech}
                        </span>
                      )}

                      {/* Câu ví dụ nếu có */}
                      {currentCard.exampleSentence && (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1 text-left mt-2">
                          <div className="font-semibold text-gray-900 font-sans">
                            {currentCard.exampleSentence}
                          </div>
                          {currentCard.examplePinyin && (
                            <div className="text-emerald-700">{currentCard.examplePinyin}</div>
                          )}
                          {currentCard.exampleMeaning && (
                            <div className="text-gray-600">{currentCard.exampleMeaning}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Các nút hành động Flashcard: Chưa nhớ & Đã nhớ (HTT-04-CN-005-TC-02) */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmittingReview}
                    onClick={() => handleReviewCard('FORGOTTEN')}
                    className="py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border-2 border-amber-300 font-bold transition-all shadow-sm active:scale-[0.98] inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-amber-600" />
                    <span>Chưa nhớ</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmittingReview}
                    onClick={() => handleReviewCard('REMEMBERED')}
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/25 active:scale-[0.98] inline-flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5 text-white" />
                    <span>Đã nhớ</span>
                  </button>
                </div>

                {/* Nút lật thẻ & điều hướng tay phụ */}
                <div className="flex items-center justify-between text-xs text-gray-500 px-2 pt-1">
                  <button
                    type="button"
                    onClick={prevFlashcard}
                    className="hover:text-emerald-700 transition-colors font-medium"
                  >
                    ← Thẻ trước
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Lật thẻ</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextFlashcard}
                    className="hover:text-emerald-700 transition-colors font-medium"
                  >
                    Thẻ tiếp →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HTT-04-CN-004: Bottom Completion Action & Inline Celebration Progress */}
        <div className="mt-12 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm transition-all overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <PandaMascot size={56} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      {progressData?.completed ? 'Bài học đã hoàn thành' : 'Bạn đã nắm vững bài học này chưa?'}
                    </h2>
                    {progressData?.completed && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        Đã hoàn thành
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                    {progressData?.completed
                      ? progressData.completedAt
                        ? `Được ghi nhận hoàn thành vào ${new Date(progressData.completedAt).toLocaleString('vi-VN')}`
                        : 'Tiến độ cấp độ đã được ghi nhận vào tài khoản của bạn.'
                      : 'Đánh dấu hoàn thành để ghi nhận tiến độ vào lộ trình HSK và bảng thống kê học tập.'}
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {token ? (
                  <>
                    <button
                      type="button"
                      disabled={isCompleting}
                      onClick={handleToggleComplete}
                      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all shadow-md active:scale-[0.98] ${
                        progressData?.completed
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80 shadow-none'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                      }`}
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : progressData?.completed ? (
                        <>
                          <RotateCcw className="w-4 h-4 text-slate-500" />
                          <span>Học lại (Bỏ hoàn thành)</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Đánh dấu hoàn thành</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/curriculum')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-200 transition-all shadow-sm"
                    >
                      <Layers className="w-4 h-4 text-gray-500" />
                      <span>Lộ trình HSK</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md shadow-emerald-600/25"
                  >
                    <span>Đăng nhập để lưu tiến độ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* TC-01 & GEMINI.md: Inline Celebration & Level Progress Banner (TUYỆT ĐỐI KHÔNG DÙNG MODAL) */}
            {showCelebration && progressData?.completed && (
              <div className="mt-6 pt-6 border-t border-emerald-100 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-emerald-950">
                          Chúc mừng bạn đã hoàn thành bài học này!
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-200/70 text-emerald-900">
                          <Award className="w-3.5 h-3.5" />
                          +1 Bài học
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-800/90 mt-1">
                        Tiến độ của cấp độ hiện tại:{' '}
                        <strong>
                          {progressData.completedLessonsInLevel}/{progressData.totalLessonsInLevel}
                        </strong>{' '}
                        bài ({progressData.levelProgressPercent}%).
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-64 space-y-1.5 shrink-0">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span>Tiến độ cấp độ</span>
                      <span>{progressData.levelProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-white/80 rounded-full h-3 p-0.5 overflow-hidden border border-emerald-200">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.min(100, Math.max(0, progressData.levelProgressPercent))}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TC-03: Thông báo lỗi phát audio nhẹ nhàng dạng Toast (KHÔNG DÙNG MODAL) */}
        {audioErrorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md bg-white border border-rose-200/80 border-l-4 border-l-rose-500 rounded-2xl shadow-xl shadow-slate-900/10 p-4 flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-5 duration-300"
          >
            <div className="p-1.5 rounded-xl bg-rose-50 text-rose-600 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-sm">
              <p className="font-bold text-gray-900">Không phát được audio</p>
              <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{audioErrorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setAudioErrorMessage(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              title="Đóng thông báo"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
