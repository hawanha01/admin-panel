import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { storeOwnerApi } from '@/utils/api/store-owner.api'
import type { CreateStoreOwnerRequest, CreateStoreOwnerResponse } from '@/types/store-owner.types'
import {
  parseValidationErrors,
  getErrorMessage,
  getApiErrorMessage,
  extractApiError,
} from '@/utils/error-handler'

interface StoreOwnerState {
  loading: boolean
  error: string | null
  fieldErrors: Partial<Record<keyof CreateStoreOwnerRequest, string>>
}

export const useStoreOwnerStore = defineStore('storeOwner', {
  state: (): StoreOwnerState => ({
    loading: false,
    error: null,
    fieldErrors: {},
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
    hasError: (state): boolean => state.error !== null,
    hasFieldErrors: (state): boolean => Object.keys(state.fieldErrors).length > 0,
  },

  actions: {
    /**
     * Invite a new store owner
     * Creates store owner account and sends welcome email with verification link
     */
    async inviteStoreOwner(
      data: CreateStoreOwnerRequest,
    ): Promise<CreateStoreOwnerResponse | null> {
      this.loading = true
      this.error = null
      this.fieldErrors = {}

      try {
        const response = await storeOwnerApi.inviteStoreOwner(data)
        const toast = useToast()
        toast.success('Store owner invited successfully! Welcome email has been sent.')
        return response
      } catch (error) {
        const toast = useToast()

        // Extract API error response
        const apiError = extractApiError(error)

        if (apiError) {
          // Parse validation errors for field-level display
          this.fieldErrors = parseValidationErrors<CreateStoreOwnerRequest>(apiError)

          // Get user-friendly error message
          const errorMessage = getApiErrorMessage(apiError)

          // Only show toast if there are no field-specific errors (to avoid duplicate messages)
          if (Object.keys(this.fieldErrors).length === 0) {
            toast.error(errorMessage)
          }

          this.error = errorMessage
        } else {
          // Fallback for non-API errors
          const errorMessage = getErrorMessage(error, 'Failed to invite store owner')
          toast.error(errorMessage)
          this.error = errorMessage
        }

        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear error state
     */
    clearError(): void {
      this.error = null
      this.fieldErrors = {}
    },
  },
})
