import React, { useState } from 'react'
import { PlusCircle, X, Loader2, Copy, Check, AlertCircle, BookOpen } from 'lucide-react'
import { createClass, type ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

interface CreateClassModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  onClassCreated: (newClass: ClassItem) => void
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  token,
  onClassCreated,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdClass, setCreatedClass] = useState<ClassItem | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Vui lòng nhập tên lớp học')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await createClass({ title, description }, token)
      setCreatedClass(res)
      onClassCreated(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tạo lớp học, vui lòng thử lại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    if (createdClass?.joinCode) {
      navigator.clipboard.writeText(createdClass.joinCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setTitle('')
    setDescription('')
    setError(null)
    setCreatedClass(null)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        className="game-card animate-pop"
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'var(--text-muted)',
          }}
        >
          <X size={20} />
        </button>

        {createdClass ? (
          /* Success View with Join Code */
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--jade-green-light)',
                color: 'var(--jade-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Check size={32} />
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Tạo lớp học thành công!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Chia sẻ mã lớp bên dưới cho học sinh để các bạn có thể tham gia vào lớp <strong>{createdClass.title}</strong>:
            </p>

            {/* Big Join Code Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#f8fafc',
                border: '2px dashed var(--primary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '24px',
              }}
            >
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  letterSpacing: '4px',
                  color: 'var(--primary)',
                  fontFamily: 'monospace',
                }}
              >
                {createdClass.joinCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Sao chép mã lớp"
                style={{
                  padding: '8px 12px',
                  backgroundColor: copied ? 'var(--jade-green-light)' : '#ffffff',
                  color: copied ? 'var(--jade-green)' : 'var(--text-main)',
                  border: '1.5px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="btn-gamified btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              Hoàn tất
            </button>
          </div>
        ) : (
          /* Form View */
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Tạo lớp học mới
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Hệ thống sẽ tự động tạo mã tham gia 6 ký tự ngẫu nhiên
                </p>
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-md)',
                  color: '#b91c1c',
                  fontSize: '0.85rem',
                  marginBottom: '16px',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Tên lớp học <span style={{ color: 'var(--primary)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: HSK 2 - Luyện phát âm & Ngữ pháp K12"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={150}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Mô tả lớp học (Tùy chọn)
                </label>
                <textarea
                  placeholder="Mô tả mục tiêu khóa học, lịch học, yêu cầu chuẩn bị..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  rows={4}
                  className="game-input"
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    backgroundColor: '#ffffff',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gamified btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {loading ? <Loader2 size={18} className="spin" /> : <PlusCircle size={18} />}
                  <span>Tạo lớp</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
