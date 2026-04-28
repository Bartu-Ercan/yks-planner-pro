<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# YKS Planner Pro Agent Rules

## Project

- Product: YKS Planner Pro.
- Canonical path: `/Users/bartuercan/Documents/YKS Planner Pro`.
- Legacy compatible path: `/Users/bartuercan/Documents/New project 3`.
- Repository: `Bartu-Ercan/yks-planner-pro`.
- Stack: Next.js 16.2.3, React 19.2.4, TypeScript, Supabase, Tailwind CSS 4.

## Operating Rules

- Modify the least amount of code necessary.
- Preserve existing app behavior unless the task explicitly asks for behavior change.
- Read the relevant source and docs before editing.
- Keep documentation in Turkish unless the target file is already English-only.
- Do not copy external kit scaffolds wholesale. Adapt useful patterns into this repo.
- For design, product, integration, or visual-polish work, always first ask whether a strong external reference, official doc, plugin, specialized tool, or AI helper would make the result better. Use it when it improves quality, do not copy scaffolds blindly, and explain the choice.
- For large features, create or update `docs/features/<id>/spec.md`, `plan.md`, and `tasks.md` before implementation.

## Next.js Rule

- Before changing Next.js app code, read the relevant guide under `node_modules/next/dist/docs/`.
- Do not assume older Next.js App Router behavior.

## Supabase Rules

- `lib/supabase.ts` requires these build-time variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The active table is `gorevler`.
- Keep `gun` and `hafta` consistent when moving, inserting, filtering, or migrating tasks.
- RLS policies must preserve per-user access through `auth.uid() = user_id`.

## Planner Rules

- The visible planner window is seven days.
- Left and right navigation moves one day at a time through `gunOffset`.
- Visible days can cross week boundaries, so code must use both `gun` and `hafta`.
- Bulk add day labels must follow the current visible window, not static weekday assumptions.

## Frontend Design Rules

- Use `docs/DESIGN_SYSTEM.md` as the source of truth for new pages, screens, and components.
- Preserve the current dark, compact, theme-accented planner identity.
- Do not add sidebars, bottom navigation, landing-page sections, analytics panels, or extra navigation unless explicitly requested.
- New UI must feel like an extension of the existing planner, not a redesign.
- Prefer compact tool surfaces, small labels, 8-14px radii, thin borders, and theme-driven accent colors.

## Quality Gates

- Run `npm run lint` after documentation or code changes when feasible.
- Run `npm run build` before delivery when build requirements are available.
- If deployment is requested, verify the final Vercel URL is reachable.
- If build fails with `supabaseUrl is required`, check the two public Supabase env vars first.
