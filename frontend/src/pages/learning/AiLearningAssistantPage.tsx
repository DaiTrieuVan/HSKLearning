import React, { useState, useEffect, useRef } from 'react'
import {
  Bot,
  Send,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  askLearningAssistant,
  getAiAssistantQuota,
  type AskLearningAssistantResponse,
  type AiAssistantQuotaResponse,
} from '../../api/aiAssistant'
import { ApiError } from '../../api/auth'

const SUGGESTED_QUESTIONS = [
  'Khi nào dùng 了?',
  'Phân biệt cách dùng 二 (èr) và 两 (liǎng)?',
  'Cấu trúc câu chữ 把 (bǎ) dùng như thế nào?',
  'Phân biệt trợ từ kết cấu 的, 得, 地?',
  'Cách dùng trợ từ ngữ khí 吧 (ba) và 吗 (ma)?',
]

export const AiLearningAssistantPage: React.FC = () => {
  const { user } = useAuth()

  const [question, setQuestion] = useState('')
  const [quota, setQuota] = useState<AiAssistantQuotaResponse | null>(null)
  const [isLoadingQuota, setIsLoadingQuota] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Kết quả câu hỏi gần nhất
  const [currentAnswer, setCurrentAnswer] = useState<AskLearningAssistantResponse | null>(null)
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string | null>(null)

  // Thông báo lỗi
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Tải thông tin quota ban đầu khi user thay đổi
  useEffect(() => {
    let isMounted = true
    if (!user) return

    getAiAssistantQuota(user.token)
      .then((data) => {
        if (isMounted) setQuota(data)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [user])

  const handleRefreshQuota = () => {
    if (!user) return
    setIsLoadingQuota(true)
    getAiAssistantQuota(user.token)
      .then((data) => setQuota(data))
      .catch(() => {})
      .finally(() => setIsLoadingQuota(false))
  }

  const questionTrimmed = question.trim()
  const charCount = question.length
  const isOverLimit = charCount > 1000
  const isQuotaExhausted = quota !== null && quota.remaining <= 0

  const handleSelectSuggestion = (suggested: string) => {
    setQuestion(suggested)
    setErrorMessage(null)
    setErrorCode(null)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleSendQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!user || isSubmitting || !questionTrimmed || isOverLimit || isQuotaExhausted) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setErrorCode(null)
    const askedQuestionText = questionTrimmed

    try {
      const response = await askLearningAssistant(user.token, askedQuestionText)
      setCurrentAnswer(response)
      setLastAskedQuestion(askedQuestionText)
      // Cập nhật quota hiển thị
      setQuota((prev) =>
        prev
          ? {
              ...prev,
              used: prev.limit - response.remainingQuestions,
              remaining: response.remainingQuestions,
            }
          : null
      )
      // Xóa ô nhập sau khi gửi thành công
      setQuestion('')
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorCode(err.code)
        if (err.status === 429 || err.code === 'AI_DAILY_LIMIT_REACHED') {
          setErrorMessage('Bạn đã dùng hết 20 lượt hỏi trong ngày. Vui lòng quay lại vào ngày mai!')
          setQuota((prev) => (prev ? { ...prev, remaining: 0, used: prev.limit } : null))
        } else if (err.status === 503 || err.code === 'AI_PROVIDER_UNAVAILABLE') {
          setErrorMessage('Dịch vụ trợ lý AI tạm thời không khả dụng. Bạn có thể nhấn nút thử lại bên dưới!')
        } else {
          setErrorMessage(err.message || 'Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại!')
        }
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!')
      }
      // Giữ nguyên câu hỏi trong textarea để người dùng có thể thử lại
    } finally {
      setIsSubmitting(false)
    }
  }

  // Định dạng thời gian làm mới quota (00:00 ngày tiếp theo)
  const formatResetTime = (resetsAt?: string) => {
    if (!resetsAt) return '00:00 ngày mai'
    try {
      const d = new Date(resetsAt)
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ngày ' + d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    } catch {
      return '00:00 ngày mai'
    }
  }

  const formatAnswerTime = (answeredAt?: string) => {
    if (!answeredAt) return ''
    try {
      const d = new Date(answeredAt)
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Giới thiệu */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
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
              }}
            >
              <Bot size={22} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Trợ lý AI tiếng Việt
            </h1>
          </div>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.92rem', margin: 0 }}>
            Giải đáp thắc mắc về từ vựng, ngữ pháp và bài tập tiếng Trung bằng tiếng Việt rõ ràng, dễ hiểu.
          </p>
        </div>

        {/* 2. Quota Indicator Badge */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-sub)' }}>
              <Clock size={14} />
              <span>Hạn mức hôm nay</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: isQuotaExhausted ? '#ef4444' : 'var(--primary)',
                }}
              >
                {quota ? quota.remaining : 20}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>
                / {quota ? quota.limit : 20} lượt còn lại
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefreshQuota}
            disabled={isLoadingQuota}
            title="Làm mới hạn mức"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RefreshCw size={16} className={isLoadingQuota ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* 3. Cảnh báo hết lượt hỏi trong ngày */}
      {isQuotaExhausted && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#991b1b',
          }}
        >
          <AlertTriangle size={20} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              Bạn đã dùng hết 20 lượt hỏi trong ngày
            </div>
            <div style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: '2px' }}>
              Hạn mức sẽ được làm mới lúc {formatResetTime(quota?.resetsAt)}. Hẹn gặp lại bạn vào ngày mai!
            </div>
          </div>
        </div>
      )}

      {/* 4. Khung kết quả câu hỏi gần nhất */}
      {currentAnswer && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Câu hỏi đã gửi */}
          {lastAskedQuestion && (
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 600 }}>
                CÂU HỎI CỦA BẠN:
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {lastAskedQuestion}
              </div>
            </div>
          )}

          {/* Header kết quả */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                }}
              >
                <Sparkles size={16} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                Câu trả lời của trợ lý AI
              </span>
            </div>

            {currentAnswer.answeredAt && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                Trả lời lúc: {formatAnswerTime(currentAnswer.answeredAt)}
              </span>
            )}
          </div>

          {/* Nội dung câu trả lời (Render plain text an toàn, giữ nguyên dòng ngắt) */}
          <div
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--text-main)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              backgroundColor: '#f8fafc',
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
            }}
          >
            {currentAnswer.answer}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="var(--primary)" />
              <span>Đã giải đáp thành công (còn {currentAnswer.remainingQuestions} lượt hôm nay)</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Khung soạn câu hỏi (Composer) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label
            htmlFor="ai-question-input"
            style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <BookOpen size={18} color="var(--primary)" />
            Đặt câu hỏi về học tiếng Trung
          </label>

          {/* Bộ đếm ký tự */}
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: isOverLimit ? '#ef4444' : charCount > 800 ? '#f59e0b' : 'var(--text-sub)',
            }}
          >
            {charCount}/1000 ký tự
          </span>
        </div>

        {/* Textarea nhập câu hỏi */}
        <div style={{ position: 'relative' }}>
          <textarea
            id="ai-question-input"
            ref={textareaRef}
            rows={4}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value)
              if (errorMessage) {
                setErrorMessage(null)
                setErrorCode(null)
              }
            }}
            placeholder="Ví dụ: Khi nào dùng 了? Hoặc: Phân biệt cách dùng từ 二 và 两 trong tiếng Trung?"
            disabled={isSubmitting || isQuotaExhausted}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: isOverLimit
                ? '2px solid #ef4444'
                : '1.5px solid var(--border-card)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
              backgroundColor: isQuotaExhausted ? '#f8fafc' : '#ffffff',
              color: 'var(--text-main)',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Thông báo lỗi inline khi gửi */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              color: '#be123c',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>

            {/* Nút thử lại nếu dịch vụ tạm lỗi */}
            {(errorCode === 'AI_PROVIDER_UNAVAILABLE' || errorCode === 'UNKNOWN_ERROR') && (
              <button
                type="button"
                onClick={() => handleSendQuestion()}
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #f43f5e',
                  color: '#be123c',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <RotateCcw size={14} />
                Thử lại
              </button>
            )}
          </div>
        )}

        {/* Nút gửi và các gợi ý */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-sub)' }}>
            <HelpCircle size={15} />
            <span>Chỉ hỗ trợ giải đáp các chủ đề học tiếng Trung (HSK)</span>
          </div>

          <button
            type="button"
            onClick={() => handleSendQuestion()}
            disabled={isSubmitting || !questionTrimmed || isOverLimit || isQuotaExhausted}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor:
                isSubmitting || !questionTrimmed || isOverLimit || isQuotaExhausted
                  ? '#94a3b8'
                  : 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor:
                isSubmitting || !questionTrimmed || isOverLimit || isQuotaExhausted
                  ? 'not-allowed'
                  : 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Đang xử lý câu hỏi...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Gửi câu hỏi</span>
              </>
            )}
          </button>
        </div>

        {/* Gợi ý câu hỏi phổ biến */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '4px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '8px' }}>
            CÂU HỎI GỢI Ý PHỔ BIẾN:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SUGGESTED_QUESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleSelectSuggestion(sug)}
                disabled={isSubmitting || isQuotaExhausted}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  cursor: isSubmitting || isQuotaExhausted ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
