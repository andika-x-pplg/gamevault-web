import { Flame, Download, Compass, Sparkles } from 'lucide-react'
import HeroSection from '../components/HeroSection'
import SectionHeader from '../components/SectionHeader'
import GameCard from '../components/GameCard'
import GenreCard from '../components/GenreCard'
import CTASection from '../components/CTASection'
import {
  getFeaturedGames,
  getTrendingGames,
  getPopularGames,
  getNewReleases,
} from '../data/games'
import { genres } from '../data/genres'

export default function HomePage() {
  const featuredGames = getFeaturedGames()
  const trendingGames = getTrendingGames().slice(0, 4)
  const popularGames = getPopularGames().slice(0, 4)
  const newReleases = getNewReleases().slice(0, 4)

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
          badgeText="Eksplorasi Kategori"
          title="Browse by Genre"
          subtitle="Pilih game berdasarkan gaya bermain, mulai dari Action seru hingga simulasi mendalam."
          viewAllLink="/browse"
          viewAllText="Semua Kategori"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} />
          ))}
        </div>
      </section>

      {/* 5. New Releases Section */}
      <section>
        <SectionHeader
          icon={Sparkles}
          badgeText="Baru Ditambahkan"
          title="New Releases"
          subtitle="Game legal dan versi update terbaru yang baru saja mendarat di GameVault."
          viewAllLink="/browse?sort=newest"
          viewAllText="View All"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newReleases.map((game) => (
            <GameCard key={game.id} game={game} variant="new" />
          ))}
        </div>
      </section>

      {/* 6. CTA Section */}
      <CTASection />
    </div>
  )
}
