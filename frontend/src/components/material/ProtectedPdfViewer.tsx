import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { Loader2, AlertCircle } from 'lucide-react'
import { fetchProtectedPdfBytes } from '../../api/material'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

interface ProtectedPdfViewerProps {
  token: string
  materialId: number
  zoom: number
  currentPage: number
  onTotalPages?: (total: number) => void
  onVisiblePageChange?: (page: number) => void
  protectFromDownload: boolean
  watermarkText?: string
  scrollRequestKey: number
}

/**
 * Trình đọc & trình chiếu PDF trực tiếp trên Canvas bằng PDF.js:
 * - Không cần chuyển đổi PDF sang ảnh trên server.
 * - Hiển thị sắc nét ở mọi mức zoom & toàn màn hình.
 * - Khi protectFromDownload=true, ẩn hoàn toàn thanh tải/in PDF mặc định của trình duyệt và phủ watermark.
 */
export const ProtectedPdfViewer: React.FC<ProtectedPdfViewerProps> = ({
  token,
  materialId,
  zoom,
  currentPage,
  onTotalPages,
  onVisiblePageChange,
  protectFromDownload,
  watermarkText,
  scrollRequestKey,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [containerWidth, setContainerWidth] = useState(860)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Theo dõi chiều rộng khung chứa để tự co giãn responsive (Mobile / Tablet / Fullscreen)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const updateWidth = () => {
      const w = el.clientWidth
      if (w > 0) setContainerWidth(w)
    }
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Tải stream PDF qua Bearer token và mở tài liệu bằng PDF.js
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    let loadingTask: ReturnType<typeof pdfjsLib.getDocument> | null = null

    setLoading(true)
    setError(null)

    fetchProtectedPdfBytes(token, materialId, controller.signal)
      .then((bytes) => {
        loadingTask = pdfjsLib.getDocument({ data: bytes })
        return loadingTask.promise
      })
      .then((doc) => {
        if (!active) {
          void loadingTask?.destroy()
          return
        }
        setPdfDoc(doc)
        setNumPages(doc.numPages)
        onTotalPages?.(doc.numPages)
      })
      .catch((err) => {
        if (!active || (err instanceof DOMException && err.name === 'AbortError')) return
        setError(err instanceof Error ? err.message : 'Không thể hiển thị tệp PDF')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      controller.abort()
      if (loadingTask) {
        void loadingTask.destroy()
      }
    }
  }, [token, materialId, onTotalPages])

  // Cuộn tới trang được chọn khi người dùng bấm Trước / Sau / Nhảy trang
  useEffect(() => {
    if (scrollRequestKey === 0) return
    const target = pageRefs.current[currentPage]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [scrollRequestKey, currentPage])

  // Cập nhật trang hiện tại theo vị trí cuộn tự nhiên
  useEffect(() => {
    const root = containerRef.current
    if (!root || numPages === 0 || !onVisiblePageChange) return

    const observer = new IntersectionObserver(
      (entries) => {
        let bestPage: number | null = null
        let bestRatio = 0
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio
            const num = Number((entry.target as HTMLElement).dataset.pageNumber)
            if (!Number.isNaN(num)) bestPage = num
          }
        }
        if (bestPage != null) {
          onVisiblePageChange(bestPage)
        }
      },
      { root, threshold: [0.25, 0.5, 0.75] }
    )

    for (let i = 1; i <= numPages; i++) {
      const node = pageRefs.current[i]
      if (node) observer.observe(node)
    }
    return () => observer.disconnect()
  }, [numPages, onVisiblePageChange])

  const baseTargetWidth = Math.max(260, Math.min(960, containerWidth - 24)) * zoom

  return (
    <div
      ref={containerRef}
      className={`h-full w-full overflow-auto bg-slate-950 px-2 py-4 sm:px-6 ${
        protectFromDownload ? 'select-none print:hidden' : ''
      }`}
      onContextMenu={protectFromDownload ? (e) => e.preventDefault() : undefined}
      onDragStart={protectFromDownload ? (e) => e.preventDefault() : undefined}
    >
      {loading ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-300">
          <Loader2 size={32} className="animate-spin text-emerald-500" />
          <span className="text-sm font-medium">Đang tải tài liệu PDF...</span>
        </div>
      ) : error ? (
        <div className="mx-auto mt-10 flex max-w-md flex-col items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/50 px-6 py-8 text-center text-rose-200">
          <AlertCircle size={30} className="text-rose-400" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : (
        <div className="mx-auto flex w-max min-w-full flex-col items-center gap-4">
          {pdfDoc &&
            Array.from({ length: numPages }, (_, idx) => idx + 1).map((pageNumber) => (
              <div
                key={pageNumber}
                ref={(el) => {
                  pageRefs.current[pageNumber] = el
                }}
                data-page-number={pageNumber}
                className="flex flex-col items-center"
              >
                <PdfPageCanvas
                  pdfDoc={pdfDoc}
                  pageNumber={pageNumber}
                  targetWidth={baseTargetWidth}
                  protectFromDownload={protectFromDownload}
                  watermarkText={watermarkText}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

interface PdfPageCanvasProps {
  pdfDoc: PDFDocumentProxy
  pageNumber: number
  targetWidth: number
  protectFromDownload: boolean
  watermarkText?: string
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  targetWidth,
  protectFromDownload,
  watermarkText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let cancelled = false
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber)
        if (cancelled) return

        const unscaledViewport = page.getViewport({ scale: 1 })
        const cssScale = targetWidth / unscaledViewport.width
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
        const viewport = page.getViewport({ scale: cssScale * dpr })

        const canvas = canvasRef.current
        if (!canvas || cancelled) return

        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.style.width = `${Math.floor(unscaledViewport.width * cssScale)}px`
        canvas.style.height = `${Math.floor(unscaledViewport.height * cssScale)}px`

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        renderTask = page.render({ canvas, canvasContext: ctx, viewport })
        await renderTask.promise

        if (!cancelled && protectFromDownload && watermarkText && watermarkText.trim()) {
          drawWatermark(ctx, canvas.width, canvas.height, watermarkText.trim())
        }
      } catch {
        // Bỏ qua lỗi hủy task khi người dùng zoom hoặc đổi trang liên tục
      }
    }

    render()

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [pdfDoc, pageNumber, targetWidth, protectFromDownload, watermarkText])

  return (
    <div className="relative overflow-hidden rounded-lg bg-white shadow-xl">
      <canvas ref={canvasRef} className="block" />
      <span className="pointer-events-none absolute bottom-2 right-2.5 rounded bg-slate-900/65 px-2 py-0.5 text-[10px] font-semibold text-white">
        Trang {pageNumber}
      </span>
    </div>
  )
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string
) {
  ctx.save()
  const fontSize = Math.max(14, Math.round(width / 46))
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const stepX = Math.max(320, Math.round(width / 2.4))
  const stepY = Math.max(220, Math.round(height / 2.6))

  ctx.translate(width / 2, height / 2)
  ctx.rotate((-24 * Math.PI) / 180)
  ctx.translate(-width / 2, -height / 2)

  for (let y = -height; y < height * 2; y += stepY) {
    for (let x = -width; x < width * 2; x += stepX) {
      ctx.fillText(text, x, y)
    }
  }
  ctx.restore()
}
