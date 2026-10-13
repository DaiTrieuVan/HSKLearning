import React from 'react'
import { LogOut, BookOpen, User, Flame, Award, ArrowRight, PlusCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { PandaMascot } from '../../components/common/PandaMascot'

interface MainWorkspaceProps {
  onJoinClassClick?: () => void
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = () => {
  const { user, logout, switchMode } = useAuth()

  if (!user) return null

  const isTeacher = user.activeMode === 'TEACHER'
  const hasMultipleRoles = user.roles.includes('TEACHER') && user.roles.includes('STUDENT')

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
              {isTeacher ? 'KHÔNG GIAN GIÁO VIÊN' : 'KHÔNG GIAN HỌC SINH'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Switch mode if user has multiple roles (HTT-01-CN-009 preview) */}
          {hasMultipleRoles && (
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
              Phiên học hoạt động
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Chào mừng trở lại, {user.fullName}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.6 }}>
              {isTeacher
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
              className="btn-gamified btn-gold"
              style={{ width: '100%', fontSize: '0.92rem', padding: '10px' }}
            >
              <PlusCircle size={18} />
              <span>{isTeacher ? 'Tạo lớp mới' : 'Tham gia lớp bằng mã'}</span>
            </button>
          </div>

          {/* Card 3: Daily Streak */}
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
      </main>
    </div>
  )
}
