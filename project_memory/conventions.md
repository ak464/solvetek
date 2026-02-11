# Coding Conventions

## Naming Standards
- **Directories**: lowercase-dash-separated (e.g., `app/admin`, `components/ui`).
- **React Components**: PascalCase (e.g., `MonetizationRenderer.tsx`, `Sidebar.tsx`).
- **Functions/Vars**: camelCase (e.g., `fetchArticles`, `isLoading`).
- **Constants**: UPPER_SNAKE_CASE (e.g., `DEFAULT_PAGE_SIZE`, `KNOWN_CATEGORIES`).

## Tech Stack Specifics
### Next.js 16
- Use `page.tsx` for route roots.
- Use `layout.tsx` for wrapping styles/providers.
- Default to **Server Components**. Mark Client Components explicitly with `"use client";`.
- Use `next/image` only for local static assets or optimized remote images. For dynamic content where aspect ratio varies, standard `img` with standard Tailwind classes is acceptable for simplicity in MVP.

### Tailwind CSS 4
- Do not use `@apply` in CSS files unless necessary for global overrides.
- Use utility classes directly in JSX.
- Use `clsx` or `tailwind-merge` for conditional classes.

### Database (Supabase)
- Table names: `snake_case` (e.g., `affiliate_links`).
- RLS Policies: Always enable RLS. Default to "deny all" and whitelist specific roles.

## Best Practices
1.  **Strict Types**: Avoid `any` where possible. Use types from `@/lib/types/database.ts`.
2.  **Absolute Imports**: Use `@/components/...` instead of `../../components/...`.
3.  **Clean Components**: Keep components small. Extract logic to custom hooks or helper functions in `lib/utils` if it exceeds ~100 lines.

## Documentation Discipline
-   **Strict Sync**: Changes to code must be accompanied by updates to `/project_memory`.
-   **Refer to Protocol**: See [MAINTENANCE_PROTOCOL.md](./MAINTENANCE_PROTOCOL.md) for details.
