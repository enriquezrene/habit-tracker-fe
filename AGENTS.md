# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Next.js dev server (localhost:3000)
- `npm run build` — Production build
- `npm run lint` — ESLint (expect `<img>` warnings for dynamic Firebase URLs — these are intentional)
- `npm test` — Run all Vitest tests
- `npm run test:watch` — Watch mode
- `npm run test:coverage` — Coverage report (v8 provider)
- Run a single test file: `npx vitest run src/lib/dominio/formatear-precio.test.ts`
- Cloud Functions have their own package.json in `functions/`; install and build separately there

## Architecture

**Peer-to-peer rental marketplace for Ecuador** (todoesalquilable.com). Users list personal items (tools, electronics, sports gear, vehicles, camping equipment, etc.) for rent at hourly/daily/weekly/monthly rates in USD. Renters browse by category, province, and price, then contact owners directly via WhatsApp — there is no in-app messaging, payments, or booking system. All listings go through admin moderation before becoming visible. Built as a Next.js 14 App Router frontend connecting directly to Firebase (Auth, Firestore, Storage) with no custom backend API. Server-side logic lives only in three Firebase Cloud Functions for user/role management (`functions/src/`).

## Directory Structure

```
├── functions/                  # Firebase Cloud Functions (separate tsconfig & package.json)
│   └── src/                    # Auth triggers and callable functions for role management
├── public/images/              # Static assets and seed images
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── (auth)/             # Public auth pages (login, register) — no navbar
│   │   ├── (main)/             # Core app pages — shared layout with navbar
│   │   │   ├── anuncio/[id]/   # Listing detail page
│   │   │   ├── buscar/         # Search with filters
│   │   │   ├── mis-anuncios/   # User's own listings + editar/[id] for editing
│   │   │   ├── perfil/         # Profile view/edit + public profile [id]
│   │   │   └── publicar/       # Multi-step listing creation form
│   │   ├── admin/              # Admin panel — own layout with sidebar
│   │   │   ├── categorias/     # Category CRUD
│   │   │   ├── pendientes/     # Moderation queue
│   │   │   └── usuarios/       # User/role management
│   │   └── seed/               # Dev-only database seeding page
│   ├── features/               # Feature modules (components + services + types each)
│   │   ├── admin/              # Moderation UI and admin services
│   │   ├── auth/               # Login/register forms, AuthGuard, validation
│   │   ├── listings/           # Listing CRUD, multi-step form, cards, gallery
│   │   ├── profile/            # Profile card/form and profile service
│   │   └── search/             # Search bar, filter panel, search service
│   ├── lib/
│   │   ├── dominio/            # Pure domain functions (Spanish-named, fully tested)
│   │   ├── firebase/           # Firebase SDK wrappers (auth, firestore, storage, config)
│   │   └── imagenes/           # Client-side image compression
│   ├── shared/                 # Cross-feature reusable code
│   │   ├── components/         # UI primitives (Button, Input), Layout, Feedback
│   │   ├── providers/          # AuthProvider, ToastProvider
│   │   └── types/              # Global TypeScript types
│   └── test/                   # Vitest setup and shared mocks
├── firestore.rules             # Firestore security rules (role-based access)
└── firestore.indexes.json      # Composite index definitions
```

### Route Groups (`src/app/`)

- `(auth)/` — Login (`iniciar-sesion`), Register (`registrarse`) — public, no nav
- `(main)/` — Core app: search (`buscar`), listing detail (`anuncio/[id]`), publish (`publicar`), my listings (`mis-anuncios` + `editar/[id]`), profile (`perfil`, `perfil/[id]`)
- `admin/` — Own layout with sidebar: moderation queue (`pendientes`), users (`usuarios`), categories (`categorias`), config, reports
- `seed/` — Dev-only data seeding page

### Feature Modules (`src/features/`)

Each feature owns its `components/`, `services/`, and `types.ts`:

- **auth** — LoginForm, RegisterForm, AuthGuard, form validation
- **listings** — Multi-step creation form (Categoria → Fotos → Detalles → Precio → Revision), ListingCard, PhotoGallery, WhatsAppButton, image/listing services, edit form with CambiosRequeridosCard
- **search** — SearchBar (debounced), FilterPanel, search service (Firestore queries with cursor pagination)
- **profile** — ProfileCard, ProfileForm, profile service
- **admin** — ListingReviewCard, AdminSidebar, moderation/user/category services

