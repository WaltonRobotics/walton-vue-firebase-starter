# Walton Vue + Firebase Starter

A starting point for building web apps with **Vue 3** and **Firebase**. It comes with
working examples of sign-up/login, a real-time to-do list (Firestore), and a
profile-photo uploader (Storage), so you can see how the pieces fit together before
building your own features.

## Tech stack

- [Vue 3](https://vuejs.org/) with `<script setup>` and TypeScript
- [Vue Router](https://router.vuejs.org/) for pages/navigation
- [Firebase](https://firebase.google.com/) for Authentication, Firestore (database), and
  Storage (file uploads)
- [Vite](https://vite.dev/) to run and build the app
- Plain CSS — no extra styling library to learn

There's no state-management library (like Pinia) here. Instead, shared login state lives
in `src/composables/useAuth.ts`, a small "composable" function — plain Vue reactivity is
enough for an app this size. Read the comments in that file to see how it works. If your
app grows to have a lot of shared state across many unrelated pages, Pinia is the natural
next step.

## 1. Set up your Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com/) and click
   **Add project**.
2. Once it's created, click the **web icon (`</>`)** to register a new web app. Give it
   any nickname. You do **not** need Firebase Hosting checked yet.
3. Firebase will show you a `firebaseConfig` object with keys like `apiKey`,
   `authDomain`, etc. Keep this tab open — you'll need it in step 3 below.
4. In the left sidebar, go to **Build > Authentication > Get started**, and enable the
   **Email/Password** and **Google** sign-in providers.
5. Go to **Build > Firestore Database > Create database**. Start in production mode
   (this project's `firestore.rules` file already restricts access safely — see step 5
   below).
6. Go to **Build > Storage > Get started**, using the default settings.

## 2. Install and configure the app

```sh
npm install
cp .env.example .env
```

Open `.env` and paste in the values from your `firebaseConfig` object (step 3 above),
one per line:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

`.env` is in `.gitignore` on purpose — never commit your real keys to git.

## 3. Run it locally

```sh
npm run dev
```

Open the URL it prints. Try signing up with an email/password (or Google), adding a few
tasks, and uploading a profile photo.

## 4. Deploy your Firestore/Storage security rules

The `firestore.rules` and `storage.rules` files in this repo make sure users can only
read and write their **own** data. They only take effect once you deploy them:

```sh
npm install -g firebase-tools   # one-time setup
firebase login
firebase use --add              # pick your Firebase project
npm run deploy:rules
```

## 5. Deploy the app (optional)

Once you've run `firebase use --add` above:

```sh
npm run deploy
```

This builds the app and publishes it to Firebase Hosting at
`https://<your-project-id>.web.app`.

## Project structure

```
src/
  firebase/config.ts     Connects the app to your Firebase project
  composables/useAuth.ts Shared login state (sign up, log in, log out)
  types/Task.ts           TypeScript shape of a to-do item
  router/index.ts         Pages and the "must be logged in" guard
  components/NavBar.vue   Top navigation bar
  views/
    HomeView.vue           Landing page
    LoginView.vue           Log in form
    SignupView.vue          Sign up form
    TasksView.vue           Firestore CRUD example (the to-do list)
    ProfileView.vue         Storage upload example (profile photo)
    NotFoundView.vue        404 page
```

## Ideas for extending this

- Add fields to a task (due date, priority) and a form to edit them
- Add a "shared" list that multiple signed-in users can see and edit together
- Add a Cloud Function that runs when a new task is created
- Once you have several unrelated pieces of shared state, look into
  [Pinia](https://pinia.vuejs.org/)
