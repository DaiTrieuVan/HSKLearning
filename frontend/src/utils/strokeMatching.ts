/**
 * Tiện ích và thuật toán so khớp nét vẽ chữ Hán (HTT-10-CN-002).
 * Đối chiếu tọa độ vẽ trên canvas với tọa độ trung tuyến (medians) từ MakeMeAHanzi.
 */

export interface Point {
  x: number
  y: number
}

export type StrokeErrorReason =
  | 'TOO_SHORT'
  | 'WRONG_START'
  | 'WRONG_END'
  | 'WRONG_DIRECTION'
  | 'OFF_PATH'

export interface StrokeMatchResult {
  isMatch: boolean
  strokeIndex: number
  errorReason?: StrokeErrorReason
  feedbackMessage: string
  score: number // Điểm độ chuẩn 0 - 100
}

/** Bán kính dung sai cho điểm bắt đầu nét vẽ (tọa độ font 1024x1024) */
export const START_POINT_TOLERANCE_FONT_PX = 250

/** Bán kính dung sai cho điểm kết thúc nét vẽ (tọa độ font 1024x1024) */
export const END_POINT_TOLERANCE_FONT_PX = 290

/** Số lượng điểm vẽ tối thiểu để tạo thành một nét hợp lệ */
export const MIN_STROKE_POINTS = 3

/** Chiều dài tối thiểu của nét vẽ (tính bằng pixel canvas) */
export const MIN_STROKE_LENGTH_CANVAS_PX = 15

/** Hệ số tương đồng hướng tối thiểu (cosine similarity giữa vector median và vector vẽ) */
export const MIN_DIRECTION_COSINE_SIMILARITY = 0.28

/** Khoảng cách trung bình tối đa cho phép từ các điểm vẽ tới trung tuyến */
export const MAX_AVERAGE_DISTANCE_TO_MEDIAN = 230

/**
 * Tính khoảng cách Euclid giữa hai điểm
 */
export function distance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Tính tổng chiều dài đường vẽ
 */
export function calculatePathLength(points: Point[]): number {
  let total = 0
  for (let i = 1; i < points.length; i++) {
    total += distance(points[i - 1], points[i])
  }
  return total
}

/**
 * Chuyển đổi tọa độ từ Canvas (0,0 góc trên trái) sang tọa độ Font MakeMeAHanzi (1024x1024, y hướng lên)
 */
export function canvasToFontCoordinates(point: Point, canvasWidth: number, canvasHeight: number): Point {
  const x = (point.x / canvasWidth) * 1024
  const y = 900 - (point.y / canvasHeight) * 1024
  return { x, y }
}

/**
 * Chuyển đổi tọa độ từ Font MakeMeAHanzi sang Canvas
 */
export function fontToCanvasCoordinates(point: [number, number] | Point, canvasWidth: number, canvasHeight: number): Point {
  const px = Array.isArray(point) ? point[0] : point.x
  const py = Array.isArray(point) ? point[1] : point.y
  const x = (px / 1024) * canvasWidth
  const y = ((900 - py) / 1024) * canvasHeight
  return { x, y }
}

/**
 * Tính khoảng cách từ 1 điểm tới 1 đoạn thẳng (segment)
 */
function distancePointToSegment(p: Point, a: Point, b: Point): number {
  const l2 = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y)
  if (l2 === 0) return distance(p, a)

  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2
  t = Math.max(0, Math.min(1, t))

  const projection: Point = {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
  }
  return distance(p, projection)
}

/**
 * Tính khoảng cách từ 1 điểm tới đường gấp khúc trung tuyến (polyline)
 */
function distancePointToPolyline(p: Point, polyline: Point[]): number {
  let minDistance = Infinity
  for (let i = 1; i < polyline.length; i++) {
    const d = distancePointToSegment(p, polyline[i - 1], polyline[i])
    if (d < minDistance) {
      minDistance = d
    }
  }
  return minDistance
}

/**
 * So khớp nét vẽ của người dùng với nét chuẩn (HTT-10-CN-002-TC-02)
 *
 * @param drawnPoints Danh sách tọa độ các điểm người dùng đã vẽ trên canvas
 * @param expectedMedian Mảng các điểm trung tuyến chuẩn [x, y] của nét đang viết
 * @param strokeIndex Thứ tự của nét (0-indexed)
 * @param canvasWidth Chiều rộng canvas
 * @param canvasHeight Chiều cao canvas
 * @returns Kết quả so khớp kèm lý do lỗi nếu không đạt
 */
