import React, { useState } from 'react'
import {
  User,
  Lock,
  Mail,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react'
import { updateProfile, uploadAvatar, changePassword, type UserProfile } from '../../api/profile'
import { ApiError } from '../../api/auth'
import { PasswordStrengthMeter } from '../auth/PasswordStrengthMeter'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  currentName: string
  currentEmail: string
  currentAvatar?: string
  onProfileUpdated: (updated: UserProfile) => void
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  token,
  currentName,
  currentEmail,
  currentAvatar,
  onProfileUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'PASSWORD'>('INFO')

  // Info Tab States
  const [fullName, setFullName] = useState(currentName)
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(currentAvatar)
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

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
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
      let updated: UserProfile

      // If user selected a new file, upload it
      if (selectedFile) {
        updated = await uploadAvatar(selectedFile, token)
      }

      // Update name
      updated = await updateProfile({ fullName: fullName.trim(), avatarUrl: avatarPreview }, token)

      setInfoSuccess('Cập nhật hồ sơ thành công!')
      onProfileUpdated(updated)
      setSelectedFile(null)
      setTimeout(() => setInfoSuccess(null), 3500)
    } catch (err) {
      if (err instanceof ApiError) {
        setInfoError(err.message)
      } else {
        setInfoError('Đã xảy ra lỗi khi lưu thông tin hồ sơ')
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
      setPassError('Mật khẩu xác nhận không khớp với mật khẩu mới')
      return
    }

    try {
      setPassLoading(true)
      await changePassword(
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        token
      )

      setPassSuccess('Đổi mật khẩu thành công! Mật khẩu mới có hiệu lực ngay.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPassSuccess(null), 3500)
    } catch (err) {
      if (err instanceof ApiError) {
        setPassError(err.message)
      } else {
        setPassError('Đã xảy ra lỗi khi đổi mật khẩu')
      }
    } finally {
      setPassLoading(false)
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
          maxWidth: '520px',
          padding: '28px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
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
              <User size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Hồ sơ cá nhân
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                HTT-01-CN-006: Thông tin tài khoản & bảo mật
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
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

        {/* Tab Buttons */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid var(--border-card)',
            marginBottom: '20px',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('INFO')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              color: activeTab === 'INFO' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'INFO' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              marginBottom: '-2px',
            }}
          >
            Thông tin cá nhân
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('PASSWORD')}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
              color: activeTab === 'PASSWORD' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'PASSWORD' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} />
            <span>Đổi mật khẩu</span>
          </button>
        </div>

        {/* Tab 1: Profile Info */}
        {activeTab === 'INFO' && (
          <form onSubmit={handleSaveInfo}>
            {infoSuccess && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--jade-green-light)',
                  color: 'var(--jade-green-shadow)',
                  border: '1px solid var(--jade-green)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{infoSuccess}</span>
              </div>
            )}

            {infoError && (
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
                <AlertCircle size={18} />
                <span>{infoError}</span>
              </div>
            )}

            {/* Avatar Preview & Upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid var(--border-card)',
                  flexShrink: 0,
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={36} />
                )}
              </div>

              <div>
                <label
                  htmlFor="avatar-file"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1.5px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                  }}
                >
                  <Upload size={14} />
                  <span>Chọn ảnh mới (.jpg, .png, &lt; 2 MB)</span>
                </label>
                <input
                  id="avatar-file"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Định dạng hỗ trợ: JPG, PNG, WEBP. Tối đa 2 MB (TC-04).
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="profile-name"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Họ và tên <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="profile-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  maxLength={100}
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
                <User
                  size={18}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div style={{ marginBottom: '22px' }}>
              <label
                htmlFor="profile-email"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Email đăng nhập (Chỉ đọc)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="profile-email"
                  type="email"
                  value={currentEmail}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-card)',
                    backgroundColor: '#f1f5f9',
                    fontSize: '0.92rem',
                    color: 'var(--text-muted)',
                    cursor: 'not-allowed',
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
                disabled={infoLoading}
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
                type="submit"
                disabled={infoLoading}
                className="btn-gamified btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {infoLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <span>Lưu thay đổi</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Password */}
        {activeTab === 'PASSWORD' && (
          <form onSubmit={handleChangePassword}>
            {passSuccess && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--jade-green-light)',
                  color: 'var(--jade-green-shadow)',
                  border: '1px solid var(--jade-green)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  marginBottom: '16px',
                }}
              >
                <CheckCircle2 size={18} />
                <span>{passSuccess}</span>
              </div>
            )}

            {passError && (
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
                <AlertCircle size={18} />
                <span>{passError}</span>
              </div>
            )}

            {/* Current Password */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="current-password"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Mật khẩu hiện tại <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu đang dùng..."
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
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="profile-new-password"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Mật khẩu mới (tối thiểu 8 ký tự) <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="profile-new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
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

              {newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <PasswordStrengthMeter password={newPassword} />
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div style={{ marginBottom: '22px' }}>
              <label
                htmlFor="profile-confirm-password"
                style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}
              >
                Xác nhận mật khẩu mới <span style={{ color: 'var(--primary)' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="profile-confirm-password"
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
                disabled={passLoading}
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
                disabled={passLoading}
                className="btn-gamified btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {passLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <span>Đổi mật khẩu</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
