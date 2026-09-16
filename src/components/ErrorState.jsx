import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function ErrorState({
  title = 'Gagal Memuat Data',
  message = 'Tidak dapat terhubung ke server GameVault. Pastikan backend server sedang berjalan.',
  onRetry,
}) {
  return (
    <div className="py-12 sm:py-16 text-center rounded-3xl bg-[#111726]/60 border border-rose-500/20 p-8 space-y-4 shadow-xl">
      <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}
    </div>
  )
}
