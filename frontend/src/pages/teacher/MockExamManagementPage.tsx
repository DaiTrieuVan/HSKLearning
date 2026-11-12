import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  Clock,
  Award,
  Plus,
  Trash2,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Send,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Calendar,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyMockExams,
  createMockExam,
  getMockExamDetail,
  type MockExamItem,
  type CreateMockExamPayload,
} from '../../api/mockExam'
import { getMyQuestions, type QuestionItem } from '../../api/question'
import { getTeachingClasses, type ClassItem } from '../../api/classroom'
import { assignExercise } from '../../api/assignment'
import { ApiError } from '../../api/auth'

interface DraftQuestion {
  questionId: number
  content: string
  type: string
  points: number
  sortOrder: number
}

interface DraftSection {
  name: string
  sortOrder: number
  questions: DraftQuestion[]
}

export const MockExamManagementPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // State danh sách đề thi thử
  const [mockExams, setMockExams] = useState<MockExamItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [expandedExamId, setExpandedExamId] = useState<number | null>(null)
  const [examDetail, setExamDetail] = useState<MockExamItem | null>(null)

  // Chế độ tạo đề thi thử
  const [isCreating, setIsCreating] = useState<boolean>(false)

  // Form tạo đề thi
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [hskLevel, setHskLevel] = useState<number>(1)
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(60)
  const [passingScore, setPassingScore] = useState<number>(60)
  const [sections, setSections] = useState<DraftSection[]>([
    { name: 'Phần 1: Nghe', sortOrder: 1, questions: [] },
    { name: 'Phần 2: Đọc', sortOrder: 2, questions: [] },
  ])

  // Drawer chọn câu hỏi từ ngân hàng
  const [isQuestionDrawerOpen, setIsQuestionDrawerOpen] = useState<boolean>(false)
  const [targetSectionIndex, setTargetSectionIndex] = useState<number | null>(null)
  const [availableQuestions, setAvailableQuestions] = useState<QuestionItem[]>([])
  const [searchQuestionKeyword, setSearchQuestionKeyword] = useState<string>('')
  const [isLoadingQuestions, setIsLoadingQuestions] = useState<boolean>(false)

  // Drawer giao bài cho lớp
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState<boolean>(false)
  const [selectedExamToAssign, setSelectedExamToAssign] = useState<MockExamItem | null>(null)
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('')
  const [dueTime, setDueTime] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState<boolean>(false)

  // Thông báo lỗi / thành công
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Tải danh sách đề thi thử
  const fetchMockExams = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const data = await getMyMockExams(user.token)
      setMockExams(data)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải danh sách đề thi thử')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMockExams()
  }, [user])

  // Tải ngân hàng câu hỏi khi mở Drawer
  const openQuestionPicker = async (sectionIndex: number) => {
    setTargetSectionIndex(sectionIndex)
    setIsQuestionDrawerOpen(true)
    if (!user) return

    setIsLoadingQuestions(true)
    try {
      const data = await getMyQuestions(user.token)
      setAvailableQuestions(data)
    } catch {
      setErrorMessage('Không thể tải ngân hàng câu hỏi cá nhân')
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  // Mở Drawer giao bài
  const openAssignDrawer = async (exam: MockExamItem) => {
    setSelectedExamToAssign(exam)
    setIsAssignDrawerOpen(true)
    setSelectedClassId('')
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)
    setDueTime(defaultDate.toISOString().slice(0, 16))

    if (!user) return
    try {
      const classList = await getTeachingClasses(user.token)
      setClasses(classList)
      if (classList.length > 0) {
        setSelectedClassId(classList[0].id)
      }
    } catch {
      setErrorMessage('Không thể tải danh sách lớp học')
    }
  }

  // Thực hiện giao bài
  const handleAssign = async () => {
    if (!user || !selectedExamToAssign || !selectedClassId || !dueTime) {
      setErrorMessage('Vui lòng chọn lớp học và hạn nộp bài')
      return
    }

    setIsAssigning(true)
    setErrorMessage(null)
    try {
      await assignExercise(
        {
          exerciseId: selectedExamToAssign.id,
          classId: Number(selectedClassId),
          dueTime: new Date(dueTime).toISOString(),
        },
        user.token
      )
      setSuccessMessage(`Đã giao đề "${selectedExamToAssign.title}" cho lớp thành công!`)
      setIsAssignDrawerOpen(false)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể giao đề thi cho lớp')
      }
    } finally {
      setIsAssigning(false)
    }
  }

  // Xem chi tiết đề thi thử
  const toggleExpandExam = async (examId: number) => {
    if (expandedExamId === examId) {
      setExpandedExamId(null)
      setExamDetail(null)
      return
    }

    setExpandedExamId(examId)
    if (!user) return
    try {
      const detail = await getMockExamDetail(examId, user.token)
      setExamDetail(detail)
    } catch {
      setErrorMessage('Không thể lấy chi tiết đề thi thử')
    }
  }

  // Thêm câu hỏi vào phần thi
  const handleAddQuestionToSection = (q: QuestionItem) => {
    if (targetSectionIndex === null) return

    // Kiểm tra câu hỏi đã tồn tại trong đề thi chưa (QTN-09)
    const isAlreadyAdded = sections.some((sec) =>
      sec.questions.some((item) => item.questionId === q.id)
    )
    if (isAlreadyAdded) {
      setErrorMessage('Câu hỏi này đã được đưa vào đề thi thử')
      return
    }

    setSections((prev) => {
      const updated = [...prev]
      const sec = updated[targetSectionIndex]
      sec.questions.push({
        questionId: q.id,
        content: q.content,
        type: q.type,
        points: 5.0, // Điểm mặc định cho câu hỏi
        sortOrder: sec.questions.length + 1,
      })
      return updated
    })
    setErrorMessage(null)
  }

  // Xóa câu hỏi khỏi phần thi
  const handleRemoveQuestion = (sectionIdx: number, qIdx: number) => {
    setSections((prev) => {
      const updated = [...prev]
      updated[sectionIdx].questions.splice(qIdx, 1)
      return updated
    })
  }

  // Cập nhật điểm câu hỏi
  const handleUpdatePoints = (sectionIdx: number, qIdx: number, points: number) => {
    setSections((prev) => {
      const updated = [...prev]
      updated[sectionIdx].questions[qIdx].points = Math.max(0.5, points)
      return updated
    })
  }

  // Thêm phần thi mới
  const handleAddSection = () => {
    const nextOrder = sections.length + 1
    setSections((prev) => [
      ...prev,
      {
        name: `Phần ${nextOrder}: Chuyên đề`,
        sortOrder: nextOrder,
        questions: [],
      },
    ])
  }

  // Xóa phần thi
  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) {
      setErrorMessage('Đề thi thử phải có ít nhất 1 phần thi')
      return
    }
    setSections((prev) => prev.filter((_, i) => i !== idx))
  }

  // Cập nhật tên phần thi
  const handleUpdateSectionName = (idx: number, name: string) => {
    setSections((prev) => {
      const updated = [...prev]
      updated[idx].name = name
      return updated
    })
  }

  // Tính tổng điểm
  const calculateTotalPoints = (): number => {
    return sections.reduce((sum, sec) => {
      return (
        sum +
        sec.questions.reduce((qSum, q) => qSum + (Number(q.points) || 0), 0)
      )
    }, 0)
  }

  const totalPoints = calculateTotalPoints()

  // Lưu đề thi thử
  const handleSaveExam = async (status: 'DRAFT' | 'READY') => {
    if (!user) return
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!title.trim()) {
      setErrorMessage('Vui lòng nhập tên đề thi thử')
      return
    }

    if (timeLimitMinutes <= 0) {
      setErrorMessage('Thời gian làm bài phải lớn hơn 0')
      return
    }

    if (status === 'READY') {
      const hasEmptySection = sections.some((s) => s.questions.length === 0)
      if (hasEmptySection) {
        setErrorMessage(
          'Tất cả các phần thi phải có ít nhất 1 câu hỏi mới có thể sẵn sàng giao (READY). Vui lòng lưu nháp (DRAFT) nếu chưa hoàn thành.'
        )
        return
      }

      if (totalPoints <= 0) {
        setErrorMessage('Tổng điểm của đề thi phải lớn hơn 0')
        return
      }
    }

    if (passingScore < 0 || (totalPoints > 0 && passingScore > totalPoints)) {
      setErrorMessage(
        `Điểm đạt không được âm và không được lớn hơn tổng điểm (${totalPoints} điểm)`
      )
      return
    }

    const payload: CreateMockExamPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      hskLevel,
      timeLimitMinutes,
      passingScore,
      status,
      sections: sections.map((s, idx) => ({
        name: s.name.trim() || `Phần ${idx + 1}`,
        sortOrder: s.sortOrder || idx + 1,
        questions: s.questions.map((q, qIdx) => ({
          questionId: q.questionId,
          points: Number(q.points) || 1,
          sortOrder: qIdx + 1,
        })),
      })),
    }

    setIsSaving(true)
    try {
      const created = await createMockExam(payload, user.token)
      setSuccessMessage(
        `Đã tạo đề thi thử "${created.title}" ở trạng thái ${
          created.status === 'READY' ? 'Sẵn sàng giao' : 'Bản nháp'
        } thành công!`
      )
      setIsCreating(false)
      fetchMockExams()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể lưu đề thi thử')
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Lọc câu hỏi trong Drawer
  const filteredQuestions = availableQuestions.filter((q) => {
    if (!searchQuestionKeyword.trim()) return true
    return (
      q.content.toLowerCase().includes(searchQuestionKeyword.toLowerCase()) ||
      (q.explanation &&
        q.explanation.toLowerCase().includes(searchQuestionKeyword.toLowerCase()))
    )
  })

  return (
    <div className="w-full max-w-6xl mx-auto pb-16 sm:pb-20 space-y-4 sm:space-y-5">
      {/* Compact Top Action Bar (Title block removed) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {!isCreating ? (
          <>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-xl shadow-xs transition text-xs sm:text-sm whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Quay lại Bảng điều khiển</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCreating(true)
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--primary)] hover:opacity-95 text-white font-bold rounded-xl shadow-sm transition text-xs sm:text-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Tạo đề thi mới</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl shadow-xs transition text-xs sm:text-sm whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Quay lại danh sách</span>
          </button>
        )}
      </div>

      {/* Thông báo lỗi / thành công */}
      {errorMessage && (
        <div className="p-3.5 sm:px-4 sm:py-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-start gap-2.5 text-xs sm:text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="break-words">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 sm:px-4 sm:py-3.5 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-start gap-2.5 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="break-words">{successMessage}</span>
        </div>
      )}

      {/* GIAO DIỆN TẠO ĐỀ THI MỚI */}
      {isCreating ? (
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Card 1: Thông tin cơ bản */}
          <div className="bg-white rounded-2xl border border-[var(--border-card)] p-4 sm:p-6 shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-4 sm:mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--primary)] shrink-0" />
              <span>1. Thông tin cấu trúc đề thi</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                  Tên đề thi thử <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đề thi thử HSK 1 - Chuẩn cấu trúc Hanban"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-2">
                  Cấp độ HSK <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setHskLevel(lvl)}
                      className={`py-2 px-2 rounded-xl border text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                        hskLevel === lvl
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                          : 'border-[var(--border-card)] bg-white text-[var(--text-main)] hover:bg-slate-50'
                      }`}
                    >
                      HSK {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                  Thời gian làm bài (phút) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <Clock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                  Điểm đạt (Passing score)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <Award className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                  Mô tả đề thi
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú hướng dẫn cho học sinh khi làm bài thi thử..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-y"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Quản lý các phần thi */}
          <div className="bg-white rounded-2xl border border-[var(--border-card)] p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[var(--primary)] shrink-0" />
                <span>2. Các phần thi trong đề (Sections)</span>
              </h2>

              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-[var(--border-card)] rounded-xl text-[var(--primary)] font-bold text-xs sm:text-sm transition self-start sm:self-auto whitespace-nowrap"
              >
                <Plus className="w-4 h-4 shrink-0" />
                <span>Thêm phần thi</span>
              </button>
            </div>

            <div className="flex flex-col gap-4 sm:gap-5">
              {sections.map((section, sIdx) => {
                const sectionPoints = section.questions.reduce(
                  (sum, q) => sum + (Number(q.points) || 0),
                  0
                )
                return (
                  <div
                    key={sIdx}
                    className="border border-slate-200 rounded-xl bg-slate-50 p-3.5 sm:p-4"
                  >
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-3 mb-3.5">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <span className="bg-[var(--primary)] text-white font-extrabold text-xs px-2 py-1 rounded shrink-0 whitespace-nowrap">
                          Phần {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => handleUpdateSectionName(sIdx, e.target.value)}
                          placeholder="Tên phần thi (ví dụ: Phần 1: Nghe)"
                          className="flex-1 min-w-0 w-full font-bold text-sm sm:text-base text-[var(--text-main)] bg-transparent border border-transparent focus:border-[var(--primary)] focus:bg-white px-2 py-1 rounded-lg outline-none transition"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3 shrink-0">
                        <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                          <strong>{section.questions.length}</strong> câu hỏi •{' '}
                          <strong>{sectionPoints}</strong> điểm
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openQuestionPicker(sIdx)}
                            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-[var(--primary)] text-[var(--primary)] px-3 py-1.5 rounded-xl font-bold text-xs transition whitespace-nowrap"
                          >
                            <Plus className="w-3.5 h-3.5 shrink-0" />
                            <span>Chọn câu hỏi</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sIdx)}
                            title="Xóa phần thi này"
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section Questions List */}
                    {section.questions.length === 0 ? (
                      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-5 sm:p-6 text-center text-slate-500 text-xs sm:text-sm">
                        <HelpCircle className="w-7 h-7 mx-auto mb-2 opacity-50" />
                        <p className="font-semibold">Phần này chưa có câu hỏi nào</p>
                        <p className="mt-1 text-xs text-red-500">
                          (Cần ít nhất 1 câu hỏi để có thể xuất bản ở trạng thái READY theo quy tắc TC-05)
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {section.questions.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
                          >
                            <div className="flex items-start sm:items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                              <span className="text-xs font-extrabold text-slate-500 min-w-[24px] shrink-0">
                                #{qIdx + 1}
                              </span>
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-600 shrink-0 whitespace-nowrap">
                                {q.type}
                              </span>
                              <span className="text-xs sm:text-sm text-[var(--text-main)] font-semibold leading-snug break-words min-w-0">
                                {q.content}
                              </span>
                            </div>

                            <div className="flex items-center justify-end gap-3 shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                              <div className="flex items-center gap-1.5">
                                <label className="text-xs text-slate-500">Điểm:</label>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0.5"
                                  value={q.points}
                                  onChange={(e) =>
                                    handleUpdatePoints(sIdx, qIdx, Number(e.target.value))
                                  }
                                  className="w-16 px-2 py-1 rounded border border-[var(--border-card)] text-xs sm:text-sm font-bold text-center"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(sIdx, qIdx)}
                                className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="sticky bottom-3 sm:bottom-4 bg-slate-800 text-white p-3.5 sm:px-6 sm:py-4 rounded-2xl shadow-xl z-40 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 lg:gap-6">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 sm:gap-6">
              <div>
                <span className="text-xs text-slate-400 block">Tổng số phần thi:</span>
                <div className="font-extrabold text-sm sm:text-base">{sections.length} phần</div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Tổng số câu hỏi:</span>
                <div className="font-extrabold text-sm sm:text-base">
                  {sections.reduce((s, sec) => s + sec.questions.length, 0)} câu
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Tổng điểm đề thi:</span>
                <div className="font-extrabold text-sm sm:text-base text-sky-400">
                  {totalPoints} điểm
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Điểm đạt:</span>
                <div className="font-extrabold text-sm sm:text-base text-green-400">
                  {passingScore} điểm
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveExam('DRAFT')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition disabled:opacity-70 whitespace-nowrap"
              >
                Lưu bản nháp (DRAFT)
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveExam('READY')}
                className="bg-[var(--primary)] hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition disabled:opacity-70 inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Lưu & Sẵn sàng giao (READY)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN DANH SÁCH ĐỀ THI */
        <div>
          {isLoading ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              Đang tải danh sách đề thi thử...
            </div>
          ) : mockExams.length === 0 ? (
            <div className="bg-white border border-dashed border-[var(--border-card)] rounded-2xl px-5 py-10 sm:py-14 text-center">
              <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-3.5" />
              <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-1.5">
                Chưa có đề thi thử nào
              </h3>
              <p className="text-[var(--text-muted)] text-xs sm:text-sm mb-5 max-w-md mx-auto leading-relaxed">
                Bắt đầu tạo đề thi thử theo cấu trúc kỳ thi HSK để chuẩn bị cho học sinh của bạn.
              </p>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] hover:opacity-95 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition whitespace-nowrap"
              >
                Tạo đề thi đầu tiên
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 sm:gap-4">
              {mockExams.map((exam) => {
                const isExpanded = expandedExamId === exam.id
                return (
                  <div
                    key={exam.id}
                    className="bg-white border border-[var(--border-card)] rounded-2xl overflow-hidden shadow-xs"
                  >
                    <div className="p-4 sm:px-6 sm:py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="bg-blue-50 text-[var(--primary)] border border-blue-200 px-2 py-0.5 rounded font-extrabold text-xs whitespace-nowrap">
                            HSK {exam.hskLevel}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded border font-bold text-xs whitespace-nowrap ${
                              exam.status === 'READY'
                                ? 'bg-green-50 text-green-600 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {exam.status === 'READY' ? 'Sẵn sàng giao' : 'Bản nháp'}
                          </span>

                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            Mã đề: #{exam.id}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] mb-1.5 break-words">
                          {exam.title}
                        </h3>

                        {exam.description && (
                          <p className="text-slate-500 text-xs sm:text-sm mb-2.5 break-words leading-relaxed">
                            {exam.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <strong>{exam.timeLimitMinutes}</strong> phút
                          </span>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            Điểm đạt: <strong>{exam.passingScore}</strong> / <strong>{exam.totalPoints}</strong>
                          </span>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Layers className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                            <strong>{exam.sectionCount}</strong> phần thi
                          </span>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <strong>{exam.questionCount}</strong> câu hỏi
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleExpandExam(exam.id)}
                          className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-[var(--border-card)] text-[var(--text-main)] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                          <span>{isExpanded ? 'Đóng cấu trúc' : 'Xem cấu trúc đề'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => openAssignDrawer(exam)}
                          className="inline-flex items-center gap-1.5 bg-[var(--primary)] hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition whitespace-nowrap"
                        >
                          <Send className="w-3.5 h-3.5 shrink-0" />
                          <span>Giao cho lớp</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Expandable Structure Details (NO MODAL) */}
                    {isExpanded && (
                      <div className="bg-slate-50 border-t border-[var(--border-card)] p-4 sm:px-6 sm:py-5">
                        <h4 className="text-sm sm:text-base font-bold text-[var(--text-main)] mb-3.5 flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-[var(--primary)] shrink-0" />
                          <span>Chi tiết các phần thi và câu hỏi</span>
                        </h4>

                        {!examDetail ? (
                          <div className="text-xs sm:text-sm text-slate-500">Đang nạp chi tiết...</div>
                        ) : (
                          <div className="flex flex-col gap-3.5">
                            {examDetail.sections.map((sec, sIdx) => (
                              <div
                                key={sec.id || sIdx}
                                className="bg-white rounded-xl border border-slate-200 p-3.5 sm:px-4 sm:py-3.5"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                  <span className="font-bold text-xs sm:text-sm text-[var(--text-main)] break-words">
                                    {sec.name}
                                  </span>
                                  <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {sec.questions.length} câu hỏi
                                  </span>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                  {sec.questions.map((q, qIdx) => (
                                    <div
                                      key={q.id || qIdx}
                                      className="flex items-start sm:items-center justify-between gap-2 bg-slate-50 px-3 py-2 rounded-lg text-xs sm:text-sm"
                                    >
                                      <span className="min-w-0 break-words">
                                        <strong>#{qIdx + 1}.</strong> {q.content}
                                      </span>
                                      <span className="text-[var(--primary)] font-bold shrink-0 whitespace-nowrap">
                                        {q.points} điểm
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* DRAWER CHỌN CÂU HỎI TỪ NGÂN HÀNG (SLIDE-OVER - NO MODAL) */}
      {isQuestionDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] flex justify-end"
          onClick={() => setIsQuestionDrawerOpen(false)}
        >
          <div
            className="w-full sm:w-[540px] sm:max-w-[90vw] h-full bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[var(--border-card)] flex items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                  Ngân hàng câu hỏi cá nhân
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  {targetSectionIndex !== null ? `Đưa vào ${sections[targetSectionIndex]?.name}` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQuestionDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-[var(--border-card)]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi theo nội dung..."
                  value={searchQuestionKeyword}
                  onChange={(e) => setSearchQuestionKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Questions List */}
            <div className="flex-1 overflow-y-auto px-4 py-3.5 sm:px-6 sm:py-4">
              {isLoadingQuestions ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Đang nạp câu hỏi...
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  Không tìm thấy câu hỏi phù hợp trong ngân hàng
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredQuestions.map((q) => {
                    const isAdded = sections.some((s) =>
                      s.questions.some((item) => item.questionId === q.id)
                    )
                    return (
                      <div
                        key={q.id}
                        className={`border border-slate-200 rounded-xl px-3.5 py-3 flex items-center justify-between gap-3 ${
                          isAdded ? 'bg-slate-100 opacity-75' : 'bg-white'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[11px] font-bold bg-blue-50 text-[var(--primary)] px-1.5 py-0.5 rounded whitespace-nowrap">
                              {q.type}
                            </span>
                            <span className="text-xs text-slate-400">#{q.id}</span>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] break-words">
                            {q.content}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddQuestionToSection(q)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 whitespace-nowrap transition ${
                            isAdded
                              ? 'bg-slate-200 text-slate-500 cursor-default'
                              : 'bg-[var(--primary)] hover:opacity-95 text-white'
                          }`}
                        >
                          {isAdded ? 'Đã thêm' : 'Chọn'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-[var(--border-card)] text-right">
              <button
                type="button"
                onClick={() => setIsQuestionDrawerOpen(false)}
                className="bg-[var(--primary)] hover:opacity-95 text-white px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER GIAO ĐỀ CHO LỚP HỌC (SLIDE-OVER - NO MODAL) */}
      {isAssignDrawerOpen && selectedExamToAssign && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] flex justify-end"
          onClick={() => setIsAssignDrawerOpen(false)}
        >
          <div
            className="w-full sm:w-[480px] sm:max-w-[90vw] h-full bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-b border-[var(--border-card)] flex items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                  Giao đề thi thử cho lớp
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 break-words">
                  {selectedExamToAssign.title} (HSK {selectedExamToAssign.hskLevel})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAssignDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                  Chọn lớp học phụ trách <span className="text-red-500">*</span>
                </label>
                {classes.length === 0 ? (
                  <p className="text-red-500 text-xs sm:text-sm">
                    Bạn chưa có lớp học nào đang hoạt động. Vui lòng tạo lớp học trước.
                  </p>
                ) : (
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.joinCode})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                  Hạn nộp bài thi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[var(--border-card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs sm:text-sm text-slate-600">
                <p className="mb-1.5 font-bold">Thông số đề thi thử:</p>
                <ul className="pl-5 list-disc flex flex-col gap-1">
                  <li>Thời gian làm bài: <strong>{selectedExamToAssign.timeLimitMinutes} phút</strong></li>
                  <li>Điểm đạt: <strong>{selectedExamToAssign.passingScore}</strong> / {selectedExamToAssign.totalPoints} điểm</li>
                  <li>Số phần thi: <strong>{selectedExamToAssign.sectionCount} phần</strong></li>
                  <li>Số câu hỏi: <strong>{selectedExamToAssign.questionCount} câu</strong></li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-t border-[var(--border-card)] flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAssignDrawerOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 border border-[var(--border-card)] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap"
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={isAssigning || classes.length === 0}
                onClick={handleAssign}
                className="bg-[var(--primary)] hover:opacity-95 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold disabled:opacity-70 inline-flex items-center justify-center gap-1.5 transition whitespace-nowrap"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>Xác nhận giao bài</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
