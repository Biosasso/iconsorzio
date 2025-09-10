// Sistema di cache semplice per migliorare performance
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minuti

export function getCachedData(key) {
  const item = cache.get(key)
  if (!item) return null
  
  if (Date.now() - item.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  
  return item.data
}

export function setCachedData(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  })
}

export function clearCache() {
  cache.clear()
}

// Auto-clear cache ogni 10 minuti
setInterval(() => {
  const now = Date.now()
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_TTL) {
      cache.delete(key)
    }
  }
}, 10 * 60 * 1000)
