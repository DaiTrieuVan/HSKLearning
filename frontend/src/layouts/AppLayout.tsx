import React, { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { AppRightSidebar } from './AppRightSidebar'
import { useAuth } from '../context/AuthContext'
import { getStreak, type StreakData } from '../api/streak'
import { getUserLevel, type UserLevelData } from '../api/gamificationLevel'
import { getDailyChallenge, type DailyChallengeData } from '../api/gamification'

export const AppLayout: React.FC = () => {
  const { user } = useAuth()
  const location = useLocation()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hsk_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  // Gamification shared states
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [userLevel, setUserLevel] = useState<UserLevelData | null>(null)
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallengeData | null>(null)

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('hsk_sidebar_collapsed', String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  // Load Gamification Data
  useEffect(() => {
    if (!user) return

    // 1. Streak
    getStreak(user.token)
      .then((res) => setStreak(res))
      .catch(() => {})

    // 2. Level
    getUserLevel(user.token)
      .then((res) => setUserLevel(res))
      .catch(() => {})

    // 3. Daily Challenge (for students)
    if (user.activeMode !== 'TEACHER' && !user.roles.includes('ADMIN')) {
      getDailyChallenge(user.token)
        .then((res) => setDailyChallenge(res))
        .catch(() => {})
    }
  }, [user])

  // Show right sidebar primarily on Dashboard ('/') for students/teachers
  const isDashboard = location.pathname === '/'
  const showRightSidebar = isDashboard && !user?.roles.includes('ADMIN')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* 1. Left Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* 2. Main Content Center Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <AppHeader
          streak={streak}
          userLevel={userLevel}
          onToggleMobileSidebar={toggleSidebar}
        />

        {/* Workspace body (Center + Optional Right Sidebar) */}
        <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
          {/* Main Outlet for all pages */}
          <main style={{ flex: 1, minWidth: 0, padding: '24px 32px' }}>
            <Outlet />
          </main>

          {/* 3. Right Sidebar (Vocapy Gamification & Streak Widget) */}
          {showRightSidebar && (
            <AppRightSidebar
              streak={streak}
              userLevel={userLevel}
              dailyChallenge={dailyChallenge}
            />
          )}
        </div>
      </div>
    </div>
  )
}
