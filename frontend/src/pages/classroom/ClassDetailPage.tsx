import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Archive,
  UserMinus,
  RotateCcw,
  LogOut,
  BookMarked,
  ChevronDown,
  ChevronRight,
  Plus,
  Users,
  Volume2,
  RotateCw,
  X,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Layers,
  FileCheck,
  Calendar,
  Clock,
  Send,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getTeachingClasses,
  getEnrolledClasses,
  getClassMembers,
  removeStudent,
  restoreStudent,
  archiveClass,
  leaveClass,
  type ClassItem,
  type ClassMemberItem,
} from '../../api/classroom'
import {
  getClassVocabSets,
  getVocabSetItems,
  getMyVocabSets,
  assignVocabSetToClass,
  type VocabSetItem,
  type VocabularyItem,
} from '../../api/content'
import {
  getFlashcards,
  reviewFlashcard,
  type FlashcardItem,
} from '../../api/flashcard'
import {
  getAssignmentsForClass,
  type AssignmentItem,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'

export const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [classroom, setClassroom] = useState<ClassItem | null>(null)
  const [classLoading, setClassLoading] = useState(true)

  const isTeacher = user?.activeMode === 'TEACHER'

  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'REMOVED' | 'VOCAB_SETS' | 'ASSIGNMENTS'>(
    'ASSIGNMENTS'
  )
  const [members, setMembers] = useState<ClassMemberItem[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Assignments state (HTT-06-CN-001)
  const [classAssignments, setClassAssignments] = useState<AssignmentItem[]>([])
  const [assignmentsLoading, setAssignmentsLoading] = useState(false)

  // Vocab Sets state
  const [classVocabSets, setClassVocabSets] = useState<VocabSetItem[]>([])
  const [vocabSetsLoading, setVocabSetsLoading] = useState(false)
  const [expandedSetId, setExpandedSetId] = useState<number | null>(null)
  const [expandedWords, setExpandedWords] = useState<Record<number, VocabularyItem[]>>({})
  const [wordsLoadingId, setWordsLoadingId] = useState<number | null>(null)

  // Per-set study mode: 'LIST' or 'FLASHCARD'
  const [studyModes, setStudyModes] = useState<Record<number, 'LIST' | 'FLASHCARD'>>({})

  // Flashcard learning state for active expanded set
  const [activeFlashcards, setActiveFlashcards] = useState<FlashcardItem[]>([])
  const [flashcardsLoading, setFlashcardsLoading] = useState(false)
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSessionFinished, setIsSessionFinished] = useState(false)
  const [sessionRememberedCount, setSessionRememberedCount] = useState(0)
  const [sessionForgottenCount, setSessionForgottenCount] = useState(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // Audio pronunciation state
  const [playingVocabId, setPlayingVocabId] = useState<number | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Assign vocab set dropdown
  const [showAssignDropdown, setShowAssignDropdown] = useState(false)
  const [myAvailableSets, setMyAvailableSets] = useState<VocabSetItem[]>([])
  const [assigningId, setAssigningId] = useState<number | null>(null)

  // Remove student prompt
  const [removingStudent, setRemovingStudent] = useState<ClassMemberItem | null>(null)
  const [removeReason, setRemoveReason] = useState('')

  useEffect(() => {
    if (!user || !classId) return

    const loadClassInfo = async () => {
      try {
        setClassLoading(true)
        const fetcher = isTeacher ? getTeachingClasses : getEnrolledClasses
        const list = await fetcher(user.token)
        const found = list.find((c) => c.id === Number(classId))
        if (found) {
          setClassroom(found)
        } else {
          setError('Không tìm thấy thông tin lớp học hoặc bạn không có quyền truy cập.')
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Không thể tải thông tin lớp học')
        }
      } finally {
        setClassLoading(false)
      }
    }

    loadClassInfo()
  }, [user, classId, isTeacher])

  useEffect(() => {
    if (classroom && user) {
      if (activeTab === 'VOCAB_SETS') {
        loadClassVocabSets()
      } else if (activeTab === 'ASSIGNMENTS') {
        loadClassAssignments()
      } else {
        loadMembers()
      }
    }
  }, [classroom, activeTab])

  const loadClassAssignments = async () => {
    if (!classroom || !user) return
    try {
      setAssignmentsLoading(true)
      const data = await getAssignmentsForClass(classroom.id, user.token)
      setClassAssignments(data)
    } catch {
      // fallback
    } finally {
      setAssignmentsLoading(false)
    }
  }

  const loadMembers = async () => {
    if (!classroom || !user) return
    try {
      setLoading(true)
      setError(null)
      const data = await getClassMembers(classroom.id, user.token)
      setMembers(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải danh sách thành viên')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadClassVocabSets = async () => {
    if (!classroom || !user) return
    try {
      setVocabSetsLoading(true)
      const data = await getClassVocabSets(classroom.id, user.token)
      setClassVocabSets(data)
    } catch {
      // fallback
    } finally {
      setVocabSetsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
    }
  }, [])

  const handlePlayAudio = (e: React.MouseEvent, vocab: { id: number; audioUrl?: string }) => {
    e.stopPropagation()
    if (!vocab.audioUrl || !vocab.audioUrl.trim()) {
      setAudioError('Từ vựng này chưa có tệp âm thanh phát âm')
      setTimeout(() => setAudioError(null), 3500)
      return
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      if (playingVocabId === vocab.id) {
        setPlayingVocabId(null)
        currentAudioRef.current = null
        return
      }
    }

    const rawUrl = vocab.audioUrl.trim()
    const resolvedUrl =
      rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('/')
        ? rawUrl
        : `/${rawUrl}`

    const audio = new Audio(resolvedUrl)
    currentAudioRef.current = audio
    setPlayingVocabId(vocab.id)

    audio.onended = () => {
      if (currentAudioRef.current === audio) {
        setPlayingVocabId(null)
        currentAudioRef.current = null
      }
    }

    audio.onerror = () => {
      if (currentAudioRef.current === audio) {
        setPlayingVocabId(null)
        currentAudioRef.current = null
        setAudioError('Không tìm thấy tệp âm thanh hoặc tệp đã bị xóa')
        setTimeout(() => setAudioError(null), 3500)
      }
    }

    audio.play().catch(() => {
      if (currentAudioRef.current === audio) {
        setPlayingVocabId(null)
        currentAudioRef.current = null
        setAudioError('Không thể phát âm thanh của từ này')
        setTimeout(() => setAudioError(null), 3500)
      }
    })
  }

  const loadFlashcardsForSet = async (setId: number, onlyForgotten = false) => {
    if (!user) return
    setFlashcardsLoading(true)
    try {
      const cards = await getFlashcards(user.token, { vocabSetId: setId, onlyForgotten })
      setActiveFlashcards(cards)
      setFlashcardIndex(0)
      setIsFlipped(false)
      setIsSessionFinished(false)
      setSessionRememberedCount(0)
      setSessionForgottenCount(0)
    } catch (err: any) {
      setAudioError(err?.message || 'Không thể tải thẻ flashcard')
      setTimeout(() => setAudioError(null), 3500)
    } finally {
      setFlashcardsLoading(false)
    }
  }

  const handleSwitchMode = (setId: number, mode: 'LIST' | 'FLASHCARD') => {
    setStudyModes((prev) => ({ ...prev, [setId]: mode }))
    if (mode === 'FLASHCARD') {
      loadFlashcardsForSet(setId, false)
    } else if (!expandedWords[setId] && user) {
      setWordsLoadingId(setId)
      getVocabSetItems(setId, user.token)
        .then((words) => setExpandedWords((prev) => ({ ...prev, [setId]: words })))
        .catch(() => {})
        .finally(() => setWordsLoadingId(null))
    }
  }

  const handleReviewFlashcardCard = async (result: 'REMEMBERED' | 'FORGOTTEN') => {
    if (activeFlashcards.length === 0 || isSubmittingReview || !user) return
    const currentCard = activeFlashcards[flashcardIndex]
    if (!currentCard) return

    setIsSubmittingReview(true)
    try {
      await reviewFlashcard(user.token, { vocabularyId: currentCard.id, result })

      setActiveFlashcards((prev) =>
        prev.map((c, i) => (i === flashcardIndex ? { ...c, lastResult: result } : c))
      )

      if (result === 'REMEMBERED') {
        setSessionRememberedCount((prev) => prev + 1)
      } else {
        setSessionForgottenCount((prev) => prev + 1)
      }

      if (flashcardIndex < activeFlashcards.length - 1) {
        setIsFlipped(false)
        setFlashcardIndex((prev) => prev + 1)
      } else {
        setIsSessionFinished(true)
      }
    } catch (err: any) {
      setAudioError(err?.message || 'Không thể lưu kết quả học từ')
      setTimeout(() => setAudioError(null), 3500)
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleToggleExpandSet = async (setId: number) => {
    if (!user) return
    if (expandedSetId === setId) {
      setExpandedSetId(null)
      return
    }

    setExpandedSetId(setId)
    const mode = studyModes[setId] || 'LIST'
    if (mode === 'FLASHCARD') {
      loadFlashcardsForSet(setId, false)
    } else if (!expandedWords[setId]) {
      try {
        setWordsLoadingId(setId)
        const words = await getVocabSetItems(setId, user.token)
        setExpandedWords((prev) => ({ ...prev, [setId]: words }))
      } catch {
        // fallback
      } finally {
        setWordsLoadingId(null)
      }
    }
  }

  const handleOpenAssignDropdown = async () => {
    if (!user) return
    try {
      setShowAssignDropdown(true)
      const allMySets = await getMyVocabSets(user.token)
      const assignedIds = new Set(classVocabSets.map((s) => s.id))
      setMyAvailableSets(allMySets.filter((s) => !assignedIds.has(s.id)))
    } catch {
      // fallback
    }
  }

  const handleAssignSet = async (setId: number) => {
    if (!classroom || !user) return
    try {
      setAssigningId(setId)
      await assignVocabSetToClass(setId, classroom.id, user.token)
      await loadClassVocabSets()
      setShowAssignDropdown(false)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setAssigningId(null)
    }
  }

  const handleCopyCode = () => {
    if (classroom?.joinCode) {
      navigator.clipboard.writeText(classroom.joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleRemoveStudentConfirm = async () => {
    if (!classroom || !removingStudent || !user) return
    try {
      setActionLoading(removingStudent.studentId)
      await removeStudent(classroom.id, removingStudent.studentId, removeReason, user.token)
      setRemovingStudent(null)
      setRemoveReason('')
      await loadMembers()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestoreStudent = async (studentId: number) => {
    if (!classroom || !user) return
    try {
      setActionLoading(studentId)
      await restoreStudent(classroom.id, studentId, user.token)
      await loadMembers()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleArchiveClass = async () => {
    if (!classroom || !user) return
    if (!window.confirm('Bạn có chắc chắn muốn lưu trữ lớp học này không? Học sinh sẽ không thể nộp bài mới.')) return
    try {
      setLoading(true)
      await archiveClass(classroom.id, user.token)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveClass = async () => {
    if (!classroom || !user) return
    if (!window.confirm('Bạn có chắc chắn muốn rời khỏi lớp học này không?')) return
    try {
      setLoading(true)
      await leaveClass(classroom.id, user.token)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (classLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  if (!classroom) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <AlertCircle size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>Không tìm thấy lớp học</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'Lớp học không tồn tại hoặc đã bị xóa.'}</p>
          <button type="button" onClick={() => navigate('/')} className="btn-gamified btn-primary">
            Quay lại Bảng điều khiển
          </button>
        </div>
      </div>
    )
  }

  const activeMembers = members.filter((m) => m.status === 'ACTIVE')
  const removedMembers = members.filter((m) => m.status === 'REMOVED' || m.status === 'LEFT')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Back navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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

          <div style={{ display: 'flex', gap: '8px' }}>
            {isTeacher && classroom.status === 'ACTIVE' && (
              <button
                type="button"
                onClick={handleArchiveClass}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#64748b',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Archive size={16} />
                <span>Lưu trữ lớp</span>
              </button>
            )}

            {!isTeacher && (
              <button
                type="button"
                onClick={handleLeaveClass}
                className="btn-danger"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid #fecaca',
                  backgroundColor: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={16} />
                <span>Rời khỏi lớp</span>
              </button>
            )}
          </div>
        </div>

        {/* Class Header Banner */}
        <div
          className="game-card"
          style={{
            padding: '28px',
            backgroundColor: '#ffffff',
            marginBottom: '24px',
            borderLeft: classroom.status === 'ARCHIVED' ? '6px solid #94a3b8' : '6px solid var(--primary)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: classroom.status === 'ARCHIVED' ? '#f1f5f9' : 'var(--primary-light)',
                    color: classroom.status === 'ARCHIVED' ? '#64748b' : 'var(--primary)',
                  }}
                >
                  {classroom.status === 'ARCHIVED' ? 'LỚP ĐÃ LƯU TRỮ' : 'LỚP HOẠT ĐỘNG'}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Giáo viên: <strong>{classroom.teacherName}</strong>
                </span>
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px' }}>
                {classroom.title}
              </h1>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {classroom.description || 'Chưa có mô tả cho lớp học này.'}
              </p>
            </div>

            {/* Join Code Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                backgroundColor: 'var(--primary-light)',
                border: '1.5px dashed var(--primary)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>MÃ THAM GIA LỚP</div>
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    letterSpacing: '2px',
                    fontFamily: 'monospace',
                    color: 'var(--primary-hover)',
                  }}
                >
                  {classroom.joinCode}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Sao chép mã"
                style={{
                  padding: '6px 10px',
                  backgroundColor: copied ? 'var(--primary)' : '#ffffff',
                  color: copied ? '#ffffff' : 'var(--text-main)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Đã chép' : 'Chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '0.88rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid var(--border-card)', paddingBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ASSIGNMENTS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'ASSIGNMENTS' ? 'var(--primary)' : '#f1f5f9',
              color: activeTab === 'ASSIGNMENTS' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <FileCheck size={16} />
            <span>Bài tập ({classAssignments.length})</span>
          </button>

          {isTeacher && (
            <button
              type="button"
              onClick={() => setActiveTab('MEMBERS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'MEMBERS' ? 'var(--primary)' : '#f1f5f9',
                color: activeTab === 'MEMBERS' ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              <Users size={16} />
              <span>Học viên ({activeMembers.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('VOCAB_SETS')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              backgroundColor: activeTab === 'VOCAB_SETS' ? 'var(--primary)' : '#f1f5f9',
              color: activeTab === 'VOCAB_SETS' ? '#ffffff' : 'var(--text-muted)',
            }}
          >
            <BookMarked size={16} />
            <span>Bộ từ vựng giao cho lớp ({classVocabSets.length})</span>
          </button>

          {isTeacher && (
            <button
              type="button"
              onClick={() => setActiveTab('REMOVED')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'REMOVED' ? 'var(--primary)' : '#f1f5f9',
                color: activeTab === 'REMOVED' ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              <UserMinus size={16} />
              <span>Đã xóa / Đã rời ({removedMembers.length})</span>
            </button>
          )}
        </div>

        {/* Tab 0: Class Assignments (HTT-06-CN-001) */}
        {activeTab === 'ASSIGNMENTS' && (
          <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Bài tập đã giao cho lớp
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Danh sách bài tập và hạn nộp (QTN-01, QTN-09, QTN-10)
                </p>
              </div>

              {isTeacher && classroom.status === 'ACTIVE' && (
                <button
                  type="button"
                  onClick={() => navigate('/exercises')}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Send size={15} />
                  <span>Giao bài tập mới</span>
                </button>
              )}
            </div>

            {assignmentsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Đang tải danh sách bài tập...
              </div>
            ) : classAssignments.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed #cbd5e1',
                }}
              >
                <FileCheck size={36} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
                <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Chưa có bài tập nào được giao cho lớp
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isTeacher
                    ? 'Bạn có thể vào trang Quản lý bài tập để chọn bài và giao ngay cho lớp này.'
                    : 'Giáo viên chưa giao bài tập nào. Hãy quay lại kiểm tra sau nhé!'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {classAssignments.map((a) => {
                  const isClosed = a.status === 'CLOSED'
                  const isScheduled = a.status === 'SCHEDULED'
                  return (
                    <div
                      key={a.id}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: isClosed ? '#f1f5f9' : isScheduled ? '#fffbeb' : '#ecfdf5',
                              color: isClosed ? '#64748b' : isScheduled ? '#b45309' : '#047857',
                              border: `1px solid ${isClosed ? '#cbd5e1' : isScheduled ? '#fde68a' : '#a7f3d0'}`,
                            }}
                          >
                            {isClosed ? 'ĐÃ HẾT HẠN' : isScheduled ? 'SẮP DIỄN RA' : 'ĐANG MỞ LÀM BÀI'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Mã đợt #{a.id}
                          </span>
                        </div>

                        <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {a.title}
                        </h4>

                        {a.description && (
                          <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                            {a.description}
                          </p>
                        )}

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={14} />
                            <span>Bắt đầu: {new Date(a.startTime).toLocaleString('vi-VN')}</span>
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: isClosed ? '#ef4444' : '#b45309',
                              fontWeight: 700,
                            }}
                          >
                            <Clock size={14} />
                            <span>Hạn nộp: {new Date(a.dueTime).toLocaleString('vi-VN')}</span>
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.questionCount} câu hỏi</div>
                          <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary)' }}>{a.totalPoints} điểm</div>
                        </div>

                        {!isTeacher && (
                          <button
                            type="button"
                            disabled={isScheduled || isClosed}
                            style={{
                              padding: '8px 18px',
                              borderRadius: 'var(--radius-md)',
                              border: 'none',
                              backgroundColor: isScheduled || isClosed ? '#cbd5e1' : 'var(--primary)',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              cursor: isScheduled || isClosed ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span>{isClosed ? 'Đã đóng' : isScheduled ? 'Chưa mở' : 'Làm bài'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Active Members */}
        {activeTab === 'MEMBERS' && (
          <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Đang tải danh sách học viên...
              </div>
            ) : activeMembers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Chưa có học viên nào tham gia lớp học. Hãy chia sẻ mã <strong>{classroom.joinCode}</strong> cho học sinh!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {member.studentName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {member.studentEmail} · Tham gia: {new Date(member.joinedAt).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {isTeacher && (
                      <button
                        type="button"
                        onClick={() => setRemovingStudent(member)}
                        className="btn-danger"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid #fecaca',
                          backgroundColor: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <UserMinus size={14} />
                        <span>Khai trừ</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Vocab Sets assigned to Class */}
        {activeTab === 'VOCAB_SETS' && (
          <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Bộ từ vựng giáo viên giao
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Học sinh trong lớp học các bộ từ vựng được giao tại đây
                </p>
              </div>

              {isTeacher && (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={handleOpenAssignDropdown}
                    className="btn-gamified btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <Plus size={16} />
                    <span>Giao thêm bộ từ</span>
                  </button>

                  {showAssignDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '6px',
                        width: '280px',
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        border: '1.5px solid var(--border-card)',
                        zIndex: 20,
                        padding: '8px',
                      }}
                    >
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', padding: '6px 8px' }}>
                        CHỌN BỘ TỪ ĐỂ GIAO CHO LỚP
                      </div>
                      {myAvailableSets.length === 0 ? (
                        <div style={{ padding: '12px 8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Không có bộ từ mới khả dụng. Hãy tạo thêm ở mục Bộ từ vựng!
                        </div>
                      ) : (
                        myAvailableSets.map((s) => (
                          <div
                            key={s.id}
                            onClick={() => handleAssignSet(s.id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              color: 'var(--text-main)',
                              backgroundColor: assigningId === s.id ? 'var(--primary-light)' : 'transparent',
                            }}
                          >
                            <span>{s.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.itemCount} từ</span>
                          </div>
                        ))
                      )}
                      <button
                        type="button"
                        onClick={() => setShowAssignDropdown(false)}
                        style={{
                          width: '100%',
                          padding: '6px',
                          border: 'none',
                          background: '#f1f5f9',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginTop: '6px',
                        }}
                      >
                        Đóng
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {vocabSetsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Đang tải danh sách bộ từ vựng...
              </div>
            ) : classVocabSets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                {isTeacher
                  ? 'Chưa có bộ từ vựng nào được giao cho lớp này. Bấm "+ Giao thêm bộ từ" để thêm bài học cho học sinh.'
                  : 'Giáo viên chưa giao bộ từ vựng nào cho lớp học.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {classVocabSets.map((vs) => {
                  const isExpanded = expandedSetId === vs.id
                  const words = expandedWords[vs.id] || []
                  const isLoadingWords = wordsLoadingId === vs.id
                  const currentMode = studyModes[vs.id] || 'LIST'

                  return (
                    <div
                      key={vs.id}
                      style={{
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        backgroundColor: '#f8fafc',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        onClick={() => handleToggleExpandSet(vs.id)}
                        style={{
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--primary-light)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary)',
                              flexShrink: 0,
                            }}
                          >
                            <BookMarked size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                              {vs.title}
                            </div>
                            {vs.description && (
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {vs.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                            }}
                          >
                            {vs.itemCount} từ vựng
                          </span>
                          {isExpanded ? <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: '20px', borderTop: '1px solid var(--border-card)', backgroundColor: '#f8fafc' }}>
                          {/* Mode Switcher Tabs */}
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                            <button
                              type="button"
                              onClick={() => handleSwitchMode(vs.id, 'LIST')}
                              className="btn-gamified"
                              style={{
                                padding: '8px 16px',
                                fontSize: '0.84rem',
                                fontWeight: 800,
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: currentMode === 'LIST' ? 'var(--primary)' : '#ffffff',
                                color: currentMode === 'LIST' ? '#ffffff' : 'var(--text-muted)',
                                borderColor: currentMode === 'LIST' ? 'var(--primary)' : '#e2e8f0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <BookOpen size={16} />
                              <span>Danh sách từ ({words.length > 0 ? words.length : vs.itemCount})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSwitchMode(vs.id, 'FLASHCARD')}
                              className="btn-gamified"
                              style={{
                                padding: '8px 16px',
                                fontSize: '0.84rem',
                                fontWeight: 800,
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: currentMode === 'FLASHCARD' ? 'var(--primary)' : '#ffffff',
                                color: currentMode === 'FLASHCARD' ? '#ffffff' : 'var(--text-muted)',
                                borderColor: currentMode === 'FLASHCARD' ? 'var(--primary)' : '#e2e8f0',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <Layers size={16} />
                              <span>Học bằng Flashcard</span>
                            </button>
                          </div>

                          {/* 1. LIST MODE */}
                          {currentMode === 'LIST' && (
                            <div>
                              {isLoadingWords ? (
                                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                                  <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 8px' }} />
                                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Đang tải danh sách từ vựng...</div>
                                </div>
                              ) : words.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                  Bộ từ vựng này hiện chưa có từ nào.
                                </div>
                              ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                                  {words.map((w) => (
                                    <div
                                      key={w.id}
                                      style={{
                                        padding: '16px',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: '#ffffff',
                                        border: '1.5px solid var(--border-card)',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                          <div>
                                            <span className="hanzi" style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-chinese)' }}>
                                              {w.hanzi}
                                            </span>
                                            <span style={{ marginLeft: '10px', fontSize: '0.96rem', fontWeight: 800, color: 'var(--primary)' }}>
                                              {w.pinyin}
                                            </span>
                                          </div>

                                          {w.audioUrl && (
                                            <button
                                              type="button"
                                              onClick={(e) => handlePlayAudio(e, w)}
                                              title="Phát âm từ vựng"
                                              style={{
                                                padding: '6px 10px',
                                                borderRadius: 'var(--radius-full)',
                                                border: '1px solid var(--border-card)',
                                                backgroundColor: playingVocabId === w.id ? 'var(--primary-light)' : '#f8fafc',
                                                color: playingVocabId === w.id ? 'var(--primary)' : 'var(--text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                              }}
                                            >
                                              <Volume2 size={15} />
                                              <span>{playingVocabId === w.id ? 'Đang phát...' : 'Phát âm'}</span>
                                            </button>
                                          )}
                                        </div>

                                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                                          {w.meaning}
                                        </div>

                                        {w.partOfSpeech && (
                                          <span
                                            style={{
                                              display: 'inline-block',
                                              fontSize: '0.72rem',
                                              fontWeight: 700,
                                              padding: '2px 8px',
                                              borderRadius: 'var(--radius-sm)',
                                              backgroundColor: '#f1f5f9',
                                              color: 'var(--text-muted)',
                                              marginBottom: '8px',
                                            }}
                                          >
                                            {w.partOfSpeech}
                                          </span>
                                        )}
                                      </div>

                                      {w.exampleSentence && (
                                        <div
                                          style={{
                                            marginTop: '8px',
                                            padding: '10px 12px',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '0.8rem',
                                          }}
                                        >
                                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{w.exampleSentence}</div>
                                          {w.examplePinyin && <div style={{ fontSize: '0.76rem', color: 'var(--primary)', marginTop: '2px' }}>{w.examplePinyin}</div>}
                                          {w.exampleMeaning && <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>{w.exampleMeaning}</div>}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* 2. FLASHCARD MODE */}
                          {currentMode === 'FLASHCARD' && (
                            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                              {flashcardsLoading ? (
                                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                                  <Loader2 className="animate-spin" size={28} style={{ margin: '0 auto 8px' }} />
                                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Đang chuẩn bị thẻ Flashcard...</div>
                                </div>
                              ) : activeFlashcards.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                  Bộ từ vựng này hiện chưa có thẻ flashcard nào để học.
                                </div>
                              ) : isSessionFinished ? (
                                <div
                                  style={{
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    backgroundColor: '#ffffff',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1.5px solid var(--border-card)',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      borderRadius: '50%',
                                      backgroundColor: '#ecfdf5',
                                      color: '#10b981',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      margin: '0 auto 12px',
                                    }}
                                  >
                                    <Sparkles size={30} />
                                  </div>
                                  <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>
                                    Chúc mừng bạn đã hoàn thành lượt học!
                                  </h4>
                                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0 0 22px' }}>
                                    Bạn đã lật và kiểm tra toàn bộ {activeFlashcards.length} thẻ từ trong bộ từ vựng này.
                                  </p>

                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
                                    <div style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669' }}>{sessionRememberedCount}</div>
                                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857' }}>Đã ghi nhớ</div>
                                    </div>
                                    <div style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                                      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626' }}>{sessionForgottenCount}</div>
                                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b91c1c' }}>Cần ôn lại</div>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <button
                                      type="button"
                                      onClick={() => loadFlashcardsForSet(vs.id, false)}
                                      className="btn-gamified btn-primary"
                                      style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                                    >
                                      <RotateCcw size={15} />
                                      <span>Học lại toàn bộ</span>
                                    </button>
                                    {sessionForgottenCount > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => loadFlashcardsForSet(vs.id, true)}
                                        className="btn-gamified"
                                        style={{ padding: '9px 18px', fontSize: '0.85rem', backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fca5a5' }}
                                      >
                                        <RotateCcw size={15} />
                                        <span>Chỉ ôn từ chưa nhớ ({sessionForgottenCount})</span>
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleSwitchMode(vs.id, 'LIST')}
                                      className="btn-gamified"
                                      style={{ padding: '9px 18px', fontSize: '0.85rem', backgroundColor: '#f1f5f9', color: 'var(--text-main)', borderColor: '#e2e8f0' }}
                                    >
                                      <BookOpen size={15} />
                                      <span>Xem danh sách từ</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  {/* Progress bar */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                    <span>Thẻ {flashcardIndex + 1} / {activeFlashcards.length}</span>
                                    <span>{Math.round(((flashcardIndex + 1) / activeFlashcards.length) * 100)}% hoàn thành</span>
                                  </div>
                                  <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '16px' }}>
                                    <div
                                      style={{
                                        height: '100%',
                                        width: `${((flashcardIndex + 1) / activeFlashcards.length) * 100}%`,
                                        backgroundColor: 'var(--primary)',
                                        borderRadius: 'var(--radius-full)',
                                        transition: 'width 0.3s ease',
                                      }}
                                    />
                                  </div>

                                  {/* The Card */}
                                  {(() => {
                                    const card = activeFlashcards[flashcardIndex]
                                    if (!card) return null

                                    return (
                                      <div>
                                        <div
                                          onClick={() => setIsFlipped(!isFlipped)}
                                          style={{
                                            minHeight: '230px',
                                            backgroundColor: '#ffffff',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '2px solid var(--border-card)',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.06)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '28px',
                                            position: 'relative',
                                            transition: 'all 0.25s ease',
                                            userSelect: 'none',
                                          }}
                                        >
                                          {/* Audio button inside card if audioUrl exists */}
                                          {card.audioUrl && (
                                            <button
                                              type="button"
                                              onClick={(e) => handlePlayAudio(e, card)}
                                              title="Phát âm từ vựng"
                                              style={{
                                                position: 'absolute',
                                                top: '14px',
                                                right: '14px',
                                                padding: '8px',
                                                borderRadius: '50%',
                                                border: '1px solid var(--border-card)',
                                                backgroundColor: playingVocabId === card.id ? 'var(--primary-light)' : '#f8fafc',
                                                color: playingVocabId === card.id ? 'var(--primary)' : 'var(--text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              <Volume2 size={18} />
                                            </button>
                                          )}

                                          {!isFlipped ? (
                                            // Front Face
                                            <div style={{ textAlign: 'center' }}>
                                              <div className="hanzi" style={{ fontSize: '3.6rem', fontWeight: 900, color: 'var(--text-chinese)', marginBottom: '12px' }}>
                                                {card.hanzi}
                                              </div>
                                              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                <RotateCw size={14} />
                                                <span>Nhấn vào thẻ hoặc nút &ldquo;Lật thẻ&rdquo; để xem nghĩa & pinyin</span>
                                              </div>
                                            </div>
                                          ) : (
                                            // Back Face
                                            <div style={{ textAlign: 'center', width: '100%' }}>
                                              <div className="hanzi" style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-chinese)', marginBottom: '4px' }}>
                                                {card.hanzi}
                                              </div>
                                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
                                                {card.pinyin}
                                              </div>
                                              <div style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                                                {card.meaning}
                                              </div>
                                              {card.partOfSpeech && (
                                                <span
                                                  style={{
                                                    display: 'inline-block',
                                                    fontSize: '0.74rem',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: 'var(--radius-sm)',
                                                    backgroundColor: '#f1f5f9',
                                                    color: 'var(--text-muted)',
                                                    marginBottom: '8px',
                                                  }}
                                                >
                                                  {card.partOfSpeech}
                                                </span>
                                              )}
                                              {card.exampleSentence && (
                                                <div
                                                  style={{
                                                    marginTop: '10px',
                                                    padding: '10px 14px',
                                                    borderRadius: 'var(--radius-md)',
                                                    backgroundColor: '#f8fafc',
                                                    border: '1px solid var(--border-card)',
                                                    fontSize: '0.82rem',
                                                    textAlign: 'left',
                                                  }}
                                                >
                                                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{card.exampleSentence}</div>
                                                  {card.examplePinyin && <div style={{ fontSize: '0.76rem', color: 'var(--primary)', marginTop: '2px' }}>{card.examplePinyin}</div>}
                                                  {card.exampleMeaning && <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '2px' }}>{card.exampleMeaning}</div>}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        {/* Action Review Buttons */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                                          <button
                                            type="button"
                                            onClick={() => handleReviewFlashcardCard('FORGOTTEN')}
                                            disabled={isSubmittingReview}
                                            className="btn-gamified"
                                            style={{
                                              padding: '10px 20px',
                                              fontSize: '0.88rem',
                                              fontWeight: 800,
                                              backgroundColor: '#fef2f2',
                                              color: '#dc2626',
                                              borderColor: '#fca5a5',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '6px',
                                            }}
                                          >
                                            <X size={16} />
                                            <span>Chưa nhớ</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => setIsFlipped(!isFlipped)}
                                            className="btn-gamified"
                                            style={{
                                              padding: '10px 20px',
                                              fontSize: '0.88rem',
                                              fontWeight: 800,
                                              backgroundColor: '#f1f5f9',
                                              color: 'var(--text-main)',
                                              borderColor: '#cbd5e1',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '6px',
                                            }}
                                          >
                                            <RotateCw size={16} />
                                            <span>Lật thẻ</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => handleReviewFlashcardCard('REMEMBERED')}
                                            disabled={isSubmittingReview}
                                            className="btn-gamified"
                                            style={{
                                              padding: '10px 20px',
                                              fontSize: '0.88rem',
                                              fontWeight: 800,
                                              backgroundColor: '#ecfdf5',
                                              color: '#059669',
                                              borderColor: '#6ee7b7',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '6px',
                                            }}
                                          >
                                            <Check size={16} />
                                            <span>Đã nhớ</span>
                                          </button>
                                        </div>

                                        {/* Navigation arrows */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', padding: '0 4px' }}>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsFlipped(false)
                                              setFlashcardIndex((prev) => Math.max(0, prev - 1))
                                            }}
                                            disabled={flashcardIndex === 0}
                                            style={{
                                              border: 'none',
                                              background: 'none',
                                              fontSize: '0.82rem',
                                              fontWeight: 700,
                                              color: flashcardIndex === 0 ? '#cbd5e1' : 'var(--primary)',
                                              cursor: flashcardIndex === 0 ? 'default' : 'pointer',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                            }}
                                          >
                                            <ChevronLeft size={16} />
                                            <span>Thẻ trước</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsFlipped(false)
                                              setFlashcardIndex((prev) => Math.min(activeFlashcards.length - 1, prev + 1))
                                            }}
                                            disabled={flashcardIndex === activeFlashcards.length - 1}
                                            style={{
                                              border: 'none',
                                              background: 'none',
                                              fontSize: '0.82rem',
                                              fontWeight: 700,
                                              color: flashcardIndex === activeFlashcards.length - 1 ? '#cbd5e1' : 'var(--primary)',
                                              cursor: flashcardIndex === activeFlashcards.length - 1 ? 'default' : 'pointer',
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '4px',
                                            }}
                                          >
                                            <span>Thẻ sau</span>
                                            <ChevronRight size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Removed Members */}
        {activeTab === 'REMOVED' && (
          <div className="game-card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
            {removedMembers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                Không có học viên nào bị xóa hoặc rời khỏi lớp.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {removedMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {member.studentName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {member.studentEmail} · Trạng thái: {member.status === 'LEFT' ? 'Tự rời lớp' : 'Đã bị khai trừ'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRestoreStudent(member.studentId)}
                      disabled={actionLoading === member.studentId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--primary)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <RotateCcw size={14} />
                      <span>Khôi phục lại</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inline Remove Confirmation Dialog (clean inline card, NOT a pop-up modal!) */}
        {removingStudent && (
          <div
            className="game-card"
            style={{
              marginTop: '20px',
              padding: '24px',
              backgroundColor: '#fff1f2',
              border: '2px solid #fecdd3',
            }}
          >
            <h4 style={{ color: '#991b1b', margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 800 }}>
              Xác nhận khai trừ học sinh khỏi lớp
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '16px' }}>
              Bạn đang thực hiện khai trừ học sinh <strong>{removingStudent.studentName}</strong> ({removingStudent.studentEmail}).
              Vui lòng nhập lý do để ghi nhận vào hệ thống:
            </p>

            <input
              type="text"
              placeholder="Ví dụ: Nghỉ học nhiều buổi không phép..."
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              className="game-input"
              style={{ width: '100%', boxSizing: 'border-box', marginBottom: '16px', backgroundColor: '#ffffff' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRemovingStudent(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-card)',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleRemoveStudentConfirm}
                disabled={actionLoading === removingStudent.studentId || !removeReason.trim()}
                className="btn-danger"
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {actionLoading === removingStudent.studentId ? 'Đang xử lý...' : 'Xác nhận khai trừ'}
              </button>
            </div>
          </div>
        )}

        {/* Audio Error Toast */}
        {audioError && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              padding: '12px 18px',
              backgroundColor: '#fef2f2',
              border: '1.5px solid #fca5a5',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span>{audioError}</span>
            <button
              type="button"
              onClick={() => setAudioError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#b91c1c',
                cursor: 'pointer',
                padding: '2px',
                marginLeft: '4px',
              }}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
