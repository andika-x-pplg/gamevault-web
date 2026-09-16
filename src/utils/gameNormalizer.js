/**
 * Normalizes game type / license enum from backend to human readable badge format.
 */
export function formatLicense(gameType) {
  if (!gameType) return 'Free-to-Play'
  switch (gameType.toLowerCase()) {
    case 'open-source':
    case 'opensource':
    case 'open source':
      return 'Open Source'
    case 'freeware':
      return 'Freeware'
    case 'demo':
      return 'Demo'
    case 'free-to-play':
    case 'freetoplay':
    default:
      return 'Free-to-Play'
  }
}

/**
 * Formats download count number to compact readable string (e.g., 780K, 1.2M).
 */
export function formatDownloadCount(count) {
  if (typeof count !== 'number' || isNaN(count)) {
    return count || '0'
  }
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'K'
  }
  return count.toString()
}

/**
 * Formats system requirements structure from API response
 */
export function normalizeSystemRequirements(rawReqs) {
  if (!rawReqs) return null

  // If already structured as { minimum, recommended }
  if (rawReqs.minimum || rawReqs.recommended) {
    return {
      minimum: rawReqs.minimum
        ? {
            os: rawReqs.minimum.os,
            processor: rawReqs.minimum.processor,
            memory: rawReqs.minimum.memory,
            graphics: rawReqs.minimum.graphics,
            storage: rawReqs.minimum.storage,
            directX: rawReqs.minimum.directx || rawReqs.minimum.directX || 'DirectX 11',
          }
        : null,
      recommended: rawReqs.recommended
        ? {
            os: rawReqs.recommended.os,
            processor: rawReqs.recommended.processor,
            memory: rawReqs.recommended.memory,
            graphics: rawReqs.recommended.graphics,
            storage: rawReqs.recommended.storage,
            directX: rawReqs.recommended.directx || rawReqs.recommended.directX || 'DirectX 12',
          }
        : null,
    }
  }

  // If rawReqs is an array of requirement objects
  if (Array.isArray(rawReqs)) {
    const min = rawReqs.find((r) => r.type === 'minimum')
    const rec = rawReqs.find((r) => r.type === 'recommended')
    return {
      minimum: min
        ? {
            os: min.os,
            processor: min.processor,
            memory: min.memory,
            graphics: min.graphics,
            storage: min.storage,
            directX: min.directx || min.directX || 'DirectX 11',
          }
        : null,
      recommended: rec
        ? {
            os: rec.os,
            processor: rec.processor,
            memory: rec.memory,
            graphics: rec.graphics,
            storage: rec.storage,
            directX: rec.directx || rec.directX || 'DirectX 12',
          }
        : null,
    }
  }

  return rawReqs
}

/**
 * Normalizes single game object from Laravel REST API to frontend component schema.
 */
export function normalizeGame(apiGame) {
  if (!apiGame) return null

  const categories = Array.isArray(apiGame.categories) ? apiGame.categories : []
  const categoryNames = categories.map((c) => (typeof c === 'string' ? c : c.name))
  const primaryGenre = categoryNames[0] || 'Action'

  // Extract screenshots as clean array of string URLs
  let screenshotsList = []
  if (Array.isArray(apiGame.screenshots)) {
    screenshotsList = apiGame.screenshots
      .map((s) => (typeof s === 'string' ? s : s.image_url || s.url))
      .filter(Boolean)
  }

  const coverImg = apiGame.cover_image || apiGame.image || ''
  const bannerImg = apiGame.banner_image || apiGame.banner || coverImg

  if (screenshotsList.length === 0 && (bannerImg || coverImg)) {
    screenshotsList = [bannerImg, coverImg].filter(Boolean)
  }

  // Supported languages formatting
  let languagesFormatted = 'English'
  if (Array.isArray(apiGame.supported_languages)) {
    languagesFormatted = apiGame.supported_languages.join(', ')
  } else if (typeof apiGame.supported_languages === 'string') {
    languagesFormatted = apiGame.supported_languages
  } else if (apiGame.languages) {
    languagesFormatted = Array.isArray(apiGame.languages)
      ? apiGame.languages.join(', ')
      : apiGame.languages
  }

  const downloadCountNum =
    typeof apiGame.download_count === 'number'
      ? apiGame.download_count
      : typeof apiGame.downloadCount === 'number'
      ? apiGame.downloadCount
      : 0

  return {
    id: apiGame.id,
    title: apiGame.title || '',
    slug: apiGame.slug || '',
    shortDescription: apiGame.short_description || apiGame.shortDescription || apiGame.description || '',
    description: apiGame.description || apiGame.short_description || '',
    developer: apiGame.developer || 'Indie Developer',
    publisher: apiGame.publisher || apiGame.developer || 'GameVault Distribution',
    gameType: apiGame.game_type || apiGame.gameType || 'free-to-play',
    license: formatLicense(apiGame.game_type || apiGame.gameType || apiGame.license),
    releaseDate: apiGame.release_date || apiGame.releaseDate || '2024',
    lastUpdated: apiGame.last_updated || apiGame.lastUpdated || apiGame.release_date || '2025',
    version: apiGame.version || 'v1.0.0',
    fileSize: apiGame.file_size || apiGame.fileSize || 'Standard',
    coverImage: coverImg,
    bannerImage: bannerImg,
    image: coverImg, // Legacy & component compatibility
    banner: bannerImg, // Legacy & component compatibility
    rating: Number(apiGame.rating || 4.5),
    downloadCount: downloadCountNum,
    downloads: formatDownloadCount(downloadCountNum),
    status: apiGame.status || 'published',
    featured: Boolean(apiGame.featured ?? apiGame.is_featured),
    trending: Boolean(apiGame.trending ?? (downloadCountNum > 100000 || apiGame.rating >= 4.7)),
    categories: categories,
    genre: primaryGenre,
    genres: categoryNames,
    screenshots: screenshotsList,
    systemRequirements: normalizeSystemRequirements(
      apiGame.system_requirements || apiGame.systemRequirements
    ),
    officialSource: apiGame.official_source || apiGame.officialSource || {
      name: `${apiGame.title} Official Portal`,
      url: 'https://github.com',
    },
    languages: languagesFormatted,
    supportedLanguages: apiGame.supported_languages || ['English'],
  }
}
