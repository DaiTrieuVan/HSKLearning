import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  RotateCcw,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getClassGradebook, type ClassGradebookResponse } from '../../api/progress'
import { ClassGradebookView } from '../../components/classroom/ClassGradebookView'

export const ClassGradebookPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>()
  const { token, user } = useAuth()
  const navigate = useNavigate()

  const [gradebook, setGradebook] = useState<ClassGradebookResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const parsedClassId = classId ? parseInt(classId, 10) : NaN

  const loadGradebook = async () => {
    if (!token || isNaN(parsedClassId)) {
      setError('Mã lớp học không hợp lệ hoặc bạn chưa đăng nhập')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getClassGradebook(token, parsedClassId)
      setGradebook(data)
    } catch (err: any) {
      setError(err.message || 'Không thể tải bảng điểm lớp học')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGradebook()
  }, [token, parsedClassId])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', padding: '28px 24px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Top Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(`/classes/${parsedClassId}`)}
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
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={18} />
            <span>Quay lại Chi tiết lớp</span>
          </button>

          <button
            type="button"
            onClick={loadGradebook}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Làm mới dữ liệu</span>
          </button>
        </div>

        {/* Header Title */}
        <div
          className="game-card"
          style={{
            padding: '24px 28px',
            marginBottom: '24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileSpreadsheet size={28} />
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Bảng điểm lớp học (HTT-07-CN-003)
              </div>
              <h1
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  margin: '4px 0 0',
                }}
              >
                {gradebook?.className || 'Bảng điểm lớp'}
              </h1>
              {gradebook && (
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Mã lớp: <strong>{gradebook.classCode}</strong> &bull; Giáo viên phụ trách:{' '}
                  <strong>{gradebook.teacherName || user?.fullName}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Loader2
              size={40}
              className="animate-spin"
              style={{ color: 'var(--primary)', margin: '0 auto 16px' }}
            />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Đang tải ma trận bảng điểm lớp học...
            </p>
          </div>
        ) : error ? (
          <div
            className="game-card"
            style={{
              padding: '36px 24px',
              textAlign: 'center',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <AlertCircle size={44} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
              Không thể tải bảng điểm
            </h3>
            <p style={{ color: '#b91c1c', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>
            <button type="button" onClick={loadGradebook} className="btn-gamified btn-primary">
              Thử lại
            </button>
          </div>
        ) : gradebook ? (
          <ClassGradebookView gradebook={gradebook} classId={parsedClassId} onRefresh={loadGradebook} />
        ) : null}
      </div>
    </div>
  )
}
