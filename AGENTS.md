# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

**cp-menus** is a restaurant digital menu management SaaS. Tech stack: Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Convex (serverless backend/DB), Clerk (auth), Bun (package manager).

### Required environment variables

The app requires these secrets to function (set in `.env.local`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk backend key |

Without valid Clerk keys, the dev server starts but all pages return 500 ("Publishable key not valid"). `next build` also fails at static prerendering for the same reason.

### Commands

| Task | Command |
|---|---|
| Install deps | `bun install` |
| Dev server | `bun run dev` (port 3000) |
| Build | `bun run build` |
| Lint | `bun run lint` (runs `eslint`) |

### Gotchas

- The lockfile is `bun.lock` — always use `bun install`, not npm/yarn/pnpm.
- There is no middleware file; Clerk auth is enforced via `ClerkProvider` in the root layout (`providers/providers.tsx`).
- The Convex backend runs in the cloud (`npx convex dev` syncs local schema/functions); there is no local DB to start.
- ESLint exits with code 1 due to pre-existing warnings/errors in the codebase — this is the baseline, not a setup issue.
- The `convex/_generated/` directory is auto-generated and should not be manually edited.
