import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Send,
  Headphones,
  BookOpen,
  Check,
  FileText,
  LayoutGrid,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  takeHsk30Exam,
  submitHsk30Exam,
  type Hsk30ExamDetail,
  type Hsk30ExamResult,
  type Hsk30QuestionItem,
} from '../../api/hsk30'
import { AudioPlayer } from '../../components/learning/AudioPlayer'

export const Hsk30TakeExamPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const examId = id ? parseInt(id, 10) : 0

  const [exam, setExam] = useState<Hsk30ExamDetail | null>(null)
  const [answers, setAnswers] = useState<
    Record<number, { selectedOptionId?: number | null; selectedKey?: string | null }>
  >({})
  const [timeLeft, setTimeLeft] = useState<number>(2400) // 40 phút = 2400s
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false)
  const [result, setResult] = useState<Hsk30ExamResult | null>(null)

  // Timer interval ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!user || !examId) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    setAnswers({})

    takeHsk30Exam(examId, user.token)
      .then((data) => {
        setExam(data)
        if (data.sections && data.sections.length > 0) {
          setActiveSectionId(data.sections[0].sectionId)
        }
        const initialSeconds = (data.timeLimitMinutes || 40) * 60
        setTimeLeft(initialSeconds)
      })
      .catch((err: any) => {
        setError(err?.message || 'Không thể tải đề thi HSK 3.0')
      })
      .finally(() => setIsLoading(false))
  }, [examId, user])

  // Countdown timer
  useEffect(() => {
    if (!exam || result) return

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [exam, result])

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Thu thập toàn bộ 40 câu hỏi của đề thi
  const allQuestions: Array<{ q: Hsk30QuestionItem; sectionName: string; partNumber: number }> = []
  if (exam?.sections) {
    exam.sections.forEach((sec) => {
      sec.parts.forEach((p) => {
        p.questions.forEach((q) => {
          allQuestions.push({ q, sectionName: sec.name, partNumber: p.partNumber })
        })
      })
    })
  }

  const answeredCount = Object.values(answers).filter(
    (a) => a.selectedKey || a.selectedOptionId
  ).length
  const totalQuestionsCount = allQuestions.length || 40

  const handleSelectOptionId = (questionId: number, optionId: number, labelKey?: string) => {
    if (result) return
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionId: optionId,
        selectedKey: labelKey || prev[questionId]?.selectedKey,
      },
    }))
  }

  const handleSelectKey = (questionId: number, key: string) => {
    if (result) return
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedKey: prev[questionId]?.selectedKey === key ? null : key,
      },
    }))
  }

  const scrollToQuestion = (questionId: number) => {
    const element = document.getElementById(`question-card-${questionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleAutoSubmit = () => {
    handleSubmit()
  }

  const handleSubmit = async () => {
    if (!user || !examId || isSubmitting || result) return

    setIsSubmitting(true)
    setError(null)

    const payloadAnswers = Object.entries(answers).map(([qIdStr, ans]) => ({
      questionId: parseInt(qIdStr, 10),
      selectedOptionId: ans.selectedOptionId || null,
      selectedKey: ans.selectedKey || null,
    }))

    const initialSeconds = (exam?.timeLimitMinutes || 40) * 60
    const timeSpent = Math.max(0, initialSeconds - timeLeft)

    try {
      const res = await submitHsk30Exam(examId, user.token, {
        answers: payloadAnswers,
        timeSpentSeconds: timeSpent,
      })
      setResult(res)
      setShowSubmitConfirm(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-11 h-11 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium text-sm">Đang chuẩn bị phòng thi HSK 3.0...</p>
        </div>
      </div>
    )
  }

  if (error && !exam) {
    return (
      <div className="min-h-[60vh] p-4 sm:p-6 flex flex-col items-center justify-center text-slate-800">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-rose-200 shadow-sm text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3.5" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Không thể tải đề thi</h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-5">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-sm transition"
          >
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  // ==================== RESULT CERTIFICATE VIEW ====================
  if (result) {
    return (
      <div className="w-full max-w-4xl mx-auto py-3 sm:py-6 space-y-5 sm:space-y-6 text-slate-800">
        {/* Top Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/learning/listening')}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-xl shadow-xs transition text-xs sm:text-sm whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Về danh sách bài học</span>
          </button>
          <span className="text-xs px-3 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            Chuẩn HSK 3.0 • Cấp 1
          </span>
        </div>

        {/* Certificate Header Card */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-emerald-200 p-4 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
            <div className="text-center md:text-left min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 bg-amber-50 text-amber-700 border border-amber-200">
                <Award className="w-4 h-4 shrink-0" />
                <span>Bảng điểm thi thử HSK 3.0</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight break-words">
                {result.examTitle}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Thí sinh: <span className="text-slate-800 font-semibold">{user?.fullName || user?.email}</span> • Ngày nộp:{' '}
                {new Date(result.submittedAt).toLocaleDateString('vi-VN')}
              </p>
            </div>

            {/* Total Score Badge */}
            <div className="flex flex-col items-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 w-full sm:w-auto sm:min-w-[200px] shrink-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng điểm đạt được</span>
              <div className="flex items-baseline gap-1 my-1">
                <span
                  className={`text-4xl sm:text-5xl font-black ${
                    result.passed ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {result.totalScore}
                </span>
                <span className="text-slate-500 text-base sm:text-lg font-bold">/ {result.maxScore}</span>
              </div>
              <div
                className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                  result.passed
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {result.passed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> ĐẠT YÊU CẦU (PASS)
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 shrink-0" /> CHƯA ĐẠT (≥ 120 điểm)
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Headphones className="w-4 h-4 text-sky-600 shrink-0" /> 听力 - Phần Nghe
                </span>
                <span className="font-bold text-sky-700">{result.listeningScore} / 100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, result.listeningScore)}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" /> 阅读 - Phần Đọc
                </span>
                <span className="font-bold text-emerald-700">{result.readingScore} / 100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, result.readingScore)}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 sm:col-span-2 md:col-span-1">
              <div className="text-xs mb-1 font-semibold text-slate-700 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Tỉ lệ câu đúng
              </div>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {result.totalCorrect}{' '}
                <span className="text-xs font-normal text-slate-500">/ {result.totalQuestions} câu</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round((result.totalCorrect / result.totalQuestions) * 100)}% chính xác
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setResult(null)
              setAnswers({})
              setTimeLeft((exam?.timeLimitMinutes || 40) * 60)
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4 shrink-0" /> Làm lại bài thi
          </button>
          <button
            type="button"
            onClick={() => navigate('/learning/listening')}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition border border-slate-200 whitespace-nowrap"
          >
            Về danh sách bài học
          </button>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div className="space-y-5 sm:space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 shrink-0" /> Chi tiết đáp án và lời giải (40 câu)
          </h2>

          {result.sections.map((sec) => (
            <div key={sec.sectionId} className="space-y-3.5 sm:space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <h3 className="text-base sm:text-lg font-bold text-emerald-700">{sec.name}</h3>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
                  Đúng: {sec.correctCount} / {sec.totalCount} câu • Điểm: {sec.score} / {sec.maxScore}
                </span>
              </div>

              {sec.parts.map((p) => (
                <div key={p.groupId} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3.5 sm:space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">{p.title}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                      {p.correctCount}/{p.totalCount} câu đúng
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {p.questions.map((q) => (
                      <div
                        key={q.questionId}
                        className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition ${
                          q.correct
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-rose-50/50 border-rose-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-1 min-w-0">
                            <span className="font-bold text-slate-900 break-words">
                              Câu {q.questionNumber}: {q.content}
                            </span>
                            {q.pinyin && <p className="text-xs text-slate-500 italic break-words">{q.pinyin}</p>}
                          </div>
                          <span
                            className={`self-start shrink-0 text-xs font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1 whitespace-nowrap ${
                              q.correct
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {q.correct ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đúng (+{q.earnedPoints})
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" /> Sai (0/{q.maxPoints})
                              </>
                            )}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/80 flex flex-wrap gap-3 sm:gap-4 text-xs">
                          <span className="text-slate-600">
                            Đáp án của bạn:{' '}
                            <strong className={q.correct ? 'text-emerald-700' : 'text-rose-600'}>
                              {q.selectedKey || 'Chưa chọn'}
                            </strong>
                          </span>
                          <span className="text-slate-600">
                            Đáp án đúng: <strong className="text-emerald-700">{q.correctKey}</strong>
                          </span>
                        </div>

                        {q.explanation && (
                          <div className="mt-2 text-xs bg-white p-2.5 rounded-lg text-slate-700 border border-slate-200">
                            <span className="font-semibold text-amber-700">Giải thích: </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ==================== EXAM ROOM (TAKE TEST) VIEW ====================
  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-5 text-slate-800 pb-8">
      {/* Compact Top Control Bar */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 shrink-0 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 border border-slate-200 transition"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {exam?.title}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 truncate">
                HSK 1 Chuẩn 3.0 • 40 câu • 200 điểm (Đạt ≥ 120)
              </div>
            </div>
          </div>

          {/* Right controls: Timer & Submit button */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm tracking-wider whitespace-nowrap ${
                timeLeft < 300
                  ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <Clock className={`w-4 h-4 shrink-0 ${timeLeft < 300 ? 'text-rose-600' : 'text-emerald-600'}`} />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitConfirm(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-xs whitespace-nowrap"
            >
              <Send className="w-4 h-4 shrink-0" />
              <span>Nộp bài ({answeredCount}/40)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-6 items-start">
        {/* Left 3 cols: Sections & Questions */}
        <div className="lg:col-span-3 space-y-5 sm:space-y-6 min-w-0">
          {/* Section Navigation Tabs */}
          <div className="flex flex-col sm:flex-row gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
            {exam?.sections.map((sec) => (
              <button
                key={sec.sectionId}
                type="button"
                onClick={() => setActiveSectionId(sec.sectionId)}
                className={`flex-1 py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition whitespace-nowrap ${
                  activeSectionId === sec.sectionId
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {sec.name.includes('Nghe') ? (
                  <Headphones className="w-4 h-4 shrink-0" />
                ) : (
                  <BookOpen className="w-4 h-4 shrink-0" />
                )}
                <span>{sec.name}</span>
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          {exam?.sections
            .filter((s) => s.sectionId === activeSectionId)
            .map((section) => (
              <div key={section.sectionId} className="space-y-5 sm:space-y-6">
                {section.parts.map((part) => (
                  <div
                    key={part.groupId}
                    className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5"
                  >
                    {/* Part Header */}
                    <div className="border-b border-slate-100 pb-3.5 sm:pb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                          {part.title}
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider font-mono break-all">
                          {part.formatCode}
                        </span>
                      </div>
                      <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-900">
                        {part.instruction}
                      </h2>
                    </div>

                    {/* Shared Resources: If Matching Images/QA/Words or Passage exists */}
                    {part.sharedOptions && part.sharedOptions.length > 0 && (
                      <div className="p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
                          <LayoutGrid className="w-4 h-4 shrink-0" /> Ngân hàng lựa chọn dùng chung (A–F):
                        </div>

                        {/* Shared Options Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                          {part.sharedOptions.map((opt) => (
                            <div
                              key={opt.key}
                              className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200 flex flex-col items-center text-center group hover:border-emerald-300 transition"
                            >
                              <span className="inline-block px-2.5 py-0.5 mb-2 bg-emerald-50 text-emerald-700 font-black rounded-lg text-xs sm:text-sm border border-emerald-200">
                                {opt.key}
                              </span>

                              {opt.imageUrl && (
                                <img
                                  src={opt.imageUrl}
                                  alt={`Option ${opt.key}`}
                                  className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2"
                                />
                              )}

                              {opt.text && (
                                <p className="font-bold text-slate-900 text-sm sm:text-base break-words">{opt.text}</p>
                              )}

                              {opt.pinyin && (
                                <p className="text-xs text-slate-500 italic break-words">{opt.pinyin}</p>
                              )}

                              {opt.description && (
                                <p className="text-xs text-slate-500 mt-1 break-words">{opt.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shared Reading Passage if Present */}
                    {part.passage && (
                      <div className="p-4 sm:p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                          <BookOpen className="w-4 h-4 shrink-0" /> Đoạn văn bài đọc:
                        </div>
                        <p className="text-sm sm:text-base md:text-lg text-slate-900 leading-relaxed font-serif tracking-wide break-words">
                          {part.passage}
                        </p>
                      </div>
                    )}

                    {/* Questions in this Part */}
                    <div className="space-y-4">
                      {part.questions.map((question) => {
                        const currentAnswer = answers[question.questionId]
                        const hasAnswer = Boolean(currentAnswer?.selectedKey || currentAnswer?.selectedOptionId)

                        return (
                          <div
                            key={question.questionId}
                            id={`question-card-${question.questionId}`}
                            className={`p-3.5 sm:p-5 rounded-xl border transition-all ${
                              hasAnswer
                                ? 'bg-emerald-50/30 border-emerald-200'
                                : 'bg-slate-50/50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2.5 mb-3">
                              <div className="min-w-0">
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-white text-slate-700 border border-slate-200 mr-2">
                                  Câu {question.questionNumber}
                                </span>
                                <span className="text-sm sm:text-base font-semibold text-slate-900 break-words">
                                  {question.content}
                                </span>
                                {question.pinyin && (
                                  <p className="text-xs text-slate-500 italic mt-0.5 break-words">{question.pinyin}</p>
                                )}
                              </div>
                              <span className="shrink-0 text-xs text-slate-500 font-mono whitespace-nowrap">
                                5.0 điểm
                              </span>
                            </div>

                            {/* Audio Player if Available */}
                            {question.audioUrl && (
                              <div className="mb-4">
                                <AudioPlayer
                                  variant="light"
                                  src={question.audioUrl}
                                  title={`Audio Câu ${question.questionNumber}`}
                                />
                              </div>
                            )}

                            {/* Format 1: LISTEN_IMAGE_3 (Image options A/B/C) */}
                            {part.formatCode === 'LISTEN_IMAGE_3' && question.options && (
                              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {question.options.map((opt) => {
                                  const isSelected =
                                    currentAnswer?.selectedOptionId === opt.id ||
                                    currentAnswer?.selectedKey === opt.label

                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => handleSelectOptionId(question.questionId, opt.id, opt.label)}
                                      className={`p-2 sm:p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 sm:gap-2 transition ${
                                        isSelected
                                          ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                                          : 'bg-white border-slate-200 hover:border-emerald-300'
                                      }`}
                                    >
                                      <span
                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                          isSelected
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        {opt.label}
                                      </span>
                                      {opt.imageUrl ? (
                                        <img
                                          src={opt.imageUrl}
                                          alt={`Option ${opt.label}`}
                                          className="w-full h-20 sm:h-24 object-cover rounded-lg"
                                        />
                                      ) : (
                                        <span className="text-xs text-slate-700 break-words">{opt.content}</span>
                                      )}
                                    </button>
                                  )
                                })}
                              </div>
                            )}

                            {/* Format 2, 4 & Reading MCQ: Text options A/B/C */}
                            {(part.formatCode === 'LISTEN_MCQ_3' ||
                              part.formatCode === 'LISTEN_COMPREHENSION' ||
                              part.formatCode === 'READ_COMPREHENSION') &&
                              question.options &&
                              question.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                                  {question.options.map((opt) => {
                                    const isSelected =
                                      currentAnswer?.selectedOptionId === opt.id ||
                                      currentAnswer?.selectedKey === opt.label

                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleSelectOptionId(question.questionId, opt.id, opt.label)}
                                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                                          isSelected
                                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                                            : 'bg-white border-slate-200 hover:border-emerald-300'
                                        }`}
                                      >
                                        <span
                                          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${
                                            isSelected
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-slate-100 text-slate-700'
                                          }`}
                                        >
                                          {opt.label}
                                        </span>
                                        <span className="text-xs sm:text-sm font-medium text-slate-800 break-words min-w-0">
                                          {opt.content}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}

                            {/* Format 3, 5, 6, 7: Matching A–F Key Selectors */}
                            {(part.formatCode === 'LISTEN_IMAGE_MATCH' ||
                              part.formatCode === 'READ_IMAGE_MATCH' ||
                              part.formatCode === 'READ_QA_MATCH' ||
                              part.formatCode === 'READ_WORD_BANK') && (
                              <div className="space-y-2">
                                <span className="text-xs text-slate-500 font-medium">
                                  Chọn thẻ ghép tương ứng (A–F):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {['A', 'B', 'C', 'D', 'E', 'F'].map((key) => {
                                    const isSelected = currentAnswer?.selectedKey === key

                                    return (
                                      <button
                                        key={key}
                                        type="button"
                                        onClick={() => handleSelectKey(question.questionId, key)}
                                        className={`px-3.5 py-2 rounded-xl border font-bold text-xs sm:text-sm transition inline-flex items-center gap-1.5 whitespace-nowrap ${
                                          isSelected
                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                      >
                                        <span>Thẻ {key}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>

        {/* Right 1 col: Sticky Question Palette & Submit Bar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-5">
            {/* Palette Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-emerald-600 shrink-0" /> Bảng câu hỏi (40 câu)
                </h3>
                <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                  {answeredCount}/40 đã chọn
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / 40) * 100}%` }}
                />
              </div>

              {/* Section 1 palette (1–20) */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                  <Headphones className="w-3.5 h-3.5 shrink-0" /> 听力 - Phần Nghe (1–20)
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5">
                  {allQuestions.slice(0, 20).map(({ q }) => {
                    const ans = answers[q.questionId]
                    const isAnswered = Boolean(ans?.selectedKey || ans?.selectedOptionId)

                    return (
                      <button
                        key={q.questionId}
                        type="button"
                        onClick={() => {
                          if (exam?.sections[0]) setActiveSectionId(exam.sections[0].sectionId)
                          scrollToQuestion(q.questionId)
                        }}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isAnswered
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {q.questionNumber}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Section 2 palette (21–40) */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" /> 阅读 - Phần Đọc (21–40)
                </span>
                <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-5 gap-1.5">
                  {allQuestions.slice(20, 40).map(({ q }) => {
                    const ans = answers[q.questionId]
                    const isAnswered = Boolean(ans?.selectedKey || ans?.selectedOptionId)

                    return (
                      <button
                        key={q.questionId}
                        type="button"
                        onClick={() => {
                          if (exam?.sections[1]) setActiveSectionId(exam.sections[1].sectionId)
                          scrollToQuestion(q.questionId)
                        }}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isAnswered
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {q.questionNumber}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full mt-2 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Nộp bài thi</span>
              </button>
            </div>

            {/* Inline Confirm Submit Card (No modal popup constraint) */}
            {showSubmitConfirm && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-md space-y-3.5 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Xác nhận nộp bài?</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Bạn đã trả lời <strong className="text-slate-900">{answeredCount}</strong> trên tổng số{' '}
                  <strong className="text-slate-900">{totalQuestionsCount}</strong> câu hỏi.
                  {answeredCount < totalQuestionsCount && (
                    <span className="block mt-1 text-amber-800 font-medium">
                      Còn {totalQuestionsCount - answeredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp ngay?
                    </span>
                  )}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit()}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 shrink-0" /> Đồng ý nộp
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setShowSubmitConfirm(false)}
                    className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs transition whitespace-nowrap"
                  >
                    Làm tiếp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
