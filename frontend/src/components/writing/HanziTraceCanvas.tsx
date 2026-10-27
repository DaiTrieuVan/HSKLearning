import React, { useRef, useState, useEffect, useCallback } from 'react'
import { RotateCcw, Undo2, Lightbulb, Grid, CheckCircle2 } from 'lucide-react'
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

export const HanziTraceCanvas: React.FC<HanziTraceCanvasProps> = ({
  hanzi,
  strokes,
  medians,
  onCompleted,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([])
  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'drawing' | 'success_stroke' | 'error_stroke' | 'completed'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [strokeScores, setStrokeScores] = useState<number[]>([])

  const [gridType, setGridType] = useState<GridType>('mi')
  const [showHint, setShowHint] = useState<boolean>(true)
  const [flashColor, setFlashColor] = useState<'none' | 'green' | 'red'>('none')

  const totalStrokes = strokes.length

  // Redraw canvas raw current drawing
  const redrawDrawing = useCallback(
    (points: Point[]) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (points.length < 2) return

      ctx.save()
      ctx.strokeStyle = '#059669' // Màu mực viết xanh ngọc
      ctx.lineWidth = 14
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y)
      }
      ctx.stroke()
      ctx.restore()
    },
    []
  )

  // Xử lý bắt đầu vẽ
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (feedbackStatus === 'completed') return

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.setPointerCapture(e.pointerId)
    const rect = canvas.getBoundingClientRect()
    const startPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setIsDrawing(true)
    setDrawnPoints([startPoint])
    setFeedbackStatus('drawing')
    setFlashColor('none')
  }

  // Xử lý đang vẽ
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const newPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    setDrawnPoints(prev => {
      const updated = [...prev, newPoint]
      redrawDrawing(updated)
      return updated
    })
  }

  // Xử lý nhấc bút / kết thúc nét
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      canvas.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }

    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    if (drawnPoints.length < 2) {
      redrawDrawing([])
      setFeedbackStatus('idle')
      return
    }

    // So khớp nét vẽ với trung tuyến
    const expectedMedian = medians[currentStrokeIndex] as Array<[number, number]>
    const matchResult = matchStroke(
      drawnPoints,
      expectedMedian,
      currentStrokeIndex,
      width,
      height
    )

    // Xóa nét vẽ thô trên canvas
    redrawDrawing([])

    if (matchResult.isMatch) {
      // Đúng nét!
      setFlashColor('green')
      setTimeout(() => setFlashColor('none'), 400)

      const nextIndex = currentStrokeIndex + 1
      const newScores = [...strokeScores, matchResult.score]
      setStrokeScores(newScores)

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
      // Vẽ sai nét (HTT-10-CN-002-TC-02: Báo nét sai và không tiến bước)
      setFlashColor('red')
      setTimeout(() => setFlashColor('none'), 400)
      setFeedbackStatus('error_stroke')
      setErrorMessage(matchResult.feedbackMessage)
    }
  }

  // Reset về trạng thái ban đầu
  const handleReset = () => {
    setCurrentStrokeIndex(0)
    setFeedbackStatus('idle')
    setErrorMessage('')
    setStrokeScores([])
    setDrawnPoints([])
    redrawDrawing([])
  }

  // Xóa nét vừa viết
  const handleUndo = () => {
    if (currentStrokeIndex > 0) {
      setCurrentStrokeIndex(prev => prev - 1)
      setStrokeScores(prev => prev.slice(0, -1))
      setFeedbackStatus('idle')
      setErrorMessage('')
      setDrawnPoints([])
      redrawDrawing([])
    }
  }

  // Resize canvas theo kích thước container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Điểm bắt đầu gợi ý cho nét hiện tại trong hệ tọa độ font
  const currentMedian = medians[currentStrokeIndex]
  const hintStartFont = showHint && currentStrokeIndex < totalStrokes && currentMedian && currentMedian.length > 0
    ? currentMedian[0]
    : null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      {/* Vùng canvas tương tác tập viết */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '360px',
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
          touchAction: 'none',
        }}
      >
        {/* Layer 1: Lưới ô chữ & Nét hoàn thành dạng SVG */}
        <svg
          viewBox="0 0 1024 1024"
          style={{
            position: 'absolute',
            top: '4%',
            left: '4%',
            width: '92%',
            height: '92%',
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
            {/* 1. Bóng mờ toàn bộ chữ (Ghost) */}
            <g fill="#f1f5f9" opacity="0.8">
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

            {/* 3. Các nét đã viết đúng hoàn chỉnh (Mực đen chuẩn) */}
            <g fill="#0f172a">
              {strokes.slice(0, currentStrokeIndex).map((path, idx) => (
                <path key={`done-${idx}`} d={path} />
              ))}
            </g>

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

        {/* Layer 2: HTML5 Canvas nhận thao tác vẽ của người dùng */}
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
          }}
        />

        {/* Badge thứ tự nét góc dưới */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
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

      {/* Thông điệp phản hồi kết quả nét vẽ */}
      <div style={{ width: '100%' }}>
        <StrokeFeedback
          status={feedbackStatus}
          currentStrokeIndex={currentStrokeIndex}
          totalStrokes={totalStrokes}
          errorMessage={errorMessage}
          hanzi={hanzi}
          score={
            strokeScores.length > 0
              ? Math.round(
                  strokeScores.reduce((a, b) => a + b, 0) / strokeScores.length
                )
              : undefined
          }
          onReset={handleReset}
        />
      </div>

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
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: currentStrokeIndex === 0 ? '#f8fafc' : '#ffffff',
              color: currentStrokeIndex === 0 ? '#94a3b8' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: currentStrokeIndex === 0 ? 'not-allowed' : 'pointer',
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
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
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
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: showHint ? '#ecfdf5' : '#ffffff',
              color: showHint ? '#065f46' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
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
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Đổi kiểu lưới chữ"
          >
            <Grid size={16} color="#10b981" />
            <span>{gridType === 'mi' ? 'Lưới 米' : gridType === 'tian' ? 'Lưới 田' : 'Tắt'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
