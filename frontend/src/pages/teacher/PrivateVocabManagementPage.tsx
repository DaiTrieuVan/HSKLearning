import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Download,
  Trash2,
  Table as TableIcon,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
  BookMarked,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  searchMyPrivateVocabularies,
  createVocabulary,
  importVocabularies,
  deleteVocabulary,
  createVocabSet,
  addVocabularyToVocabSet,
  type VocabularyItem,
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

export const PrivateVocabManagementPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Data & Pagination state
  const [vocabPage, setVocabPage] = useState<PageResponse<VocabularyItem> | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  // Filters & Sorting state
  const [searchKeyword, setSearchKeyword] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [selectedPos, setSelectedPos] = useState('Tất cả loại từ')
  const [sortBy, setSortBy] = useState<'createdAt' | 'hanzi' | 'pinyin'>('createdAt')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE')

  // Inline forms
  const [showAddWord, setShowAddWord] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showCreateSetFromSelected, setShowCreateSetFromSelected] = useState(false)

  // Add Word Form State
  const [newHanzi, setNewHanzi] = useState('')
  const [newPinyin, setNewPinyin] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('')
  const [newExampleSentence, setNewExampleSentence] = useState('')
  const [newExamplePinyin, setNewExamplePinyin] = useState('')
  const [newExampleMeaning, setNewExampleMeaning] = useState('')
  const [addingWord, setAddingWord] = useState(false)

  // Import CSV State
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  // Batch selection
  const [selectedWordIds, setSelectedWordIds] = useState<number[]>([])
  const [newSetName, setNewSetName] = useState('')
  const [newSetDescription, setNewSetDescription] = useState('')
  const [creatingSet, setCreatingSet] = useState(false)

  // Notifications & Feedback
  const [notification, setNotification] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Debounce search input
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleSearchChange = (val: string) => {
    setSearchKeyword(val)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedKeyword(val)
      setPage(0)
    }, 350)
  }

  const showFeedback = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  // Load Vocabularies
  const loadVocabularies = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await searchMyPrivateVocabularies(user.token, {
        keyword: debouncedKeyword.trim() || undefined,
        partOfSpeech: selectedPos !== 'Tất cả loại từ' ? selectedPos : undefined,
        page,
        size: pageSize,
        sortBy,
        sortDir,
      })
      setVocabPage(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải danh sách từ vựng riêng')
      }
    } finally {
      setLoading(false)
    }
  }, [user, debouncedKeyword, selectedPos, page, pageSize, sortBy, sortDir])

  useEffect(() => {
    loadVocabularies()
  }, [loadVocabularies])

  // Download CSV template
  const handleDownloadTemplate = () => {
    const headers = 'hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning'
    const sampleRows = [
      '老师,lǎoshī,thầy giáo/cô giáo,danh từ,李老师很好。,Lǐ lǎoshī hěn hǎo.,Thầy Lý rất tốt.',
      '学生,xuésheng,học sinh,danh từ,他是我的学生。,Tā shì wǒ de xuésheng.,Em ấy là học sinh của tôi.',
      '学习,xuéxí,học tập,động từ,我们要努力学习。,Wǒmen yào nǔlì xuéxí.,Chúng ta phải chăm chỉ học tập.',
    ]
    const csvContent = '\uFEFF' + [headers, ...sampleRows].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'mau_tu_vung_rieng.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Import CSV
  const handleImportPrivateWords = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile || !user) return
    try {
      setImporting(true)
      setErrorMessage(null)
      const res = await importVocabularies(importFile, 1, true, user.token)
      setShowImport(false)
      setImportFile(null)
      loadVocabularies()
      showFeedback(`Nhập thành công ${res.successCount} từ vựng riêng (bỏ qua ${res.skippedCount})!`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setImporting(false)
    }
  }

  // Add single word
  const handleCreatePrivateWord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()) return
    try {
      setAddingWord(true)
      setErrorMessage(null)
      await createVocabulary(
        {
          hanzi: newHanzi.trim(),
          pinyin: newPinyin.trim(),
          meaning: newMeaning.trim(),
          partOfSpeech: newPartOfSpeech.trim() || undefined,
          exampleSentence: newExampleSentence.trim() || undefined,
          examplePinyin: newExamplePinyin.trim() || undefined,
          exampleMeaning: newExampleMeaning.trim() || undefined,
          isPrivate: true,
        },
        user.token
      )
      setNewHanzi('')
      setNewPinyin('')
      setNewMeaning('')
      setNewPartOfSpeech('')
      setNewExampleSentence('')
      setNewExamplePinyin('')
      setNewExampleMeaning('')
      setShowAddWord(false)
      loadVocabularies()
      showFeedback('Đã thêm từ vựng mới thành công!')
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setAddingWord(false)
    }
  }

  // Delete single word
  const handleDeleteWord = async (id: number, hanzi: string) => {
    if (!user) return
    if (!window.confirm(`Bạn có chắc chắn muốn xóa từ vựng "${hanzi}" khỏi kho riêng?`)) {
      return
    }
    try {
      setDeletingId(id)
      await deleteVocabulary(id, user.token)
      showFeedback(`Đã xóa từ "${hanzi}" thành công!`)
      setSelectedWordIds((prev) => prev.filter((item) => item !== id))
      loadVocabularies()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setDeletingId(null)
    }
  }

  // Batch selection
  const handleSelectAllOnPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!vocabPage) return
    const currentPageIds = vocabPage.content.map((v) => v.id)
    if (e.target.checked) {
      setSelectedWordIds((prev) => Array.from(new Set([...prev, ...currentPageIds])))
    } else {
      setSelectedWordIds((prev) => prev.filter((id) => !currentPageIds.includes(id)))
    }
  }

  const handleToggleSelectWord = (id: number) => {
    setSelectedWordIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Create Vocab Set from selected words
  const handleCreateSetFromSelected = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || selectedWordIds.length === 0 || !newSetName.trim()) return

    try {
      setCreatingSet(true)
      setErrorMessage(null)
      const newSet = await createVocabSet(
        {
          title: newSetName.trim(),
          description: newSetDescription.trim() || undefined,
        },
        user.token
      )

      // Add each selected word to the new set
      for (const vocabId of selectedWordIds) {
        await addVocabularyToVocabSet(newSet.id, vocabId, user.token)
      }

      setShowCreateSetFromSelected(false)
      setNewSetName('')
      setNewSetDescription('')
      setSelectedWordIds([])
      showFeedback(`Đã tạo bộ từ "${newSet.title}" với ${selectedWordIds.length} từ vựng đã chọn!`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setCreatingSet(false)
    }
  }

  const totalWords = vocabPage?.totalElements || 0
  const totalPages = vocabPage?.totalPages || 0
  const isAllCurrentPageSelected =
    vocabPage &&
    vocabPage.content.length > 0 &&
    vocabPage.content.every((v) => selectedWordIds.includes(v.id))

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '28px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation & Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-card)',
                backgroundColor: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={16} />
              <span>Bảng điều khiển</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/vocab-sets')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-card)',
                backgroundColor: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              <BookMarked size={16} />
              <span>Bộ từ vựng của lớp</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="btn-gamified btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              title="Tải về file Excel/CSV mẫu chuẩn UTF-8"
            >
              <Download size={16} />
              <span>Tải file mẫu CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImport(!showImport)
                if (showAddWord) setShowAddWord(false)
              }}
              className="btn-gamified btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FileSpreadsheet size={16} />
              <span>{showImport ? 'Đóng CSV' : 'Nhập CSV'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddWord(!showAddWord)
                if (showImport) setShowImport(false)
              }}
              className="btn-gamified btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} />
              <span>{showAddWord ? 'Đóng thêm từ' : 'Thêm từ mới'}</span>
            </button>
          </div>
        </div>

        {/* Title & Stats Banner */}
        <div
          className="game-card"
          style={{
            padding: '24px 28px',
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--border-card)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Kho Từ Vựng Riêng của Giáo Viên
              </h1>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--accent-gold-light)',
                  color: 'var(--accent-gold-shadow)',
                  border: '1px solid var(--accent-gold)',
                }}
              >
                {totalWords.toLocaleString('vi-VN')} từ vựng
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Quản lý toàn bộ kho từ vựng cá nhân dùng để đóng gói bài tập và giao bộ từ vựng cho các lớp học.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className="animate-fade-in"
            style={{
              padding: '12px 18px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-md)',
              color: '#065f46',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              padding: '12px 18px',
              backgroundColor: '#fef2f2',
              border: '1px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              color: '#991b1b',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#991b1b' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Inline Import CSV Panel */}
        {showImport && (
          <div
            className="game-card animate-fade-in"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              marginBottom: '20px',
              border: '2px solid var(--accent-gold)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-main)' }}>
                  Nhập danh sách từ vựng riêng từ file CSV
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Định dạng cột CSV: <code>hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning</code>
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="btn-gamified btn-gold"
                style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} />
                <span>Tải file mẫu CSV</span>
              </button>
            </div>
            <form onSubmit={handleImportPrivateWords} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                required
                style={{ flex: 1, padding: '8px', border: '1px dashed var(--border-card)', borderRadius: 'var(--radius-md)' }}
              />
              <button
                type="button"
                onClick={() => setShowImport(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-card)',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={importing || !importFile}
                className="btn-gamified btn-gold"
                style={{ padding: '8px 20px', fontSize: '0.88rem' }}
              >
                {importing ? 'Đang nhập...' : 'Tải lên & Nhập'}
              </button>
            </form>
          </div>
        )}

        {/* Inline Add Word Panel */}
        {showAddWord && (
          <div
            className="game-card animate-fade-in"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              marginBottom: '20px',
              border: '2px solid var(--primary)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-main)' }}>
              Thêm từ vựng riêng mới
            </h3>
            <form onSubmit={handleCreatePrivateWord} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Chữ Hán (Hanzi) <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: 咖啡"
                  value={newHanzi}
                  onChange={(e) => setNewHanzi(e.target.value)}
                  className="game-input hanzi"
                  style={{ width: '100%', boxSizing: 'border-box', fontSize: '1.1rem', padding: '8px 12px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Phiên âm (Pinyin) <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: kā fēi"
                  value={newPinyin}
                  onChange={(e) => setNewPinyin(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nghĩa tiếng Việt <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Cà phê"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Loại từ (Tùy chọn)
                </label>
                <select
                  value={newPartOfSpeech}
                  onChange={(e) => setNewPartOfSpeech(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                >
                  <option value="">Chọn loại từ</option>
                  <option value="danh từ">Danh từ</option>
                  <option value="động từ">Động từ</option>
                  <option value="tính từ">Tính từ</option>
                  <option value="đại từ">Đại từ</option>
                  <option value="phó từ">Phó từ</option>
                  <option value="lượng từ">Lượng từ</option>
                  <option value="giới từ">Giới từ</option>
                  <option value="liên từ">Liên từ</option>
                  <option value="trợ từ">Trợ từ</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Câu ví dụ tiếng Trung (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: 我想喝一杯咖啡。"
                  value={newExampleSentence}
                  onChange={(e) => setNewExampleSentence(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Pinyin ví dụ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Wǒ xiǎng hē yì bēi kāfēi."
                  value={newExamplePinyin}
                  onChange={(e) => setNewExamplePinyin(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nghĩa câu ví dụ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Tôi muốn uống một cốc cà phê."
                  value={newExampleMeaning}
                  onChange={(e) => setNewExampleMeaning(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddWord(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={addingWord || !newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 24px', fontSize: '0.88rem' }}
                >
                  {addingWord ? 'Đang thêm...' : 'Lưu từ vựng'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inline Create Vocab Set from Selected Words */}
        {showCreateSetFromSelected && (
          <div
            className="game-card animate-fade-in"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              marginBottom: '20px',
              border: '2px solid #2563eb',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderPlus size={20} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Tạo Bộ từ vựng mới từ {selectedWordIds.length} từ đã chọn
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateSetFromSelected(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSetFromSelected} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Tên Bộ từ vựng <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Từ vựng chuyên đề Du Lịch & Mua Sắm"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                  Mô tả bộ từ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Dành cho học sinh ôn thi cuối kỳ"
                  value={newSetDescription}
                  onChange={(e) => setNewSetDescription(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateSetFromSelected(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingSet || !newSetName.trim()}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                >
                  {creatingSet ? 'Đang tạo...' : `Tạo Bộ Từ (${selectedWordIds.length} từ)`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search, Filter & View Controls Bar */}
        <div
          className="game-card"
          style={{
            padding: '16px 20px',
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--border-card)',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Left: Search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 320px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
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
                placeholder="Tìm kiếm theo chữ Hán, pinyin hoặc nghĩa tiếng Việt..."
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="game-input"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '8px 12px 8px 36px',
                  fontSize: '0.88rem',
                }}
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
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
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Center: Part of speech filter & Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={15} style={{ color: 'var(--text-muted)' }} />
              <select
                value={selectedPos}
                onChange={(e) => {
                  setSelectedPos(e.target.value)
                  setPage(0)
                }}
                className="game-input"
                style={{ padding: '7px 10px', fontSize: '0.84rem' }}
              >
                {PART_OF_SPEECH_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={`${sortBy}_${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('_') as [
                  'createdAt' | 'hanzi' | 'pinyin',
                  'desc' | 'asc'
                ]
                setSortBy(sb)
                setSortDir(sd)
                setPage(0)
              }}
              className="game-input"
              style={{ padding: '7px 10px', fontSize: '0.84rem' }}
            >
              <option value="createdAt_desc">Mới nhất trước</option>
              <option value="createdAt_asc">Cũ nhất trước</option>
              <option value="hanzi_asc">Chữ Hán (A-Z)</option>
              <option value="pinyin_asc">Pinyin (A-Z)</option>
            </select>
          </div>

          {/* Right: View mode switch (Table vs Grid) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              onClick={() => setViewMode('TABLE')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'TABLE' ? '#ffffff' : 'transparent',
                color: viewMode === 'TABLE' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'TABLE' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              title="Xem dạng Bảng quản trị dữ liệu"
            >
              <TableIcon size={15} />
              <span>Bảng</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('GRID')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: viewMode === 'GRID' ? '#ffffff' : 'transparent',
                color: viewMode === 'GRID' ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'GRID' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              title="Xem dạng Lưới thẻ từ vựng"
            >
              <LayoutGrid size={15} />
              <span>Thẻ</span>
            </button>
          </div>
        </div>

        {/* Batch Action Floating Banner */}
        {selectedWordIds.length > 0 && (
          <div
            className="animate-fade-in"
            style={{
              padding: '12px 20px',
              backgroundColor: '#eff6ff',
              border: '1.5px solid #3b82f6',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#1e40af', fontWeight: 800 }}>
              <CheckCircle2 size={18} style={{ color: '#2563eb' }} />
              <span>Đã chọn {selectedWordIds.length} từ vựng</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowCreateSetFromSelected(true)}
                className="btn-gamified btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <FolderPlus size={15} />
                <span>Tạo Bộ từ vựng từ các từ đã chọn</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedWordIds([])}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #94a3b8',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}

        {/* Main Content: Table or Grid */}
        <div className="game-card" style={{ padding: '0', backgroundColor: '#ffffff', overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Đang tải danh sách từ vựng...
            </div>
          ) : !vocabPage || vocabPage.content.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Không tìm thấy từ vựng nào
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                {searchKeyword || selectedPos !== 'Tất cả loại từ'
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc loại từ.'
                  : 'Kho từ vựng riêng của bạn đang rỗng. Hãy thêm từ mới hoặc nhập từ file CSV.'}
              </div>
            </div>
          ) : viewMode === 'TABLE' ? (
            /* ========================================================
               DATA TABLE VIEW (Optimized for large lists)
               ======================================================== */
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid var(--border-card)' }}>
                    <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!isAllCurrentPageSelected}
                        onChange={handleSelectAllOnPage}
                        style={{ cursor: 'pointer' }}
                        title="Chọn tất cả từ trên trang này"
                      />
                    </th>
                    <th style={{ padding: '12px 14px', width: '50px', color: 'var(--text-muted)', fontWeight: 800 }}>STT</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)', width: '140px' }}>Chữ Hán</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)', width: '130px' }}>Pinyin</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)', width: '110px' }}>Loại từ</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>Nghĩa tiếng Việt</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)' }}>Câu ví dụ</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-main)', width: '80px', textAlign: 'center' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {vocabPage.content.map((word, idx) => {
                    const isSelected = selectedWordIds.includes(word.id)
                    const rowNumber = page * pageSize + idx + 1
                    return (
                      <tr
                        key={word.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectWord(word.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>{rowNumber}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span className="hanzi" style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-chinese)' }}>
                            {word.hanzi}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', color: 'var(--primary)', fontWeight: 800 }}>
                          {word.pinyin}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          {word.partOfSpeech ? (
                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: '#f1f5f9',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {word.partOfSpeech}
                            </span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-main)' }}>
                          {word.meaning}
                        </td>
                        <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {word.exampleSentence ? (
                            <div>
                              <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{word.exampleSentence}</div>
                              {word.exampleMeaning && <div style={{ fontSize: '0.78rem' }}>{word.exampleMeaning}</div>}
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(word.id, word.hanzi)}
                            disabled={deletingId === word.id}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: 'var(--radius-sm)',
                            }}
                            title={`Xóa từ "${word.hanzi}"`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* ========================================================
               CARDS GRID VIEW
               ======================================================== */
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {vocabPage.content.map((word) => {
                const isSelected = selectedWordIds.includes(word.id)
                return (
                  <div
                    key={word.id}
                    onClick={() => handleToggleSelectWord(word.id)}
                    className="game-card"
                    style={{
                      padding: '16px',
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      border: isSelected ? '2px solid #16a34a' : '1.5px solid var(--border-card)',
                      borderRadius: 'var(--radius-lg)',
                      position: 'relative',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleToggleSelectWord(word.id)
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteWord(word.id, word.hanzi)
                          }}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          title="Xóa từ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="hanzi" style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-chinese)', marginBottom: '4px' }}>
                        {word.hanzi}
                      </div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '6px' }}>
                        {word.pinyin}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.4 }}>
                        {word.meaning}
                      </div>

                      {word.partOfSpeech && (
                        <div style={{ marginTop: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: '#f1f5f9',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {word.partOfSpeech}
                          </span>
                        </div>
                      )}
                    </div>

                    {word.exampleSentence && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        <div>&ldquo;{word.exampleSentence}&rdquo;</div>
                        {word.exampleMeaning && <div style={{ fontSize: '0.74rem', marginTop: '2px' }}>{word.exampleMeaning}</div>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ========================================================
              PAGINATION CONTROLS FOOTER
             ======================================================== */}
          {vocabPage && vocabPage.totalElements > 0 && (
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1.5px solid var(--border-card)',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {/* Left: Summary and Page Size */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <span>
                  Đang xem{' '}
                  <strong style={{ color: 'var(--text-main)' }}>
                    {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalWords)}
                  </strong>{' '}
                  trong tổng số <strong style={{ color: 'var(--text-main)' }}>{totalWords.toLocaleString('vi-VN')}</strong> từ
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPage(0)
                    }}
                    className="game-input"
                    style={{ padding: '4px 8px', fontSize: '0.82rem' }}
                  >
                    <option value={20}>20 từ/trang</option>
                    <option value={50}>50 từ/trang</option>
                    <option value={100}>100 từ/trang</option>
                  </select>
                </div>
              </div>

              {/* Right: Page navigation buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: page === 0 ? '#f1f5f9' : '#ffffff',
                    color: page === 0 ? '#94a3b8' : 'var(--text-main)',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Về trang đầu"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: page === 0 ? '#f1f5f9' : '#ffffff',
                    color: page === 0 ? '#94a3b8' : 'var(--text-main)',
                    cursor: page === 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>

                <span style={{ fontSize: '0.84rem', fontWeight: 800, padding: '0 8px', color: 'var(--text-main)' }}>
                  Trang {page + 1} / {Math.max(1, totalPages)}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: page >= totalPages - 1 ? '#f1f5f9' : '#ffffff',
                    color: page >= totalPages - 1 ? '#94a3b8' : 'var(--text-main)',
                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  }}
                  title="Trang sau"
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setPage(Math.max(0, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-card)',
                    backgroundColor: page >= totalPages - 1 ? '#f1f5f9' : '#ffffff',
                    color: page >= totalPages - 1 ? '#94a3b8' : 'var(--text-main)',
                    cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  }}
                  title="Đến trang cuối"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
