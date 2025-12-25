<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import SidebarTab from './SidebarTab.vue'
import type { NavigationItem } from '@/types/navigation.types'

interface Props {
  collapsed: boolean
}

defineProps<Props>()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

/**
 * Get all navigation items for admin panel
 * This function can be called iteratively to render tabs
 */
const getNavigationItems = (): NavigationItem[] => {
  const currentPath = route.path

  return [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard',
      active: currentPath === '/dashboard',
    },
    {
      id: 'stores',
      label: 'Stores',
      icon: '🏪',
      route: '/stores',
      active: currentPath === '/stores' || currentPath.startsWith('/stores/'),
    },
    {
      id: 'store-owners',
      label: 'Store Owners',
      icon: '👥',
      route: '/store-owners',
      active: currentPath === '/store-owners' || currentPath.startsWith('/store-owners/'),
      children: [
        {
          id: 'store-owners-list',
          label: 'All Store Owners',
          icon: '👤',
          route: '/store-owners',
          active: currentPath === '/store-owners',
        },
        {
          id: 'store-owners-invite',
          label: 'Invite Store Owner',
          icon: '✉️',
          route: '/store-owners/invite',
          active: currentPath === '/store-owners/invite',
        },
        {
          id: 'store-managers',
          label: 'Store Managers',
          icon: '👔',
          route: '/store-owners/managers',
          active: currentPath === '/store-owners/managers',
        },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: '📦',
      route: '/products',
      active: currentPath === '/products' || currentPath.startsWith('/products/'),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '🛒',
      route: '/orders',
      active: currentPath === '/orders' || currentPath.startsWith('/orders/'),
    },
  ]
}

const navigationItems = computed(() => getNavigationItems())

const handleLogout = async (): Promise<void> => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
    <div class="flex-1 py-4">
      <!-- Navigation Tabs -->
      <ul class="space-y-1 px-2">
        <SidebarTab
          v-for="item in navigationItems"
          :key="item.id"
          :item="item"
          :collapsed="collapsed"
        />
      </ul>
    </div>

    <!-- Logout Button -->
    <div class="p-2 border-t border-gray-200">
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500',
          collapsed ? 'justify-center' : 'justify-start',
        ]"
        :aria-label="collapsed ? 'Logout' : 'Logout'"
      >
        <span class="text-xl">🚪</span>
        <span v-if="!collapsed" class="font-medium">Logout</span>
      </button>
    </div>
  </nav>
</template>
