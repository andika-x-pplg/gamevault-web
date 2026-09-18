import { useState, useEffect, useCallback, useMemo } from 'react'
import { LibraryContext } from './libraryContextInstance'
import { useAuth } from './useAuth'
import { useToast } from './useToast'
import * as libraryService from '../services/libraryService'
import * as wishlistService from '../services/wishlistService'

export function LibraryProvider({ children }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { success: showSuccessToast, error: showErrorToast, info: showInfoToast } = useToast()

  const [serverLibraryGames, setServerLibraryGames] = useState([])
  const [serverWishlistGames, setServerWishlistGames] = useState([])
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)

  // One-time cleanup of legacy mock localStorage keys
  useEffect(() => {
    try {
      localStorage.removeItem('gamevault_library')
      localStorage.removeItem('gamevault_wishlist')
    } catch {
      // Ignore storage errors
    }
  }, [])

  /**
   * Fetch library games from Laravel API
   */
  const refreshLibrary = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoadingLibrary(true)
    try {
      const data = await libraryService.getLibrary()
      setServerLibraryGames(data)
    } catch (err) {
      console.error('Failed to fetch library games:', err)
      setServerLibraryGames([])
    } finally {
      setIsLoadingLibrary(false)
    }
  }, [isAuthenticated])

  /**
   * Fetch wishlist games from Laravel API
   */
  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoadingWishlist(true)
    try {
      const data = await wishlistService.getWishlist()
      setServerWishlistGames(data)
    } catch (err) {
      console.error('Failed to fetch wishlist games:', err)
      setServerWishlistGames([])
    } finally {
      setIsLoadingWishlist(false)
    }
  }, [isAuthenticated])

  // Auth-aware fetching: Reload collections when authenticated user logs in
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return

    let isMounted = true

    libraryService
      .getLibrary()
      .then((data) => {
        if (isMounted) setServerLibraryGames(data)
      })
      .catch((err) => {
        console.error('Failed to load library:', err)
      })

    wishlistService
      .getWishlist()
      .then((data) => {
        if (isMounted) setServerWishlistGames(data)
      })
      .catch((err) => {
        console.error('Failed to load wishlist:', err)
      })

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, isAuthLoading])

  // Collections are strictly empty for guest users
  const libraryGames = useMemo(
    () => (isAuthenticated ? serverLibraryGames : []),
    [isAuthenticated, serverLibraryGames]
  )
  const wishlistGames = useMemo(
    () => (isAuthenticated ? serverWishlistGames : []),
    [isAuthenticated, serverWishlistGames]
  )

  // Slugs and IDs for fast checks
  const library = useMemo(() => libraryGames.map((g) => g.slug), [libraryGames])
  const libraryIds = useMemo(() => libraryGames.map((g) => g.id), [libraryGames])
  const wishlist = useMemo(() => wishlistGames.map((g) => g.slug), [wishlistGames])
  const wishlistIds = useMemo(() => wishlistGames.map((g) => g.id), [wishlistGames])

  const isInLibrary = useCallback(
    (identifier) => {
      if (!identifier) return false
      return library.includes(identifier) || libraryIds.includes(identifier)
    },
    [library, libraryIds]
  )

  const isInWishlist = useCallback(
    (identifier) => {
      if (!identifier) return false
      return wishlist.includes(identifier) || wishlistIds.includes(identifier)
    },
    [wishlist, wishlistIds]
  )

  /**
   * Add to Library via API
   */
  const addToLibrary = useCallback(
    async (identifier) => {
      if (!isAuthenticated) {
        showInfoToast('Silakan masuk terlebih dahulu untuk menyimpan game ke Library Anda.')
        return { success: false, requireAuth: true }
      }

      if (isInLibrary(identifier)) {
        showInfoToast('Game sudah ada di Library Anda.')
        return { success: true }
      }

      try {
        await libraryService.addToLibrary(identifier)
        await refreshLibrary()
        showSuccessToast('Game berhasil ditambahkan ke My Library.')
        return { success: true }
      } catch (err) {
        console.error('Error adding game to library:', err)
        const msg = err.response?.data?.message || 'Gagal menambahkan game ke Library.'
        showErrorToast(msg)
        return { success: false, message: msg }
      }
    },
    [isAuthenticated, isInLibrary, refreshLibrary, showSuccessToast, showErrorToast, showInfoToast]
  )

  /**
   * Remove from Library via API
   */
  const removeFromLibrary = useCallback(
    async (identifier) => {
      if (!isAuthenticated) return { success: false, requireAuth: true }

      try {
        await libraryService.removeFromLibrary(identifier)
        setServerLibraryGames((prev) => prev.filter((g) => g.slug !== identifier && g.id !== identifier))
        showSuccessToast('Game telah dihapus dari My Library.')
        return { success: true }
      } catch (err) {
        console.error('Error removing game from library:', err)
        const msg = err.response?.data?.message || 'Gagal menghapus game dari Library.'
        showErrorToast(msg)
        return { success: false, message: msg }
      }
    },
    [isAuthenticated, showSuccessToast, showErrorToast]
  )

  /**
   * Toggle Library helper
   */
  const toggleLibrary = useCallback(
    async (identifier) => {
      if (isInLibrary(identifier)) {
        return removeFromLibrary(identifier)
      } else {
        return addToLibrary(identifier)
      }
    },
    [isInLibrary, addToLibrary, removeFromLibrary]
  )

  /**
   * Add to Wishlist via API
   */
  const addToWishlist = useCallback(
    async (identifier) => {
      if (!isAuthenticated) {
        showInfoToast('Silakan masuk terlebih dahulu untuk menyimpan game ke Wishlist Anda.')
        return { success: false, requireAuth: true }
      }

      if (isInWishlist(identifier)) {
        showInfoToast('Game sudah ada di Wishlist Anda.')
        return { success: true }
      }

      try {
        await wishlistService.addToWishlist(identifier)
        await refreshWishlist()
        showSuccessToast('Game berhasil ditambahkan ke Wishlist.')
        return { success: true }
      } catch (err) {
        console.error('Error adding game to wishlist:', err)
        const msg = err.response?.data?.message || 'Gagal menambahkan game ke Wishlist.'
        showErrorToast(msg)
        return { success: false, message: msg }
      }
    },
    [isAuthenticated, isInWishlist, refreshWishlist, showSuccessToast, showErrorToast, showInfoToast]
  )

  /**
   * Remove from Wishlist via API
   */
  const removeFromWishlist = useCallback(
    async (identifier) => {
      if (!isAuthenticated) return { success: false, requireAuth: true }

      try {
        await wishlistService.removeFromWishlist(identifier)
        setServerWishlistGames((prev) => prev.filter((g) => g.slug !== identifier && g.id !== identifier))
        showSuccessToast('Game telah dihapus dari Wishlist.')
        return { success: true }
      } catch (err) {
        console.error('Error removing game from wishlist:', err)
        const msg = err.response?.data?.message || 'Gagal menghapus game dari Wishlist.'
        showErrorToast(msg)
        return { success: false, message: msg }
      }
    },
    [isAuthenticated, showSuccessToast, showErrorToast]
  )

  /**
   * Toggle Wishlist helper
   */
  const toggleWishlist = useCallback(
    async (identifier) => {
      if (isInWishlist(identifier)) {
        return removeFromWishlist(identifier)
      } else {
        return addToWishlist(identifier)
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  )

  return (
    <LibraryContext.Provider
      value={{
        library,
        libraryIds,
        wishlist,
        wishlistIds,
        libraryGames,
        wishlistGames,
        isLoadingLibrary,
        isLoadingWishlist,
        isInLibrary,
        isInWishlist,
        isWishlisted: isInWishlist,
        addToLibrary,
        removeFromLibrary,
        toggleLibrary,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refreshLibrary,
        refreshWishlist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
