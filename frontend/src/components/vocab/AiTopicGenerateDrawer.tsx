import React, { useState } from 'react'
import { X, Sparkles, Loader2, Check, CheckSquare, Square } from 'lucide-react'
import { aiGenerateByTopic, type AiVocabAutofillItem } from '../../api/vocabManagement'
import { useAuth } from '../../context/AuthContext'

interface AiTopicGenerateDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddWords: (words: AiVocabAutofillItem[]) => void
}

const TOPIC_SUGGESTIONS = [
  'Giao tiếp tại nhà hàng',
  'Khách sạn & Du lịch',
  'Sân bay & Di chuyển',
  'Mua sắm & Trả giá',
  'Công sở & Phỏng vấn',
  'Hỏi đường & Giao thông',
]

export const AiTopicGenerateDrawer: React.FC<AiTopicGenerateDrawerProps> = ({
  isOpen,
  onClose,
  onAddWords,
}) => {
  const { token } = useAuth()
  const [topic, setTopic] = useState('Giao tiếp tại nhà hàng')
  const [count, setCount] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedItems, setGeneratedItems] = useState<AiVocabAutofillItem[]>([])
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())

  if (!isOpen) return null

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!topic.trim() || !token) return

    try {
      setIsLoading(true)
      setError(null)
      const items = await aiGenerateByTopic(topic.trim(), count, token)
      setGeneratedItems(items)
      setSelectedIndices(new Set(items.map((_, i) => i)))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể sinh từ vựng qua AI')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIndices.size === generatedItems.length) {
      setSelectedIndices(new Set())
    } else {
      setSelectedIndices(new Set(generatedItems.map((_, i) => i)))
    }
  }

  const toggleIndex = (index: number) => {
    const next = new Set(selectedIndices)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setSelectedIndices(next)
  }

  const handleApply = () => {
    const selected = generatedItems.filter((_, i) => selectedIndices.has(i))
    if (selected.length === 0) return
    onAddWords(selected)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-800">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Sinh từ vựng thông minh bằng AI</h2>
                <p className="text-xs text-slate-500">
                  Nhập chủ đề bất kỳ, AI sẽ tự động phân tích và tạo danh sách từ vựng chuẩn ngữ pháp
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Chủ đề từ vựng bạn muốn học
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ví dụ: Đặt phòng khách sạn, Gọi món lẩu Tứ Xuyên..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !topic.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50 shrink-0"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Sinh từ</span>
                  </button>
                </div>
              </div>

              {/* Suggestions chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500">Gợi ý:</span>
                {TOPIC_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTopic(s)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Count selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700">Số lượng từ:</span>
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCount(num)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      count === num
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {num} từ
                  </button>
                ))}
              </div>
            </form>

            {/* Generated Results Preview Table */}
            {generatedItems.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      {selectedIndices.size === generatedItems.length ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      <span>Chọn tất cả ({selectedIndices.size}/{generatedItems.length})</span>
                    </button>
                  </div>
                  <span className="text-xs text-slate-500">Xem lại và bỏ chọn từ không cần</span>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden max-h-72 overflow-y-auto bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 w-8 text-center">#</th>
                        <th className="py-2.5 px-3">Chữ Hán</th>
                        <th className="py-2.5 px-3">Pinyin</th>
                        <th className="py-2.5 px-3">Nghĩa tiếng Việt</th>
                        <th className="py-2.5 px-3">Loại từ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {generatedItems.map((item, idx) => {
                        const isSelected = selectedIndices.has(idx)
                        return (
                          <tr
                            key={idx}
                            onClick={() => toggleIndex(idx)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'opacity-40 hover:opacity-75'
                            }`}
                          >
                            <td className="py-2 px-3 text-center">
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 mx-auto" />
                              ) : (
                                <span className="text-slate-400">&bull;</span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900 text-sm">{item.hanzi}</td>
                            <td className="py-2 px-3 text-emerald-700 font-mono font-medium">{item.pinyin}</td>
                            <td className="py-2 px-3 font-medium">{item.meaning}</td>
                            <td className="py-2 px-3 text-slate-500">{item.partOfSpeech}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50/70">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 text-xs font-semibold transition-colors"
            >
              Hủy
            </button>

            {generatedItems.length > 0 && (
              <button
                type="button"
                onClick={handleApply}
                disabled={selectedIndices.size === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Đưa {selectedIndices.size} từ vào bảng thêm</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
