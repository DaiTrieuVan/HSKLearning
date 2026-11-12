import React, { useState } from 'react'
import { Check } from 'lucide-react'
import { RegisterForm } from './RegisterForm'
import { LoginForm } from './LoginForm'
import { ForgotPasswordView } from './ForgotPasswordView'
import { ResetPasswordView } from './ResetPasswordView'

export const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'forgot' | 'reset'>('login')
  const [resetToken, setResetToken] = useState('')
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 flex items-center justify-center sm:justify-start px-4 sm:px-6 py-2.5 bg-white/90 backdrop-blur-md border-b border-[var(--border-card)]">
        <div className="flex items-center gap-2.5">
          <div className="hanzi w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--primary)] text-white flex items-center justify-center font-black text-base shadow-[var(--shadow-btn-primary)]">
            华
          </div>
          <div className="font-extrabold text-base sm:text-lg text-[var(--text-main)] tracking-tight leading-none">
            HSK Master <span className="text-[var(--primary)]">.</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-5 sm:py-8">
        <div className="w-full max-w-[420px]">
          <div className="game-card p-5 sm:p-6 bg-white">
            {/* Pill Tabs for Register / Login (hidden if in forgot/reset view) */}
            {activeTab !== 'forgot' && activeTab !== 'reset' && (
              <div
                className="grid grid-cols-2 p-1 rounded-[var(--radius-md)] mb-4 border border-[var(--border-card)]"
                style={{ backgroundColor: 'var(--bg-input)' }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="py-2 px-3 border-none rounded-[var(--radius-sm)] font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: activeTab === 'login' ? '#ffffff' : 'transparent',
                    color: activeTab === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'login' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  Đăng nhập
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="py-2 px-3 border-none rounded-[var(--radius-sm)] font-bold text-xs sm:text-sm cursor-pointer whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
                    color: activeTab === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                    boxShadow: activeTab === 'register' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Header info */}
            {activeTab !== 'forgot' && activeTab !== 'reset' && (
              <div className="mb-4">
                <h1 className="text-base sm:text-lg font-extrabold text-[var(--text-main)] leading-snug m-0">
                  {activeTab === 'register' ? 'Tạo tài khoản mới' : 'Đăng nhập tài khoản'}
                </h1>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-0">
                  {activeTab === 'register'
                    ? 'Điền thông tin để tạo tài khoản học viên.'
                    : 'Nhập email và mật khẩu để tiếp tục học.'}
                </p>
              </div>
            )}

            {/* Forms */}
            {activeTab === 'register' ? (
              <RegisterForm
                onSuccess={(user) => {
                  console.log('Registered user successfully:', user)
                }}
                onSwitchToLogin={() => setActiveTab('login')}
              />
            ) : activeTab === 'login' ? (
              <LoginForm
                onSwitchToRegister={() => setActiveTab('register')}
                onForgotPassword={() => setActiveTab('forgot')}
                onLoginSuccess={(user) => {
                  setLoggedInEmail(user.email)
                }}
              />
            ) : activeTab === 'forgot' ? (
              <ForgotPasswordView
                onBackToLogin={() => setActiveTab('login')}
                onOpenResetPassword={(token) => {
                  if (token) setResetToken(token)
                  setActiveTab('reset')
                }}
              />
            ) : (
              <ResetPasswordView
                initialToken={resetToken}
                onBackToLogin={() => setActiveTab('login')}
                onSuccess={() => {
                  setActiveTab('login')
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
      <footer className="text-center py-3 px-4 text-xs text-[var(--text-sub)] border-t border-[var(--border-card)] bg-white">
        © 2026 HSK Master
      </footer>
    </div>
  )
}
