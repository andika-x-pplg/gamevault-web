import { Link } from 'react-router-dom'
import {
  Heart,
  Trash2,
  Star,
  HardDrive,
  Compass,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react'
import { useLibrary } from '../context/useLibrary'

export default function WishlistPage() {
  const { wishlistGames, removeFromWishlist, addToLibrary, isInLibrary } = useLibrary()

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            <span>Daftar Keinginan</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Save games you&apos;re interested in and find them here later.
          </p>
        </div>

        {wishlistGames.length > 0 && (
          <span className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            {wishlistGames.length} Game di Wishlist
          </span>
        )}
      </div>

      {/* Content: Empty State or Grid */}
      {wishlistGames.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#111726]/40 border border-slate-800/80 p-8 sm:p-12 space-y-5">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-lg">
            <Heart className="w-12 h-12" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Your Wishlist is Empty</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Save games you&apos;re interested in and find them here later. Temukan game PC legal menarik dan simpan ke wishlist Anda!
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Games</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlistGames.map((game) => {
            const inLibrary = isInLibrary(game.slug)
            return (
              <div
                key={game.id}
                className="group flex flex-col rounded-2xl bg-[#111726]/90 border border-slate-800 hover:border-rose-500/40 hover:bg-[#161F33] transition-all duration-300 overflow-hidden shadow-lg"
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
                    <h3 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors line-clamp-1">
                      {game.title}
                    </h3>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="space-y-2 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/game/${game.slug}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-colors"
                      >
                        <span>View Game</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(game.slug)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
                        title="Remove from Wishlist"
                        aria-label={`Remove ${game.title} from Wishlist`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Library action button */}
                    <button
                      type="button"
                      onClick={() => addToLibrary(game.slug)}
                      className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        inLibrary
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                      }`}
                    >
                      {inLibrary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>In Library</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Library</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
