import { useState, useEffect } from 'react'
import { LibraryContext } from './libraryContextInstance'
import { games } from '../data/games'

const LIBRARY_STORAGE_KEY = 'gamevault_library'
const WISHLIST_STORAGE_KEY = 'gamevault_wishlist'

// Default seed games for demo user experience if empty
const DEFAULT_LIBRARY_SLUGS = ['shattered-pixel-dungeon', 'trackmania-nations-forever']
const DEFAULT_WISHLIST_SLUGS = ['beyond-all-reason', 'open-ra', 'veloren']

export function LibraryProvider({ children }) {
  // Library State (Array of game slugs)
  const [library, setLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem(LIBRARY_STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_LIBRARY_SLUGS
    } catch {
      return DEFAULT_LIBRARY_SLUGS
    }
  })

  // Wishlist State (Array of game slugs)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_WISHLIST_SLUGS
    } catch {
      return DEFAULT_WISHLIST_SLUGS
    }
  })

  // Persist library
  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library))
    } catch {
      // Ignore storage write errors
    }
  }, [library])

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
    } catch {
      // Ignore storage write errors
    }
  }, [wishlist])

  // Helper getters
  const isInLibrary = (slug) => library.includes(slug)
  const isInWishlist = (slug) => wishlist.includes(slug)

  // Library Actions
  const addToLibrary = (slug) => {
    if (!slug) return
    setLibrary((prev) => (prev.includes(slug) ? prev : [...prev, slug]))
  }

  const removeFromLibrary = (slug) => {
    setLibrary((prev) => prev.filter((s) => s !== slug))
  }

  const toggleLibrary = (slug) => {
    if (isInLibrary(slug)) {
      removeFromLibrary(slug)
    } else {
      addToLibrary(slug)
    }
  }

  // Wishlist Actions
  const addToWishlist = (slug) => {
    if (!slug) return
    setWishlist((prev) => (prev.includes(slug) ? prev : [...prev, slug]))
  }

  const removeFromWishlist = (slug) => {
    setWishlist((prev) => prev.filter((s) => s !== slug))
  }

  const toggleWishlist = (slug) => {
    if (isInWishlist(slug)) {
      removeFromWishlist(slug)
    } else {
      addToWishlist(slug)
    }
  }

  // Full Game Objects for Library & Wishlist Pages
  const libraryGames = games.filter((g) => library.includes(g.slug))
  const wishlistGames = games.filter((g) => wishlist.includes(g.slug))

  return (
    <LibraryContext.Provider
      value={{
        library,
        wishlist,
        libraryGames,
        wishlistGames,
        isInLibrary,
        isInWishlist,
        addToLibrary,
        removeFromLibrary,
        toggleLibrary,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  )
}
