<script setup lang="ts">
import { ref, computed } from 'vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarNav from './SidebarNav.vue'

const isSidebarCollapsed = ref(false)

const toggleSidebar = (): void => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const sidebarWidth = computed(() => {
  return isSidebarCollapsed.value ? 'w-20' : 'w-64'
})

const mainContentMargin = computed(() => {
  return isSidebarCollapsed.value ? 'ml-20' : 'ml-64'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30',
        sidebarWidth,
      ]"
    >
      <SidebarHeader :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
      <SidebarNav :collapsed="isSidebarCollapsed" />
    </aside>

    <!-- Main Content -->
    <main :class="['flex-1 transition-all duration-300 ease-in-out', mainContentMargin]">
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>
