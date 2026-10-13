import React, { useState } from 'react'
import { Mail, X, AlertCircle, CheckCircle2, Loader2, ArrowRight, KeyRound } from 'lucide-react'
import { requestForgotPassword, ApiError } from '../../api/auth'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenResetPassword: (prefillToken?: string) => void
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onOpenResetPassword,
}) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ message: string; resetToken?: string } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email của bạn')
      return
    }

    try {
      setLoading(true)
      const data = await requestForgotPassword(email.trim())
      setResult(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi khi gửi yêu cầu')
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
          maxWidth: '480px',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Quên mật khẩu?
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                HTT-01-CN-005: Khôi phục mật khẩu tài khoản
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {result ? (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: 'var(--jade-green-light)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--jade-green-shadow)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>Đã gửi yêu cầu</div>
                <div>{result.message}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                  Liên kết có hiệu lực trong vòng <strong>30 phút</strong> (QTN-17).
                </div>
              </div>
            </div>

            {result.resetToken && (
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--accent-gold-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold-shadow)', marginBottom: '4px' }}>
                  Mã khôi phục thử nghiệm (Dev/Demo Token):
                </div>
                <code
                  style={{
                    display: 'block',
                    padding: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                  }}
                >
                  {result.resetToken}
                </code>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => {
                  const token = result.resetToken
                  onClose()
                  onOpenResetPassword(token)
                }}
                className="btn-gamified btn-primary"
                style={{
                  padding: '10px 18px',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Nhập mã đổi mật khẩu</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
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

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Nhập địa chỉ email tài khoản của bạn. Hệ thống sẽ gửi mã hoặc liên kết để bạn thiết lập mật khẩu mới an toàn.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="forgot-email"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Email tài khoản <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vidu@example.com"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-card)',
                    backgroundColor: 'var(--bg-input)',
                    fontSize: '0.92rem',
                    color: 'var(--text-main)',
                  }}
                />
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-gamified btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <span>Gửi liên kết</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
