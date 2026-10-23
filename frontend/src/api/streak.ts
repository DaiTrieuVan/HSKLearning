import { ApiError } from './auth'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  completedToday: boolean
  lastCompletedDate?: string
  referenceDate: string
  message: string
}

const API_BASE = '/api/v1/gamification'

export async function getStreak(token: string, date?: string): Promise<StreakData> {
  const url = date ? `${API_BASE}/streak?date=${encodeURIComponent(date)}` : `${API_BASE}/streak`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_STREAK_FAILED', 'Không thể tải thông tin chuỗi ngày học')
  }

  return response.json()
}
