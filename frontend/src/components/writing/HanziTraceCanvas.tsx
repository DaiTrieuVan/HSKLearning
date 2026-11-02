import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  RotateCcw,
  Undo2,
  Lightbulb,
  Grid,
  CheckCircle2,
  Layers,
  PenTool,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import {
  type Point,
  matchStroke,
} from '../../utils/strokeMatching'
import { StrokeFeedback } from './StrokeFeedback'

export interface HanziTraceCanvasProps {
  hanzi: string
  strokes: string[]
  medians: number[][][]
  onCompleted?: (totalScore: number) => void
}

type GridType = 'mi' | 'tian' | 'none'
export type ViewMode = 'compare' | 'handwriting' | 'system'

export const HanziTraceCanvas: React.FC<HanziTraceCanvasProps> = ({
  hanzi,
  strokes,
  medians,
  onCompleted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const innerAreaRef = useRef<HTMLDivElement | null>(null)

  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0)
  const pointsRef = useRef<Point[]>([])
  const isDrawingRef = useRef<boolean>(false)

  // Lưu lịch sử các nét người dùng đã viết dưới dạng tọa độ chuẩn hóa [0..1]
  const [userStrokesHistory, setUserStrokesHistory] = useState<Point[][]>([])

  // Chế độ hiển thị:
  // - compare: Chữ mẫu mờ bên dưới + chữ người dùng viết bên trên (Mặc định)
  // - handwriting: Chỉ hiển thị nét chữ người dùng tự viết trên lưới
  // - system: Hiển thị nét mẫu chuẩn của hệ thống
  const [viewMode, setViewMode] = useState<ViewMode>('compare')

  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'drawing' | 'success_stroke' | 'error_stroke' | 'completed'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [strokeScores, setStrokeScores] = useState<number[]>([])
  const [showScoreDetails, setShowScoreDetails] = useState<boolean>(false)

  const [gridType, setGridType] = useState<GridType>('mi')
  const [showHint, setShowHint] = useState<boolean>(true)
  const [flashColor, setFlashColor] = useState<'none' | 'green' | 'red'>('none')

  const totalStrokes = strokes.length

  // Hàm vẽ lại toàn bộ nét trên canvas: các nét đã lưu trong lịch sử + nét đang vẽ hiện thời
  const redrawCanvas = useCallback(
    (
      activePoints: Point[],
      history: Point[][],
      mode: ViewMode
    ) => {
      const canvas = canvasRef.current
      const area = innerAreaRef.current
      if (!canvas || !area) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const rect = area.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      if (width <= 0 || height <= 0) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const dpr = window.devicePixelRatio || 1
      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Nếu ở chế độ 'compare' hoặc 'handwriting', vẽ các nét đã viết trong lịch sử của người dùng
      if (mode === 'compare' || mode === 'handwriting') {
        ctx.lineWidth = 13
        // Chế độ đối chiếu: mực xanh ngọc đậm; Chế độ chữ viết tay: mực đen thư pháp
        ctx.strokeStyle = mode === 'compare' ? '#047857' : '#0f172a'

        history.forEach(stroke => {
          if (stroke.length < 2) return
          ctx.beginPath()
          ctx.moveTo(stroke[0].x * width, stroke[0].y * height)
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x * width, stroke[i].y * height)
          }
          ctx.stroke()
        })
      }

      // Vẽ nét hiện tại mà người dùng đang rê chuột / chạm bút
      if (activePoints.length >= 2) {
        ctx.lineWidth = 14
        ctx.strokeStyle = '#10b981' // Màu mực vẽ trực tiếp: xanh lá tươi sáng
        ctx.beginPath()
        ctx.moveTo(activePoints[0].x, activePoints[0].y)
        for (let i = 1; i < activePoints.length; i++) {
          ctx.lineTo(activePoints[i].x, activePoints[i].y)
        }
        ctx.stroke()
      }

      ctx.restore()
    },
    []
  )

  // Cập nhật kích thước canvas theo đúng tỷ lệ pixel thiết bị (DPI) và vùng chứa
  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    const area = innerAreaRef.current
    if (!canvas || !area) return
    const rect = area.getBoundingClientRect()
    if (rect.width > 0 && rect.height > 0) {
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      // Vẽ lại lịch sử sau khi co giãn
      redrawCanvas(pointsRef.current, userStrokesHistory, viewMode)
    }
  }, [userStrokesHistory, viewMode, redrawCanvas])

  useEffect(() => {
    updateCanvasSize()
    const area = innerAreaRef.current
    if (!area) return

    const ro = new ResizeObserver(() => {
      if (!isDrawingRef.current) {
        updateCanvasSize()
      }
    })
    ro.observe(area)

    window.addEventListener('resize', updateCanvasSize)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [updateCanvasSize])

  // Vẽ lại canvas mỗi khi đổi chế độ xem (viewMode) hoặc lịch sử nét thay đổi
  useEffect(() => {
    redrawCanvas(pointsRef.current, userStrokesHistory, viewMode)
  }, [viewMode, userStrokesHistory, redrawCanvas])

  // Xử lý bắt đầu vẽ
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (feedbackStatus === 'completed') return

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    const rect = canvas.getBoundingClientRect()
    const startPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    isDrawingRef.current = true
    pointsRef.current = [startPoint]
    setFeedbackStatus('drawing')
    setFlashColor('none')
    redrawCanvas([startPoint], userStrokesHistory, viewMode)
  }

  // Xử lý đang vẽ
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const newPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    pointsRef.current.push(newPoint)
    redrawCanvas(pointsRef.current, userStrokesHistory, viewMode)
  }

  // Xử lý nhấc bút / kết thúc nét
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    isDrawingRef.current = false

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }

    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const drawnPoints = pointsRef.current
    pointsRef.current = []

    if (drawnPoints.length < 2) {
      redrawCanvas([], userStrokesHistory, viewMode)
      setFeedbackStatus('idle')
      return
    }

    // So khớp nét vẽ với trung tuyến chuẩn
    const expectedMedian = medians[currentStrokeIndex] as Array<[number, number]>
    const matchResult = matchStroke(
      drawnPoints,
      expectedMedian,
      currentStrokeIndex,
      width,
      height
    )

    if (matchResult.isMatch) {
      // Đúng nét!
      setFlashColor('green')
      setTimeout(() => setFlashColor('none'), 400)

      // Chuẩn hóa tọa độ nét người dùng để lưu vào lịch sử (tỷ lệ 0..1 để co giãn tự do)
      const normalizedStroke: Point[] = drawnPoints.map(p => ({
        x: p.x / width,
        y: p.y / height,
      }))
      const newHistory = [...userStrokesHistory, normalizedStroke]
      setUserStrokesHistory(newHistory)

      const nextIndex = currentStrokeIndex + 1
      const newScores = [...strokeScores, matchResult.score]
      setStrokeScores(newScores)

      // Vẽ lại canvas chứa toàn bộ nét chữ viết của người dùng
      redrawCanvas([], newHistory, viewMode)

      if (nextIndex >= totalStrokes) {
        // Đã hoàn thành toàn bộ chữ
        setCurrentStrokeIndex(totalStrokes)
        setFeedbackStatus('completed')
        const avgScore = Math.round(
          newScores.reduce((a, b) => a + b, 0) / newScores.length
        )
        if (onCompleted) {
          onCompleted(avgScore)
        }
      } else {
        setCurrentStrokeIndex(nextIndex)
        setFeedbackStatus('success_stroke')
      }
    } else {
      // Vẽ sai nét: không lưu vào lịch sử, vẽ lại lịch sử hiện tại
      setFlashColor('red')
      setTimeout(() => setFlashColor('none'), 400)
      setFeedbackStatus('error_stroke')
      setErrorMessage(matchResult.feedbackMessage)
      redrawCanvas([], userStrokesHistory, viewMode)
    }
  }

  // Reset về trạng thái ban đầu
  const handleReset = () => {
    isDrawingRef.current = false
    pointsRef.current = []
    setCurrentStrokeIndex(0)
    setUserStrokesHistory([])
    setFeedbackStatus('idle')
    setErrorMessage('')
    setStrokeScores([])
    redrawCanvas([], [], viewMode)
  }

  // Xóa lùi 1 nét vừa viết
  const handleUndo = () => {
    if (currentStrokeIndex > 0) {
      isDrawingRef.current = false
      pointsRef.current = []
      const nextIndex = currentStrokeIndex - 1
      const nextHistory = userStrokesHistory.slice(0, -1)
      setCurrentStrokeIndex(nextIndex)
      setUserStrokesHistory(nextHistory)
      setStrokeScores(prev => prev.slice(0, -1))
      setFeedbackStatus('idle')
      setErrorMessage('')
      redrawCanvas([], nextHistory, viewMode)
    }
  }

  // Điểm bắt đầu gợi ý cho nét hiện tại trong hệ tọa độ font
  const currentMedian = medians[currentStrokeIndex]
  const hintStartFont =
    showHint &&
    currentStrokeIndex < totalStrokes &&
    currentMedian &&
    currentMedian.length > 0
      ? currentMedian[0]
      : null

  // Đánh giá xếp loại điểm hoàn thành
  const avgTotalScore =
    strokeScores.length > 0
      ? Math.round(strokeScores.reduce((a, b) => a + b, 0) / strokeScores.length)
      : 0

  const getScoreRating = (sc: number) => {
    if (sc >= 90) return { label: 'Xuất sắc', color: '#059669', bg: '#ecfdf5' }
    if (sc >= 75) return { label: 'Rất tốt', color: '#0d9488', bg: '#f0fdfa' }
    if (sc >= 60) return { label: 'Khá tốt', color: '#d97706', bg: '#fffbeb' }
    return { label: 'Cần luyện thêm', color: '#ea580c', bg: '#fff7ed' }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {/* Bộ chọn Chế độ hiển thị nét (View Mode Switcher) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          gap: '4px',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <button
          type="button"
          onClick={() => setViewMode('compare')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 10px',
            borderRadius: '9px',
            border: 'none',
            backgroundColor: viewMode === 'compare' ? '#ffffff' : 'transparent',
            color: viewMode === 'compare' ? '#059669' : '#64748b',
            fontWeight: viewMode === 'compare' ? 700 : 600,
            fontSize: '0.82rem',
            boxShadow:
              viewMode === 'compare' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          title="Xem cả nét mẫu chuẩn và nét bạn vừa viết để đối chiếu độ chính xác"
        >
          <Layers size={15} />
          <span>Đối chiếu</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('handwriting')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 10px',
            borderRadius: '9px',
            border: 'none',
            backgroundColor: viewMode === 'handwriting' ? '#ffffff' : 'transparent',
            color: viewMode === 'handwriting' ? '#0f172a' : '#64748b',
            fontWeight: viewMode === 'handwriting' ? 700 : 600,
            fontSize: '0.82rem',
            boxShadow:
              viewMode === 'handwriting' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          title="Chỉ hiển thị chữ thật do bạn tự tay viết"
        >
          <PenTool size={15} />
          <span>Chữ tôi viết</span>
        </button>

        <button
          type="button"
          onClick={() => setViewMode('system')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 10px',
            borderRadius: '9px',
            border: 'none',
            backgroundColor: viewMode === 'system' ? '#ffffff' : 'transparent',
            color: viewMode === 'system' ? '#0284c7' : '#64748b',
            fontWeight: viewMode === 'system' ? 700 : 600,
            fontSize: '0.82rem',
            boxShadow:
              viewMode === 'system' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}
          title="Hiển thị nét font chữ chuẩn hệ thống"
        >
          <BookOpen size={15} />
          <span>Mẫu chuẩn</span>
        </button>
      </div>

      {/* Vùng card viền ngoài tương tác tập viết */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: `2.5px solid ${
            flashColor === 'green'
              ? '#10b981'
              : flashColor === 'red'
              ? '#ef4444'
              : '#e2e8f0'
          }`,
          transition: 'border-color 0.25s ease',
          overflow: 'hidden',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
          boxSizing: 'border-box',
          padding: '12px',
        }}
      >
        {/* Khung nội dung tập viết chung toạ độ 1:1 cho cả SVG và Canvas */}
        <div
          ref={innerAreaRef}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          }}
        >
          {/* Layer 1: Lưới ô chữ & Nét chuẩn dạng SVG */}
          <svg
            viewBox="0 0 1024 1024"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            {/* Lưới ô chữ Mễ tự / Điền tự */}
            {gridType !== 'none' && (
              <g stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8">
                <rect
                  x="2"
                  y="2"
                  width="1020"
                  height="1020"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="4"
                  strokeDasharray="none"
                />
                <line x1="512" y1="0" x2="512" y2="1024" />
                <line x1="0" y1="512" x2="1024" y2="512" />
                {gridType === 'mi' && (
                  <>
                    <line x1="0" y1="0" x2="1024" y2="1024" />
                    <line x1="0" y1="1024" x2="1024" y2="0" />
                  </>
                )}
              </g>
            )}

            {/* SVG các nét chữ Hán */}
            <g transform="scale(1, -1) translate(0, -900)">
              {/* 1. Bóng mờ toàn bộ chữ (Ghost) - hiện mờ ở mode compare/system, cực mờ ở handwriting */}
              <g
                fill="#f1f5f9"
                opacity={viewMode === 'handwriting' ? '0.2' : '0.8'}
              >
                {strokes.map((path, idx) => (
                  <path key={`ghost-${idx}`} d={path} />
                ))}
              </g>

              {/* 2. Gợi ý nét hiện tại khi bật showHint */}
              {showHint && currentStrokeIndex < totalStrokes && (
                <path
                  d={strokes[currentStrokeIndex]}
                  fill="#dcfce7"
                  stroke="#86efac"
                  strokeWidth="8"
                  strokeDasharray="16 8"
                  opacity="0.9"
                />
              )}

              {/* 3. Nét mẫu chuẩn (SVG) */}
              {/* Ở chế độ 'system': nét màu đen chuẩn */}
              {viewMode === 'system' && (
                <g fill="#0f172a">
                  {strokes.slice(0, currentStrokeIndex).map((path, idx) => (
                    <path key={`done-sys-${idx}`} d={path} />
                  ))}
                </g>
              )}

              {/* Ở chế độ 'compare': nét mẫu chuẩn hiển thị mờ đục 35% làm nền tham chiếu đối chiếu */}
              {viewMode === 'compare' && (
                <g fill="#94a3b8" opacity="0.35">
                  {strokes.slice(0, currentStrokeIndex).map((path, idx) => (
                    <path key={`done-comp-${idx}`} d={path} />
                  ))}
                </g>
              )}

              {/* 4. Điểm chấm gợi ý vị trí bắt đầu nét trong hệ tọa độ font */}
              {hintStartFont && (
                <g>
                  <circle
                    cx={hintStartFont[0]}
                    cy={hintStartFont[1]}
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="5"
                    opacity="0.75"
                  />
                  <circle
                    cx={hintStartFont[0]}
                    cy={hintStartFont[1]}
                    r="22"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="6"
                  />
                </g>
              )}
            </g>
          </svg>

          {/* Layer 2: HTML5 Canvas nhận thao tác vẽ và giữ nguyên nét viết của người dùng */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              cursor: feedbackStatus === 'completed' ? 'default' : 'crosshair',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'none',
            }}
          />

          {/* Badge thứ tự nét góc dưới */}
          <div
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(4px)',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '3px 10px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: currentStrokeIndex >= totalStrokes ? '#10b981' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              pointerEvents: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            {currentStrokeIndex >= totalStrokes ? (
              <>
                <CheckCircle2 size={14} color="#10b981" />
                <span>Hoàn thành ({totalStrokes} nét)</span>
              </>
            ) : (
              <span>
                Nét {currentStrokeIndex + 1} / {totalStrokes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Thông điệp phản hồi kết quả nét vẽ */}
      <div
        style={{
          width: '100%',
          minHeight: '68px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <StrokeFeedback
          status={feedbackStatus}
          currentStrokeIndex={currentStrokeIndex}
          totalStrokes={totalStrokes}
          errorMessage={errorMessage}
          hanzi={hanzi}
          score={avgTotalScore > 0 ? avgTotalScore : undefined}
          onReset={handleReset}
        />
      </div>

      {/* Bảng tổng kết kết quả tập viết khi đã hoàn thành (Inline Comparison Card) */}
      {feedbackStatus === 'completed' && (
        <div
          style={{
            width: '100%',
            backgroundColor: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#10b981" />
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1e293b' }}>
                Đánh giá chất lượng nét viết
              </span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: getScoreRating(avgTotalScore).bg,
                color: getScoreRating(avgTotalScore).color,
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              <span>{getScoreRating(avgTotalScore).label}</span>
              <span>&bull;</span>
              <span>{avgTotalScore}/100 điểm</span>
            </div>
          </div>

          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
            Bạn có thể dùng thanh chuyển <strong>[Đối chiếu]</strong>,{' '}
            <strong>[Chữ tôi viết]</strong> hoặc <strong>[Mẫu chuẩn]</strong> ở trên để ngắm nhìn lại chữ mình viết và so sánh với phông chữ gốc!
          </p>

          {/* Chi tiết từng nét (Accordion) */}
          <button
            type="button"
            onClick={() => setShowScoreDetails(!showScoreDetails)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            <span>Chi tiết độ chính xác từng nét ({strokeScores.length} nét)</span>
            {showScoreDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showScoreDetails && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '8px',
                backgroundColor: '#ffffff',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              {strokeScores.map((sc, i) => (
                <div
                  key={`score-item-${i}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '6px 4px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Nét {i + 1}</span>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: sc >= 80 ? '#059669' : sc >= 60 ? '#d97706' : '#ea580c',
                    }}
                  >
                    {sc}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Thanh công cụ thao tác */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Nút Undo nét trước */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={currentStrokeIndex === 0 || feedbackStatus === 'completed'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '9px',
              border: '1px solid #cbd5e1',
              backgroundColor: currentStrokeIndex === 0 ? '#f8fafc' : '#ffffff',
              color: currentStrokeIndex === 0 ? '#94a3b8' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: currentStrokeIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Undo2 size={16} />
            <span>Lùi 1 nét</span>
          </button>

          {/* Nút Reset viết lại từ đầu */}
          <button
            type="button"
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '9px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <RotateCcw size={16} />
            <span>Viết lại</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Bật / tắt gợi ý */}
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9px',
              border: '1px solid #cbd5e1',
              backgroundColor: showHint ? '#ecfdf5' : '#ffffff',
              color: showHint ? '#065f46' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Lightbulb size={16} color={showHint ? '#10b981' : '#64748b'} />
            <span>{showHint ? 'Gợi ý: Bật' : 'Gợi ý: Tắt'}</span>
          </button>

          {/* Đổi ô lưới */}
          <button
            type="button"
            onClick={() => {
              const next: GridType =
                gridType === 'mi' ? 'tian' : gridType === 'tian' ? 'none' : 'mi'
              setGridType(next)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Đổi kiểu lưới chữ"
          >
            <Grid size={16} color="#10b981" />
            <span>
              {gridType === 'mi'
                ? 'Lưới 米'
                : gridType === 'tian'
                ? 'Lưới 田'
                : 'Tắt lưới'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
