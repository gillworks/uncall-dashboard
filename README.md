# Voice Assistant Dashboard

## Overview

This is a starter template using the following stack:

- Framework - [Next.js 14](https://nextjs.org/)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [NextAuth.js](https://next-auth.js.org)
- Database - [Supabase](https://supabase.com) & [Postgres](https://vercel.com/postgres)
- Deployment - [Vercel](https://vercel.com/docs/concepts/next.js/overview)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- Components - [Shadcn UI](https://ui.shadcn.com/)
- State Management - [Jotai](https://jotai.org)
- Voice API Integration - [VAPI](https://vapi.ai)
- Analytics - [Vercel Analytics](https://vercel.com/analytics)
- Formatting - [Prettier](https://prettier.io)

This dashboard uses the Next.js App Router and includes features like:

- Task management with real-time updates
- Voice Assistant configuration and management
- Phone number management
- Call handling and tracking
- Dark/Light mode support
- Responsive design with mobile support

## Getting Started

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up your environment variables:

- Copy `.env.example` to `.env`
- Configure the following required services:
  - Supabase project for database and real-time features
  - GitHub OAuth for authentication
  - VAPI for voice assistant integration

3. Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Your Supabase anonymous key
AUTH_GITHUB_ID=                    # GitHub OAuth app ID
AUTH_GITHUB_SECRET=                # GitHub OAuth app secret
NEXTAUTH_URL=                      # Your app URL (http://localhost:3000 for local)
AUTH_SECRET=                       # Generate using https://generate-secret.vercel.app/32
VAPI_API_KEY=                      # VAPI API key
VAPI_SECRET=                       # VAPI secret
VAPI_SERVER_URL=                   # VAPI server URL
```

4. Start the development server:

```bash
pnpm dev
```

Your application should now be running at http://localhost:3000.

## Database Schema

The application requires the following tables in your Supabase database:

- `assistants`: Stores voice assistant configurations
- `tasks`: Manages outbound call tasks
- `calls`: Tracks call history and status
- `numbers`: Manages phone numbers for inbound/outbound calls

## Features

### Tasks

- Create and manage outbound call tasks
- Real-time status updates
- Assign tasks to specific voice assistants

### Assistants

- Configure voice assistant personalities
- Customize voice and conversation styles
- Manage assistant availability

### Numbers

- Add and manage phone numbers
- Configure Twilio integration settings
- Assign numbers to specific assistants

### Calls

- Track call history and status
- Access call recordings and transcripts
- Real-time call monitoring

## License

MIT License - See [LICENSE](LICENSE.md) for details
