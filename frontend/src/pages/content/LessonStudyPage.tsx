import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  GraduationCap,
  Layers,
  ChevronRight,
  RotateCw,
  Search,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getLessonStudy, type LessonStudyData, type VocabularyItem } from '../../api/content'
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

  // Search filter inside vocabulary list
  const [vocabSearch, setVocabSearch] = useState('')

  // Flashcard mode states
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null)

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

        const data = await getLessonStudy(idNum, token || undefined)
        if (isMounted) {
          setLessonData(data)
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

  // Pronunciation handler: Web Speech API (zh-CN) fallback if no uploaded audioUrl
  const playPronunciation = useCallback((vocab: VocabularyItem) => {
    setPlayingAudioId(vocab.id)

    if (vocab.audioUrl) {
      const audio = new Audio(vocab.audioUrl)
      audio.onended = () => setPlayingAudioId(null)
      audio.onerror = () => {
        fallbackTTS(vocab.hanzi)
      }
      audio.play().catch(() => fallbackTTS(vocab.hanzi))
    } else {
      fallbackTTS(vocab.hanzi)
    }
  }, [])

  const fallbackTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      utterance.onend = () => setPlayingAudioId(null)
      utterance.onerror = () => setPlayingAudioId(null)
      window.speechSynthesis.speak(utterance)
    } else {
      setPlayingAudioId(null)
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

  // Flashcard navigation
  const nextFlashcard = () => {
    if (!lessonData || lessonData.vocabularies.length === 0) return
    setIsFlipped(false)
    setFlashcardIndex((prev) => (prev + 1) % lessonData.vocabularies.length)
  }

  const prevFlashcard = () => {
    if (!lessonData || lessonData.vocabularies.length === 0) return
    setIsFlipped(false)
    setFlashcardIndex((prev) => (prev - 1 + lessonData.vocabularies.length) % lessonData.vocabularies.length)
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
  const currentCard = lessonData.vocabularies[flashcardIndex]

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
                          <button
                            onClick={() => playPronunciation(vocab)}
                            disabled={playingAudioId === vocab.id}
                            className={`p-2 rounded-xl transition-all ${
                              playingAudioId === vocab.id
                                ? 'bg-emerald-500 text-white animate-pulse'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                            title="Nghe phát âm chuẩn"
                            aria-label={`Nghe phát âm từ ${vocab.hanzi}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
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
                            onClick={() => fallbackTTS(ex.hanzi)}
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

        {/* TAB 3: FLASHCARD ÔN TẬP TƯƠNG TÁC */}
        {activeTab === 'FLASHCARD' && currentCard && (
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-3 px-2">
              <span>
                Thẻ {flashcardIndex + 1} / {lessonData.vocabularies.length}
              </span>
              <span className="text-emerald-700 font-semibold">Chạm thẻ để lật xem đáp án</span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-80 bg-white rounded-3xl border-2 border-emerald-300 shadow-xl p-8 flex flex-col items-center justify-center cursor-pointer text-center select-none hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    playPronunciation(currentCard)
                  }}
                  className="p-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Nghe phát âm"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {!isFlipped ? (
                // FRONT SIDE: Hanzi
                <div className="space-y-4">
                  <div className="text-5xl sm:text-6xl font-bold text-gray-900 font-sans tracking-wide">
                    {currentCard.hanzi}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Bấm để xem Pinyin & Nghĩa</span>
                  </div>
                </div>
              ) : (
                // BACK SIDE: Pinyin & Meaning
                <div className="space-y-3 animate-fadeIn">
                  <div className="text-3xl font-bold text-gray-900 font-sans">{currentCard.hanzi}</div>
                  <div className="text-2xl font-bold text-emerald-700">{currentCard.pinyin}</div>
                  <div className="text-lg font-semibold text-gray-800">{currentCard.meaning}</div>
                  {currentCard.partOfSpeech && (
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {currentCard.partOfSpeech}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Flashcard Controls */}
            <div className="flex items-center justify-between gap-4 mt-6">
              <button
                onClick={prevFlashcard}
                className="flex-1 py-3 px-4 rounded-2xl bg-white border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
              >
                Từ trước
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors shadow-sm"
                title="Lật thẻ"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={nextFlashcard}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
              >
                Từ tiếp theo
              </button>
            </div>
          </div>
        )}

        {/* Bottom completion encouragement */}
        <div className="mt-12 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <PandaMascot size={52} />
            <div>
              <div className="text-sm font-bold text-gray-900">Bạn đã hoàn thành bài học này chưa?</div>
              <p className="text-xs text-gray-500">
                Hãy ôn lại từ vựng bằng flashcard trước khi sang bài học tiếp theo nhé!
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/curriculum')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-md shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Tiếp tục lộ trình</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  )
}