export function matchStroke(
  drawnPoints: Point[],
  expectedMedian: Array<[number, number]>,
  strokeIndex: number,
  canvasWidth: number,
  canvasHeight: number
): StrokeMatchResult {
  // 1. Kiểm tra số lượng điểm và độ dài tối thiểu
  if (drawnPoints.length < MIN_STROKE_POINTS || calculatePathLength(drawnPoints) < MIN_STROKE_LENGTH_CANVAS_PX) {
    return {
      isMatch: false,
      strokeIndex,
      errorReason: 'TOO_SHORT',
      feedbackMessage: 'Nét vẽ quá ngắn. Vui lòng kéo nét hoàn chỉnh.',
      score: 0,
    }
  }

  if (!expectedMedian || expectedMedian.length < 2) {
    return {
      isMatch: true,
      strokeIndex,
      feedbackMessage: 'Nét vẽ được chấp nhận.',
      score: 80,
    }
  }

  // Chuyển đổi median sang dạng Point[]
  const medianPoints: Point[] = expectedMedian.map(([x, y]) => ({ x, y }))
  const medianStart = medianPoints[0]
  const medianEnd = medianPoints[medianPoints.length - 1]

  // Chuyển đổi các điểm vẽ sang hệ tọa độ font
  const fontDrawnPoints = drawnPoints.map(p => canvasToFontCoordinates(p, canvasWidth, canvasHeight))
  const drawnStart = fontDrawnPoints[0]
  const drawnEnd = fontDrawnPoints[fontDrawnPoints.length - 1]

  // 2. Kiểm tra vị trí bắt đầu nét vẽ
  const startDist = distance(drawnStart, medianStart)
  if (startDist > START_POINT_TOLERANCE_FONT_PX) {
    return {
      isMatch: false,
      strokeIndex,
      errorReason: 'WRONG_START',
      feedbackMessage: 'Điểm bắt đầu chưa đúng vị trí nét vẽ. Vui lòng bắt đầu tại vị trí gợi ý.',
      score: Math.max(10, Math.round(100 - startDist / 3)),
    }
  }

  // 3. Kiểm tra vị trí kết thúc nét vẽ
  const endDist = distance(drawnEnd, medianEnd)
  if (endDist > END_POINT_TOLERANCE_FONT_PX) {
    return {
      isMatch: false,
      strokeIndex,
      errorReason: 'WRONG_END',
      feedbackMessage: 'Điểm kết thúc chưa đúng hoặc nét vẽ chưa đủ dài.',
      score: Math.max(10, Math.round(100 - endDist / 3)),
    }
  }

  // 4. Kiểm tra hướng nét vẽ (Cosine similarity)
  const medianVector: Point = { x: medianEnd.x - medianStart.x, y: medianEnd.y - medianStart.y }
  const drawnVector: Point = { x: drawnEnd.x - drawnStart.x, y: drawnEnd.y - drawnStart.y }
  const medianMag = Math.sqrt(medianVector.x * medianVector.x + medianVector.y * medianVector.y)
  const drawnMag = Math.sqrt(drawnVector.x * drawnVector.x + drawnVector.y * drawnVector.y)

  if (medianMag > 40 && drawnMag > 20) {
    const dotProduct = medianVector.x * drawnVector.x + medianVector.y * drawnVector.y
    const cosineSim = dotProduct / (medianMag * drawnMag)
    if (cosineSim < MIN_DIRECTION_COSINE_SIMILARITY) {
      return {
        isMatch: false,
        strokeIndex,
        errorReason: 'WRONG_DIRECTION',
        feedbackMessage: 'Hướng vẽ nét bị ngược hoặc sai quy chuẩn thứ tự nét.',
        score: Math.max(10, Math.round((cosineSim + 1) * 30)),
      }
    }
  }

  // 5. Kiểm tra khoảng cách trung bình đến trung tuyến
  // Lấy mẫu đều các điểm trên nét vẽ
  const sampleCount = Math.min(fontDrawnPoints.length, 12)
  const step = Math.max(1, Math.floor(fontDrawnPoints.length / sampleCount))
  let totalDistance = 0
  let sampled = 0

  for (let i = 0; i < fontDrawnPoints.length; i += step) {
    totalDistance += distancePointToPolyline(fontDrawnPoints[i], medianPoints)
    sampled++
  }

  const averageDistance = sampled > 0 ? totalDistance / sampled : 0
  if (averageDistance > MAX_AVERAGE_DISTANCE_TO_MEDIAN) {
    return {
      isMatch: false,
      strokeIndex,
      errorReason: 'OFF_PATH',
      feedbackMessage: 'Nét vẽ bị lệch quá nhiều so với khung chữ.',
      score: Math.max(20, Math.round(100 - averageDistance / 3)),
    }
  }

  // Tính điểm chất lượng nét
  const calculatedScore = Math.min(100, Math.max(60, Math.round(100 - (averageDistance / 4 + (startDist + endDist) / 10))))

  return {
    isMatch: true,
    strokeIndex,
    feedbackMessage: 'Nét vẽ chính xác!',
    score: calculatedScore,
  }
}
