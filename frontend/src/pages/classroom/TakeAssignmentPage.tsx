import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  takeAssignment,
  saveDraftAnswers,
  submitAssignment,
  getSubmissionResult,
} from '../../api/assignment'
import type {
  TakeAssignmentData,
  SubmissionResultData,
  StudentAnswerItem,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'
import {
  Clock,
  Save,
  Send,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react'

export const TakeAssignmentPage: React.FC = () => {
  const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [assignmentData, setAssignmentData] = useState<TakeAssignmentData | null>(null)
  const [resultData, setResultData] = useState<SubmissionResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Current active question index (0-indexed)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Map questionId -> selectedOptionId
  const [answers, setAnswers] = useState<Record<number, number>>({})

  // Auto-save feedback
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const saveTimeoutRef = useRef<number | null>(null)

  // Remaining time in seconds
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)

  // Inline submit warning (TC-03: No modals!)
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false)

  // 1. Initial Load: Call takeAssignment
  useEffect(() => {
    if (!user || !assignmentId) return

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await takeAssignment(Number(assignmentId), user.token)
        setAssignmentData(data)

        // Nếu bài đã nộp hoặc tự nộp, load kết quả chấm điểm luôn
        if (data.status === 'SUBMITTED' || data.status === 'AUTO_SUBMITTED') {
          const res = await getSubmissionResult(Number(assignmentId), user.token)
          setResultData(res)
        } else {
          // Khôi phục câu trả lời nháp đã lưu
          const initialMap: Record<number, number> = {}
          if (data.savedAnswers && data.savedAnswers.length > 0) {
            data.savedAnswers.forEach((a) => {
              if (a.questionId && a.selectedOptionId) {
                initialMap[a.questionId] = a.selectedOptionId
              }
            })
          }
          setAnswers(initialMap)

          // Khởi tạo đếm ngược theo dueTime
          const nowMs = Date.now()
          const dueMs = new Date(data.dueTime).getTime()
          const diffSec = Math.max(0, Math.floor((dueMs - nowMs) / 1000))
          setRemainingSeconds(diffSec)
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Không thể tải bài làm. Vui lòng thử lại sau.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, assignmentId])

  // 2. Countdown Timer
  useEffect(() => {
    if (remainingSeconds === null || assignmentData?.status !== 'IN_PROGRESS') return

    if (remainingSeconds <= 0) {
      // Hết giờ -> Tự động nộp bài (TC-05 / QTN-20)
      handleAutoSubmitOnTimeout()
      return
    }

    timerIntervalRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 1) {
          window.clearInterval(timerIntervalRef.current!)
          handleAutoSubmitOnTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current)
    }
  }, [remainingSeconds, assignmentData?.status])

  // 3. Auto-Submit on Timeout
  const handleAutoSubmitOnTimeout = async () => {
    if (!user || !assignmentId || submitting) return
    try {
      setSubmitting(true)
      const currentAnswers = buildAnswerPayload()
      const res = await submitAssignment(Number(assignmentId), currentAnswers, user.token)
      setResultData(res)
      if (assignmentData) {
        setAssignmentData({ ...assignmentData, status: 'AUTO_SUBMITTED' })
      }
    } catch {
      // Fallback
    } finally {
      setSubmitting(false)
    }
  }

  // 4. Select Option & Trigger Debounced Auto-Save
  const handleSelectOption = (questionId: number, optionId: number) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return

    const updated = { ...answers, [questionId]: optionId }
    setAnswers(updated)
    setShowUnansweredWarning(false)

    // Debounce save draft
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = window.setTimeout(() => {
      triggerSaveDraft(updated)
    }, 800)
  }

  const buildAnswerPayload = (currentAnswersMap = answers): StudentAnswerItem[] => {
    if (!assignmentData) return []
    return assignmentData.questions.map((q) => ({
      questionId: q.questionId,
      selectedOptionId: currentAnswersMap[q.questionId] || null,
    }))
  }

  const triggerSaveDraft = async (answersMap: Record<number, number>) => {
    if (!user || !assignmentId || assignmentData?.status !== 'IN_PROGRESS') return
    try {
      setSavingDraft(true)
      const payload = buildAnswerPayload(answersMap)
      await saveDraftAnswers(Number(assignmentId), payload, user.token)
      const now = new Date()
      setLastSavedTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      )
    } catch {
      // fallback
    } finally {
      setSavingDraft(false)
    }
  }

  // 5. Submit Handler
  const handleInitiateSubmit = () => {
    if (!assignmentData) return
    // TC-03: Kiểm tra số câu chưa làm
    const totalQ = assignmentData.questions.length
    const answeredQ = Object.values(answers).filter(Boolean).length
    const unansweredCount = totalQ - answeredQ

    if (unansweredCount > 0) {
      setShowUnansweredWarning(true)
      return
    }

    executeFinalSubmit()
  }

  const executeFinalSubmit = async () => {
    if (!user || !assignmentId || submitting) return
    try {
      setSubmitting(true)
      setError(null)
      setShowUnansweredWarning(false)

      const payload = buildAnswerPayload()
      const res = await submitAssignment(Number(assignmentId), payload, user.token)
      setResultData(res)
      if (assignmentData) {
        setAssignmentData({ ...assignmentData, status: res.status })
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Có lỗi xảy ra khi nộp bài. Bản nháp của bạn đã được giữ an toàn. Vui lòng thử lại!')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimer = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem' }}>Đang nạp bài làm, vui lòng chờ trong giây lát...</p>
      </div>
    )
  }

  if (error && !assignmentData) {
    return (
      <div style={{ maxWidth: '720px', margin: '40px auto', padding: '0 20px' }}>
        <div
          className="game-card"
          style={{
            padding: '32px',
            backgroundColor: '#ffffff',
            border: '2px solid #fecaca',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={44} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#991b1b', fontSize: '1.2rem', fontWeight: 800 }}>
            Không thể vào bài làm
          </h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', marginBottom: '24px' }}>{error}</p>
          <button
            type="button"
            onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Quay lại lớp học</span>
          </button>
        </div>
      </div>
    )
  }

  if (!assignmentData) return null

  // =========================================================================
  // VIEW KẾT QUẢ ĐÃ NỘP (SUBMITTED / AUTO_SUBMITTED)
  // =========================================================================
  if (resultData && (assignmentData.status === 'SUBMITTED' || assignmentData.status === 'AUTO_SUBMITTED')) {
    const isAutoSubmitted = resultData.status === 'AUTO_SUBMITTED'
    const correctCount = resultData.questions.filter((q) => q.isCorrect).length
    const totalQ = resultData.questions.length

    return (
      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Banner kết quả */}
        <div
          className="game-card"
          style={{
            padding: '32px',
            backgroundColor: '#ffffff',
            borderLeft: isAutoSubmitted ? '6px solid #f59e0b' : '6px solid var(--primary)',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isAutoSubmitted ? '#fffbeb' : '#ecfdf5',
                    color: isAutoSubmitted ? '#b45309' : '#047857',
                    border: `1px solid ${isAutoSubmitted ? '#fde68a' : '#a7f3d0'}`,
                  }}
                >
                  {isAutoSubmitted ? 'HỆ THỐNG TỰ ĐỘNG NỘP (HẾT GIỜ/QUÁ HẠN)' : 'ĐÃ NỘP THÀNH CÔNG'}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Lượt làm #{resultData.attemptNumber}
                </span>
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>
                {resultData.title}
              </h1>
              {resultData.description && (
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                  {resultData.description}
                </p>
              )}
            </div>

            {/* Khối hiển thị điểm */}
            <div
              style={{
                padding: '16px 24px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--primary-light)',
                border: '2px solid var(--primary)',
                textAlign: 'center',
                minWidth: '140px',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-hover)', textTransform: 'uppercase' }}>
                Điểm số đạt được
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1, margin: '4px 0' }}>
                {resultData.score}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                trên {resultData.maxScore} điểm ({correctCount}/{totalQ} câu đúng)
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
              className="btn-primary"
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={16} />
              <span>Quay lại lớp học</span>
            </button>
          </div>
        </div>

        {/* Danh sách câu hỏi chi tiết sau chấm điểm */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
          Chi tiết bài làm và lời giải
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {resultData.questions.map((q, idx) => {
            return (
              <div
                key={q.questionId}
                className="game-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  border: q.isCorrect ? '1.5px solid #a7f3d0' : '1.5px solid #fecaca',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: q.isCorrect ? '#d1fae5' : '#fee2e2',
                        color: q.isCorrect ? '#047857' : '#b91c1c',
                        fontWeight: 900,
                        fontSize: '0.85rem',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      Câu hỏi {idx + 1}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {q.isCorrect ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: '#047857',
                          backgroundColor: '#ecfdf5',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        <Check size={14} />
                        <span>+{q.pointsEarned} điểm</span>
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: '#b91c1c',
                          backgroundColor: '#fef2f2',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        <X size={14} />
                        <span>0 / {q.maxPoints} điểm</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Nội dung câu hỏi */}
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  {q.content}
                </div>

                {/* Các phương án */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {q.options.map((opt) => {
                    const isSelected = q.selectedOptionId === opt.id
                    const isCorrectOpt = opt.isCorrect

                    let bgColor = '#f8fafc'
                    let borderColor = '#e2e8f0'
                    let textColor = 'var(--text-main)'

                    if (isCorrectOpt) {
                      bgColor = '#ecfdf5'
                      borderColor = '#10b981'
                      textColor = '#065f46'
                    } else if (isSelected && !isCorrectOpt) {
                      bgColor = '#fef2f2'
                      borderColor = '#ef4444'
                      textColor = '#991b1b'
                    }

                    return (
                      <div
                        key={opt.id}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${borderColor}`,
                          backgroundColor: bgColor,
                          color: textColor,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.92rem',
                          fontWeight: isSelected || isCorrectOpt ? 700 : 500,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '20px',
                              height: '20px',
                              borderRadius: 'var(--radius-full)',
                              border: `1.5px solid ${isSelected ? (isCorrectOpt ? '#10b981' : '#ef4444') : '#cbd5e1'}`,
                              backgroundColor: isSelected ? (isCorrectOpt ? '#10b981' : '#ef4444') : '#ffffff',
                              color: '#ffffff',
                              fontSize: '0.72rem',
                            }}
                          >
                            {isSelected && <Check size={12} />}
                          </span>
                          <span>{opt.content}</span>
                        </div>

                        {isCorrectOpt && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669' }}>
                            Đáp án đúng
                          </span>
                        )}
                        {isSelected && !isCorrectOpt && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626' }}>
                            Bạn đã chọn
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Giải thích chi tiết */}
                {q.explanation && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      fontSize: '0.85rem',
                      color: '#1e40af',
                    }}
                  >
                    <strong>Lời giải:</strong> {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // =========================================================================
  // VIEW ĐANG LÀM BÀI (IN_PROGRESS)
  // =========================================================================
  const currentQuestion = assignmentData.questions[currentIndex]
  const totalQuestions = assignmentData.questions.length
  const answeredCount = Object.values(answers).filter(Boolean).length
  const isTimeCritical = remainingSeconds !== null && remainingSeconds < 300 // Dưới 5 phút

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {/* Header làm bài & Timer */}
      <div
        className="game-card"
        style={{
          padding: '20px 24px',
          backgroundColor: '#ffffff',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          position: 'sticky',
          top: '16px',
          zIndex: 50,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        }}
      >
        <div>
          <button
            type="button"
            onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.82rem',
              fontWeight: 700,
              padding: 0,
              marginBottom: '6px',
            }}
          >
            <ArrowLeft size={14} />
            <span>Thoát ra danh sách lớp (Bản nháp được tự lưu)</span>
          </button>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
            {assignmentData.title}
          </h2>
        </div>

        {/* Khối đồng hồ đếm ngược và trạng thái lưu nháp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Trạng thái lưu nháp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Save size={14} style={{ color: savingDraft ? 'var(--primary)' : '#94a3b8' }} />
            <span>
              {savingDraft
                ? 'Đang lưu nháp...'
                : lastSavedTime
                ? `Đã lưu lúc ${lastSavedTime}`
                : 'Đã sẵn sàng'}
            </span>
          </div>

          {/* Countdown timer */}
          {remainingSeconds !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isTimeCritical ? '#fef2f2' : '#f0fdf4',
                border: `1.5px solid ${isTimeCritical ? '#fca5a5' : '#86efac'}`,
                color: isTimeCritical ? '#dc2626' : '#15803d',
                fontWeight: 900,
                fontSize: '1.05rem',
                fontFamily: 'monospace',
                letterSpacing: '1px',
              }}
            >
              <Clock size={18} />
              <span>{formatTimer(remainingSeconds)}</span>
            </div>
          )}
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

      {/* Main Grid: Câu hỏi bên trái (70%) + Palette câu hỏi bên phải (30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px', alignItems: 'start' }}>
        {/* Cột trái: Câu hỏi hiện tại */}
        <div
          className="game-card"
          style={{
            padding: '32px',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--primary)',
                backgroundColor: 'var(--primary-light)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Câu {currentIndex + 1} / {totalQuestions}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)' }}>
              {currentQuestion.points} điểm
            </span>
          </div>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            {currentQuestion.content}
          </h3>

          {/* Danh sách các lựa chọn đáp án */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
            {currentQuestion.options.map((opt) => {
              const isSelected = answers[currentQuestion.questionId] === opt.id

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleSelectOption(currentQuestion.questionId, opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px 20px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1.5px solid #e2e8f0',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isSelected ? 'var(--primary-hover)' : 'var(--text-main)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontSize: '0.96rem',
                    fontWeight: isSelected ? 800 : 500,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-full)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : '#cbd5e1'}`,
                      backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <Check size={14} />}
                  </span>
                  <span>{opt.content}</span>
                </button>
              )
            })}
          </div>

          {/* Điều hướng chuyển câu: Câu trước / Câu tiếp */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: currentIndex === 0 ? '#94a3b8' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
              <span>Câu trước</span>
            </button>

            <button
              type="button"
              disabled={currentIndex === totalQuestions - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: currentIndex === totalQuestions - 1 ? '#94a3b8' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: currentIndex === totalQuestions - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <span>Câu tiếp theo</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Cột phải: Question Palette & Submit Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            className="game-card"
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
            }}
          >
            <h4 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Danh sách câu hỏi
            </h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Đã làm <strong>{answeredCount}</strong> / {totalQuestions} câu
            </div>

            {/* Grid các ô số câu hỏi */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '24px',
              }}
            >
              {assignmentData.questions.map((q, idx) => {
                const isAnswered = !!answers[q.questionId]
                const isCurrent = idx === currentIndex

                return (
                  <button
                    type="button"
                    key={q.questionId}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      border: isCurrent
                        ? '2px solid var(--primary)'
                        : isAnswered
                        ? '1.5px solid #10b981'
                        : '1.5px solid #cbd5e1',
                      backgroundColor: isCurrent
                        ? 'var(--primary-light)'
                        : isAnswered
                        ? '#ecfdf5'
                        : '#f8fafc',
                      color: isCurrent
                        ? 'var(--primary-hover)'
                        : isAnswered
                        ? '#047857'
                        : '#64748b',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Chú thích màu sắc */}
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#ecfdf5', border: '1px solid #10b981' }} />
                <span>Đã trả lời</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }} />
                <span>Chưa làm</span>
              </div>
            </div>

            {/* CẢNH BÁO INLINE KHI CÒN CÂU CHƯA TRẢ LỜI (TC-03: Tuyệt đối KHÔNG DÙNG MODAL) */}
            {showUnansweredWarning && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #f59e0b',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <AlertTriangle size={20} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px', fontSize: '0.92rem', fontWeight: 800, color: '#92400e' }}>
                      Bạn còn {totalQuestions - answeredCount} câu chưa làm!
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#b45309', lineHeight: 1.4 }}>
                      Các câu chưa trả lời sẽ được tính 0 điểm. Bạn muốn kiểm tra lại hay xác nhận nộp luôn?
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowUnansweredWarning(false)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Kiểm tra lại
                  </button>
                  <button
                    type="button"
                    onClick={executeFinalSubmit}
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      backgroundColor: '#d97706',
                      borderColor: '#b45309',
                    }}
                  >
                    {submitting ? 'Đang nộp...' : 'Vẫn nộp bài'}
                  </button>
                </div>
              </div>
            )}

            {/* Nút nộp bài */}
            <button
              type="button"
              onClick={handleInitiateSubmit}
              disabled={submitting}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 900,
                fontSize: '0.96rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              <Send size={16} />
              <span>{submitting ? 'Đang nộp bài...' : 'Nộp bài thi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
