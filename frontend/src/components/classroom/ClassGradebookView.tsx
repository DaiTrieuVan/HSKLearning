import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileSpreadsheet,
  Search,
  Users,
  Award,
  AlertCircle,
  Edit3,
  UserX,
  FileCheck,
  Filter,
  TrendingUp,
} from 'lucide-react'
import type {
  ClassGradebookResponse,
  StudentGradeRowItem,
  AssignmentColumnHeaderItem,
  CellGradeItem,
} from '../../api/progress'
import { GradebookAttemptDrawer } from './GradebookAttemptDrawer'
import { UnsubmittedStudentsDrawer } from './UnsubmittedStudentsDrawer'

interface ClassGradebookViewProps {
  gradebook: ClassGradebookResponse
  classId: number
  onRefresh?: () => void
}

export const ClassGradebookView: React.FC<ClassGradebookViewProps> = ({ gradebook, classId }) => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL')

  // State for Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentGradeRowItem | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentColumnHeaderItem | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<CellGradeItem | null>(null)

  // State for Unsubmitted Drawer (HTT-07-CN-004)
  const [unsubmittedDrawerOpen, setUnsubmittedDrawerOpen] = useState(false)
  const [selectedUnsubmittedAssignment, setSelectedUnsubmittedAssignment] = useState<AssignmentColumnHeaderItem | null>(null)

  const handleCellClick = (
    student: StudentGradeRowItem,
    assignment: AssignmentColumnHeaderItem,
    grade: CellGradeItem
  ) => {
    setSelectedStudent(student)
    setSelectedAssignment(assignment)
    setSelectedGrade(grade)
    setDrawerOpen(true)
  }

  // Filter students
  const filteredStudents = useMemo(() => {
    return gradebook.students.filter((student) => {
      const matchSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && student.isEnrolled) ||
        (statusFilter === 'INACTIVE' && !student.isEnrolled)

      return matchSearch && matchStatus
    })
  }, [gradebook.students, searchTerm, statusFilter])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    } catch {
      return dateStr
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {/* KPI 1: Total Students */}
        <div
          className="game-card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              SĨ SỐ HỌC SINH
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {gradebook.activeStudentsCount}{' '}
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>
                / {gradebook.totalStudents} ghi danh
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Assignments */}
        <div
          className="game-card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <FileCheck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              BÀI TẬP ĐÃ GIAO
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {gradebook.totalAssignments}
            </div>
          </div>
        </div>

        {/* KPI 3: Class Average Score */}
        <div
          className="game-card"
          style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              ĐIỂM TRUNG BÌNH LỚP
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {gradebook.classAverageScore !== null ? (
                <>
                  <span>{gradebook.classAverageScore}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}> / 10</span>
                </>
              ) : (
                <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Chưa có điểm</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: '1 1 300px',
            maxWidth: '420px',
          }}
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-muted)' }}>Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="ALL">Tất cả học sinh ({gradebook.totalStudents})</option>
            <option value="ACTIVE">Đang học ({gradebook.activeStudentsCount})</option>
            <option value="INACTIVE">
              Đã rời lớp ({gradebook.totalStudents - gradebook.activeStudentsCount})
            </option>
          </select>
        </div>
      </div>

      {/* 3. Empty State: No Assignments (TC-05) */}
      {gradebook.totalAssignments === 0 ? (
        <div
          className="game-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <FileSpreadsheet size={54} style={{ color: '#94a3b8', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Lớp học chưa có bài tập nào được giao
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto' }}>
            Khi bạn giao bài tập cho lớp học và học sinh nộp bài, ma trận bảng điểm tự động tổng hợp kết quả sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div
          className="game-card"
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <AlertCircle size={40} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
            Không tìm thấy học sinh phù hợp
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
            Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc trạng thái.
          </p>
        </div>
      ) : (
        /* 4. Gradebook Table Matrix (TC-01, TC-02, TC-03, TC-04, TC-06, TC-09) */
        <div
          className="game-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Matrix Container with 2D Scroll (Horizontal & Vertical) */}
          <div
            style={{
              maxHeight: '680px',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                textAlign: 'left',
                fontSize: '0.86rem',
              }}
            >
              {/* Header Row */}
              <thead>
                <tr>
                  {/* Sticky Top-Left Corner: Student Info */}
                  <th
                    style={{
                      position: 'sticky',
                      top: 0,
                      left: 0,
                      zIndex: 30,
                      backgroundColor: '#f1f5f9',
                      padding: '16px 20px',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      borderBottom: '2px solid #cbd5e1',
                      borderRight: '2px solid #cbd5e1',
                      minWidth: '240px',
                      boxShadow: '2px 2px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    Học sinh ({filteredStudents.length})
                  </th>

                  {/* Sticky Top: Student Average Score Column */}
                  <th
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 20,
                      backgroundColor: '#f1f5f9',
                      padding: '16px 14px',
                      textAlign: 'center',
                      fontWeight: 800,
                      color: '#b45309',
                      borderBottom: '2px solid #cbd5e1',
                      borderRight: '1.5px solid #e2e8f0',
                      minWidth: '100px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Award size={14} />
                      <span>Điểm TB</span>
                    </div>
                  </th>

                  {/* Sticky Top: Submitted Count Column */}
                  <th
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 20,
                      backgroundColor: '#f1f5f9',
                      padding: '16px 12px',
                      textAlign: 'center',
                      fontWeight: 800,
                      color: 'var(--text-muted)',
                      borderBottom: '2px solid #cbd5e1',
                      borderRight: '2px solid #cbd5e1',
                      minWidth: '95px',
                    }}
                  >
                    Đã nộp
                  </th>

                  {/* Sticky Top: Assignment Columns */}
                  {gradebook.assignments.map((assignment, index) => (
                    <th
                      key={assignment.assignmentId}
                      style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 20,
                        backgroundColor: '#f8fafc',
                        padding: '14px 16px',
                        borderBottom: '2px solid #cbd5e1',
                        borderRight: '1px solid #e2e8f0',
                        minWidth: '170px',
                        maxWidth: '220px',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div
                          title={assignment.title}
                          style={{
                            fontWeight: 800,
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          #{index + 1}. {assignment.title}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '0.74rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <span>Thang: {assignment.totalPoints}đ</span>
                          {assignment.dueTime && <span>Hạn: {formatDate(assignment.dueTime)}</span>}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.74rem',
                            paddingTop: '4px',
                            borderTop: '1px dashed #e2e8f0',
                            marginTop: '2px',
                          }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedUnsubmittedAssignment(assignment)
                              setUnsubmittedDrawerOpen(true)
                            }}
                            title="Nhấp để xem danh sách học sinh chưa nộp bài"
                            style={{
                              background: assignment.submittedCount < gradebook.totalStudents ? '#fef2f2' : 'transparent',
                              border: assignment.submittedCount < gradebook.totalStudents ? '1px solid #fecaca' : '1px solid transparent',
                              padding: '1px 5px',
                              margin: 0,
                              cursor: 'pointer',
                              color: assignment.submittedCount < gradebook.totalStudents ? '#dc2626' : '#0369a1',
                              fontWeight: 800,
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            {assignment.submittedCount < gradebook.totalStudents && <UserX size={11} />}
                            <span>Nộp: {assignment.submittedCount}/{gradebook.totalStudents}</span>
                          </button>
                          <span style={{ color: '#b45309', fontWeight: 700 }}>
                            TB: {assignment.assignmentAverageScore !== null ? assignment.assignmentAverageScore : '-'}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredStudents.map((student, sIndex) => {
                  const isEven = sIndex % 2 === 0
                  const rowBg = !student.isEnrolled ? '#fffbeb' : isEven ? '#ffffff' : '#f8fafc'

                  return (
                    <tr
                      key={student.studentId}
                      style={{
                        backgroundColor: rowBg,
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Sticky First Column: Student Info */}
                      <td
                        style={{
                          position: 'sticky',
                          left: 0,
                          zIndex: 10,
                          backgroundColor: rowBg,
                          padding: '12px 20px',
                          borderBottom: '1px solid #e2e8f0',
                          borderRight: '2px solid #cbd5e1',
                          boxShadow: '2px 0 4px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: student.isEnrolled ? '#dbeafe' : '#f1f5f9',
                              color: student.isEnrolled ? '#1d4ed8' : '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.88rem',
                              flexShrink: 0,
                            }}
                          >
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>

                          <div style={{ minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => navigate(`/classes/${classId}/students/${student.studentId}`)}
                                title="Xem tiến độ chi tiết của học sinh này"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'none',
                                  border: 'none',
                                  padding: 0,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  color: student.isEnrolled ? 'var(--text-main)' : '#64748b',
                                  fontSize: '0.88rem',
                                  fontWeight: 800,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#4f46e5'
                                  e.currentTarget.style.textDecoration = 'underline'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = student.isEnrolled ? 'var(--text-main)' : '#64748b'
                                  e.currentTarget.style.textDecoration = 'none'
                                }}
                              >
                                <span>{student.fullName}</span>
                                <TrendingUp size={13} style={{ opacity: 0.6 }} />
                              </button>

                              {/* TC-04: Đánh dấu học sinh đã rời lớp */}
                              {!student.isEnrolled && (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    padding: '2px 6px',
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: '#fee2e2',
                                    color: '#b91c1c',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  <UserX size={11} />
                                  <span>Đã rời lớp</span>
                                </span>
                              )}
                            </div>

                            <div
                              style={{
                                fontSize: '0.76rem',
                                color: 'var(--text-muted)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student Average Score */}
                      <td
                        style={{
                          padding: '12px 14px',
                          textAlign: 'center',
                          borderBottom: '1px solid #e2e8f0',
                          borderRight: '1.5px solid #e2e8f0',
                          fontWeight: 800,
                          fontSize: '0.94rem',
                          color: student.studentAverageScore !== null ? '#b45309' : '#94a3b8',
                        }}
                      >
                        {student.studentAverageScore !== null ? student.studentAverageScore : '-'}
                      </td>

                      {/* Submitted Assignments Count */}
                      <td
                        style={{
                          padding: '12px 12px',
                          textAlign: 'center',
                          borderBottom: '1px solid #e2e8f0',
                          borderRight: '2px solid #cbd5e1',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: student.submittedAssignmentsCount > 0 ? '#0f766e' : '#94a3b8',
                        }}
                      >
                        {student.submittedAssignmentsCount} / {gradebook.totalAssignments}
                      </td>

                      {/* Assignment Cells */}
                      {gradebook.assignments.map((assignment) => {
                        const cell = student.grades.find((g) => g.assignmentId === assignment.assignmentId)

                        if (!cell || !cell.hasSubmitted) {
                          // TC-02: Ô chưa nộp hiển thị rõ "Chưa nộp", điểm để trống, phân biệt rõ với 0 điểm
                          const isInProgress = cell?.status === 'IN_PROGRESS'

                          return (
                            <td
                              key={assignment.assignmentId}
                              onClick={() => cell && handleCellClick(student, assignment, cell)}
                              style={{
                                padding: '10px 14px',
                                borderBottom: '1px solid #e2e8f0',
                                borderRight: '1px solid #e2e8f0',
                                textAlign: 'center',
                                cursor: cell ? 'pointer' : 'default',
                              }}
                            >
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '4px 8px',
                                  borderRadius: 'var(--radius-sm)',
                                  backgroundColor: isInProgress ? '#fef3c7' : '#f1f5f9',
                                  color: isInProgress ? '#92400e' : '#64748b',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                }}
                              >
                                {isInProgress ? 'Đang làm' : 'Chưa nộp'}
                              </span>
                            </td>
                          )
                        }

                        // Cell with score (submitted)
                        const score = cell.bestScore !== null ? cell.bestScore : 0
                        const isZeroScore = score === 0

                        let badgeBg = '#f0fdf4'
                        let badgeBorder = '#bbf7d0'
                        let badgeColor = '#15803d'

                        if (isZeroScore) {
                          // TC-02: Phân biệt rõ bài nộp được 0 điểm
                          badgeBg = '#fef2f2'
                          badgeBorder = '#fecaca'
                          badgeColor = '#dc2626'
                        } else if (cell.scorePercentage !== null && cell.scorePercentage < 50) {
                          badgeBg = '#fff7ed'
                          badgeBorder = '#fed7aa'
                          badgeColor = '#c2410c'
                        }

                        return (
                          <td
                            key={assignment.assignmentId}
                            onClick={() => handleCellClick(student, assignment, cell)}
                            style={{
                              padding: '10px 14px',
                              borderBottom: '1px solid #e2e8f0',
                              borderRight: '1px solid #e2e8f0',
                              textAlign: 'center',
                              cursor: 'pointer',
                              position: 'relative',
                            }}
                          >
                            <div
                              style={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: badgeBg,
                                border: `1.5px solid ${badgeBorder}`,
                                minWidth: '58px',
                                transition: 'transform 0.1s ease',
                              }}
                            >
                              <strong
                                style={{
                                  fontSize: '0.94rem',
                                  fontWeight: 900,
                                  color: badgeColor,
                                }}
                              >
                                {score}
                              </strong>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                {/* TC-03: Đánh dấu bài đã được giáo viên điều chỉnh điểm */}
                                {cell.isAdjusted && (
                                  <span
                                    title="Điểm đã được giáo viên điều chỉnh"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      color: '#d97706',
                                    }}
                                  >
                                    <Edit3 size={11} />
                                  </span>
                                )}

                                {cell.totalAttempts > 1 && (
                                  <span
                                    style={{
                                      fontSize: '0.7rem',
                                      color: '#64748b',
                                      fontWeight: 700,
                                    }}
                                  >
                                    ({cell.totalAttempts}L)
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>

              {/* Table Footer: Class Assignment Averages */}
              <tfoot>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <td
                    style={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 10,
                      backgroundColor: '#f1f5f9',
                      padding: '14px 20px',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      borderTop: '2px solid #cbd5e1',
                      borderRight: '2px solid #cbd5e1',
                    }}
                  >
                    Điểm trung bình bài tập
                  </td>

                  <td
                    style={{
                      padding: '14px',
                      textAlign: 'center',
                      fontWeight: 900,
                      fontSize: '1rem',
                      color: '#b45309',
                      borderTop: '2px solid #cbd5e1',
                      borderRight: '1.5px solid #e2e8f0',
                      backgroundColor: '#fef3c7',
                    }}
                  >
                    {gradebook.classAverageScore !== null ? gradebook.classAverageScore : '-'}
                  </td>

                  <td
                    style={{
                      borderTop: '2px solid #cbd5e1',
                      borderRight: '2px solid #cbd5e1',
                    }}
                  />

                  {gradebook.assignments.map((assignment) => (
                    <td
                      key={assignment.assignmentId}
                      style={{
                        padding: '14px',
                        textAlign: 'center',
                        fontWeight: 900,
                        fontSize: '0.94rem',
                        color: assignment.assignmentAverageScore !== null ? '#1e40af' : '#94a3b8',
                        borderTop: '2px solid #cbd5e1',
                        borderRight: '1px solid #e2e8f0',
                      }}
                    >
                      {assignment.assignmentAverageScore !== null ? (
                        <>
                          <span>{assignment.assignmentAverageScore}</span>
                          <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                            {' '}
                            / {assignment.totalPoints}
                          </span>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Table Legend */}
          <div
            style={{
              padding: '14px 20px',
              backgroundColor: '#f8fafc',
              borderTop: '1px solid var(--border-card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                  }}
                />
                <span>Đã nộp (Điểm cao nhất theo QTN-13)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                  }}
                />
                <span>0.0 điểm (Đã nộp nhưng không đạt)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                  }}
                />
                <span>Chưa nộp bài</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={13} style={{ color: '#d97706' }} />
                <span>Điểm đã qua điều chỉnh</span>
              </div>
            </div>

            <div style={{ fontStyle: 'italic' }}>
              * Bấm vào bất kỳ ô điểm nào để xem chi tiết các lượt làm bài
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Drawer for attempt details (NO MODALS) */}
      <GradebookAttemptDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classId={classId}
        student={selectedStudent}
        assignment={selectedAssignment}
        grade={selectedGrade}
      />

      {/* Slide-over Drawer for unsubmitted students (HTT-07-CN-004) */}
      <UnsubmittedStudentsDrawer
        isOpen={unsubmittedDrawerOpen}
        onClose={() => setUnsubmittedDrawerOpen(false)}
        assignmentId={selectedUnsubmittedAssignment?.assignmentId ?? null}
        assignmentTitle={selectedUnsubmittedAssignment?.title}
        classId={classId}
      />
    </div>
  )
}
