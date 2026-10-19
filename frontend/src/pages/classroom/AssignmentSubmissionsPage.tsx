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
  X,
  Check,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getAssignmentSubmissionsOverview,
  adjustSubmissionScore,
  grantStudentExtension,
  grantStudentRetake,
  type AssignmentSubmissionsOverviewData,
  type StudentSubmissionSummary,
} from '../../api/assignment'
import { ApiError } from '../../api/auth'

type FilterTab = 'ALL' | 'SUBMITTED' | 'IN_PROGRESS' | 'NOT_STARTED' | 'ADJUSTED' | 'OVERRIDDEN'
type SortOption = 'SUBMITTED_DESC' | 'SUBMITTED_ASC' | 'SCORE_DESC' | 'SCORE_ASC' | 'NAME_ASC'
type InlineAction = 'NONE' | 'ADJUST' | 'EXTEND' | 'RETAKE'

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

  // Inline Quick Actions per row
  const [activeRowStudentId, setActiveRowStudentId] = useState<number | null>(null)
  const [activeRowAction, setActiveRowAction] = useState<InlineAction>('NONE')

  // Form states for Adjust Score
  const [adjustScoreVal, setAdjustScoreVal] = useState<string>('')
  const [adjustReasonVal, setAdjustReasonVal] = useState<string>('')
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false)
  const [adjustError, setAdjustError] = useState<string | null>(null)

  // Form states for Extension
  const [extensionDueTime, setExtensionDueTime] = useState<string>('')
  const [extensionReason, setExtensionReason] = useState<string>('')
  const [extensionSubmitting, setExtensionSubmitting] = useState<boolean>(false)
  const [extensionError, setExtensionError] = useState<string | null>(null)

  // Form states for Retake
  const [retakeAttempts, setRetakeAttempts] = useState<number>(2)
  const [retakeReason, setRetakeReason] = useState<string>('')
  const [retakeSubmitting, setRetakeSubmitting] = useState<boolean>(false)
  const [retakeError, setRetakeError] = useState<string | null>(null)

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

  // Điều hướng xem bài làm toàn màn hình sang trang Dedicated Detail
  const handleViewSubmission = (submissionId: number) => {
    navigate(`/classes/${classId}/assignments/${assignmentId}/submissions/${submissionId}`)
  }

  // Mở action inline trên từng dòng
  const handleToggleRowAction = (student: StudentSubmissionSummary, action: InlineAction) => {
    if (activeRowStudentId === student.studentId && activeRowAction === action) {
      setActiveRowStudentId(null)
      setActiveRowAction('NONE')
      return
    }

    setActiveRowStudentId(student.studentId)
    setActiveRowAction(action)
    setAdjustError(null)
    setExtensionError(null)
    setRetakeError(null)

    if (action === 'ADJUST') {
      setAdjustScoreVal(
        student.adjustedScore !== undefined && student.adjustedScore !== null
          ? student.adjustedScore.toString()
          : (student.score || '').toString()
      )
      setAdjustReasonVal(student.adjustReason || '')
    } else if (action === 'EXTEND') {
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
    } else if (action === 'RETAKE') {
      setRetakeAttempts(Math.max(2, (student.allowedAttempts || 1) + 1))
      setRetakeReason('')
    }
  }

  // Xử lý submit Điều chỉnh điểm
  const handleSubmitAdjustScore = async (student: StudentSubmissionSummary) => {
    if (!student.submissionId || !user?.token) return
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
      await adjustSubmissionScore(
        student.submissionId,
        { adjustedScore: scoreNum, reason: adjustReasonVal.trim() },
        user.token
      )
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          students: prev.students.map((st) =>
            st.studentId === student.studentId
              ? { ...st, adjustedScore: scoreNum, adjustReason: adjustReasonVal.trim(), effectiveScore: scoreNum }
              : st
          ),
        }
      })
      setActiveRowStudentId(null)
      setActiveRowAction('NONE')
    } catch (err) {
      setAdjustError(err instanceof ApiError ? err.message : 'Không thể điều chỉnh điểm.')
    } finally {
      setAdjustSubmitting(false)
    }
  }

  // Xử lý submit Gia hạn
  const handleSubmitExtension = async (student: StudentSubmissionSummary) => {
    if (!assignmentId || !user?.token) return
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
        student.studentId,
        { extendedDueTime: isoTime, reason: extensionReason.trim() || undefined },
        user.token
      )
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          students: prev.students.map((st) =>
            st.studentId === student.studentId
              ? { ...st, extendedDueTime: res.extendedDueTime }
              : st
          ),
        }
      })
      setActiveRowStudentId(null)
      setActiveRowAction('NONE')
    } catch (err) {
      setExtensionError(err instanceof ApiError ? err.message : 'Không thể gia hạn nộp bài.')
    } finally {
      setExtensionSubmitting(false)
    }
  }

  // Xử lý submit Cho làm lại
  const handleSubmitRetake = async (student: StudentSubmissionSummary) => {
    if (!assignmentId || !user?.token) return
    if (retakeAttempts < 1) {
      setRetakeError('Số lượt làm bài tối đa phải lớn hơn 0')
      return
    }

    try {
      setRetakeSubmitting(true)
      setRetakeError(null)
      const res = await grantStudentRetake(
        Number(assignmentId),
        student.studentId,
        { allowedAttempts: retakeAttempts, reason: retakeReason.trim() || undefined },
        user.token
      )
      setData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          students: prev.students.map((st) =>
            st.studentId === student.studentId
              ? { ...st, allowedAttempts: res.allowedAttempts }
              : st
          ),
        }
      })
      setActiveRowStudentId(null)
      setActiveRowAction('NONE')
    } catch (err) {
      setRetakeError(err instanceof ApiError ? err.message : 'Không thể cấp quyền làm lại.')
    } finally {
      setRetakeSubmitting(false)
    }
  }

  if (loading && !data) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px 0' }}>
          <RefreshCw size={24} className="animate-spin" color="var(--primary)" />
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Đang tải danh sách bài nộp của lớp học...
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
          <div style={{ position: 'relative', minWidth: '320px', flex: 1, maxWidth: '500px' }}>
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

      {/* 4. FULL-WIDTH DATA TABLE FOR ENTIRE CLASS (TOÀN MÀN HÌNH RỘNG RÃI) */}
      <div className="game-card" style={{ padding: '0', backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Danh sách học sinh trong lớp ({filteredStudents.length})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Nhấp <strong>"Xem bài"</strong> để mở trang chấm bài và xem toàn bộ lời giải chi tiết
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '14px 20px', fontWeight: 800, color: '#475569' }}>Học sinh</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Lượt nộp</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Thời gian nộp bài</th>
                  <th style={{ padding: '14px 16px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Điểm số</th>
                  <th style={{ padding: '14px 20px', fontWeight: 800, color: '#475569', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => {
                  const hasAdjusted = st.adjustedScore !== undefined && st.adjustedScore !== null
                  const isSubmitted = st.status === 'SUBMITTED' || st.status === 'AUTO_SUBMITTED'
                  const isAuto = st.status === 'AUTO_SUBMITTED'
                  const isRowActive = activeRowStudentId === st.studentId

                  return (
                    <React.Fragment key={st.studentId}>
                      <tr
                        style={{
                          borderBottom: isRowActive ? 'none' : '1px solid #f1f5f9',
                          backgroundColor: isRowActive ? '#f8fafc' : 'transparent',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        {/* Học sinh: Avatar & Tên & Email */}
                        <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                flexShrink: 0,
                              }}
                            >
                              {st.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                                {st.studentName}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {st.studentEmail}
                              </div>
                              {(st.extendedDueTime || (st.allowedAttempts && st.allowedAttempts > 1)) && (
                                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                                  {st.extendedDueTime && (
                                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>
                                      Gia hạn đến: {new Date(st.extendedDueTime).toLocaleString('vi-VN')}
                                    </span>
                                  )}
                                  {st.allowedAttempts && st.allowedAttempts > 1 && (
                                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#faf5ff', color: '#7e22ce', fontWeight: 700 }}>
                                      Làm lại ({st.allowedAttempts} lượt)
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                          {isSubmitted ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                backgroundColor: isAuto ? '#fef3c7' : '#ecfdf5',
                                color: isAuto ? '#b45309' : '#047857',
                              }}
                            >
                              {isAuto ? <Clock size={12} /> : <Check size={12} />}
                              <span>{isAuto ? 'Tự nộp (Hết giờ)' : 'Đã nộp bài'}</span>
                            </span>
                          ) : st.status === 'IN_PROGRESS' ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                backgroundColor: '#fffbeb',
                                color: '#b45309',
                              }}
                            >
                              <Clock size={12} />
                              <span>Đang làm bài</span>
                            </span>
                          ) : (
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                backgroundColor: '#f1f5f9',
                                color: '#64748b',
                              }}
                            >
                              Chưa làm
                            </span>
                          )}
                        </td>

                        {/* Lượt nộp */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle', fontWeight: 700 }}>
                          {st.attemptNumber ? `Lần ${st.attemptNumber}` : '—'}
                        </td>

                        {/* Thời gian nộp */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          {st.submittedAt ? new Date(st.submittedAt).toLocaleString('vi-VN') : '—'}
                        </td>

                        {/* Điểm số */}
                        <td style={{ padding: '14px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                          {isSubmitted ? (
                            <div>
                              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: hasAdjusted ? '#b45309' : '#047857' }}>
                                {hasAdjusted ? st.adjustedScore : st.score} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {data?.totalPoints}</span>
                              </div>
                              {hasAdjusted && (
                                <div style={{ fontSize: '0.74rem', color: '#92400e', fontWeight: 700 }}>
                                  (Gốc: {st.score}đ)
                                </div>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>—</span>
                          )}
                        </td>

                        {/* Nút thao tác */}
                        <td style={{ padding: '14px 20px', textAlign: 'right', verticalAlign: 'middle' }}>
                          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                            {/* Nút XEM BÀI: Mở hẳn trang mới */}
                            {st.submissionId && (
                              <button
                                type="button"
                                onClick={() => handleViewSubmission(st.submissionId!)}
                                className="btn btn-primary"
                                style={{
                                  padding: '7px 14px',
                                  fontSize: '0.82rem',
                                  fontWeight: 800,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <Eye size={14} />
                                <span>Xem bài</span>
                              </button>
                            )}

                            {/* Nút SỬA ĐIỂM inline */}
                            {st.submissionId && (
                              <button
                                type="button"
                                onClick={() => handleToggleRowAction(st, 'ADJUST')}
                                style={{
                                  padding: '7px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: '1px solid #fde68a',
                                  backgroundColor: isRowActive && activeRowAction === 'ADJUST' ? '#d97706' : '#fffbeb',
                                  color: isRowActive && activeRowAction === 'ADJUST' ? '#ffffff' : '#b45309',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Edit3 size={13} />
                                <span>Sửa điểm</span>
                                {isRowActive && activeRowAction === 'ADJUST' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            )}

                            {/* Nút GIA HẠN inline */}
                            <button
                              type="button"
                              onClick={() => handleToggleRowAction(st, 'EXTEND')}
                              style={{
                                padding: '7px 12px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid #bfdbfe',
                                backgroundColor: isRowActive && activeRowAction === 'EXTEND' ? '#2563eb' : '#eff6ff',
                                color: isRowActive && activeRowAction === 'EXTEND' ? '#ffffff' : '#1d4ed8',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <CalendarPlus size={13} />
                              <span>Gia hạn</span>
                              {isRowActive && activeRowAction === 'EXTEND' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>

                            {/* Nút CHO LÀM LẠI inline */}
                            <button
                              type="button"
                              onClick={() => handleToggleRowAction(st, 'RETAKE')}
                              style={{
                                padding: '7px 10px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid #e9d5ff',
                                backgroundColor: isRowActive && activeRowAction === 'RETAKE' ? '#7e22ce' : '#faf5ff',
                                color: isRowActive && activeRowAction === 'RETAKE' ? '#ffffff' : '#6b21a8',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              title="Cấp quyền làm lại bài tập"
                            >
                              <RotateCcw size={13} />
                              <span>Làm lại</span>
                              {isRowActive && activeRowAction === 'RETAKE' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* KHỐI FORM INLINE ACCORDION NGAY DƯỚI DÒNG KHI BẤM NÚT THAO TÁC */}
                      {isRowActive && (
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #cbd5e1' }}>
                          <td colSpan={6} style={{ padding: '16px 24px' }}>
                            <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: 'var(--radius-md)', border: '1.5px solid #e2e8f0' }}>
                              {/* Form Sửa điểm */}
                              {activeRowAction === 'ADJUST' && (
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmitAdjustScore(st) }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ fontWeight: 800, color: '#b45309', fontSize: '0.92rem' }}>
                                      Điều chỉnh điểm số cho học sinh {st.studentName}
                                    </div>
                                    <button type="button" onClick={() => setActiveRowStudentId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                      <X size={16} />
                                    </button>
                                  </div>

                                  {adjustError && (
                                    <div style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.82rem', marginBottom: '10px' }}>
                                      {adjustError}
                                    </div>
                                  )}

                                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '12px', alignItems: 'flex-start' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Điểm mới (0 - {data?.totalPoints})</label>
                                      <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max={data?.totalPoints}
                                        value={adjustScoreVal}
                                        onChange={(e) => setAdjustScoreVal(e.target.value)}
                                        required
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', fontWeight: 800 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Lý do điều chỉnh điểm *</label>
                                      <input
                                        type="text"
                                        value={adjustReasonVal}
                                        onChange={(e) => setAdjustReasonVal(e.target.value)}
                                        placeholder="Nhập lý do điều chỉnh..."
                                        required
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1' }}
                                      />
                                    </div>
                                    <div style={{ marginTop: '22px', display: 'flex', gap: '6px' }}>
                                      <button type="submit" disabled={adjustSubmitting} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                                        {adjustSubmitting ? 'Đang lưu...' : 'Lưu điểm'}
                                      </button>
                                      <button type="button" onClick={() => setActiveRowStudentId(null)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>
                                        Hủy
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              )}

                              {/* Form Gia hạn */}
                              {activeRowAction === 'EXTEND' && (
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmitExtension(st) }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.92rem' }}>
                                      Gia hạn hạn nộp bài cho học sinh {st.studentName}
                                    </div>
                                    <button type="button" onClick={() => setActiveRowStudentId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                      <X size={16} />
                                    </button>
                                  </div>

                                  {extensionError && (
                                    <div style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.82rem', marginBottom: '10px' }}>
                                      {extensionError}
                                    </div>
                                  )}

                                  <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr auto', gap: '12px', alignItems: 'flex-start' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Hạn nộp mới *</label>
                                      <input
                                        type="datetime-local"
                                        value={extensionDueTime}
                                        onChange={(e) => setExtensionDueTime(e.target.value)}
                                        required
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', fontWeight: 700 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Lý do gia hạn (tùy chọn)</label>
                                      <input
                                        type="text"
                                        value={extensionReason}
                                        onChange={(e) => setExtensionReason(e.target.value)}
                                        placeholder="Ví dụ: Xin phép nộp muộn do nghỉ ốm..."
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1' }}
                                      />
                                    </div>
                                    <div style={{ marginTop: '22px', display: 'flex', gap: '6px' }}>
                                      <button type="submit" disabled={extensionSubmitting} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                                        {extensionSubmitting ? 'Đang cấp...' : 'Cấp gia hạn'}
                                      </button>
                                      <button type="button" onClick={() => setActiveRowStudentId(null)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>
                                        Hủy
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              )}

                              {/* Form Cho làm lại */}
                              {activeRowAction === 'RETAKE' && (
                                <form onSubmit={(e) => { e.preventDefault(); handleSubmitRetake(st) }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <div style={{ fontWeight: 800, color: '#7e22ce', fontSize: '0.92rem' }}>
                                      Cấp quyền làm lại bài tập cho học sinh {st.studentName}
                                    </div>
                                    <button type="button" onClick={() => setActiveRowStudentId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                      <X size={16} />
                                    </button>
                                  </div>

                                  {retakeError && (
                                    <div style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#b91c1c', fontSize: '0.82rem', marginBottom: '10px' }}>
                                      {retakeError}
                                    </div>
                                  )}

                                  <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: '12px', alignItems: 'flex-start' }}>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Số lượt nộp tối đa *</label>
                                      <input
                                        type="number"
                                        min="2"
                                        max="10"
                                        value={retakeAttempts}
                                        onChange={(e) => setRetakeAttempts(parseInt(e.target.value) || 2)}
                                        required
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1', fontWeight: 800 }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '4px' }}>Lý do cấp quyền làm lại (tùy chọn)</label>
                                      <input
                                        type="text"
                                        value={retakeReason}
                                        onChange={(e) => setRetakeReason(e.target.value)}
                                        placeholder="Ví dụ: Bị sự cố kỹ thuật..."
                                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid #cbd5e1' }}
                                      />
                                    </div>
                                    <div style={{ marginTop: '22px', display: 'flex', gap: '6px' }}>
                                      <button type="submit" disabled={retakeSubmitting} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
                                        {retakeSubmitting ? 'Đang cấp...' : 'Cấp làm lại'}
                                      </button>
                                      <button type="button" onClick={() => setActiveRowStudentId(null)} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>
                                        Hủy
                                      </button>
                                    </div>
                                  </div>
                                </form>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
