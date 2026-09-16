import api from './api'
import { normalizeGame } from '../utils/gameNormalizer'
import { genres as defaultGenresMeta } from '../data/genres'

// Fast lookup dictionary for category icons & colors
const genreMetaMap = defaultGenresMeta.reduce((acc, g) => {
  acc[g.slug.toLowerCase()] = {
    icon: g.icon,
    color: g.color,
  }
  return acc
}, {})

/**
 * Fetch list of published games from Laravel REST API with filters, sort, search, and pagination.
 * @param {Object} params - { search, category, type, sort, page, per_page, featured }
 * @param {Object} [options] - Axios request options (e.g. { signal })
 * @returns {Promise<{ games: Array, meta: Object }>}
 */
export async function getGames(params = {}, options = {}) {
  const queryParams = {}

  if (params.search && params.search.trim()) {
    queryParams.search = params.search.trim()
  }

  if (params.category && params.category !== 'all' && params.category !== 'All') {
    queryParams.category = params.category.toLowerCase().trim()
  }

  if (params.type && params.type !== 'all' && params.type !== 'All') {
    // Convert e.g. "Free-to-Play" or "Open Source" to backend slug "free-to-play", "open-source"
    const formattedType = params.type.toLowerCase().replace(/\s+/g, '-')
    queryParams.type = formattedType
  }

  if (params.sort && params.sort !== 'popular') {
    // Map frontend sort values if needed (e.g. "title-asc" -> "az")
    queryParams.sort = params.sort === 'title-asc' ? 'az' : params.sort
  }

  if (params.page && Number(params.page) > 1) {
    queryParams.page = Number(params.page)
  }

  if (params.per_page) {
    queryParams.per_page = Number(params.per_page)
  }

  if (params.featured !== undefined) {
    queryParams.featured = params.featured
  }

  const response = await api.get('/games', {
    params: queryParams,
    ...options,
  })

  const rawData = response.data?.data || []
  const meta = response.data?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: rawData.length,
    total: rawData.length,
    has_more_pages: false,
  }

  const games = rawData.map(normalizeGame).filter(Boolean)

  return {
    games,
    meta,
  }
}

/**
 * Fetch single published game detail by its slug.
 * @param {string} slug
 * @param {Object} [options] - Axios options ({ signal })
 * @returns {Promise<Object>} normalized game object
 */
export async function getGameBySlug(slug, options = {}) {
  if (!slug) throw new Error('Game slug is required')

  const response = await api.get(`/games/${encodeURIComponent(slug)}`, options)
  const rawGame = response.data?.data

  if (!rawGame) {
    throw new Error('Game data not found in response')
  }

  return normalizeGame(rawGame)
}

/**
 * Fetch similar published games for a given game slug.
 * @param {string} slug
 * @param {Object} [options]
 * @returns {Promise<Array>} list of normalized games
 */
export async function getSimilarGames(slug, options = {}) {
  if (!slug) return []

  const response = await api.get(`/games/${encodeURIComponent(slug)}/similar`, options)
  const rawData = response.data?.data || []

  return rawData.map(normalizeGame).filter(Boolean)
}

/**
 * Fetch all categories with published game count.
 * Enriches each category with UI icon and color themes.
 * @param {Object} [options]
 * @returns {Promise<Array>}
 */
export async function getCategories(options = {}) {
  const response = await api.get('/categories', options)
  const rawCategories = response.data?.data || []

  return rawCategories.map((cat) => {
    const meta = genreMetaMap[cat.slug.toLowerCase()] || {
      icon: 'Gamepad2',
      color: 'from-indigo-500 to-purple-600',
    }

    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      gameCount: cat.games_count || 0,
      games_count: cat.games_count || 0,
      icon: meta.icon,
      color: meta.color,
    }
  })
}

/**
 * Fetch single category by slug.
 * @param {string} slug
 * @param {Object} [options]
 * @returns {Promise<Object>}
 */
export async function getCategoryBySlug(slug, options = {}) {
  const response = await api.get(`/categories/${encodeURIComponent(slug)}`, options)
  const cat = response.data?.data

  if (!cat) throw new Error('Category not found')

  const meta = genreMetaMap[cat.slug.toLowerCase()] || {
    icon: 'Gamepad2',
    color: 'from-indigo-500 to-purple-600',
  }

  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    gameCount: cat.games_count || 0,
    games_count: cat.games_count || 0,
    icon: meta.icon,
    color: meta.color,
  }
}
