<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import GenericCard from '@/components/generic/GenericCard.vue'
import GenericText from '@/components/generic/GenericText.vue'
import GenericButton from '@/components/generic/GenericButton.vue'
import GenericPageLoader from '@/components/generic/GenericPageLoader.vue'

const router = useRouter()
const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchAll()
})

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: 'text-green-600 bg-green-100',
    pending: 'text-yellow-600 bg-yellow-100',
    suspended: 'text-red-600 bg-red-100',
    completed: 'text-green-600 bg-green-100',
    processing: 'text-blue-600 bg-blue-100',
  }
  return statusColors[status] || 'text-gray-600 bg-gray-100'
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <GenericText variant="h1" size="3xl" weight="bold" class="mb-2">
        Admin Dashboard
      </GenericText>
      <GenericText variant="p" size="lg" color="text-gray-600">
        Overview of your e-commerce platform
      </GenericText>
    </div>

    <!-- Loading State -->
    <GenericPageLoader
      v-if="dashboardStore.loading && !dashboardStore.hasStats"
      message="Loading dashboard data..."
    />

    <!-- Error State -->
    <div v-if="dashboardStore.error" class="mb-6">
      <GenericCard variant="outlined">
        <GenericText variant="p" color="text-red-600">
          {{ dashboardStore.error }}
        </GenericText>
        <template #actions>
          <GenericButton variant="primary" @click="dashboardStore.fetchAll"> Retry </GenericButton>
        </template>
      </GenericCard>
    </div>

    <!-- Stats Grid -->
    <div
      v-if="dashboardStore.hasStats"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      <!-- Total Stores -->
      <GenericCard>
        <div class="flex items-center justify-between">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" class="mb-1">
              Total Stores
            </GenericText>
            <GenericText variant="h2" size="3xl" weight="bold" color="text-gray-900">
              {{ dashboardStore.stats?.totalStores || 0 }}
            </GenericText>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <GenericText variant="span" size="xl">🏪</GenericText>
          </div>
        </div>
      </GenericCard>

      <!-- Total Store Owners -->
      <GenericCard>
        <div class="flex items-center justify-between">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" class="mb-1">
              Total Store Owners
            </GenericText>
            <GenericText variant="h2" size="3xl" weight="bold" color="text-gray-900">
              {{ dashboardStore.stats?.totalStoreOwners || 0 }}
            </GenericText>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <GenericText variant="span" size="xl">👥</GenericText>
          </div>
        </div>
      </GenericCard>

      <!-- Total Orders -->
      <GenericCard>
        <div class="flex items-center justify-between">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" class="mb-1">
              Total Orders
            </GenericText>
            <GenericText variant="h2" size="3xl" weight="bold" color="text-gray-900">
              {{ dashboardStore.stats?.totalOrders || 0 }}
            </GenericText>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <GenericText variant="span" size="xl">📦</GenericText>
          </div>
        </div>
      </GenericCard>

      <!-- Total Revenue -->
      <GenericCard>
        <div class="flex items-center justify-between">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" class="mb-1">
              Total Revenue
            </GenericText>
            <GenericText variant="h2" size="2xl" weight="bold" color="text-gray-900">
              {{ formatCurrency(dashboardStore.stats?.totalRevenue || 0) }}
            </GenericText>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <GenericText variant="span" size="xl">💰</GenericText>
          </div>
        </div>
      </GenericCard>

      <!-- Active Stores -->
      <GenericCard>
        <div class="flex items-center justify-between">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" class="mb-1">
              Active Stores
            </GenericText>
            <GenericText variant="h2" size="3xl" weight="bold" color="text-green-600">
              {{ dashboardStore.stats?.activeStores || 0 }}
            </GenericText>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <GenericText variant="span" size="xl">✅</GenericText>
          </div>
        </div>
      </GenericCard>

      <!-- Pending Stores -->
      <GenericCard>
        <div class="flex items-center justify-between">
          <div>
            <GenericText variant="p" size="sm" color="text-gray-600" class="mb-1">
              Pending Stores
            </GenericText>
            <GenericText variant="h2" size="3xl" weight="bold" color="text-yellow-600">
              {{ dashboardStore.stats?.pendingStores || 0 }}
            </GenericText>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <GenericText variant="span" size="xl">⏳</GenericText>
          </div>
        </div>
      </GenericCard>
    </div>

    <!-- Recent Data Grid -->
    <div v-if="dashboardStore.hasRecentData" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Stores -->
      <GenericCard title="Recent Stores">
        <div v-if="dashboardStore.recentStores.length === 0" class="py-8 text-center">
          <GenericText variant="p" color="text-gray-500">No recent stores</GenericText>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="store in dashboardStore.recentStores"
            :key="store.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <GenericText variant="h4" size="md" weight="semibold" class="mb-1">
                {{ store.name }}
              </GenericText>
              <GenericText variant="p" size="sm" color="text-gray-600">
                Owner: {{ store.ownerName }}
              </GenericText>
              <GenericText variant="p" size="xs" color="text-gray-500" class="mt-1">
                {{ formatDate(store.createdAt) }}
              </GenericText>
            </div>
            <div>
              <GenericText
                variant="span"
                size="xs"
                weight="medium"
                :class="['px-3 py-1 rounded-full inline-block', getStatusColor(store.status)]"
              >
                {{ store.status }}
              </GenericText>
            </div>
          </div>
        </div>
        <template #actions>
          <GenericButton variant="secondary" size="sm" @click="router.push('/stores')">
            View All Stores
          </GenericButton>
        </template>
      </GenericCard>

      <!-- Recent Orders -->
      <GenericCard title="Recent Orders">
        <div v-if="dashboardStore.recentOrders.length === 0" class="py-8 text-center">
          <GenericText variant="p" color="text-gray-500">No recent orders</GenericText>
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="order in dashboardStore.recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <GenericText variant="h4" size="md" weight="semibold" class="mb-1">
                {{ order.orderNumber }}
              </GenericText>
              <GenericText variant="p" size="sm" color="text-gray-600">
                {{ order.storeName }}
              </GenericText>
              <GenericText
                variant="p"
                size="sm"
                weight="semibold"
                color="text-gray-900"
                class="mt-1"
              >
                {{ formatCurrency(order.totalAmount) }}
              </GenericText>
              <GenericText variant="p" size="xs" color="text-gray-500" class="mt-1">
                {{ formatDate(order.createdAt) }}
              </GenericText>
            </div>
            <div>
              <GenericText
                variant="span"
                size="xs"
                weight="medium"
                :class="['px-3 py-1 rounded-full inline-block', getStatusColor(order.status)]"
              >
                {{ order.status }}
              </GenericText>
            </div>
          </div>
        </div>
        <template #actions>
          <GenericButton variant="secondary" size="sm" @click="router.push('/orders')">
            View All Orders
          </GenericButton>
        </template>
      </GenericCard>
    </div>
  </div>
</template>
