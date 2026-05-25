'use client'

import { useState } from 'react'
import { Navbar } from './navbar'
import { BookmarkGrid } from './bookmark-grid'
import { AddBookmarkModal } from './add-bookmark-modal'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import { type Bookmark } from '@/lib/types'

interface DashboardProps {
  userEmail: string
  onLogout: () => void
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: '1',
      title: 'React Documentation',
      url: 'https://react.dev',
      description: 'Official React documentation and guides',
      category: 'Development',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Tailwind CSS',
      url: 'https://tailwindcss.com',
      description: 'Utility-first CSS framework',
      category: 'Design',
      createdAt: new Date(),
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  const handleAddBookmark = (newBookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    if (editingBookmark) {
      setBookmarks(bookmarks.map(b => 
        b.id === editingBookmark.id 
          ? { ...newBookmark, id: editingBookmark.id, createdAt: editingBookmark.createdAt }
          : b
      ))
      setEditingBookmark(null)
    } else {
      const bookmark: Bookmark = {
        ...newBookmark,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      setBookmarks([bookmark, ...bookmarks])
    }
    setAddModalOpen(false)
  }

  const handleEditBookmark = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setAddModalOpen(true)
  }

  const handleDeleteBookmark = (id: string) => {
    setBookmarkToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (bookmarkToDelete) {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkToDelete))
      setBookmarkToDelete(null)
    }
    setDeleteConfirmOpen(false)
  }

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        userEmail={userEmail} 
        onLogout={onLogout}
        onAddNew={() => {
          setEditingBookmark(null)
          setAddModalOpen(true)
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookmarkGrid 
          bookmarks={filteredBookmarks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onEdit={handleEditBookmark}
          onDelete={handleDeleteBookmark}
        />
      </main>

      <AddBookmarkModal
        open={addModalOpen}
        onOpenChange={(open) => {
          setAddModalOpen(open)
          if (!open) setEditingBookmark(null)
        }}
        onSave={handleAddBookmark}
        initialBookmark={editingBookmark}
      />

      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
