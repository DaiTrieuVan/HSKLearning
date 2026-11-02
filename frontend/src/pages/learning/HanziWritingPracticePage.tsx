import React, { useState, useEffect } from 'react'
import {
  PenTool,
  Film,
  AlertCircle,
  Sparkles,
  BookOpen,
  Info,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  type HanziStrokeDetail,
  getCharacterStrokes,
} from '../../api/writing'
import { StrokeOrderAnimator } from '../../components/writing/StrokeOrderAnimator'
import { HanziTraceCanvas } from '../../components/writing/HanziTraceCanvas'
import { HanziCharacterPicker } from '../../components/writing/HanziCharacterPicker'

export const HanziWritingPracticePage: React.FC = () => {
  const { user } = useAuth()
  const token = user?.token || ''

  const [selectedHanzi, setSelectedHanzi] = useState<string>('你')
  const [strokeDetail, setStrokeDetail] = useState<HanziStrokeDetail | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  // Tải dữ liệu nét của chữ Hán đã chọn
  useEffect(() => {
    let isCurrent = true

    const fetchStrokes = async () => {
      if (!token || !selectedHanzi) return

      setLoading(true)
      setErrorStatus(null)

      try {
        const data = await getCharacterStrokes(token, selectedHanzi)
        if (isCurrent) {
          setStrokeDetail(data)
        }
      } catch (err: unknown) {
        if (isCurrent) {
          setStrokeDetail(null)
          const apiErr = err as { code?: string; message?: string }
          if (apiErr.code === 'HANZI_STROKE_DATA_NOT_FOUND') {
            setErrorStatus('Chưa hỗ trợ chữ này')
          } else {
            setErrorStatus(
              apiErr.message || 'Không thể tải dữ liệu nét vẽ của chữ này.'
            )
          }
        }
      } finally {
        if (isCurrent) {
          setLoading(false)
        }
      }
    }

    void fetchStrokes()

    return () => {
      isCurrent = false
    }
  }, [token, selectedHanzi])

  return (
    <div
      style={{
        padding: '24px 24px 48px',
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Tiêu đề trang */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px',
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PenTool size={24} color="#10b981" />
          </div>
          <h1
            style={{
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#0f172a',
              margin: 0,
            }}
          >
            Luyện viết chữ Hán
          </h1>
        </div>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem' }}>
          Giao diện song song thông minh: vừa theo dõi hoạt ảnh nét mẫu chuẩn, vừa tập viết trực tiếp và giữ nguyên chữ viết tay để đối chiếu.
        </p>
      </div>

      {/* Bộ chọn chữ Hán */}
      <HanziCharacterPicker
        token={token}
        selectedHanzi={selectedHanzi}
        onSelectHanzi={hanzi => setSelectedHanzi(hanzi)}
      />

      {/* Trạng thái Loading */}
      {loading && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px solid #e2e8f0',
            padding: '70px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            color: '#64748b',
          }}
        >
          <RefreshCw size={32} color="#10b981" className="animate-spin" />
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
            Đang tải dữ liệu thứ tự nét cho chữ &quot;{selectedHanzi}&quot;...
          </div>
        </div>
      )}

      {/* Trạng thái Lỗi / Dữ liệu rỗng (HTT-10-CN-002-TC-03) */}
      {!loading && errorStatus && (
        <div
          role="alert"
          style={{
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            backgroundColor: '#fef2f2',
            borderRadius: '16px',
            border: '1.5px solid #fecaca',
          }}
        >
          <div
            style={{
              padding: '14px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertCircle size={36} color="#dc2626" />
          </div>

          <div style={{ maxWidth: '460px' }}>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#991b1b',
                margin: '0 0 6px 0',
              }}
            >
              {errorStatus}
            </h2>
            <p
              style={{
                fontSize: '0.88rem',
                color: '#b91c1c',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              Chữ Hán <strong>{selectedHanzi}</strong> hiện tại chưa có bộ dữ liệu tọa độ nét hoặc chưa được cập nhật trong kho học tập. Bạn có thể chọn chữ phổ biến như <strong>你</strong> hoặc <strong>好</strong> để tiếp tục luyện viết!
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedHanzi('你')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <Sparkles size={16} />
            <span>Chuyển sang chữ [你]</span>
          </button>
        </div>
      )}

      {/* Bố cục Song song (Dual View Layout) khi đã có dữ liệu */}
      {!loading && !errorStatus && strokeDetail && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(340px, 460px) 1fr',
            gap: '24px',
            alignItems: 'stretch',
          }}
          className="hanzi-dual-view-container"
        >
          {/* CỘT TRÁI: Hình mẫu chuẩn & Hoạt ảnh thứ tự nét */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Header Cột Trái */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '14px',
                borderBottom: '1.5px solid #f1f5f9',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                  }}
                >
                  {selectedHanzi}
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                    Chữ mẫu: <strong>{selectedHanzi}</strong>
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <BookOpen size={13} />
                    <span>Tổng số: {strokeDetail.strokeCount} nét</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                <Film size={14} color="#10b981" />
                <span>Hoạt ảnh mẫu</span>
              </div>
            </div>

            {/* Khung Animator xem hoạt ảnh chạy liên tục / bước nét */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <StrokeOrderAnimator
                hanzi={strokeDetail.hanzi}
                strokes={strokeDetail.strokes}
                medians={strokeDetail.medians}
              />
            </div>

            {/* Khối gợi ý quy tắc bút thuận */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#334155',
                }}
              >
                <Lightbulb size={15} color="#eab308" />
                <span>Quy tắc thứ tự nét cơ bản:</span>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  lineHeight: '1.6',
                }}
              >
                <li>Ngang trước sổ sau &bull; Phẩy trước mác sau</li>
                <li>Trên trước dưới sau &bull; Trái trước phải sau</li>
                <li>Ngoài trước trong sau &bull; Vào trước đóng sau</li>
              </ul>
            </div>
          </div>

          {/* CỘT PHẢI: Không gian luyện viết tay tương tác & Đối chiếu nét */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {/* Header Cột Phải */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '14px',
                borderBottom: '1.5px solid #f1f5f9',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PenTool size={20} color="#10b981" />
                <div>
                  <span
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#1e293b',
                    }}
                  >
                    Bảng luyện viết chữ
                  </span>
                  <span
                    style={{
                      marginLeft: '8px',
                      fontSize: '0.82rem',
                      color: '#64748b',
                    }}
                  >
                    (Lưu giữ nét chữ của bạn)
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={14} color="#059669" />
                <span>Nhận diện thứ tự & hướng nét</span>
              </div>
            </div>

            {/* Vùng tương tác Canvas */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <HanziTraceCanvas
                hanzi={strokeDetail.hanzi}
                strokes={strokeDetail.strokes}
                medians={strokeDetail.medians}
              />
            </div>
          </div>
        </div>
      )}

      {/* Thông tin bản quyền & Nguồn dữ liệu nét */}
      {!loading && !errorStatus && strokeDetail && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.78rem',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} color="#94a3b8" />
            <span>
              Nguồn dữ liệu nét chữ Hán: <strong>{strokeDetail.source}</strong> ({strokeDetail.license})
            </span>
          </div>
          <div>HSK Master Writing Practice &bull; Hệ thống luyện viết song song trực quan</div>
        </div>
      )}

      {/* Responsive Style cho màn hình di động / tablet nhỏ */}
      <style>{`
        @media (max-width: 1024px) {
          .hanzi-dual-view-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
