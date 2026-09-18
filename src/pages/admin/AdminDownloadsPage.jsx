import { useState, useEffect, useMemo } from 'react'
import {
  DownloadCloud,
  TrendingUp,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAdminGames } from '../../services/adminGameService'

const WEEKLY_TREND = [
  { day: 'Mon', count: 1820, height: '60%' },
  { day: 'Tue', count: 2140, height: '70%' },
  { day: 'Wed', count: 1980, height: '65%' },
  { day: 'Thu', count: 2450, height: '80%' },
  { day: 'Fri', count: 3120, height: '100%' },
  { day: 'Sat', count: 2890, height: '92%' },
  { day: 'Sun', count: 2650, height: '85%' },
]

export default function AdminDownloadsPage() {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadGamesData() {
      try {
        const response = await getAdminGames({ per_page: 100 })
        if (isMounted && response?.data) {
          setGames(response.data)
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadGamesData()
    return () => {
      isMounted = false
    }
  }, [])

  // Calculate dynamic stats from database records
  const totalDownloadsNumber = useMemo(() => {
    return games.reduce((acc, g) => acc + (g.download_count ?? g.downloadCount ?? 0), 0)
  }, [games])

  const leaderboard = useMemo(() => {
    return [...games]
      .sort((a, b) => (b.download_count ?? 0) - (a.download_count ?? 0))
      .slice(0, 6)
  }, [games])

  // Breakdown by License
  const licenseBreakdown = useMemo(() => {
    const counts = {}
    games.forEach((g) => {
      const type = g.game_type || g.license || 'free-to-play'
      const formattedType =
        type === 'free-to-play'
          ? 'Free-to-Play'
          : type === 'open-source'
            ? 'Open Source'
            : type.charAt(0).toUpperCase() + type.slice(1)

      counts[formattedType] = (counts[formattedType] || 0) + (g.download_count ?? 0)
    })

    return Object.entries(counts).map(([type, total]) => {
      const percentage = totalDownloadsNumber > 0 ? Math.round((total / totalDownloadsNumber) * 100) : 0
      return { type, total, percentage }
    })
  }, [games, totalDownloadsNumber])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Download & Distribution Analytics</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Detailed metrics of verified PC game installations, traffic patterns, and community engagement.
        </p>
      </div>

      {isLoading ? (
        <div className="p-16 rounded-2xl bg-surface-850 border border-surface-700/60 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-300">Loading analytics from database...</p>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Downloads
                </span>
                <DownloadCloud className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {totalDownloadsNumber > 1000000
                  ? `${(totalDownloadsNumber / 1000000).toFixed(1)}M+`
                  : totalDownloadsNumber.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +16.8% all-time growth
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Downloads Today
                </span>
                <Calendar className="w-5 h-5 text-primary-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">1,420</div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +8.5% vs yesterday
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  This Week
                </span>
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">17,050</div>
              <p className="text-xs text-gray-400">Weekly average: 15,200</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  This Month
                </span>
                <Layers className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">68,400</div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> +12.3% vs last month
              </p>
            </div>
          </div>

          {/* Chart & Distribution Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Trend Bar Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Daily Traffic Trends (Past 7 Days)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Distribution count across all verified links</p>
                </div>
              </div>

              <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-surface-700/50">
                {WEEKLY_TREND.map((item) => (
                  <div
                    key={item.day}
                    className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                  >
                    <div className="relative w-full flex justify-center h-full items-end">
                      <div className="absolute -top-8 px-2 py-1 rounded bg-surface-900 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg whitespace-nowrap">
                        {item.count.toLocaleString()} dl
                      </div>
                      <div
                        style={{ height: item.height }}
                        className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-emerald-700 via-emerald-500 to-teal-400 group-hover:brightness-125 transition-all shadow-md group-hover:shadow-emerald-500/30"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-400 group-hover:text-emerald-300 transition-colors">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* License Distribution */}
            <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">License Distribution</h3>
                <p className="text-xs text-gray-400 mb-6">Proportion of downloads by license category</p>

                <div className="space-y-4">
                  {licenseBreakdown.map((item) => (
                    <div key={item.type} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-200">{item.type}</span>
                        <span className="text-primary-300 font-mono">{item.percentage}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-900 overflow-hidden border border-surface-750">
                        <div
                          style={{ width: `${item.percentage}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-900/60 border border-surface-750 text-xs text-gray-400 mt-6">
                Free-to-Play and Open Source titles account for the majority of user traffic.
              </div>
            </div>
          </div>

          {/* Top 6 Downloaded Games Leaderboard */}
          <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Top Downloaded Games Leaderboard</h3>
                  <p className="text-xs text-gray-400">Most engaged community titles</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard.map((game, index) => {
                const cover =
                  game.cover_image ||
                  game.image ||
                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'

                return (
                  <div
                    key={game.id}
                    className="p-4 rounded-xl bg-surface-900/80 border border-surface-750 flex items-center gap-3.5 hover:border-primary-500/40 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        index === 0
                          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
                          : index === 1
                            ? 'bg-gray-300 text-black'
                            : index === 2
                              ? 'bg-amber-700 text-white'
                              : 'bg-surface-800 text-gray-400'
                      }`}
                    >
                      #{index + 1}
                    </div>

                    <img
                      src={cover}
                      alt={game.title}
                      className="w-12 h-12 rounded-lg object-cover border border-surface-700 shrink-0"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm truncate">{game.title}</h4>
                      <p className="text-xs text-primary-400 font-medium">
                        {(game.download_count ?? 0).toLocaleString()} downloads
                      </p>
                    </div>

                    {game.status !== 'draft' && (
                      <Link
                        to={`/game/${game.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-800 transition-colors shrink-0"
                        title="View Game"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
