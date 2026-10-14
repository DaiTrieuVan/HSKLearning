import { ApiError } from './auth'

export interface ClassItem {
  id: number
  teacherId: number
  teacherName: string
  teacherEmail: string
  title: string
  description?: string
  joinCode: string
  status: 'ACTIVE' | 'ARCHIVED'
  memberCount: number
  createdAt: string
  updatedAt: string
}

export interface ClassMemberItem {
  id: number
  studentId: number
  studentName: string
  studentEmail: string
  avatarUrl?: string
  status: 'ACTIVE' | 'LEFT' | 'REMOVED'
  joinedAt: string
  updatedAt: string
}

const API_BASE = '/api/v1/classes'

export async function createClass(
  payload: { title: string; description?: string },
  token: string
): Promise<ClassItem> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tạo lớp học', data?.fields)
  }

  return data as ClassItem
}

export async function updateClass(
  id: number,
  payload: { title: string; description?: string },
  token: string
): Promise<ClassItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
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
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể cập nhật lớp học', data?.fields)
  }

  return data as ClassItem
}

export async function archiveClass(
  id: number,
  token: string
): Promise<ClassItem> {
  const response = await fetch(`${API_BASE}/${id}/archive`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể lưu trữ lớp học')
  }

  return data as ClassItem
}

export async function getTeachingClasses(token: string): Promise<ClassItem[]> {
  const response = await fetch(`${API_BASE}/teaching`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tải danh sách lớp phụ trách')
  }

  return (data || []) as ClassItem[]
}

export async function joinClass(
  code: string,
  token: string
): Promise<ClassItem> {
  const response = await fetch(`${API_BASE}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tham gia lớp học')
  }

  return data as ClassItem
}

export async function getEnrolledClasses(token: string): Promise<ClassItem[]> {
  const response = await fetch(`${API_BASE}/enrolled`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tải danh sách lớp đã tham gia')
  }

  return (data || []) as ClassItem[]
}

export async function getClassMembers(
  classId: number,
  token: string,
  status?: string
): Promise<ClassMemberItem[]> {
  const url = status ? `${API_BASE}/${classId}/members?status=${status}` : `${API_BASE}/${classId}/members`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể tải danh sách thành viên')
  }

  return (data || []) as ClassMemberItem[]
}

export async function removeStudent(
  classId: number,
  studentId: number,
  reason: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${classId}/members/${studentId}/remove?reason=${encodeURIComponent(reason)}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể xóa học sinh')
  }
}

export async function restoreStudent(
  classId: number,
  studentId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${classId}/members/${studentId}/restore`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể khôi phục học sinh')
  }
}

export async function leaveClass(
  classId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${classId}/leave`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(response.status, data?.code || 'UNKNOWN_ERROR', data?.message || 'Không thể rời lớp')
  }
}
