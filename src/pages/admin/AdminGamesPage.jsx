import { useState, useMemo } from 'react'
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
} from 'lucide-react'
import { useGame } from '../../context/useGame'
import { useToast } from '../../context/useToast'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const GAME_TYPES = ['All', 'Free-to-Play', 'Freeware', 'Open Source', 'Demo']
const STATUS_OPTIONS = ['All', 'Published', 'Draft']
const SORT_OPTIONS = [
  { label: 'Newest Added', value: 'newest' },
  { label: 'Oldest Added', value: 'oldest' },
  { label: 'Most Downloaded', value: 'downloads' },
  { label: 'Title (A-Z)', value: 'title-asc' },
  { label: 'Title (Z-A)', value: 'title-desc' },
]

export default function AdminGamesPage() {
  const { games, categories, deleteGame } = useGame()
  const { success } = useToast()

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [selectedSort, setSelectedSort] = useState('newest')

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter & sort computation
  const filteredGames = useMemo(() => {
    let result = [...games]

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.developer?.toLowerCase().includes(q) ||
          g.slug?.toLowerCase().includes(q)
      )
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      result = result.filter(
        (g) =>
          g.genre === selectedGenre ||
          (Array.isArray(g.genres) && g.genres.includes(selectedGenre))
      )
    }

    // Game type / license filter
    if (selectedType !== 'All') {
      result = result.filter((g) => g.license === selectedType)
    }

    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((g) => (g.status || 'Published') === selectedStatus)
    }

    // Sorting
    result.sort((a, b) => {
      if (selectedSort === 'newest') return (b.id || 0) - (a.id || 0)
      if (selectedSort === 'oldest') return (a.id || 0) - (b.id || 0)
      if (selectedSort === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0)
      if (selectedSort === 'title-asc') return (a.title || '').localeCompare(b.title || '')
      if (selectedSort === 'title-desc') return (b.title || '').localeCompare(a.title || '')
      return 0
    })

    return result
  }, [games, searchQuery, selectedGenre, selectedType, selectedStatus, selectedSort])

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    setTimeout(() => {
      deleteGame(deleteTarget.id)
      setIsDeleting(false)
      const deletedName = deleteTarget.title
      setDeleteTarget(null)
      success(`Game "${deletedName}" was removed from catalog.`)
    }, 200)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedGenre('All')
    setSelectedType('All')
    setSelectedStatus('All')
    setSelectedSort('newest')
  }

  const hasActiveFilters =
    searchQuery ||
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
            Manage mock PC games, configure release statuses, and maintain game metadata.
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
              placeholder="Search by title or developer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
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
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              <option value="All">All Genres</option>
              {categories.map((c) => (
                <option key={c.id || c.slug} value={c.name}>
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
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              {GAME_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === 'All' ? 'All Game Types' : type}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status select */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status === 'All' ? 'All Status' : status}
                </option>
              ))}
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort and Active filter info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-700/40 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white font-semibold">{filteredGames.length}</strong> of {games.length} games</span>
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
              onChange={(e) => setSelectedSort(e.target.value)}
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

      {/* Main Table for Desktop */}
      <div className="hidden md:block rounded-2xl bg-surface-850 border border-surface-700/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-700/60 bg-surface-900/60 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-4">Game</th>
                <th className="py-3.5 px-4">Genre</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Version</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Downloads</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/40 text-sm">
              {filteredGames.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-base font-semibold text-gray-300">No games matched your filter</p>
                    <p className="text-xs text-gray-500 mt-1">Try resetting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-surface-800/60 transition-colors">
                    {/* Game column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80'}
                          alt={game.title}
                          className="w-11 h-11 rounded-lg object-cover border border-surface-700 shrink-0"
                        />
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-semibold text-white truncate">{game.title}</p>
                          <p className="text-xs text-gray-400 truncate">{game.developer || 'Indie'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Genre */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-surface-750 text-gray-300 border border-surface-700">
                        {game.genre}
                      </span>
                    </td>

                    {/* Type / License */}
                    <td className="py-3 px-4">
                      <span className="text-xs text-gray-300 font-medium">
                        {game.license || 'Free-to-Play'}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="py-3 px-4 font-mono text-xs text-gray-300">
                      {game.version || 'v1.0.0'}
                    </td>

                    {/* File Size */}
                    <td className="py-3 px-4 text-xs text-gray-300 font-mono">
                      {game.fileSize || 'N/A'}
                    </td>

                    {/* Downloads */}
                    <td className="py-3 px-4 text-xs text-gray-300 font-medium">
                      {game.downloads || '0'}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          game.status === 'Draft'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                        }`}
                      >
                        {game.status || 'Published'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Action */}
                        {game.status !== 'Draft' ? (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filteredGames.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface-850 border border-surface-700 text-center text-gray-400">
            <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="font-semibold text-white">No games found</p>
          </div>
        ) : (
          filteredGames.map((game) => (
            <div
              key={game.id}
              className="p-4 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-12 h-12 rounded-xl object-cover border border-surface-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{game.title}</h4>
                    <p className="text-xs text-gray-400 truncate">{game.developer} • {game.genre}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                    game.status === 'Draft'
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}
                >
                  {game.status || 'Published'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-surface-750 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Type</span>
                  <span className="font-medium text-gray-200">{game.license || 'Free'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Version</span>
                  <span className="font-mono text-gray-200">{game.version || 'v1.0'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Downloads</span>
                  <span className="font-medium text-gray-200">{game.downloads || '0'}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {game.status !== 'Draft' && (
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
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Game from Catalog?"
        itemName={deleteTarget?.title}
        message="This action will remove the game permanently from the current mock catalog and synchronization store."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
