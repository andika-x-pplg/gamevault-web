import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Gamepad2,
  Users,
  DownloadCloud,
  TrendingUp,
  PlusCircle,
  FolderTree,
  ExternalLink,
  Clock,
  CheckCircle2,
  Edit,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { getAdminDashboardStats } from '../../services/adminGameService'

const MONTHLY_DOWNLOADS = [
  { month: 'Jan', count: 18400, height: '42%' },
  { month: 'Feb', count: 22600, height: '52%' },
  { month: 'Mar', count: 28900, height: '65%' },
  { month: 'Apr', count: 25400, height: '58%' },
  { month: 'May', count: 32100, height: '74%' },
  { month: 'Jun', count: 36800, height: '82%' },
  { month: 'Jul', count: 41200, height: '94%' },
  { month: 'Aug', count: 38700, height: '88%' },
  { month: 'Sep', count: 44300, height: '100%' },
  { month: 'Oct', count: 39500, height: '90%' },
  { month: 'Nov', count: 34100, height: '78%' },
  { month: 'Dec', count: 31200, height: '71%' },
]

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState({
    total_games: 0,
    published_games: 0,
    draft_games: 0,
    total_users: 0,
    total_categories: 0,
    total_downloads: 0,
    recent_games: [],
    popular_games: [],
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadStats() {
      try {
        const response = await getAdminDashboardStats()
        if (isMounted && response?.data) {
          setStatsData(response.data)
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    loadStats()
    return () => {
      isMounted = false
    }
  }, [])

  const totalDownloadsNumber = statsData.total_downloads || 0
  const formattedTotalDownloads =
    totalDownloadsNumber > 1000000
      ? `${(totalDownloadsNumber / 1000000).toFixed(1)}M+`
      : totalDownloadsNumber > 1000
        ? `${(totalDownloadsNumber / 1000).toFixed(0)}K+`
        : totalDownloadsNumber.toLocaleString()

  // Static activities for audit log mockup
  const activities = [
    {
      id: 1,
      type: 'create',
      message: 'New game published to MySQL catalog',
      time: '10m ago',
      icon: PlusCircle,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 2,
      type: 'update',
      message: 'System requirements & metadata synchronized',
      time: '1h ago',
      icon: Edit,
      color: 'text-primary-400 bg-primary-500/10',
    },
    {
      id: 3,
      type: 'user',
      message: 'New user registered on platform',
      time: '3h ago',
      icon: Users,
      color: 'text-indigo-400 bg-indigo-500/10',
    },
    {
      id: 4,
      type: 'system',
      message: 'Automated database schema verification passed',
      time: '6h ago',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-surface-800 via-surface-800/90 to-primary-950/40 border border-surface-700/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1 text-primary-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Executive Control Center
          </div>
          <h2 className="text-2xl font-extrabold text-white">Platform Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">
            Real-time overview of GameVault MySQL database, active releases, and live catalog metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 relative shrink-0">
          <Link
            to="/admin/games/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Game
          </Link>
          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-700/80 hover:bg-surface-700 text-gray-200 font-medium text-sm transition-colors border border-surface-600/40"
          >
            <FolderTree className="w-4 h-4" />
            Categories
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 rounded-2xl bg-surface-850 border border-surface-700/60 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-300">Loading live dashboard metrics...</p>
        </div>
      ) : (
        <>
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Games */}
            <div className="p-5 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Games
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{statsData.total_games}</div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-emerald-400 font-medium">{statsData.published_games} Published</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{statsData.draft_games} Drafts</span>
              </div>
            </div>

            {/* Card 2: Total Users */}
            <div className="p-5 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Registered Users
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{statsData.total_users}</div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Database Accounts Active
              </p>
            </div>

            {/* Card 3: Total Downloads */}
            <div className="p-5 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Total Downloads
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <DownloadCloud className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{formattedTotalDownloads}</div>
              <p className="text-xs text-gray-400">Across all catalog releases</p>
            </div>

            {/* Card 4: Total Categories */}
            <div className="p-5 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Categories Active
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{statsData.total_categories}</div>
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" /> Genre Classifications
              </p>
            </div>
          </div>

          {/* Chart & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Column (2 Cols) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Downloads Overview</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Monthly distribution volume</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                  <span className="w-3 h-3 rounded-full bg-primary-500 inline-block" />
                  Monthly Volume
                </div>
              </div>

              {/* Pure CSS/SVG Bar Chart */}
              <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2 border-b border-surface-700/50">
                {MONTHLY_DOWNLOADS.map((item) => (
                  <div
                    key={item.month}
                    className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                  >
                    <div className="relative w-full flex justify-center h-full items-end">
                      <div className="absolute -top-8 px-2 py-1 rounded bg-surface-900 border border-primary-500/40 text-[11px] font-mono text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-lg">
                        {item.count.toLocaleString()} dl
                      </div>
                      <div
                        style={{ height: item.height }}
                        className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-primary-700 via-primary-500 to-indigo-400 group-hover:brightness-125 transition-all shadow-md group-hover:shadow-primary-500/30"
                      />
                    </div>
                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-primary-300 transition-colors">
                      {item.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity (1 Col) */}
            <div className="p-6 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg flex flex-col">
              <h3 className="text-base font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4 flex-1">
                {activities.map((act) => {
                  const Icon = act.icon
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-200 leading-snug">{act.message}</p>
                        <span className="text-[10px] text-gray-400">{act.time}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Two Column Section: Recently Added & Popular Games */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recently Added Games */}
            <div className="p-6 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Recently Added Games</h3>
                <Link
                  to="/admin/games"
                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  View All &rarr;
                </Link>
              </div>
              <div className="divide-y divide-surface-700/50">
                {statsData.recent_games?.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4">No recent games</p>
                ) : (
                  statsData.recent_games?.map((game) => {
                    const isDraft = game.status?.toLowerCase() === 'draft'
                    const cover =
                      game.cover_image ||
                      game.image ||
                      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'

                    return (
                      <div
                        key={game.id}
                        className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cover}
                            alt={game.title}
                            className="w-12 h-12 rounded-xl object-cover border border-surface-700 shrink-0"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{game.title}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {game.developer} • {game.categories?.[0]?.name || 'Catalog'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              isDraft
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                          >
                            {isDraft ? 'Draft' : 'Published'}
                          </span>
                          <Link
                            to={`/admin/games/${game.id}/edit`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700 transition-colors"
                            title="Edit Game"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Popular Games */}
            <div className="p-6 rounded-2xl bg-surface-800/90 border border-surface-700/60 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Popular Games</h3>
                <Link
                  to="/admin/downloads"
                  className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Analytics &rarr;
                </Link>
              </div>
              <div className="divide-y divide-surface-700/50">
                {statsData.popular_games?.length === 0 ? (
                  <p className="text-xs text-gray-500 py-4">No games available</p>
                ) : (
                  statsData.popular_games?.map((game, idx) => {
                    const cover =
                      game.cover_image ||
                      game.image ||
                      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'

                    return (
                      <div
                        key={game.id}
                        className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 text-center text-xs font-bold text-gray-400 font-mono">
                            #{idx + 1}
                          </span>
                          <img
                            src={cover}
                            alt={game.title}
                            className="w-12 h-12 rounded-xl object-cover border border-surface-700 shrink-0"
                            onError={(e) => {
                              e.target.src =
                                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'
                            }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{game.title}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {(game.download_count ?? 0).toLocaleString()} downloads
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {game.status !== 'draft' && (
                            <Link
                              to={`/game/${game.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-surface-700 transition-colors"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
