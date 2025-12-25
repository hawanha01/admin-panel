<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { NavigationItem } from '@/types/navigation.types'

interface Props {
  item: NavigationItem
  collapsed: boolean
}

const props = defineProps<Props>()
const router = useRouter()
const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const isExpanded = ref(
  props.item.active || (props.item.children?.some((child) => child.active) ?? false),
)

const handleClick = (): void => {
  if (hasChildren.value && !props.collapsed) {
    isExpanded.value = !isExpanded.value
  } else if (props.item.route) {
    router.push(props.item.route)
  }
}

const handleChildClick = (childRoute: string, event: Event): void => {
  event.stopPropagation()
  router.push(childRoute)
}
</script>

<template>
  <li>
    <!-- Main Tab -->
    <button
      @click="handleClick"
      :class="[
        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
        item.active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100',
        collapsed ? 'justify-center' : 'justify-start',
      ]"
      :aria-label="collapsed ? item.label : item.label"
    >
      <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
      <span v-if="!collapsed" class="flex-1 text-left">{{ item.label }}</span>
      <svg
        v-if="hasChildren && !collapsed"
        :class="[
          'w-4 h-4 text-gray-500 transition-transform duration-200',
          isExpanded ? 'rotate-90' : '',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Child Tabs (Sub-menu) -->
    <ul
      v-if="hasChildren && !collapsed && isExpanded"
      class="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-4"
    >
      <li v-for="child in item.children" :key="child.id">
        <button
          @click="handleChildClick(child.route, $event)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm',
            child.active
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-600 hover:bg-gray-50',
          ]"
        >
          <span class="text-lg flex-shrink-0">{{ child.icon }}</span>
          <span class="flex-1 text-left">{{ child.label }}</span>
        </button>
      </li>
    </ul>
  </li>
</template>
