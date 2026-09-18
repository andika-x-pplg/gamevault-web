import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Info,
  ShieldAlert,
  Loader2,
} from 'lucide-react'
import { getAdminGame, createAdminGame, updateAdminGame } from '../../services/adminGameService'
import { getAdminCategories } from '../../services/adminCategoryService'
import { useToast } from '../../context/useToast'

const GAME_TYPES = [
  { label: 'Free-to-Play', value: 'free-to-play' },
  { label: 'Freeware', value: 'freeware' },
  { label: 'Open Source', value: 'open-source' },
  { label: 'Demo', value: 'demo' },
]

const INITIAL_FORM_STATE = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  developer: '',
  publisher: '',
  genre: 'Action',
  license: 'free-to-play',
  releaseDate: new Date().toISOString().split('T')[0],
  version: 'v1.0.0',
  fileSize: '500 MB',
  languages: 'English, Indonesian',
  image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
  screenshots:
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80, https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  officialSourceName: 'Official Portal',
  officialSourceUrl: 'https://github.com',
  status: 'Published',
  minOs: 'Windows 10 / 11 (64-bit)',
  minProcessor: 'Intel Core i3-4150 / AMD FX-6300',
  minMemory: '4 GB RAM',
  minGraphics: 'NVIDIA GeForce GT 730 / AMD Radeon R7 240',
  minStorage: '2 GB available space',
  minDirectX: 'Version 11',
  recOs: 'Windows 10 / 11 (64-bit)',
  recProcessor: 'Intel Core i5-7400 / AMD Ryzen 5 1600',
  recMemory: '8 GB RAM',
  recGraphics: 'NVIDIA GeForce GTX 1060 / AMD Radeon RX 580',
  recStorage: '5 GB available space',
  recDirectX: 'Version 12',
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapApiGameToFormData(game) {
  if (!game) return null

  // System requirements
  const minReq = game.system_requirements?.minimum || {}
  const recReq = game.system_requirements?.recommended || {}

  // Screenshots string
  let screenshotsStr = ''
  if (Array.isArray(game.screenshots)) {
    screenshotsStr = game.screenshots
      .map((s) => (typeof s === 'string' ? s : s.image_url))
      .filter(Boolean)
      .join(', ')
  }

  // Categories / Genre
  let genreName = 'Action'
  if (Array.isArray(game.categories) && game.categories.length > 0) {
    genreName = game.categories[0].name || game.categories[0].slug || 'Action'
  }

  // Languages string
  let languagesStr = 'English, Indonesian'
  if (Array.isArray(game.supported_languages)) {
    languagesStr = game.supported_languages.join(', ')
  } else if (typeof game.supported_languages === 'string') {
    languagesStr = game.supported_languages
  }

  return {
    title: game.title || '',
    slug: game.slug || '',
    shortDescription: game.short_description || '',
    description: game.description || '',
    developer: game.developer || '',
    publisher: game.publisher || '',
    genre: genreName,
    license: game.game_type || 'free-to-play',
    releaseDate: game.release_date || new Date().toISOString().split('T')[0],
    version: game.version || 'v1.0.0',
    fileSize: game.file_size || '500 MB',
    languages: languagesStr,
    image: game.cover_image || game.image || '',
    banner: game.banner_image || game.banner || '',
    screenshots: screenshotsStr,
    officialSourceName: game.official_source?.name || game.official_source_name || 'Official Portal',
    officialSourceUrl: game.official_source?.url || game.official_source_url || 'https://github.com',
    status: game.status ? game.status.charAt(0).toUpperCase() + game.status.slice(1).toLowerCase() : 'Published',
    minOs: minReq.os || 'Windows 10 / 11 (64-bit)',
    minProcessor: minReq.processor || 'Intel Core i3',
    minMemory: minReq.memory || '4 GB RAM',
    minGraphics: minReq.graphics || 'DirectX 11 Graphics',
    minStorage: minReq.storage || '2 GB space',
    minDirectX: minReq.directx || 'Version 11',
    recOs: recReq.os || 'Windows 10 / 11 (64-bit)',
    recProcessor: recReq.processor || 'Intel Core i5',
    recMemory: recReq.memory || '8 GB RAM',
    recGraphics: recReq.graphics || 'NVIDIA GTX 1060',
    recStorage: recReq.storage || '5 GB space',
    recDirectX: recReq.directx || 'Version 12',
  }
}

