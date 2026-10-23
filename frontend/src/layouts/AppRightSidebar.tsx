import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flame,
  Award,
  Target,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  BookMarked,
  CheckCircle2,
  Circle,
  GraduationCap,
  PlusCircle,
  FileCheck,
  HelpCircle,
  Lightbulb,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import type { StreakData } from '../api/streak'
import type { UserLevelData } from '../api/gamificationLevel'
import type { DailyChallengeData } from '../api/gamification'

interface AppRightSidebarProps {
  streak: StreakData | null
  userLevel: UserLevelData | null
  dailyChallenge: DailyChallengeData | null
}

export const AppRightSidebar: React.FC<AppRightSidebarProps> = ({
  streak,
  userLevel,
  dailyChallenge,
}) => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isTeacher = user?.activeMode === 'TEACHER'

  // Weekdays abbreviation for students
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const today = new Date().getDay()
  const todayIndex = today === 0 ? 6 : today - 1

  return (
    <aside
      style={{
        width: '320px',
        minWidth: '320px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '24px 20px',
        backgroundColor: '#ffffff',
        borderLeft: '1.5px solid var(--border-card)',
        minHeight: 'calc(100vh - 64px)',
      }}
      className="app-right-sidebar"
    >
      {/* ========================================================
          A. GIAO DIỆN CỘT PHẢI DÀNH RIÊNG CHO GIÁO VIÊN
         ======================================================== */}
      {isTeacher ? (
        <>
          {/* 1. Teaching Hub Banner */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
              padding: '20px',
              border: '2px solid #10b981',
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                }}
              >
                <GraduationCap size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Bảng Điều Khiển
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#065f46' }}>
                  Không Gian Giáo Viên
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#047857', lineHeight: 1.5, margin: '8px 0 0' }}>
              Quản lý học sinh, giao bài tập và theo dõi tiến độ thi đua lớp học hiệu quả.
            </p>
          </div>

          {/* 2. Quick Actions For Teacher */}
          <div
            className="game-card"
            style={{
              padding: '18px',
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--border-card)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              Thao tác giảng dạy nhanh
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/classes/create')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  border: '1.5px solid var(--primary)',
                  color: 'var(--primary-hover)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <PlusCircle size={18} />
                <span>Tạo lớp học mới</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/exercises')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <FileCheck size={18} style={{ color: '#7e22ce' }} />
                <span>Quản lý & tạo bài tập</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/questions')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <HelpCircle size={18} style={{ color: '#4338ca' }} />
                <span>Soạn câu hỏi trắc nghiệm</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/vocab-sets')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <BookMarked size={18} style={{ color: '#d97706' }} />
                <span>Soạn bộ từ vựng riêng</span>
              </button>
            </div>
          </div>

          {/* 3. Teaching Tips Card */}
          <div
            className="game-card"
            style={{
              padding: '16px',
              backgroundColor: '#fefce8',
              border: '1.5px solid #fef08a',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854d0e', marginBottom: '8px' }}>
              <Lightbulb size={18} />
              <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Mẹo dành cho giáo viên</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#713f12', lineHeight: 1.5, margin: 0 }}>
              Giao bài tập có hạn nộp sẽ thúc đẩy học sinh tự giác luyện tập. Hệ thống tự động chấm điểm và tổng hợp bảng điểm chi tiết cho bạn!
            </p>
          </div>
        </>
      ) : (
        /* ========================================================
           B. GIAO DIỆN CỘT PHẢI DÀNH RIÊNG CHO HỌC SINH
           ======================================================== */
        <>
          {/* 1. Chuỗi Ngày Học (Vocapy Streak Card) */}
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 40%, #fdba74 100%)',
              padding: '20px',
              border: '2px solid #fb923c',
              boxShadow: '0 6px 16px rgba(251, 146, 60, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 900, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <Flame size={16} style={{ color: '#ea580c' }} />
                  <span>Chuỗi Ngày Học</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#7c2d12', lineHeight: 1 }}>
                    {streak?.currentStreak || 0}
                  </span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#9a3412' }}>ngày liên tục</span>
                </div>
              </div>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 8px rgba(234, 88, 12, 0.25)',
                }}
              >
                <Flame size={24} style={{ color: streak?.completedToday ? '#ea580c' : '#94a3b8' }} />
              </div>
            </div>

            {/* 7 Weekdays Pills */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginTop: '16px' }}>
              {weekDays.map((dayName, idx) => {
                const isToday = idx === todayIndex
                const isPast = idx < todayIndex
                const isDone = isPast || (isToday && streak?.completedToday)

                return (
                  <div
                    key={dayName}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: isToday ? 900 : 700,
                        color: isToday ? '#7c2d12' : '#9a3412',
                      }}
                    >
                      {dayName}
                    </span>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isDone ? '#ea580c' : isToday ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                        border: isToday ? '2px solid #c2410c' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDone ? '#ffffff' : '#9a3412',
                        boxShadow: isDone ? '0 2px 6px rgba(234, 88, 12, 0.3)' : 'none',
                      }}
                    >
                      {isDone ? (
                        <Flame size={15} />
                      ) : (
                        <Circle size={8} style={{ fill: isToday ? '#c2410c' : '#fdba74' }} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 2. Cấp độ & Thanh Tiến Trình XP */}
          {userLevel && (
            <div
              className="game-card"
              style={{
                padding: '18px',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-card)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fef3c7',
                      border: '1.5px solid #f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706',
                    }}
                  >
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>CẤP ĐỘ</div>
                    <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-main)' }}>
                      Lv.{userLevel.currentLevel} - {userLevel.title}
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--primary)' }}>
                  {userLevel.totalXp} XP
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Tiến độ lên cấp</span>
                  <span>Còn {userLevel.xpToNextLevel} XP</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#f1f5f9',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${userLevel.progressPercent}%`,
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Thử Thách Ngày (Daily Challenge Quick Card) */}
          {dailyChallenge && (
            <div
              className="game-card"
              style={{
                padding: '18px',
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--border-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Target size={18} style={{ color: 'var(--dragon-blue)' }} />
                <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  Nhiệm vụ hôm nay
                </span>
              </div>

              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: dailyChallenge.isCompleted ? '#f0fdf4' : '#eff6ff',
                  border: dailyChallenge.isCompleted ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                  marginBottom: '10px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>📖 Hoàn thành bài học:</span>
                    <strong>{dailyChallenge.completedLessons}/{dailyChallenge.targetLessons}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🧠 Ôn từ vựng SRS:</span>
                    <strong>{dailyChallenge.reviewedVocabs}/{dailyChallenge.targetVocabs}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>📝 Làm bài tập:</span>
                    <strong>{dailyChallenge.completedExercises}/{dailyChallenge.targetExercises}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} />
                  +{dailyChallenge.rewardXp} XP thưởng
                </span>
                {dailyChallenge.isCompleted ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.8rem', fontWeight: 800 }}>
                    <CheckCircle2 size={15} />
                    Đã xong
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/curriculum')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Làm ngay <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 4. Truy Cập Nhanh Học Sinh */}
          <div
            className="game-card"
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1.5px dashed var(--border-card)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              Phím tắt học tập
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => navigate('/srs/review')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <BrainCircuit size={16} style={{ color: 'var(--primary)' }} />
                <span>Luyện trí nhớ SRS</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/roadmap')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <BookMarked size={16} style={{ color: '#d97706' }} />
                <span>Mở cây lộ trình HSK</span>
              </button>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
