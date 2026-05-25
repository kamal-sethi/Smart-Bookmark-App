'use client'

import { useState } from 'react'
import { LandingPage } from '@/components/landing-page'
import { AuthDialog } from '@/components/auth-dialog'
import { Dashboard } from '@/components/dashboard'

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleGetStarted = () => {
    setAuthDialogOpen(true)
  }

  const handleAuthenticate = (email: string) => {
    setUserEmail(email)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserEmail('')
  }

  if (isAuthenticated) {
    return <Dashboard userEmail={userEmail} onLogout={handleLogout} />
  }

  return (
    <>
      <LandingPage onGetStarted={handleGetStarted} />
      <AuthDialog 
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onAuthenticate={handleAuthenticate}
      />
    </>
  )
}
