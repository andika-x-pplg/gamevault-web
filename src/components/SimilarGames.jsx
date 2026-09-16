import { Gamepad2 } from 'lucide-react'
import { getSimilarGames } from '../data/games'
import GameCard from './GameCard'

export default function SimilarGames({ currentSlug, genre }) {
  const similar = getSimilarGames(currentSlug, genre || 'Action', 4)

  if (!similar || similar.length === 0) return null

  return (
    <section className="space-y-4 pt-6 border-t border-slate-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Gamepad2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Similar Games</h2>
            <p className="text-xs text-slate-400">Rekomendasi game PC gratis lainnya yang serupa</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {similar.map((game) => (
          <GameCard key={game.id} game={game} variant="standard" />
        ))}
      </div>
    </section>
  )
}
