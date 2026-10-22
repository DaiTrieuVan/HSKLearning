import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  School,
  BookOpen,
  FileCheck,
  TrendingUp,
  UserPlus,
  FolderPlus,
  Send,
  RefreshCw,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import { getSystemStatistics, type SystemStatisticsResponse } from '../../api/adminStats'

interface AdminSystemStatsPanelProps {
  token: string
}

type PeriodType = 'ALL' | '7D' | '30D'

export const AdminSystemStatsPanel: React.FC<AdminSystemStatsPanelProps> = ({ token }) => {
  const [period, setPeriod] = useState<PeriodType>('ALL')
  const [stats, setStats] = useState<SystemStatisticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (selectedPeriod: PeriodType) => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSystemStatistics(token, selectedPeriod)
      setStats(data)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Không thể tải dữ liệu thống kê hệ thống.')
      }
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchStats(period)
  }, [fetchStats, period])

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0'
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const formatPeriodLabel = (p: PeriodType) => {
    switch (p) {
      case '7D':
        return '7 ngày qua'
      case '30D':
        return '30 ngày qua'
      default:
        return 'Toàn thời gian'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Period Filters */}
      <div
        className="game-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          padding: '20px 24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          border: '1.5px solid var(--border-card)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={20} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
              Thống kê toàn hệ thống
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Theo dõi tình hình tăng trưởng người dùng, lớp học, bài học và lượt nộp bài trên nền tảng
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#f1f5f9',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
              border: '1px solid #e2e8f0',
            }}
          >
            {(['ALL', '7D', '30D'] as PeriodType[]).map((p) => {
              const active = period === p
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'calc(var(--radius-md) - 2px)',
                    border: 'none',
                    backgroundColor: active ? '#ffffff' : 'transparent',
                    color: active ? 'var(--text-main)' : 'var(--text-muted)',
                    fontWeight: active ? 800 : 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {p === 'ALL' ? 'Tất cả' : p === '7D' ? '7 ngày' : '30 ngày'}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => fetchStats(period)}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-card)',
              backgroundColor: '#ffffff',
              color: 'var(--text-muted)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            title="Làm mới số liệu"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            backgroundColor: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#dc2626',
            fontSize: '0.88rem',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchStats(period)}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.82rem',
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats Cards Grid (TC-01, TC-02, TC-03) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1: Users */}
        <div
          className="game-card"
          style={{
            padding: '22px 24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tổng người dùng
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginTop: '4px', lineHeight: 1 }}>
                {loading ? '...' : formatNumber(stats?.totalUsers)}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Users size={22} />
            </div>
          </div>

          {/* Role Breakdown */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={14} style={{ color: '#059669' }} /> Học sinh:
              </span>
              <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                {loading ? '...' : formatNumber(stats?.totalStudents)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={14} style={{ color: '#d97706' }} /> Giáo viên:
              </span>
              <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                {loading ? '...' : formatNumber(stats?.totalTeachers)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} style={{ color: '#dc2626' }} /> Quản trị viên:
              </span>
              <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                {loading ? '...' : formatNumber(stats?.totalAdmins)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Classes */}
        <div
          className="game-card"
          style={{
            padding: '22px 24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tổng lớp học
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginTop: '4px', lineHeight: 1 }}>
                {loading ? '...' : formatNumber(stats?.totalClasses)}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <School size={22} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Mới ({formatPeriodLabel(period)}):</span>
              <span style={{ fontWeight: 800, color: '#059669' }}>
                +{loading ? '...' : formatNumber(stats?.newClassesInPeriod)} lớp
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Lessons */}
        <div
          className="game-card"
          style={{
            padding: '22px 24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Tổng bài học
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginTop: '4px', lineHeight: 1 }}>
                {loading ? '...' : formatNumber(stats?.totalLessons)}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#fffbeb',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={22} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Lộ trình HSK:</span>
              <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                Tất cả cấp độ
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Submissions */}
        <div
          className="game-card"
          style={{
            padding: '22px 24px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Lượt nộp bài tập
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1e293b', marginTop: '4px', lineHeight: 1 }}>
                {loading ? '...' : formatNumber(stats?.totalSubmissions)}
              </div>
            </div>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileCheck size={22} />
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Mới ({formatPeriodLabel(period)}):</span>
              <span style={{ fontWeight: 800, color: '#7c3aed' }}>
                +{loading ? '...' : formatNumber(stats?.newSubmissionsInPeriod)} lượt
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Period Growth Details Card */}
      <div
        className="game-card"
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border-card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Calendar size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
            Tăng trưởng trong kỳ ({formatPeriodLabel(period)})
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <UserPlus size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                NGƯỜI DÙNG MỚI
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
                +{loading ? '...' : formatNumber(stats?.newUsersInPeriod)}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FolderPlus size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                LỚP HỌC MỚI
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
                +{loading ? '...' : formatNumber(stats?.newClassesInPeriod)}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Send size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                BÀI NỘP MỚI
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)' }}>
                +{loading ? '...' : formatNumber(stats?.newSubmissionsInPeriod)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
