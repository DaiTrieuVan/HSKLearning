import React, { useEffect, useState } from 'react'
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  Info,
  RefreshCw,
} from 'lucide-react'
import { getSubmissionResultById, type SubmissionResultData } from '../../api/assignment'
import { ApiError } from '../../api/auth'

interface SubmissionDetailDrawerProps {
  isOpen: boolean
  submissionId: number | null
  token: string | null
  onClose: () => void
}

export const SubmissionDetailDrawer: React.FC<SubmissionDetailDrawerProps> = ({
  isOpen,
  submissionId,
  token,
  onClose,
}) => {
  const [data, setData] = useState<SubmissionResultData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !submissionId || !token) {
      setData(null)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getSubmissionResultById(submissionId, token)
        setData(res)
      } catch (err: unknown) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Không thể tải chi tiết bài làm. Vui lòng thử lại.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isOpen, submissionId, token])

  if (!isOpen) return null

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

  const hasAdjusted = data?.adjustedScore !== undefined && data?.adjustedScore !== null
  const displayScore = hasAdjusted ? data?.adjustedScore : data?.score
  const maxScore = data?.maxScore || 10
  const scorePercent = displayScore !== undefined && displayScore !== null && maxScore > 0
    ? Math.round((displayScore / maxScore) * 1000) / 10
    : 0

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Layers className="w-3.5 h-3.5" />
                  Lượt làm thứ {data?.attemptNumber || 1}
                </span>
                {data?.status === 'AUTO_SUBMITTED' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    Tự động nộp
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Đã nộp thành công
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {data?.title || 'Chi tiết bài nộp'}
              </h2>
              {data?.description && (
                <p className="text-xs text-slate-500 line-clamp-2">{data.description}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition"
              title="Đóng chi tiết"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-sm font-medium text-slate-500">Đang tải chi tiết bài làm...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Không thể tải bài làm</h4>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && data && (
              <>
                {/* Score Summary Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <span className="text-indigo-100 text-xs font-medium uppercase tracking-wider">
                        Điểm số lượt này
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold tracking-tight">
                          {displayScore !== undefined && displayScore !== null ? displayScore : '--'}
                        </span>
                        <span className="text-indigo-200 text-lg">/ {maxScore} điểm</span>
                        <span className="ml-2 text-sm font-semibold bg-white/20 px-2.5 py-0.5 rounded-full">
                          {scorePercent}%
                        </span>
                      </div>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Adjusted Score banner if teacher modified score */}
                  {hasAdjusted && (
                    <div className="mt-4 pt-3 border-t border-white/20 text-xs text-indigo-100 space-y-1">
                      <p>
                        Điểm gốc tự động: <strong>{data.score}</strong> điểm
                      </p>
                      {data.adjustReason && (
                        <p>
                          Lý do điều chỉnh: <em>"{data.adjustReason}"</em>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-4 text-xs text-indigo-100">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Nộp lúc: {formatTimestamp(data.submittedAt)}
                    </span>
                  </div>
                </div>

                {/* Show Solutions Info Banner */}
                {data.showSolutions === false && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800">
                        Bài tập đang trong thời gian nộp
                      </h4>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        Hạn nộp bài đến{' '}
                        <strong>{formatTimestamp(data.dueTime)}</strong>. Đáp án đúng và giải thích chi
                        tiết sẽ được hiển thị sau khi bài tập kết thúc.
                      </p>
                    </div>
                  </div>
                )}

                {/* Questions Breakdown */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Chi tiết từng câu hỏi ({data.questions?.length || 0} câu)
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {data.questions?.map((q, idx) => {
                      const isCorrect = q.isCorrect
                      return (
                        <div
                          key={q.questionId || idx}
                          className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm space-y-4 hover:border-slate-300 transition"
                        >
                          {/* Question Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                {q.pointsEarned} / {q.maxPoints} điểm
                              </span>
                            </div>

                            {isCorrect ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Chính xác
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                                <XCircle className="w-3.5 h-3.5" />
                                Chưa chính xác
                              </span>
                            )}
                          </div>

                          {/* Question Content */}
                          <div className="text-sm font-medium text-slate-800 leading-relaxed">
                            {q.content}
                          </div>

                          {/* Options */}
                          {q.options && q.options.length > 0 && (
                            <div className="space-y-2">
                              {q.options.map((opt) => {
                                const isSelected = q.selectedOptionId === opt.id
                                const isOptionCorrect = opt.isCorrect

                                let optStyle = 'border-slate-200 bg-slate-50/50 text-slate-700'
                                if (isSelected) {
                                  if (isOptionCorrect) {
                                    optStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold'
                                  } else {
                                    optStyle = 'border-rose-500 bg-rose-50/80 text-rose-900 font-semibold'
                                  }
                                } else if (data.showSolutions && isOptionCorrect) {
                                  optStyle = 'border-emerald-300 bg-emerald-50/40 text-emerald-800'
                                }

                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-3 rounded-xl border text-sm flex items-center justify-between ${optStyle} transition-colors`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                                          isSelected
                                            ? isCorrect
                                              ? 'border-emerald-600 bg-emerald-600 text-white'
                                              : 'border-rose-600 bg-rose-600 text-white'
                                            : 'border-slate-300 bg-white'
                                        }`}
                                      >
                                        {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                                      </div>
                                      <span>{opt.content}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {isSelected && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-white/70 border border-slate-200 text-slate-600 font-medium">
                                          Lựa chọn của bạn
                                        </span>
                                      )}
                                      {data.showSolutions && isOptionCorrect && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-semibold">
                                          Đáp án đúng
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {/* Student Text Answer if applicable */}
                          {q.studentTextAnswer && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                              <span className="font-semibold text-slate-600">Câu trả lời tự luận:</span>
                              <p className="text-slate-800 font-medium">{q.studentTextAnswer}</p>
                            </div>
                          )}

                          {/* Explanation if showSolutions allowed */}
                          {data.showSolutions && q.explanation && (
                            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-indigo-600" />
                                Giải thích:
                              </span>
                              <p className="text-indigo-950 leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
