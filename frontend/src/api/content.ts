import { ApiError } from './auth'

export interface HskLevelItem {
  id: number
  code: string
  title: string
  levelNumber: number
  description?: string
  targetVocabCount: number
  hidden: boolean
}

export interface LessonItem {
  id: number
  hskLevelId: number
  title: string
  description?: string
  sortOrder: number
  hidden: boolean
  vocabCount: number
  grammarCount: number
}

export interface VocabularyItem {
  id: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string
  audioUrl?: string
  exampleSentence?: string
  examplePinyin?: string
  exampleMeaning?: string
  hskLevelId?: number
  ownerId?: number
  isPrivate: boolean
  hidden: boolean
}

export interface GrammarExampleItem {
  id: number
  hanzi: string
  pinyin: string
  meaning: string
  sortOrder: number
}

export interface GrammarPointItem {
  id: number
  lessonId: number
  title: string
  structure?: string
  explanation: string
  sortOrder: number
  examples: GrammarExampleItem[]
}

export interface VocabSetItem {
  id: number
  teacherId: number
  title: string
  description?: string
  itemCount: number
  createdAt: string
}

export interface ImportVocabResult {
  totalRows: number
  successCount: number
  skippedCount: number
  errors: string[]
}

const API_BASE = '/api/v1/content'

export async function getHskLevels(): Promise<HskLevelItem[]> {
  const response = await fetch(`${API_BASE}/levels`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_LEVELS_FAILED', 'Không thể tải danh sách cấp độ HSK')
  }
  return response.json()
}

export async function getLessonsByLevel(levelId: number, token?: string): Promise<LessonItem[]> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/levels/${levelId}/lessons`, { headers })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_LESSONS_FAILED', 'Không thể tải bài học')
  }
  return response.json()
}

export async function createLesson(
  payload: { hskLevelId: number; title: string; description?: string; sortOrder?: number },
  token: string
): Promise<LessonItem> {
  const response = await fetch(`${API_BASE}/lessons`, {
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
    throw new ApiError(response.status, data?.code || 'ERROR', data?.message || 'Không thể tạo bài học')
  }
  return data
}

export async function getLessonVocabularies(lessonId: number): Promise<VocabularyItem[]> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/vocabularies`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_VOCAB_FAILED', 'Không thể tải từ vựng bài học')
  }
  return response.json()
}

export async function getLessonGrammar(lessonId: number): Promise<GrammarPointItem[]> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/grammar`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_GRAMMAR_FAILED', 'Không thể tải điểm ngữ pháp bài học')
  }
  return response.json()
}

export async function createVocabulary(
  payload: {
    hanzi: string
    pinyin: string
    meaning: string
    partOfSpeech?: string
    exampleSentence?: string
    examplePinyin?: string
    exampleMeaning?: string
    hskLevelId?: number
    isPrivate?: boolean
  },
  token: string
): Promise<VocabularyItem> {
  const response = await fetch(`${API_BASE}/vocabularies`, {
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
    throw new ApiError(response.status, data?.code || 'ERROR', data?.message || 'Không thể tạo từ vựng')
  }
  return data
}

export async function addVocabularyToLesson(
  lessonId: number,
  vocabularyId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/vocabularies/${vocabularyId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'ADD_VOCAB_FAILED', 'Không thể gắn từ vựng vào bài học')
  }
}

export async function uploadAudio(file: File, token: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/audio`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'UPLOAD_FAILED', data?.message || 'Không thể tải lên tệp âm thanh')
  }
  return data.audioUrl
}

export async function importVocabularies(
  file: File,
  levelId: number,
  isPrivate: boolean,
  token: string
): Promise<ImportVocabResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/vocabularies/import?levelId=${levelId}&isPrivate=${isPrivate}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(response.status, data?.code || 'IMPORT_FAILED', data?.message || 'Không thể nhập từ vựng')
  }
  return data
}

export async function searchVocabularies(query?: string, token?: string): Promise<VocabularyItem[]> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const url = query ? `${API_BASE}/vocabularies?query=${encodeURIComponent(query)}` : `${API_BASE}/vocabularies`
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_VOCAB_FAILED', 'Không thể tải danh sách từ vựng')
  }
  return response.json()
}

export async function getMyPrivateVocabularies(token: string): Promise<VocabularyItem[]> {
  const response = await fetch(`${API_BASE}/vocabularies/my-private`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_PRIVATE_VOCAB_FAILED', 'Không thể tải từ vựng riêng')
  }
  return response.json()
}

export async function getMyVocabSets(token: string): Promise<VocabSetItem[]> {
  const response = await fetch(`${API_BASE}/vocab-sets`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_VOCAB_SETS_FAILED', 'Không thể tải danh sách bộ từ vựng')
  }
  return response.json()
}

export async function createVocabSet(
  payload: { title: string; description?: string; vocabularyIds?: number[] },
  token: string
): Promise<VocabSetItem> {
  const response = await fetch(`${API_BASE}/vocab-sets`, {
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
    throw new ApiError(response.status, data?.code || 'ERROR', data?.message || 'Không thể tạo bộ từ vựng')
  }
  return data
}

export async function getVocabSetItems(vocabSetId: number, token: string): Promise<VocabularyItem[]> {
  const response = await fetch(`${API_BASE}/vocab-sets/${vocabSetId}/vocabularies`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_VOCAB_SET_ITEMS_FAILED', 'Không thể tải từ vựng trong bộ')
  }
  return response.json()
}

export async function addVocabularyToVocabSet(
  vocabSetId: number,
  vocabularyId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/vocab-sets/${vocabSetId}/vocabularies/${vocabularyId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'ADD_VOCAB_TO_SET_FAILED', 'Không thể thêm từ vào bộ từ vựng')
  }
}

export async function removeVocabularyFromVocabSet(
  vocabSetId: number,
  vocabularyId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/vocab-sets/${vocabSetId}/vocabularies/${vocabularyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'REMOVE_VOCAB_FROM_SET_FAILED', 'Không thể xóa từ khỏi bộ từ vựng')
  }
}

export async function deleteVocabSet(vocabSetId: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/vocab-sets/${vocabSetId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'DELETE_VOCAB_SET_FAILED', 'Không thể xóa bộ từ vựng')
  }
}

export async function assignVocabSetToClass(
  classId: number,
  vocabSetId: number,
  token: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/classes/${classId}/vocab-sets/${vocabSetId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'ASSIGN_VOCAB_SET_FAILED', 'Không thể gán bộ từ vựng cho lớp học')
  }
}

export async function getClassVocabSets(classId: number, token: string): Promise<VocabSetItem[]> {
  const response = await fetch(`${API_BASE}/classes/${classId}/vocab-sets`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_CLASS_VOCAB_SETS_FAILED', 'Không thể tải bộ từ vựng của lớp')
  }
  return response.json()
}
