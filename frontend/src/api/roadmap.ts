import { ApiError } from './auth'

export interface RoadmapLessonItem {
  id: number
  title: string
  description?: string
  sortOrder: number
  vocabCount: number
  grammarCount: number
  completed: boolean
  completedAt?: string
}

export interface RoadmapLevelItem {
  id: number
  code: string
  title: string
  levelNumber: number
  description?: string
  targetVocabCount: number
  totalLessons: number
  completedLessons: number
  progressPercent: number
  available: boolean
  lessons: RoadmapLessonItem[]
}

export interface RoadmapResponse {
  totalCompletedLessons: number
  overallProgressPercent: number
  levels: RoadmapLevelItem[]
}

export interface LessonProgressResponse {
  lessonId: number
  hskLevelId?: number
  completed: boolean
  completedAt?: string
  completedLessonsInLevel: number
  totalLessonsInLevel: number
  levelProgressPercent: number
}

const API_BASE = '/api/v1/roadmap'

export async function getRoadmap(token: string): Promise<RoadmapResponse> {
  const response = await fetch(API_BASE, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_ROADMAP_FAILED', 'Không thể tải lộ trình học HSK')
  }
  return response.json()
}

export async function getLessonProgress(lessonId: number, token: string): Promise<LessonProgressResponse> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/progress`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_PROGRESS_FAILED', 'Không thể tải tiến độ bài học')
  }
  return response.json()
}

export async function markLessonComplete(lessonId: number, token: string): Promise<LessonProgressResponse> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/complete`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'MARK_LESSON_FAILED', 'Không thể cập nhật tiến độ bài học')
  }
  return response.json()
}

export async function unmarkLessonComplete(lessonId: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/lessons/${lessonId}/complete`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new ApiError(response.status, 'UNMARK_LESSON_FAILED', 'Không thể hủy tiến độ bài học')
  }
}

