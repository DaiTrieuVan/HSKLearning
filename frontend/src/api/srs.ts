import { ApiError } from './auth'

export interface SrsCardItem {
  vocabularyId: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string
  audioUrl?: string
  exampleSentence?: string
  examplePinyin?: string
  exampleMeaning?: string
  repetitionLevel: number
  intervalDays: number
  nextReviewAt?: string
}

export interface SrsSummary {
  dueTodayCount: number
  masteredCount: number
  learningCount: number
}

export interface SrsReviewResult {
  vocabularyId: number
  repetitionLevel: number
  intervalDays: number
  nextReviewAt: string
  remainingDueCount: number
}

const API_BASE = '/api/v1/srs'

export async function getSrsDueCards(token: string): Promise<SrsCardItem[]> {
  const response = await fetch(`${API_BASE}/due-cards`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_SRS_CARDS_FAILED', 'Không thể tải danh sách từ cần ôn SRS')
  }

  return response.json()
}

export async function getSrsSummary(token: string): Promise<SrsSummary> {
  const response = await fetch(`${API_BASE}/summary`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_SRS_SUMMARY_FAILED', 'Không thể tải thống kê ôn tập SRS')
  }

  return response.json()
}

export async function submitSrsReview(
  token: string,
  payload: { vocabularyId: number; result: 'REMEMBERED' | 'FORGOTTEN' }
): Promise<SrsReviewResult> {
  const response = await fetch(`${API_BASE}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'SUBMIT_SRS_REVIEW_FAILED', 'Không thể lưu kết quả ôn tập SRS')
  }

  return response.json()
}
