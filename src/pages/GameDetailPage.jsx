import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  Download,
  Heart,
  Plus,
  Check,
  ShieldCheck,
  ChevronRight,
  SearchX,
  Compass,
  FileText,
} from 'lucide-react'
import { getGameBySlug } from '../data/games'
import { useLibrary } from '../context/useLibrary'
import ScreenshotGallery from '../components/ScreenshotGallery'
import GameInformation from '../components/GameInformation'
import SystemRequirements from '../components/SystemRequirements'
import DownloadSection from '../components/DownloadSection'
import SimilarGames from '../components/SimilarGames'

export default function GameDetailPage() {
  const { slug } = useParams()
  const game = getGameBySlug(slug)

  // Global Library & Wishlist Context
  const { isInLibrary, toggleLibrary, isInWishlist, toggleWishlist } = useLibrary()

  // Scroll to top whenever slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  // 1. Game Not Found State
  if (!game) {
    return (
      <div className="py-20 text-center rounded-3xl bg-[#111726]/50 border border-slate-800 p-8 sm:p-12 space-y-5 my-8">
        <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg">
          <SearchX className="w-12 h-12" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Game Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Game dengan slug &ldquo;<span className="text-indigo-400 font-mono">{slug}</span>&rdquo; tidak ditemukan di katalog GameVault.
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
    )
  }

  const inLibrary = isInLibrary(game.slug)
  const isWishlisted = isInWishlist(game.slug)

  // Handle smooth scroll to download section
  const scrollToDownload = () => {
    const downloadEl = document.getElementById('download-section')
    if (downloadEl) {
      downloadEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-12 py-2">
      {/* 1. Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 flex-wrap" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/browse" className="hover:text-indigo-400 transition-colors">
          Browse
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        {game.genre && (
          <>
            <Link
              to={`/browse?genre=${game.genre}`}
              className="hover:text-indigo-400 transition-colors"
            >
              {game.genre}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </>
        )}
        <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-md">
          {game.title}
        </span>
      </nav>

      {/* 2. Hero / Game Header */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0E1524] shadow-2xl">
        {/* Background Banner with Gradient Blend */}
        <div className="relative min-h-[380px] sm:min-h-[440px] w-full overflow-hidden">
          <img
            src={game.banner || game.image}
            alt={`${game.title} banner`}
            className="w-full h-full object-cover object-center absolute inset-0"
          />

          {/* Deep Dark Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-[#0B0E14]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/70 to-transparent" />

          {/* Hero Content Grid (Cover | Game Information & Actions) */}
          <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 h-full justify-end">
            {/* Game Cover Poster */}
            <div className="w-44 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700/80 shadow-2xl flex-shrink-0 relative group">
              <img
                src={game.image}
                alt={game.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-emerald-500 text-slate-950 uppercase shadow">
                  FREE
                </span>
              </div>
            </div>

            {/* Title & Metadata & Action Buttons */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              {/* Badges & Rating */}
              <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {game.license}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30">
                  {game.genre}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{game.rating} / 5.0</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-300 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{game.downloads} Unduhan</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {game.title}
              </h1>

              {/* Short description */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {game.shortDescription || game.description}
              </p>

              {/* Developer info */}
              <div className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-4 flex-wrap">
                <span>
                  Developer: <strong className="text-slate-200">{game.developer}</strong>
                </span>
                <span>•</span>
                <span>
                  Rilis: <strong className="text-slate-200">{game.releaseDate}</strong>
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Legal
                </span>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {/* Download Scroll Button */}
                <button
                  type="button"
                  onClick={scrollToDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-102 transition-all duration-200 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>

                {/* Add to Library Toggle */}
                <button
                  type="button"
                  onClick={() => toggleLibrary(game.slug)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border backdrop-blur-md cursor-pointer ${
                    inLibrary
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-white'
                  }`}
                >
                  {inLibrary ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>In Library</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-indigo-400" />
                      <span>Add to Library</span>
                    </>
                  )}
                </button>

                {/* Wishlist Toggle */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(game.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border backdrop-blur-md cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle Wishlist"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-rose-400 text-rose-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Details & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About, Screenshots, Specs */}
        <div className="lg:col-span-2 space-y-10">
          {/* About This Game */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white">About This Game</h2>
            </div>
            <div className="p-6 sm:p-8 rounded-2xl bg-[#111726]/80 border border-slate-800 space-y-4">
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {game.description}
              </p>
              {game.genres && game.genres.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400 font-medium">Tags:</span>
                  {game.genres.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Screenshot Gallery with Modal Lightbox */}
          <section>
            <ScreenshotGallery
              screenshots={game.screenshots || [game.banner, game.image]}
              gameTitle={game.title}
            />
          </section>

          {/* System Requirements */}
          <section>
            <SystemRequirements requirements={game.systemRequirements} />
          </section>
        </div>

        {/* Right Column: Technical Information Sidebar */}
        <div className="space-y-6">
          <GameInformation game={game} />
        </div>
      </div>

      {/* 4. Download & Installation Section */}
      <DownloadSection game={game} />

      {/* 5. Similar Games Section */}
      <SimilarGames currentSlug={game.slug} genre={game.genre} />
    </div>
  )
}
