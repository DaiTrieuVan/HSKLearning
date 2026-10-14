import React, { useState } from 'react'
import { Lock, KeyRound, X, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'
import { resetPassword, ApiError } from '../../api/auth'
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  initialToken?: string
  onSuccess: () => void
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  initialToken = '',
  onSuccess,
}) => {
  const [token, setToken] = useState(initialToken)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Keep token updated when initialToken changes
  React.useEffect(() => {
    if (initialToken) setToken(initialToken)
  }, [initialToken])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!token.trim()) {
      setError('Vui lòng nhập mã token khôi phục')
      return
    }

    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp với mật khẩu mới')
      return
    }

    try {
      setLoading(true)
      await resetPassword({
        token: token.trim(),
        newPassword,
        confirmPassword,
      })
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 1800)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi khi đặt lại mật khẩu')
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
          maxWidth: '500px',
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
                backgroundColor: 'var(--jade-green-light)',
                color: 'var(--jade-green-shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KeyRound size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Thiết lập mật khẩu mới
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                HTT-01-CN-005-TC-02: Đổi mật khẩu qua token xác thực
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

        {success ? (
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
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Đổi mật khẩu thành công!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Mật khẩu mới đã được cập nhật. Bạn có thể đăng nhập ngay với mật khẩu mới.
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

            {/* Token Input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="reset-token"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Mã xác thực (Token) <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reset-token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Nhập mã token nhận được từ email..."
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-card)',
                    backgroundColor: 'var(--bg-input)',
                    fontSize: '0.92rem',
                    color: 'var(--text-main)',
                    fontFamily: 'monospace',
                  }}
                />
                <KeyRound
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="new-password"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Mật khẩu mới (tối thiểu 8 ký tự) <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-card)',
                    backgroundColor: 'var(--bg-input)',
                    fontSize: '0.92rem',
                    color: 'var(--text-main)',
                  }}
                />
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <PasswordStrengthMeter password={newPassword} />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="confirm-new-password"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Xác nhận mật khẩu mới <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
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
                <Lock
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
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <span>Lưu mật khẩu mới</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
