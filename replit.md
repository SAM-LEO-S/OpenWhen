# Open When - Bible Verse Companion App

## Overview

"Open When" is a personalized Bible verse companion app designed to provide comfort, guidance, and spiritual support through emotion-based Bible verses. The application offers a card-based interface where users can select their current emotional state and receive relevant Bible verses with personalized messages of encouragement.

## System Architecture

### Frontend Architecture
- **React SPA** built with Vite for fast development and optimized builds
- **shadcn/ui** component library with Radix UI primitives for accessibility
- **Tailwind CSS** for styling with custom Orthodox Christian-inspired design tokens
- **Framer Motion** for smooth animations and transitions
- **React Query** for server state management and caching
- **Wouter** for lightweight client-side routing

### Backend Architecture
- **Express.js** server with TypeScript for type safety
- **RESTful API** design with emotion-based verse endpoints
- **In-memory storage** with fallback to external Bible API
- **Bible API integration** using bible-api.com for dynamic verse fetching
- **Session-based request logging** and error handling middleware

### Database Schema
The application uses Drizzle ORM with PostgreSQL dialect for type-safe database operations:

- **verses table**: Stores Bible verses with emotion categories, text, references, and personal messages
- **user_preferences table**: Stores user theme preferences and settings
- Emotion categories: anxious, happy, sad, grateful, strength, lonely, guidance, angry, anything

## Key Components

### Core Features
1. **Emotion-based Verse Selection**: Users select from 8 emotion categories plus a special "anything" option
2. **Dynamic Verse Fetching**: Primary fetching from local storage with fallback to Bible API
3. **Theme System**: Light/dark mode with Orthodox Christian color palette
4. **Offline Support**: Local storage caching for previously viewed verses
5. **Responsive Design**: Mobile-first design optimized for all screen sizes

### UI Components
- **Emotion Cards**: Interactive cards for each emotional state with custom styling
- **Verse Display**: Formatted Bible verse with reference and personal message
- **Theme Toggle**: Seamless light/dark mode switching
- **Loading States**: Elegant loading indicators and error boundaries

### API Endpoints
- `GET /api/verses/:emotion` - Fetch random verse by emotion category
- Theme and preference management through local storage

## Data Flow

1. **User Interaction**: User selects emotion card on home screen
2. **Verse Retrieval**: System checks local storage first, then falls back to Bible API
3. **Content Display**: Verse displayed with formatted text, reference, and personal message
4. **Caching**: Successful API responses cached locally for offline access
5. **Theme Persistence**: User preferences saved to localStorage

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- UI libraries (shadcn/ui, Radix UI components)
- Styling (Tailwind CSS, class-variance-authority)
- Animation (Framer Motion)
- Utility libraries (clsx, date-fns)

### Backend Dependencies
- Express.js with TypeScript support
- Drizzle ORM for database operations
- Neon Database serverless connection
- Bible API integration via fetch

### Development Dependencies
- Vite for build tooling
- TypeScript for type safety
- ESBuild for server bundling
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

### Environment Configuration
- **Development**: Node.js 20 with Vite dev server on port 5000
- **Production**: Optimized build with static file serving
- **Database**: PostgreSQL via Neon with connection pooling

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with ESBuild to `dist/index.js`
3. Static assets served from Express in production
4. Environment variables for database connection

### Hosting
- Configured for Replit deployment with autoscale
- PostgreSQL module enabled for database support
- Port 5000 mapped to external port 80

## Changelog

```
Changelog:
- June 17, 2025: Initial setup
- June 17, 2025: Successfully implemented complete Bible verse companion app with emotion-based cards, Orthodox Christian design, theme switching, Bible API integration, offline caching, and crisis support functionality. User confirmed satisfaction with the implementation.
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```