import React, { useState } from 'react'
import { Award, X, Loader2, AlertCircle, ArrowRight, Check } from 'lucide-react'
import { joinClass, type ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

interface JoinClassModalProps {
  isOpen: boolean
  onClose: () => void
  token: string
  onClassJoined: (joinedClass: ClassItem) => void
}

export const JoinClassModal: React.FC<JoinClassModalProps> = ({
  isOpen,
  onClose,
  token,
  onClassJoined,
}) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successClass, setSuccessClass] = useState<ClassItem | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = code.trim().toUpperCase()

    if (!cleanCode || cleanCode.length !== 6) {
      setError('Mã lớp học phải gồm đúng 6 ký tự chữ hoặc số')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await joinClass(cleanCode, token)
      setSuccessClass(res)
      onClassJoined(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tham gia lớp học. Vui lòng kiểm tra lại mã.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCode('')
    setError(null)
    setSuccessClass(null)
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
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
      >
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

        {successClass ? (
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
              Tham gia thành công!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Bạn đã trở thành thành viên của lớp:
            </p>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--primary)',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                marginBottom: '20px',
              }}
            >
              {successClass.title}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                Giáo viên: {successClass.teacherName}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="btn-gamified btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            >
              Vào lớp ngay
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-gold-light)',
                  color: 'var(--accent-gold-shadow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                  Tham gia lớp học
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Nhập mã 6 ký tự do giáo viên cung cấp
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textAlign: 'center' }}>
                  Mã lớp học (6 ký tự)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 8M2K9X"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--border-card)',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    color: 'var(--primary)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    textTransform: 'uppercase',
                  }}
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
                  disabled={loading || code.trim().length !== 6}
                  className="btn-gamified btn-gold"
                  style={{ padding: '10px 22px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {loading ? <Loader2 size={18} className="spin" /> : <ArrowRight size={18} />}
                  <span>Tham gia</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
