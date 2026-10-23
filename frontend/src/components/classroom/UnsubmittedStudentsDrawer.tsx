import React, { useState, useEffect, useMemo } from 'react'
import {
  X,
  AlertCircle,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Search,
  RefreshCw,
  UserX,
  Users,
  CalendarClock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getUnsubmittedStudents,
  type UnsubmittedStudentsResponse,
} from '../../api/progress'
import { ApiError } from '../../api/auth'

interface UnsubmittedStudentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  assignmentId: number | null
  assignmentTitle?: string
  classId?: number
}

type TabType = 'UNSUBMITTED' | 'LATE'

export const UnsubmittedStudentsDrawer: React.FC<UnsubmittedStudentsDrawerProps> = ({
  isOpen,
  onClose,
  assignmentId,
  assignmentTitle,
}) => {
  const { user } = useAuth()

  const [data, setData] = useState<UnsubmittedStudentsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<TabType>('UNSUBMITTED')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [copied, setCopied] = useState<boolean>(false)

  // Fetch unsubmitted students
  const fetchData = async () => {
    if (!isOpen || !assignmentId || !user?.token) return
    try {
      setLoading(true)
      setError(null)
      const res = await getUnsubmittedStudents(user.token, assignmentId)
      setData(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải danh sách học sinh chưa nộp bài.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && assignmentId) {
      fetchData()
      setSearchQuery('')
      setActiveTab('UNSUBMITTED')
      setCopied(false)
    }
  }, [isOpen, assignmentId, user?.token])

  // Filtered Unsubmitted list
  const filteredUnsubmitted = useMemo(() => {
    if (!data?.unsubmittedStudents) return []
    if (!searchQuery.trim()) return data.unsubmittedStudents
    const q = searchQuery.toLowerCase().trim()
    return data.unsubmittedStudents.filter(
      (st) => st.fullName.toLowerCase().includes(q) || st.email.toLowerCase().includes(q)
    )
  }, [data?.unsubmittedStudents, searchQuery])

  // Filtered Late list
  const filteredLate = useMemo(() => {
    if (!data?.lateSubmissions) return []
    if (!searchQuery.trim()) return data.lateSubmissions
    const q = searchQuery.toLowerCase().trim()
    return data.lateSubmissions.filter(
      (st) => st.fullName.toLowerCase().includes(q) || st.email.toLowerCase().includes(q)
    )
  }, [data?.lateSubmissions, searchQuery])

  // Copy email list
  const handleCopyEmails = () => {
    if (!data?.unsubmittedStudents || data.unsubmittedStudents.length === 0) return
    const emails = data.unsubmittedStudents.map((st) => st.email).join(', ')
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (!isOpen) {
    return null
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Không có hạn'
    try {
      const d = new Date(dateStr)
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Đóng bảng danh sách chưa nộp"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 998,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* Slide-over Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '520px',
          maxWidth: '92vw',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.15)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-card)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: '#f8fafc',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}
            >
              <UserX size={15} />
              <span>Tiến độ nộp bài</span>
            </div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--text-main)',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {data?.assignmentTitle || assignmentTitle || 'Danh sách học sinh'}
            </h3>
            {data?.className && (
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Lớp: <strong style={{ color: 'var(--text-main)' }}>{data.className}</strong>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sub-Header Stats & Tab Bar */}
        <div style={{ padding: '16px 24px 0', backgroundColor: '#ffffff' }}>
          {/* Ratio bar */}
          {data && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f1f5f9',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Sĩ số lớp: <strong>{data.totalStudents}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.84rem' }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>
                  {data.submittedCount}/{data.totalStudents} đã nộp
                </span>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>
                  {data.unsubmittedCount} chưa nộp
                </span>
              </div>
            </div>
          )}

          {/* Tab buttons */}
          <div
            style={{
              display: 'flex',
              borderBottom: '2px solid #e2e8f0',
              gap: '20px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('UNSUBMITTED')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 4px',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: activeTab === 'UNSUBMITTED' ? '#dc2626' : 'var(--text-muted)',
                borderBottom: activeTab === 'UNSUBMITTED' ? '3px solid #dc2626' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <UserX size={16} />
              <span>Chưa nộp bài ({data?.unsubmittedCount || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('LATE')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 4px',
                fontSize: '0.9rem',
                fontWeight: 800,
                color: activeTab === 'LATE' ? '#d97706' : 'var(--text-muted)',
                borderBottom: activeTab === 'LATE' ? '3px solid #d97706' : '3px solid transparent',
                marginBottom: '-2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <Clock size={16} />
              <span>Nộp trễ ({data?.lateSubmittedCount || 0})</span>
            </button>
          </div>
        </div>

        {/* Search & Actions Toolbar */}
        <div
          style={{
            padding: '14px 24px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
              }}
            />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-card)',
                fontSize: '0.84rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {activeTab === 'UNSUBMITTED' && data?.unsubmittedStudents && data.unsubmittedStudents.length > 0 && (
            <button
              type="button"
              onClick={handleCopyEmails}
              title="Sao chép toàn bộ email để gửi thư nhắc nhở"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #cbd5e1',
                backgroundColor: copied ? '#ecfdf5' : '#ffffff',
                color: copied ? '#047857' : 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
              <span>{copied ? 'Đã chép email' : 'Chép email'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={fetchData}
            title="Làm mới"
            style={{
              padding: '7px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
          }}
        >
          {loading && !data && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <RefreshCw size={24} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Đang tải danh sách...</div>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {data && activeTab === 'UNSUBMITTED' && (
            <>
              {/* TC-04: Empty state - 100% submitted */}
              {data.unsubmittedCount === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '36px 24px',
                    textAlign: 'center',
                    border: '1px solid #d1fae5',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 14px',
                    }}
                  >
                    <CheckCircle2 size={32} color="#059669" />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#047857', marginBottom: '8px' }}>
                    Tất cả học sinh đã nộp bài!
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                    100% học sinh ({data.totalStudents}/{data.totalStudents}) trong lớp đã hoàn thành và nộp bài tập này.
                  </p>
                </div>
              ) : filteredUnsubmitted.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '30px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  <Search size={28} style={{ margin: '0 auto 8px', color: '#cbd5e1' }} />
                  <div>Không tìm thấy học sinh phù hợp với từ khóa "{searchQuery}"</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredUnsubmitted.map((student) => {
                    const initials = student.fullName
                      ? student.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(-2)
                          .join('')
                          .toUpperCase()
                      : 'HS'

                    return (
                      <div
                        key={student.studentId}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 16px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        {/* Student avatar & info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: student.isOverdue ? '#fee2e2' : '#eff6ff',
                              color: student.isOverdue ? '#b91c1c' : '#2563eb',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                color: 'var(--text-main)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {student.fullName}
                            </div>
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {student.email}
                            </div>

                            {/* Extension indicator */}
                            {student.isExtended && student.effectiveDueTime && (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '0.74rem',
                                  color: '#7c3aed',
                                  fontWeight: 700,
                                  marginTop: '4px',
                                }}
                              >
                                <CalendarClock size={12} />
                                <span>Gia hạn đến: {formatDateTime(student.effectiveDueTime)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status Badge (TC-03) */}
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          {student.isOverdue ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 9px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                              }}
                            >
                              <AlertCircle size={12} />
                              Quá hạn
                            </span>
                          ) : (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 9px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                backgroundColor: '#fef3c7',
                                color: '#b45309',
                              }}
                            >
                              <Clock size={12} />
                              Chưa đến hạn
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {data && activeTab === 'LATE' && (
            <>
              {data.lateSubmittedCount === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '36px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  <CheckCircle2 size={32} style={{ margin: '0 auto 8px', color: '#059669' }} />
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    Không có bài nộp trễ
                  </div>
                  <div>Tất cả học sinh đã nộp đều nộp trước hoặc đúng hạn quy định.</div>
                </div>
              ) : filteredLate.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '30px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                  }}
                >
                  <Search size={28} style={{ margin: '0 auto 8px', color: '#cbd5e1' }} />
                  <div>Không tìm thấy học sinh phù hợp với từ khóa "{searchQuery}"</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredLate.map((sub) => {
                    const initials = sub.fullName
                      ? sub.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(-2)
                          .join('')
                          .toUpperCase()
                      : 'HS'

                    return (
                      <div
                        key={sub.submissionId}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px 16px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        {/* Student avatar & info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: '#fffbeb',
                              color: '#b45309',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                color: 'var(--text-main)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {sub.fullName}
                            </div>
                            <div
                              style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {sub.email}
                            </div>

                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.74rem',
                                color: 'var(--text-muted)',
                                marginTop: '4px',
                              }}
                            >
                              <Clock size={12} />
                              <span>Nộp lúc: {formatDateTime(sub.submittedAt)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badges (TC-02) */}
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 9px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              backgroundColor: '#fff1f2',
                              color: '#e11d48',
                              marginBottom: sub.isExtended ? '4px' : '0',
                            }}
                          >
                            <Clock size={12} />
                            Nộp trễ
                          </span>

                          {sub.isExtended && (
                            <div>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '2px 7px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.7rem',
                                  fontWeight: 700,
                                  backgroundColor: '#f5f3ff',
                                  color: '#7c3aed',
                                }}
                              >
                                Có gia hạn
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-card)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            Đóng
          </button>
        </div>
      </aside>
    </>
  )
}
