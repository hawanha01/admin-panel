import { api } from './client'
import type { DashboardStats, RecentStore, RecentOrder } from '@/types/entity.types'

/**
 * Dashboard API endpoints
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/admin/dashboard/stats')
    return response.data
  },

  /**
   * Get recent stores
   */
  getRecentStores: async (): Promise<RecentStore[]> => {
    const response = await api.get<RecentStore[]>('/admin/dashboard/recent-stores')
    return response.data
  },

  /**
   * Get recent orders
   */
  getRecentOrders: async (): Promise<RecentOrder[]> => {
    const response = await api.get<RecentOrder[]>('/admin/dashboard/recent-orders')
    return response.data
  },
}
