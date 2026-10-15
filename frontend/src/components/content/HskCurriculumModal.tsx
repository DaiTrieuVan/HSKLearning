import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  X,
  Volume2,
  PlusCircle,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
} from 'lucide-react'
import {
  getHskLevels,
  getLessonsByLevel,
  getLessonVocabularies,
  getLessonGrammar,
  createLesson,
  createOrAddVocabularyToLesson,
  importVocabularies,
  type HskLevelItem,
  type LessonItem,
  type VocabularyItem,
  type GrammarPointItem,
  type ImportVocabResult,
} from '../../api/content'
import { ApiError } from '../../api/auth'
import { PandaMascot } from '../common/PandaMascot'

interface HskCurriculumModalProps {
  isOpen: boolean
  onClose: () => void
  token?: string
  isTeacher?: boolean
}

export const HskCurriculumModal: React.FC<HskCurriculumModalProps> = ({
  isOpen,
  onClose,
  token,
  isTeacher,
}) => {
  const [levels, setLevels] = useState<HskLevelItem[]>([])
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1)
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null)
  const [lessonTab, setLessonTab] = useState<'VOCAB' | 'GRAMMAR'>('VOCAB')

  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([])
  const [grammarPoints, setGrammarPoints] = useState<GrammarPointItem[]>([])
  const [loading, setLoading] = useState(false)
  const [contentLoading, setContentLoading] = useState(false)

  // Teacher Modals
  const [showAddLesson, setShowAddLesson] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonDesc, setNewLessonDesc] = useState('')

  const [showAddVocab, setShowAddVocab] = useState(false)
  const [newHanzi, setNewHanzi] = useState('')
  const [newPinyin, setNewPinyin] = useState('')
  const [newMeaning, setNewMeaning] = useState('')
  const [newExampleSentence, setNewExampleSentence] = useState('')
  const [newExamplePinyin, setNewExamplePinyin] = useState('')
  const [newExampleMeaning, setNewExampleMeaning] = useState('')

  const [showImport, setShowImport] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importResult, setImportResult] = useState<ImportVocabResult | null>(null)
  const [importing, setImporting] = useState(false)

  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadLevels()
    }
  }, [isOpen])

  const loadLevels = async () => {
    try {
      setLoading(true)
      const data = await getHskLevels()
      setLevels(data)
      if (data.length > 0) {
        setSelectedLevelId(data[0].id)
        loadLessons(data[0].id)
      }
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }

  const loadLessons = async (levelId: number) => {
    try {
      setLoading(true)
      const list = await getLessonsByLevel(levelId, token)
      setLessons(list)
      if (list.length > 0) {
        setSelectedLesson(list[0])
        loadLessonDetails(list[0].id)
      } else {
        setSelectedLesson(null)
        setVocabularies([])
        setGrammarPoints([])
      }
    } catch {
      // fallback
    } finally {
      setLoading(false)
    }
  }

  const loadLessonDetails = async (lessonId: number) => {
    try {
      setContentLoading(true)
      const [vList, gList] = await Promise.all([
        getLessonVocabularies(lessonId, token),
        getLessonGrammar(lessonId, token),
      ])
      setVocabularies(vList)
      setGrammarPoints(gList)
    } catch {
      // fallback
    } finally {
      setContentLoading(false)
    }
  }

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !newLessonTitle.trim()) return

    try {
      setLoading(true)
      setErrorMessage(null)
      const created = await createLesson(
        {
          hskLevelId: selectedLevelId,
          title: newLessonTitle.trim(),
          description: newLessonDesc.trim() || undefined,
          sortOrder: lessons.length + 1,
        },
        token
      )
      setLessons((prev) => [...prev, created])
      setSelectedLesson(created)
      setShowAddLesson(false)
      setNewLessonTitle('')
      setNewLessonDesc('')
      setActionMessage('Tạo bài học thành công!')
      setTimeout(() => setActionMessage(null), 3000)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateVocab = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !selectedLesson || !newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()) return

    const isAlreadyInLesson = vocabularies.some(
      (v) => v.hanzi.trim() === newHanzi.trim() && v.pinyin.trim().toLowerCase() === newPinyin.trim().toLowerCase()
    )
    if (isAlreadyInLesson) {
      setErrorMessage(`Từ vựng "${newHanzi.trim()}" (${newPinyin.trim()}) đã có trong bài học này rồi!`)
      return
    }

    try {
      setLoading(true)
      setErrorMessage(null)
      const createdOrLinked = await createOrAddVocabularyToLesson(
        selectedLesson.id,
        {
          hanzi: newHanzi.trim(),
          pinyin: newPinyin.trim(),
          meaning: newMeaning.trim(),
          exampleSentence: newExampleSentence.trim() || undefined,
          examplePinyin: newExamplePinyin.trim() || undefined,
          exampleMeaning: newExampleMeaning.trim() || undefined,
          hskLevelId: selectedLevelId,
          isPrivate: false,
        },
        token
      )

      setVocabularies((prev) => {
        if (prev.some((v) => v.id === createdOrLinked.id)) {
          return prev
        }
        return [...prev, createdOrLinked]
      })
      setShowAddVocab(false)
      setNewHanzi('')
      setNewPinyin('')
      setNewMeaning('')
      setNewExampleSentence('')
      setNewExamplePinyin('')
      setNewExampleMeaning('')
      setActionMessage(`Thêm từ vựng "${createdOrLinked.hanzi}" vào bài học thành công!`)
      setTimeout(() => setActionMessage(null), 3000)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể thêm từ vựng vào bài học.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImportVocab = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !importFile) return

    try {
      setImporting(true)
      setErrorMessage(null)
      const res = await importVocabularies(importFile, selectedLevelId, false, token)
      setImportResult(res)
      if (selectedLesson) {
        loadLessonDetails(selectedLesson.id)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setImporting(false)
    }
  }

  if (!isOpen) return null

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
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '1060px',
          height: '90vh',
          maxHeight: '820px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '2px solid var(--border-card)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Lộ trình học HSK Chuẩn
                </h3>
                <span
                  style={{
                    backgroundColor: 'var(--accent-gold-light)',
                    color: 'var(--accent-gold-shadow)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  6 Cấp độ
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Khám phá kho bài học, từ vựng có phát âm và điểm ngữ pháp chi tiết
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isTeacher && (
              <>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(true)}
                  className="btn-gamified btn-gold"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <PlusCircle size={15} />
                  <span>Thêm bài học</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowImport(true)}
                  className="btn-gamified btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  <Upload size={15} />
                  <span>Nhập CSV</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                border: 'none',
                background: '#f1f5f9',
                borderRadius: 'var(--radius-full)',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Level Switcher Ribbon */}
        <div
          style={{
            padding: '10px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid var(--border-card)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {levels.map((lvl) => {
            const isSelected = lvl.id === selectedLevelId
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => {
                  setSelectedLevelId(lvl.id)
                  loadLessons(lvl.id)
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-card)',
                  backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{lvl.code}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                  }}
                >
                  {lvl.targetVocabCount} từ
                </span>
              </button>
            )
          })}
        </div>

        {/* Notifications */}
        {actionMessage && (
          <div
            style={{
              padding: '8px 24px',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={16} />
            <span>{actionMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              padding: '8px 24px',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Content Body: Sidebar (Lessons) + Main View (Vocab / Grammar) */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar: Lessons */}
          <div
            style={{
              width: '300px',
              borderRight: '1px solid var(--border-card)',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fafbfc',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderBottom: '1px solid var(--border-card)',
              }}
            >
              Danh sách bài học ({lessons.length})
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {loading ? (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.82rem' }}>Đang tải bài học...</div>
                </div>
              ) : lessons.length === 0 ? (
                <div style={{ padding: '30px 16px', textAlign: 'center' }}>
                  <PandaMascot size={48} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-muted)' }}>
                    Chưa có bài học nào trong cấp độ này
                  </div>
                </div>
              ) : (
                lessons.map((ls, idx) => {
                  const isSelected = selectedLesson?.id === ls.id
                  return (
                    <div
                      key={ls.id}
                      onClick={() => {
                        setSelectedLesson(ls)
                        loadLessonDetails(ls.id)
                      }}
                      style={{
                        padding: '12px 14px',
                        marginBottom: '6px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isSelected ? 'var(--primary)' : '#e2e8f0',
                              color: isSelected ? '#ffffff' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                            }}
                          >
                            {idx + 1}
                          </span>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: '0.88rem',
                              color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                            }}
                          >
                            {ls.title}
                          </span>
                        </div>
                        <ChevronRight
                          size={16}
                          style={{ color: isSelected ? 'var(--primary)' : '#94a3b8' }}
                        />
                      </div>
                      {ls.description && (
                        <p
                          style={{
                            margin: '4px 0 0 30px',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.3,
                          }}
                        >
                          {ls.description}
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Main Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
            {selectedLesson ? (
              <>
                {/* Lesson Header Bar */}
                <div
                  style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid var(--border-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {selectedLesson.title}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {selectedLesson.description || 'Nội dung cốt lõi của bài học'}
                    </p>
                  </div>

                  {/* Tabs: Vocab & Grammar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        backgroundColor: '#f1f5f9',
                        padding: '3px',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setLessonTab('VOCAB')}
                        style={{
                          padding: '6px 14px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: lessonTab === 'VOCAB' ? '#ffffff' : 'transparent',
                          color: lessonTab === 'VOCAB' ? 'var(--primary)' : 'var(--text-muted)',
                          boxShadow: lessonTab === 'VOCAB' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        }}
                      >
                        Từ vựng ({vocabularies.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLessonTab('GRAMMAR')}
                        style={{
                          padding: '6px 14px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: lessonTab === 'GRAMMAR' ? '#ffffff' : 'transparent',
                          color: lessonTab === 'GRAMMAR' ? 'var(--primary)' : 'var(--text-muted)',
                          boxShadow: lessonTab === 'GRAMMAR' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        }}
                      >
                        Ngữ pháp ({grammarPoints.length})
                      </button>
                    </div>

                    {isTeacher && lessonTab === 'VOCAB' && (
                      <button
                        type="button"
                        onClick={() => setShowAddVocab(true)}
                        className="btn-gamified btn-gold"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <PlusCircle size={14} />
                        <span>Thêm từ</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Lesson Details Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                  {contentLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                      <div>Đang tải nội dung...</div>
                    </div>
                  ) : lessonTab === 'VOCAB' ? (
                    vocabularies.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <PandaMascot size={64} />
                        <h4 style={{ margin: '12px 0 6px', fontWeight: 800 }}>Chưa có từ vựng nào trong bài</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {isTeacher
                            ? 'Bấm "Thêm từ" ở góc trên hoặc dùng nút "Nhập CSV" để thêm hàng loạt.'
                            : 'Bài học này đang được chuẩn bị từ vựng.'}
                        </p>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                          gap: '16px',
                        }}
                      >
                        {vocabularies.map((v) => (
                          <div
                            key={v.id}
                            className="game-card"
                            style={{
                              padding: '16px 18px',
                              backgroundColor: '#ffffff',
                              border: '1.5px solid var(--border-card)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'baseline',
                                  justifyContent: 'space-between',
                                  marginBottom: '8px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                  <span
                                    className="hanzi"
                                    style={{
                                      fontSize: '2rem',
                                      fontWeight: 800,
                                      color: 'var(--text-main)',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {v.hanzi}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '1rem',
                                      fontWeight: 700,
                                      color: 'var(--primary)',
                                      fontFamily: 'monospace',
                                    }}
                                  >
                                    {v.pinyin}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleSpeak(v.hanzi)}
                                  title="Nghe phát âm chuẩn"
                                  style={{
                                    border: 'none',
                                    backgroundColor: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    borderRadius: 'var(--radius-full)',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.1s',
                                  }}
                                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                  <Volume2 size={16} />
                                </button>
                              </div>

                              <div
                                style={{
                                  fontSize: '0.92rem',
                                  fontWeight: 800,
                                  color: 'var(--text-main)',
                                  marginBottom: '10px',
                                }}
                              >
                                {v.meaning}
                              </div>

                              {v.exampleSentence && (
                                <div
                                  style={{
                                    padding: '8px 10px',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.8rem',
                                    borderLeft: '3px solid var(--primary)',
                                  }}
                                >
                                  <div
                                    className="hanzi"
                                    style={{ fontWeight: 700, color: 'var(--text-main)' }}
                                  >
                                    {v.exampleSentence}
                                  </div>
                                  {v.examplePinyin && (
                                    <div style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>
                                      {v.examplePinyin}
                                    </div>
                                  )}
                                  {v.exampleMeaning && (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                      {v.exampleMeaning}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    /* Grammar Points Tab */
                    grammarPoints.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <PandaMascot size={64} />
                        <h4 style={{ margin: '12px 0 6px', fontWeight: 800 }}>Chưa có điểm ngữ pháp nào</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Bài học này chưa có ghi chú ngữ pháp đặc biệt.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {grammarPoints.map((gp, idx) => (
                          <div
                            key={gp.id}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1.5px solid var(--border-card)',
                              borderRadius: 'var(--radius-md)',
                              padding: '20px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span
                                style={{
                                  backgroundColor: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '2px 8px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                }}
                              >
                                Ngữ pháp #{idx + 1}
                              </span>
                              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                                {gp.title}
                              </h4>
                            </div>

                            {gp.structure && (
                              <div
                                style={{
                                  display: 'inline-block',
                                  padding: '4px 10px',
                                  backgroundColor: '#fffbeb',
                                  border: '1px solid #fde68a',
                                  color: '#b45309',
                                  borderRadius: 'var(--radius-sm)',
                                  fontFamily: 'monospace',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  marginBottom: '10px',
                                }}
                              >
                                Cấu trúc: {gp.structure}
                              </div>
                            )}

                            <p
                              style={{
                                margin: '0 0 14px',
                                fontSize: '0.9rem',
                                color: 'var(--text-main)',
                                lineHeight: 1.5,
                              }}
                            >
                              {gp.explanation}
                            </p>

                            {gp.examples && gp.examples.length > 0 && (
                              <div
                                style={{
                                  backgroundColor: '#f8fafc',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                }}
                              >
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                                  Ví dụ minh họa:
                                </div>
                                {gp.examples.map((ex) => (
                                  <div key={ex.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleSpeak(ex.hanzi)}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        padding: 0,
                                        marginTop: '2px',
                                      }}
                                    >
                                      <Volume2 size={16} />
                                    </button>
                                    <div>
                                      <div className="hanzi" style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                                        {ex.hanzi}
                                      </div>
                                      <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                        {ex.pinyin}
                                      </div>
                                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {ex.meaning}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </>
            ) : (
              <div style={{ margin: 'auto', textAlign: 'center', padding: '40px' }}>
                <PandaMascot size={80} />
                <h3 style={{ margin: '16px 0 6px', fontWeight: 800 }}>Hãy chọn một bài học</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Chọn bài học từ danh sách bên trái để bắt đầu khám phá từ vựng và ngữ pháp.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Modal: Add Lesson */}
      {showAddLesson && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: '460px',
              width: '90%',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Tạo bài học mới</h3>
            <form onSubmit={handleCreateLesson}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Tiêu đề bài học *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài 4: Gia đình của tôi"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Mô tả bài học
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả mục tiêu của bài học..."
                  value={newLessonDesc}
                  onChange={(e) => setNewLessonDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid var(--border-card)',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                >
                  {loading ? 'Đang tạo...' : 'Tạo bài học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Modal: Add Vocabulary */}
      {showAddVocab && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: '520px',
              width: '90%',
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontWeight: 800 }}>Thêm từ vựng vào bài học</h3>
            <form onSubmit={handleCreateVocab}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Chữ Hán (Hanzi) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: 老师"
                    value={newHanzi}
                    onChange={(e) => setNewHanzi(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '1.1rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    Phiên âm (Pinyin) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: lǎoshī"
                    value={newPinyin}
                    onChange={(e) => setNewPinyin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Thầy cô giáo"
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                  Câu ví dụ (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 他是我的中文老师。"
                  value={newExampleSentence}
                  onChange={(e) => setNewExampleSentence(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    marginBottom: '6px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Pinyin ví dụ: Tā shì wǒ de Zhōngwén lǎoshī."
                  value={newExamplePinyin}
                  onChange={(e) => setNewExamplePinyin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    marginBottom: '6px',
                  }}
                />
                <input
                  type="text"
                  placeholder="Dịch nghĩa: Thầy ấy là thầy giáo tiếng Trung của tôi."
                  value={newExampleMeaning}
                  onChange={(e) => setNewExampleMeaning(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddVocab(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid var(--border-card)',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                >
                  {loading ? 'Đang thêm...' : 'Lưu từ vựng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Modal: Import CSV */}
      {showImport && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              maxWidth: '480px',
              width: '90%',
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontWeight: 800 }}>Nhập từ vựng hàng loạt từ file CSV</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Định dạng các cột: <code>hanzi, pinyin, meaning, partOfSpeech, exampleSentence, examplePinyin, exampleMeaning</code>
            </p>

            <form onSubmit={handleImportVocab}>
              <div
                style={{
                  border: '2px dashed var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                <FileSpreadsheet size={36} style={{ color: 'var(--primary)', margin: '0 auto 8px' }} />
                <input
                  type="file"
                  accept=".csv,.txt"
                  required
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              {importResult && (
                <div
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                  }}
                >
                  <div>Đã xử lý: {importResult.totalRows} dòng</div>
                  <div>Thành công: {importResult.successCount} từ</div>
                  <div>Bỏ qua (đã tồn tại): {importResult.skippedCount} từ</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowImport(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid var(--border-card)',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={importing || !importFile}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                >
                  {importing ? 'Đang nhập...' : 'Bắt đầu nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
