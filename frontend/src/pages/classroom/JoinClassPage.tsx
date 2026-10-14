import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Award, Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { joinClass, type ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

export const JoinClassPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successClass, setSuccessClass] = useState<ClassItem | null>(null)

  if (!user) {
    navigate('/')
    return null
  }

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
      const res = await joinClass(cleanCode, user.token)
      setSuccessClass(res)
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
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
          {successClass ? (
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

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Tham gia lớp thành công!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
                Bạn đã được ghi danh thành công vào lớp học:
              </p>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--primary-light)',
                  border: '1.5px solid var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '28px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-hover)', marginBottom: '4px' }}>
                  {successClass.title}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                  Giáo viên phụ trách: <strong>{successClass.teacherName}</strong>
                </div>
                {successClass.description && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {successClass.description}
                  </div>
                )}
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
                  onClick={() => navigate(`/classes/${successClass.id}`)}
                  className="btn-gamified btn-gold"
                  style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                >
                  Xem chi tiết lớp học
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
                  <Award size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Tham gia lớp học
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Nhập mã gồm 6 ký tự được giáo viên cung cấp để vào lớp
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
                    htmlFor="class-join-code"
                    style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textAlign: 'center' }}
                  >
                    Mã mời lớp học (6 ký tự)
                  </label>
                  <input
                    id="class-join-code"
                    type="text"
                    placeholder="VD: 8M2K9X"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--border-card)',
                      fontSize: '1.8rem',
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
                    disabled={loading || code.trim().length !== 6}
                    className="btn-gamified btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    <span>Xác nhận tham gia</span>
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
