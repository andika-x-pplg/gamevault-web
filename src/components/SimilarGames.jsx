import { useState, useEffect } from 'react'
import { Gamepad2 } from 'lucide-react'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'
import { getSimilarGames } from '../services/gameService'

export default function SimilarGames({ currentSlug }) {
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentSlug) return

    let isMounted = true

    getSimilarGames(currentSlug)
      .then((games) => {
        if (isMounted) {
          setSimilar(games)
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Failed to load similar games:', err)
        if (isMounted) {
          setSimilar([])
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [currentSlug])

  if (!loading && (!similar || similar.length === 0)) return null

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
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <GameCardSkeleton key={idx} />)
          : similar.map((game) => (
              <GameCard key={game.id} game={game} variant="standard" />
            ))}
      </div>
    </section>
  )
}
