import React, { useState } from 'react'
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert } from 'lucide-react'
import { Input } from '../../components/common/Input'
import { loginUser, ApiError } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import type { LoginResponse } from '../../types/auth'

interface LoginFormProps {
  onSwitchToRegister: () => void
  onLoginSuccess: (user: LoginResponse) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
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
    setIsLocked(false)

    try {
      const response = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      })

      login(response)
      onLoginSuccess(response)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.code === 'ACCOUNT_TEMPORARILY_LOCKED') {
          setIsLocked(true)
          setError('Tài khoản bị tạm khóa 15 phút do nhập sai mật khẩu quá 5 lần liên tiếp (QTN-17). Vui lòng thử lại sau.')
        } else if (err.code === 'ACCOUNT_LOCKED') {
          setIsLocked(true)
          setError('Tài khoản này đã bị quản trị viên khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.')
        } else if (err.code === 'INVALID_CREDENTIALS') {
          setError('Email hoặc mật khẩu không chính xác.')
        } else {
          setError(err.message || 'Đăng nhập không thành công.')
        }
      } else {
        setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: isLocked ? '#fffbeb' : '#fee2e2',
            border: isLocked ? '2px solid #f59e0b' : '2px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            color: isLocked ? '#92400e' : '#b91c1c',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            lineHeight: 1.45,
          }}
        >
          {isLocked ? (
            <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
          ) : (
            <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#ef4444' }} />
          )}
          <span>{error}</span>
        </div>
      )}

      <Input
        label="Địa chỉ Email"
        type="email"
        placeholder="an.hs@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          setError('')
        }}
        icon={<Mail size={18} />}
        required
      />

      <Input
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          setError('')
        }}
        icon={<Lock size={18} />}
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

        <a
          href="#forgot"
          onClick={(e) => {
            e.preventDefault()
            alert('Chức năng đặt lại mật khẩu thuộc Story HTT-01-CN-005!')
          }}
          style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
        >
          Quên mật khẩu?
        </a>
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
