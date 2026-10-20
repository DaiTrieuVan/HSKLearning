import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  History,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  GraduationCap,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getSubmissionHistory, type SubmissionHistoryResponse } from '../../api/progress'
import { SubmissionDetailDrawer } from '../../components/progress/SubmissionDetailDrawer'

export const SubmissionHistoryPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<SubmissionHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAssignments, setExpandedAssignments] = useState<Record<number, boolean>>({})

  // Drawer state for reviewing a specific submission
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const loadData = async () => {
    if (!user?.token) return
    setLoading(true)
    setError(null)
    try {
      const res = await getSubmissionHistory(user.token)
      setData(res)
      // Default: expand all assignments
      const initialExpanded: Record<number, boolean> = {}
      res.items.forEach((item) => {
        initialExpanded[item.assignmentId] = true
      })
      setExpandedAssignments(initialExpanded)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể tải lịch sử làm bài')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.token])

  const toggleExpand = (assignmentId: number) => {
    setExpandedAssignments((prev) => ({
      ...prev,
      [assignmentId]: !prev[assignmentId],
    }))
  }

  const handleOpenDetail = (submissionId: number) => {
    setSelectedSubmissionId(submissionId)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedSubmissionId(null)
  }

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

  // Filtered items based on search query
  const filteredItems = useMemo(() => {
    if (!data?.items) return []
    if (!searchQuery.trim()) return data.items

    const q = searchQuery.toLowerCase().trim()
    return data.items.filter(
      (item) =>
        item.assignmentTitle.toLowerCase().includes(q) ||
        (item.className && item.className.toLowerCase().includes(q))
    )
  }, [data?.items, searchQuery])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/progress')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Tiến độ học</span>
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-lg">
              <History className="w-6 h-6" />
              <span>Lịch Sử Bài Làm & Điểm Số</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/progress')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Tổng quan tiến độ</span>
            </button>

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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800">Đã xảy ra lỗi</h4>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse" />
              ))}
            </div>
            <div className="h-96 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse" />
          </div>
        )}

        {/* Content */}
        {!loading && data && (
          <>
            {/* KPI Overview Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Assignments */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Bài tập đã nộp
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {data.totalAssignments} bài
                  </div>
                </div>
              </div>

              {/* Total Submissions / Attempts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tổng số lượt làm bài
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {data.totalSubmissions} lượt
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Điểm trung bình
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    {data.averageScorePercentage !== null && data.averageScorePercentage !== undefined ? (
                      <span className="text-emerald-600">{data.averageScorePercentage}%</span>
                    ) : (
                      <span className="text-slate-400 text-lg">Chưa có điểm</span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài tập hoặc lớp học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                />
              </div>

              <div className="text-xs font-medium text-slate-500 self-end sm:self-center">
                Hiển thị <strong>{filteredItems.length}</strong> / {data.totalAssignments} bài tập
              </div>
            </div>

            {/* Empty State (TC-04) */}
            {data.totalAssignments === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-xl mx-auto space-y-4 my-12">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <History className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Chưa có bài nào được nộp</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                  Bạn chưa nộp bài tập nào. Hãy tham gia lớp học và hoàn thành các bài tập được giao để theo dõi kết quả và lịch sử nộp bài tại đây!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
                  >
                    <span>Về Bàn làm việc</span>
                  </button>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-slate-100">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">Không tìm thấy bài tập phù hợp</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.
                </p>
              </div>
            ) : (
              /* Assignment History List (TC-01, TC-03) */
              <div className="space-y-5">
                {filteredItems.map((item) => {
                  const isExpanded = !!expandedAssignments[item.assignmentId]
                  return (
                    <div
                      key={item.assignmentId}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:border-slate-300 transition duration-200"
                    >
                      {/* Assignment Card Header */}
                      <div
                        onClick={() => toggleExpand(item.assignmentId)}
                        className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.className && (
                              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                                {item.className}
                              </span>
                            )}
                            <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Nộp gần nhất: {formatTimestamp(item.latestSubmittedAt)}
                            </span>
                            <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" />
                              {item.attemptsCount} lượt làm bài
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 truncate">
                            {item.assignmentTitle}
                          </h3>
                        </div>

                        {/* Best Score Badge (QTN-13) */}
                        <div className="flex items-center gap-4 self-end sm:self-center flex-shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-semibold text-slate-400 block uppercase">
                              Điểm cao nhất
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="text-xl font-black text-indigo-600">
                                {item.bestScore !== null && item.bestScore !== undefined
                                  ? item.bestScore
                                  : '--'}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                / {item.totalPoints}
                              </span>
                              {item.bestScorePercentage !== null && item.bestScorePercentage !== undefined && (
                                <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {item.bestScorePercentage}%
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Attempts Accordion Content (TC-03) */}
                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6 space-y-3">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                            Chi tiết các lượt làm bài ({item.attempts.length} lượt)
                          </div>

                          <div className="space-y-2.5">
                            {item.attempts.map((att) => (
                              <div
                                key={att.submissionId}
                                className="bg-white rounded-xl p-4 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-indigo-300 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                                      att.isBestScore
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    #{att.attemptNumber}
                                  </div>

                                  <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-bold text-slate-800">
                                        Lượt làm thứ {att.attemptNumber}
                                      </span>
                                      {att.isBestScore && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                          <Sparkles className="w-3 h-3 text-amber-500" />
                                          Điểm cao nhất
                                        </span>
                                      )}
                                      {att.status === 'AUTO_SUBMITTED' && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                          Tự nộp
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                      <span>Nộp lúc: {formatTimestamp(att.submittedAt)}</span>
                                      {att.adjustReason && (
                                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                          Sửa điểm: {att.adjustReason}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 self-end sm:self-center">
                                  <div className="text-right">
                                    <div className="text-sm font-black text-slate-900">
                                      {att.effectiveScore !== null && att.effectiveScore !== undefined
                                        ? att.effectiveScore
                                        : '--'}{' '}
                                      <span className="text-xs text-slate-400 font-normal">
                                        / {item.totalPoints}
                                      </span>
                                    </div>
                                    {att.scorePercentage !== null && att.scorePercentage !== undefined && (
                                      <div className="text-xs font-semibold text-slate-500">
                                        {att.scorePercentage}%
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => handleOpenDetail(att.submissionId)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                                  >
                                    <span>Xem bài làm</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Slide-over Drawer (NO MODALS) */}
      <SubmissionDetailDrawer
        isOpen={isDrawerOpen}
        submissionId={selectedSubmissionId}
        token={user?.token || null}
        onClose={handleCloseDrawer}
      />
    </div>
  )
}
