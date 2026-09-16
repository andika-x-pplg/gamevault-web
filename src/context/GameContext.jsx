import { useState, useEffect, useMemo, useCallback } from 'react'
import { GameContext } from './gameContextInstance'
import { games as initialGamesData } from '../data/games'

const GAMES_STORAGE_KEY = 'gamevault_games'
const CATEGORIES_STORAGE_KEY = 'gamevault_categories'

const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Action', slug: 'action', description: 'Fast-paced combat and reflex challenges' },
  { id: 'cat-2', name: 'Adventure', slug: 'adventure', description: 'Rich storyline and exploration quests' },
  { id: 'cat-3', name: 'RPG', slug: 'rpg', description: 'Character progression and deep roleplaying' },
  { id: 'cat-4', name: 'Racing', slug: 'racing', description: 'High-speed track and circuit competitions' },
  { id: 'cat-5', name: 'Strategy', slug: 'strategy', description: 'Tactical planning, RTS, and turn-based games' },
  { id: 'cat-6', name: 'Simulation', slug: 'simulation', description: 'Realistic vehicle, flight, and world simulation' },
  { id: 'cat-7', name: 'Sports', slug: 'sports', description: 'Competitive athletics and team tournaments' },
  { id: 'cat-8', name: 'Indie', slug: 'indie', description: 'Creative masterworks from independent studios' },
  { id: 'cat-9', name: 'Horror', slug: 'horror', description: 'Psychological thriller and survival frights' },
  { id: 'cat-10', name: 'Multiplayer', slug: 'multiplayer', description: 'Online co-op and competitive gaming' },
]

export function GameProvider({ children }) {
  // Initialize games from localStorage or default dataset
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(GAMES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // Fallback
    }
    // Ensure all seed games have status: 'Published'
    return initialGamesData.map((g) => ({
      ...g,
      status: g.status || 'Published',
      officialSource: g.officialSource || {
        name: `${g.title} Official Portal`,
        url: 'https://github.com',
      },
    }))
  })

  // Initialize categories from localStorage or default
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CATEGORIES
  })

  // Synchronize games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(games))
    } catch {
      // Ignore quota errors
    }
  }, [games])

  // Synchronize categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    } catch {
      // Ignore quota errors
    }
  }, [categories])

  // Helper for public pages: only games that are published
  const publishedGames = useMemo(() => {
    return games.filter((g) => g.status !== 'Draft')
  }, [games])

  // Get game by slug
  const getGameBySlug = useCallback(
    (slug, includeDraft = false) => {
      const targetList = includeDraft ? games : publishedGames
      return targetList.find((g) => g.slug === slug) || null
    },
    [games, publishedGames]
  )

  // Get game by ID
  const getGameById = useCallback(
    (id) => {
      return games.find((g) => String(g.id) === String(id)) || null
    },
    [games]
  )

  /**
   * Create a new game
   */
  const createGame = useCallback((gameData) => {
    const newId = Date.now()
    const newGame = {
      ...gameData,
      id: newId,
      status: gameData.status || 'Published',
      rating: gameData.rating || 4.5,
      downloads: gameData.downloads || '0',
      downloadCount: gameData.downloadCount || 0,
      createdAt: new Date().toISOString(),
    }

    setGames((prev) => [newGame, ...prev])
    return newGame
  }, [])

  /**
   * Update an existing game
   */
  const updateGame = useCallback((id, updatedData) => {
    setGames((prev) =>
      prev.map((item) => {
        if (String(item.id) === String(id)) {
          return {
            ...item,
            ...updatedData,
            id: item.id, // preserve immutable ID
            lastUpdated: new Date().toISOString().split('T')[0],
          }
        }
        return item
      })
    )
  }, [])

  /**
   * Delete a game
   */
  const deleteGame = useCallback((id) => {
    setGames((prev) => prev.filter((item) => String(item.id) !== String(id)))
  }, [])

  /**
   * Categories management
   */
  const addCategory = useCallback((categoryData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: categoryData.name.trim(),
      slug: categoryData.slug.trim().toLowerCase(),
      description: categoryData.description?.trim() || '',
    }
    setCategories((prev) => [...prev, newCategory])
    return newCategory
  }, [])

  const updateCategory = useCallback((id, updatedData) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedData } : cat))
    )
  }, [])

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }, [])

  return (
    <GameContext.Provider
      value={{
        games,
        publishedGames,
        categories,
        getGameBySlug,
        getGameById,
        createGame,
        updateGame,
        deleteGame,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}
