import React from 'react'
import { CheckCircle2, AlertCircle, Sparkles, Info, RotateCcw, PenTool } from 'lucide-react'
import type { StrokeErrorReason } from '../../utils/strokeMatching'

export interface StrokeFeedbackProps {
  status: 'idle' | 'drawing' | 'success_stroke' | 'error_stroke' | 'completed'
  currentStrokeIndex: number
  totalStrokes: number
  errorReason?: StrokeErrorReason
  errorMessage?: string
  hanzi: string
  score?: number
  onReset?: () => void
}

export const StrokeFeedback: React.FC<StrokeFeedbackProps> = ({
  status,
  currentStrokeIndex,
  totalStrokes,
  errorMessage,
  hanzi,
  score,
  onReset,
}) => {
  if (status === 'drawing') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          borderRadius: '10px',
          fontSize: '0.88rem',
          color: '#334155',
          fontWeight: 600,
          boxSizing: 'border-box',
          minHeight: '44px',
        }}
      >
        <PenTool size={18} color="#10b981" style={{ flexShrink: 0 }} />
        <span>
          Đang viết nét thứ <strong>{currentStrokeIndex + 1}</strong>... Hãy vẽ theo đúng hướng và hình dạng gợi ý.
        </span>
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '10px',
          fontSize: '0.88rem',
          color: '#166534',
          fontWeight: 600,
        }}
      >
        <Info size={18} color="#16a34a" style={{ flexShrink: 0 }} />
        <span>
          Bắt đầu vẽ nét thứ <strong>{currentStrokeIndex + 1}</strong> trên tổng số <strong>{totalStrokes}</strong> nét của chữ <strong>{hanzi}</strong>.
        </span>
      </div>
    )
  }

  if (status === 'error_stroke') {
    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '12px 16px',
          backgroundColor: '#fef2f2',
          border: '1.5px solid #fecaca',
          borderRadius: '10px',
          fontSize: '0.88rem',
          color: '#991b1b',
        }}
      >
        <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: '2px' }}>
            Nét thứ {currentStrokeIndex + 1} chưa chính xác!
          </div>
          <div style={{ color: '#b91c1c', fontSize: '0.82rem' }}>
            {errorMessage || 'Nét vẽ chưa đúng thứ tự hoặc hướng nét chưa chuẩn. Vui lòng thử lại theo nét gợi ý!'}
          </div>
        </div>
      </div>
    )
  }

  if (status === 'success_stroke') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: '#ecfdf5',
          border: '1.5px solid #a7f3d0',
          borderRadius: '10px',
          fontSize: '0.88rem',
          color: '#065f46',
          fontWeight: 600,
        }}
      >
        <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
        <span>
          Đúng rồi! Nét thứ <strong>{currentStrokeIndex}</strong> đã hoàn thành. Hãy tiếp tục nét tiếp theo!
        </span>
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 18px',
          backgroundColor: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '12px',
          color: '#14532d',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="#16a34a" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>
              Xuất sắc! Bạn đã viết hoàn thành chữ {hanzi}!
            </div>
            {score !== undefined && (
              <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 600 }}>
                Điểm độ chuẩn nét: <strong>{score}/100</strong>
              </div>
            )}
          </div>
        </div>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={16} />
            <span>Tập viết lại</span>
          </button>
        )}
      </div>
    )
  }

  return null
}
