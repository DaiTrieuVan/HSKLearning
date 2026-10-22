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
    <header
      style={{
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1.5px solid var(--border-card)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left: Mobile hamburger & Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {onToggleMobileSidebar && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            style={{
              display: 'none',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-card)',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
            }}
            className="mobile-hamburger-btn"
          >
            <Menu size={20} />
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
            Xin chào,
          </span>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {user?.fullName || 'Bạn học'}
          </span>
          <span
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
        </div>
      </div>

      {/* Right: Gamification Badges & Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Switch Mode if Teacher & Student */}
        {hasMultipleRoles && !isAdmin && (
          <button
            type="button"
            onClick={() => switchMode(isTeacher ? 'STUDENT' : 'TEACHER')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: isTeacher ? 'var(--primary-light)' : '#fef3c7',
              border: isTeacher ? '1.5px solid var(--primary)' : '1.5px solid #f59e0b',
              color: isTeacher ? 'var(--primary)' : '#b45309',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title={isTeacher ? 'Chuyển sang giao diện Học sinh' : 'Chuyển sang giao diện Giáo viên'}
          >
            {isTeacher ? <GraduationCap size={15} /> : <BookOpen size={15} />}
            <span>{isTeacher ? 'Chế độ Học sinh' : 'Chế độ Giáo viên'}</span>
            <ArrowRight size={13} />
          </button>
        )}

        {/* Streak Badge */}
        {streak && (
          <div
            title={`Chuỗi học tập liên tục: ${streak.currentStreak} ngày!`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: streak.completedToday ? '#ffedd5' : '#f1f5f9',
              border: streak.completedToday ? '1.5px solid #fb923c' : '1px solid #cbd5e1',
              color: streak.completedToday ? '#c2410c' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 800,
            }}
          >
            <Flame size={16} style={{ color: streak.completedToday ? '#ea580c' : '#94a3b8' }} />
            <span>{streak.currentStreak} ngày</span>
          </div>
        )}

        {/* Level Badge */}
        {!isTeacher && !isAdmin && userLevel && (
          <div
            onClick={() => navigate('/progress')}
            title={`Cấp ${userLevel.currentLevel}: ${userLevel.title}. Bấm xem tiến trình.`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#fef3c7',
              border: '1.5px solid #f59e0b',
              color: '#92400e',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            <Award size={16} style={{ color: '#d97706' }} />
            <span>Cấp {userLevel.currentLevel}: {userLevel.title}</span>
          </div>
        )}
      </div>
    </header>
  )
}
