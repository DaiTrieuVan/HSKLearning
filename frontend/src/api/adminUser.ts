import { ApiError } from './auth'

export interface AdminUserItem {
  id: number
  email: string
  fullName: string
  avatarUrl?: string
  status: 'ACTIVE' | 'LOCKED' | 'PENDING'
  roles: Array<'STUDENT' | 'TEACHER' | 'ADMIN'>
  lastMode?: 'STUDENT' | 'TEACHER'
  failedLoginCount: number
  lockedUntil?: string
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

const API_BASE = '/api/v1/admin/users'

export async function searchUsers(
  token: string,
  params: {
    query?: string
    status?: string
    page?: number
    size?: number
  } = {}
): Promise<PageResponse<AdminUserItem>> {
  const queryParams = new URLSearchParams()
  if (params.query) queryParams.set('query', params.query)
  if (params.status) queryParams.set('status', params.status)
  if (params.page !== undefined) queryParams.set('page', params.page.toString())
  if (params.size !== undefined) queryParams.set('size', params.size.toString())

  const url = `${API_BASE}?${queryParams.toString()}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Không thể tải danh sách người dùng'
    const code = data?.code || 'UNKNOWN_ERROR'
    throw new ApiError(response.status, code, message)
  }

  return data as PageResponse<AdminUserItem>
}

export async function lockUser(
  token: string,
  userId: number
): Promise<AdminUserItem> {
  const response = await fetch(`${API_BASE}/${userId}/lock`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Không thể khóa tài khoản'
    const code = data?.code || 'UNKNOWN_ERROR'
    throw new ApiError(response.status, code, message)
  }

  return data as AdminUserItem
}

export async function unlockUser(
  token: string,
  userId: number
): Promise<AdminUserItem> {
  const response = await fetch(`${API_BASE}/${userId}/unlock`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Không thể mở khóa tài khoản'
    const code = data?.code || 'UNKNOWN_ERROR'
    throw new ApiError(response.status, code, message)
  }

  return data as AdminUserItem
}
