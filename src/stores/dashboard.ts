import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DashboardStats, RecentStore, RecentOrder } from '@/types/entity.types'
import { getErrorMessage } from '@/utils/error-handler'

interface _DashboardState {
  stats: DashboardStats | null
  recentStores: RecentStore[]
  recentOrders: RecentOrder[]
  loading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref<DashboardStats | null>(null)
  const recentStores = ref<RecentStore[]>([])
  const recentOrders = ref<RecentOrder[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const hasStats = computed(() => stats.value !== null)
  const hasRecentData = computed(
    () => recentStores.value.length > 0 || recentOrders.value.length > 0,
  )

  async function fetchDashboardStats(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response: ApiResponse<DashboardStats> = await api.get('/admin/dashboard/stats')
      // stats.value = response.data

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 500))
      stats.value = {
        totalStores: 125,
        totalStoreOwners: 89,
        totalOrders: 3456,
        totalRevenue: 1250000,
        activeStores: 98,
        pendingStores: 12,
      }
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch dashboard stats')
    } finally {
      loading.value = false
    }
  }

  async function fetchRecentStores(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response: ApiResponse<RecentStore[]> = await api.get('/admin/dashboard/recent-stores')
      // recentStores.value = response.data

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 300))
      recentStores.value = [
        {
          id: '1',
          name: 'Tech Store',
          ownerName: 'John Doe',
          status: 'active',
          createdAt: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Fashion Boutique',
          ownerName: 'Jane Smith',
          status: 'pending',
          createdAt: '2024-01-14T14:20:00Z',
        },
        {
          id: '3',
          name: 'Electronics Hub',
          ownerName: 'Bob Johnson',
          status: 'active',
          createdAt: '2024-01-13T09:15:00Z',
        },
      ]
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch recent stores')
    } finally {
      loading.value = false
    }
  }

  async function fetchRecentOrders(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response: ApiResponse<RecentOrder[]> = await api.get('/admin/dashboard/recent-orders')
      // recentOrders.value = response.data

      // Mock data for now
      await new Promise((resolve) => setTimeout(resolve, 300))
      recentOrders.value = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          storeName: 'Tech Store',
          totalAmount: 299.99,
          status: 'completed',
          createdAt: '2024-01-15T11:00:00Z',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          storeName: 'Fashion Boutique',
          totalAmount: 149.5,
          status: 'pending',
          createdAt: '2024-01-15T10:45:00Z',
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          storeName: 'Electronics Hub',
          totalAmount: 599.99,
          status: 'processing',
          createdAt: '2024-01-15T10:30:00Z',
        },
      ]
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to fetch recent orders')
    } finally {
      loading.value = false
    }
  }

  async function fetchAll(): Promise<void> {
    await Promise.all([fetchDashboardStats(), fetchRecentStores(), fetchRecentOrders()])
  }

  return {
    stats,
    recentStores,
    recentOrders,
    loading,
    error,
    hasStats,
    hasRecentData,
    fetchDashboardStats,
    fetchRecentStores,
    fetchRecentOrders,
    fetchAll,
  }
})
