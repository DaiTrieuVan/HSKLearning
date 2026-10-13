import React, { useState } from 'react'
import { User, Mail, Lock, CheckCircle2, AlertCircle, Sparkles, PartyPopper } from 'lucide-react'
import { Input } from '../../components/common/Input'
import { PandaMascot } from '../../components/common/PandaMascot'
import { registerStudent, ApiError } from '../../api/auth'
import type { RegisterRequest, UserResponse } from '../../types/auth'

interface RegisterFormProps {
  onSuccess: (user: UserResponse) => void
  onSwitchToLogin: () => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterRequest | 'general', string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<UserResponse | null>(null)

  // Validation logic matching backend Story HTT-01-CN-001
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterRequest | 'general', string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên của bạn'
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Họ và tên không được vượt quá 100 ký tự'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập địa chỉ email'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng (ví dụ: student@hsk.com)'
    } else if (formData.email.length > 190) {
      newErrors.email = 'Email không được vượt quá 190 ký tự'
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
    } else if (formData.password.length > 72) {
      newErrors.password = 'Mật khẩu không được vượt quá 72 ký tự (giới hạn bảo mật BCrypt)'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận lại mật khẩu'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof RegisterRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific error as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const result = await registerStudent({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      setRegisteredUser(result)
      onSuccess(result)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.code === 'EMAIL_ALREADY_IN_USE') {
          setErrors({ email: 'Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập!' })
        } else if (err.code === 'PASSWORD_CONFIRMATION_MISMATCH') {
          setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp với mật khẩu đã nhập' })
        } else if (err.fields) {
          setErrors({ ...err.fields, general: err.message })
        } else {
          setErrors({ general: err.message })
        }
      } else {
        setErrors({ general: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra backend!' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '#e2e8f0' }
    if (pass.length < 8) return { score: 1, label: 'Quá ngắn (tối thiểu 8 ký tự)', color: '#ef4444' }
    let score = 1
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 2) return { score: 2, label: 'Trung bình', color: '#f59e0b' }
    return { score: 3, label: 'Mạnh mẽ', color: '#10b981' }
  }

  const strength = getPasswordStrength(formData.password)

  // Success view with gamified congratulations
  if (registeredUser) {
    return (
      <div style={{ textAlign: 'center', padding: '20px 10px' }}>
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            backgroundColor: 'var(--jade-green-light)',
            color: 'var(--jade-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            border: '3px solid var(--jade-green)',
            boxShadow: '0 4px 0 var(--jade-green-shadow)',
          }}
          className="pulse-glow"
        >
          <PartyPopper size={40} />
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Chào mừng {registeredUser.fullName}!
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
          Tài khoản học sinh của bạn đã được khởi tạo thành công với email{' '}
          <strong style={{ color: 'var(--primary)' }}>{registeredUser.email}</strong>.
        </p>

        {/* Gamified welcome badge */}
        <div
          style={{
            backgroundColor: '#fef3c7',
            border: '2px dashed #f59e0b',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PandaMascot size={34} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#b45309' }}>
              Quà tân thủ: 100 XP khởi động!
            </div>
            <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
              Bạn đã sẵn sàng chinh phục HSK từ cấp độ 1 cùng gấu trúc Panda.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn-gamified btn-primary"
            style={{ width: '100%' }}
            onClick={onSwitchToLogin}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.general && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            border: '2px solid #ef4444',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <AlertCircle size={20} />
          <span>{errors.general}</span>
        </div>
      )}

      <Input
        label="Họ và tên học sinh"
        placeholder="Ví dụ: Nguyễn Văn An"
        value={formData.fullName}
        onChange={(e) => handleChange('fullName', e.target.value)}
        error={errors.fullName}
        icon={<User size={18} />}
        required
        maxLength={100}
      />

      <Input
        label="Địa chỉ Email"
        type="email"
        placeholder="an.student@example.com"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        icon={<Mail size={18} />}
        required
        maxLength={190}
      />

      <Input
        label="Mật khẩu"
        type="password"
        placeholder="Từ 8 đến 72 ký tự"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        error={errors.password}
        icon={<Lock size={18} />}
        required
        maxLength={72}
      />

      {/* Realtime password strength bar */}
      {formData.password && (
        <div style={{ marginTop: '-8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '4px', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                flex: 1,
                backgroundColor: strength.score >= 1 ? strength.color : '#e2e8f0',
                transition: 'background-color 0.2s',
              }}
            />
            <div
              style={{
                flex: 1,
                backgroundColor: strength.score >= 2 ? strength.color : '#e2e8f0',
                transition: 'background-color 0.2s',
              }}
            />
            <div
              style={{
                flex: 1,
                backgroundColor: strength.score >= 3 ? strength.color : '#e2e8f0',
                transition: 'background-color 0.2s',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem' }}>
            <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
            <span style={{ color: 'var(--text-muted)' }}>{formData.password.length}/72 ký tự</span>
          </div>
        </div>
      )}

      <Input
        label="Xác nhận mật khẩu"
        type="password"
        placeholder="Nhập lại mật khẩu ở trên"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        error={errors.confirmPassword}
        icon={<CheckCircle2 size={18} />}
        required
        maxLength={72}
      />

      <div style={{ marginTop: '22px' }}>
        <button
          type="submit"
          className="btn-gamified btn-primary"
          style={{ width: '100%', fontSize: '1.05rem', padding: '14px' }}
          disabled={isLoading}
        >
          {isLoading ? (
            'Đang tạo tài khoản...'
          ) : (
            <>
              <Sparkles size={20} /> Tạo tài khoản học sinh
            </>
          )}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
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
          Đăng nhập ngay
        </button>
      </div>
    </form>
  )
}
