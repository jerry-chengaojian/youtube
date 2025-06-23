# YouTube Clone

A full-stack YouTube clone built with Next.js, Prisma, and PostgreSQL.

## Features

- Video upload and streaming
- User authentication
- Comments and replies
- Like/dislike system
- Subscriptions
- Personalized feed
- Studio dashboard for creators

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **State Management**: TanStack Query

## Project Structure

Key directories:

- `src/app` - Next.js app router
  - `(home)` - Public facing pages
  - `(studio)` - Creator studio pages
  - `api` - API routes
- `src/components` - Reusable components
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up PostgreSQL database
4. Configure environment variables (copy `.env.example` to `.env`)
5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `dev`: Start development server
- `build`: Create production build
- `start`: Start production server
- `lint`: Run ESLint
- `prisma`: Prisma CLI commands

## Environment Variables

See `.env.example` for required variables.

## Deployment

The project is configured for Vercel deployment. https://youtube-1pxv.vercel.app 