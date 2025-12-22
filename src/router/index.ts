import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth state from localStorage
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }

  const requiresAuth = to.meta.requiresAuth
  const isLoginRoute = to.name === 'Login'

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if route requires auth and user is not authenticated
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (isLoginRoute && authStore.isAuthenticated) {
    // Redirect to dashboard if user is already authenticated and trying to access login
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