export default function AdminGameFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()

  const isEditMode = !!id

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [errors, setErrors] = useState({})
  const [isSlugManual, setIsSlugManual] = useState(isEditMode)
  const [isLoadingGame, setIsLoadingGame] = useState(isEditMode)
  const [notFound, setNotFound] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch categories
  useEffect(() => {
    let isMounted = true
    async function loadCategories() {
      try {
        const res = await getAdminCategories()
        if (isMounted && res?.data) {
          setCategories(res.data)
        }
      } catch {
        // Fallback
      }
    }
    loadCategories()
    return () => {
      isMounted = false
    }
  }, [])

  // Fetch game data when in Edit Mode
  useEffect(() => {
    if (!isEditMode) return

    let isMounted = true
    async function loadGameDetails() {
      setIsLoadingGame(true)
      setNotFound(false)

      try {
        const response = await getAdminGame(id)
        if (isMounted && response?.data) {
          const mapped = mapApiGameToFormData(response.data)
          if (mapped) {
            setFormData(mapped)
          }
        } else {
          setNotFound(true)
        }
      } catch (err) {
        if (isMounted) {
          if (err.response?.status === 404) {
            setNotFound(true)
          } else {
            toastError(err.response?.data?.message || 'Failed to load game details.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoadingGame(false)
        }
      }
    }

    loadGameDetails()

    return () => {
      isMounted = false
    }
  }, [id, isEditMode, toastError])

  // Handle auto-slug on title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: isSlugManual ? prev.slug : generateSlug(newTitle),
    }))
    if (errors.title) setErrors((prev) => ({ ...prev, title: null }))
  }

  // Handle manual field changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  // Form validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = 'Game Title is required.'
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required.'
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
      newErrors.slug = 'Slug must only contain lowercase alphanumeric letters and hyphens.'
    }

    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required.'
    if (!formData.description.trim()) newErrors.description = 'Full description is required.'
    if (!formData.developer.trim()) newErrors.developer = 'Developer name is required.'
    if (!formData.genre) newErrors.genre = 'Genre classification is required.'
    if (!formData.license) newErrors.license = 'Game Type is required.'
    if (!formData.version.trim()) newErrors.version = 'Version string is required.'
    if (!formData.fileSize.trim()) newErrors.fileSize = 'File size is required.'

    if (formData.officialSourceUrl.trim()) {
      try {
        new URL(formData.officialSourceUrl.trim())
      } catch {
        newErrors.officialSourceUrl = 'Must be a valid URL (e.g., https://...)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    // Prepare clean game payload for Laravel API
    const screenshotsList = formData.screenshots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      short_description: formData.shortDescription.trim(),
      description: formData.description.trim(),
      developer: formData.developer.trim(),
      publisher: formData.publisher.trim() || formData.developer.trim(),
      game_type: formData.license,
      release_date: formData.releaseDate,
      version: formData.version.trim(),
      file_size: formData.fileSize.trim(),
      supported_languages: formData.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      cover_image:
        formData.image.trim() ||
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
      banner_image:
        formData.banner.trim() ||
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
      screenshots: screenshotsList.length > 0 ? screenshotsList : [formData.image],
      status: formData.status.toLowerCase(),
      official_source_name: formData.officialSourceName.trim() || 'Official Distribution Source',
      official_source_url: formData.officialSourceUrl.trim() || 'https://github.com',
      categories: [formData.genre],
      system_requirements: {
        minimum: {
          os: formData.minOs,
          processor: formData.minProcessor,
          memory: formData.minMemory,
          graphics: formData.minGraphics,
          storage: formData.minStorage,
          directx: formData.minDirectX,
        },
        recommended: {
          os: formData.recOs,
          processor: formData.recProcessor,
          memory: formData.recMemory,
          graphics: formData.recGraphics,
          storage: formData.recStorage,
          directx: formData.recDirectX,
        },
      },
    }

    try {
      if (isEditMode) {
        const response = await updateAdminGame(id, payload)
        success(response?.message || `Game "${payload.title}" updated successfully in MySQL.`)
      } else {
        const response = await createAdminGame(payload)
        success(
          response?.message || `Game "${payload.title}" created successfully as ${formData.status}.`
        )
      }
      navigate('/admin/games')
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const apiErrors = err.response.data.errors
        const mappedErrors = {}

        if (apiErrors.title) mappedErrors.title = apiErrors.title[0]
        if (apiErrors.slug) mappedErrors.slug = apiErrors.slug[0]
        if (apiErrors.short_description) mappedErrors.shortDescription = apiErrors.short_description[0]
        if (apiErrors.description) mappedErrors.description = apiErrors.description[0]
        if (apiErrors.developer) mappedErrors.developer = apiErrors.developer[0]
        if (apiErrors.publisher) mappedErrors.publisher = apiErrors.publisher[0]
        if (apiErrors.game_type) mappedErrors.license = apiErrors.game_type[0]
        if (apiErrors.version) mappedErrors.version = apiErrors.version[0]
        if (apiErrors.file_size) mappedErrors.fileSize = apiErrors.file_size[0]
        if (apiErrors.official_source_url) mappedErrors.officialSourceUrl = apiErrors.official_source_url[0]

        setErrors(mappedErrors)
        toastError('Please check form fields with validation errors.')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        toastError(err.response?.data?.message || err.message || 'Failed to save game to database.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingGame) {
    return (
      <div className="p-16 rounded-2xl bg-surface-850 border border-surface-700 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
        <p className="text-sm font-medium text-gray-300">Loading game details from database...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="p-12 rounded-2xl bg-surface-850 border border-surface-700 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Game Not Found</h3>
        <p className="text-gray-400 text-sm">The game with identifier "{id}" does not exist in MySQL database.</p>
        <Link
          to="/admin/games"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-700 text-white font-medium text-sm hover:bg-surface-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Game List
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/games"
            className="p-2 rounded-xl bg-surface-800 border border-surface-700 text-gray-400 hover:text-white hover:bg-surface-700 transition-colors"
            title="Back to Game List"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isEditMode ? `Edit Game: ${formData.title || 'Untitled'}` : 'Create New Game'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditMode
                ? 'Update metadata, system requirements, media, and publishing status in MySQL.'
                : 'Fill in complete details to add a new legal PC game to GameVault catalog.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/games"
            className="px-4 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-gray-300 font-medium text-sm border border-surface-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? 'Save Changes' : 'Save Game'}
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-750">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-bold text-white">1. Basic Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Game Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Super Tux Racer"
                className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 ${
                  errors.title
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-400">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Slug (URL) <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManual(false)
                    setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title) }))
                  }}
                  className="text-[11px] text-primary-400 hover:underline"
                >
                  Auto-sync with Title
                </button>
              </div>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={(e) => {
                  setIsSlugManual(true)
                  handleChange(e)
                }}
                placeholder="e.g. super-tux-racer"
                className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 ${
                  errors.slug
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.slug && <p className="text-xs text-rose-400">{errors.slug}</p>}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Short Description <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="Brief 1-2 sentence teaser about the game..."
              className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 ${
                errors.shortDescription
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.shortDescription && <p className="text-xs text-rose-400">{errors.shortDescription}</p>}
          </div>

          {/* Full Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Full Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive summary of gameplay, story, features, and mechanics..."
              className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 ${
                errors.description
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-400">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Developer */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Developer <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                placeholder="e.g. Studio Red / Evan"
                className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm text-white focus:outline-none focus:ring-1 ${
                  errors.developer
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.developer && <p className="text-xs text-rose-400">{errors.developer}</p>}
            </div>

            {/* Publisher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                placeholder="e.g. Open Source Community"
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Classification & Details */}
        <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-750">
            <Info className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">2. Classification & Technical Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Genre */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Primary Category <span className="text-rose-400">*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id || c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Game Type / License */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Game Type / License <span className="text-rose-400">*</span>
              </label>
              <select
                name="license"
                value={formData.license}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {GAME_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Release Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Release Date
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Version */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Version <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="e.g. v1.2.0"
                className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 ${
                  errors.version
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.version && <p className="text-xs text-rose-400">{errors.version}</p>}
            </div>

            {/* File Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                File Size <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="fileSize"
                value={formData.fileSize}
                onChange={handleChange}
                placeholder="e.g. 1.2 GB / 450 MB"
                className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 ${
                  errors.fileSize
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.fileSize && <p className="text-xs text-rose-400">{errors.fileSize}</p>}
            </div>

            {/* Languages */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Supported Languages
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="e.g. English, Indonesian"
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media URLs */}
        <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-750">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">3. Media & Assets (Image URLs)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Cover Image */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Cover Image URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
              />
              {formData.image && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-surface-900/60 rounded-xl border border-surface-750">
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    className="w-16 h-16 rounded-lg object-cover border border-surface-700"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  <span className="text-xs text-gray-400">Cover image preview</span>
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Hero Banner URL
              </label>
              <input
                type="text"
                name="banner"
                value={formData.banner}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
              />
              {formData.banner && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-surface-900/60 rounded-xl border border-surface-750">
                  <img
                    src={formData.banner}
                    alt="Banner preview"
                    className="w-24 h-16 rounded-lg object-cover border border-surface-700"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80'
                    }}
                  />
                  <span className="text-xs text-gray-400">Wide banner preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Screenshots */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Screenshot URLs (Separated by comma)
            </label>
            <textarea
              name="screenshots"
              rows={2}
              value={formData.screenshots}
              onChange={handleChange}
              placeholder="https://..., https://..."
              className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white font-mono text-xs focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Section 4: System Requirements */}
        <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-750">
            <h3 className="text-lg font-bold text-white">4. System Requirements</h3>
          </div>

          {/* Minimum Requirements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Minimum Requirements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="minOs"
                value={formData.minOs}
                onChange={handleChange}
                placeholder="OS"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="minProcessor"
                value={formData.minProcessor}
                onChange={handleChange}
                placeholder="Processor"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="minMemory"
                value={formData.minMemory}
                onChange={handleChange}
                placeholder="Memory"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="minGraphics"
                value={formData.minGraphics}
                onChange={handleChange}
                placeholder="Graphics"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="minStorage"
                value={formData.minStorage}
                onChange={handleChange}
                placeholder="Storage"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="minDirectX"
                value={formData.minDirectX}
                onChange={handleChange}
                placeholder="DirectX"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>

          {/* Recommended Requirements */}
          <div className="space-y-3 pt-2 border-t border-surface-750">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Recommended Requirements</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="recOs"
                value={formData.recOs}
                onChange={handleChange}
                placeholder="OS"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="recProcessor"
                value={formData.recProcessor}
                onChange={handleChange}
                placeholder="Processor"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="recMemory"
                value={formData.recMemory}
                onChange={handleChange}
                placeholder="Memory"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="recGraphics"
                value={formData.recGraphics}
                onChange={handleChange}
                placeholder="Graphics"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="recStorage"
                value={formData.recStorage}
                onChange={handleChange}
                placeholder="Storage"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
              <input
                type="text"
                name="recDirectX"
                value={formData.recDirectX}
                onChange={handleChange}
                placeholder="DirectX"
                className="px-3 py-2 bg-surface-900 border border-surface-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Distribution & Legal Source */}
        <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-750">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">5. Distribution & Legal Compliance</h3>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
            <strong>Catatan Kepatuhan GameVault:</strong> Semua game yang didaftarkan harus memiliki sumber distribusi yang resmi, legal, dan terverifikasi (Official Developer Portal, Steam Free/Demo, Epic Games, Itch.io Freeware, atau GitHub Open Source repository).
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Official Source Name
              </label>
              <input
                type="text"
                name="officialSourceName"
                value={formData.officialSourceName}
                onChange={handleChange}
                placeholder="e.g. Official Developer Website / Steam"
                className="w-full px-4 py-2.5 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Official Source URL
              </label>
              <input
                type="text"
                name="officialSourceUrl"
                value={formData.officialSourceUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={`w-full px-4 py-2.5 bg-surface-900 border rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 ${
                  errors.officialSourceUrl
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-surface-700 focus:border-primary-500 focus:ring-primary-500'
                }`}
              />
              {errors.officialSourceUrl && (
                <p className="text-xs text-rose-400">{errors.officialSourceUrl}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 6: Publishing Controls */}
        <div className="p-6 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Publishing Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Published games will appear on public catalog; Draft games are only visible inside Admin Panel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                formData.status === 'Draft'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-surface-900 border-surface-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              <input
                type="radio"
                name="status"
                value="Draft"
                checked={formData.status === 'Draft'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Draft (Hidden)</span>
            </label>

            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                formData.status === 'Published'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-surface-900 border-surface-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              <input
                type="radio"
                name="status"
                value="Published"
                checked={formData.status === 'Published'}
                onChange={handleChange}
                className="sr-only"
              />
              <span>Published (Live)</span>
            </label>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/games"
            className="px-5 py-2.5 rounded-xl bg-surface-800 hover:bg-surface-700 text-gray-300 font-medium text-sm border border-surface-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm transition-all shadow-lg shadow-primary-600/25 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Game...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? 'Save Changes' : 'Publish Game'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
