import { ApiError } from './auth'

export type AssignmentStatus = 'SCHEDULED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED' | 'CANCELLED'

export interface AssignExercisePayload {
  exerciseId: number
  classId: number
  startTime?: string | null
  dueTime: string
}

export interface AssignmentItem {
  id: number
  exerciseId: number
  classId: number
  classTitle: string
  teacherId: number
  title: string
  description?: string
  startTime: string
  dueTime: string
  totalPoints: number
  status: AssignmentStatus
  questionCount: number
  createdAt: string
}

export interface AssignmentSnapshotOption {
  id: number
  content: string
  isCorrect: boolean
  sortOrder: number
}

export interface AssignmentSnapshotQuestion {
  questionId: number
  type: string
  content: string
  explanation?: string
  payload?: string
  points: number
  sortOrder: number
  options: AssignmentSnapshotOption[]
}

export interface AssignmentDetailItem extends AssignmentItem {
  questions: AssignmentSnapshotQuestion[]
}

const API_BASE = '/api/assignments'

export async function assignExercise(
  payload: AssignExercisePayload,
  token: string
): Promise<AssignmentItem> {
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
      data?.message || 'Không thể giao bài tập cho lớp',
      data?.fields
    )
  }

  return data as AssignmentItem
}

export async function getAssignmentsForClass(
  classId: number,
  token: string
): Promise<AssignmentItem[]> {
  const response = await fetch(`${API_BASE}/classes/${classId}`, {
    method: 'GET',
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
      data?.message || 'Không thể tải danh sách bài tập của lớp',
      data?.fields
    )
  }

  return (data || []) as AssignmentItem[]
}

export async function getAssignmentDetail(
  id: number,
  token: string
): Promise<AssignmentDetailItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'GET',
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
      data?.message || 'Không thể tải chi tiết bài tập đã giao',
      data?.fields
    )
  }

  return data as AssignmentDetailItem
}

export type StudentAssignmentStatus = 'UPCOMING' | 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'OVERDUE'

export interface StudentAssignmentItem {
  id: number
  exerciseId: number
  classId: number
  className: string
  title: string
  description?: string
  startTime: string
  dueTime: string
  totalPoints: number
  questionCount: number
  studentStatus: StudentAssignmentStatus
  canStart: boolean
  submissionId?: number | null
  submittedAt?: string | null
  score?: number | null
}

export interface StudentAssignmentDetailItem extends StudentAssignmentItem {
  teacherId: number
  teacherName: string
  questions: AssignmentSnapshotQuestion[]
}

export async function getStudentAssignmentsForClass(
  classId: number,
  token: string
): Promise<StudentAssignmentItem[]> {
  const response = await fetch(`${API_BASE}/classes/${classId}/student`, {
    method: 'GET',
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
      data?.message || 'Không thể tải danh sách bài tập của bạn',
      data?.fields
    )
  }

  return (data || []) as StudentAssignmentItem[]
}

export async function getStudentAssignmentDetail(
  id: number,
  token: string
): Promise<StudentAssignmentDetailItem> {
  const response = await fetch(`${API_BASE}/${id}/student`, {
    method: 'GET',
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
      data?.message || 'Không thể tải chi tiết bài tập được giao',
      data?.fields
    )
  }

  return data as StudentAssignmentDetailItem
}

export async function cancelAssignment(
  id: number,
  token: string
): Promise<AssignmentItem> {
  const response = await fetch(`${API_BASE}/${id}/cancel`, {
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
      data?.message || 'Không thể hủy lần giao bài',
      data?.fields
    )
  }

  return data as AssignmentItem
}

// ---------------------------------------------------------------------------
// HTT-06-CN-003: Làm bài và nộp bài
// ---------------------------------------------------------------------------

export interface StudentTakingQuestionOption {
  id: number
  content: string
  sortOrder: number
}

export interface StudentTakingQuestion {
  questionId: number
  type: string
  content: string
  payload?: string
  points: number
  sortOrder: number
  options: StudentTakingQuestionOption[]
}

export interface StudentAnswerItem {
  questionId: number
  selectedOptionId?: number | null
  textAnswer?: string | null
  isCorrect?: boolean | null
  pointsEarned?: number | null
}

export interface TakeAssignmentData {
  submissionId: number
  assignmentId: number
  title: string
  description?: string
  startTime: string
  dueTime: string
  totalPoints: number
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED'
  startedAt: string
  submittedAt?: string | null
  score?: number | null
  attemptNumber: number
  questions: StudentTakingQuestion[]
  savedAnswers: StudentAnswerItem[]
  serverTimeMillis: number
}

export interface DetailedQuestionResult {
  questionId: number
  type: string
  content: string
  explanation?: string
  maxPoints: number
  pointsEarned: number
  isCorrect: boolean
  selectedOptionId?: number | null
  options: AssignmentSnapshotOption[]
}

export interface SubmissionResultData {
  submissionId: number
  assignmentId: number
  title: string
  description?: string
  status: 'SUBMITTED' | 'AUTO_SUBMITTED'
  startedAt: string
  submittedAt: string
  score: number
  maxScore: number
  attemptNumber: number
  questions: DetailedQuestionResult[]
}

export async function takeAssignment(
  id: number,
  token: string
): Promise<TakeAssignmentData> {
  const response = await fetch(`${API_BASE}/${id}/take`, {
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
      data?.message || 'Không thể mở bài làm',
      data?.fields
    )
  }

  return data as TakeAssignmentData
}

export async function saveDraftAnswers(
  id: number,
  answers: StudentAnswerItem[],
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}/draft`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Không thể lưu nháp câu trả lời',
      data?.fields
    )
  }
}

export async function submitAssignment(
  id: number,
  answers: StudentAnswerItem[],
  token: string
): Promise<SubmissionResultData> {
  const response = await fetch(`${API_BASE}/${id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answers }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Không thể nộp bài tập',
      data?.fields
    )
  }

  return data as SubmissionResultData
}

export async function getSubmissionResult(
  id: number,
  token: string
): Promise<SubmissionResultData> {
  const response = await fetch(`${API_BASE}/${id}/result`, {
    method: 'GET',
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
      data?.message || 'Không thể tải kết quả bài làm',
      data?.fields
    )
  }

  return data as SubmissionResultData
}
