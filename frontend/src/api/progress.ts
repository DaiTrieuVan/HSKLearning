import { ApiError } from './auth'

export interface HskLevelProgressDto {
  hskLevelId: number
  hskLevelCode: string
  hskLevelTitle: string
  levelNumber: number
  completedLessons: number
  totalLessons: number
  progressPercentage: number
}

export interface RecentActivityDto {
  type: 'LESSON_COMPLETED' | 'ASSIGNMENT_SUBMITTED' | string
  title: string
  hskLevelTitle?: string
  scorePercentage?: number | null
  timestamp: string
}

export interface PersonalProgressResponse {
  completedLessons: number
  totalLessons: number
  learnedVocabulary: number
  averageScorePercentage: number | null
  hskLevels: HskLevelProgressDto[]
  recentActivities: RecentActivityDto[]
}

export interface SubmissionAttemptItem {
  submissionId: number
  attemptNumber: number
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED'
  score: number | null
  adjustedScore: number | null
  adjustReason: string | null
  effectiveScore: number | null
  scorePercentage: number | null
  isBestScore: boolean
  submittedAt: string | null
  startedAt: string
}

export interface AssignmentHistoryItem {
  assignmentId: number
  assignmentTitle: string
  classId: number | null
  className: string | null
  totalPoints: number
  bestScore: number | null
  bestScorePercentage: number | null
  latestSubmittedAt: string | null
  attemptsCount: number
  attempts: SubmissionAttemptItem[]
}

export interface SubmissionHistoryResponse {
  totalAssignments: number
  totalSubmissions: number
  averageScorePercentage: number | null
  items: AssignmentHistoryItem[]
}

const API_BASE = '/api/progress'

export async function getPersonalProgress(token: string): Promise<PersonalProgressResponse> {
  const response = await fetch(`${API_BASE}/personal`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_PROGRESS_FAILED', 'Không thể tải dữ liệu tiến độ học tập')
  }

  return response.json()
}

export async function getSubmissionHistory(token: string): Promise<SubmissionHistoryResponse> {
  const response = await fetch(`${API_BASE}/history`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_HISTORY_FAILED', 'Không thể tải lịch sử làm bài')
  }

  return response.json()
}
export interface GradeAttemptDetailItem {
  submissionId: number
  attemptNumber: number
  score: number | null
  adjustedScore: number | null
  adjustReason: string | null
  adjustedAt: string | null
  adjustedByName: string | null
  effectiveScore: number | null
  status: string
  submittedAt: string | null
  isBestAttempt: boolean
}

export interface CellGradeItem {
  assignmentId: number
  hasSubmitted: boolean
  bestScore: number | null
  totalPoints: number
  scorePercentage: number | null
  isAdjusted: boolean
  status: string
  totalAttempts: number
  attempts: GradeAttemptDetailItem[]
}

export interface StudentGradeRowItem {
  studentId: number
  fullName: string
  email: string
  avatarUrl: string | null
  membershipStatus: 'ACTIVE' | 'LEFT' | 'REMOVED' | string
  isEnrolled: boolean
  submittedAssignmentsCount: number
  studentAverageScore: number | null
  grades: CellGradeItem[]
}

export interface AssignmentColumnHeaderItem {
  assignmentId: number
  title: string
  totalPoints: number
  dueTime: string | null
  createdAt: string | null
  submittedCount: number
  assignmentAverageScore: number | null
}

export interface ClassGradebookResponse {
  classId: number
  className: string
  classCode: string
  teacherId: number
  teacherName: string
  totalStudents: number
  activeStudentsCount: number
  totalAssignments: number
  classAverageScore: number | null
  assignments: AssignmentColumnHeaderItem[]
  students: StudentGradeRowItem[]
}

export async function getClassGradebook(token: string, classId: number): Promise<ClassGradebookResponse> {
  const response = await fetch(`${API_BASE}/classes/${classId}/gradebook`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorDetail = 'Không thể tải bảng điểm lớp học'
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, 'FETCH_GRADEBOOK_FAILED', errorDetail)
  }

  return response.json()
}
