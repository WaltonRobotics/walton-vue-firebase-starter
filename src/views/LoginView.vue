<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { login, loginWithGoogle } = useAuth()
const router = useRouter()
const route = useRoute()

// If a protected page redirected here, send the user back to it after login.
function redirectAfterLogin() {
  const redirect = route.query.redirect
  router.push(typeof redirect === 'string' ? redirect : '/tasks')
}

async function handleEmailLogin() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await login(email.value, password.value)
    redirectAfterLogin()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to log in.'
  } finally {
    isSubmitting.value = false
  }
}

async function handleGoogleLogin() {
  errorMessage.value = ''
  try {
    await loginWithGoogle()
    redirectAfterLogin()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to log in with Google.'
  }
}
</script>

<template>
  <section class="page">
    <h1>Log in</h1>

    <form class="form" @submit.prevent="handleEmailLogin">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" autocomplete="email" required />

      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="current-password"
        required
      />

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit" :disabled="isSubmitting">Log in</button>
    </form>

    <button class="google-button" type="button" @click="handleGoogleLogin">
      Continue with Google
    </button>

    <p>No account yet? <RouterLink to="/signup">Sign up</RouterLink></p>
  </section>
</template>

<style scoped>
.page {
  max-width: 360px;
  margin: 0 auto;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.form button {
  margin-top: 0.75rem;
}

.google-button {
  width: 100%;
  margin-bottom: 1rem;
}

.error {
  color: var(--color-error);
}
</style>
