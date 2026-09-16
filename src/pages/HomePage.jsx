import { useState, useEffect } from 'react'
import { Flame, Download, Compass, Sparkles } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/SectionHeader'
import GameCard from '../components/GameCard'
import GenreCard from '../components/GenreCard'
import CTASection from '../components/CTASection'
import HeroSkeleton from '../components/HeroSkeleton'
import GameCardSkeleton from '../components/GameCardSkeleton'
import ErrorState from '../components/ErrorState'
import { getGames, getCategories } from '../services/gameService'

export default function HomePage() {
  const [featuredGames, setFeaturedGames] = useState([])
  const [trendingGames, setTrendingGames] = useState([])
  const [popularGames, setPopularGames] = useState([])
  const [newReleases, setNewReleases] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryTrigger, setRetryTrigger] = useState(0)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      getGames({ featured: true, per_page: 5 }),
      getGames({ sort: 'popular', per_page: 4 }),
      getGames({ sort: 'downloads', per_page: 4 }),
      getGames({ sort: 'newest', per_page: 4 }),
      getCategories(),
    ])
      .then(([featuredRes, trendingRes, popularRes, newReleasesRes, categoriesRes]) => {
        if (!isMounted) return
        const featuredList =
          featuredRes.games.length > 0 ? featuredRes.games : trendingRes.games.slice(0, 3)

        setFeaturedGames(featuredList)
        setTrendingGames(trendingRes.games)
        setPopularGames(popularRes.games)
        setNewReleases(newReleasesRes.games)
        setCategories(categoriesRes)
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        console.error('Failed to load home page data from API:', err)
        setError('Tidak dapat memuat data game dari server. Silakan periksa koneksi backend Anda.')
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [retryTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRetryTrigger((prev) => prev + 1)
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Gagal Memuat Katalog Home"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section / Featured Games Carousel */}
      {loading ? (
        <HeroSkeleton />
      ) : (
        <HeroSection featuredGames={featuredGames} />
      )}

      {/* 2. Trending Games Section */}
      <section>
        <SectionHeader
          icon={Flame}
          badgeText="Hot & Popular"
          title="Trending Games"
          subtitle="Game legal dan gratis yang paling banyak dimainkan minggu ini oleh komunitas."
          viewAllLink="/browse?sort=popular"
          viewAllText="Lihat Semua Trending"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <GameCardSkeleton key={idx} />)
            : trendingGames.map((game) => (
                <GameCard key={game.id} game={game} variant="standard" />
              ))}
        </div>
      </section>

      {/* 3. Popular Downloads Section */}
      <section>
        <SectionHeader
          icon={Download}
          badgeText="Top Community Choice"
          title="Popular Downloads"
          subtitle="Koleksi game gratis terfavorit dengan total unduhan jutaan instalasi."
          viewAllLink="/browse?sort=downloads"
          viewAllText="Lihat Terpopuler"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <GameCardSkeleton key={idx} />)
            : popularGames.map((game) => (
                <GameCard key={game.id} game={game} variant="popular" />
              ))}
        </div>
      </section>

      {/* 4. Browse by Genre Section */}
      <section>
        <SectionHeader
          icon={Compass}
          badgeText="Kategori Populer"
          title="Browse by Genre"
          subtitle="Eksplorasi game berdasarkan genre favoritmu dari berbagai developer legal."
          viewAllLink="/browse"
          viewAllText="Lihat Semua Kategori"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-36 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse p-4"
                />
              ))
            : categories.map((cat) => (
                <GenreCard key={cat.id} genre={cat} />
              ))}
        </div>
      </section>

      {/* 5. New Releases Section */}
      <section>
        <SectionHeader
          icon={Sparkles}
          badgeText="Fresh Drops"
          title="New Releases"
          subtitle="Game legal dan gratis terbaru yang baru saja ditambahkan ke platform GameVault."
          viewAllLink="/browse?sort=newest"
          viewAllText="Lihat Game Terbaru"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => <GameCardSkeleton key={idx} />)
            : newReleases.map((game) => (
                <GameCard key={game.id} game={game} variant="compact" />
              ))}
        </div>
      </section>

      {/* 6. Call to Action (CTA) Section */}
      <CTASection />
    </div>
  )
}
