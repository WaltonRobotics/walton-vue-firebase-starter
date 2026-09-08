<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { signup, loginWithGoogle } = useAuth()
const router = useRouter()

async function handleSignup() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await signup(email.value, password.value)
    router.push('/tasks')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to sign up.'
  } finally {
    isSubmitting.value = false
  }
}

async function handleGoogleSignup() {
  errorMessage.value = ''
  try {
    await loginWithGoogle()
    router.push('/tasks')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to sign up with Google.'
  }
}
</script>

<template>
  <section class="page">
    <h1>Sign up</h1>

    <form class="form" @submit.prevent="handleSignup">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" autocomplete="email" required />

      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        autocomplete="new-password"
        minlength="6"
        required
      />

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <button type="submit" :disabled="isSubmitting">Create account</button>
    </form>

    <button class="google-button" type="button" @click="handleGoogleSignup">
      Continue with Google
    </button>

    <p>Already have an account? <RouterLink to="/login">Log in</RouterLink></p>
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
