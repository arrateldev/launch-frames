# Codex Project Context

This file is the working memory for Codex in this repository. Keep it updated when changes alter architecture, commands, environment assumptions, routing, data models, billing/auth flows, or conventions.

## Project Snapshot

- Next.js SaaS starter using the App Router, React 19, TypeScript, Tailwind CSS 4, shadcn-style UI components, Drizzle ORM, Postgres, and Stripe.
- Arratel is the umbrella brand for this SaaS portfolio. The primary domain is `arratel.dev`, and the contact email is `contact@arratel.dev`.
- `arratel.dev` is reserved for the Arratel homepage. This starter template can be tested on `saas.arratel.dev` when deployed.
- The current product/work-in-progress SaaS in this repository is `LaunchFrames`, an app screenshot and launch asset studio for developers. The product brief lives in `docs/marketing-asset-studio-saas-idea.md`.
- Arratel brand colors are `#787ff6` as primary and `#69c4ff` as secondary/cyan. Theme variables live in `app/globals.css`; use the secondary color for subtle aura, glow, and brand-gradient accents rather than making every component blue.
- Main brand, product, company, domain, contact, social, icon, and legal placeholder configuration lives in `lib/site-config.ts`.
- Internationalization currently supports `de` and `en` in `lib/i18n/config.ts`; `defaultLocale` is `en`.
- User-facing copy is centralized in `lib/i18n/messages.ts`.
- The public product name in the header uses the local title font from `app/fonts/LexendExa_400Regular.ttf`, loaded in `app/layout.tsx` as `--font-title` and exposed through the `.font-title` utility in `app/globals.css`.
- App icons are generated from `assets/icons/source.png` with `npm run icons`; the script writes `app/favicon.ico`, `app/icon.png`, and `app/apple-icon.png`.
- Middleware/proxy behavior is implemented in `proxy.ts`. It redirects non-localized paths to a localized path, sets `x-locale`, persists the `locale` cookie, and protects localized `/dashboard` routes.
- Database schema is in `lib/db/schema.ts`; migrations are in `lib/db/migrations`.
- Auth/session helpers live under `lib/auth`.
- Stripe and mock billing logic live under `lib/payments`.

## Important Routes And Structure

- Localized routes live under `app/[locale]`.
- `app/[locale]/layout.tsx` validates the locale, loads the current user, and wraps pages in `components/site-chrome.tsx`.
- `components/site-chrome.tsx` owns the public header, mobile navigation, language switcher, auth menu, and footer.
- Footer copyright should keep the current product visible and link `product.makerLabel` to `brand.urls.homepage`, so copied products retain a subtle Arratel backlink.
- Dashboard routes live under `app/[locale]/(dashboard)`.
- `app/[locale]/(dashboard)/dashboard/layout.tsx` reuses the legacy dashboard layout from `app/(dashboard)/dashboard/layout.tsx` and provides SWR fallback data for `/api/user` and `/api/team`.
- Legal pages use stable English slugs for all locales: `/privacy-policy`, `/terms-of-use`, and `/imprint`. Use `localizeLegalPath()` and `legalRoutePaths` from `lib/i18n/config.ts`; old `/datenschutz`, `/terms`, and `/impressum` routes should only redirect.
- The localized `/links` page is a reusable link-in-bio/social links page. It should stay generic and read website, contact email, product claim, and social profiles from `lib/site-config.ts` helpers.
- The localized `/studio` page is the first LaunchFrames MVP surface. It currently lives in `features/launchframes-studio/studio.tsx` and provides a client-side URL/upload-to-preview workflow with pack presets, scene copy editing, template switching, brand color control, canvas zoom/crop controls, and 2x PNG preview export.
- Real URL screenshots for the Studio are captured through `app/api/capture/route.ts` with Playwright Chromium. Local machines need `npx playwright install chromium` once after dependency install; hosted environments must provide Playwright-compatible browser binaries.
- There are still legacy non-localized route groups under `app/(dashboard)` and `app/(login)`. Be careful when changing shared behavior: confirm whether the localized or legacy route is the active target.
- API routes live under `app/api`.
- Feature flags live in `lib/config/feature-flags.ts`. `DEPLOYMENT_MODE=minimal` is for static/landing launches without auth, database, or Stripe; `full` enables the SaaS flows.

## Auth, Teams, And Data Access

