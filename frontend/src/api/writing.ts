import { ApiError } from './auth'

export interface HanziStrokeDetail {
  hanzi: string
  strokeCount: number
  strokes: string[]
  medians: number[][][]
  source: string
  license: string
}

export interface HanziStrokeSummary {
  character: string
  supported: boolean
  strokeCount: number | null
}

const API_BASE = '/api/v1/writing'

/**
 * Lấy dữ liệu chi tiết nét vẽ và trung tuyến của chữ Hán (HTT-10-CN-002).
 */
export async function getCharacterStrokes(token: string, hanzi: string): Promise<HanziStrokeDetail> {
  const response = await fetch(`${API_BASE}/characters/${encodeURIComponent(hanzi)}/strokes`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorCode = 'GET_STROKES_FAILED'
    let errorMessage = 'Không thể tải dữ liệu nét vẽ'
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

/**
 * Kiểm tra trạng thái hỗ trợ thứ tự nét theo từng ký tự trong chuỗi (HTT-10-CN-002).
 */
export async function checkCharactersSupport(token: string, text: string): Promise<HanziStrokeSummary[]> {
  const params = new URLSearchParams({ text })
  const response = await fetch(`${API_BASE}/characters/support?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorCode = 'CHECK_SUPPORT_FAILED'
    let errorMessage = 'Không thể kiểm tra hỗ trợ ký tự'
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
