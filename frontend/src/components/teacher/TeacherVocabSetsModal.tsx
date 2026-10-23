import React, { useState, useEffect } from 'react'
import {
  X,
  BookMarked,
  Plus,
  Trash2,
  Share2,
  FolderPlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Search,
  BookOpen,
} from 'lucide-react'
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
import type { ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

interface TeacherVocabSetsModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  classes: ClassItem[]
}

export const TeacherVocabSetsModal: React.FC<TeacherVocabSetsModalProps> = ({
  isOpen,
  onClose,
  token,
  classes,
}) => {
  const [activeTab, setActiveTab] = useState<'SETS' | 'PRIVATE_WORDS'>('SETS')

  // Vocab Sets State
  const [sets, setSets] = useState<VocabSetItem[]>([])
  const [selectedSet, setSelectedSet] = useState<VocabSetItem | null>(null)
  const [setWords, setSetWords] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(false)
  const [wordsLoading, setWordsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Create Set Modal / Form
  const [showCreateSet, setShowCreateSet] = useState(false)
  const [newSetTitle, setNewSetTitle] = useState('')
  const [newSetDesc, setNewSetDesc] = useState('')
  const [creatingSet, setCreatingSet] = useState(false)

  // Assign to Class
  const [assigningSet, setAssigningSet] = useState<VocabSetItem | null>(null)
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0]?.id || 0)
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
    try {
      setLoading(true)
      setErrorMessage(null)
      const data = await getMyVocabSets(token)
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
      const data = await getMyPrivateVocabularies(token)
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
      const words = await getVocabSetItems(set.id, token)
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
    if (isOpen) {
      if (activeTab === 'SETS') {
        loadVocabSets()
      } else {
        loadPrivateWords()
      }
    }
  }, [isOpen, activeTab])

  if (!isOpen) return null

  const handleCreateSetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSetTitle.trim()) return

    try {
      setCreatingSet(true)
      setErrorMessage(null)
      const created = await createVocabSet(
        { title: newSetTitle.trim(), description: newSetDesc.trim() || undefined },
        token
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
      await deleteVocabSet(setId, token)
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
      await removeVocabularyFromVocabSet(selectedSet.id, vocabId, token)
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
      await assignVocabSetToClass(selectedClassId, assigningSet.id, token)
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
      const results = await searchVocabularies(q, token)
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
      // Call createVocabSet with updated list or individual endpoint
      const response = await fetch(`/api/v1/content/vocab-sets/${selectedSet.id}/vocabularies/${vocab.id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
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
        token
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
      const res = await importVocabularies(importFile, 1, true, token)
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

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '20px',
      }}
    >
      <div
        className="game-card animate-scale-up"
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '2px solid var(--border-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookMarked size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Quản lý Bộ từ vựng & Từ riêng của Giáo viên
                </h2>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    backgroundColor: 'var(--accent-gold-light)',
                    color: 'var(--accent-gold-shadow)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  Dành riêng cho Giáo viên
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Tạo các bộ từ vựng theo chủ đề, thêm từ vựng riêng của bạn và giao cho các lớp học phụ trách (QTN-19).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            padding: '10px 28px',
            display: 'flex',
            gap: '12px',
            borderBottom: '1.5px solid var(--border-card)',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('SETS')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'SETS' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'SETS' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            <BookMarked size={18} />
            <span>Bộ từ vựng ({sets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PRIVATE_WORDS')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: activeTab === 'PRIVATE_WORDS' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'PRIVATE_WORDS' ? '#ffffff' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            <BookOpen size={18} />
            <span>Kho từ vựng riêng của tôi ({privateWords.length})</span>
          </button>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div
            style={{
              margin: '12px 28px 0',
              padding: '10px 16px',
              backgroundColor: 'var(--jade-green-light)',
              color: 'var(--jade-green-shadow)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              margin: '12px 28px 0',
              padding: '10px 16px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 700,
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: VOCAB SETS CONTENT */}
        {activeTab === 'SETS' && (
          <div style={{ flex: 1, display: 'flex', minHeight: '440px', overflow: 'hidden' }}>
            {/* Left Column: List of Sets */}
            <div
              style={{
                width: '320px',
                borderRight: '1.5px solid var(--border-card)',
                backgroundColor: '#fcfcfc',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--border-card)',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Danh sách bộ từ
                </span>
                <button
                  type="button"
                  onClick={() => setShowCreateSet(true)}
                  className="btn-gamified btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={16} />
                  <span>Tạo bộ mới</span>
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '0.85rem' }}>Đang tải bộ từ vựng...</p>
                  </div>
                ) : sets.length === 0 ? (
                  <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <FolderPlus size={36} style={{ color: '#cbd5e1', margin: '0 auto 10px' }} />
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Chưa có bộ từ vựng nào</div>
                    <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                      Bấm &quot;Tạo bộ mới&quot; để tạo bộ từ vựng riêng và giao bài cho học sinh.
                    </div>
                  </div>
                ) : (
                  sets.map((set) => {
                    const isSelected = selectedSet?.id === set.id
                    return (
                      <div
                        key={set.id}
                        onClick={() => handleSelectSet(set)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: '8px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                          border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                          boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 800, color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>
                            {set.title}
                          </h4>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: isSelected ? 'var(--primary)' : 'var(--border-card)',
                              color: isSelected ? '#ffffff' : 'var(--text-muted)',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-full)',
                            }}
                          >
                            {set.itemCount} từ
                          </span>
                        </div>
                        {set.description && (
                          <p style={{ margin: '0 0 6px', fontSize: '0.78rem', color: 'var(--text-muted)', lineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {set.description}
                          </p>
                        )}
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Tạo ngày {new Date(set.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right Column: Words inside selected set */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
              {selectedSet ? (
                <>
                  <div
                    style={{
                      padding: '16px 24px',
                      borderBottom: '1px solid var(--border-card)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {selectedSet.title}
                        </h3>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          ({setWords.length} từ vựng)
                        </span>
                      </div>
                      {selectedSet.description && (
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {selectedSet.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddWordToSet(true)}
                        className="btn-gamified btn-gold"
                        style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={16} />
                        <span>Thêm từ vào bộ</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAssigningSet(selectedSet)}
                        className="btn-gamified btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Share2 size={16} />
                        <span>Gán vào lớp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSet(selectedSet.id)}
                        style={{
                          background: 'none',
                          border: '1.5px solid #fecaca',
                          color: '#dc2626',
                          borderRadius: 'var(--radius-md)',
                          padding: '8px',
                          cursor: 'pointer',
                        }}
                        title="Xóa bộ từ vựng"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                    {wordsLoading ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '0.85rem' }}>Đang tải danh sách từ...</p>
                      </div>
                    ) : setWords.length === 0 ? (
                      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <BookOpen size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
                        <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 800 }}>
                          Bộ từ vựng này chưa có từ nào
                        </h4>
                        <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                          Bấm nút &quot;Thêm từ vào bộ&quot; ở trên để chọn từ từ kho chung hoặc từ vựng riêng của bạn.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAddWordToSet(true)}
                          className="btn-gamified btn-gold"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Chọn từ vựng ngay
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
                              border: '1px solid var(--border-card)',
                              backgroundColor: '#ffffff',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span className="hanzi" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                  {word.hanzi}
                                </span>
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>
                                  {word.pinyin}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                                {word.meaning}
                              </div>
                              {word.isPrivate && (
                                <span
                                  style={{
                                    display: 'inline-block',
                                    marginTop: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    backgroundColor: 'var(--accent-gold-light)',
                                    color: 'var(--accent-gold-shadow)',
                                    padding: '2px 6px',
                                    borderRadius: 'var(--radius-full)',
                                  }}
                                >
                                  Từ riêng
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveWordFromSet(word.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: 'var(--radius-sm)',
                              }}
                              title="Gỡ khỏi bộ từ"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <BookMarked size={48} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
                    <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>Chọn một bộ từ vựng ở cột bên trái để xem chi tiết</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: PRIVATE VOCABULARY WORDS CONTENT */}
        {activeTab === 'PRIVATE_WORDS' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div
              style={{
                padding: '16px 28px',
                borderBottom: '1px solid var(--border-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Kho từ vựng riêng của bạn ({privateWords.length} từ)
                </h3>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Theo quy tắc QTN-19: Các từ vựng riêng này chỉ do bạn quản lý và đưa vào bộ từ vựng, không xuất hiện ở bài học chung hệ thống.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowImport(true)}
                  className="btn-gamified btn-gold"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileSpreadsheet size={16} />
                  <span>Nhập CSV từ riêng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddWord(true)}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} />
                  <span>Thêm từ riêng mới</span>
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '0.85rem' }}>Đang tải từ vựng riêng...</p>
                </div>
              ) : privateWords.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <BookOpen size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', fontWeight: 800 }}>
                    Bạn chưa có từ vựng riêng nào
                  </h4>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                    Tạo các từ vựng đặc thù theo giáo trình của bạn để đóng gói vào Bộ từ vựng và giao cho học sinh.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddWord(true)}
                    className="btn-gamified btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Thêm từ vựng riêng ngay
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                  {privateWords.map((word) => (
                    <div
                      key={word.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span className="hanzi" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {word.hanzi}
                        </span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>
                          {word.pinyin}
                        </span>
                        {word.partOfSpeech && (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            ({word.partOfSpeech})
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '4px' }}>
                        {word.meaning}
                      </div>
                      {word.exampleSentence && (
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--border-card)', fontSize: '0.78rem' }}>
                          <div className="hanzi" style={{ color: 'var(--text-main)' }}>{word.exampleSentence}</div>
                          {word.exampleMeaning && <div style={{ color: 'var(--text-muted)' }}>{word.exampleMeaning}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: CREATE VOCAB SET */}
        {showCreateSet && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
            }}
            onClick={() => setShowCreateSet(false)}
          >
            <div
              className="game-card animate-scale-up"
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Tạo bộ từ vựng mới</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateSet(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px',
                  }}
                  title="Đóng"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateSetSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Tên bộ từ vựng <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={newSetTitle}
                    onChange={(e) => setNewSetTitle(e.target.value)}
                    placeholder="VD: Từ vựng ôn tập Unit 1, Chuyên đề Du lịch..."
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Mô tả bộ từ (tùy chọn)
                  </label>
                  <textarea
                    value={newSetDesc}
                    onChange={(e) => setNewSetDesc(e.target.value)}
                    placeholder="Ghi chú mục tiêu học tập, yêu cầu cho học sinh..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateSet(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      background: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={creatingSet}
                    className="btn-gamified btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                  >
                    {creatingSet ? 'Đang tạo...' : 'Tạo ngay'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ASSIGN SET TO CLASS */}
        {assigningSet && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
            }}
            onClick={() => setAssigningSet(null)}
          >
            <div
              className="game-card animate-scale-up"
              style={{
                width: '100%',
                maxWidth: '460px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Gán bộ từ vào lớp học</h3>
                <button
                  type="button"
                  onClick={() => setAssigningSet(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px',
                    borderRadius: 'var(--radius-sm)',
                  }}
                  title="Đóng"
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                Học sinh trong lớp được chọn sẽ nhìn thấy và học toàn bộ từ vựng trong bộ &quot;<strong>{assigningSet.title}</strong>&quot;.
              </p>

              {classes.length === 0 ? (
                <div>
                  <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
                    Bạn chưa có lớp học nào đang phụ trách. Vui lòng tạo lớp học trước!
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setAssigningSet(null)}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.9rem' }}
                    >
                      Đã hiểu / Đóng
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAssignToClassSubmit}>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                      Chọn lớp học phụ trách
                    </label>
                    <select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(Number(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} (Mã: {c.joinCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setAssigningSet(null)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        background: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={assigningLoading}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                    >
                      {assigningLoading ? 'Đang gán...' : 'Xác nhận gán'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADD WORD TO SET (SEARCH POOL) */}
        {showAddWordToSet && selectedSet && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
            }}
            onClick={() => setShowAddWordToSet(false)}
          >
            <div
              className="game-card animate-scale-up"
              style={{
                width: '100%',
                maxWidth: '560px',
                maxHeight: '80vh',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  Thêm từ vào bộ &quot;{selectedSet.title}&quot;
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddWordToSet(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={wordSearchQuery}
                  onChange={(e) => handleSearchWords(e.target.value)}
                  placeholder="Tìm kiếm Hán tự, Pinyin hoặc nghĩa tiếng Việt..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '350px' }}>
                {searching ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 6px' }} />
                    <span>Đang tìm kiếm...</span>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {wordSearchQuery ? 'Không tìm thấy từ vựng phù hợp' : 'Gõ từ khóa vào ô trên để tìm kiếm từ trong kho chung hoặc từ riêng của bạn'}
                  </div>
                ) : (
                  searchResults.map((vocab) => {
                    const alreadyInSet = setWords.some((w) => w.id === vocab.id)
                    return (
                      <div
                        key={vocab.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-card)',
                          marginBottom: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                            <span className="hanzi" style={{ fontSize: '1.15rem', fontWeight: 800 }}>{vocab.hanzi}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>{vocab.pinyin}</span>
                            {vocab.isPrivate && (
                              <span style={{ fontSize: '0.68rem', backgroundColor: 'var(--accent-gold-light)', color: 'var(--accent-gold-shadow)', padding: '1px 5px', borderRadius: '4px' }}>
                                Từ riêng
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{vocab.meaning}</div>
                        </div>

                        <button
                          type="button"
                          disabled={alreadyInSet}
                          onClick={() => handleAddWordToCurrentSet(vocab)}
                          className={alreadyInSet ? 'btn-gamified' : 'btn-gamified btn-gold'}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.8rem',
                            opacity: alreadyInSet ? 0.6 : 1,
                            cursor: alreadyInSet ? 'default' : 'pointer',
                          }}
                        >
                          {alreadyInSet ? 'Đã có' : '+ Thêm'}
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD PRIVATE VOCABULARY */}
        {showAddWord && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
            }}
            onClick={() => setShowAddWord(false)}
          >
            <div
              className="game-card animate-scale-up"
              style={{
                width: '100%',
                maxWidth: '520px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  Thêm từ vựng riêng của Giáo viên
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddWord(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px',
                  }}
                  title="Đóng"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreatePrivateWordSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Hán tự (Chữ Hán) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={newHanzi}
                      onChange={(e) => setNewHanzi(e.target.value)}
                      placeholder="VD: 老师"
                      required
                      className="hanzi"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '1.1rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Pinyin (Phiên âm) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={newPinyin}
                      onChange={(e) => setNewPinyin(e.target.value)}
                      placeholder="VD: lǎoshī"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Nghĩa tiếng Việt <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      placeholder="VD: thầy cô giáo"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Từ loại
                    </label>
                    <input
                      type="text"
                      value={newPartOfSpeech}
                      onChange={(e) => setNewPartOfSpeech(e.target.value)}
                      placeholder="danh từ, n..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                    Ví dụ câu chữ Hán (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={newExampleSentence}
                    onChange={(e) => setNewExampleSentence(e.target.value)}
                    placeholder="VD: 她是我的汉语老师。"
                    className="hanzi"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Ví dụ Pinyin
                    </label>
                    <input
                      type="text"
                      value={newExamplePinyin}
                      onChange={(e) => setNewExamplePinyin(e.target.value)}
                      placeholder="Tā shì wǒ de hànyǔ lǎoshī."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                      Ví dụ Nghĩa
                    </label>
                    <input
                      type="text"
                      value={newExampleMeaning}
                      onChange={(e) => setNewExampleMeaning(e.target.value)}
                      placeholder="Cô ấy là cô giáo tiếng Trung của tôi."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddWord(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      background: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={addingWord}
                    className="btn-gamified btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                  >
                    {addingWord ? 'Đang lưu...' : 'Lưu từ vựng'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: IMPORT PRIVATE CSV */}
        {showImport && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1100,
            }}
            onClick={() => setShowImport(false)}
          >
            <div
              className="game-card animate-scale-up"
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Nhập file CSV từ vựng riêng</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="btn-gamified btn-gold"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                    }}
                    title="Tải về file CSV mẫu chuẩn UTF-8"
                  >
                    <Download size={14} />
                    <span>Tải file mẫu CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowImport(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: '4px',
                    }}
                    title="Đóng"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Định dạng tệp CSV UTF-8 theo cột: <code>hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning</code>
              </p>

              <form onSubmit={handleImportPrivateWords}>
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px dashed var(--border-card)',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowImport(false)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      background: 'none',
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
                    style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                  >
                    {importing ? 'Đang nhập...' : 'Tải lên & Nhập'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
