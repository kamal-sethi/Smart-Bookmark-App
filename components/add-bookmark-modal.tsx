'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Bookmark } from '@/lib/types'

const CATEGORIES = ['Development', 'Design', 'Reading', 'Learning', 'Tools', 'Reference', 'Other']

interface AddBookmarkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void
  initialBookmark?: Bookmark | null
}

export function AddBookmarkModal({
  open,
  onOpenChange,
  onSave,
  initialBookmark,
}: AddBookmarkModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Development')
  const [isLoading, setIsLoading] = useState(false)
  const [urlError, setUrlError] = useState('')

  useEffect(() => {
    if (initialBookmark) {
      setTitle(initialBookmark.title)
      setUrl(initialBookmark.url)
      setDescription(initialBookmark.description)
      setCategory(initialBookmark.category)
    } else {
      setTitle('')
      setUrl('')
      setDescription('')
      setCategory('Development')
    }
    setUrlError('')
  }, [initialBookmark, open])

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    setIsLoading(true)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 600))
    
    onSave({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      category,
    })

    setTitle('')
    setUrl('')
    setDescription('')
    setCategory('Development')
    setUrlError('')
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {initialBookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {initialBookmark 
              ? 'Update the details of your bookmark'
              : 'Save a new link to your collection'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="React Documentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://react.dev"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setUrlError('')
              }}
              required
              disabled={isLoading}
              className={urlError ? 'border-destructive' : ''}
            />
            {urlError && (
              <p className="text-xs text-destructive">{urlError}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              placeholder="A brief description of this bookmark"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50 resize-none h-20 sm:h-24"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:opacity-50"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-9 sm:h-10 text-sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-9 sm:h-10 text-sm"
            >
              {isLoading 
                ? (initialBookmark ? 'Updating...' : 'Saving...') 
                : (initialBookmark ? 'Update' : 'Save')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
