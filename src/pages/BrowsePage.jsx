import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Calendar,
  Layers,
  RotateCcw,
  SearchX,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { games } from '../data/games'
import GameCard from '../components/GameCard'

const GENRES = [
  'All',
  'Action',
  'Adventure',
  'RPG',
  'Racing',
  'Strategy',
  'Simulation',
  'Sports',
  'Indie',
  'Horror',
  'Multiplayer',
]

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'downloads', label: 'Most Downloaded' },
  { id: 'newest', label: 'Newest' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'title-asc', label: 'A-Z' },
]

const YEAR_OPTIONS = [
  { id: 'all', label: 'All Years' },
  { id: '2026', label: '2026' },
  { id: '2025', label: '2025' },
  { id: '2024', label: '2024' },
  { id: 'older', label: 'Older' },
]

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Types' },
  { id: 'Free-to-Play', label: 'Free-to-Play' },
  { id: 'Freeware', label: 'Freeware' },
  { id: 'Open Source', label: 'Open Source' },
  { id: 'Demo', label: 'Demo' },
]

const INITIAL_PAGE_SIZE = 8
const LOAD_MORE_STEP = 8

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read state directly from URL Query Parameters (Single Source of Truth)
  const genreParam = searchParams.get('genre') || 'All'
  const selectedGenre =
    GENRES.find((g) => g.toLowerCase() === genreParam.toLowerCase()) || 'All'

  const searchQuery = searchParams.get('search') || ''
  const sortBy = searchParams.get('sort') || (searchParams.get('filter') === 'trending' ? 'popular' : 'popular')
  const selectedYear = searchParams.get('year') || 'all'
  const selectedType = searchParams.get('type') || 'all'

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGE_SIZE)

  // Update URL parameters dynamically without full reload
  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams)

    // Remove legacy 'filter' if explicit sort or other params are set
    if (params.has('filter')) {
      params.delete('filter')
    }

    Object.entries(updates).forEach(([key, val]) => {
      if (val && val !== 'All' && val !== 'all' && val !== 'popular') {
        params.set(key, val)
      } else {
        params.delete(key)
      }
    })

    setSearchParams(params, { replace: true })
    setVisibleCount(INITIAL_PAGE_SIZE)
  }

  const handleGenreChange = (genre) => {
    updateParams({ genre })
  }

  const handleSearchChange = (e) => {
    updateParams({ search: e.target.value })
  }

  const handleClearSearch = () => {
    updateParams({ search: '' })
  }

  const handleYearChange = (e) => {
    updateParams({ year: e.target.value })
  }

  const handleTypeChange = (e) => {
    updateParams({ type: e.target.value })
  }

  const handleSortChange = (e) => {
    updateParams({ sort: e.target.value })
  }

  const handleResetFilters = () => {
    setSearchParams({}, { replace: true })
    setVisibleCount(INITIAL_PAGE_SIZE)
  }

  // Filter and sort pipeline with useMemo
  const filteredAndSortedGames = useMemo(() => {
    let result = [...games]

    // 1. Search filter (title, genre, developer, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.genre.toLowerCase().includes(query) ||
          (g.developer && g.developer.toLowerCase().includes(query)) ||
          (g.genres && g.genres.some((genreItem) => genreItem.toLowerCase().includes(query))) ||
          g.description.toLowerCase().includes(query),
      )
    }

    // 2. Genre filter
    if (selectedGenre !== 'All') {
      result = result.filter(
        (g) =>
          g.genre.toLowerCase() === selectedGenre.toLowerCase() ||
          (g.genres &&
            g.genres.some((genreItem) => genreItem.toLowerCase() === selectedGenre.toLowerCase())),
      )
    }

    // 3. Release Year filter
    if (selectedYear !== 'all') {
      if (selectedYear === 'older') {
        result = result.filter((g) => {
          const year = parseInt(g.releaseDate.split('-')[0], 10)
          return year < 2024
        })
      } else {
        result = result.filter((g) => g.releaseDate.startsWith(selectedYear))
      }
    }

    // 4. Game Type / License filter
    if (selectedType !== 'all') {
      result = result.filter(
        (g) => g.license.toLowerCase() === selectedType.toLowerCase(),
      )
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return (b.downloadCount || 0) - (a.downloadCount || 0)
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case 'rating':
          return b.rating - a.rating
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'popular':
        default:
          return (b.downloadCount || 0) * (b.rating || 1) - (a.downloadCount || 0) * (a.rating || 1)
      }
    })

    return result
  }, [searchQuery, selectedGenre, selectedYear, selectedType, sortBy])

  // Games currently visible on page
  const visibleGames = filteredAndSortedGames.slice(0, visibleCount)
  const hasMore = visibleCount < filteredAndSortedGames.length

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_STEP)
  }

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedGenre !== 'All' ||
    selectedYear !== 'all' ||
    selectedType !== 'all' ||
    sortBy !== 'popular'

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
                placeholder="Cari berdasarkan judul, genre, atau developer..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#0B0E14]/90 border border-slate-700/80 focus:border-indigo-500 rounded-2xl pl-12 pr-11 py-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-inner"
              />
              {searchQuery && (
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
          {selectedGenre !== 'All' && (
            <button
              type="button"
              onClick={() => handleGenreChange('All')}
              className="text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              Reset Genre
            </button>
          )}
        </div>

        {/* Scrollable / Wrap Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar flex-nowrap sm:flex-wrap">
          {GENRES.map((genre) => {
            const isSelected = selectedGenre.toLowerCase() === genre.toLowerCase()
            return (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreChange(genre)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/50 scale-102'
                    : 'bg-[#111726] hover:bg-[#161F33] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {genre}
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. Toolbar: Additional Filters (Year, Type) + Sorting Dropdown + Reset */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#111726]/80 border border-slate-800/90 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mr-1">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Filter:</span>
            </div>

            {/* Game Type Filter */}
            <div className="relative min-w-[130px]">
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

            {/* Release Year Filter */}
            <div className="relative min-w-[120px]">
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full appearance-none bg-[#0B0E14] border border-slate-800 hover:border-slate-700 focus:border-indigo-500 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-slate-200 focus:outline-none transition-colors cursor-pointer"
                aria-label="Filter Release Year"
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.label}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
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
            {filteredAndSortedGames.length}{' '}
            {filteredAndSortedGames.length === 1 ? 'Game Found' : 'Games Found'}
          </span>
          {searchQuery && (
            <span className="text-xs font-normal text-slate-400">
              for &ldquo;<strong className="text-indigo-300">{searchQuery}</strong>&rdquo;
            </span>
          )}
          {selectedGenre !== 'All' && (
            <span className="text-xs font-normal text-slate-400">
              in <strong className="text-indigo-300">{selectedGenre}</strong>
            </span>
          )}
        </div>

        {/* Display count info */}
        {filteredAndSortedGames.length > 0 && (
          <span className="text-xs text-slate-400">
            Showing {Math.min(visibleCount, filteredAndSortedGames.length)} of{' '}
            {filteredAndSortedGames.length} games
          </span>
        )}
      </section>

      {/* 5. Game Grid or Empty State */}
      {filteredAndSortedGames.length === 0 ? (
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
        /* Game Grid */
        <section className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {visibleGames.map((game) => (
              <GameCard key={game.id} game={game} variant="browse" />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore ? (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-[#161F33] hover:bg-[#1E2942] text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer"
              >
                <span>Load More Games</span>
                <span className="text-xs text-indigo-400">
                  (+{Math.min(LOAD_MORE_STEP, filteredAndSortedGames.length - visibleCount)})
                </span>
              </button>
            </div>
          ) : filteredAndSortedGames.length > INITIAL_PAGE_SIZE ? (
            <div className="text-center pt-4 text-xs text-slate-500">
              Semua {filteredAndSortedGames.length} game telah ditampilkan
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}
