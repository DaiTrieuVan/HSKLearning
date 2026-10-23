import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  AlertCircle,
  Search,
  Layers,
  Calendar,
  FileCheck,
  HelpCircle,
  FileText,
  MoveUp,
  MoveDown,
  Trash2,
  Check,
  X,
  Eye,
  Copy,
  Pencil,
  Send,
  Clock,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyExercises,
  createExercise,
  updateExercise,
  getExerciseDetail,
  copyExercise,
  type ExerciseItem,
  type ExerciseStatus,
  type CreateExerciseQuestionItem,
} from '../../api/exercise'
import { getMyQuestions, type QuestionItem } from '../../api/question'
import { assignExercise } from '../../api/assignment'
import { getTeachingClasses, type ClassItem } from '../../api/classroom'
import { ApiError } from '../../api/auth'

interface SelectedQuestionConfig {
  questionId: number
  points: number
  sortOrder: number
}

export const ExerciseManagementPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [exercises, setExercises] = useState<ExerciseItem[]>([])
  const [bankQuestions, setBankQuestions] = useState<QuestionItem[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DRAFT' | 'READY'>('ALL')

  // Drawer Create & Edit Exercise state (No Modal! HTT-05-CN-008)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ExerciseStatus>('DRAFT')
  const [selectedConfigs, setSelectedConfigs] = useState<SelectedQuestionConfig[]>([])
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Detail Drawer state (No Modal!)
  const [detailExercise, setDetailExercise] = useState<ExerciseItem | null>(null)

  // Copy Drawer state (No Modal! HTT-05-CN-007)
  const [isCopyDrawerOpen, setIsCopyDrawerOpen] = useState(false)
  const [sourceExerciseToCopy, setSourceExerciseToCopy] = useState<ExerciseItem | null>(null)
  const [newCopyTitle, setNewCopyTitle] = useState('')
  const [copying, setCopying] = useState(false)

  // Assign Drawer state (No Modal! HTT-06-CN-001)
  const [isAssignDrawerOpen, setIsAssignDrawerOpen] = useState(false)
  const [exerciseToAssign, setExerciseToAssign] = useState<ExerciseItem | null>(null)
  const [teachingClasses, setTeachingClasses] = useState<ClassItem[]>([])
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [selectedClassId, setSelectedClassId] = useState<number | ''>('')
  const [assignMode, setAssignMode] = useState<'NOW' | 'SCHEDULED'>('NOW')
  const [scheduledStartTime, setScheduledStartTime] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [assignErrors, setAssignErrors] = useState<string[]>([])
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    if (user) {
      loadExercises()
      loadBankQuestions()
    }
  }, [user])

  const loadExercises = async () => {
    if (!user) return
    setLoading(true)
    setErrorMessage(null)
    try {
      const data = await getMyExercises(user.token)
      setExercises(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể tải danh sách bài tập')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadBankQuestions = async () => {
    if (!user) return
    try {
      const data = await getMyQuestions(user.token)
      setBankQuestions(data)
    } catch {
      // silently fail if bank questions fail
    }
  }

  // --- Handlers for Create & Edit Exercise Drawer ---
  const handleOpenCreateDrawer = () => {
    setEditingExerciseId(null)
    setTitle('')
    setDescription('')
    setStatus('DRAFT')
    setSelectedConfigs([])
    setFormErrors([])
    setErrorMessage(null)
    setDetailExercise(null)
    setIsCopyDrawerOpen(false)
    setIsDrawerOpen(true)
  }

  const handleOpenEditDrawer = (ex: ExerciseItem) => {
    setEditingExerciseId(ex.id)
    setTitle(ex.title)
    setDescription(ex.description || '')
    setStatus(ex.status)
    const configs: SelectedQuestionConfig[] = (ex.questions || []).map((q, idx) => ({
      questionId: q.questionId,
      points: q.points,
      sortOrder: q.sortOrder || idx + 1,
    }))
    setSelectedConfigs(configs)
    setFormErrors([])
    setErrorMessage(null)
    setDetailExercise(null)
    setIsCopyDrawerOpen(false)
    setIsDrawerOpen(true)
  }

  const handleCloseCreateDrawer = () => {
    setIsDrawerOpen(false)
    setEditingExerciseId(null)
    setFormErrors([])
  }

  const handleToggleSelectQuestion = (questionId: number) => {
    const isSelected = selectedConfigs.some((c) => c.questionId === questionId)
    if (isSelected) {
      // Bỏ bớt câu hỏi (TC-02)
      const next = selectedConfigs
        .filter((c) => c.questionId !== questionId)
        .map((c, idx) => ({ ...c, sortOrder: idx + 1 }))
      setSelectedConfigs(next)
    } else {
      // Thêm câu hỏi
      const nextOrder = selectedConfigs.length + 1
      setSelectedConfigs([
        ...selectedConfigs,
        { questionId, points: 2.0, sortOrder: nextOrder },
      ])
    }
  }

  const handlePointChange = (questionId: number, pointStr: string) => {
    const val = parseFloat(pointStr)
    setSelectedConfigs((prev) =>
      prev.map((c) =>
        c.questionId === questionId
          ? { ...c, points: isNaN(val) ? 0 : val }
          : c
      )
    )
  }

  const handleMoveOrder = (index: number, direction: 'UP' | 'DOWN') => {
    if (
      (direction === 'UP' && index === 0) ||
      (direction === 'DOWN' && index === selectedConfigs.length - 1)
    ) {
      return
    }

    const next = [...selectedConfigs]
    const targetIndex = direction === 'UP' ? index - 1 : index + 1
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp

    // Cập nhật lại sortOrder (TC-02)
    const reordered = next.map((c, idx) => ({ ...c, sortOrder: idx + 1 }))
    setSelectedConfigs(reordered)
  }

  const handleRemoveFromSelected = (questionId: number) => {
    const next = selectedConfigs
      .filter((c) => c.questionId !== questionId)
      .map((c, idx) => ({ ...c, sortOrder: idx + 1 }))
    setSelectedConfigs(next)
  }

  // Tổng điểm thời gian thực (TC-01)
  const currentTotalPoints = selectedConfigs.reduce(
    (sum, c) => sum + (c.points > 0 ? c.points : 0),
    0
  )

  const validateForm = (): string[] => {
    const errors: string[] = []
    if (!title.trim()) {
      errors.push('Tên bài tập không được để trống (TC-03).')
    }

    if (status === 'READY' && selectedConfigs.length === 0) {
      errors.push(
        'Bài tập chưa có câu hỏi nào thì chỉ được lưu dạng nháp (DRAFT), không thể chuyển sang sẵn sàng giao (TC-05, QTN-09).'
      )
    }

    for (let i = 0; i < selectedConfigs.length; i++) {
      const c = selectedConfigs[i]
      if (c.points <= 0) {
        errors.push(`Điểm của câu số ${i + 1} phải lớn hơn 0 (TC-04).`)
      }
    }

    // Kiểm tra trùng lặp câu hỏi (TC-06)
    const set = new Set<number>()
    for (const c of selectedConfigs) {
      if (set.has(c.questionId)) {
        errors.push('Bài tập không được chứa câu hỏi trùng lặp (TC-06).')
        break
      }
      set.add(c.questionId)
    }

    return errors
  }

  const handleSaveExercise = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setErrorMessage(null)
    setSuccessMessage(null)

    const errors = validateForm()
    setFormErrors(errors)
    if (errors.length > 0) return

    setSubmitting(true)
    try {
      const questionsPayload: CreateExerciseQuestionItem[] = selectedConfigs.map(
        (c) => ({
          questionId: c.questionId,
          points: c.points,
          sortOrder: c.sortOrder,
        })
      )

      if (editingExerciseId) {
        const updated = await updateExercise(
          editingExerciseId,
          {
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
            status,
            questions: questionsPayload,
          },
          user.token
        )
        setSuccessMessage(`Đã cập nhật bài tập "${updated.title}" thành công!`)
      } else {
        const saved = await createExercise(
          {
            title: title.trim(),
            description: description.trim() ? description.trim() : undefined,
            status,
            questions: questionsPayload,
          },
          user.token
        )
        setSuccessMessage(`Đã tạo thành công bài tập "${saved.title}" (Tổng điểm: ${saved.totalPoints})!`)
      }

      handleCloseCreateDrawer()
      loadExercises()
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage(editingExerciseId ? 'Không thể cập nhật bài tập' : 'Không thể tạo bài tập')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // --- Handlers for Detail Drawer ---
  const handleOpenDetail = async (exerciseId: number) => {
    if (!user) return
    setIsDrawerOpen(false)
    try {
      const item = await getExerciseDetail(exerciseId, user.token)
      setDetailExercise(item)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể lấy chi tiết bài tập')
      }
    }
  }

  // --- Handlers for Copy Exercise Drawer (HTT-05-CN-007) ---
  const handleOpenCopyDrawer = (ex: ExerciseItem) => {
    setIsDrawerOpen(false)
    setDetailExercise(null)
    setSourceExerciseToCopy(ex)
    setNewCopyTitle(`${ex.title} (Bản sao)`)
    setIsCopyDrawerOpen(true)
  }

  const handleCloseCopyDrawer = () => {
    setIsCopyDrawerOpen(false)
    setSourceExerciseToCopy(null)
    setNewCopyTitle('')
  }

  const handleExecuteCopy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !sourceExerciseToCopy) return
    setCopying(true)
    setErrorMessage(null)
    try {
      const copied = await copyExercise(
        sourceExerciseToCopy.id,
        { newTitle: newCopyTitle },
        user.token
      )
      setSuccessMessage(
        `Đã sao chép thành công bài tập "${copied.title}" (Lưu ở trạng thái Bản nháp).`
      )
      handleCloseCopyDrawer()
      await loadExercises()
      setDetailExercise(copied)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Không thể sao chép bài tập')
      }
    } finally {
      setCopying(false)
    }
  }

  // --- Handlers for Assign Exercise to Classroom Drawer (HTT-06-CN-001) ---
  const getDefaultDueDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 3)
    d.setHours(23, 59, 0, 0)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }

  const getDefaultStartDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    d.setHours(8, 0, 0, 0)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
  }

  const handleOpenAssignDrawer = async (ex: ExerciseItem) => {
    setIsDrawerOpen(false)
    setIsCopyDrawerOpen(false)
    setDetailExercise(null)
    setExerciseToAssign(ex)
    setAssignMode('NOW')
    setScheduledStartTime(getDefaultStartDate())
    setDueTime(getDefaultDueDate())
    setAssignErrors([])
    setIsAssignDrawerOpen(true)

    if (user) {
      setLoadingClasses(true)
      try {
        const classes = await getTeachingClasses(user.token)
        const activeClasses = classes.filter((c) => c.status === 'ACTIVE')
        setTeachingClasses(activeClasses)
        if (activeClasses.length > 0) {
          setSelectedClassId(activeClasses[0].id)
        } else {
          setSelectedClassId('')
        }
      } catch {
        setAssignErrors(['Không thể tải danh sách lớp học của bạn'])
      } finally {
        setLoadingClasses(false)
      }
    }
  }

  const handleCloseAssignDrawer = () => {
    setIsAssignDrawerOpen(false)
    setExerciseToAssign(null)
    setAssignErrors([])
  }

  const handleExecuteAssign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !exerciseToAssign) return

    const errors: string[] = []
    if (!selectedClassId) {
      errors.push('Vui lòng chọn lớp học để giao bài')
    }
    if (!dueTime) {
      errors.push('Hạn nộp bài không được để trống')
    } else {
      const due = new Date(dueTime)
      const start =
        assignMode === 'SCHEDULED' && scheduledStartTime
          ? new Date(scheduledStartTime)
          : new Date()
      if (due <= start) {
        errors.push('Hạn nộp bài phải sau thời gian bắt đầu / thời điểm giao bài')
      }
    }

    if (errors.length > 0) {
      setAssignErrors(errors)
      return
    }

    setAssigning(true)
    setAssignErrors([])
    try {
      const payload = {
        exerciseId: exerciseToAssign.id,
        classId: Number(selectedClassId),
        startTime:
          assignMode === 'SCHEDULED' && scheduledStartTime
            ? new Date(scheduledStartTime).toISOString()
            : null,
        dueTime: new Date(dueTime).toISOString(),
      }
      const assigned = await assignExercise(payload, user.token)
      setSuccessMessage(
        `Đã giao thành công bài tập "${assigned.title}" cho lớp "${assigned.classTitle}"!`
      )
      handleCloseAssignDrawer()
    } catch (err) {
      if (err instanceof ApiError) {
        setAssignErrors([err.message])
      } else {
        setAssignErrors(['Không thể giao bài tập cho lớp. Vui lòng thử lại sau.'])
      }
    } finally {
      setAssigning(false)
    }
  }

  const filteredExercises = exercises.filter((ex) => {
    const matchSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    if (statusFilter === 'ALL') return matchSearch
    return matchSearch && ex.status === statusFilter
  })

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Header */}
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
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">
                  Quản lý bài tập
                </h1>
                <p className="text-xs text-slate-500">
                  Đóng gói câu hỏi từ ngân hàng thành bài tập hoàn chỉnh (QTN-09, QTN-19)
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/questions')}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl shadow-xs transition text-sm"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Ngân hàng câu hỏi</span>
            </button>

            <button
              onClick={handleOpenCreateDrawer}
              className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-sm transition text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bài tập mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Banner Alert Messages */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-800">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{errorMessage}</div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-rose-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{successMessage}</div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CREATE & EDIT EXERCISE SLIDE-OVER DRAWER (NO MODAL! HTT-05-CN-008) */}
        {isDrawerOpen && (
          <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white text-sm">
                  {editingExerciseId ? <Pencil className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    {editingExerciseId ? 'Chỉnh sửa bài tập (HTT-05-CN-008)' : 'Tạo bài tập mới từ câu hỏi'}
                  </h2>
                  <p className="text-xs text-purple-100">
                    {editingExerciseId
                      ? 'Cập nhật tên bài, điểm từng câu, đổi thứ tự và thêm/bớt câu hỏi (QTN-09, QTN-10, QTN-19).'
                      : 'Chọn câu hỏi từ ngân hàng của bạn, gán điểm từng câu và đặt trạng thái giao bài (QTN-09, QTN-19).'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseCreateDrawer}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Đóng soạn bài tập"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExercise} className="p-6 space-y-6">
              {formErrors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Vui lòng kiểm tra lại:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-700 space-y-0.5 pl-1">
                    {formErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: General Info */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Tên bài tập <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="VD: Kiểm tra 15 phút từ vựng HSK 1 - Tuần 2"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Mô tả / Hướng dẫn làm bài
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Nhập hướng dẫn làm bài cho học sinh..."
                      className="w-full px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Status Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Trạng thái bài tập ban đầu
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStatus('DRAFT')}
                        className={`p-3 rounded-xl border text-left transition ${
                          status === 'DRAFT'
                            ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-300'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center space-x-1.5">
                          <span>Bản nháp (DRAFT)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                          Cho phép lưu dù bài chưa có câu hỏi nào (TC-05).
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStatus('READY')}
                        className={`p-3 rounded-xl border text-left transition ${
                          status === 'READY'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center space-x-1.5">
                          <span>Sẵn sàng giao (READY)</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                          Bắt buộc có ít nhất 1 câu hỏi để giao bài (QTN-09).
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Live Summary Card */}
                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                      Thống kê bài tập
                    </span>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Số lượng câu đã chọn:</span>
                      <span className="font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-lg">
                        {selectedConfigs.length} câu
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Tổng điểm bài thi:</span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg text-base">
                        {currentTotalPoints.toFixed(1)} điểm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Selected questions and ordering */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Câu hỏi trong bài tập (Sắp xếp thứ tự & gán điểm)
                    </label>

                    {selectedConfigs.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400 space-y-2">
                        <FileText className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs font-medium">
                          Chưa có câu hỏi nào được chọn. Hãy chọn câu hỏi từ ngân hàng bên dưới!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {selectedConfigs.map((cfg, idx) => {
                          const q = bankQuestions.find((item) => item.id === cfg.questionId)
                          return (
                            <div
                              key={cfg.questionId}
                              className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center space-x-3 transition hover:border-purple-300"
                            >
                              <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                {idx + 1}
                              </span>

                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-slate-900 truncate">
                                  {q ? q.content : `Câu hỏi #${cfg.questionId}`}
                                </div>
                                <span className="text-[11px] text-slate-400">
                                  Loại: {q ? q.type : 'MCQ'}
                                </span>
                              </div>

                              {/* Points input */}
                              <div className="flex items-center space-x-1.5 flex-shrink-0">
                                <span className="text-xs text-slate-500 font-medium">Điểm:</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0.5"
                                  value={cfg.points}
                                  onChange={(e) => handlePointChange(cfg.questionId, e.target.value)}
                                  className="w-16 px-2 py-1 text-xs font-bold text-purple-900 bg-purple-50/60 border border-purple-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>

                              {/* Reorder actions */}
                              <div className="flex items-center space-x-0.5 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleMoveOrder(idx, 'UP')}
                                  disabled={idx === 0}
                                  className="p-1 text-slate-400 hover:text-purple-600 disabled:opacity-30 transition"
                                  title="Đưa lên trên"
                                >
                                  <MoveUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveOrder(idx, 'DOWN')}
                                  disabled={idx === selectedConfigs.length - 1}
                                  className="p-1 text-slate-400 hover:text-purple-600 disabled:opacity-30 transition"
                                  title="Đưa xuống dưới"
                                >
                                  <MoveDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromSelected(cfg.questionId)}
                                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                                  title="Bỏ câu này ra khỏi bài"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-400 italic pt-2">
                    Gợi ý: Bạn có thể đổi vị trí câu hỏi bằng nút mũi tên lên / xuống (TC-02).
                  </div>
                </div>
              </div>

              {/* Bottom: Question Bank Picker Section */}
              <div className="border-t border-slate-200 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-slate-900">
                      Chọn câu hỏi từ Ngân hàng của bạn ({bankQuestions.length} câu sẵn có)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Chỉ câu hỏi do chính bạn tạo ra mới hiển thị tại đây (QTN-19).
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                  {bankQuestions.map((q) => {
                    const isSelected = selectedConfigs.some((c) => c.questionId === q.id)
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleToggleSelectQuestion(q.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start space-x-3 ${
                          isSelected
                            ? 'bg-purple-50/70 border-purple-400 ring-1 ring-purple-400'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              #{q.id} • {q.type}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {q.content}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseCreateDrawer}
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FileCheck className="w-4 h-4" />
                  )}
                  <span>{editingExerciseId ? 'Cập nhật bài tập' : 'Lưu bài tập'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* COPY EXERCISE SLIDE-OVER DRAWER (NO MODAL! HTT-05-CN-007) */}
        {isCopyDrawerOpen && sourceExerciseToCopy && (
          <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white text-sm">
                  <Copy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Sao chép bài tập (HTT-05-CN-007)</h2>
                  <p className="text-xs text-indigo-100">
                    Tạo bản sao độc lập ở trạng thái Bản nháp (DRAFT) để tái sử dụng cho lớp khác (QTN-19).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseCopyDrawer}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Đóng sao chép"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteCopy} className="p-6 space-y-5">
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 space-y-2">
                <div className="font-bold flex items-center space-x-2">
                  <span>Bài tập gốc:</span>
                  <span className="text-indigo-700 font-extrabold">{sourceExerciseToCopy.title}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-600">
                  <span>
                    Số câu hỏi: <strong className="text-indigo-700">{sourceExerciseToCopy.questionCount}</strong>
                  </span>
                  <span>
                    Tổng điểm: <strong className="text-purple-700">{sourceExerciseToCopy.totalPoints} điểm</strong>
                  </span>
                  <span>
                    Trạng thái gốc: <strong className="text-slate-800">{sourceExerciseToCopy.status === 'READY' ? 'Sẵn sàng giao' : 'Bản nháp'}</strong>
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] italic">
                  * Bản sao sẽ được khởi tạo ở trạng thái <strong>Bản nháp (DRAFT)</strong> và hoàn toàn độc lập với bài gốc. Các bài nộp hay hạn nộp cũ sẽ không bị mang sang bản sao.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Tên bài tập cho bản sao mới <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCopyTitle}
                  onChange={(e) => setNewCopyTitle(e.target.value)}
                  placeholder="Nhập tên bài tập mới..."
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseCopyDrawer}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={copying}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm text-xs transition disabled:opacity-50"
                >
                  {copying ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang sao chép...</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Tạo bản sao ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ASSIGN EXERCISE TO CLASS DRAWER (NO MODAL! HTT-06-CN-001) */}
        {isAssignDrawerOpen && exerciseToAssign && (
          <div className="bg-white rounded-3xl border-2 border-emerald-300 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white text-sm">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">
                    Giao bài tập cho lớp học (HTT-06-CN-001)
                  </h2>
                  <p className="text-xs text-emerald-100">
                    Chụp snapshot câu hỏi, cố định nội dung đề và điểm số cho lớp (QTN-01, QTN-09, QTN-10).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAssignDrawer}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                title="Đóng giao bài"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAssign} className="p-6 space-y-5">
              {assignErrors.length > 0 && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Vui lòng kiểm tra lại:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-rose-700 space-y-0.5 pl-1">
                    {assignErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tóm tắt bài tập */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{exerciseToAssign.title}</div>
                  <div className="text-slate-500 mt-0.5">
                    Mã bài #{exerciseToAssign.id} • {exerciseToAssign.questionCount} câu hỏi • Tổng {exerciseToAssign.totalPoints} điểm
                  </div>
                </div>
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs self-start sm:self-auto">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Sẵn sàng giao</span>
                </span>
              </div>

              {/* Chọn lớp học */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Chọn lớp học phụ trách <span className="text-rose-500">*</span>
                </label>
                {loadingClasses ? (
                  <div className="py-3 text-center text-xs text-slate-400">Đang tải danh sách lớp học...</div>
                ) : teachingClasses.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    Bạn chưa có lớp học nào đang hoạt động. Vui lòng tạo lớp học trước khi giao bài!
                  </div>
                ) : (
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold bg-white"
                  >
                    {teachingClasses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (Mã: {c.joinCode} - {c.memberCount} học sinh)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Tùy chọn thời gian bắt đầu */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Thời gian bắt đầu làm bài <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                      assignMode === 'NOW'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assignMode"
                      value="NOW"
                      checked={assignMode === 'NOW'}
                      onChange={() => setAssignMode('NOW')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div>Giao ngay bây giờ</div>
                      <div className="text-slate-400 font-normal text-[11px]">Học sinh có thể làm bài ngay lập tức</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                      assignMode === 'SCHEDULED'
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <input
                      type="radio"
                      name="assignMode"
                      value="SCHEDULED"
                      checked={assignMode === 'SCHEDULED'}
                      onChange={() => setAssignMode('SCHEDULED')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div>Hẹn giờ mở bài</div>
                      <div className="text-slate-400 font-normal text-[11px]">Chỉ hiển thị và cho làm từ giờ hẹn</div>
                    </div>
                  </label>
                </div>

                {assignMode === 'SCHEDULED' && (
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Thời điểm mở bài (Giờ & Ngày):
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledStartTime}
                      onChange={(e) => setScheduledStartTime(e.target.value)}
                      required={assignMode === 'SCHEDULED'}
                      className="w-full sm:w-72 px-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Hạn nộp bài */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hạn chót nộp bài (Hạn nộp) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <input
                    type="datetime-local"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    required
                    className="w-full sm:w-72 px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sau hạn nộp hệ thống sẽ đóng bài và không nhận thêm bài làm</span>
                  </span>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseAssignDrawer}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium text-xs transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={assigning || teachingClasses.length === 0}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-xs transition disabled:opacity-50"
                >
                  {assigning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang giao bài...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Xác nhận giao bài</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* DETAIL SLIDE-OVER DRAWER (NO MODAL!) */}
        {detailExercise && (
          <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white text-sm">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold flex items-center space-x-2">
                    <span>{detailExercise.title}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                        detailExercise.status === 'READY'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {detailExercise.status === 'READY' ? 'Sẵn sàng giao' : 'Bản nháp'}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Mã bài tập: #{detailExercise.id} • Tổng {detailExercise.totalPoints} điểm •{' '}
                    {detailExercise.questionCount} câu hỏi
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {detailExercise.status === 'READY' && (
                  <button
                    type="button"
                    onClick={() => handleOpenAssignDrawer(detailExercise)}
                    className="flex items-center space-x-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition shadow-sm"
                    title="Giao bài tập này cho lớp"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Giao bài</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenEditDrawer(detailExercise)}
                  className="flex items-center space-x-1 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg transition shadow-sm"
                  title="Chỉnh sửa bài tập này"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCopyDrawer(detailExercise)}
                  className="flex items-center space-x-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition shadow-sm"
                  title="Sao chép bài tập này"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép bài này</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetailExercise(null)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {detailExercise.description && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                  <span className="font-bold text-slate-900">Mô tả: </span>
                  <span>{detailExercise.description}</span>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Danh sách câu hỏi trong bài:
                </span>
                {detailExercise.questions && detailExercise.questions.length > 0 ? (
                  <div className="space-y-2">
                    {detailExercise.questions.map((q, idx) => (
                      <div
                        key={q.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{q.content}</div>
                            <span className="text-slate-400 text-[11px]">Dạng: {q.type}</span>
                          </div>
                        </div>
                        <span className="font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
                          {q.points} điểm
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">Bài tập chưa có câu hỏi nào.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm bài tập theo tên..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DRAFT')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'DRAFT'
                    ? 'bg-white text-amber-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Bản nháp
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('READY')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'READY'
                    ? 'bg-white text-emerald-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sẵn sàng giao
              </button>
            </div>

            <span className="flex items-center space-x-1.5 font-medium text-xs text-slate-500">
              <Layers className="w-4 h-4 text-purple-500" />
              <span>{filteredExercises.length} bài tập</span>
            </span>
          </div>
        </div>

        {/* Exercises Grid List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Đang tải danh sách bài tập...</p>
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mx-auto mb-4">
              <FileCheck className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {searchTerm ? 'Không tìm thấy bài tập phù hợp' : 'Chưa có bài tập nào'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              {searchTerm
                ? 'Thử tìm với từ khóa khác hoặc chuyển sang bộ lọc Tất cả.'
                : 'Bạn chưa tạo bài tập nào. Hãy đóng gói các câu hỏi từ ngân hàng thành bài tập hoàn chỉnh ngay!'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleOpenCreateDrawer}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo bài tập đầu tiên</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        ex.status === 'READY'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <span>Bài #{ex.id}</span>
                      <span>•</span>
                      <span>{ex.status === 'READY' ? 'Sẵn sàng giao' : 'Bản nháp'}</span>
                    </span>

                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ex.createdAt).toLocaleDateString('vi-VN')}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug break-words">
                    {ex.title}
                  </h3>

                  {ex.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {ex.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="text-slate-600 font-medium">
                      {ex.questionCount} câu hỏi
                    </span>
                    <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {ex.totalPoints} điểm
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {ex.status === 'READY' && (
                      <button
                        type="button"
                        onClick={() => handleOpenAssignDrawer(ex)}
                        className="flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition"
                        title="Giao bài tập cho lớp"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Giao bài</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleOpenEditDrawer(ex)}
                      className="flex items-center space-x-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition"
                      title="Chỉnh sửa bài tập"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenCopyDrawer(ex)}
                      className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition"
                      title="Sao chép bài tập"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDetail(ex.id)}
                      className="flex items-center space-x-1 text-xs font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
