import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  FolderPlus,
  Plus,
  Compass,
  ArrowDownToLine,
  Folder,
  Layers,
  Globe,
  GraduationCap,
  ChevronRight,
  ArrowLeft,
  Loader2,
  BookOpen,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import {
  getVocabFolders,
  createVocabFolder,
  updateVocabFolder,
  deleteVocabFolder,
  getMyVocabSets,
  getCommunityVocabSets,
  createVocabSet,
  updateVocabSet,
  deleteVocabSet,
  toggleShareVocabSet,
  importSharedVocabSet,
  type VocabFolder,
  type VocabSetSummary,
  type CreateVocabFolderPayload,
  type CreateVocabSetPayload,
} from '../../api/vocabManagement'
import { VocabFolderCard } from '../../components/vocab/VocabFolderCard'
import { VocabSetCard } from '../../components/vocab/VocabSetCard'
import { VocabFolderDrawer } from '../../components/vocab/VocabFolderDrawer'
import { VocabSetDrawer } from '../../components/vocab/VocabSetDrawer'
import { ShareVocabSetDrawer } from '../../components/vocab/ShareVocabSetDrawer'

type TabType = 'my_sets' | 'community' | 'classroom'

export const StudentVocabSetsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { token } = useAuth()

  const [activeTab, setActiveTab] = useState<TabType>('my_sets')
  const [folders, setFolders] = useState<VocabFolder[]>([])
  const [mySets, setMySets] = useState<VocabSetSummary[]>([])
  const [communitySets, setCommunitySets] = useState<VocabSetSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Current folder filter
  const [currentFolder, setCurrentFolder] = useState<VocabFolder | null>(null)

  // Drawers state
  const [isFolderDrawerOpen, setIsFolderDrawerOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<VocabFolder | null>(null)

  const [isSetDrawerOpen, setIsSetDrawerOpen] = useState(false)
  const [editingSet, setEditingSet] = useState<VocabSetSummary | null>(null)

  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false)
  const [sharingSet, setSharingSet] = useState<VocabSetSummary | null>(null)
  const [shareDrawerMode, setShareDrawerMode] = useState<'share' | 'import'>('share')

  const loadData = async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const [fetchedFolders, fetchedSets] = await Promise.all([
        getVocabFolders(token),
        getMyVocabSets(token),
      ])
      setFolders(fetchedFolders)
      setMySets(fetchedSets)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi tải danh sách bộ từ')
    } finally {
      setLoading(false)
    }
  }

  const loadCommunitySets = async () => {
    if (!token) return
    try {
      setLoading(true)
      const sets = await getCommunityVocabSets(token)
      setCommunitySets(sets)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi khi tải bộ từ cộng đồng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  useEffect(() => {
    if (activeTab === 'community') {
      loadCommunitySets()
    }
  }, [activeTab])

  // Handle URL importCode if navigated with ?importCode=...
  useEffect(() => {
    const importCode = searchParams.get('importCode')
    if (importCode) {
      setShareDrawerMode('import')
      setIsShareDrawerOpen(true)
    }
  }, [searchParams])

  // Folder Actions
  const handleCreateOrUpdateFolder = async (payload: CreateVocabFolderPayload) => {
    if (!token) return
    if (editingFolder) {
      await updateVocabFolder(editingFolder.id, payload, token)
    } else {
      await createVocabFolder(payload, token)
    }
    await loadData()
  }

  const handleDeleteFolder = async (folder: VocabFolder) => {
    if (!token) return
    if (!window.confirm(`Bạn có chắc muốn xóa folder "${folder.title}"? Các bộ từ bên trong sẽ chuyển về thư mục gốc.`)) {
      return
    }
    await deleteVocabFolder(folder.id, token)
    if (currentFolder?.id === folder.id) {
      setCurrentFolder(null)
    }
    await loadData()
  }

  // Vocab Set Actions
  const handleCreateOrUpdateSet = async (payload: CreateVocabSetPayload) => {
    if (!token) return
    if (editingSet) {
      await updateVocabSet(editingSet.id, payload, token)
    } else {
      await createVocabSet(payload, token)
    }
    await loadData()
  }

  const handleDeleteSet = async (set: VocabSetSummary) => {
    if (!token) return
    if (!window.confirm(`Bạn có chắc muốn xóa bộ từ "${set.title}"?`)) {
      return
    }
    await deleteVocabSet(set.id, token)
    await loadData()
  }

  const handleToggleShare = async (set: VocabSetSummary) => {
    if (!token) return
    const updated = await toggleShareVocabSet(set.id, token)
    setSharingSet(updated)
    await loadData()
  }

  const handleImportSharedCode = async (code: string) => {
    if (!token) return
    await importSharedVocabSet(code, token)
    await loadData()
    setActiveTab('my_sets')
  }

  // Filtering sets based on currentFolder
  const displayedMySets = currentFolder
    ? mySets.filter((s) => s.folderId === currentFolder.id)
    : mySets.filter((s) => !s.folderId) // root sets

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Quick Actions & Folder Breadcrumb (only when inside a folder) */}
      <div className={`flex flex-col md:flex-row md:items-center gap-4 ${currentFolder ? 'justify-between' : 'justify-end'}`}>
        {currentFolder && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
            <button
              type="button"
              onClick={() => setCurrentFolder(null)}
              className="hover:text-emerald-600 cursor-pointer transition-colors"
            >
              Bộ từ vựng
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-emerald-600 font-bold text-sm">{currentFolder.title}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
              {displayedMySets.length} bộ từ
            </span>
          </div>
        )}

        {/* Action Buttons styled matching Light Theme */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setEditingSet(null)
              setIsSetDrawerOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bộ từ mới</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingFolder(null)
              setIsFolderDrawerOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Tạo folder</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4" />
            <span>Lộ trình</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShareDrawerMode('import')
              setIsShareDrawerOpen(true)
            }}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs shadow-sm transition-all"
          >
            <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
            <span>Nhập mã</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('my_sets')
            setCurrentFolder(null)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my_sets'
              ? 'bg-white text-emerald-700 border border-slate-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Bộ từ của tôi</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-600 font-semibold">
            {mySets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'community'
              ? 'bg-white text-sky-700 border border-slate-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4 text-sky-600" />
          <span>Cộng đồng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('classroom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'classroom'
              ? 'bg-white text-indigo-700 border border-slate-200 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>Lớp học</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="text-sm font-medium text-slate-600">Đang tải danh sách bộ từ vựng...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
          {error}
        </div>
      ) : activeTab === 'my_sets' ? (
        <div className="space-y-8">
          {/* Back button if inside a folder */}
          {currentFolder && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentFolder(null)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors border border-slate-200 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại tất cả folder</span>
              </button>
              <span className="text-xs text-slate-500">
                Đang xem thư mục: <strong className="text-slate-800">{currentFolder.title}</strong>
              </span>
            </div>
          )}

          {/* Folders Section (only shown at root) */}
          {!currentFolder && folders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-amber-500" />
                  <span>Folders ({folders.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <VocabFolderCard
                    key={folder.id}
                    folder={folder}
                    onOpen={(f) => setCurrentFolder(f)}
                    onEdit={(f) => {
                      setEditingFolder(f)
                      setIsFolderDrawerOpen(true)
                    }}
                    onDelete={handleDeleteFolder}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Vocab Sets Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>
                  {currentFolder
                    ? `Bộ từ trong folder (${displayedMySets.length})`
                    : `Bộ từ tự do (${displayedMySets.length})`}
                </span>
              </h2>
            </div>

            {displayedMySets.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Chưa có bộ từ vựng nào</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {currentFolder
                      ? `Thư mục "${currentFolder.title}" hiện chưa chứa bộ từ vựng nào. Hãy tạo bộ từ mới vào đây!`
                      : 'Bắt đầu hành trình học tập bằng cách tạo bộ từ vựng đầu tiên của bạn hoặc nhập bộ từ từ cộng đồng.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSet(null)
                    setIsSetDrawerOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo bộ từ ngay</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedMySets.map((set) => (
                  <VocabSetCard
                    key={set.id}
                    set={set}
                    onView={(s) => navigate(`/words?vocabSetId=${s.id}`)}
                    onEdit={(s) => {
                      setEditingSet(s)
                      setIsSetDrawerOpen(true)
                    }}
                    onShare={(s) => {
                      setSharingSet(s)
                      setShareDrawerMode('share')
                      setIsShareDrawerOpen(true)
                    }}
                    onDelete={handleDeleteSet}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'community' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Khám phá và học các bộ từ vựng hữu ích được chia sẻ bởi cộng đồng người học tiếng Trung
            </p>
          </div>

          {communitySets.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              Chưa có bộ từ vựng công khai nào trong cộng đồng.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {communitySets.map((set) => (
                <VocabSetCard
                  key={set.id}
                  set={set}
                  isReadOnly={true}
                  onView={(s) => navigate(`/words?vocabSetId=${s.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Classroom tab */
        <div className="py-16 text-center text-slate-600 space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Bộ từ theo Lớp học</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Các bộ từ do giáo viên phụ trách lớp học giao cho lớp của bạn sẽ hiển thị tại đây để bạn ôn luyện mỗi ngày.
          </p>
        </div>
      )}

      {/* Drawers */}
      <VocabFolderDrawer
        isOpen={isFolderDrawerOpen}
        onClose={() => setIsFolderDrawerOpen(false)}
        onSubmit={handleCreateOrUpdateFolder}
        initialFolder={editingFolder}
      />

      <VocabSetDrawer
        isOpen={isSetDrawerOpen}
        onClose={() => setIsSetDrawerOpen(false)}
        onSubmit={handleCreateOrUpdateSet}
        folders={folders}
        currentFolderId={currentFolder?.id}
        initialSet={editingSet}
      />

      <ShareVocabSetDrawer
        isOpen={isShareDrawerOpen}
        onClose={() => setIsShareDrawerOpen(false)}
        vocabSet={sharingSet}
        mode={shareDrawerMode}
        onToggleShare={handleToggleShare}
        onImportCode={handleImportSharedCode}
      />
    </div>
  )
}
