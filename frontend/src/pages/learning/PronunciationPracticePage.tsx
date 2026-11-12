import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Mic,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  History,
  RefreshCw,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  assessPronunciation,
  getPronunciationHistory,
  type PronunciationAssessmentResult,
  type PronunciationHistoryItem,
} from '../../api/pronunciation'

interface TargetPhrase {
  id?: number
  hanzi: string
  pinyin: string
  meaning: string
  level: string
  type: 'VOCABULARY' | 'SENTENCE'
}

const DEFAULT_TARGETS: TargetPhrase[] = [
  { hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào', level: 'HSK 1', type: 'VOCABULARY' },
  { hanzi: '谢谢', pinyin: 'xiè xie', meaning: 'Cảm ơn', level: 'HSK 1', type: 'VOCABULARY' },
  { hanzi: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt', level: 'HSK 1', type: 'VOCABULARY' },
  { hanzi: '对不起', pinyin: 'duì bu qǐ', meaning: 'Xin lỗi', level: 'HSK 1', type: 'VOCABULARY' },
  { hanzi: '我是学生', pinyin: 'wǒ shì xuésheng', meaning: 'Tôi là học sinh', level: 'HSK 1', type: 'SENTENCE' },
  { hanzi: '很高兴认识你', pinyin: 'hěn gāoxìng rènshí nǐ', meaning: 'Rất vui được làm quen với bạn', level: 'HSK 1', type: 'SENTENCE' },
  { hanzi: '今天天气很好', pinyin: 'jīntiān tiānqì hěn hǎo', meaning: 'Hôm nay thời tiết rất đẹp', level: 'HSK 2', type: 'SENTENCE' },
  { hanzi: '你想喝点儿什么？', pinyin: 'nǐ xiǎng hē diǎnr shénme?', meaning: 'Bạn muốn uống chút gì nào?', level: 'HSK 2', type: 'SENTENCE' },
]

export const PronunciationPracticePage: React.FC = () => {
  const { user } = useAuth()

  // Chọn từ/câu mục tiêu
  const [selectedTarget, setSelectedTarget] = useState<TargetPhrase>(DEFAULT_TARGETS[0])
  const [mode, setMode] = useState<'SUGGESTED' | 'CUSTOM'>('SUGGESTED')
  const [customText, setCustomText] = useState('')

  // Trạng thái ghi âm
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  // Trạng thái quyền micro (TC-02)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  // Kết quả chấm và lỗi (TC-01, TC-03, TC-04)
  const [isAssessing, setIsAssessing] = useState(false)
  const [result, setResult] = useState<PronunciationAssessmentResult | null>(null)
  const [assessmentError, setAssessmentError] = useState<string | null>(null)
  const [validationWarning, setValidationWarning] = useState<string | null>(null)

  // Lịch sử luyện tập (TC-05)
  const [historyList, setHistoryList] = useState<PronunciationHistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(true)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Media references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)
  const recordingStartTimeRef = useRef<number>(0)

  // Tải lịch sử người dùng
  const refreshHistory = () => {
    if (!user) return
    setIsLoadingHistory(true)
    getPronunciationHistory(user.token, 15)
      .then((data) => setHistoryList(data))
      .catch(() => {})
      .finally(() => setIsLoadingHistory(false))
  }

  useEffect(() => {
    if (!user) return
    let active = true
    getPronunciationHistory(user.token, 15)
      .then((data) => {
        if (active) {
          setHistoryList(data)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [user])

  // Giải phóng stream & timer khi unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  // Xác định văn bản chuẩn đang chọn
  const activeReferenceText = mode === 'SUGGESTED' ? selectedTarget.hanzi : customText.trim()
  const activeReferenceType = mode === 'SUGGESTED' ? selectedTarget.type : undefined

  // Kiểm tra văn bản chữ Hán hợp lệ
  const hasChineseCharacters = (text: string) => {
    return /[\u4e00-\u9fa5]/.test(text)
  }

  // Dừng ghi âm
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    setIsRecording(false)
  }, [])

  // Khởi động ghi âm
  const startRecording = useCallback(async () => {
    setPermissionError(null)
    setValidationWarning(null)
    setAssessmentError(null)
    setResult(null)

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setAudioBlob(null)

    if (!activeReferenceText) {
      setValidationWarning('Vui lòng chọn hoặc nhập nội dung chuẩn bằng chữ Hán trước khi ghi âm.')
      return
    }

    if (!hasChineseCharacters(activeReferenceText)) {
      setValidationWarning('Nội dung cần chấm phải chứa ít nhất một chữ Hán hợp lệ.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : ''

      const options = mimeType ? { mimeType } : undefined
      const recorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const finalDuration = (Date.now() - recordingStartTimeRef.current) / 1000
        setRecordingSeconds(finalDuration)

        // Dừng tracks của mic sau khi ghi xong
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }

        // TC-04: Client kiểm tra thời lượng < 0.5s
        if (finalDuration < 0.5) {
          setValidationWarning('Bản ghi âm quá ngắn (dưới 0.5 giây). Vui lòng phát âm rõ ràng từ hoặc câu rồi bấm dừng.')
          setAudioBlob(null)
          setAudioUrl(null)
          return
        }

        const blobType = recorder.mimeType || 'audio/webm'
        const blob = new Blob(audioChunksRef.current, { type: blobType })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
      }

      recorder.start(100)
      recordingStartTimeRef.current = Date.now()
      setIsRecording(true)
      setRecordingSeconds(0)

      timerRef.current = window.setInterval(() => {
        const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000
        setRecordingSeconds(elapsed)
        // Tự động dừng nếu quá 60s
        if (elapsed >= 60) {
          stopRecording()
        }
      }, 100)
    } catch (err: unknown) {
      setIsRecording(false)
      const errorObj = err as { name?: string; message?: string }
      if (errorObj?.name === 'NotAllowedError' || errorObj?.name === 'PermissionDeniedError') {
        // TC-02: Hướng dẫn cấp quyền không dùng modal
        setPermissionError(
          'Trình duyệt chưa được cấp quyền sử dụng microphone. Vui lòng bấm vào biểu tượng ổ khóa hoặc cài đặt trang web trên thanh địa chỉ trình duyệt, chọn "Cho phép Microphone" và bấm thử lại.'
        )
      } else {
        setPermissionError('Không thể truy cập microphone. Vui lòng kiểm tra thiết bị thu âm của bạn.')
      }
    }
  }, [activeReferenceText, audioUrl, stopRecording])

  // Gửi chấm điểm
  const handleAssess = async () => {
    if (!user) {
      setAssessmentError('Bạn cần đăng nhập để thực hiện chấm phát âm.')
      return
    }

    if (!audioBlob) {
      setValidationWarning('Chưa có bản ghi âm hợp lệ để chấm điểm.')
      return
    }

    if (!activeReferenceText || !hasChineseCharacters(activeReferenceText)) {
      setValidationWarning('Nội dung chuẩn không hợp lệ hoặc thiếu chữ Hán.')
      return
    }

    setIsAssessing(true)
    setAssessmentError(null)
    setValidationWarning(null)
    setResult(null)

    try {
      const assessmentData = await assessPronunciation(
        user.token,
        audioBlob,
        activeReferenceText,
        activeReferenceType,
        mode === 'SUGGESTED' ? selectedTarget.id : undefined,
        recordingSeconds
      )
      setResult(assessmentData)
      refreshHistory()
    } catch (err: unknown) {
      const apiErr = err as { code?: string; message?: string }
      if (apiErr?.code === 'PRONUNCIATION_PROVIDER_UNAVAILABLE') {
        setAssessmentError(
          'Dịch vụ nhận dạng giọng nói tạm thời bị gián đoạn kết nối hoặc quá thời gian. Kết quả chưa được lưu. Vui lòng bấm thử lại.'
        )
      } else if (apiErr?.code === 'INVALID_AUDIO') {
        setAssessmentError('Bản ghi âm không hợp lệ, quá ngắn hoặc chỉ có tiếng ồn. Vui lòng ghi âm lại.')
      } else {
        setAssessmentError(apiErr?.message || 'Không thể chấm điểm phát âm. Vui lòng thử lại sau.')
      }
    } finally {
      setIsAssessing(false)
    }
  }

  // Chuyển sang câu tiếp theo trong danh sách mẫu
  const handleNextTarget = () => {
    const currentIndex = DEFAULT_TARGETS.findIndex((t) => t.hanzi === selectedTarget.hanzi)
    const nextIndex = (currentIndex + 1) % DEFAULT_TARGETS.length
    setSelectedTarget(DEFAULT_TARGETS[nextIndex])
    setResult(null)
    setAudioBlob(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setAssessmentError(null)
    setValidationWarning(null)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981' // Xanh lá
    if (score >= 70) return '#3b82f6' // Xanh dương
    if (score >= 50) return '#f59e0b' // Vàng cam
    return '#ef4444' // Đỏ
  }

  return (
    <div className="max-w-[1000px] mx-auto w-full px-3.5 py-4 sm:px-5 sm:py-6 overflow-x-hidden">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <div
            className="w-10 h-10 rounded-[10px] shrink-0 flex items-center justify-center"
            style={{
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            <Mic size={24} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-[1.6rem] font-extrabold m-0 leading-tight" style={{ color: 'var(--text-main)' }}>
              Luyện phát âm & Chấm điểm AI
            </h1>
            <p className="m-0 mt-0.5 text-xs sm:text-[0.92rem] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Ghi âm giọng đọc để so sánh với chuẩn tiếng Trung và nhận đánh giá chi tiết
            </p>
          </div>
        </div>
      </div>

      {/* Cảnh báo cấp quyền micro inline (TC-02, Không dùng Modal) */}
      {permissionError && (
        <div
          className="p-3.5 sm:px-5 sm:py-4 mb-5 flex flex-col sm:flex-row items-start gap-3 sm:gap-3.5"
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <AlertTriangle size={24} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
          <div className="flex-1 min-w-0 w-full">
            <h3 style={{ margin: '0 0 6px 0', fontSize: '0.96rem', fontWeight: 700, color: '#92400e' }}>
              Yêu cầu quyền truy cập Microphone
            </h3>
            <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#b45309', lineHeight: 1.5 }}>
              {permissionError}
            </p>
            <button
              type="button"
              onClick={startRecording}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-[0.85rem] font-bold border-0 text-white cursor-pointer"
              style={{
                backgroundColor: '#d97706',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <RotateCcw size={16} /> Thử lại cấp quyền
            </button>
          </div>
        </div>
      )}

      {/* Cảnh báo kiểm tra dữ liệu hoặc lỗi upstream (TC-03, TC-04) */}
      {validationWarning && (
        <div
          className="px-3.5 py-3 sm:px-4 mb-4 flex items-center gap-2.5 text-sm font-semibold"
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: '#b91c1c',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{validationWarning}</span>
        </div>
      )}

      {assessmentError && (
        <div
          className="p-3.5 sm:px-4.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{
            backgroundColor: '#fef2f2',
            border: '1.5px solid #f87171',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div className="flex items-start sm:items-center gap-2.5 text-sm min-w-0" style={{ color: '#991b1b' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{assessmentError}</span>
          </div>
          <button
            type="button"
            onClick={handleAssess}
            disabled={!audioBlob || isAssessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-[0.82rem] font-bold text-white border-0 cursor-pointer shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: '#dc2626',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <RefreshCw size={14} /> Thử lại
          </button>
        </div>
      )}

      {/* Main Grid: Bộ chọn nội dung + Trình ghi âm & Kết quả */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-5 lg:gap-6 items-start">
        {/* CỘT TRÁI: BỘ CHỌN NỘI DUNG CHUẨN */}
        <div
          className="bg-white p-4 sm:p-5 min-w-0"
          style={{
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-card)', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setMode('SUGGESTED')
                setValidationWarning(null)
              }}
              className="flex-1 p-2.5 border-0 bg-transparent cursor-pointer text-xs sm:text-[0.9rem] whitespace-nowrap"
              style={{
                borderBottom: mode === 'SUGGESTED' ? '2px solid var(--primary)' : '2px solid transparent',
                fontWeight: mode === 'SUGGESTED' ? 800 : 600,
                color: mode === 'SUGGESTED' ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              Từ/Câu gợi ý
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('CUSTOM')
                setValidationWarning(null)
              }}
              className="flex-1 p-2.5 border-0 bg-transparent cursor-pointer text-xs sm:text-[0.9rem] whitespace-nowrap"
              style={{
                borderBottom: mode === 'CUSTOM' ? '2px solid var(--primary)' : '2px solid transparent',
                fontWeight: mode === 'CUSTOM' ? 800 : 600,
                color: mode === 'CUSTOM' ? 'var(--primary)' : 'var(--text-muted)',
              }}
            >
              Tùy chỉnh nội dung
            </button>
          </div>

          {mode === 'SUGGESTED' ? (
            <div className="flex flex-col gap-2.5 max-h-[260px] sm:max-h-[340px] lg:max-h-[420px] overflow-y-auto pr-0.5">
              {DEFAULT_TARGETS.map((item) => {
                const isSelected = selectedTarget.hanzi === item.hanzi
                return (
                  <div
                    key={item.hanzi}
                    onClick={() => {
                      setSelectedTarget(item)
                      setResult(null)
                      setAudioBlob(null)
                      if (audioUrl) {
                        URL.revokeObjectURL(audioUrl)
                        setAudioUrl(null)
                      }
                      setValidationWarning(null)
                    }}
                    className="p-3 sm:px-3.5 cursor-pointer transition-all flex items-center justify-between gap-3"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#f8fafc',
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'KaiTi, "STKaiti", serif' }}>
                          {item.hanzi}
                        </span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>
                          {item.pinyin}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {item.meaning}
                      </div>
                    </div>
                    <span
                      className="shrink-0 whitespace-nowrap"
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isSelected ? '#ffffff' : '#e2e8f0',
                        color: isSelected ? 'var(--primary)' : '#64748b',
                      }}
                    >
                      {item.level}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                Nhập từ hoặc câu tiếng Trung cần luyện:
              </label>
              <textarea
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value)
                  setValidationWarning(null)
                  setResult(null)
                }}
                placeholder="Ví dụ: 老师好，我是越南人。"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-card)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
              <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Nội dung phải từ 1 - 200 ký tự và chứa ít nhất một chữ Hán.
              </p>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: KHUNG GHI ÂM & BẢNG KẾT QUẢ CHẤM ĐIỂM */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Thẻ mục tiêu đang luyện */}
          <div
            className="bg-white p-4 sm:p-6 text-center"
            style={{
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Nội dung chuẩn cần đọc
            </div>
            <div
              className="text-3xl sm:text-[2.4rem] font-black tracking-wide mb-2 break-words"
              style={{
                color: 'var(--text-main)',
                fontFamily: 'KaiTi, "STKaiti", serif',
              }}
            >
              {activeReferenceText || 'Chưa nhập nội dung'}
            </div>
            {mode === 'SUGGESTED' && (
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1">
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {selectedTarget.pinyin}
                </span>
                <span style={{ color: '#94a3b8' }}>•</span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                  {selectedTarget.meaning}
                </span>
              </div>
            )}

            {/* KHU VỰC THAO TÁC GHI ÂM */}
            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              {isRecording ? (
                <div>
                  <div
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      cursor: 'pointer',
                      margin: '0 auto',
                      boxShadow: '0 0 0 10px rgba(239, 68, 68, 0.25)',
                      animation: 'pulse 1.5s infinite',
                    }}
                    onClick={stopRecording}
                    title="Bấm để dừng ghi âm"
                  >
                    <Square size={32} />
                  </div>
                  <div style={{ marginTop: '12px', fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>
                    {recordingSeconds.toFixed(1)}s / Đang ghi âm...
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={isAssessing}
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary)',
                      border: 'none',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: isAssessing ? 'not-allowed' : 'pointer',
                      margin: '0 auto',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                      transition: 'transform 0.15s ease',
                    }}
                    title="Bấm để bắt đầu ghi âm"
                  >
                    <Mic size={36} />
                  </button>
                  <div style={{ marginTop: '12px', fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {audioBlob ? 'Bấm để ghi âm lại' : 'Bấm micro để bắt đầu đọc'}
                  </div>
                </div>
              )}

              {/* Nghe lại bản ghi âm & Nút gửi chấm */}
              {audioUrl && !isRecording && (
                <div
                  style={{
                    width: '100%',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Thời lượng bản ghi: <strong>{recordingSeconds.toFixed(1)}s</strong></span>
                  </div>
                  <audio controls src={audioUrl} style={{ width: '100%', maxHeight: '40px' }} />

                  <button
                    type="button"
                    onClick={handleAssess}
                    disabled={isAssessing}
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 24px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: isAssessing ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {isAssessing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Đang chấm điểm AI...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Chấm điểm phát âm
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BẢNG KẾT QUẢ ĐÁNH GIÁ (TC-01) */}
          {result && (
            <div
              className="bg-white p-4 sm:p-6"
              style={{
                borderRadius: 'var(--radius-lg)',
                border: '1.5px solid var(--border-card)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 sm:mb-[18px]">
                <div className="flex items-center gap-2 min-w-0">
                  <Award size={22} className="shrink-0" style={{ color: getScoreColor(result.overallScore) }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Kết quả đánh giá phát âm
                  </h3>
                </div>
                {mode === 'SUGGESTED' && (
                  <button
                    type="button"
                    onClick={handleNextTarget}
                    className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.82rem] font-bold cursor-pointer"
                    style={{
                      border: '1px solid var(--border-card)',
                      backgroundColor: '#f8fafc',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Câu tiếp theo <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Điểm tổng thể */}
              <div
                className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-3.5 sm:gap-5 p-3.5 sm:p-4 mb-5"
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    border: `4px solid ${getScoreColor(result.overallScore)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: getScoreColor(result.overallScore) }}>
                    {result.overallScore}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700 }}>ĐIỂM TỔNG</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <CheckCircle2 size={18} className="shrink-0" style={{ color: getScoreColor(result.overallScore) }} />
                    <span style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {result.feedback}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    Mã đánh giá: <code>{result.feedbackCode}</code> • Thời điểm:{' '}
                    {new Date(result.assessedAt).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Các chỉ số thành phần */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="p-2.5 sm:p-3 text-center" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                  <div className="text-[0.68rem] sm:text-[0.78rem] text-slate-500 font-bold mb-1">ĐỘ CHÍNH XÁC</div>
                  <div className="text-lg sm:text-[1.3rem] font-extrabold" style={{ color: getScoreColor(result.accuracyScore) }}>
                    {result.accuracyScore}
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 text-center" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                  <div className="text-[0.68rem] sm:text-[0.78rem] text-slate-500 font-bold mb-1">ĐỘ TRÔI CHẢY</div>
                  <div className="text-lg sm:text-[1.3rem] font-extrabold" style={{ color: getScoreColor(result.fluencyScore) }}>
                    {result.fluencyScore}
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 text-center" style={{ backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
                  <div className="text-[0.68rem] sm:text-[0.78rem] text-slate-500 font-bold mb-1">ĐỘ HOÀN THIỆN</div>
                  <div className="text-lg sm:text-[1.3rem] font-extrabold" style={{ color: getScoreColor(result.completenessScore) }}>
                    {result.completenessScore}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LỊCH SỬ LUYỆN PHÁT ÂM (TC-05 - Tuyệt đối không có audio) */}
      <div
        className="mt-6 sm:mt-9 bg-white p-4 sm:px-6 sm:py-5"
        style={{
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--border-card)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center justify-between gap-2 cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <History size={20} className="shrink-0" style={{ color: 'var(--primary)' }} />
            <h3 className="m-0 text-base sm:text-[1.1rem] font-extrabold leading-snug" style={{ color: 'var(--text-main)' }}>
              Lịch sử luyện tập gần đây ({historyList.length})
            </h3>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm shrink-0">
            {isLoadingHistory && <RefreshCw size={14} className="animate-spin" />}
            {showHistory ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {showHistory && (
          <div style={{ marginTop: '16px' }}>
            {historyList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Chưa có lượt luyện phát âm nào được ghi nhận. Hãy bắt đầu ghi âm ngay hôm nay!
              </div>
            ) : (
              <>
                {/* Mobile Cards View */}
                <div className="md:hidden space-y-2.5">
                  {historyList.map((item) => (
                    <div
                      key={item.attemptId}
                      className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-extrabold text-base break-words"
                          style={{ fontFamily: 'KaiTi, "STKaiti", serif', color: 'var(--text-main)' }}
                        >
                          {item.referenceText}
                        </span>
                        <span
                          className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-extrabold"
                          style={{
                            backgroundColor: `${getScoreColor(item.overallScore)}18`,
                            color: getScoreColor(item.overallScore),
                          }}
                        >
                          {item.overallScore} điểm
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {item.feedback || item.feedbackCode}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/70">
                        <span>Độ chính xác: <strong className="text-slate-700">{item.accuracyScore}</strong></span>
                        <span>{new Date(item.assessedAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop & Tablet Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid var(--border-card)', color: '#64748b' }}>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Nội dung chuẩn</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Điểm tổng</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'center' }}>Độ chính xác</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700 }}>Đánh giá</th>
                        <th style={{ padding: '10px 12px', fontWeight: 700, textAlign: 'right' }}>Thời điểm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyList.map((item) => (
                        <tr key={item.attemptId} style={{ borderBottom: '1px solid var(--border-card)' }}>
                          <td style={{ padding: '12px', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'KaiTi, "STKaiti", serif', color: 'var(--text-main)' }}>
                            {item.referenceText}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                backgroundColor: `${getScoreColor(item.overallScore)}18`,
                                color: getScoreColor(item.overallScore),
                              }}
                            >
                              {item.overallScore}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>
                            {item.accuracyScore}
                          </td>
                          <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                            {item.feedback || item.feedbackCode}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '0.82rem' }}>
                            {new Date(item.assessedAt).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
