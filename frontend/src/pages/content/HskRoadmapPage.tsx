import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  Layers,
  Check,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getRoadmap,
  markLessonComplete,
  unmarkLessonComplete,
  type RoadmapResponse,
  type RoadmapLevelItem,
} from '../../api/roadmap'
import { PandaMascot } from '../../components/common/PandaMascot'

export const HskRoadmapPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null)
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingLessonId, setUpdatingLessonId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadRoadmapData = async () => {
    if (!user?.token) return
    try {
      setLoading(true)
      setError(null)
      const data = await getRoadmap(user.token)
      setRoadmap(data)
      if (data.levels.length > 0) {
        setSelectedLevelId((prev) => (prev ? prev : data.levels[0].id))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể tải lộ trình học HSK')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoadmapData()
  }, [user?.token])

  const selectedLevel: RoadmapLevelItem | undefined = roadmap?.levels.find(
    (lvl) => lvl.id === selectedLevelId
  )

  const handleToggleCompletion = async (lessonId: number, currentlyCompleted: boolean) => {
    if (!user?.token) return
    try {
      setUpdatingLessonId(lessonId)
      if (currentlyCompleted) {
        await unmarkLessonComplete(lessonId, user.token)
      } else {
        await markLessonComplete(lessonId, user.token)
      }
      // Reload roadmap data to update progress calculation
      const updated = await getRoadmap(user.token)
      setRoadmap(updated)
    } catch {
      // ignore or alert
    } finally {
      setUpdatingLessonId(null)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          padding: '16px 28px',
          backgroundColor: '#ffffff',
          borderBottom: '2px solid var(--border-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Quay lại bảng điều khiển"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Lộ trình học tiếng Trung HSK
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Theo dõi tiến độ từ HSK 1 đến các cấp độ nâng cao
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/curriculum')}
            className="btn-gamified btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <BookOpen size={16} />
            <span>Kho giáo trình HSK</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '28px 20px' }}>
        {/* Banner with Mascot and Overall Progress */}
        <div
          className="game-card"
          style={{
            padding: '24px 28px',
            backgroundColor: '#ffffff',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ flex: 1 }}>
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
              fontSize: '0.78rem',
              marginBottom: '10px',
            }}
          >
              <Sparkles size={14} />
              <span>Lộ trình cá nhân hóa</span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Chinh phục HSK từng bước vững chắc
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px', lineHeight: 1.5 }}>
              Học theo thứ tự các bài học chuẩn, ôn tập từ vựng kèm ngữ pháp và tích lũy từng mốc hoàn thành.
            </p>

            {/* Overall Progress Bar */}
            {roadmap && (
              <div style={{ maxWidth: '480px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    Tổng số bài đã hoàn thành: <strong style={{ color: 'var(--primary)' }}>{roadmap.totalCompletedLessons}</strong> bài
                  </span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                    {roadmap.overallProgressPercent}%
                  </span>
                </div>
                <div
                  style={{
                    height: '10px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${roadmap.overallProgressPercent}%`,
                      backgroundColor: 'var(--primary)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="animate-float" style={{ flexShrink: 0 }}>
            <PandaMascot size={80} />
          </div>
        </div>

        {/* Loading & Error States */}
        {loading && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
            <p style={{ fontWeight: 600 }}>Đang tải lộ trình học HSK...</p>
          </div>
        )}

        {error && !loading && (
          <div
            style={{
              padding: '20px',
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <AlertCircle size={20} />
            <span style={{ fontWeight: 600 }}>{error}</span>
            <button
              type="button"
              onClick={loadRoadmapData}
              className="btn-gamified btn-danger"
              style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Content Section: Level Selection Tabs & Lessons */}
        {!loading && !error && roadmap && (
          <div>
            {/* Level Selector Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '10px',
                marginBottom: '24px',
              }}
            >
              {roadmap.levels.map((lvl) => {
                const isSelected = lvl.id === selectedLevelId
                const isDone = lvl.totalLessons > 0 && lvl.completedLessons === lvl.totalLessons
                const isEmpty = lvl.totalLessons === 0

                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedLevelId(lvl.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary)' : '1.5px solid var(--border-card)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(16, 185, 129, 0.12)' : 'none',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: isSelected ? 'var(--primary-shadow)' : 'var(--text-main)',
                        }}
                      >
                        {lvl.code.replace('_', ' ')}
                      </span>
                      {isDone && <CheckCircle2 size={16} color="var(--primary)" />}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--primary-shadow)' : 'var(--text-muted)' }}>
                      {isEmpty ? (
                        <span style={{ color: '#94a3b8' }}>Đang cập nhật</span>
                      ) : (
                        <span>
                          {lvl.completedLessons}/{lvl.totalLessons} bài ({lvl.progressPercent}%)
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Selected Level View */}
            {selectedLevel && (
              <div
                className="game-card"
                style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Level Summary Header */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1.5px solid var(--border-card)',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {selectedLevel.title}
                      </h2>
                      {selectedLevel.available && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--jade-green-light)',
                            color: 'var(--jade-green-shadow)',
                          }}
                        >
                          Mục tiêu {selectedLevel.targetVocabCount} từ
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                      {selectedLevel.description || 'Học và hoàn thành các bài học bên dưới để đạt tiến độ cấp độ này.'}
                    </p>
                  </div>

                  {/* Level Progress Circle / Bar */}
                  {selectedLevel.available && (
                    <div style={{ minWidth: '220px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                          Tiến độ: {selectedLevel.completedLessons}/{selectedLevel.totalLessons} bài
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          {selectedLevel.progressPercent}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: '8px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${selectedLevel.progressPercent}%`,
                            backgroundColor: 'var(--primary)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* TC-04: Empty state when level has 0 lessons */}
                {!selectedLevel.available && (
                  <div
                    style={{
                      padding: '48px 24px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px dashed var(--border-card)',
                      margin: '12px 0',
                    }}
                  >
                    <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                      <PandaMascot size={64} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                      Nội dung đang được cập nhật
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                      Cấp độ <strong>{selectedLevel.title}</strong> đang trong quá trình biên soạn học liệu chuẩn. Hãy tiếp tục củng cố các bài học ở các cấp độ trước nhé!
                    </p>
                  </div>
                )}

                {/* Lessons List: TC-01, TC-02, TC-03 */}
                {selectedLevel.available && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedLevel.lessons.map((lesson) => {
                      const isUpdating = updatingLessonId === lesson.id

                      return (
                        <div
                          key={lesson.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderRadius: 'var(--radius-md)',
                            border: lesson.completed ? '1.5px solid #a7f3d0' : '1.5px solid var(--border-card)',
                            backgroundColor: lesson.completed ? '#f0fdf4' : '#ffffff',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                            {/* Completion Checkmark Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleCompletion(lesson.id, lesson.completed)}
                              disabled={isUpdating}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: lesson.completed ? 'none' : '2px solid #cbd5e1',
                                backgroundColor: lesson.completed ? 'var(--primary)' : '#ffffff',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                                transition: 'all 0.15s ease',
                              }}
                              title={lesson.completed ? 'Bấm để đánh dấu chưa hoàn thành' : 'Bấm để đánh dấu đã hoàn thành'}
                            >
                              {isUpdating ? (
                                <Loader2 size={16} className="animate-spin" color={lesson.completed ? '#ffffff' : 'var(--primary)'} />
                              ) : lesson.completed ? (
                                <Check size={18} strokeWidth={3} />
                              ) : (
                                <Circle size={16} color="#cbd5e1" />
                              )}
                            </button>

                            {/* Lesson Info */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                <span
                                  style={{
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    padding: '2px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: lesson.completed ? '#dcfce7' : '#f1f5f9',
                                    color: lesson.completed ? '#166534' : 'var(--text-muted)',
                                  }}
                                >
                                  Thứ tự #{lesson.sortOrder}
                                </span>
                                <h4
                                  style={{
                                    fontSize: '0.98rem',
                                    fontWeight: 700,
                                    color: 'var(--text-main)',
                                  }}
                                >
                                  {lesson.title}
                                </h4>
                              </div>

                              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                {lesson.description || 'Nội dung bài học chuẩn theo khung HSK.'}
                              </p>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Layers size={13} /> {lesson.vocabCount} từ vựng
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <FileText size={13} /> {lesson.grammarCount} ngữ pháp
                                </span>
                                {lesson.completed && (
                                  <span style={{ color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    <CheckCircle2 size={13} /> Đã hoàn thành
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => navigate('/curriculum')}
                              className={`btn-gamified ${lesson.completed ? 'btn-green' : 'btn-primary'}`}
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            >
                              <span>{lesson.completed ? 'Ôn lại bài' : 'Vào học'}</span>
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
