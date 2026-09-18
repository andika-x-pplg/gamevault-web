import api from './api'
import { normalizeGame } from '../utils/gameNormalizer'

/**
 * Fetch authenticated user's wishlist games from Laravel REST API.
 * @returns {Promise<Array>} List of normalized games in the user's wishlist
 */
export async function getWishlist() {
  const response = await api.get('/wishlist')
  const rawData = response.data?.data || []
  return rawData.map(normalizeGame).filter(Boolean)
}

/**
 * Add a game to the authenticated user's wishlist.
 * @param {string|number} gameIdentifier - Game slug or id
 * @returns {Promise<Object>} API response data with added game
 */
export async function addToWishlist(gameIdentifier) {
  if (!gameIdentifier) throw new Error('Game identifier is required')
  const response = await api.post(`/wishlist/${encodeURIComponent(gameIdentifier)}`)
  return response.data
}

/**
 * Remove a game from the authenticated user's wishlist.
 * @param {string|number} gameIdentifier - Game slug or id
 * @returns {Promise<Object>} API response message
 */
export async function removeFromWishlist(gameIdentifier) {
  if (!gameIdentifier) throw new Error('Game identifier is required')
  const response = await api.delete(`/wishlist/${encodeURIComponent(gameIdentifier)}`)
  return response.data
}
