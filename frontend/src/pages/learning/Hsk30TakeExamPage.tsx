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
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Đang chuẩn bị phòng thi HSK 3.0...</p>
        </div>
      </div>
    )
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 border border-rose-500/30 text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Không thể tải đề thi</h2>
          <p className="text-slate-300 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition"
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
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/learning/listening')}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Về danh sách bài học
            </button>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Chuẩn HSK 3.0 • Cấp 1
            </span>
          </div>

          {/* Certificate Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Award className="w-4 h-4" />
                  Bảng điểm thi thử HSK 3.0
                </div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{result.examTitle}</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Thí sinh: <span className="text-slate-200 font-semibold">{user?.fullName || user?.email}</span> • Ngày nộp:{' '}
                  {new Date(result.submittedAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* Total Score Badge */}
              <div className="flex flex-col items-center p-6 bg-slate-800/80 rounded-2xl border border-slate-700/60 shadow-lg min-w-[200px]">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng điểm đạt được</span>
                <div className="flex items-baseline gap-1 my-1">
                  <span
                    className={`text-5xl font-black ${
                      result.passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {result.totalScore}
                  </span>
                  <span className="text-slate-400 text-lg font-bold">/ {result.maxScore}</span>
                </div>
                <div
                  className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    result.passed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {result.passed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> ĐẠT YÊU CẦU (PASS)
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> CHƯA ĐẠT (≥ 120 điểm)
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Breakdown Grid */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Headphones className="w-4 h-4 text-sky-400" /> 听力 - Phần Nghe
                  </span>
                  <span className="font-bold text-sky-400">{result.listeningScore} / 100</span>
                </div>
                <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-sky-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, result.listeningScore)}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <BookOpen className="w-4 h-4 text-emerald-400" /> 阅读 - Phần Đọc
                  </span>
                  <span className="font-bold text-emerald-400">{result.readingScore} / 100</span>
                </div>
                <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, result.readingScore)}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 sm:col-span-2 md:col-span-1">
                <div className="text-xs text-slate-400 mb-1 font-semibold text-slate-300 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-indigo-400" /> Tỉ lệ câu đúng
                </div>
                <p className="text-xl font-bold text-white mt-1">
                  {result.totalCorrect}{' '}
                  <span className="text-xs font-normal text-slate-400">/ {result.totalQuestions} câu</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {Math.round((result.totalCorrect / result.totalQuestions) * 100)}% chính xác
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                setResult(null)
                setAnswers({})
                setTimeLeft((exam?.timeLimitMinutes || 40) * 60)
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-600/30"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại bài thi
            </button>
            <button
              onClick={() => navigate('/learning/listening')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition border border-slate-700"
            >
              Về danh sách bài học
            </button>
          </div>

          {/* Detailed Question Review Breakdown */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" /> Chi tiết đáp án và lời giải (40 câu)
            </h2>

            {result.sections.map((sec) => (
              <div key={sec.sectionId} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-lg font-bold text-indigo-300">{sec.name}</h3>
                  <span className="text-sm font-semibold text-slate-400">
                    Đúng: {sec.correctCount} / {sec.totalCount} câu • Điểm: {sec.score} / {sec.maxScore}
                  </span>
                </div>

                {sec.parts.map((p) => (
                  <div key={p.groupId} className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-sm">{p.title}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {p.correctCount}/{p.totalCount} câu đúng
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {p.questions.map((q) => (
                        <div
                          key={q.questionId}
                          className={`p-4 rounded-xl border text-sm transition ${
                            q.correct
                              ? 'bg-emerald-950/20 border-emerald-500/30'
                              : 'bg-rose-950/20 border-rose-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="font-bold text-slate-300">
                                Câu {q.questionNumber}: {q.content}
                              </span>
                              {q.pinyin && <p className="text-xs text-slate-400 italic">{q.pinyin}</p>}
                            </div>
                            <span
                              className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                                q.correct
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
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

                          <div className="mt-3 pt-2 border-t border-slate-800/60 flex flex-wrap gap-4 text-xs">
                            <span className="text-slate-400">
                              Đáp án của bạn:{' '}
                              <strong className={q.correct ? 'text-emerald-300' : 'text-rose-400'}>
                                {q.selectedKey || 'Chưa chọn'}
                              </strong>
                            </span>
                            <span className="text-slate-400">
                              Đáp án đúng: <strong className="text-emerald-400">{q.correctKey}</strong>
                            </span>
                          </div>

                          {q.explanation && (
                            <div className="mt-2 text-xs bg-slate-800/60 p-2.5 rounded-lg text-slate-300 border border-slate-700/50">
                              <span className="font-semibold text-amber-300">Giải thích: </span>
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
      </div>
    )
  }

  // ==================== EXAM ROOM (TAKE TEST) VIEW ====================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base md:text-lg font-bold text-white tracking-tight line-clamp-1">
                {exam?.title}
              </h1>
              <p className="text-xs text-slate-400">
                HSK 1 Chuẩn 3.0 • 40 câu hỏi • 200 điểm • Đạt từ 120 điểm
              </p>
            </div>
          </div>

          {/* Right Header items: Timer & Submit button */}
          <div className="flex items-center gap-3">
            {/* Timer pill */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-wider ${
                timeLeft < 300
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30'
              }`}
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{formatTimer(timeLeft)}</span>
            </div>

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài ({answeredCount}/40)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Left 3 cols: Sections & Questions */}
        <div className="lg:col-span-3 space-y-8">
          {/* Section Navigation Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {exam?.sections.map((sec) => (
              <button
                key={sec.sectionId}
                onClick={() => setActiveSectionId(sec.sectionId)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition ${
                  activeSectionId === sec.sectionId
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {sec.name.includes('Nghe') ? (
                  <Headphones className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                <span>{sec.name}</span>
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          {exam?.sections
            .filter((s) => s.sectionId === activeSectionId)
            .map((section) => (
              <div key={section.sectionId} className="space-y-8">
                {section.parts.map((part) => (
                  <div
                    key={part.groupId}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
                  >
                    {/* Part Header */}
                    <div className="border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {part.title}
                        </span>
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                          Format: {part.formatCode}
                        </span>
                      </div>
                      <h2 className="text-base md:text-lg font-bold text-white">{part.instruction}</h2>
                    </div>

                    {/* Shared Resources: If Matching Images/QA/Words or Passage exists */}
                    {part.sharedOptions && part.sharedOptions.length > 0 && (
                      <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                          <LayoutGrid className="w-4 h-4" /> Ngân hàng lựa chọn dùng chung (A–F):
                        </div>

                        {/* Shared Options Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {part.sharedOptions.map((opt) => (
                            <div
                              key={opt.key}
                              className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 flex flex-col items-center text-center group hover:border-indigo-500/50 transition"
                            >
                              <span className="inline-block px-2.5 py-0.5 mb-2 bg-indigo-600/30 text-indigo-300 font-black rounded-lg text-sm border border-indigo-500/40">
                                {opt.key}
                              </span>

                              {opt.imageUrl && (
                                <img
                                  src={opt.imageUrl}
                                  alt={`Option ${opt.key}`}
                                  className="w-full h-28 object-cover rounded-lg mb-2 shadow"
                                />
                              )}

                              {opt.text && (
                                <p className="font-bold text-white text-base md:text-lg">{opt.text}</p>
                              )}

                              {opt.pinyin && (
                                <p className="text-xs text-slate-400 italic">{opt.pinyin}</p>
                              )}

                              {opt.description && (
                                <p className="text-xs text-slate-400 mt-1">{opt.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Shared Reading Passage if Present */}
                    {part.passage && (
                      <div className="p-5 bg-gradient-to-br from-slate-800/70 to-slate-900/90 rounded-xl border border-indigo-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                          <BookOpen className="w-4 h-4" /> Đoạn văn bài đọc:
                        </div>
                        <p className="text-base md:text-lg text-slate-100 leading-relaxed font-serif tracking-wide">
                          {part.passage}
                        </p>
                      </div>
                    )}

                    {/* Questions in this Part */}
                    <div className="space-y-4">
                      {part.questions.map((question) => {
                        const currentAnswer = answers[question.questionId]

                        return (
                          <div
                            key={question.questionId}
                            id={`question-card-${question.questionId}`}
                            className={`p-5 rounded-xl border transition-all ${
                              currentAnswer?.selectedKey || currentAnswer?.selectedOptionId
                                ? 'bg-slate-800/40 border-slate-700'
                                : 'bg-slate-900/40 border-slate-800'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div>
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 mr-2">
                                  Câu {question.questionNumber}
                                </span>
                                <span className="text-sm md:text-base font-semibold text-white">
                                  {question.content}
                                </span>
                                {question.pinyin && (
                                  <p className="text-xs text-slate-400 italic mt-0.5">{question.pinyin}</p>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 font-mono">
                                5.0 điểm
                              </span>
                            </div>

                            {/* Audio Player if Available */}
                            {question.audioUrl && (
                              <div className="mb-4">
                                <AudioPlayer
                                  src={question.audioUrl}
                                  title={`Audio Câu ${question.questionNumber}`}
                                />
                              </div>
                            )}

                            {/* Format 1: LISTEN_IMAGE_3 (Image options A/B/C) */}
                            {part.formatCode === 'LISTEN_IMAGE_3' && question.options && (
                              <div className="grid grid-cols-3 gap-3">
                                {question.options.map((opt) => {
                                  const isSelected =
                                    currentAnswer?.selectedOptionId === opt.id ||
                                    currentAnswer?.selectedKey === opt.label

                                  return (
                                    <button
                                      key={opt.id}
                                      onClick={() => handleSelectOptionId(question.questionId, opt.id, opt.label)}
                                      className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition ${
                                        isSelected
                                          ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-500/20'
                                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                                      }`}
                                    >
                                      <span
                                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                          isSelected
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-slate-700 text-slate-300'
                                        }`}
                                      >
                                        {opt.label}
                                      </span>
                                      {opt.imageUrl ? (
                                        <img
                                          src={opt.imageUrl}
                                          alt={`Option ${opt.label}`}
                                          className="w-full h-24 object-cover rounded-lg"
                                        />
                                      ) : (
                                        <span className="text-xs text-slate-300">{opt.content}</span>
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
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {question.options.map((opt) => {
                                    const isSelected =
                                      currentAnswer?.selectedOptionId === opt.id ||
                                      currentAnswer?.selectedKey === opt.label

                                    return (
                                      <button
                                        key={opt.id}
                                        onClick={() => handleSelectOptionId(question.questionId, opt.id, opt.label)}
                                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                                          isSelected
                                            ? 'bg-indigo-600/30 border-indigo-500 shadow-md shadow-indigo-500/20'
                                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                                        }`}
                                      >
                                        <span
                                          className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${
                                            isSelected
                                              ? 'bg-indigo-500 text-white'
                                              : 'bg-slate-700 text-slate-300'
                                          }`}
                                        >
                                          {opt.label}
                                        </span>
                                        <span className="text-sm font-medium text-slate-200">
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
                                <span className="text-xs text-slate-400 font-medium">
                                  Chọn thẻ ghép tương ứng (A–F):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {['A', 'B', 'C', 'D', 'E', 'F'].map((key) => {
                                    const isSelected = currentAnswer?.selectedKey === key

                                    return (
                                      <button
                                        key={key}
                                        onClick={() => handleSelectKey(question.questionId, key)}
                                        className={`px-4 py-2 rounded-xl border font-bold text-sm transition flex items-center gap-1.5 ${
                                          isSelected
                                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30'
                                            : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-700'
                                        }`}
                                      >
                                        <span>Thẻ {key}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5" />}
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
          <div className="sticky top-20 space-y-6">
            {/* Palette Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4 text-indigo-400" /> Bảng câu hỏi (40 câu)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {answeredCount}/40 đã trả lời
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / 40) * 100}%` }}
                />
              </div>

              {/* Section 1 palette (1–20) */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-sky-400 flex items-center gap-1">
                  <Headphones className="w-3.5 h-3.5" /> 听力 - Phần Nghe (1–20)
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {allQuestions.slice(0, 20).map(({ q }) => {
                    const ans = answers[q.questionId]
                    const isAnswered = Boolean(ans?.selectedKey || ans?.selectedOptionId)

                    return (
                      <button
                        key={q.questionId}
                        onClick={() => {
                          if (exam?.sections[0]) setActiveSectionId(exam.sections[0].sectionId)
                          scrollToQuestion(q.questionId)
                        }}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isAnswered
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                        }`}
                      >
                        {q.questionNumber}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Section 2 palette (21–40) */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> 阅读 - Phần Đọc (21–40)
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {allQuestions.slice(20, 40).map(({ q }) => {
                    const ans = answers[q.questionId]
                    const isAnswered = Boolean(ans?.selectedKey || ans?.selectedOptionId)

                    return (
                      <button
                        key={q.questionId}
                        onClick={() => {
                          if (exam?.sections[1]) setActiveSectionId(exam.sections[1].sectionId)
                          scrollToQuestion(q.questionId)
                        }}
                        className={`h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                          isAnswered
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50'
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
                onClick={() => setShowSubmitConfirm(true)}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài thi</span>
              </button>
            </div>

            {/* Inline Confirm Submit Card (No modal popup constraint) */}
            {showSubmitConfirm && (
              <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Xác nhận nộp bài?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bạn đã trả lời <strong className="text-white">{answeredCount}</strong> trên tổng số{' '}
                  <strong className="text-white">{totalQuestionsCount}</strong> câu hỏi.
                  {answeredCount < totalQuestionsCount && (
                    <span className="block mt-1 text-amber-300">
                      Còn {totalQuestionsCount - answeredCount} câu chưa trả lời. Bạn có chắc chắn muốn nộp ngay?
                    </span>
                  )}
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleSubmit()}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Đồng ý nộp
                      </>
                    )}
                  </button>
                  <button
                    disabled={isSubmitting}
                    onClick={() => setShowSubmitConfirm(false)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
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
