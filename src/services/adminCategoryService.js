import api from './api'

/**
 * Fetch all categories with total assigned games count.
 */
export async function getAdminCategories() {
  const response = await api.get('/admin/categories')
  return response.data
}

/**
 * Fetch a single category by ID or slug.
 */
export async function getAdminCategory(id) {
  const response = await api.get(`/admin/categories/${id}`)
  return response.data
}

/**
 * Create a new category in MySQL.
 */
export async function createAdminCategory(categoryData) {
  const response = await api.post('/admin/categories', categoryData)
  return response.data
}

/**
 * Update an existing category in MySQL.
 */
export async function updateAdminCategory(id, categoryData) {
  const response = await api.put(`/admin/categories/${id}`, categoryData)
  return response.data
}

/**
 * Safely delete an unused category.
 */
export async function deleteAdminCategory(id) {
  const response = await api.delete(`/admin/categories/${id}`)
  return response.data
}

export default {
  getAdminCategories,
  getAdminCategory,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
}
