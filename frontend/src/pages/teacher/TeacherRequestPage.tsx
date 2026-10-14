import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Award,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { submitTeacherRequest } from '../../api/teacherRequest'
import { ApiError } from '../../api/auth'

export const TeacherRequestPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [teachingInfo, setTeachingInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  if (!user) {
    navigate('/')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!teachingInfo.trim()) {
      setError('Vui lòng nhập thông tin kinh nghiệm giảng dạy hoặc chứng chỉ của bạn')
      return
    }

    try {
      setLoading(true)
      await submitTeacherRequest(teachingInfo.trim(), user.token)
      setSubmitted(true)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
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
          {submitted ? (
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
                <CheckCircle2 size={40} />
              </div>

              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                Đã gửi yêu cầu xét duyệt!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Yêu cầu nâng quyền giáo viên của bạn đã được gửi đến ban quản trị. Trong thời gian chờ xét duyệt, bạn vẫn có thể sử dụng các chức năng học sinh bình thường.
              </p>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-gamified btn-primary"
                style={{ padding: '12px 32px', fontSize: '0.95rem' }}
              >
                Về trang chính
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
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
                  <GraduationCap size={28} />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                    Đăng ký nâng quyền Giáo viên
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Cung cấp thông tin chứng chỉ hoặc kinh nghiệm để ban quản trị phê duyệt
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '24px',
                  border: '1.5px solid var(--border-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={20} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tạo & quản lý lớp học</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={20} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Giao bộ từ vựng riêng</span>
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
                    htmlFor="teacher-info"
                    style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}
                  >
                    Thông tin trình độ & Kinh nghiệm giảng dạy <span style={{ color: 'var(--primary)' }}>*</span>
                  </label>
                  <textarea
                    id="teacher-info"
                    rows={6}
                    value={teachingInfo}
                    onChange={(e) => setTeachingInfo(e.target.value)}
                    placeholder="Mô tả bằng cấp (HSK 5/6, Cử nhân Sư phạm Tiếng Trung...), số năm kinh nghiệm giảng dạy, hoặc liên kết đến chứng chỉ/CV..."
                    className="game-input"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', fontSize: '0.92rem', resize: 'vertical' }}
                    autoFocus
                  />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Thông tin càng chi tiết sẽ giúp hồ sơ của bạn được duyệt nhanh hơn.
                  </div>
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
                    disabled={loading || !teachingInfo.trim()}
                    className="btn-gamified btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    <span>Gửi yêu cầu xét duyệt</span>
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
