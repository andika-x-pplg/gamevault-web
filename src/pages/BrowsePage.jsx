import { useSearchParams, Link } from 'react-router-dom'
import { Compass, ArrowRight, Star, Download } from 'lucide-react'
import { games } from '../data/games'

export default function BrowsePage() {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const genreQuery = searchParams.get('genre') || ''
  const filterQuery = searchParams.get('filter') || ''

  let filtered = [...games]

  if (searchQuery) {
    filtered = filtered.filter(
      (g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  if (genreQuery) {
    filtered = filtered.filter(
      (g) =>
        g.genre.toLowerCase() === genreQuery.toLowerCase() ||
        (g.genres && g.genres.some((gn) => gn.toLowerCase() === genreQuery.toLowerCase())),
    )
  }

  if (filterQuery === 'trending') {
    filtered = filtered.filter((g) => g.trending)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-indigo-400 mb-1">
          <Compass className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Katalog Game</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Browse Games</h1>
        <p className="text-sm text-slate-400 mt-1">
          Jelajahi koleksi game PC legal gratis: Free-to-Play, Freeware, Open-Source, dan Game Demo.
        </p>

        {/* Active Filter Indicators */}
        <div className="flex flex-wrap gap-2 mt-3">
          {searchQuery && (
            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              Pencarian: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
          {genreQuery && (
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20 capitalize">
              Genre: {genreQuery}
            </span>
          )}
          {filterQuery && (
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20 capitalize">
              Filter: {filterQuery}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Games */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111726]/50 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-white font-semibold">Tidak ada game yang cocok.</p>
          <p className="text-xs text-slate-400">
            Coba gunakan kata kunci pencarian lain atau lihat semua game.
          </p>
          <Link
            to="/browse"
            className="inline-block mt-3 text-xs text-indigo-400 hover:underline"
          >
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((game) => (
            <Link
              key={game.slug}
              to={`/game/${game.slug}`}
              className="group flex flex-col rounded-2xl bg-[#111726] border border-slate-800 hover:border-indigo-500/50 hover:bg-[#161F33] transition-all overflow-hidden shadow-lg hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase">
                    FREE
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[11px] font-semibold text-amber-400">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{game.rating}</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-indigo-400 font-medium">{game.genre}</span>
                    <span className="text-slate-500 text-[11px]">{game.license}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {game.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Download className="w-3 h-3 text-indigo-400" />
                    {game.downloads}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    Detail <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
