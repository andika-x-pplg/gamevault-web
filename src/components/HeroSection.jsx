import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  Download,
  Plus,
  Check,
  Gamepad2,
  ShieldCheck,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../context/useAuth'
import { useLibrary } from '../context/useLibrary'

export default function HeroSection({ featuredGames = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMutating, setIsMutating] = useState(false)
  const { isAuthenticated } = useAuth()
  const { isInLibrary, toggleLibrary } = useLibrary()
  const navigate = useNavigate()

  // Auto cycle carousel every 7 seconds
  useEffect(() => {
    if (!featuredGames.length) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [featuredGames.length])

  // If no featured games provided
  if (!featuredGames.length) return null

  const currentGame = featuredGames[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredGames.length)
  }

  const isSaved = isInLibrary(currentGame.slug)

  return (
    <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#0E1524] shadow-2xl">
      {/* Background Banner Image with Smooth Fade */}
      <div className="relative h-[480px] sm:h-[520px] lg:h-[560px] w-full overflow-hidden">
        <img
          key={currentGame.id}
          src={currentGame.banner}
          alt={currentGame.title}
          className="w-full h-full object-cover object-center scale-100 transition-all duration-700"
        />

        {/* Multi-layer Gradient Overlays for High Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/85 to-transparent lg:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/50 to-transparent" />
        <div className="absolute inset-0 bg-indigo-950/20 mix-blend-color" />

        {/* Hero Content Box */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
          {/* Top Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Game
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              FREE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-slate-300 bg-black/50 backdrop-blur-md border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              {currentGame.license}
            </span>
          </div>

          {/* Center / Bottom Info */}
          <div className="max-w-2xl space-y-4">
            {/* Meta tags */}
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 flex-wrap">
              <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                {currentGame.genre}
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{currentGame.rating} / 5.0</span>
              </div>
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 text-slate-300">
                <Download className="w-4 h-4 text-indigo-400" />
                <span>{currentGame.downloads} Downloads</span>
              </div>
            </div>

            {/* Game Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {currentGame.title}
            </h1>

            {/* Game Description */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed line-clamp-3">
              {currentGame.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/game/${currentGame.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-102 transition-all duration-200"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>View Game</span>
              </Link>

              <button
                type="button"
                disabled={isMutating}
                onClick={async () => {
                  if (!isAuthenticated) {
                    navigate('/login')
                    return
                  }
                  setIsMutating(true)
                  await toggleLibrary(currentGame.slug)
                  setIsMutating(false)
                }}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border backdrop-blur-md cursor-pointer disabled:opacity-75 ${
                  isSaved
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/10 hover:bg-white/15 border-white/15 text-white hover:border-white/30'
                }`}
              >
                {isMutating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Memproses...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>In Library</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Library</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Carousel Controls Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            {/* Indicator Dots */}
            <div className="flex items-center gap-2">
              {featuredGames.map((game, idx) => (
                <button
                  key={game.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-500'
                      : 'w-2 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrow Nav Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Previous Featured Game"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Next Featured Game"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
