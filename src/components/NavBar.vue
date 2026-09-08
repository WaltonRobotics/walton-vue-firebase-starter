<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { currentUser, logout } = useAuth()
const router = useRouter()

async function handleLogout() {
  await logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">Walton Starter</RouterLink>

    <div class="links">
      <template v-if="currentUser">
        <RouterLink to="/tasks">Tasks</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
        <button type="button" @click="handleLogout">Log out</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Log in</RouterLink>
        <RouterLink to="/signup">Sign up</RouterLink>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.brand {
  font-weight: bold;
  text-decoration: none;
  color: var(--color-heading);
}

.links {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
