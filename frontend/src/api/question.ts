import { ApiError } from './auth'

export interface QuestionOptionItem {
  id: number
  content: string
  isCorrect: boolean
  sortOrder: number
  imageUrl?: string
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
  audioUrl?: string
  transcript?: string
  pinyin?: string
  imageUrl?: string
  hskLevel?: number
  parentId?: number
}

export interface CreateQuestionOptionPayload {
  content: string
  isCorrect: boolean
  imageUrl?: string
}

export interface CreateQuestionPayload {
  content: string
  explanation?: string
  type?: 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'
  payload?: string
  options: CreateQuestionOptionPayload[]
  audioUrl?: string
  transcript?: string
  pinyin?: string
  imageUrl?: string
  hskLevel?: number
  parentId?: number
}

export type QuestionFormat = 'HANZI_TO_MEANING' | 'MEANING_TO_HANZI' | 'HANZI_TO_PINYIN'

export interface QuickGeneratePreviewPayload {
  vocabSetId: number
  format?: QuestionFormat
}

export interface BatchCreateQuestionsPayload {
  questions: CreateQuestionPayload[]
}

export interface BlankAnswerItem {
  index: number
  correctAnswer: string
  acceptableAnswers: string[]
}

export interface CreateFillBlankQuestionPayload {
  content: string
  explanation?: string
  blanks: BlankAnswerItem[]
}

export interface MatchingPairItem {
  left: string
  right: string
}

export interface CreateMatchingQuestionPayload {
  content: string
  explanation?: string
  pairs: MatchingPairItem[]
}

export interface CreateOrderingQuestionPayload {
  content: string
  explanation?: string
  items: string[]
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

export async function createFillBlankQuestion(
  payload: CreateFillBlankQuestionPayload,
  token: string
): Promise<QuestionItem> {
  const response = await fetch(`${API_BASE}/fill-blank`, {
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
      data?.message || 'Không thể tạo câu hỏi điền từ',
      data?.fields
    )
  }

  return data as QuestionItem
}

export async function createMatchingQuestion(
  payload: CreateMatchingQuestionPayload,
  token: string
): Promise<QuestionItem> {
  const response = await fetch(`${API_BASE}/matching`, {
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
      data?.message || 'Không thể tạo câu hỏi nối từ',
      data?.fields
    )
  }

  return data as QuestionItem
}

export async function createOrderingQuestion(
  payload: CreateOrderingQuestionPayload,
  token: string
): Promise<QuestionItem> {
  const response = await fetch(`${API_BASE}/ordering`, {
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
      data?.message || 'Không thể tạo câu hỏi sắp xếp câu',
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

export interface UpdateQuestionPayload {
  content: string
  explanation?: string
  options?: CreateQuestionOptionPayload[]
  payload?: string
  audioUrl?: string
  transcript?: string
  pinyin?: string
  imageUrl?: string
  hskLevel?: number
  parentId?: number
}

export async function getQuestionDetail(id: number, token: string): Promise<QuestionItem> {
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
      data?.message || 'Không thể lấy chi tiết câu hỏi',
      data?.fields
    )
  }

  return data as QuestionItem
}

export async function updateQuestion(
  id: number,
  payload: UpdateQuestionPayload,
  token: string
): Promise<QuestionItem> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
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
      data?.message || 'Không thể cập nhật câu hỏi',
      data?.fields
    )
  }

  return data as QuestionItem
}

export async function deleteQuestion(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      data?.code || 'UNKNOWN_ERROR',
      data?.message || 'Không thể xóa câu hỏi',
      data?.fields
    )
  }
}

export interface ImportQuestionsResult {
  totalRows: number
  successCount: number
  skippedCount: number
  errors: string[]
  importedQuestions: QuestionItem[]
}

export async function importQuestions(file: File, token: string): Promise<ImportQuestionsResult> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/import`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'IMPORT_FAILED',
      data?.message || 'Không thể nhập câu hỏi từ file'
    )
  }

  return data as ImportQuestionsResult
}

export async function downloadQuestionExcelTemplate(token: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/template/excel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'DOWNLOAD_FAILED', 'Không thể tải file mẫu Excel')
  }
  return response.blob()
}

export async function downloadQuestionCsvTemplate(token: string): Promise<Blob> {
  const response = await fetch(`${API_BASE}/template/csv`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'DOWNLOAD_FAILED', 'Không thể tải file mẫu CSV')
  }
  return response.blob()
}

export interface BulkDeleteResult {
  requestedCount: number
  deletedCount: number
}

export interface QuestionSearchParams {
  keyword?: string
  type?: 'MCQ' | 'FILL' | 'MATCH' | 'ORDER'
  hskLevel?: number
  hasAudio?: boolean
  hasImage?: boolean
  page?: number
  size?: number
  sortBy?: string
  sortDir?: string
}

export interface QuestionPageResponse {
  content: QuestionItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export async function searchMyQuestions(
  params: QuestionSearchParams,
  token: string
): Promise<QuestionPageResponse> {
  const query = new URLSearchParams()
  if (params.keyword && params.keyword.trim()) {
    query.set('keyword', params.keyword.trim())
  }
  if (params.type) {
    query.set('type', params.type)
  }
  if (typeof params.hskLevel === 'number' && params.hskLevel > 0) {
    query.set('hskLevel', params.hskLevel.toString())
  }
  if (typeof params.hasAudio === 'boolean') {
    query.set('hasAudio', params.hasAudio.toString())
  }
  if (typeof params.hasImage === 'boolean') {
    query.set('hasImage', params.hasImage.toString())
  }
  if (typeof params.page === 'number') {
    query.set('page', params.page.toString())
  }
  if (typeof params.size === 'number') {
    query.set('size', params.size.toString())
  }
  if (params.sortBy) {
    query.set('sortBy', params.sortBy)
  }
  if (params.sortDir) {
    query.set('sortDir', params.sortDir)
  }

  const url = `${API_BASE}/search${query.toString() ? `?${query.toString()}` : ''}`
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
      data?.code || 'SEARCH_FAILED',
      data?.message || 'Không thể tìm kiếm câu hỏi'
    )
  }

  return data as QuestionPageResponse
}

export async function bulkDeleteQuestions(
  questionIds: number[],
  token: string
): Promise<BulkDeleteResult> {
  const response = await fetch(`${API_BASE}/bulk-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questionIds }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'BULK_DELETE_FAILED',
      data?.message || 'Không thể xóa các câu hỏi đã chọn'
    )
  }

  return data as BulkDeleteResult
}

export async function uploadQuestionMedia(file: File, token: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  let response: Response
  try {
    response = await fetch(`${API_BASE}/upload-media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
  } catch (err: any) {
    throw new ApiError(
      0,
      'NETWORK_ERROR',
      `Không thể kết nối đến máy chủ khi tải tệp: ${err?.message || 'Lỗi mạng hoặc dung lượng vượt mức cho phép'}`
    )
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const defaultMsg =
      response.status === 413
        ? 'Dung lượng tệp vượt quá mức cho phép của hệ thống (tối đa 50MB)'
        : 'Không thể tải lên tệp đa phương tiện'
    throw new ApiError(
      response.status,
      data?.code || (response.status === 413 ? 'FILE_TOO_LARGE' : 'UPLOAD_FAILED'),
      data?.message || defaultMsg,
      data?.fields
    )
  }

  return data.url as string
}
