import { ApiError } from './auth'

export interface Hsk30SharedOptionItem {
  key: string
  imageUrl?: string
  text?: string
  pinyin?: string
  description?: string
}

export interface Hsk30QuestionOptionItem {
  id: number
  label: string
  content: string
  imageUrl?: string
}

export interface Hsk30QuestionItem {
  questionId: number
  questionNumber: number
  content: string
  audioUrl?: string
  pinyin?: string
  points: number
  options: Hsk30QuestionOptionItem[]
  correctKey?: string
  correctOptionId?: number
  explanation?: string
}

export interface Hsk30PartItem {
  groupId: number
  partNumber: number
  title: string
  instruction: string
  formatCode: string
  sharedData?: string
  sharedOptions?: Hsk30SharedOptionItem[]
  passage?: string
  questions: Hsk30QuestionItem[]
}

export interface Hsk30SectionItem {
  sectionId: number
  name: string
  sortOrder: number
  parts: Hsk30PartItem[]
}

export interface Hsk30ExamListItem {
  id: number
  title: string
  description: string
  hskLevel: number
  hskStandard: string
  timeLimitMinutes: number
  totalPoints: number
  passingScore: number
  totalQuestions: number
  createdAt: string
}

export interface Hsk30ExamDetail {
  id: number
  title: string
  description: string
  hskLevel: number
  hskStandard: string
  timeLimitMinutes: number
  totalPoints: number
  passingScore: number
  totalQuestions: number
  sections: Hsk30SectionItem[]
  createdAt: string
}

export interface Hsk30StudentAnswerItem {
  questionId: number
  selectedOptionId?: number | null
  selectedKey?: string | null
}

export interface Hsk30SubmitExamPayload {
  answers: Hsk30StudentAnswerItem[]
  timeSpentSeconds?: number
}

export interface Hsk30GradedQuestion {
  questionId: number
  questionNumber: number
  content: string
  audioUrl?: string
  pinyin?: string
  selectedKey?: string
  correctKey?: string
  selectedOptionId?: number
  correctOptionId?: number
  correct: boolean
  earnedPoints: number
  maxPoints: number
  explanation?: string
}

export interface Hsk30GradedPart {
  groupId: number
  partNumber: number
  title: string
  instruction: string
  formatCode: string
  sharedData?: string
  sharedOptions?: Hsk30SharedOptionItem[]
  passage?: string
  questions: Hsk30GradedQuestion[]
  correctCount: number
  totalCount: number
  partScore: number
}

export interface Hsk30GradedSection {
  sectionId: number
  name: string
  skillType: string
  sortOrder: number
  parts: Hsk30GradedPart[]
  correctCount: number
  totalCount: number
  score: number
  maxScore: number
}

export interface Hsk30ExamResult {
  examId: number
  examTitle: string
  hskLevel: number
  hskStandard: string
  totalScore: number
  maxScore: number
  passingScore: number
  passed: boolean
  listeningScore: number
  readingScore: number
  totalCorrect: number
  totalQuestions: number
  timeSpentSeconds?: number
  sections: Hsk30GradedSection[]
  submittedAt: string
}

const API_BASE = '/api/hsk30/exams'

export async function getHsk30Exams(token: string, hskLevel = 1): Promise<Hsk30ExamListItem[]> {
  const response = await fetch(`${API_BASE}?hskLevel=${hskLevel}`, {
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
      data?.message || 'Không thể lấy danh sách đề thi HSK 3.0',
      data?.fields
    )
  }
  return (data || []) as Hsk30ExamListItem[]
}

export async function getHsk30ExamDetail(id: number, token: string): Promise<Hsk30ExamDetail> {
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
      data?.message || 'Không thể lấy chi tiết đề thi HSK 3.0',
      data?.fields
    )
  }
  return data as Hsk30ExamDetail
}

export async function takeHsk30Exam(id: number, token: string): Promise<Hsk30ExamDetail> {
  const response = await fetch(`${API_BASE}/${id}/take`, {
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
      data?.message || 'Không thể tải đề thi',
      data?.fields
    )
  }
  return data as Hsk30ExamDetail
}

export async function submitHsk30Exam(
  id: number,
  token: string,
  payload: Hsk30SubmitExamPayload
): Promise<Hsk30ExamResult> {
  const response = await fetch(`${API_BASE}/${id}/submit`, {
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
      data?.code || 'SUBMIT_ERROR',
      data?.message || 'Không thể nộp bài thi HSK 3.0',
      data?.fields
    )
  }
  return data as Hsk30ExamResult
}

export async function seedSampleHsk30Exam(token: string): Promise<Hsk30ExamDetail> {
  const response = await fetch(`${API_BASE}/seed-sample`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.code || 'SEED_ERROR',
      data?.message || 'Không thể tạo đề thi mẫu HSK 1',
      data?.fields
    )
  }
  return data as Hsk30ExamDetail
}
