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
  createOrAddVocabularyToLesson,
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
        getLessonVocabularies(lessonId, user?.token),
        getLessonGrammar(lessonId, user?.token),
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
        user.token
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
    <div
      className="min-h-screen overflow-x-hidden px-3.5 py-4 sm:px-5 sm:py-8"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-[1200px] mx-auto w-full">
        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 cursor-pointer transition-all"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: '0.88rem',
            }}
          >
            <ArrowLeft size={18} />
            <span>Quay lại Bảng điều khiển</span>
          </button>
        </div>

        {/* Hero banner */}
        <div
          className="game-card p-4 sm:p-7 bg-white mb-5 sm:mb-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-5"
        >
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center"
              style={{
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
              }}
            >
              <BookOpen size={28} />
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-extrabold text-xs mb-1.5"
                style={{
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary-hover)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <Sparkles size={14} />
                <span>KHUNG NĂNG LỰC HSK 3.0</span>
              </div>
              <h1
                className="text-xl sm:text-[1.6rem] font-extrabold leading-snug m-0"
                style={{ color: 'var(--text-main)' }}
              >
                Chương trình Giáo trình HSK Chuẩn
              </h1>
              <p className="mt-1 mb-0 text-xs sm:text-[0.88rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Học từ vựng có audio phát âm chuẩn, ví dụ thực tế và các cấu trúc ngữ pháp trọng tâm theo từng bài.
              </p>
            </div>
          </div>

          <div className="animate-float shrink-0 self-center sm:self-auto">
            <PandaMascot size={70} />
          </div>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2.5 sm:pb-3 mb-4 sm:mb-5 -mx-1 px-1">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => handleSelectLevel(lvl.id)}
              className="shrink-0 whitespace-nowrap px-3.5 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-[0.92rem] font-extrabold cursor-pointer transition-all"
              style={{
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: selectedLevelId === lvl.id ? 'var(--primary)' : '#ffffff',
                color: selectedLevelId === lvl.id ? '#ffffff' : 'var(--text-main)',
                boxShadow: selectedLevelId === lvl.id ? 'var(--shadow-btn-primary)' : '0 1px 3px rgba(0,0,0,0.06)',
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
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,1fr)_2.5fr] gap-5 lg:gap-6 items-start">
          {/* Left Column: Lessons */}
          <div className="flex flex-col gap-3.5 min-w-0">
            <div className="flex flex-wrap justify-between items-center gap-2">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
                {lessons.map((lesson) => {
                  const isSelected = selectedLesson?.id === lesson.id
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className="game-card p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                        borderColor: isSelected ? 'var(--primary)' : 'var(--border-card)',
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-[0.95rem] break-words" style={{ color: 'var(--text-main)' }}>
                          {lesson.title}
                        </div>
                        {lesson.description && (
                          <div className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                            {lesson.description}
                          </div>
                        )}
                      </div>
                      <ChevronRight size={18} className="shrink-0" style={{ color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Column: Lesson Content */}
          <div className="game-card p-4 sm:p-7 bg-white min-w-0">
            {selectedLesson ? (
              <>
                {/* Header of selected lesson */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5 sm:gap-4 mb-5 border-b border-slate-100 pb-4">
                  <div className="min-w-0">
                    <h2
                      className="text-xl sm:text-[1.4rem] font-extrabold m-0 mb-1 break-words"
                      style={{ color: 'var(--text-main)' }}
                    >
                      {selectedLesson.title}
                    </h2>
                    <p className="text-sm sm:text-[0.88rem] m-0" style={{ color: 'var(--text-muted)' }}>
                      {selectedLesson.description || 'Chưa có mô tả cho bài học này.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(`/lessons/${selectedLesson.id}`)}
                      className="btn-gamified btn-primary"
                      style={{ padding: '6px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <BookOpen size={15} />
                      <span>Vào học bài</span>
                    </button>

                    {isTeacher && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Add Vocab Form for Teacher */}
                {showAddVocab && (
                  <div className="game-card p-4 sm:p-5 bg-white mb-5" style={{ border: '2px solid var(--primary)' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '1.05rem', fontWeight: 800 }}>Thêm từ vựng vào bài học</h4>
                    <form onSubmit={handleCreateVocab} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <div className="sm:col-span-2">
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
                      <div className="sm:col-span-2">
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
                      <div className="sm:col-span-2 flex justify-end gap-2">
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
                  <div className="game-card p-4 sm:p-5 bg-white mb-5" style={{ border: '2px solid var(--accent-gold)' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800 }}>Nhập từ vựng HSK qua file CSV</h4>
                    <p className="text-xs mb-3.5 break-words" style={{ color: 'var(--text-muted)' }}>
                      Định dạng cột CSV: <code className="break-all">hanzi,pinyin,meaning,partOfSpeech,exampleSentence,examplePinyin,exampleMeaning</code>
                    </p>
                    <form onSubmit={handleImportVocab} className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        required
                        className="w-full sm:flex-1 min-w-0 p-2"
                        style={{ border: '1px dashed var(--border-card)', borderRadius: 'var(--radius-md)' }}
                      />
                      <button
                        type="submit"
                        disabled={importing || !importFile}
                        className="btn-gamified btn-gold w-full sm:w-auto justify-center whitespace-nowrap"
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
                <div className="flex flex-wrap gap-2 mb-5">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
                      {vocabularies.map((vocab) => (
                        <div
                          key={vocab.id}
                          className="game-card p-4 bg-white flex flex-col justify-between min-w-0"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <div className="hanzi text-[1.75rem] sm:text-[2rem] font-black break-words" style={{ color: 'var(--text-chinese)' }}>
                                {vocab.hanzi}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSpeak(vocab.hanzi)}
                                title="Nghe phát âm"
                                className="shrink-0"
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
                              className="inline-block max-w-full break-words px-2.5 py-1 text-[0.82rem] sm:text-[0.85rem] font-bold mb-2.5 font-mono"
                              style={{
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary-hover)',
                                borderRadius: 'var(--radius-sm)',
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
                                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[0.88rem] font-bold" style={{ color: 'var(--text-main)' }}>
                                    <span className="hanzi">{ex.hanzi}</span>
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
