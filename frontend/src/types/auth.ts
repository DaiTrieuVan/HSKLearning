export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserResponse {
  id: number
  email: string
  fullName: string
  avatarUrl?: string | null
  status: 'ACTIVE' | 'PENDING' | 'LOCKED' | 'SUSPENDED'
  roles: string[]
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
  mode?: 'STUDENT' | 'TEACHER'
}

export interface LoginResponse {
  token: string
  id: number
  email: string
  fullName: string
  avatarUrl?: string | null
  status: 'ACTIVE' | 'PENDING' | 'LOCKED' | 'SUSPENDED'
  roles: string[]
  activeMode: 'STUDENT' | 'TEACHER'
  hasPendingTeacherRequest: boolean
}

export interface ApiErrorResponse {
  code: string
  message: string
  timestamp: string
  status: number
  path?: string
  fields?: Record<string, string>
}
