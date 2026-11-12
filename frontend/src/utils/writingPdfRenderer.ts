import {
  type WritingCharStrokeDto,
  type WritingWordItemDto,
} from '../api/vocabPractice'

export type PdfFontStyle = 'handwriting' | 'print'

export interface WritingPdfConfig {
  vocabSetTitle: string
  creatorName: string
  rowsPerChar: number
  cellSizeMm: number
  fontStyle: PdfFontStyle
  showFaintTrace: boolean
}

export interface WorksheetCharRowGroup {
  wordIndex: number
  word: WritingWordItemDto
  showWordHeader: boolean
  charDto: WritingCharStrokeDto
  topYmm: number
}

export interface WorksheetPage {
  pageNumber: number
  groups: WorksheetCharRowGroup[]
}

export const A4_WIDTH_MM = 210
export const A4_HEIGHT_MM = 297
export const MARGIN_X_MM = 12
export const MARGIN_TOP_MM = 12
export const MARGIN_BOTTOM_MM = 12
export const CONTENT_WIDTH_MM = A4_WIDTH_MM - MARGIN_X_MM * 2 // 186mm

export const HEADER_PAGE1_H_MM = 15
export const HEADER_NEXT_H_MM = 9
export const WORD_LABEL_H_MM = 6.5
export const CELL_GAP_MM = 1.2
export const CHAR_GROUP_GAP_MM = 2.0
export const WORD_GAP_MM = 4.0

export function computeColsPerRow(cellSizeMm: number): number {
  return Math.max(
    4,
    Math.floor((CONTENT_WIDTH_MM + CELL_GAP_MM) / (cellSizeMm + CELL_GAP_MM))
  )
}

function getCharGroupHeightMm(rowsPerChar: number, cellSizeMm: number): number {
  return rowsPerChar * cellSizeMm + Math.max(0, rowsPerChar - 1) * CELL_GAP_MM
}

/**
 * Paginates selected vocabulary words into exact millimeter A4 worksheet pages
 * shared across live preview and jsPDF export.
 */
export function buildWorksheetPages(
  words: WritingWordItemDto[],
  cellSizeMm: number,
  rowsPerChar: number
): WorksheetPage[] {
  if (words.length === 0) return []

  const maxY = A4_HEIGHT_MM - MARGIN_BOTTOM_MM
  const charGroupH = getCharGroupHeightMm(rowsPerChar, cellSizeMm)

  const pages: WorksheetPage[] = []
  let currentGroups: WorksheetCharRowGroup[] = []
  let pageNumber = 1
  let cursorY = MARGIN_TOP_MM + HEADER_PAGE1_H_MM

  const startNewPage = () => {
    if (currentGroups.length > 0) {
      pages.push({ pageNumber, groups: currentGroups })
      pageNumber += 1
      currentGroups = []
    }
    cursorY = MARGIN_TOP_MM + HEADER_NEXT_H_MM
  }

  for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
    const word = words[wordIdx]
    const chars =
      word.characters.length > 0
        ? word.characters
        : Array.from(word.hanzi).map((ch) => ({
            hanzi: ch,
            strokeCount: 0,
            strokes: [],
            medians: [],
            supported: false,
          }))

    const wholeWordH =
      WORD_LABEL_H_MM +
      chars.length * charGroupH +
      Math.max(0, chars.length - 1) * CHAR_GROUP_GAP_MM

    const usableFreshHeight = maxY - (MARGIN_TOP_MM + HEADER_NEXT_H_MM)
    // Keep entire word together if it fits cleanly on a page
    if (
      currentGroups.length > 0 &&
      wholeWordH <= usableFreshHeight &&
      cursorY + wholeWordH > maxY
    ) {
      startNewPage()
    }

    for (let cIdx = 0; cIdx < chars.length; cIdx++) {
      const needsWordHeader = cIdx === 0
      const segmentH = (needsWordHeader ? WORD_LABEL_H_MM : 0) + charGroupH

      if (currentGroups.length > 0 && cursorY + segmentH > maxY) {
        startNewPage()
      }

      currentGroups.push({
        wordIndex: wordIdx,
        word,
        showWordHeader: needsWordHeader,
        charDto: chars[cIdx],
        topYmm: cursorY,
      })

      cursorY += segmentH
      if (cIdx < chars.length - 1) {
        cursorY += CHAR_GROUP_GAP_MM
      }
    }

    cursorY += WORD_GAP_MM
  }

  if (currentGroups.length > 0) {
    pages.push({ pageNumber, groups: currentGroups })
  }

  return pages
}

