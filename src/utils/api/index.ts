/**
 * API exports
 * Centralized export point for all API modules
 */

// Base API clients and methods
export {
  api, // Authenticated API (auto token from localStorage)
  publicApi, // Public API (no auto token, can pass custom token)
  authenticatedClient,
  publicClient,
  default as apiClient,
} from './client'

// API modules
export { authApi } from './auth.api'
export { dashboardApi } from './dashboard.api'
export { storeOwnerApi } from './store-owner.api'
