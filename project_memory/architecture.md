# Technical Architecture

## System Design
The application follows a modern **Server-Side Rendering (SSR)** architecture using Next.js App Router. It leverages **Supabase** for backend-as-a-service (Auth, Database, Storage).

### High-Level Components
1.  **Frontend (Next.js)**:
    -   **App Router**: Uses server components for data fetching and SEO optimization.
    -   **Client Components**: Used for interactive UI (Editor, Admin forms, Mobile menu).
    -   **Tailwind CSS**: Utility-first styling for specific design requirements (Arabic-first layout `dir="rtl"`).

2.  **Backend & Database (Supabase)**:
    -   **PostgreSQL**: Relational data storage.
    -   **Auth**: Handling user sessions and role-based access (Admin/User).
    -   **Row Level Security (RLS)**: Enforcing data access policies directly at the database layer.

## Directory Structure
```
/app
  /admin        # Admin dashboard (protected routes)
  /auth         # Authentication pages (login)
  /guides       # Public content pages (dynamic routes)
  /api          # API endpoints (if any detailed server logic is needed)
  /loading.tsx  # Global loading states
  /layout.tsx   # Root layout (Fonts, Providers)

/components
  /admin        # Admin-specific UI components
  /features     # Feature-specific logic (Monetization, Editor, etc.)
  /layout       # Shared layout components (Header, Footer, Sidebar)
  /ui           # Reusable atomic UI components

/lib
  /supabase     # Supabase client initialization (Server & Client)
  /types        # TypeScript interfaces and database types
```

## Key Architectural Decisions
-   **Server Components First**: Data fetching happens on the server for performance and SEO.
-   **Centralized Monetization**: Ad and affiliate logic is decoupled from content, managed via a dedicated `MonetizationRenderer` component.
-   **Rich Text Handling**: HTML content from Tiptap is stored directly but rendered with careful sanitization and styling.
