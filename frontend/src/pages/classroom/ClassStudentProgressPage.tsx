import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  FileCheck,
  GraduationCap,
  RotateCcw,
  TrendingUp,
  FileText,
  MessageSquare,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getClassStudentProgress, type ClassStudentProgressResponse } from '../../api/progress'

export const ClassStudentProgressPage: React.FC = () => {
  const { classId, studentId } = useParams<{ classId: string; studentId: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<ClassStudentProgressResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'assignments' | 'lessons'>('assignments')

  const parsedClassId = classId ? parseInt(classId, 10) : NaN
  const parsedStudentId = studentId ? parseInt(studentId, 10) : NaN

  const loadData = async () => {
    if (!token || isNaN(parsedClassId) || isNaN(parsedStudentId)) {
      setError('Mã lớp học hoặc mã học sinh không hợp lệ')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await getClassStudentProgress(token, parsedClassId, parsedStudentId)
      setData(res)
    } catch (err: any) {
      setError(err.message || 'Không thể tải tiến độ học tập của học sinh')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token, parsedClassId, parsedStudentId])

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Chưa có'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  const getStatusBadge = (status: string, isLate: boolean) => {
    if (status === 'LATE' || isLate) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#fef3c7',
            color: '#b45309',
            border: '1px solid #fde68a',
          }}
        >
          <Clock size={12} />
          Nộp trễ
        </span>
      )
    }
    if (status === 'SUBMITTED') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#dcfce7',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          }}
        >
          <CheckCircle2 size={12} />
          Đã nộp
        </span>
      )
    }
    if (status === 'OVERDUE') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
          }}
        >
          <AlertCircle size={12} />
          Quá hạn
        </span>
      )
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: '#f1f5f9',
          color: '#475569',
          border: '1px solid #e2e8f0',
        }}
      >
        <Clock size={12} />
        Chưa nộp
      </span>
    )
  }

  const getMembershipBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
            }}
          >
            Đang học
          </span>
        )
      case 'LEFT':
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#fffbeb',
              color: '#d97706',
              border: '1px solid #fde68a',
            }}
          >
            Đã rời lớp
          </span>
        )
      case 'REMOVED':
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
            }}
          >
            Đã bị xóa
          </span>
        )
      default:
        return (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#f8fafc',
              color: '#64748b',
            }}
          >
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="animate-spin text-indigo-600" size={40} style={{ margin: '0 auto 12px' }} />
          <div style={{ color: '#64748b', fontWeight: 600 }}>Đang tải tiến độ học sinh...</div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button
            onClick={() => navigate(`/classes/${parsedClassId}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: '20px',
            }}
          >
            <ArrowLeft size={18} />
            <span>Quay lại lớp học</span>
          </button>

          <div
            style={{
              padding: '24px',
              backgroundColor: '#fef2f2',
              borderRadius: '12px',
              border: '1.5px solid #fecaca',
              textAlign: 'center',
            }}
          >
            <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
              Không thể tải dữ liệu
            </h3>
            <p style={{ color: '#b91c1c', fontSize: '0.9rem', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={loadData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '32px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Navigation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            onClick={() => navigate(`/classes/${parsedClassId}`)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <ArrowLeft size={18} />
            <span>Quay lại lớp học</span>
          </button>

          <button
            onClick={loadData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={15} />
            <span>Làm mới</span>
          </button>
        </div>

        {/* Student Profile Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
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
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                fontWeight: 800,
                boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)',
              }}
            >
              {data.studentName ? data.studentName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {data.studentName}
                </h1>
                {getMembershipBadge(data.membershipStatus)}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                {data.studentEmail} · Lớp: <strong>{data.className}</strong> ({data.classCode}) · Tham gia:{' '}
                {formatDate(data.joinedAt)}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              color: '#475569',
            }}
          >
            <TrendingUp size={16} className="text-indigo-600" />
            <span>Tiến độ cá nhân trong lớp</span>
          </div>
        </div>

        {/* 4 Summary Stat KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          {/* Card 1: Nộp bài */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              padding: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Bài tập đã nộp
              </span>
              <FileCheck size={20} className="text-indigo-600" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {data.summary.submittedAssignments} / {data.summary.totalAssignments}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {data.summary.totalAssignments > 0
                ? `Đạt ${Math.round((data.summary.submittedAssignments / data.summary.totalAssignments) * 100)}% chỉ tiêu bài tập`
                : 'Chưa có bài tập nào'}
            </div>
          </div>

          {/* Card 2: Điểm trung bình */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              padding: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Điểm trung bình
              </span>
              <Award size={20} className="text-amber-600" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {data.summary.averageScorePercentage != null ? `${data.summary.averageScorePercentage}%` : 'Chưa có'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Tính theo lượt có điểm cao nhất (QTN-13)</div>
          </div>

          {/* Card 3: Quá hạn */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              padding: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Bài tập quá hạn
              </span>
              <AlertCircle size={20} className="text-rose-600" />
            </div>
            <div
              style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: data.summary.overdueAssignments > 0 ? '#dc2626' : '#059669',
                marginBottom: '4px',
              }}
            >
              {data.summary.overdueAssignments}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {data.summary.overdueAssignments > 0 ? 'Cần hỗ trợ, nhắc nhở học sinh' : 'Đúng hạn tất cả bài tập'}
            </div>
          </div>

          {/* Card 4: Bài học HSK */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              padding: '18px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                Bài học hoàn thành
              </span>
              <GraduationCap size={20} className="text-emerald-600" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
              {data.summary.completedLessonsCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Bài học trong chương trình HSK</div>
          </div>
        </div>

        {/* Empty State Banner (TC-03) */}
        {!data.hasActivity && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1.5px dashed #cbd5e1',
              padding: '32px 24px',
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            <BookOpen size={44} className="text-slate-400" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
              Học sinh chưa có hoạt động học tập nào
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
              Học sinh này mới tham gia lớp hoặc chưa hoàn thành bài học HSK cũng như chưa nộp bài tập nào. Hãy nhắc nhở
              hoặc gửi hướng dẫn để học sinh bắt đầu làm quen với lớp!
            </p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'assignments' ? '#4f46e5' : '#64748b',
              borderBottom: activeTab === 'assignments' ? '3px solid #4f46e5' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s',
            }}
          >
            <FileText size={18} />
            <span>Bài tập trong lớp ({data.assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('lessons')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.92rem',
              fontWeight: 700,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === 'lessons' ? '#4f46e5' : '#64748b',
              borderBottom: activeTab === 'lessons' ? '3px solid #4f46e5' : '3px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s',
            }}
          >
            <BookOpen size={18} />
            <span>Tiến độ bài học HSK ({data.completedLessons.length})</span>
          </button>
        </div>

        {/* Tab 1 Content: Assignments */}
        {activeTab === 'assignments' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            {data.assignments.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                Lớp học chưa có bài tập nào được giao.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                      <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        TÊN BÀI TẬP
                      </th>
                      <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        HẠN NỘP
                      </th>
                      <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        TRẠNG THÁI
                      </th>
                      <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        ĐIỂM SỐ
                      </th>
                      <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        SỐ LƯỢT LÀM
                      </th>
                      <th style={{ padding: '12px 16px', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
                        NGÀY NỘP BÀI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.assignments.map((item) => (
                      <tr
                        key={item.assignmentId}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.title}</div>
                          {item.feedback && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                marginTop: '4px',
                                fontSize: '0.78rem',
                                color: '#b45309',
                                backgroundColor: '#fef3c7',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              <MessageSquare size={12} />
                              <span>{item.feedback}</span>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>
                          {formatDate(item.dueDate)}
                        </td>
                        <td style={{ padding: '14px 16px' }}>{getStatusBadge(item.status, item.isLate)}</td>
                        <td style={{ padding: '14px 16px' }}>
                          {item.effectiveScore != null ? (
                            <div>
                              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                                {item.effectiveScore}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / {item.totalPoints}</span>
                              {item.percentage != null && (
                                <span
                                  style={{
                                    marginLeft: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: item.percentage >= 80 ? '#15803d' : item.percentage >= 50 ? '#d97706' : '#b91c1c',
                                  }}
                                >
                                  ({item.percentage}%)
                                </span>
                              )}
                              {item.adjustedScore != null && (
                                <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600 }}>
                                  Đã điều chỉnh (Gốc: {item.score})
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>-</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>
                          {item.attemptCount > 0 ? `${item.attemptCount} lượt` : '0 lượt'}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#475569' }}>
                          {formatDate(item.submittedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2 Content: Lessons & HSK Levels */}
        {activeTab === 'lessons' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Cấp độ HSK */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Tiến độ theo từng cấp độ HSK
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                {data.levelProgressList.map((lvl) => (
                  <div
                    key={lvl.hskLevelId}
                    style={{
                      padding: '14px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{lvl.hskLevelTitle}</span>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#4f46e5' }}>
                        {lvl.progressPercentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div
                      style={{
                        width: '100%',
                        height: '7px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: `${lvl.progressPercentage}%`,
                          height: '100%',
                          backgroundColor: '#4f46e5',
                          borderRadius: '9999px',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                      <span>
                        Hoàn thành: <strong>{lvl.completedLessons}</strong> / {lvl.totalLessons} bài
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Danh sách bài học đã hoàn thành */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Lịch sử bài học đã hoàn thành ({data.completedLessons.length})
              </h3>

              {data.completedLessons.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                  Học sinh chưa hoàn thành bài học nào.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data.completedLessons.map((l) => (
                    <div
                      key={l.lessonId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: '#ecfdf5',
                            color: '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{l.lessonTitle}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{l.levelName}</div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>
                        <div>Hoàn thành</div>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{formatDate(l.completedAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
