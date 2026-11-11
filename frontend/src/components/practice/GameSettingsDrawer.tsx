import React, { useEffect } from 'react'
import { Settings, Volume2, Clock, RotateCcw, X } from 'lucide-react'
import {
  type PracticeGameSettings,
  resetPracticeSettings,
  savePracticeSettings,
} from '../../utils/practiceSettings'
import { playSampleSound } from '../../utils/gameSounds'

interface GameSettingsDrawerProps {
  open: boolean
  onClose: () => void
  settings: PracticeGameSettings
  onChange: (next: PracticeGameSettings) => void
}

export const GameSettingsDrawer: React.FC<GameSettingsDrawerProps> = ({
  open,
  onClose,
  settings,
  onChange,
}) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const updateField = <K extends keyof PracticeGameSettings>(key: K, value: PracticeGameSettings[K]) => {
    const next = savePracticeSettings({
      ...settings,
      [key]: value,
    })
    onChange(next)
  }

  const handleReset = () => {
    const defaults = resetPracticeSettings()
    onChange(defaults)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right Slide-over Drawer (GEMINI.md Rule 4: Không dùng Modal/Popup) */}
      <aside
        role="dialog"
        aria-label="Cài đặt game luyện tập"
        className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">Cài đặt game</h2>
              <p className="text-xs text-slate-500">Tùy chỉnh âm thanh & thời gian làm bài</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Group 1: ÂM THANH */}
          <section className="space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Âm thanh
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              {/* Toggle: Âm thanh hiệu ứng */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-bold text-slate-800">Âm thanh hiệu ứng</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.soundEffects}
                  onClick={() => updateField('soundEffects', !settings.soundEffects)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    settings.soundEffects ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      settings.soundEffects ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle: Âm thanh cộng xu */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-200/80">
                <div>
                  <div className="text-sm font-bold text-slate-800">Âm thanh cộng xu / XP</div>
                  <div className="text-xs text-slate-500">Phát khi trả lời đúng và nhận thưởng XP</div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.coinSound}
                  onClick={() => updateField('coinSound', !settings.coinSound)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    settings.coinSound ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      settings.coinSound ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Slider: Âm lượng */}
              <div className="pt-2 border-t border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Âm lượng</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-extrabold">
                    {settings.volume}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.volume}
                  onChange={(e) => updateField('volume', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>Nhỏ</span>
                  <span>To</span>
                </div>

                <button
                  type="button"
                  onClick={() => playSampleSound(settings.volume)}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Thử âm thanh</span>
                </button>
              </div>
            </div>
          </section>

          {/* Group 2: THỜI GIAN */}
          <section className="space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Thời gian
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
              {/* Slider: Thời gian mỗi câu hỏi */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-bold text-slate-800">Thời gian mỗi câu hỏi</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                    {settings.timePerQuestion}s
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={settings.timePerQuestion}
                  onChange={(e) => updateField('timePerQuestion', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span>15s</span>
                  <span>30s</span>
                  <span>45s</span>
                  <span>60s</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Áp dụng cho: Trắc nghiệm, Nối từ, Gõ từ, Nghe viết.
                </p>
              </div>

              {/* Toggle: Tự động chuyển câu */}
              <div className="pt-3 border-t border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Tự động chuyển câu</div>
                    <div className="text-xs text-slate-500">Tự động sang câu tiếp theo sau khi xem đáp án</div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.autoAdvance}
                    onClick={() => updateField('autoAdvance', !settings.autoAdvance)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      settings.autoAdvance ? 'bg-violet-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        settings.autoAdvance ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Slider: Thời gian chờ */}
                <div
                  className={`rounded-xl border border-slate-200 bg-white p-3 space-y-2 transition-opacity ${
                    settings.autoAdvance ? 'opacity-100' : 'opacity-50 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Thời gian chờ chuyển câu</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-extrabold">
                      {settings.autoAdvanceDelay}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={10}
                    step={1}
                    value={settings.autoAdvanceDelay}
                    onChange={(e) => updateField('autoAdvanceDelay', Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>2s</span>
                    <span>6s</span>
                    <span>10s</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại mặc định</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm active:scale-95 transition-all"
          >
            Xong
          </button>
        </div>
      </aside>
    </div>
  )
}
