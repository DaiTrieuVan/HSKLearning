import React from 'react'
import { PlusCircle, Zap, Award, Users, ArrowRight } from 'lucide-react'

interface VocapyQuickActionsProps {
  onNavigate: (path: string) => void
}

export const VocapyQuickActions: React.FC<VocapyQuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'add_vocab',
      title: 'Tra cứu & Thêm từ',
      subtitle: 'Tạo từ vựng cá nhân & Tra từ điển',
      path: '/vocab-search',
      icon: PlusCircle,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
    },
    {
      id: 'practice',
      title: 'Luyện tập SRS',
      subtitle: 'Flashcard & Thuật toán lặp lại',
      path: '/srs/review',
      icon: Zap,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
    },
    {
      id: 'leaderboard',
      title: 'Bảng thành tích',
      subtitle: 'Xem tiến độ học & Cấp độ XP',
      path: '/progress',
      icon: Award,
      iconBg: '#ecfdf5',
      iconColor: '#059669',
    },
    {
      id: 'community',
      title: 'Lớp học & Bài tập',
      subtitle: 'Tham gia lớp & Nộp bài đúng hạn',
      path: '/classes/join',
      icon: Users,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
    },
  ]

  return (
    <div style={{ marginBottom: '28px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <h3
          style={{
            fontSize: '0.98rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            margin: 0,
          }}
        >
          Truy cập nhanh
        </h3>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
        }}
      >
        {actions.map((act) => {
          const IconComp = act.icon
          return (
            <div
              key={act.id}
              onClick={() => onNavigate(act.path)}
              className="game-card"
              style={{
                padding: '16px 18px',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-card)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-card)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: act.iconBg,
                    color: act.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComp size={20} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      lineHeight: 1.2,
                      marginBottom: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {act.title}
                  </div>
                  <div
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ color: '#94a3b8', paddingLeft: '8px', flexShrink: 0 }}>
                <ArrowRight size={16} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

