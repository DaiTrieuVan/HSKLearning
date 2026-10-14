import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Lock,
  Mail,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateProfile, uploadAvatar, changePassword } from '../../api/profile'
import { ApiError } from '../../api/auth'
import { PasswordStrengthMeter } from '../../components/auth/PasswordStrengthMeter'

export const UserProfilePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'INFO' | 'PASSWORD'>('INFO')

  // Info Tab States
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(user?.avatarUrl ?? undefined)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [infoError, setInfoError] = useState<string | null>(null)
  const [infoSuccess, setInfoSuccess] = useState<string | null>(null)

  // Password Tab States
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)
  const [passSuccess, setPassSuccess] = useState<string | null>(null)

  if (!user) {
    navigate('/')
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setInfoError('Kích thước ảnh đại diện vượt quá 2 MB. Vui lòng chọn ảnh nhỏ hơn.')
      return
    }

    setInfoError(null)
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setInfoError(null)
    setInfoSuccess(null)

    if (!fullName.trim()) {
      setInfoError('Họ và tên không được để trống')
      return
    }

    try {
      setInfoLoading(true)
      if (selectedFile) {
        await uploadAvatar(selectedFile, user.token)
      }
      await updateProfile({ fullName: fullName.trim(), avatarUrl: avatarPreview }, user.token)
      setInfoSuccess('Cập nhật hồ sơ thành công!')
    } catch (err) {
      if (err instanceof ApiError) {
        setInfoError(err.message)
      } else {
        setInfoError('Có lỗi xảy ra khi cập nhật hồ sơ')
      }
    } finally {
      setInfoLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassError(null)
    setPassSuccess(null)

    if (!currentPassword) {
      setPassError('Vui lòng nhập mật khẩu hiện tại')
      return
    }
    if (newPassword.length < 8) {
      setPassError('Mật khẩu mới phải có ít nhất 8 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      setPassError('Xác nhận mật khẩu mới không khớp')
      return
    }

    try {
      setPassLoading(true)
      await changePassword({ currentPassword, newPassword, confirmPassword }, user.token)
      setPassSuccess('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      if (err instanceof ApiError) {
        setPassError(err.message)
      } else {
        setPassError('Có lỗi xảy ra khi đổi mật khẩu')
      }
    } finally {
      setPassLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-card)',
            backgroundColor: '#ffffff',
            color: 'var(--text-main)',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={18} />
          <span>Quay lại Bảng điều khiển</span>
        </button>

        <div className="game-card" style={{ padding: '32px', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <User size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Hồ sơ cá nhân & Bảo mật
              </h1>
              <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Quản lý thông tin tài khoản và đổi mật khẩu đăng nhập
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: 'var(--bg-input)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              border: '1.5px solid var(--border-card)',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('INFO')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'INFO' ? '#ffffff' : 'transparent',
                color: activeTab === 'INFO' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'INFO' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <User size={16} />
              <span>Thông tin tài khoản</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('PASSWORD')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: activeTab === 'PASSWORD' ? '#ffffff' : 'transparent',
                color: activeTab === 'PASSWORD' ? 'var(--primary)' : 'var(--text-muted)',
                boxShadow: activeTab === 'PASSWORD' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Lock size={16} />
              <span>Đổi mật khẩu</span>
            </button>
          </div>

          {/* Tab 1: Info Form */}
          {activeTab === 'INFO' && (
            <form onSubmit={handleSaveInfo}>
              {infoError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    color: '#b91c1c',
                    fontSize: '0.85rem',
                    marginBottom: '20px',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{infoError}</span>
                </div>
              )}

              {infoSuccess && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--primary-hover)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '20px',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{infoSuccess}</span>
                </div>
              )}

              {/* Avatar section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 900,
                    border: '2px solid var(--primary)',
                    overflow: 'hidden',
                  }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span>{fullName.charAt(0) || 'U'}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="avatar-upload"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      backgroundColor: '#ffffff',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Upload size={16} />
                    <span>Tải ảnh đại diện</span>
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Định dạng JPG, PNG hoặc GIF. Tối đa 2 MB.
                  </div>
                </div>
              </div>

              {/* Email (Readonly) */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Email đăng nhập
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={user.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      backgroundColor: '#f1f5f9',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      cursor: 'not-allowed',
                      boxSizing: 'border-box',
                    }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Họ và tên <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={infoLoading || !fullName.trim()}
                  className="btn-gamified btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {infoLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Password Form */}
          {activeTab === 'PASSWORD' && (
            <form onSubmit={handleChangePassword}>
              {passError && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    color: '#b91c1c',
                    fontSize: '0.85rem',
                    marginBottom: '20px',
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 14px',
                    backgroundColor: 'var(--primary-light)',
                    border: '1px solid var(--primary)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--primary-hover)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '20px',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{passSuccess}</span>
                </div>
              )}

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Mật khẩu hiện tại <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="game-input"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '10px 40px 10px 14px', fontSize: '0.9rem' }}
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
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Mật khẩu mới <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontSize: '0.9rem' }}
                />
                {newPassword && <PasswordStrengthMeter password={newPassword} />}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Xác nhận mật khẩu mới <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={passLoading || !currentPassword || !newPassword}
                  className="btn-gamified btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {passLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>Cập nhật mật khẩu</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
