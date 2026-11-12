import React, { useState, useEffect } from 'react'
import { Search, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { type HanziStrokeSummary, checkCharactersSupport } from '../../api/writing'

export interface HanziCharacterPickerProps {
  token: string
  selectedHanzi: string
  onSelectHanzi: (hanzi: string) => void
}

const COMMON_HSK1_CHARACTERS = ['你', '好', '我', '他', '她', '们', '不', '很', '是', '吗', '水', '人', '大', '中', '国']

export const HanziCharacterPicker: React.FC<HanziCharacterPickerProps> = ({
  token,
  selectedHanzi,
  onSelectHanzi,
}) => {
  const [inputText, setInputText] = useState<string>('')
  const [summaries, setSummaries] = useState<HanziStrokeSummary[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [inputError, setInputError] = useState<string>('')

  // Khi người dùng nhập text và ấn tra cứu
  const handleCheckSupport = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) {
      setInputError('Vui lòng nhập chữ Hán cần tra cứu')
      return
    }

    // Lọc ký tự chữ Hán
    setInputError('')
    setLoading(true)
    try {
      const results = await checkCharactersSupport(token, trimmed)
      setSummaries(results)

      // Nếu có ít nhất 1 chữ trong kết quả, tự động chọn chữ đầu tiên
      if (results.length > 0) {
        onSelectHanzi(results[0].character)
      }
    } catch {
      setInputError('Không thể kiểm tra dữ liệu chữ Hán. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Khởi tạo kiểm tra cho từ mặc định nếu summaries đang rỗng
  useEffect(() => {
    if (summaries.length === 0 && selectedHanzi) {
      checkCharactersSupport(token, selectedHanzi)
        .then(res => setSummaries(res))
        .catch(() => {})
    }
  }, [token, selectedHanzi, summaries.length])

  return (
    <div
      className="flex flex-col gap-3.5 bg-white p-3.5 sm:px-5 sm:py-4 rounded-[14px]"
      style={{
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Ô nhập chữ tự do */}
      <div className="flex gap-2 items-center min-w-0">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleCheckSupport(inputText)
              }
            }}
            placeholder="Nhập chữ Hán bất kỳ (ví dụ: 你, 你好, 谢谢)..."
            maxLength={20}
            className="w-full box-border px-3 py-2.5 sm:px-3.5 rounded-[10px] text-sm sm:text-[0.92rem] outline-none transition-colors"
            style={{
              border: '1.5px solid #cbd5e1',
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => handleCheckSupport(inputText)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2.5 sm:px-4 rounded-[10px] font-bold text-xs sm:text-[0.88rem] text-white border-0 shrink-0 whitespace-nowrap"
          style={{
            backgroundColor: '#10b981',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          <Search size={16} className="shrink-0" />
          <span>{loading ? 'Đang kiểm tra...' : 'Chọn chữ'}</span>
        </button>
      </div>

      {inputError && (
        <div style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 600 }}>
          {inputError}
        </div>
      )}

      {/* Hiển thị danh sách các ký tự đã nhập kèm trạng thái hỗ trợ */}
      {summaries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
            CÁC CHỮ ĐÃ CHỌN:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {summaries.map(item => {
              const isSelected = item.character === selectedHanzi
              return (
                <button
                  key={item.character}
                  type="button"
                  onClick={() => onSelectHanzi(item.character)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    border: `2px solid ${
                      isSelected
                        ? '#10b981'
                        : item.supported
                        ? '#cbd5e1'
                        : '#fecaca'
                    }`,
                    backgroundColor: isSelected
                      ? '#ecfdf5'
                      : item.supported
                      ? '#f8fafc'
                      : '#fef2f2',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: isSelected ? '#047857' : '#1e293b',
                    }}
                  >
                    {item.character}
                  </span>
                  {item.supported ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '0.72rem',
                        color: '#059669',
                        fontWeight: 700,
                      }}
                    >
                      <CheckCircle2 size={13} />
                      {item.strokeCount} nét
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        fontSize: '0.72rem',
                        color: '#dc2626',
                        fontWeight: 700,
                      }}
                    >
                      <AlertCircle size={13} />
                      Chưa có data
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Gợi ý các chữ Hán phổ biến */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#64748b' }}>
          <Sparkles size={14} color="#10b981" />
          <span>CHỮ HÁN HSK 1 PHỔ BIẾN:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {COMMON_HSK1_CHARACTERS.map(char => {
            const isSelected = char === selectedHanzi
            return (
              <button
                key={char}
                type="button"
                onClick={() => {
                  setInputText(char)
                  handleCheckSupport(char)
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  color: isSelected ? '#047857' : '#334155',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {char}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
