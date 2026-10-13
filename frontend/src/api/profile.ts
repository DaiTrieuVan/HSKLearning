import { ApiError } from './auth'

export interface UserProfile {
  id: number
  email: string
  fullName: string
  avatarUrl?: string
  status: string
  roles: string[]
  createdAt: string
}

const API_BASE = '/api/v1/profile'

export async function getMyProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/me`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tải hồ sơ')
  }

  return data as UserProfile
}

export async function updateProfile(
  payload: { fullName: string; avatarUrl?: string },
  token: string
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể cập nhật hồ sơ')
  }

  return data as UserProfile
}

export async function uploadAvatar(file: File, token: string): Promise<UserProfile> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/avatar`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tải lên ảnh đại diện')
  }

  return data as UserProfile
}

export async function changePassword(
  payload: { currentPassword: string; newPassword: string; confirmPassword: string },
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Đổi mật khẩu thất bại')
  }
}
