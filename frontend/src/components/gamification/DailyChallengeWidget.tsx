import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  Flame,
  Award,
  Trophy,
  BookOpen,
  BrainCircuit,
  FileCheck,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  RotateCw,
} from 'lucide-react'
import type { DailyChallengeData } from '../../api/gamification'
import type { StreakData } from '../../api/streak'

interface DailyChallengeWidgetProps {
  data: DailyChallengeData | null
  streak?: StreakData | null
  loading?: boolean
  onRefresh?: () => void
}

export const DailyChallengeWidget: React.FC<DailyChallengeWidgetProps> = ({
  data,
  streak,
  loading = false,
  onRefresh,
}) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div
        className="game-card"
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          marginBottom: '28px',
          border: '1.5px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-input)',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '18px',
                width: '180px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '4px',
                marginBottom: '8px',
              }}
            />
            <div
              style={{
                height: '14px',
                width: '260px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const isAllCompleted = data.isCompleted
  const lessonDone = data.completedLessons >= data.targetLessons
  const vocabDone = data.reviewedVocabs >= data.targetVocabs
  const exerciseDone = data.completedExercises >= data.targetExercises

  const completedTasksCount = (lessonDone ? 1 : 0) + (vocabDone ? 1 : 0) + (exerciseDone ? 1 : 0)

  // Format date display (VD: Thứ Năm, 22/10/2026)
  const formatChallengeDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        return `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  return (
    <div
      className="game-card"
      style={{
        padding: '24px 28px',
        backgroundColor: '#ffffff',
        marginBottom: '28px',
        border: isAllCompleted
          ? '2px solid var(--accent-gold)'
          : '1.5px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: isAllCompleted
          ? '0 6px 20px rgba(234, 179, 8, 0.15)'
          : '0 4px 14px rgba(0, 0, 0, 0.03)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Decorative background glow for completion */}
      {isAllCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.2) 0%, rgba(255,255,255,0) 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: isAllCompleted ? 'var(--accent-gold-light)' : 'var(--primary-light)',
              color: isAllCompleted ? 'var(--accent-gold-shadow)' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isAllCompleted ? <Trophy size={26} /> : <Target size={26} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  margin: 0,
                }}
              >
                Thử thách hằng ngày
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                }}
              >
                {formatChallengeDate(data.date)}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                margin: '4px 0 0 0',
              }}
            >
              Hoàn thành 3 mục tiêu mỗi ngày để duy trì thói quen học tập và nhận thưởng XP
            </p>
          </div>
        </div>

        {/* Right side: Streak Badge, XP Reward Badge & Refresh button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {streak && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: streak.completedToday ? '#ffedd5' : '#f8fafc',
                border: streak.completedToday ? '1.5px solid #fb923c' : '1.5px solid var(--border-card)',
                color: streak.completedToday ? '#c2410c' : 'var(--text-muted)',
                fontWeight: 800,
                fontSize: '0.88rem',
              }}
              title={streak.message || `Chuỗi: ${streak.currentStreak} ngày (Kỷ lục: ${streak.longestStreak} ngày)`}
            >
              <Flame size={18} style={{ color: streak.completedToday ? '#ea580c' : '#94a3b8' }} />
              <span>{streak.currentStreak} ngày streak</span>
            </div>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Làm mới tiến độ thử thách"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#f8fafc',
                border: '1.5px solid var(--border-card)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <RotateCw size={15} />
            </button>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isAllCompleted ? '#fef08a' : '#f8fafc',
              border: isAllCompleted ? '1.5px solid #eab308' : '1.5px solid var(--border-card)',
              color: isAllCompleted ? '#854d0e' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.88rem',
            }}
          >
            {isAllCompleted ? (
              <>
                <Award size={18} style={{ color: '#ca8a04' }} />
                <span>Đã nhận +{data.rewardXp} XP</span>
              </>
            ) : (
              <>
                <Sparkles size={18} style={{ color: '#eab308' }} />
                <span>Thưởng +{data.rewardXp} XP</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div style={{ marginBottom: '22px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '6px',
            color: 'var(--text-muted)',
          }}
        >
          <span>Tiến độ hoàn thành: {completedTasksCount}/3 mục tiêu</span>
          <span style={{ color: isAllCompleted ? 'var(--jade-green-shadow)' : 'var(--primary)' }}>
            {data.overallProgressPercent}%
          </span>
        </div>
        <div
          style={{
            height: '10px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${data.overallProgressPercent}%`,
              backgroundColor: isAllCompleted ? 'var(--accent-gold)' : 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Completion Banner if all tasks done */}
      {isAllCompleted && (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            backgroundColor: 'var(--jade-green-light)',
            border: '1.5px solid var(--jade-green)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--jade-green-shadow)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--jade-green-shadow)' }}>
                Xuất sắc! Bạn đã hoàn thành toàn bộ thử thách hôm nay!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                +{data.rewardXp} XP đã được cộng vào tài khoản của bạn (Tổng XP: {data.currentTotalXp}).
              </div>
            </div>
          </div>
          <Flame size={26} style={{ color: '#f97316', flexShrink: 0 }} />
        </div>
      )}

      {/* 3 Target Task Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Task 1: Học 2 bài học */}
        <div
          style={{
            padding: '16px',
            backgroundColor: lessonDone ? '#f0fdf4' : '#f8fafc',
            border: lessonDone ? '1.5px solid #86efac' : '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: lessonDone ? '#dcfce7' : 'var(--primary-light)',
                  color: lessonDone ? '#15803d' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  Học bài mới
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Mục tiêu: {data.targetLessons} bài
                </div>
              </div>
            </div>

            {lessonDone ? (
              <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
            ) : (
              <Circle size={20} style={{ color: '#cbd5e1' }} />
            )}
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '4px',
                color: lessonDone ? '#15803d' : 'var(--text-muted)',
              }}
            >
              <span>{data.completedLessons}/{data.targetLessons} bài</span>
              <span>{Math.min(100, Math.round((data.completedLessons / data.targetLessons) * 100))}%</span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: '#e2e8f0',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (data.completedLessons / data.targetLessons) * 100)}%`,
                  backgroundColor: lessonDone ? '#16a34a' : 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          {!lessonDone && (
            <button
              type="button"
              onClick={() => navigate('/roadmap')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-card)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                cursor: 'pointer',
              }}
            >
              <span>Học tiếp ngay</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Task 2: Ôn tập 10 từ vựng SRS */}
        <div
          style={{
            padding: '16px',
            backgroundColor: vocabDone ? '#f0fdf4' : '#f8fafc',
            border: vocabDone ? '1.5px solid #86efac' : '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: vocabDone ? '#dcfce7' : 'var(--primary-light)',
                  color: vocabDone ? '#15803d' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BrainCircuit size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  Ôn từ vựng SRS
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Mục tiêu: {data.targetVocabs} từ
                </div>
              </div>
            </div>

            {vocabDone ? (
              <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
            ) : (
              <Circle size={20} style={{ color: '#cbd5e1' }} />
            )}
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '4px',
                color: vocabDone ? '#15803d' : 'var(--text-muted)',
              }}
            >
              <span>{data.reviewedVocabs}/{data.targetVocabs} từ</span>
              <span>{Math.min(100, Math.round((data.reviewedVocabs / data.targetVocabs) * 100))}%</span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: '#e2e8f0',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (data.reviewedVocabs / data.targetVocabs) * 100)}%`,
                  backgroundColor: vocabDone ? '#16a34a' : 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          {!vocabDone && (
            <button
              type="button"
              onClick={() => navigate('/srs-review')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-card)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                cursor: 'pointer',
              }}
            >
              <span>Ôn từ vựng</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Task 3: Làm 1 bài tập */}
        <div
          style={{
            padding: '16px',
            backgroundColor: exerciseDone ? '#f0fdf4' : '#f8fafc',
            border: exerciseDone ? '1.5px solid #86efac' : '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: exerciseDone ? '#dcfce7' : 'var(--primary-light)',
                  color: exerciseDone ? '#15803d' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileCheck size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  Luyện tập bài tập
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Mục tiêu: {data.targetExercises} bài
                </div>
              </div>
            </div>

            {exerciseDone ? (
              <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
            ) : (
              <Circle size={20} style={{ color: '#cbd5e1' }} />
            )}
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '4px',
                color: exerciseDone ? '#15803d' : 'var(--text-muted)',
              }}
            >
              <span>{data.completedExercises}/{data.targetExercises} bài</span>
              <span>{Math.min(100, Math.round((data.completedExercises / data.targetExercises) * 100))}%</span>
            </div>
            <div
              style={{
                height: '6px',
                backgroundColor: '#e2e8f0',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (data.completedExercises / data.targetExercises) * 100)}%`,
                  backgroundColor: exerciseDone ? '#16a34a' : 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          {!exerciseDone && (
            <button
              type="button"
              onClick={() => navigate('/classes')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-card)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                cursor: 'pointer',
              }}
            >
              <span>Vào lớp làm bài</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
