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
    <div className="w-full max-w-[1200px] mx-auto">
      <div>
        {/* Navigation & Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4 sm:mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border-card)] bg-white font-bold text-xs sm:text-[0.86rem] cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft size={16} />
              <span>Bảng điều khiển</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/vocab-sets')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border-card)] bg-white font-bold text-xs sm:text-[0.86rem] cursor-pointer whitespace-nowrap"
            >
              <BookMarked size={16} />
              <span>Bộ từ vựng của lớp</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="btn-gamified btn-gold inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-[0.86rem] whitespace-nowrap"
              title="Tải về file Excel/CSV mẫu chuẩn UTF-8"
            >
              <Download size={15} />
              <span>Tải file mẫu CSV</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImport(!showImport)
                if (showAddWord) setShowAddWord(false)
              }}
              className="btn-gamified btn-gold inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-[0.86rem] whitespace-nowrap"
            >
              <FileSpreadsheet size={15} />
              <span>{showImport ? 'Đóng CSV' : 'Nhập CSV'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddWord(!showAddWord)
                if (showImport) setShowImport(false)
              }}
              className="btn-gamified btn-primary inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-[0.86rem] whitespace-nowrap"
            >
              <Plus size={15} />
              <span>{showAddWord ? 'Đóng thêm từ' : 'Thêm từ mới'}</span>
            </button>
          </div>
        </div>

        {/* Title & Stats Banner */}
        <div className="game-card p-4 sm:px-7 sm:py-5 bg-white border-[1.5px] border-[var(--border-card)] mb-4 sm:mb-5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
            <h1 className="text-lg sm:text-[1.45rem] font-black text-[var(--text-main)] m-0 leading-snug">
              Kho Từ Vựng Riêng của Giáo Viên
            </h1>
            <span
              className="text-xs sm:text-[0.84rem] font-extrabold px-3 py-1 rounded-full whitespace-nowrap shrink-0"
              style={{
                backgroundColor: 'var(--accent-gold-light)',
                color: 'var(--accent-gold-shadow)',
                border: '1px solid var(--accent-gold)',
              }}
            >
              {totalWords.toLocaleString('vi-VN')} từ vựng
            </span>
          </div>
          <p className="m-0 text-xs sm:text-[0.88rem] text-[var(--text-muted)] leading-relaxed">
            Quản lý toàn bộ kho từ vựng cá nhân dùng để đóng gói bài tập và giao bộ từ vựng cho các lớp học.
          </p>
        </div>

        {/* Notifications */}
        {notification && (
          <div className="animate-fade-in p-3 sm:px-4 bg-emerald-50 border border-emerald-500 rounded-[var(--radius-md)] text-emerald-800 mb-4 flex items-center gap-2.5 font-bold text-xs sm:text-sm">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {errorMessage && (
          <div className="animate-fade-in p-3 sm:px-4 bg-red-50 border border-red-500 rounded-[var(--radius-md)] text-red-800 mb-4 flex items-center justify-between gap-2.5 font-bold text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="border-none bg-transparent cursor-pointer text-red-800 shrink-0 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Inline Import CSV Panel */}
        {showImport && (
          <div
            className="game-card animate-fade-in p-4 sm:p-6 bg-white mb-5"
            style={{ border: '2px solid var(--accent-gold)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-extrabold m-0 mb-1.5 text-[var(--text-main)]">
                  Nhập danh sách từ vựng riêng từ file CSV
                </h3>
                <p className="text-xs text-[var(--text-muted)] m-0 leading-relaxed">
                  Định dạng cột CSV:{' '}
                  <code className="break-all">hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning</code>
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="btn-gamified btn-gold self-start shrink-0 px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Download size={14} />
                <span>Tải file mẫu CSV</span>
              </button>
            </div>
            <form onSubmit={handleImportPrivateWords} className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                required
                className="w-full sm:flex-1 min-w-0 p-2 border border-dashed border-[var(--border-card)] rounded-[var(--radius-md)] text-xs sm:text-sm"
              />
              <div className="flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border-card)] bg-white font-bold text-xs sm:text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={importing || !importFile}
                  className="btn-gamified btn-gold px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  {importing ? 'Đang nhập...' : 'Tải lên & Nhập'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inline Add Word Panel */}
        {showAddWord && (
          <div
            className="game-card animate-fade-in p-4 sm:p-6 bg-white mb-5"
            style={{ border: '2px solid var(--primary)' }}
          >
            <h3 className="text-base sm:text-lg font-extrabold m-0 mb-4 text-[var(--text-main)]">
              Thêm từ vựng riêng mới
            </h3>
            <form onSubmit={handleCreatePrivateWord} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Chữ Hán (Hanzi) <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: 咖啡"
                  value={newHanzi}
                  onChange={(e) => setNewHanzi(e.target.value)}
                  className="game-input hanzi w-full box-border text-base sm:text-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Phiên âm (Pinyin) <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: kā fēi"
                  value={newPinyin}
                  onChange={(e) => setNewPinyin(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Nghĩa tiếng Việt <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Cà phê"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Loại từ (Tùy chọn)
                </label>
                <select
                  value={newPartOfSpeech}
                  onChange={(e) => setNewPartOfSpeech(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
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
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Câu ví dụ tiếng Trung (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: 我想喝一杯咖啡。"
                  value={newExampleSentence}
                  onChange={(e) => setNewExampleSentence(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Pinyin ví dụ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Wǒ xiǎng hē yì bēi kāfēi."
                  value={newExamplePinyin}
                  onChange={(e) => setNewExamplePinyin(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Nghĩa câu ví dụ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Tôi muốn uống một cốc cà phê."
                  value={newExampleMeaning}
                  onChange={(e) => setNewExampleMeaning(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWord(false)}
                  className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border-card)] bg-white font-bold text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={addingWord || !newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()}
                  className="btn-gamified btn-primary px-6 py-2 text-sm justify-center"
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
            className="game-card animate-fade-in p-4 sm:p-6 bg-white mb-5"
            style={{ border: '2px solid #2563eb' }}
          >
            <div className="flex justify-between items-center gap-2 mb-3.5">
              <div className="flex items-center gap-2 min-w-0">
                <FolderPlus size={20} className="shrink-0" style={{ color: '#2563eb' }} />
                <h3 className="text-base sm:text-lg font-extrabold m-0 text-[var(--text-main)]">
                  Tạo Bộ từ vựng mới từ {selectedWordIds.length} từ đã chọn
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateSetFromSelected(false)}
                className="border-none bg-transparent cursor-pointer text-[var(--text-muted)] shrink-0 p-1"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateSetFromSelected} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Tên Bộ từ vựng <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Từ vựng chuyên đề Du Lịch & Mua Sắm"
                  value={newSetName}
                  onChange={(e) => setNewSetName(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-[0.84rem] font-bold mb-1.5">
                  Mô tả bộ từ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: Dành cho học sinh ôn thi cuối kỳ"
                  value={newSetDescription}
                  onChange={(e) => setNewSetDescription(e.target.value)}
                  className="game-input w-full box-border px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setShowCreateSetFromSelected(false)}
                  className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border-card)] bg-white font-bold text-sm cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creatingSet || !newSetName.trim()}
                  className="btn-gamified btn-primary px-5 py-2 text-sm justify-center whitespace-nowrap"
                >
                  {creatingSet ? 'Đang tạo...' : `Tạo Bộ Từ (${selectedWordIds.length} từ)`}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search, Filter & View Controls Bar */}
        <div className="game-card p-3.5 sm:px-5 sm:py-4 bg-white border-[1.5px] border-[var(--border-card)] mb-4 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 sm:gap-3">
          {/* Left: Search input */}
          <div className="w-full lg:flex-1 min-w-0">
            <div className="relative w-full">
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
                placeholder="Tìm chữ Hán, pinyin hoặc nghĩa tiếng Việt..."
                value={searchKeyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="game-input w-full box-border py-2 pr-8 pl-9 text-xs sm:text-sm"
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

          {/* Center & Right: Filter, Sort & View toggle */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2">
            <div className="flex flex-wrap items-center gap-2 flex-1 sm:flex-initial">
              <div className="flex items-center gap-1.5 flex-1 sm:flex-initial min-w-[135px]">
                <Filter size={15} className="shrink-0 hidden sm:inline" style={{ color: 'var(--text-muted)' }} />
                <select
                  value={selectedPos}
                  onChange={(e) => {
                    setSelectedPos(e.target.value)
                    setPage(0)
                  }}
                  className="game-input w-full sm:w-auto py-1.5 px-2.5 text-xs sm:text-[0.84rem]"
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
                className="game-input flex-1 sm:flex-initial min-w-[130px] py-1.5 px-2.5 text-xs sm:text-[0.84rem]"
              >
                <option value="createdAt_desc">Mới nhất trước</option>
                <option value="createdAt_asc">Cũ nhất trước</option>
                <option value="hanzi_asc">Chữ Hán (A-Z)</option>
                <option value="pinyin_asc">Pinyin (A-Z)</option>
              </select>
            </div>

            {/* Right: View mode switch (Table vs Grid) */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-[var(--radius-md)] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('TABLE')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] border-none font-extrabold text-xs cursor-pointer"
                style={{
                  backgroundColor: viewMode === 'TABLE' ? '#ffffff' : 'transparent',
                  color: viewMode === 'TABLE' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: viewMode === 'TABLE' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
                title="Xem dạng Bảng quản trị dữ liệu"
              >
                <TableIcon size={14} />
                <span>Bảng</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('GRID')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] border-none font-extrabold text-xs cursor-pointer"
                style={{
                  backgroundColor: viewMode === 'GRID' ? '#ffffff' : 'transparent',
                  color: viewMode === 'GRID' ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: viewMode === 'GRID' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
                title="Xem dạng Lưới thẻ từ vựng"
              >
                <LayoutGrid size={14} />
                <span>Thẻ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Batch Action Floating Banner */}
        {selectedWordIds.length > 0 && (
          <div className="animate-fade-in p-3 sm:px-5 bg-blue-50 border-[1.5px] border-blue-500 rounded-[var(--radius-md)] mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-sm text-blue-800 font-extrabold">
              <CheckCircle2 size={18} className="shrink-0 text-blue-600" />
              <span>Đã chọn {selectedWordIds.length} từ vựng</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateSetFromSelected(true)}
                className="btn-gamified btn-primary px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <FolderPlus size={15} />
                <span>Tạo Bộ từ vựng từ các từ đã chọn</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedWordIds([])}
                className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-slate-400 bg-white text-xs font-bold text-[var(--text-muted)] cursor-pointer whitespace-nowrap"
              >
                Bỏ chọn
              </button>
            </div>
          </div>
        )}

        {/* Main Content: Table or Grid */}
        <div className="game-card" style={{ padding: '0', backgroundColor: '#ffffff', overflow: 'hidden', border: '1.5px solid var(--border-card)' }}>
          {loading ? (
            <div className="text-center py-12 px-5 text-[var(--text-muted)] font-semibold text-sm">
              Đang tải danh sách từ vựng...
            </div>
          ) : !vocabPage || vocabPage.content.length === 0 ? (
            <div className="text-center py-12 px-5 text-[var(--text-muted)]">
              <div className="text-sm sm:text-base font-extrabold text-[var(--text-main)] mb-1.5">
                Không tìm thấy từ vựng nào
              </div>
              <div className="text-xs sm:text-sm">
                {searchKeyword || selectedPos !== 'Tất cả loại từ'
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ bộ lọc loại từ.'
                  : 'Kho từ vựng riêng của bạn đang rỗng. Hãy thêm từ mới hoặc nhập từ file CSV.'}
              </div>
            </div>
          ) : viewMode === 'TABLE' ? (
            /* ========================================================
               DATA TABLE VIEW (Optimized for large lists)
               ======================================================== */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs sm:text-[0.88rem]">
                <thead>
                  <tr className="bg-slate-50 border-b-[1.5px] border-[var(--border-card)] whitespace-nowrap">
                    <th className="py-3 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={!!isAllCurrentPageSelected}
                        onChange={handleSelectAllOnPage}
                        style={{ cursor: 'pointer' }}
                        title="Chọn tất cả từ trên trang này"
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-[var(--text-muted)] font-extrabold">STT</th>
                    <th className="py-3 px-3.5 font-extrabold text-[var(--text-main)] w-32">Chữ Hán</th>
                    <th className="py-3 px-3.5 font-extrabold text-[var(--text-main)] w-32">Pinyin</th>
                    <th className="py-3 px-3.5 font-extrabold text-[var(--text-main)] w-28">Loại từ</th>
                    <th className="py-3 px-3.5 font-extrabold text-[var(--text-main)]">Nghĩa tiếng Việt</th>
                    <th className="py-3 px-3.5 font-extrabold text-[var(--text-main)]">Câu ví dụ</th>
                    <th className="py-3 px-3.5 font-extrabold text-[var(--text-main)] w-20 text-center">Thao tác</th>
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
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectWord(word.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td className="py-3 px-3 text-[var(--text-muted)] font-semibold">{rowNumber}</td>
                        <td className="py-3 px-3.5">
                          <span className="hanzi text-xl sm:text-[1.45rem] font-black text-[var(--text-chinese)]">
                            {word.hanzi}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-[var(--primary)] font-extrabold">
                          {word.pinyin}
                        </td>
                        <td className="py-3 px-3.5">
                          {word.partOfSpeech ? (
                            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-[var(--text-muted)] whitespace-nowrap">
                              {word.partOfSpeech}
                            </span>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>-</span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-[var(--text-main)]">
                          {word.meaning}
                        </td>
                        <td className="py-3 px-3.5 text-xs text-[var(--text-muted)]">
                          {word.exampleSentence ? (
                            <div>
                              <div className="text-[var(--text-main)] font-semibold">{word.exampleSentence}</div>
                              {word.exampleMeaning && <div className="text-[11px]">{word.exampleMeaning}</div>}
                            </div>
                          ) : (
                            <span style={{ color: '#cbd5e1' }}>-</span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteWord(word.id, word.hanzi)}
                            disabled={deletingId === word.id}
                            className="border-none bg-transparent text-red-500 cursor-pointer p-1.5 rounded-[var(--radius-sm)]"
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
            <div className="p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {vocabPage.content.map((word) => {
                const isSelected = selectedWordIds.includes(word.id)
                return (
                  <div
                    key={word.id}
                    onClick={() => handleToggleSelectWord(word.id)}
                    className="game-card p-4 flex flex-col justify-between cursor-pointer relative rounded-[var(--radius-lg)] transition-all"
                    style={{
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      border: isSelected ? '2px solid #16a34a' : '1.5px solid var(--border-card)',
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
            <div className="px-4 py-3.5 sm:px-5 border-t-[1.5px] border-[var(--border-card)] bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Summary and Page Size */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-[0.84rem] text-[var(--text-muted)]">
                <span>
                  Đang xem{' '}
                  <strong style={{ color: 'var(--text-main)' }}>
                    {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalWords)}
                  </strong>{' '}
                  trong tổng số <strong style={{ color: 'var(--text-main)' }}>{totalWords.toLocaleString('vi-VN')}</strong> từ
                </span>

                <div className="flex items-center gap-1.5">
                  <span>Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setPage(0)
                    }}
                    className="game-input py-1 px-2 text-xs"
                  >
                    <option value={20}>20 từ/trang</option>
                    <option value={50}>50 từ/trang</option>
                    <option value={100}>100 từ/trang</option>
                  </select>
                </div>
              </div>

              {/* Right: Page navigation buttons */}
              <div className="flex items-center justify-center sm:justify-end gap-1.5">
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
