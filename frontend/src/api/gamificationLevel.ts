import { ApiError } from './auth'

export interface UserLevelData {
  currentLevel: number
  title: string
  totalXp: number
  currentLevelThreshold: number
  nextLevelThreshold: number
  xpToNextLevel: number
  progressPercent: number
  levelUpJustNow: boolean
}

export interface XpTransactionItem {
  id: number
  xpAmount: number
  sourceType: string
  sourceId?: string
  description: string
  createdAt: string
}

const API_BASE = '/api/v1/gamification'

export async function getUserLevel(token: string): Promise<UserLevelData> {
  const response = await fetch(`${API_BASE}/level`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_USER_LEVEL_FAILED', 'Không thể tải thông tin cấp bậc')
  }

  return response.json()
}

export async function getRecentXpHistory(token: string): Promise<XpTransactionItem[]> {
  const response = await fetch(`${API_BASE}/xp-history/recent`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_XP_HISTORY_FAILED', 'Không thể tải lịch sử nhận XP')
  }

  return response.json()
}
