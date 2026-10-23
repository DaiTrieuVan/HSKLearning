import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Copy,
  Check,
  Flame,
  ArrowRight,
  PlusCircle,
  GraduationCap,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  LayoutDashboard,
  BookMarked,
  FileCheck,
  TrendingUp,
  BarChart3,
  BrainCircuit,
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Main Workspace Body */}
      <div style={{ width: '100%' }}>
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
                <div
                  className="game-card animate-fade-in"
                  style={{
                    maxWidth: '700px',
                    margin: '24px auto',
                    padding: '36px 32px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid var(--border-card)',
                    borderRadius: 'var(--radius-xl)',
                    textAlign: 'center',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <PandaMascot size={72} />
                  </div>

                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Chào mừng cô {user.fullName} đến với Không Gian Giáo Viên!
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 28px', lineHeight: 1.55 }}>
                    Hệ thống giúp quản lý học sinh, tự động chấm bài tập và lưu trữ câu hỏi. Hãy bắt đầu theo 3 bước sau:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', maxWidth: '540px', margin: '0 auto' }}>
                    {/* Bước 1: Nút tạo lớp duy nhất */ }
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '18px 20px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--accent-gold-light)',
                        border: '2px solid var(--accent-gold)',
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-gold-shadow)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          flexShrink: 0,
                        }}
                      >
                        1
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--accent-gold-shadow)' }}>
                            Tạo lớp học đầu tiên
                          </h3>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: '#ffffff', color: 'var(--accent-gold-shadow)' }}>
                            Bước bắt buộc
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0 0 14px', lineHeight: 1.5 }}>
                          Tạo lớp để nhận mã mời 6 ký tự. Cấp mã này cho học sinh để các em tự nhập và tham gia lớp học của cô.
                        </p>
                        <button
                          type="button"
                          onClick={() => navigate('/classes/create')}
                          className="btn-gamified btn-gold"
                          style={{ padding: '8px 20px', fontSize: '0.88rem' }}
                        >
                          <PlusCircle size={16} />
                          <span>Tạo lớp học đầu tiên</span>
                        </button>
                      </div>
                    </div>

                    {/* Bước 2: Locked */ }
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: '#f8fafc',
                        border: '1px dashed #cbd5e1',
                        opacity: 0.65,
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          flexShrink: 0,
                        }}
                      >
                        2
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-muted)' }}>
                            Chuẩn bị câu hỏi & Bộ từ vựng
                          </h3>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>(Mở sau khi có lớp)</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                          Soạn ngân hàng câu hỏi trắc nghiệm và kho từ vựng theo chuyên đề để chuẩn bị đề kiểm tra.
                        </p>
                      </div>
                    </div>

                    {/* Bước 3: Locked */ }
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '16px',
                        padding: '16px 20px',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: '#f8fafc',
                        border: '1px dashed #cbd5e1',
                        opacity: 0.65,
                      }}
                    >
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#94a3b8',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '0.95rem',
                          flexShrink: 0,
                        }}
                      >
                        3
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: 'var(--text-muted)' }}>
                            Đóng gói đề & Giao bài tập cho học sinh
                          </h3>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>(Mở sau khi có lớp)</span>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                          Giao bài tập có hạn nộp cho lớp học. Hệ thống sẽ tự động chấm điểm và thống kê tiến độ từng học sinh.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TRẠNG THÁI 2: ĐÃ CÓ LỚP HỌC (Hiển thị Số liệu, Cần xử lý ngay, Danh sách lớp) */
                <>
                  {/* 1. Hàng số liệu tổng quan */ }
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {/* Card 1: Số lớp đang phụ trách */ }
                    <div
                      className="game-card"
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#dbeafe',
                          color: '#1d4ed8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#1d4ed8', lineHeight: 1.1 }}>
                          {classesList.length}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Số lớp đang phụ trách
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Tổng số học sinh */ }
                    <div
                      className="game-card"
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#d1fae5',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Users size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', lineHeight: 1.1 }}>
                          {totalStudents}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Tổng số học sinh
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Bài tập đang mở */ }
                    <div
                      className="game-card"
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate('/exercises')}
                      title="Bấm để xem danh sách bài tập"
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: '#f3e8ff',
                          color: '#7e22ce',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <FileCheck size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#7e22ce', lineHeight: 1.1 }}>
                          {activeAssignments.length}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Bài tập đang mở
                        </div>
                      </div>
                    </div>

                    {/* Card 4: Bài tập cần xử lý / sắp hết hạn */ }
                    <div
                      className="game-card"
                      style={{
                        padding: '16px 20px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid var(--border-card)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: dueSoonAssignments.length > 0 ? '#fef3c7' : '#f1f5f9',
                          color: dueSoonAssignments.length > 0 ? '#d97706' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Clock size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, color: dueSoonAssignments.length > 0 ? '#d97706' : 'var(--text-main)', lineHeight: 1.1 }}>
                          {dueSoonAssignments.length}
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                          Bài tập cần xử lý
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Khối Cần xử lý ngay */ }
                  <div
                    className="game-card"
                    style={{
                      padding: '20px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      marginBottom: '28px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={20} style={{ color: dueSoonAssignments.length > 0 ? '#d97706' : 'var(--primary)' }} />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                          Cần xử lý ngay
                        </h3>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Trạng thái giảng dạy
                      </span>
                    </div>

                    {dueSoonAssignments.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {dueSoonAssignments.map((a) => {
                          const hoursLeft = Math.max(1, Math.round((new Date(a.dueTime).getTime() - Date.now()) / (1000 * 3600)))
                          return (
                            <div
                              key={a.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                backgroundColor: '#fffbeb',
                                border: '1px solid #fde68a',
                                borderRadius: 'var(--radius-md)',
                                gap: '12px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                                <div>
                                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#92400e' }}>
                                    {a.title} ({a.classTitle})
                                  </span>
                                  <span style={{ fontSize: '0.8rem', color: '#b45309', marginLeft: '8px' }}>
                                    Hết hạn sau {hoursLeft} giờ nữa
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => navigate(`/classes/${a.classId}`)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid #f59e0b',
                                  backgroundColor: '#ffffff',
                                  color: '#b45309',
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Xem bài nộp
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ) : classesWithoutAssignments.length > 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          backgroundColor: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileCheck size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e40af' }}>
                              Lớp &quot;{classesWithoutAssignments[0].title}&quot; chưa có bài tập nào đang mở
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#3b82f6', marginLeft: '8px' }}>
                              Hãy giao bài tập để học sinh có thể ôn luyện ngay.
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/exercises')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid #3b82f6',
                            backgroundColor: '#ffffff',
                            color: '#1d4ed8',
                            fontWeight: 800,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Giao bài tập
                        </button>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 16px',
                          backgroundColor: 'var(--jade-green-light)',
                          border: '1px solid #a7f3d0',
                          borderRadius: 'var(--radius-md)',
                          color: 'var(--jade-green-shadow)',
                          fontSize: '0.86rem',
                          fontWeight: 700,
                        }}
                      >
                        <CheckCircle2 size={18} />
                        <span>Tất cả bài tập và lớp học đều đang hoạt động tốt. Không có việc gấp cần xử lý hôm nay.</span>
                      </div>
                    )}
                  </div>

                  {/* 3. Danh sách lớp học đang phụ trách + 1 NÚT TẠO LỚP DUY NHẤT */ }
                  <div style={{ marginTop: '20px' }}>
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
                          Danh sách Lớp học đang phụ trách
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          Quản lý học sinh, mã mời 6 ký tự và trạng thái lớp.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/classes/create')}
                        className="btn-gamified btn-gold"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <PlusCircle size={16} />
                        <span>Tạo lớp mới</span>
                      </button>
                    </div>

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

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyCode(cls.joinCode)
                                }}
                                title="Bấm để sao chép mã mời lớp học"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '3px 8px',
                                  backgroundColor: copiedCode === cls.joinCode ? '#dcfce7' : '#f8fafc',
                                  border: copiedCode === cls.joinCode ? '1.5px solid #16a34a' : '1px solid var(--border-card)',
                                  borderRadius: 'var(--radius-sm)',
                                  fontFamily: 'monospace',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  letterSpacing: '1px',
                                  color: copiedCode === cls.joinCode ? '#15803d' : 'var(--text-main)',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
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
                {/* Top Quick Stats: Student Mode */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {/* Card 1: Tổng từ vựng */}
                  <div
                    className="game-card"
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BookOpen size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
                        {(srsSummary?.learningCount || 0) + (srsSummary?.masteredCount || 0)}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Tổng từ đang học
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Đã thuộc */}
                  <div
                    className="game-card"
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', lineHeight: 1.1 }}>
                        {srsSummary?.masteredCount || 0}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Từ vựng đã thuộc
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Cần ôn SRS */}
                  <div
                    className="game-card"
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/srs/review')}
                    title="Bấm để vào ôn từ SRS ngay"
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: (srsSummary?.dueTodayCount || 0) > 0 ? '#fee2e2' : '#f1f5f9',
                        color: (srsSummary?.dueTodayCount || 0) > 0 ? '#b91c1c' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BrainCircuit size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: (srsSummary?.dueTodayCount || 0) > 0 ? '#b91c1c' : 'var(--text-main)', lineHeight: 1.1 }}>
                        {srsSummary?.dueTodayCount || 0}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Từ cần ôn hôm nay
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Lớp học */}
                  <div
                    className="game-card"
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: '#dbeafe',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1d4ed8', lineHeight: 1.1 }}>
                        {classesList.length}
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        Lớp đã tham gia
                      </div>
                    </div>
                  </div>
                </div>

                {/* Daily Challenge Widget & Streak */}
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

                {/* Level Progress and XP History Card */}
                <LevelProgressCard
                  levelData={userLevel}
                  recentXp={recentXp}
                />

                {/* Student Feature Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {/* Card 1: HSK Roadmap */}
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
                        <BookMarked size={24} />
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                        Lộ trình học HSK
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                        Theo dõi tiến độ từ HSK 1 đến các cấp độ nâng cao, kiểm tra danh sách bài học và % hoàn thành bài học.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/roadmap')}
                      className="btn-gamified btn-green"
                      style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                    >
                      <span>Xem lộ trình HSK</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Card 1.5: Personal Progress */}
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
                          backgroundColor: '#ede9fe',
                          color: '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <TrendingUp size={24} />
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                        Tiến độ học cá nhân
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                        Theo dõi thống kê số bài học đã hoàn thành theo từng cấp độ HSK, số từ vựng tích lũy và điểm trung bình bài tập.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/progress')}
                      className="btn-gamified"
                      style={{
                        width: '100%',
                        fontSize: '0.92rem',
                        padding: '10px',
                        backgroundColor: '#6366f1',
                        color: '#ffffff',
                        border: 'none',
                      }}
                    >
                      <span>Xem tiến độ cá nhân</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Card 1.6: SRS Spaced Repetition */}
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
                        <BrainCircuit size={24} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                          Ôn từ theo lịch (SRS)
                        </h3>
                        {srsSummary && srsSummary.dueTodayCount > 0 ? (
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '3px 10px',
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              borderRadius: 'var(--radius-full)',
                              border: '1px solid #fca5a5',
                            }}
                          >
                            Cần ôn: {srsSummary.dueTodayCount} từ
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '3px 10px',
                              backgroundColor: 'var(--jade-green-light)',
                              color: 'var(--jade-green-shadow)',
                              borderRadius: 'var(--radius-full)',
                            }}
                          >
                            Đã ôn xong hôm nay
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                        {srsSummary && srsSummary.dueTodayCount > 0
                          ? `Bạn có ${srsSummary.dueTodayCount} từ vựng đến hạn cần ôn hôm nay theo thuật toán ngắt quãng SM-2.`
                          : 'Tuyệt vời! Bạn đã hoàn thành toàn bộ bài ôn hôm nay. Thuật toán SRS đã lên lịch cho các ngày tiếp theo.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/srs/review')}
                      className={`btn-gamified ${srsSummary && srsSummary.dueTodayCount > 0 ? 'btn-green' : ''}`}
                      style={{
                        width: '100%',
                        fontSize: '0.92rem',
                        padding: '10px',
                        backgroundColor: srsSummary && srsSummary.dueTodayCount > 0 ? undefined : '#f1f5f9',
                        color: srsSummary && srsSummary.dueTodayCount > 0 ? undefined : '#64748b',
                        border: srsSummary && srsSummary.dueTodayCount > 0 ? undefined : '1px solid #cbd5e1',
                      }}
                    >
                      <span>
                        {srsSummary && srsSummary.dueTodayCount > 0
                          ? `Bắt đầu ôn tập (${srsSummary.dueTodayCount} từ)`
                          : 'Xem lại lịch ôn tập SRS'}
                      </span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Card 2: Curriculum */}
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
                        Kho giáo trình & Từ vựng
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                        Khám phá kho từ vựng 150 từ cơ bản, nghe phát âm chuẩn pinyin và học các điểm ngữ pháp nền tảng.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/curriculum')}
                      className="btn-gamified btn-primary"
                      style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                    >
                      <span>Vào học giáo trình</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Card 3: Teacher Upgrade */}
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
                        onClick={() => navigate('/teacher-request')}
                        className="btn-gamified btn-green"
                        style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
                      >
                        <GraduationCap size={18} />
                        <span>Đăng ký làm giáo viên</span>
                      </button>
                    )}
                  </div>

                  {/* Card 4: Daily Streak */}
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
                </div>

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