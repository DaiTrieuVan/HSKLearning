import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  FileText,
  Layers,
  Check,
  PenTool,
  Mic,
  Headphones,
  Award,
  BrainCircuit,
  Target,
  Compass,
  ChevronRight,
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
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Top Header */}
      <header
        className="px-3.5 py-3 sm:px-6 sm:py-4 lg:px-7 bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderBottom: '2px solid var(--border-card)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="shrink-0 flex items-center justify-center w-[38px] h-[38px] cursor-pointer transition-all"
            style={{
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
            }}
            title="Quay lại bảng điều khiển"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1
              className="text-lg sm:text-[1.3rem] font-extrabold leading-tight"
              style={{ color: 'var(--text-main)' }}
            >
              Lộ trình học tiếng Trung HSK
            </h1>
            <p className="text-xs sm:text-[0.8rem] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Theo dõi tiến độ từ HSK 1 đến các cấp độ nâng cao
            </p>
          </div>
        </div>
      </header>

      {/* Main Container - Tối ưu độ rộng lên 1440px */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-3.5 py-4 sm:px-6 sm:py-6 lg:px-7">
        {/* Compact Overall Progress Bar */}
        {roadmap && (
          <div
            className="game-card px-4 py-3.5 sm:px-6 sm:py-4 bg-white mb-5 sm:mb-6 rounded-2xl"
            style={{ border: '1.5px solid var(--border-card)' }}
          >
            <div className="flex items-baseline justify-between gap-2 flex-wrap text-[0.85rem] mb-2">
              <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                Tổng số bài đã hoàn thành: <strong style={{ color: 'var(--primary)' }}>{roadmap.totalCompletedLessons}</strong> bài
              </span>
              <span className="shrink-0" style={{ fontWeight: 800, color: 'var(--primary)' }}>
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

        {/* Loading & Error States */}
        {loading && (
          <div className="py-12 px-4 sm:p-[60px] text-center" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={36} className="animate-spin mx-auto mb-3" style={{ color: 'var(--primary)' }} />
            <p style={{ fontWeight: 600 }}>Đang tải lộ trình học HSK...</p>
          </div>
        )}

        {error && !loading && (
          <div
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 mb-6"
            style={{
              backgroundColor: 'var(--danger-light)',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <AlertCircle size={20} className="shrink-0" />
              <span style={{ fontWeight: 600 }}>{error}</span>
            </div>
            <button
              type="button"
              onClick={loadRoadmapData}
              className="btn-gamified btn-danger sm:ml-auto w-full sm:w-auto justify-center whitespace-nowrap"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Content Section: 2-Column Responsive Layout */}
        {!loading && !error && roadmap && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px] gap-5 lg:gap-6 items-start">
            {/* CỘT CHÍNH (BÊN TRÁI): Chọn cấp độ & Danh sách bài học */}
            <div className="flex flex-col gap-5 min-w-0">
              {/* Level Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5">
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
                  className="game-card p-4 sm:p-6 bg-white rounded-2xl"
                  style={{
                    border: '1.5px solid var(--border-card)',
                  }}
                >
                  {/* Level Summary Header */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 pb-4 mb-5"
                    style={{
                      borderBottom: '1.5px solid var(--border-card)',
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h2 className="text-lg sm:text-xl font-extrabold" style={{ color: 'var(--text-main)' }}>
                          {selectedLevel.title}
                        </h2>
                        {selectedLevel.available && (
                          <span
                            className="shrink-0"
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
                      <p className="text-sm sm:text-[0.86rem] m-0" style={{ color: 'var(--text-muted)' }}>
                        {selectedLevel.description || 'Học và hoàn thành các bài học bên dưới để đạt tiến độ cấp độ này.'}
                      </p>
                    </div>

                    {/* Level Progress */}
                    {selectedLevel.available && (
                      <div className="w-full sm:w-auto sm:min-w-[200px] shrink-0">
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
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 p-3.5 sm:px-5 sm:py-4 transition-all"
                            style={{
                              borderRadius: 'var(--radius-md)',
                              border: lesson.completed ? '1.5px solid #a7f3d0' : '1.5px solid var(--border-card)',
                              backgroundColor: lesson.completed ? '#f0fdf4' : '#ffffff',
                            }}
                          >
                            <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                              {/* Completion Checkmark Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleCompletion(lesson.id, lesson.completed)}
                                disabled={isUpdating}
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all mt-0.5 sm:mt-0"
                                style={{
                                  border: lesson.completed ? 'none' : '2px solid #cbd5e1',
                                  backgroundColor: lesson.completed ? 'var(--primary)' : '#ffffff',
                                  color: '#ffffff',
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
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                  <span
                                    className="shrink-0"
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
                                    className="text-[0.95rem] sm:text-[0.98rem] font-bold m-0 break-words"
                                    style={{
                                      color: 'var(--text-main)',
                                    }}
                                  >
                                    {lesson.title}
                                  </h4>
                                </div>

                                <p className="text-xs sm:text-[0.82rem] my-1 break-words" style={{ color: 'var(--text-muted)' }}>
                                  {lesson.description || 'Nội dung bài học chuẩn theo khung HSK.'}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-sub)' }}>
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
                            <div className="flex items-center gap-2 sm:shrink-0">
                              <button
                                type="button"
                                onClick={() => navigate(`/lessons/${lesson.id}`)}
                                className={`btn-gamified ${lesson.completed ? 'btn-green' : 'btn-primary'} w-full sm:w-auto justify-center whitespace-nowrap`}
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

            {/* CỘT PHỤ (BÊN PHẢI): Bảng tổng quan năng lực & Lối tắt công cụ luyện tập */}
            <div className="flex flex-col gap-5 min-w-0">
              {/* Widget 1: Tổng quan Năng lực Cấp độ */}
              {selectedLevel && (
                <div
                  className="game-card p-4 sm:p-5 bg-white rounded-2xl"
                  style={{
                    border: '1.5px solid var(--border-card)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        backgroundColor: '#ecfdf5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Target size={18} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                      Năng lực {selectedLevel.code.replace('_', ' ')}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Mục tiêu từ vựng */}
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Mục tiêu tích lũy</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b' }}>
                        {selectedLevel.targetVocabCount} từ vựng
                      </div>
                    </div>

                    {/* Số bài đã pass */}
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Bài đã hoàn thành</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#10b981' }}>
                        {selectedLevel.completedLessons} / {selectedLevel.totalLessons} bài
                      </div>
                    </div>

                    {/* Thanh tiến độ */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                        <span style={{ color: '#64748b', fontWeight: 600 }}>Tỷ lệ hoàn thành</span>
                        <span style={{ fontWeight: 800, color: '#10b981' }}>{selectedLevel.progressPercent}%</span>
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
                            backgroundColor: '#10b981',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Widget 2: Công cụ luyện tập bổ trợ */}
              <div
                className="game-card p-4 sm:p-5 bg-white rounded-2xl"
                style={{
                  border: '1.5px solid var(--border-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div
                    style={{
                      padding: '6px',
                      borderRadius: '8px',
                      backgroundColor: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Compass size={18} color="#3b82f6" />
                  </div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                    Thực hành bổ trợ
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Luyện viết chữ Hán */}
                  <button
                    type="button"
                    onClick={() => navigate('/writing')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                    className="hover:border-emerald-400 hover:bg-emerald-50/50"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <PenTool size={16} color="#10b981" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                          Luyện viết chữ Hán
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Tập viết chữ nét chuẩn
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>

                  {/* Luyện phát âm */}
                  <button
                    type="button"
                    onClick={() => navigate('/pronunciation')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                    className="hover:border-emerald-400 hover:bg-emerald-50/50"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mic size={16} color="#059669" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                          Luyện phát âm AI
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Nhận diện giọng nói
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>

                  {/* Luyện nghe hiểu */}
                  <button
                    type="button"
                    onClick={() => navigate('/listening')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                    className="hover:border-emerald-400 hover:bg-emerald-50/50"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Headphones size={16} color="#0284c7" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                          Luyện nghe hiểu
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Hội thoại và nhận diện âm
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>

                  {/* Thi thử HSK 3.0 */}
                  <button
                    type="button"
                    onClick={() => navigate('/hsk30/exams')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                    className="hover:border-emerald-400 hover:bg-emerald-50/50"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Award size={16} color="#eab308" />
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#1e293b' }}>
                          Thi thử HSK 3.0
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          Đề thi chuẩn quốc tế
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#94a3b8" />
                  </button>
                </div>
              </div>

              {/* Widget 3: Ôn từ SRS */}
              <div
                className="p-4 sm:px-5 sm:py-4 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-3"
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <BrainCircuit size={22} color="#16a34a" style={{ flexShrink: 0 }} />
                  <div className="min-w-0">
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#166534' }}>
                      Ôn tập ngắt quãng SRS
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                      Củng cố trí nhớ dài hạn
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/srs/review')}
                  className="shrink-0 whitespace-nowrap cursor-pointer"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                  }}
                >
                  Ôn ngay
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
