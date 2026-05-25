export interface Bookmark {
  id: string
  userId: string
  title: string
  url: string
  createdAt: string | null
}

export interface BookmarkFormValues {
  title: string
  url: string
}
