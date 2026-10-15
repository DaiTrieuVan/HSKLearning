import { ApiError } from './auth'

export interface VocabLessonRef {
  lessonId: number
  lessonTitle: string
  lessonOrderIndex: number
  levelId?: number
  levelCode?: string
}

export interface VocabSearchResult {
  id: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string
  audioUrl?: string
  exampleSentence?: string
  examplePinyin?: string
  exampleMeaning?: string
  lessons: VocabLessonRef[]
}

const API_BASE = '/api/v1/learning/vocabularies'

export async function searchVocabularies(
  token: string,
  query: string
): Promise<VocabSearchResult[]> {
  const params = new URLSearchParams()
  if (query) params.append('q', query)

  const response = await fetch(`${API_BASE}/search?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'SEARCH_VOCAB_FAILED', 'Không thể tra cứu từ vựng')
  }

  return response.json()
}
