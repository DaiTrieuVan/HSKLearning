import { ApiError } from './auth'

export interface HskLevelProgressDto {
  hskLevelId: number
  hskLevelCode: string
  hskLevelTitle: string
  levelNumber: number
  completedLessons: number
  totalLessons: number
  progressPercentage: number
}

export interface RecentActivityDto {
  type: 'LESSON_COMPLETED' | 'ASSIGNMENT_SUBMITTED' | string
  title: string
  hskLevelTitle?: string
  scorePercentage?: number | null
  timestamp: string
}

export interface PersonalProgressResponse {
  completedLessons: number
  totalLessons: number
  learnedVocabulary: number
  averageScorePercentage: number | null
  hskLevels: HskLevelProgressDto[]
  recentActivities: RecentActivityDto[]
}

export interface SubmissionAttemptItem {
  submissionId: number
  attemptNumber: number
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'AUTO_SUBMITTED'
  score: number | null
  adjustedScore: number | null
  adjustReason: string | null
  effectiveScore: number | null
  scorePercentage: number | null
  isBestScore: boolean
  submittedAt: string | null
  startedAt: string
}

export interface AssignmentHistoryItem {
  assignmentId: number
  assignmentTitle: string
  classId: number | null
  className: string | null
  totalPoints: number
  bestScore: number | null
  bestScorePercentage: number | null
  latestSubmittedAt: string | null
  attemptsCount: number
  attempts: SubmissionAttemptItem[]
}

export interface SubmissionHistoryResponse {
  totalAssignments: number
  totalSubmissions: number
  averageScorePercentage: number | null
  items: AssignmentHistoryItem[]
}

const API_BASE = '/api/progress'

export async function getPersonalProgress(token: string): Promise<PersonalProgressResponse> {
  const response = await fetch(`${API_BASE}/personal`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_PROGRESS_FAILED', 'Không thể tải dữ liệu tiến độ học tập')
  }

  return response.json()
}

export async function getSubmissionHistory(token: string): Promise<SubmissionHistoryResponse> {
  const response = await fetch(`${API_BASE}/history`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_HISTORY_FAILED', 'Không thể tải lịch sử làm bài')
  }

  return response.json()
}
export interface GradeAttemptDetailItem {
  submissionId: number
  attemptNumber: number
  score: number | null
  adjustedScore: number | null
  adjustReason: string | null
  adjustedAt: string | null
  adjustedByName: string | null
  effectiveScore: number | null
  status: string
  submittedAt: string | null
  isBestAttempt: boolean
}

export interface CellGradeItem {
  assignmentId: number
  hasSubmitted: boolean
  bestScore: number | null
  totalPoints: number
  scorePercentage: number | null
  isAdjusted: boolean
  status: string
  totalAttempts: number
  attempts: GradeAttemptDetailItem[]
}

export interface StudentGradeRowItem {
  studentId: number
  fullName: string
  email: string
  avatarUrl: string | null
  membershipStatus: 'ACTIVE' | 'LEFT' | 'REMOVED' | string
  isEnrolled: boolean
  submittedAssignmentsCount: number
  studentAverageScore: number | null
  grades: CellGradeItem[]
}

export interface AssignmentColumnHeaderItem {
  assignmentId: number
  title: string
  totalPoints: number
  dueTime: string | null
  createdAt: string | null
  submittedCount: number
  assignmentAverageScore: number | null
}

export interface ClassGradebookResponse {
  classId: number
  className: string
  classCode: string
  teacherId: number
  teacherName: string
  totalStudents: number
  activeStudentsCount: number
  totalAssignments: number
  classAverageScore: number | null
  assignments: AssignmentColumnHeaderItem[]
  students: StudentGradeRowItem[]
}

export async function getClassGradebook(token: string, classId: number): Promise<ClassGradebookResponse> {
  const response = await fetch(`${API_BASE}/classes/${classId}/gradebook`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorDetail = 'Không thể tải bảng điểm lớp học'
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, 'FETCH_GRADEBOOK_FAILED', errorDetail)
  }

  return response.json()
}

