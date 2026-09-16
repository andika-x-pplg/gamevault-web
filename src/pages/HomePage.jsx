import { useMemo } from 'react'
import { Flame, Download, Compass, Sparkles } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/SectionHeader'
import GameCard from '../components/GameCard'
import GenreCard from '../components/GenreCard'
import CTASection from '../components/CTASection'
import { useGame } from '../context/useGame'
import { genres } from '../data/genres'

export default function HomePage() {
  const { publishedGames } = useGame()

  const featuredGames = useMemo(() => {
    const list = publishedGames.filter((g) => g.featured)
    return list.length > 0 ? list : publishedGames.slice(0, 3)
  }, [publishedGames])

  const trendingGames = useMemo(() => {
    const list = publishedGames.filter((g) => g.trending)
    return (list.length > 0 ? list : publishedGames).slice(0, 4)
  }, [publishedGames])

  const popularGames = useMemo(() => {
    return [...publishedGames]
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 4)
  }, [publishedGames])

  const newReleases = useMemo(() => {
    return [...publishedGames]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 4)
  }, [publishedGames])

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section / Featured Games Carousel */}
      <HeroSection featuredGames={featuredGames} />

      {/* 2. Trending Games Section */}
      <section>
        <SectionHeader
          icon={Flame}
          badgeText="Hot & Popular"
          title="Trending Games"
          subtitle="Game legal dan gratis yang paling banyak dimainkan minggu ini oleh komunitas."
          viewAllLink="/browse?filter=trending"
          viewAllText="Lihat Semua Trending"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingGames.map((game) => (
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
          {popularGames.map((game) => (
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
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
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
          {newReleases.map((game) => (
            <GameCard key={game.id} game={game} variant="compact" />
          ))}
        </div>
      </section>

      {/* 6. Call to Action (CTA) Section */}
      <CTASection />
    </div>
  )
}
