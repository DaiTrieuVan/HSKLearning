import { ApiError } from './auth'

const API_BASE = '/api/v1'

export interface VocabFolder {
  id: number
  title: string
  description?: string
  color?: string
  vocabSetCount: number
  createdAt: string
}

export interface CreateVocabFolderPayload {
  title: string
  description?: string
  color?: string
}

export interface VocabSetSummary {
  id: number
  teacherId: number
  title: string
  description?: string
  folderId?: number | null
  color?: string
  isPublic: boolean
  shareCode?: string
  wordCount: number
  masteredCount: number
  createdAt: string
}

export interface CreateVocabSetPayload {
  title: string
  description?: string
  folderId?: number | null
  color?: string
  isPublic?: boolean
  vocabularyIds?: number[]
}

export interface CreateWordRow {
  hanzi: string
  pinyin?: string
  meaning: string
  partOfSpeech?: string
  exampleSentence?: string
  notes?: string
}

export interface BatchSaveWordsPayload {
  vocabSetId: number
  words: CreateWordRow[]
}

export interface StudentVocabWordItem {
  id: number
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech?: string
  audioUrl?: string
  exampleSentence?: string
  examplePinyin?: string
  exampleMeaning?: string
  isMastered: boolean
}

export interface StudentWordsStats {
  totalWords: number
  masteredWords: number
  unmasteredWords: number
  progressPercent: number
}

export interface StudentWordsPage {
  stats: StudentWordsStats
  items: StudentVocabWordItem[]
  page: number
  totalPages: number
  totalElements: number
}

export interface AiVocabAutofillItem {
  hanzi: string
  pinyin: string
  meaning: string
  partOfSpeech: string
  exampleSentence: string
  examplePinyin: string
  exampleMeaning: string
}

// Folders API
export async function getVocabFolders(token: string): Promise<VocabFolder[]> {
  const response = await fetch(`${API_BASE}/content/vocab-folders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_FOLDERS_FAILED', 'Không thể tải danh sách thư mục')
  }
  return response.json()
}

export async function createVocabFolder(payload: CreateVocabFolderPayload, token: string): Promise<VocabFolder> {
  const response = await fetch(`${API_BASE}/content/vocab-folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'CREATE_FOLDER_FAILED', 'Không thể tạo thư mục')
  }
  return response.json()
}

export async function updateVocabFolder(folderId: number, payload: CreateVocabFolderPayload, token: string): Promise<VocabFolder> {
  const response = await fetch(`${API_BASE}/content/vocab-folders/${folderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'UPDATE_FOLDER_FAILED', 'Không thể cập nhật thư mục')
  }
  return response.json()
}

export async function deleteVocabFolder(folderId: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/content/vocab-folders/${folderId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'DELETE_FOLDER_FAILED', 'Không thể xóa thư mục')
  }
}

// Vocab Sets API
export async function getMyVocabSets(token: string, folderId?: number): Promise<VocabSetSummary[]> {
  const url = folderId !== undefined
    ? `${API_BASE}/content/vocab-sets/my-sets?folderId=${folderId}`
    : `${API_BASE}/content/vocab-sets/my-sets`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_SETS_FAILED', 'Không thể tải danh sách bộ từ')
  }
  return response.json()
}

export async function getCommunityVocabSets(token: string): Promise<VocabSetSummary[]> {
  const response = await fetch(`${API_BASE}/content/vocab-sets/community`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_COMMUNITY_FAILED', 'Không thể tải bộ từ cộng đồng')
  }
  return response.json()
}

export async function createVocabSet(payload: CreateVocabSetPayload, token: string): Promise<VocabSetSummary> {
  const response = await fetch(`${API_BASE}/content/vocab-sets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'CREATE_SET_FAILED', 'Không thể tạo bộ từ mới')
  }
  return response.json()
}

export async function updateVocabSet(vocabSetId: number, payload: CreateVocabSetPayload, token: string): Promise<VocabSetSummary> {
  const response = await fetch(`${API_BASE}/content/vocab-sets/${vocabSetId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'UPDATE_SET_FAILED', 'Không thể cập nhật bộ từ')
  }
  return response.json()
}

export async function deleteVocabSet(vocabSetId: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/content/vocab-sets/${vocabSetId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'DELETE_SET_FAILED', 'Không thể xóa bộ từ')
  }
}

export async function toggleShareVocabSet(vocabSetId: number, token: string): Promise<VocabSetSummary> {
  const response = await fetch(`${API_BASE}/content/vocab-sets/${vocabSetId}/share`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'SHARE_SET_FAILED', 'Không thể cập nhật chia sẻ bộ từ')
  }
  return response.json()
}

export async function importSharedVocabSet(shareCode: string, token: string): Promise<VocabSetSummary> {
  const response = await fetch(`${API_BASE}/content/vocab-sets/import-shared?shareCode=${encodeURIComponent(shareCode)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'IMPORT_SET_FAILED', 'Mã chia sẻ không hợp lệ hoặc không tìm thấy bộ từ')
  }
  return response.json()
}

// Student Words List & Mastered API
export async function getStudentWords(
  token: string,
  params: { vocabSetId?: number; search?: string; status?: string; page?: number; size?: number } = {}
): Promise<StudentWordsPage> {
  const searchParams = new URLSearchParams()
  if (params.vocabSetId !== undefined && params.vocabSetId !== null) {
    searchParams.set('vocabSetId', String(params.vocabSetId))
  }
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.page !== undefined) searchParams.set('page', String(params.page))
  if (params.size !== undefined) searchParams.set('size', String(params.size))

  const url = `${API_BASE}/content/vocabularies/my-words?${searchParams.toString()}`
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_WORDS_FAILED', 'Không thể tải danh sách từ vựng')
  }
  return response.json()
}

export async function toggleWordMastered(vocabularyId: number, token: string): Promise<{ vocabularyId: number; isMastered: boolean }> {
  const response = await fetch(`${API_BASE}/content/vocabularies/${vocabularyId}/toggle-mastered`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'TOGGLE_MASTERED_FAILED', 'Không thể cập nhật trạng thái thuộc từ')
  }
  return response.json()
}

export async function batchSaveWords(payload: BatchSaveWordsPayload, token: string): Promise<{ addedCount: number; totalRequested: number }> {
  const response = await fetch(`${API_BASE}/content/vocabularies/batch-save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'BATCH_SAVE_FAILED', 'Không thể lưu danh sách từ vựng')
  }
  return response.json()
}

// AI Assistants API
export async function aiAutofillWords(words: string[], token: string): Promise<AiVocabAutofillItem[]> {
  const response = await fetch(`${API_BASE}/ai-assistant/vocab/autofill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ words }),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'AI_AUTOFILL_FAILED', 'Trợ lý AI tự động điền từ vựng không phản hồi')
  }
  return response.json()
}

export async function aiGenerateByTopic(topic: string, count = 10, token: string): Promise<AiVocabAutofillItem[]> {
  const response = await fetch(`${API_BASE}/ai-assistant/vocab/generate-by-topic`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ topic, count }),
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'AI_GENERATE_FAILED', 'Trợ lý AI sinh từ vựng theo chủ đề không phản hồi')
  }
  return response.json()
}
