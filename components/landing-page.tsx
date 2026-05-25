'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { AuthDialog } from '@/components/auth-dialog'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false)

  return (
    <>
      <main className="min-h-dvh overflow-x-hidden bg-gradient-to-br from-background via-background to-muted/30">
        <nav className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex min-w-0 items-center gap-2.5">
              <Bookmark className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" />
              <span className="truncate text-base font-semibold text-foreground sm:text-lg">
                KeenFlow
              </span>
            </div>
            <Button
              onClick={() => setAuthDialogOpen(true)}
              variant="default"
              size="sm"
              className="h-10 shrink-0 px-4 sm:px-5"
            >
              Get Started
            </Button>
          </div>
        </nav>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="space-y-10 text-center sm:space-y-12">
            <div className="space-y-4 sm:space-y-5">
              <h1 className="mx-auto max-w-5xl text-balance text-4xl font-semibold leading-[1.05] text-foreground min-[420px]:text-5xl sm:text-6xl lg:text-7xl">
                Your bookmarks, organized beautifully
              </h1>
              <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-xl sm:leading-8 lg:text-2xl">
                Save, organize, and find your favorite links instantly. A minimal bookmark
                manager designed for productivity.
              </p>
            </div>

            <div className="pt-2 sm:pt-4">
              <Button
                onClick={() => setAuthDialogOpen(true)}
                size="lg"
                className="h-11 min-w-[12rem] px-6 text-sm sm:h-12 sm:px-8 sm:text-base"
              >
                Start Organizing
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-border/40 pt-10 sm:gap-6 sm:pt-14 lg:grid-cols-3 lg:gap-8 lg:pt-16">
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                    <Bookmark className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Quick Save</h3>
                <p className="text-sm text-muted-foreground">
                  Save any link with one click and organize it instantly
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                    <Bookmark className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Fast Search</h3>
                <p className="text-sm text-muted-foreground">
                  Find any bookmark instantly with powerful search
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                    <Bookmark className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground">Beautiful Design</h3>
                <p className="text-sm text-muted-foreground">
                  Minimal interface that gets out of your way
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
    </>
  )
}
