<script setup lang="ts">
import GenericLoader from './GenericLoader.vue'
import GenericText from './GenericText.vue'

interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'spinner' | 'dots' | 'pulse'
  fullScreen?: boolean
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  size: 'lg',
  variant: 'spinner',
  fullScreen: false,
})
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center',
      fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : 'py-12',
    ]"
  >
    <GenericLoader :size="size" :variant="variant" color="primary" />
    <GenericText v-if="message" variant="p" size="sm" color="text-gray-600" class="mt-4">
      {{ message }}
    </GenericText>
  </div>
</template>
