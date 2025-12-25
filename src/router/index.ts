import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AdminLayout from '@/components/layout/AdminLayout.vue'

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
      component: AdminLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
      ],
    },
    {
      path: '/stores',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'Stores',
          component: () => import('@/views/StoresView.vue'),
        },
      ],
    },
    {
      path: '/store-owners',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'StoreOwners',
          component: () => import('@/views/StoreOwnersView.vue'),
        },
        {
          path: 'invite',
          name: 'InviteStoreOwner',
          component: () => import('@/views/InviteStoreOwnerView.vue'),
        },
        {
          path: 'managers',
          name: 'StoreManagers',
          component: () => import('@/views/StoreManagersView.vue'),
        },
      ],
    },
    {
      path: '/products',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'Products',
          component: () => import('@/views/ProductsView.vue'),
        },
      ],
    },
    {
      path: '/orders',
      component: AdminLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'Orders',
          component: () => import('@/views/OrdersView.vue'),
        },
      ],
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
    next({ path: '/dashboard' })
  } else {
    next()
  }
})

export default router
