import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Copy,
  Check,
  ArrowRight,
  PlusCircle,
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  LayoutDashboard,
  FileCheck,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PandaMascot } from '../../components/common/PandaMascot'
import { AdminTeacherReviewPanel } from '../../components/teacher/AdminTeacherReviewPanel'
import { AdminUserManagementPanel } from '../../components/admin/AdminUserManagementPanel'
import { AdminSystemStatsPanel } from '../../components/admin/AdminSystemStatsPanel'
import { getMyTeacherRequest, type TeacherRequestItem } from '../../api/teacherRequest'
import { getTeachingClasses, getEnrolledClasses, type ClassItem } from '../../api/classroom'
import { getAssignmentsForClass, type AssignmentItem } from '../../api/assignment'
import { getSrsSummary, type SrsSummary } from '../../api/srs'
import { getDailyChallenge, type DailyChallengeData } from '../../api/gamification'
import { getStreak, type StreakData } from '../../api/streak'
import { getUserLevel, getRecentXpHistory, type UserLevelData, type XpTransactionItem } from '../../api/gamificationLevel'
import { DailyChallengeWidget } from '../../components/gamification/DailyChallengeWidget'
import { LevelProgressCard } from '../../components/gamification/LevelProgressCard'
import { VocapyHeroTrio } from '../../components/dashboard/VocapyHeroTrio'
import { VocapyQuickActions } from '../../components/dashboard/VocapyQuickActions'
import { VocapyCurriculumHub } from '../../components/dashboard/VocapyCurriculumHub'

interface MainWorkspaceProps {
  onJoinClassClick?: () => void
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

    const [myTeacherRequest, setMyTeacherRequest] = useState<TeacherRequestItem | null>(null)
  const [actionAlert, setActionAlert] = useState<string | null>(null)
  const [activeAdminTab, setActiveAdminTab] = useState<'OVERVIEW' | 'SYSTEM_STATS' | 'TEACHER_REQUESTS' | 'USER_MANAGEMENT'>(
    user?.roles.includes('ADMIN') ? 'SYSTEM_STATS' : 'OVERVIEW'
  )

  // Classroom States
  const [classesList, setClassesList] = useState<ClassItem[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [srsSummary, setSrsSummary] = useState<SrsSummary | null>(null)
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeData | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(false)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevelData | null>(null)
  const [recentXp, setRecentXp] = useState<XpTransactionItem[]>([])
  const [teacherAssignments, setTeacherAssignments] = useState<AssignmentItem[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => {
      setCopiedCode(null)
    }, 2000)
  }

  const isTeacher = user?.activeMode === 'TEACHER'
  const isAdmin = user?.roles.includes('ADMIN')
  
