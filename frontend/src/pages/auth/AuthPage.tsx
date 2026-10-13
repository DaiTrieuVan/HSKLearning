import React, { useState } from 'react'
import { Flame, Award, BookOpen, Volume2, Check } from 'lucide-react'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import { PandaMascot } from '../../components/common/PandaMascot'

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null)

  const handlePlaySample = () => {
    setIsPlayingAudio(true)
    // Web Speech API for Chinese pronunciation demo
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('你好！欢迎来到中文学习世界！')
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)
      window.speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsPlayingAudio(false), 1200)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid var(--border-card)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.4rem',
              boxShadow: 'var(--shadow-btn-primary)',
            }}
            className="hanzi"
          >
            华
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              HSK Master <span style={{ color: 'var(--primary)' }}>.</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              NỀN TẢNG HỌC TIẾNG TRUNG THÔNG MINH
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--accent-gold-light)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              color: '#b45309',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: '1.5px solid #fde68a',
            }}
          >
            <Flame size={16} color="#d97706" />
            <span>Mục tiêu HSK 3.0</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1060px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Mascot & Gamified Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Mascot Greeting */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <div
                className="animate-float"
                style={{
                  filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.08))',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PandaMascot size={74} />
              </div>

              {/* Speech bubble */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--border-card)',
                  boxShadow: '0 6px 0 var(--border-card)',
                  position: 'relative',
                  flex: 1,
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                  Nǐ hǎo! Chào mừng bạn đến với HSK Master!
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Tham gia ngay hôm nay để nhận lộ trình HSK cá nhân hóa, luyện từ vựng qua Flashcard và tham gia lớp học cùng giáo viên!
                </p>
              </div>
            </div>

            {/* Interactive Flashcard Preview Demo */}
            <div
              className="game-card"
              style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
                borderColor: '#fecdd3',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  TỪ VỰNG HSK 1 HÔM NAY
                </span>

                <button
                  type="button"
                  onClick={handlePlaySample}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #fecdd3',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    cursor: 'pointer',
                  }}
                >
                  <Volume2 size={16} />
                  <span>{isPlayingAudio ? 'Đang phát...' : 'Phát âm'}</span>
                </button>
              </div>

              <div style={{ textAlign: 'center', padding: '10px 0 16px' }}>
                <div
                  className="hanzi"
                  style={{
                    fontSize: '3.4rem',
                    fontWeight: 900,
                    color: 'var(--text-chinese)',
                    letterSpacing: '4px',
                  }}
                >
                  你好
                </div>
                <div style={{ fontSize: '1.15rem', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                  nǐ hǎo
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                  Xin chào (Chào bạn)
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                  borderTop: '1px dashed #fecdd3',
                  paddingTop: '12px',
                }}
              >
                {['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'].map((lvl, idx) => (
                  <span
                    key={lvl}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: idx === 0 ? 'var(--primary)' : '#ffffff',
                      color: idx === 0 ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid #fecdd3',
                    }}
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>

            {/* Gamified Benefits checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--jade-green-light)',
                    color: 'var(--jade-green)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    display: 'flex',
                  }}
                >
                  <BookOpen size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Học liệu chuẩn</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Theo khung HSK mới</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--border-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--accent-gold-light)',
                    color: '#b45309',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px',
                    display: 'flex',
                  }}
                >
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Bài tập & Lớp học</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nhận bài từ giáo viên</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form Card */}
          <div
            className="game-card"
            style={{
              padding: '32px 28px',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Pill Tabs for Register / Login */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                backgroundColor: 'var(--bg-input)',
                padding: '5px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '26px',
                border: '1.5px solid var(--border-card)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                style={{
                  padding: '10px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
                  color: activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'register' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                Đăng ký học sinh
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('login')}
                style={{
                  padding: '10px',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeTab === 'login' ? '#ffffff' : 'transparent',
                  color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                Đăng nhập
              </button>
            </div>

            {/* Header info */}
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {activeTab === 'register' ? 'Bắt đầu hành trình tiếng Trung' : 'Mừng bạn trở lại lớp học'}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {activeTab === 'register'
                  ? 'Tạo tài khoản học sinh miễn phí để lưu tiến độ và tham gia lớp.'
                  : 'Đăng nhập vào tài khoản học sinh hoặc giáo viên của bạn.'}
              </p>
            </div>

            {/* Forms */}
            {activeTab === 'register' ? (
              <RegisterForm
                onSuccess={(user) => {
                  console.log('Registered user successfully:', user)
                }}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            ) : (
              <LoginForm
                onSwitchToRegister={() => setActiveTab('register')}
                onLoginSuccess={(email) => {
                  setLoggedInEmail(email)
                }}
              />
            )}

            {loggedInEmail && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: 'var(--jade-green-light)',
                  border: '1.5px solid var(--jade-green)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--jade-green-shadow)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Check size={18} />
                <span>Đã đăng nhập thành công với tài khoản: {loggedInEmail}</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '20px',
          fontSize: '0.82rem',
          color: 'var(--text-sub)',
          borderTop: '1px solid var(--border-card)',
          backgroundColor: '#ffffff',
        }}
      >
        © 2026 HSK Master · Thiết kế theo chuẩn kỳ thi năng lực Hán ngữ Quốc tế HSK 3.0
      </footer>
    </div>
  )
}
