<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import GenericButton from '@/components/generic/GenericButton.vue'
import GenericText from '@/components/generic/GenericText.vue'
import SidebarTab from './SidebarTab.vue'
import type { NavigationItem } from '@/types/navigation.types'

interface Props {
  collapsed: boolean
}

const props = defineProps<Props>()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Emit event to close sidebar on mobile when route changes
const emit = defineEmits<{ close: [] }>()

// Close sidebar on mobile when route changes
watch(
  () => route.path,
  () => {
    if (window.innerWidth < 1024 && !props.collapsed) {
      emit('close')
    }
  },
)

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
          @navigate="emit('close')"
        />
      </ul>
    </div>

    <!-- Logout Button -->
    <div class="p-2 border-t border-gray-200">
      <GenericButton
        variant="danger"
        size="md"
        type="button"
        :class="[
          'w-full flex items-center gap-3',
          collapsed ? '!justify-center' : '!justify-start',
        ]"
        aria-label="Logout"
        :loading="authStore.loading"
        :disabled="authStore.loading"
        @click="handleLogout"
      >
        <span class="text-xl flex-shrink-0">🚪</span>
        <GenericText v-if="!collapsed" variant="span" size="md" weight="medium" color="text-white">
          Logout
        </GenericText>
      </GenericButton>
    </div>
  </nav>
</template>
