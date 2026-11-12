import { throwApiErrorFromResponse } from './auth'

export type QuizMode = 'HANZI_TO_MEANING' | 'MEANING_TO_HANZI' | 'MIXED' | 'CONTEXT'
export type MatchMode = 'MATCH_MEANING' | 'MATCH_PINYIN'
export type WritingMode = 'TRACE' | 'RECALL' | 'PDF'
export type TypingMode = 'WORD' | 'PINYIN'

export interface TypingWordItemDto {
  vocabularyId: number
  hanzi: string
  pinyin: string
  pinyinSearch?: string | null
  meaning: string
  partOfSpeech?: string | null
  audioUrl?: string | null
  exampleSentence?: string | null
  maskedExampleSentence?: string | null
  examplePinyin?: string | null
  exampleMeaning?: string | null
}

export interface TypingSessionResponse {
  vocabSetId?: number | null
  vocabSetTitle: string
  mode: TypingMode
  totalQuestions: number
  items: TypingWordItemDto[]
}

export interface TypingResultItemRequest {
  vocabularyId: number
  correct: boolean
  hintsUsed: number
  markMastered: boolean
}

export interface TypingSubmitRequest {
  vocabSetId?: number
  mode: TypingMode
  durationSeconds: number
  idempotencyKey?: string
  results: TypingResultItemRequest[]
}

export interface TypingSubmitResponse {
  sessionId: number
  correctCount: number
  totalCount: number
  accuracyPercent: number
  xpEarned: number
  baseXp: number
  completionBonusXp: number
  totalUserXp: number
  duplicateSubmission: boolean
  completedAt: string
}

export interface GenerateTypingParams {
  lessonId?: number
  vocabSetId?: number
  filterStatus?: 'ALL' | 'UNMASTERED' | 'MASTERED'
  order?: 'RANDOM' | 'DEFAULT'
  limit?: number
  mode: TypingMode
}

export interface WritingCharStrokeDto {
  hanzi: string
  strokeCount: number
  strokes: string[]
  medians: number[][][]
  supported: boolean
}

export interface WritingWordItemDto {
  vocabularyId: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string | null
  audioUrl?: string | null
  exampleSentence?: string | null
  examplePinyin?: string | null
  exampleMeaning?: string | null
  characters: WritingCharStrokeDto[]
}

export interface WritingSessionResponse {
  vocabSetId?: number | null
  vocabSetTitle: string
  mode: WritingMode
  totalWords: number
  words: WritingWordItemDto[]
}

export interface WritingResultItemRequest {
  vocabularyId: number
  completedCleanly: boolean
  mistakesCount: number
  markMastered: boolean
}

export interface WritingSubmitRequest {
  vocabSetId?: number
  mode: 'TRACE' | 'RECALL'
  durationSeconds: number
  idempotencyKey?: string
  results: WritingResultItemRequest[]
}

export interface WritingSubmitResponse {
  sessionId: number
  correctCount: number
  totalCount: number
  accuracyPercent: number
  xpEarned: number
  baseXp: number
  completionBonusXp: number
  totalUserXp: number
  duplicateSubmission: boolean
  completedAt: string
}

export interface GenerateWritingParams {
  lessonId?: number
  vocabSetId?: number
  filterStatus?: 'ALL' | 'UNMASTERED' | 'MASTERED'
  order?: 'RANDOM' | 'DEFAULT'
  limit?: number
  mode: WritingMode
}

export interface MatchCardSideDto {
  vocabularyId: number
  primaryText: string
  secondaryText?: string | null
}

export interface MatchPairItemDto {
  vocabularyId: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string | null
  audioUrl?: string | null
}

export interface MatchRoundDto {
  roundIndex: number
  pairsCount: number
  pairs: MatchPairItemDto[]
  leftCards: MatchCardSideDto[]
  rightCards: MatchCardSideDto[]
}

export interface MatchSessionResponse {
  vocabSetId?: number | null
  vocabSetTitle: string
  mode: MatchMode
  totalPairs: number
  maxHearts: number
  rounds: MatchRoundDto[]
}

export interface MatchResultItemRequest {
  vocabularyId: number
  matched: boolean
  mistakesCount: number
  markMastered: boolean
}

export interface MatchSubmitRequest {
  vocabSetId?: number
  mode: MatchMode
  durationSeconds: number
  remainingHearts: number
  timedOut: boolean
  idempotencyKey?: string
  results: MatchResultItemRequest[]
}

