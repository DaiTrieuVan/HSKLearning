import React, { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Volume1,
  VolumeX,
  AlertCircle,
  RefreshCw,
  Gauge,
  Headphones,
} from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  autoPlay?: boolean
  className?: string
  onErrorOccurred?: (err: string) => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title,
  autoPlay = false,
  className = '',
  onErrorOccurred,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Reset khi src thay đổi
  useEffect(() => {
    setHasError(false)
    setErrorMessage('')
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(true)

    if (audioRef.current) {
      audioRef.current.load()
    }
  }, [src])

  const togglePlay = () => {
    if (!audioRef.current || hasError) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          handleAudioError('Không thể phát âm thanh: ' + (err?.message || 'Lỗi thiết bị âm thanh'))
        })
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0)
      setIsLoading(false)
      setHasError(false)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // HTT-10-CN-001-TC-02: Bắt lỗi khi tệp audio không tải được hoặc đường dẫn sai
  const handleAudioError = (customMsg?: string) => {
    setIsLoading(false)
    setIsPlaying(false)
    setHasError(true)
    const msg =
      customMsg ||
      'Không thể phát tệp âm thanh này. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.'
    setErrorMessage(msg)
    if (onErrorOccurred) {
      onErrorOccurred(msg)
    }
  }

  const handleRetry = () => {
    setHasError(false)
    setErrorMessage('')
    setIsLoading(true)
    if (audioRef.current) {
      audioRef.current.load()
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          handleAudioError('Thử lại thất bại. Tệp âm thanh không khả dụng trên máy chủ.')
        })
    }
  }

  const handleRewind5s = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed)
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    setIsMuted(val === 0)
    if (audioRef.current) {
      audioRef.current.volume = val
      audioRef.current.muted = val === 0
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    audioRef.current.muted = nextMuted
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const speedOptions = [0.75, 1.0, 1.25, 1.5]

  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl ${className}`}
    >
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => handleAudioError()}
      />

      {/* Header trình phát */}
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-white">
              {title || 'Đoạn hội thoại luyện nghe'}
            </h4>
            <p className="text-xs text-indigo-200/70">HSK Listening Comprehension</p>
          </div>
        </div>

        {/* Trạng thái sóng âm thanh khi đang phát */}
        {isPlaying && (
          <div className="flex items-end space-x-1">
            <span className="h-2 w-1 animate-pulse rounded-full bg-indigo-400" />
            <span className="h-4 w-1 animate-pulse rounded-full bg-indigo-300 delay-75" />
            <span className="h-6 w-1 animate-pulse rounded-full bg-indigo-400 delay-150" />
            <span className="h-3 w-1 animate-pulse rounded-full bg-indigo-300 delay-100" />
            <span className="h-5 w-1 animate-pulse rounded-full bg-indigo-400 delay-200" />
          </div>
        )}
      </div>

      {/* HTT-10-CN-001-TC-02: Thông báo lỗi inline khi audio không tải được */}
      {hasError ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-200">{errorMessage}</p>
              <p className="mt-1 text-xs text-amber-300/70">
                Hệ thống không ghi nhận lượt nộp lỗi khi âm thanh chưa thể phát.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 inline-flex items-center space-x-2 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Thử tải lại audio</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Thanh trượt tiến độ (Scrubber) */}
          <div className="space-y-1.5">
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                disabled={isLoading || duration === 0}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700/60 accent-indigo-400 transition hover:bg-slate-700 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Thanh điều khiển Play, Tua, Speed, Volume */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {/* Play/Pause & Tua 5s */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleRewind5s}
                title="Tua lùi 5 giây"
                disabled={isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                disabled={isLoading}
                title={isPlaying ? 'Tạm dừng' : 'Phát audio'}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95 disabled:opacity-50"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
              </button>
            </div>

            {/* Chọn tốc độ phát */}
            <div className="flex items-center space-x-1.5 rounded-xl bg-white/5 p-1">
              <Gauge className="ml-1.5 h-3.5 w-3.5 text-slate-400" />
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleSpeedChange(speed)}
                  className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
                    playbackRate === speed
                      ? 'bg-indigo-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Điều chỉnh âm lượng */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                className="text-slate-400 transition hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="h-1.5 w-16 cursor-pointer appearance-none rounded-lg bg-slate-700/60 accent-indigo-400"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
export default AudioPlayer
