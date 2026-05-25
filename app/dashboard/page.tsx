import { redirect } from 'next/navigation'
import { Dashboard } from '@/components/dashboard'
import { getCurrentUser } from '@/lib/supabase/server'

export default async function DashboardRoute() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  return <Dashboard user={user} />
}
