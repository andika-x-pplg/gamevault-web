import api from './api'

/**
 * Fetch paginated games list for Admin management (includes Drafts & Published).
 * Supports filters: search, category, type, status, sort, page, per_page.
 */
export async function getAdminGames(params = {}) {
  const response = await api.get('/admin/games', { params })
  return response.data
}

/**
 * Fetch a single game by ID or slug for Admin form prefill or details.
 */
export async function getAdminGame(id) {
  const response = await api.get(`/admin/games/${id}`)
  return response.data
}

/**
 * Create a new game in MySQL with atomic relationships.
 */
export async function createAdminGame(gameData) {
  const response = await api.post('/admin/games', gameData)
  return response.data
}

/**
 * Update an existing game in MySQL.
 */
export async function updateAdminGame(id, gameData) {
  const response = await api.put(`/admin/games/${id}`, gameData)
  return response.data
}

/**
 * Delete a game from MySQL catalog.
 */
export async function deleteAdminGame(id) {
  const response = await api.delete(`/admin/games/${id}`)
  return response.data
}

/**
 * Fetch live aggregated statistics for Admin Dashboard.
 */
export async function getAdminDashboardStats() {
  const response = await api.get('/admin/dashboard')
  return response.data
}

export default {
  getAdminGames,
  getAdminGame,
  createAdminGame,
  updateAdminGame,
  deleteAdminGame,
  getAdminDashboardStats,
}
