import React, { useState, useEffect } from 'react'
import { X, Sparkles, Plus, Trash2, Loader2, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { VocabSetSummary, CreateWordRow } from '../../api/vocabManagement'
import { batchSaveWords, aiAutofillWords, type AiVocabAutofillItem } from '../../api/vocabManagement'
import { useAuth } from '../../context/AuthContext'
import { AiTopicGenerateDrawer } from './AiTopicGenerateDrawer'

interface BatchAddWordsDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  vocabSets: VocabSetSummary[]
  defaultVocabSetId?: number | null
  onRequestCreateSet?: () => void
}

const DEFAULT_ROW: CreateWordRow = {
  hanzi: '',
  pinyin: '',
  meaning: '',
  partOfSpeech: 'noun',
  exampleSentence: '',
  notes: '',
}

const PART_OF_SPEECH_OPTIONS = [
  { value: 'noun', label: 'Danh từ' },
  { value: 'verb', label: 'Động từ' },
  { value: 'adjective', label: 'Tính từ' },
  { value: 'adverb', label: 'Phó từ' },
  { value: 'phrase', label: 'Cụm từ' },
  { value: 'pronoun', label: 'Đại từ' },
] as const

export const BatchAddWordsDrawer: React.FC<BatchAddWordsDrawerProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vocabSets,
  defaultVocabSetId,
  onRequestCreateSet,
}) => {
  const { token } = useAuth()
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null)
  const [rows, setRows] = useState<CreateWordRow[]>([
    { ...DEFAULT_ROW },
    { ...DEFAULT_ROW },
    { ...DEFAULT_ROW },
  ])
  const [isAiFilling, setIsAiFilling] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAiTopicOpen, setIsAiTopicOpen] = useState(false)

  useEffect(() => {
    if (defaultVocabSetId) {
      setSelectedSetId(defaultVocabSetId)
    } else if (vocabSets.length > 0 && (!selectedSetId || !vocabSets.some((s) => s.id === selectedSetId))) {
      setSelectedSetId(vocabSets[0].id)
    }
  }, [defaultVocabSetId, vocabSets, selectedSetId])

  if (!isOpen) return null

  const handleRowChange = (index: number, field: keyof CreateWordRow, value: string) => {
    setRows((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleAddRow = () => {
    setRows((prev) => [...prev, { ...DEFAULT_ROW }])
  }

  const handleDeleteRow = (index: number) => {
    if (rows.length <= 1) {
      setRows([{ ...DEFAULT_ROW }])
      return
    }
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAiAutofill = async () => {
    if (!token) return
    const wordsToFill = rows
      .map((r) => r.hanzi.trim())
      .filter((w) => w.length > 0)

    if (wordsToFill.length === 0) {
      setError('Vui lòng nhập ít nhất một Chữ Hán vào cột Từ/Cụm từ để AI tự động điền')
      return
    }

    try {
      setIsAiFilling(true)
      setError(null)
      const filled = await aiAutofillWords(wordsToFill, token)
      const map = new Map<string, AiVocabAutofillItem>()
      filled.forEach((item) => map.set(item.hanzi, item))

      setRows((prev) =>
        prev.map((row) => {
          const match = map.get(row.hanzi.trim())
          if (!match) return row
          return {
            ...row,
            pinyin: row.pinyin?.trim() || match.pinyin,
            meaning: row.meaning?.trim() || match.meaning,
            partOfSpeech: row.partOfSpeech || match.partOfSpeech,
            exampleSentence: row.exampleSentence?.trim() || match.exampleSentence,
          }
        })
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi AI tự động điền')
    } finally {
      setIsAiFilling(false)
    }
  }

  const handleAddFromAiTopic = (items: AiVocabAutofillItem[]) => {
    const newRows: CreateWordRow[] = items.map((item) => ({
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      meaning: item.meaning,
      partOfSpeech: item.partOfSpeech || 'noun',
      exampleSentence: item.exampleSentence,
      notes: '',
    }))

    // Replace empty placeholder rows or append
    setRows((prev) => {
      const nonEmpty = prev.filter((r) => r.hanzi.trim().length > 0)
      return [...nonEmpty, ...newRows]
    })
  }

  const validRows = rows.filter((r) => r.hanzi.trim().length > 0 && r.meaning.trim().length > 0)

  const handleSave = async () => {
    if (!token) return
    if (!selectedSetId) {
      setError('Vui lòng chọn hoặc tạo một bộ từ vựng trước khi lưu')
      return
    }
    if (validRows.length === 0) {
      setError('Vui lòng nhập ít nhất một từ vựng hợp lệ (yêu cầu Chữ Hán và Nghĩa tiếng Việt)')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await batchSaveWords(
        {
          vocabSetId: selectedSetId,
          words: validRows,
        },
        token
      )
      onSuccess()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu từ vựng')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 lg:pl-16">
          <div className="w-screen max-w-5xl h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-800">
            {/* Header */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-slate-200 bg-white space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Thêm từ vựng hàng loạt</h2>
                    <p className="text-xs text-slate-500">
                      Nhập nhanh nhiều từ, tận dụng AI tự động điền Pinyin, Nghĩa và Câu ví dụ
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng bảng thêm từ"
                  className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Select target set */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 shrink-0">Thêm vào bộ từ:</span>
                <select
                  value={selectedSetId ?? ''}
                  onChange={(e) => setSelectedSetId(Number(e.target.value))}
                  className="flex-1 min-w-[150px] sm:flex-none sm:min-w-[220px] max-w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-emerald-500"
                >
                  {vocabSets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.wordCount} từ)
                    </option>
                  ))}
                </select>

                {onRequestCreateSet && (
                  <button
                    type="button"
                    onClick={onRequestCreateSet}
                    className="shrink-0 whitespace-nowrap px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-emerald-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo mới</span>
                  </button>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiAutofill}
                  disabled={isAiFilling}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {isAiFilling ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Sparkles className="w-3.5 h-3.5 shrink-0" />}
                  <span>Điền đầy đủ bằng AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAiTopicOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Thêm nhanh bằng AI (Chủ đề)</span>
                </button>
              </div>

              <div className="flex items-center justify-end sm:justify-start text-xs font-medium text-slate-500">
                <span>{validRows.length}/{rows.length} từ sẵn sàng lưu</span>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-4 sm:mx-6 mt-3 sm:mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Dynamic Editable List (Cards on Mobile, Table on Tablet/Desktop) */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/40">
              {/* Mobile Card View (< md) */}
              <div className="md:hidden space-y-3">
                {rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold font-mono">
                        Từ #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(idx)}
                        title="Xóa dòng"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Từ / Cụm từ *
                        </label>
                        <input
                          type="text"
                          value={row.hanzi}
                          onChange={(e) => handleRowChange(idx, 'hanzi', e.target.value)}
                          placeholder="Chữ Hán..."
                          className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:bg-white focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Pinyin
                        </label>
                        <input
                          type="text"
                          value={row.pinyin || ''}
                          onChange={(e) => handleRowChange(idx, 'pinyin', e.target.value)}
                          placeholder="Pinyin..."
                          className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 font-mono text-xs focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-2.5">
                      <div className="col-span-7">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Nghĩa tiếng Việt *
                        </label>
                        <input
                          type="text"
                          value={row.meaning}
                          onChange={(e) => handleRowChange(idx, 'meaning', e.target.value)}
                          placeholder="Nghĩa..."
                          className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          Loại từ
                        </label>
                        <select
                          value={row.partOfSpeech || 'noun'}
                          onChange={(e) => handleRowChange(idx, 'partOfSpeech', e.target.value)}
                          className="w-full px-2 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                        >
                          {PART_OF_SPEECH_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Ví dụ tiếng Trung
                      </label>
                      <input
                        type="text"
                        value={row.exampleSentence || ''}
                        onChange={(e) => handleRowChange(idx, 'exampleSentence', e.target.value)}
                        placeholder="Câu ví dụ minh họa..."
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Ghi chú
                      </label>
                      <input
                        type="text"
                        value={row.notes || ''}
                        onChange={(e) => handleRowChange(idx, 'notes', e.target.value)}
                        placeholder="Từ đồng/trái nghĩa..."
                        className="w-full px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block rounded-2xl border border-slate-200 overflow-x-auto bg-white shadow-sm">
                <table className="w-full min-w-[820px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-3 w-40">TỪ / CỤM TỪ *</th>
                      <th className="py-3 px-3 w-36">PINYIN</th>
                      <th className="py-3 px-3 w-48">NGHĨA TIẾNG VIỆT *</th>
                      <th className="py-3 px-3 w-32">LOẠI TỪ</th>
                      <th className="py-3 px-3 min-w-[200px]">VÍ DỤ TIẾNG TRUNG</th>
                      <th className="py-3 px-3 w-36">GHI CHÚ</th>
                      <th className="py-3 px-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-medium font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.hanzi}
                            onChange={(e) => handleRowChange(idx, 'hanzi', e.target.value)}
                            placeholder="Chữ Hán..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:outline-none focus:bg-white focus:border-emerald-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.pinyin || ''}
                            onChange={(e) => handleRowChange(idx, 'pinyin', e.target.value)}
                            placeholder="Pinyin..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 font-mono text-xs focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.meaning}
                            onChange={(e) => handleRowChange(idx, 'meaning', e.target.value)}
                            placeholder="Nghĩa..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <select
                            value={row.partOfSpeech || 'noun'}
                            onChange={(e) => handleRowChange(idx, 'partOfSpeech', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                          >
                            {PART_OF_SPEECH_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.exampleSentence || ''}
                            onChange={(e) => handleRowChange(idx, 'exampleSentence', e.target.value)}
                            placeholder="Câu ví dụ minh họa..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            value={row.notes || ''}
                            onChange={(e) => handleRowChange(idx, 'notes', e.target.value)}
                            placeholder="Từ đồng/trái nghĩa..."
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(idx)}
                            title="Xóa dòng"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add row button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Thêm dòng mới</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3.5 sm:px-6 sm:py-4 border-t border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 sm:px-5 py-2.5 min-h-[42px] rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 text-xs font-semibold transition-colors"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || validRows.length === 0}
                className="flex items-center gap-2 px-5 sm:px-6 py-2.5 min-h-[42px] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Lưu {validRows.length} mục từ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Topic Sub-Drawer */}
      <AiTopicGenerateDrawer
        isOpen={isAiTopicOpen}
        onClose={() => setIsAiTopicOpen(false)}
        onAddWords={handleAddFromAiTopic}
      />
    </>
  )
}
