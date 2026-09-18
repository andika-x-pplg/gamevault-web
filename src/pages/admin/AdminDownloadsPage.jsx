import { useState, useEffect } from 'react'
import {
  DownloadCloud,
  TrendingUp,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  Loader2,
  Clock,
  User,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAdminDownloadStats } from '../../services/downloadService'

export default function AdminDownloadsPage() {
  const [statsData, setStatsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await getAdminDownloadStats()
      if (res?.data) {
        setStatsData(res.data)
      }
    } catch {
      // Handled silently
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    getAdminDownloadStats()
      .then((res) => {
        if (isMounted && res?.data) {
          setStatsData(res.data)
        }
      })
      .catch(() => {
        // Handled silently
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const overview = statsData?.overview || {
    total_downloads: 0,
    downloads_today: 0,
    downloads_this_week: 0,
    downloads_this_month: 0,
  }

  const weeklyTrends = statsData?.weekly_trend || []
  const licenseBreakdown = statsData?.license_breakdown || []
  const leaderboard = statsData?.top_games || []
  const recentDownloads = statsData?.recent_downloads || []

  // Max weekly value for chart scaling
  const maxWeeklyCount = Math.max(...weeklyTrends.map((w) => w.count), 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Download & Distribution Analytics</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Real-time MySQL metrics of verified game installations, legal traffic patterns, and user activity.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-750 text-gray-200 border border-surface-700 rounded-xl text-xs font-semibold transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary-400' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 rounded-2xl bg-surface-850 border border-surface-700/60 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-300">Loading download analytics from MySQL database...</p>
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
                {overview.total_downloads > 1000000
                  ? `${(overview.total_downloads / 1000000).toFixed(1)}M+`
                  : overview.total_downloads.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Real database count
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Downloads Today
                </span>
                <Calendar className="w-5 h-5 text-primary-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {overview.downloads_today.toLocaleString()}
              </div>
              <p className="text-xs text-primary-400 font-medium">
                Past 24 hours activity
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  This Week
                </span>
                <Calendar className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {overview.downloads_this_week.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400">Past 7 days volume</p>
            </div>

            <div className="p-5 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  This Month
                </span>
                <Layers className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {overview.downloads_this_month.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Past 30 days
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
                  <p className="text-xs text-gray-400 mt-0.5">Direct + External download requests logged</p>
                </div>
              </div>

              <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-surface-700/50">
                {weeklyTrends.map((item) => {
                  const heightPercent = maxWeeklyCount > 0 ? Math.max((item.count / maxWeeklyCount) * 100, 8) : 8
                  return (
                    <div
                      key={item.date}
                      className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                    >
                      <div className="relative w-full flex justify-center h-full items-end">
                        <div className="absolute -top-8 px-2 py-1 rounded bg-surface-900 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg whitespace-nowrap">
                          {item.count.toLocaleString()} dl ({item.date})
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-emerald-700 via-emerald-500 to-teal-400 group-hover:brightness-125 transition-all shadow-md group-hover:shadow-emerald-500/30"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-400 group-hover:text-emerald-300 transition-colors">
                        {item.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* License Distribution */}
            <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">License Distribution</h3>
                <p className="text-xs text-gray-400 mb-6">Proportion of downloads by license category</p>

                <div className="space-y-4">
                  {licenseBreakdown.map((item) => (
                    <div key={item.license} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-200">{item.license}</span>
                        <span className="text-primary-300 font-mono">
                          {item.count.toLocaleString()} ({item.percentage}%)
                        </span>
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

              <div className="p-3 rounded-xl bg-surface-900/60 border border-surface-750 text-xs text-gray-400 mt-6 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                100% of tracked games use legal distribution channels.
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

          {/* Recent Download Logs */}
          <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Recent Download Requests</h3>
                <p className="text-xs text-gray-400">Real-time audit log from `downloads` database table</p>
              </div>
            </div>

            {recentDownloads.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No downloads logged yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-surface-750 text-gray-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Game Title</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">User / Requester</th>
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-800 text-gray-300">
                    {recentDownloads.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-800/50 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                          <span className="truncate max-w-[200px]">{log.game_title}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                              log.download_type === 'direct'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            }`}
                          >
                            {log.download_type}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {log.user ? (
                            <span className="flex items-center gap-1.5 text-primary-300 font-medium">
                              <User className="w-3.5 h-3.5" />
                              {log.user.name}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">Guest visitor</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-400">
                          {log.ip_address || '—'}
                        </td>
                        <td className="py-3 px-3 text-right text-gray-400 font-mono">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

