import React from 'react'
import {
  X,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Edit3,
  ChevronRight,
  FileText,
  UserCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CellGradeItem, StudentGradeRowItem, AssignmentColumnHeaderItem } from '../../api/progress'

interface GradebookAttemptDrawerProps {
  isOpen: boolean
  onClose: () => void
  classId: number
  student: StudentGradeRowItem | null
  assignment: AssignmentColumnHeaderItem | null
  grade: CellGradeItem | null
}

export const GradebookAttemptDrawer: React.FC<GradebookAttemptDrawerProps> = ({
  isOpen,
  onClose,
  classId,
  student,
  assignment,
  grade,
}) => {
  const navigate = useNavigate()

  if (!isOpen || !student || !assignment || !grade) {
    return null
  }

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return 'Chưa rõ'
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

  const handleOpenSubmissionDetail = (submissionId: number) => {
    navigate(`/classes/${classId}/assignments/${assignment.assignmentId}/submissions/${submissionId}`)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Đóng bảng chi tiết"
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
          width: '460px',
          maxWidth: '92vw',
          backgroundColor: '#ffffff',
          boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.15)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drawer Header */}
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
                letterSpacing: '0.04em',
                marginBottom: '4px',
              }}
            >
              <FileText size={14} />
              <span>Chi tiết kết quả làm bài</span>
            </div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                margin: 0,
                lineHeight: 1.3,
              }}
            >
              {student.fullName}
            </h3>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {assignment.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Summary Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: grade.hasSubmitted ? '#f0fdf4' : '#f8fafc',
              border: `1.5px solid ${grade.hasSubmitted ? '#bbf7d0' : '#e2e8f0'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: grade.hasSubmitted ? '#166534' : '#64748b',
                  textTransform: 'uppercase',
                }}
              >
                Điểm cao nhất (Ghi nhận)
              </div>
              <div
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: grade.hasSubmitted ? '#15803d' : '#94a3b8',
                  lineHeight: 1.2,
                  marginTop: '2px',
                }}
              >
                {grade.hasSubmitted && grade.bestScore !== null ? (
                  <>
                    <span>{grade.bestScore}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '4px' }}>
                      / {grade.totalPoints}
                    </span>
                  </>
                ) : (
                  <span>Chưa nộp</span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              {grade.hasSubmitted && grade.isAdjusted && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    color: '#92400e',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                  }}
                >
                  <Edit3 size={12} />
                  <span>Đã điều chỉnh điểm</span>
                </span>
              )}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tổng số lượt làm: <strong>{grade.totalAttempts}</strong>
              </div>
            </div>
          </div>

          {/* Attempts List */}
          <div>
            <h4
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Clock size={16} style={{ color: 'var(--primary)' }} />
              <span>Lịch sử các lượt làm bài ({grade.attempts.length})</span>
            </h4>

            {grade.attempts.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                }}
              >
                <AlertCircle size={24} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
                <span>Học sinh chưa thực hiện lượt làm bài nào.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {grade.attempts.map((attempt) => (
                  <div
                    key={attempt.submissionId}
                    style={{
                      border: attempt.isBestAttempt ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      backgroundColor: attempt.isBestAttempt ? '#f0f9ff' : '#ffffff',
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative',
                    }}
                  >
                    {/* Header of attempt */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#e2e8f0',
                            color: '#334155',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                          }}
                        >
                          Lượt {attempt.attemptNumber}
                        </span>

                        {attempt.isBestAttempt && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: '#dbeafe',
                              color: '#1d4ed8',
                              fontSize: '0.74rem',
                              fontWeight: 800,
                            }}
                          >
                            <Award size={12} />
                            <span>Điểm cao nhất</span>
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#15803d',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>Đã nộp</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: '#d97706',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                            }}
                          >
                            <Clock size={13} />
                            <span>Đang làm dở</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scores row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Điểm gốc: </span>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>
                          {attempt.score !== null ? attempt.score : '-'}
                        </strong>
                      </div>

                      {attempt.adjustedScore !== null && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: '#92400e' }}>Điểm sửa: </span>
                          <strong style={{ fontSize: '1.05rem', color: '#b45309' }}>
                            {attempt.adjustedScore}
                          </strong>
                        </div>
                      )}

                      <div style={{ marginLeft: 'auto' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Điểm hiệu lực: </span>
                        <strong
                          style={{
                            fontSize: '1.15rem',
                            color: attempt.isBestAttempt ? 'var(--primary)' : '#0f172a',
                            fontWeight: 900,
                          }}
                        >
                          {attempt.effectiveScore !== null ? attempt.effectiveScore : '-'}
                        </strong>
                      </div>
                    </div>

                    {/* Adjusted reason and teacher info if adjusted */}
                    {attempt.adjustedScore !== null && (
                      <div
                        style={{
                          backgroundColor: '#fffbeb',
                          border: '1px solid #fef3c7',
                          borderRadius: 'var(--radius-sm)',
                          padding: '10px 12px',
                          fontSize: '0.82rem',
                          color: '#78350f',
                          marginBottom: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                          <UserCheck size={14} />
                          <span>Người điều chỉnh: {attempt.adjustedByName || 'Giáo viên phụ trách'}</span>
                        </div>
                        {attempt.adjustReason && (
                          <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
                            Lý do: &ldquo;{attempt.adjustReason}&rdquo;
                          </div>
                        )}
                        {attempt.adjustedAt && (
                          <div style={{ marginTop: '2px', fontSize: '0.74rem', color: '#92400e' }}>
                            Thời gian sửa: {formatDateTime(attempt.adjustedAt)}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer submission time & view button */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        paddingTop: '8px',
                        borderTop: '1px dashed #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        <span>Nộp lúc: {formatDateTime(attempt.submittedAt)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenSubmissionDetail(attempt.submissionId)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: '2px 4px',
                        }}
                      >
                        <span>Chi tiết bài nộp</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-card)',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn-gamified"
            style={{
              padding: '8px 20px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: '#f1f5f9',
              color: 'var(--text-main)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
        </div>
      </aside>
    </>
  )
}
