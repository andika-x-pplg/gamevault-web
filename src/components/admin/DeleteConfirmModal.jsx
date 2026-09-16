import { AlertTriangle, X } from 'lucide-react'

export default function DeleteConfirmModal({
  isOpen,
  title = 'Delete Item?',
  message = 'This action will remove the game from the current mock catalog.',
  itemName = '',
  onConfirm,
  onCancel,
  isDeleting = false,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-surface-800 border border-rose-500/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-surface-700"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {itemName && (
          <p className="text-sm font-semibold text-rose-300 bg-rose-950/40 border border-rose-500/20 px-3 py-1.5 rounded-lg mb-3 inline-block">
            {itemName}
          </p>
        )}
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl bg-surface-700 hover:bg-surface-600 text-gray-200 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-600/25 disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  )
}
