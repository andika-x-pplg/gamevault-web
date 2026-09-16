import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Download, Gamepad2 } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#12192B] via-[#0E1524] to-[#161329] p-8 sm:p-12 shadow-2xl">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Platform Kurasi PC Gaming Terpercaya</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Discover Your Next Game, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tanpa Biaya & 100% Legal
          </span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Ribuan game berkualitas tinggi menunggu untuk kamu mainkan. Mulai dari karya indie open-source, freeware legendaris, game free-to-play kompetitif, hingga demo rilis terbaru langsung di PC kamu.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 pt-2">
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Bebas DRM / Malware
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <Download className="w-4 h-4 text-indigo-400" />
            Distribusi Resmi
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
            Kompatibel Windows/Linux
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-200"
          >
            <span>Browse Games</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
