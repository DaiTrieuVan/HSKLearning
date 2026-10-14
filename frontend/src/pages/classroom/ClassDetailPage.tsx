import React, { useState, useEffect } from 'react'
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
import { ApiError } from '../../api/auth'

export const ClassDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [classroom, setClassroom] = useState<ClassItem | null>(null)
  const [classLoading, setClassLoading] = useState(true)

  const isTeacher = user?.activeMode === 'TEACHER'

  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'REMOVED' | 'VOCAB_SETS'>(
    isTeacher ? 'MEMBERS' : 'VOCAB_SETS'
  )
  const [members, setMembers] = useState<ClassMemberItem[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Vocab Sets state
  const [classVocabSets, setClassVocabSets] = useState<VocabSetItem[]>([])
  const [vocabSetsLoading, setVocabSetsLoading] = useState(false)
  const [expandedSetId, setExpandedSetId] = useState<number | null>(null)
  const [expandedWords, setExpandedWords] = useState<Record<number, VocabularyItem[]>>({})
  const [wordsLoadingId, setWordsLoadingId] = useState<number | null>(null)

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
      } else {
        loadMembers()
      }
    }
  }, [classroom, activeTab])

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

  const handleToggleExpandSet = async (setId: number) => {
    if (!user) return
    if (expandedSetId === setId) {
      setExpandedSetId(null)
      return
    }

    setExpandedSetId(setId)
    if (!expandedWords[setId]) {
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {classVocabSets.map((vs) => {
                  const isExpanded = expandedSetId === vs.id
                  const words = expandedWords[vs.id] || []
                  const isLoadingWords = wordsLoadingId === vs.id

                  return (
                    <div
                      key={vs.id}
                      style={{
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid var(--border-card)',
                        backgroundColor: '#f8fafc',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        onClick={() => handleToggleExpandSet(vs.id)}
                        style={{
                          padding: '14px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <BookMarked size={18} style={{ color: 'var(--primary)' }} />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                              {vs.title}
                            </div>
                            {vs.description && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {vs.description}
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                            }}
                          >
                            {vs.itemCount} từ
                          </span>
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding: '16px', borderTop: '1px solid var(--border-card)', backgroundColor: '#f8fafc' }}>
                          {isLoadingWords ? (
                            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                              Đang tải danh sách từ vựng...
                            </div>
                          ) : words.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                              Bộ từ vựng này hiện chưa có từ nào.
                            </div>
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
                              {words.map((w) => (
                                <div
                                  key={w.id}
                                  style={{
                                    padding: '12px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid var(--border-card)',
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <span className="hanzi" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-chinese)' }}>
                                      {w.hanzi}
                                    </span>
                                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>
                                      {w.pinyin}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '4px' }}>
                                    {w.meaning}
                                  </div>
                                  {w.exampleSentence && (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                                      &ldquo;{w.exampleSentence}&rdquo;
                                    </div>
                                  )}
                                </div>
                              ))}
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
      </div>
    </div>
  )
}
