import { createRouter, createWebHistory } from 'vue-router'
import { authReady, useAuth } from '@/composables/useAuth'

// Lets TypeScript know about the custom `meta` fields used below.
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

// Runs before every navigation. `meta.requiresAuth` / `meta.requiresGuest` are
// set per-route above, so adding a new protected page is just one line there.
router.beforeEach(async (to) => {
  await authReady
  const { currentUser } = useAuth()

  if (to.meta.requiresAuth && !currentUser.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresGuest && currentUser.value) {
    return { name: 'tasks' }
  }
})

export default router
