import React, { useState, useEffect } from 'react'
import {
  LogOut,
  BookOpen,
  User,
  Flame,
  Award,
  ArrowRight,
  PlusCircle,
  GraduationCap,
  Clock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PandaMascot } from '../../components/common/PandaMascot'
import { TeacherRequestModal } from '../../components/teacher/TeacherRequestModal'
import { AdminTeacherReviewPanel } from '../../components/teacher/AdminTeacherReviewPanel'
import { getMyTeacherRequest, type TeacherRequestItem } from '../../api/teacherRequest'

interface MainWorkspaceProps {
  onJoinClassClick?: () => void
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = () => {
  const { user, logout, switchMode } = useAuth()

  // State for teacher upgrade request
  const [teacherModalOpen, setTeacherModalOpen] = useState(false)
  const [myTeacherRequest, setMyTeacherRequest] = useState<TeacherRequestItem | null>(null)
  const [actionAlert, setActionAlert] = useState<string | null>(null)
  const [activeAdminTab, setActiveAdminTab] = useState<'OVERVIEW' | 'TEACHER_REQUESTS'>('OVERVIEW')

  useEffect(() => {
    if (user && !user.roles.includes('TEACHER')) {
      getMyTeacherRequest(user.token)
        .then((res) => setMyTeacherRequest(res))
        .catch(() => {})
    }
  }, [user])

  if (!user) return null

  const isTeacher = user.activeMode === 'TEACHER'
  const isAdmin = user.roles.includes('ADMIN')
  const hasMultipleRoles = user.roles.includes('TEACHER') && user.roles.includes('STUDENT')

  const handleCreateClassClick = () => {
    if (isTeacher) {
      setActionAlert('Chức năng Quản lý lớp học (HTT-02) sẵn sàng!')
      setTimeout(() => setActionAlert(null), 3000)
      return
    }

    // HTT-01-CN-002-TC-03: Tài khoản có yêu cầu đang chờ duyệt -> Hệ thống chặn và báo đang chờ duyệt
    if (myTeacherRequest?.status === 'PENDING') {
      setActionAlert(
        'Yêu cầu nâng quyền giáo viên của bạn đang chờ duyệt. Bạn chưa thể tạo lớp nhưng vẫn có thể học bình thường.'
      )
      return
    }

    // Nếu chưa có quyền giáo viên và chưa gửi yêu cầu
    setTeacherModalOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Navbar */}
      <header
        style={{
          padding: '14px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderBottom: '2px solid var(--border-card)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.3rem',
            }}
            className="hanzi"
          >
            华
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>
              HSK Master <span style={{ color: 'var(--primary)' }}>.</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              {isAdmin
                ? 'TRANG QUẢN TRỊ VIÊN'
                : isTeacher
                ? 'KHÔNG GIAN GIÁO VIÊN'
                : 'KHÔNG GIAN HỌC SINH'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Admin Navigation Tabs */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveAdminTab('OVERVIEW')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: activeAdminTab === 'OVERVIEW' ? 'var(--primary)' : 'var(--bg-input)',
                  color: activeAdminTab === 'OVERVIEW' ? '#ffffff' : 'var(--text-muted)',
                }}
              >
                Tổng quan
              </button>
              <button
                type="button"
                onClick={() => setActiveAdminTab('TEACHER_REQUESTS')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: activeAdminTab === 'TEACHER_REQUESTS' ? 'var(--primary)' : 'var(--bg-input)',
                  color: activeAdminTab === 'TEACHER_REQUESTS' ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldCheck size={16} />
                <span>Duyệt giáo viên</span>
              </button>
            </div>
          )}

          {/* Switch mode if user has multiple roles (HTT-01-CN-009) */}
          {hasMultipleRoles && !isAdmin && (
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-full)',
                padding: '3px',
                border: '1.5px solid var(--border-card)',
              }}
            >
              <button
                type="button"
                onClick={() => switchMode('STUDENT')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: !isTeacher ? '#ffffff' : 'transparent',
                  color: !isTeacher ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: !isTeacher ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Học sinh
              </button>
              <button
                type="button"
                onClick={() => switchMode('TEACHER')}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  backgroundColor: isTeacher ? '#ffffff' : 'transparent',
                  color: isTeacher ? 'var(--primary)' : 'var(--text-muted)',
                  boxShadow: isTeacher ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Giáo viên
              </button>
            </div>
          )}

          {/* User Profile Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f8fafc',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-card)',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              <User size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                {user.fullName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user.roles.join(', ')}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #fee2e2',
              color: '#b91c1c',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 20px' }}>
        {/* Admin Tab View: Teacher Review Panel (HTT-01-CN-003) */}
        {isAdmin && activeAdminTab === 'TEACHER_REQUESTS' ? (
          <AdminTeacherReviewPanel token={user.token} />
        ) : (
          <>
            {/* Action Alert Banner */}
            {actionAlert && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  color: '#991b1b',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginBottom: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={20} />
                  <span>{actionAlert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActionAlert(null)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: 800,
                    color: '#991b1b',
                  }}
                >
                  Đóng
                </button>
              </div>
            )}

            {/* HTT-01-CN-002: Pending Teacher Request Banner */}
            {!isTeacher && !isAdmin && myTeacherRequest?.status === 'PENDING' && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  backgroundColor: 'var(--accent-gold-light)',
                  border: '1.5px solid var(--accent-gold)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={24} style={{ color: 'var(--accent-gold-shadow)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-gold-shadow)' }}>
                      Yêu cầu nâng quyền Giáo viên đang chờ duyệt
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Bạn đã gửi yêu cầu lúc {new Date(myTeacherRequest.createdAt).toLocaleString('vi-VN')}. Trong thời gian chờ xét duyệt, bạn vẫn có thể học bình thường.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    color: 'var(--accent-gold-shadow)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Đang xét duyệt
                </div>
              </div>
            )}

            {/* HTT-01-CN-002: Rejected Request Banner */}
            {!isTeacher && !isAdmin && myTeacherRequest?.status === 'REJECTED' && (
              <div
                className="animate-fade-in"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  backgroundColor: '#fef2f2',
                  border: '1.5px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertCircle size={24} style={{ color: '#b91c1c', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#b91c1c' }}>
                      Yêu cầu giáo viên trước đây bị từ chối
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Lý do: &quot;{myTeacherRequest.rejectReason || 'Thông tin chưa đầy đủ'}&quot;. Bạn có thể cập nhật thông tin và gửi yêu cầu mới.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(true)}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
                >
                  Gửi yêu cầu mới
                </button>
              </div>
            )}

            {/* Welcome Banner */}
            <div
              className="game-card"
              style={{
                padding: '28px',
                backgroundColor: '#ffffff',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--jade-green-light)',
                    color: 'var(--jade-green-shadow)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    marginBottom: '10px',
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>Phiên học hoạt động</span>
                </div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Chào mừng trở lại, {user.fullName}!
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6 }}>
                  {isAdmin
                    ? 'Bạn đang ở trang Quản trị viên. Bạn có quyền quản lý tài khoản, duyệt giáo viên và giám sát toàn bộ nền tảng.'
                    : isTeacher
                    ? 'Bạn đang ở chế độ Giáo viên. Tại đây bạn có thể quản lý danh sách lớp học, soạn câu hỏi và giao bài tập cho học sinh.'
                    : 'Bạn đang ở chế độ Học sinh. Hãy tiếp tục lộ trình HSK 1 hoặc tham gia lớp học bằng mã của giáo viên.'}
                </p>
              </div>

              <div className="animate-float" style={{ flexShrink: 0 }}>
                <PandaMascot size={80} />
              </div>
            </div>

            {/* Quick Action Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Card 1: HSK 1 Learning Path */}
              <div
                className="game-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
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
                      marginBottom: '16px',
                    }}
                  >
                    <BookOpen size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                    Lộ trình HSK 1 (Cơ bản)
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                    Khám phá kho từ vựng 150 từ cơ bản, nghe phát âm chuẩn pinyin và học các điểm ngữ pháp nền tảng.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-gamified btn-primary"
                  style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                >
                  <span>Vào học ngay</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Card 2: Classes / Lớp học */}
              <div
                className="game-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
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
                      marginBottom: '16px',
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                    {isTeacher ? 'Lớp học phụ trách' : 'Lớp học của tôi'}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {isTeacher
                      ? 'Tạo lớp học mới, cấp mã mời học sinh và theo dõi tiến độ nộp bài.'
                      : 'Nhập mã lớp để kết nối với giáo viên và nhận bài tập được giao mỗi ngày.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCreateClassClick}
                  className="btn-gamified btn-gold"
                  style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                >
                  <PlusCircle size={18} />
                  <span>{isTeacher ? 'Tạo lớp mới' : 'Tạo hoặc tham gia lớp'}</span>
                </button>
              </div>

              {/* Card 3: Teacher Upgrade or Streak */}
              {!isTeacher && !isAdmin && (
                <div
                  className="game-card"
                  style={{
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--jade-green-light)',
                        color: 'var(--jade-green-shadow)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <GraduationCap size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                      Nâng quyền Giáo viên
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                      Bạn là giáo viên tiếng Trung? Hãy đăng ký nâng quyền để tạo lớp học, soạn bài tập và quản lý học sinh.
                    </p>
                  </div>

                  {myTeacherRequest?.status === 'PENDING' ? (
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: 'var(--accent-gold-light)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        fontWeight: 800,
                        color: 'var(--accent-gold-shadow)',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Clock size={16} />
                      <span>Đang chờ xét duyệt</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTeacherModalOpen(true)}
                      className="btn-gamified btn-green"
                      style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                    >
                      <GraduationCap size={18} />
                      <span>Đăng ký làm giáo viên</span>
                    </button>
                  )}
                </div>
              )}

              {/* Card 4: Daily Streak */}
              {(isTeacher || isAdmin) && (
                <div
                  className="game-card"
                  style={{
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#ffedd5',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <Flame size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                      Chuỗi ngày học (Streak)
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                      Duy trì việc ôn tập từ vựng mỗi ngày để giữ ngọn lửa streak và tích lũy điểm kinh nghiệm XP!
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                    }}
                  >
                    Mục tiêu hôm nay: 1 bài học
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Teacher Request Modal (HTT-01-CN-002) */}
      <TeacherRequestModal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        token={user.token}
        onSuccess={(req) => setMyTeacherRequest(req)}
      />
    </div>
  )
}
