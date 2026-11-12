import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Lock,
  Maximize2,
  Minimize2,
  PanelLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  downloadOriginalMaterial,
  getMaterialDetail,
  type MaterialDetail,
} from '../../api/material'
import { ProtectedSlideCanvas } from '../../components/material/ProtectedSlideCanvas'

export const MaterialPresentationPage: React.FC = () => {
  const { materialId } = useParams<{ materialId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const token = user?.token || ''

  const numericId = Number(materialId)
  const classIdParam = searchParams.get('classId')

  const [detail, setDetail] = useState<MaterialDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [zoom, setZoom] = useState(1)
  const [showThumbs, setShowThumbs] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const stageContainerRef = useRef<HTMLDivElement | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const loadDetail = useCallback(async () => {
    if (!token || !numericId) return
    try {
      const data = await getMaterialDetail(token, numericId)
      setDetail(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể mở giáo trình')
    } finally {
      setLoading(false)
    }
  }, [token, numericId])

  useEffect(() => {
    loadDetail()
  }, [loadDetail])

  // Poll nếu giáo trình đang ở trạng thái PROCESSING
  useEffect(() => {
    if (!detail || detail.status !== 'PROCESSING') return
    const timer = window.setInterval(() => {
      loadDetail()
    }, 2500)
    return () => window.clearInterval(timer)
  }, [detail, loadDetail])

  useEffect(() => {
    setPageInput(String(currentPage))
  }, [currentPage])

  const totalPages = detail?.totalPages || 0
  const protectFromDownload = detail ? !detail.canDownload : true
  const watermarkText =
    protectFromDownload && user ? `${user.fullName} • ${user.email}` : undefined

  const goToPage = useCallback(
    (target: number) => {
      if (totalPages <= 0) return
      const clamped = Math.max(1, Math.min(totalPages, target))
      setCurrentPage(clamped)
    },
    [totalPages]
  )

  const toggleFullscreen = useCallback(async () => {
    const el = stageContainerRef.current
    if (!el) return
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch {
      // Trình duyệt mobile iOS có thể không hỗ trợ Fullscreen API cho div
    }
  }, [])

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // Phím tắt trình chiếu + chặn Ctrl+S / Ctrl+P khi giáo viên khóa tải về
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')

      if (protectFromDownload && (e.ctrlKey || e.metaKey)) {
        const keyLower = e.key.toLowerCase()
        if (keyLower === 's' || keyLower === 'p') {
          e.preventDefault()
          return
        }
      }

      if (isInput) return

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goToPage(currentPage + 1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goToPage(currentPage - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goToPage(1)
      } else if (e.key === 'End' && totalPages > 0) {
        e.preventDefault()
        goToPage(totalPages)
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, protectFromDownload, goToPage, toggleFullscreen])

  const handleBack = () => {
    if (classIdParam) {
      navigate(`/classes/${classIdParam}`)
    } else if (user?.activeMode === 'TEACHER') {
      navigate('/materials')
    } else {
      navigate(-1)
    }
  }

  const handleDownload = async () => {
    if (!detail || !detail.canDownload) return
    setDownloading(true)
    try {
      await downloadOriginalMaterial(token, detail.id, detail.originalFilename)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tải giáo trình thất bại')
    } finally {
      setDownloading(false)
    }
  }

  const handlePageJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(pageInput)
    if (!Number.isNaN(num)) {
      goToPage(num)
    } else {
      setPageInput(String(currentPage))
    }
  }

  return (
    <div
      ref={stageContainerRef}
      onContextMenu={protectFromDownload ? (e) => e.preventDefault() : undefined}
      className="flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950 text-white"
    >
      {/* Top Bar */}
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-slate-800 bg-slate-900/95 px-2.5 sm:h-14 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex min-h-[38px] min-w-[38px] shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            aria-label="Quay lại"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-white sm:text-base">
              {detail?.title || 'Đang tải giáo trình...'}
            </h1>
            {detail && (
              <div className="hidden items-center gap-2 text-[11px] text-slate-400 sm:flex">
                <span>{detail.fileType}</span>
                <span>•</span>
                <span>{detail.totalPages} trang</span>
                {!detail.canDownload && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                      <Lock size={11} />
                      Chỉ xem trực tuyến
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {detail && !detail.canDownload && (
            <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-300 sm:hidden">
              <Lock size={11} />
              Chỉ xem
            </span>
          )}

          {/* Desktop Zoom Controls */}
          <div className="hidden items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-0.5 md:flex">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
              className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Thu nhỏ"
            >
              <ZoomOut size={15} />
            </button>
            <span className="min-w-[44px] text-center text-xs font-semibold text-slate-200">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2, Number((z + 0.25).toFixed(2))))}
              className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
              title="Phóng to"
            >
              <ZoomIn size={15} />
            </button>
            {zoom !== 1 && (
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="rounded-md p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white"
                title="Khớp màn hình"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowThumbs((v) => !v)}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold transition-colors ${
              showThumbs
                ? 'border-emerald-500/50 bg-emerald-600/20 text-emerald-300'
                : 'border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800'
            }`}
            title="Ẩn/hiện danh sách trang"
          >
            <PanelLeft size={16} />
            <span className="hidden lg:inline">Danh sách slide</span>
          </button>

          {detail?.canDownload && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span className="hidden sm:inline">Tải file gốc</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800"
            title={isFullscreen ? 'Thoát toàn màn hình (Esc)' : 'Toàn màn hình (F)'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Presentation Body */}
      <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Desktop Vertical Thumbnail Sidebar */}
        {showThumbs && detail?.status === 'READY' && (
          <aside className="hidden w-52 shrink-0 flex-col gap-2.5 overflow-y-auto border-r border-slate-800 bg-slate-900/70 p-3 lg:flex xl:w-60">
            {detail.pages.map((p) => {
              const active = p.pageNumber === currentPage
              return (
                <button
                  key={p.pageNumber}
                  type="button"
                  onClick={() => goToPage(p.pageNumber)}
                  className={`group flex flex-col gap-1 rounded-xl border p-1.5 text-left transition-all ${
                    active
                      ? 'border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/50'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="pointer-events-none overflow-hidden rounded-lg">
                    <ProtectedSlideCanvas
                      token={token}
                      materialId={detail.id}
                      pageNumber={p.pageNumber}
                      protectFromDownload={protectFromDownload}
                    />
                  </div>
                  <span
                    className={`px-1 text-[11px] font-bold ${
                      active ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    Trang {p.pageNumber}
                  </span>
                </button>
              )
            })}
          </aside>
        )}

        {/* Slide Stage */}
        <main
          className="relative flex flex-1 items-center justify-center overflow-auto bg-slate-950 p-2.5 sm:p-5"
          style={{ touchAction: zoom === 1 ? 'pan-y' : 'auto' }}
          onTouchStart={(e) => {
            if (zoom !== 1 || e.touches.length !== 1) return
            touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
          }}
          onTouchEnd={(e) => {
            if (!touchStartRef.current || zoom !== 1 || e.changedTouches.length !== 1) return
            const dx = e.changedTouches[0].clientX - touchStartRef.current.x
            const dy = e.changedTouches[0].clientY - touchStartRef.current.y
            touchStartRef.current = null
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
              if (dx < 0) goToPage(currentPage + 1)
              else goToPage(currentPage - 1)
            }
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-slate-300">
              <Loader2 size={34} className="animate-spin text-emerald-500" />
              <span className="text-sm font-medium">Đang chuẩn bị slide trình chiếu...</span>
            </div>
          ) : error ? (
            <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/50 px-6 py-8 text-center">
              <AlertCircle size={32} className="text-rose-400" />
              <p className="text-sm font-semibold text-rose-200">{error}</p>
            </div>
          ) : detail?.status === 'PROCESSING' ? (
            <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-8 text-center">
              <Loader2 size={32} className="animate-spin text-emerald-500" />
              <p className="text-sm font-bold text-white">Giáo trình đang được chuyển đổi slide</p>
              <p className="text-xs text-slate-400">Hệ thống sẽ tự động hiển thị ngay khi hoàn tất.</p>
            </div>
          ) : detail?.status === 'FAILED' ? (
            <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/50 px-6 py-8 text-center">
              <AlertCircle size={32} className="text-rose-400" />
              <p className="text-sm font-bold text-rose-100">Chuyển đổi giáo trình thất bại</p>
              <p className="text-xs text-rose-300">{detail.errorMessage}</p>
            </div>
          ) : detail && detail.totalPages > 0 ? (
            <div
              className={`flex items-center justify-center ${
                zoom > 1 ? 'min-w-full' : 'w-full max-w-5xl'
              }`}
            >
              <ProtectedSlideCanvas
                token={token}
                materialId={detail.id}
                pageNumber={currentPage}
                zoom={zoom}
                protectFromDownload={protectFromDownload}
                watermarkText={watermarkText}
                className="w-full"
              />
            </div>
          ) : null}

          {/* Floating Desktop Prev/Next Chevrons */}
          {detail?.status === 'READY' && totalPages > 1 && (
            <>
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-slate-900/75 text-white shadow-lg ring-1 ring-white/10 backdrop-blur transition hover:bg-slate-800 disabled:opacity-25"
                aria-label="Slide trước"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-slate-900/75 text-white shadow-lg ring-1 ring-white/10 backdrop-blur transition hover:bg-slate-800 disabled:opacity-25"
                aria-label="Slide tiếp theo"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </main>
      </div>

      {/* Mobile/Tablet Horizontal Thumbnail Strip */}
      {showThumbs && detail?.status === 'READY' && (
        <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-slate-800 bg-slate-900/95 px-3 py-2 lg:hidden">
          {detail.pages.map((p) => {
            const active = p.pageNumber === currentPage
            return (
              <button
                key={p.pageNumber}
                type="button"
                onClick={() => goToPage(p.pageNumber)}
                className={`flex w-28 shrink-0 flex-col gap-1 rounded-lg border p-1 ${
                  active
                    ? 'border-emerald-500 bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                <div className="pointer-events-none overflow-hidden rounded">
                  <ProtectedSlideCanvas
                    token={token}
                    materialId={detail.id}
                    pageNumber={p.pageNumber}
                    protectFromDownload={protectFromDownload}
                  />
                </div>
                <span className="text-center text-[10px] font-bold text-slate-300">
                  {p.pageNumber}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Bottom Navigation Control Bar */}
      {detail?.status === 'READY' && totalPages > 0 && (
        <footer className="flex h-14 shrink-0 items-center justify-between gap-2 border-t border-slate-800 bg-slate-900 px-3 sm:justify-center sm:gap-4">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            <span>Trước</span>
          </button>

          <form onSubmit={handlePageJumpSubmit} className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="hidden text-slate-400 sm:inline">Trang</span>
            <input
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={() => {
                const n = Number(pageInput)
                if (!Number.isNaN(n) && n >= 1) goToPage(n)
                else setPageInput(String(currentPage))
              }}
              aria-label="Số trang hiện tại"
              className="w-12 rounded-lg border border-slate-700 bg-slate-950 py-1.5 text-center text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
            />
            <span className="text-slate-400">/ {totalPages}</span>
          </form>

          {/* Mobile quick zoom toggle */}
          <button
            type="button"
            onClick={() => setZoom((z) => (z === 1 ? 1.5 : 1))}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-2.5 text-xs font-bold text-slate-200 md:hidden"
            title="Phóng to / Khớp màn hình"
          >
            {zoom === 1 ? <ZoomIn size={15} /> : <ZoomOut size={15} />}
            <span>{Math.round(zoom * 100)}%</span>
          </button>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-xl bg-emerald-600 px-3.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
          >
            <span>Sau</span>
            <ChevronRight size={16} />
          </button>
        </footer>
      )}
    </div>
  )
}
