<script setup lang="ts">
import { computed } from 'vue'
import type { TextVariant, TextSize } from '@/types/component.types'

interface Props {
  variant?: TextVariant
  size?: TextSize
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'p',
  size: 'md',
  weight: 'normal',
  color: 'text-gray-900',
})

const textClasses = computed(() => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  }
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }
  
  return [
    sizeClasses[props.size],
    weightClasses[props.weight],
    props.color,
  ].join(' ')
})

const componentTag = computed(() => {
  return props.variant
})
</script>

<template>
  <component :is="componentTag" :class="textClasses">
    <slot />
  </component>
</template>

