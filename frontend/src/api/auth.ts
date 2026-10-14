import type {
  RegisterRequest,
  UserResponse,
  LoginRequest,
  LoginResponse,
  ApiErrorResponse,
} from '../types/auth'

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

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
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
    const message = errorData?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu!'
    const code = errorData?.code || 'UNKNOWN_ERROR'
    const fields = errorData?.fields

    throw new ApiError(response.status, code, message, fields)
  }

  return data as LoginResponse
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {})
}

export async function requestForgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorData = data as ApiErrorResponse | null
    throw new ApiError(
      response.status,
      errorData?.code || 'UNKNOWN_ERROR',
      errorData?.message || 'Không thể gửi yêu cầu đặt lại mật khẩu'
    )
  }

  return data as { message: string; resetToken?: string }
}

export async function validateResetToken(token: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/auth/reset-password/validate?token=${encodeURIComponent(token)}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Liên kết không hợp lệ hoặc đã hết hạn'
    )
  }

  return true
}

export async function resetPassword(payload: {
  token: string
  newPassword: string
  confirmPassword: string
}): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Đổi mật khẩu thất bại'
    )
  }
}
