import { useState, useMemo } from 'react'
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  X,
  FolderPlus,
  Tag,
} from 'lucide-react'
import { useGame } from '../../context/useGame'
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
  const { categories, games, addCategory, updateCategory, deleteCategory } = useGame()
  const { success, error } = useToast()

  // Modal / Form state
  const [modalMode, setModalMode] = useState(null) // 'add' | 'edit' | null
  const [activeCategory, setActiveCategory] = useState({ name: '', slug: '', description: '' })
  const [formErrors, setFormErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Calculate game count per category
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const count = games.filter(
        (g) =>
          g.genre?.toLowerCase() === cat.name?.toLowerCase() ||
          (Array.isArray(g.genres) &&
            g.genres.some((item) => item?.toLowerCase() === cat.name?.toLowerCase()))
      ).length

      return {
        ...cat,
        gameCount: count,
      }
    })
  }, [categories, games])

  const openAddModal = () => {
    setActiveCategory({ name: '', slug: '', description: '' })
    setFormErrors({})
    setModalMode('add')
  }

  const openEditModal = (cat) => {
    setActiveCategory({ id: cat.id, name: cat.name, slug: cat.slug, description: cat.description || '' })
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

  const handleSaveCategory = (e) => {
    e.preventDefault()
    const errors = {}
    if (!activeCategory.name.trim()) errors.name = 'Category name is required.'
    if (!activeCategory.slug.trim()) errors.slug = 'Slug is required.'

    // Check duplicate slug
    const duplicate = categories.find(
      (c) =>
        c.slug.toLowerCase() === activeCategory.slug.trim().toLowerCase() &&
        c.id !== activeCategory.id
    )
    if (duplicate) {
      errors.slug = `Category with slug "${activeCategory.slug}" already exists.`
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    if (modalMode === 'add') {
      addCategory(activeCategory)
      success(`Category "${activeCategory.name}" created successfully.`)
    } else {
      updateCategory(activeCategory.id, activeCategory)
      success(`Category "${activeCategory.name}" updated successfully.`)
    }

    setModalMode(null)
  }

  const handleDeleteClick = (cat) => {
    if (cat.gameCount > 0) {
      error(`Cannot delete category "${cat.name}" because it is currently assigned to ${cat.gameCount} game(s).`)
      return
    }
    setDeleteTarget(cat)
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deleteCategory(deleteTarget.id)
    success(`Category "${deleteTarget.name}" deleted.`)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Category Classification</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Organize game taxonomy, manage genre tags, and track catalog distributions.
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

      {/* Categories Table */}
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
              {categoryStats.map((cat) => (
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
                        cat.gameCount > 0
                          ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                          : 'bg-surface-750 text-gray-400'
                      }`}
                    >
                      {cat.gameCount} Games
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
                        title={cat.gameCount > 0 ? 'Cannot delete category with assigned games' : 'Delete Category'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
                  className="w-full px-3.5 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
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
                  className="w-full px-3.5 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                />
                {formErrors.slug && <p className="text-xs text-rose-400">{formErrors.slug}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={activeCategory.description}
                  onChange={(e) =>
                    setActiveCategory((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Short description of this genre or tag..."
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
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-primary-600/25"
                >
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
        title="Delete Category?"
        itemName={deleteTarget?.name}
        message="Are you sure you want to delete this category? This operation cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
