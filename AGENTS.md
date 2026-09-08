# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repo.
`CLAUDE.md` imports this file, so Claude Code reads it automatically — update this file,
not CLAUDE.md, when project guidance changes.

## What this project is

A starter template for **high school students** learning to build apps with Vue 3 and
Firebase. Student-facing docs: `README.md` (day-to-day local development),
`SETUP.md` (setting up a new computer, Windows-focused), and `DEPLOY.md` (publishing to
the team's shared Firebase project). Code should stay simple enough for a first-time
Vue/Firebase learner to read — see "Conventions" below.

Development runs against the **Firebase Local Emulator Suite**, not a real Firebase
project — see "Local development model" below before touching anything Firebase-related.

## Commands

- Install deps: `npm install`
- Start local Auth/Firestore/Storage emulators: `npm run emulators`
- Dev server (needs the emulators running in another terminal): `npm run dev`
- Type-check: `npm run type-check`
- Lint (auto-fixes): `npm run lint`
- Format: `npm run format`
- Production build: `npm run build`
- Deploy Firestore/Storage rules to the team project: `npm run deploy:rules`
- Deploy a personal preview build: `npm run deploy:preview -- <name>`
- Deploy to the team project's live URL: `npm run deploy`

There is no automated test suite in this repo. Before considering a change finished, run
`npm run type-check`, `npm run lint`, and `npm run build` — all three must pass clean. If
you touch anything under `src/firebase/`, `firestore.rules`, `storage.rules`, or
`firebase.json`, also verify it against the running emulators (`npm run emulators` +
`npm run dev`), not just the build — emulator wiring can't be caught by type-check alone.

## Local development model (read before touching Firebase config)

- `npm run dev` always talks to the **local emulators**, never a real Firebase project.
  This is enforced in `src/firebase/config.ts` via `if (import.meta.env.DEV)` calling
  `connectAuthEmulator` / `connectFirestoreEmulator` / `connectStorageEmulator`. Don't
  remove or gate that behind an extra flag — it should be unconditional for dev mode.
- `.env` (committed) holds placeholder Firebase config values that only need to exist,
  not be real — the emulators don't validate them. Its `VITE_FIREBASE_PROJECT_ID` must
  stay `demo-walton-starter`, matching the `--project` flag in the `emulators` npm
  script; the `demo-` prefix tells Firebase this is a local-only project.
- Real credentials for the team's Firebase project go in `.env.production.local`
  (git-ignored, template at `.env.production.local.example`). It's named
  `.env.production.local`, not `.env.local`, specifically so Vite only loads it for
  production builds (`npm run build`) — `npm run dev` must keep working against the
  emulators even after a student sets this up for a deploy. Don't rename it to
  `.env.local`.
- `npm run emulators` passes `--import`/`--export-on-exit` against `.emulator-data/`
  (git-ignored) so test data survives restarts. If emulator behavior seems stale or
  wrong during debugging, deleting that folder gives a clean slate.

## Conventions (deliberate choices — don't change without being asked)

- **TypeScript** everywhere, Vue 3 `<script setup lang="ts">` (Composition API only, no
  Options API). Chosen because these students already know Java and static typing is
  familiar to them.
- **No Pinia.** Shared state (currently just auth) lives in plain module-scope
  composables under `src/composables/` — see `useAuth.ts`. This was a deliberate
  simplicity choice; see the README's "Ideas for extending this" section.
- **Plain CSS** in scoped `<style>` blocks. No Tailwind, no component library.
- **Auth is Google sign-in only** (`src/composables/useAuth.ts`, `signInWithPopup` +
  `GoogleAuthProvider`). Email/password auth and the separate Signup page were removed
  on purpose — Google sign-in creates the account automatically.
- Path alias `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).
- Firebase config comes from env vars (`VITE_FIREBASE_*`) — see "Local development
  model" above for the `.env` vs `.env.production.local` split. Never hardcode real keys
  in `src/firebase/config.ts` or anywhere else.
- Route guards use `meta.requiresAuth` / `meta.requiresGuest` in `src/router/index.ts`.
  Add new protected pages there rather than guarding inside the component.
- **Comments are welcome here**, unlike a typical terse production codebase — this is a
  teaching project, so a short comment explaining *why* a Vue/Firebase pattern is used
  (e.g. why `onSnapshot` instead of a one-time fetch) genuinely helps the students this
  repo is for. Still keep them short — one line, not paragraphs.

## Structure

```
src/
  firebase/config.ts      Connects to Firebase (emulators in dev, real project when built)
  composables/useAuth.ts  Shared login state (Google sign-in, log out)
  types/Task.ts           TypeScript shape of a to-do item
  router/index.ts         Pages + the "must be logged in" guard
  components/NavBar.vue   Top navigation bar
  views/
    HomeView.vue            Landing page
    LoginView.vue           Google sign-in button
    TasksView.vue           Firestore CRUD example (real-time to-do list)
    ProfileView.vue         Storage upload example (profile photo)
    NotFoundView.vue        404 page
public/
  pwa-192x192.png, pwa-512x512.png, maskable-icon-512x512.png, apple-touch-icon.png
                            App icons used when the app is installed (see PWA section below)
firestore.rules            Per-user access rules for Firestore
storage.rules               Per-user access rules for Storage (avatars/<uid>/...)
firebase.json                Emulator ports + Hosting/Firestore/Storage deploy config
```

## PWA (installable app)

This app is configured with `vite-plugin-pwa` (`vite.config.ts`) so that, once deployed,
visitors can install it to their phone's home screen (Android/desktop: browser's
"Install app" prompt; iOS Safari: Share → "Add to Home Screen"). Notes for agents:

- The plugin is disabled in `npm run dev` (`devOptions.enabled: false`) so it can't fight
  with Vite's dev server or the emulators. To test install behavior locally, run
  `npm run build && npm run preview` instead.
- The icon files under `public/` are placeholder art (a "W" mark in the app's primary
  blue, `--color-primary` from `src/assets/main.css`). If a project gets a real logo,
  regenerate all four files at their existing sizes/filenames rather than adding new
  ones, since `vite.config.ts` and `index.html` both reference these exact names.
- The `apple-mobile-web-app-*` meta tags and `apple-touch-icon` link in `index.html` are
  there because iOS does not use the web app manifest for home-screen installs the way
  Android does — don't remove them even though they look redundant with the manifest.

Keep this section in sync with the "Project structure" section in `README.md` — they
describe the same thing for two different audiences (agents vs. students).

## Cross-platform notes

This repo is developed on both **Windows** (most students, see `SETUP.md`) and
Linux/macOS. Keep that working:

- Prefer adding an `npm run <script>` in `package.json` over telling someone to run a
  raw shell command — scripts run identically everywhere; raw commands don't.
- If you do need to show a raw command in docs aimed at students, give the
  Windows/PowerShell form first (`Copy-Item`, `Remove-Item -Recurse -Force`,
  `$env:NAME="value"`), since that's the primary audience — Git Bash on Windows also
  accepts the Unix forms (`cp`, `rm -rf`), so Unix-style commands work there too.
- `.gitattributes` normalizes line endings to LF — don't add per-platform line-ending
  workarounds.
- Don't assume a case-sensitive filesystem; Windows and macOS default to case-insensitive.

## Git / commit conventions

- Only commit when explicitly asked to.
- Commit messages explain *why*, not a restatement of the diff.
