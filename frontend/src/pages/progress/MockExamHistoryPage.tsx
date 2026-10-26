import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Search,
  ExternalLink,
  Layers,
  History,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Filter,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getMockExamHistory, type MockExamHistoryResponse, type MockExamHistoryItem } from '../../api/mockExam'

export const MockExamHistoryPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<MockExamHistoryResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedHskLevel, setSelectedHskLevel] = useState<number | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL')

  const loadData = async () => {
    if (!user?.token) return
    setLoading(true)
    setError(null)
    try {
      const res = await getMockExamHistory(user.token)
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử thi thử HSK')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.token])

  const formatTimestamp = (isoString?: string | null) => {
    if (!isoString) return 'Chưa ghi nhận'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('vi-VN', {
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

  const formatDuration = (seconds?: number | null) => {
    if (seconds === undefined || seconds === null) return null
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs} giây`
    if (secs === 0) return `${mins} phút`
    return `${mins} phút ${secs} giây`
  }

  // Filtered items based on search and filters
  const filteredItems = useMemo(() => {
    if (!data?.items) return []
    return data.items.filter((item) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchTitle = item.title?.toLowerCase().includes(q)
        const matchClass = item.className?.toLowerCase().includes(q)
        if (!matchTitle && !matchClass) return false
      }

      // HSK Level filter
      if (selectedHskLevel !== null && item.hskLevel !== selectedHskLevel) {
        return false
      }

      // Passed/Failed status
      if (selectedStatus === 'PASSED' && !item.isPassed) return false
      if (selectedStatus === 'FAILED' && item.isPassed) return false

      return true
    })
  }, [data?.items, searchQuery, selectedHskLevel, selectedStatus])

  const passRate = useMemo(() => {
    if (!data || data.totalExamsTaken === 0) return 0
    return Math.round((data.totalPassed / data.totalExamsTaken) * 100)
  }, [data])

  const handleViewDetail = (item: MockExamHistoryItem) => {
    if (item.classId && item.assignmentId) {
      navigate(`/classes/${item.classId}/assignments/${item.assignmentId}/take`)
    } else {
      navigate('/history')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  <span>Lịch sử thi thử HSK</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Theo dõi kết quả điểm số và mức độ tiến bộ qua các lần thi thử HSK
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          {/* Tab Switcher: Lịch sử thi thử vs Lịch sử bài tập */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-slate-100">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/70"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Đề thi thử HSK</span>
              {data && data.totalExamsTaken > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  {data.totalExamsTaken}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              <History className="w-4 h-4 text-slate-400" />
              <span>Bài tập lớp học</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-rose-700">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="text-xs font-semibold text-rose-700 underline hover:text-rose-800"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm animate-pulse h-28" />
              ))}
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm animate-pulse h-64" />
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Exams Taken */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tổng số đề đã thi
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {data.totalExamsTaken} <span className="text-sm font-normal text-slate-500">đề</span>
                  </div>
                </div>
              </div>

              {/* Passed Count & Rate */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Số đề Đạt / Tỷ lệ
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
                    <span className="text-emerald-600">{data.totalPassed}</span>
                    <span className="text-sm font-medium text-slate-500">
                      / {data.totalExamsTaken} ({passRate}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Điểm trung bình
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {data.totalExamsTaken > 0 ? (
                      <span className="text-slate-900">{data.averageScore.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-400 text-lg">Chưa có điểm</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên đề thi hoặc tên lớp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                {/* Counter */}
                <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
                  Hiển thị <strong>{filteredItems.length}</strong> / {data.totalExamsTaken} đề thi
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mr-2">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Bộ lọc:</span>
                </div>

                {/* HSK Level Pills */}
                <button
                  type="button"
                  onClick={() => setSelectedHskLevel(null)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedHskLevel === null
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả HSK
                </button>
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSelectedHskLevel(selectedHskLevel === level ? null : level)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                      selectedHskLevel === level
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    HSK {level}
                  </button>
                ))}

                <div className="h-4 w-px bg-slate-200 mx-1" />

                {/* Status Pills */}
                <button
                  type="button"
                  onClick={() => setSelectedStatus('ALL')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedStatus === 'ALL'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Tất cả kết quả
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('PASSED')}
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedStatus === 'PASSED'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Đạt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStatus('FAILED')}
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedStatus === 'FAILED'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <XCircle className="w-3 h-3" />
                  <span>Chưa đạt</span>
                </button>
              </div>
            </div>

            {/* Empty State when student has taken 0 exams (TC-02) */}
            {data.totalExamsTaken === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/70 shadow-sm max-w-xl mx-auto space-y-4 my-8">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Chưa có đề thi thử nào đã làm</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                  Bạn chưa hoàn thành đề thi thử HSK nào. Hãy tham gia các kỳ thi thử có tính giờ trong lớp học để thử sức, đánh giá trình độ và theo dõi tiến bộ của mình nhé!
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                  >
                    <span>Về trang chủ lớp học</span>
                  </button>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              /* Empty state when filters return 0 results */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/70 shadow-sm max-w-md mx-auto space-y-3 my-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Không tìm thấy đề thi phù hợp</h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Không có đề thi thử nào khớp với bộ lọc hoặc từ khóa tìm kiếm hiện tại.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedHskLevel(null)
                    setSelectedStatus('ALL')
                  }}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              /* Exam List Cards (TC-01) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item.submissionId}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges & Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* HSK Level */}
                          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-100 text-indigo-800">
                            HSK {item.hskLevel || 1}
                          </span>

                          {/* Classroom Name */}
                          {item.className && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                              <BookOpen className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[150px]">{item.className}</span>
                            </span>
                          )}

                          {/* Attempt number */}
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-slate-500 bg-slate-50">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>Lần #{item.attemptNumber}</span>
                          </span>
                        </div>

                        {/* Pass / Fail Badge */}
                        {item.isPassed ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ĐẠT</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex-shrink-0">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>CHƯA ĐẠT</span>
                          </span>
                        )}
                      </div>

                      {/* Exam Title */}
                      <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-4">
                        {item.title}
                      </h3>

                      {/* Score Breakdown Section */}
                      <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 mb-4 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs font-medium text-slate-500">Điểm số đạt được</span>
                          <div className="flex items-baseline gap-1.5">
                            <span
                              className={`text-xl font-black ${
                                item.isPassed ? 'text-emerald-600' : 'text-slate-800'
                              }`}
                            >
                              {item.effectiveScore.toFixed(2)}
                            </span>
                            <span className="text-xs font-medium text-slate-400">
                              / {item.maxScore.toFixed(2)}
                            </span>
                            <span
                              className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-md ${
                                item.isPassed
                                  ? 'bg-emerald-100/70 text-emerald-800'
                                  : 'bg-slate-200/70 text-slate-700'
                              }`}
                            >
                              {item.percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.isPassed ? 'bg-emerald-500' : 'bg-rose-400'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                          />
                        </div>

                        {/* Passing standard indicator */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                          <span>
                            {item.passingScore !== undefined && item.passingScore !== null
                              ? `Điểm chuẩn đạt: ≥ ${item.passingScore.toFixed(2)} điểm`
                              : 'Chuẩn đạt HSK: ≥ 60% tổng điểm'}
                          </span>
                          {item.adjustedScore !== undefined && item.adjustedScore !== null && (
                            <span className="text-indigo-600 font-semibold">
                              (Đã điều chỉnh: gốc {item.score?.toFixed(2)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <div className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTimestamp(item.submittedAt)}</span>
                        </div>
                        {item.timeSpentSeconds !== undefined && item.timeSpentSeconds !== null && (
                          <div className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDuration(item.timeSpentSeconds)}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDetail(item)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold rounded-xl transition self-end sm:self-auto"
                      >
                        <span>Xem chi tiết & gợi ý</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default MockExamHistoryPage
