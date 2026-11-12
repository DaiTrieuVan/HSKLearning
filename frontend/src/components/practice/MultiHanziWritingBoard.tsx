import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Check, CheckCircle2, Play } from 'lucide-react'
import { type WritingCharStrokeDto } from '../../api/vocabPractice'
import { matchStroke, type Point } from '../../utils/strokeMatching'
import { playWrongSound } from '../../utils/gameSounds'

export interface MultiHanziWritingBoardHandle {
  previewActiveChar: () => void
  clearStrokes: () => void
}

interface MultiHanziWritingBoardProps {
  wordId: number
  characters: WritingCharStrokeDto[]
  mode: 'TRACE' | 'RECALL'
  answerRevealed: boolean
  disabled?: boolean
  soundEffects: boolean
  volume: number
  onCharProgressChange?: (completedChars: number, totalChars: number) => void
  onMistake?: () => void
  onPreviewStateChange?: (isPreviewing: boolean) => void
  onWordCompleted: () => void
}

interface CharBoxState {
  currentStrokeIndex: number
  userStrokes: Point[][]
  completed: boolean
}

function createInitialBoxStates(characters: WritingCharStrokeDto[]): CharBoxState[] {
  return characters.map(() => ({
    currentStrokeIndex: 0,
    userStrokes: [],
    completed: false,
  }))
}

interface HanziCharBoxProps {
  charData: WritingCharStrokeDto
  charIndex: number
  totalChars: number
  state: CharBoxState
  isActive: boolean
  mode: 'TRACE' | 'RECALL'
  answerRevealed: boolean
  locked: boolean
  previewStrokeStep: number | null
  soundEffects: boolean
  volume: number
  onActivate: (charIndex: number) => void
  onAcceptStroke: (charIndex: number, normalizedStroke: Point[]) => void
  onFreehandStroke: (charIndex: number, normalizedStroke: Point[]) => void
  onCompleteFallbackChar: (charIndex: number) => void
  onMistake: () => void
}

