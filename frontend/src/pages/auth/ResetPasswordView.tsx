import React, { useState } from 'react'
import { Lock, ArrowLeft, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'
import { resetPassword, ApiError } from '../../api/auth'
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter'

interface ResetPasswordViewProps {
  initialToken?: string
  onBackToLogin: () => void
  onSuccess: () => void
}

export const ResetPasswordView: React.FC<ResetPasswordViewProps> = ({
  initialToken = '',
  onBackToLogin,
  onSuccess,
}) => {
  const [token, setToken] = useState(initialToken)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
      }, 1500)
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
          Thiết lập mật khẩu mới
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Nhập mã khôi phục và thiết lập mật khẩu bảo mật mới cho tài khoản.
        </p>
      </div>

      {success ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'var(--primary-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-hover)',
            fontSize: '0.92rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={24} />
          <span>Đặt lại mật khẩu thành công! Đang chuyển hướng về trang đăng nhập...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Mã token khôi phục <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Nhập mã token..."
              className="game-input"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Mật khẩu mới <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự..."
                className="game-input"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 40px 10px 14px' }}
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
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPassword && <PasswordStrengthMeter password={newPassword} />}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
              Xác nhận mật khẩu mới <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới..."
              className="game-input"
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
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
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading || !token.trim() || !newPassword || !confirmPassword}
              className="btn-gamified btn-primary"
              style={{ padding: '10px 22px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              <span>Đổi mật khẩu</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
