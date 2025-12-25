<script setup lang="ts">
import { useRouter } from 'vue-router'
import GenericText from '@/components/generic/GenericText.vue'
import GenericCard from '@/components/generic/GenericCard.vue'
import GenericButton from '@/components/generic/GenericButton.vue'

const router = useRouter()
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <GenericText variant="h1" size="3xl" weight="bold" class="mb-2"> Store Owners </GenericText>
        <GenericText variant="p" size="lg" color="text-gray-600">
          Manage store owners and their accounts
        </GenericText>
      </div>
      <GenericButton variant="primary" size="md" @click="router.push('/store-owners/invite')">
        Invite Store Owner
      </GenericButton>
    </div>

    <GenericCard>
      <GenericText variant="p" color="text-gray-600">
        Store owners list coming soon...
      </GenericText>
    </GenericCard>
  </div>
</template>
