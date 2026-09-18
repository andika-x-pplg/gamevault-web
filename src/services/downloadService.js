import api from './api'

/**
 * Initiate and track a game download (Direct or External Official Source).
 * @param {string|number} gameIdentifier - Game slug or ID
 * @returns {Promise<{ type: 'direct'|'external', url: string, provider?: string, download_count: number }>}
 */
export async function initiateDownload(gameIdentifier) {
  if (!gameIdentifier) throw new Error('Game identifier is required')

  const response = await api.post(`/games/${encodeURIComponent(gameIdentifier)}/download`)
  return response.data?.data
}

/**
 * Fetch download and distribution statistics for Admin Analytics.
 * @returns {Promise<Object>} Aggregated analytics data
 */
export async function getAdminDownloadStats() {
  const response = await api.get('/admin/downloads/stats')
  return response.data?.data
}

/**
 * Fetch authenticated user's download history.
 * @returns {Promise<Array>} List of user download history records
 */
export async function getUserDownloadHistory() {
  const response = await api.get('/downloads')
  return response.data?.data || []
}