### Shared Layer (`src/shared/`)

- `components/` — Reusable UI (Button, Input, etc.), Layout, Feedback
- `providers/` — AuthProvider, ToastProvider
- `types/` — Global type definitions

### Domain Logic (`src/lib/dominio/`)

Pure functions with full test coverage, **all named in Spanish**: provinces, phone validation (+593), email validation, price formatting/ranges, date formatting, WhatsApp link builder, listing states, item conditions, price units, initial categories.

### Firebase Layer (`src/lib/firebase/`)

- `firebase-config.ts` — Lazy singleton pattern (not Proxy): `getAuthInstance()`, `getDbInstance()`, `getStorageInstance()` to avoid SSR initialization issues
- `firebase-auth.ts`, `firebase-firestore.ts`, `firebase-storage.ts` — Service wrappers

### Cloud Functions (`functions/src/`)

- `onUserCreated` — Auth trigger: sets `role: 'user'` custom claim, creates user doc in Firestore
- `setUserRole` — Callable: role assignment, restricted to `super_admin`
- `bootstrapAdmin` — Callable: one-time first super_admin setup

## Data Model (Firestore)

- **users** — uid, email, displayName, phone, province, city, role (`user` | `moderator` | `admin` | `super_admin`), activeListingCount
- **listings** — title, titleLower, description, categoryId/Name, condition, price/priceUnit, province, images[], status (`pendiente` | `aprobado` | `rechazado` | `cambios_requeridos`), ownerId, moderatorId
- **categories** — name, nameLower, icon, listingCount, isActive
- **suggestedCategories**, **reports** — user-submitted, moderator-managed

## Coding Conventions

### Language & Naming
- All domain files, types, variables, and UI strings are in **Spanish** (e.g. `crearAnuncio`, `FormularioAnuncio`, `validarPasoCategoria`, `registrarError`)
- Firestore collection names and field names remain in **English** (`listings`, `users`, `categories`, `createdAt`, `ownerId`)
- File names use **kebab-case in Spanish** for domain/service files (`validar-anuncio.ts`, `formatear-precio.ts`, `estados-anuncio.ts`) and **PascalCase** for components (`ListingCard.tsx`, `StepCategoria.tsx`)

### Types
- `type` over `interface` throughout the codebase
- Domain enums use `as const` objects with derived union types: `const ESTADOS_ANUNCIO = { ... } as const; type EstadoAnuncio = (typeof ESTADOS_ANUNCIO)[keyof typeof ESTADOS_ANUNCIO]`
- Companion lookup records for labels and styles: `etiquetasEstado`, `coloresEstado`, `etiquetasUnidad`
- Component props defined as `type Props = { ... }` or `type XxxProps = { ... }` inline above the component
- Validation functions return `ErroresFormulario` (a `Record<string, string>`) — empty object means valid

### Components
- Function components with `export default function` — no arrow-function exports for components
- Client components explicitly marked with `'use client'`
- Shared UI primitives in `src/shared/components/ui/` (Button, Input, Select, Card, Badge, Modal, Spinner, Skeleton)
- Errors displayed via `role="alert"` paragraphs: `<p className="... text-red-600" role="alert">{error}</p>`
- Tailwind classes written inline — no CSS modules or styled-components

### Services
- Exported as **standalone async functions**, not classes (e.g. `crearAnuncio()`, `buscarAnuncios()`, `registrarUsuario()`)
- Firebase SDK accessed via lazy singletons: `getDb()`, `getAuthInstance()`, `getStorageInstance()` — never import `db` or `auth` directly
- Firestore imports come from the wrapper `@/lib/firebase/firebase-firestore`, not from `firebase/firestore` directly
- Timestamps: always use `serverTimestamp()` for writes; convert with `.toDate()` on reads
- `docToAnuncio()` pattern: each service has a private mapper from Firestore doc to typed domain object

