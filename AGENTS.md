# Dispofast Frontend — Agent Guide

## Overview

React SPA for the Dispofast logistics platform.

- **Framework:** React 19 + TypeScript
- **Build tool:** Vite
- **UI library:** Material UI (MUI) v7 + Tailwind CSS
- **State management:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP client:** Axios
- **Router:** React Router DOM v7
- **Backend API:** `http://localhost:8080/api/v1`

## Common Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/
│   └── layout/           # App shell, nav, route wrappers
├── modules/              # Feature modules (one per business domain)
│   ├── clients/
│   ├── iam/              # Auth, login, user management
│   └── quotes/
└── shared/               # Reusable across all modules
    ├── api/              # Axios instance and base API helpers
    ├── auth/             # Auth utilities and token helpers
    ├── components/       # Generic UI components (Button, Table, Input, etc.)
    ├── hooks/            # Generic custom hooks (useFetch, etc.)
    ├── store/            # Zustand global stores
    ├── types/            # Global TypeScript types
    └── utils/            # Pure helper functions
```

## Module Structure

Each feature module is self-contained. Follow this layout:

```
modules/{name}/
├── api/            # Axios calls specific to this module
├── components/     # UI components used only in this module
├── config/         # Route definitions or module-level constants
├── hooks/          # Custom hooks local to this module
├── pages/          # Page-level components (routed)
├── schema/         # Zod validation schemas
└── types/          # TypeScript types for this module
```

## Key Conventions

- **Path alias:** Use `@/` instead of relative paths (maps to `src/`). Example: `import { Button } from '@/shared/components/Button'`.
- **Forms:** Use React Hook Form with Zod schemas for validation. Never validate manually.
- **API calls:** Define all API calls inside `api/` of the corresponding module. Use the shared Axios instance from `@/shared/api/`.
- **State:** Prefer local React state. Use Zustand only for state that is genuinely global (auth, notifications, etc.).
- **Styling:** Prefer MUI components for layout and structure. Use Tailwind utilities for fine-grained spacing/overrides. Do not mix the two approaches arbitrarily.
- **Types:** Define types in the module's `types/` folder. Shared types go in `@/shared/types/`.

## Testing

- **Framework:** Jest 30 + React Testing Library + jest-dom
- **Environment:** jsdom
- **Coverage threshold:** 80% (lines, branches, functions, statements)
- **Setup file:** `jest.setup.ts`
- Run with `npm test`

## Environment Variables

Create a `.env` file in the project root (see `.env.example` if available):

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

All Vite env vars must be prefixed with `VITE_` to be accessible in the browser.

## Adding a New Module

1. Create `src/modules/{name}/` following the module structure above.
2. Add pages to the router (typically in `src/app/` or the module's `config/`).
3. Add API functions in `src/modules/{name}/api/`.
4. Define Zod schemas in `src/modules/{name}/schema/` for any forms.
5. Export types from `src/modules/{name}/types/`.
