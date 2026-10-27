import { ApiError } from './auth'

export interface AskLearningAssistantResponse {
  answer: string
  remainingQuestions: number
  answeredAt: string
}

export interface AiAssistantQuotaResponse {
  limit: number
  used: number
  remaining: number
  resetsAt: string
}

const API_BASE = '/api/v1/ai-assistant'

/**
 * Gửi câu hỏi về từ vựng hoặc ngữ pháp tiếng Trung đến trợ lý AI (HTT-10-CN-004).
 */
export async function askLearningAssistant(
  token: string,
  question: string
): Promise<AskLearningAssistantResponse> {
  const response = await fetch(`${API_BASE}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Có lỗi xảy ra khi gửi câu hỏi đến trợ lý AI.'
    const code = data?.code || 'UNKNOWN_ERROR'
    throw new ApiError(response.status, code, message, data?.fields)
  }

  return data as AskLearningAssistantResponse
}

/**
 * Lấy thông tin hạn mức số lượt hỏi trợ lý AI trong ngày (HTT-10-CN-004).
 */
export async function getAiAssistantQuota(
  token: string
): Promise<AiAssistantQuotaResponse> {
  const response = await fetch(`${API_BASE}/quota`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message = data?.message || 'Không thể lấy thông tin hạn mức trợ lý AI.'
    const code = data?.code || 'UNKNOWN_ERROR'
    throw new ApiError(response.status, code, message, data?.fields)
  }

  return data as AiAssistantQuotaResponse
}
