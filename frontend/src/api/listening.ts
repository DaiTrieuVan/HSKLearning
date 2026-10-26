import { ApiError } from './auth'

export interface ListeningOptionItem {
  id: number
  label: string
  content: string
}

export interface ListeningQuestionItem {
  questionId: number
  content: string
  audioUrl?: string
  pinyin?: string
  points: number
  sortOrder: number
  options: ListeningOptionItem[]
}

export interface ListeningPracticeItem {
  id: number
  title: string
  description?: string
  hskLevel?: number
  questionCount: number
  totalPoints: number
  primaryAudioUrl: string
  createdAt: string
}

export interface ListeningPracticeDetail {
  id: number
  title: string
  description?: string
  hskLevel?: number
  totalPoints: number
  primaryAudioUrl: string
  transcript?: string
  questions: ListeningQuestionItem[]
}

export interface ListeningAnswerItem {
  questionId: number
  selectedOptionId?: number | null
}

export interface SubmitListeningPracticePayload {
  answers: ListeningAnswerItem[]
}

export interface ListeningGradedQuestion {
  questionId: number
  content: string
  audioUrl?: string
  pinyin?: string
  explanation?: string
  selectedOptionId?: number
  correctOptionId: number
  isCorrect: boolean
  pointsEarned: number
  pointsPossible: number
  options: ListeningOptionItem[]
}

export interface ListeningPracticeResult {
  exerciseId: number
  title: string
  earnedPoints: number
  totalPoints: number
  totalQuestions: number
  correctAnswersCount: number
  scorePercentage: number
  passed: boolean
  transcript?: string
  gradedQuestions: ListeningGradedQuestion[]
  submittedAt: string
}

const API_BASE = '/api/listening-practices'

export async function getListeningPractices(
  token: string,
  hskLevel?: number
): Promise<ListeningPracticeItem[]> {
  const url = hskLevel ? `${API_BASE}?hskLevel=${hskLevel}` : API_BASE
  const response = await fetch(url, {
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
      data?.message || 'Không thể lấy danh sách bài luyện nghe',
      data?.fields
    )
  }

  return (data || []) as ListeningPracticeItem[]
}

export async function getListeningPracticeDetail(
  id: number,
  token: string
): Promise<ListeningPracticeDetail> {
  const response = await fetch(`${API_BASE}/${id}`, {
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
      data?.message || 'Không thể lấy chi tiết bài luyện nghe',
      data?.fields
    )
  }

  return data as ListeningPracticeDetail
}

export async function submitListeningPractice(
  id: number,
  payload: SubmitListeningPracticePayload,
  token: string
): Promise<ListeningPracticeResult> {
  const response = await fetch(`${API_BASE}/${id}/submit`, {
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
      data?.message || 'Không thể nộp bài luyện nghe',
      data?.fields
    )
  }

  return data as ListeningPracticeResult
}
