<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const errorMessage = ref('')

const { loginWithGoogle } = useAuth()
const router = useRouter()
const route = useRoute()

async function handleGoogleLogin() {
  errorMessage.value = ''
  try {
    await loginWithGoogle()
    // If a protected page redirected here, send the user back to it.
    const redirect = route.query.redirect
    router.push(typeof redirect === 'string' ? redirect : '/tasks')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to log in with Google.'
  }
}
</script>

<template>
  <section class="page">
    <h1>Log in</h1>

    <p>Signing in with Google creates your account automatically the first time.</p>

    <button type="button" @click="handleGoogleLogin">Continue with Google</button>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.page {
  max-width: 360px;
  margin: 0 auto;
}

button {
  width: 100%;
  margin: 1rem 0;
}

.error {
  color: var(--color-error);
}
</style>