const HanziCharBox: React.FC<HanziCharBoxProps> = ({
  charData,
  charIndex,
  totalChars,
  state,
  isActive,
  mode,
  answerRevealed,
  locked,
  previewStrokeStep,
  soundEffects,
  volume,
  onActivate,
  onAcceptStroke,
  onFreehandStroke,
  onCompleteFallbackChar,
  onMistake,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const activePointsRef = useRef<Point[]>([])
  const flashTimerRef = useRef<number | null>(null)

  const [flashState, setFlashState] = useState<'none' | 'ok' | 'err'>('none')
  const [feedbackHint, setFeedbackHint] = useState<string | null>(null)

  const hasValidStrokeData =
    charData.supported &&
    charData.strokeCount > 0 &&
    charData.strokes.length === charData.medians.length &&
    charData.strokes.length > 0

  const isPreviewing = previewStrokeStep !== null && hasValidStrokeData
  const isBoxDone = state.completed
  const isInteractive = !locked && !isBoxDone

  const triggerFlash = useCallback((kind: 'ok' | 'err', hintText?: string) => {
    if (flashTimerRef.current !== null) {
      window.clearTimeout(flashTimerRef.current)
    }
    setFlashState(kind)
    setFeedbackHint(hintText ?? null)
    flashTimerRef.current = window.setTimeout(() => {
      setFlashState('none')
      setFeedbackHint(null)
    }, 650)
  }, [])

  useEffect(() => {
    return () => {
      if (flashTimerRef.current !== null) {
        window.clearTimeout(flashTimerRef.current)
      }
    }
  }, [])

  const redrawCanvas = useCallback(
    (activePoints: Point[], history: Point[][]) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const width = canvas.width / dpr
      const height = canvas.height / dpr
      if (width <= 0 || height <= 0) return

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, width, height)

      const brushSize = Math.max(5, Math.min(13, Math.round(width * 0.048)))
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (history.length > 0) {
        ctx.lineWidth = brushSize
        ctx.strokeStyle = isBoxDone ? '#047857' : '#0f172a'
        for (const stroke of history) {
          if (stroke.length < 2) continue
          ctx.beginPath()
          ctx.moveTo(stroke[0].x * width, stroke[0].y * height)
          for (let i = 1; i < stroke.length; i++) {
            ctx.lineTo(stroke[i].x * width, stroke[i].y * height)
          }
          ctx.stroke()
        }
      }

      if (activePoints.length >= 2) {
        ctx.lineWidth = brushSize
        ctx.strokeStyle = '#0d9488'
        ctx.beginPath()
        ctx.moveTo(activePoints[0].x, activePoints[0].y)
        for (let i = 1; i < activePoints.length; i++) {
          ctx.lineTo(activePoints[i].x, activePoints[i].y)
        }
        ctx.stroke()
      }

      ctx.restore()
    },
    [isBoxDone]
  )

  const syncCanvasResolution = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const rect = container.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return
    const dpr = window.devicePixelRatio || 1
    const targetW = Math.round(rect.width * dpr)
    const targetH = Math.round(rect.height * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }
    redrawCanvas(activePointsRef.current, state.userStrokes)
  }, [redrawCanvas, state.userStrokes])

  useEffect(() => {
    syncCanvasResolution()
    const container = containerRef.current
    if (!container) return
    const ro = new ResizeObserver(() => {
      if (!isDrawingRef.current) {
        syncCanvasResolution()
      }
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [syncCanvasResolution])

  useEffect(() => {
    redrawCanvas(activePointsRef.current, state.userStrokes)
  }, [state.userStrokes, redrawCanvas])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isInteractive || isPreviewing) return
    e.preventDefault()
    onActivate(charIndex)

    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.setPointerCapture(e.pointerId)
    } catch {
      // ignore unsupported capture
    }

    const rect = canvas.getBoundingClientRect()
    const startPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    isDrawingRef.current = true
    activePointsRef.current = [startPoint]
    redrawCanvas([startPoint], state.userStrokes)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const nextPoint: Point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    activePointsRef.current.push(nextPoint)
    redrawCanvas(activePointsRef.current, state.userStrokes)
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    isDrawingRef.current = false

    const canvas = canvasRef.current
    if (!canvas) return
    try {
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
    } catch {
      // ignore
    }

    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const drawn = activePointsRef.current
    activePointsRef.current = []

    if (drawn.length < 2 || width <= 0 || height <= 0) {
      redrawCanvas([], state.userStrokes)
      return
    }

    const normalized: Point[] = drawn.map((p) => ({
      x: p.x / width,
      y: p.y / height,
    }))

    if (!hasValidStrokeData) {
      onFreehandStroke(charIndex, normalized)
      return
    }

    const strokeIdx = state.currentStrokeIndex
    if (strokeIdx >= charData.medians.length) {
      redrawCanvas([], state.userStrokes)
      return
    }

    const expectedMedian = charData.medians[strokeIdx] as Array<[number, number]>
    const result = matchStroke(drawn, expectedMedian, strokeIdx, width, height)

    if (result.isMatch) {
      triggerFlash('ok')
      onAcceptStroke(charIndex, normalized)
    } else {
      triggerFlash('err', result.feedbackMessage || 'Sai nét · thử viết lại')
      redrawCanvas([], state.userStrokes)
      if (soundEffects) {
        playWrongSound(volume)
      }
      onMistake()
    }
  }

  const showOutline =
    mode === 'TRACE' || answerRevealed || isBoxDone || isPreviewing

  const showActiveGuideStroke =
    hasValidStrokeData &&
    !isPreviewing &&
    !isBoxDone &&
    (mode === 'TRACE' || answerRevealed) &&
    state.currentStrokeIndex < charData.strokes.length

  const hintMedian = showActiveGuideStroke
    ? charData.medians[state.currentStrokeIndex]
    : undefined
  const startDot = hintMedian && hintMedian.length > 0 ? hintMedian[0] : null

  const borderClass =
    flashState === 'err'
      ? 'border-rose-400 ring-2 ring-rose-300/60 bg-rose-50/20'
      : flashState === 'ok'
        ? 'border-emerald-400 ring-2 ring-emerald-300/60 bg-emerald-50/20'
        : isBoxDone
          ? 'border-emerald-400 bg-emerald-50/20'
          : isActive
            ? 'border-teal-500 ring-2 ring-teal-500/20 bg-white'
            : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <div
        ref={containerRef}
        onClick={() => isInteractive && onActivate(charIndex)}
        className={`relative aspect-square w-full rounded-2xl border-2 overflow-hidden transition-all shadow-sm select-none ${borderClass}`}
      >
        {/* SVG Layer: Rice Grid + MakeMeAHanzi Guide / Preview */}
        <svg
          viewBox="0 0 1024 1024"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {/* Lưới Mễ tự cách (米字格) */}
          <g stroke="#cbd5e1" strokeWidth="3" strokeDasharray="14 12" opacity="0.85">
            <line x1="512" y1="0" x2="512" y2="1024" />
            <line x1="0" y1="512" x2="1024" y2="512" />
            <line x1="0" y1="0" x2="1024" y2="1024" opacity="0.6" />
            <line x1="0" y1="1024" x2="1024" y2="0" opacity="0.6" />
          </g>

          {hasValidStrokeData && (
            <g transform="scale(1, -1) translate(0, -900)">
              {/* Ghost outline (visible in TRACE, Preview, Answer Reveal, or after box completion) */}
              {showOutline && (
                <g
                  fill={answerRevealed && !isBoxDone ? '#64748b' : '#94a3b8'}
                  opacity={
                    isPreviewing
                      ? 0.22
                      : answerRevealed && !isBoxDone
                        ? 0.55
                        : mode === 'TRACE'
                          ? 0.28
                          : 0.22
                  }
                >
                  {charData.strokes.map((d, idx) => (
                    <path key={`ghost-${idx}`} d={d} />
                  ))}
                </g>
              )}

              {/* Preview Animation */}
              {isPreviewing && previewStrokeStep !== null && (
                <>
                  <g fill="#334155">
                    {charData.strokes
                      .slice(0, Math.max(0, previewStrokeStep - 1))
                      .map((d, idx) => (
                        <path key={`prev-done-${idx}`} d={d} />
                      ))}
                  </g>
                  {previewStrokeStep > 0 &&
                    previewStrokeStep <= charData.strokes.length && (
                      <path
                        d={charData.strokes[previewStrokeStep - 1]}
                        fill="#10b981"
                      />
                    )}
                </>
              )}

              {/* Active guide stroke highlight + Start point (TRACE mode or Answer Revealed) */}
              {showActiveGuideStroke && (
                <>
                  <path
                    d={charData.strokes[state.currentStrokeIndex]}
                    fill="#fb7185"
                    opacity="0.62"
                  />
                  {startDot && (
                    <g>
                      <circle
                        cx={startDot[0]}
                        cy={startDot[1]}
                        r="34"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="6"
                        opacity="0.7"
                      />
                      <circle
                        cx={startDot[0]}
                        cy={startDot[1]}
                        r="19"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="6"
                      />
                    </g>
                  )}
                </>
              )}
            </g>
          )}
        </svg>

        {/* Fallback text outline when character lacks vector strokes */}
        {!hasValidStrokeData && showOutline && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className="text-[76px] sm:text-[96px] font-serif leading-none select-none text-slate-300/90"
              style={{ fontFamily: '"KaiTi", "STKaiti", "Noto Serif SC", serif' }}
            >
              {charData.hanzi}
            </span>
          </div>
        )}

        {/* Interactive Canvas Layer */}
        {!isPreviewing && (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`absolute inset-0 w-full h-full ${
              isInteractive ? 'cursor-crosshair' : 'cursor-default'
            }`}
            style={{
              touchAction: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />
        )}

        {/* Top-left Character Order Tag (multi-char words) */}
        {totalChars > 1 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/90 border border-slate-200 text-[10px] font-bold text-slate-500 pointer-events-none">
            Chữ {charIndex + 1}
          </div>
        )}

        {/* Preview running indicator */}
        {isPreviewing && (
          <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold pointer-events-none shadow-sm">
            <Play className="w-2.5 h-2.5 fill-current" />
            <span>
              Nét {previewStrokeStep}/{charData.strokeCount}
            </span>
          </div>
        )}

        {/* Bottom-right stroke progress badge */}
        {!isPreviewing && (
          <div
            className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-bold border pointer-events-none flex items-center gap-1 shadow-sm ${
              isBoxDone
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white/92 border-slate-200 text-slate-600'
            }`}
          >
            {isBoxDone ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Xong</span>
              </>
            ) : hasValidStrokeData ? (
              <span>
                Nét {state.currentStrokeIndex + 1}/{charData.strokeCount}
              </span>
            ) : (
              <span>Tự do</span>
            )}
          </div>
        )}

        {/* Fallback manual done button when character has no vector stroke data */}
        {!hasValidStrokeData && isInteractive && state.userStrokes.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCompleteFallbackChar(charIndex)
            }}
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all"
          >
            <Check className="w-3 h-3" />
            <span>Xong chữ này</span>
          </button>
        )}

        {/* Transient mistake hint pill */}
        {feedbackHint && (
          <div className="absolute bottom-2 left-2 right-2 mx-auto max-w-max px-2.5 py-1 rounded-lg bg-rose-600/95 text-white text-[11px] font-bold text-center shadow-sm pointer-events-none">
            {feedbackHint}
          </div>
        )}
      </div>
    </div>
  )
}

export const MultiHanziWritingBoard = forwardRef<
  MultiHanziWritingBoardHandle,
  MultiHanziWritingBoardProps
>(
  (
    {
      wordId,
      characters,
      mode,
      answerRevealed,
      disabled = false,
      soundEffects,
      volume,
      onCharProgressChange,
      onMistake,
      onPreviewStateChange,
      onWordCompleted,
    },
    ref
  ) => {
    const [boxStates, setBoxStates] = useState<CharBoxState[]>(() =>
      createInitialBoxStates(characters)
    )
    const [activeCharIdx, setActiveCharIdx] = useState(0)
    const [previewTarget, setPreviewTarget] = useState<{
      charIdx: number
      step: number
    } | null>(null)

    const reportedCompletionRef = useRef(false)
    const previewTimerRef = useRef<number | null>(null)

    const stopPreview = useCallback(() => {
      if (previewTimerRef.current !== null) {
        window.clearTimeout(previewTimerRef.current)
        previewTimerRef.current = null
      }
      setPreviewTarget(null)
      onPreviewStateChange?.(false)
    }, [onPreviewStateChange])

    useEffect(() => {
      return () => {
        if (previewTimerRef.current !== null) {
          window.clearTimeout(previewTimerRef.current)
        }
      }
    }, [])

    // Preview step ticker
    useEffect(() => {
      if (!previewTarget) return
      const targetChar = characters[previewTarget.charIdx]
      if (!targetChar || !targetChar.supported || targetChar.strokeCount === 0) {
        return
      }

      previewTimerRef.current = window.setTimeout(() => {
        if (previewTarget.step < targetChar.strokeCount) {
          setPreviewTarget({
            charIdx: previewTarget.charIdx,
            step: previewTarget.step + 1,
          })
        } else {
          stopPreview()
        }
      }, 480)

      return () => {
        if (previewTimerRef.current !== null) {
          window.clearTimeout(previewTimerRef.current)
        }
      }
    }, [previewTarget, characters, stopPreview])

    const handleAcceptStroke = useCallback(
      (charIndex: number, normalizedStroke: Point[]) => {
        stopPreview()
        setBoxStates((prev) => {
          const next = prev.map((item, idx) => {
            if (idx !== charIndex) return item
            const charDto = characters[charIndex]
            const nextStrokeIndex = item.currentStrokeIndex + 1
            const completed = nextStrokeIndex >= charDto.strokeCount
            return {
              currentStrokeIndex: nextStrokeIndex,
              userStrokes: [...item.userStrokes, normalizedStroke],
              completed,
            }
          })

          const completedCount = next.filter((b) => b.completed).length
          onCharProgressChange?.(completedCount, characters.length)

          if (next[charIndex]?.completed) {
            const nextIncomplete = next.findIndex((b) => !b.completed)
            if (nextIncomplete !== -1) {
              setActiveCharIdx(nextIncomplete)
            }
          }

          if (
            completedCount === characters.length &&
            characters.length > 0 &&
            !reportedCompletionRef.current
          ) {
            reportedCompletionRef.current = true
            window.setTimeout(() => onWordCompleted(), 150)
          }

          return next
        })
      },
      [characters, onCharProgressChange, onWordCompleted, stopPreview]
    )

    const handleFreehandStroke = useCallback(
      (charIndex: number, normalizedStroke: Point[]) => {
        setBoxStates((prev) =>
          prev.map((item, idx) =>
            idx === charIndex
              ? { ...item, userStrokes: [...item.userStrokes, normalizedStroke] }
              : item
          )
        )
      },
      []
    )

    const handleCompleteFallbackChar = useCallback(
      (charIndex: number) => {
        if (disabled || answerRevealed) return
        setBoxStates((prev) => {
          const next = prev.map((item, idx) =>
            idx === charIndex ? { ...item, completed: true } : item
          )
          const completedCount = next.filter((b) => b.completed).length
          onCharProgressChange?.(completedCount, characters.length)

          const nextIncomplete = next.findIndex((b) => !b.completed)
          if (nextIncomplete !== -1) {
            setActiveCharIdx(nextIncomplete)
          }

          if (
            completedCount === characters.length &&
            characters.length > 0 &&
            !reportedCompletionRef.current
          ) {
            reportedCompletionRef.current = true
            window.setTimeout(() => onWordCompleted(), 150)
          }
          return next
        })
      },
      [disabled, answerRevealed, characters.length, onCharProgressChange, onWordCompleted]
    )

    const handleMistake = useCallback(() => {
      onMistake?.()
    }, [onMistake])

    useImperativeHandle(
      ref,
      () => ({
        previewActiveChar: () => {
          if (previewTarget !== null) {
            stopPreview()
            return
          }
          const preferredIdx =
            characters[activeCharIdx]?.supported
              ? activeCharIdx
              : characters.findIndex((c) => c.supported && c.strokeCount > 0)
          if (preferredIdx < 0) return
          onPreviewStateChange?.(true)
          setPreviewTarget({ charIdx: preferredIdx, step: 1 })
        },
        clearStrokes: () => {
          if (disabled || answerRevealed) return
          stopPreview()
          setBoxStates((prev) => {
            const current = prev[activeCharIdx]
            const shouldResetAll =
              !current ||
              current.completed ||
              current.userStrokes.length === 0

            const next = prev.map((item, idx) => {
              if (shouldResetAll || idx === activeCharIdx) {
                return {
                  currentStrokeIndex: 0,
                  userStrokes: [],
                  completed: false,
                }
              }
              return item
            })
            const completedCount = next.filter((b) => b.completed).length
            onCharProgressChange?.(completedCount, characters.length)
            if (shouldResetAll) {
              setActiveCharIdx(0)
            }
            return next
          })
        },
      }),
      [
        activeCharIdx,
        answerRevealed,
        characters,
        disabled,
        onCharProgressChange,
        onPreviewStateChange,
        previewTarget,
        stopPreview,
      ]
    )

    const gridColsClass =
      characters.length <= 1
        ? 'grid-cols-1 max-w-[260px] sm:max-w-[290px]'
        : characters.length === 2
          ? 'grid-cols-2 max-w-[540px]'
          : characters.length === 3
            ? 'grid-cols-2 sm:grid-cols-3 max-w-[740px]'
            : 'grid-cols-2 md:grid-cols-4 max-w-[840px]'

    return (
      <div className={`grid gap-3 sm:gap-4 mx-auto w-full ${gridColsClass}`}>
        {characters.map((charData, idx) => {
          const state = boxStates[idx] ?? {
            currentStrokeIndex: 0,
            userStrokes: [],
            completed: false,
          }
          return (
            <HanziCharBox
              key={`${wordId}-${idx}-${charData.hanzi}`}
              charData={charData}
              charIndex={idx}
              totalChars={characters.length}
              state={state}
              isActive={activeCharIdx === idx}
              mode={mode}
              answerRevealed={answerRevealed}
              locked={disabled || answerRevealed}
              previewStrokeStep={
                previewTarget && previewTarget.charIdx === idx
                  ? previewTarget.step
                  : null
              }
              soundEffects={soundEffects}
              volume={volume}
              onActivate={setActiveCharIdx}
              onAcceptStroke={handleAcceptStroke}
              onFreehandStroke={handleFreehandStroke}
              onCompleteFallbackChar={handleCompleteFallbackChar}
              onMistake={handleMistake}
            />
          )
        })}
      </div>
    )
  }
)

MultiHanziWritingBoard.displayName = 'MultiHanziWritingBoard'
