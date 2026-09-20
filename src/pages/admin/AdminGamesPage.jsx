import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Edit,
  Trash2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { getAdminGames, deleteAdminGame } from '../../services/adminGameService'
import { getAdminCategories } from '../../services/adminCategoryService'
import { useToast } from '../../context/useToast'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const GAME_TYPES = [
  { label: 'All Game Types', value: 'All' },
  { label: 'Free-to-Play', value: 'free-to-play' },
  { label: 'Freeware', value: 'freeware' },
  { label: 'Open Source', value: 'open-source' },
  { label: 'Demo', value: 'demo' },
]

const STATUS_OPTIONS = [
  { label: 'All Status', value: 'All' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
]

const SORT_OPTIONS = [
  { label: 'Newest Added', value: 'newest' },
  { label: 'Oldest Added', value: 'oldest' },
  { label: 'Most Downloaded', value: 'downloads' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Title (A-Z)', value: 'title-asc' },
  { label: 'Title (Z-A)', value: 'title-desc' },
]

function formatTypeLabel(type) {
  if (!type) return 'Free-to-Play'
  switch (type.toLowerCase()) {
    case 'free-to-play':
      return 'Free-to-Play'
    case 'freeware':
      return 'Freeware'
    case 'open-source':
      return 'Open Source'
    case 'demo':
      return 'Demo'
    default:
      return type
  }
}

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Action', slug: 'action' },
  { id: 2, name: 'Adventure', slug: 'adventure' },
  { id: 3, name: 'RPG', slug: 'rpg' },
  { id: 4, name: 'Racing', slug: 'racing' },
  { id: 5, name: 'Strategy', slug: 'strategy' },
  { id: 6, name: 'Simulation', slug: 'simulation' },
  { id: 7, name: 'Sports', slug: 'sports' },
  { id: 8, name: 'Indie', slug: 'indie' },
  { id: 9, name: 'Horror', slug: 'horror' },
  { id: 10, name: 'Multiplayer', slug: 'multiplayer' },
]

export default function AdminGamesPage() {
  const { success, error: toastError } = useToast()

  // Games and Categories state
  const [games, setGames] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 0,
    to: 0,
  })

  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedSort, setSelectedSort] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Debounce search input
  const searchTimeoutRef = useRef(null)
  const handleSearchInputChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(val)
      setCurrentPage(1)
    }, 350)
  }

  // Fetch categories once on mount
  useEffect(() => {
    let isMounted = true
    async function fetchCategoriesList() {
      try {
        const res = await getAdminCategories()
        if (isMounted && res?.data) {
          setCategories(res.data)
        }
      } catch {
        // Non-fatal, category options fallback
      }
    }
    fetchCategoriesList()
    return () => {
      isMounted = false
    }
  }, [])

  // Fetch games from backend API
  useEffect(() => {
    let isMounted = true

    const params = {
      page: currentPage,
      per_page: 12,
      sort: selectedSort,
    }

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim()
    }
    if (selectedGenre !== 'All') {
      params.category = selectedGenre
    }
    if (selectedType !== 'All') {
      params.type = selectedType
    }
    if (selectedStatus !== 'All') {
      params.status = selectedStatus
    }

    getAdminGames(params)
      .then((response) => {
        if (isMounted) {
          if (response && response.success) {
            setGames(response.data || [])
            if (response.meta) {
              setMeta(response.meta)
            }
            setFetchError(null)
          } else {
            setFetchError(response?.message || 'Failed to fetch games.')
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFetchError(err.response?.data?.message || err.message || 'Error connecting to database.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentPage, debouncedSearch, selectedGenre, selectedType, selectedStatus, selectedSort, refreshKey])

  // Filter change handlers
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value)
    setCurrentPage(1)
  }

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setDebouncedSearch('')
    setSelectedGenre('All')
    setSelectedType('All')
    setSelectedStatus('All')
    setSelectedSort('newest')
    setCurrentPage(1)
  }

  // Delete game action
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const res = await deleteAdminGame(deleteTarget.id)
      if (res && res.success) {
        success(res.message || `Game "${deleteTarget.title}" was deleted permanently from MySQL.`)
        setDeleteTarget(null)
        // Refresh list
        setRefreshKey((k) => k + 1)
      } else {
        throw new Error(res?.message || 'Failed to delete game.')
      }
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Failed to delete game.')
    } finally {
      setIsDeleting(false)
    }
  }

  const hasActiveFilters =
    debouncedSearch ||
    selectedGenre !== 'All' ||
    selectedType !== 'All' ||
    selectedStatus !== 'All' ||
    selectedSort !== 'newest'

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Game Catalog Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage GameVault titles, control Draft and Published states, and synchronize directly with MySQL.
          </p>
        </div>

        <Link
          to="/admin/games/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Game
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, developer, or slug..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setDebouncedSearch('')
                  setCurrentPage(1)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Genre select */}
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="w-full px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Type select */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="w-full px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              {GAME_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status select */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort and Active filter info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-700/40 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white font-semibold">{meta.total > 0 ? `${meta.from}-${meta.to}` : '0'}</strong> of{' '}
              <strong className="text-white font-semibold">{meta.total}</strong> games
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-primary-400 hover:text-primary-300 underline font-medium ml-2"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="bg-surface-900 border border-surface-700 rounded-lg px-2.5 py-1 text-xs text-gray-200 focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error state */}
      {fetchError && !isLoading && (
        <div className="p-8 rounded-2xl bg-surface-850 border border-rose-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-rose-300">{fetchError}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-750 hover:bg-surface-700 text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="p-16 rounded-2xl bg-surface-850 border border-surface-700/60 text-center space-y-3 shadow-xl">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-300">Loading catalog from database...</p>
        </div>
      )}

      {/* Main Table for Desktop */}
      {!isLoading && !fetchError && (
        <div className="hidden md:block rounded-2xl bg-surface-850 border border-surface-700/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-700/60 bg-surface-900/60 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Game</th>
                  <th className="py-3.5 px-4">Categories</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Version</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/40 text-sm">
                {games.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-base font-semibold text-gray-300">No games matched your filter</p>
                      <p className="text-xs text-gray-500 mt-1">Try resetting your search query or filters.</p>
                    </td>
                  </tr>
                ) : (
                  games.map((game) => {
                    const isDraft = game.status?.toLowerCase() === 'draft'
                    const coverImg =
                      game.cover_image ||
                      game.image ||
                      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'

                    return (
                      <tr key={game.id} className="hover:bg-surface-800/60 transition-colors">
                        {/* Game column */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={coverImg}
                              alt={game.title}
                              className="w-11 h-11 rounded-lg object-cover border border-surface-700 shrink-0"
                              onError={(e) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'
                              }}
                            />
                            <div className="min-w-0 max-w-[200px]">
                              <p className="font-semibold text-white truncate">{game.title}</p>
                              <p className="text-xs text-gray-400 truncate">{game.developer || 'Indie'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Categories */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[160px]">
                            {Array.isArray(game.categories) && game.categories.length > 0 ? (
                              game.categories.slice(0, 2).map((c) => (
                                <span
                                  key={c.id || c.slug || c.name}
                                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-750 text-gray-300 border border-surface-700"
                                >
                                  {c.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-500">-</span>
                            )}
                          </div>
                        </td>

                        {/* Type / License */}
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-300 font-medium">
                            {formatTypeLabel(game.game_type || game.license)}
                          </span>
                        </td>

                        {/* Version */}
                        <td className="py-3 px-4 font-mono text-xs text-gray-300">
                          {game.version || 'v1.0.0'}
                        </td>

                        {/* File Size */}
                        <td className="py-3 px-4 text-xs text-gray-300 font-mono">
                          {game.file_size || game.fileSize || 'N/A'}
                        </td>

                        {/* Downloads */}
                        <td className="py-3 px-4 text-xs text-gray-300 font-medium">
                          {(game.download_count ?? game.downloads ?? 0).toLocaleString()}
                        </td>

                        {/* Status badge */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              isDraft
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                            }`}
                          >
                            {isDraft ? 'Draft' : 'Published'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Action */}
                            {!isDraft ? (
                              <Link
                                to={`/game/${game.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-surface-700/80 transition-colors"
                                title="View Public Page"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="p-2 rounded-lg text-gray-600 cursor-not-allowed"
                                title="Draft game is hidden from public"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}

                            {/* Edit Action */}
                            <Link
                              to={`/admin/games/${game.id}/edit`}
                              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-700/80 transition-colors"
                              title="Edit Game"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            {/* Delete Action */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(game)}
                              className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                              title="Delete Game"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-surface-700/60 bg-surface-900/40 text-xs text-gray-400">
              <div>
                Page <strong className="text-white">{meta.current_page}</strong> of{' '}
                <strong className="text-white">{meta.last_page}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={meta.current_page <= 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - meta.current_page) <= 2 || p === 1 || p === meta.last_page)
                    .map((p, idx, arr) => {
                      const prev = arr[idx - 1]
                      const showEllipsis = prev && p - prev > 1

                      return (
                        <div key={p} className="flex items-center">
                          {showEllipsis && <span className="px-1 text-gray-600">...</span>}
                          <button
                            type="button"
                            onClick={() => setCurrentPage(p)}
                            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                              meta.current_page === p
                                ? 'bg-primary-600 text-white'
                                : 'bg-surface-800 border border-surface-700 text-gray-300 hover:text-white'
                            }`}
                          >
                            {p}
                          </button>
                        </div>
                      )
                    })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={meta.current_page >= meta.last_page}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      {!isLoading && !fetchError && (
        <div className="md:hidden space-y-3">
          {games.length === 0 ? (
            <div className="p-8 rounded-2xl bg-surface-850 border border-surface-700 text-center text-gray-400">
              <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <p className="font-semibold text-white">No games found</p>
            </div>
          ) : (
            games.map((game) => {
              const isDraft = game.status?.toLowerCase() === 'draft'
              const coverImg =
                game.cover_image ||
                game.image ||
                'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'

              return (
                <div
                  key={game.id}
                  className="p-4 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={coverImg}
                        alt={game.title}
                        className="w-12 h-12 rounded-xl object-cover border border-surface-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{game.title}</h4>
                        <p className="text-xs text-gray-400 truncate">
                          {game.developer} • {game.categories?.[0]?.name || 'Catalog'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                        isDraft
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      }`}
                    >
                      {isDraft ? 'Draft' : 'Published'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-surface-750 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Type</span>
                      <span className="font-medium text-gray-200">
                        {formatTypeLabel(game.game_type || game.license)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Version</span>
                      <span className="font-mono text-gray-200">{game.version || 'v1.0'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Downloads</span>
                      <span className="font-medium text-gray-200">
                        {(game.download_count ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {!isDraft && (
                      <Link
                        to={`/game/${game.slug}`}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-surface-800 border border-surface-700 text-xs font-semibold text-gray-300 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </Link>
                    )}
                    <Link
                      to={`/admin/games/${game.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary-600/20 border border-primary-500/30 text-xs font-semibold text-primary-300 hover:bg-primary-600/30"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(game)}
                      className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-400 hover:bg-rose-900/50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}

          {/* Mobile pagination */}
          {meta.last_page > 1 && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-850 border border-surface-700 text-xs">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page <= 1}
                className="px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-gray-300 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-gray-400">
                {meta.current_page} / {meta.last_page}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page >= meta.last_page}
                className="px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-700 text-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Game from MySQL Database?"
        itemName={deleteTarget?.title}
        message="This action will permanently delete this game, its category relations, screenshots, and system requirements from MySQL."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
