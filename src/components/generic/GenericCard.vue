<script setup lang="ts">
import { computed } from 'vue'
import type { CardVariant } from '@/types/component.types'
import GenericText from './GenericText.vue'
import GenericButton from './GenericButton.vue'

interface Props {
  title?: string
  variant?: CardVariant
}

interface Emits {
  (e: 'action', action: string): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const emit = defineEmits<Emits>()

const cardClasses = computed(() => {
  const baseClasses = 'rounded-lg p-6'
  
  const variantClasses = {
    default: 'bg-white shadow-md',
    outlined: 'bg-white border-2 border-gray-200',
    elevated: 'bg-white shadow-lg',
  }
  
  return [baseClasses, variantClasses[props.variant]].join(' ')
})

const handleAction = (action: string): void => {
  emit('action', action)
}
</script>

<template>
  <div :class="cardClasses">
    <GenericText
      v-if="title"
      variant="h3"
      size="lg"
      weight="semibold"
      class="mb-4"
    >
      {{ title }}
    </GenericText>
    
    <div class="card-content">
      <slot />
    </div>
    
    <div v-if="$slots.actions" class="mt-4 flex gap-2">
      <slot name="actions" :handle-action="handleAction" />
    </div>
  </div>
</template>

