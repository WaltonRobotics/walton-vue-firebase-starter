# Deploying to the Team's Firebase Projects

Day-to-day development uses the local emulators (see [README.md](README.md)) — you
don't need this guide for that. This is for when you want to:

- Test real Google sign-in (the emulator's fake sign-in screen doesn't need this, but a
  real deployed app does)
- Share a working link to your app with someone else
- Publish the "official" version of the app for everyone to use

There are **two separate real Firebase projects**, both managed by your mentor:

- **staging** — for everyday testing. Real Google sign-in, real Firestore/Storage, but
  its own data, completely separate from what real users see.
- **production** — the live project everyone's actual app data lives in. Only deploy
  here once a change has already been tested on staging.

You're deploying to these existing projects, not creating your own.

## 1. Get access

Ask your mentor to add your Google account to **the staging project** at least:
**Firebase console > Project settings (gear icon) > Users and permissions > Add member**.
You'll need at least the **Firebase Hosting Admin** role to deploy the app; ask for
**Editor** if you'll also be changing `firestore.rules` or `storage.rules`. Production
access is normally limited to whoever manages the live deployment — you may not need it.

## 2. Log in and link the projects

These use the copy of the Firebase CLI already installed in this project — no global
install needed. Run `use --add` once per project you have access to:

```sh
npx firebase login
npx firebase use --add
```

`use --add` shows a list of projects you have access to. Pick the **staging** project
and give it the alias `staging`; if you also have production access, run it again, pick
the **production** project, and give it the alias `default`. This link
(`.firebaserc`) is per-computer and git-ignored, not shared through the repo.

## 3. Add the real Firebase config

Ask your mentor for each project's `firebaseConfig` values (or find them yourself at
**Firebase console > Project settings > General > Your apps**, if you were given
console access). Each project gets its own env file:

```sh
cp .env.staging.local.example .env.staging.local        # for the staging project
cp .env.production.local.example .env.production.local  # for the production project — only if you have access
```

Fill in each file with its own project's values — don't mix them up. These names matter:
Vite loads `.env.staging.local` for `npm run build:staging` (used by `deploy:preview` and
`deploy:staging` below) and `.env.production.local` for `npm run build` (used by
`deploy`). Neither affects `npm run dev`, which always uses the local emulators.

## 4. Deploy Firestore/Storage rules — only if you changed them

Rules are per-project, so a change needs deploying to whichever project(s) you want to
keep in sync with `firestore.rules`/`storage.rules` in this repo:

```sh
npm run deploy:rules:staging   # safe — staging is yours to break
npm run deploy:rules           # check with your team first — see below
```

**Check with your team before deploying rule changes to production** — a mistake here
can break the app for everyone using the live site. Staging is lower-stakes: it's shared
for testing, not real users.

## 5. Personal preview link (safe — recommended for everyday testing)

This builds against the **staging** project and publishes to a personal, temporary URL:

```sh
npm run deploy:preview -- your-name
```

This prints a URL like `https://<staging-project-id>--your-name-<random>.web.app` that
you can share — real Google sign-in, real Firestore/Storage, but staging's data, not
production's. Preview channels expire automatically after 7 days by default; add
`-- your-name --expires 30d` to keep one around longer, or delete it early with
`npx firebase hosting:channel:delete your-name --project staging`.

## 6. Shared staging link (whole team, install/device testing)

```sh
npm run deploy:staging
```

Deploys to the staging project's own main URL (not a temporary channel), so it's stable
enough for the whole team to share — use it when several people need the same link, or
when you need a **real `https://` URL to test on a phone**. That matters specifically for
installing the app to a home screen (see the PWA section in `AGENTS.md`): Android only
offers the "Install app" prompt over HTTPS, so a plain local network link
(`npm run preview -- --host`) can't demonstrate that — this can. Anyone can overwrite it
by re-running the command, so don't rely on it for anything long-term.

## 7. Publish to the live site (instructor / team lead)

This overwrites the app everyone sees at the **production** project's main URL —
normally only whoever maintains the "official" deployment should run this, and only
after the same build has already been tried on staging:

```sh
npm run deploy
```

## Troubleshooting

- **"Permission denied" / "Missing or insufficient permissions"**: your Google account
  hasn't been added to that specific project, or doesn't have the right role — see
  step 1. Staging and production access are separate.
- **"Error: No project found matching alias 'staging'" (or 'default')**: that project
  isn't linked in your local `.firebaserc` yet — run `npx firebase use --add` again and
  pick it.
- **Login page/data looks wrong after deploying**: double-check the values in
  `.env.staging.local`/`.env.production.local` match the *right* project's console —
  easy to mix the two up.
- **`npm run dev` broke after setting up an env file**: it shouldn't — those files only
  affect `npm run build`/`npm run build:staging`. If something's wrong, confirm you
  named the file correctly (`.env.production.local` or `.env.staging.local`, not
  `.env.local`).
