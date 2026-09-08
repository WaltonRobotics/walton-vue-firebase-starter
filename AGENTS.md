# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repo.
`CLAUDE.md` imports this file, so Claude Code reads it automatically — update this file,
not CLAUDE.md, when project guidance changes.

## What this project is

A starter template for **high school students** learning to build apps with Vue 3 and
Firebase. Student-facing setup docs are in `README.md` (Firebase project setup, running
the app) and `SETUP.md` (setting up a new computer, Windows-focused). Code should stay
simple enough for a first-time Vue/Firebase learner to read — see "Conventions" below.

## Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Type-check: `npm run type-check`
- Lint (auto-fixes): `npm run lint`
- Format: `npm run format`
- Production build: `npm run build`
- Deploy Firestore/Storage rules: `npm run deploy:rules`
- Deploy app to Firebase Hosting: `npm run deploy`

There is no automated test suite in this repo. Before considering a change finished, run
`npm run type-check`, `npm run lint`, and `npm run build` — all three must pass clean.

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
- Firebase config comes from `.env` (`VITE_FIREBASE_*`, see `.env.example`). Never
  hardcode real keys in `src/firebase/config.ts` or anywhere else.
- Route guards use `meta.requiresAuth` / `meta.requiresGuest` in `src/router/index.ts`.
  Add new protected pages there rather than guarding inside the component.
- **Comments are welcome here**, unlike a typical terse production codebase — this is a
  teaching project, so a short comment explaining *why* a Vue/Firebase pattern is used
  (e.g. why `onSnapshot` instead of a one-time fetch) genuinely helps the students this
  repo is for. Still keep them short — one line, not paragraphs.

## Structure

```
src/
  firebase/config.ts      Connects the app to a Firebase project (reads .env)
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
firestore.rules            Per-user access rules for Firestore
storage.rules               Per-user access rules for Storage (avatars/<uid>/...)
firebase.json                Hosting/Firestore/Storage config for `firebase deploy`
```

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
