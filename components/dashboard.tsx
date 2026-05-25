'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type User } from '@supabase/supabase-js'
import { useAuth } from '@/components/auth-provider'
import { useToast } from '@/hooks/use-toast'
import {
  broadcastBookmarksSync,
  getBookmarksSyncStorageKey,
} from '@/lib/bookmarks-sync'
import { supabase } from '@/lib/supabase/client'
import {
  fetchBookmarks,
  mapBookmarkInsert,
  mapBookmarkRow,
  mapBookmarkUpdate,
  type BookmarkRow,
} from '@/lib/supabase/bookmarks'
import { Navbar } from './navbar'
import { BookmarkGrid } from './bookmark-grid'
import { AddBookmarkModal } from './add-bookmark-modal'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { type Bookmark, type BookmarkFormValues } from '@/lib/types'

interface DashboardProps {
  user: User
}

const PAGE_SIZE = 6

function appendUniqueBookmarks(currentBookmarks: Bookmark[], incomingBookmarks: Bookmark[]) {
  const seenIds = new Set(currentBookmarks.map((bookmark) => bookmark.id))
  const nextBookmarks = [...currentBookmarks]

  incomingBookmarks.forEach((bookmark) => {
    if (!seenIds.has(bookmark.id)) {
      seenIds.add(bookmark.id)
      nextBookmarks.push(bookmark)
    }
  })

  return nextBookmarks
}

