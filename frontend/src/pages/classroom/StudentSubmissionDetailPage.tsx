import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Edit3,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getSubmissionResultById,
  getAssignmentSubmissionsOverview,
  adjustSubmissionScore,
  type SubmissionResultData,
  type AssignmentSubmissionsOverviewData,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'

export const StudentSubmissionDetailPage: React.FC = () => {
  const { classId, assignmentId, submissionId } = useParams<{
    classId: string
    assignmentId: string
    submissionId: string
  }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [submission, setSubmission] = useState<SubmissionResultData | null>(null)
  const [overviewData, setOverviewData] = useState<AssignmentSubmissionsOverviewData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Form states for Adjust Score
  const [isAdjusting, setIsAdjusting] = useState<boolean>(false)
  const [adjustScoreVal, setAdjustScoreVal] = useState<string>('')
  const [adjustReasonVal, setAdjustReasonVal] = useState<string>('')
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false)
  const [adjustError, setAdjustError] = useState<string | null>(null)
  const [adjustSuccess, setAdjustSuccess] = useState<string | null>(null)

  // Load detail data
  const loadData = async () => {
    if (!submissionId || !user?.token) return
    try {
      setLoading(true)
      setError(null)
      const res = await getSubmissionResultById(Number(submissionId), user.token)
      setSubmission(res)

      // Điền sẵn form sửa điểm
      if (res.adjustedScore !== undefined && res.adjustedScore !== null) {
        setAdjustScoreVal(res.adjustedScore.toString())
      } else if (res.score !== undefined && res.score !== null) {
        setAdjustScoreVal(res.score.toString())
      } else {
        setAdjustScoreVal('')
      }
      setAdjustReasonVal(res.adjustReason || '')

      // Tải overview để hỗ trợ chuyển học sinh trước/sau
      if (assignmentId) {
        getAssignmentSubmissionsOverview(Number(assignmentId), user.token)
          .then((ov) => setOverviewData(ov))
          .catch(() => {})
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải chi tiết bài làm của học sinh.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [submissionId, user?.token])

  // Danh sách các học sinh đã nộp bài để chuyển bài liên tục
  const submittedStudents = useMemo(() => {
    if (!overviewData?.students) return []
    return overviewData.students.filter((st) => !!st.submissionId)
  }, [overviewData?.students])

  const currentIndex = submittedStudents.findIndex(
    (st) => st.submissionId === Number(submissionId)
  )
  const currentStudentSummary = currentIndex >= 0 ? submittedStudents[currentIndex] : null

  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      const prevSubId = submittedStudents[currentIndex - 1].submissionId
      navigate(`/classes/${classId}/assignments/${assignmentId}/submissions/${prevSubId}`)
    }
  }

  const handleNextStudent = () => {
    if (currentIndex < submittedStudents.length - 1) {
      const nextSubId = submittedStudents[currentIndex + 1].submissionId
      navigate(`/classes/${classId}/assignments/${assignmentId}/submissions/${nextSubId}`)
    }
  }

  // Cuộn mượt đến câu hỏi
  const scrollToQuestion = (idx: number) => {
    const el = document.getElementById(`question-card-${idx}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Thao tác Lưu điều chỉnh điểm (HTT-06-CN-007)
  const handleSubmitAdjustScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submission || !user?.token) return
    const scoreNum = parseFloat(adjustScoreVal)
    if (isNaN(scoreNum) || scoreNum < 0 || (submission.maxScore && scoreNum > submission.maxScore)) {
      setAdjustError(`Điểm điều chỉnh phải là số từ 0 đến ${submission.maxScore || 10}`)
      return
    }
    if (!adjustReasonVal.trim()) {
      setAdjustError('Vui lòng nhập lý do điều chỉnh điểm')
      return
    }

    try {
      setAdjustSubmitting(true)
      setAdjustError(null)
      const updated = await adjustSubmissionScore(
        submission.submissionId,
        { adjustedScore: scoreNum, reason: adjustReasonVal.trim() },
        user.token
      )
      setSubmission(updated)
      setAdjustSuccess('Đã cập nhật điểm thành công!')
      setTimeout(() => {
        setIsAdjusting(false)
        setAdjustSuccess(null)
      }, 1500)
    } catch (err) {
      setAdjustError(err instanceof ApiError ? err.message : 'Không thể điều chỉnh điểm.')
    } finally {
      setAdjustSubmitting(false)
    }
  }

  // Thống kê câu đúng / câu sai
  const questionStats = useMemo(() => {
    if (!submission?.questions) return { correct: 0, total: 0 }
    const total = submission.questions.length
    const correct = submission.questions.filter((q) => q.isCorrect).length
    return { correct, total }
  }, [submission?.questions])

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px 0' }}>
          <RefreshCw size={24} className="animate-spin" color="var(--primary)" />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Đang tải toàn bộ bài làm của học sinh...
          </span>
        </div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px' }}>
        <div className="game-card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
            Không thể tải bài làm
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error || 'Không tìm thấy bài làm này.'}</p>
          <button
            type="button"
            onClick={() => navigate(`/classes/${classId}/assignments/${assignmentId}/submissions`)}
            className="btn btn-primary"
          >
            Quay lại danh sách bài nộp
          </button>
        </div>
      </div>
    )
  }

  const isAuto = submission.status === 'AUTO_SUBMITTED'
  const hasAdjusted = submission.adjustedScore !== undefined && submission.adjustedScore !== null
  const displayScore = hasAdjusted ? submission.adjustedScore : submission.score

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 28px', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* 1. TOP BREADCRUMB & STUDENT NAVIGATION BAR */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate(`/classes/${classId}/assignments/${assignmentId}/submissions`)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.88rem',
            fontWeight: 800,
            padding: 0,
            marginBottom: '14px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách bài nộp của cả lớp</span>
        </button>

        {/* Header thông tin học sinh & Nút chuyển học sinh tiếp theo */}
        <div
          className="game-card"
          style={{
            padding: '20px 24px',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                flexShrink: 0,
              }}
            >
              {(currentStudentSummary?.studentName || 'H').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  {currentStudentSummary?.studentName || 'Học sinh'}
                </h1>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    backgroundColor: isAuto ? '#fef3c7' : '#ecfdf5',
                    color: isAuto ? '#b45309' : '#047857',
                  }}
                >
                  {isAuto ? <Clock size={12} /> : <Check size={12} />}
                  <span>{isAuto ? 'TỰ NỘP (HẾT GIỜ)' : 'ĐÃ NỘP BÀI THÀNH CÔNG'}</span>
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {currentStudentSummary?.studentEmail} • Lần làm thứ: <strong>{submission.attemptNumber || 1}</strong> • Thời điểm nộp: <strong>{new Date(submission.submittedAt).toLocaleString('vi-VN')}</strong>
              </div>
            </div>
          </div>

          {/* Bộ điều hướng chấm bài liên tục */}
          {submittedStudents.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={handlePrevStudent}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <ChevronLeft size={16} />
                <span>Học sinh trước</span>
              </button>

              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', padding: '0 8px' }}>
                {currentIndex + 1} / {submittedStudents.length}
              </span>

              <button
                type="button"
                disabled={currentIndex === submittedStudents.length - 1}
                onClick={handleNextStudent}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Học sinh tiếp theo</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. KHỐI TỔNG QUAN ĐIỂM SỐ & FORM SỬA ĐIỂM (HTT-06-CN-007) */}
      <div
        className="game-card"
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          marginBottom: '24px',
          borderLeft: '6px solid var(--primary)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {hasAdjusted ? 'Điểm số sau khi giáo viên điều chỉnh' : 'Điểm tự động nộp bài'}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 900, color: hasAdjusted ? '#b45309' : 'var(--primary)', lineHeight: 1 }}>
                {displayScore}
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                / {submission.maxScore} điểm ({Math.round(((displayScore || 0) / (submission.maxScore || 1)) * 100)}%)
              </span>
            </div>
            {hasAdjusted && (
              <div style={{ fontSize: '0.84rem', color: '#92400e', marginTop: '6px', fontWeight: 700 }}>
                Điểm gốc tự động: <strong>{submission.score}</strong> điểm • Lý do điều chỉnh: "{submission.adjustReason}"
              </div>
            )}
          </div>

          <div>
            {!isAdjusting ? (
              <button
                type="button"
                onClick={() => {
                  setIsAdjusting(true)
                  setAdjustError(null)
                  setAdjustSuccess(null)
                }}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                }}
              >
                <Edit3 size={16} color="var(--primary)" />
                <span>Điều chỉnh điểm bài làm</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdjusting(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.84rem' }}
              >
                Đóng form sửa điểm
              </button>
            )}
          </div>
        </div>

        {/* Form điều chỉnh điểm inline tại chỗ (No Modal) */}
        {isAdjusting && (
          <form
            onSubmit={handleSubmitAdjustScore}
            style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Nhập điểm điều chỉnh mới & Lý do minh bạch:
            </div>

            {adjustError && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.85rem' }}>
                {adjustError}
              </div>
            )}
            {adjustSuccess && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.85rem' }}>
                {adjustSuccess}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr auto', gap: '14px', alignItems: 'flex-start' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Điểm mới (0 - {submission.maxScore}) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max={submission.maxScore}
                  value={adjustScoreVal}
                  onChange={(e) => setAdjustScoreVal(e.target.value)}
                  placeholder="Ví dụ: 9.5"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Lý do điều chỉnh điểm <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={adjustReasonVal}
                  onChange={(e) => setAdjustReasonVal(e.target.value)}
                  placeholder="Ví dụ: Cộng điểm khuyến khích phần sắp xếp câu mạch lạc..."
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={adjustSubmitting}
                  className="btn btn-primary"
                  style={{ padding: '9px 18px', fontWeight: 800, fontSize: '0.88rem' }}
                >
                  {adjustSubmitting ? 'Đang lưu...' : 'Lưu điểm'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdjusting(false)}
                  className="btn btn-secondary"
                  style={{ padding: '9px 14px', fontSize: '0.88rem' }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* 3. BỐ CỤC CHÍNH: NỘI DUNG CÂU HỎI (75%) & BẢNG CÂU HỎI NHANH (25%) */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* CỘT TRÁI (75%): NỘI DUNG CHI TIẾT TỪNG CÂU HỎI */}
        <div style={{ flex: '1 1 75%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {submission.questions.map((q, qIdx) => {
            const isCorrect = q.isCorrect

            return (
              <div
                key={q.questionId}
                id={`question-card-${qIdx + 1}`}
                className="game-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  border: `2px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                {/* Header Câu hỏi: Câu X • Loại • Điểm */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2',
                        color: isCorrect ? '#047857' : '#b91c1c',
                        fontWeight: 900,
                        fontSize: '0.88rem',
                      }}
                    >
                      Câu {qIdx + 1}
                    </span>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 800,
                        fontSize: '0.74rem',
                      }}
                    >
                      {q.type}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2',
                      color: isCorrect ? '#047857' : '#b91c1c',
                      fontWeight: 900,
                      fontSize: '0.88rem',
                    }}
                  >
                    <span>{q.pointsEarned} / {q.maxPoints} điểm</span>
                  </div>
                </div>

                {/* Nội dung câu hỏi */}
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', lineHeight: 1.6 }}>
                  {q.content}
                </div>

                {/* 1. Lựa chọn TRẮC NGHIỆM (MCQ) */}
                {q.options && q.options.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {q.options.map((opt) => {
                      const isStudentSelected = q.selectedOptionId === opt.id
                      const isCorrectOption = opt.isCorrect

                      let bgColor = '#ffffff'
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
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: bgColor,
                            border: `1.5px solid ${borderColor}`,
                            color: textColor,
                            fontSize: '0.92rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ fontWeight: isStudentSelected || isCorrectOption ? 800 : 500 }}>
                            {opt.content}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800 }}>
                            {isStudentSelected && <span>[Học sinh đã chọn]</span>}
                            {isCorrectOption && <span style={{ color: '#16a34a' }}>[Đáp án đúng]</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 2. Câu trả lời text (FILL, ORDER, MATCH) */}
                {q.studentTextAnswer && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCorrect ? '#ecfdf5' : '#fef2f2',
                      border: `1.5px solid ${isCorrect ? '#a7f3d0' : '#fecaca'}`,
                      marginBottom: '14px',
                      fontSize: '0.92rem',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Câu trả lời của học sinh:
                    </div>
                    <strong style={{ fontSize: '1.05rem', color: isCorrect ? '#047857' : '#b91c1c' }}>
                      {q.studentTextAnswer}
                    </strong>
                  </div>
                )}

                {/* Lời giải thích chi tiết */}
                {q.explanation && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#eff6ff',
                      border: '1.5px solid #bfdbfe',
                      color: '#1e40af',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>💡 Lời giải / Giải thích chi tiết:</strong> {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CỘT PHẢI (25%): QUESTION PALETTE STICKY BẢNG CÂU HỎI NHANH */}
        <div style={{ flex: '0 0 25%', position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="game-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 12px 0' }}>
              Danh mục câu hỏi
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
              Nhấp vào số câu để cuộn nhanh đến câu tương ứng:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {submission.questions.map((q, idx) => {
                const isRight = q.isCorrect
                return (
                  <button
                    key={q.questionId}
                    type="button"
                    onClick={() => scrollToQuestion(idx + 1)}
                    style={{
                      padding: '10px 0',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${isRight ? '#10b981' : '#ef4444'}`,
                      backgroundColor: isRight ? '#ecfdf5' : '#fef2f2',
                      color: isRight ? '#047857' : '#b91c1c',
                      fontSize: '0.88rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                    title={`Câu ${idx + 1}: ${isRight ? 'Đúng' : 'Chưa đúng'} (${q.pointsEarned}/${q.maxPoints}đ)`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Thống kê tiến độ */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tổng số câu:</span>
                <strong>{questionStats.total} câu</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#047857' }}>
                <span>Làm đúng:</span>
                <strong>{questionStats.correct} câu</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#b91c1c' }}>
                <span>Làm sai / thiếu:</span>
                <strong>{questionStats.total - questionStats.correct} câu</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
