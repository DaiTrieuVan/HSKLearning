import React from 'react'
import { Flame, Sparkles, Award } from 'lucide-react'
import { PandaMascot } from '../common/PandaMascot'
import type { SrsSummary } from '../../api/srs'
import type { StreakData } from '../../api/streak'
import type { UserLevelData } from '../../api/gamificationLevel'

interface VocapyHeroTrioProps {
  fullName: string
  srsSummary: SrsSummary | null
  streak: StreakData | null
  userLevel: UserLevelData | null
  onNavigate: (path: string) => void
}

export const VocapyHeroTrio: React.FC<VocapyHeroTrioProps> = ({
  fullName,
  srsSummary,
  streak,
  userLevel,
  onNavigate,
}) => {
  const totalWords = (srsSummary?.learningCount || 0) + (srsSummary?.masteredCount || 0)
  const masteredWords = srsSummary?.masteredCount || 0
  const dueCount = srsSummary?.dueTodayCount || 0
  const progressPercent = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0

  // Generate 7 days for the streak display (e.g. today and past 6 days)
  const daysList = React.useMemo(() => {
    const list = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dayNum = d.getDate()
      const isToday = i === 0
      list.push({
        dayNum,
        isToday,
        isCompleted: isToday ? !!streak?.completedToday : i < (streak?.currentStreak || 0),
      })
    }
    return list
  }, [streak])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '18px',
        marginBottom: '24px',
      }}
    >
      {/* 1. HERO LEFT: Mascot & Motivational Art Card */}
      <div
        className="game-card"
        style={{
          padding: '20px 22px',
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--border-card)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <PandaMascot size={78} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: 'var(--jade-green-light)',
                color: 'var(--jade-green-shadow)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} />
              Chăm chỉ mỗi ngày
            </span>
            {userLevel && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Award size={12} />
                Cấp {userLevel.currentLevel}: {userLevel.title}
              </span>
            )}
          </div>
          <h2
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0 0 6px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Xin chào, {fullName || 'Học viên'}!
          </h2>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>千里之行，始于足下</span>
            <br />
            Hành trình vạn dặm bắt đầu từ một bước chân.
          </p>
        </div>
      </div>

      {/* 2. HERO CENTER: 4 Stats Metrics Matrix (Vocapy style) */}
      <div
        className="game-card"
        onClick={() => onNavigate('/words')}
        title="Xem danh sách từ vựng chi tiết"
        style={{
          cursor: 'pointer',
          padding: '16px',
          backgroundColor: '#1e293b',
          borderRadius: '18px',
          border: '1.5px solid #334155',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* Metric 1: Tổng từ */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #1e293b',
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>
            {totalWords}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>
            Tổng từ
          </div>
        </div>

        {/* Metric 2: Đã thuộc */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #1e293b',
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#f59e0b', lineHeight: 1.1 }}>
            {masteredWords}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>
            Đã thuộc
          </div>
        </div>

        {/* Metric 3: Tiến độ */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #1e293b',
          }}
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#06b6d4', lineHeight: 1.1 }}>
            {progressPercent}%
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>
            Tiến độ
          </div>
        </div>

        {/* Metric 4: Cần ôn tập SRS (Clickable) */}
        <div
          onClick={() => onNavigate('/srs/review')}
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            border: dueCount > 0 ? '1px solid #ef4444' : '1px solid #1e293b',
            transition: 'all 0.2s ease',
          }}
          title="Bấm để vào phòng ôn từ SRS"
        >
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: dueCount > 0 ? '#f87171' : '#a855f7', lineHeight: 1.1 }}>
            {dueCount}
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: dueCount > 0 ? '#fca5a5' : '#94a3b8', marginTop: '4px' }}>
            Cần ôn hôm nay
          </div>
        </div>
      </div>

      {/* 3. HERO RIGHT: Vibrant Streak Card (Vocapy style) */}
      <div
        className="game-card"
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #ff7a00 0%, #ff5200 100%)',
          borderRadius: '18px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px rgba(255, 82, 0, 0.25)',
          position: 'relative',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.9, marginBottom: '6px' }}>
            <Flame size={16} color="#ffffff" />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              CHUỖI NGÀY HỌC
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
              {streak?.currentStreak || 1}
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.9 }}>ngày</span>
          </div>
        </div>

        {/* 7 Days Streak Row */}
        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {daysList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: item.isCompleted
                      ? '#ffffff'
                      : 'rgba(255, 255, 255, 0.22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: item.isCompleted ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.isCompleted ? (
                    <Flame size={14} color="#ff5200" />
                  ) : (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                      }}
                    />
                  )}
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, opacity: 0.85 }}>
                  {item.dayNum}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
