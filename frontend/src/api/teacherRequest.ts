import { ApiError } from './auth'

export interface TeacherRequestItem {
  id: number
  userId: number
  userEmail: string
  userFullName: string
  teachingInfo: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  reviewedAt?: string
  rejectReason?: string
}

const API_BASE = '/api/v1'

export async function submitTeacherRequest(
  teachingInfo: string,
  token: string
): Promise<TeacherRequestItem> {
  const response = await fetch(`${API_BASE}/teacher-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ teachingInfo }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Không thể gửi yêu cầu nâng quyền'
    const code = data?.code || 'UNKNOWN_ERROR'
    const fields = data?.fields
    throw new ApiError(response.status, code, message, fields)
  }

  return data as TeacherRequestItem
}

export async function getMyTeacherRequest(
  token: string
): Promise<TeacherRequestItem | null> {
  const response = await fetch(`${API_BASE}/teacher-requests/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Lỗi khi tải thông tin yêu cầu'
    )
  }

  return data as TeacherRequestItem
}

export async function listPendingTeacherRequests(
  token: string
): Promise<TeacherRequestItem[]> {
  const response = await fetch(`${API_BASE}/admin/teacher-requests`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Lỗi khi tải danh sách yêu cầu chờ duyệt'
    )
  }

  return (data as TeacherRequestItem[]) || []
}

export async function approveTeacherRequest(
  id: number,
  token: string
): Promise<TeacherRequestItem> {
  const response = await fetch(`${API_BASE}/admin/teacher-requests/${id}/approve`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Phê duyệt thất bại'
    )
  }

  return data as TeacherRequestItem
}

export async function rejectTeacherRequest(
  id: number,
  reason: string,
  token: string
): Promise<TeacherRequestItem> {
  const response = await fetch(`${API_BASE}/admin/teacher-requests/${id}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Từ chối thất bại'
    )
  }

  return data as TeacherRequestItem
}
