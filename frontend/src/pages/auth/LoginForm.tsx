import React, { useState } from 'react'
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { Input } from '../../components/common/Input'
import { loginUser, ApiError } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import type { LoginResponse } from '../../types/auth'

interface LoginFormProps {
  onSwitchToRegister: () => void
  onLoginSuccess: (user: LoginResponse) => void
  onForgotPassword?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onLoginSuccess,
  onForgotPassword,
}) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TC-07: Validation check
    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMsg('')
    setIsLocked(false)

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      })

      login(response)
      onLoginSuccess(response)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === 'ACCOUNT_TEMPORARILY_LOCKED' || err.code === 'ACCOUNT_LOCKED') {
          setIsLocked(true)
        }
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      {/* HTT-01-CN-004-TC-08 & TC-09: Account Locked Warning */}
      {isLocked && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            backgroundColor: '#fff1f2',
            border: '2px solid #fecdd3',
            color: '#be123c',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.9rem',
            lineHeight: 1.5,
          }}
        >
          <ShieldAlert size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800 }}>Tài khoản đang bị khóa</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Normal Error Alert */}
      {!isLocked && error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#b91c1c',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.88rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Password reset success feedback */}
      {successMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            color: 'var(--primary-hover)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.88rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      <Input
        label="Email"
        id="login-email"
        type="email"
        name="email"
        placeholder="an.hs@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (error) setError('')
        }}
        icon={<Mail size={20} />}
        required
      />

      <Input
        label="Mật khẩu"
        id="login-password"
        type="password"
        name="password"
        placeholder="Nhập mật khẩu..."
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (error) setError('')
        }}
        icon={<Lock size={20} />}
        required
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '-4px',
          marginBottom: '20px',
          fontSize: '0.88rem',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)', cursor: 'pointer' }}
          />
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Ghi nhớ đăng nhập</span>
        </label>

        {/* HTT-01-CN-005: Quên mật khẩu */}
        <button
          type="button"
          onClick={() => onForgotPassword && onForgotPassword()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 700,
            textDecoration: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: 'inherit',
          }}
        >
          Quên mật khẩu?
        </button>
      </div>

      <button
        type="submit"
        className="btn-gamified btn-primary"
        style={{ width: '100%', fontSize: '1.05rem', padding: '14px' }}
        disabled={isLoading}
      >
        {isLoading ? (
          'Đang xác thực...'
        ) : (
          <>
            <LogIn size={20} /> Đăng nhập
          </>
        )}
      </button>

      <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Chưa có tài khoản học sinh?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontWeight: 800,
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: 'inherit',
          }}
        >
          Đăng ký ngay
        </button>
      </div>
    </form>
  )
}
