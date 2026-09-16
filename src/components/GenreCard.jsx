import { Link } from 'react-router-dom'
import {
  Flame,
  Compass,
  Shield,
  Trophy,
  Cpu,
  Globe,
  Target,
  Sparkles,
  Ghost,
  Users,
  Gamepad2,
} from 'lucide-react'

// Icon mapping dictionary
const iconMap = {
  Flame,
  Compass,
  Shield,
  Trophy,
  Cpu,
  Globe,
  Target,
  Sparkles,
  Ghost,
  Users,
}

export default function GenreCard({ genre }) {
  const IconComponent = iconMap[genre.icon] || Gamepad2

  return (
    <Link
      to={`/browse?genre=${genre.slug}`}
      className="group relative flex flex-col p-5 rounded-2xl bg-[#111726]/80 border border-slate-800/80 hover:border-indigo-500/40 hover:bg-[#161F33] transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      {/* Background subtle radial glow on hover */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br ${genre.color} opacity-10 group-hover:opacity-25 blur-xl transition-opacity duration-300 pointer-events-none`}
      />

      <div className="flex items-center justify-between mb-3">
        {/* Icon Pill */}
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${genre.color} text-white shadow-md shadow-black/40 group-hover:scale-110 transition-transform duration-300`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Count Badge */}
        <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-400 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-800">
          {genre.gameCount} Games
        </span>
      </div>

      {/* Genre Info */}
      <div className="space-y-1 mt-1">
        <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
          {genre.name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {genre.description}
        </p>
      </div>

      <div className="mt-3 pt-2 flex items-center text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
        <span>Explore genre &rarr;</span>
      </div>
    </Link>
  )
}
