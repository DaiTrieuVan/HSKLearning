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
  Edit3,
  Check,
  CalendarPlus,
  RotateCcw,
} from 'lucide-react'
import {
  getAssignmentSubmissionsOverview,
  getSubmissionResultById,
  adjustSubmissionScore,
  grantStudentExtension,
  grantStudentRetake,
  type AssignmentSubmissionsOverviewData,
  type StudentSubmissionSummary,
  type SubmissionResultData,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'

interface AssignmentSubmissionsPanelProps {
  assignmentId: number
  token: string
  onClose?: () => void
}

export const AssignmentSubmissionsPanel: React.FC<AssignmentSubmissionsPanelProps> = ({
  assignmentId,
  token,
  onClose,
}) => {
  const [data, setData] = useState<AssignmentSubmissionsOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Chi tiết bài làm của từng học sinh (inline accordion/drawer)
  const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null)
  const [loadingDetailStudentId, setLoadingDetailStudentId] = useState<number | null>(null)
  const [studentDetails, setStudentDetails] = useState<Record<number, SubmissionResultData>>({})
  const [detailErrors, setDetailErrors] = useState<Record<number, string>>({})

  // HTT-06-CN-007: Điều chỉnh điểm inline (No Modal)
  const [adjustingStudentId, setAdjustingStudentId] = useState<number | null>(null)
  const [adjustScoreValue, setAdjustScoreValue] = useState<string>('')
  const [adjustReasonValue, setAdjustReasonValue] = useState<string>('')
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false)
  const [adjustError, setAdjustError] = useState<string | null>(null)

  // HTT-06-CN-008: Gia hạn nộp bài inline (No Modal)
  const [extendingStudentId, setExtendingStudentId] = useState<number | null>(null)
  const [extensionDueTime, setExtensionDueTime] = useState<string>('')
  const [extensionReason, setExtensionReason] = useState<string>('')
  const [extensionSubmitting, setExtensionSubmitting] = useState<boolean>(false)
  const [extensionError, setExtensionError] = useState<string | null>(null)

  // HTT-06-CN-008: Cho phép làm lại bài tập inline (No Modal)
  const [retakingStudentId, setRetakingStudentId] = useState<number | null>(null)
  const [retakeAttempts, setRetakeAttempts] = useState<number>(2)
  const [retakeReason, setRetakeReason] = useState<string>('')
  const [retakeSubmitting, setRetakeSubmitting] = useState<boolean>(false)
  const [retakeError, setRetakeError] = useState<string | null>(null)

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

  const handleStartAdjust = (st: StudentSubmissionSummary) => {
    if (adjustingStudentId === st.studentId) {
      setAdjustingStudentId(null)
      setAdjustError(null)
      return
    }
    setAdjustingStudentId(st.studentId)
    setAdjustScoreValue(
      st.adjustedScore != null
        ? st.adjustedScore.toString()
        : st.score != null
        ? st.score.toString()
        : ''
    )
    setAdjustReasonValue(st.adjustReason || '')
    setAdjustError(null)
  }

  const handleSaveAdjust = async (st: StudentSubmissionSummary) => {
    if (!st.submissionId) return
    if (!adjustReasonValue.trim()) {
      setAdjustError('Lý do điều chỉnh điểm không được để trống (bắt buộc theo QTN-13)')
      return
    }
    const parsed = parseFloat(adjustScoreValue)
    if (isNaN(parsed) || parsed < 0 || (data && parsed > data.totalPoints)) {
      setAdjustError(`Điểm điều chỉnh phải là số hợp lệ từ 0 đến ${data?.totalPoints || 10}`)
      return
    }

    try {
      setAdjustSubmitting(true)
      setAdjustError(null)
      await adjustSubmissionScore(
        st.submissionId,
        {
          adjustedScore: parsed,
          reason: adjustReasonValue.trim(),
        },
        token
      )
      setAdjustingStudentId(null)
      await loadOverview()
    } catch (err) {
      if (err instanceof ApiError) {
        setAdjustError(err.message)
      } else {
        setAdjustError('Không thể điều chỉnh điểm. Vui lòng thử lại.')
      }
    } finally {
      setAdjustSubmitting(false)
    }
  }

  // HTT-06-CN-008: Xử lý gia hạn nộp bài cho học sinh
  const handleStartExtension = (st: StudentSubmissionSummary) => {
    if (extendingStudentId === st.studentId) {
      setExtendingStudentId(null)
      setExtensionError(null)
      return
    }
    setExtendingStudentId(st.studentId)
    setRetakingStudentId(null)
    setAdjustingStudentId(null)

    // Khởi tạo hạn nộp mặc định: 1 ngày sau hoặc hạn hiện tại + 1 ngày
    const baseDate = st.extendedDueTime
      ? new Date(st.extendedDueTime)
      : data?.dueTime
      ? new Date(data.dueTime)
      : new Date()
    const nextDay = new Date(baseDate.getTime() + 24 * 60 * 60 * 1000)
    const localIso = new Date(nextDay.getTime() - nextDay.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)

    setExtensionDueTime(localIso)
    setExtensionReason('')
    setExtensionError(null)
  }

  const handleSaveExtension = async (st: StudentSubmissionSummary) => {
    if (!extensionDueTime) {
      setExtensionError('Vui lòng chọn thời gian gia hạn')
      return
    }
    const chosenTime = new Date(extensionDueTime).getTime()
    if (isNaN(chosenTime) || chosenTime <= Date.now()) {
      setExtensionError('Hạn nộp mới phải sau thời điểm hiện tại')
      return
    }

    try {
      setExtensionSubmitting(true)
      setExtensionError(null)
      await grantStudentExtension(
        assignmentId,
        st.studentId,
        {
          extendedDueTime: new Date(extensionDueTime).toISOString(),
          reason: extensionReason.trim() || undefined,
        },
        token
      )
      setExtendingStudentId(null)
      await loadOverview()
    } catch (err) {
      if (err instanceof ApiError) {
        setExtensionError(err.message)
      } else {
        setExtensionError('Không thể gia hạn bài tập. Vui lòng thử lại.')
      }
    } finally {
      setExtensionSubmitting(false)
    }
  }

  // HTT-06-CN-008: Xử lý cấp quyền làm lại bài tập cho học sinh
  const handleStartRetake = (st: StudentSubmissionSummary) => {
    if (retakingStudentId === st.studentId) {
      setRetakingStudentId(null)
      setRetakeError(null)
      return
    }
    setRetakingStudentId(st.studentId)
    setExtendingStudentId(null)
    setAdjustingStudentId(null)

    const currentAttempts = st.attemptNumber || 1
    const allowed = st.allowedAttempts || 1
    setRetakeAttempts(Math.max(allowed + 1, currentAttempts + 1))
    setRetakeReason('')
    setRetakeError(null)
  }

  const handleSaveRetake = async (st: StudentSubmissionSummary) => {
    if (retakeAttempts < 2) {
      setRetakeError('Số lượt làm bài tối đa phải ít nhất là 2')
      return
    }

    try {
      setRetakeSubmitting(true)
      setRetakeError(null)
      await grantStudentRetake(
        assignmentId,
        st.studentId,
        {
          allowedAttempts: retakeAttempts,
          reason: retakeReason.trim() || undefined,
        },
        token
      )
      setRetakingStudentId(null)
      await loadOverview()
    } catch (err) {
      if (err instanceof ApiError) {
        setRetakeError(err.message)
      } else {
        setRetakeError('Không thể cấp quyền làm lại bài tập. Vui lòng thử lại.')
      }
    } finally {
      setRetakeSubmitting(false)
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
                            <div>{st.attemptNumber ? `Lần ${st.attemptNumber}` : '—'}</div>
                            {st.allowedAttempts && st.allowedAttempts > 1 && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '2px 6px',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: '#f3e8ff',
                                  color: '#7e22ce',
                                  border: '1px solid #d8b4fe',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  marginTop: '3px',
                                }}
                                title={`Học sinh được cấp tối đa ${st.allowedAttempts} lượt làm bài`}
                              >
                                <RotateCcw size={10} />
                                Max: {st.allowedAttempts} lượt
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            <div>{st.submittedAt ? new Date(st.submittedAt).toLocaleString('vi-VN') : '—'}</div>
                            {st.extendedDueTime && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                  padding: '2px 6px',
                                  borderRadius: 'var(--radius-full)',
                                  backgroundColor: '#eff6ff',
                                  color: '#1d4ed8',
                                  border: '1px solid #bfdbfe',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  marginTop: '3px',
                                }}
                                title="Hạn nộp riêng đã được giáo viên gia hạn"
                              >
                                <Clock size={10} />
                                Hạn riêng: {new Date(st.extendedDueTime).toLocaleString('vi-VN')}
                              </span>
                            )}
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

                              {hasSubmitted && st.submissionId && (
                                <button
                                  type="button"
                                  onClick={() => handleStartAdjust(st)}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '5px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #fde68a',
                                    backgroundColor: adjustingStudentId === st.studentId ? '#fef3c7' : '#fffbeb',
                                    color: '#b45309',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                  }}
                                  title="Điều chỉnh điểm số kèm lý do (QTN-13)"
                                >
                                  <Edit3 size={12} />
                                  <span>{adjustingStudentId === st.studentId ? 'Đóng sửa' : 'Sửa điểm'}</span>
                                </button>
                              )}

                              {/* Nút Gia hạn (HTT-06-CN-008) */}
                              <button
                                type="button"
                                onClick={() => handleStartExtension(st)}
                                disabled={st.status === 'AUTO_SUBMITTED'}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '5px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid #bfdbfe',
                                  backgroundColor: extendingStudentId === st.studentId ? '#dbeafe' : '#eff6ff',
                                  color: st.status === 'AUTO_SUBMITTED' ? '#94a3b8' : '#1d4ed8',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: st.status === 'AUTO_SUBMITTED' ? 'not-allowed' : 'pointer',
                                  opacity: st.status === 'AUTO_SUBMITTED' ? 0.6 : 1,
                                }}
                                title={
                                  st.status === 'AUTO_SUBMITTED'
                                    ? 'Học sinh đã bị tự nộp khi hết hạn, vui lòng chọn Cho làm lại (TC-08)'
                                    : 'Gia hạn nộp bài cho học sinh (HTT-06-CN-008)'
                                }
                              >
                                <CalendarPlus size={12} />
                                <span>{extendingStudentId === st.studentId ? 'Đóng hạn' : 'Gia hạn'}</span>
                              </button>

                              {/* Nút Cho làm lại (HTT-06-CN-008) */}
                              <button
                                type="button"
                                onClick={() => handleStartRetake(st)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '5px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid #d8b4fe',
                                  backgroundColor: retakingStudentId === st.studentId ? '#f3e8ff' : '#faf5ff',
                                  color: '#7e22ce',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                }}
                                title="Cho phép học sinh làm lại bài tập (cấp thêm lượt, giữ điểm cao nhất)"
                              >
                                <RotateCcw size={12} />
                                <span>{retakingStudentId === st.studentId ? 'Đóng lại' : 'Cho làm lại'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Inline Extension Form (HTT-06-CN-008 - No Modal!) */}
                        {extendingStudentId === st.studentId && (
                          <tr>
                            <td colSpan={6} style={{ padding: '14px 20px', backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.85rem', color: '#1d4ed8' }}>
                                    <CalendarPlus size={15} />
                                    <span>Gia hạn nộp bài cho {st.studentName}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setExtendingStudentId(null)}
                                    style={{ background: 'none', border: 'none', color: '#1e40af', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <X size={15} />
                                  </button>
                                </div>

                                {extensionError && (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: '#fef2f2',
                                      border: '1px solid #fecaca',
                                      color: '#b91c1c',
                                      fontSize: '0.78rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    }}
                                  >
                                    <AlertCircle size={14} />
                                    <span>{extensionError}</span>
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                  <div style={{ minWidth: '220px' }}>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>
                                      Hạn nộp mới (phải sau thời điểm hiện tại)
                                    </label>
                                    <input
                                      type="datetime-local"
                                      value={extensionDueTime}
                                      onChange={(e) => setExtensionDueTime(e.target.value)}
                                      disabled={extensionSubmitting}
                                      style={{
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                      }}
                                    />
                                  </div>

                                  <div style={{ flex: 1, minWidth: '240px' }}>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#1e40af', marginBottom: '4px' }}>
                                      Lý do gia hạn (tùy chọn)
                                    </label>
                                    <input
                                      type="text"
                                      maxLength={255}
                                      placeholder="Ví dụ: Học sinh xin thêm thời gian ôn tập/bị lỗi mạng..."
                                      value={extensionReason}
                                      onChange={(e) => setExtensionReason(e.target.value)}
                                      disabled={extensionSubmitting}
                                      style={{
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%', paddingTop: '18px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveExtension(st)}
                                      disabled={extensionSubmitting}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '7px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        backgroundColor: '#2563eb',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: extensionSubmitting ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      {extensionSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                      <span>{extensionSubmitting ? 'Đang lưu...' : 'Lưu gia hạn'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setExtendingStudentId(null)}
                                      disabled={extensionSubmitting}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '7px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <span>Hủy</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Inline Retake Form (HTT-06-CN-008 - No Modal!) */}
                        {retakingStudentId === st.studentId && (
                          <tr>
                            <td colSpan={6} style={{ padding: '14px 20px', backgroundColor: '#faf5ff', borderBottom: '1px solid #d8b4fe' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.85rem', color: '#7e22ce' }}>
                                    <RotateCcw size={15} />
                                    <span>Cấp quyền làm lại bài tập cho {st.studentName} (Lượt hiện tại: {st.attemptNumber || 1})</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setRetakingStudentId(null)}
                                    style={{ background: 'none', border: 'none', color: '#6b21a8', cursor: 'pointer', padding: '2px' }}
                                  >
                                    <X size={15} />
                                  </button>
                                </div>

                                {retakeError && (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: '#fef2f2',
                                      border: '1px solid #fecaca',
                                      color: '#b91c1c',
                                      fontSize: '0.78rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    }}
                                  >
                                    <AlertCircle size={14} />
                                    <span>{retakeError}</span>
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                  <div style={{ width: '150px' }}>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6b21a8', marginBottom: '4px' }}>
                                      Tổng số lượt tối đa
                                    </label>
                                    <input
                                      type="number"
                                      min={Math.max(2, (st.attemptNumber || 1) + 1)}
                                      max={10}
                                      value={retakeAttempts}
                                      onChange={(e) => setRetakeAttempts(parseInt(e.target.value) || 2)}
                                      disabled={retakeSubmitting}
                                      style={{
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </div>

                                  <div style={{ flex: 1, minWidth: '240px' }}>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#6b21a8', marginBottom: '4px' }}>
                                      Lý do cho làm lại (tùy chọn)
                                    </label>
                                    <input
                                      type="text"
                                      maxLength={255}
                                      placeholder="Ví dụ: Học sinh xin làm lại cải thiện điểm số..."
                                      value={retakeReason}
                                      onChange={(e) => setRetakeReason(e.target.value)}
                                      disabled={retakeSubmitting}
                                      style={{
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%', paddingTop: '18px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveRetake(st)}
                                      disabled={retakeSubmitting}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '7px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        backgroundColor: '#9333ea',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: retakeSubmitting ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      {retakeSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                      <span>{retakeSubmitting ? 'Đang cấp...' : 'Cấp quyền làm lại'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setRetakingStudentId(null)}
                                      disabled={retakeSubmitting}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '7px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <span>Hủy</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Inline Adjust Score Form (HTT-06-CN-007 - No Modal!) */}
                        {adjustingStudentId === st.studentId && (
                          <tr>
                            <td colSpan={6} style={{ padding: '14px 20px', backgroundColor: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.85rem', color: '#b45309' }}>
                                    <Edit3 size={15} />
                                    <span>Điều chỉnh điểm cho {st.studentName} (Điểm gốc: {st.score ?? 0} / {data.totalPoints})</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setAdjustingStudentId(null)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#92400e',
                                      cursor: 'pointer',
                                      padding: '2px',
                                    }}
                                  >
                                    <X size={15} />
                                  </button>
                                </div>

                                {adjustError && (
                                  <div
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: 'var(--radius-sm)',
                                      backgroundColor: '#fef2f2',
                                      border: '1px solid #fecaca',
                                      color: '#b91c1c',
                                      fontSize: '0.78rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    }}
                                  >
                                    <AlertCircle size={14} />
                                    <span>{adjustError}</span>
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                  <div style={{ width: '130px' }}>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                                      Điểm mới (Max: {data.totalPoints})
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      max={data.totalPoints}
                                      step="0.1"
                                      value={adjustScoreValue}
                                      onChange={(e) => setAdjustScoreValue(e.target.value)}
                                      disabled={adjustSubmitting}
                                      style={{
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                      }}
                                    />
                                  </div>

                                  <div style={{ flex: 1, minWidth: '240px' }}>
                                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#92400e', marginBottom: '4px' }}>
                                      Lý do điều chỉnh (bắt buộc)
                                    </label>
                                    <input
                                      type="text"
                                      maxLength={255}
                                      placeholder="Ví dụ: Chấm bổ sung phần bài tập tự luận/phúc khảo..."
                                      value={adjustReasonValue}
                                      onChange={(e) => setAdjustReasonValue(e.target.value)}
                                      disabled={adjustSubmitting}
                                      style={{
                                        width: '100%',
                                        padding: '7px 10px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        fontSize: '0.85rem',
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%', paddingTop: '18px' }}>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveAdjust(st)}
                                      disabled={adjustSubmitting}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '7px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: 'none',
                                        backgroundColor: '#d97706',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: adjustSubmitting ? 'not-allowed' : 'pointer',
                                      }}
                                    >
                                      {adjustSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                                      <span>{adjustSubmitting ? 'Đang lưu...' : 'Lưu điểm'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => setAdjustingStudentId(null)}
                                      disabled={adjustSubmitting}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '7px 12px',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid #cbd5e1',
                                        backgroundColor: '#ffffff',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.78rem',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      <span>Hủy</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

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
