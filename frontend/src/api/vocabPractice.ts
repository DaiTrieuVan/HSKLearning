import { ApiError } from './auth'

export type QuizMode = 'HANZI_TO_MEANING' | 'MEANING_TO_HANZI' | 'MIXED' | 'CONTEXT'

export interface QuizOptionDto {
  id: number
  label: string
  subLabel?: string | null
  correct: boolean
}

export interface QuizQuestionDto {
  vocabularyId: number
  mode: 'HANZI_TO_MEANING' | 'MEANING_TO_HANZI' | 'CONTEXT'
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string | null
  audioUrl?: string | null
  exampleSentence?: string | null
  examplePinyin?: string | null
  exampleMeaning?: string | null
  maskedSentence?: string | null
  options: QuizOptionDto[]
}

export interface QuizSessionResponse {
  vocabSetId?: number | null
  vocabSetTitle: string
  requestedMode: QuizMode
  totalQuestions: number
  questions: QuizQuestionDto[]
}

export interface QuizAnswerSubmitItem {
  vocabularyId: number
  correct: boolean
}

export interface QuizSubmitRequest {
  vocabSetId?: number
  mode: QuizMode
  durationSeconds: number
  idempotencyKey?: string
  answers: QuizAnswerSubmitItem[]
}

export interface QuizSubmitResponse {
  sessionId: number
  correctCount: number
  totalCount: number
  accuracyPercent: number
  xpEarned: number
  totalUserXp: number
  duplicateSubmission: boolean
  completedAt: string
}

export interface PracticeSessionHistoryItem {
  id: number
  vocabSetId?: number | null
  vocabSetTitle: string
  gameType: string
  gameMode: string
  correctCount: number
  totalCount: number
  accuracyPercent: number
  xpEarned: number
  durationSeconds: number
  completedAt: string
}

export interface GenerateQuizParams {
  lessonId?: number
  vocabSetId?: number
  filterStatus?: 'ALL' | 'UNMASTERED' | 'MASTERED'
  order?: 'RANDOM' | 'DEFAULT'
  limit?: number
  mode: QuizMode
}

const API_BASE = '/api/v1/learning/practice'

export async function generateQuizSession(
  token: string,
  params: GenerateQuizParams
): Promise<QuizSessionResponse> {
  const qs = new URLSearchParams()
  if (params.lessonId) qs.append('lessonId', params.lessonId.toString())
  if (params.vocabSetId) qs.append('vocabSetId', params.vocabSetId.toString())
  if (params.filterStatus) qs.append('filterStatus', params.filterStatus)
  if (params.order) qs.append('order', params.order)
  if (params.limit) qs.append('limit', params.limit.toString())
  qs.append('mode', params.mode)

  const response = await fetch(`${API_BASE}/quiz?${qs.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_QUIZ_FAILED', 'Không thể tạo bộ câu hỏi trắc nghiệm')
  }

  return response.json()
}

export async function submitQuizSession(
  token: string,
  payload: QuizSubmitRequest
): Promise<QuizSubmitResponse> {
  const response = await fetch(`${API_BASE}/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'SUBMIT_QUIZ_FAILED', 'Không thể lưu kết quả lượt chơi trắc nghiệm')
  }

  return response.json()
}

export async function getPracticeHistory(
  token: string,
  limit = 10
): Promise<PracticeSessionHistoryItem[]> {
  const response = await fetch(`${API_BASE}/history?limit=${limit}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_HISTORY_FAILED', 'Không thể tải lịch sử luyện tập')
  }

  return response.json()
}
