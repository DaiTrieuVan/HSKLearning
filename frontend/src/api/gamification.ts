import { ApiError } from './auth'

export interface DailyChallengeData {
  date: string
  targetLessons: number
  completedLessons: number
  targetVocabs: number
  reviewedVocabs: number
  targetExercises: number
  completedExercises: number
  isCompleted: boolean
  rewardXp: number
  rewardClaimed: boolean
  overallProgressPercent: number
  currentTotalXp: number
}

const API_BASE = '/api/v1/gamification'

export async function getDailyChallenge(token: string, date?: string): Promise<DailyChallengeData> {
  const url = date ? `${API_BASE}/daily-challenge?date=${encodeURIComponent(date)}` : `${API_BASE}/daily-challenge`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_DAILY_CHALLENGE_FAILED', 'Không thể tải thử thách hằng ngày')
  }

  return response.json()
}
