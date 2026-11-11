const PART_OF_SPEECH_LABELS: Record<string, string> = {
  noun: 'DANH TỪ',
  verb: 'ĐỘNG TỪ',
  adjective: 'TÍNH TỪ',
  adverb: 'PHÓ TỪ',
  phrase: 'CỤM TỪ',
  pronoun: 'ĐẠI TỪ',
  measure: 'LƯỢNG TỪ',
  particle: 'TRỢ TỪ',
  conjunction: 'LIÊN TỪ',
  preposition: 'GIỚI TỪ',
  numeral: 'SỐ TỪ',
  idiom: 'THÀNH NGỮ',
  word: 'TỪ VỰNG',
}

export function formatPartOfSpeechLabel(pos?: string | null): string {
  if (!pos || !pos.trim()) return 'TỪ VỰNG'
  const lower = pos.trim().toLowerCase()
  return PART_OF_SPEECH_LABELS[lower] || pos.trim().toUpperCase()
}

export function speakChinese(text?: string | null, audioUrl?: string | null): void {
  if (audioUrl && audioUrl.trim()) {
    try {
      const audio = new Audio(audioUrl.trim())
      void audio.play().catch(() => {
        speakWithSpeechSynthesis(text)
      })
      return
    } catch {
      // Fallback sang SpeechSynthesis bên dưới
    }
  }
  speakWithSpeechSynthesis(text)
}

function speakWithSpeechSynthesis(text?: string | null): void {
  if (!text || !text.trim()) return
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.trim())
    utterance.lang = 'zh-CN'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }
}
