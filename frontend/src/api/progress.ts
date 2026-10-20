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