export function Dashboard({ user }: DashboardProps) {
  const { signOut } = useAuth()
  const { toast } = useToast()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSavingBookmark, setIsSavingBookmark] = useState(false)
  const [isDeletingBookmark, setIsDeletingBookmark] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [totalBookmarks, setTotalBookmarks] = useState(0)
  const realtimeChannelName = useMemo(
    () => `bookmarks:${user.id}:${Math.random().toString(36).slice(2)}`,
    [user.id],
  )
  const loadedCountRef = useRef(PAGE_SIZE)
  const refreshInFlightRef = useRef(false)
  const queuedRefreshRef = useRef(false)

  const refreshBookmarks = useCallback(
    async ({ showLoading }: { showLoading: boolean }) => {
      if (refreshInFlightRef.current) {
        queuedRefreshRef.current = true
        return
      }

      refreshInFlightRef.current = true

      do {
        queuedRefreshRef.current = false

        const limit = Math.max(loadedCountRef.current, PAGE_SIZE)

        if (showLoading) {
          setIsLoadingBookmarks(true)
        }

        const { data, error, count } = await fetchBookmarks(supabase, user.id, {
          from: 0,
          to: limit - 1,
        })

        if (error) {
          setErrorMessage(error.message)
          if (showLoading) {
            setBookmarks([])
          }
          setIsLoadingBookmarks(false)
          refreshInFlightRef.current = false
          return
        }

        const nextBookmarks = (data satisfies BookmarkRow[]).map(mapBookmarkRow)
        loadedCountRef.current = Math.max(nextBookmarks.length, PAGE_SIZE)
        setErrorMessage(null)
        setBookmarks(nextBookmarks)
        setTotalBookmarks(count ?? nextBookmarks.length)
        setIsLoadingBookmarks(false)
        showLoading = false
      } while (queuedRefreshRef.current)

      refreshInFlightRef.current = false
    },
    [user.id],
  )

  const loadMoreBookmarks = useCallback(async () => {
    if (isLoadingMore || bookmarks.length >= totalBookmarks) {
      return
    }

    const from = bookmarks.length
    const to = from + PAGE_SIZE - 1

    setIsLoadingMore(true)
    setErrorMessage(null)

    const { data, error, count } = await fetchBookmarks(supabase, user.id, {
      from,
      to,
    })

    if (error) {
      setErrorMessage(error.message)
      setIsLoadingMore(false)
      return
    }

    const nextBookmarks = (data satisfies BookmarkRow[]).map(mapBookmarkRow)
    setBookmarks((currentBookmarks) => appendUniqueBookmarks(currentBookmarks, nextBookmarks))
    loadedCountRef.current += nextBookmarks.length
    setTotalBookmarks(count ?? Math.max(totalBookmarks, from + nextBookmarks.length))
    setIsLoadingMore(false)
  }, [bookmarks.length, isLoadingMore, totalBookmarks, user.id])

  useEffect(() => {
    loadedCountRef.current = PAGE_SIZE
    setBookmarks([])
    setTotalBookmarks(0)
    void refreshBookmarks({ showLoading: true })
  }, [refreshBookmarks])

  useEffect(() => {
    const channel = supabase
      .channel(realtimeChannelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        () => {
          void refreshBookmarks({ showLoading: false })
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [realtimeChannelName, refreshBookmarks])

  useEffect(() => {
    const handleBroadcastSync = (incomingUserId?: string) => {
      if (incomingUserId === user.id) {
        void refreshBookmarks({ showLoading: false })
      }
    }

    let channel: BroadcastChannel | null = null

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      channel = new BroadcastChannel('bookmarks-sync')
      channel.onmessage = (event: MessageEvent<{ userId?: string }>) => {
        handleBroadcastSync(event.data?.userId)
      }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== getBookmarksSyncStorageKey(user.id) || !event.newValue) {
        return
      }

      try {
        const payload = JSON.parse(event.newValue) as { userId?: string }
        handleBroadcastSync(payload.userId)
      } catch {
        // Ignore malformed sync payloads.
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      if (channel) {
        channel.close()
      }
      window.removeEventListener('storage', handleStorage)
    }
  }, [refreshBookmarks, user.id])

  const handleLogout = async () => {
    setIsSigningOut(true)

    try {
      await signOut()
      window.location.assign('/')
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleSaveBookmark = async (values: BookmarkFormValues) => {
    setIsSavingBookmark(true)
    setErrorMessage(null)

    if (editingBookmark) {
      const { data, error } = await supabase
        .from('bookmarks')
        .update(mapBookmarkUpdate(values))
        .eq('id', editingBookmark.id)
        .eq('user_id', user.id)
        .select('id, user_id, title, url, created_at')
        .single()

      if (error) {
        setErrorMessage(error.message)
        setIsSavingBookmark(false)
        return
      }

      const updatedBookmark = mapBookmarkRow(data as BookmarkRow)
      await refreshBookmarks({ showLoading: false })
      toast({
        title: 'Bookmark updated',
        description: `"${updatedBookmark.title}" was saved successfully.`,
      })
      broadcastBookmarksSync(user.id)
    } else {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert(mapBookmarkInsert(user.id, values))
        .select('id, user_id, title, url, created_at')
        .single()

      if (error) {
        setErrorMessage(error.message)
        setIsSavingBookmark(false)
        return
      }

      const newBookmark = mapBookmarkRow(data as BookmarkRow)
      await refreshBookmarks({ showLoading: false })
      toast({
        title: 'Bookmark added',
        description: `"${newBookmark.title}" was added to your collection.`,
      })
      broadcastBookmarksSync(user.id)
    }

    setEditingBookmark(null)
    setAddModalOpen(false)
    setIsSavingBookmark(false)
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setAddModalOpen(true)
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarkToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (bookmarkToDelete) {
      setIsDeletingBookmark(true)
      setErrorMessage(null)
      const bookmarkTitle =
        bookmarks.find((bookmark) => bookmark.id === bookmarkToDelete)?.title ?? 'Bookmark'

      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkToDelete)
        .eq('user_id', user.id)

      if (error) {
        setErrorMessage(error.message)
        setIsDeletingBookmark(false)
        return
      }

      await refreshBookmarks({ showLoading: false })
      setBookmarkToDelete(null)
      toast({
        title: 'Bookmark deleted',
        description: `"${bookmarkTitle}" was removed successfully.`,
      })
      broadcastBookmarksSync(user.id)
    }

    setIsDeletingBookmark(false)
    setDeleteConfirmOpen(false)
  }

  const filteredBookmarks = bookmarks.filter((bookmark) =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const hasMoreBookmarks = bookmarks.length < totalBookmarks

  return (
    <div className="min-h-dvh bg-background">
      <Navbar
        user={user}
        onLogout={handleLogout}
        isSigningOut={isSigningOut}
        onAddNew={() => {
          setEditingBookmark(null)
          setAddModalOpen(true)
        }}
      />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
        {errorMessage ? (
          <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive sm:mb-6">
            {errorMessage}
          </div>
        ) : null}

        {isLoadingBookmarks ? (
          <div className="py-16 text-center text-sm text-muted-foreground sm:py-20">
            Loading bookmarks...
          </div>
        ) : (
          <BookmarkGrid
            bookmarks={filteredBookmarks}
            searchQuery={searchQuery}
            hasMore={hasMoreBookmarks}
            isLoadingMore={isLoadingMore}
            onSearchChange={setSearchQuery}
            onLoadMore={loadMoreBookmarks}
            onEdit={handleEditBookmark}
            onDelete={handleDeleteBookmark}
          />
        )}
      </main>

      <AddBookmarkModal
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open)
          if (!open) {
            setEditingBookmark(null)
          }
        }}
        onSave={handleSaveBookmark}
        initialBookmark={editingBookmark}
        isSaving={isSavingBookmark}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        isDeleting={isDeletingBookmark}
      />
    </div>
  )
}