  const loadClasses = () => {
    if (!user) return
    setLoadingClasses(true)
    if (user.activeMode === 'TEACHER') {
      getTeachingClasses(user.token)
        .then(async (res: ClassItem[]) => {
          setClassesList(res)
          if (res.length > 0) {
            try {
              const promises = res.map((c) =>
                getAssignmentsForClass(c.id, user.token).catch(() => [] as AssignmentItem[])
              )
              const assignmentArrays = await Promise.all(promises)
              setTeacherAssignments(assignmentArrays.flat())
            } catch {
              setTeacherAssignments([])
            }
          } else {
            setTeacherAssignments([])
          }
        })
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

  const loadSrsSummary = () => {
    if (user && !user.roles.includes('ADMIN')) {
      getSrsSummary(user.token)
        .then((res) => setSrsSummary(res))
        .catch(() => {})
    }
  }

  const loadDailyChallenge = () => {
    if (user && !user.roles.includes('ADMIN') && user.activeMode !== 'TEACHER') {
      setLoadingChallenge(true)
      getDailyChallenge(user.token)
        .then((res) => setDailyChallenge(res))
        .catch(() => {})
        .finally(() => setLoadingChallenge(false))
    }
  }

  const loadStreak = () => {
    if (user && !user.roles.includes('ADMIN') && user.activeMode !== 'TEACHER') {
      getStreak(user.token)
        .then((res) => setStreak(res))
        .catch(() => {})
    }
  }

  const loadLevelData = () => {
    if (user && !user.roles.includes('ADMIN') && user.activeMode !== 'TEACHER') {
      getUserLevel(user.token)
        .then((res) => setUserLevel(res))
        .catch(() => {})
      getRecentXpHistory(user.token)
        .then((res) => setRecentXp(res))
        .catch(() => {})
    }
  }

  useEffect(() => {
    if (user) {
            if (!user.roles.includes('TEACHER')) {
        getMyTeacherRequest(user.token)
          .then((res) => setMyTeacherRequest(res))
          .catch(() => {})
      }
      loadSrsSummary()
      loadDailyChallenge()
      loadStreak()
      loadLevelData()
      loadClasses()

      // HTT-08-CN-002..005: Tự động cập nhật số từ cần ôn, thử thách, streak & level khi quay lại trang chính
      const handleFocus = () => {
        loadSrsSummary()
        loadDailyChallenge()
        loadStreak()
        loadLevelData()
      }
      window.addEventListener('focus', handleFocus)
      document.addEventListener('visibilitychange', handleFocus)

      return () => {
        window.removeEventListener('focus', handleFocus)
        document.removeEventListener('visibilitychange', handleFocus)
      }
    }
  }, [user, user?.activeMode])

  if (!user) return null

  // Derived Teacher Metrics
  const totalStudents = classesList.reduce((acc, c) => acc + (c.memberCount || 0), 0)
  const activeAssignments = teacherAssignments.filter((a) => a.status === 'ACTIVE')
  const dueSoonAssignments = activeAssignments.filter((a) => {
    const diff = new Date(a.dueTime).getTime() - Date.now()
    return diff > 0 && diff < 48 * 3600 * 1000
  })
  const classesWithoutAssignments = classesList.filter(
    (c) => !teacherAssignments.some((a) => a.classId === c.id && a.status === 'ACTIVE')
  )



  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col">

      {/* Main Workspace Body */}
      <div className="w-full">
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
              <span>Tổng quan học tập</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveAdminTab('SYSTEM_STATS')}
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
                backgroundColor: activeAdminTab === 'SYSTEM_STATS' ? 'var(--primary)' : '#f1f5f9',
                color: activeAdminTab === 'SYSTEM_STATS' ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              <BarChart3 size={16} />
              <span>Thống kê hệ thống</span>
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

        {/* Admin Tab View */}
        {isAdmin && activeAdminTab === 'SYSTEM_STATS' ? (
          <AdminSystemStatsPanel token={user.token} />
        ) : isAdmin && activeAdminTab === 'TEACHER_REQUESTS' ? (
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
                  onClick={() => navigate('/teacher-request')}
                  className="btn-gamified btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', flexShrink: 0 }}
                >
                  Gửi yêu cầu mới
                </button>
              </div>
            )}

            {/* ========================================================
                PHÂN VÙNG 1: KHÔNG GIAN GIÁO VIÊN (activeMode === 'TEACHER')
               ======================================================== */}
            {isTeacher ? (
              classesList.length === 0 ? (
                /* TRẠNG THÁI 1: CHƯA CÓ LỚP HỌC (Onboarding 3 bước duy nhất) */
                <div className="game-card animate-fade-in max-w-[700px] mx-auto my-2 sm:my-6 p-5 sm:p-8 bg-white border-[1.5px] border-[var(--border-card)] rounded-[var(--radius-xl)] text-center shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                  <div className="mb-3 sm:mb-4 flex justify-center">
                    <PandaMascot size={64} />
                  </div>

                  <h2 className="text-lg sm:text-[1.4rem] font-black text-[var(--text-main)] mb-2 leading-snug">
                    Chào mừng cô {user.fullName} đến với Không Gian Giáo Viên!
                  </h2>
                  <p className="text-xs sm:text-[0.9rem] text-[var(--text-muted)] max-w-[500px] mx-auto mb-6 leading-relaxed">
                    Hệ thống giúp quản lý học sinh, tự động chấm bài tập và lưu trữ câu hỏi. Hãy bắt đầu theo 3 bước sau:
                  </p>

                  <div className="flex flex-col gap-3.5 text-left max-w-[540px] mx-auto">
                    {/* Bước 1: Nút tạo lớp duy nhất */}
                    <div
                      className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-[var(--radius-lg)]"
                      style={{
                        backgroundColor: 'var(--accent-gold-light)',
                        border: '2px solid var(--accent-gold)',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-black text-sm shrink-0"
                        style={{ backgroundColor: 'var(--accent-gold-shadow)' }}
                      >
                        1
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-sm sm:text-base font-extrabold m-0" style={{ color: 'var(--accent-gold-shadow)' }}>
                            Tạo lớp học đầu tiên
                          </h3>
                          <span
                            className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white whitespace-nowrap"
                            style={{ color: 'var(--accent-gold-shadow)' }}
                          >
                            Bước bắt buộc
                          </span>
                        </div>
                        <p className="text-xs sm:text-[0.85rem] text-[var(--text-main)] m-0 mb-3.5 leading-relaxed">
                          Tạo lớp để nhận mã mời 6 ký tự. Cấp mã này cho học sinh để các em tự nhập và tham gia lớp học của cô.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('/classes/create')}
                          className="btn-gamified btn-gold w-full sm:w-auto justify-center px-5 py-2 text-xs sm:text-sm whitespace-nowrap"
                        >
                          <PlusCircle size={16} />
                          <span>Tạo lớp học đầu tiên</span>
                        </button>
                      </div>
                    </div>

                    {/* Bước 2: Locked */}
                    <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:px-5 rounded-[var(--radius-lg)] bg-slate-50 border border-dashed border-slate-300 opacity-65">
                      <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center font-black text-sm shrink-0">
                        2
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <h3 className="text-sm sm:text-[0.95rem] font-extrabold m-0 text-[var(--text-muted)]">
                            Chuẩn bị câu hỏi & Bộ từ vựng
                          </h3>
                          <span className="text-[11px] text-slate-500 font-bold">(Mở sau khi có lớp)</span>
                        </div>
                        <p className="text-xs sm:text-[0.82rem] text-[var(--text-muted)] m-0 leading-snug">
                          Soạn ngân hàng câu hỏi trắc nghiệm và kho từ vựng theo chuyên đề để chuẩn bị đề kiểm tra.
                        </p>
                      </div>
                    </div>

                    {/* Bước 3: Locked */}
                    <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:px-5 rounded-[var(--radius-lg)] bg-slate-50 border border-dashed border-slate-300 opacity-65">
                      <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center font-black text-sm shrink-0">
                        3
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <h3 className="text-sm sm:text-[0.95rem] font-extrabold m-0 text-[var(--text-muted)]">
                            Đóng gói đề & Giao bài tập cho học sinh
                          </h3>
                          <span className="text-[11px] text-slate-500 font-bold">(Mở sau khi có lớp)</span>
                        </div>
                        <p className="text-xs sm:text-[0.82rem] text-[var(--text-muted)] m-0 leading-snug">
                          Giao bài tập có hạn nộp cho lớp học. Hệ thống sẽ tự động chấm điểm và thống kê tiến độ từng học sinh.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TRẠNG THÁI 2: ĐÃ CÓ LỚP HỌC (Hiển thị Số liệu, Cần xử lý ngay, Danh sách lớp) */
                <>
                  {/* 1. Hàng số liệu tổng quan */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
                    {[
                      {
                        label: 'Số lớp đang phụ trách',
                        value: classesList.length,
                        iconBg: '#dbeafe',
                        iconColor: '#1d4ed8',
                        valueColor: '#1d4ed8',
                        icon: <GraduationCap size={20} />,
                      },
                      {
                        label: 'Tổng số học sinh',
                        value: totalStudents,
                        iconBg: '#d1fae5',
                        iconColor: '#059669',
                        valueColor: '#059669',
                        icon: <Users size={20} />,
                      },
                      {
                        label: 'Bài tập đang mở',
                        value: activeAssignments.length,
                        iconBg: '#f3e8ff',
                        iconColor: '#7e22ce',
                        valueColor: '#7e22ce',
                        icon: <FileCheck size={20} />,
                        onClick: () => navigate('/exercises'),
                        title: 'Bấm để xem danh sách bài tập',
                      },
                      {
                        label: 'Bài tập cần xử lý',
                        value: dueSoonAssignments.length,
                        iconBg: dueSoonAssignments.length > 0 ? '#fef3c7' : '#f1f5f9',
                        iconColor: dueSoonAssignments.length > 0 ? '#d97706' : '#64748b',
                        valueColor: dueSoonAssignments.length > 0 ? '#d97706' : 'var(--text-main)',
                        icon: <Clock size={20} />,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`game-card p-3.5 sm:px-5 sm:py-4 bg-white border-[1.5px] border-[var(--border-card)] flex items-center gap-2.5 sm:gap-3.5 ${stat.onClick ? 'cursor-pointer' : ''}`}
                        onClick={stat.onClick}
                        title={stat.title}
                      >
                        <div
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
                          style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
                        >
                          {stat.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-lg sm:text-2xl font-black leading-tight" style={{ color: stat.valueColor }}>
                            {stat.value}
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold text-[var(--text-muted)] leading-snug">
                            {stat.label}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2. Khối Cần xử lý ngay */}
                  <div className="game-card p-4 sm:p-5 bg-white border-[1.5px] border-[var(--border-card)] mb-5 sm:mb-7">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={18} style={{ color: dueSoonAssignments.length > 0 ? '#d97706' : 'var(--primary)' }} />
                        <h3 className="text-sm sm:text-base font-extrabold m-0 text-[var(--text-main)]">
                          Cần xử lý ngay
                        </h3>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-semibold">
                        Trạng thái giảng dạy
                      </span>
                    </div>

                    {dueSoonAssignments.length > 0 ? (
                      <div className="flex flex-col gap-2.5">
                        {dueSoonAssignments.map((a) => {
                          const hoursLeft = Math.max(1, Math.round((new Date(a.dueTime).getTime() - Date.now()) / (1000 * 3600)))
                          return (
                            <div
                              key={a.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 rounded-[var(--radius-md)]"
                              style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
                            >
                              <div className="flex items-start gap-2.5 min-w-0">
                                <Clock size={18} className="shrink-0 mt-0.5" style={{ color: '#d97706' }} />
                                <div className="min-w-0">
                                  <div className="font-extrabold text-[0.84rem] sm:text-[0.88rem] text-[#92400e] leading-snug">
                                    {a.title} ({a.classTitle})
                                  </div>
                                  <div className="text-xs text-[#b45309] mt-0.5 leading-snug">
                                    Hết hạn sau {hoursLeft} giờ nữa
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigate(`/classes/${a.classId}`)}
                                className="self-stretch sm:self-auto shrink-0 px-3 py-2 sm:py-1.5 rounded-[var(--radius-sm)] bg-white font-extrabold text-xs cursor-pointer whitespace-nowrap text-center"
                                style={{ border: '1px solid #f59e0b', color: '#b45309' }}
                              >
                                Xem bài nộp
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : classesWithoutAssignments.length > 0 ? (
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:px-4 rounded-[var(--radius-md)]"
                        style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <FileCheck size={18} className="shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
                          <div className="min-w-0">
                            <div className="font-extrabold text-[0.84rem] sm:text-[0.88rem] text-[#1e40af] leading-snug">
                              Lớp &quot;{classesWithoutAssignments[0].title}&quot; chưa có bài tập nào đang mở
                            </div>
                            <div className="text-xs text-[#3b82f6] mt-0.5 leading-snug">
                              Hãy giao bài tập để học sinh có thể ôn luyện ngay.
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/exercises')}
                          className="self-stretch sm:self-auto shrink-0 px-3 py-2 sm:py-1.5 rounded-[var(--radius-sm)] bg-white font-extrabold text-xs cursor-pointer whitespace-nowrap text-center"
                          style={{ border: '1px solid #3b82f6', color: '#1d4ed8' }}
                        >
                          Giao bài tập
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex items-start sm:items-center gap-2.5 p-3 sm:px-4 rounded-[var(--radius-md)] text-xs sm:text-sm font-bold leading-snug"
                        style={{
                          backgroundColor: 'var(--jade-green-light)',
                          border: '1px solid #a7f3d0',
                          color: 'var(--jade-green-shadow)',
                        }}
                      >
                        <CheckCircle2 size={18} className="shrink-0 mt-0.5 sm:mt-0" />
                        <span>Tất cả bài tập và lớp học đều đang hoạt động tốt. Không có việc gấp cần xử lý hôm nay.</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Danh sách lớp học đang phụ trách + 1 NÚT TẠO LỚP DUY NHẤT */}
                  <div className="mt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <h2 className="text-base sm:text-xl font-extrabold text-[var(--text-main)] m-0 leading-snug">
                          Danh sách Lớp học đang phụ trách
                        </h2>
                        <p className="mt-1 mb-0 text-xs sm:text-[0.85rem] text-[var(--text-muted)]">
                          Quản lý học sinh, mã mời 6 ký tự và trạng thái lớp.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/classes/create')}
                        className="btn-gamified btn-gold self-start sm:self-auto shrink-0 whitespace-nowrap px-4 py-2 text-xs sm:text-sm"
                      >
                        <PlusCircle size={16} />
                        <span>Tạo lớp mới</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {classesList.map((cls) => (
                        <div
                          key={cls.id}
                          className="game-card p-4 sm:p-5 bg-white flex flex-col justify-between"
                          style={{
                            borderLeft: cls.status === 'ARCHIVED' ? '4px solid #94a3b8' : '4px solid var(--primary)',
                          }}
                        >
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                              <span
                                className="text-[11px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap"
                                style={{
                                  backgroundColor: cls.status === 'ARCHIVED' ? '#f1f5f9' : 'var(--primary-light)',
                                  color: cls.status === 'ARCHIVED' ? '#64748b' : 'var(--primary)',
                                }}
                              >
                                {cls.status === 'ARCHIVED' ? 'ĐÃ LƯU TRỮ' : 'HOẠT ĐỘNG'}
                              </span>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyCode(cls.joinCode)
                                }}
                                title="Bấm để sao chép mã mời lớp học"
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[var(--radius-sm)] font-mono font-extrabold text-xs tracking-wide cursor-pointer whitespace-nowrap transition-all"
                                style={{
                                  backgroundColor: copiedCode === cls.joinCode ? '#dcfce7' : '#f8fafc',
                                  border: copiedCode === cls.joinCode ? '1.5px solid #16a34a' : '1px solid var(--border-card)',
                                  color: copiedCode === cls.joinCode ? '#15803d' : 'var(--text-main)',
                                }}
                              >
                                {copiedCode === cls.joinCode ? (
                                  <>
                                    <Check size={13} style={{ color: '#16a34a' }} />
                                    <span>Đã chép</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={13} style={{ color: '#64748b' }} />
                                    <span>Mã: {cls.joinCode}</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <h3 className="text-sm sm:text-base font-extrabold text-[var(--text-main)] mb-1 leading-snug">
                              {cls.title}
                            </h3>
                            <p className="text-xs sm:text-[0.82rem] text-[var(--text-muted)] leading-relaxed mb-3 sm:min-h-[2.4em]">
                              {cls.description || 'Không có mô tả'}
                            </p>
                          </div>

                          <div className="flex justify-between items-center gap-2 pt-2.5 border-t border-slate-100">
                            <span className="text-xs font-bold text-[var(--text-muted)]">
                              {cls.memberCount} học viên
                            </span>

                            <button
                              type="button"
                              onClick={() => navigate(`/classes/${cls.id}`)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[var(--radius-md)] border border-[var(--border-card)] bg-white text-[var(--primary)] text-xs font-extrabold cursor-pointer whitespace-nowrap"
                            >
                              <span>Quản lý</span>
                              <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )
            ) : (
              /* ========================================================
                  PHÂN VÙNG 2: KHÔNG GIAN HỌC SINH (!isTeacher && !isAdmin)
                 ======================================================== */
              <>
                {/* 1. VOCAPY HERO TRIO (Mascot Greeting + 4 Stats Matrix + Orange Streak Card) */}
                <VocapyHeroTrio
                  fullName={user?.fullName || ''}
                  srsSummary={srsSummary}
                  streak={streak}
                  userLevel={userLevel}
                  onNavigate={navigate}
                />

                {/* 2. VOCAPY QUICK ACTIONS (4 Action Shortcuts) */}
                <VocapyQuickActions onNavigate={navigate} />

                {/* 3. VOCAPY CURRICULUM HUB (Categorized Roadmap with Difficulty Meters) */}
                <VocapyCurriculumHub onNavigate={navigate} />

                {/* 4. Gamification Daily Challenge & Level Progress */}
                <div style={{ marginTop: '32px' }}>
                  <DailyChallengeWidget
                    data={dailyChallenge}
                    streak={streak}
                    loading={loadingChallenge}
                    onRefresh={() => {
                      loadDailyChallenge()
                      loadStreak()
                      loadLevelData()
                    }}
                  />

                  <LevelProgressCard
                    levelData={userLevel}
                    recentXp={recentXp}
                  />
                </div>

                {/* 5. Nâng quyền Giáo viên (Callout cho học viên nếu chưa là giáo viên) */}
                {!user?.roles.includes('TEACHER') && (
                  <div
                    className="game-card"
                    style={{
                      marginTop: '24px',
                      padding: '20px 24px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px', flex: 1 }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--jade-green-light)',
                          color: 'var(--jade-green-shadow)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>
                          Bạn là Giáo viên Tiếng Trung?
                        </h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                          Đăng ký nâng quyền để tạo lớp học, giao bài tập tự động chấm điểm và theo dõi tiến độ từng học viên.
                        </p>
                      </div>
                    </div>

                    {myTeacherRequest?.status === 'PENDING' ? (
                      <div
                        style={{
                          padding: '8px 16px',
                          backgroundColor: 'var(--accent-gold-light)',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 800,
                          color: 'var(--accent-gold-shadow)',
                          fontSize: '0.84rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Clock size={16} />
                        <span>Đang chờ xét duyệt</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/teacher-request')}
                        className="btn-gamified btn-green"
                        style={{ padding: '9px 18px', fontSize: '0.85rem' }}
                      >
                        <GraduationCap size={16} />
                        <span>Đăng ký làm giáo viên</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Student Classroom Section */}
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
                        Lớp học của bạn
                      </h2>
                      <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Các lớp bạn đã tham gia cùng thầy cô và bạn bè.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/classes/join')}
                      className="btn-gamified btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      <PlusCircle size={16} />
                      <span>Tham gia lớp bằng mã</span>
                    </button>
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
                        Bạn chưa tham gia lớp học nào
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 16px' }}>
                        Hãy liên hệ giáo viên để lấy mã lớp (6 ký tự) và tham gia học tập.
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/classes/join')}
                        className="btn-gamified btn-primary"
                        style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                      >
                        Nhập mã vào lớp
                      </button>
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
                              onClick={() => navigate(`/classes/${cls.id}`)}
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
                              <span>Chi tiết</span>
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
          </>
        )}
      </div>
    </div>
  )
}