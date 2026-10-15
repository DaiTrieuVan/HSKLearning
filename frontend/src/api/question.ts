import { ApiError } from './auth'

export interface QuestionOptionItem {
  id: number
  content: string
  isCorrect: boolean
  sortOrder: number
}

export interface QuestionItem {
  id: number
  ownerId: number
  type: 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'
  content: string
  explanation?: string
  payload?: string
  options: QuestionOptionItem[]
  createdAt: string
}

export interface CreateQuestionOptionPayload {
  content: string
  isCorrect: boolean
}

export interface CreateQuestionPayload {
  content: string
  explanation?: string
  type?: 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'
  payload?: string
  options: CreateQuestionOptionPayload[]
}

export type QuestionFormat = 'HANZI_TO_MEANING' | 'MEANING_TO_HANZI' | 'HANZI_TO_PINYIN'

export interface QuickGeneratePreviewPayload {
  vocabSetId: number
  format?: QuestionFormat
}

export interface BatchCreateQuestionsPayload {
  questions: CreateQuestionPayload[]
}

const API_BASE = '/api/questions'

export async function createMultipleChoiceQuestion(
  payload: CreateQuestionPayload,
  token: string
): Promise<QuestionItem> {
  const response = await fetch(`${API_BASE}/multiple-choice`, {
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
      data?.message || 'Không thể tạo câu hỏi trắc nghiệm',
      data?.fields
    )
  }

  return data as QuestionItem
}

export async function quickGeneratePreview(
  payload: QuickGeneratePreviewPayload,
  token: string
): Promise<CreateQuestionPayload[]> {
  const response = await fetch(`${API_BASE}/quick-generate/preview`, {
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
      data?.message || 'Không thể sinh câu hỏi tự động',
      data?.fields
    )
  }

  return data as CreateQuestionPayload[]
}

export async function batchCreateQuestions(
  payload: BatchCreateQuestionsPayload,
  token: string
): Promise<QuestionItem[]> {
  const response = await fetch(`${API_BASE}/batch`, {
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
      data?.message || 'Không thể lưu danh sách câu hỏi',
      data?.fields
    )
  }

  return data as QuestionItem[]
}

export async function getMyQuestions(token: string): Promise<QuestionItem[]> {
  const response = await fetch(`${API_BASE}/my`, {
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
      data?.message || 'Không thể lấy danh sách câu hỏi',
      data?.fields
    )
  }

  return data as QuestionItem[]
}
