import { redirect } from 'next/navigation'
import { LandingPage } from '@/components/landing-page'
import { getCurrentUser } from '@/lib/supabase/server'

export default async function Page() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/dashboard')
  }

  return <LandingPage />
}