function drawRiceGridCell(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isPrimarySample: boolean
) {
  ctx.save()

  // Dashed Rice Grid cross & diagonals
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = Math.max(0.7, size * 0.01)
  ctx.setLineDash([size * 0.05, size * 0.05])

  ctx.beginPath()
  ctx.moveTo(x + size / 2, y)
  ctx.lineTo(x + size / 2, y + size)
  ctx.moveTo(x, y + size / 2)
  ctx.lineTo(x + size, y + size / 2)
  ctx.moveTo(x, y)
  ctx.lineTo(x + size, y + size)
  ctx.moveTo(x + size, y)
  ctx.lineTo(x, y + size)
  ctx.stroke()

  // Solid outer square
  ctx.setLineDash([])
  ctx.strokeStyle = isPrimarySample ? '#334155' : '#94a3b8'
  ctx.lineWidth = Math.max(0.9, size * 0.016)
  ctx.strokeRect(x, y, size, size)

  ctx.restore()
}

function drawHanziInCell(
  ctx: CanvasRenderingContext2D,
  charDto: WritingCharStrokeDto,
  x: number,
  y: number,
  size: number,
  fontStyle: PdfFontStyle,
  isPrimarySample: boolean
) {
  const canDrawVector =
    fontStyle === 'handwriting' &&
    charDto.supported &&
    charDto.strokes.length > 0 &&
    typeof Path2D !== 'undefined'

  ctx.save()
  ctx.fillStyle = isPrimarySample ? '#0f172a' : '#64748b'
  ctx.globalAlpha = isPrimarySample ? 0.94 : 0.3

  if (canDrawVector) {
    const inner = size * 0.84
    const pad = (size - inner) / 2
    ctx.translate(x + pad, y + pad)
    ctx.scale(inner / 1024, -inner / 1024)
    ctx.translate(0, -900)
    for (const d of charDto.strokes) {
      ctx.fill(new Path2D(d))
    }
  } else {
    const fontFamily =
      fontStyle === 'handwriting'
        ? '"KaiTi", "STKaiti", "BiauKai", "DFKai-SB", "Noto Serif SC", serif'
        : '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif'
    const weight = fontStyle === 'handwriting' ? '400' : '600'
    const fontSize = Math.round(size * (fontStyle === 'handwriting' ? 0.72 : 0.68))
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(charDto.hanzi, x + size / 2, y + size * 0.52)
  }

  ctx.restore()
}

