import React, { useState } from 'react'
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { requestForgotPassword, ApiError } from '../../api/auth'

interface ForgotPasswordViewProps {
  onBackToLogin: () => void
  onOpenResetPassword: (prefillToken?: string) => void
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({
  onBackToLogin,
  onOpenResetPassword,
}) => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ message: string; resetToken?: string } | null>(null)

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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại Đăng nhập</span>
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
          Khôi phục mật khẩu
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
          Nhập email tài khoản để nhận mã khôi phục mật khẩu (có hiệu lực trong 30 phút).
        </p>
      </div>

      {result ? (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--primary-hover)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              marginBottom: '20px',
              border: '1px solid var(--primary)',
            }}
          >
            <CheckCircle2 size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, marginBottom: '4px' }}>Đã gửi yêu cầu</div>
              <div>{result.message}</div>
            </div>
          </div>

          {result.resetToken && (
            <div
              style={{
                padding: '14px',
                backgroundColor: '#f8fafc',
                border: '1.5px dashed var(--border-card)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Mã khôi phục thử nghiệm (Dev/Demo Token):
              </div>
              <code
                style={{
                  display: 'block',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--primary-hover)',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                }}
              >
                {result.resetToken}
              </code>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onBackToLogin}
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
              Về đăng nhập
            </button>

            <button
              type="button"
              onClick={() => onOpenResetPassword(result.resetToken)}
              className="btn-gamified btn-primary"
              style={{
                padding: '10px 20px',
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
                  padding: '12px 14px 12px 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-card)',
                  backgroundColor: 'var(--bg-input)',
                  fontSize: '0.92rem',
                  color: 'var(--text-main)',
                  boxSizing: 'border-box',
                }}
                autoFocus
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
              onClick={onBackToLogin}
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
              disabled={loading || !email.trim()}
              className="btn-gamified btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>Gửi liên kết khôi phục</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
