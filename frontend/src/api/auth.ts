import type { RegisterRequest, UserResponse, ApiErrorResponse } from '../types/auth'

const API_BASE = '/api/v1'

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly fields?: Record<string, string>

  constructor(
    status: number,
    code: string,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

export async function registerStudent(payload: RegisterRequest): Promise<UserResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null
    const message = errorData?.message || 'Đăng ký thất bại. Vui lòng thử lại!'
    const code = errorData?.code || 'UNKNOWN_ERROR'
    const fields = errorData?.fields

    throw new ApiError(response.status, code, message, fields)
  }

  return data as UserResponse
}
