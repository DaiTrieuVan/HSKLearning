import React, { useState } from 'react'
import { X, Share2, Copy, Check, Globe, Lock, ArrowDownToLine, Loader2 } from 'lucide-react'
import type { VocabSetSummary } from '../../api/vocabManagement'

interface ShareVocabSetDrawerProps {
  isOpen: boolean
  onClose: () => void
  vocabSet?: VocabSetSummary | null
  onToggleShare?: (set: VocabSetSummary) => Promise<void>
  onImportCode?: (code: string) => Promise<void>
  mode?: 'share' | 'import'
}

export const ShareVocabSetDrawer: React.FC<ShareVocabSetDrawerProps> = ({
  isOpen,
  onClose,
  vocabSet,
  onToggleShare,
  onImportCode,
  mode = 'share',
}) => {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!isOpen) return null

  const shareCode = vocabSet?.shareCode || 'SET-XXXXXXXX'
  const shareLink = typeof window !== 'undefined'
    ? `${window.location.origin}/vocab-sets?importCode=${shareCode}`
    : ''

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(shareCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      setMessage({ type: 'error', text: 'Không thể sao chép mã chia sẻ' })
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      setMessage({ type: 'error', text: 'Không thể sao chép liên kết chia sẻ' })
    }
  }

  const handleToggle = async () => {
    if (!vocabSet || !onToggleShare) return
    try {
      setIsProcessing(true)
      setMessage(null)
      await onToggleShare(vocabSet)
      setMessage({ type: 'success', text: 'Cập nhật trạng thái chia sẻ thành công' })
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Có lỗi xảy ra' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim() || !onImportCode) return
    try {
      setIsProcessing(true)
      setMessage(null)
      await onImportCode(inputCode.trim().toUpperCase())
      setMessage({ type: 'success', text: 'Nhập bộ từ thành công vào tài khoản của bạn!' })
      setInputCode('')
      setTimeout(() => onClose(), 1500)
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Mã chia sẻ không hợp lệ' })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                {mode === 'import' ? <ArrowDownToLine className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {mode === 'import' ? 'Nhập bộ từ chia sẻ' : 'Chia sẻ bộ từ vựng'}
                </h2>
                <p className="text-xs text-slate-400">
                  {mode === 'import'
                    ? 'Nhập mã chia sẻ để thêm bộ từ vào tài khoản của bạn'
                    : vocabSet?.title || 'Chia sẻ kiến thức với bạn bè'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {message && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border ${
                  message.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {mode === 'share' && vocabSet && (
              <>
                {/* Share Status Toggle */}
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        vocabSet.isPublic
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-700/60 text-slate-400'
                      }`}
                    >
                      {vocabSet.isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {vocabSet.isPublic ? 'Đang bật chia sẻ công khai' : 'Đang ở chế độ riêng tư'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {vocabSet.isPublic
                          ? 'Bất kỳ ai có mã đều có thể nhập bộ từ này'
                          : 'Chỉ bạn mới có quyền xem và học bộ từ này'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggle}
                    disabled={isProcessing}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                      vocabSet.isPublic
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : vocabSet.isPublic ? 'Tắt chia sẻ' : 'Bật chia sẻ'}
                  </button>
                </div>

                {/* Share Code Card */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mã chia sẻ (Share Code)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-base font-bold tracking-wider">
                      {shareCode}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs flex items-center gap-2 transition-colors"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-300" />
                          <span>Chép mã</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Share Link */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Đường dẫn chia sẻ trực tiếp
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareLink}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs truncate focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                      <span>{copiedLink ? 'Đã chép' : 'Sao chép link'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Import Form */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                <span>Nhập bộ từ từ bạn bè</span>
              </h3>
              <p className="text-xs text-slate-400">
                Nếu bạn được người khác gửi cho một mã chia sẻ (Ví dụ: SET-1A2B3C4D), hãy dán vào đây để nhân bản bộ từ vào tài khoản của bạn.
              </p>

              <form onSubmit={handleImport} className="space-y-3">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Nhập mã chia sẻ (SET-...)"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white uppercase placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !inputCode.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
                >
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Nhập bộ từ vựng vào tài khoản</span>
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-800 flex items-center justify-end bg-slate-900/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
