# Deploying to the Team's Firebase Project

Day-to-day development uses the local emulators (see [README.md](README.md)) — you
don't need this guide for that. This is for when you want to:

- Test real Google sign-in (the emulator's fake sign-in screen doesn't need this, but a
  real deployed app does)
- Share a working link to your app with someone else
- Publish the "official" version of the app for everyone to use

All of that happens through **one shared Firebase project** that your mentor manages.
You're deploying *to* it, not creating your own.

## 1. Get access

Ask your mentor to add your Google account to the team's Firebase project:
**Firebase console > Project settings (gear icon) > Users and permissions > Add member**.
You'll need at least the **Firebase Hosting Admin** role to deploy the app; ask for
**Editor** if you'll also be changing `firestore.rules` or `storage.rules`.

## 2. Log in and link the project

These use the copy of the Firebase CLI already installed in this project — no global
install needed:

```sh
npx firebase login
npx firebase use --add
```

`use --add` shows a list of projects you have access to — pick the team project, and
give it the alias `default` when asked.

## 3. Add the real Firebase config

Ask your mentor for the project's `firebaseConfig` values (or find them yourself at
**Firebase console > Project settings > General > Your apps**, if you were given
console access):

```sh
cp .env.production.local.example .env.production.local
```

Then open `.env.production.local` and fill in the values. This file is named the way it
is on purpose — Vite only loads it for `npm run build`, so `npm run dev` keeps using the
local emulators even after you've done this.

## 4. Deploy your Firestore/Storage rules — only if you changed them

The rules in `firestore.rules` and `storage.rules` are shared by everyone using the team
project. **Check with your team before deploying rule changes** — a mistake here can
break the app for other people using the live site.

```sh
npm run deploy:rules
```

## 5. Deploy your build to a preview link (safe — recommended)

This publishes your build to a personal, temporary URL without touching the live site
everyone else uses:

```sh
npm run deploy:preview -- your-name
```

This prints a URL like `https://<project-id>--your-name-<random>.web.app` that you can
share. Preview channels expire automatically after 7 days by default; add
`-- your-name --expires 30d` to keep one around longer, or delete it early with
`npx firebase hosting:channel:delete your-name`.

## 6. Publish to the live site (instructor / team lead)

This overwrites the app everyone sees at the project's main URL — normally only whoever
maintains the "official" deployment should run this:

```sh
npm run deploy
```

## Troubleshooting

- **"Permission denied" / "Missing or insufficient permissions"**: your Google account
  hasn't been added to the project, or doesn't have the right role — see step 1.
- **Deployed to the wrong project**: run `npx firebase use` to see which project is
  currently linked, or `npx firebase use --add` again to switch.
- **Login page/data looks wrong after deploying**: double-check the values in
  `.env.production.local` match the Firebase console exactly.
- **`npm run dev` broke after setting up `.env.production.local`**: it shouldn't — that
  file only affects `npm run build`. If something's wrong, confirm you named it
  `.env.production.local` and not `.env.local` or `.env`.