function renderPageToCanvas(
  canvas: HTMLCanvasElement,
  page: WorksheetPage,
  totalPages: number,
  config: WritingPdfConfig,
  pxPerMm: number
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const mm = (val: number) => val * pxPerMm
  const widthPx = Math.round(mm(A4_WIDTH_MM))
  const heightPx = Math.round(mm(A4_HEIGHT_MM))
  if (canvas.width !== widthPx || canvas.height !== heightPx) {
    canvas.width = widthPx
    canvas.height = heightPx
  }

  // Crisp paper background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, widthPx, heightPx)

  const leftX = mm(MARGIN_X_MM)
  const rightX = mm(A4_WIDTH_MM - MARGIN_X_MM)

  // Header
  ctx.save()
  if (page.pageNumber === 1) {
    ctx.fillStyle = '#0f172a'
    ctx.font = `800 ${Math.round(mm(5.4))}px "Be Vietnam Pro", "Inter", system-ui, sans-serif`
    ctx.textBaseline = 'top'
    ctx.fillText(config.vocabSetTitle || 'Luyện viết Tiếng Trung', leftX, mm(MARGIN_TOP_MM))

    ctx.fillStyle = '#475569'
    ctx.font = `500 ${Math.round(mm(2.9))}px "Be Vietnam Pro", "Inter", system-ui, sans-serif`
    ctx.fillText(`Người tạo: ${config.creatorName || 'Học viên'}`, leftX, mm(MARGIN_TOP_MM + 6.8))

    ctx.textAlign = 'right'
    ctx.fillStyle = '#0f766e'
    ctx.font = `800 ${Math.round(mm(3.4))}px "Be Vietnam Pro", "Inter", system-ui, sans-serif`
    ctx.fillText('HSK Master', rightX, mm(MARGIN_TOP_MM + 0.5))

    ctx.fillStyle = '#64748b'
    ctx.font = `500 ${Math.round(mm(2.5))}px "Be Vietnam Pro", "Inter", system-ui, sans-serif`
    ctx.fillText(`Trang 1/${totalPages}`, rightX, mm(MARGIN_TOP_MM + 5.2))
  } else {
    ctx.fillStyle = '#475569'
    ctx.font = `700 ${Math.round(mm(2.9))}px "Be Vietnam Pro", "Inter", system-ui, sans-serif`
    ctx.textBaseline = 'top'
    ctx.fillText(config.vocabSetTitle || 'Luyện viết Tiếng Trung', leftX, mm(MARGIN_TOP_MM))

    ctx.textAlign = 'right'
    ctx.fillText(`HSK Master · Trang ${page.pageNumber}/${totalPages}`, rightX, mm(MARGIN_TOP_MM))
  }

  // Thin divider under header
  const headerBottomY =
    mm(MARGIN_TOP_MM + (page.pageNumber === 1 ? HEADER_PAGE1_H_MM - 2.2 : HEADER_NEXT_H_MM - 2.0))
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = Math.max(1, mm(0.25))
  ctx.beginPath()
  ctx.moveTo(leftX, headerBottomY)
  ctx.lineTo(rightX, headerBottomY)
  ctx.stroke()
  ctx.restore()

  const colsPerRow = computeColsPerRow(config.cellSizeMm)
  const cellPx = mm(config.cellSizeMm)
  const gapPx = mm(CELL_GAP_MM)

  for (const group of page.groups) {
    let cursorYmm = group.topYmm

    if (group.showWordHeader) {
      ctx.save()
      const labelY = mm(cursorYmm + 0.8)
      ctx.textBaseline = 'top'

      const prefix = `${group.wordIndex + 1}. ${group.word.hanzi}`
      ctx.fillStyle = '#0f172a'
      ctx.font = `700 ${Math.round(mm(3.4))}px "Be Vietnam Pro", "Noto Sans SC", "Microsoft YaHei", sans-serif`
      ctx.fillText(prefix, leftX, labelY)

      const prefixWidth = ctx.measureText(prefix).width
      const restText = `  /${group.word.pinyin}/ — ${group.word.meaning}`
      ctx.fillStyle = '#475569'
      ctx.font = `500 ${Math.round(mm(2.9))}px "Be Vietnam Pro", "Inter", sans-serif`
      ctx.fillText(
        restText,
        leftX + prefixWidth,
        labelY + mm(0.35),
        rightX - (leftX + prefixWidth)
      )
      ctx.restore()

      cursorYmm += WORD_LABEL_H_MM
    }

    for (let r = 0; r < config.rowsPerChar; r++) {
      const rowY = mm(cursorYmm + r * (config.cellSizeMm + CELL_GAP_MM))
      for (let c = 0; c < colsPerRow; c++) {
        const cellX = leftX + c * (cellPx + gapPx)
        const isPrimary = c === 0
        drawRiceGridCell(ctx, cellX, rowY, cellPx, isPrimary)

        if (isPrimary || config.showFaintTrace) {
          drawHanziInCell(
            ctx,
            group.charDto,
            cellX,
            rowY,
            cellPx,
            config.fontStyle,
            isPrimary
          )
        }
      }
    }
  }
}

function buildSafeFilename(title: string): string {
  const cleaned = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${cleaned || 'hsk-master'}-luyen-viet.pdf`
}

/**
 * Generates and downloads an A4 PDF writing worksheet using high-DPI rasterized A4 pages
 * embedded cleanly into jsPDF so vector KaiTi strokes and printed CJK text render reliably across devices.
 */
export async function exportWritingWorksheetPdf(
  words: WritingWordItemDto[],
  config: WritingPdfConfig
): Promise<number> {
  const pages = buildWorksheetPages(words, config.cellSizeMm, config.rowsPerChar)
  if (pages.length === 0) return 0

  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  const canvas = document.createElement('canvas')
  const pxPerMm = 8 // ~203 DPI: crisp Rice Grids & strokes at fast generation speed

  pages.forEach((page, idx) => {
    if (idx > 0) {
      doc.addPage('a4', 'portrait')
    }
    renderPageToCanvas(canvas, page, pages.length, config, pxPerMm)
    doc.addImage(
      canvas,
      'PNG',
      0,
      0,
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
      undefined,
      'FAST'
    )
  })

  doc.save(buildSafeFilename(config.vocabSetTitle))
  return pages.length
}
