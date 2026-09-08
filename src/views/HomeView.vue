<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { currentUser } = useAuth()
</script>

<template>
  <section class="page">
    <h1>Walton Vue + Firebase Starter</h1>
    <p>
      This starter wires up Vue 3, Vue Router, and Firebase (Authentication, Firestore, and Storage)
      so you can jump straight into building a real app.
    </p>

    <p v-if="currentUser">
      You're signed in as <strong>{{ currentUser.email }}</strong
      >. Head to your <RouterLink to="/tasks">tasks</RouterLink> or
      <RouterLink to="/profile">profile</RouterLink>.
    </p>
    <p v-else>
      <RouterLink to="/signup">Create an account</RouterLink> or
      <RouterLink to="/login">log in</RouterLink> to try the Firestore to-do list example.
    </p>

    <h2>What's included</h2>
    <ul>
      <li><code>src/firebase/config.ts</code> &mdash; connects the app to your Firebase project</li>
      <li>
        <code>src/composables/useAuth.ts</code> &mdash; shared login state, no extra library needed
      </li>
      <li><code>src/views/TasksView.vue</code> &mdash; a real-time Firestore CRUD example</li>
      <li><code>src/views/ProfileView.vue</code> &mdash; a Firebase Storage file-upload example</li>
    </ul>
  </section>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
}
</style>
