'use client'

import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">KeenFlow</span>
          </div>
          <Button onClick={onGetStarted} variant="default" size="sm">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-foreground text-pretty leading-tight">
              Your bookmarks, organized beautifully
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Save, organize, and find your favorite links instantly. A minimal bookmark manager designed for productivity.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="text-base h-12 px-8"
            >
              Start Organizing
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 border-t border-border/40">
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground">Quick Save</h3>
              <p className="text-sm text-muted-foreground">
                Save any link with one click and organize it instantly
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-foreground">Fast Search</h3>
              <p className="text-sm text-muted-foreground">
                Find any bookmark instantly with powerful search
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bookmark className="w-6 h-6 text-primary" />
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
  )
}
