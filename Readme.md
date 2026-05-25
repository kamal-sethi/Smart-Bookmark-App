# Smart Bookmark App

A modern real-time bookmark management application built with Next.js, Supabase, Tailwind CSS, and shadcn/ui.

The application allows users to securely save, manage, and organize bookmarks with Google OAuth authentication, real-time synchronization across tabs, and a polished responsive user experience.

## Live Demo

https://bookmark-smart.vercel.app/

---

# Features

## Authentication

* Google OAuth authentication using Supabase Auth
* Persistent user sessions
* Protected dashboard routes
* Secure logout flow

## Bookmark Management

* Add bookmarks with title and URL
* Edit existing bookmarks
* Delete bookmarks with confirmation dialog
* Search/filter bookmarks
* Paginated bookmark loading

## Real-Time Sync

* Real-time bookmark synchronization using Supabase Realtime
* Updates instantly across multiple tabs/windows without refresh

## Security

* Private bookmarks enforced using Supabase Row Level Security (RLS)
* Users can only access their own bookmarks

## UI/UX

* Fully responsive design
* Modern SaaS-inspired interface
* Skeleton loading states
* Empty states
* Keyboard shortcuts
* Smooth transitions and polished interactions

---

# Tech Stack

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* Supabase
* Vercel

---

# Supabase Authentication Setup

Authentication was implemented using Supabase Auth with Google OAuth.

The flow:

1. User clicks "Continue with Google"
2. Supabase handles OAuth authentication
3. User is redirected back to the application
4. Session is persisted automatically
5. Protected routes verify authenticated sessions before rendering dashboard pages

The application uses Supabase session handling to maintain authentication state across refreshes and tabs.

---

# Database Schema

## bookmarks table

```sql
create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);
```

---

# Row Level Security (RLS)

RLS was enabled on the `bookmarks` table to ensure bookmark privacy at the database level.

This prevents users from accessing bookmarks that do not belong to them.

## Policies

### SELECT Policy

Users can only view their own bookmarks.

```sql
using (auth.uid() = user_id)
```

### INSERT Policy

Users can only insert bookmarks associated with their own user ID.

```sql
with check (auth.uid() = user_id)
```

### UPDATE Policy

Users can only update their own bookmarks.

```sql
using (auth.uid() = user_id)
```

### DELETE Policy

Users can only delete their own bookmarks.

```sql
using (auth.uid() = user_id)
```

These policies ensure security is enforced directly in the database rather than relying only on frontend filtering.

---

# Real-Time Synchronization

Real-time synchronization was implemented using Supabase Realtime subscriptions.

The application subscribes to PostgreSQL changes on the `bookmarks` table using:

* INSERT
* UPDATE
* DELETE

Whenever changes occur:

* the bookmark list updates instantly
* multiple browser tabs stay synchronized without refresh

## Subscription Cleanup

Realtime subscriptions are properly cleaned up when components unmount to avoid:

* duplicate listeners
* unnecessary subscriptions
* memory leaks

The cleanup removes active channels during component teardown.

---

# Bonus Feature Added

## Incremental Pagination / Load More

Instead of fetching all bookmarks at once, bookmarks are loaded incrementally in batches.

Why this was added:

* improves scalability
* reduces unnecessary database reads
* improves performance for large bookmark collections
* creates a cleaner user experience

This feature demonstrates production-oriented thinking around performance and scalability.

Additional small enhancements:

* keyboard shortcuts for faster interactions
* skeleton loading states
* responsive optimization
* improved dashboard UX

---

# Problems Faced & Solutions

## 1. OAuth Redirect Issues

One challenge was configuring Google OAuth correctly across local and production environments.

### Solution

Configured:

* Supabase URL settings
* redirect URLs
* Google OAuth callback URLs

to ensure authentication worked correctly after deployment on Vercel.

---

## 2. Realtime Subscription Duplication

Realtime listeners initially created duplicate updates when components re-rendered.

### Solution

Added proper subscription cleanup logic and centralized realtime subscription handling using React effects cleanup functions.

---

## 3. Pagination + Realtime Sync

Combining realtime updates with paginated bookmark fetching required careful state handling to avoid duplicate or inconsistent UI updates.

### Solution

Implemented clean bookmark refetching logic after realtime events while maintaining pagination state consistency.

---

# One Thing I Would Improve With More Time

If given more time, I would extend the application with a browser extension that allows users to save bookmarks directly from any webpage with a single click.

The extension would:

* automatically capture the current page URL
* auto-fill metadata like title and favicon
* reduce friction in the bookmarking workflow

I would also explore AI-assisted bookmark descriptions and automatic metadata extraction to improve organization and discoverability.

---

# Local Development Setup

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run Development Server

```bash
npm run dev
```

---

# Deployment

The application is deployed on Vercel.

Production environment variables were configured using Vercel Environment Variables along with Supabase authentication redirect configuration.

---

# Final Notes

This project was built with a focus on:

* clean architecture
* secure database access
* real-time user experience
* polished frontend UX
* production-style scalability considerations

The goal was not only to satisfy the assignment requirements, but to approach the project like a real modern SaaS product.
