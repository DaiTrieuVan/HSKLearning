import React, { useState, useEffect, useMemo } from 'react'
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  RefreshCw,
  AlertCircle,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getAssignmentStatistics,
  type AssignmentStatisticsResponse,
} from '../../api/progress'
import { ApiError } from '../../api/auth'

interface AssignmentStatisticsViewProps {
  assignmentId: number
  onBackToSubmissions?: () => void
}

export const AssignmentStatisticsView: React.FC<AssignmentStatisticsViewProps> = ({
  assignmentId,
  onBackToSubmissions,
}) => {
  const { user } = useAuth()

  const [data, setData] = useState<AssignmentStatisticsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<'WRONG_DESC' | 'WRONG_ASC' | 'INDEX_ASC'>('WRONG_DESC')

  const fetchStatistics = async () => {
    if (!assignmentId || !user?.token) return
    try {
      setLoading(true)
      setError(null)
      const res = await getAssignmentStatistics(user.token, assignmentId)
      setData(res)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải dữ liệu thống kê bài tập.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [assignmentId, user?.token])

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    if (!data?.questionStats) return []
    let list = [...data.questionStats]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((item) => item.content.toLowerCase().includes(q))
    }

    list.sort((a, b) => {
      if (sortOrder === 'WRONG_DESC') {
        if (b.wrongPercentage !== a.wrongPercentage) {
          return b.wrongPercentage - a.wrongPercentage
        }
        return a.sortOrder - b.sortOrder
      }
      if (sortOrder === 'WRONG_ASC') {
        if (a.wrongPercentage !== b.wrongPercentage) {
          return a.wrongPercentage - b.wrongPercentage
        }
        return a.sortOrder - b.sortOrder
      }
      return a.sortOrder - b.sortOrder
    })

    return list
  }, [data?.questionStats, searchQuery, sortOrder])

  if (loading && !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <RefreshCw size={28} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 12px' }} />
        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Đang tính toán thống kê và phân tích phổ điểm...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="game-card"
        style={{
          padding: '24px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '40px auto',
        }}
      >
        <AlertCircle size={36} color="#dc2626" style={{ margin: '0 auto 10px' }} />
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
          Lỗi tải thống kê
        </h4>
        <p style={{ fontSize: '0.88rem', color: '#b91c1c', marginBottom: '16px' }}>{error}</p>
        <button type="button" onClick={fetchStatistics} className="btn btn-primary" style={{ padding: '8px 18px' }}>
          Thử lại
        </button>
      </div>
    )
  }

  // TC-04: Dữ liệu rỗng khi chưa có bài nộp nào
  if (!data?.hasData || data.submittedCount === 0) {
    return (
      <div
        className="game-card"
        style={{
          padding: '48px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'center',
          border: '1px solid var(--border-card)',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '640px',
          margin: '30px auto',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#64748b',
          }}
        >
          <BarChart3 size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '8px' }}>
          Chưa đủ dữ liệu để thống kê
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 auto 20px', maxWidth: '440px' }}>
          Bài tập này hiện chưa có học sinh nào nộp bài. Bảng phân tích điểm trung bình, phân bố phổ điểm và tỷ lệ các câu sai sẽ hiển thị ngay khi có bài nộp đầu tiên.
        </p>
        {onBackToSubmissions && (
          <button
            type="button"
            onClick={onBackToSubmissions}
            className="btn btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.88rem', fontWeight: 700 }}
          >
            Quay lại danh sách bài nộp
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. KPI SUMMARY CARDS (TC-01) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Tỷ lệ nộp bài */}
        <div className="game-card" style={{ padding: '18px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
              }}
            >
              <Users size={20} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Tỷ lệ nộp bài</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>
            {data.submittedCount}/{data.totalStudents}
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '8px' }}>
              ({data.totalStudents > 0 ? Math.round((data.submittedCount / data.totalStudents) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Điểm trung bình */}
        <div className="game-card" style={{ padding: '18px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#faf5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7c3aed',
              }}
            >
              <TrendingUp size={20} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Điểm trung bình</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7c3aed' }}>
            {data.averageScore !== null ? data.averageScore : '-'}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '6px' }}>
              / {data.totalPoints || 10}đ
            </span>
          </div>
        </div>

        {/* Điểm cao nhất */}
        <div className="game-card" style={{ padding: '18px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
              }}
            >
              <CheckCircle2 size={20} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Điểm cao nhất</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#047857' }}>
            {data.maxScore !== null ? data.maxScore : '-'}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '6px' }}>
              điểm
            </span>
          </div>
        </div>

        {/* Điểm thấp nhất */}
        <div className="game-card" style={{ padding: '18px 20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#fff1f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#e11d48',
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Điểm thấp nhất</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#e11d48' }}>
            {data.minScore !== null ? data.minScore : '-'}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '6px' }}>
              điểm
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCORE DISTRIBUTION (TC-01) */}
      <div
        className="game-card"
        style={{
          padding: '22px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={18} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Phân bố phổ điểm cả lớp
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            (Tính theo lượt điểm cao nhất của từng học sinh - QTN-13)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {data.scoreDistribution.map((range) => {
            let barColor = '#3b82f6'
            let badgeBg = '#eff6ff'
            let textColor = '#1d4ed8'

            if (range.rangeKey === 'BELOW_5') {
              barColor = '#ef4444'
              badgeBg = '#fef2f2'
              textColor = '#b91c1c'
            } else if (range.rangeKey === 'FROM_5_TO_6_5') {
              barColor = '#f59e0b'
              badgeBg = '#fffbeb'
              textColor = '#b45309'
            } else if (range.rangeKey === 'FROM_6_5_TO_8') {
              barColor = '#0284c7'
              badgeBg = '#f0f9ff'
              textColor = '#0369a1'
            } else if (range.rangeKey === 'FROM_8_TO_10') {
              barColor = '#10b981'
              badgeBg = '#ecfdf5'
              textColor = '#047857'
            }

            return (
              <div key={range.rangeKey} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{range.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {range.count} học sinh
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: badgeBg,
                        color: textColor,
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        minWidth: '46px',
                        textAlign: 'center',
                      }}
                    >
                      {range.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress track */}
                <div
                  style={{
                    height: '10px',
                    width: '100%',
                    backgroundColor: '#f1f5f9',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${range.percentage}%`,
                      backgroundColor: barColor,
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. QUESTION ERROR RATE MATRIX (TC-02) */}
      <div
        className="game-card"
        style={{
          padding: '22px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                Phân tích tỷ lệ trả lời sai theo từng câu hỏi
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0 26px' }}>
              Hệ thống tự động sắp xếp các câu học sinh làm sai nhiều nhất lên đầu để giáo viên ưu tiên chữa bài.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Search filter */}
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Tìm nội dung câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 10px 6px 30px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-card)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  minWidth: '200px',
                }}
              />
            </div>

            {/* Sort Order Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
              <ArrowUpDown size={14} color="var(--text-muted)" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-card)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: 'var(--text-main)',
                }}
              >
                <option value="WRONG_DESC">Sai nhiều nhất trước</option>
                <option value="WRONG_ASC">Sai ít nhất trước</option>
                <option value="INDEX_ASC">Theo số thứ tự câu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.86rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-muted)', width: '60px' }}>
                  Câu
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-muted)', width: '110px' }}>
                  Loại câu
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-muted)' }}>
                  Nội dung câu hỏi
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center', width: '80px' }}>
                  Điểm
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'center', width: '120px' }}>
                  Đúng / Sai
                </th>
                <th style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--text-muted)', width: '160px' }}>
                  Tỷ lệ làm sai
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((q, idx) => {
                const isHighError = q.wrongPercentage >= 50.0

                return (
                  <tr
                    key={q.questionId}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isHighError ? '#fffafb' : idx % 2 === 0 ? '#ffffff' : '#fcfcfd',
                    }}
                  >
                    {/* Index */}
                    <td style={{ padding: '14px', fontWeight: 800, color: 'var(--text-main)' }}>
                      #{q.sortOrder}
                    </td>

                    {/* Type Badge */}
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                        }}
                      >
                        {q.type}
                      </span>
                    </td>

                    {/* Question Content */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                        {q.content}
                      </div>
                      {isHighError && (
                        <div
                          style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#b91c1c',
                          backgroundColor: '#fef2f2',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <AlertTriangle size={11} />
                          <span>Cần chú ý giải đáp trên lớp</span>
                        </div>
                      )}
                    </td>

                    {/* Points */}
                    <td style={{ padding: '14px', textAlign: 'center', fontWeight: 700, color: 'var(--text-main)' }}>
                      {q.points}đ
                    </td>

                    {/* Correct / Wrong */}
                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ color: '#059669', fontWeight: 800 }}>{q.correctCount}</span>
                        <span style={{ color: '#cbd5e1' }}>/</span>
                        <span style={{ color: '#dc2626', fontWeight: 800 }}>{q.wrongCount}</span>
                      </div>
                    </td>

                    {/* Wrong Percentage & Bar */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              color: isHighError ? '#dc2626' : q.wrongPercentage > 0 ? '#d97706' : '#059669',
                            }}
                          >
                            {q.wrongPercentage}%
                          </span>
                        </div>

                        {/* Bar */}
                        <div
                          style={{
                            height: '6px',
                            width: '100%',
                            backgroundColor: '#f1f5f9',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${q.wrongPercentage}%`,
                              backgroundColor: isHighError ? '#ef4444' : q.wrongPercentage > 0 ? '#f59e0b' : '#10b981',
                              borderRadius: 'var(--radius-full)',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
