import React, { useState, useEffect } from 'react'
import { Check, X, ShieldAlert, Loader2, RefreshCw } from 'lucide-react'
import {
  listPendingTeacherRequests,
  approveTeacherRequest,
  rejectTeacherRequest,
  type TeacherRequestItem,
} from '../../api/teacherRequest'
import { ApiError } from '../../api/auth'

interface AdminTeacherReviewPanelProps {
  token: string
}

export const AdminTeacherReviewPanel: React.FC<AdminTeacherReviewPanelProps> = ({ token }) => {
  const [requests, setRequests] = useState<TeacherRequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Reject modal state
  const [rejectingItem, setRejectingItem] = useState<TeacherRequestItem | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)

  const loadRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await listPendingTeacherRequests(token)
      setRequests(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Không thể tải danh sách yêu cầu chờ duyệt')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [token])

  const handleApprove = async (item: TeacherRequestItem) => {
    try {
      setActionLoading(item.id)
      setError(null)
      await approveTeacherRequest(item.id, token)
      setSuccessMsg(`Đã phê duyệt tài khoản ${item.userFullName} (${item.userEmail}) thành Giáo viên!`)
      setRequests((prev) => prev.filter((r) => r.id !== item.id))
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Lỗi khi phê duyệt yêu cầu')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectConfirm = async () => {
    if (!rejectingItem) return
    if (!rejectReason.trim()) {
      setRejectError('Vui lòng nhập lý do từ chối cụ thể (bắt buộc)')
      return
    }

    try {
      setActionLoading(rejectingItem.id)
      setRejectError(null)
      await rejectTeacherRequest(rejectingItem.id, rejectReason.trim(), token)
      setSuccessMsg(`Đã từ chối yêu cầu của ${rejectingItem.userFullName}.`)
      setRequests((prev) => prev.filter((r) => r.id !== rejectingItem.id))
      setRejectingItem(null)
      setRejectReason('')
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (err) {
      if (err instanceof ApiError) {
        setRejectError(err.message)
      } else {
        setRejectError('Lỗi khi từ chối yêu cầu')
      }
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Duyệt yêu cầu nâng quyền Giáo viên (HTT-01-CN-003)
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Quản trị viên xét duyệt hồ sơ giáo viên. Khi duyệt, học sinh giữ vai trò học sinh và được cấp thêm vai trò giáo viên (QTN-03).
          </span>
        </div>

        <button
          type="button"
          onClick={loadRequests}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {successMsg && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--jade-green-light)',
            color: 'var(--jade-green-shadow)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '16px',
            border: '1px solid var(--jade-green)',
          }}
        >
          {successMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '16px',
            border: '1px solid #fee2e2',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: '0 auto 8px' }} />
          <div>Đang tải danh sách chờ duyệt...</div>
        </div>
      ) : requests.length === 0 ? (
        <div
          className="game-card"
          style={{
            padding: '32px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            color: 'var(--text-muted)',
          }}
        >
          <ShieldAlert size={36} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
          <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
            Không có yêu cầu nào đang chờ duyệt
          </div>
          <div style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            Tất cả các yêu cầu trở thành giáo viên đã được xử lý xong.
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {requests.map((item) => (
            <div
              key={item.id}
              className="game-card"
              style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '20px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {item.userFullName}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({item.userEmail})
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: 'var(--accent-gold-light)',
                      color: 'var(--accent-gold-shadow)',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '0.72rem',
                    }}
                  >
                    CHỜ DUYỆT
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    marginBottom: '8px',
                  }}
                >
                  {item.teachingInfo}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Gửi lúc: {new Date(item.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => handleApprove(item)}
                  disabled={actionLoading === item.id}
                  className="btn-gamified btn-green"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} />
                  <span>Duyệt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRejectingItem(item)
                    setRejectReason('')
                    setRejectError(null)
                  }}
                  disabled={actionLoading === item.id}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid #fee2e2',
                    backgroundColor: '#ffffff',
                    color: '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <X size={16} />
                  <span>Từ chối</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            className="game-card animate-scale-up"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '480px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              Từ chối yêu cầu giáo viên
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Người dùng: <strong>{rejectingItem.userFullName}</strong> ({rejectingItem.userEmail})
            </p>

            {rejectError && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '0.85rem',
                  marginBottom: '12px',
                }}
              >
                {rejectError}
              </div>
            )}

            <label
              htmlFor="reject-reason"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}
            >
              Lý do từ chối <span style={{ color: 'var(--primary)' }}>*</span>
            </label>
            <textarea
              id="reject-reason"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ví dụ: Chưa xác minh được bằng cấp giảng dạy / Thông tin chưa đầy đủ..."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--border-card)',
                backgroundColor: 'var(--bg-input)',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                marginBottom: '16px',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={actionLoading !== null}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  backgroundColor: '#b91c1c',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
