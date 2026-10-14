import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, Check, Copy, AlertCircle, Loader2, PlusCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createClass, type ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

export const CreateClassPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdClass, setCreatedClass] = useState<ClassItem | null>(null)
  const [copied, setCopied] = useState(false)

  if (!user) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Vui lòng nhập tên lớp học')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const res = await createClass({ title: title.trim(), description: description.trim() }, user.token)
      setCreatedClass(res)
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
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

        <div className="game-card" style={{ padding: '36px', backgroundColor: '#ffffff' }}>
          {createdClass ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                <Check size={36} />
              </div>

              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
                Tạo lớp học thành công!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px', lineHeight: 1.5 }}>
                Chia sẻ mã lớp bên dưới cho học sinh để các bạn có thể tham gia vào lớp <strong>{createdClass.title}</strong>:
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  padding: '20px',
                  backgroundColor: 'var(--primary-light)',
                  border: '2px dashed var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '32px',
                }}
              >
                <span
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    letterSpacing: '6px',
                    color: 'var(--primary-hover)',
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
                    padding: '10px 16px',
                    backgroundColor: copied ? 'var(--primary)' : '#ffffff',
                    color: copied ? '#ffffff' : 'var(--text-main)',
                    border: '1.5px solid var(--border-card)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="btn-gamified btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                >
                  Về trang chính
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/classes/${createdClass.id}`)}
                  className="btn-gamified btn-gold"
                  style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                >
                  Đến trang quản lý lớp
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookOpen size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Tạo lớp học mới
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Hệ thống sẽ tự động tạo mã mời 6 ký tự để học sinh tham gia
                  </p>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    borderRadius: 'var(--radius-md)',
                    color: '#b91c1c',
                    fontSize: '0.88rem',
                    marginBottom: '20px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label
                    htmlFor="class-title"
                    style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}
                  >
                    Tên lớp học <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <input
                    id="class-title"
                    type="text"
                    placeholder="Ví dụ: HSK 2 - Lớp luyện phát âm & Giao tiếp Buổi tối"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    className="game-input"
                    style={{ width: '100%', boxSizing: 'border-box', fontSize: '0.95rem', padding: '12px 14px' }}
                    autoFocus
                  />
                </div>

                <div>
                  <label
                    htmlFor="class-description"
                    style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}
                  >
                    Mô tả lớp học (Tùy chọn)
                  </label>
                  <textarea
                    id="class-description"
                    placeholder="Giới thiệu mục tiêu bài học, lịch học, tài liệu cần chuẩn bị..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    rows={5}
                    className="game-input"
                    style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', fontSize: '0.95rem', padding: '12px 14px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      backgroundColor: '#ffffff',
                      color: 'var(--text-muted)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                    }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="btn-gamified btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                    <span>Xác nhận tạo lớp</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
