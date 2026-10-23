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


