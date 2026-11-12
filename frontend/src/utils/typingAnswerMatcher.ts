export type TypingDirection = 'MEANING_TO_HANZI' | 'HANZI_TO_MEANING'

const VOWEL_TONE_TABLE: Record<string, [string, string, string, string, string]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  'ü': ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
}

const PARENTHESIZED_NOTE_REGEX = /\([^)]*\)|（[^）]*）/g
const TRAILING_PUNCTUATION_REGEX = /[。.,，!！?？~～、:：;；'"“”‘’`]+$/g
const SPLIT_ALTERNATIVES_REGEX = /[/|;；]+/
const SPLIT_MEANING_SENSES_REGEX = /[,，/|;；]+/

function collapseWhitespace(value: string): string {
  return value.replace(/\u3000/g, ' ').replace(/\s+/g, ' ').trim()
}

export function normalizeHanziAnswer(raw: string): string {
  return collapseWhitespace(raw)
    .replace(/\s+/g, '')
    .replace(TRAILING_PUNCTUATION_REGEX, '')
    .trim()
}

export function isHanziMatch(userInput: string, targetHanzi: string): boolean {
  const normalizedUser = normalizeHanziAnswer(userInput)
  if (!normalizedUser) return false

  const candidates = targetHanzi
    .split(SPLIT_ALTERNATIVES_REGEX)
    .map((part) => normalizeHanziAnswer(part))
    .filter(Boolean)

  const fullNormalizedTarget = normalizeHanziAnswer(targetHanzi)
  if (fullNormalizedTarget && !candidates.includes(fullNormalizedTarget)) {
    candidates.push(fullNormalizedTarget)
  }

  return candidates.includes(normalizedUser)
}

function normalizeVietnameseMeaning(raw: string): string {
  return collapseWhitespace(raw)
    .normalize('NFC')
    .toLowerCase()
    .replace(TRAILING_PUNCTUATION_REGEX, '')
    .trim()
}

export function isMeaningMatch(userInput: string, targetMeaning: string): boolean {
  const normalizedUser = normalizeVietnameseMeaning(userInput)
  if (!normalizedUser) return false

  const strippedUser = normalizeVietnameseMeaning(userInput.replace(PARENTHESIZED_NOTE_REGEX, ' '))

  const candidatePool = new Set<string>()
  const addVariants = (chunk: string) => {
    const full = normalizeVietnameseMeaning(chunk)
    const withoutNotes = normalizeVietnameseMeaning(chunk.replace(PARENTHESIZED_NOTE_REGEX, ' '))
    if (full) candidatePool.add(full)
    if (withoutNotes) candidatePool.add(withoutNotes)
  }

  addVariants(targetMeaning)
  targetMeaning.split(SPLIT_MEANING_SENSES_REGEX).forEach(addVariants)

  return candidatePool.has(normalizedUser) || (strippedUser.length > 0 && candidatePool.has(strippedUser))
}

function applyToneToSyllable(rawSyllable: string, tone: number): string {
  const clean = rawSyllable
    .normalize('NFC')
    .toLowerCase()
    .replace(/u:/g, 'ü')
    .replace(/v/g, 'ü')

  if (tone <= 0 || tone > 4) {
    return clean
  }

  const chars = Array.from(clean)
  let targetIndex = chars.findIndex((c) => c === 'a')
  if (targetIndex === -1) {
    targetIndex = chars.findIndex((c) => c === 'e')
  }
  if (targetIndex === -1) {
    const ouIndex = clean.indexOf('ou')
    if (ouIndex !== -1) {
      targetIndex = ouIndex
    }
  }
  if (targetIndex === -1) {
    for (let i = chars.length - 1; i >= 0; i -= 1) {
      if (chars[i] in VOWEL_TONE_TABLE) {
        targetIndex = i
        break
      }
    }
  }

  if (targetIndex !== -1) {
    const ch = chars[targetIndex]
    const table = VOWEL_TONE_TABLE[ch]
    if (table) {
      chars[targetIndex] = table[tone]
    }
  }

  return chars.join('')
}

/**
 * Chuẩn hóa Pinyin giữ nguyên thanh điệu (Phương án B):
 * - Chấp nhận chữ có dấu thanh (dǎ zhāo hu) hoặc số thanh (da3 zhao1 hu / da3zhao1hu / da3 zhao1 hu5).
 * - Chuẩn hóa v / u: -> ü (nv3 -> nǚ).
 * - Không xóa dấu thanh: gõ không dấu (da zhao hu) cho từ có thanh điệu sẽ không khớp.
 */
export function normalizeStrictTonePinyin(raw: string): string {
  const prepared = collapseWhitespace(raw)
    .normalize('NFC')
    .toLowerCase()
    .replace(/u:/g, 'ü')
    .replace(/v/g, 'ü')
    .replace(/['’-]/g, ' ')

  if (!prepared) return ''

  const tokens = prepared.split(/\s+/).filter(Boolean)
  const convertedParts: string[] = []

  for (const token of tokens) {
    // Tách các âm tiết nếu người học viết liền kèm số thanh (vd: "da3zhao1hu" hoặc "ni3hao3")
    const segments = token.match(/[^\d]+(?:[0-5])?/g) ?? [token]
    for (const seg of segments) {
      const match = /^(.+?)([0-5])$/.exec(seg)
      if (match) {
        const [, body, toneDigit] = match
        convertedParts.push(applyToneToSyllable(body, Number(toneDigit)))
      } else {
        convertedParts.push(seg)
      }
    }
  }

  return convertedParts.join('').replace(TRAILING_PUNCTUATION_REGEX, '')
}

export function isPinyinMatch(userInput: string, targetPinyin: string): boolean {
  const normalizedUser = normalizeStrictTonePinyin(userInput)
  if (!normalizedUser) return false

  const candidates = targetPinyin
    .split(SPLIT_ALTERNATIVES_REGEX)
    .map((part) => normalizeStrictTonePinyin(part))
    .filter(Boolean)

  const fullTarget = normalizeStrictTonePinyin(targetPinyin)
  if (fullTarget && !candidates.includes(fullTarget)) {
    candidates.push(fullTarget)
  }

  return candidates.includes(normalizedUser)
}

export function extractPrimaryMeaning(targetMeaning: string): string {
  const firstPart = targetMeaning.split(SPLIT_MEANING_SENSES_REGEX)[0] ?? targetMeaning
  const cleaned = collapseWhitespace(firstPart.replace(PARENTHESIZED_NOTE_REGEX, ' '))
  return cleaned || collapseWhitespace(targetMeaning)
}

function deterministicCharOrder(length: number): number[] {
  const indices: number[] = []
  for (let i = 0; i < length; i += 1) {
    indices.push(i)
  }
  if (length <= 2) return indices

  // Luôn ưu tiên ký tự đầu (0), ký tự cuối (length - 1), rồi chia đều phần giữa
  const ordered: number[] = [0]
  const used = new Set<number>([0])
  if (length > 2) {
    ordered.push(length - 1)
    used.add(length - 1)
  }

  let step = Math.max(2, Math.floor(length / 3))
  while (ordered.length < length) {
    let added = false
    for (let i = 1; i < length - 1; i += step) {
      if (!used.has(i)) {
        ordered.push(i)
        used.add(i)
        added = true
      }
    }
    if (!added) {
      for (let i = 1; i < length - 1; i += 1) {
        if (!used.has(i)) {
          ordered.push(i)
          used.add(i)
        }
      }
    }
    step = Math.max(1, Math.floor(step / 2))
  }
  return ordered
}

export interface ProgressiveHintResult {
  maskedText: string
  extraNote: string | null
}

/**
 * Tạo gợi ý từng bước (tối đa 3 lần bấm):
 * - Mỗi lần hé lộ thêm ký tự theo dạng `z _ _ ǎ n  g _ o`, luôn giữ lại ít nhất 1 ký tự ẩn nếu đủ dài.
 * - Với `Gõ từ · Nghĩa > Từ` (chữ Hán thường ngắn 1–3 chữ), từ lần gợi ý thứ 2 trở đi hiển thị thêm pinyin hỗ trợ nhớ chữ.
 */
export function buildProgressiveTypingHint(
  targetText: string,
  hintStep: number,
  options?: { extraPinyin?: string | null; direction?: TypingDirection; isPinyinMode?: boolean }
): ProgressiveHintResult | null {
  if (hintStep <= 0) return null

  const cleanTarget = collapseWhitespace(targetText)
  const chars = Array.from(cleanTarget)
  const revealablePositions: number[] = []

  chars.forEach((ch, idx) => {
    if (!/[\s.,，。!?！？、:：;；'’-]/.test(ch)) {
      revealablePositions.push(idx)
    }
  })

  if (revealablePositions.length === 0) {
    return null
  }

  const maxRevealable = revealablePositions.length > 1 ? revealablePositions.length - 1 : 1
  const targetRevealCount = Math.min(
    maxRevealable,
    Math.max(1, Math.ceil((revealablePositions.length * Math.min(3, hintStep)) / 3.8))
  )

  const order = deterministicCharOrder(revealablePositions.length)
  const revealedCharIndices = new Set<number>(
    order.slice(0, targetRevealCount).map((pos) => revealablePositions[pos])
  )

  const tokens = chars.map((ch, idx) => {
    if (ch === ' ') return '  '
    if (!revealablePositions.includes(idx)) return ch
    return revealedCharIndices.has(idx) ? ch : '_'
  })

  const maskedText = tokens.join(' ').replace(/\s{4,}/g, '   ').trim()
  const showExtraPinyin =
    !options?.isPinyinMode &&
    options?.direction === 'MEANING_TO_HANZI' &&
    hintStep >= 2 &&
    Boolean(options?.extraPinyin)

  return {
    maskedText,
    extraNote: showExtraPinyin ? `Phiên âm: ${options?.extraPinyin}` : null,
  }
}
