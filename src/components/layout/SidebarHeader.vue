<script setup lang="ts">
import { computed } from 'vue'
import GenericText from '@/components/generic/GenericText.vue'

interface Props {
  collapsed: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleToggle = (): void => {
  emit('toggle')
}

const logoSize = computed(() => {
  return props.collapsed ? 'w-10 h-10' : 'w-12 h-12'
})
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between p-4 border-b border-gray-200',
      collapsed ? 'flex-col gap-2' : 'flex-row',
    ]"
  >
    <!-- Logo -->
    <div
      :class="[
        'flex items-center gap-3 transition-all duration-300',
        collapsed ? 'flex-col' : 'flex-row',
      ]"
    >
      <div
        :class="[
          'bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold',
          logoSize,
        ]"
      >
        <GenericText variant="span" size="lg" weight="bold">A</GenericText>
      </div>
      <GenericText
        v-if="!collapsed"
        variant="h2"
        size="xl"
        weight="bold"
        class="text-gray-900 whitespace-nowrap"
      >
        Admin Panel
      </GenericText>
    </div>

    <!-- Toggle Button -->
    <button
      @click="handleToggle"
      class="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <svg
        :class="[
          'w-5 h-5 text-gray-600 transition-transform duration-300',
          collapsed ? '' : 'rotate-180',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
</template>
