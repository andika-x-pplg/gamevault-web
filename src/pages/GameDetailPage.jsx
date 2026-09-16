import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, ShieldCheck, Star, HardDrive, Calendar } from 'lucide-react'
import { getGameBySlug } from '../data/games'

export default function GameDetailPage() {
  const { slug } = useParams()
  const game = getGameBySlug(slug)

  const title = game?.title || (slug ? slug.replace(/-/g, ' ') : 'Nama Game')
  const description =
    game?.description ||
    `Ini adalah halaman placeholder detail untuk game ${slug}. Pada tahap selanjutnya, konten ini akan dihubungkan dengan data REST API backend Laravel.`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog</span>
      </Link>

      {/* Game Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#111726] border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                FREE
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded">
                {game?.license || 'Game Detail'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white capitalize">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Slug: <span className="text-slate-300">{slug}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Legal & Aman</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-56 sm:h-72 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 relative">
              {game?.banner ? (
                <img
                  src={game.banner}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                  Placeholder Preview / Banner Game
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-white">Deskripsi Game</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#0B0E14] border border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Informasi Teknis
              </h3>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Platform:</span>
                  <span>PC (Windows / Linux)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Genre:</span>
                  <span className="text-indigo-400 font-medium">
                    {game?.genre || 'Action / Indie'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Rating:</span>
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {game?.rating || '4.8'} / 5.0
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Ukuran File:</span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                    {game?.fileSize || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Rilis:</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {game?.releaseDate || '2024'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600/50 hover:bg-indigo-600 text-white font-semibold text-sm transition-all cursor-not-allowed opacity-80"
                title="Fitur download akan hadir di tahap backend"
              >
                <Download className="w-4 h-4" />
                <span>Download (Tahap Berikutnya)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
