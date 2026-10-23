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
  studentTextAnswer?: string | null
  payload?: string | null
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
  showSolutions?: boolean
  dueTime?: string | null
  adjustedScore?: number | null
  adjustReason?: string | null
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

export async function getSubmissionResultById(
  submissionId: number,
  token: string
): Promise<SubmissionResultData> {
  const response = await fetch(`${API_BASE}/submissions/${submissionId}`, {
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
      data?.message || 'Không thể xem chi tiết bài nộp',
      data?.fields
    )
  }

  return data as SubmissionResultData
}

// ---------------------------------------------------------------------------
// HTT-06-CN-006: Danh sách bài nộp của học sinh dành cho Giáo viên
// ---------------------------------------------------------------------------

export interface StudentSubmissionSummary {
  studentId: number
  studentName: string
  studentEmail: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED'
  submissionId?: number | null
  score?: number | null
  adjustedScore?: number | null
  adjustReason?: string | null
  effectiveScore?: number | null
  attemptNumber?: number | null
  startedAt?: string | null
  submittedAt?: string | null
  extendedDueTime?: string | null
  allowedAttempts?: number | null
}

export interface AssignmentSubmissionsOverviewData {
  assignmentId: number
  assignmentTitle: string
  assignmentDescription?: string | null
  totalPoints: number
  dueTime: string
  status: string
  totalStudents: number
  submittedCount: number
  inProgressCount: number
  notStartedCount: number
  students: StudentSubmissionSummary[]
}

export async function getAssignmentSubmissionsOverview(
  assignmentId: number,
  token: string
): Promise<AssignmentSubmissionsOverviewData> {
  const response = await fetch(`${API_BASE}/${assignmentId}/submissions`, {
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
      data?.message || 'Không thể tải danh sách bài nộp của học sinh',
      data?.fields
    )
  }

  return data as AssignmentSubmissionsOverviewData
}

// ---------------------------------------------------------------------------
// HTT-06-CN-007: Giáo viên điều chỉnh điểm bài nộp
// ---------------------------------------------------------------------------

export interface AdjustScorePayload {
  adjustedScore: number
  reason: string
}

export async function adjustSubmissionScore(
  submissionId: number,
  payload: AdjustScorePayload,
  token: string
): Promise<SubmissionResultData> {
  const response = await fetch(`${API_BASE}/submissions/${submissionId}/adjust-score`, {
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
      data?.message || 'Không thể điều chỉnh điểm cho bài nộp',
      data?.fields
    )
  }

  return data as SubmissionResultData
}

// ---------------------------------------------------------------------------
// HTT-06-CN-008: Gia hạn nộp bài và Cho phép làm lại bài tập
// ---------------------------------------------------------------------------

export interface GrantExtensionPayload {
  extendedDueTime: string
  reason?: string
}

export interface GrantRetakePayload {
  allowedAttempts?: number
  reason?: string
}

export interface StudentOverrideData {
  assignmentId: number
  studentId: number
  extendedDueTime?: string | null
  allowedAttempts?: number | null
  reason?: string | null
  updatedAt: string
}

export async function grantStudentExtension(
  assignmentId: number,
  studentId: number,
  payload: GrantExtensionPayload,
  token: string
): Promise<StudentOverrideData> {
  const response = await fetch(`${API_BASE}/${assignmentId}/students/${studentId}/extension`, {
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
      data?.message || 'Không thể gia hạn bài tập cho học sinh',
      data?.fields
    )
  }

  return data as StudentOverrideData
}

export async function grantStudentRetake(
  assignmentId: number,
  studentId: number,
  payload: GrantRetakePayload,
  token: string
): Promise<StudentOverrideData> {
  const response = await fetch(`${API_BASE}/${assignmentId}/students/${studentId}/retake`, {
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
      data?.message || 'Không thể cấp quyền làm lại bài tập cho học sinh',
      data?.fields
    )
  }

  return data as StudentOverrideData
}
// ---------------------------------------------------------------------------
// HTT-06-CN-010: Kéo dài hạn nộp lần giao bài (cả lớp)
// ---------------------------------------------------------------------------

export interface ExtendAssignmentDueDatePayload {
  newDueTime: string  // ISO-8601 Instant — phải sau dueTime hiện tại (QTN-21)
}

export async function extendAssignmentDueDate(
  assignmentId: number,
  payload: ExtendAssignmentDueDatePayload,
  token: string
): Promise<AssignmentItem> {
  const response = await fetch(`${API_BASE}/${assignmentId}/due-date`, {
    method: 'PATCH',
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
      data?.message || 'Không thể kéo dài hạn nộp lần giao bài',
      data?.fields
    )
  }

  return data as AssignmentItem
}
