import React, { useState } from 'react'
import { Mail, Lock, LogIn, Info } from 'lucide-react'
import { Input } from '../../components/common/Input'

interface LoginFormProps {
  onSwitchToRegister: () => void
  onLoginSuccess: (email: string) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    setIsLoading(true)
    setError('')

    // Simulating login or handling backend integration
    setTimeout(() => {
      setIsLoading(false)
      onLoginSuccess(email)
    }, 700)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Notice about HTT-01-CN-004 */}
      <div
        style={{
          padding: '10px 14px',
          backgroundColor: 'var(--dragon-blue-light)',
          border: '1.5px solid #93c5fd',
          borderRadius: 'var(--radius-md)',
          color: '#1e40af',
          fontSize: '0.82rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          lineHeight: 1.45,
        }}
      >
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Lưu ý:</strong> API Đăng nhập và JWT token đang thuộc Story{' '}
          <code>HTT-01-CN-004</code>. Hiện tại bạn có thể trải nghiệm giao diện và luồng đăng nhập mô phỏng!
        </span>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '14px',
          }}
        >
          {error}
        </div>
      )}

      <Input
        label="Email học sinh / giáo viên"
        type="email"
        placeholder="student@example.com"
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
        placeholder="Nhập mật khẩu của bạn"
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
          marginTop: '-6px',
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
            alert('Chức năng khôi phục mật khẩu sẽ sớm có trong bản cập nhật tiếp theo!')
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
          'Đang đăng nhập...'
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
