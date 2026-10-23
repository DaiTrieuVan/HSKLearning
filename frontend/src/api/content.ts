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

export interface LessonStudyData {
  id: number
  hskLevelId: number
  levelTitle?: string
  title: string
  description?: string
  sortOrder: number
  hidden: boolean
  vocabularies: VocabularyItem[]
  grammarPoints: GrammarPointItem[]
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

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
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

export async function getLessonVocabularies(lessonId: number, token?: string): Promise<VocabularyItem[]> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/lessons/${lessonId}/vocabularies`, { headers })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_VOCAB_FAILED', 'Không thể tải từ vựng bài học')
  }
  return response.json()
}

export async function getLessonGrammar(lessonId: number, token?: string): Promise<GrammarPointItem[]> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/lessons/${lessonId}/grammar`, { headers })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_GRAMMAR_FAILED', 'Không thể tải điểm ngữ pháp bài học')
  }
  return response.json()
}

export async function getLessonStudy(lessonId: number, token?: string): Promise<LessonStudyData> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${API_BASE}/lessons/${lessonId}/study`, { headers })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'FETCH_LESSON_STUDY_FAILED',
      data?.message || 'Không thể tải nội dung bài học'
    )
  }
  return data
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

export async function createOrAddVocabularyToLesson(
  lessonId: number,
  payload: {
    hanzi: string
    pinyin: string
    meaning: string
    partOfSpeech?: string
    audioUrl?: string
    exampleSentence?: string
    examplePinyin?: string
    exampleMeaning?: string
    hskLevelId?: number
    isPrivate?: boolean
  },
  token: string
): Promise<VocabularyItem> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/vocabularies/create-or-add`, {
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
    throw new ApiError(response.status, data?.code || 'ERROR', data?.message || 'Không thể thêm từ vựng vào bài học')
  }
  return data
}

export async function getVocabularies(query?: string, token?: string): Promise<VocabularyItem[]> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const url = query ? `${API_BASE}/vocabularies?query=${encodeURIComponent(query)}` : `${API_BASE}/vocabularies`
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_VOCAB_FAILED', 'Không thể tải danh sách từ vựng')
  }
  return response.json()
}

export async function deleteVocabulary(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/vocabularies/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok && response.status !== 204) {
    throw new ApiError(response.status, 'DELETE_VOCAB_FAILED', 'Không thể xóa từ vựng')
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

export interface SearchPrivateVocabParams {
  keyword?: string
  partOfSpeech?: string
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export async function searchMyPrivateVocabularies(
  token: string,
  params: SearchPrivateVocabParams = {}
): Promise<PageResponse<VocabularyItem>> {
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.partOfSpeech) queryParams.set('partOfSpeech', params.partOfSpeech)
  if (params.page !== undefined) queryParams.set('page', params.page.toString())
  if (params.size !== undefined) queryParams.set('size', params.size.toString())
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortDir) queryParams.set('sortDir', params.sortDir)

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  }

  let data: any = null

  // 1. Try paginated endpoint first
  try {
    const searchUrl = `${API_BASE}/vocabularies/my-private/search?${queryParams.toString()}`
    const res = await fetch(searchUrl, { headers })
    if (res.ok) {
      data = await res.json()
    }
  } catch {
    // continue to fallback
  }

  // 2. Fallback to base endpoint if search endpoint returned non-ok (e.g. 404 before server restart)
  if (!data) {
    const fallbackUrl = `${API_BASE}/vocabularies/my-private?${queryParams.toString()}`
    const res = await fetch(fallbackUrl, { headers })
    if (!res.ok) {
      throw new ApiError(res.status, 'FETCH_PRIVATE_VOCAB_FAILED', 'Không thể tải danh sách từ vựng riêng')
    }
    data = await res.json()
  }

  // If backend returns PageResponse format
  if (data && Array.isArray(data.content)) {
    return data as PageResponse<VocabularyItem>
  }

  // If backend returns Array format, perform client-side filtering and pagination seamlessly
  if (Array.isArray(data)) {
    let list: VocabularyItem[] = [...data]
    if (params.keyword && params.keyword.trim()) {
      const kw = params.keyword.trim().toLowerCase()
      list = list.filter(
        (w) =>
          w.hanzi.toLowerCase().includes(kw) ||
          w.pinyin.toLowerCase().includes(kw) ||
          w.meaning.toLowerCase().includes(kw)
      )
    }
    if (params.partOfSpeech && params.partOfSpeech !== 'Tất cả loại từ') {
      list = list.filter((w) => w.partOfSpeech === params.partOfSpeech)
    }

    const sortDir = params.sortDir || 'desc'
    if (params.sortBy === 'hanzi') {
      list.sort((a, b) =>
        sortDir === 'asc' ? a.hanzi.localeCompare(b.hanzi) : b.hanzi.localeCompare(a.hanzi)
      )
    } else if (params.sortBy === 'pinyin') {
      list.sort((a, b) =>
        sortDir === 'asc' ? a.pinyin.localeCompare(b.pinyin) : b.pinyin.localeCompare(a.pinyin)
      )
    } else {
      list.sort((a, b) => (sortDir === 'asc' ? a.id - b.id : b.id - a.id))
    }

    const pageNum = params.page || 0
    const pageSizeNum = params.size || 20
    const start = pageNum * pageSizeNum
    const pagedItems = list.slice(start, start + pageSizeNum)

    return {
      content: pagedItems,
      totalElements: list.length,
      totalPages: Math.ceil(list.length / pageSizeNum),
      size: pageSizeNum,
      number: pageNum,
    }
  }

  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: params.size || 20,
    number: params.page || 0,
  }
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

export interface BatchAddVocabSetItemsResponse {
  addedCount: number
  totalRequested: number
}

export async function addVocabulariesBatchToVocabSet(
  vocabSetId: number,
  vocabularyIds: number[],
  token: string
): Promise<BatchAddVocabSetItemsResponse> {
  try {
    const response = await fetch(`${API_BASE}/vocab-sets/${vocabSetId}/vocabularies/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vocabularyIds }),
    })
    if (response.ok) {
      return await response.json()
    }
  } catch {
    // If backend endpoint fails or dev server didn't reload, fallback to single calls
  }

  // Graceful fallback
  let added = 0
  for (const id of vocabularyIds) {
    try {
      await addVocabularyToVocabSet(vocabSetId, id, token)
      added++
    } catch {
      // already exists or error
    }
  }
  return { addedCount: added, totalRequested: vocabularyIds.length }
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
