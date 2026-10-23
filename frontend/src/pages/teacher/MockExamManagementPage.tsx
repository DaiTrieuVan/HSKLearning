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
  Check,
  Calendar,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getMyMockExams,
  createMockExam,
  getMockExamDetail,
  type MockExamItem,
  type CreateMockExamPayload,
  type CreateMockExamSectionPayload,
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: 0,
            }}
          >
            <GraduationCap size={32} color="var(--primary)" />
            Đề thi thử HSK
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '4px' }}>
            Soạn và tổ chức kỳ thi thử chuẩn cấu trúc HSK với nhiều phần thi có tính giờ (HTT-09-CN-001)
          </p>
        </div>

        {!isCreating ? (
          <button
            type="button"
            onClick={() => {
              setIsCreating(true)
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
            }}
          >
            <Plus size={18} />
            Tạo đề thi mới
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#f1f5f9',
              color: 'var(--text-main)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-card)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} />
            Quay lại danh sách
          </button>
        )}
      </div>

      {/* Thông báo lỗi / thành công */}
      {errorMessage && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#dc2626',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.92rem',
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            color: '#16a34a',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.92rem',
          }}
        >
          <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* GIAO DIỆN TẠO ĐỀ THI MỚI */}
      {isCreating ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Thông tin cơ bản */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-card)',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FileText size={20} color="var(--primary)" />
              1. Thông tin cấu trúc đề thi
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}
                >
                  Tên đề thi thử <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đề thi thử HSK 1 - Chuẩn cấu trúc Hanban"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  Cấp độ HSK <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5, 6].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setHskLevel(lvl)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid',
                        borderColor: hskLevel === lvl ? 'var(--primary)' : 'var(--border-card)',
                        backgroundColor: hskLevel === lvl ? 'var(--primary-light)' : '#ffffff',
                        color: hskLevel === lvl ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      HSK {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  Thời gian làm bài (phút) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="1"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                  <Clock
                    size={18}
                    color="#64748b"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}
                >
                  Điểm đạt (Passing score)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.92rem',
                      outline: 'none',
                    }}
                  />
                  <Award
                    size={18}
                    color="#64748b"
                    style={{ position: 'absolute', left: '12px', top: '12px' }}
                  />
                </div>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}
                >
                  Mô tả đề thi
                </label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú hướng dẫn cho học sinh khi làm bài thi thử..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-card)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Quản lý các phần thi */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-card)',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  margin: 0,
                }}
              >
                <Layers size={20} color="var(--primary)" />
                2. Các phần thi trong đề (Sections)
              </h2>

              <button
                type="button"
                onClick={handleAddSection}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                Thêm phần thi
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sections.map((section, sIdx) => {
                const sectionPoints = section.questions.reduce(
                  (sum, q) => sum + (Number(q.points) || 0),
                  0
                )
                return (
                  <div
                    key={sIdx}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#f8fafc',
                      padding: '16px',
                    }}
                  >
                    {/* Section Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span
                          style={{
                            backgroundColor: 'var(--primary)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          Phần {sIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={section.name}
                          onChange={(e) => handleUpdateSectionName(sIdx, e.target.value)}
                          placeholder="Tên phần thi (ví dụ: Phần 1: Nghe)"
                          style={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'var(--text-main)',
                            border: '1px solid transparent',
                            backgroundColor: 'transparent',
                            padding: '4px 8px',
                            borderRadius: 'var(--radius-md)',
                            outline: 'none',
                            width: '320px',
                          }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                          onBlur={(e) => (e.target.style.borderColor = 'transparent')}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          <strong>{section.questions.length}</strong> câu hỏi •{' '}
                          <strong>{sectionPoints}</strong> điểm
                        </span>

                        <button
                          type="button"
                          onClick={() => openQuestionPicker(sIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          <Plus size={15} />
                          Chọn câu hỏi
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSection(sIdx)}
                          title="Xóa phần thi này"
                          style={{
                            color: '#94a3b8',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Section Questions List */}
                    {section.questions.length === 0 ? (
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1.5px dashed #cbd5e1',
                          borderRadius: 'var(--radius-md)',
                          padding: '24px',
                          textAlign: 'center',
                          color: '#64748b',
                          fontSize: '0.88rem',
                        }}
                      >
                        <HelpCircle size={28} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          Phần này chưa có câu hỏi nào
                        </p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#ef4444' }}>
                          (Cần ít nhất 1 câu hỏi để có thể xuất bản ở trạng thái READY theo quy tắc TC-05)
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {section.questions.map((q, qIdx) => (
                          <div
                            key={qIdx}
                            style={{
                              backgroundColor: '#ffffff',
                              border: '1px solid #e2e8f0',
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                  color: '#64748b',
                                  minWidth: '24px',
                                }}
                              >
                                #{qIdx + 1}
                              </span>
                              <span
                                style={{
                                  backgroundColor: '#f1f5f9',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: '#475569',
                                }}
                              >
                                {q.type}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.9rem',
                                  color: 'var(--text-main)',
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                }}
                              >
                                {q.content}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Điểm:</label>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0.5"
                                  value={q.points}
                                  onChange={(e) =>
                                    handleUpdatePoints(sIdx, qIdx, Number(e.target.value))
                                  }
                                  style={{
                                    width: '60px',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-card)',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                  }}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveQuestion(sIdx, qIdx)}
                                style={{
                                  color: '#94a3b8',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                              >
                                <Trash2 size={16} />
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
          <div
            style={{
              position: 'sticky',
              bottom: '16px',
              backgroundColor: '#1e293b',
              color: '#ffffff',
              padding: '16px 24px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
              zIndex: 40,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tổng số phần thi:</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{sections.length} phần</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tổng số câu hỏi:</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  {sections.reduce((s, sec) => s + sec.questions.length, 0)} câu
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tổng điểm đề thi:</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#38bdf8' }}>
                  {totalPoints} điểm
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Điểm đạt:</span>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#4ade80' }}>
                  {passingScore} điểm
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveExam('DRAFT')}
                style={{
                  backgroundColor: '#334155',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                }}
              >
                Lưu bản nháp (DRAFT)
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSaveExam('READY')}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
                }}
              >
                <CheckCircle2 size={18} />
                Lưu & Sẵn sàng giao (READY)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* GIAO DIỆN DANH SÁCH ĐỀ THI */
        <div>
          {isLoading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748b' }}>
              Đang tải danh sách đề thi thử...
            </div>
          ) : mockExams.length === 0 ? (
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px dashed var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '60px 20px',
                textAlign: 'center',
              }}
            >
              <GraduationCap size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
                Chưa có đề thi thử nào
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 20px 0' }}>
                Bắt đầu tạo đề thi thử theo cấu trúc kỳ thi HSK để chuẩn bị cho học sinh của bạn.
              </p>
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Tạo đề thi đầu tiên
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mockExams.map((exam) => {
                const isExpanded = expandedExamId === exam.id
                return (
                  <div
                    key={exam.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1.5px solid var(--border-card)',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      style={{
                        padding: '20px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <span
                            style={{
                              backgroundColor: '#eff6ff',
                              color: 'var(--primary)',
                              border: '1px solid #bfdbfe',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                            }}
                          >
                            HSK {exam.hskLevel}
                          </span>

                          <span
                            style={{
                              backgroundColor: exam.status === 'READY' ? '#f0fdf4' : '#fefce8',
                              color: exam.status === 'READY' ? '#16a34a' : '#ca8a04',
                              border: `1px solid ${exam.status === 'READY' ? '#bbf7d0' : '#fef08a'}`,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '0.75rem',
                            }}
                          >
                            {exam.status === 'READY' ? 'Sẵn sàng giao' : 'Bản nháp'}
                          </span>

                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            Mã đề: #{exam.id}
                          </span>
                        </div>

                        <h3
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            margin: '0 0 6px 0',
                          }}
                        >
                          {exam.title}
                        </h3>

                        {exam.description && (
                          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 10px 0' }}>
                            {exam.description}
                          </p>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={15} color="#3b82f6" />
                            <strong>{exam.timeLimitMinutes}</strong> phút
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Award size={15} color="#10b981" />
                            Điểm đạt: <strong>{exam.passingScore}</strong> / <strong>{exam.totalPoints}</strong>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Layers size={15} color="#8b5cf6" />
                            <strong>{exam.sectionCount}</strong> phần thi
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <HelpCircle size={15} color="#f59e0b" />
                            <strong>{exam.questionCount}</strong> câu hỏi
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => toggleExpandExam(exam.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid var(--border-card)',
                            color: 'var(--text-main)',
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          {isExpanded ? 'Đóng cấu trúc' : 'Xem cấu trúc đề'}
                        </button>

                        <button
                          type="button"
                          onClick={() => openAssignDrawer(exam)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'var(--primary)',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(37,99,235,0.2)',
                          }}
                        >
                          <Send size={15} />
                          Giao cho lớp
                        </button>
                      </div>
                    </div>

                    {/* Inline Expandable Structure Details (NO MODAL) */}
                    {isExpanded && (
                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          borderTop: '1px solid var(--border-card)',
                          padding: '20px 24px',
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            margin: '0 0 14px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Layers size={17} color="var(--primary)" />
                          Chi tiết các phần thi và câu hỏi
                        </h4>

                        {!examDetail ? (
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Đang nạp chi tiết...</div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {examDetail.sections.map((sec, sIdx) => (
                              <div
                                key={sec.id || sIdx}
                                style={{
                                  backgroundColor: '#ffffff',
                                  borderRadius: 'var(--radius-md)',
                                  border: '1px solid #e2e8f0',
                                  padding: '14px 18px',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                  }}
                                >
                                  <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                                    {sec.name}
                                  </span>
                                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                    {sec.questions.length} câu hỏi
                                  </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {sec.questions.map((q, qIdx) => (
                                    <div
                                      key={q.id || qIdx}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#f8fafc',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        fontSize: '0.85rem',
                                      }}
                                    >
                                      <span>
                                        <strong>#{qIdx + 1}.</strong> {q.content}
                                      </span>
                                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsQuestionDrawerOpen(false)}
        >
          <div
            style={{
              width: '540px',
              maxWidth: '90vw',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Ngân hàng câu hỏi cá nhân
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {targetSectionIndex !== null ? `Đưa vào ${sections[targetSectionIndex]?.name}` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQuestionDrawerOpen(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-card)' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi theo nội dung..."
                  value={searchQuestionKeyword}
                  onChange={(e) => setSearchQuestionKeyword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-card)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              </div>
            </div>

            {/* Questions List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {isLoadingQuestions ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  Đang nạp câu hỏi...
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                  Không tìm thấy câu hỏi phù hợp trong ngân hàng
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filteredQuestions.map((q) => {
                    const isAdded = sections.some((s) =>
                      s.questions.some((item) => item.questionId === q.id)
                    )
                    return (
                      <div
                        key={q.id}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: isAdded ? '#f1f5f9' : '#ffffff',
                          opacity: isAdded ? 0.75 : 1,
                        }}
                      >
                        <div style={{ flex: 1, paddingRight: '12px' }}>
                          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: '#eff6ff',
                                color: 'var(--primary)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              {q.type}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              #{q.id}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {q.content}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isAdded}
                          onClick={() => handleAddQuestionToSection(q)}
                          style={{
                            backgroundColor: isAdded ? '#e2e8f0' : 'var(--primary)',
                            color: isAdded ? '#64748b' : '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: isAdded ? 'default' : 'pointer',
                          }}
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
            <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-card)', textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setIsQuestionDrawerOpen(false)}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
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
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          onClick={() => setIsAssignDrawerOpen(false)}
        >
          <div
            style={{
              width: '480px',
              maxWidth: '90vw',
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid var(--border-card)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Giao đề thi thử cho lớp
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  {selectedExamToAssign.title} (HSK {selectedExamToAssign.hskLevel})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAssignDrawerOpen(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  Chọn lớp học phụ trách <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {classes.length === 0 ? (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>
                    Bạn chưa có lớp học nào đang hoạt động. Vui lòng tạo lớp học trước.
                  </p>
                ) : (
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
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
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '6px' }}>
                  Hạn nộp bài thi <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="datetime-local"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--border-card)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                  <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  fontSize: '0.85rem',
                  color: '#475569',
                }}
              >
                <p style={{ margin: '0 0 6px 0', fontWeight: 700 }}>Thông số đề thi thử:</p>
                <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li>Thời gian làm bài: <strong>{selectedExamToAssign.timeLimitMinutes} phút</strong></li>
                  <li>Điểm đạt: <strong>{selectedExamToAssign.passingScore}</strong> / {selectedExamToAssign.totalPoints} điểm</li>
                  <li>Số phần thi: <strong>{selectedExamToAssign.sectionCount} phần</strong></li>
                  <li>Số câu hỏi: <strong>{selectedExamToAssign.questionCount} câu</strong></li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-card)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <button
                type="button"
                onClick={() => setIsAssignDrawerOpen(false)}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid var(--border-card)',
                  padding: '9px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>

              <button
                type="button"
                disabled={isAssigning || classes.length === 0}
                onClick={handleAssign}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: isAssigning ? 'not-allowed' : 'pointer',
                  opacity: isAssigning ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Send size={16} />
                Xác nhận giao bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
