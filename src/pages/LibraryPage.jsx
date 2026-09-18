import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  Trash2,
  Star,
  HardDrive,
  Compass,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { useLibrary } from '../context/useLibrary'

export default function LibraryPage() {
  const { libraryGames, removeFromLibrary, isLoadingLibrary } = useLibrary()
  const [removingGame, setRemovingGame] = useState(null)
  const [isRemoving, setIsRemoving] = useState(false)

  const confirmRemove = async () => {
    if (removingGame) {
      setIsRemoving(true)
      await removeFromLibrary(removingGame.slug)
      setIsRemoving(false)
      setRemovingGame(null)
    }
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Koleksi Pribadi</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Your saved GameVault collection. Akses game yang telah Anda simpan kapan saja.
          </p>
        </div>

        {libraryGames.length > 0 && (
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            {libraryGames.length} Game Tersimpan
          </span>
        )}
      </div>

      {/* Content: Loading Skeleton, Empty State, or Grid */}
      {isLoadingLibrary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-2xl bg-[#111726]/60 border border-slate-800/80 p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-[16/10] rounded-xl bg-slate-800/60" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-slate-800/50" />
              </div>
              <div className="h-8 rounded-xl bg-slate-800/40" />
            </div>
          ))}
        </div>
      ) : libraryGames.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#111726]/40 border border-slate-800/80 p-8 sm:p-12 space-y-5">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg">
            <Gamepad2 className="w-12 h-12" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Your Library is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Games you add to your library will appear here. Jelajahi katalog game gratis kami dan tambahkan ke koleksi Anda!
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Games</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {libraryGames.map((game) => (
            <div
              key={game.id}
              className="group flex flex-col rounded-2xl bg-[#111726]/90 border border-slate-800 hover:border-indigo-500/40 hover:bg-[#161F33] transition-all duration-300 overflow-hidden shadow-lg"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={game.image}
                  alt={game.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase shadow">
                    FREE
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-200 bg-black/60 backdrop-blur-sm border border-white/10">
                    {game.license}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-xs font-semibold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{game.rating}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-400 font-medium">{game.genre}</span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {game.fileSize || 'Standard'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {game.title}
                  </h3>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <Link
                    to={`/game/${game.slug}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                  >
                    <span>View Game</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setRemovingGame(game)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition-all cursor-pointer"
                    title="Remove from Library"
                    aria-label={`Remove ${game.title} from Library`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {removingGame && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setRemovingGame(null)}
        >
          <div
            className="max-w-md w-full rounded-2xl bg-[#111726] border border-slate-700 p-6 space-y-4 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex p-3 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Hapus dari Library?</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong>{removingGame.title}</strong> dari daftar koleksi Library Anda?
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setRemovingGame(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isRemoving}
                onClick={confirmRemove}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                {isRemoving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isRemoving ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
