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
  Users,
  LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PandaMascot } from '../../components/common/PandaMascot'
import { TeacherRequestModal } from '../../components/teacher/TeacherRequestModal'
import { AdminTeacherReviewPanel } from '../../components/teacher/AdminTeacherReviewPanel'
import { AdminUserManagementPanel } from '../../components/admin/AdminUserManagementPanel'
import { UserProfileModal } from '../../components/profile/UserProfileModal'
import { CreateClassModal } from '../../components/classroom/CreateClassModal'
import { JoinClassModal } from '../../components/classroom/JoinClassModal'
import { ClassDetailModal } from '../../components/classroom/ClassDetailModal'
import { HskCurriculumModal } from '../../components/content/HskCurriculumModal'
import { getMyTeacherRequest, type TeacherRequestItem } from '../../api/teacherRequest'
import { getTeachingClasses, getEnrolledClasses, type ClassItem } from '../../api/classroom'

interface MainWorkspaceProps {
  onJoinClassClick?: () => void
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = () => {
  const { user, logout, switchMode } = useAuth()

  // State for teacher upgrade request
  const [teacherModalOpen, setTeacherModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [currentUserName, setCurrentUserName] = useState(user?.fullName || '')
  const [myTeacherRequest, setMyTeacherRequest] = useState<TeacherRequestItem | null>(null)
  const [actionAlert, setActionAlert] = useState<string | null>(null)
  const [activeAdminTab, setActiveAdminTab] = useState<'OVERVIEW' | 'TEACHER_REQUESTS' | 'USER_MANAGEMENT'>('OVERVIEW')

  // Content States (HTT-03)
  const [hskCurriculumModalOpen, setHskCurriculumModalOpen] = useState(false)

  // Classroom States (HTT-02)
  const [createClassModalOpen, setCreateClassModalOpen] = useState(false)
  const [joinClassModalOpen, setJoinClassModalOpen] = useState(false)
  const [selectedClassroom, setSelectedClassroom] = useState<ClassItem | null>(null)
  const [classesList, setClassesList] = useState<ClassItem[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)

  const isTeacher = user?.activeMode === 'TEACHER'
  const isAdmin = user?.roles.includes('ADMIN')
  const hasMultipleRoles = user ? user.roles.includes('TEACHER') && user.roles.includes('STUDENT') : false

  const loadClasses = () => {
    if (!user) return
    setLoadingClasses(true)
    if (user.activeMode === 'TEACHER') {
      getTeachingClasses(user.token)
        .then((res: ClassItem[]) => setClassesList(res))
        .catch(() => {})
        .finally(() => setLoadingClasses(false))
    } else if (!user.roles.includes('ADMIN')) {
      getEnrolledClasses(user.token)
        .then((res: ClassItem[]) => setClassesList(res))
        .catch(() => {})
        .finally(() => setLoadingClasses(false))
    } else {
      setLoadingClasses(false)
    }
  }

  useEffect(() => {
    if (user) {
      setCurrentUserName(user.fullName)
      if (!user.roles.includes('TEACHER')) {
        getMyTeacherRequest(user.token)
          .then((res) => setMyTeacherRequest(res))
          .catch(() => {})
      }
      loadClasses()
    }
  }, [user, user?.activeMode])

  if (!user) return null

  const handleCreateClassClick = () => {
    if (isTeacher) {
      setCreateClassModalOpen(true)
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

  const handleJoinClassClick = () => {
    setJoinClassModalOpen(true)
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

          {/* User Profile Badge (HTT-01-CN-006: Click to edit profile / change password) */}
          <div
            onClick={() => setProfileModalOpen(true)}
            title="Bấm để xem & chỉnh sửa hồ sơ cá nhân"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#f8fafc',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--border-card)',
              cursor: 'pointer',
              transition: 'all 0.2s',
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
                {currentUserName}
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
        {/* Admin Navigation Tabs (HTT-01-CN-003 & HTT-01-CN-008) */}
        {isAdmin && (
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '24px',
              borderBottom: '2px solid var(--border-card)',
              paddingBottom: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveAdminTab('OVERVIEW')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: activeAdminTab === 'OVERVIEW' ? 'var(--primary)' : '#f1f5f9',
                color: activeAdminTab === 'OVERVIEW' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <LayoutDashboard size={16} />
              <span>Tổng quan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('TEACHER_REQUESTS')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: activeAdminTab === 'TEACHER_REQUESTS' ? 'var(--primary)' : '#f1f5f9',
                color: activeAdminTab === 'TEACHER_REQUESTS' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <GraduationCap size={16} />
              <span>Duyệt giáo viên</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('USER_MANAGEMENT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                backgroundColor: activeAdminTab === 'USER_MANAGEMENT' ? 'var(--primary)' : '#f1f5f9',
                color: activeAdminTab === 'USER_MANAGEMENT' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <Users size={16} />
              <span>Quản lý người dùng</span>
            </button>
          </div>
        )}

        {/* Admin Tab View: Teacher Review Panel (HTT-01-CN-003) & User Management (HTT-01-CN-008) */}
        {isAdmin && activeAdminTab === 'TEACHER_REQUESTS' ? (
          <AdminTeacherReviewPanel token={user.token} />
        ) : isAdmin && activeAdminTab === 'USER_MANAGEMENT' ? (
          <AdminUserManagementPanel token={user.token} currentUserId={user.id} />
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
                  onClick={() => setHskCurriculumModalOpen(true)}
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

                {isTeacher ? (
                  <button
                    type="button"
                    onClick={handleCreateClassClick}
                    className="btn-gamified btn-gold"
                    style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                  >
                    <PlusCircle size={18} />
                    <span>Tạo lớp học mới</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleJoinClassClick}
                    className="btn-gamified btn-gold"
                    style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                  >
                    <PlusCircle size={18} />
                    <span>Tham gia lớp bằng mã</span>
                  </button>
                )}
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

            {/* Classroom Section (HTT-02) */}
            <div style={{ marginTop: '36px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    {isTeacher ? 'Danh sách Lớp học đang phụ trách' : 'Lớp học của bạn'}
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {isTeacher
                      ? 'Quản lý học sinh, mã mời 6 ký tự và trạng thái lớp.'
                      : 'Các lớp bạn đã tham gia cùng thầy cô và bạn bè.'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {isTeacher ? (
                    <button
                      type="button"
                      onClick={() => setCreateClassModalOpen(true)}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <PlusCircle size={16} />
                      <span>Tạo lớp mới</span>
                    </button>
                  ) : !isAdmin ? (
                    <button
                      type="button"
                      onClick={() => setJoinClassModalOpen(true)}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <PlusCircle size={16} />
                      <span>Tham gia lớp bằng mã</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {loadingClasses ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Đang tải danh sách lớp học...
                </div>
              ) : classesList.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px dashed var(--border-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '36px 20px',
                    textAlign: 'center',
                  }}
                >
                  <PandaMascot size={56} />
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginTop: '12px', marginBottom: '6px' }}>
                    {isTeacher ? 'Chưa có lớp học nào' : 'Bạn chưa tham gia lớp học nào'}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
                    {isTeacher
                      ? 'Hãy tạo lớp đầu tiên để nhận mã mời 6 ký tự và bắt đầu thêm học sinh.'
                      : 'Hãy liên hệ giáo viên để lấy mã lớp (6 ký tự) và tham gia học tập.'}
                  </p>
                  {isTeacher ? (
                    <button
                      type="button"
                      onClick={() => setCreateClassModalOpen(true)}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      Tạo lớp đầu tiên
                    </button>
                  ) : !isAdmin ? (
                    <button
                      type="button"
                      onClick={() => setJoinClassModalOpen(true)}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                    >
                      Nhập mã vào lớp
                    </button>
                  ) : null}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {classesList.map((cls) => (
                    <div
                      key={cls.id}
                      className="game-card"
                      style={{
                        padding: '18px 20px',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderLeft: cls.status === 'ARCHIVED' ? '4px solid #94a3b8' : '4px solid var(--primary)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: cls.status === 'ARCHIVED' ? '#f1f5f9' : 'var(--primary-light)',
                              color: cls.status === 'ARCHIVED' ? '#64748b' : 'var(--primary)',
                            }}
                          >
                            {cls.status === 'ARCHIVED' ? 'ĐÃ LƯU TRỮ' : 'HOẠT ĐỘNG'}
                          </span>

                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '2px 8px',
                              backgroundColor: '#f8fafc',
                              border: '1px solid var(--border-card)',
                              borderRadius: 'var(--radius-sm)',
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              letterSpacing: '1px',
                              color: 'var(--text-main)',
                            }}
                          >
                            <span>Mã: {cls.joinCode}</span>
                          </div>
                        </div>

                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                          {cls.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.4,
                            marginBottom: '12px',
                            minHeight: '2.4em',
                          }}
                        >
                          {cls.description || 'Không có mô tả'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          {cls.memberCount} học viên
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedClassroom(cls)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-card)',
                            backgroundColor: '#ffffff',
                            color: 'var(--primary)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          <span>{isTeacher ? 'Quản lý' : 'Chi tiết'}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
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

      {/* User Profile Modal (HTT-01-CN-006) */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        token={user.token}
        currentName={currentUserName}
        currentEmail={user.email}
        onProfileUpdated={(updated) => {
          setCurrentUserName(updated.fullName)
        }}
      />

      {/* Create Class Modal (HTT-02-CN-001) */}
      <CreateClassModal
        isOpen={createClassModalOpen}
        onClose={() => setCreateClassModalOpen(false)}
        token={user.token}
        onClassCreated={() => loadClasses()}
      />

      {/* Join Class Modal (HTT-02-CN-002) */}
      <JoinClassModal
        isOpen={joinClassModalOpen}
        onClose={() => setJoinClassModalOpen(false)}
        token={user.token}
        onClassJoined={() => loadClasses()}
      />

      {/* Class Detail Modal (HTT-02-CN-003 đến 009) */}
      <ClassDetailModal
        isOpen={Boolean(selectedClassroom)}
        classroom={selectedClassroom}
        token={user.token}
        isTeacher={isTeacher}
        onClose={() => setSelectedClassroom(null)}
        onClassUpdated={() => {
          loadClasses()
          setSelectedClassroom(null)
        }}
      />

      {/* HSK Curriculum & Learning Modal (HTT-03) */}
      <HskCurriculumModal
        isOpen={hskCurriculumModalOpen}
        onClose={() => setHskCurriculumModalOpen(false)}
        token={user.token}
        isTeacher={isTeacher}
      />
    </div>
  )
}
