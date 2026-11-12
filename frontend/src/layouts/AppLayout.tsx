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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Tự động đóng menu drawer trên mobile/tablet khi chuyển trang
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobileSidebarOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileSidebarOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileSidebarOpen])

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

  // Vocapy Full-Width Layout: Dashboard has its own Hero Trio & Widgets without duplicate right sidebar
  const showRightSidebar = false

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      {/* Mobile/Tablet Backdrop khi mở menu điều hướng */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 1. Left Sidebar */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onToggleCollapse={toggleSidebar}
      />

      {/* 2. Main Content Center Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <AppHeader
          streak={streak}
          userLevel={userLevel}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Workspace body (Center + Optional Right Sidebar) */}
        <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
          {/* Main Outlet for all pages */}
          <main className="flex-1 min-w-0 px-3 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
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
