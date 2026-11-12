import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getHsk30Exams,
  seedSampleHsk30Exam,
  type Hsk30ExamListItem,
} from '../../api/hsk30'

export const Hsk30ExamManagementPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [exams, setExams] = useState<Hsk30ExamListItem[]>([])
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSeeding, setIsSeeding] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isTeacherOrAdmin =
    user?.roles?.includes('TEACHER') || user?.roles?.includes('ADMIN')

  const fetchExams = async (level = selectedLevel) => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getHsk30Exams(user.token, level)
      setExams(data)
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh sách đề thi HSK 3.0')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchExams(selectedLevel)
  }, [selectedLevel, user])

  const handleSeedSampleExam = async () => {
    if (!user || isSeeding) return
    setIsSeeding(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const created = await seedSampleHsk30Exam(user.token)
      setSuccessMessage(`Đã tạo thành công: "${created.title}" với 40 câu hỏi chuẩn hóa!`)
      await fetchExams(1)
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi tạo đề thi mẫu.')
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-5 text-slate-800 pb-8">
      {/* Compact Top Action Bar (Bulky hero/title block removed) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium rounded-xl shadow-xs transition text-xs sm:text-sm whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Quay lại Bảng điều khiển</span>
        </button>

        {/* Teacher Quick Seed Button */}
        {isTeacherOrAdmin && (
          <button
            type="button"
            onClick={handleSeedSampleExam}
            disabled={isSeeding}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm disabled:opacity-60 whitespace-nowrap"
          >
            {isSeeding ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 shrink-0" />
            )}
            <span>Tạo đề thi mẫu HSK 1 (40 câu)</span>
          </button>
        )}
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5 sm:mt-0" />
            <span className="font-medium break-words">{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-semibold hover:underline shrink-0 whitespace-nowrap"
          >
            Đóng
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-start sm:items-center gap-2 min-w-0">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5 sm:mt-0" />
            <span className="font-medium break-words">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-semibold hover:underline shrink-0 whitespace-nowrap"
          >
            Đóng
          </button>
        </div>
      )}

      {/* HSK 3.0 Level Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[1, 2, 3].map((lvl) => {
          const active = selectedLevel === lvl
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition inline-flex items-center gap-2 whitespace-nowrap ${
                active
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>HSK {lvl}</span>
              {lvl === 1 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  Sẵn sàng
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* HSK 3.0 Format Explanatory Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
              <Headphones className="w-4 h-4" />
            </span>
            <span>Phần Nghe (听力 - 20 câu / 100 điểm)</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Part 1 (Câu 1–5): Nghe audio, chọn 1 trong 3 hình ảnh A/B/C.</li>
            <li>Part 2 (Câu 6–10): Nghe audio, chọn đáp án đúng A/B/C.</li>
            <li>Part 3 (Câu 11–15): Nghe 5 đoạn, ghép với 6 hình ảnh A–F (1 hình dư).</li>
            <li>Part 4 (Câu 16–20): Nghe hội thoại ngắn, chọn đáp án đúng A/B/C.</li>
          </ul>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-100 md:pt-0 md:border-t-0 md:border-l md:pl-6">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <BookOpen className="w-4 h-4" />
            </span>
            <span>Phần Đọc (阅读 - 20 câu / 100 điểm)</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Part 1 (Câu 21–25): Đọc 5 câu, ghép với 6 hình ảnh A–F (1 hình dư).</li>
            <li>Part 2 (Câu 26–30): Đọc 5 câu hỏi, ghép với 6 đáp án A–F (1 đáp án dư).</li>
            <li>Part 3 (Câu 31–35): 5 câu điền từ, chọn từ kho 6 từ A–F (1 từ dư).</li>
            <li>Part 4 (Câu 36–40): Đọc đoạn văn ngắn, trả lời 5 câu hỏi MCQ A/B/C.</li>
          </ul>
        </div>
      </div>

      {/* Exam Cards Grid */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Đang tải danh sách đề thi HSK {selectedLevel}...
          </p>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 sm:p-10 text-center space-y-3.5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <FileCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Chưa có đề thi HSK {selectedLevel}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Chưa có đề thi nào được tạo cho cấp độ này. Nhấn nút bên dưới để tạo ngay 1 đề thi mẫu đầy đủ 40 câu hỏi chuẩn hóa HSK 3.0.
          </p>
          {isTeacherOrAdmin && (
            <button
              type="button"
              onClick={handleSeedSampleExam}
              disabled={isSeeding}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition shadow-sm disabled:opacity-60 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Tạo đề thi mẫu HSK 1 ngay</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-4 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                    HSK {exam.hskLevel} • Chuẩn 3.0
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition break-words">
                  {exam.title}
                </h3>

                {exam.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                )}
              </div>

              {/* Exam Details Badges */}
              <div className="pt-3.5 border-t border-slate-100 space-y-3.5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="block text-[11px] text-slate-500">Thời gian</span>
                    <strong className="text-xs sm:text-sm text-slate-900 font-mono">
                      {exam.timeLimitMinutes} phút
                    </strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="block text-[11px] text-slate-500">Số câu</span>
                    <strong className="text-xs sm:text-sm text-slate-900 font-mono">
                      {exam.totalQuestions} câu
                    </strong>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="block text-[11px] text-slate-500">Điểm đạt</span>
                    <strong className="text-xs sm:text-sm text-emerald-600 font-mono">
                      ≥ {exam.passingScore}
                    </strong>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/hsk30/exams/${exam.id}/take`)}
                    className="flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-white shrink-0" />
                    <span>Vào phòng thi thử</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
