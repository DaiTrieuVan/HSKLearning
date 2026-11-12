import React, { useEffect, useRef, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { fetchProtectedSlideBlob } from '../../api/material'

interface ProtectedSlideCanvasProps {
  token: string
  materialId: number
  pageNumber: number
  zoom?: number
  protectFromDownload: boolean
  watermarkText?: string
  className?: string
  maxWidthClass?: string
}

/**
 * Vẽ trang slide PNG lên HTML5 Canvas chuẩn DPI màn hình (không lộ thẻ <img> hay file gốc).
 * Tự động phủ watermark mờ thông tin người xem khi ở chế độ chống tải về.
 */
export const ProtectedSlideCanvas: React.FC<ProtectedSlideCanvasProps> = ({
  token,
  materialId,
  pageNumber,
  zoom = 1,
  protectFromDownload,
  watermarkText,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    let bitmap: ImageBitmap | null = null

    const loadAndDraw = async () => {
      setLoading(true)
      setError(null)
      try {
        const blob = await fetchProtectedSlideBlob(token, materialId, pageNumber, controller.signal)
        if (!active) return

        bitmap = await createImageBitmap(blob)
        if (!active) {
          bitmap.close()
          return
        }

        setDimensions({ width: bitmap.width, height: bitmap.height })

        const canvas = canvasRef.current
        if (!canvas) {
          bitmap.close()
          return
        }

        // Render đúng độ phân giải thật của slide để giữ nét chữ Hán khi zoom
        canvas.width = bitmap.width
        canvas.height = bitmap.height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          bitmap.close()
          return
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

        if (protectFromDownload && watermarkText && watermarkText.trim()) {
          drawDiagonalWatermark(ctx, canvas.width, canvas.height, watermarkText.trim())
        }

        bitmap.close()
        bitmap = null
      } catch (err) {
        if (!active || (err instanceof DOMException && err.name === 'AbortError')) {
          return
        }
        setError(err instanceof Error ? err.message : 'Không thể hiển thị trang slide')
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadAndDraw()

    return () => {
      active = false
      controller.abort()
      if (bitmap) {
        bitmap.close()
      }
    }
  }, [token, materialId, pageNumber, protectFromDownload, watermarkText])

  return (
    <div
      className={`relative flex items-center justify-center ${
        protectFromDownload ? 'select-none print:hidden' : ''
      } ${className}`}
      onContextMenu={protectFromDownload ? (e) => e.preventDefault() : undefined}
      onDragStart={protectFromDownload ? (e) => e.preventDefault() : undefined}
    >
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-900/5 backdrop-blur-[1px]">
          <Loader2 size={28} className="animate-spin text-emerald-600" />
          <span className="text-xs font-medium text-slate-600">Đang tải trang {pageNumber}...</span>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-rose-700">
          <AlertCircle size={28} />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          width: dimensions ? (zoom === 1 ? '100%' : `${zoom * 100}%`) : '100%',
          maxWidth: zoom === 1 ? '100%' : 'none',
          height: 'auto',
          aspectRatio: dimensions ? `${dimensions.width} / ${dimensions.height}` : '16 / 9',
          display: error ? 'none' : 'block',
        }}
        className="rounded-lg bg-white shadow-md"
      />
    </div>
  )
}

function drawDiagonalWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string
) {
  ctx.save()
  const fontSize = Math.max(18, Math.round(width / 52))
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(15, 23, 42, 0.08)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const stepX = Math.max(380, Math.round(width / 2.6))
  const stepY = Math.max(240, Math.round(height / 2.6))

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
