import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Eye,
  FileDown,
  FileText,
  Loader2,
  Printer,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  generateWritingSession,
  type WritingWordItemDto,
} from '../../api/vocabPractice'
import { PracticeFilterNoticeBanner } from '../../components/practice/PracticeFilterNoticeBanner'
import {
  buildUpdatedFilterSearchParams,
  fetchPracticeItemsWithFallback,
  normalizePracticeFilterStatus,
} from '../../utils/practiceFilter'
import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  buildWorksheetPages,
  CELL_GAP_MM,
  computeColsPerRow,
  exportWritingWorksheetPdf,
  HEADER_NEXT_H_MM,
  HEADER_PAGE1_H_MM,
  MARGIN_TOP_MM,
  MARGIN_X_MM,
  WORD_LABEL_H_MM,
  type PdfFontStyle,
  type WorksheetPage,
} from '../../utils/writingPdfRenderer'

const MAX_SELECTED_WORDS = 100

interface WorksheetSvgPageProps {
  page: WorksheetPage
  totalPages: number
  vocabSetTitle: string
  creatorName: string
  rowsPerChar: number
  cellSizeMm: number
  fontStyle: PdfFontStyle
  showFaintTrace: boolean
}

const WorksheetSvgPage: React.FC<WorksheetSvgPageProps> = ({
  page,
  totalPages,
  vocabSetTitle,
  creatorName,
  rowsPerChar,
  cellSizeMm,
  fontStyle,
  showFaintTrace,
}) => {
  const colsPerRow = computeColsPerRow(cellSizeMm)
  const rightX = A4_WIDTH_MM - MARGIN_X_MM
  const headerDividerY =
    MARGIN_TOP_MM + (page.pageNumber === 1 ? HEADER_PAGE1_H_MM - 2.2 : HEADER_NEXT_H_MM - 2.0)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden print:rounded-none print:border-none print:shadow-none print:break-after-page last:print:break-after-auto">
      <svg
        viewBox={`0 0 ${A4_WIDTH_MM} ${A4_HEIGHT_MM}`}
        className="w-full h-auto block print:w-[210mm] print:h-[297mm]"
        role="img"
        aria-label={`Trang luyện viết A4 số ${page.pageNumber}`}
      >
        <rect x="0" y="0" width={A4_WIDTH_MM} height={A4_HEIGHT_MM} fill="#ffffff" />

        {/* Page Header */}
        {page.pageNumber === 1 ? (
          <g>
            <text
              x={MARGIN_X_MM}
              y={MARGIN_TOP_MM + 4.8}
              fontSize={5.4}
              fontWeight={800}
              fill="#0f172a"
              fontFamily='"Be Vietnam Pro", Inter, system-ui, sans-serif'
            >
              {vocabSetTitle || 'Luyện viết Tiếng Trung'}
            </text>
            <text
              x={MARGIN_X_MM}
              y={MARGIN_TOP_MM + 10.2}
              fontSize={2.9}
              fontWeight={500}
              fill="#475569"
              fontFamily='"Be Vietnam Pro", Inter, system-ui, sans-serif'
            >
              Người tạo: {creatorName || 'Học viên'}
            </text>

            <text
              x={rightX}
              y={MARGIN_TOP_MM + 4.0}
              fontSize={3.4}
              fontWeight={800}
              fill="#0f766e"
              textAnchor="end"
              fontFamily='"Be Vietnam Pro", Inter, system-ui, sans-serif'
            >
              HSK Master
            </text>
            <text
              x={rightX}
              y={MARGIN_TOP_MM + 8.6}
              fontSize={2.5}
              fontWeight={500}
              fill="#64748b"
              textAnchor="end"
              fontFamily='"Be Vietnam Pro", Inter, system-ui, sans-serif'
            >
              Trang 1/{totalPages}
            </text>
          </g>
        ) : (
          <g>
            <text
              x={MARGIN_X_MM}
              y={MARGIN_TOP_MM + 3.8}
              fontSize={2.9}
              fontWeight={700}
              fill="#475569"
              fontFamily='"Be Vietnam Pro", Inter, system-ui, sans-serif'
            >
              {vocabSetTitle || 'Luyện viết Tiếng Trung'}
            </text>
            <text
              x={rightX}
              y={MARGIN_TOP_MM + 3.8}
              fontSize={2.9}
              fontWeight={700}
              fill="#475569"
              textAnchor="end"
              fontFamily='"Be Vietnam Pro", Inter, system-ui, sans-serif'
            >
              HSK Master · Trang {page.pageNumber}/{totalPages}
            </text>
          </g>
        )}

        <line
          x1={MARGIN_X_MM}
          y1={headerDividerY}
          x2={rightX}
          y2={headerDividerY}
          stroke="#e2e8f0"
          strokeWidth={0.28}
        />

        {/* Word Groups & Rice Grid Cells */}
        {page.groups.map((group, gIdx) => {
          const baseY = group.topYmm + (group.showWordHeader ? WORD_LABEL_H_MM : 0)

          return (
            <g key={`${group.word.vocabularyId}-${group.charDto.hanzi}-${gIdx}`}>
              {group.showWordHeader && (
                <text
                  x={MARGIN_X_MM}
                  y={group.topYmm + 4.2}
                  fontSize={3.3}
                  fontFamily='"Be Vietnam Pro", "Noto Sans SC", "Microsoft YaHei", sans-serif'
                >
                  <tspan fontWeight={700} fill="#0f172a">
                    {group.wordIndex + 1}. {group.word.hanzi}
                  </tspan>
                  <tspan fontSize={2.85} fontWeight={500} fill="#475569">
                    {`  /${group.word.pinyin}/ — ${group.word.meaning}`}
                  </tspan>
                </text>
              )}

              {Array.from({ length: rowsPerChar }).map((_, rowIdx) => {
                const cellY = baseY + rowIdx * (cellSizeMm + CELL_GAP_MM)
                return Array.from({ length: colsPerRow }).map((__, colIdx) => {
                  const cellX = MARGIN_X_MM + colIdx * (cellSizeMm + CELL_GAP_MM)
                  const isPrimary = colIdx === 0
                  const showGlyph = isPrimary || showFaintTrace

                  const useVectorHandwriting =
                    fontStyle === 'handwriting' &&
                    group.charDto.supported &&
                    group.charDto.strokes.length > 0

                  const inner = cellSizeMm * 0.84
                  const pad = (cellSizeMm - inner) / 2
                  const scale = inner / 1024

                  return (
                    <g key={`r${rowIdx}-c${colIdx}`}>
                      {/* Dashed Rice Grid */}
                      <g
                        stroke="#cbd5e1"
                        strokeWidth={0.14}
                        strokeDasharray="0.65 0.65"
                      >
                        <line
                          x1={cellX + cellSizeMm / 2}
                          y1={cellY}
                          x2={cellX + cellSizeMm / 2}
                          y2={cellY + cellSizeMm}
                        />
                        <line
                          x1={cellX}
                          y1={cellY + cellSizeMm / 2}
                          x2={cellX + cellSizeMm}
                          y2={cellY + cellSizeMm / 2}
                        />
                        <line
                          x1={cellX}
                          y1={cellY}
                          x2={cellX + cellSizeMm}
                          y2={cellY + cellSizeMm}
                        />
                        <line
                          x1={cellX + cellSizeMm}
                          y1={cellY}
                          x2={cellX}
                          y2={cellY + cellSizeMm}
                        />
                      </g>

                      {/* Crisp Cell Border */}
                      <rect
                        x={cellX}
                        y={cellY}
                        width={cellSizeMm}
                        height={cellSizeMm}
                        fill="none"
                        stroke={isPrimary ? '#334155' : '#94a3b8'}
                        strokeWidth={isPrimary ? 0.24 : 0.16}
                      />

                      {/* Hanzi Character */}
                      {showGlyph &&
                        (useVectorHandwriting ? (
                          <g
                            fill={isPrimary ? '#0f172a' : '#64748b'}
                            opacity={isPrimary ? 0.94 : 0.3}
                            transform={`translate(${cellX + pad}, ${cellY + pad}) scale(${scale}, ${-scale}) translate(0, -900)`}
                          >
                            {group.charDto.strokes.map((d, strokeIdx) => (
                              <path key={strokeIdx} d={d} />
                            ))}
                          </g>
                        ) : (
                          <text
                            x={cellX + cellSizeMm / 2}
                            y={cellY + cellSizeMm * 0.54}
                            fontSize={
                              cellSizeMm *
                              (fontStyle === 'handwriting' ? 0.72 : 0.68)
                            }
                            fontWeight={fontStyle === 'handwriting' ? 400 : 600}
                            fontFamily={
                              fontStyle === 'handwriting'
                                ? '"KaiTi", "STKaiti", "BiauKai", "DFKai-SB", serif'
                                : '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif'
                            }
                            fill={isPrimary ? '#0f172a' : '#64748b'}
                            opacity={isPrimary ? 0.94 : 0.3}
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {group.charDto.hanzi}
                          </text>
                        ))}
                    </g>
                  )
                })
              })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export const VocabWritingPdfPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const vocabSetIdParam = searchParams.get('vocabSetId')
  const lessonIdParam = searchParams.get('lessonId')
  const filterStatus = normalizePracticeFilterStatus(searchParams.get('filterStatus'))
  const order = (searchParams.get('order') as 'RANDOM' | 'DEFAULT') || 'DEFAULT'

  const parsedVocabSetId = vocabSetIdParam ? Number(vocabSetIdParam) : undefined
  const parsedLessonId = lessonIdParam ? Number(lessonIdParam) : undefined

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vocabSetTitle, setVocabSetTitle] = useState('Phiếu luyện viết Tiếng Trung')
  const [words, setWords] = useState<WritingWordItemDto[]>([])
  const [autoSwitchedFilterNotice, setAutoSwitchedFilterNotice] = useState<
    string | null
  >(null)

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  // PDF worksheet configuration
  const [rowsPerChar, setRowsPerChar] = useState(2)
  const [cellSizeMm, setCellSizeMm] = useState(14)
  const [fontStyle, setFontStyle] = useState<PdfFontStyle>('handwriting')
  const [showFaintTrace, setShowFaintTrace] = useState(true)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportMessage, setExportMessage] = useState<string | null>(null)

  const fetchPdfWords = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    setAutoSwitchedFilterNotice(null)

    try {
      const result = await fetchPracticeItemsWithFallback(
        filterStatus,
        (effectiveFilter) =>
          generateWritingSession(user.token, {
            vocabSetId: parsedVocabSetId,
            lessonId: parsedLessonId,
            filterStatus: effectiveFilter,
            order,
            limit: MAX_SELECTED_WORDS,
            mode: 'PDF',
          }),
        (res) => res.words.length === 0
      )

      if (result.switchedFromUnmasteredToAll) {
        setAutoSwitchedFilterNotice(
          'Bộ lọc "Chưa thuộc" hiện không còn từ nào — tự động tải từ "Tất cả từ" để bạn chọn in.'
        )
        setSearchParams(
          (prev) => buildUpdatedFilterSearchParams(prev, 'ALL'),
          { replace: true }
        )
      }

      setVocabSetTitle(result.data.vocabSetTitle)
      setWords(result.data.words)
      setSelectedIds(
        new Set(result.data.words.slice(0, 10).map((w) => w.vocabularyId))
      )
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải danh sách từ để tạo file luyện viết PDF'
      )
    } finally {
      setLoading(false)
    }
  }, [
    user,
    filterStatus,
    parsedVocabSetId,
    parsedLessonId,
    order,
    setSearchParams,
  ])

  useEffect(() => {
    void fetchPdfWords()
  }, [fetchPdfWords])

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return words
    return words.filter(
      (w) =>
        w.hanzi.toLowerCase().includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
    )
  }, [words, searchQuery])

  const selectedWords = useMemo(
    () => words.filter((w) => selectedIds.has(w.vocabularyId)),
    [words, selectedIds]
  )

  const pages = useMemo(
    () => buildWorksheetPages(selectedWords, cellSizeMm, rowsPerChar),
    [selectedWords, cellSizeMm, rowsPerChar]
  )

  const creatorName = user?.fullName?.trim() || user?.email || 'Học viên'

  const toggleWord = (vocabId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(vocabId)) {
        next.delete(vocabId)
      } else if (next.size < MAX_SELECTED_WORDS) {
        next.add(vocabId)
      }
      return next
    })
  }

  const handleSelectFirst10 = () => {
    const target = filteredWords.slice(0, 10).map((w) => w.vocabularyId)
    setSelectedIds(new Set(target))
  }

  const handleSelectMax100 = () => {
    const target = filteredWords
      .slice(0, MAX_SELECTED_WORDS)
      .map((w) => w.vocabularyId)
    setSelectedIds(new Set(target))
  }

  const handleClearSelection = () => {
    setSelectedIds(new Set())
  }

  const handleExportPdf = async () => {
    if (selectedWords.length === 0 || exportingPdf) return
    setExportingPdf(true)
    setExportMessage(null)
    try {
      const pageCount = await exportWritingWorksheetPdf(selectedWords, {
        vocabSetTitle,
        creatorName,
        rowsPerChar,
        cellSizeMm,
        fontStyle,
        showFaintTrace,
      })
      setExportMessage(`Đã tải xuống file PDF (${pageCount} trang A4).`)
    } catch (err: unknown) {
      setExportMessage(
        err instanceof Error
          ? `Lỗi xuất PDF: ${err.message}`
          : 'Không thể tạo file PDF'
      )
    } finally {
      setExportingPdf(false)
    }
  }

  const handlePrint = () => {
    if (selectedWords.length === 0) return
    window.print()
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        <p className="text-sm font-bold text-slate-600">
          Đang tải danh sách từ và nét chữ mẫu cho file luyện viết...
        </p>
      </div>
    )
  }

  if (error || words.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Không thể tải danh sách từ để in
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {error ?? 'Không có từ vựng nào có chữ Hán để tạo phiếu luyện viết.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => navigate('/practice')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold"
            >
              Quay lại Trung tâm Luyện tập
            </button>
            <button
              type="button"
              onClick={() => void fetchPdfWords()}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Thử tải lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 print:max-w-none print:space-y-0">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          body { background: #ffffff !important; margin: 0 !important; }
        }
      `}</style>

      {/* Top Navigation & Title (Hidden on Print) */}
      <div className="print:hidden bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate('/practice')}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
            aria-label="Quay lại Trung tâm Luyện tập"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                Tạo file Luyện viết PDF
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                Khổ A4 · Tối đa {MAX_SELECTED_WORDS} từ
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              Bộ từ: <strong className="text-slate-700">{vocabSetTitle}</strong> · {words.length} từ khả dụng
            </p>
          </div>
        </div>

        {/* Desktop Quick Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={selectedWords.length === 0 || exportingPdf}
            onClick={() => void handleExportPdf()}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-extrabold shadow-sm shadow-emerald-600/20 inline-flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {exportingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>{exportingPdf ? 'Đang tạo PDF...' : 'Tạo PDF'}</span>
          </button>

          <button
            type="button"
            disabled={selectedWords.length === 0}
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-800 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div className="print:hidden">
        {autoSwitchedFilterNotice && (
          <PracticeFilterNoticeBanner
            message={autoSwitchedFilterNotice}
            onDismiss={() => setAutoSwitchedFilterNotice(null)}
          />
        )}
        {exportMessage && (
          <div className="mt-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            {exportMessage}
          </div>
        )}
      </div>

      {/* Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start print:block">
        {/* LEFT: Settings + Word Picker (Hidden on Print) */}
        <div className="xl:col-span-5 space-y-4 print:hidden">
          {/* Cài đặt PDF */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold text-slate-900">Cài đặt phiếu luyện viết</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              {/* Số hàng viết mỗi chữ */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Số hàng viết mỗi chữ</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-extrabold">
                    {rowsPerChar} hàng
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={rowsPerChar}
                  onChange={(e) => setRowsPerChar(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                  <span>1 hàng</span>
                  <span>3 hàng</span>
                  <span>5 hàng</span>
                </div>
              </div>

              {/* Cỡ ô / chữ viết */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Cỡ ô / chữ viết</span>
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 font-extrabold">
                    {cellSizeMm} mm
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={20}
                  step={1}
                  value={cellSizeMm}
                  onChange={(e) => setCellSizeMm(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-0.5">
                  <span>10 mm (nhiều ô)</span>
                  <span>14 mm</span>
                  <span>20 mm (ô lớn)</span>
                </div>
              </div>
            </div>

            {/* Kiểu chữ & Hiện chữ mờ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="text-xs font-bold text-slate-700 mb-1.5">Kiểu chữ</div>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFontStyle('handwriting')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all ${
                      fontStyle === 'handwriting'
                        ? 'bg-white text-teal-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chữ viết tay
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontStyle('print')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-extrabold transition-all ${
                      fontStyle === 'print'
                        ? 'bg-white text-teal-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chữ in
                  </button>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-1.5">Hiện chữ mờ để đồ</div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showFaintTrace}
                  onClick={() => setShowFaintTrace((v) => !v)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-between transition-colors ${
                    showFaintTrace
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{showFaintTrace ? 'Đang bật (chữ mờ)' : 'Tắt (ô trống)'}</span>
                  <span
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                      showFaintTrace ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Chọn từ để in */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Chọn từ vựng để in</h2>
                <p className="text-[11px] font-semibold text-slate-500">
                  Đang chọn <strong className="text-teal-700">{selectedIds.size}</strong>/{words.length} từ · Tối đa {MAX_SELECTED_WORDS}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSelectFirst10}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold"
                >
                  10 đầu
                </button>
                <button
                  type="button"
                  onClick={handleSelectMax100}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-[11px] font-extrabold"
                >
                  Tối đa {Math.min(MAX_SELECTED_WORDS, filteredWords.length)}
                </button>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-slate-600 hover:text-rose-700 text-[11px] font-bold"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm chữ Hán, pinyin hoặc nghĩa..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-400"
              />
            </div>

            {/* Word chips grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredWords.map((word) => {
                const selected = selectedIds.has(word.vocabularyId)
                return (
                  <button
                    key={word.vocabularyId}
                    type="button"
                    onClick={() => toggleWord(word.vocabularyId)}
                    className={`text-left rounded-xl p-2.5 border transition-all flex items-start justify-between gap-2 ${
                      selected
                        ? 'bg-teal-50 border-teal-400 text-teal-950 shadow-sm'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900">
                          {word.hanzi}
                        </span>
                        <span className="text-[10px] font-semibold text-teal-700 truncate">
                          {word.pinyin}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {word.meaning}
                      </div>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                        selected
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-white border-slate-300'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                )
              })}

              {filteredWords.length === 0 && (
                <div className="col-span-full py-6 text-center text-xs text-slate-400">
                  Không tìm thấy từ phù hợp với &quot;{searchQuery}&quot;.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Live Paginated A4 Preview */}
        <div className="xl:col-span-7 print:w-full">
          <div className="bg-slate-100/90 border border-slate-200 rounded-2xl p-3 sm:p-4 space-y-3 print:bg-white print:border-none print:p-0 print:space-y-0">
            <div className="print:hidden flex flex-wrap items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-700" />
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Xem trước phiếu A4
                </span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                {pages.length} trang · {selectedWords.length} từ · {fontStyle === 'handwriting' ? 'Chữ viết tay' : 'Chữ in'}
              </span>
            </div>

            {selectedWords.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl py-16 px-4 text-center space-y-2 print:hidden">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-600">
                  Hãy chọn ít nhất 1 từ bên trái để xem trước bản in A4
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[820px] overflow-y-auto pr-1 print:max-h-none print:overflow-visible print:space-y-0 print:pr-0">
                {pages.map((page) => (
                  <WorksheetSvgPage
                    key={page.pageNumber}
                    page={page}
                    totalPages={pages.length}
                    vocabSetTitle={vocabSetTitle}
                    creatorName={creatorName}
                    rowsPerChar={rowsPerChar}
                    cellSizeMm={cellSizeMm}
                    fontStyle={fontStyle}
                    showFaintTrace={showFaintTrace}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
