import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Search,
  Eye,
  HelpCircle,
  FileQuestion,
  Sparkles,
  Check,
  X,
  Layers,
  Calendar,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyQuestions,
  createMultipleChoiceQuestion,
  type QuestionItem,
  type CreateQuestionOptionPayload,
} from '../../api/question'
import { ApiError } from '../../api/auth'

interface DraftOption {
  content: string
  isCorrect: boolean
}

export const QuestionBankPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form Drawer / Inline state (No Modal!)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [questionContent, setQuestionContent] = useState('')
  const [explanation, setExplanation] = useState('')
  const [options, setOptions] = useState<DraftOption[]>([
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
  ])
  const [formErrors, setFormErrors] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadQuestions()
    }
  }, [user])

  const loadQuestions = async () => {
    if (!user) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const data = await getMyQuestions(user.token)
      setQuestions(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải danh sách câu hỏi')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = () => {
    setOptions([...options, { content: '', isCorrect: false }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setErrorMessage('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (QTN-08).')
      return
    }
    const wasCorrect = options[index].isCorrect
    const next = options.filter((_, i) => i !== index)
    // If the removed option was the correct one, default the first remaining one to correct
    if (wasCorrect && next.length > 0) {
      next[0].isCorrect = true
    }
    setOptions(next)
  }

  const handleOptionContentChange = (index: number, val: string) => {
    const next = [...options]
    next[index].content = val
    setOptions(next)
  }

  const handleSelectCorrect = (index: number) => {
    const next = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }))
    setOptions(next)
  }

  const validateDraft = (): string[] => {
    const errors: string[] = []
    if (!questionContent.trim()) {
      errors.push('Nội dung câu hỏi không được để trống (TC-04).')
    }
    if (options.length < 2) {
      errors.push('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (TC-02 & QTN-08).')
    }
    const hasEmptyOption = options.some((opt) => !opt.content.trim())
    if (hasEmptyOption) {
      errors.push('Các lựa chọn không được để trống nội dung (TC-04).')
    }
    // Check duplicates
    const seen = new Set<string>()
    let hasDuplicate = false
    for (const opt of options) {
      const clean = opt.content.trim().toLowerCase()
      if (clean) {
        if (seen.has(clean)) {
          hasDuplicate = true
          break
        }
        seen.add(clean)
      }
    }
    if (hasDuplicate) {
      errors.push('Hai lựa chọn không được có nội dung giống nhau (TC-05).')
    }
    const correctCount = options.filter((opt) => opt.isCorrect).length
    if (correctCount !== 1) {
      errors.push('Phải có đúng một đáp án được chọn là đáp án đúng (TC-03 & QTN-08).')
    }
    return errors
  }

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setErrorMessage(null)
    setSuccessMessage(null)

    const errors = validateDraft()
    setFormErrors(errors)
    if (errors.length > 0) {
      return
    }

    setSubmitting(true)
    try {
      const payloadOptions: CreateQuestionOptionPayload[] = options.map((opt) => ({
        content: opt.content.trim(),
        isCorrect: opt.isCorrect,
      }))

      await createMultipleChoiceQuestion(
        {
          content: questionContent.trim(),
          explanation: explanation.trim() ? explanation.trim() : undefined,
          type: 'MCQ',
          options: payloadOptions,
        },
        user.token
      )

      setSuccessMessage('Tạo câu hỏi trắc nghiệm thành công và đã lưu vào ngân hàng!')
      // Reset form
      setQuestionContent('')
      setExplanation('')
      setOptions([
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ])
      setIsDrawerOpen(false)
      loadQuestions()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Đã xảy ra lỗi khi tạo câu hỏi')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Quay lại bàn làm việc"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  Ngân hàng câu hỏi
                </h1>
                <p className="text-xs text-slate-500">
                  Quản lý và soạn thảo câu hỏi trắc nghiệm của riêng bạn (QTN-19)
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setIsDrawerOpen(!isDrawerOpen)
              setErrorMessage(null)
              setFormErrors([])
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition"
          >
            {isDrawerOpen ? (
              <>
                <X className="w-4 h-4" />
                <span>Đóng khung soạn câu hỏi</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Soạn câu trắc nghiệm mới</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Global Notifications */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{successMessage}</div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-400 hover:text-emerald-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INLINE EXPAND FORM / DRAWER (NO MODAL AS PER RULES) */}
        {isDrawerOpen && (
          <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-lg p-6 lg:p-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Soạn câu hỏi trắc nghiệm mới
                  </h2>
                  <p className="text-xs text-slate-500">
                    Nhập nội dung câu hỏi, tối thiểu 2 lựa chọn và chọn duy nhất 1 đáp án đúng (QTN-08)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-rose-700 font-semibold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Vui lòng kiểm tra lại thông tin:</span>
                </div>
                <ul className="list-disc list-inside text-xs text-rose-600 pl-2 space-y-0.5">
                  {formErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Columns */}
              <form
                onSubmit={handleSubmitQuestion}
                className="lg:col-span-7 space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nội dung câu hỏi <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder="Ví dụ: 你好 nghĩa là gì? Hoặc nhập đoạn văn, câu đố tiếng Trung..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-base"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Hỗ trợ hiển thị chữ Hán, Pinyin có dấu thanh và tiếng Việt rõ nét.
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Các lựa chọn & Đáp án đúng <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm lựa chọn</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition flex items-center space-x-3 ${
                          opt.isCorrect
                            ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Radio select correct answer */}
                        <label
                          className="flex items-center cursor-pointer space-x-2"
                          title="Chọn làm đáp án đúng"
                        >
                          <input
                            type="radio"
                            name="correct_answer"
                            checked={opt.isCorrect}
                            onChange={() => handleSelectCorrect(idx)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                              opt.isCorrect
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {optionLetters[idx] || idx + 1}
                          </span>
                        </label>

                        {/* Input Content */}
                        <input
                          type="text"
                          value={opt.content}
                          onChange={(e) => handleOptionContentChange(idx, e.target.value)}
                          placeholder={`Nội dung lựa chọn ${optionLetters[idx] || idx + 1}`}
                          className="flex-1 px-3 py-2 text-sm bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none text-slate-800"
                        />

                        {/* Correct badge */}
                        {opt.isCorrect && (
                          <span className="hidden sm:inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                            <span>Đáp án đúng</span>
                          </span>
                        )}

                        {/* Remove Option */}
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          disabled={options.length <= 2}
                          className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition ${
                            options.length <= 2 ? 'opacity-30 cursor-not-allowed' : ''
                          }`}
                          title="Xóa lựa chọn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Giải thích đáp án (tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Giải thích vì sao đáp án này đúng, kiến thức liên quan..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-medium text-sm transition"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-50"
                  >
                    {submitting ? 'Đang lưu câu hỏi...' : 'Lưu vào ngân hàng câu hỏi'}
                  </button>
                </div>
              </form>

              {/* LIVE STUDENT PREVIEW (Preview như học sinh nhìn thấy) */}
              <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">
                    <Eye className="w-4 h-4 text-indigo-500" />
                    <span>Xem trước giao diện học sinh</span>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-start space-x-3">
                      <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        ?
                      </span>
                      <div className="text-base font-semibold text-slate-900 leading-snug break-words">
                        {questionContent.trim() ? (
                          questionContent
                        ) : (
                          <span className="text-slate-300 italic">
                            Chưa nhập nội dung câu hỏi...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      {options.map((opt, i) => (
                        <div
                          key={i}
                          className="px-3 py-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 flex items-center space-x-3 text-sm text-slate-800 transition"
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-500">
                            {optionLetters[i] || i + 1}
                          </span>
                          <span className="flex-1 break-words">
                            {opt.content.trim() ? (
                              opt.content
                            ) : (
                              <span className="text-slate-300 italic">
                                Lựa chọn {optionLetters[i] || i + 1}
                              </span>
                            )}
                          </span>
                          {opt.isCorrect && (
                            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                              Đáp án
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {explanation.trim() && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-900 space-y-1">
                        <span className="font-bold flex items-center space-x-1 text-amber-800">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Giải thích chi tiết:</span>
                        </span>
                        <p>{explanation}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 text-xs text-slate-400 text-center">
                  Câu hỏi sẽ được bảo vệ chỉ bạn và học sinh được giao bài mới có thể xem (QTN-19).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Stats Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm câu hỏi theo nội dung..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-600 w-full sm:w-auto justify-end">
            <span className="flex items-center space-x-1.5 font-medium">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Tổng số: {questions.length} câu hỏi</span>
            </span>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Đang tải ngân hàng câu hỏi...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto mb-4">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {searchTerm ? 'Không tìm thấy câu hỏi phù hợp' : 'Ngân hàng câu hỏi trống'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {searchTerm
                ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.'
                : 'Bạn chưa tạo câu hỏi trắc nghiệm nào. Hãy bắt đầu tạo câu hỏi để xây dựng nguồn đề thi chất lượng cho học sinh.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Soạn câu hỏi đầu tiên</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredQuestions.map((q) => {
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header of Card */}
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                        <span>Câu #{q.id}</span>
                        <span>•</span>
                        <span>Trắc nghiệm (MCQ)</span>
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
                      </span>
                    </div>

                    {/* Question Content */}
                    <div className="text-base font-bold text-slate-900 leading-snug break-words">
                      {q.content}
                    </div>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={opt.id}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center space-x-2.5 ${
                            opt.isCorrect
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium'
                              : 'bg-slate-50 text-slate-700 border border-slate-100'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                              opt.isCorrect
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {optionLetters[oIdx] || oIdx + 1}
                          </span>
                          <span className="flex-1 break-words">{opt.content}</span>
                          {opt.isCorrect && (
                            <span className="flex items-center space-x-1 text-emerald-700 font-semibold text-xs">
                              <Check className="w-3.5 h-3.5" />
                              <span>Đáp án đúng</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900">
                        <span className="font-bold">Giải thích: </span>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
