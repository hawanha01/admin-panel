import { api } from './client'
import type { ApiResponse } from '@/types/api.types'
import type { CreateStoreOwnerRequest, CreateStoreOwnerResponse } from '@/types/store-owner.types'

/**
 * Store Owner API endpoints
 * All endpoints require authentication (admin role)
 */
export const storeOwnerApi = {
  /**
   * Create/invite a new store owner
   * Admin-only endpoint
   */
  inviteStoreOwner: async (data: CreateStoreOwnerRequest): Promise<CreateStoreOwnerResponse> => {
    const response = await api.post<ApiResponse<CreateStoreOwnerResponse>>(
      '/admin/store-owners',
      data,
    )
    return response.data.data
  },
}
