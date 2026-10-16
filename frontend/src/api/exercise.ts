import { ApiError } from './auth'

export type ExerciseStatus = 'DRAFT' | 'READY'

export interface CreateExerciseQuestionItem {
  questionId: number
  points: number
  sortOrder?: number
}

export interface CreateExercisePayload {
  title: string
  description?: string
  status?: ExerciseStatus
  questions?: CreateExerciseQuestionItem[]
}

export interface ExerciseQuestionItem {
  id: number
  questionId: number
  content: string
  type: 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'
  points: number
  sortOrder: number
}

export interface ExerciseItem {
  id: number
  ownerId: number
  title: string
  description?: string
  status: ExerciseStatus
  totalPoints: number
  questionCount: number
  questions: ExerciseQuestionItem[]
  createdAt: string
  updatedAt: string
}

const API_BASE = '/api/exercises'

export async function createExercise(
  payload: CreateExercisePayload,
  token: string
): Promise<ExerciseItem> {
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
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Không thể tạo bài tập',
      data?.fields
    )
  }

  return data as ExerciseItem
}

export async function getMyExercises(token: string): Promise<ExerciseItem[]> {
  const response = await fetch(`${API_BASE}/my`, {
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
      data?.message || 'Không thể lấy danh sách bài tập',
      data?.fields
    )
  }

  return data as ExerciseItem[]
}

export async function getExerciseDetail(id: number, token: string): Promise<ExerciseItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
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
      data?.message || 'Không thể lấy chi tiết bài tập',
      data?.fields
    )
  }

  return data as ExerciseItem
}
