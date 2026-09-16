import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  RotateCcw,
  SearchX,
  ChevronDown,
  Sparkles,
  Loader2,
} from 'lucide-react'
import GameCard from '../components/GameCard'
import GameCardSkeleton from '../components/GameCardSkeleton'
import ErrorState from '../components/ErrorState'
import { getGames, getCategories } from '../services/gameService'

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'downloads', label: 'Most Downloaded' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'title-asc', label: 'A-Z' },
]

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Types' },
  { id: 'Free-to-Play', label: 'Free-to-Play' },
  { id: 'Freeware', label: 'Freeware' },
  { id: 'Open Source', label: 'Open Source' },
  { id: 'Demo', label: 'Demo' },
]

const PAGE_SIZE = 8

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read filters from URL
  const selectedGenre = searchParams.get('genre') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || 'popular'
  const selectedType = searchParams.get('type') || 'all'

  // Local state for debounced search input text
  const [searchInput, setSearchInput] = useState(searchQuery)

  // API Data State
  const [games, setGames] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    has_more_pages: false,
  })

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  // Fetch available categories for filter chips
  useEffect(() => {
    let isMounted = true
    getCategories()
      .then((cats) => {
        if (isMounted) setCategories(cats)
      })
      .catch((err) => {
        console.error('Failed to load categories for browse filters:', err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Helper to update search params
  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams)

    if (params.has('filter')) {
      params.delete('filter')
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val && val !== 'all' && val !== 'All' && val !== 'popular') {
        params.set(key, val)
      } else {
        params.delete(key)
      }
    })

    setSearchParams(params, { replace: true })
  }, [searchParams, setSearchParams])

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        updateParams({ search: searchInput })
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput, searchQuery, updateParams])

  // Fetch Games from API with AbortController to avoid race conditions
  useEffect(() => {
    const controller = new AbortController()

    getGames(
      {
        search: searchQuery,
        category: selectedGenre,
        type: selectedType,
        sort: sortBy,
        page: 1,
        per_page: PAGE_SIZE,
      },
      { signal: controller.signal }
    )
      .then((res) => {
        setGames(res.games)
        setMeta(res.meta)
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') {
          return
        }
        console.error('Failed to load games in BrowsePage:', err)
        setError('Gagal memuat daftar game dari server. Silakan coba kembali.')
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [searchQuery, selectedGenre, selectedType, sortBy, retryTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRetryTrigger((prev) => prev + 1)
  }

  // Load More Next Page
  const handleLoadMore = async () => {
    if (!meta.has_more_pages || loadingMore) return

    setLoadingMore(true)
    const nextPage = (meta.current_page || 1) + 1

    try {
      const res = await getGames({
        search: searchQuery,
        category: selectedGenre,
        type: selectedType,
        sort: sortBy,
        page: nextPage,
        per_page: PAGE_SIZE,
      })

      // Append new unique games
      setGames((prev) => {
        const existingIds = new Set(prev.map((g) => g.id))
        const newUnique = res.games.filter((g) => !existingIds.has(g.id))
        return [...prev, ...newUnique]
      })
      setMeta(res.meta)
    } catch (err) {
      console.error('Failed to load more games:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleGenreChange = (genreSlug) => {
    setLoading(true)
    updateParams({ genre: genreSlug })
  }

  const handleTypeChange = (e) => {
    setLoading(true)
    updateParams({ type: e.target.value })
  }

  const handleSortChange = (e) => {
    setLoading(true)
    updateParams({ sort: e.target.value })
  }

  const handleClearSearch = () => {
    setSearchInput('')
    setLoading(true)
    updateParams({ search: '' })
  }

  const handleResetFilters = () => {
    setSearchInput('')
    setLoading(true)
    setSearchParams({}, { replace: true })
  }

  const isFiltered =
    searchQuery.trim() !== '' ||
    (selectedGenre && selectedGenre.toLowerCase() !== 'all') ||
    (selectedType && selectedType.toLowerCase() !== 'all') ||
    sortBy !== 'popular'

  const selectedCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === selectedGenre.toLowerCase()
  )

  return (
    <div className="space-y-8 py-4">
      {/* 1. Page Header & Hero Search */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#161F33] via-[#0E1524] to-[#0B0E14] p-6 sm:p-10 shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog GameVault</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Browse Games
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Discover free PC games across different genres. Temukan ribuan game open-source, freeware, free-to-play, dan demo resmi 100% legal.
          </p>

          {/* Large Search Bar */}
          <div className="pt-2">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau developer..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  setLoading(true)
                }}
                className="w-full bg-[#0B0E14]/90 border border-slate-700/80 focus:border-indigo-500 rounded-2xl pl-12 pr-11 py-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
                  title="Hapus pencarian"
                  aria-label="Clear Search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Genre Filter Chips Bar */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Filter Genre
          </span>
          {selectedGenre !== 'all' && (
            <button
              type="button"
              onClick={() => handleGenreChange('all')}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              Reset Genre
            </button>
          )}
        </div>

        {/* Scrollable / Wrap Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar flex-nowrap sm:flex-wrap">
          <button
            type="button"
            onClick={() => handleGenreChange('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedGenre.toLowerCase() === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/50 scale-102'
                : 'bg-[#111726] hover:bg-[#161F33] text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            All Genres
          </button>

          {categories.map((cat) => {
            const isSelected = selectedGenre.toLowerCase() === cat.slug.toLowerCase()
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleGenreChange(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/50 scale-102'
                    : 'bg-[#111726] hover:bg-[#161F33] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. Toolbar: Type Filter + Sorting Dropdown + Reset */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#111726]/80 border border-slate-800/90 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mr-1">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Filter:</span>
            </div>

            {/* Game Type Filter */}
            <div className="relative min-w-[140px]">
              <select
                value={selectedType}
                onChange={handleTypeChange}
                className="w-full appearance-none bg-[#0B0E14] border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:outline-none transition-colors cursor-pointer"
                aria-label="Filter Game Type"
              >
                {TYPE_OPTIONS.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Reset Filter Button */}
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
                title="Reset semua filter"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Sort By Dropdown */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              Sort By:
            </span>
            <div className="relative min-w-[160px]">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none bg-[#0B0E14] border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:outline-none transition-colors cursor-pointer"
                aria-label="Sort Games By"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Results Counter Information */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div className="text-sm font-semibold text-white flex items-center gap-2">
          <span>
            {meta.total} {meta.total === 1 ? 'Game Found' : 'Games Found'}
          </span>
          {searchQuery && (
            <span className="text-xs font-normal text-slate-400">
              for &ldquo;<strong className="text-indigo-300">{searchQuery}</strong>&rdquo;
            </span>
          )}
          {selectedCategoryObj && (
            <span className="text-xs font-normal text-slate-400">
              in <strong className="text-indigo-300">{selectedCategoryObj.name}</strong>
            </span>
          )}
        </div>

        {meta.total > 0 && (
          <span className="text-xs text-slate-400">
            Showing {games.length} of {meta.total} games
          </span>
        )}
      </section>

      {/* 5. Error State */}
      {error ? (
        <ErrorState
          title="Gagal Memuat Katalog Game"
          message={error}
          onRetry={handleRetry}
        />
      ) : loading ? (
        /* Loading Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <GameCardSkeleton key={idx} />
          ))}
        </div>
      ) : games.length === 0 ? (
        /* Empty State */
        <section className="py-20 text-center rounded-3xl bg-[#111726]/40 border border-slate-800/80 p-8 space-y-4">
          <div className="inline-flex p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg">
            <SearchX className="w-10 h-10" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-white">No games found</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We couldn&apos;t find games matching your filters. Coba gunakan kata kunci pencarian yang berbeda atau reset filter Anda.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          </div>
        </section>
      ) : (
        /* Game Grid & Load More */
        <section className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {games.map((game) => (
              <GameCard key={game.id} game={game} variant="browse" />
            ))}
          </div>

          {/* Load More Button */}
          {meta.has_more_pages ? (
            <div className="text-center pt-4">
              <button
                type="button"
                disabled={loadingMore}
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#161F33] hover:bg-[#1E2942] disabled:opacity-60 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Loading more games...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Games</span>
                    <span className="text-xs text-indigo-400">
                      (+{Math.min(PAGE_SIZE, meta.total - games.length)})
                    </span>
                  </>
                )}
              </button>
            </div>
          ) : meta.total > PAGE_SIZE ? (
            <div className="text-center pt-4 text-xs text-slate-500">
              Semua {meta.total} game telah ditampilkan
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}
