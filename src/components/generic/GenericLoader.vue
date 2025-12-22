<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
  variant?: 'spinner' | 'dots' | 'pulse'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  variant: 'spinner',
})

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white',
  gray: 'text-gray-400',
}
</script>

<template>
  <div v-if="variant === 'spinner'" :class="[sizeClasses[size], colorClasses[color]]">
    <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>

  <div
    v-else-if="variant === 'dots'"
    :class="[sizeClasses[size], colorClasses[color], 'flex gap-1']"
  >
    <div
      class="rounded-full bg-current animate-bounce"
      :class="{
        'w-1.5 h-1.5': size === 'sm',
        'w-2 h-2': size === 'md',
        'w-2.5 h-2.5': size === 'lg',
        'w-3 h-3': size === 'xl',
      }"
      style="animation-delay: 0ms"
    />
    <div
      class="rounded-full bg-current animate-bounce"
      :class="{
        'w-1.5 h-1.5': size === 'sm',
        'w-2 h-2': size === 'md',
        'w-2.5 h-2.5': size === 'lg',
        'w-3 h-3': size === 'xl',
      }"
      style="animation-delay: 150ms"
    />
    <div
      class="rounded-full bg-current animate-bounce"
      :class="{
        'w-1.5 h-1.5': size === 'sm',
        'w-2 h-2': size === 'md',
        'w-2.5 h-2.5': size === 'lg',
        'w-3 h-3': size === 'xl',
      }"
      style="animation-delay: 300ms"
    />
  </div>

  <div v-else-if="variant === 'pulse'" :class="[sizeClasses[size], colorClasses[color]]">
    <div class="rounded-full bg-current animate-pulse" :class="sizeClasses[size]" />
  </div>
</template>
