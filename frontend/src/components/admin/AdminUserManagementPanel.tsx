import React, { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Lock,
  Unlock,
  AlertCircle,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap,
  BookOpen
} from 'lucide-react'
import {
  searchUsers,
  lockUser,
  unlockUser,
  type AdminUserItem,
  type PageResponse,
} from '../../api/adminUser'
import { ApiError } from '../../api/auth'

interface AdminUserManagementPanelProps {
  token: string
  currentUserId?: number
}

export const AdminUserManagementPanel: React.FC<AdminUserManagementPanelProps> = ({
  token,
  currentUserId,
}) => {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    type: 'LOCK' | 'UNLOCK'
    user: AdminUserItem
  } | null>(null)

  const loadData = async (targetPage = page) => {
    try {
      setLoading(true)
      setError(null)
      const data: PageResponse<AdminUserItem> = await searchUsers(token, {
        query: searchTerm,
        status: statusFilter || undefined,
        page: targetPage,
        size: 10,
      })
      setUsers(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      setPage(data.number)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải danh sách tài khoản')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData(0)
  }, [token, statusFilter])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loadData(0)
  }

  const handleExecuteAction = async () => {
    if (!confirmModal) return
    const { type, user } = confirmModal

    try {
      setActionLoading(user.id)
      setError(null)
      if (type === 'LOCK') {
        const updated = await lockUser(token, user.id)
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
        setSuccessMsg(`Đã khóa tài khoản của ${user.fullName} (${user.email})`)
      } else {
        const updated = await unlockUser(token, user.id)
        setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)))
        setSuccessMsg(`Đã mở khóa tài khoản của ${user.fullName} (${user.email})`)
      }
      setConfirmModal(null)
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Lỗi khi thực hiện thao tác')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return isoString
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Users size={22} color="#0284c7" /> Quản lý tài khoản người dùng
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Tra cứu, kiểm soát trạng thái và khóa/mở khóa tài khoản học viên và giáo viên
          </p>
        </div>

        <button
          onClick={() => loadData(page)}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.875rem',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#475569',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div
          style={{
            padding: '0.875rem 1rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '0.5rem',
            color: '#065f46',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {successMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '0.875rem 1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            color: '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Filters Form */}
      <form
        onSubmit={handleSearchSubmit}
        style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search
            size={18}
            color="#94a3b8"
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Tìm theo email hoặc họ tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            background: '#ffffff',
            color: '#334155',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đang hoạt động</option>
          <option value="LOCKED">Bị khóa</option>
          <option value="PENDING">Chờ phê duyệt</option>
        </select>

        <button
          type="submit"
          style={{
            padding: '0.5rem 1.25rem',
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Tìm kiếm
        </button>
      </form>

      {/* Users Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '0.75rem',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 0.75rem', color: '#0284c7' }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Đang tải danh sách người dùng...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <Users size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
            <p style={{ margin: 0, fontWeight: 500 }}>Không tìm thấy người dùng phù hợp</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Người dùng</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Vai trò</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Trạng thái</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Ngày tạo</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 600, textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = currentUserId !== undefined && user.id === currentUserId
                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Name & Avatar */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                              flexShrink: 0,
                            }}
                          >
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                              {user.fullName}
                              {isSelf && (
                                <span
                                  style={{
                                    marginLeft: '0.5rem',
                                    padding: '0.125rem 0.375rem',
                                    borderRadius: '0.25rem',
                                    background: '#e0e7ff',
                                    color: '#4338ca',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  Bạn
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #{user.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: '0.75rem 1rem', color: '#334155', fontFamily: 'monospace' }}>
                        {user.email}
                      </td>

                      {/* Roles */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {user.roles.map((r) => {
                            if (r === 'ADMIN') {
                              return (
                                <span
                                  key={r}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    background: '#f3e8ff',
                                    color: '#7e22ce',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  <Shield size={12} /> Admin
                                </span>
                              )
                            }
                            if (r === 'TEACHER') {
                              return (
                                <span
                                  key={r}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '0.375rem',
                                    background: '#ecfdf5',
                                    color: '#047857',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                  }}
                                >
                                  <GraduationCap size={12} /> Giáo viên
                                </span>
                              )
                            }
                            return (
                              <span
                                key={r}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  background: '#eff6ff',
                                  color: '#1d4ed8',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}
                              >
                                <BookOpen size={12} /> Học sinh
                              </span>
                            )
                          })}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {user.status === 'ACTIVE' && (
                          <span
                            style={{
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              background: '#dcfce7',
                              color: '#15803d',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            Hoạt động
                          </span>
                        )}
                        {user.status === 'LOCKED' && (
                          <span
                            style={{
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              background: '#fee2e2',
                              color: '#b91c1c',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            Bị khóa
                          </span>
                        )}
                        {user.status === 'PENDING' && (
                          <span
                            style={{
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              background: '#fef3c7',
                              color: '#b45309',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            Chờ duyệt
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                        {formatDate(user.createdAt)}
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        {user.status === 'ACTIVE' ? (
                          <button
                            onClick={() => setConfirmModal({ type: 'LOCK', user })}
                            disabled={isSelf || actionLoading === user.id}
                            title={isSelf ? 'Không thể tự khóa tài khoản của chính mình' : 'Khóa tài khoản'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #fecaca',
                              background: isSelf ? '#f8fafc' : '#fff1f2',
                              color: isSelf ? '#94a3b8' : '#e11d48',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: isSelf ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            <Lock size={13} />
                            Khóa
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmModal({ type: 'UNLOCK', user })}
                            disabled={actionLoading === user.id}
                            title="Mở khóa tài khoản"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                              padding: '0.375rem 0.75rem',
                              borderRadius: '0.375rem',
                              border: '1px solid #bbf7d0',
                              background: '#f0fdf4',
                              color: '#16a34a',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                          >
                            <Unlock size={13} />
                            Mở khóa
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '0.875rem',
              color: '#64748b',
            }}
          >
            <div>
              Trang {page + 1} / {totalPages} ({totalElements} tài khoản)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => loadData(page - 1)}
                disabled={page <= 0 || loading}
                style={{
                  padding: '0.375rem 0.625rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: page <= 0 ? '#cbd5e1' : '#334155',
                  cursor: page <= 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => loadData(page + 1)}
                disabled={page >= totalPages - 1 || loading}
                style={{
                  padding: '0.375rem 0.625rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: page >= totalPages - 1 ? '#cbd5e1' : '#334155',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '0.75rem',
              maxWidth: '440px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: confirmModal.type === 'LOCK' ? '#fee2e2' : '#dcfce7',
                  color: confirmModal.type === 'LOCK' ? '#dc2626' : '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {confirmModal.type === 'LOCK' ? <ShieldAlert size={20} /> : <Unlock size={20} />}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                {confirmModal.type === 'LOCK' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản'}
              </h3>
            </div>

            <p style={{ margin: '0 0 1.25rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
              {confirmModal.type === 'LOCK' ? (
                <>
                  Bạn có chắc chắn muốn khóa tài khoản{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.user.email}</strong>? Sau khi khóa, người dùng
                  này sẽ bị chấm dứt phiên ngay lập tức và không thể đăng nhập.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn mở khóa tài khoản{' '}
                  <strong style={{ color: '#0f172a' }}>{confirmModal.user.email}</strong>? Người dùng sẽ có thể đăng
                  nhập trở lại bình thường.
                </>
              )}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setConfirmModal(null)}
                disabled={actionLoading !== null}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={actionLoading !== null}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: confirmModal.type === 'LOCK' ? '#e11d48' : '#16a34a',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {actionLoading !== null && <Loader2 size={16} className="spin" />}
                {confirmModal.type === 'LOCK' ? 'Khóa tài khoản' : 'Mở khóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
