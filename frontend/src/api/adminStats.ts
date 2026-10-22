import { ApiError } from './auth'

export interface SystemStatisticsResponse {
  period: 'ALL' | '7D' | '30D' | string
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalAdmins: number
  totalClasses: number
  totalLessons: number
  totalSubmissions: number
  newUsersInPeriod: number
  newClassesInPeriod: number
  newSubmissionsInPeriod: number
  timestamp: string
}

const API_BASE = '/api/v1/admin/system-stats'

export async function getSystemStatistics(
  token: string,
  period: 'ALL' | '7D' | '30D' = 'ALL'
): Promise<SystemStatisticsResponse> {
  const response = await fetch(`${API_BASE}?period=${period}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorDetail = 'Không thể tải dữ liệu thống kê hệ thống'
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, 'FETCH_SYSTEM_STATS_FAILED', errorDetail)
  }

  return response.json()
}
