import React, { useState, useEffect } from 'react'
import {
  Users,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  RefreshCw,
  X,
  Award,
  FileText,
  AlertCircle,
} from 'lucide-react'
import {
  getAssignmentSubmissionsOverview,
  getSubmissionResultById,
  type AssignmentSubmissionsOverviewData,
  type StudentSubmissionSummary,
  type SubmissionResultData,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'

interface AssignmentSubmissionsPanelProps {
  assignmentId: number
  token: string
  onClose?: () => void
  onAdjustScore?: (student: StudentSubmissionSummary) => void
  onGrantOverride?: (student: StudentSubmissionSummary) => void
}

export const AssignmentSubmissionsPanel: React.FC<AssignmentSubmissionsPanelProps> = ({
  assignmentId,
  token,
  onClose,
  onAdjustScore,
  onGrantOverride,
}) => {
  const [data, setData] = useState<AssignmentSubmissionsOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chi tiết bài làm của từng học sinh (inline accordion/drawer)
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null)
  const [loadingDetailStudentId, setLoadingDetailStudentId] = useState<number | null>(null)
  const [studentDetails, setStudentDetails] = useState<Record<number, SubmissionResultData>>({})
  const [detailErrors, setDetailErrors] = useState<Record<number, string>>({})

  const loadOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getAssignmentSubmissionsOverview(assignmentId, token)
      setData(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải danh sách bài nộp của bài tập.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverview()
  }, [assignmentId])

  const toggleStudentDetail = async (student: StudentSubmissionSummary) => {
    if (expandedStudentId === student.studentId) {
      setExpandedStudentId(null)
      return
    }

    setExpandedStudentId(student.studentId)

    if (!student.submissionId) return

    // Nếu đã tải chi tiết rồi thì không cần gọi lại
    if (studentDetails[student.submissionId]) return

    try {
      setLoadingDetailStudentId(student.studentId)
      const detail = await getSubmissionResultById(student.submissionId, token)
      setStudentDetails((prev) => ({ ...prev, [student.submissionId!]: detail }))
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Không thể tải chi tiết bài làm của học sinh.'
      setDetailErrors((prev) => ({ ...prev, [student.studentId]: msg }))
    } finally {
      setLoadingDetailStudentId(null)
    }
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#ecfdf5',
              color: '#047857',
              border: '1px solid #a7f3d0',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={12} />
            Đã nộp
          </span>
        )
      case 'AUTO_SUBMITTED':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <Clock size={12} />
            Hệ thống tự nộp
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            <Clock size={12} />
            Đang làm bài
          </span>
        )
      case 'NOT_STARTED':
      default:
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            Chưa bắt đầu
          </span>
        )
    }
  }

  return (
    <div
      id={`assignment-submissions-panel-${assignmentId}`}
      style={{
        marginTop: '16px',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: '#f8fafc',
        border: '1.5px solid #e2e8f0',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} style={{ color: 'var(--primary)' }} />
          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Theo dõi nộp bài & Kết quả học sinh
          </h4>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={loadOverview}
            disabled={loading}
            title="Tải lại danh sách bài nộp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Đóng bảng theo dõi"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px', display: 'block' }} />
          <span>Đang tải danh sách bài nộp của lớp...</span>
        </div>
      ) : error ? (
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : data ? (
        <div>
          {/* Summary Stat Badges (QTN-09, QTN-10) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Users size={20} style={{ color: 'var(--text-muted)' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tổng học sinh</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {data.totalStudents}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={20} style={{ color: '#059669' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#047857' }}>Đã nộp bài</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}>
                  {data.submittedCount}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Clock size={20} style={{ color: '#d97706' }} />
              <div>
                <div style={{ fontSize: '0.72rem', color: '#b45309' }}>Đang làm</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b45309' }}>
                  {data.inProgressCount}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Chưa nộp</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  {data.notStartedCount}
                </div>
              </div>
            </div>
          </div>

          {/* Submissions List */}
          {data.students.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '24px',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
              }}
            >
              Lớp học hiện chưa có học sinh nào.
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Học sinh</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Trạng thái</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Lượt</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Thời gian nộp</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Điểm số</th>
                    <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.students.map((st) => {
                    const isExpanded = expandedStudentId === st.studentId
                    const isLoadingDetail = loadingDetailStudentId === st.studentId
                    const detail = st.submissionId ? studentDetails[st.submissionId] : null
                    const detailErr = detailErrors[st.studentId]
                    const hasSubmitted = st.status === 'SUBMITTED' || st.status === 'AUTO_SUBMITTED'

                    return (
                      <React.Fragment key={st.studentId}>
                        <tr
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: isExpanded ? '#f0fdf4' : 'transparent',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{st.studentName}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{st.studentEmail}</div>
                          </td>

                          <td style={{ padding: '12px 14px' }}>{renderStatusBadge(st.status)}</td>

                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                            {st.attemptNumber ? `Lần ${st.attemptNumber}` : '—'}
                          </td>

                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            {st.submittedAt ? new Date(st.submittedAt).toLocaleString('vi-VN') : '—'}
                          </td>

                          <td style={{ padding: '12px 14px' }}>
                            {hasSubmitted ? (
                              <div>
                                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--primary)' }}>
                                  {st.effectiveScore !== null && st.effectiveScore !== undefined
                                    ? st.effectiveScore
                                    : st.score}
                                </span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                  /{data.totalPoints}
                                </span>

                                {st.adjustedScore !== null && st.adjustedScore !== undefined && (
                                  <div
                                    style={{
                                      fontSize: '0.72rem',
                                      color: '#b45309',
                                      marginTop: '2px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '3px',
                                    }}
                                    title={`Điểm gốc: ${st.score}. Lý do sửa: ${st.adjustReason || 'Không có'}`}
                                  >
                                    <Award size={11} />
                                    <span>Gốc: {st.score} (Đã chỉnh)</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>

                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              {hasSubmitted && st.submissionId && (
                                <button
                                  type="button"
                                  onClick={() => toggleStudentDetail(st)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 9px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #cbd5e1',
                                    backgroundColor: isExpanded ? '#e2e8f0' : '#ffffff',
                                    color: 'var(--text-main)',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Xem chi tiết câu trả lời của học sinh"
                                >
                                  <Eye size={13} />
                                  <span>{isExpanded ? 'Đóng bài' : 'Xem bài'}</span>
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              )}

                              {onAdjustScore && hasSubmitted && (
                                <button
                                  type="button"
                                  onClick={() => onAdjustScore(st)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    padding: '5px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #fde68a',
                                    backgroundColor: '#fffbeb',
                                    color: '#b45309',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Điều chỉnh điểm số"
                                >
                                  <span>Sửa điểm</span>
                                </button>
                              )}

                              {onGrantOverride && (
                                <button
                                  type="button"
                                  onClick={() => onGrantOverride(st)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    padding: '5px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #bfdbfe',
                                    backgroundColor: '#eff6ff',
                                    color: '#1d4ed8',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Gia hạn hoặc cho làm lại"
                                >
                                  <span>Gia hạn/Làm lại</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {/* Inline Student Submission Detail (No Modal!) */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} style={{ padding: '16px 20px', backgroundColor: '#f8fafc' }}>
                              {isLoadingDetail ? (
                                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
                                  <Loader2 size={18} className="animate-spin" style={{ margin: '0 auto 6px', display: 'block' }} />
                                  <span>Đang tải chi tiết câu trả lời của {st.studentName}...</span>
                                </div>
                              ) : detailErr ? (
                                <div
                                  style={{
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#fef2f2',
                                    color: '#b91c1c',
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  {detailErr}
                                </div>
                              ) : detail ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      paddingBottom: '8px',
                                      borderBottom: '1px solid #e2e8f0',
                                    }}
                                  >
                                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                                      Chi tiết bài làm: {st.studentName} (Lần làm: {detail.attemptNumber})
                                    </div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                                      Tổng điểm: {detail.score} / {detail.maxScore}
                                    </div>
                                  </div>

                                  {detail.questions.map((q, idx) => (
                                    <div
                                      key={q.questionId}
                                      style={{
                                        padding: '12px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: '#ffffff',
                                        border: `1px solid ${q.isCorrect ? '#a7f3d0' : '#fecaca'}`,
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'flex-start',
                                          marginBottom: '6px',
                                          gap: '8px',
                                        }}
                                      >
                                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.84rem' }}>
                                          Câu {idx + 1}: {q.content}
                                        </div>
                                        <div
                                          style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            padding: '2px 8px',
                                            borderRadius: 'var(--radius-full)',
                                            backgroundColor: q.isCorrect ? '#ecfdf5' : '#fef2f2',
                                            color: q.isCorrect ? '#047857' : '#b91c1c',
                                            flexShrink: 0,
                                          }}
                                        >
                                          {q.pointsEarned} / {q.maxPoints} đ
                                        </div>
                                      </div>

                                      {/* Question Options */}
                                      {q.options && q.options.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                          {q.options.map((opt) => {
                                            const isStudentSelected = q.selectedOptionId === opt.id
                                            const isCorrectOption = opt.isCorrect

                                            let bgColor = '#f8fafc'
                                            let borderColor = '#e2e8f0'
                                            let textColor = 'var(--text-main)'

                                            if (isStudentSelected && isCorrectOption) {
                                              bgColor = '#ecfdf5'
                                              borderColor = '#10b981'
                                              textColor = '#047857'
                                            } else if (isStudentSelected && !isCorrectOption) {
                                              bgColor = '#fef2f2'
                                              borderColor = '#ef4444'
                                              textColor = '#b91c1c'
                                            } else if (isCorrectOption) {
                                              bgColor = '#f0fdf4'
                                              borderColor = '#86efac'
                                              textColor = '#15803d'
                                            }

                                            return (
                                              <div
                                                key={opt.id}
                                                style={{
                                                  padding: '6px 10px',
                                                  borderRadius: 'var(--radius-sm)',
                                                  backgroundColor: bgColor,
                                                  border: `1px solid ${borderColor}`,
                                                  fontSize: '0.78rem',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'space-between',
                                                  color: textColor,
                                                }}
                                              >
                                                <span>{opt.content}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  {isStudentSelected && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                                                      [Học sinh chọn]
                                                    </span>
                                                  )}
                                                  {isCorrectOption && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16a34a' }}>
                                                      [Đáp án đúng]
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}

                                      {/* Text answer if applicable */}
                                      {q.studentTextAnswer && (
                                        <div style={{ marginTop: '6px', fontSize: '0.78rem' }}>
                                          <span style={{ color: 'var(--text-muted)' }}>Câu trả lời tự luận: </span>
                                          <strong>{q.studentTextAnswer}</strong>
                                        </div>
                                      )}

                                      {/* Explanation */}
                                      {q.explanation && (
                                        <div
                                          style={{
                                            marginTop: '6px',
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            fontStyle: 'italic',
                                          }}
                                        >
                                          Giải thích: {q.explanation}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
