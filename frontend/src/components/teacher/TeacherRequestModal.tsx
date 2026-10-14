import React, { useState } from 'react'
import { GraduationCap, X, AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { submitTeacherRequest, type TeacherRequestItem } from '../../api/teacherRequest'
import { ApiError } from '../../api/auth'

interface TeacherRequestModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  onSuccess: (request: TeacherRequestItem) => void
}

export const TeacherRequestModal: React.FC<TeacherRequestModalProps> = ({
  isOpen,
  onClose,
  token,
  onSuccess,
}) => {
  const [teachingInfo, setTeachingInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!teachingInfo.trim()) {
      setError('Vui lòng nhập thông tin giảng dạy của bạn')
      return
    }

    try {
      setLoading(true)
      const result = await submitTeacherRequest(teachingInfo.trim(), token)
      setSubmitted(true)
      onSuccess(result)
      setTimeout(() => {
        setSubmitted(false)
        setTeachingInfo('')
        onClose()
      }, 1500)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
      }}
    >
      <div
        className="game-card animate-scale-up"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Đăng ký nâng quyền Giáo viên
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                HTT-01-CN-002: Xét duyệt tư cách tạo lớp học
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--jade-green-light)',
                color: 'var(--jade-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Gửi yêu cầu thành công!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Yêu cầu của bạn đang ở trạng thái chờ Quản trị viên xét duyệt.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                  fontSize: '0.88rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: '18px' }}>
              <label
                htmlFor="teaching-info"
                style={{
                  display: 'block',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '8px',
                }}
              >
                Thông tin giảng dạy & Chứng chỉ <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <textarea
                id="teaching-info"
                rows={5}
                value={teachingInfo}
                onChange={(e) => setTeachingInfo(e.target.value)}
                placeholder="Ví dụ: Nơi công tác: Trung tâm tiếng Trung Hoài Ngô&#10;Bằng cấp: HSK 6 (265 điểm), Cử nhân Sư phạm Tiếng Trung&#10;Kinh nghiệm: 3 năm giảng dạy luyện thi HSK 1 - HSK 4..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-card)',
                  backgroundColor: 'var(--bg-input)',
                  fontSize: '0.92rem',
                  color: 'var(--text-main)',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  resize: 'vertical',
                }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Cung cấp chi tiết nơi dạy, chứng chỉ HSK và kinh nghiệm sẽ giúp yêu cầu được duyệt nhanh hơn.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-gamified btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Gửi yêu cầu xét duyệt</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
