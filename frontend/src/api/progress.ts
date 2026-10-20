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
