import { ApiError } from './auth'

const API_BASE = '/api/v1'

export interface ClassLeaderboardEntry {
  rank: number
  studentId: number
  studentName: string
  avatarUrl: string | null
  weeklyXp: number
  level: number
  levelTitle: string
  isCurrentUser: boolean
}

export interface ClassLeaderboardResponse {
  classId: number
  className: string
  weekStart: string
  weekEnd: string
  totalStudents: number
  currentUserRank: number | null
  currentUserWeeklyXp: number | null
  leaderboard: ClassLeaderboardEntry[]
}

export async function getClassLeaderboard(
  token: string,
  classId: number
): Promise<ClassLeaderboardResponse> {
  const response = await fetch(`${API_BASE}/classes/${classId}/leaderboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorMessage = 'Không thể tải bảng xếp hạng lớp học'
    try {
      const errorData = await response.json()
      if (errorData?.message) {
        errorMessage = errorData.message
      }
    } catch {
      // fallback
    }
    throw new ApiError(response.status, 'LEADERBOARD_ERROR', errorMessage)
  }

  return response.json()
}
