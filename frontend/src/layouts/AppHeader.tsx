import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flame,
  Award,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Menu,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { StreakData } from '../api/streak'
import type { UserLevelData } from '../api/gamificationLevel'

interface AppHeaderProps {
  streak?: StreakData | null
  userLevel?: UserLevelData | null
  onToggleMobileSidebar?: () => void
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  streak,
  userLevel,
  onToggleMobileSidebar,
}) => {
  const { user, switchMode } = useAuth()
  const navigate = useNavigate()

  const isTeacher = user?.activeMode === 'TEACHER'
  const isAdmin = user?.roles.includes('ADMIN')
  const hasMultipleRoles = user ? user.roles.includes('TEACHER') && user.roles.includes('STUDENT') : false

  return (
    <header className="print:hidden h-14 sm:h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2 sticky top-0 z-30">
      {/* Left: Mobile/Tablet hamburger & Greeting */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shrink-0"
            aria-label="Mở menu điều hướng"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="hidden sm:inline text-sm text-slate-500 shrink-0">
            Xin chào,
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
            {user?.fullName || 'Bạn học'}
          </span>
          <span
            className="hidden sm:inline-flex shrink-0"
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isAdmin ? '#fee2e2' : isTeacher ? '#fef3c7' : 'var(--primary-light)',
              color: isAdmin ? '#991b1b' : isTeacher ? '#b45309' : 'var(--primary)',
            }}
          >
            {isAdmin ? 'ADMIN' : isTeacher ? 'GIÁO VIÊN' : 'HỌC SINH'}
          </span>
          <span
            className="hidden md:inline-flex items-center gap-1 shrink-0"
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--jade-green-shadow)',
              backgroundColor: 'var(--jade-green-light)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
            }}
            title="Phiên làm việc đang hoạt động và đồng bộ"
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--jade-green)' }} />
            Đang hoạt động
          </span>
        </div>
      </div>

      {/* Right: Gamification Badges & Mode Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Switch Mode if Teacher & Student */}
        {hasMultipleRoles && !isAdmin && (
          <button
            type="button"
            onClick={() => switchMode(isTeacher ? 'STUDENT' : 'TEACHER')}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold cursor-pointer transition-all"
            style={{
              backgroundColor: isTeacher ? 'var(--primary-light)' : '#fef3c7',
              border: isTeacher ? '1.5px solid var(--primary)' : '1.5px solid #f59e0b',
              color: isTeacher ? 'var(--primary)' : '#b45309',
            }}
            title={isTeacher ? 'Chuyển sang giao diện Học sinh' : 'Chuyển sang giao diện Giáo viên'}
          >
            {isTeacher ? <GraduationCap size={14} /> : <BookOpen size={14} />}
            <span className="hidden sm:inline">{isTeacher ? 'Chế độ Học sinh' : 'Chế độ Giáo viên'}</span>
            <span className="sm:hidden">{isTeacher ? 'Học sinh' : 'Giáo viên'}</span>
            <ArrowRight size={12} className="hidden sm:inline" />
          </button>
        )}

        {/* Streak Badge */}
        {streak && !isTeacher && !isAdmin && (
          <div
            title={`Chuỗi học tập liên tục: ${streak.currentStreak} ngày!`}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-[0.82rem] font-extrabold shrink-0"
            style={{
              backgroundColor: streak.completedToday ? '#ffedd5' : '#f1f5f9',
              border: streak.completedToday ? '1.5px solid #fb923c' : '1px solid #cbd5e1',
              color: streak.completedToday ? '#c2410c' : '#64748b',
            }}
          >
            <Flame size={15} style={{ color: streak.completedToday ? '#ea580c' : '#94a3b8' }} />
            <span>{streak.currentStreak}</span>
            <span className="hidden sm:inline">ngày</span>
          </div>
        )}

        {/* Level Badge */}
        {!isTeacher && !isAdmin && userLevel && (
          <div
            onClick={() => navigate('/progress')}
            title={`Cấp ${userLevel.currentLevel}: ${userLevel.title}. Bấm xem tiến trình.`}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-[0.82rem] font-extrabold cursor-pointer shrink-0"
            style={{
              backgroundColor: '#fef3c7',
              border: '1.5px solid #f59e0b',
              color: '#92400e',
            }}
          >
            <Award size={15} style={{ color: '#d97706' }} />
            <span>Cấp {userLevel.currentLevel}</span>
            <span className="hidden sm:inline">: {userLevel.title}</span>
          </div>
        )}
      </div>
    </header>
  )
}
