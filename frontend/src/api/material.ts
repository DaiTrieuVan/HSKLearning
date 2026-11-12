import { throwApiErrorFromResponse } from './auth'

const API_BASE = '/api/v1'

export type MaterialFileType = 'PDF' | 'PPTX'
export type MaterialStatus = 'PROCESSING' | 'READY' | 'FAILED'

export interface MaterialSummary {
  id: number
  teacherId: number
  teacherName: string
  title: string
  description?: string | null
  hskLevel?: number | null
  fileType: MaterialFileType
  originalFilename: string
  fileSizeBytes: number
  totalPages: number
  status: MaterialStatus
  errorMessage?: string | null
  defaultAllowDownload: boolean
  sharedClassCount: number
  createdAt: string
  updatedAt: string
}

export interface MaterialPageInfo {
  pageNumber: number
  width: number
  height: number
}

export interface MaterialDetail {
  id: number
  teacherId: number
  teacherName: string
  title: string
  description?: string | null
  hskLevel?: number | null
  fileType: MaterialFileType
  originalFilename: string
  fileSizeBytes: number
  totalPages: number
  status: MaterialStatus
  errorMessage?: string | null
  defaultAllowDownload: boolean
  canDownload: boolean
  owner: boolean
  pages: MaterialPageInfo[]
  createdAt: string
  updatedAt: string
}

export interface MaterialShareInfo {
  classId: number
  classTitle: string
  allowDownload: boolean
  note?: string | null
  sharedAt: string
}

export interface MaterialSharePayloadItem {
  classId: number
  allowDownload: boolean
  note?: string
}

export interface ClassMaterialItem {
  materialId: number
  classId: number
  title: string
  description?: string | null
  hskLevel?: number | null
  fileType: MaterialFileType
  originalFilename: string
  fileSizeBytes: number
  totalPages: number
  status: MaterialStatus
  allowDownload: boolean
  canDownload: boolean
  note?: string | null
  teacherName: string
  sharedAt: string
}

export interface UploadMaterialPayload {
  file: File
  title?: string
  description?: string
  hskLevel?: number | null
  defaultAllowDownload: boolean
}

export interface UpdateMaterialPayload {
  title: string
  description?: string | null
  hskLevel?: number | null
  defaultAllowDownload?: boolean
}

function authHeaders(token: string, json = false): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  }
  if (json) {
    headers['Content-Type'] = 'application/json'
    headers.Accept = 'application/json'
  }
  return headers
}

export async function uploadMaterial(
  token: string,
  payload: UploadMaterialPayload
): Promise<MaterialSummary> {
  const form = new FormData()
  form.append('file', payload.file)
  if (payload.title && payload.title.trim()) {
    form.append('title', payload.title.trim())
  }
  if (payload.description && payload.description.trim()) {
    form.append('description', payload.description.trim())
  }
  if (payload.hskLevel != null) {
    form.append('hskLevel', String(payload.hskLevel))
  }
  form.append('defaultAllowDownload', String(payload.defaultAllowDownload))

  const response = await fetch(`${API_BASE}/materials`, {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'UPLOAD_MATERIAL_FAILED', 'Tải lên giáo trình thất bại')
  }
  return (await response.json()) as MaterialSummary
}

