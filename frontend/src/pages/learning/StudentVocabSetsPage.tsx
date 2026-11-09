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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span
              onClick={() => setCurrentFolder(null)}
              className="hover:text-white cursor-pointer transition-colors"
            >
              Bộ từ vựng
            </span>
            {currentFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-emerald-400">{currentFolder.title}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1 tracking-tight flex items-center gap-3">
            <span>{currentFolder ? currentFolder.title : 'Quản lý Bộ từ vựng'}</span>
            {currentFolder && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                {displayedMySets.length} bộ từ
              </span>
            )}
          </h1>
        </div>

        {/* Action Buttons styled matching Vocapy */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setEditingSet(null)
              setIsSetDrawerOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
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
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-900/30 transition-all hover:scale-105"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Tạo folder</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/roadmap')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-900/20 transition-all hover:scale-105"
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
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors"
          >
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
            <span>Nhập mã</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab('my_sets')
            setCurrentFolder(null)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'my_sets'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Bộ từ của tôi</span>
          <span className="px-1.5 py-0.2 rounded-md bg-slate-700/60 text-[10px] text-slate-300">
            {mySets.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'community'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Cộng đồng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('classroom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'classroom'
              ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span>Lớp học</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <span className="text-sm font-medium">Đang tải danh sách bộ từ vựng...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại tất cả folder</span>
              </button>
              <span className="text-xs text-slate-400">
                Đang xem thư mục: <strong className="text-white">{currentFolder.title}</strong>
              </span>
            </div>
          )}

          {/* Folders Section (only shown at root) */}
          {!currentFolder && folders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Folder className="w-4 h-4 text-amber-400" />
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
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>
                  {currentFolder
                    ? `Bộ từ trong folder (${displayedMySets.length})`
                    : `Bộ từ tự do (${displayedMySets.length})`}
                </span>
              </h2>
            </div>

            {displayedMySets.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Chưa có bộ từ vựng nào</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition-all"
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
            <p className="text-xs text-slate-400">
              Khám phá và học các bộ từ vựng hữu ích được chia sẻ bởi cộng đồng người học tiếng Trung
            </p>
          </div>

          {communitySets.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
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
        <div className="py-16 text-center text-slate-400 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Bộ từ theo Lớp học</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
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
