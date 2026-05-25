import { type SupabaseClient } from '@supabase/supabase-js'
import { type Bookmark, type BookmarkFormValues } from '@/lib/types'

export interface BookmarkRow {
  id: string
  user_id: string
  title: string
  url: string
  created_at: string | null
}

export function mapBookmarkRow(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    url: row.url,
    createdAt: row.created_at,
  }
}

export function mapBookmarkInsert(userId: string, values: BookmarkFormValues) {
  return {
    user_id: userId,
    title: values.title.trim(),
    url: values.url.trim(),
  }
}

export function mapBookmarkUpdate(values: BookmarkFormValues) {
  return {
    title: values.title.trim(),
    url: values.url.trim(),
  }
}

export async function fetchBookmarks(
  supabase: SupabaseClient,
  userId: string,
  range: {
    from: number
    to: number
  },
) {
  return supabase
    .from('bookmarks')
    .select('id, user_id, title, url, created_at', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(range.from, range.to)
}
