import React, { useState, useEffect } from 'react'
import {
  PenTool,
  Film,
  AlertCircle,
  Sparkles,
  BookOpen,
  Info,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  type HanziStrokeDetail,
  getCharacterStrokes,
} from '../../api/writing'
import { StrokeOrderAnimator } from '../../components/writing/StrokeOrderAnimator'
import { HanziTraceCanvas } from '../../components/writing/HanziTraceCanvas'
import { HanziCharacterPicker } from '../../components/writing/HanziCharacterPicker'

type TabMode = 'animation' | 'practice'

export const HanziWritingPracticePage: React.FC = () => {
  const { user } = useAuth()
  const token = user?.token || ''

  const [selectedHanzi, setSelectedHanzi] = useState<string>('你')
  const [activeTab, setActiveTab] = useState<TabMode>('practice')
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
            setErrorStatus(apiErr.message || 'Không thể tải dữ liệu nét vẽ của chữ này.')
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
        padding: '24px 20px 48px',
        maxWidth: '1080px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
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
          Học thứ tự nét chuẩn, xem hoạt ảnh mô phỏng và tập viết từng nét chữ Hán trên lưới chữ truyền thống.
        </p>
      </div>

      {/* Bộ chọn chữ Hán */}
      <HanziCharacterPicker
        token={token}
        selectedHanzi={selectedHanzi}
        onSelectHanzi={hanzi => setSelectedHanzi(hanzi)}
      />

      {/* Khối nội dung chính */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Header thông tin chữ và Tab chuyển chế độ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            borderBottom: '1.5px solid #f1f5f9',
            paddingBottom: '16px',
          }}
        >
          {/* Thông tin chữ Hán hiện tại */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 900,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              {selectedHanzi}
            </div>

            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
                Chữ: <strong>{selectedHanzi}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={14} />
                <span>
                  {strokeDetail
                    ? `Tổng số: ${strokeDetail.strokeCount} nét`
                    : 'Đang chuẩn bị dữ liệu nét'}
                </span>
              </div>
            </div>
          </div>

          {/* Tab chuyển đổi chế độ Xem hoạt ảnh / Tập viết */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'practice' ? '#ffffff' : 'transparent',
                color: activeTab === 'practice' ? '#10b981' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: activeTab === 'practice' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <PenTool size={16} />
              <span>Tập viết chữ</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('animation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'animation' ? '#ffffff' : 'transparent',
                color: activeTab === 'animation' ? '#10b981' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: activeTab === 'animation' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
            >
              <Film size={16} />
              <span>Xem thứ tự nét</span>
            </button>
          </div>
        </div>

        {/* Trạng thái Loading */}
        {loading && (
          <div
            style={{
              padding: '60px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#64748b',
            }}
          >
            <RefreshCw size={28} color="#10b981" className="animate-spin" />
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              Đang tải dữ liệu thứ tự nét cho chữ {selectedHanzi}...
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
              borderRadius: '12px',
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

        {/* Trạng thái Hiển thị bình thường khi có dữ liệu nét */}
        {!loading && !errorStatus && strokeDetail && (
          <div style={{ width: '100%', padding: '10px 0' }}>
            {activeTab === 'animation' ? (
              <StrokeOrderAnimator
                hanzi={strokeDetail.hanzi}
                strokes={strokeDetail.strokes}
                medians={strokeDetail.medians}
              />
            ) : (
              <HanziTraceCanvas
                hanzi={strokeDetail.hanzi}
                strokes={strokeDetail.strokes}
                medians={strokeDetail.medians}
              />
            )}

            {/* Thông tin nguồn dữ liệu & Bản quyền */}
            <div
              style={{
                marginTop: '32px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.75rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={13} color="#94a3b8" />
                <span>
                  Nguồn dữ liệu nét: <strong>{strokeDetail.source}</strong> ({strokeDetail.license})
                </span>
              </div>
              <div>HSK Master Writing Practice &bull; Hệ thống luyện viết trực tuyến</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
