import { useState, useEffect } from 'react'
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  X,
  FolderPlus,
  Tag,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from '../../services/adminCategoryService'
import { useToast } from '../../context/useToast'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminCategoriesPage() {
  const { success, error: toastError } = useToast()

  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Modal / Form state
  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | null
  const [activeCategory, setActiveCategory] = useState({ name: '', slug: '', description: '' })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch categories from API
  useEffect(() => {
    let isMounted = true

    getAdminCategories()
      .then((response) => {
        if (isMounted) {
          if (response && response.success) {
            setCategories(response.data || [])
            setFetchError(null)
          } else {
            setFetchError(response?.message || 'Failed to fetch categories.')
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setFetchError(err.response?.data?.message || err.message || 'Error loading categories.')
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [refreshKey])

  const openAddModal = () => {
    setActiveCategory({ name: '', slug: '', description: '' })
    setFormErrors({})
    setModalMode('add')
  }

  const openEditModal = (cat) => {
    setActiveCategory({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      games_count: cat.games_count ?? 0,
    })
    setFormErrors({})
    setModalMode('edit')
  }

  const handleNameChange = (e) => {
    const val = e.target.value
    setActiveCategory((prev) => ({
      ...prev,
      name: val,
      slug: modalMode === 'add' ? generateSlug(val) : prev.slug,
    }))
    if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: null }))
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()
    const errors = {}
    if (!activeCategory.name.trim()) errors.name = 'Category name is required.'
    if (!activeCategory.slug.trim()) errors.slug = 'Slug is required.'

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    try {
      const payload = {
        name: activeCategory.name.trim(),
        slug: activeCategory.slug.trim().toLowerCase(),
        description: activeCategory.description?.trim() || null,
      }

      if (modalMode === 'add') {
        const res = await createAdminCategory(payload)
        success(res?.message || `Category "${payload.name}" created successfully in MySQL.`)
      } else {
        const res = await updateAdminCategory(activeCategory.id, payload)
        success(res?.message || `Category "${payload.name}" updated successfully in MySQL.`)
      }

      setModalMode(null)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const apiErrors = err.response.data.errors
        const mapped = {}
        if (apiErrors.name) mapped.name = apiErrors.name[0]
        if (apiErrors.slug) mapped.slug = apiErrors.slug[0]
        if (apiErrors.description) mapped.description = apiErrors.description[0]
        setFormErrors(mapped)
      } else {
        toastError(err.response?.data?.message || err.message || 'Failed to save category.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (cat) => {
    if ((cat.games_count ?? 0) > 0) {
      toastError(
        `Cannot delete category "${cat.name}" because it is currently assigned to ${cat.games_count} game(s).`
      )
      return
    }
    setDeleteTarget(cat)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      const res = await deleteAdminCategory(deleteTarget.id)
      if (res && res.success) {
        success(res.message || `Category "${deleteTarget.name}" deleted successfully.`)
        setDeleteTarget(null)
        setRefreshKey((k) => k + 1)
      } else {
        throw new Error(res?.message || 'Failed to delete category.')
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toastError(
          err.response.data?.message ||
            `Category "${deleteTarget.name}" cannot be deleted because it is still used by games.`
        )
      } else {
        toastError(err.response?.data?.message || err.message || 'Failed to delete category.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Category Classification</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Organize game taxonomy, manage genre tags, and track MySQL catalog distributions.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Error state */}
      {fetchError && !isLoading && (
        <div className="p-8 rounded-2xl bg-surface-850 border border-rose-500/30 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm font-semibold text-rose-300">{fetchError}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-750 hover:bg-surface-700 text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="p-16 rounded-2xl bg-surface-850 border border-surface-700/60 text-center space-y-3 shadow-xl">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          <p className="text-sm font-medium text-gray-300">Loading categories from database...</p>
        </div>
      )}

      {/* Categories Table */}
      {!isLoading && !fetchError && (
        <div className="rounded-2xl bg-surface-850 border border-surface-700/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-700/60 bg-surface-900/60 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-6">Category Name</th>
                  <th className="py-3.5 px-6">Slug</th>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6 text-center">Games Count</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700/40 text-sm">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <AlertCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-base font-semibold text-gray-300">No categories found in database</p>
                      <p className="text-xs text-gray-500 mt-1">Click "Add Category" to create one.</p>
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => {
                    const gamesCount = cat.games_count ?? 0

                    return (
                      <tr key={cat.id || cat.slug} className="hover:bg-surface-800/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center shrink-0">
                              <Tag className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-white">{cat.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-6">
                          <span className="px-2.5 py-1 rounded-md bg-surface-900 border border-surface-750 text-xs font-mono text-primary-300">
                            {cat.slug}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-xs text-gray-400 max-w-xs truncate">
                          {cat.description || 'No description provided'}
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              gamesCount > 0
                                ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                                : 'bg-surface-750 text-gray-400'
                            }`}
                          >
                            {gamesCount} Games
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-750 transition-colors"
                              title="Edit Category"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteClick(cat)}
                              className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                              title={
                                gamesCount > 0
                                  ? 'Cannot delete category with assigned games'
                                  : 'Delete Category'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-surface-800 border border-surface-700 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-surface-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center">
                {modalMode === 'add' ? <FolderPlus className="w-5 h-5" /> : <FolderTree className="w-5 h-5" />}
              </div>
              <h3 className="text-lg font-bold text-white">
                {modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
              </h3>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={activeCategory.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Battle Royale"
                  className={`w-full px-3.5 py-2 bg-surface-900 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 ${
                    formErrors.name
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                {formErrors.name && <p className="text-xs text-rose-400">{formErrors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Slug <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={activeCategory.slug}
                  onChange={(e) => setActiveCategory((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. battle-royale"
                  className={`w-full px-3.5 py-2 bg-surface-900 border rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 ${
                    formErrors.slug
                      ? 'border-rose-500 focus:ring-rose-500'
                      : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                  }`}
                />
                {formErrors.slug && <p className="text-xs text-rose-400">{formErrors.slug}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={activeCategory.description || ''}
                  onChange={(e) =>
                    setActiveCategory((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Short description of this genre or category..."
                  className="w-full px-3.5 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-700/60">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl bg-surface-700 text-gray-300 text-sm font-medium hover:bg-surface-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {modalMode === 'add' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Category from Database?"
        itemName={deleteTarget?.name}
        message="Are you sure you want to delete this category permanently from MySQL? This operation cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
