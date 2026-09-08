# Walton Vue + Firebase Starter

A starting point for building web apps with **Vue 3** and **Firebase**. It comes with
working examples of Google sign-in, a real-time to-do list (Firestore), and a
profile-photo uploader (Storage), so you can see how the pieces fit together before
building your own features.

Day-to-day development runs entirely against the **Firebase Local Emulator Suite** —
fake Auth, Firestore, and Storage servers that run on your own computer. That means:

- **No Firebase account or project needed to start coding.** `npm install` and two
  commands below are all it takes.
- **No real data or real users involved** while you're building — everything you create
  lives only in the emulators, and resets whenever you want a clean slate.
- Nothing you do locally can affect the shared project everyone eventually deploys to.

When you're ready to put your app online, see **[DEPLOY.md](DEPLOY.md)** — that's where
the team's real Firebase project comes in.

## Tech stack

- [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript
- [Vue Router](https://router.vuejs.org/) for pages/navigation
- [Firebase](https://firebase.google.com/) for Authentication, Firestore (database), and
  Storage (file uploads) — via the local emulators during development
- [Vite](https://vite.dev/) to run and build the app
- Plain CSS — no extra styling library to learn

There's no state-management library (like Pinia) here. Instead, shared login state lives
in `src/composables/useAuth.ts`, a small "composable" function — plain Vue reactivity is
enough for an app this size. Read the comments in that file to see how it works. If your
app grows to have a lot of shared state across many unrelated pages, Pinia is the natural
next step.

> **New computer?** See [SETUP.md](SETUP.md) first — it walks through installing Git,
> Node.js, and VS Code (Windows-focused, with a macOS/Linux section too).

## Running it locally

You need **two terminals** open at the same time: one for the Firebase emulators, one
for the app itself.

```sh
npm install
npm run emulators   # terminal 1 — starts local Auth/Firestore/Storage servers
```

```sh
npm run dev          # terminal 2 — starts the app
```

Open the URL `npm run dev` prints (usually `http://localhost:5173`). Click **Log in**,
then **Continue with Google** — the emulator shows its own fake sign-in screen where you
can type any email address, no real Google account required. Then try adding a few
tasks and uploading a profile photo.

Leave both terminals running while you work. Stop either with `Ctrl+C`.

### Inspecting your data

`npm run emulators` also starts the **Emulator UI** at
[http://localhost:4000](http://localhost:4000). Use it to browse Firestore documents,
manage fake Auth users, and view uploaded files — much like the real Firebase console,
but local.

### Keeping your test data between restarts

Emulator data normally disappears when you stop `npm run emulators`. This project is set
up to save it to a local `.emulator-data/` folder on exit and reload it next time
automatically (see the `emulators` script in `package.json`), so your test tasks and fake
login accounts stick around. Delete that folder any time you want a clean slate.

## Project structure

```
src/
  firebase/config.ts     Connects to Firebase (emulators in dev, real project when deployed)
  composables/useAuth.ts Shared login state (log in with Google, log out)
  types/Task.ts           TypeScript shape of a to-do item
  router/index.ts         Pages and the "must be logged in" guard
  components/NavBar.vue   Top navigation bar
  views/
    HomeView.vue           Landing page
    LoginView.vue           Google sign-in button
    TasksView.vue           Firestore CRUD example (the to-do list)
    ProfileView.vue         Storage upload example (profile photo)
    NotFoundView.vue        404 page
firestore.rules           Who can read/write what in Firestore
storage.rules              Who can read/write what in Storage
firebase.json               Emulator ports + Hosting/Firestore/Storage deploy config
```

## Generating a new Project from this starter

This project is a template used to seed new application projects. To create a new
GitHub repository from it in the GitHub web interface:

1. Open this repository on GitHub and select **Use this template** → **Create a new
  repository**.
2. Enter the new repository's owner, name, and optional description. Choose whether it
  should be public or private, then select **Create repository from template**.
3. Clone the new repository locally, install its dependencies, and follow the setup and
  local-running instructions above:

  ```sh
  git clone https://github.com/<owner>/<new-repository>.git
  cd <new-repository>
  npm install
  ```

Keep the starter structure and emulator configuration as a baseline, then replace the
example views, components, and Firebase rules with features specific to your
application.

## Going live

Ready to share your app with the world, or need to test real Google sign-in? See
**[DEPLOY.md](DEPLOY.md)** for deploying to the team's Firebase project.
