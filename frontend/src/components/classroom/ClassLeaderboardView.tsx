import React from 'react'
import {
  Trophy,
  Medal,
  Crown,
  Award,
  TrendingUp,
  User,
  Calendar,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react'
import type { ClassLeaderboardResponse } from '../../api/leaderboard'

interface ClassLeaderboardViewProps {
  data: ClassLeaderboardResponse
  onRefresh?: () => void
}

export const ClassLeaderboardView: React.FC<ClassLeaderboardViewProps> = ({ data }) => {
  const {
    className,
    weekStart,
    weekEnd,
    totalStudents,
    currentUserRank,
    currentUserWeeklyXp,
    leaderboard,
  } = data

  const formatWeekRange = (startStr: string, endStr: string) => {
    try {
      const s = new Date(startStr)
      const e = new Date(endStr)
      const opt: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
      return `${s.toLocaleDateString('vi-VN', opt)} - ${e.toLocaleDateString('vi-VN', opt)}`
    } catch {
      return 'Tuần hiện tại'
    }
  }

  // Top 3 for Podium
  const top1 = leaderboard.find((item) => item.rank === 1)
  const top2 = leaderboard.find((item) => item.rank === 2)
  const top3 = leaderboard.find((item) => item.rank === 3)
  const hasPodium = leaderboard.length >= 2

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            border: '2px solid #f59e0b',
            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)',
          }}
          title="Hạng 1"
        >
          <Crown size={18} />
        </span>
      )
    }
    if (rank === 2) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            border: '2px solid #94a3b8',
          }}
          title="Hạng 2"
        >
          <Medal size={18} />
        </span>
      )
    }
    if (rank === 3) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#ffedd5',
            color: '#c2410c',
            border: '2px solid #ea580c',
          }}
          title="Hạng 3"
        >
          <Award size={18} />
        </span>
      )
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: '#f8fafc',
          color: '#64748b',
          fontWeight: 800,
          fontSize: '0.88rem',
          border: '1px solid #e2e8f0',
        }}
      >
        {rank}
      </span>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Info */}
      <div
        className="game-card"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)',
          border: '1.5px solid #bfdbfe',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Trophy size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Bảng xếp hạng XP tuần
              </h3>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                <Sparkles size={12} />
                <span>Reset 00:00 Thứ Hai</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} />
                <span>{formatWeekRange(weekStart, weekEnd)}</span>
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} />
                <span>Lớp: {className} ({totalStudents} học sinh)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Current User Standings Highlight */}
        {currentUserRank !== null && currentUserWeeklyXp !== null && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: '#ffffff',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid #93c5fd',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                Thứ hạng của bạn
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d4ed8' }}>
                Hạng #{currentUserRank}
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0' }} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                XP tuần này
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1.2rem', fontWeight: 900, color: '#d97706' }}>
                <Flame size={18} />
                <span>{currentUserWeeklyXp} XP</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Podium Top 3 (if at least 2 members) */}
      {hasPodium && (
        <div
          className="game-card"
          style={{
            padding: '24px 20px',
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '16px',
          }}
        >
          {/* Top 2: Silver */}
          {top2 ? (
            <div
              style={{
                flex: '1',
                maxWidth: '180px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  border: '3px solid #94a3b8',
                  overflow: 'hidden',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  position: 'relative',
                }}
              >
                {top2.avatarUrl ? (
                  <img src={top2.avatarUrl} alt={top2.studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={28} style={{ color: '#64748b' }} />
                )}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    backgroundColor: '#64748b',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  2
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '2px', wordBreak: 'break-word' }}>
                {top2.studentName}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                Lv.{top2.level} {top2.levelTitle}
              </div>
              <div
                style={{
                  width: '100%',
                  height: '80px',
                  backgroundColor: '#e2e8f0',
                  borderTopLeftRadius: 'var(--radius-md)',
                  borderTopRightRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  border: '1.5px solid #cbd5e1',
                  borderBottom: 'none',
                }}
              >
                <Medal size={22} style={{ color: '#64748b', marginBottom: '4px' }} />
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#334155' }}>{top2.weeklyXp} XP</span>
              </div>
            </div>
          ) : (
            <div style={{ flex: '1', maxWidth: '180px' }} />
          )}

          {/* Top 1: Gold (Center & Highest) */}
          {top1 && (
            <div
              style={{
                flex: '1',
                maxWidth: '200px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: '3.5px solid #f59e0b',
                  overflow: 'hidden',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  position: 'relative',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                }}
              >
                {top1.avatarUrl ? (
                  <img src={top1.avatarUrl} alt={top1.studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={36} style={{ color: '#d97706' }} />
                )}
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  }}
                >
                  <Crown size={15} />
                </span>
              </div>
              <div style={{ fontWeight: 900, fontSize: '0.98rem', color: 'var(--text-main)', marginBottom: '2px', wordBreak: 'break-word' }}>
                {top1.studentName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 700, marginBottom: '6px' }}>
                Lv.{top1.level} {top1.levelTitle}
              </div>
              <div
                style={{
                  width: '100%',
                  height: '110px',
                  background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                  borderTopLeftRadius: 'var(--radius-md)',
                  borderTopRightRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  border: '2px solid #f59e0b',
                  borderBottom: 'none',
                  boxShadow: '0 -4px 10px rgba(245, 158, 11, 0.15)',
                }}
              >
                <Trophy size={28} style={{ color: '#d97706', marginBottom: '4px' }} />
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#92400e' }}>{top1.weeklyXp} XP</span>
              </div>
            </div>
          )}

          {/* Top 3: Bronze */}
          {top3 ? (
            <div
              style={{
                flex: '1',
                maxWidth: '180px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  border: '3px solid #ea580c',
                  overflow: 'hidden',
                  backgroundColor: '#ffedd5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                  position: 'relative',
                }}
              >
                {top3.avatarUrl ? (
                  <img src={top3.avatarUrl} alt={top3.studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={28} style={{ color: '#c2410c' }} />
                )}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  3
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '2px', wordBreak: 'break-word' }}>
                {top3.studentName}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600, marginBottom: '6px' }}>
                Lv.{top3.level} {top3.levelTitle}
              </div>
              <div
                style={{
                  width: '100%',
                  height: '65px',
                  backgroundColor: '#fed7aa',
                  borderTopLeftRadius: 'var(--radius-md)',
                  borderTopRightRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  border: '1.5px solid #f97316',
                  borderBottom: 'none',
                }}
              >
                <Award size={20} style={{ color: '#c2410c', marginBottom: '2px' }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#7c2d12' }}>{top3.weeklyXp} XP</span>
              </div>
            </div>
          ) : (
            <div style={{ flex: '1', maxWidth: '180px' }} />
          )}
        </div>
      )}

      {/* Leaderboard Table List */}
      <div
        className="game-card"
        style={{
          padding: 0,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          border: '1.5px solid var(--border-card)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-card)',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            <span>Toàn bộ học viên trong lớp ({leaderboard.length})</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Học sinh cùng số XP sẽ được xếp đồng hạng
          </span>
        </div>

        {leaderboard.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Lớp học chưa có học sinh nào.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1.5px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 16px', width: '70px', textAlign: 'center' }}>Hạng</th>
                  <th style={{ padding: '12px 16px' }}>Học sinh</th>
                  <th style={{ padding: '12px 16px', width: '160px' }}>Cấp độ</th>
                  <th style={{ padding: '12px 20px', width: '140px', textAlign: 'right' }}>XP tuần này</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isUser = entry.isCurrentUser
                  return (
                    <tr
                      key={entry.studentId}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: isUser ? '#f0fdf4' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                        {getRankBadge(entry.rank)}
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: isUser ? '#dcfce7' : '#f1f5f9',
                              border: isUser ? '2px solid #22c55e' : '1px solid #cbd5e1',
                              overflow: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {entry.avatarUrl ? (
                              <img src={entry.avatarUrl} alt={entry.studentName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <User size={20} style={{ color: isUser ? '#16a34a' : '#64748b' }} />
                            )}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: isUser ? 900 : 700, fontSize: '0.92rem', color: isUser ? '#15803d' : 'var(--text-main)' }}>
                                {entry.studentName}
                              </span>
                              {isUser && (
                                <span
                                  style={{
                                    backgroundColor: '#22c55e',
                                    color: '#ffffff',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '1px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                  }}
                                >
                                  Bạn
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#334155',
                          }}
                        >
                          Lv.{entry.level} - {entry.levelTitle}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 900, fontSize: '1rem', color: entry.weeklyXp > 0 ? '#d97706' : '#94a3b8' }}>
                          <Flame size={16} style={{ color: entry.weeklyXp > 0 ? '#ea580c' : '#cbd5e1' }} />
                          <span>{entry.weeklyXp} XP</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
