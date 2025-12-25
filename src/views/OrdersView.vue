<script setup lang="ts">
import GenericText from '@/components/generic/GenericText.vue'
import GenericCard from '@/components/generic/GenericCard.vue'
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8">
      <GenericText variant="h1" size="3xl" weight="bold" class="mb-2"> Orders </GenericText>
      <GenericText variant="p" size="lg" color="text-gray-600">
        View and manage all orders
      </GenericText>
    </div>

    <GenericCard>
      <GenericText variant="p" color="text-gray-600">
        Orders management coming soon...
      </GenericText>
    </GenericCard>
  </div>
</template>