export interface UnsubmittedStudentItem {
  studentId: number
  fullName: string
  email: string
  avatarUrl: string | null
  originalDueTime: string | null
  effectiveDueTime: string | null
  isExtended: boolean
  isOverdue: boolean
}

export interface LateSubmissionItem {
  submissionId: number
  studentId: number
  fullName: string
  email: string
  avatarUrl: string | null
  originalDueTime: string | null
  effectiveDueTime: string | null
  isExtended: boolean
  submittedAt: string | null
  isLate: boolean
}

export interface UnsubmittedStudentsResponse {
  assignmentId: number
  assignmentTitle: string
  classId: number
  className: string
  originalDueTime: string | null
  isAssignmentOverdue: boolean
  totalStudents: number
  submittedCount: number
  unsubmittedCount: number
  lateSubmittedCount: number
  unsubmittedStudents: UnsubmittedStudentItem[]
  lateSubmissions: LateSubmissionItem[]
}

export async function getUnsubmittedStudents(token: string, assignmentId: number): Promise<UnsubmittedStudentsResponse> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/unsubmitted`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorDetail = 'Không thể tải danh sách học sinh chưa nộp bài'
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, 'FETCH_UNSUBMITTED_FAILED', errorDetail)
  }

  return response.json()
}

export interface ScoreDistributionItem {
  rangeKey: string
  label: string
  minScore: number
  maxScore: number
  count: number
  percentage: number
}

export interface QuestionStatItem {
  questionId: number
  sortOrder: number
  type: string
  content: string
  points: number
  totalAnswers: number
  correctCount: number
  wrongCount: number
  wrongPercentage: number
}

export interface AssignmentStatisticsResponse {
  assignmentId: number
  assignmentTitle: string
  classId: number
  className: string
  totalStudents: number
  submittedCount: number
  hasData: boolean
  totalPoints: number | null
  averageScore: number | null
  maxScore: number | null
  minScore: number | null
  scoreDistribution: ScoreDistributionItem[]
  questionStats: QuestionStatItem[]
}

export async function getAssignmentStatistics(token: string, assignmentId: number): Promise<AssignmentStatisticsResponse> {
  const response = await fetch(`${API_BASE}/assignments/${assignmentId}/statistics`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorDetail = 'Không thể tải thống kê bài tập'
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, 'FETCH_STATISTICS_FAILED', errorDetail)
  }

  return response.json()
}

export interface ClassStudentProgressSummary {
  totalAssignments: number
  submittedAssignments: number
  overdueAssignments: number
  averageScorePercentage: number | null
  completedLessonsCount: number
}

export interface ClassStudentAssignmentItem {
  assignmentId: number
  title: string
  dueDate: string | null
  totalPoints: number | null
  status: 'SUBMITTED' | 'NOT_SUBMITTED' | 'OVERDUE' | 'LATE' | string
  attemptCount: number
  score: number | null
  adjustedScore: number | null
  effectiveScore: number | null
  percentage: number | null
  submittedAt: string | null
  isLate: boolean
  feedback: string | null
}

export interface CompletedLessonItem {
  lessonId: number
  lessonTitle: string
  levelCode: string
  levelName: string
  levelNumber: number
  completedAt: string
}

export interface ClassStudentProgressResponse {
  classId: number
  className: string
  classCode: string
  studentId: number
  studentName: string
  studentEmail: string
  membershipStatus: string
  joinedAt: string
  hasActivity: boolean
  summary: ClassStudentProgressSummary
  assignments: ClassStudentAssignmentItem[]
  completedLessons: CompletedLessonItem[]
  levelProgressList: HskLevelProgressDto[]
}

export async function getClassStudentProgress(token: string, classId: number, studentId: number): Promise<ClassStudentProgressResponse> {
  const response = await fetch(`${API_BASE}/classes/${classId}/students/${studentId}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorDetail = 'Không thể tải tiến độ của học sinh'
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorDetail = errorJson.message
      }
    } catch {
      // ignore
    }
    throw new ApiError(response.status, 'FETCH_STUDENT_PROGRESS_FAILED', errorDetail)
  }

  return response.json()
}