- Password auth and account/team server actions live in `app/(login)/actions.ts`.
- Sessions are JWTs in the `session` cookie; signing, verification, password hashing, and cookie writes live in `lib/auth/session.ts`.
- Server action wrappers live in `lib/auth/middleware.ts`: use `validatedAction`, `validatedActionWithUser`, or `withTeam` instead of duplicating auth/validation checks.
- Data query helpers live in `lib/db/queries.ts`; prefer adding shared reads/writes there when multiple routes or actions need the same behavior.
- New signups create a team by default unless accepting an invitation. Team activity is logged in `activity_logs`.

## Local Development

- Install dependencies with `npm install`; Vercel is intentionally configured to use npm so `package-lock.json` is the deployment lockfile to keep current.
- Start dev server: `npm run dev`.
- Build: `npm run build`.
- Vercel is configured via `vercel.json` to install with `npm install` and build with `npm run build`; keep `package-lock.json` current when dependencies change.
- The connected Vercel project deploys pushes to `main` as production. Use feature branches and Preview Deployments for non-trivial SaaS changes before merging to `main`.
- Database setup helpers:
  - `npm run db:create`
  - `npm run db:setup`
  - `npm run db:generate`
  - `npm run db:migrate`
  - `npm run db:seed`
  - `npm run db:studio`
- The README documents a mock billing workflow. For local billing UI work, use `MOCK_STRIPE=true`.
- Minimal mode only needs the public site values such as `BASE_URL`; full SaaS mode needs `POSTGRES_URL`, `AUTH_SECRET`, and Stripe variables. Dummy Stripe values are acceptable when `MOCK_STRIPE=true`.
- Drizzle config reads `POSTGRES_URL` from the environment and writes migrations to `lib/db/migrations`.

## Implementation Notes

- Prefer existing components in `components/ui` and existing shared components before adding new primitives.
- Use `lucide-react` icons when icon buttons or common UI symbols are needed.
- Use `react-icons/fa6` for brand/social icons in `components/social-icons.tsx`; public social links should be read through `getPublicSocialLinks()` so product-specific socials can override the Arratel fallback.
- The shared `components/app-logo.tsx` renders `/favicon.ico` with `object-contain` and no border radius so logo artwork is not clipped in the header/footer.
- Keep text additions localized in `lib/i18n/messages.ts` for both `de` and `en`.
- German user-facing copy must use proper German characters (`ä`, `ö`, `ü`, `Ä`, `Ö`, `Ü`, `ß`) instead of ASCII transliterations such as `ae`, `oe`, `ue`, or `ss`, except inside code identifiers, URLs, slugs, env vars, or other technical values.
- When adding routes or links, route through the locale helpers in `lib/i18n/config.ts` where applicable.
- Update `lib/site-config.ts` for brand/product/company/social/legal/privacy metadata rather than scattering constants through pages. `brand` is Arratel as the umbrella brand; `product` is the current SaaS/product. `product.name`, `product.claim`, `product.urls`, `product.icons`, and optional `product.social` should be changed per copied product. `brand.social` is the Arratel fallback; use `getPublicSocialLinks()`, `getPublicContactEmail()`, and `getBaseUrl()` instead of reading fallback fields manually. `company.legalName` is the legal provider and may be a natural person. Legal fields such as address, phone, representative, register, and VAT ID may intentionally be `null` until real data exists; do not reintroduce fake legal placeholders. Privacy service providers and retention copy live under `siteConfig.privacy`.
- Current Arratel social handles are `arrateldev` on GitHub, X, Instagram, TikTok, YouTube, Product Hunt, npm, Docker Hub, and Reddit; LinkedIn uses `https://www.linkedin.com/company/arrateldev`; Bluesky uses `https://bsky.app/profile/arrateldev.bsky.social`.
- Keep the brand claim concise and consistent across social profiles; the current preferred line is `Precision software.`.
- If database tables or relations change, update `lib/db/schema.ts`, generate a migration, and check query helpers in `lib/db/queries.ts`.
- If billing behavior changes, verify both real Stripe mode and `MOCK_STRIPE=true` mode.
- Keep redirects locale-aware. Server actions should read `locale` from form data with `getLocaleFromFormData` when the destination is user-facing.
- Be careful with App Router route groups and literal paths on Windows: paths containing `[locale]` or `(dashboard)` may need `-LiteralPath` in PowerShell.

## Verification

- There is no dedicated lint or typecheck script in `package.json` right now.
- Use `npm run build` as the main validation command for app-level changes.
- For database changes, run the relevant Drizzle command and inspect generated migrations.
- For UI changes, run the dev server and check responsive layout in browser when practical.

## Codex Working Rule

- When making future changes, update this file if the change affects how a future Codex session should understand, run, modify, or verify the project.
- Do not update this file for tiny localized edits that do not change architecture, workflows, commands, environment, or conventions.
