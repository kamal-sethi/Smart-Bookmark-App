const BOOKMARKS_SYNC_CHANNEL = 'bookmarks-sync'

export function getBookmarksSyncStorageKey(userId: string) {
  return `${BOOKMARKS_SYNC_CHANNEL}:${userId}`
}

export function broadcastBookmarksSync(userId: string) {
  if (typeof window === 'undefined') {
    return
  }

  const payload = {
    userId,
    timestamp: Date.now(),
  }

  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel(BOOKMARKS_SYNC_CHANNEL)
    channel.postMessage(payload)
    channel.close()
  }

  window.localStorage.setItem(
    getBookmarksSyncStorageKey(userId),
    JSON.stringify(payload),
  )
}
