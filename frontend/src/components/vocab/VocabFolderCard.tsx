import React from 'react'
import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import type { VocabFolder } from '../../api/vocabManagement'

interface VocabFolderCardProps {
  folder: VocabFolder
  onOpen: (folder: VocabFolder) => void
  onEdit: (folder: VocabFolder) => void
  onDelete: (folder: VocabFolder) => void
}

export const VocabFolderCard: React.FC<VocabFolderCardProps> = ({
  folder,
  onOpen,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const folderColor = folder.color || '#F59E0B'

  return (
    <div
      onClick={() => onOpen(folder)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border bg-white"
      style={{
        borderColor: `${folderColor}50`,
        boxShadow: `0 4px 14px -2px ${folderColor}15`,
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ backgroundColor: folderColor }}
        >
          <Folder className="w-6 h-6" />
        </div>

        <div className="relative" ref={menuRef} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1 text-sm">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onEdit(folder)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 text-left"
              >
                <Pencil className="w-4 h-4 text-emerald-600" />
                <span>Chỉnh sửa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onDelete(folder)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa folder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
          {folder.title}
        </h3>
        {folder.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1">
            {folder.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
        <span className="font-semibold text-slate-600">{folder.vocabSetCount} bộ từ</span>
        <span className="text-emerald-600 font-semibold group-hover:underline">Mở folder &rarr;</span>
      </div>
    </div>
  )
}
