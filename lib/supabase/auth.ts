import { type User } from '@supabase/supabase-js'

export function getUserDisplayName(user: User) {
  const fullName = user.user_metadata.full_name as string | undefined
  const name = user.user_metadata.name as string | undefined

  return fullName || name || user.email || 'KeenFlow User'
}

export function getUserAvatarUrl(user: User) {
  const avatarUrl = user.user_metadata.avatar_url as string | undefined
  const picture = user.user_metadata.picture as string | undefined

  return avatarUrl || picture || null
}

export function getUserInitials(user: User) {
  const displayName = getUserDisplayName(user).trim()
  const parts = displayName.split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return 'KF'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}
