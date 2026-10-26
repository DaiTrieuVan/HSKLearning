import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Headphones,
  HelpCircle,
  Award,
  ArrowRight,
  Filter,
  Volume2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getListeningPractices, type ListeningPracticeItem } from '../../api/listening'

export const ListeningPracticeListPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [practices, setPractices] = useState<ListeningPracticeItem[]>([])
  const [selectedHsk, setSelectedHsk] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadPractices = async (hskLevel?: number | null) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getListeningPractices(user.token, hskLevel || undefined)
      setPractices(data)
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách bài nghe. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPractices(selectedHsk)
  }, [selectedHsk, user])

  const hskTabs = [
    { label: 'Tất cả', value: null },
    { label: 'HSK 1', value: 1 },
    { label: 'HSK 2', value: 2 },
    { label: 'HSK 3', value: 3 },
    { label: 'HSK 4', value: 4 },
    { label: 'HSK 5', value: 5 },
    { label: 'HSK 6', value: 6 },
  ]

  const getHskColor = (level?: number) => {
    switch (level) {
      case 1:
        return 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400'
      case 2:
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
      case 3:
        return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
      case 4:
        return 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400'
      case 5:
        return 'border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400'
      case 6:
        return 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
      default:
        return 'border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl dark:border-indigo-900/50">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center space-x-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3.5 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>Kỹ năng cốt lõi HSK</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Luyện nghe hiểu tiếng Trung
          </h1>
          <p className="mt-3 text-base text-indigo-100/80 sm:text-lg">
            Rèn luyện kỹ năng nghe ngữ điệu và phát xạ ngôn ngữ qua các đoạn hội thoại thực tế kèm câu hỏi trắc nghiệm kiểm tra mức độ hiểu bài.
          </p>

          {/* Quick Info Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-indigo-200">
            <div className="flex items-center space-x-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <Headphones className="h-4 w-4 text-indigo-300" />
              <span>Chỉ hiển thị bài có Audio chuẩn (TC-03)</span>
            </div>
            <div className="flex items-center space-x-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <Award className="h-4 w-4 text-amber-300" />
              <span>Tích lũy XP sau mỗi bài nộp</span>
            </div>
          </div>
        </div>

        {/* Trang trí background */}
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-10 right-20 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl" />
      </div>

      {/* Bộ lọc cấp độ HSK */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Cấp độ HSK:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {hskTabs.map((tab) => {
            const active = selectedHsk === tab.value
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setSelectedHsk(tab.value)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="mb-6 flex items-start space-x-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">{error}</p>
            <button
              type="button"
              onClick={() => loadPractices(selectedHsk)}
              className="mt-2 inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 underline hover:text-rose-700 dark:text-rose-400"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="mb-2 h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="mb-4 h-4 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : practices.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Volume2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
            Chưa có bài luyện nghe nào
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {selectedHsk
              ? `Hiện tại chưa có bài nghe có âm thanh cho cấp độ HSK ${selectedHsk}.`
              : 'Hiện tại chưa có bài luyện nghe nào sẵn sàng trong hệ thống.'}
          </p>
          {selectedHsk && (
            <button
              type="button"
              onClick={() => setSelectedHsk(null)}
              className="mt-4 inline-flex items-center space-x-1.5 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
            >
              <span>Xem tất cả cấp độ</span>
            </button>
          )}
        </div>
      ) : (
        /* Danh sách thẻ bài nghe */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {practices.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <div>
                {/* Header thẻ: HSK badge & Số câu hỏi */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${getHskColor(
                      item.hskLevel
                    )}`}
                  >
                    HSK {item.hskLevel || 1}
                  </span>

                  <span className="inline-flex items-center space-x-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>{item.questionCount} câu hỏi</span>
                  </span>
                </div>

                {/* Tiêu đề & Mô tả */}
                <h3 className="text-base font-bold text-slate-900 transition group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                  {item.description || 'Bài luyện nghe hiểu tiếng Trung theo ngữ cảnh đàm thoại.'}
                </p>
              </div>

              {/* Footer thẻ: Điểm số & Nút làm bài */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex items-center space-x-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>{item.totalPoints} điểm</span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/listening/${item.id}`)}
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
                >
                  <span>Bắt đầu nghe</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default ListeningPracticeListPage
