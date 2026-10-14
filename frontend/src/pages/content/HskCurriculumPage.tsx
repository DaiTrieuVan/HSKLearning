import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  PlusCircle,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getHskLevels,
  getLessonsByLevel,
  getLessonVocabularies,
  getLessonGrammar,
  createLesson,
  createVocabulary,
  addVocabularyToLesson,
  importVocabularies,
  type HskLevelItem,
  type LessonItem,
  type VocabularyItem,
  type GrammarPointItem,
  type ImportVocabResult,
} from '../../api/content'
import { ApiError } from '../../api/auth'
import { PandaMascot } from '../../components/common/PandaMascot'

export const HskCurriculumPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isTeacher = user?.activeMode === 'TEACHER' || user?.roles.includes('ADMIN')

  const [levels, setLevels] = useState<HskLevelItem[]>([])
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1)
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null)
  const [lessonTab, setLessonTab] = useState<'VOCAB' | 'GRAMMAR'>('VOCAB')

  const [vocabularies, setVocabularies] = useState<VocabularyItem[]>([])
  const [grammarPoints, setGrammarPoints] = useState<GrammarPointItem[]>([])
  const [loading, setLoading] = useState(false)
  const [contentLoading, setContentLoading] = useState(false)

  // Teacher Forms
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
    loadLevels()
  }, [])

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
      const list = await getLessonsByLevel(levelId, user?.token)
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
        getLessonVocabularies(lessonId),
        getLessonGrammar(lessonId),
      ])
      setVocabularies(vList)
      setGrammarPoints(gList)
    } catch {
      // fallback
    } finally {
      setContentLoading(false)
    }
  }

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevelId(levelId)
    loadLessons(levelId)
  }

  const handleSelectLesson = (lesson: LessonItem) => {
    setSelectedLesson(lesson)
    loadLessonDetails(lesson.id)
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
    if (!user || !newLessonTitle.trim()) return

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
        user.token
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
    if (!user || !selectedLesson || !newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()) return

    try {
      setLoading(true)
      setErrorMessage(null)
      const created = await createVocabulary(
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
        user.token
      )
      await addVocabularyToLesson(selectedLesson.id, created.id, user.token)
      setVocabularies((prev) => [...prev, created])
      setShowAddVocab(false)
      setNewHanzi('')
      setNewPinyin('')
      setNewMeaning('')
      setNewExampleSentence('')
      setNewExamplePinyin('')
      setNewExampleMeaning('')
      setActionMessage('Thêm từ vựng vào bài học thành công!')
      setTimeout(() => setActionMessage(null), 3000)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleImportVocab = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !importFile) return

    try {
      setImporting(true)
      setErrorMessage(null)
      const res = await importVocabularies(importFile, selectedLevelId, false, user.token)
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top bar */}
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

        {/* Hero banner */}
        <div
          className="game-card"
          style={{
            padding: '28px',
            backgroundColor: '#ffffff',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={30} />
            </div>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-hover)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  marginBottom: '6px',
                }}
              >
                <Sparkles size={14} />
                <span>KHUNG NĂNG LỰC HSK 3.0</span>
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Chương trình Giáo trình HSK Chuẩn
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Học từ vựng có audio phát âm chuẩn, ví dụ thực tế và các cấu trúc ngữ pháp trọng tâm theo từng bài.
              </p>
            </div>
          </div>

          <div className="animate-float" style={{ flexShrink: 0 }}>
            <PandaMascot size={70} />
          </div>
        </div>

        {/* Level Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '20px',
          }}
        >
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelectLevel(lvl.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: selectedLevelId === lvl.id ? 'var(--primary)' : '#ffffff',
                color: selectedLevelId === lvl.id ? '#ffffff' : 'var(--text-main)',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: selectedLevelId === lvl.id ? 'var(--shadow-btn-primary)' : '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {lvl.title} ({lvl.targetVocabCount} từ)
            </button>
          ))}
        </div>

        {/* Action Message Alert */}
        {actionMessage && (
          <div
            style={{
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
            {actionMessage}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#fef2f2',
              border: '1.5px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '0.9rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Split Layout: Left = Lessons List, Right = Content Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2.5fr', gap: '24px' }}>
          {/* Left Column: Lessons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                Danh sách bài học ({lessons.length})
              </div>
              {isTeacher && (
                <button
                  type="button"
                  onClick={() => setShowAddLesson(!showAddLesson)}
                  className="btn-gamified btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <PlusCircle size={14} />
                  <span>{showAddLesson ? 'Đóng' : 'Thêm bài'}</span>
                </button>
              )}
            </div>

            {/* Inline Add Lesson Form */}
            {showAddLesson && (
              <div className="game-card" style={{ padding: '16px', backgroundColor: '#ffffff', border: '2px solid var(--primary)' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 800 }}>Tạo bài học mới</h4>
                <form onSubmit={handleCreateLesson} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Tiêu đề bài học..."
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    className="game-input"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Mô tả tóm tắt..."
                    value={newLessonDesc}
                    onChange={(e) => setNewLessonDesc(e.target.value)}
                    className="game-input"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddLesson(false)}
                      style={{ padding: '6px 12px', border: '1px solid var(--border-card)', background: '#fff', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={!newLessonTitle.trim()}
                      className="btn-gamified btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                    >
                      Tạo bài
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lessons list */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                Đang tải bài học...
              </div>
            ) : lessons.length === 0 ? (
              <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Chưa có bài học nào cho cấp độ này.</p>
              </div>
            ) : (
              lessons.map((lesson) => {
                const isSelected = selectedLesson?.id === lesson.id
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className="game-card"
                    style={{
                      padding: '16px',
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border-card)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {lesson.title}
                      </div>
                      {lesson.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {lesson.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={18} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                  </div>
                )
              })
            )}
          </div>

          {/* Right Column: Lesson Content */}
          <div className="game-card" style={{ padding: '28px', backgroundColor: '#ffffff' }}>
            {selectedLesson ? (
              <>
                {/* Header of selected lesson */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                      {selectedLesson.title}
                    </h2>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                      {selectedLesson.description || 'Chưa có mô tả cho bài học này.'}
                    </p>
                  </div>

                  {isTeacher && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setShowImport(!showImport)}
                        className="btn-gamified btn-gold"
                        style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileSpreadsheet size={14} />
                        <span>{showImport ? 'Đóng CSV' : 'Nhập CSV'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddVocab(!showAddVocab)}
                        className="btn-gamified btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <PlusCircle size={14} />
                        <span>{showAddVocab ? 'Đóng thêm từ' : 'Thêm từ mới'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline Add Vocab Form for Teacher */}
                {showAddVocab && (
                  <div className="game-card" style={{ padding: '20px', backgroundColor: '#ffffff', border: '2px solid var(--primary)', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 800 }}>Thêm từ vựng vào bài học</h4>
                    <form onSubmit={handleCreateVocab} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Chữ Hán *</label>
                        <input
                          type="text"
                          placeholder="VD: 老师"
                          value={newHanzi}
                          onChange={(e) => setNewHanzi(e.target.value)}
                          className="game-input hanzi"
                          style={{ width: '100%', boxSizing: 'border-box', fontSize: '1.1rem', padding: '8px 12px' }}
                          autoFocus
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Pinyin *</label>
                        <input
                          type="text"
                          placeholder="VD: lǎoshī"
                          value={newPinyin}
                          onChange={(e) => setNewPinyin(e.target.value)}
                          className="game-input"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Nghĩa tiếng Việt *</label>
                        <input
                          type="text"
                          placeholder="VD: Giáo viên, thầy cô giáo"
                          value={newMeaning}
                          onChange={(e) => setNewMeaning(e.target.value)}
                          className="game-input"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Câu ví dụ</label>
                        <input
                          type="text"
                          placeholder="VD: 她是我的汉语老师。"
                          value={newExampleSentence}
                          onChange={(e) => setNewExampleSentence(e.target.value)}
                          className="game-input"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px' }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setShowAddVocab(false)}
                          style={{ padding: '6px 14px', border: '1px solid var(--border-card)', background: '#fff', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={!newHanzi.trim() || !newPinyin.trim() || !newMeaning.trim()}
                          className="btn-gamified btn-primary"
                          style={{ padding: '6px 18px', fontSize: '0.85rem' }}
                        >
                          Lưu từ vựng
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Inline Import CSV */}
                {showImport && (
                  <div className="game-card" style={{ padding: '20px', backgroundColor: '#ffffff', border: '2px solid var(--accent-gold)', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800 }}>Nhập từ vựng HSK qua file CSV</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      Định dạng cột CSV: <code>hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning</code>
                    </p>
                    <form onSubmit={handleImportVocab} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        required
                        style={{ flex: 1, padding: '8px', border: '1px dashed var(--border-card)', borderRadius: 'var(--radius-md)' }}
                      />
                      <button
                        type="submit"
                        disabled={importing || !importFile}
                        className="btn-gamified btn-gold"
                        style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      >
                        {importing ? 'Đang nhập...' : 'Tải lên & Nhập'}
                      </button>
                    </form>
                    {importResult && (
                      <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--primary-hover)', fontWeight: 700 }}>
                        Nhập thành công {importResult.successCount} từ! (Bỏ qua {importResult.skippedCount} từ trùng)
                      </div>
                    )}
                  </div>
                )}

                {/* Content Tabs: Vocab & Grammar */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setLessonTab('VOCAB')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      backgroundColor: lessonTab === 'VOCAB' ? 'var(--primary)' : '#f1f5f9',
                      color: lessonTab === 'VOCAB' ? '#ffffff' : 'var(--text-muted)',
                    }}
                  >
                    Từ vựng ({vocabularies.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setLessonTab('GRAMMAR')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      backgroundColor: lessonTab === 'GRAMMAR' ? 'var(--primary)' : '#f1f5f9',
                      color: lessonTab === 'GRAMMAR' ? '#ffffff' : 'var(--text-muted)',
                    }}
                  >
                    Ngữ pháp ({grammarPoints.length})
                  </button>
                </div>

                {contentLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <Loader2 size={30} className="animate-spin" style={{ margin: '0 auto 8px', color: 'var(--primary)' }} />
                    <div>Đang tải nội dung...</div>
                  </div>
                ) : lessonTab === 'VOCAB' ? (
                  vocabularies.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Bài học này hiện chưa có từ vựng.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                      {vocabularies.map((vocab) => (
                        <div
                          key={vocab.id}
                          className="game-card"
                          style={{
                            padding: '16px',
                            backgroundColor: '#ffffff',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div className="hanzi" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-chinese)' }}>
                                {vocab.hanzi}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSpeak(vocab.hanzi)}
                                title="Nghe phát âm"
                                style={{
                                  border: 'none',
                                  background: 'var(--primary-light)',
                                  color: 'var(--primary)',
                                  borderRadius: '50%',
                                  width: '34px',
                                  height: '34px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                }}
                              >
                                <Volume2 size={18} />
                              </button>
                            </div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700, margin: '2px 0 6px' }}>
                              {vocab.pinyin}
                            </div>
                            <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                              {vocab.meaning}
                            </div>
                          </div>

                          {vocab.exampleSentence && (
                            <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #f1f5f9' }}>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{vocab.exampleSentence}</div>
                              {vocab.examplePinyin && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vocab.examplePinyin}</div>
                              )}
                              {vocab.exampleMeaning && (
                                <div style={{ fontSize: '0.78rem', color: 'var(--primary-hover)', fontStyle: 'italic' }}>
                                  {vocab.exampleMeaning}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  grammarPoints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Bài học này hiện chưa có điểm ngữ pháp.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {grammarPoints.map((gp) => (
                        <div
                          key={gp.id}
                          className="game-card"
                          style={{ padding: '18px', backgroundColor: '#ffffff' }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                            {gp.title}
                          </div>
                          {gp.structure && (
                            <div
                              style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary-hover)',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                marginBottom: '10px',
                                fontFamily: 'monospace',
                              }}
                            >
                              Cấu trúc: {gp.structure}
                            </div>
                          )}
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                            {gp.explanation}
                          </div>
                          {gp.examples && gp.examples.length > 0 && (
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {gp.examples.map((ex) => (
                                <div key={ex.id} style={{ padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                                    <span className="hanzi" style={{ marginRight: '6px' }}>{ex.hanzi}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{ex.pinyin}</span>
                                  </div>
                                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>
                                    {ex.meaning}
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
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                Chọn một bài học bên trái để xem nội dung
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
