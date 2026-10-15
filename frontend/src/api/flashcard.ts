import { ApiError } from './auth'

export interface FlashcardItem {
  id: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string
  audioUrl?: string
  exampleSentence?: string
  examplePinyin?: string
  exampleMeaning?: string
  lastResult?: 'REMEMBERED' | 'FORGOTTEN' | null
}

export interface FlashcardReviewCommand {
  vocabularyId: number
  result: 'REMEMBERED' | 'FORGOTTEN'
}

export interface FlashcardReviewResponse {
  vocabularyId: number
  result: 'REMEMBERED' | 'FORGOTTEN'
  repetitionLevel: number
  intervalDays: number
  updatedAt: string
}

export interface FlashcardSessionSummary {
  totalCards: number
  rememberedCount: number
  forgottenCount: number
  unreviewedCount: number
  forgottenVocabularyIds: number[]
}

const API_BASE = '/api/v1/learning/flashcards'

export async function getFlashcards(
  token: string,
  options: { lessonId?: number; vocabSetId?: number; onlyForgotten?: boolean }
): Promise<FlashcardItem[]> {
  const params = new URLSearchParams()
  if (options.lessonId) params.append('lessonId', options.lessonId.toString())
  if (options.vocabSetId) params.append('vocabSetId', options.vocabSetId.toString())
  if (options.onlyForgotten) params.append('onlyForgotten', 'true')

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_FLASHCARDS_FAILED', 'Không thể tải danh sách thẻ flashcard')
  }

  return response.json()
}

export async function reviewFlashcard(
  token: string,
  command: FlashcardReviewCommand
): Promise<FlashcardReviewResponse> {
  const response = await fetch(`${API_BASE}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'REVIEW_FLASHCARD_FAILED', 'Không thể lưu kết quả ôn tập từ vựng')
  }

  return response.json()
}

export async function getFlashcardSummary(
  token: string,
  options: { lessonId?: number; vocabSetId?: number }
): Promise<FlashcardSessionSummary> {
  const params = new URLSearchParams()
  if (options.lessonId) params.append('lessonId', options.lessonId.toString())
  if (options.vocabSetId) params.append('vocabSetId', options.vocabSetId.toString())

  const response = await fetch(`${API_BASE}/summary?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_SUMMARY_FAILED', 'Không thể tải tổng kết lượt học flashcard')
  }

  return response.json()
}
