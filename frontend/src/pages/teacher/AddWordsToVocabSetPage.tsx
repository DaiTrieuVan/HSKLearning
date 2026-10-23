import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  BookMarked,
  BookOpen,
  Check,
  X,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyVocabSets,
  getVocabSetItems,
  searchMyPrivateVocabularies,
  getHskLevels,
  getLessonsByLevel,
  getLessonVocabularies,
  addVocabulariesBatchToVocabSet,
  type VocabSetItem,
  type VocabularyItem,
  type HskLevelItem,
  type LessonItem,
  type PageResponse,
} from '../../api/content'
import { ApiError } from '../../api/auth'

const PART_OF_SPEECH_OPTIONS = [
  'Tất cả loại từ',
  'danh từ',
  'động từ',
  'tính từ',
  'đại từ',
  'phó từ',
  'lượng từ',
  'giới từ',
  'liên từ',
  'trợ từ',
  'thán từ',
]

export const AddWordsToVocabSetPage: React.FC = () => {
  const { vocabSetId } = useParams<{ vocabSetId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const setIdNumber = Number(vocabSetId)

  // Current Vocab Set
  const [currentSet, setCurrentSet] = useState<VocabSetItem | null>(null)
  const [existingWordIds, setExistingWordIds] = useState<Set<number>>(new Set())
  const [loadingSetInfo, setLoadingSetInfo] = useState(true)

  // Active Source Tab: 'PRIVATE' | 'HSK'
  const [sourceTab, setSourceTab] = useState<'PRIVATE' | 'HSK'>('PRIVATE')

  // Selected Words Set (vocabulary IDs)
  const [selectedWordMap, setSelectedWordMap] = useState<Map<number, VocabularyItem>>(new Map())

  // Feedback states
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ==================== TAB 1: KHO TỪ VỰNG RIÊNG ====================
  const [privateVocabPage, setPrivateVocabPage] = useState<PageResponse<VocabularyItem>>({
    content: [],
    number: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  })
  const [privateLoading, setPrivateLoading] = useState(false)
  const [privatePage, setPrivatePage] = useState(0)
  const [privatePageSize] = useState(20)
  const [privateKeyword, setPrivateKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [privatePos, setPrivatePos] = useState('Tất cả loại từ')

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleKeywordChange = (val: string) => {
    setPrivateKeyword(val)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedKeyword(val)
      setPrivatePage(0)
    }, 300)
  }

  // Load Vocab Set Info & Existing Items
  const loadVocabSetData = useCallback(async () => {
    if (!user || !setIdNumber) return
    try {
      setLoadingSetInfo(true)
      const [sets, items] = await Promise.all([
        getMyVocabSets(user.token),
        getVocabSetItems(setIdNumber, user.token),
      ])
      const found = sets.find((s) => s.id === setIdNumber)
      if (found) {
        setCurrentSet(found)
      }
      setExistingWordIds(new Set(items.map((w) => w.id)))
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Không thể tải thông tin bộ từ vựng')
    } finally {
      setLoadingSetInfo(false)
    }
  }, [user, setIdNumber])

  useEffect(() => {
    loadVocabSetData()
  }, [loadVocabSetData])

  // Load Private Words
  const loadPrivateVocabularies = useCallback(async () => {
    if (!user) return
    try {
      setPrivateLoading(true)
      setErrorMessage(null)
      const data = await searchMyPrivateVocabularies(user.token, {
        keyword: debouncedKeyword.trim() || undefined,
        partOfSpeech: privatePos !== 'Tất cả loại từ' ? privatePos : undefined,
        page: privatePage,
        size: privatePageSize,
      })
      setPrivateVocabPage(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setPrivateLoading(false)
    }
  }, [user, debouncedKeyword, privatePos, privatePage, privatePageSize])

  useEffect(() => {
    if (sourceTab === 'PRIVATE') {
      loadPrivateVocabularies()
    }
  }, [sourceTab, loadPrivateVocabularies])

  // ==================== TAB 2: KHO TỪ VỰNG CHUẨN HSK ====================
  const [hskLevels, setHskLevels] = useState<HskLevelItem[]>([])
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [selectedLessonId, setSelectedLessonId] = useState<number | 'ALL'>('ALL')
  const [hskWords, setHskWords] = useState<VocabularyItem[]>([])
  const [hskLoading, setHskLoading] = useState(false)
  const [hskSearchKeyword, setHskSearchKeyword] = useState('')

  // Load HSK Levels
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const levels = await getHskLevels()
        setHskLevels(levels)
        if (levels.length > 0 && selectedLevelId === null) {
          setSelectedLevelId(levels[0].id)
        }
      } catch {
        // ignore
      }
    }
    fetchLevels()
  }, [selectedLevelId])

  // When level changes, load lessons
  useEffect(() => {
    if (!selectedLevelId) return
    const fetchLessons = async () => {
      try {
        const data = await getLessonsByLevel(selectedLevelId, user?.token)
        setLessons(data)
        setSelectedLessonId('ALL')
      } catch {
        setLessons([])
      }
    }
    fetchLessons()
  }, [selectedLevelId, user?.token])

  // Load vocabularies for selected level / lesson
  useEffect(() => {
    if (sourceTab !== 'HSK' || !selectedLevelId) return

    const fetchHskWords = async () => {
      try {
        setHskLoading(true)
        if (selectedLessonId === 'ALL') {
          // Fetch from all lessons in this level
          const wordPromises = lessons.map((l) => getLessonVocabularies(l.id, user?.token).catch(() => []))
          const results = await Promise.all(wordPromises)
          const allMap = new Map<number, VocabularyItem>()
          results.flat().forEach((w) => allMap.set(w.id, w))
          setHskWords(Array.from(allMap.values()))
        } else {
          const words = await getLessonVocabularies(selectedLessonId, user?.token)
          setHskWords(words)
        }
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Không thể tải từ vựng HSK')
      } finally {
        setHskLoading(false)
      }
    }

    if (lessons.length > 0 || selectedLessonId !== 'ALL') {
      fetchHskWords()
    } else {
      setHskWords([])
    }
  }, [sourceTab, selectedLevelId, selectedLessonId, lessons, user?.token])

  // Filter HSK words by search keyword
  const filteredHskWords = hskWords.filter((w) => {
    if (!hskSearchKeyword.trim()) return true
    const kw = hskSearchKeyword.trim().toLowerCase()
    return (
      w.hanzi.toLowerCase().includes(kw) ||
      w.pinyin.toLowerCase().includes(kw) ||
      w.meaning.toLowerCase().includes(kw)
    )
  })

  // ==================== BATCH SELECTION HELPERS ====================
  const toggleSelectWord = (word: VocabularyItem) => {
    if (existingWordIds.has(word.id)) return // Already in set
    setSelectedWordMap((prev) => {
      const next = new Map(prev)
      if (next.has(word.id)) {
        next.delete(word.id)
      } else {
        next.set(word.id, word)
      }
      return next
    })
  }

  const handleSelectAllCurrentPage = (words: VocabularyItem[]) => {
    // Only select words not already in the set
    const eligibleWords = words.filter((w) => !existingWordIds.has(w.id))
    const allEligibleSelected = eligibleWords.every((w) => selectedWordMap.has(w.id))

    setSelectedWordMap((prev) => {
      const next = new Map(prev)
      if (allEligibleSelected) {
        // Deselect all on current page
        eligibleWords.forEach((w) => next.delete(w.id))
      } else {
        // Select all eligible on current page
        eligibleWords.forEach((w) => next.set(w.id, w))
      }
      return next
    })
  }

  const handleClearSelection = () => {
    setSelectedWordMap(new Map())
  }

  // ==================== SUBMIT BATCH ADD ====================
  const handleBatchAddSubmit = async () => {
    if (!user || !setIdNumber || selectedWordMap.size === 0) return

    try {
      setSubmitting(true)
      setErrorMessage(null)
      const vocabIds = Array.from(selectedWordMap.keys())
      const res = await addVocabulariesBatchToVocabSet(setIdNumber, vocabIds, user.token)

      // Add to existingWordIds
      setExistingWordIds((prev) => {
        const next = new Set(prev)
        vocabIds.forEach((id) => next.add(id))
        return next
      })

      // Update currentSet item count
      if (currentSet) {
        setCurrentSet({ ...currentSet, itemCount: currentSet.itemCount + res.addedCount })
      }

      setSuccessMessage(`Đã thêm thành công ${res.addedCount} từ vựng vào bộ "${currentSet?.title || ''}"!`)
      setSelectedWordMap(new Map())
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Có lỗi khi thêm từ vựng vào bộ')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    navigate('/')
    return null
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 120px' }}>
      {/* Top Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/vocab-sets')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
            backgroundColor: '#ffffff',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại Bộ từ vựng</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            Hiện có: {existingWordIds.size} từ trong bộ
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div
        className="game-card"
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          marginBottom: '24px',
          borderLeft: '4px solid var(--primary)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Layers size={22} style={{ color: 'var(--primary)' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                {loadingSetInfo ? 'Đang tải thông tin bộ từ...' : `Thêm từ vựng vào bộ: ${currentSet?.title || 'Bộ từ vựng'}`}
              </h1>
            </div>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              {currentSet?.description || 'Chọn hàng loạt từ vựng từ Kho riêng hoặc Bộ chuẩn HSK để đưa vào bộ từ của lớp.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/vocab-sets')}
            className="btn-gamified btn-gold"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            Xem danh sách bộ từ
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            backgroundColor: '#f0fdf4',
            border: '1.5px solid #86efac',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            color: '#166534',
            fontSize: '0.92rem',
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/vocab-sets')}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Xem bộ từ ngay
            </button>
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            backgroundColor: '#fef2f2',
            border: '1.5px solid #fca5a5',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            color: '#991b1b',
            fontSize: '0.92rem',
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Source Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setSourceTab('PRIVATE')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: 'var(--radius-lg)',
            border: sourceTab === 'PRIVATE' ? '2px solid var(--primary)' : '1px solid var(--border-card)',
            backgroundColor: sourceTab === 'PRIVATE' ? 'var(--primary-light)' : '#ffffff',
            color: sourceTab === 'PRIVATE' ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: sourceTab === 'PRIVATE' ? '0 4px 12px rgba(225, 29, 72, 0.12)' : 'none',
          }}
        >
          <BookMarked size={18} />
          <span>Kho từ vựng riêng của tôi</span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: sourceTab === 'PRIVATE' ? 'var(--primary)' : '#f1f5f9',
              color: sourceTab === 'PRIVATE' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 800,
            }}
          >
            {privateVocabPage.totalElements}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSourceTab('HSK')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: 'var(--radius-lg)',
            border: sourceTab === 'HSK' ? '2px solid var(--primary)' : '1px solid var(--border-card)',
            backgroundColor: sourceTab === 'HSK' ? 'var(--primary-light)' : '#ffffff',
            color: sourceTab === 'HSK' ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: sourceTab === 'HSK' ? '0 4px 12px rgba(225, 29, 72, 0.12)' : 'none',
          }}
        >
          <BookOpen size={18} />
          <span>Kho từ vựng chuẩn HSK (HSK 1 - 6)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SOURCE 1: KHO TỪ VỰNG RIÊNG                                               */}
      {/* ========================================================================= */}
      {sourceTab === 'PRIVATE' && (
        <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '320px' }}>
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Tìm chữ Hán, Pinyin, nghĩa..."
                  value={privateKeyword}
                  onChange={(e) => handleKeywordChange(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '36px' }}
                />
                {privateKeyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setPrivateKeyword('')
                      setDebouncedKeyword('')
                      setPrivatePage(0)
                    }}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Part of Speech Filter */}
              <div style={{ minWidth: '150px' }}>
                <select
                  value={privatePos}
                  onChange={(e) => {
                    setPrivatePos(e.target.value)
                    setPrivatePage(0)
                  }}
                  className="game-input"
                  style={{ width: '100%', padding: '10px 12px' }}
                >
                  {PART_OF_SPEECH_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Select All on Page Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleSelectAllCurrentPage(privateVocabPage.content)}
                disabled={privateVocabPage.content.length === 0}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} />
                <span>
                  {privateVocabPage.content.filter((w) => !existingWordIds.has(w.id)).every((w) => selectedWordMap.has(w.id)) &&
                  privateVocabPage.content.filter((w) => !existingWordIds.has(w.id)).length > 0
                    ? 'Bỏ chọn trang này'
                    : 'Chọn tất cả trên trang'}
                </span>
              </button>
            </div>
          </div>

          {/* Words List Table */}
          {privateLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              Đang tải danh sách từ vựng riêng...
            </div>
          ) : privateVocabPage.content.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              Không tìm thấy từ vựng riêng nào phù hợp với bộ lọc.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <th style={{ padding: '12px 10px', width: '40px' }}>Chọn</th>
                    <th style={{ padding: '12px 10px', width: '140px' }}>Chữ Hán</th>
                    <th style={{ padding: '12px 10px', width: '140px' }}>Phiên âm</th>
                    <th style={{ padding: '12px 10px' }}>Ý nghĩa</th>
                    <th style={{ padding: '12px 10px', width: '120px' }}>Loại từ</th>
                    <th style={{ padding: '12px 10px', width: '140px' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {privateVocabPage.content.map((vocab) => {
                    const isAlreadyInSet = existingWordIds.has(vocab.id)
                    const isSelected = selectedWordMap.has(vocab.id)

                    return (
                      <tr
                        key={vocab.id}
                        onClick={() => toggleSelectWord(vocab)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected
                            ? 'var(--primary-light)'
                            : isAlreadyInSet
                            ? '#f8fafc'
                            : '#ffffff',
                          cursor: isAlreadyInSet ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.1s ease',
                          opacity: isAlreadyInSet ? 0.75 : 1,
                        }}
                      >
                        <td style={{ padding: '12px 10px' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isAlreadyInSet}
                            onChange={() => toggleSelectWord(vocab)}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: isAlreadyInSet ? 'not-allowed' : 'pointer',
                              accentColor: 'var(--primary)',
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span className="hanzi" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                            {vocab.hanzi}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {vocab.pinyin}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {vocab.meaning}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {vocab.partOfSpeech && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: '#f1f5f9',
                                color: 'var(--text-muted)',
                                fontWeight: 700,
                              }}
                            >
                              {vocab.partOfSpeech}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {isAlreadyInSet ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                color: '#16a34a',
                                backgroundColor: '#dcfce7',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>Đã có trong bộ</span>
                            </span>
                          ) : isSelected ? (
                            <span
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                backgroundColor: 'var(--primary-light)',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                              }}
                            >
                              Đang chọn
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chưa có</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {privateVocabPage.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Hiển thị {privateVocabPage.number * privateVocabPage.size + 1} -{' '}
                {Math.min((privateVocabPage.number + 1) * privateVocabPage.size, privateVocabPage.totalElements)}{' '}
                trong tổng số {privateVocabPage.totalElements} từ
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  disabled={privatePage === 0}
                  onClick={() => setPrivatePage((p) => Math.max(0, p - 1))}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    cursor: privatePage === 0 ? 'not-allowed' : 'pointer',
                    opacity: privatePage === 0 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <ChevronLeft size={16} />
                  <span>Trang trước</span>
                </button>

                <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 8px' }}>
                  {privatePage + 1} / {Math.max(1, privateVocabPage.totalPages)}
                </span>

                <button
                  type="button"
                  disabled={privatePage >= privateVocabPage.totalPages - 1}
                  onClick={() => setPrivatePage((p) => p + 1)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    cursor: privatePage >= privateVocabPage.totalPages - 1 ? 'not-allowed' : 'pointer',
                    opacity: privatePage >= privateVocabPage.totalPages - 1 ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Trang sau</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SOURCE 2: KHO TỪ VỰNG CHUẨN HSK                                           */}
      {/* ========================================================================= */}
      {sourceTab === 'HSK' && (
        <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          {/* Level Selector Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginRight: '6px' }}>
              Cấp độ HSK:
            </span>
            {hskLevels.map((lvl) => {
              const isLvlSelected = selectedLevelId === lvl.id
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSelectedLevelId(lvl.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isLvlSelected ? '2px solid var(--primary)' : '1px solid var(--border-card)',
                    backgroundColor: isLvlSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isLvlSelected ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {lvl.title}
                </button>
              )
            })}
          </div>

          {/* Sub-Filters: Lesson & Keyword Search */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '320px' }}>
              {/* Lesson Dropdown */}
              <div style={{ minWidth: '220px' }}>
                <select
                  value={selectedLessonId}
                  onChange={(e) => {
                    const val = e.target.value
                    setSelectedLessonId(val === 'ALL' ? 'ALL' : Number(val))
                  }}
                  className="game-input"
                  style={{ width: '100%', padding: '10px 12px' }}
                >
                  <option value="ALL">Tất cả bài học trong cấp độ ({lessons.length} bài)</option>
                  {lessons.map((les) => (
                    <option key={les.id} value={les.id}>
                      Bài {les.sortOrder}: {les.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyword Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Lọc chữ Hán, Pinyin, nghĩa..."
                  value={hskSearchKeyword}
                  onChange={(e) => setHskSearchKeyword(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', paddingLeft: '36px' }}
                />
                {hskSearchKeyword && (
                  <button
                    type="button"
                    onClick={() => setHskSearchKeyword('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Select All HSK Words Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleSelectAllCurrentPage(filteredHskWords)}
                disabled={filteredHskWords.length === 0}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Check size={16} />
                <span>
                  {filteredHskWords.filter((w) => !existingWordIds.has(w.id)).every((w) => selectedWordMap.has(w.id)) &&
                  filteredHskWords.filter((w) => !existingWordIds.has(w.id)).length > 0
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả từ hiển thị'}
                </span>
              </button>
            </div>
          </div>

          {/* HSK Words List Table */}
          {hskLoading ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              Đang tải danh sách từ vựng chuẩn HSK...
            </div>
          ) : filteredHskWords.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
              Không có từ vựng HSK nào phù hợp với bộ lọc.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <th style={{ padding: '12px 10px', width: '40px' }}>Chọn</th>
                    <th style={{ padding: '12px 10px', width: '140px' }}>Chữ Hán</th>
                    <th style={{ padding: '12px 10px', width: '140px' }}>Phiên âm</th>
                    <th style={{ padding: '12px 10px' }}>Ý nghĩa</th>
                    <th style={{ padding: '12px 10px', width: '120px' }}>Loại từ</th>
                    <th style={{ padding: '12px 10px', width: '140px' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHskWords.map((vocab) => {
                    const isAlreadyInSet = existingWordIds.has(vocab.id)
                    const isSelected = selectedWordMap.has(vocab.id)

                    return (
                      <tr
                        key={vocab.id}
                        onClick={() => toggleSelectWord(vocab)}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected
                            ? 'var(--primary-light)'
                            : isAlreadyInSet
                            ? '#f8fafc'
                            : '#ffffff',
                          cursor: isAlreadyInSet ? 'not-allowed' : 'pointer',
                          transition: 'background-color 0.1s ease',
                          opacity: isAlreadyInSet ? 0.75 : 1,
                        }}
                      >
                        <td style={{ padding: '12px 10px' }} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isAlreadyInSet}
                            onChange={() => toggleSelectWord(vocab)}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: isAlreadyInSet ? 'not-allowed' : 'pointer',
                              accentColor: 'var(--primary)',
                            }}
                          />
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span className="hanzi" style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)' }}>
                            {vocab.hanzi}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {vocab.pinyin}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {vocab.meaning}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {vocab.partOfSpeech && (
                            <span
                              style={{
                                fontSize: '0.75rem',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: '#f1f5f9',
                                color: 'var(--text-muted)',
                                fontWeight: 700,
                              }}
                            >
                              {vocab.partOfSpeech}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {isAlreadyInSet ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                color: '#16a34a',
                                backgroundColor: '#dcfce7',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                              }}
                            >
                              <CheckCircle2 size={12} />
                              <span>Đã có trong bộ</span>
                            </span>
                          ) : isSelected ? (
                            <span
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                backgroundColor: 'var(--primary-light)',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-full)',
                              }}
                            >
                              Đang chọn
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chưa có</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING ACTION BAR DOCK (Sticky Bottom)                                  */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
          borderTop: '1.5px solid var(--border-card)',
          padding: '16px 24px',
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Left: Selected count & Preview chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '300px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedWordMap.size > 0 ? 'var(--primary-light)' : '#f1f5f9',
                color: selectedWordMap.size > 0 ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.92rem',
              }}
            >
              <Sparkles size={18} />
              <span>Đã chọn: {selectedWordMap.size} từ</span>
            </div>

            {selectedWordMap.size > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Bỏ chọn tất cả
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    overflowX: 'auto',
                    maxWidth: '450px',
                    padding: '2px 0',
                  }}
                >
                  {Array.from(selectedWordMap.values())
                    .slice(0, 6)
                    .map((w) => (
                      <span
                        key={w.id}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#f1f5f9',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                        }}
                      >
                        <span className="hanzi">{w.hanzi}</span>
                        <X
                          size={12}
                          style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                          onClick={() => toggleSelectWord(w)}
                        />
                      </span>
                    ))}
                  {selectedWordMap.size > 6 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      +{selectedWordMap.size - 6} từ khác
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/vocab-sets')}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-card)',
                backgroundColor: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Quay lại Bộ từ vựng
            </button>

            <button
              type="button"
              disabled={submitting || selectedWordMap.size === 0}
              onClick={handleBatchAddSubmit}
              className="btn-gamified btn-primary"
              style={{
                padding: '10px 28px',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: submitting || selectedWordMap.size === 0 ? 'not-allowed' : 'pointer',
                opacity: submitting || selectedWordMap.size === 0 ? 0.6 : 1,
              }}
            >
              <Plus size={18} />
              <span>{submitting ? 'Đang thêm từ...' : `+ Thêm ${selectedWordMap.size} từ vào bộ`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
