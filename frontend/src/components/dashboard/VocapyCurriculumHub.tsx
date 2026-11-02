import React, { useState } from 'react'
import {
  Layers,
  BookOpen,
  PenTool,
  Mic,
  Headphones,
  Bot,
  FileCheck2,
  GraduationCap,
} from 'lucide-react'

interface CurriculumCard {
  id: string
  title: string
  category: 'HSK30' | 'SKILLS' | 'EXAMS' | 'CLASSES'
  categoryLabel: string
  badgeText: string
  difficulty: number // 1 to 5
  description: string
  path: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  iconBg: string
  iconColor: string
  isAvailable?: boolean
}

interface VocapyCurriculumHubProps {
  onNavigate: (path: string) => void
}

export const VocapyCurriculumHub: React.FC<VocapyCurriculumHubProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'HSK30' | 'SKILLS' | 'EXAMS'>('ALL')

  const curriculumItems: CurriculumCard[] = [
    // HSK 3.0
    {
      id: 'hsk1',
      title: 'HSK 1 - Nhập môn (3.0)',
      category: 'HSK30',
      categoryLabel: 'HSK 3.0 Mới Nhất',
      badgeText: '500 từ • 20 bài học',
      difficulty: 1,
      description: 'Lộ trình nhập môn cho người bắt đầu làm quen bính âm và từ vựng cơ bản.',
      path: '/roadmap',
      icon: BookOpen,
      iconBg: '#ecfdf5',
      iconColor: '#059669',
      isAvailable: true,
    },
    {
      id: 'hsk2',
      title: 'HSK 2 - Sơ cấp cơ bản (3.0)',
      category: 'HSK30',
      categoryLabel: 'HSK 3.0 Mới Nhất',
      badgeText: '772 từ • 20 bài học',
      difficulty: 2,
      description: 'Giao tiếp tình huống đời sống thực tế: mua sắm, thuê nhà, bệnh viện, du lịch.',
      path: '/roadmap',
      icon: BookOpen,
      iconBg: '#ecfdf5',
      iconColor: '#059669',
      isAvailable: true,
    },
    {
      id: 'hsk3',
      title: 'HSK 3 - Sơ trung cấp (3.0)',
      category: 'HSK30',
      categoryLabel: 'HSK 3.0 Mới Nhất',
      badgeText: '973 từ mới • 105 ngữ pháp',
      difficulty: 3,
      description: 'Giao tiếp chủ động trong công việc, học tập, diễn đạt suy nghĩ cá nhân.',
      path: '/roadmap',
      icon: BookOpen,
      iconBg: '#f0fdf4',
      iconColor: '#16a34a',
      isAvailable: true,
    },
    {
      id: 'hsk4',
      title: 'HSK 4 - Trung cấp (3.0)',
      category: 'HSK30',
      categoryLabel: 'HSK 3.0 Mới Nhất',
      badgeText: '1000 từ mới • Chuyên sâu',
      difficulty: 4,
      description: 'Thảo luận lưu loát nhiều đề tài xã hội, văn hóa và văn bản phong phú.',
      path: '/roadmap',
      icon: BookOpen,
      iconBg: '#fefce8',
      iconColor: '#ca8a04',
      isAvailable: false,
    },

    // KỸ NĂNG AI & THỰC HÀNH
    {
      id: 'writing_skill',
      title: 'Luyện viết chữ Hán AI',
      category: 'SKILLS',
      categoryLabel: 'Kỹ năng AI & Thực hành',
      badgeText: 'Nhận diện nét vẽ thông minh',
      difficulty: 2,
      description: 'Vẽ chữ theo thứ tự nét chuẩn quy tắc, nhận diện nét viết và chấm điểm AI tức thì.',
      path: '/writing',
      icon: PenTool,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      isAvailable: true,
    },
    {
      id: 'pronunciation_skill',
      title: 'Luyện phát âm & Nhận diện giọng nói',
      category: 'SKILLS',
      categoryLabel: 'Kỹ năng AI & Thực hành',
      badgeText: 'AI Speech Recognition',
      difficulty: 2,
      description: 'Luyện đọc bính âm, từ vựng và câu đàm thoại có phản hồi thanh điệu chính xác.',
      path: '/pronunciation',
      icon: Mic,
      iconBg: '#faf5ff',
      iconColor: '#9333ea',
      isAvailable: true,
    },
    {
      id: 'listening_skill',
      title: 'Luyện nghe hiểu HSK',
      category: 'SKILLS',
      categoryLabel: 'Kỹ năng AI & Thực hành',
      badgeText: 'Audio giọng chuẩn bản xứ',
      difficulty: 3,
      description: 'Nghe hội thoại và đoạn văn bản ngắn, trả lời câu hỏi kèm bản dịch chi tiết.',
      path: '/listening',
      icon: Headphones,
      iconBg: '#fff7ed',
      iconColor: '#ea580c',
      isAvailable: true,
    },
    {
      id: 'ai_assistant',
      title: 'Trợ lý Gia sư AI',
      category: 'SKILLS',
      categoryLabel: 'Kỹ năng AI & Thực hành',
      badgeText: 'Hỏi đáp 24/7 tức thì',
      difficulty: 1,
      description: 'Hỏi đáp mọi thắc mắc ngữ pháp, phân tích câu văn và tạo câu ví dụ tự nhiên.',
      path: '/ai-assistant',
      icon: Bot,
      iconBg: '#fdf2f8',
      iconColor: '#db2777',
      isAvailable: true,
    },

    // THI THỬ & ĐÁNH GIÁ
    {
      id: 'hsk30_exam',
      title: 'Thi thử HSK 3.0 Chuẩn Hóa',
      category: 'EXAMS',
      categoryLabel: 'Thi thử & Đánh giá',
      badgeText: 'Bấm giờ & Phân tích điểm',
      difficulty: 3,
      description: 'Đề thi mô phỏng định dạng HSK 3.0 mới, tự động chấm điểm nghe và đọc hiểu.',
      path: '/hsk30/exams',
      icon: FileCheck2,
      iconBg: '#ecfeff',
      iconColor: '#0891b2',
      isAvailable: true,
    },
    {
      id: 'traditional_mock_exam',
      title: 'Thi thử Trắc nghiệm HSK 1 - 6',
      category: 'EXAMS',
      categoryLabel: 'Thi thử & Đánh giá',
      badgeText: 'Kho đề thi phong phú',
      difficulty: 2,
      description: 'Hệ thống bài thi trắc nghiệm theo từng cấp độ, lưu lịch sử và xem lại kết quả.',
      path: '/mock-exams',
      icon: GraduationCap,
      iconBg: '#f1f5f9',
      iconColor: '#475569',
      isAvailable: true,
    },
  ]

  const filteredItems = activeTab === 'ALL'
    ? curriculumItems
    : curriculumItems.filter((item) => item.category === activeTab)

  // Group by category when displaying 'ALL'
  const categoriesList = activeTab === 'ALL'
    ? [
        { key: 'HSK30', label: 'HSK 3.0 Mới Nhất' },
        { key: 'SKILLS', label: 'Kỹ năng AI & Thực hành' },
        { key: 'EXAMS', label: 'Thi thử & Đánh giá Năng lực' },
      ]
    : [
        {
          key: activeTab,
          label:
            activeTab === 'HSK30'
              ? 'HSK 3.0 Mới Nhất'
              : activeTab === 'SKILLS'
              ? 'Kỹ năng AI & Thực hành'
              : 'Thi thử & Đánh giá Năng lực',
        },
      ]

  const getDifficultyColor = (diff: number) => {
    if (diff <= 1) return '#10b981'
    if (diff <= 2) return '#059669'
    if (diff <= 3) return '#eab308'
    if (diff <= 4) return '#f97316'
    return '#ef4444'
  }

  return (
    <div>
      {/* Title & Pill Filters */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Layers size={20} color="var(--primary)" />
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              margin: 0,
            }}
          >
            Lộ trình học
          </h3>
        </div>

        {/* Filter Pills (Vocapy style) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '6px',
          }}
        >
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'HSK30', label: 'HSK 3.0 (2026)' },
            { id: 'SKILLS', label: 'Kỹ năng AI & Thực hành' },
            { id: 'EXAMS', label: 'Thi thử & Đánh giá' },
          ].map((pill) => {
            const isSelected = activeTab === pill.id
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => setActiveTab(pill.id as any)}
                style={{
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-card)',
                  backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(16, 185, 129, 0.25)' : 'none',
                }}
              >
                {pill.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grouped Curriculum Lists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {categoriesList.map((cat) => {
          const itemsInCat = filteredItems.filter((i) => i.category === cat.key)
          if (itemsInCat.length === 0) return null

          return (
            <div key={cat.key}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px',
                }}
              >
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    color: 'var(--text-main)',
                    margin: 0,
                  }}
                >
                  {cat.label}
                </h4>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}
                >
                  {itemsInCat.length} lộ trình
                </span>
              </div>

              {/* Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                {itemsInCat.map((item) => {
                  const IconComp = item.icon
                  const diffColor = getDifficultyColor(item.difficulty)

                  return (
                    <div
                      key={item.id}
                      onClick={() => onNavigate(item.path)}
                      className="game-card"
                      style={{
                        padding: '18px 20px',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid var(--border-card)',
                        borderRadius: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-card)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div>
                        {/* Header: Icon + Badge */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                          }}
                        >
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: item.iconBg,
                              color: item.iconColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconComp size={18} />
                          </div>

                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                            }}
                          >
                            {item.badgeText}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <h5
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: 800,
                            color: 'var(--text-main)',
                            margin: '0 0 6px',
                          }}
                        >
                          {item.title}
                        </h5>
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.45,
                            margin: '0 0 16px',
                          }}
                        >
                          {item.description}
                        </p>
                      </div>

                      {/* Footer: Difficulty Meter (Vocapy style) */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                            Độ khó
                          </span>
                          <span style={{ fontSize: '0.76rem', fontWeight: 800, color: diffColor }}>
                            {item.difficulty}/5
                          </span>
                        </div>

                        {/* Visual 5-segment bar */}
                        <div style={{ display: 'flex', gap: '4px', height: '5px' }}>
                          {[1, 2, 3, 4, 5].map((seg) => (
                            <div
                              key={seg}
                              style={{
                                flex: 1,
                                height: '100%',
                                borderRadius: '4px',
                                backgroundColor:
                                  seg <= item.difficulty ? diffColor : '#e2e8f0',
                                transition: 'all 0.2s ease',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
