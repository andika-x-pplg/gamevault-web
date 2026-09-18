import api from './api'
import { normalizeGame } from '../utils/gameNormalizer'

/**
 * Fetch authenticated user's library games from Laravel REST API.
 * @returns {Promise<Array>} List of normalized games in the user's library
 */
export async function getLibrary() {
  const response = await api.get('/library')
  const rawData = response.data?.data || []
  return rawData.map(normalizeGame).filter(Boolean)
}

/**
 * Add a game to the authenticated user's library.
 * @param {string|number} gameIdentifier - Game slug or id
 * @returns {Promise<Object>} API response data with added game
 */
export async function addToLibrary(gameIdentifier) {
  if (!gameIdentifier) throw new Error('Game identifier is required')
  const response = await api.post(`/library/${encodeURIComponent(gameIdentifier)}`)
  return response.data
}

/**
 * Remove a game from the authenticated user's library.
 * @param {string|number} gameIdentifier - Game slug or id
 * @returns {Promise<Object>} API response message
 */
export async function removeFromLibrary(gameIdentifier) {
  if (!gameIdentifier) throw new Error('Game identifier is required')
  const response = await api.delete(`/library/${encodeURIComponent(gameIdentifier)}`)
  return response.data
}