export async function getMyMaterials(
  token: string,
  filters?: { keyword?: string; hskLevel?: number | null; fileType?: MaterialFileType | '' }
): Promise<MaterialSummary[]> {
  const params = new URLSearchParams()
  if (filters?.keyword?.trim()) {
    params.set('keyword', filters.keyword.trim())
  }
  if (filters?.hskLevel != null) {
    params.set('hskLevel', String(filters.hskLevel))
  }
  if (filters?.fileType) {
    params.set('fileType', filters.fileType)
  }
  const qs = params.toString()
  const url = `${API_BASE}/materials${qs ? `?${qs}` : ''}`
  const response = await fetch(url, {
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_MATERIALS_FAILED', 'Không thể tải danh sách giáo trình')
  }
  return (await response.json()) as MaterialSummary[]
}

export async function getMaterialDetail(token: string, materialId: number): Promise<MaterialDetail> {
  const response = await fetch(`${API_BASE}/materials/${materialId}`, {
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_MATERIAL_DETAIL_FAILED', 'Không thể tải thông tin giáo trình')
  }
  return (await response.json()) as MaterialDetail
}

export async function updateMaterial(
  token: string,
  materialId: number,
  payload: UpdateMaterialPayload
): Promise<MaterialSummary> {
  const response = await fetch(`${API_BASE}/materials/${materialId}`, {
    method: 'PATCH',
    headers: authHeaders(token, true),
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'UPDATE_MATERIAL_FAILED', 'Cập nhật giáo trình thất bại')
  }
  return (await response.json()) as MaterialSummary
}

export async function retryRenderMaterial(token: string, materialId: number): Promise<MaterialSummary> {
  const response = await fetch(`${API_BASE}/materials/${materialId}/retry-render`, {
    method: 'POST',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'RETRY_MATERIAL_FAILED', 'Không thể thử xử lý lại giáo trình')
  }
  return (await response.json()) as MaterialSummary
}

export async function deleteMaterial(token: string, materialId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/materials/${materialId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'DELETE_MATERIAL_FAILED', 'Xóa giáo trình thất bại')
  }
}

export async function getMaterialShares(token: string, materialId: number): Promise<MaterialShareInfo[]> {
  const response = await fetch(`${API_BASE}/materials/${materialId}/shares`, {
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_SHARES_FAILED', 'Không thể tải danh sách lớp đã chia sẻ')
  }
  return (await response.json()) as MaterialShareInfo[]
}

export async function syncMaterialShares(
  token: string,
  materialId: number,
  shares: MaterialSharePayloadItem[]
): Promise<MaterialShareInfo[]> {
  const response = await fetch(`${API_BASE}/materials/${materialId}/shares`, {
    method: 'PUT',
    headers: authHeaders(token, true),
    body: JSON.stringify({ shares }),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'SYNC_SHARES_FAILED', 'Cập nhật chia sẻ lớp học thất bại')
  }
  return (await response.json()) as MaterialShareInfo[]
}

export async function getClassMaterials(token: string, classId: number): Promise<ClassMaterialItem[]> {
  const response = await fetch(`${API_BASE}/classes/${classId}/materials`, {
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_CLASS_MATERIALS_FAILED', 'Không thể tải danh sách giáo trình của lớp')
  }
  return (await response.json()) as ClassMaterialItem[]
}

export async function updateClassMaterialDownload(
  token: string,
  classId: number,
  materialId: number,
  allowDownload: boolean
): Promise<void> {
  const response = await fetch(`${API_BASE}/classes/${classId}/materials/${materialId}`, {
    method: 'PATCH',
    headers: authHeaders(token, true),
    body: JSON.stringify({ allowDownload }),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'UPDATE_CLASS_MATERIAL_FAILED', 'Không thể cập nhật quyền tải giáo trình')
  }
}

export async function unshareClassMaterial(
  token: string,
  classId: number,
  materialId: number
): Promise<void> {
  const response = await fetch(`${API_BASE}/classes/${classId}/materials/${materialId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'UNSHARE_CLASS_MATERIAL_FAILED', 'Không thể gỡ giáo trình khỏi lớp')
  }
}

export async function fetchProtectedSlideBlob(
  token: string,
  materialId: number,
  pageNumber: number,
  signal?: AbortSignal
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/materials/${materialId}/slides/${pageNumber}/image`, {
    headers: authHeaders(token),
    signal,
    cache: 'no-store',
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_SLIDE_FAILED', 'Không thể tải trang trình chiếu')
  }
  return await response.blob()
}

export async function fetchProtectedPdfBytes(
  token: string,
  materialId: number,
  signal?: AbortSignal
): Promise<Uint8Array> {
  const response = await fetch(`${API_BASE}/materials/${materialId}/document`, {
    headers: authHeaders(token),
    signal,
    cache: 'no-store',
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'FETCH_PDF_FAILED', 'Không thể tải nội dung tài liệu PDF')
  }
  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}

export async function downloadOriginalMaterial(
  token: string,
  materialId: number,
  fallbackFilename: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/materials/${materialId}/download`, {
    headers: authHeaders(token),
    cache: 'no-store',
  })
  if (!response.ok) {
    await throwApiErrorFromResponse(response, 'DOWNLOAD_MATERIAL_FAILED', 'Không thể tải tệp giáo trình gốc')
  }
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = fallbackFilename || 'giao-trinh'
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500)
  }
}

