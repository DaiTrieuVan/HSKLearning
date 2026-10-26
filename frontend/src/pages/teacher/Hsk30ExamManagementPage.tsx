import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Award,
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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Award className="w-3.5 h-3.5" />
              Chuẩn Quốc Gia Mới HSK 3.0
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Quản lý & Thi thử Chuẩn HSK 3.0
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Hệ thống phòng thi máy tính hóa theo đúng quy cách đề thi HSK 3.0: 40 câu hỏi trắc nghiệm (Nghe & Đọc), tự động chấm điểm và cấp bảng điểm.
            </p>
          </div>

          {/* Teacher Quick Seed Button */}
          {isTeacherOrAdmin && (
            <button
              onClick={handleSeedSampleExam}
              disabled={isSeeding}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30 shrink-0"
            >
              {isSeeding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Tạo đề thi mẫu HSK 1 (40 câu)</span>
            </button>
          )}
        </div>

        {/* Success / Error Alerts */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-xs hover:underline">
              Đóng
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-xs hover:underline">
              Đóng
            </button>
          </div>
        )}

        {/* HSK 3.0 Level Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                selectedLevel === lvl
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>HSK {lvl}</span>
              {lvl === 1 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                  Sẵn sàng
                </span>
              )}
            </button>
          ))}
        </div>

        {/* HSK 3.0 Format Explanatory Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>Phần Nghe (听力 - 20 câu / 100 điểm)</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Part 1 (Câu 1–5): Nghe audio, chọn 1 trong 3 hình ảnh A/B/C.</li>
              <li>Part 2 (Câu 6–10): Nghe audio, chọn đáp án đúng A/B/C.</li>
              <li>Part 3 (Câu 11–15): Nghe 5 đoạn, ghép với 6 hình ảnh A–F (1 hình dư).</li>
              <li>Part 4 (Câu 16–20): Nghe hội thoại ngắn, chọn đáp án đúng A/B/C.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Phần Đọc (阅读 - 20 câu / 100 điểm)</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Part 1 (Câu 21–25): Đọc 5 câu, ghép với 6 hình ảnh A–F (1 hình dư).</li>
              <li>Part 2 (Câu 26–30): Đọc 5 câu hỏi, ghép với 6 đáp án A–F (1 đáp án dư).</li>
              <li>Part 3 (Câu 31–35): 5 câu điền từ, chọn từ kho 6 từ A–F (1 từ dư).</li>
              <li>Part 4 (Câu 36–40): Đọc đoạn văn ngắn, trả lời 5 câu hỏi MCQ A/B/C.</li>
            </ul>
          </div>
        </div>

        {/* Exam Cards Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Đang tải danh sách đề thi HSK {selectedLevel}...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <FileCheck className="w-16 h-16 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Chưa có đề thi HSK {selectedLevel}</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Chưa có đề thi nào được tạo cho cấp độ này. Nhấn nút bên dưới để tạo ngay 1 đề thi mẫu đầy đủ 40 câu hỏi chuẩn hóa HSK 3.0.
            </p>
            {isTeacherOrAdmin && (
              <button
                onClick={handleSeedSampleExam}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tạo đề thi mẫu HSK 1 ngay</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      HSK {exam.hskLevel} • Chuẩn 3.0
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(exam.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                {/* Exam Details Badges */}
                <div className="pt-4 border-t border-slate-800/80 space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="block text-[11px] text-slate-400">Thời gian</span>
                      <strong className="text-sm text-white font-mono">
                        {exam.timeLimitMinutes} phút
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="block text-[11px] text-slate-400">Số câu</span>
                      <strong className="text-sm text-white font-mono">
                        {exam.totalQuestions} câu
                      </strong>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                      <span className="block text-[11px] text-slate-400">Điểm đạt</span>
                      <strong className="text-sm text-emerald-400 font-mono">
                        ≥ {exam.passingScore}
                      </strong>
                    </div>
                  </div>

                  {/* Action CTA */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/hsk30/exams/${exam.id}/take`)}
                      className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Vào phòng thi thử</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
