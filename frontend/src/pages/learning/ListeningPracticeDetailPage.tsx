import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Award,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getListeningPracticeDetail,
  submitListeningPractice,
  type ListeningPracticeDetail,
  type ListeningPracticeResult,
  type SubmitListeningPracticePayload,
} from '../../api/listening'
import { AudioPlayer } from '../../components/learning/AudioPlayer'

export const ListeningPracticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [practice, setPractice] = useState<ListeningPracticeDetail | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [result, setResult] = useState<ListeningPracticeResult | null>(null)
  const [showTranscript, setShowTranscript] = useState<boolean>(false)

  const practiceId = id ? parseInt(id, 10) : 0

  useEffect(() => {
    if (!user || !practiceId) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    setSelectedAnswers({})
    getListeningPracticeDetail(practiceId, user.token)
      .then((data) => setPractice(data))
      .catch((err: any) => {
        setError(err?.message || 'Không thể tải chi tiết bài nghe.')
      })
      .finally(() => setIsLoading(false))
  }, [practiceId, user])

  const handleSelectOption = (questionId: number, optionId: number) => {
    if (result) return // Đã nộp bài thì không đổi đáp án
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const handleSubmit = async () => {
    if (!user || !practice) return

    // Kiểm tra xem đã trả lời hết câu hỏi chưa
    const unansweredCount =
      practice.questions.length - Object.keys(selectedAnswers).length
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Bạn vẫn còn ${unansweredCount} câu hỏi chưa chọn đáp án. Bạn có chắc chắn muốn nộp bài không?`
      )
      if (!confirmSubmit) return
    }

    setIsSubmitting(true)
    setError(null)

    const payload: SubmitListeningPracticePayload = {
      answers: practice.questions.map((q) => ({
        questionId: q.questionId,
        selectedOptionId: selectedAnswers[q.questionId] || null,
      })),
    }

    try {
      const res = await submitListeningPractice(practice.id, payload, user.token)
      setResult(res)
      // Tự động mở transcript sau khi nộp để học sinh đối chiếu
      setShowTranscript(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err?.message || 'Không thể nộp bài nghe. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetryPractice = () => {
    setResult(null)
    setSelectedAnswers({})
    setShowTranscript(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">
            Đang tải dữ liệu bài nghe...
          </p>
        </div>
      </div>
    )
  }

  if (error && !practice) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-500">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
          Không tìm thấy bài luyện nghe
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/listening')}
          className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại danh sách bài nghe</span>
        </button>
      </div>
    )
  }

  if (!practice) return null

  const answeredQuestionsCount = Object.keys(selectedAnswers).length
  const totalQuestionsCount = practice.questions.length

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Nút quay lại & Header bài nghe */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/listening')}
          className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Danh sách bài nghe</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            HSK {practice.hskLevel || 1}
          </span>
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {practice.totalPoints} điểm
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
          {practice.title}
        </h1>
        {practice.description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {practice.description}
          </p>
        )}
      </div>

      {/* Trình phát Audio sticky */}
      <div className="sticky top-4 z-20 mb-8">
        <AudioPlayer
          src={practice.primaryAudioUrl}
          title={practice.title}
          onErrorOccurred={(msg) => setAudioError(msg)}
        />
      </div>

      {/* HTT-10-CN-001-TC-02: Cảnh báo khi audio bị lỗi */}
      {audioError && !result && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div className="flex-1 text-xs sm:text-sm">
              <p className="font-semibold">Lưu ý sự cố âm thanh:</p>
              <p className="mt-0.5">{audioError}</p>
              <p className="mt-1 text-amber-700 dark:text-amber-300/70">
                Bạn không phải chịu phạt hay mất lượt nộp khi gặp sự cố đường truyền audio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Màn hình kết quả sau khi nộp (HTT-10-CN-001-TC-01) */}
      {result && (
        <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Hoàn thành bài luyện nghe</span>
              </div>
              <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                Kết quả bài làm của bạn
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Điểm số</p>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {result.earnedPoints} / {result.totalPoints}
                </p>
              </div>

              <div
                className={`rounded-2xl px-4 py-3 text-center ${
                  result.passed
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider">
                  {result.passed ? 'ĐẠT' : 'CẦN CỐ GẮNG'}
                </p>
                <p className="text-lg font-black">{Math.round(result.scorePercentage)}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span>
                Số câu đúng:{' '}
                <strong className="text-slate-900 dark:text-white">
                  {result.correctAnswersCount} / {result.totalQuestions}
                </strong>
              </span>
              <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                <Award className="h-4 w-4" />
                <strong>+{result.correctAnswersCount * 10} XP</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleRetryPractice}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Làm lại bài này</span>
            </button>
          </div>

          {/* Accordion mở rộng xem Transcript & Đoạn hội thoại */}
          {(result.transcript || practice.transcript) && (
            <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
              <button
                type="button"
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex w-full items-center justify-between text-left text-sm font-bold text-indigo-900 dark:text-indigo-200"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Transcript & Lời thoại bài nghe</span>
                </div>
                {showTranscript ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showTranscript && (
                <div className="mt-3 whitespace-pre-line border-t border-indigo-100/80 pt-3 text-xs leading-relaxed text-indigo-950/80 dark:border-indigo-900/40 dark:text-indigo-200/90 font-mono">
                  {result.transcript || practice.transcript}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Danh sách câu hỏi */}
      <div className="space-y-6">
        {practice.questions.map((question, qIdx) => {
          const gradedInfo = result?.gradedQuestions.find(
            (g) => g.questionId === question.questionId
          )
          const isCorrect = gradedInfo?.isCorrect
          const selectedOption = selectedAnswers[question.questionId]

          return (
            <div
              key={question.questionId}
              className={`rounded-2xl border bg-white p-6 shadow-sm transition dark:bg-slate-900 ${
                result
                  ? isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/50'
                    : 'border-rose-200 dark:border-rose-900/50'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {/* Header câu hỏi */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Câu hỏi trắc nghiệm
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {result && (
                    <span
                      className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Đúng (+{gradedInfo?.pointsEarned} điểm)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Sai (0 điểm)</span>
                        </>
                      )}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-500">
                    {question.points} điểm
                  </span>
                </div>
              </div>

              {/* Nội dung câu hỏi & Pinyin */}
              <div className="mb-4">
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  {question.content}
                </p>
                {question.pinyin && (
                  <p className="mt-1 text-xs font-mono text-indigo-600 dark:text-indigo-400">
                    {question.pinyin}
                  </p>
                )}
              </div>

              {/* Danh sách lựa chọn (A, B, C, D) */}
              <div className="space-y-2.5">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.id
                  const isThisOptionCorrect =
                    result && gradedInfo?.correctOptionId === option.id

                  let optionStyle =
                    'border-slate-200 bg-white text-slate-800 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-indigo-600'

                  if (result) {
                    if (isThisOptionCorrect) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold'
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-200'
                    } else {
                      optionStyle =
                        'border-slate-200 bg-slate-50/50 opacity-60 dark:border-slate-800 dark:bg-slate-800/30'
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-600/20 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-200 font-semibold'
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={Boolean(result)}
                      onClick={() => handleSelectOption(question.questionId, option.id)}
                      className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-sm transition ${optionStyle}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isSelected || isThisOptionCorrect
                              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {option.label}
                        </span>
                        <span>{option.content}</span>
                      </div>

                      {result && isThisOptionCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {result && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Lời giải thích khi đã nộp bài */}
              {result && gradedInfo?.explanation && (
                <div className="mt-4 rounded-xl border border-indigo-100/80 bg-indigo-50/40 p-3.5 text-xs text-indigo-900 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-300">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                    <div>
                      <span className="font-bold">Giải thích: </span>
                      <span>{gradedInfo.explanation}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Thanh nộp bài cố định ở góc dưới nếu chưa nộp */}
      {!result && (
        <div className="sticky bottom-6 mt-8 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Đã trả lời:{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">
                {answeredQuestionsCount} / {totalQuestionsCount}
              </strong>{' '}
              câu
            </div>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Đang chấm điểm...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Nộp bài nghe</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default ListeningPracticeDetailPage
