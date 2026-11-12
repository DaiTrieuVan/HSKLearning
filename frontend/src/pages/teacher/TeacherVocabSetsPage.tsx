import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash2,
  Share2,
  FolderPlus,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Search,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyVocabSets,
  createVocabSet,
  getVocabSetItems,
  deleteVocabSet,
  removeVocabularyFromVocabSet,
  assignVocabSetToClass,
  getMyPrivateVocabularies,
  createVocabulary,
  importVocabularies,
  searchVocabularies,
  type VocabSetItem,
  type VocabularyItem,
} from '../../api/content'
import { getTeachingClasses, type ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

export const TeacherVocabSetsPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [classes, setClasses] = useState<ClassItem[]>([])
  const [activeTab, setActiveTab] = useState<'SETS' | 'PRIVATE_WORDS'>('SETS')

  // Vocab Sets State
  const [sets, setSets] = useState<VocabSetItem[]>([])
  const [selectedSet, setSelectedSet] = useState<VocabSetItem | null>(null)
  const [setWords, setSetWords] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(false)
  const [wordsLoading, setWordsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create Set Form State
  const [showCreateSet, setShowCreateSet] = useState(false)
  const [newSetTitle, setNewSetTitle] = useState('')
  const [newSetDesc, setNewSetDesc] = useState('')
  const [creatingSet, setCreatingSet] = useState(false)

  // Assign to Class
  const [assigningSet, setAssigningSet] = useState<VocabSetItem | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<number>(0)
  const [assigningLoading, setAssigningLoading] = useState(false)

  // Private Words State
  const [privateWords, setPrivateWords] = useState<VocabularyItem[]>([])
  const [showAddWord, setShowAddWord] = useState(false)
  const [newHanzi, setNewHanzi] = useState('')
  const [newPinyin, setNewPinyin] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [newPartOfSpeech, setNewPartOfSpeech] = useState('')
  const [newExampleSentence, setNewExampleSentence] = useState('')
  const [newExamplePinyin, setNewExamplePinyin] = useState('')
  const [newExampleMeaning, setNewExampleMeaning] = useState('')
  const [addingWord, setAddingWord] = useState(false)

  // Search to add words into set
  const [showAddWordToSet, setShowAddWordToSet] = useState(false)
  const [wordSearchQuery, setWordSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<VocabularyItem[]>([])
  const [searching, setSearching] = useState(false)

  // Import CSV private words
  const [showImport, setShowImport] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  const showNotification = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const loadVocabSets = async () => {
    if (!user) return
    try {
      setLoading(true)
      setErrorMessage(null)
      const data = await getMyVocabSets(user.token)
      setSets(data)
      if (data.length > 0 && !selectedSet) {
        handleSelectSet(data[0])
      } else if (data.length === 0) {
        setSelectedSet(null)
        setSetWords([])
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải danh sách bộ từ vựng')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadPrivateWords = async () => {
    if (!user) return
    try {
      setLoading(true)
      setErrorMessage(null)
      const data = await getMyPrivateVocabularies(user.token)
      setPrivateWords(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải từ vựng riêng của bạn')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSet = async (set: VocabSetItem) => {
    if (!user) return
    setSelectedSet(set)
    try {
      setWordsLoading(true)
      const words = await getVocabSetItems(set.id, user.token)
      setSetWords(words)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setWordsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    getTeachingClasses(user.token)
      .then((res) => {
        setClasses(res)
        if (res.length > 0) setSelectedClassId(res[0].id)
      })
      .catch(() => {})

    if (activeTab === 'SETS') {
      loadVocabSets()
    } else {
      loadPrivateWords()
    }
  }, [user, activeTab])

  if (!user) {
    return null
  }

  const handleCreateSetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSetTitle.trim()) return

    try {
      setCreatingSet(true)
      setErrorMessage(null)
      const created = await createVocabSet(
        { title: newSetTitle.trim(), description: newSetDesc.trim() || undefined },
        user.token
      )
      setSets((prev) => [created, ...prev])
      setSelectedSet(created)
      setSetWords([])
      setShowCreateSet(false)
      setNewSetTitle('')
      setNewSetDesc('')
      showNotification(`Đã tạo bộ từ vựng "${created.title}" thành công!`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setCreatingSet(false)
    }
  }

  const handleDeleteSet = async (setId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bộ từ vựng này?')) return
    try {
      setLoading(true)
      await deleteVocabSet(setId, user.token)
      const nextSets = sets.filter((s) => s.id !== setId)
      setSets(nextSets)
      if (selectedSet?.id === setId) {
        if (nextSets.length > 0) {
          handleSelectSet(nextSets[0])
        } else {
          setSelectedSet(null)
          setSetWords([])
        }
      }
      showNotification('Đã xóa bộ từ vựng thành công!')
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveWordFromSet = async (vocabId: number) => {
    if (!selectedSet) return
    try {
      await removeVocabularyFromVocabSet(selectedSet.id, vocabId, user.token)
      setSetWords((prev) => prev.filter((w) => w.id !== vocabId))
      setSets((prev) =>
        prev.map((s) => (s.id === selectedSet.id ? { ...s, itemCount: Math.max(0, s.itemCount - 1) } : s))
      )
      showNotification('Đã gỡ từ khỏi bộ từ vựng!')
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    }
  }

  const handleAssignToClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assigningSet || !selectedClassId) return

    try {
      setAssigningLoading(true)
      setErrorMessage(null)
      await assignVocabSetToClass(selectedClassId, assigningSet.id, user.token)
      const targetClass = classes.find((c) => c.id === selectedClassId)
      showNotification(`Đã gán bộ từ "${assigningSet.title}" vào lớp "${targetClass?.title}" thành công!`)
      setAssigningSet(null)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setAssigningLoading(false)
    }
  }

  const handleSearchWords = async (q: string) => {
    setWordSearchQuery(q)
    if (!q.trim()) {
      setSearchResults([])
      return
    }
    try {
      setSearching(true)
      const results = await searchVocabularies(q, user.token)
      setSearchResults(results)
    } catch {
      // ignore
    } finally {
      setSearching(false)
    }
  }

  const handleAddWordToCurrentSet = async (vocab: VocabularyItem) => {
    if (!selectedSet) return
    if (setWords.some((w) => w.id === vocab.id)) {
      setErrorMessage(`Từ "${vocab.hanzi}" đã có trong bộ từ vựng này`)
      return
    }

    try {
      const response = await fetch(`/api/v1/content/vocab-sets/${selectedSet.id}/vocabularies/${vocab.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
      })
      if (!response.ok) {
        throw new Error('Thất bại khi thêm vào bộ')
      }
      setSetWords((prev) => [...prev, vocab])
      setSets((prev) =>
        prev.map((s) => (s.id === selectedSet.id ? { ...s, itemCount: s.itemCount + 1 } : s))
      )
      showNotification(`Đã thêm từ "${vocab.hanzi}" vào bộ từ vựng!`)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Lỗi khi thêm từ')
    }
  }

  const handleCreatePrivateWordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()) return

    try {
      setAddingWord(true)
      setErrorMessage(null)
      const created = await createVocabulary(
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
      setPrivateWords((prev) => [created, ...prev])
      setShowAddWord(false)
      setNewHanzi('')
      setNewPinyin('')
      setNewMeaning('')
      setNewPartOfSpeech('')
      setNewExampleSentence('')
      setNewExamplePinyin('')
      setNewExampleMeaning('')
      showNotification(`Đã thêm từ vựng riêng "${created.hanzi}" (${created.pinyin}) thành công!`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setAddingWord(false)
    }
  }

  const handleImportPrivateWords = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importFile) return

    try {
      setImporting(true)
      setErrorMessage(null)
      const res = await importVocabularies(importFile, 1, true, user.token)
      setShowImport(false)
      setImportFile(null)
      loadPrivateWords()
      showNotification(`Nhập thành công ${res.successCount} từ vựng riêng (bỏ qua ${res.skippedCount})!`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setImporting(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Tiêu đề các cột tương thích chính xác với backend ContentService: hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning
    const headers = 'hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning'
    const sampleRows = [
      '老师,lǎoshī,thầy giáo/cô giáo,danh từ,李老师很好。,Lǐ lǎoshī hěn hǎo.,Thầy Lý rất tốt.',
      '学生,xuésheng,học sinh,danh từ,他是我的学生。,Tā shì wǒ de xuésheng.,Em ấy là học sinh của tôi.',
      '学习,xuéxí,học tập,động từ,我们要努力学习。,Wǒmen yào nǔlì xuéxí.,Chúng ta phải chăm chỉ học tập.',
    ]
    // \uFEFF là UTF-8 BOM giúp Microsoft Excel mở file tiếng Trung và tiếng Việt không bị lỗi hiển thị font
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

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      <div>
        {/* Header & Back navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border-card)] bg-white text-[var(--text-main)] font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft size={16} />
            <span>Quay lại Bảng điều khiển</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            className="flex items-center gap-2.5 p-3 sm:px-4 rounded-[var(--radius-md)] text-xs sm:text-sm font-bold mb-4"
            style={{
              backgroundColor: 'var(--primary-light)',
              border: '1.5px solid var(--primary)',
              color: 'var(--primary-hover)',
            }}
          >
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            className="flex items-center gap-2.5 p-3 sm:px-4 rounded-[var(--radius-md)] text-xs sm:text-sm mb-4"
            style={{
              backgroundColor: '#fef2f2',
              border: '1.5px solid #fecaca',
              color: '#b91c1c',
            }}
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-5 border-b-2 border-[var(--border-card)] pb-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('SETS')}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-[var(--radius-md)] border-none font-extrabold text-xs sm:text-[0.9rem] cursor-pointer whitespace-nowrap"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
            }}
          >
            <FolderPlus size={16} />
            <span>Bộ từ vựng ({sets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/private-vocab')}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-[var(--radius-md)] border-none font-extrabold text-xs sm:text-[0.9rem] cursor-pointer whitespace-nowrap transition-all"
            style={{
              backgroundColor: '#f1f5f9',
              color: 'var(--text-muted)',
            }}
            title="Vào ngay Trang Quản trị Kho từ vựng riêng (Có tìm kiếm, lọc & phân trang)"
          >
            <BookOpen size={16} />
            <span>Kho từ vựng riêng ({privateWords.length})</span>
          </button>
        </div>

        {/* TAB 1: VOCAB SETS */}
        {activeTab === 'SETS' && (
          <div>
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
              <div className="text-xs sm:text-[0.9rem] text-[var(--text-muted)] font-semibold leading-snug">
                Chọn một bộ từ vựng bên dưới để xem và quản lý các từ trong bộ
              </div>
              <button
                type="button"
                onClick={() => setShowCreateSet(!showCreateSet)}
                className="btn-gamified btn-primary self-start sm:self-auto shrink-0 whitespace-nowrap px-4 py-2 text-xs sm:text-sm"
              >
                <Plus size={16} />
                <span>{showCreateSet ? 'Đóng tạo bộ từ' : 'Tạo bộ từ mới'}</span>
              </button>
            </div>

            {/* Inline Create Set Form */}
            {showCreateSet && (
              <div className="game-card p-4 sm:p-6 bg-white mb-5" style={{ border: '2px solid var(--primary)' }}>
                <h3 className="text-base sm:text-lg font-extrabold m-0 mb-3.5 text-[var(--text-main)]">
                  Tạo bộ từ vựng mới
                </h3>
                <form onSubmit={handleCreateSetSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs sm:text-[0.85rem] font-bold mb-1.5">
                      Tên bộ từ vựng <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Từ vựng Chuyên ngành Du lịch, HSK 3 Mở rộng..."
                      value={newSetTitle}
                      onChange={(e) => setNewSetTitle(e.target.value)}
                      className="game-input w-full box-border px-3 py-2 text-sm"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-[0.85rem] font-bold mb-1.5">
                      Mô tả ngắn (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Tổng hợp 50 từ vựng xuất hiện nhiều trong kỳ thi..."
                      value={newSetDesc}
                      onChange={(e) => setNewSetDesc(e.target.value)}
                      className="game-input w-full box-border px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateSet(false)}
                      className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border-card)] bg-white font-bold text-sm cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={creatingSet || !newSetTitle.trim()}
                      className="btn-gamified btn-primary px-5 py-2 text-sm justify-center whitespace-nowrap"
                    >
                      {creatingSet ? 'Đang tạo...' : 'Xác nhận tạo bộ từ'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Split View: Left = List of Sets, Right = Details of Selected Set */}
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_2fr] gap-4 sm:gap-5 items-start">
              {/* Left Column: List of Sets */}
              <div className="flex flex-col gap-3 min-w-0">
                {loading ? (
                  <div className="text-center py-8 text-sm text-[var(--text-muted)]">
                    Đang tải danh sách...
                  </div>
                ) : sets.length === 0 ? (
                  <div className="game-card p-6 bg-white text-center">
                    <p className="text-[var(--text-muted)] text-sm m-0">Bạn chưa tạo bộ từ vựng nào.</p>
                  </div>
                ) : (
                  sets.map((s) => {
                    const isSelected = selectedSet?.id === s.id
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSet(s)}
                        className="game-card p-4 cursor-pointer transition-all"
                        style={{
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border-card)',
                        }}
                      >
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="text-sm sm:text-base font-extrabold m-0 text-[var(--text-main)] leading-snug min-w-0">
                            {s.title}
                          </h3>
                          <span
                            className="text-xs font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0"
                            style={{
                              backgroundColor: isSelected ? 'var(--primary)' : '#f1f5f9',
                              color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            }}
                          >
                            {s.itemCount} từ
                          </span>
                        </div>
                        {s.description && (
                          <p className="text-xs text-[var(--text-muted)] m-0 leading-relaxed">
                            {s.description}
                          </p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Right Column: Selected Set Content */}
              <div className="game-card p-4 sm:p-6 bg-white min-w-0">
                {selectedSet ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                      <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-extrabold m-0 mb-1 text-[var(--text-main)] leading-snug">
                          {selectedSet.title}
                        </h2>
                        <p className="text-xs sm:text-[0.85rem] text-[var(--text-muted)] m-0 leading-relaxed">
                          {selectedSet.description || 'Chưa có mô tả cho bộ từ này.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setAssigningSet(selectedSet)}
                          className="btn-gamified btn-gold px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Share2 size={14} />
                          <span>Giao cho lớp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSet(selectedSet.id)}
                          className="btn-danger px-3 py-1.5 rounded-[var(--radius-md)] border border-red-200 bg-white text-xs font-bold cursor-pointer inline-flex items-center justify-center"
                          title="Xóa bộ từ vựng"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Assign to Class Inline View */}
                    {assigningSet && (
                      <div
                        className="p-3.5 sm:p-4 rounded-[var(--radius-md)] mb-4"
                        style={{ backgroundColor: 'var(--primary-light)', border: '1.5px solid var(--primary)' }}
                      >
                        <div className="font-extrabold text-xs sm:text-sm mb-2" style={{ color: 'var(--primary-hover)' }}>
                          Giao bộ từ &ldquo;{assigningSet.title}&rdquo; cho lớp học:
                        </div>
                        <form onSubmit={handleAssignToClassSubmit} className="flex flex-col sm:flex-row gap-2.5">
                          <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            className="game-input w-full sm:flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm"
                          >
                            {classes.map((cls) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.title} (Mã: {cls.joinCode})
                              </option>
                            ))}
                          </select>
                          <div className="flex items-center justify-end gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setAssigningSet(null)}
                              className="px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--border-card)] bg-white font-bold text-xs sm:text-sm cursor-pointer"
                            >
                              Hủy
                            </button>
                            <button
                              type="submit"
                              disabled={assigningLoading || !selectedClassId}
                              className="btn-gamified btn-primary px-4 py-2 text-xs sm:text-sm whitespace-nowrap"
                            >
                              {assigningLoading ? 'Đang giao...' : 'Xác nhận giao'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Add Word into Set section */}
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                        <div className="font-extrabold text-sm sm:text-[0.95rem] text-[var(--text-main)]">
                          Danh sách từ vựng trong bộ ({setWords.length})
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/vocab-sets/${selectedSet.id}/add-words`)}
                            className="btn-gamified btn-primary px-3.5 py-1.5 text-xs inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <Plus size={15} />
                            <span>Thêm nhiều từ vào bộ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddWordToSet(!showAddWordToSet)}
                            className="px-3 py-1.5 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border-card)] bg-white text-[var(--text-main)] text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <Search size={14} />
                            <span>{showAddWordToSet ? 'Đóng tìm nhanh' : 'Tìm nhanh 1 từ'}</span>
                          </button>
                        </div>
                      </div>

                      {showAddWordToSet && (
                        <div className="p-3.5 sm:p-4 bg-slate-50 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border-card)] mb-4">
                          <input
                            type="text"
                            placeholder="Nhập chữ Hán, Pinyin hoặc nghĩa tiếng Việt để tìm từ..."
                            value={wordSearchQuery}
                            onChange={(e) => handleSearchWords(e.target.value)}
                            className="game-input w-full box-border px-3 py-2 text-sm mb-3"
                            autoFocus
                          />
                          {searching && <div className="text-xs text-[var(--text-muted)]">Đang tìm kiếm...</div>}
                          {searchResults.length > 0 && (
                            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                              {searchResults.map((vocab) => (
                                <div
                                  key={vocab.id}
                                  className="flex justify-between items-center gap-2 px-3 py-2 bg-white rounded-[var(--radius-sm)] border border-[var(--border-card)]"
                                >
                                  <div className="min-w-0">
                                    <span className="hanzi text-base font-black mr-2">{vocab.hanzi}</span>
                                    <span className="text-xs sm:text-sm text-[var(--primary)] font-bold mr-2">{vocab.pinyin}</span>
                                    <span className="text-xs text-[var(--text-muted)]">{vocab.meaning}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddWordToCurrentSet(vocab)}
                                    className="btn-gamified btn-primary shrink-0 whitespace-nowrap px-2.5 py-1 text-xs"
                                  >
                                    Thêm vào bộ
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Word list table/grid */}
                    {wordsLoading ? (
                      <div className="text-center py-10 text-sm text-[var(--text-muted)]">
                        Đang tải danh sách từ vựng...
                      </div>
                    ) : setWords.length === 0 ? (
                      <div className="text-center py-10 px-4 text-[var(--text-muted)] text-sm">
                        <p className="m-0 mb-4">Bộ từ vựng này chưa có từ nào.</p>
                        <button
                          type="button"
                          onClick={() => navigate(`/vocab-sets/${selectedSet.id}/add-words`)}
                          className="btn-gamified btn-primary px-5 py-2 text-xs sm:text-sm inline-flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Plus size={16} />
                          <span>Thêm nhiều từ vào bộ ngay</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {setWords.map((word) => (
                          <div
                            key={word.id}
                            style={{
                              padding: '14px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-card)',
                              backgroundColor: '#ffffff',
                              position: 'relative',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleRemoveWordFromSet(word.id)}
                              title="Gỡ khỏi bộ"
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                border: 'none',
                                background: 'transparent',
                                color: '#ef4444',
                                cursor: 'pointer',
                                padding: '4px',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="hanzi" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-chinese)' }}>
                              {word.hanzi}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700, margin: '2px 0 6px' }}>
                              {word.pinyin}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                              {word.meaning}
                            </div>
                            {word.exampleSentence && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                                &ldquo;{word.exampleSentence}&rdquo;
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                    Chọn một bộ từ vựng bên trái để xem chi tiết
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIVATE WORDS */}
        {activeTab === 'PRIVATE_WORDS' && (
          <div>
            {/* Dedicated Page Suggestion Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                backgroundColor: '#eff6ff',
                border: '1.5px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e40af' }}>
                    Quản lý số lượng lớn từ vựng (1,000+ từ)?
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>
                    Sử dụng Trang Quản trị Chuyên biệt với Tìm kiếm tức thời, Lọc loại từ, Phân trang và Chọn nhiều từ tạo bộ từ.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/private-vocab')}
                className="btn-gamified btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
              >
                Mở Trang Quản trị Kho Từ
              </button>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Các từ vựng do riêng bạn tạo ra, chỉ dùng cho bạn và các lớp học của bạn
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowImport(!showImport)}
                  className="btn-gamified btn-gold"
                  style={{ padding: '8px 16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileSpreadsheet size={16} />
                  <span>{showImport ? 'Đóng CSV' : 'Nhập CSV'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddWord(!showAddWord)}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>{showAddWord ? 'Đóng thêm từ' : 'Thêm từ mới'}</span>
                </button>
              </div>
            </div>

            {/* Inline Add Word Form */}
            {showAddWord && (
              <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff', marginBottom: '24px', border: '2px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-main)' }}>
                  Thêm từ vựng riêng mới
                </h3>
                <form onSubmit={handleCreatePrivateWordSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Chữ Hán (Hanzi) <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 咖啡"
                      value={newHanzi}
                      onChange={(e) => setNewHanzi(e.target.value)}
                      className="game-input hanzi"
                      style={{ width: '100%', boxSizing: 'border-box', fontSize: '1.2rem', padding: '8px 12px' }}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Pinyin <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: kā fēi"
                      value={newPinyin}
                      onChange={(e) => setNewPinyin(e.target.value)}
                      className="game-input"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Nghĩa tiếng Việt <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Cà phê"
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      className="game-input"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
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

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddWord(false)}
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
                      disabled={addingWord || !newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      {addingWord ? 'Đang thêm...' : 'Lưu từ vựng'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Inline Import CSV Form */}
            {showImport && (
              <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff', marginBottom: '24px', border: '2px solid var(--accent-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-main)' }}>
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
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      fontSize: '0.84rem',
                      whiteSpace: 'nowrap',
                    }}
                    title="Tải về file mẫu CSV định dạng UTF-8 chuẩn để cô giáo không cần tự tạo file thủ công"
                  >
                    <Download size={16} />
                    <span>Tải file mẫu CSV</span>
                  </button>
                </div>
                <form onSubmit={handleImportPrivateWords} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
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

            {/* Private Words Grid */}
            <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Đang tải kho từ vựng riêng...
                </div>
              ) : privateWords.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  Bạn chưa có từ vựng riêng nào. Bấm &quot;Thêm từ mới&quot; hoặc &quot;Nhập CSV&quot; để bắt đầu!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                  {privateWords.map((word) => (
                    <div
                      key={word.id}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <div className="hanzi" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-chinese)' }}>
                        {word.hanzi}
                      </div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--primary)', fontWeight: 700, margin: '2px 0 6px' }}>
                        {word.pinyin}
                      </div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                        {word.meaning}
                      </div>
                      {word.exampleSentence && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                          &ldquo;{word.exampleSentence}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
