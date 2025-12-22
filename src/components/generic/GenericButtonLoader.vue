<script setup lang="ts">
import { computed } from 'vue'
import GenericLoader from './GenericLoader.vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'white' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  color: 'white',
})

const loaderSizeMap: Record<'sm' | 'md' | 'lg', 'sm' | 'md'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
}

const loaderSize = computed(() => loaderSizeMap[props.size])
</script>

<template>
  <GenericLoader :size="loaderSize" :color="color" variant="spinner" class="inline-block" />
</template>
