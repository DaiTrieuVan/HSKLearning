import { ApiError } from './auth'
import type { CreateExerciseQuestionItem, ExerciseQuestionItem, ExerciseStatus } from './exercise'

export interface CreateMockExamSectionPayload {
  name: string
  sortOrder?: number
  questions: CreateExerciseQuestionItem[]
}

export interface CreateMockExamPayload {
  title: string
  description?: string
  hskLevel: number
  timeLimitMinutes: number
  passingScore?: number
  status?: ExerciseStatus
  sections: CreateMockExamSectionPayload[]
}

export interface MockExamSectionItem {
  id: number
  name: string
  sortOrder: number
  questionCount: number
  questions: ExerciseQuestionItem[]
}

export interface MockExamItem {
  id: number
  ownerId: number
  title: string
  description?: string
  exerciseType: 'MOCK_EXAM'
  hskLevel: number
  timeLimitMinutes: number
  passingScore?: number
  status: ExerciseStatus
  totalPoints: number
  sectionCount: number
  questionCount: number
  sections: MockExamSectionItem[]
  createdAt: string
  updatedAt: string
}

const API_BASE = '/api/exercises/mock-exams'

export async function createMockExam(
  payload: CreateMockExamPayload,
  token: string
): Promise<MockExamItem> {
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
      data?.message || 'Không thể tạo đề thi thử HSK',
      data?.fields
    )
  }

  return data as MockExamItem
}

export async function getMyMockExams(token: string): Promise<MockExamItem[]> {
  const response = await fetch(API_BASE, {
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
      data?.message || 'Không thể lấy danh sách đề thi thử',
      data?.fields
    )
  }

  return data as MockExamItem[]
}

export async function getMockExamDetail(id: number, token: string): Promise<MockExamItem> {
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
      data?.message || 'Không thể lấy chi tiết đề thi thử',
      data?.fields
    )
  }

  return data as MockExamItem
}

export interface MockExamHistoryItem {
  submissionId: number
  assignmentId: number
  mockExamId: number
  title: string
  hskLevel: number
  classId?: number
  className?: string
  attemptNumber: number
  score: number
  adjustedScore?: number
  effectiveScore: number
  maxScore: number
  percentage: number
  passingScore?: number
  isPassed: boolean
  startedAt?: string
  submittedAt?: string
  timeSpentSeconds?: number
}

export interface MockExamHistoryResponse {
  totalExamsTaken: number
  totalPassed: number
  averageScore: number
  items: MockExamHistoryItem[]
}

export async function getMockExamHistory(token: string): Promise<MockExamHistoryResponse> {
  const response = await fetch(`${API_BASE}/history`, {
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
      data?.message || 'Không thể lấy lịch sử thi thử HSK',
      data?.fields
    )
  }

  return data as MockExamHistoryResponse
}
