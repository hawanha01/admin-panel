<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import GenericButton from '@/components/generic/GenericButton.vue'
import GenericText from '@/components/generic/GenericText.vue'
import type { NavigationItem } from '@/types/navigation.types'

interface Props {
  item: NavigationItem
  collapsed: boolean
}

interface Emits {
  (e: 'navigate'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
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
    emit('navigate')
  }
}

const handleChildClick = (childRoute: string, event: Event): void => {
  event.stopPropagation()
  router.push(childRoute)
  emit('navigate')
}

const tabButtonClasses = computed(() => {
  const base = 'w-full flex items-center gap-3 !justify-start !bg-transparent !shadow-none'
  const active = props.item.active ? '!bg-blue-50' : 'hover:!bg-gray-100'
  const justify = props.collapsed ? '!justify-center' : ''
  return [base, active, justify].join(' ')
})

const childButtonClasses = computed(() => {
  return (child: NavigationItem) => {
    const base = 'w-full flex items-center gap-3 !justify-start !bg-transparent !shadow-none'
    const active = child.active ? '!bg-blue-50' : 'hover:!bg-gray-50'
    return [base, active].join(' ')
  }
})
</script>

<template>
  <li>
    <!-- Main Tab -->
    <GenericButton
      variant="secondary"
      size="md"
      type="button"
      :class="tabButtonClasses"
      :aria-label="item.label"
      @click="handleClick"
    >
      <span class="text-xl flex-shrink-0">{{ item.icon }}</span>
      <GenericText
        v-if="!collapsed"
        variant="span"
        size="md"
        :weight="item.active ? 'medium' : 'normal'"
        :color="item.active ? 'text-blue-700' : 'text-gray-700'"
        class="flex-1 text-left"
      >
        {{ item.label }}
      </GenericText>
      <svg
        v-if="hasChildren && !collapsed"
        :class="[
          'w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0',
          isExpanded ? 'rotate-90' : '',
        ]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </GenericButton>

    <!-- Child Tabs (Sub-menu) -->
    <ul
      v-if="hasChildren && !collapsed && isExpanded"
      class="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-4"
    >
      <li v-for="child in item.children" :key="child.id">
        <GenericButton
          variant="secondary"
          size="sm"
          type="button"
          :class="childButtonClasses(child)"
          @click="handleChildClick(child.route, $event)"
        >
          <span class="text-lg flex-shrink-0">{{ child.icon }}</span>
          <GenericText
            variant="span"
            size="sm"
            :weight="child.active ? 'medium' : 'normal'"
            :color="child.active ? 'text-blue-700' : 'text-gray-600'"
            class="flex-1 text-left"
          >
            {{ child.label }}
          </GenericText>
        </GenericButton>
      </li>
    </ul>
  </li>
</template>
