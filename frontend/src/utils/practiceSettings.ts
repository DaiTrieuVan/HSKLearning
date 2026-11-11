export interface PracticeGameSettings {
  soundEffects: boolean
  coinSound: boolean
  volume: number // 0 - 100
  timePerQuestion: number // 15 - 60 giây
  autoAdvance: boolean
  autoAdvanceDelay: number // 2 - 10 giây
}

const STORAGE_KEY = 'hsk_practice_game_settings_v1'

export const DEFAULT_PRACTICE_SETTINGS: PracticeGameSettings = {
  soundEffects: true,
  coinSound: true,
  volume: 70,
  timePerQuestion: 30,
  autoAdvance: true,
  autoAdvanceDelay: 3,
}

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return fallback
  }
  return Math.min(max, Math.max(min, Math.round(value)))
}

export function loadPracticeSettings(): PracticeGameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PRACTICE_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<PracticeGameSettings>
    return {
      soundEffects: typeof parsed.soundEffects === 'boolean' ? parsed.soundEffects : DEFAULT_PRACTICE_SETTINGS.soundEffects,
      coinSound: typeof parsed.coinSound === 'boolean' ? parsed.coinSound : DEFAULT_PRACTICE_SETTINGS.coinSound,
      volume: clamp(parsed.volume, 0, 100, DEFAULT_PRACTICE_SETTINGS.volume),
      timePerQuestion: clamp(parsed.timePerQuestion, 15, 60, DEFAULT_PRACTICE_SETTINGS.timePerQuestion),
      autoAdvance: typeof parsed.autoAdvance === 'boolean' ? parsed.autoAdvance : DEFAULT_PRACTICE_SETTINGS.autoAdvance,
      autoAdvanceDelay: clamp(parsed.autoAdvanceDelay, 2, 10, DEFAULT_PRACTICE_SETTINGS.autoAdvanceDelay),
    }
  } catch {
    return { ...DEFAULT_PRACTICE_SETTINGS }
  }
}

export function savePracticeSettings(settings: PracticeGameSettings): PracticeGameSettings {
  const sanitized: PracticeGameSettings = {
    soundEffects: Boolean(settings.soundEffects),
    coinSound: Boolean(settings.coinSound),
    volume: clamp(settings.volume, 0, 100, DEFAULT_PRACTICE_SETTINGS.volume),
    timePerQuestion: clamp(settings.timePerQuestion, 15, 60, DEFAULT_PRACTICE_SETTINGS.timePerQuestion),
    autoAdvance: Boolean(settings.autoAdvance),
    autoAdvanceDelay: clamp(settings.autoAdvanceDelay, 2, 10, DEFAULT_PRACTICE_SETTINGS.autoAdvanceDelay),
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
  } catch {
    // Bỏ qua lỗi quota / private mode
  }
  return sanitized
}

export function resetPracticeSettings(): PracticeGameSettings {
  return savePracticeSettings({ ...DEFAULT_PRACTICE_SETTINGS })
}
