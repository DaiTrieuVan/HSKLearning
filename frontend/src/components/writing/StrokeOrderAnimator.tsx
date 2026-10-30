import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Grid,
  Eye,
  EyeOff,
  Gauge,
} from 'lucide-react'

export interface StrokeOrderAnimatorProps {
  hanzi: string
  strokes: string[]
  medians?: number[][][]
}

type GridType = 'mi' | 'tian' | 'none'

export const StrokeOrderAnimator: React.FC<StrokeOrderAnimatorProps> = ({
  hanzi,
  strokes,
}) => {
  const [currentStroke, setCurrentStroke] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [speed, setSpeed] = useState<number>(1)
  const [gridType, setGridType] = useState<GridType>('mi')
  const [showGhost, setShowGhost] = useState<boolean>(true)

  const strokeCount = strokes.length
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleNext = useCallback(() => {
    setCurrentStroke(prev => (prev + 1) % (strokeCount + 1))
  }, [strokeCount])

  const handlePrev = useCallback(() => {
    setCurrentStroke(prev => (prev === 0 ? strokeCount : prev - 1))
  }, [strokeCount])

  const handleReplay = () => {
    setCurrentStroke(0)
    setIsPlaying(true)
  }

  // Effect chạy animation tự động khi isPlaying = true
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    const intervalTime = Math.max(300, Math.round(900 / speed))
    timerRef.current = setInterval(() => {
      setCurrentStroke(prev => {
        if (prev >= strokeCount) {
          // Khi chạy hết chữ, tạm dừng 1.2s rồi lặp lại từ đầu
          return 0
        }
        return prev + 1
      })
    }, intervalTime)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, strokeCount])

  const speedOptions = [0.5, 1, 1.5, 2]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        maxWidth: '460px',
        margin: '0 auto',
      }}
    >
      {/* Khung vẽ SVG minh họa thứ tự nét */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxWidth: '360px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '2.5px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          padding: '12px',
        }}
      >
        <svg
          viewBox="0 0 1024 1024"
          style={{ width: '100%', height: '100%' }}
          role="img"
          aria-label={`Hoạt ảnh thứ tự nét của chữ ${hanzi}`}
        >
          {/* Lưới ô chữ Mễ tự (米) hoặc Điền tự (田) */}
          {gridType !== 'none' && (
            <g stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8">
              {/* Khung viền ngoài */}
              <rect x="2" y="2" width="1020" height="1020" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray="none" />
              {/* Trục dọc và ngang (Điền tự cách) */}
              <line x1="512" y1="0" x2="512" y2="1024" />
              <line x1="0" y1="512" x2="1024" y2="512" />
              {/* Hai đường chéo (Mễ tự cách) */}
              {gridType === 'mi' && (
                <>
                  <line x1="0" y1="0" x2="1024" y2="1024" />
                  <line x1="0" y1="1024" x2="1024" y2="0" />
                </>
              )}
            </g>
          )}

          {/* Nhóm nét chữ Hán MakeMeAHanzi: chuẩn hóa hệ trục tọa độ font */}
          <g transform="scale(1, -1) translate(0, -900)">
            {/* 1. Ghost outline: toàn bộ chữ hiển thị mờ */}
            {showGhost && (
              <g fill="#e2e8f0" opacity="0.65">
                {strokes.map((strokePath, idx) => (
                  <path key={`ghost-${idx}`} d={strokePath} />
                ))}
              </g>
            )}

            {/* 2. Các nét đã hoàn thành trước nét hiện tại (Màu mực đen/xám đậm) */}
            <g fill="#1e293b">
              {strokes.slice(0, Math.max(0, currentStroke - 1)).map((strokePath, idx) => (
                <path key={`completed-${idx}`} d={strokePath} />
              ))}
            </g>

            {/* 3. Nét đang được vẽ / nhấn mạnh (Màu ngọc lục bảo / Primary) */}
            {currentStroke > 0 && currentStroke <= strokeCount && (
              <path
                d={strokes[currentStroke - 1]}
                fill="#10b981"
                style={{
                  filter: 'drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.5))',
                  transition: 'fill 0.2s ease',
                }}
              />
            )}
          </g>
        </svg>

        {/* Huy hiệu hiển thị nét hiện tại */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: currentStroke > 0 ? '#10b981' : '#64748b',
          }}
        >
          {currentStroke === 0 ? 'Bắt đầu' : `Nét ${currentStroke} / ${strokeCount}`}
        </div>
      </div>

      {/* Thanh điều khiển phát hoạt ảnh */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#f8fafc',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Nút lùi nét */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false)
              handlePrev()
            }}
            title="Nét trước"
            aria-label="Nét trước"
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={18} color="#475569" />
          </button>

          {/* Nút Play/Pause */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Tạm dừng hoạt ảnh' : 'Phát hoạt ảnh'}
            aria-label={isPlaying ? 'Tạm dừng hoạt ảnh' : 'Phát hoạt ảnh'}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Dừng' : 'Phát'}</span>
          </button>

          {/* Nút tiến nét */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false)
              handleNext()
            }}
            title="Nét tiếp theo"
            aria-label="Nét tiếp theo"
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={18} color="#475569" />
          </button>

          {/* Nút phát lại từ đầu */}
          <button
            type="button"
            onClick={handleReplay}
            title="Phát lại từ đầu"
            aria-label="Phát lại từ đầu"
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={18} color="#475569" />
          </button>
        </div>

        {/* Tùy chọn tốc độ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Gauge size={16} color="#64748b" />
          <div style={{ display: 'flex', gap: '2px' }}>
            {speedOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setSpeed(opt)}
                style={{
                  padding: '4px 6px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: speed === opt ? '#10b981' : 'transparent',
                  color: speed === opt ? '#ffffff' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {opt}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tùy chọn hiển thị lưới và bóng mờ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'center' }}>
        {/* Toggle loại ô lưới */}
        <button
          type="button"
          onClick={() => {
            const nextGrid: GridType = gridType === 'mi' ? 'tian' : gridType === 'tian' ? 'none' : 'mi'
            setGridType(nextGrid)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '0.8rem',
            color: '#334155',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Grid size={16} color="#10b981" />
          <span>Lưới: {gridType === 'mi' ? 'Mễ tự (米)' : gridType === 'tian' ? 'Điền tự (田)' : 'Tắt'}</span>
        </button>

        {/* Toggle bóng mờ toàn chữ */}
        <button
          type="button"
          onClick={() => setShowGhost(!showGhost)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontSize: '0.8rem',
            color: '#334155',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {showGhost ? <Eye size={16} color="#10b981" /> : <EyeOff size={16} color="#64748b" />}
          <span>{showGhost ? 'Ẩn chữ mờ' : 'Hiện chữ mờ'}</span>
        </button>
      </div>
    </div>
  )
}
