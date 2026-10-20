import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle2,
  FileCheck,
  Clock,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Layers,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getPersonalProgress, type PersonalProgressResponse } from '../../api/progress'

export const PersonalProgressPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<PersonalProgressResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!user?.token) return
    setLoading(true)
    setError(null)
    try {
      const res = await getPersonalProgress(user.token)
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin tiến độ học tập')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.token])

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  const overallProgressPercentage =
    data && data.totalLessons > 0
      ? Math.round((data.completedLessons / data.totalLessons) * 1000) / 10
      : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Trang chủ</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
              <GraduationCap className="w-6 h-6" />
              <span>Tiến Độ Học Tập Cá Nhân</span>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 disabled:opacity-50"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Đã xảy ra lỗi</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700 transition"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
            <p className="text-slate-500 font-medium">Đang tổng hợp tiến độ học tập của bạn...</p>
          </div>
        )}

        {data && (
          <>
            {/* KPI Overview Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Bài học hoàn thành */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {overallProgressPercentage}% hoàn thành
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {data.completedLessons}{' '}
                    <span className="text-base font-normal text-slate-500">/ {data.totalLessons} bài</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">Bài học đã hoàn thành</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, overallProgressPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Card 2: Từ vựng đã tích lũy */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Đã ghi nhớ
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {data.learnedVocabulary} <span className="text-base font-normal text-slate-500">từ</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">Từ vựng đã tích lũy qua bài học</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Duy trì thói quen ôn tập mỗi ngày</span>
                </div>
              </div>

              {/* Card 3: Điểm trung bình bài tập */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    {data.averageScorePercentage !== null ? 'Đạt chuẩn' : 'Chưa nộp bài'}
                  </span>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 tracking-tight">
                    {data.averageScorePercentage !== null ? `${data.averageScorePercentage}%` : '---'}
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">Điểm trung bình các bài tập</p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {data.averageScorePercentage !== null
                      ? 'Quy đổi trên thang điểm 100%'
                      : 'Nộp bài tập lớp để ghi nhận điểm số'}
                  </span>
                </div>
              </div>
            </section>

            {/* HSK Levels Progress Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Tiến Độ Theo Cấp Độ HSK
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Khung chương trình chuẩn hóa từ HSK 1 đến HSK 6
                  </p>
                </div>
                <button
                  onClick={() => navigate('/roadmap')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
                >
                  <span>Xem Lộ Trình Chi Tiết</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.hskLevels.map((lvl) => {
                  const isCompleted = lvl.totalLessons > 0 && lvl.completedLessons === lvl.totalLessons
                  return (
                    <div
                      key={lvl.hskLevelId}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg">
                            {lvl.hskLevelCode.replace('_', ' ')}
                          </span>
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Hoàn thành
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-500">
                              {lvl.completedLessons} / {lvl.totalLessons} bài
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg">{lvl.hskLevelTitle}</h3>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-600">
                          <span>Tiến độ hoàn thành</span>
                          <span>{lvl.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${Math.min(100, lvl.progressPercentage)}%` }}
                          />
                        </div>

                        <button
                          onClick={() => navigate('/roadmap')}
                          className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
                        >
                          <span>Học Ngay</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Recent Activities Timeline */}
            <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Hoạt Động Gần Đây
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Nhật ký các bài học đã hoàn thành và bài tập đã nộp
                </p>
              </div>

              {data.recentActivities.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <p className="text-slate-600 font-medium">Chưa có hoạt động nào được ghi nhận</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Hãy bắt đầu học bài đầu tiên trong Lộ trình học tập hoặc làm bài tập được giao để theo dõi tiến độ!
                  </p>
                  <button
                    onClick={() => navigate('/roadmap')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                  >
                    <span>Khám phá Lộ trình học</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {data.recentActivities.map((act, idx) => {
                    const isLesson = act.type === 'LESSON_COMPLETED'
                    return (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                            isLesson ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {isLesson ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <FileCheck className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">{act.title}</h4>
                            <span className="text-xs text-slate-400 flex-shrink-0">
                              {formatTimestamp(act.timestamp)}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            {act.hskLevelTitle && (
                              <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                {act.hskLevelTitle}
                              </span>
                            )}
                            {act.scorePercentage !== null && act.scorePercentage !== undefined && (
                              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                Điểm: {act.scorePercentage}%
                              </span>
                            )}
                            <span>
                              {isLesson ? 'Đã hoàn thành bài học' : 'Đã nộp bài tập'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
