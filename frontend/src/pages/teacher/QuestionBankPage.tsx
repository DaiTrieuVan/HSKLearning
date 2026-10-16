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
  BookOpen,
  Edit3,
  CheckSquare,
  Wand2,
  BookMarked,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyQuestions,
  createMultipleChoiceQuestion,
  createFillBlankQuestion,
  quickGeneratePreview,
  batchCreateQuestions,
  type QuestionItem,
  type CreateQuestionOptionPayload,
  type CreateQuestionPayload,
  type QuestionFormat,
  type BlankAnswerItem,
} from '../../api/question'
import { getMyVocabSets, type VocabSetItem } from '../../api/content'
import { ApiError } from '../../api/auth'

interface DraftOption {
  content: string
  isCorrect: boolean
}

interface DraftBlank {
  index: number
  correctAnswer: string
  acceptableAnswers: string[]
  newAcceptableInput?: string
}

type QuestionTabType = 'MCQ' | 'FILL'

export const QuestionBankPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState<QuestionItem[]>([])
  const [vocabSets, setVocabSets] = useState<VocabSetItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilterType, setSelectedFilterType] = useState<'ALL' | 'MCQ' | 'FILL'>('ALL')

  // Form Drawer / Inline state (No Modal!)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<QuestionTabType>('MCQ')

  // Common fields
  const [questionContent, setQuestionContent] = useState('')
  const [explanation, setExplanation] = useState('')
  const [formErrors, setFormErrors] = useState<string[]>([])

  // MCQ state
  const [options, setOptions] = useState<DraftOption[]>([
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
  ])

  // FILL state
  const [blanks, setBlanks] = useState<DraftBlank[]>([])

  // Quick Generate Panel state (HTT-05-CN-004)
  const [isQuickGenOpen, setIsQuickGenOpen] = useState(false)
  const [selectedVocabSetId, setSelectedVocabSetId] = useState<number | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<QuestionFormat>('HANZI_TO_MEANING')
  const [generating, setGenerating] = useState(false)
  const [batchSaving, setBatchSaving] = useState(false)
  const [generatedDrafts, setGeneratedDrafts] = useState<CreateQuestionPayload[]>([])

  useEffect(() => {
    if (user) {
      loadQuestions()
      loadVocabSets()
    }
  }, [user])

  // Automatically parse blanks when in FILL tab and question content changes
  useEffect(() => {
    if (activeTab === 'FILL') {
      const regex = /_{3,}/g
      const matches = questionContent.match(regex) || []
      const blankCount = matches.length

      setBlanks((prev) => {
        const next: DraftBlank[] = []
        for (let i = 0; i < blankCount; i++) {
          const existing = prev[i]
          next.push({
            index: i,
            correctAnswer: existing ? existing.correctAnswer : '',
            acceptableAnswers: existing ? existing.acceptableAnswers : [],
            newAcceptableInput: '',
          })
        }
        return next
      })
    }
  }, [questionContent, activeTab])

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

  const loadVocabSets = async () => {
    if (!user) return
    try {
      const data = await getMyVocabSets(user.token)
      setVocabSets(data)
      if (data.length > 0 && !selectedVocabSetId) {
        setSelectedVocabSetId(data[0].id)
      }
    } catch {
      // silently fail if cannot load sets
    }
  }

  // --- MCQ Handlers ---
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

  // --- FILL Handlers ---
  const handleInsertBlankMarker = () => {
    setQuestionContent((prev) => {
      const separator = prev.endsWith(' ') || prev.length === 0 ? '' : ' '
      return prev + separator + '___ '
    })
  }

  const handleBlankCorrectChange = (index: number, val: string) => {
    setBlanks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, correctAnswer: val } : b))
    )
  }

  const handleAddAcceptableAnswer = (index: number) => {
    setBlanks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b
        const raw = (b.newAcceptableInput || '').trim()
        if (!raw) return b
        if (b.acceptableAnswers.includes(raw) || b.correctAnswer.trim() === raw) {
          return { ...b, newAcceptableInput: '' }
        }
        return {
          ...b,
          acceptableAnswers: [...b.acceptableAnswers, raw],
          newAcceptableInput: '',
        }
      })
    )
  }

  const handleRemoveAcceptableAnswer = (blankIndex: number, answerIndex: number) => {
    setBlanks((prev) =>
      prev.map((b, i) => {
        if (i !== blankIndex) return b
        return {
          ...b,
          acceptableAnswers: b.acceptableAnswers.filter((_, idx) => idx !== answerIndex),
        }
      })
    )
  }

  // --- Validation ---
  const validateDraft = (): string[] => {
    const errors: string[] = []
    if (!questionContent.trim()) {
      errors.push('Nội dung câu hỏi không được để trống.')
      return errors
    }
    if (activeTab === 'MCQ') {
      if (options.length < 2) {
        errors.push('Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn (TC-02 & QTN-08).')
      }
      const hasEmptyOption = options.some((opt) => !opt.content.trim())
      if (hasEmptyOption) {
        errors.push('Các lựa chọn không được để trống nội dung (TC-04).')
      }
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
    } else {
      // FILL validations (TC-03, TC-04, TC-05)
      const matches = questionContent.match(/_{3,}/g) || []
      if (matches.length === 0) {
        errors.push('Câu hỏi điền từ bắt buộc phải chứa ít nhất một chỗ trống dạng ___ (TC-03).')
      }
      if (matches.length !== blanks.length) {
        errors.push('Số lượng chỗ trống không khớp với danh sách đáp án cấu hình (TC-04).')
      }
      for (let i = 0; i < blanks.length; i++) {
        if (!blanks[i].correctAnswer.trim()) {
          errors.push(`Chỗ trống #${i + 1} chưa có đáp án đúng (TC-05).`)
        }
      }
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
      if (activeTab === 'MCQ') {
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
      } else {
        const blankPayloads: BlankAnswerItem[] = blanks.map((b) => ({
          index: b.index,
          correctAnswer: b.correctAnswer.trim(),
          acceptableAnswers: b.acceptableAnswers.map((a) => a.trim()),
        }))

        await createFillBlankQuestion(
          {
            content: questionContent.trim(),
            explanation: explanation.trim() ? explanation.trim() : undefined,
            blanks: blankPayloads,
          },
          user.token
        )

        setSuccessMessage('Tạo câu hỏi điền từ vào chỗ trống thành công và đã lưu vào ngân hàng!')
      }

      // Reset form
      setQuestionContent('')
      setExplanation('')
      setOptions([
        { content: '', isCorrect: true },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
        { content: '', isCorrect: false },
      ])
      setBlanks([])
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

  // HTT-05-CN-004: Handle Quick Generate Preview
  const handleQuickGenerate = async () => {
    if (!user) return
    if (!selectedVocabSetId) {
      setErrorMessage('Vui lòng chọn một bộ từ vựng để tạo câu hỏi.')
      return
    }

    setErrorMessage(null)
    setSuccessMessage(null)
    setGenerating(true)
    try {
      const drafts = await quickGeneratePreview(
        {
          vocabSetId: selectedVocabSetId,
          format: selectedFormat,
        },
        user.token
      )
      setGeneratedDrafts(drafts)
      setSuccessMessage(`Đã sinh thành công ${drafts.length} câu hỏi trắc nghiệm! Hãy kiểm tra và lưu lại.`)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tạo nhanh câu hỏi từ bộ từ vựng')
      }
    } finally {
      setGenerating(false)
    }
  }

  // HTT-05-CN-004-TC-02: Remove a single draft question
  const handleRemoveDraftQuestion = (index: number) => {
    const next = generatedDrafts.filter((_, i) => i !== index)
    setGeneratedDrafts(next)
  }

  // HTT-05-CN-004-TC-02: Batch save retained questions
  const handleBatchSave = async () => {
    if (!user || generatedDrafts.length === 0) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setBatchSaving(true)
    try {
      const saved = await batchCreateQuestions(
        { questions: generatedDrafts },
        user.token
      )
      setSuccessMessage(`Đã lưu thành công ${saved.length} câu hỏi vào ngân hàng câu hỏi!`)
      setGeneratedDrafts([])
      setIsQuickGenOpen(false)
      loadQuestions()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Đã xảy ra lỗi khi lưu danh sách câu hỏi')
      }
    } finally {
      setBatchSaving(false)
    }
  }

  const filteredQuestions = questions.filter((q) => {
    const matchSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase())
    if (selectedFilterType === 'ALL') return matchSearch
    return matchSearch && q.type === selectedFilterType
  })

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

  // Helper to parse FILL payload
  const parseFillPayload = (payloadStr?: string): { blanks?: BlankAnswerItem[] } | null => {
    if (!payloadStr) return null
    try {
      return JSON.parse(payloadStr)
    } catch {
      return null
    }
  }

  // Render preview for Fill in the Blank question
  const renderFillBlankPreview = () => {
    const parts = questionContent.split(/_{3,}/)
    return (
      <div className="space-y-4">
        <div className="text-base leading-relaxed text-slate-800 break-words font-medium">
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              <span>{part}</span>
              {index < parts.length - 1 && (
                <span className="inline-block mx-1.5 px-3 py-1 bg-indigo-50 border-2 border-dashed border-indigo-400 rounded-lg text-indigo-700 font-bold text-sm shadow-inner">
                  {blanks[index]?.correctAnswer.trim() ? (
                    blanks[index].correctAnswer
                  ) : (
                    <span className="text-indigo-300 font-normal">Chỗ trống #{index + 1}</span>
                  )}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {blanks.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Danh sách đáp án thiết lập:
            </span>
            {blanks.map((b, i) => (
              <div
                key={i}
                className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-700">Chỗ trống #{i + 1}:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {b.correctAnswer.trim() || 'Chưa nhập'}
                  </span>
                </div>
                {b.acceptableAnswers.length > 0 && (
                  <div className="flex items-center space-x-1.5 text-slate-600 pl-4">
                    <span className="text-slate-400">Chấp nhận khác:</span>
                    <span className="font-medium text-slate-700">
                      {b.acceptableAnswers.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  Quản lý và soạn thảo câu hỏi trắc nghiệm & điền từ của riêng bạn (QTN-19)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* HTT-05-CN-004: Quick Generate Action */}
            <button
              onClick={() => {
                setIsQuickGenOpen(!isQuickGenOpen)
                setIsDrawerOpen(false)
                setErrorMessage(null)
                setFormErrors([])
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 font-medium rounded-xl shadow-sm transition ${
                isQuickGenOpen
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>{isQuickGenOpen ? 'Đóng tạo nhanh' : 'Tạo nhanh từ bộ từ vựng'}</span>
            </button>

            {/* Manual question creation */}
            <button
              onClick={() => {
                setIsDrawerOpen(!isDrawerOpen)
                setIsQuickGenOpen(false)
                setErrorMessage(null)
                setFormErrors([])
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition"
            >
              {isDrawerOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Đóng soạn thủ công</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Soạn thủ công</span>
                </>
              )}
            </button>
          </div>
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

        {/* HTT-05-CN-004: QUICK GENERATE FROM VOCAB SET PANEL (NO MODAL) */}
        {isQuickGenOpen && (
          <div className="bg-white border-2 border-amber-300 rounded-2xl shadow-lg p-6 lg:p-8 animate-fadeIn space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tạo nhanh câu hỏi trắc nghiệm từ bộ từ vựng
                  </h2>
                  <p className="text-xs text-slate-500">
                    Hệ thống tự động tạo câu hỏi trắc nghiệm 4 lựa chọn với phương án gây nhiễu lấy từ các từ khác trong bộ (QTN-08, QTN-19).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsQuickGenOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selection Form */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
              <div className="md:col-span-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center space-x-1.5">
                  <BookMarked className="w-4 h-4 text-amber-600" />
                  <span>Chọn bộ từ vựng (QTN-19)</span>
                </label>
                {vocabSets.length === 0 ? (
                  <div className="text-xs text-slate-500 py-2">
                    Bạn chưa có bộ từ vựng nào. Hãy vào{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/vocab-sets')}
                      className="text-indigo-600 underline font-semibold"
                    >
                      Bộ từ vựng
                    </button>{' '}
                    để tạo bộ từ trước.
                  </div>
                ) : (
                  <select
                    value={selectedVocabSetId || ''}
                    onChange={(e) => setSelectedVocabSetId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {vocabSets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="md:col-span-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Dạng câu hỏi trắc nghiệm
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as QuestionFormat)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="HANZI_TO_MEANING">Chữ Hán ➔ Chọn nghĩa tiếng Việt</option>
                  <option value="MEANING_TO_HANZI">Nghĩa tiếng Việt ➔ Chọn chữ Hán</option>
                  <option value="HANZI_TO_PINYIN">Chữ Hán ➔ Chọn Pinyin</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <button
                  type="button"
                  onClick={handleQuickGenerate}
                  disabled={generating || vocabSets.length === 0}
                  className="w-full flex items-center justify-center space-x-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang sinh câu hỏi...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Sinh câu hỏi tự động</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated Drafts Preview & Review Area (HTT-05-CN-004-TC-02) */}
            {generatedDrafts.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span>
                        Đã sinh {generatedDrafts.length} câu hỏi trắc nghiệm
                      </span>
                    </h3>
                    <p className="text-xs text-indigo-700 mt-0.5">
                      Bạn có thể bấm biểu tượng thùng rác để bỏ bớt các câu không mong muốn trước khi lưu (TC-02).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleBatchSave}
                    disabled={batchSaving}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition disabled:opacity-50 flex-shrink-0"
                  >
                    {batchSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang lưu vào ngân hàng...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Lưu {generatedDrafts.length} câu vào ngân hàng</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Drafts Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedDrafts.map((draft, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 shadow-sm transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                            Câu #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDraftQuestion(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Bỏ câu này khỏi danh sách lưu"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-sm font-bold text-slate-900 leading-snug break-words">
                          {draft.content}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {draft.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`px-3 py-1.5 rounded-lg text-xs flex items-center space-x-2 ${
                                opt.isCorrect
                                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold'
                                  : 'bg-slate-50 text-slate-700 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  opt.isCorrect
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {optionLetters[oIdx] || oIdx + 1}
                              </span>
                              <span className="flex-1 truncate">{opt.content}</span>
                              {opt.isCorrect && (
                                <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>

                        {draft.explanation && (
                          <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                            <span className="font-semibold text-slate-700">Giải thích: </span>
                            <span>{draft.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANUAL CREATION INLINE PANEL (NO MODAL) */}
        {isDrawerOpen && (
          <div className="bg-white border-2 border-indigo-200 rounded-2xl shadow-lg p-6 lg:p-8 animate-fadeIn">
            {/* Drawer Top Navigation & Question Type Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Soạn câu hỏi mới</h2>
                  <p className="text-xs text-slate-500">
                    Chọn dạng câu hỏi và điền cấu hình đáp án tương ứng
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 self-start sm:self-auto">
                {/* Type Switch Tabs */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('MCQ')
                      setFormErrors([])
                    }}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'MCQ'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Trắc nghiệm (MCQ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('FILL')
                      setFormErrors([])
                    }}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeTab === 'FILL'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Điền từ (FILL)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
              <form onSubmit={handleSubmitQuestion} className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Nội dung câu hỏi <span className="text-rose-500">*</span>
                    </label>
                    {activeTab === 'FILL' && (
                      <button
                        type="button"
                        onClick={handleInsertBlankMarker}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Chèn chỗ trống (___)</span>
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder={
                      activeTab === 'MCQ'
                        ? 'Ví dụ: 你好 nghĩa là gì? Hoặc nhập đoạn văn, câu đố tiếng Trung...'
                        : 'Ví dụ: 我___学生 (Nhập 3 dấu gạch dưới ___ làm chỗ trống)'
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-base"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {activeTab === 'MCQ'
                      ? 'Hỗ trợ hiển thị chữ Hán, Pinyin có dấu thanh và tiếng Việt rõ nét.'
                      : 'Mẹo: Dùng 3 dấu gạch dưới (___) tại mỗi vị trí cần học sinh điền từ.'}
                  </p>
                </div>

                {/* MCQ Mode Options */}
                {activeTab === 'MCQ' && (
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
                )}

                {/* FILL Mode Blanks Configuration */}
                {activeTab === 'FILL' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-slate-700">
                        Cấu hình đáp án các chỗ trống{' '}
                        <span className="text-slate-400 font-normal">
                          (Tìm thấy: {blanks.length} chỗ trống)
                        </span>
                      </label>
                    </div>

                    {blanks.length === 0 ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          Chưa có chỗ trống nào trong câu. Vui lòng thêm ít nhất một ký hiệu{' '}
                          <code className="font-bold bg-amber-100 px-1 py-0.5 rounded">___</code>{' '}
                          (3 dấu gạch dưới) vào nội dung câu hỏi.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {blanks.map((b, idx) => (
                          <div
                            key={b.index}
                            className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1.5">
                                <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <span>Chỗ trống #{idx + 1}</span>
                              </span>
                            </div>

                            {/* Correct Answer */}
                            <div>
                              <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Đáp án chính xác <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={b.correctAnswer}
                                onChange={(e) => handleBlankCorrectChange(idx, e.target.value)}
                                placeholder="Ví dụ: 是"
                                className="w-full px-3.5 py-2 text-sm bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-900"
                              />
                            </div>

                            {/* Acceptable Answers */}
                            <div>
                              <label className="block text-xs font-medium text-slate-600 mb-1">
                                Các đáp án chấp nhận được khác (tùy chọn)
                              </label>
                              <div className="flex flex-wrap gap-1.5 mb-2">
                                {b.acceptableAnswers.map((acc, aIdx) => (
                                  <span
                                    key={aIdx}
                                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  >
                                    <span>{acc}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAcceptableAnswer(idx, aIdx)}
                                      className="text-indigo-400 hover:text-indigo-700 ml-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={b.newAcceptableInput || ''}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    setBlanks((prev) =>
                                      prev.map((item, i) =>
                                        i === idx ? { ...item, newAcceptableInput: val } : item
                                      )
                                    )
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      handleAddAcceptableAnswer(idx)
                                    }
                                  }}
                                  placeholder="Nhập từ đồng nghĩa/chấp nhận rồi nhấn Thêm (hoặc Enter)"
                                  className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddAcceptableAnswer(idx)}
                                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-medium transition"
                                >
                                  Thêm
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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

              {/* LIVE STUDENT PREVIEW */}
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
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                          {activeTab === 'MCQ' ? 'Câu hỏi trắc nghiệm' : 'Câu hỏi điền từ'}
                        </span>
                        {activeTab === 'MCQ' ? (
                          <div className="text-base font-semibold text-slate-900 leading-snug break-words">
                            {questionContent.trim() ? (
                              questionContent
                            ) : (
                              <span className="text-slate-300 italic">
                                Chưa nhập nội dung câu hỏi...
                              </span>
                            )}
                          </div>
                        ) : (
                          renderFillBlankPreview()
                        )}
                      </div>
                    </div>

                    {activeTab === 'MCQ' && (
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
                    )}

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

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm câu hỏi theo nội dung..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            {/* Filter by Type */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedFilterType('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'ALL'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterType('MCQ')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'MCQ'
                    ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Trắc nghiệm
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterType('FILL')}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedFilterType === 'FILL'
                    ? 'bg-white text-teal-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Điền từ
              </button>
            </div>

            <span className="flex items-center space-x-1.5 font-medium text-xs text-slate-500">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{filteredQuestions.length} câu hỏi</span>
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
                ? 'Thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc sang Tất cả.'
                : 'Bạn chưa tạo câu hỏi nào trong ngân hàng. Hãy bắt đầu bằng cách soạn thủ công hoặc tạo nhanh từ một bộ từ vựng.'}
            </p>
            {!searchTerm && (
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setIsQuickGenOpen(true)
                    setIsDrawerOpen(false)
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Tạo nhanh từ bộ từ</span>
                </button>
                <button
                  onClick={() => {
                    setIsDrawerOpen(true)
                    setIsQuickGenOpen(false)
                  }}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Soạn thủ công</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredQuestions.map((q) => {
              const isFill = q.type === 'FILL'
              const fillPayload = isFill ? parseFillPayload(q.payload) : null

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          isFill
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        <span>Câu #{q.id}</span>
                        <span>•</span>
                        <span>{isFill ? 'Điền từ (FILL)' : 'Trắc nghiệm (MCQ)'}</span>
                      </span>
                      <span className="text-xs text-slate-400 flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
                      </span>
                    </div>

                    <div className="text-base font-bold text-slate-900 leading-snug break-words">
                      {q.content}
                    </div>

                    {/* Render according to type */}
                    {isFill ? (
                      /* Fill in blank display */
                      <div className="space-y-2 pt-1">
                        {fillPayload?.blanks && fillPayload.blanks.length > 0 ? (
                          fillPayload.blanks.map((b, bIdx) => (
                            <div
                              key={bIdx}
                              className="px-3 py-2 rounded-xl text-xs bg-slate-50 text-slate-800 border border-slate-200 flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-slate-600">
                                  Chỗ trống #{bIdx + 1}:
                                </span>
                                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                  {b.correctAnswer}
                                </span>
                              </div>
                              {b.acceptableAnswers && b.acceptableAnswers.length > 0 && (
                                <div className="text-slate-500 flex items-center space-x-1">
                                  <span>Chấp nhận khác:</span>
                                  <span className="text-slate-700 font-medium">
                                    {b.acceptableAnswers.join(', ')}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-400 italic">
                            Chưa có dữ liệu đáp án chi tiết.
                          </div>
                        )}
                      </div>
                    ) : (
                      /* MCQ options list */
                      <div className="space-y-2 pt-1">
                        {q.options &&
                          q.options.map((opt, oIdx) => (
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
                    )}

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
