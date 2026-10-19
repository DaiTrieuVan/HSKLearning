import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Eye,
  Edit3,
  CalendarPlus,
  RotateCcw,
  RefreshCw,
  Award,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Calendar,
  SlidersHorizontal,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getAssignmentSubmissionsOverview,
  getSubmissionResultById,
  adjustSubmissionScore,
  grantStudentExtension,
  grantStudentRetake,
  type AssignmentSubmissionsOverviewData,
  type StudentSubmissionSummary,
  type SubmissionResultData,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'

type FilterTab = 'ALL' | 'SUBMITTED' | 'IN_PROGRESS' | 'NOT_STARTED' | 'ADJUSTED' | 'OVERRIDDEN'
type SortOption = 'SUBMITTED_DESC' | 'SUBMITTED_ASC' | 'SCORE_DESC' | 'SCORE_ASC' | 'NAME_ASC'

export const AssignmentSubmissionsPage: React.FC = () => {
  const { classId, assignmentId } = useParams<{ classId: string; assignmentId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [data, setData] = useState<AssignmentSubmissionsOverviewData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
  const [sortBy, setSortBy] = useState<SortOption>('SUBMITTED_DESC')

  // Selected Student for Detail view (Split Screen)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [detailLoading, setDetailLoading] = useState<boolean>(false)
  const [studentDetails, setStudentDetails] = useState<Record<number, SubmissionResultData>>({})
  const [detailError, setDetailError] = useState<string | null>(null)

  // Sub-action panel inside Detail View: 'VIEW' | 'ADJUST' | 'EXTEND' | 'RETAKE'
  const [activeActionTab, setActiveActionTab] = useState<'VIEW' | 'ADJUST' | 'EXTEND' | 'RETAKE'>('VIEW')

  // Form states for Adjust Score
  const [adjustScoreVal, setAdjustScoreVal] = useState<string>('')
  const [adjustReasonVal, setAdjustReasonVal] = useState<string>('')
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false)
  const [adjustError, setAdjustError] = useState<string | null>(null)
  const [adjustSuccess, setAdjustSuccess] = useState<string | null>(null)

  // Form states for Extension
  const [extensionDueTime, setExtensionDueTime] = useState<string>('')
  const [extensionReason, setExtensionReason] = useState<string>('')
  const [extensionSubmitting, setExtensionSubmitting] = useState<boolean>(false)
  const [extensionError, setExtensionError] = useState<string | null>(null)
  const [extensionSuccess, setExtensionSuccess] = useState<string | null>(null)

  // Form states for Retake
  const [retakeAttempts, setRetakeAttempts] = useState<number>(2)
  const [retakeReason, setRetakeReason] = useState<string>('')
  const [retakeSubmitting, setRetakeSubmitting] = useState<boolean>(false)
  const [retakeError, setRetakeError] = useState<string | null>(null)
  const [retakeSuccess, setRetakeSuccess] = useState<string | null>(null)

  // Load Overview Data
  const loadOverview = async () => {
    if (!assignmentId || !user?.token) return
    try {
      setLoading(true)
      setError(null)
      const res = await getAssignmentSubmissionsOverview(Number(assignmentId), user.token)
      setData(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải dữ liệu danh sách bài nộp của lớp.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOverview()
  }, [assignmentId, user?.token])

  // Khi chọn một học sinh để xem bài làm
  const handleSelectStudent = async (student: StudentSubmissionSummary, defaultTab: 'VIEW' | 'ADJUST' | 'EXTEND' | 'RETAKE' = 'VIEW') => {
    setSelectedStudentId(student.studentId)
    setActiveActionTab(defaultTab)
    setAdjustError(null)
    setAdjustSuccess(null)
    setExtensionError(null)
    setExtensionSuccess(null)
    setRetakeError(null)
    setRetakeSuccess(null)

    // Khởi tạo form values
    if (student.adjustedScore !== undefined && student.adjustedScore !== null) {
      setAdjustScoreVal(student.adjustedScore.toString())
    } else if (student.score !== undefined && student.score !== null) {
      setAdjustScoreVal(student.score.toString())
    } else {
      setAdjustScoreVal('')
    }
    setAdjustReasonVal(student.adjustReason || '')

    if (student.extendedDueTime) {
      const dt = new Date(student.extendedDueTime)
      dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
      setExtensionDueTime(dt.toISOString().slice(0, 16))
    } else if (data?.dueTime) {
      const dt = new Date(data.dueTime)
      dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset())
      setExtensionDueTime(dt.toISOString().slice(0, 16))
    } else {
      setExtensionDueTime('')
    }
    setExtensionReason('')

    setRetakeAttempts(Math.max(2, (student.allowedAttempts || 1) + 1))
    setRetakeReason('')

    // Load bài làm nếu có submissionId
    if (student.submissionId) {
      if (!studentDetails[student.submissionId]) {
        try {
          setDetailLoading(true)
          setDetailError(null)
          const detail = await getSubmissionResultById(student.submissionId, user!.token)
          setStudentDetails((prev) => ({ ...prev, [student.submissionId!]: detail }))
        } catch (err) {
          setDetailError(err instanceof ApiError ? err.message : 'Không thể tải chi tiết bài làm của học sinh này.')
        } finally {
          setDetailLoading(false)
        }
      }
    }
  }

  // Lọc và Sắp xếp danh sách học sinh
  const filteredStudents = useMemo(() => {
    if (!data?.students) return []
    let list = [...data.students]

    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (st) =>
          st.studentName.toLowerCase().includes(q) ||
          st.studentEmail.toLowerCase().includes(q)
      )
    }

    // 2. Filter Tab
    switch (activeTab) {
      case 'SUBMITTED':
        list = list.filter((st) => st.status === 'SUBMITTED' || st.status === 'AUTO_SUBMITTED')
        break
      case 'IN_PROGRESS':
        list = list.filter((st) => st.status === 'IN_PROGRESS')
        break
      case 'NOT_STARTED':
        list = list.filter((st) => st.status === 'NOT_STARTED')
        break
      case 'ADJUSTED':
        list = list.filter((st) => st.adjustedScore !== undefined && st.adjustedScore !== null)
        break
      case 'OVERRIDDEN':
        list = list.filter((st) => !!st.extendedDueTime || (st.allowedAttempts && st.allowedAttempts > 1))
        break
      case 'ALL':
      default:
        break
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === 'SUBMITTED_DESC') {
        const tA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
        const tB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
        return tB - tA
      }
      if (sortBy === 'SUBMITTED_ASC') {
        const tA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
        const tB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
        return tA - tB
      }
      if (sortBy === 'SCORE_DESC') {
        const sA = a.adjustedScore ?? a.score ?? -1
        const sB = b.adjustedScore ?? b.score ?? -1
        return sB - sA
      }
      if (sortBy === 'SCORE_ASC') {
        const sA = a.adjustedScore ?? a.score ?? 999
        const sB = b.adjustedScore ?? b.score ?? 999
        return sA - sB
      }
      if (sortBy === 'NAME_ASC') {
        return a.studentName.localeCompare(b.studentName, 'vi')
      }
      return 0
    })

    return list
  }, [data?.students, searchQuery, activeTab, sortBy])

  // Navigation giữa các học sinh
  const currentIndex = filteredStudents.findIndex((st) => st.studentId === selectedStudentId)
  const selectedStudent = currentIndex >= 0 ? filteredStudents[currentIndex] : null

  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      handleSelectStudent(filteredStudents[currentIndex - 1], activeActionTab)
    }
  }

  const handleNextStudent = () => {
    if (currentIndex < filteredStudents.length - 1) {
      handleSelectStudent(filteredStudents[currentIndex + 1], activeActionTab)
    }
  }

  // Thao tác Sửa điểm (HTT-06-CN-007)
  const handleSubmitAdjustScore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent?.submissionId || !user?.token) return
    const scoreNum = parseFloat(adjustScoreVal)
    if (isNaN(scoreNum) || scoreNum < 0 || (data?.totalPoints && scoreNum > data.totalPoints)) {
      setAdjustError(`Điểm điều chỉnh phải là số từ 0 đến ${data?.totalPoints || 10}`)
      return
    }
    if (!adjustReasonVal.trim()) {
      setAdjustError('Vui lòng nhập lý do điều chỉnh điểm')
      return
    }

    try {
      setAdjustSubmitting(true)
      setAdjustError(null)
      const updated = await adjustSubmissionScore(
        selectedStudent.submissionId,
        { adjustedScore: scoreNum, reason: adjustReasonVal.trim() },
        user.token
      )
      setAdjustSuccess('Đã cập nhật điểm thành công!')
      setStudentDetails((prev) => ({ ...prev, [selectedStudent.submissionId!]: updated }))

      // Cập nhật lại list tóm tắt
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          students: prev.students.map((st) =>
            st.studentId === selectedStudent.studentId
              ? { ...st, adjustedScore: scoreNum, adjustReason: adjustReasonVal.trim(), effectiveScore: scoreNum }
              : st
          ),
        }
      })
    } catch (err) {
      setAdjustError(err instanceof ApiError ? err.message : 'Không thể điều chỉnh điểm.')
    } finally {
      setAdjustSubmitting(false)
    }
  }

  // Thao tác Gia hạn (HTT-06-CN-008)
  const handleSubmitExtension = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignmentId || !selectedStudent || !user?.token) return
    if (!extensionDueTime) {
      setExtensionError('Vui lòng chọn thời gian gia hạn mới')
      return
    }

    try {
      setExtensionSubmitting(true)
      setExtensionError(null)
      const isoTime = new Date(extensionDueTime).toISOString()
      const res = await grantStudentExtension(
        Number(assignmentId),
        selectedStudent.studentId,
        { extendedDueTime: isoTime, reason: extensionReason.trim() || undefined },
        user.token
      )
      setExtensionSuccess('Đã cấp quyền gia hạn nộp bài thành công!')
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          students: prev.students.map((st) =>
            st.studentId === selectedStudent.studentId
              ? { ...st, extendedDueTime: res.extendedDueTime }
              : st
          ),
        }
      })
    } catch (err) {
      setExtensionError(err instanceof ApiError ? err.message : 'Không thể gia hạn nộp bài.')
    } finally {
      setExtensionSubmitting(false)
    }
  }

  // Thao tác Cho làm lại (HTT-06-CN-008)
  const handleSubmitRetake = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignmentId || !selectedStudent || !user?.token) return
    if (retakeAttempts < 1) {
      setRetakeError('Số lượt làm bài tối đa phải lớn hơn 0')
      return
    }

    try {
      setRetakeSubmitting(true)
      setRetakeError(null)
      const res = await grantStudentRetake(
        Number(assignmentId),
        selectedStudent.studentId,
        { allowedAttempts: retakeAttempts, reason: retakeReason.trim() || undefined },
        user.token
      )
      setRetakeSuccess(`Đã cấp quyền làm lại bài (Tối đa ${res.allowedAttempts} lượt)!`)
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          students: prev.students.map((st) =>
            st.studentId === selectedStudent.studentId
              ? { ...st, allowedAttempts: res.allowedAttempts }
              : st
          ),
        }
      })
    } catch (err) {
      setRetakeError(err instanceof ApiError ? err.message : 'Không thể cấp quyền làm lại.')
    } finally {
      setRetakeSubmitting(false)
    }
  }

  // Thống kê tính toán
  const avgScore = useMemo(() => {
    if (!data?.students) return 0
    const scored = data.students.filter((st) => st.effectiveScore !== undefined && st.effectiveScore !== null)
    if (scored.length === 0) return 0
    const sum = scored.reduce((acc, st) => acc + (st.effectiveScore || 0), 0)
    return Math.round((sum / scored.length) * 10) / 10
  }, [data?.students])

  const adjustedCount = useMemo(() => {
    return data?.students?.filter((st) => st.adjustedScore !== undefined && st.adjustedScore !== null).length || 0
  }, [data?.students])

  const overriddenCount = useMemo(() => {
    return data?.students?.filter((st) => !!st.extendedDueTime || (st.allowedAttempts && st.allowedAttempts > 1)).length || 0
  }, [data?.students])

  if (loading && !data) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px 0' }}>
          <RefreshCw size={24} className="animate-spin" color="var(--primary)" />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Đang tải dữ liệu bài nộp của lớp học...
          </span>
        </div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div style={{ maxWidth: '720px', margin: '60px auto', padding: '0 20px' }}>
        <div className="game-card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#ffffff' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444', marginBottom: '8px' }}>
            Không thể tải dữ liệu bài nộp
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
              className="btn btn-secondary"
            >
              Quay lại lớp học
            </button>
            <button type="button" onClick={() => loadOverview()} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 28px', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* 1. TOP BREADCRUMB & HEADER */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate(classId ? `/classes/${classId}` : '/classes')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.88rem',
            fontWeight: 800,
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại trang chi tiết lớp học</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {data?.assignmentTitle || 'Quản lý nộp bài & Chấm điểm'}
              </h1>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: data?.status === 'OPEN' ? '#ecfdf5' : '#f1f5f9',
                  color: data?.status === 'OPEN' ? '#047857' : '#475569',
                }}
              >
                {data?.status === 'OPEN' ? 'ĐANG MỞ LÀM BÀI' : 'ĐÃ ĐÓNG / HẾT HẠN'}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              {data?.dueTime && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} color="#f59e0b" />
                  Hạn nộp chung: <strong>{new Date(data.dueTime).toLocaleString('vi-VN')}</strong>
                </span>
              )}
              <span>
                Thang điểm tổng: <strong style={{ color: 'var(--primary)' }}>{data?.totalPoints} điểm</strong>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => loadOverview()}
              disabled={loading}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Làm mới dữ liệu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Sĩ số lớp */}
        <div className="game-card" style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#2563eb" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Sĩ số lớp</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>
            {data?.totalStudents || 0} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>học sinh</span>
          </div>
        </div>

        {/* Đã nộp bài */}
        <div className="game-card" style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} color="#059669" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Đã nộp bài</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857' }}>
            {data?.submittedCount || 0}
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '8px' }}>
              ({data?.totalStudents ? Math.round(((data.submittedCount || 0) / data.totalStudents) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Đang làm bài */}
        <div className="game-card" style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#d97706" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Đang làm bài</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#b45309' }}>
            {data?.inProgressCount || 0} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>học sinh</span>
          </div>
        </div>

        {/* Chưa nộp */}
        <div className="game-card" style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} color="#94a3b8" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Chưa nộp</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#64748b' }}>
            {data?.notStartedCount || 0} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>học sinh</span>
          </div>
        </div>

        {/* Điểm trung bình */}
        <div className="game-card" style={{ padding: '16px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="#7c3aed" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Điểm TB cả lớp</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7c3aed' }}>
            {avgScore} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>/ {data?.totalPoints || 10}</span>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR: SEARCH & TABS */}
      <div
        className="game-card"
        style={{
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Ô tìm kiếm */}
          <div style={{ position: 'relative', minWidth: '300px', flex: 1, maxWidth: '450px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Tìm theo họ tên hoặc email học sinh..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sắp xếp */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="SUBMITTED_DESC">Thời gian nộp (Mới nhất)</option>
              <option value="SUBMITTED_ASC">Thời gian nộp (Cũ nhất)</option>
              <option value="SCORE_DESC">Điểm số (Cao → Thấp)</option>
              <option value="SCORE_ASC">Điểm số (Thấp → Cao)</option>
              <option value="NAME_ASC">Tên học sinh (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
          {[
            { id: 'ALL', label: 'Tất cả', count: data?.students.length || 0 },
            { id: 'SUBMITTED', label: 'Đã nộp bài', count: data?.submittedCount || 0 },
            { id: 'IN_PROGRESS', label: 'Đang làm bài', count: data?.inProgressCount || 0 },
            { id: 'NOT_STARTED', label: 'Chưa làm', count: data?.notStartedCount || 0 },
            { id: 'ADJUSTED', label: 'Đã sửa điểm', count: adjustedCount },
            { id: 'OVERRIDDEN', label: 'Được gia hạn / Làm lại', count: overriddenCount },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as FilterTab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1.5px solid var(--primary)' : '1.5px solid #e2e8f0',
                  backgroundColor: isActive ? 'var(--primary-light)' : '#ffffff',
                  color: isActive ? 'var(--primary-hover)' : 'var(--text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'var(--primary)' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. MASTER-DETAIL WORKSPACE */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative' }}>
        {/* CỘT TRÁI: BẢNG DANH SÁCH HỌC SINH */}
        <div
          style={{
            flex: selectedStudentId ? '0 0 45%' : '1 1 100%',
            maxWidth: selectedStudentId ? '45%' : '100%',
            transition: 'all 0.2s ease',
          }}
        >
          <div className="game-card" style={{ padding: '0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Danh sách học sinh ({filteredStudents.length})
              </span>
              {selectedStudentId && (
                <button
                  type="button"
                  onClick={() => setSelectedStudentId(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Mở rộng toàn màn hình</span>
                </button>
              )}
            </div>

            {filteredStudents.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Không tìm thấy học sinh nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1, borderBottom: '1.5px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569' }}>Học sinh</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Trạng thái</th>
                      <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Lượt / Điểm</th>
                      <th style={{ padding: '12px 16px', fontWeight: 800, color: '#475569', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((st) => {
                      const isSelected = selectedStudentId === st.studentId
                      const hasAdjusted = st.adjustedScore !== undefined && st.adjustedScore !== null
                      const isSubmitted = st.status === 'SUBMITTED' || st.status === 'AUTO_SUBMITTED'
                      const isAuto = st.status === 'AUTO_SUBMITTED'

                      return (
                        <tr
                          key={st.studentId}
                          onClick={() => handleSelectStudent(st, 'VIEW')}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                          }}
                        >
                          {/* Họ tên & Email */}
                          <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  backgroundColor: isSelected ? 'var(--primary)' : '#e2e8f0',
                                  color: isSelected ? '#ffffff' : '#334155',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '0.82rem',
                                  flexShrink: 0,
                                }}
                              >
                                {st.studentName.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {st.studentName}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {st.studentEmail}
                                </div>
                                {(st.extendedDueTime || (st.allowedAttempts && st.allowedAttempts > 1)) && (
                                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                    {st.extendedDueTime && (
                                      <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>
                                        Gia hạn: {new Date(st.extendedDueTime).toLocaleDateString('vi-VN')}
                                      </span>
                                    )}
                                    {st.allowedAttempts && st.allowedAttempts > 1 && (
                                      <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#faf5ff', color: '#7e22ce', fontWeight: 700 }}>
                                        Làm lại ({st.allowedAttempts} lượt)
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Trạng thái */}
                          <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                            {isSubmitted ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  backgroundColor: isAuto ? '#fef3c7' : '#ecfdf5',
                                  color: isAuto ? '#b45309' : '#047857',
                                }}
                              >
                                {isAuto ? <Clock size={11} /> : <Check size={11} />}
                                <span>{isAuto ? 'Tự nộp' : 'Đã nộp'}</span>
                              </span>
                            ) : st.status === 'IN_PROGRESS' ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  backgroundColor: '#fffbeb',
                                  color: '#b45309',
                                }}
                              >
                                <Clock size={11} />
                                <span>Đang làm</span>
                              </span>
                            ) : (
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  backgroundColor: '#f1f5f9',
                                  color: '#64748b',
                                }}
                              >
                                Chưa làm
                              </span>
                            )}
                          </td>

                          {/* Điểm số & Lượt */}
                          <td style={{ padding: '12px 14px', textAlign: 'center', verticalAlign: 'middle' }}>
                            {isSubmitted ? (
                              <div>
                                <div style={{ fontWeight: 900, fontSize: '0.96rem', color: hasAdjusted ? '#b45309' : '#047857' }}>
                                  {hasAdjusted ? st.adjustedScore : st.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {data?.totalPoints}</span>
                                </div>
                                {hasAdjusted && (
                                  <div style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 700 }}>
                                    (Gốc: {st.score})
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                            )}
                          </td>

                          {/* Nút thao tác nhanh */}
                          <td style={{ padding: '12px 16px', textAlign: 'right', verticalAlign: 'middle' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                              {isSubmitted ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectStudent(st, 'VIEW')}
                                    title="Xem chi tiết bài làm"
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: 'var(--radius-sm)',
                                      border: '1px solid #cbd5e1',
                                      backgroundColor: isSelected && activeActionTab === 'VIEW' ? 'var(--primary)' : '#ffffff',
                                      color: isSelected && activeActionTab === 'VIEW' ? '#ffffff' : 'var(--text-main)',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                    }}
                                  >
                                    <Eye size={13} />
                                    <span>Xem bài</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleSelectStudent(st, 'ADJUST')}
                                    title="Sửa điểm số"
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: 'var(--radius-sm)',
                                      border: '1px solid #fde68a',
                                      backgroundColor: isSelected && activeActionTab === 'ADJUST' ? '#d97706' : '#fffbeb',
                                      color: isSelected && activeActionTab === 'ADJUST' ? '#ffffff' : '#b45309',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.76rem',
                                      fontWeight: 700,
                                    }}
                                  >
                                    <Edit3 size={13} />
                                    <span>Sửa điểm</span>
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSelectStudent(st, 'EXTEND')}
                                  title="Gia hạn thời gian nộp bài"
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid #bfdbfe',
                                    backgroundColor: isSelected && activeActionTab === 'EXTEND' ? '#2563eb' : '#eff6ff',
                                    color: isSelected && activeActionTab === 'EXTEND' ? '#ffffff' : '#1d4ed8',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                  }}
                                >
                                  <CalendarPlus size={13} />
                                  <span>Gia hạn</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleSelectStudent(st, 'RETAKE')}
                                title="Cho phép làm lại bài"
                                style={{
                                  padding: '6px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid #e9d5ff',
                                  backgroundColor: isSelected && activeActionTab === 'RETAKE' ? '#7e22ce' : '#faf5ff',
                                  color: isSelected && activeActionTab === 'RETAKE' ? '#ffffff' : '#6b21a8',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                }}
                              >
                                <RotateCcw size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: KHÔNG GIAN CHI TIẾT BÀI LÀM & CHẤM ĐIỂM (SPLIT SCREEN - NO MODAL) */}
        {selectedStudent && (
          <div
            style={{
              flex: '0 0 55%',
              maxWidth: '55%',
              position: 'sticky',
              top: '20px',
              maxHeight: 'calc(100vh - 40px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="game-card"
              style={{
                padding: '24px',
                backgroundColor: '#ffffff',
                border: '2px solid var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100vh - 60px)',
                overflowY: 'auto',
              }}
            >
              {/* Header Panel chi tiết */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      flexShrink: 0,
                    }}
                  >
                    {selectedStudent.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                      {selectedStudent.studentName}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {selectedStudent.studentEmail}
                      {selectedStudent.submittedAt && (
                        <span> • Nộp lúc: {new Date(selectedStudent.submittedAt).toLocaleString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Bộ điều hướng chuyển học sinh tiếp theo */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: 'var(--radius-md)' }}>
                    <button
                      type="button"
                      disabled={currentIndex === 0}
                      onClick={handlePrevStudent}
                      title="Học sinh trước"
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        background: currentIndex === 0 ? 'transparent' : '#ffffff',
                        borderRadius: 'var(--radius-sm)',
                        cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                        color: currentIndex === 0 ? '#94a3b8' : 'var(--text-main)',
                      }}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, padding: '0 6px', color: '#475569' }}>
                      {currentIndex + 1} / {filteredStudents.length}
                    </span>
                    <button
                      type="button"
                      disabled={currentIndex === filteredStudents.length - 1}
                      onClick={handleNextStudent}
                      title="Học sinh tiếp theo"
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        background: currentIndex === filteredStudents.length - 1 ? 'transparent' : '#ffffff',
                        borderRadius: 'var(--radius-sm)',
                        cursor: currentIndex === filteredStudents.length - 1 ? 'not-allowed' : 'pointer',
                        color: currentIndex === filteredStudents.length - 1 ? '#94a3b8' : 'var(--text-main)',
                      }}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStudentId(null)}
                    style={{
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex',
                    }}
                    title="Đóng chi tiết"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Action Tabs bên trong Panel: Xem bài | Sửa điểm | Gia hạn | Cho làm lại */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <button
                  type="button"
                  onClick={() => setActiveActionTab('VIEW')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: activeActionTab === 'VIEW' ? '1.5px solid var(--primary)' : '1.5px solid transparent',
                    backgroundColor: activeActionTab === 'VIEW' ? 'var(--primary-light)' : '#f8fafc',
                    color: activeActionTab === 'VIEW' ? 'var(--primary-hover)' : 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Eye size={14} />
                  <span>Chi tiết bài làm</span>
                </button>

                {selectedStudent.submissionId && (
                  <button
                    type="button"
                    onClick={() => setActiveActionTab('ADJUST')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: activeActionTab === 'ADJUST' ? '1.5px solid #d97706' : '1.5px solid transparent',
                      backgroundColor: activeActionTab === 'ADJUST' ? '#fef3c7' : '#f8fafc',
                      color: activeActionTab === 'ADJUST' ? '#b45309' : 'var(--text-main)',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Edit3 size={14} />
                    <span>Điều chỉnh điểm</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveActionTab('EXTEND')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: activeActionTab === 'EXTEND' ? '1.5px solid #2563eb' : '1.5px solid transparent',
                    backgroundColor: activeActionTab === 'EXTEND' ? '#dbeafe' : '#f8fafc',
                    color: activeActionTab === 'EXTEND' ? '#1d4ed8' : 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CalendarPlus size={14} />
                  <span>Gia hạn nộp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveActionTab('RETAKE')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: activeActionTab === 'RETAKE' ? '1.5px solid #7e22ce' : '1.5px solid transparent',
                    backgroundColor: activeActionTab === 'RETAKE' ? '#f3e8ff' : '#f8fafc',
                    color: activeActionTab === 'RETAKE' ? '#6b21a8' : 'var(--text-main)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RotateCcw size={14} />
                  <span>Cho làm lại</span>
                </button>
              </div>

              {/* NỘI DUNG TAB 1: CHI TIẾT BÀI LÀM */}
              {activeActionTab === 'VIEW' && (
                <div>
                  {selectedStudent.submissionId ? (
                    <div>
                      {/* Banner điểm số */}
                      <div
                        style={{
                          padding: '14px 18px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: selectedStudent.adjustedScore !== undefined && selectedStudent.adjustedScore !== null ? '#fffbeb' : '#ecfdf5',
                          border: `1.5px solid ${selectedStudent.adjustedScore !== undefined && selectedStudent.adjustedScore !== null ? '#fde68a' : '#a7f3d0'}`,
                          marginBottom: '16px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            {selectedStudent.adjustedScore !== undefined && selectedStudent.adjustedScore !== null ? 'Điểm giáo viên đã điều chỉnh' : 'Điểm tự động nộp'}
                          </div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: selectedStudent.adjustedScore !== undefined && selectedStudent.adjustedScore !== null ? '#b45309' : '#047857' }}>
                            {selectedStudent.adjustedScore !== undefined && selectedStudent.adjustedScore !== null ? selectedStudent.adjustedScore : selectedStudent.score} / {data?.totalPoints} điểm
                          </div>
                          {selectedStudent.adjustedScore !== undefined && selectedStudent.adjustedScore !== null && (
                            <div style={{ fontSize: '0.78rem', color: '#92400e', marginTop: '2px' }}>
                              Điểm gốc: {selectedStudent.score}đ • Lý do: "{selectedStudent.adjustReason}"
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveActionTab('ADJUST')}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                        >
                          Sửa điểm này
                        </button>
                      </div>

                      {/* Chi tiết từng câu hỏi */}
                      {detailLoading ? (
                        <div style={{ padding: '30px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                          <div>Đang tải nội dung câu trả lời...</div>
                        </div>
                      ) : detailError ? (
                        <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-md)', color: '#b91c1c' }}>
                          {detailError}
                        </div>
                      ) : studentDetails[selectedStudent.submissionId] ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {studentDetails[selectedStudent.submissionId].questions.map((q, qIdx) => (
                            <div
                              key={q.questionId}
                              style={{
                                padding: '14px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: '#f8fafc',
                                border: `1.5px solid ${q.isCorrect ? '#86efac' : '#fca5a5'}`,
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '10px' }}>
                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                  Câu {qIdx + 1}: {q.content}
                                </div>
                                <span
                                  style={{
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: q.isCorrect ? '#ecfdf5' : '#fef2f2',
                                    color: q.isCorrect ? '#047857' : '#b91c1c',
                                    fontSize: '0.76rem',
                                    fontWeight: 800,
                                    flexShrink: 0,
                                  }}
                                >
                                  {q.pointsEarned} / {q.maxPoints} đ
                                </span>
                              </div>

                              {/* Lựa chọn trắc nghiệm */}
                              {q.options && q.options.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                                  {q.options.map((opt) => {
                                    const isPicked = q.selectedOptionId === opt.id
                                    const isRight = opt.isCorrect
                                    let bg = '#ffffff'
                                    let border = '#e2e8f0'
                                    let text = 'var(--text-main)'

                                    if (isPicked && isRight) {
                                      bg = '#ecfdf5'
                                      border = '#10b981'
                                      text = '#047857'
                                    } else if (isPicked && !isRight) {
                                      bg = '#fef2f2'
                                      border = '#ef4444'
                                      text = '#b91c1c'
                                    } else if (isRight) {
                                      bg = '#f0fdf4'
                                      border = '#86efac'
                                      text = '#15803d'
                                    }

                                    return (
                                      <div
                                        key={opt.id}
                                        style={{
                                          padding: '8px 12px',
                                          borderRadius: 'var(--radius-sm)',
                                          backgroundColor: bg,
                                          border: `1px solid ${border}`,
                                          color: text,
                                          fontSize: '0.84rem',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <span>{opt.content}</span>
                                        <div style={{ display: 'flex', gap: '4px', fontSize: '0.74rem', fontWeight: 800 }}>
                                          {isPicked && <span>[Đã chọn]</span>}
                                          {isRight && <span style={{ color: '#16a34a' }}>[Đáp án đúng]</span>}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}

                              {/* Câu trả lời text: FILL, ORDER, MATCH */}
                              {q.studentTextAnswer && (
                                <div
                                  style={{
                                    padding: '8px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '0.84rem',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Học sinh trả lời: </span>
                                  <strong>{q.studentTextAnswer}</strong>
                                </div>
                              )}

                              {/* Lời giải thích */}
                              {q.explanation && (
                                <div style={{ fontSize: '0.8rem', color: '#1e40af', backgroundColor: '#eff6ff', padding: '6px 10px', borderRadius: '4px', marginTop: '6px' }}>
                                  💡 <strong>Giải thích:</strong> {q.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <AlertCircle size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                      <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-main)', fontSize: '1rem' }}>
                        Học sinh chưa nộp bài
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem' }}>
                        Học sinh này chưa nộp bài tập. Bạn có thể gia hạn hạn nộp hoặc gửi nhắc nhở cho học sinh.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveActionTab('EXTEND')}
                        className="btn btn-primary"
                        style={{ marginTop: '16px', fontSize: '0.84rem' }}
                      >
                        Gia hạn nộp bài cho học sinh này
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* NỘI DUNG TAB 2: ĐIỀU CHỈNH ĐIỂM SỐ */}
              {activeActionTab === 'ADJUST' && (
                <form onSubmit={handleSubmitAdjustScore}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Điều chỉnh điểm bài làm (HTT-06-CN-007)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Giáo viên có thể điều chỉnh điểm gốc do hệ thống chấm tự động kèm theo lý do minh bạch (ví dụ: cộng điểm khuyến khích, chấm bù câu hỏi tự luận,...).
                  </p>

                  {adjustError && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.84rem', marginBottom: '12px' }}>
                      {adjustError}
                    </div>
                  )}

                  {adjustSuccess && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.84rem', marginBottom: '12px' }}>
                      {adjustSuccess}
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Điểm điều chỉnh mới (Thang điểm: 0 - {data?.totalPoints}) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={data?.totalPoints || 10}
                      value={adjustScoreVal}
                      onChange={(e) => setAdjustScoreVal(e.target.value)}
                      placeholder="Ví dụ: 8.5"
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Lý do điều chỉnh điểm <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={adjustReasonVal}
                      onChange={(e) => setAdjustReasonVal(e.target.value)}
                      placeholder="Nhập lý do điều chỉnh để học sinh và nhà trường theo dõi..."
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.86rem',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={adjustSubmitting}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px 16px', fontWeight: 800 }}
                    >
                      {adjustSubmitting ? 'Đang lưu điểm...' : 'Xác nhận lưu điểm mới'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('VIEW')}
                      className="btn btn-secondary"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* NỘI DUNG TAB 3: GIA HẠN THỜI GIAN NỘP BÀI */}
              {activeActionTab === 'EXTEND' && (
                <form onSubmit={handleSubmitExtension}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Gia hạn nộp bài cho học sinh (HTT-06-CN-008)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Cho phép riêng học sinh này nộp bài sau hạn nộp chung của cả lớp (ví dụ: nghỉ ốm có lý do).
                  </p>

                  {extensionError && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.84rem', marginBottom: '12px' }}>
                      {extensionError}
                    </div>
                  )}

                  {extensionSuccess && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.84rem', marginBottom: '12px' }}>
                      {extensionSuccess}
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Hạn nộp bài gia hạn mới <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={extensionDueTime}
                      onChange={(e) => setExtensionDueTime(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Lý do gia hạn (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={extensionReason}
                      onChange={(e) => setExtensionReason(e.target.value)}
                      placeholder="Ví dụ: Xin nghỉ ốm có phép..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={extensionSubmitting}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px 16px', fontWeight: 800 }}
                    >
                      {extensionSubmitting ? 'Đang cập nhật...' : 'Cấp quyền gia hạn'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('VIEW')}
                      className="btn btn-secondary"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* NỘI DUNG TAB 4: CHO PHÉP LÀM LẠI BÀI */}
              {activeActionTab === 'RETAKE' && (
                <form onSubmit={handleSubmitRetake}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Cho phép làm lại bài tập (HTT-06-CN-008)
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Cấp thêm lượt nộp bài mới cho học sinh này để cải thiện điểm số. Hệ thống sẽ ghi nhận điểm cao nhất.
                  </p>

                  {retakeError && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.84rem', marginBottom: '12px' }}>
                      {retakeError}
                    </div>
                  )}

                  {retakeSuccess && (
                    <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.84rem', marginBottom: '12px' }}>
                      {retakeSuccess}
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Số lượt nộp bài tối đa được phép <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={retakeAttempts}
                      onChange={(e) => setRetakeAttempts(parseInt(e.target.value) || 2)}
                      required
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.95rem',
                        fontWeight: 800,
                      }}
                    />
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Học sinh đã dùng {selectedStudent.attemptNumber || 0} lượt. Cấp tối đa {retakeAttempts} lượt cho phép học sinh làm thêm {Math.max(0, retakeAttempts - (selectedStudent.attemptNumber || 0))} lượt nữa.
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Lý do cho phép làm lại (tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={retakeReason}
                      onChange={(e) => setRetakeReason(e.target.value)}
                      placeholder="Ví dụ: Bị sự cố mất mạng khi đang làm bài..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="submit"
                      disabled={retakeSubmitting}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '10px 16px', fontWeight: 800 }}
                    >
                      {retakeSubmitting ? 'Đang cấp quyền...' : 'Xác nhận cho làm lại'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionTab('VIEW')}
                      className="btn btn-secondary"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