export interface MatchSubmitResponse {
  sessionId: number
  correctCount: number
  totalCount: number
  accuracyPercent: number
  xpEarned: number
  baseXp: number
  completionBonusXp: number
  totalUserXp: number
  duplicateSubmission: boolean
  completedAt: string
}

export interface GenerateMatchParams {
  lessonId?: number
  vocabSetId?: number
  filterStatus?: 'ALL' | 'UNMASTERED' | 'MASTERED'
  order?: 'RANDOM' | 'DEFAULT'
  limit?: number
  mode: MatchMode
}

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
    await throwApiErrorFromResponse(response, 'FETCH_QUIZ_FAILED', 'Không thể tạo bộ câu hỏi trắc nghiệm')
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
    await throwApiErrorFromResponse(response, 'SUBMIT_QUIZ_FAILED', 'Không thể lưu kết quả lượt chơi trắc nghiệm')
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
    await throwApiErrorFromResponse(response, 'FETCH_HISTORY_FAILED', 'Không thể tải lịch sử luyện tập')
  }

  return response.json()
}

export async function generateMatchSession(
  token: string,
  params: GenerateMatchParams
): Promise<MatchSessionResponse> {
  const qs = new URLSearchParams()
  if (params.lessonId) qs.append('lessonId', params.lessonId.toString())
  if (params.vocabSetId) qs.append('vocabSetId', params.vocabSetId.toString())
  if (params.filterStatus) qs.append('filterStatus', params.filterStatus)
  if (params.order) qs.append('order', params.order)
  if (params.limit) qs.append('limit', params.limit.toString())
  qs.append('mode', params.mode)

  const response = await fetch(`${API_BASE}/match?${qs.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_MATCH_FAILED', 'Không thể tạo trò chơi Nối từ')
  }

  return response.json()
}

export async function submitMatchSession(
  token: string,
  payload: MatchSubmitRequest
): Promise<MatchSubmitResponse> {
  const response = await fetch(`${API_BASE}/match/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'SUBMIT_MATCH_FAILED', 'Không thể lưu kết quả lượt chơi Nối từ')
  }

  return response.json()
}

export async function generateWritingSession(
  token: string,
  params: GenerateWritingParams
): Promise<WritingSessionResponse> {
  const qs = new URLSearchParams()
  if (params.lessonId) qs.append('lessonId', params.lessonId.toString())
  if (params.vocabSetId) qs.append('vocabSetId', params.vocabSetId.toString())
  if (params.filterStatus) qs.append('filterStatus', params.filterStatus)
  if (params.order) qs.append('order', params.order)
  if (params.limit) qs.append('limit', params.limit.toString())
  qs.append('mode', params.mode)

  const response = await fetch(`${API_BASE}/writing?${qs.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_WRITING_FAILED', 'Không thể tải danh sách từ luyện viết chữ Hán')
  }

  return response.json()
}

export async function submitWritingSession(
  token: string,
  payload: WritingSubmitRequest
): Promise<WritingSubmitResponse> {
  const response = await fetch(`${API_BASE}/writing/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'SUBMIT_WRITING_FAILED', 'Không thể lưu kết quả luyện viết chữ Hán')
  }

  return response.json()
}

export async function generateTypingSession(
  token: string,
  params: GenerateTypingParams
): Promise<TypingSessionResponse> {
  const qs = new URLSearchParams()
  if (params.lessonId) qs.append('lessonId', params.lessonId.toString())
  if (params.vocabSetId) qs.append('vocabSetId', params.vocabSetId.toString())
  if (params.filterStatus) qs.append('filterStatus', params.filterStatus)
  if (params.order) qs.append('order', params.order)
  if (params.limit) qs.append('limit', params.limit.toString())
  qs.append('mode', params.mode)

  const response = await fetch(`${API_BASE}/typing?${qs.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_TYPING_FAILED', 'Không thể tải danh sách từ luyện gõ')
  }

  return response.json()
}

export async function submitTypingSession(
  token: string,
  payload: TypingSubmitRequest
): Promise<TypingSubmitResponse> {
  const response = await fetch(`${API_BASE}/typing/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'SUBMIT_TYPING_FAILED', 'Không thể lưu kết quả luyện gõ từ')
  }

  return response.json()
}

