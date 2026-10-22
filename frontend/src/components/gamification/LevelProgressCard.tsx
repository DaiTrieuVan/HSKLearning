import React, { useState } from 'react'
import {
  Star,
  TrendingUp,
  History,
  BookOpen,
  FileCheck,
  Target,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { UserLevelData, XpTransactionItem } from '../../api/gamificationLevel'

interface LevelProgressCardProps {
  levelData: UserLevelData | null
  recentXp: XpTransactionItem[]
  loading?: boolean
}

export const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  levelData,
  recentXp,
  loading = false,
}) => {
  const [showHistory, setShowHistory] = useState(false)

  if (loading || !levelData) return null

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'LESSON_COMPLETION':
        return <BookOpen size={16} style={{ color: 'var(--primary)' }} />
      case 'ASSIGNMENT_SUBMISSION':
        return <FileCheck size={16} style={{ color: '#8b5cf6' }} />
      case 'DAILY_CHALLENGE':
        return <Target size={16} style={{ color: '#ea580c' }} />
      default:
        return <Sparkles size={16} style={{ color: '#eab308' }} />
    }
  }

  const formatDateTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr)
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      })
    } catch {
      return isoStr
    }
  }

  return (
    <div
      className="game-card"
      style={{
        padding: '20px 24px',
        backgroundColor: '#ffffff',
        marginBottom: '24px',
        border: '1.5px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Star size={24} style={{ fill: '#f59e0b', color: '#d97706' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Cấp {levelData.currentLevel}: {levelData.title}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#fef08a',
                  color: '#854d0e',
                  fontWeight: 800,
                }}
              >
                {levelData.totalXp} XP
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Còn <strong style={{ color: 'var(--primary)' }}>{levelData.xpToNextLevel} XP</strong> nữa để đạt Cấp {levelData.currentLevel + 1}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(!showHistory)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: showHistory ? '#f1f5f9' : 'transparent',
            border: '1.5px solid var(--border-card)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <History size={15} />
          <span>Lịch sử nhận XP</span>
          {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Progress Bar to next level */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: '6px',
          }}
        >
          <span>Tiến độ cấp hiện tại</span>
          <span>{levelData.progressPercent}%</span>
        </div>
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${levelData.progressPercent}%`,
              backgroundColor: '#f59e0b',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Inline Expand: Recent XP Transactions History (NO MODAL / NO POPUP) */}
      {showHistory && (
        <div
          className="animate-fade-in"
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1.5px solid var(--border-card)',
          }}
        >
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
            <span>Các hoạt động nhận XP gần đây</span>
          </div>

          {recentXp.length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
              Chưa có lịch sử nhận điểm nào. Hãy bắt đầu học bài để nhận XP!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentXp.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getSourceIcon(item.sourceType)}
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.description}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {formatDateTime(item.createdAt)}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontWeight: 800,
                      color: '#16a34a',
                      fontSize: '0.85rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    +{item.xpAmount} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
