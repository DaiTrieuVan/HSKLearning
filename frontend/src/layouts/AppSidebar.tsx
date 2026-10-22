import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookMarked,
  BookOpen,
  BrainCircuit,
  Search,
  BarChart3,
  Clock,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getSrsSummary, type SrsSummary } from '../api/srs'

interface AppSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [srsSummary, setSrsSummary] = useState<SrsSummary | null>(null)

  const isTeacher = user?.activeMode === 'TEACHER'
  const isAdmin = user?.roles.includes('ADMIN')

  useEffect(() => {
    if (user && !isAdmin) {
      getSrsSummary(user.token)
        .then((data) => setSrsSummary(data))
        .catch(() => {})
    }
  }, [user, isAdmin])

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const navItemStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: isCollapsed ? '0px' : '12px',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    padding: isCollapsed ? '12px 0' : '10px 14px',
    borderRadius: 'var(--radius-md)',
    backgroundColor: active ? 'var(--primary-light)' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--text-main)',
    fontWeight: active ? 800 : 600,
    fontSize: '0.88rem',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    textAlign: 'left' as const,
    position: 'relative' as const,
  })

  return (
    <aside
      style={{
        width: isCollapsed ? '72px' : '250px',
        minWidth: isCollapsed ? '72px' : '250px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        backgroundColor: '#ffffff',
        borderRight: '1.5px solid var(--border-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 50,
        overflowX: 'hidden',
      }}
    >
      {/* Top Brand / Logo */}
      <div>
        <div
          onClick={() => navigate('/')}
          style={{
            padding: isCollapsed ? '18px 0' : '18px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border-card)',
          }}
          title="HSK Master - Trang chủ"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.25rem',
              flexShrink: 0,
              boxShadow: '0 3px 8px rgba(16, 185, 129, 0.3)',
            }}
            className="hanzi"
          >
            华
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
                HSK Master<span style={{ color: 'var(--primary)' }}>.</span>
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                {isAdmin ? 'HỆ THỐNG QUẢN TRỊ' : isTeacher ? 'KHÔNG GIAN GIÁO VIÊN' : 'NỀN TẢNG HỌC TIẾNG TRUNG'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{ padding: isCollapsed ? '16px 8px' : '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* 1. Trang chủ */}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={navItemStyle(isActive('/'))}
            title={isCollapsed ? 'Trang chủ' : undefined}
          >
            <LayoutDashboard size={20} style={{ flexShrink: 0, color: isActive('/') ? 'var(--primary)' : '#64748b' }} />
            {!isCollapsed && <span>Trang chủ</span>}
          </button>

          {/* 2. Lộ trình HSK */}
          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            style={navItemStyle(isActive('/roadmap'))}
            title={isCollapsed ? 'Lộ trình HSK' : undefined}
          >
            <BookMarked size={20} style={{ flexShrink: 0, color: isActive('/roadmap') ? 'var(--primary)' : '#64748b' }} />
            {!isCollapsed && <span>Lộ trình HSK</span>}
          </button>

          {/* 3. Giáo trình & Bài học */}
          <button
            type="button"
            onClick={() => navigate('/curriculum')}
            style={navItemStyle(isActive('/curriculum'))}
            title={isCollapsed ? 'Giáo trình bài học' : undefined}
          >
            <BookOpen size={20} style={{ flexShrink: 0, color: isActive('/curriculum') ? 'var(--primary)' : '#64748b' }} />
            {!isCollapsed && <span>Giáo trình & Bài học</span>}
          </button>

          {/* 4. Ôn từ SRS */}
          {!isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/srs/review')}
              style={navItemStyle(isActive('/srs/review'))}
              title={isCollapsed ? 'Ôn từ SRS' : undefined}
            >
              <BrainCircuit size={20} style={{ flexShrink: 0, color: isActive('/srs/review') ? 'var(--primary)' : '#64748b' }} />
              {!isCollapsed && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>Ôn từ SRS</span>
                  {srsSummary && srsSummary.dueTodayCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        borderRadius: 'var(--radius-full)',
                        padding: '1px 7px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}
                    >
                      {srsSummary.dueTodayCount}
                    </span>
                  )}
                </div>
              )}
              {isCollapsed && srsSummary && srsSummary.dueTodayCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                  }}
                />
              )}
            </button>
          )}

          {/* 5. Tra cứu từ vựng */}
          <button
            type="button"
            onClick={() => navigate('/vocab-search')}
            style={navItemStyle(isActive('/vocab-search'))}
            title={isCollapsed ? 'Tra cứu từ vựng' : undefined}
          >
            <Search size={20} style={{ flexShrink: 0, color: isActive('/vocab-search') ? 'var(--primary)' : '#64748b' }} />
            {!isCollapsed && <span>Tra cứu từ vựng</span>}
          </button>

          {/* 6. Tiến độ cá nhân */}
          {!isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/progress')}
              style={navItemStyle(isActive('/progress'))}
              title={isCollapsed ? 'Tiến độ học tập' : undefined}
            >
              <BarChart3 size={20} style={{ flexShrink: 0, color: isActive('/progress') ? 'var(--primary)' : '#64748b' }} />
              {!isCollapsed && <span>Tiến độ học tập</span>}
            </button>
          )}

          {/* 7. Lịch sử bài tập */}
          {!isAdmin && !isTeacher && (
            <button
              type="button"
              onClick={() => navigate('/history')}
              style={navItemStyle(isActive('/history'))}
              title={isCollapsed ? 'Lịch sử nộp bài' : undefined}
            >
              <Clock size={20} style={{ flexShrink: 0, color: isActive('/history') ? 'var(--primary)' : '#64748b' }} />
              {!isCollapsed && <span>Lịch sử nộp bài</span>}
            </button>
          )}

          {/* TEACHER SPECIFIC SECTION */}
          {isTeacher && (
            <>
              {!isCollapsed && (
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '14px 10px 4px',
                  }}
                >
                  Công cụ Giáo viên
                </div>
              )}
              {isCollapsed && <div style={{ height: '1px', backgroundColor: 'var(--border-card)', margin: '8px 0' }} />}

              <button
                type="button"
                onClick={() => navigate('/vocab-sets')}
                style={navItemStyle(isActive('/vocab-sets'))}
                title={isCollapsed ? 'Bộ từ vựng giáo viên' : undefined}
              >
                <BookMarked size={20} style={{ flexShrink: 0, color: isActive('/vocab-sets') ? 'var(--primary)' : '#64748b' }} />
                {!isCollapsed && <span>Bộ từ vựng</span>}
              </button>

              <button
                type="button"
                onClick={() => navigate('/questions')}
                style={navItemStyle(isActive('/questions'))}
                title={isCollapsed ? 'Ngân hàng câu hỏi' : undefined}
              >
                <HelpCircle size={20} style={{ flexShrink: 0, color: isActive('/questions') ? 'var(--primary)' : '#64748b' }} />
                {!isCollapsed && <span>Ngân hàng câu hỏi</span>}
              </button>

              <button
                type="button"
                onClick={() => navigate('/exercises')}
                style={navItemStyle(isActive('/exercises'))}
                title={isCollapsed ? 'Quản lý bài tập' : undefined}
              >
                <FileCheck size={20} style={{ flexShrink: 0, color: isActive('/exercises') ? 'var(--primary)' : '#64748b' }} />
                {!isCollapsed && <span>Quản lý bài tập</span>}
              </button>
            </>
          )}

          {/* ADMIN SPECIFIC SECTION */}
          {isAdmin && (
            <>
              {!isCollapsed && (
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '14px 10px 4px',
                  }}
                >
                  Quản trị viên
                </div>
              )}
              {isCollapsed && <div style={{ height: '1px', backgroundColor: 'var(--border-card)', margin: '8px 0' }} />}

              <button
                type="button"
                onClick={() => navigate('/')}
                style={navItemStyle(isActive('/admin'))}
                title={isCollapsed ? 'Duyệt giáo viên & Quản trị' : undefined}
              >
                <ShieldCheck size={20} style={{ flexShrink: 0, color: isActive('/admin') ? 'var(--primary)' : '#64748b' }} />
                {!isCollapsed && <span>Bảng điều khiển Admin</span>}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Footer: User Profile & Collapse Toggle */}
      <div style={{ borderTop: '1px solid var(--border-card)', padding: isCollapsed ? '12px 6px' : '14px 12px' }}>
        {/* User Card */}
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isCollapsed ? '0' : '10px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
            marginBottom: '8px',
          }}
          title={isCollapsed ? `${user?.fullName || 'Tài khoản'}` : 'Bấm để xem hồ sơ'}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={18} />
            )}
          </div>
          {!isCollapsed && (
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.fullName || 'Người dùng'}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {user?.roles?.join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: Collapse + Logout */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={onToggleCollapse}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px 0',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: '#64748b',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title={isCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!isCollapsed && <span>Thu gọn</span>}
          </button>

          <button
            type="button"
            onClick={logout}
            style={{
              padding: '7px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #fee2e2',
              backgroundColor: '#fff1f2',
              color: '#b91c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Đăng xuất"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
