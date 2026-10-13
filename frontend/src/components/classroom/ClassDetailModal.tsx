import React, { useState, useEffect } from 'react'
import {
  X,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Archive,
  UserMinus,
  RotateCcw,
  LogOut,
} from 'lucide-react'
import {
  getClassMembers,
  removeStudent,
  restoreStudent,
  archiveClass,
  leaveClass,
  type ClassItem,
  type ClassMemberItem,
} from '../../api/classroom'
import { ApiError } from '../../api/auth'

interface ClassDetailModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  classroom: ClassItem | null
  isTeacher: boolean
  onClassUpdated?: () => void
}

export const ClassDetailModal: React.FC<ClassDetailModalProps> = ({
  isOpen,
  onClose,
  token,
  classroom,
  isTeacher,
  onClassUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'REMOVED'>('MEMBERS')
  const [members, setMembers] = useState<ClassMemberItem[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Remove student prompt
  const [removingStudent, setRemovingStudent] = useState<ClassMemberItem | null>(null)
  const [removeReason, setRemoveReason] = useState('')

  const loadMembers = async () => {
    if (!classroom) return
    try {
      setLoading(true)
      setError(null)
      const data = await getClassMembers(classroom.id, token)
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

  useEffect(() => {
    if (isOpen && classroom && isTeacher) {
      loadMembers()
    }
  }, [isOpen, classroom, isTeacher])

  if (!isOpen || !classroom) return null

  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.joinCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleArchive = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn lưu trữ lớp học này? Sau khi lưu trữ, học sinh sẽ không thể nộp bài hoặc tham gia mới.')) {
      return
    }
    try {
      setLoading(true)
      await archiveClass(classroom.id, token)
      onClassUpdated?.()
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn rời khỏi lớp học này? Điểm số và tiến độ học trước đây của bạn vẫn được bảo lưu.')) {
      return
    }
    try {
      setLoading(true)
      await leaveClass(classroom.id, token)
      onClassUpdated?.()
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveConfirm = async () => {
    if (!removingStudent) return
    try {
      setActionLoading(removingStudent.studentId)
      await removeStudent(classroom.id, removingStudent.studentId, removeReason || 'Xóa bởi giáo viên', token)
      setRemovingStudent(null)
      setRemoveReason('')
      await loadMembers()
      onClassUpdated?.()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestore = async (studentId: number) => {
    try {
      setActionLoading(studentId)
      await restoreStudent(classroom.id, studentId, token)
      await loadMembers()
      onClassUpdated?.()
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const activeMembers = members.filter((m) => m.status === 'ACTIVE')
  const removedMembers = members.filter((m) => m.status === 'REMOVED' || m.status === 'LEFT')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        className="game-card animate-pop"
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          position: 'relative',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--text-muted)',
          }}
        >
          <X size={20} />
        </button>

        {/* Class Header */}
        <div style={{ marginBottom: '20px', paddingRight: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {classroom.title}
            </h2>
            {classroom.status === 'ARCHIVED' && (
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#fee2e2',
                  color: '#b91c1c',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                Đã lưu trữ
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {classroom.description || 'Không có mô tả chi tiết'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
            {/* Join Code Box */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: '#f8fafc',
                border: '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mã mời:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1rem', color: 'var(--primary)', letterSpacing: '1px' }}>
                {classroom.joinCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Sao chép mã"
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: copied ? 'var(--jade-green)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Giáo viên: <strong>{classroom.teacherName}</strong>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Sĩ số: <strong>{classroom.memberCount}</strong> học sinh
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Member management (for Teacher) */}
        {isTeacher ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid var(--border-card)', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('MEMBERS')}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'MEMBERS' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: activeTab === 'MEMBERS' ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                Đang học ({activeMembers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('REMOVED')}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  borderBottom: activeTab === 'REMOVED' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: activeTab === 'REMOVED' ? 'var(--primary)' : 'var(--text-muted)',
                }}
              >
                Đã rời / Bị xóa ({removedMembers.length})
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', minHeight: '180px' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  <Loader2 size={24} className="spin" style={{ margin: '0 auto 8px', color: 'var(--primary)' }} />
                  <span>Đang tải danh sách học sinh...</span>
                </div>
              ) : activeTab === 'MEMBERS' ? (
                activeMembers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Chưa có học sinh nào tham gia lớp học này
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeMembers.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: '#f8fafc',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid #f1f5f9',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--primary-light)',
                              color: 'var(--primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                            }}
                          >
                            {m.studentName ? m.studentName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                              {m.studentName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {m.studentEmail}
                            </div>
                          </div>
                        </div>

                        {classroom.status !== 'ARCHIVED' && (
                          <button
                            type="button"
                            onClick={() => setRemovingStudent(m)}
                            disabled={actionLoading === m.studentId}
                            title="Xóa học sinh khỏi lớp"
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #fecaca',
                              backgroundColor: '#fff1f2',
                              color: '#e11d48',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <UserMinus size={13} />
                            Xóa
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : (
                removedMembers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Không có học sinh nào bị xóa hoặc rời lớp
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {removedMembers.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: '#f8fafc',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid #f1f5f9',
                          opacity: 0.85,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                            {m.studentName}
                            <span style={{ fontSize: '0.72rem', color: '#b91c1c', marginLeft: '6px' }}>
                              ({m.status === 'REMOVED' ? 'Bị xóa' : 'Đã rời lớp'})
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {m.studentEmail}
                          </div>
                        </div>

                        {classroom.status !== 'ARCHIVED' && (
                          <button
                            type="button"
                            onClick={() => handleRestore(m.studentId)}
                            disabled={actionLoading === m.studentId}
                            title="Khôi phục vào lớp"
                            style={{
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid #bbf7d0',
                              backgroundColor: '#f0fdf4',
                              color: '#16a34a',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {actionLoading === m.studentId ? <Loader2 size={13} className="spin" /> : <RotateCcw size={13} />}
                            Khôi phục
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          /* Student View Content */
          <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <p>
              Bạn đang là học sinh của lớp <strong>{classroom.title}</strong>. Mọi bài tập và thông báo từ giáo viên sẽ được hiển thị trên bảng điều khiển.
            </p>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
          <div>
            {isTeacher && classroom.status === 'ACTIVE' && (
              <button
                type="button"
                onClick={handleArchive}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  color: '#e11d48',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Archive size={15} />
                Lưu trữ lớp
              </button>
            )}

            {!isTeacher && (
              <button
                type="button"
                onClick={handleLeave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: '#fff1f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  color: '#e11d48',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <LogOut size={15} />
                Rời lớp
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#f1f5f9',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
        </div>

        {/* Prompt remove student */}
        {removingStudent && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <h3 style={{ margin: '0 0 8px', color: '#b91c1c', fontSize: '1.15rem', fontWeight: 800 }}>
              Xác nhận xóa học sinh khỏi lớp
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Bạn có chắc chắn muốn xóa học sinh <strong>{removingStudent.studentName}</strong>? Lịch sử và kết quả học trước đây vẫn được lưu trữ và có thể khôi phục sau.
            </p>

            <input
              type="text"
              placeholder="Nhập lý do xóa (ví dụ: Vi phạm quy định...)"
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              className="game-input"
              style={{ width: '100%', marginBottom: '16px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRemovingStudent(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-card)',
                  background: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRemoveConfirm}
                disabled={actionLoading !== null}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: '#e11d48',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {actionLoading !== null && <Loader2 size={14} className="spin" />}
                Xác nhận xóa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
