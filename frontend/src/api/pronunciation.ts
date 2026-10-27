import { ApiError } from './auth'

export interface PronunciationAssessmentResult {
  attemptId: number
  overallScore: number
  accuracyScore: number
  fluencyScore: number
  completenessScore: number
  feedback: string
  feedbackCode: string
  assessedAt: string
}

export interface PronunciationHistoryItem {
  attemptId: number
  referenceType: 'VOCABULARY' | 'SENTENCE' | null
  referenceId: number | null
  referenceText: string
  overallScore: number
  accuracyScore: number
  fluencyScore: number
  completenessScore: number
  feedback: string
  feedbackCode: string
  assessedAt: string
}

const API_BASE = '/api/v1/pronunciation'

/**
 * Gửi tệp ghi âm giọng nói lên server để chấm điểm phát âm (HTT-10-CN-003).
 */
export async function assessPronunciation(
  token: string,
  audioBlob: Blob,
  referenceText: string,
  referenceType?: 'VOCABULARY' | 'SENTENCE',
  referenceId?: number,
  durationSeconds?: number
): Promise<PronunciationAssessmentResult> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('referenceText', referenceText)
  if (referenceType) {
    formData.append('referenceType', referenceType)
  }
  if (referenceId != null) {
    formData.append('referenceId', String(referenceId))
  }
  if (durationSeconds != null) {
    formData.append('durationSeconds', String(durationSeconds))
  }

  const response = await fetch(`${API_BASE}/assess`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    let errorCode = 'ASSESS_FAILED'
    let errorMessage = 'Không thể chấm điểm phát âm'
    try {
      const err = await response.json()
      errorCode = err.code || errorCode
      errorMessage = err.message || errorMessage
    } catch {
      // ignore JSON parse error
    }
    throw new ApiError(response.status, errorCode, errorMessage)
  }

  return response.json()
}

/**
 * Lấy danh sách lịch sử các lần luyện phát âm của chính học sinh hiện tại (HTT-10-CN-003).
 */
export async function getPronunciationHistory(
  token: string,
  limit: number = 20
): Promise<PronunciationHistoryItem[]> {
  const response = await fetch(`${API_BASE}/history?limit=${limit}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorCode = 'GET_HISTORY_FAILED'
    let errorMessage = 'Không thể tải lịch sử phát âm'
    try {
      const err = await response.json()
      errorCode = err.code || errorCode
      errorMessage = err.message || errorMessage
    } catch {
      // ignore
    }
    throw new ApiError(response.status, errorCode, errorMessage)
  }

  return response.json()
}
