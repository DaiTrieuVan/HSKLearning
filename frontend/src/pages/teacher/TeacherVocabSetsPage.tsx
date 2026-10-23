import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookMarked,
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

  if (!user) {
    navigate('/')
    return null
  }

  const showNotification = (msg: string) => {
    setSuccessMessage(msg)
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  const loadVocabSets = async () => {
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
    if (user) {
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
    }
  }, [user, activeTab])

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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header & Back navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={18} />
            <span>Quay lại Bảng điều khiển</span>
          </button>
        </div>

        {/* Page Title Card */}
        <div className="game-card" style={{ padding: '28px', backgroundColor: '#ffffff', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookMarked size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Quản lý Bộ từ vựng của lớp
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Soạn các bộ từ vựng theo chủ đề và giao cho các lớp học (QTN-19).
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              backgroundColor: 'var(--primary-light)',
              border: '1.5px solid var(--primary)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-hover)',
              fontSize: '0.9rem',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            <CheckCircle2 size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              backgroundColor: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '0.9rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid var(--border-card)', paddingBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('SETS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
            }}
          >
            <FolderPlus size={18} />
            <span>Bộ từ vựng ({sets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/private-vocab')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              backgroundColor: '#f1f5f9',
              color: 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
            title="Vào ngay Trang Quản trị Kho từ vựng riêng (Có tìm kiếm, lọc & phân trang)"
          >
            <BookOpen size={18} />
            <span>Kho từ vựng riêng ({privateWords.length})</span>
          </button>
        </div>

        {/* TAB 1: VOCAB SETS */}
        {activeTab === 'SETS' && (
          <div>
            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Chọn một bộ từ vựng bên dưới để xem và quản lý các từ trong bộ
              </div>
              <button
                type="button"
                onClick={() => setShowCreateSet(!showCreateSet)}
                className="btn-gamified btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                <Plus size={16} />
                <span>{showCreateSet ? 'Đóng tạo bộ từ' : 'Tạo bộ từ mới'}</span>
              </button>
            </div>

            {/* Inline Create Set Form */}
            {showCreateSet && (
              <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff', marginBottom: '24px', border: '2px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 16px', color: 'var(--text-main)' }}>
                  Tạo bộ từ vựng mới
                </h3>
                <form onSubmit={handleCreateSetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Tên bộ từ vựng <span style={{ color: 'var(--primary)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Từ vựng Chuyên ngành Du lịch, HSK 3 Mở rộng..."
                      value={newSetTitle}
                      onChange={(e) => setNewSetTitle(e.target.value)}
                      className="game-input"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px' }}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Mô tả ngắn (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Tổng hợp 50 từ vựng xuất hiện nhiều trong kỳ thi..."
                      value={newSetDesc}
                      onChange={(e) => setNewSetDesc(e.target.value)}
                      className="game-input"
                      style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCreateSet(false)}
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
                      disabled={creatingSet || !newSetTitle.trim()}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      {creatingSet ? 'Đang tạo...' : 'Xác nhận tạo bộ từ'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Split View: Left = List of Sets, Right = Details of Selected Set */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '20px' }}>
              {/* Left Column: List of Sets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    Đang tải danh sách...
                  </div>
                ) : sets.length === 0 ? (
                  <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Bạn chưa tạo bộ từ vựng nào.</p>
                  </div>
                ) : (
                  sets.map((s) => {
                    const isSelected = selectedSet?.id === s.id
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSelectSet(s)}
                        className="game-card"
                        style={{
                          padding: '16px',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border-card)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>
                            {s.title}
                          </h3>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: isSelected ? 'var(--primary)' : '#f1f5f9',
                              color: isSelected ? '#ffffff' : 'var(--text-muted)',
                            }}
                          >
                            {s.itemCount} từ
                          </span>
                        </div>
                        {s.description && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                            {s.description}
                          </p>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Right Column: Selected Set Content */}
              <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                {selectedSet ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }}>
                          {selectedSet.title}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                          {selectedSet.description || 'Chưa có mô tả cho bộ từ này.'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setAssigningSet(selectedSet)}
                          className="btn-gamified btn-gold"
                          style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Share2 size={14} />
                          <span>Giao cho lớp</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteSet(selectedSet.id)}
                          className="btn-danger"
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #fecaca',
                            backgroundColor: '#ffffff',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Assign to Class Inline View */}
                    {assigningSet && (
                      <div style={{ padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1.5px solid var(--primary)' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', color: 'var(--primary-hover)' }}>
                          Giao bộ từ &ldquo;{assigningSet.title}&rdquo; cho lớp học:
                        </div>
                        <form onSubmit={handleAssignToClassSubmit} style={{ display: 'flex', gap: '10px' }}>
                          <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            className="game-input"
                            style={{ flex: 1, padding: '8px 12px', fontSize: '0.88rem' }}
                          >
                            {classes.map((cls) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.title} (Mã: {cls.joinCode})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setAssigningSet(null)}
                            style={{
                              padding: '8px 14px',
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
                            disabled={assigningLoading || !selectedClassId}
                            className="btn-gamified btn-primary"
                            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                          >
                            {assigningLoading ? 'Đang giao...' : 'Xác nhận giao'}
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Add Word into Set section */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                          Danh sách từ vựng trong bộ ({setWords.length})
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => navigate(`/vocab-sets/${selectedSet.id}/add-words`)}
                            className="btn-gamified btn-primary"
                            style={{
                              padding: '6px 14px',
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Plus size={15} />
                            <span>+ Thêm nhiều từ vào bộ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddWordToSet(!showAddWordToSet)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-card)',
                              backgroundColor: '#ffffff',
                              color: 'var(--text-main)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <Search size={14} />
                            <span>{showAddWordToSet ? 'Đóng tìm nhanh' : 'Tìm nhanh 1 từ'}</span>
                          </button>
                        </div>
                      </div>

                      {showAddWordToSet && (
                        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-card)', marginBottom: '16px' }}>
                          <input
                            type="text"
                            placeholder="Nhập chữ Hán, Pinyin hoặc nghĩa tiếng Việt để tìm từ..."
                            value={wordSearchQuery}
                            onChange={(e) => handleSearchWords(e.target.value)}
                            className="game-input"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', marginBottom: '12px' }}
                            autoFocus
                          />
                          {searching && <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Đang tìm kiếm...</div>}
                          {searchResults.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                              {searchResults.map((vocab) => (
                                <div
                                  key={vocab.id}
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-card)',
                                  }}
                                >
                                  <div>
                                    <span className="hanzi" style={{ fontSize: '1.1rem', fontWeight: 900, marginRight: '8px' }}>{vocab.hanzi}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, marginRight: '8px' }}>{vocab.pinyin}</span>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{vocab.meaning}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddWordToCurrentSet(vocab)}
                                    className="btn-gamified btn-primary"
                                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
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
                      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Đang tải danh sách từ vựng...
                      </div>
                    ) : setWords.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        <p style={{ margin: '0 0 16px' }}>Bộ từ vựng này chưa có từ nào.</p>
                        <button
                          type="button"
                          onClick={() => navigate(`/vocab-sets/${selectedSet.id}/add-words`)}
                          className="btn-gamified btn-primary"
                          style={{ padding: '8px 20px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Plus size={16} />
                          <span>+ Thêm nhiều từ vào bộ ngay</span>
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
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
