<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import GenericButton from '@/components/generic/GenericButton.vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarNav from './SidebarNav.vue'

const isSidebarCollapsed = ref(false)
const isMobile = ref(false)

const checkMobile = (): void => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // On mobile, start with sidebar closed
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const toggleSidebar = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const closeSidebar = (): void => {
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
}

const sidebarWidth = computed(() => {
  return isSidebarCollapsed.value ? 'w-20' : 'w-64'
})

const mainContentMargin = computed(() => {
  // On mobile, no margin (sidebar overlays)
  // On desktop, use margin based on collapsed state
  if (isMobile.value) {
    return 'ml-0'
  }
  return isSidebarCollapsed.value ? 'ml-20' : 'ml-64'
})

const sidebarClasses = computed(() => {
  const baseClasses =
    'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30'

  if (isMobile.value) {
    // On mobile: overlay behavior
    return [
      baseClasses,
      isSidebarCollapsed.value
        ? '-translate-x-full' // Hidden off-screen
        : 'translate-x-0', // Visible
      sidebarWidth.value,
    ]
  }

  // On desktop: push behavior
  return [baseClasses, sidebarWidth.value]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex relative">
    <!-- Backdrop (mobile only) -->
    <div
      v-if="isMobile && !isSidebarCollapsed"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
      @click="closeSidebar"
    />

    <!-- Sidebar -->
    <aside :class="sidebarClasses">
      <SidebarHeader :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
      <SidebarNav :collapsed="isSidebarCollapsed" @close="closeSidebar" />
    </aside>

    <!-- Main Content -->
    <main :class="['flex-1 transition-all duration-300 ease-in-out', mainContentMargin]">
      <!-- Mobile Menu Button (only visible on mobile when sidebar is closed) -->
      <GenericButton
        v-if="isMobile && isSidebarCollapsed"
        variant="secondary"
        size="md"
        type="button"
        class="fixed top-4 left-4 z-40 p-2 !min-w-0 lg:hidden shadow-md border border-gray-200"
        aria-label="Open menu"
        @click="toggleSidebar"
      >
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </GenericButton>

      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>