### Error Handling
- Errors logged via `registrarError(error, 'Context:detail')` which logs to console and reports to Sentry
- Context strings use `Component:action` format (e.g. `'StepCategoria:cargar-categorias'`)

### Testing
- Tests co-located with source files (`*.test.ts` / `*.test.tsx`)
- Vitest setup in `src/test/setup.ts`, jsdom environment, globals enabled
- Domain functions have pure unit tests; components tested with React Testing Library

### Project Setup
- Path alias: `@/*` maps to `./src/*`
- `functions/` excluded from root `tsconfig.json` to prevent build conflicts
- Pages using `useSearchParams` must be wrapped in `<Suspense>` for static generation

## Rules

### Do

- **Write new domain/service code in Spanish** — function names, variables, types, and file names follow the existing Spanish convention (`crearAnuncio`, `validarPasoCategoria`, `formatear-precio.ts`)
- **Keep Firestore field names in English** — `createdAt`, `ownerId`, `status`, `titleLower` (this is the established split)
- **Import Firebase through the wrappers** — use `@/lib/firebase/firebase-firestore`, `@/lib/firebase/firebase-auth`, `@/lib/firebase/firebase-storage`. These re-export Firebase SDK functions and provide lazy-initialized instances via `getDb()`, `getAuthInstance()`, `getStorageInstance()`
- **Use `serverTimestamp()` for all Firestore writes** on `createdAt`/`updatedAt` fields, and convert with `.toDate()` when reading
- **Use `registrarError(error, 'Component:action')` for error handling** — this logs to console and reports to Sentry. Use the `Component:action` format for context strings
- **Write tests for new domain functions and components** — domain tests are pure unit tests; component tests use React Testing Library with test data factories from `@/test/mocks/`
- **Write test descriptions in Spanish** to match the existing test suite (`'muestra el título del anuncio'`, `'formatea precio sin unidad'`)
- **Use `type` for TypeScript type definitions** — not `interface`
- **Use `as const` objects for enums** with derived union types and companion label/color records (see `estados-anuncio.ts` as the pattern)
- **Use shared UI components** from `@/shared/components/ui/` (Button, Input, Select, Card, Badge, Modal, Spinner, Skeleton) instead of raw HTML elements for form controls and common UI
- **Wrap protected pages with `AuthGuard`** and pass `requiredRole` for role-restricted pages
- **Add `'use client'` directive** to any component that uses hooks, event handlers, or browser APIs

### Don't

- **Don't import directly from `firebase/firestore`**, `firebase/auth`, or `firebase/storage` in feature or page code — always go through the `@/lib/firebase/` wrappers
- **Don't instantiate Firebase with `getFirestore()`/`getAuth()`/`getStorage()` directly** — use the singleton getters from `firebase-config.ts`
- **Don't use classes or OOP patterns** — all services are standalone exported functions, not class methods
- **Don't use `interface`** — the codebase uses `type` exclusively
- **Don't use `next/image`** for images with dynamic Firebase Storage URLs — use `<img>` tags (this is intentional; the lint warnings are expected)
- **Don't hardcode listing statuses as strings** — use `ESTADOS_ANUNCIO.PENDIENTE` etc. from `@/lib/dominio/estados-anuncio`
- **Don't mix English into Spanish-named files** — if a domain file is in Spanish, keep its exports in Spanish
- **Don't put feature-specific components in `shared/`** — only truly cross-feature, reusable primitives belong there
- **Don't skip the moderation flow** — new listings must start as `'pendiente'`; only moderators/admins can change status
- **Don't add Firebase SDK calls directly in components** — data fetching goes in service files under the feature's `services/` directory; components call those services

## Security Model

- **Firestore rules** (`firestore.rules`): role-based access with helper functions (`isModerator`, `isAdmin`, `isSuperAdmin`), ownership checks, field-level protection on moderation fields
- **Roles hierarchy**: `user` < `moderator` < `admin` < `super_admin`
- **Listing moderation flow**: user creates (status `pendiente`) → moderator approves/rejects/requests changes → user can resubmit from `cambios_requeridos` back to `pendiente`

## Environment Variables

All prefixed `NEXT_PUBLIC_FIREBASE_*`: API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID. Plus Sentry config: SENTRY_ORG, SENTRY_PROJECT.
