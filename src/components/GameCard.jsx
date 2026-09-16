import { Link } from 'react-router-dom'
import { Star, Download, HardDrive, Calendar } from 'lucide-react'

export default function GameCard({ game, variant = 'standard' }) {
  if (!game) return null

  return (
    <Link
      to={`/game/${game.slug}`}
      className="group relative flex flex-col rounded-2xl bg-[#111726]/90 border border-slate-800/90 hover:border-indigo-500/50 hover:bg-[#161F33] transition-all duration-300 overflow-hidden shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1.5"
    >
      {/* Game Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-black/30 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/90 text-slate-950 shadow-md backdrop-blur-sm">
            FREE
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-200 bg-black/60 backdrop-blur-md border border-white/10">
            {game.license}
          </span>
        </div>

        {/* Floating Rating on Image Bottom */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{game.rating}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Genre & Tag */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-medium text-indigo-400">
              {game.genre}
            </span>
            {game.developer && (
              <>
                <span className="text-slate-600 text-xs">•</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
                  {game.developer}
                </span>
              </>
            )}
          </div>

          {/* Game Title */}
          <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          {/* Short Description (if standard/detailed) */}
          {variant !== 'compact' && game.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
              {game.description}
            </p>
          )}
        </div>

        {/* Card Footer Meta */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          {/* Download metric */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>{game.downloads}</span>
          </div>

          {/* Variant-specific meta */}
          {variant === 'popular' && game.fileSize && (
            <div className="flex items-center gap-1 text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span>{game.fileSize}</span>
            </div>
          )}

          {variant === 'new' && game.releaseDate && (
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{game.releaseDate}</span>
            </div>
          )}

          {variant === 'standard' && (
            <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              Lihat Game &rarr;
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
