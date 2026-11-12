let sharedAudioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return null
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioCtx()
    }
    if (sharedAudioCtx.state === 'suspended') {
      void sharedAudioCtx.resume()
    }
    return sharedAudioCtx
  } catch {
    return null
  }
}

function playTone(
  frequency: number,
  durationSec: number,
  delaySec: number,
  volumePercent: number,
  type: OscillatorType = 'sine',
  peakScale = 0.22
) {
  const ctx = getAudioContext()
  if (!ctx) return

  const clampedVol = Math.min(1, Math.max(0, volumePercent / 100)) * peakScale
  if (clampedVol <= 0.001) return

  const startTime = ctx.currentTime + delaySec
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, startTime)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(clampedVol, startTime + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + durationSec + 0.02)
}

export function playCorrectSound(volume = 70) {
  playTone(587.33, 0.12, 0, volume, 'triangle', 0.2) // D5
  playTone(880.0, 0.22, 0.08, volume, 'triangle', 0.24) // A5
}

export function playWrongSound(volume = 70) {
  playTone(260, 0.14, 0, volume, 'sawtooth', 0.1)
  playTone(205, 0.22, 0.11, volume, 'sawtooth', 0.1)
}

export function playTimeoutSound(volume = 70) {
  playTone(440, 0.14, 0, volume, 'sine', 0.16)
  playTone(330, 0.24, 0.14, volume, 'sine', 0.16)
}

export function playCoinSound(volume = 70) {
  playTone(987.77, 0.09, 0, volume, 'sine', 0.16) // B5
  playTone(1318.51, 0.2, 0.07, volume, 'sine', 0.18) // E6
}

export function playSampleSound(volume = 70) {
  playTone(659.25, 0.1, 0, volume, 'triangle', 0.2)
  playTone(987.77, 0.18, 0.08, volume, 'sine', 0.2)
}
