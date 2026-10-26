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
  RotateCcw,
  Link2,
  Lock,
  Unlock,
  Award,
  GraduationCap,
  BarChart2,
  BookOpen,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface MatchingPair {
  left: string
  right: string
}

function parseMatchingPayload(payload?: string | null): MatchingPair[] {
  if (!payload) return []
  try {
    const parsed = JSON.parse(payload)
    if (parsed.pairs && Array.isArray(parsed.pairs)) return parsed.pairs
  } catch {}
  return []
}

function parseOrderingPayload(payload?: string | null): string[] {
  if (!payload) return []
  try {
    const parsed = JSON.parse(payload)
    if (parsed.correctOrder && Array.isArray(parsed.correctOrder)) return parsed.correctOrder
  } catch {}
  return []
}

function parseFillBlankPayload(payload?: string | null): { correctAnswer: string; acceptableAnswers?: string[] } | null {
  if (!payload) return null
  try {
    const parsed = JSON.parse(payload)
    if (parsed.blanks && Array.isArray(parsed.blanks) && parsed.blanks.length > 0) {
      return parsed.blanks[0]
    }
  } catch {}
  return null
}

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

  // Lưu đáp án trắc nghiệm (MCQ): questionId -> selectedOptionId
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({})

  // Lưu đáp án text (FILL, MATCH, ORDER): questionId -> textAnswer
  const [textAnswers, setTextAnswers] = useState<Record<number, string>>({})

  // Trạng thái tạm thời khi thao tác nối cặp (MATCH)
  const [selectedMatchLeft, setSelectedMatchLeft] = useState<string | null>(null)

  // Auto-save feedback
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null)
  const [savingDraft, setSavingDraft] = useState(false)
  const saveTimeoutRef = useRef<number | null>(null)

  // Remaining time in seconds and monotonic performance references (TC-05 tamper-proof)
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)
  const initialRemainingSecRef = useRef<number | null>(null)
  const timerStartPerfRef = useRef<number | null>(null)

  // Keep latest answers in refs to prevent stale closure during auto-submission
  const selectedOptionsRef = useRef(selectedOptions)
  selectedOptionsRef.current = selectedOptions
  const textAnswersRef = useRef(textAnswers)
  textAnswersRef.current = textAnswers

  // Inline submit warning (No modals!)
  const [showUnansweredWarning, setShowUnansweredWarning] = useState(false)

  // Guard duplicate fetch in StrictMode / rapid re-renders
  const hasFetchedKeyRef = useRef<string | null>(null)

  // 1. Initial Load: Call takeAssignment
  useEffect(() => {
    if (!user || !assignmentId) return

    const fetchKey = `${user.id}_${assignmentId}`
    if (hasFetchedKeyRef.current === fetchKey) return
    hasFetchedKeyRef.current = fetchKey

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
          const initialOpts: Record<number, number> = {}
          const initialTexts: Record<number, string> = {}
          if (data.savedAnswers && data.savedAnswers.length > 0) {
            data.savedAnswers.forEach((a) => {
              if (a.questionId) {
                if (a.selectedOptionId) {
                  initialOpts[a.questionId] = a.selectedOptionId
                }
                if (a.textAnswer) {
                  initialTexts[a.questionId] = a.textAnswer
                }
              }
            })
          }
          setSelectedOptions(initialOpts)
          setTextAnswers(initialTexts)

          // Khởi tạo đếm ngược tamper-proof theo effectiveDeadline và serverTimeMillis (TC-05)
          const effectiveDeadlineStr = data.effectiveDeadline || data.dueTime
          const deadlineMs = new Date(effectiveDeadlineStr).getTime()
          const serverNowMs = data.serverTimeMillis || Date.now()
          const initialDiffSec = Math.max(0, Math.floor((deadlineMs - serverNowMs) / 1000))

          initialRemainingSecRef.current = initialDiffSec
          timerStartPerfRef.current = performance.now()
          setRemainingSeconds(initialDiffSec)
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
  }, [user?.id, user?.token, assignmentId])

  // 2. Countdown Timer: Monotonic performance.now() countdown, immune to client clock tampering (TC-05)
  useEffect(() => {
    if (remainingSeconds === null || assignmentData?.status !== 'IN_PROGRESS') return

    if (remainingSeconds <= 0) {
      handleAutoSubmitOnTimeout()
      return
    }

    timerIntervalRef.current = window.setInterval(() => {
      if (initialRemainingSecRef.current === null || timerStartPerfRef.current === null) return
      const elapsedSec = Math.floor((performance.now() - timerStartPerfRef.current) / 1000)
      const currentRemaining = Math.max(0, initialRemainingSecRef.current - elapsedSec)

      setRemainingSeconds(currentRemaining)
      if (currentRemaining <= 0) {
        if (timerIntervalRef.current) {
          window.clearInterval(timerIntervalRef.current)
        }
        handleAutoSubmitOnTimeout()
      }
    }, 1000)

    return () => {
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current)
    }
  }, [assignmentData?.status, remainingSeconds === null])

  const buildAnswerPayload = (
    currentOpts = selectedOptionsRef.current,
    currentTexts = textAnswersRef.current
  ): StudentAnswerItem[] => {
    if (!assignmentData) return []
    return assignmentData.questions.map((q) => ({
      questionId: q.questionId,
      selectedOptionId: currentOpts[q.questionId] || null,
      textAnswer: currentTexts[q.questionId] || null,
    }))
  }

  // Auto-Submit on Timeout
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

  // Debounced auto-save draft
  const triggerSaveDraft = async (
    opts: Record<number, number>,
    texts: Record<number, string>
  ) => {
    if (!user || !assignmentId || assignmentData?.status !== 'IN_PROGRESS') return
    try {
      setSavingDraft(true)
      const payload = buildAnswerPayload(opts, texts)
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

  const queueAutoSave = (opts: Record<number, number>, texts: Record<number, string>) => {
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = window.setTimeout(() => {
      triggerSaveDraft(opts, texts)
    }, 800)
  }

  // Handlers for Question Types
  const handleSelectOption = (questionId: number, optionId: number) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const updated = { ...selectedOptions, [questionId]: optionId }
    setSelectedOptions(updated)
    setShowUnansweredWarning(false)
    queueAutoSave(updated, textAnswers)
  }

  const handleTextAnswerChange = (questionId: number, val: string) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const updated = { ...textAnswers, [questionId]: val }
    setTextAnswers(updated)
    setShowUnansweredWarning(false)
    queueAutoSave(selectedOptions, updated)
  }

  // Matching pair handler
  const handleLinkMatchPair = (questionId: number, left: string, right: string) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const currentJson = textAnswers[questionId]
    let pairs: MatchingPair[] = []
    try {
      if (currentJson) pairs = JSON.parse(currentJson)
    } catch {}
    // Loại bỏ liên kết cũ của left hoặc right
    pairs = pairs.filter((p) => p.left !== left && p.right !== right)
    pairs.push({ left, right })
    const updated = { ...textAnswers, [questionId]: JSON.stringify(pairs) }
    setTextAnswers(updated)
    setSelectedMatchLeft(null)
    setShowUnansweredWarning(false)
    queueAutoSave(selectedOptions, updated)
  }

  const handleRemoveMatchPair = (questionId: number, left: string) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const currentJson = textAnswers[questionId]
    let pairs: MatchingPair[] = []
    try {
      if (currentJson) pairs = JSON.parse(currentJson)
    } catch {}
    pairs = pairs.filter((p) => p.left !== left)
    const updated = { ...textAnswers, [questionId]: pairs.length > 0 ? JSON.stringify(pairs) : '' }
    setTextAnswers(updated)
    queueAutoSave(selectedOptions, updated)
  }

  // Ordering handlers
  const handleAddOrderingWord = (questionId: number, word: string) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const currentStr = textAnswers[questionId] || ''
    const currentWords = currentStr ? currentStr.trim().split(/\s+/) : []
    const updatedWords = [...currentWords, word]
    const updated = { ...textAnswers, [questionId]: updatedWords.join(' ') }
    setTextAnswers(updated)
    setShowUnansweredWarning(false)
    queueAutoSave(selectedOptions, updated)
  }

  const handleRemoveOrderingWord = (questionId: number, removeIndex: number) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const currentStr = textAnswers[questionId] || ''
    const currentWords = currentStr ? currentStr.trim().split(/\s+/) : []
    const updatedWords = currentWords.filter((_, idx) => idx !== removeIndex)
    const updated = { ...textAnswers, [questionId]: updatedWords.join(' ') }
    setTextAnswers(updated)
    setShowUnansweredWarning(false)
    queueAutoSave(selectedOptions, updated)
  }

  const handleResetOrdering = (questionId: number) => {
    if (assignmentData?.status !== 'IN_PROGRESS') return
    const updated = { ...textAnswers, [questionId]: '' }
    setTextAnswers(updated)
    queueAutoSave(selectedOptions, updated)
  }

  // Check if a question is answered
  const isQuestionAnswered = (qId: number) => {
    const hasOpt = !!selectedOptions[qId]
    const hasText = !!(textAnswers[qId] && textAnswers[qId].trim().length > 0)
    return hasOpt || hasText
  }

  // Submit Handler
  const handleInitiateSubmit = () => {
    if (!assignmentData) return
    const totalQ = assignmentData.questions.length
    const answeredCount = assignmentData.questions.filter((q) => isQuestionAnswered(q.questionId)).length
    const unansweredCount = totalQ - answeredCount

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
        setError('Không thể nộp bài. Vui lòng kiểm tra lại kết nối mạng.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // =========================================================================
  // LOADING & ERROR SCREENS
  // =========================================================================
  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Đang chuẩn bị đề bài và thời gian làm bài...
        </div>
      </div>
    )
  }

  if (error && !assignmentData) {
    return (
      <div style={{ maxWidth: '640px', margin: '60px auto', padding: '0 20px' }}>
        <div
          className="game-card"
          style={{
            padding: '32px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '1.5px solid #fecaca',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <AlertCircle size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#991b1b', marginBottom: '8px' }}>
            Không thể tham gia bài tập
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
            {error}
          </p>
          <button
            type="button"
            className="game-btn game-btn-primary"
            onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
          >
            Quay lại lớp học
          </button>
        </div>
      </div>
    )
  }

  if (!assignmentData) return null

  // =========================================================================
  // VIEW KẾT QUẢ ĐÃ NỘP (SUBMITTED / AUTO_SUBMITTED)
  // =========================================================================
  if (resultData) {
    const isAuto = resultData.status === 'AUTO_SUBMITTED'
    const percentage = resultData.maxScore > 0 ? Math.round((resultData.score / resultData.maxScore) * 100) : 0

    return (
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '32px 20px 80px' }}>
        {/* Nút quay lại */}
        <button
          type="button"
          onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            fontWeight: 800,
            padding: 0,
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại trang chi tiết lớp học</span>
        </button>

        {/* Thẻ tổng quan điểm số */}
        <div
          className="game-card"
          style={{
            padding: '36px',
            backgroundColor: '#ffffff',
            textAlign: 'center',
            marginBottom: '28px',
            borderTop: '6px solid var(--primary)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 800,
              backgroundColor: isAuto ? '#fef3c7' : '#ecfdf5',
              color: isAuto ? '#b45309' : '#047857',
              marginBottom: '16px',
            }}
          >
            {isAuto ? <Clock size={14} /> : <Check size={14} />}
            <span>{isAuto ? 'ĐÃ TỰ ĐỘNG NỘP (HẾT GIỜ / QUÁ HẠN)' : 'ĐÃ NỘP BÀI THÀNH CÔNG'}</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
            {resultData.title}
          </h1>

          {resultData.adjustedScore !== undefined && resultData.adjustedScore !== null ? (
            <div style={{ margin: '20px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #fcd34d',
                  color: '#92400e',
                }}
              >
                <Award size={20} color="#d97706" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                  Điểm giáo viên đã điều chỉnh: <strong style={{ fontSize: '1.25rem', color: '#b45309' }}>{resultData.adjustedScore}</strong> / {resultData.maxScore} điểm
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Điểm gốc tự động: <strong>{resultData.score}</strong> / {resultData.maxScore} điểm
                {resultData.adjustReason && ` • Lý do điều chỉnh: "${resultData.adjustReason}"`}
              </div>
            </div>
          ) : (
            <div style={{ margin: '24px auto', display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                {resultData.score}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                / {resultData.maxScore} điểm ({percentage}%)
              </span>
            </div>
          )}

          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Thời điểm nộp: {new Date(resultData.submittedAt).toLocaleString('vi-VN')}
          </div>

          {/* Đánh giá Đạt / Chưa đạt đối với Đề thi thử HSK (HTT-09-CN-003) */}
          {((resultData.isMockExam && resultData.passingScore != null) || assignmentData?.passingScore != null) && (() => {
            const passingScore = resultData.passingScore ?? assignmentData?.passingScore ?? 0
            const effectiveScore = resultData.adjustedScore ?? resultData.score
            const isPassed = resultData.isPassed !== undefined && resultData.isPassed !== null
              ? resultData.isPassed
              : effectiveScore >= passingScore

            return (
              <div style={{ marginTop: '16px' }}>
                {isPassed ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#ecfdf5',
                      border: '1.5px solid #10b981',
                      color: '#047857',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                    }}
                  >
                    <Check size={16} />
                    <span>KẾT QUẢ THI THỬ: ĐẠT (≥ {passingScore} điểm)</span>
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: '#fef2f2',
                      border: '1.5px solid #ef4444',
                      color: '#b91c1c',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                    }}
                  >
                    <X size={16} />
                    <span>KẾT QUẢ THI THỬ: CHƯA ĐẠT (&lt; {passingScore} điểm)</span>
                  </span>
                )}
              </div>
            )
          })()}
        </div>

        {/* 1. Phân tích kết quả theo từng phần thi (HTT-09-CN-003) */}
        {resultData.sectionResults && resultData.sectionResults.length > 0 && (
          <div
            className="game-card"
            style={{
              padding: '24px 28px',
              backgroundColor: '#ffffff',
              marginBottom: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <BarChart2 size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Phân tích kết quả theo phần thi
                </h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Đánh giá chi tiết năng lực và tỷ lệ chính xác theo từng kỹ năng thi thử
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              {resultData.sectionResults.map((sec, sIdx) => {
                const pct = Math.round(sec.percentage ?? 0)
                const isGood = pct >= 80
                const isPass = pct >= 60

                const themeColor = isGood ? '#10b981' : isPass ? '#3b82f6' : '#ef4444'
                const themeBg = isGood ? '#ecfdf5' : isPass ? '#eff6ff' : '#fef2f2'
                const statusLabel = isGood ? 'Tốt' : isPass ? 'Đạt' : 'Cần cải thiện'

                return (
                  <div
                    key={sec.sectionId ?? sIdx}
                    style={{
                      padding: '16px 20px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                          {sec.title}
                        </div>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: themeBg,
                            color: themeColor,
                            border: `1px solid ${themeColor}`,
                          }}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      {sec.instruction && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
                          {sec.instruction}
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          Đúng: <strong>{sec.correctQuestions}</strong>/{sec.totalQuestions} câu
                        </span>
                        <span style={{ fontWeight: 800, color: themeColor }}>
                          {sec.totalScore} / {sec.maxScore} điểm ({pct}%)
                        </span>
                      </div>

                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: '#e2e8f0',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(0, pct))}%`,
                            height: '100%',
                            backgroundColor: themeColor,
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.5s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. Gợi ý bài học ôn tập theo phần yếu (HTT-09-CN-003) */}
        {(() => {
          const isFullScore = resultData.maxScore > 0 && resultData.score >= resultData.maxScore
          const isAllCorrect = resultData.questions.length > 0 && resultData.questions.every((q) => q.isCorrect)
          const hasRecommendations = resultData.recommendedLessons && resultData.recommendedLessons.length > 0

          if (isFullScore || isAllCorrect) {
            return (
              <div
                className="game-card"
                style={{
                  padding: '24px 28px',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={26} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#166534' }}>
                      Xuất sắc! Không phát hiện phần yếu cần ôn tập
                    </h3>
                    <Sparkles size={18} color="#16a34a" />
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#15803d', lineHeight: 1.5 }}>
                    Chúc mừng bạn đã hoàn thành xuất sắc tất cả các câu hỏi trong đề thi thử! Bạn đã nắm rất vững toàn bộ kiến thức trọng tâm của cấp độ này. Hãy tiếp tục phát huy và tự tin thử sức với các cấp độ HSK cao hơn nhé!
                  </p>
                </div>
              </div>
            )
          }

          if (hasRecommendations) {
            return (
              <div
                className="game-card"
                style={{
                  padding: '24px 28px',
                  backgroundColor: '#ffffff',
                  marginBottom: '24px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Gợi ý bài học ôn tập theo phần yếu
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Hệ thống tự động phân tích từ vựng và chủ điểm trong những câu trả lời sai để đề xuất bài học bổ trợ
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                    marginTop: '16px',
                  }}
                >
                  {resultData.recommendedLessons!.map((rec) => (
                    <div
                      key={rec.lessonId}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#f8fafc',
                        border: '1.5px solid #e2e8f0',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                            }}
                          >
                            HSK {rec.hskLevel || 1}
                          </span>
                        </div>

                        <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                          {rec.title}
                        </div>

                        {rec.description && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.4 }}>
                            {rec.description}
                          </div>
                        )}

                        {rec.missedVocabularies && rec.missedVocabularies.length > 0 && (
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                              Từ vựng liên quan trong câu sai:
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {rec.missedVocabularies.map((vocab) => (
                                <span
                                  key={vocab}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#fee2e2',
                                    color: '#991b1b',
                                    border: '1px solid #fecaca',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  {vocab}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/lessons/${rec.lessonId}`)}
                        className="game-btn game-btn-primary"
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          fontSize: '0.84rem',
                          marginTop: '8px',
                        }}
                      >
                        <span>Ôn tập bài này</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          return null
        })()}

        {/* Banner kiểm soát hiển thị đáp án chống lộ đề (Anti-Cheating Policy - HTT-06-CN-005) */}
        {resultData.showSolutions === false ? (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#fffbeb',
              border: '1.5px solid #fde68a',
              color: '#92400e',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <Lock size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#b45309' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', color: '#b45309' }}>
                Chưa hết hạn nộp bài {resultData.dueTime ? `(Hạn nộp: ${new Date(resultData.dueTime).toLocaleString('vi-VN')})` : ''}
              </div>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#78350f' }}>
                Để đảm bảo tính bảo mật và công bằng cho toàn lớp, hệ thống tạm thời ẩn đáp án đúng và lời giải chi tiết. Bạn vẫn xem được câu trả lời và điểm số từng câu của mình. Toàn bộ đáp án chuẩn sẽ được tự động mở khóa sau khi hết hạn nộp.
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              color: '#065f46',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <Unlock size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#059669' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', color: '#047857' }}>
                Đã mở khóa toàn bộ đáp án chuẩn & lời giải chi tiết
              </div>
              <div style={{ fontSize: '0.85rem', lineHeight: 1.5, color: '#065f46' }}>
                Đã kết thúc thời gian nộp bài của cả lớp. Bạn có thể đối chiếu câu trả lời của mình với đáp án chuẩn và đọc phần giải thích chi tiết bên dưới để nắm vững kiến thức.
              </div>
            </div>
          </div>
        )}

        {/* Danh sách kết quả chi tiết từng câu */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px' }}>
          Chi tiết kết quả & Lời giải
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {resultData.questions.map((q, idx) => {
            const isMcq = !q.type || q.type === 'MCQ'
            const isFill = q.type === 'FILL'
            const isMatch = q.type === 'MATCH'
            const isOrder = q.type === 'ORDER'

            return (
              <div
                key={q.questionId}
                className="game-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  borderLeft: `5px solid ${q.isCorrect ? '#10b981' : '#ef4444'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)' }}>
                      Câu {idx + 1} ({q.type || 'MCQ'})
                    </span>
                    {q.sectionTitle && (
                      <span
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          color: '#475569',
                          backgroundColor: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {q.sectionTitle}
                      </span>
                    )}
                  </div>
                  <div>
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
                        <span>{q.pointsEarned} / {q.maxPoints} điểm</span>
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

                {/* 1. Hiển thị đáp án MCQ */}
                {isMcq && q.options && q.options.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                    {q.options.map((opt) => {
                      const isSelected = q.selectedOptionId === opt.id
                      const isCorrectOpt = Boolean(resultData.showSolutions && opt.isCorrect)

                      let bgColor = '#f8fafc'
                      let borderColor = '#e2e8f0'
                      let textColor = 'var(--text-main)'

                      if (isCorrectOpt) {
                        bgColor = '#ecfdf5'
                        borderColor = '#10b981'
                        textColor = '#065f46'
                      } else if (isSelected && resultData.showSolutions) {
                        bgColor = '#fef2f2'
                        borderColor = '#ef4444'
                        textColor = '#991b1b'
                      } else if (isSelected && !resultData.showSolutions) {
                        bgColor = '#eff6ff'
                        borderColor = '#3b82f6'
                        textColor = '#1e40af'
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
                                border: `1.5px solid ${isSelected ? (isCorrectOpt ? '#10b981' : (resultData.showSolutions ? '#ef4444' : '#3b82f6')) : '#cbd5e1'}`,
                                backgroundColor: isSelected ? (isCorrectOpt ? '#10b981' : (resultData.showSolutions ? '#ef4444' : '#3b82f6')) : '#ffffff',
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
                          {isSelected && !isCorrectOpt && resultData.showSolutions && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626' }}>
                              Bạn đã chọn
                            </span>
                          )}
                          {isSelected && !resultData.showSolutions && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb' }}>
                              Bạn đã chọn
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 2. Hiển thị đáp án FILL */}
                {isFill && (() => {
                  const payload = parseFillBlankPayload(q.payload)
                  return (
                    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: q.isCorrect ? '#ecfdf5' : '#fef2f2', border: `1px solid ${q.isCorrect ? '#86efac' : '#fca5a5'}` }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Bạn đã điền: </span>
                        <strong style={{ fontSize: '1rem', color: q.isCorrect ? '#047857' : '#b91c1c' }}>
                          {q.studentTextAnswer ? q.studentTextAnswer : '(Chưa trả lời)'}
                        </strong>
                      </div>
                      {payload && (
                        <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>Đáp án đúng: </span>
                          <strong style={{ fontSize: '1rem', color: '#15803d' }}>
                            {payload.correctAnswer}
                            {payload.acceptableAnswers && payload.acceptableAnswers.length > 0 && ` (chấp nhận: ${payload.acceptableAnswers.join(', ')})`}
                          </strong>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* 3. Hiển thị đáp án MATCH */}
                {isMatch && (() => {
                  const standardPairs = parseMatchingPayload(q.payload)
                  let studentPairs: MatchingPair[] = []
                  try {
                    if (q.studentTextAnswer) studentPairs = JSON.parse(q.studentTextAnswer)
                  } catch {}
                  const studentMap = new Map<string, string>()
                  studentPairs.forEach((p) => studentMap.set(p.left, p.right))

                  return (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                        Kết quả đối chiếu các cặp nối:
                      </div>
                      {standardPairs.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                          {standardPairs.map((p) => {
                            const studentRight = studentMap.get(p.left)
                            const isPairCorrect = studentRight && studentRight.trim().toLowerCase() === p.right.trim().toLowerCase()

                            return (
                              <div
                                key={p.left}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: isPairCorrect ? '#ecfdf5' : '#fef2f2',
                                  border: `1.5px solid ${isPairCorrect ? '#86efac' : '#fca5a5'}`,
                                  fontSize: '0.88rem',
                                }}
                              >
                                <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                                  {p.left}
                                </div>
                                <div style={{ fontSize: '0.82rem', color: isPairCorrect ? '#047857' : '#b91c1c' }}>
                                  Bạn nối: <strong>{studentRight || '(Chưa nối)'}</strong>
                                </div>
                                {!isPairCorrect && (
                                  <div style={{ fontSize: '0.82rem', color: '#15803d', marginTop: '2px' }}>
                                    Đáp án chuẩn: <strong>{p.right}</strong>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                          {studentPairs.map((p, pIdx) => (
                            <div
                              key={pIdx}
                              style={{
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: '#f8fafc',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '0.88rem',
                              }}
                            >
                              <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                                {p.left}
                              </div>
                              <div style={{ fontSize: '0.82rem', color: 'var(--primary)' }}>
                                Bạn đã nối với: <strong>{p.right}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* 4. Hiển thị đáp án ORDER */}
                {isOrder && (() => {
                  const correctOrder = parseOrderingPayload(q.payload)
                  const studentText = q.studentTextAnswer ? q.studentTextAnswer.trim() : ''
                  return (
                    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: q.isCorrect ? '#ecfdf5' : '#fef2f2', border: `1px solid ${q.isCorrect ? '#86efac' : '#fca5a5'}` }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Thứ tự bạn sắp xếp: </span>
                        <strong style={{ fontSize: '1rem', color: q.isCorrect ? '#047857' : '#b91c1c' }}>
                          {studentText || '(Chưa sắp xếp)'}
                        </strong>
                      </div>
                      {correctOrder.length > 0 && (
                        <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>Thứ tự đúng: </span>
                          <strong style={{ fontSize: '1rem', color: '#15803d' }}>
                            {correctOrder.join(' ')}
                          </strong>
                        </div>
                      )}
                    </div>
                  )
                })()}

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
  const answeredCount = assignmentData.questions.filter((q) => isQuestionAnswered(q.questionId)).length
  const isTimeCritical = remainingSeconds !== null && remainingSeconds < 300 // Dưới 5 phút

  const isMcq = !currentQuestion.type || currentQuestion.type === 'MCQ'
  const isFill = currentQuestion.type === 'FILL'
  const isMatch = currentQuestion.type === 'MATCH'
  const isOrder = currentQuestion.type === 'ORDER'

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              {assignmentData.title}
            </h2>
            {assignmentData.exerciseType === 'MOCK_EXAM' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#7c3aed',
                  backgroundColor: '#f5f3ff',
                  border: '1px solid #ddd6fe',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <GraduationCap size={13} />
                <span>Đề thi thử HSK {assignmentData.hskLevel || ''}</span>
              </span>
            )}
          </div>
          {assignmentData.exerciseType === 'MOCK_EXAM' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {assignmentData.timeLimitMinutes && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#b45309',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <Clock size={12} />
                  <span>Thời gian làm bài: {assignmentData.timeLimitMinutes} phút</span>
                </span>
              )}
              {assignmentData.passingScore != null && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#047857',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  <Award size={12} />
                  <span>Điểm đạt: {assignmentData.passingScore} / {assignmentData.totalPoints}</span>
                </span>
              )}
            </div>
          )}
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
              Câu {currentIndex + 1} / {totalQuestions} • {currentQuestion.type || 'MCQ'}
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

          {/* 1. DẠNG TRẮC NGHIỆM (MCQ) */}
          {isMcq && currentQuestion.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptions[currentQuestion.questionId] === opt.id

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
          )}

          {/* 2. DẠNG ĐIỀN TỪ (FILL) */}
          {isFill && (
            <div style={{ marginBottom: '32px' }}>
              <label
                htmlFor="fill-blank-input"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}
              >
                Nhập từ cần điền vào chỗ trống:
              </label>
              <input
                id="fill-blank-input"
                type="text"
                placeholder="Nhập từ hoặc chữ Hán..."
                value={textAnswers[currentQuestion.questionId] || ''}
                onChange={(e) => handleTextAnswerChange(currentQuestion.questionId, e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--primary)',
                  fontSize: '1.1rem',
                  fontFamily: 'inherit',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Gợi ý: Khoảng trắng thừa ở hai đầu sẽ được hệ thống tự động làm sạch khi chấm điểm.
              </div>
            </div>
          )}

          {/* 3. DẠNG NỐI CẶP (MATCH) */}
          {isMatch && (() => {
            const pairs = parseMatchingPayload(currentQuestion.payload)
            let studentPairs: MatchingPair[] = []
            try {
              if (textAnswers[currentQuestion.questionId]) {
                studentPairs = JSON.parse(textAnswers[currentQuestion.questionId])
              }
            } catch {}

            const connectedLefts = new Set(studentPairs.map((p) => p.left))
            const connectedRights = new Set(studentPairs.map((p) => p.right))

            return (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '14px' }}>
                  Nhấp vào 1 mục ở Cột A (trái) rồi nhấp tiếp 1 mục ở Cột B (phải) để tạo liên kết:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  {/* Cột Trái */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>CỘT A (Từ vựng)</div>
                    {pairs.map((p) => {
                      const isLinked = connectedLefts.has(p.left)
                      const isSelected = selectedMatchLeft === p.left

                      return (
                        <button
                          key={p.left}
                          type="button"
                          onClick={() => setSelectedMatchLeft(isSelected ? null : p.left)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${isSelected ? 'var(--primary)' : isLinked ? '#10b981' : '#cbd5e1'}`,
                            backgroundColor: isSelected ? 'var(--primary-light)' : isLinked ? '#ecfdf5' : '#ffffff',
                            color: 'var(--text-main)',
                            fontWeight: 700,
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span>{p.left}</span>
                          {isLinked && <Check size={14} color="#10b981" />}
                        </button>
                      )
                    })}
                  </div>

                  {/* Cột Phải */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)' }}>CỘT B (Ý nghĩa)</div>
                    {pairs.map((p) => {
                      const isLinked = connectedRights.has(p.right)

                      return (
                        <button
                          key={p.right}
                          type="button"
                          disabled={!selectedMatchLeft}
                          onClick={() => {
                            if (selectedMatchLeft) {
                              handleLinkMatchPair(currentQuestion.questionId, selectedMatchLeft, p.right)
                            }
                          }}
                          style={{
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: `2px solid ${isLinked ? '#10b981' : '#cbd5e1'}`,
                            backgroundColor: isLinked ? '#ecfdf5' : '#ffffff',
                            color: 'var(--text-main)',
                            fontWeight: 700,
                            textAlign: 'left',
                            cursor: selectedMatchLeft ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span>{p.right}</span>
                          {isLinked && <Check size={14} color="#10b981" />}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Danh sách các cặp đã nối */}
                {studentPairs.length > 0 && (
                  <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Các cặp bạn đã nối ({studentPairs.length}/{pairs.length}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {studentPairs.map((sp) => (
                        <span
                          key={sp.left}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: '#ffffff',
                            border: '1.5px solid #10b981',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          <Link2 size={13} color="#10b981" />
                          <span>{sp.left} ↔ {sp.right}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMatchPair(currentQuestion.questionId, sp.left)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                            }}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* 4. DẠNG SẮP XẾP CÂU (ORDER) */}
          {isOrder && (() => {
            const correctOrder = parseOrderingPayload(currentQuestion.payload)
            const currentStr = textAnswers[currentQuestion.questionId] || ''
            const pickedWords = currentStr ? currentStr.trim().split(/\s+/) : []
            const unpickedWords = [...correctOrder]
            pickedWords.forEach((pw) => {
              const idx = unpickedWords.indexOf(pw)
              if (idx >= 0) unpickedWords.splice(idx, 1)
            })

            return (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Câu của bạn (nhấp từ để gỡ bỏ):
                  </div>
                  {pickedWords.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleResetOrdering(currentQuestion.questionId)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                      }}
                    >
                      <RotateCcw size={12} />
                      <span>Làm lại từ đầu</span>
                    </button>
                  )}
                </div>

                {/* Vùng chứa các từ đã chọn */}
                <div
                  style={{
                    minHeight: '60px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px dashed var(--primary)',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                >
                  {pickedWords.length === 0 ? (
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Chưa chọn từ nào. Nhấp vào các từ bên dưới để ghép câu theo thứ tự.
                    </span>
                  ) : (
                    pickedWords.map((word, wIdx) => (
                      <button
                        key={`${word}-${wIdx}`}
                        type="button"
                        onClick={() => handleRemoveOrderingWord(currentQuestion.questionId, wIdx)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--primary)',
                          backgroundColor: '#ffffff',
                          color: 'var(--primary-hover)',
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{word}</span>
                        <X size={12} />
                      </button>
                    ))
                  )}
                </div>

                {/* Kho từ còn lại để chọn */}
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Từ vựng có sẵn (nhấp để thêm vào câu):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {unpickedWords.map((word, idx) => (
                    <button
                      key={`${word}-${idx}`}
                      type="button"
                      onClick={() => handleAddOrderingWord(currentQuestion.questionId, word)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: 'var(--text-main)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}

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
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Đã làm <strong>{answeredCount}</strong> / {totalQuestions} câu
            </div>
            {assignmentData.exerciseType === 'MOCK_EXAM' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  color: '#92400e',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  lineHeight: 1.4,
                }}
              >
                <Clock size={14} style={{ flexShrink: 0, color: '#b45309' }} />
                <span>Đề thi có tính giờ. Khi hết thời gian, hệ thống sẽ tự động nộp bài làm của bạn.</span>
              </div>
            )}

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
                const isAnswered = isQuestionAnswered(q.questionId)
                const isCurrent = idx === currentIndex

                return (
                  <button
                    key={q.questionId}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 'var(--radius-sm)',
                      border: isCurrent
                        ? '2px solid var(--primary)'
                        : isAnswered
                        ? '1.5px solid #86efac'
                        : '1.5px solid #cbd5e1',
                      backgroundColor: isCurrent
                        ? 'var(--primary)'
                        : isAnswered
                        ? '#dcfce7'
                        : '#ffffff',
                      color: isCurrent
                        ? '#ffffff'
                        : isAnswered
                        ? '#15803d'
                        : 'var(--text-muted)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
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

            {/* Cảnh báo nộp khi chưa làm hết (Inline, không dùng modal) */}
            {showUnansweredWarning && (
              <div
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  marginBottom: '16px',
                  fontSize: '0.85rem',
                  color: '#92400e',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px' }}>
                  <AlertTriangle size={16} />
                  <span>Chưa hoàn thành tất cả câu</span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Bạn còn {totalQuestions - answeredCount} câu chưa làm. Bạn vẫn muốn nộp bài?
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={executeFinalSubmit}
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: '#b45309',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Vẫn nộp bài
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUnansweredWarning(false)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #d97706',
                      backgroundColor: '#ffffff',
                      color: '#b45309',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    Làm tiếp
                  </button>
                </div>
              </div>
            )}

            {/* Nút nộp bài */}
            <button
              type="button"
              className="game-btn game-btn-primary"
              disabled={submitting}
              onClick={handleInitiateSubmit}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 16px',
                fontSize: '0.95rem',
              }}
            >
              <Send size={16} />
              <span>{submitting ? 'Đang chấm điểm...' : 'Nộp bài thi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
