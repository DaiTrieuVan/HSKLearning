import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search,
  SearchX,
  Volume2,
  BookOpen,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  X,
  Loader2,
  BookMarked,
  HelpCircle,
  Layers,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { searchVocabularies, type VocabSearchResult } from '../../api/vocabSearch'
import { PandaMascot } from '../../components/common/PandaMascot'

const QUICK_SUGGESTIONS = [
  { label: '你好', query: '你好' },
  { label: '谢谢', query: 'xiexie' },
  { label: '再见', query: 'zàijiàn' },
  { label: 'chào bạn', query: 'chào' },
  { label: 'cảm ơn', query: 'cảm ơn' },
  { label: 'học tập', query: 'học' },
]

const HSK_TABS = ['Tất cả', 'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6']

export const VocabSearchPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<VocabSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedHskTab, setSelectedHskTab] = useState<string>('Tất cả')
  const [speakingId, setSpeakingId] = useState<number | null>(null)

  const performSearch = useCallback(
    async (keyword: string) => {
      const trimmed = keyword.trim()
      if (!user) return

      if (!trimmed) {
        setResults([])
        setSearched(false)
        setErrorMsg(null)
        return
      }

      setLoading(true)
      setErrorMsg(null)
      try {
        const data = await searchVocabularies(user.token, trimmed)
        setResults(data)
        setSearched(true)
      } catch (err) {
        console.error('Lỗi khi tra cứu từ vựng:', err)
        setErrorMsg('Không thể kết nối đến máy chủ tra cứu. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  // Khởi tạo tìm kiếm nếu có query params trên URL
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery, performSearch])

  // Debounced search khi người dùng gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() !== initialQuery) {
        if (query.trim()) {
          setSearchParams({ q: query.trim() })
          performSearch(query.trim())
        } else {
          setSearchParams({})
          setResults([])
          setSearched(false)
        }
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [query, initialQuery, performSearch, setSearchParams])

  const handleClear = () => {
    setQuery('')
    setSearchParams({})
    setResults([])
    setSearched(false)
  }

  const handleQuickSuggestion = (suggested: string) => {
    setQuery(suggested)
    setSearchParams({ q: suggested })
    performSearch(suggested)
  }

  // Phát âm qua Web Speech API hoặc audioUrl
  const handlePronounce = (vocab: VocabSearchResult) => {
    setSpeakingId(vocab.id)
    if (vocab.audioUrl) {
      const audio = new Audio(vocab.audioUrl)
      audio.onended = () => setSpeakingId(null)
      audio.onerror = () => {
        speakChinese(vocab.hanzi)
      }
      audio.play().catch(() => speakChinese(vocab.hanzi))
    } else {
      speakChinese(vocab.hanzi)
    }
  }

  const speakChinese = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      utterance.onend = () => setSpeakingId(null)
      utterance.onerror = () => setSpeakingId(null)
      window.speechSynthesis.speak(utterance)
    } else {
      setSpeakingId(null)
    }
  }

  // Lọc kết quả theo tab HSK
  const filteredResults = useMemo(() => {
    if (selectedHskTab === 'Tất cả') return results

    return results.filter((item) => {
      // Kiểm tra trong danh sách các bài học gắn với từ vựng xem có thuộc level đang chọn không
      return item.lessons.some((l) => {
        if (!l.levelCode) return false
        return l.levelCode.toUpperCase() === selectedHskTab.replace(' ', '').toUpperCase()
      })
    })
  }, [results, selectedHskTab])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Top Header */}
      <header
        className="px-3.5 py-3 sm:px-6 sm:py-4 lg:px-8 bg-white flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
        style={{
          borderBottom: '2px solid var(--border-card)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          className="order-1 flex items-center gap-1.5 px-3 py-2 sm:px-3.5 rounded-xl bg-white text-xs sm:text-[0.85rem] font-extrabold cursor-pointer transition-all whitespace-nowrap shrink-0"
          style={{
            border: '1.5px solid var(--border-card)',
            color: 'var(--text-main)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại trang chủ</span>
        </button>

        <div className="order-3 md:order-2 w-full md:w-auto flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-black text-xl shrink-0 hanzi"
            style={{
              backgroundColor: 'var(--primary)',
            }}
          >
            查
          </div>
          <div className="min-w-0">
            <h1 className="m-0 text-base sm:text-[1.15rem] font-extrabold leading-tight" style={{ color: 'var(--text-main)' }}>
              Tra cứu từ vựng tiếng Trung
            </h1>
            <span className="block text-xs font-bold leading-snug" style={{ color: 'var(--text-muted)' }}>
              Hỗ trợ tìm kiếm theo chữ Hán, Pinyin và tiếng Việt
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/roadmap')}
          className="order-2 md:order-3 md:ml-auto flex items-center gap-1.5 px-3 py-2 sm:px-3.5 rounded-xl bg-white text-xs sm:text-[0.82rem] font-extrabold cursor-pointer whitespace-nowrap shrink-0"
          style={{
            border: '1.5px solid var(--border-card)',
            color: 'var(--text-main)',
          }}
        >
          <BookMarked size={16} color="var(--primary)" />
          <span>Lộ trình HSK</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-3.5 py-4 sm:px-6 sm:py-8 max-w-[1100px] w-full mx-auto">
        {/* Search Input Box */}
        <section
          className="bg-white p-4 sm:p-6 mb-5 sm:mb-7"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--border-card)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div className="relative flex items-center">
            <Search
              size={20}
              color="var(--text-muted)"
              className="absolute left-3.5 sm:left-4 pointer-events-none"
            />
            <input
              type="text"
              id="vocab-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập chữ Hán, pinyin (nihao) hoặc nghĩa tiếng Việt..."
              className="w-full box-border py-3 pl-11 pr-10 sm:py-3.5 sm:pl-[50px] sm:pr-12 text-sm sm:text-[1.05rem] font-semibold outline-none transition-colors"
              style={{
                color: 'var(--text-main)',
                backgroundColor: 'var(--bg-input)',
                border: '2px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-card)')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  performSearch(query)
                }
              }}
            />

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                id="clear-search-btn"
                onClick={handleClear}
                className="absolute right-3 sm:right-4 bg-transparent border-0 cursor-pointer flex items-center p-1 rounded-full"
                style={{
                  color: 'var(--text-muted)',
                }}
                title="Xóa nội dung tìm kiếm"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Suggestions & Guide */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              fontSize: '0.85rem',
            }}
          >
            <span style={{ fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={14} color="var(--primary)" /> Gợi ý tìm nhanh:
            </span>
            {QUICK_SUGGESTIONS.map((sug) => (
              <button
                key={sug.label}
                type="button"
                onClick={() => handleQuickSuggestion(sug.query)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-card)',
                  backgroundColor: query === sug.query ? 'var(--primary-light, #eef2ff)' : 'var(--bg-card)',
                  color: query === sug.query ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {sug.label}
              </button>
            ))}
          </div>
        </section>

        {/* Error Notification */}
        {errorMsg && (
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: '#fee2e2',
              border: '1.5px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              color: '#991b1b',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '20px',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Filter by HSK Level Tabs (chỉ hiện khi có kết quả hoặc đã tìm) */}
        {searched && results.length > 0 && (
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
            <span className="text-xs font-extrabold flex items-center gap-1 shrink-0 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
              <Layers size={14} /> Cấp độ:
            </span>
            {HSK_TABS.map((tab) => {
              const active = selectedHskTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedHskTab(tab)}
                  className="px-3 py-1.5 sm:px-3.5 rounded-full font-extrabold text-xs cursor-pointer transition-all shrink-0 whitespace-nowrap"
                  style={{
                    border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border-card)',
                    backgroundColor: active ? 'var(--primary)' : '#ffffff',
                    color: active ? '#ffffff' : 'var(--text-main)',
                  }}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        )}

        {/* Content States */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 0',
              color: 'var(--text-muted)',
              gap: '12px',
            }}
          >
            <Loader2 size={36} className="animate-spin" color="var(--primary)" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Đang tra cứu từ vựng...</span>
          </div>
        ) : !searched ? (
          /* Initial Welcome State */
          <div
            className="bg-white p-5 sm:px-8 sm:py-12 text-center flex flex-col items-center gap-4"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--border-card)',
            }}
          >
            <PandaMascot size={100} />
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold m-0 mb-2" style={{ color: 'var(--text-main)' }}>
                Khám phá kho từ vựng tiếng Trung
              </h2>
              <p
                className="text-sm leading-relaxed m-0 max-w-[540px]"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                Nhập từ khóa vào ô tìm kiếm bên trên để tra cứu. Hệ thống hỗ trợ tìm kiếm chữ Hán, phiên âm pinyin không dấu hoặc có dấu, và nghĩa tiếng Việt tương ứng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-[720px] mt-2 sm:mt-4 text-left">
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '4px' }}>
                  Tìm theo chữ Hán
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Gõ trực tiếp ký tự Hán như <code style={{ color: 'var(--primary)' }}>你好</code>, <code style={{ color: 'var(--primary)' }}>学</code>...
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '4px' }}>
                  Tìm theo Pinyin
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Gõ không dấu <code style={{ color: 'var(--primary)' }}>ni hao</code>, viết liền <code style={{ color: 'var(--primary)' }}>nihao</code> hoặc có dấu.
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-card)',
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '4px' }}>
                  Tìm theo Tiếng Việt
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Gõ nghĩa cần tìm như <code style={{ color: 'var(--primary)' }}>chào bạn</code>, <code style={{ color: 'var(--primary)' }}>cảm ơn</code>...
                </div>
              </div>
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          /* Empty Search Result (TC-04) */
          <div
            id="search-empty-state"
            className="bg-white p-6 sm:px-8 sm:py-12 text-center flex flex-col items-center gap-4"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--border-card)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <SearchX size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                Không tìm thấy từ vựng phù hợp
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, maxWidth: '480px' }}>
                Không có từ vựng nào khớp với từ khóa{' '}
                <strong style={{ color: 'var(--text-main)' }}>"{query}"</strong>
                {selectedHskTab !== 'Tất cả' && ` ở cấp độ ${selectedHskTab}`}.
              </p>
            </div>
            <div
              className="text-xs sm:text-[0.85rem] px-3.5 py-3 sm:px-5 flex items-start sm:items-center gap-2 text-left"
              style={{
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <HelpCircle size={16} color="var(--primary)" className="shrink-0 mt-0.5 sm:mt-0" />
              <span>Gợi ý: Hãy thử từ khóa khác, kiểm tra lại chính tả hoặc chuyển sang tab "Tất cả".</span>
            </div>
          </div>
        ) : (
          /* Results List (TC-01, TC-02, TC-03) */
          <div>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4 px-1">
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Tìm thấy{' '}
                <span style={{ color: 'var(--primary)' }}>{filteredResults.length}</span> từ vựng
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                Hiển thị kết quả tra cứu cho &quot;{query}&quot;
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} id="vocab-search-results">
              {filteredResults.map((vocab) => {
                const isSpeaking = speakingId === vocab.id

                return (
                  <article
                    key={vocab.id}
                    className="vocab-card bg-white p-4 sm:px-6 sm:py-5 transition-all flex flex-col gap-3.5"
                    style={{
                      borderRadius: 'var(--radius-lg)',
                      border: '2px solid var(--border-card)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    {/* Top Row: Hanzi, Pinyin, Meaning, Audio */}
                    <div className="flex justify-between items-start flex-wrap gap-3 sm:gap-4">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        {/* Hanzi Box */}
                        <div
                          className="text-3xl sm:text-[2.2rem] font-extrabold leading-none shrink-0 hanzi"
                          style={{
                            color: 'var(--text-main)',
                            fontFamily: 'serif',
                          }}
                        >
                          {vocab.hanzi}
                        </div>

                        {/* Pinyin & Meaning */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              style={{
                                fontSize: '1.15rem',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {vocab.pinyin}
                            </span>
                            {vocab.partOfSpeech && (
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  color: 'var(--text-muted)',
                                  backgroundColor: 'var(--bg-input)',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {vocab.partOfSpeech}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              marginTop: '4px',
                            }}
                          >
                            {vocab.meaning}
                          </div>
                        </div>
                      </div>

                      {/* Action: Audio Pronunciation */}
                      <button
                        type="button"
                        onClick={() => handlePronounce(vocab)}
                        className="flex items-center gap-1.5 px-3.5 py-2 font-extrabold text-xs cursor-pointer transition-all shrink-0 whitespace-nowrap"
                        style={{
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-card)',
                          backgroundColor: isSpeaking ? 'var(--primary)' : 'var(--bg-card)',
                          color: isSpeaking ? '#ffffff' : 'var(--primary)',
                        }}
                        title="Nghe phát âm từ vựng"
                      >
                        <Volume2 size={16} />
                        <span>{isSpeaking ? 'Đang phát...' : 'Phát âm'}</span>
                      </button>
                    </div>

                    {/* Example sentence (nếu có) */}
                    {vocab.exampleSentence && (
                      <div
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'var(--bg-input)',
                          borderRadius: 'var(--radius-md)',
                          borderLeft: '4px solid var(--primary)',
                          fontSize: '0.88rem',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            fontSize: '0.95rem',
                            fontFamily: 'serif',
                          }}
                          className="hanzi"
                        >
                          {vocab.exampleSentence}
                        </div>
                        {vocab.examplePinyin && (
                          <div style={{ color: 'var(--primary)', fontSize: '0.82rem', marginTop: '2px' }}>
                            {vocab.examplePinyin}
                          </div>
                        )}
                        {vocab.exampleMeaning && (
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '2px' }}>
                            {vocab.exampleMeaning}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Associated Lessons Badge & Navigation */}
                    <div
                      style={{
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <BookOpen size={14} /> Thuộc bài học:
                        </span>

                        {vocab.lessons && vocab.lessons.length > 0 ? (
                          vocab.lessons.map((lesson) => (
                            <button
                              key={lesson.lessonId}
                              type="button"
                              onClick={() => navigate(`/lessons/${lesson.lessonId}`)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white text-xs font-bold cursor-pointer transition-all max-w-full text-left break-words"
                              style={{
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-card)',
                                color: 'var(--text-main)',
                              }}
                              title={`Chuyển đến bài học ${lesson.lessonTitle}`}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--primary)'
                                e.currentTarget.style.color = 'var(--primary)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border-card)'
                                e.currentTarget.style.color = 'var(--text-main)'
                              }}
                            >
                              {lesson.levelCode && (
                                <span
                                  style={{
                                    backgroundColor: 'var(--primary)',
                                    color: '#ffffff',
                                    padding: '1px 5px',
                                    borderRadius: '3px',
                                    fontSize: '0.68rem',
                                    fontWeight: 900,
                                  }}
                                >
                                  {lesson.levelCode}
                                </span>
                              )}
                              <span>{lesson.lessonTitle}</span>
                              <ExternalLink size={12} />
                            </button>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            (Từ vựng tổng hợp)
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
