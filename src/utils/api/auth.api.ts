import { publicApi, api } from './client'
import type { LoginRequest, LoginResponse, User } from '@/types/auth.types'

/**
 * Authentication API endpoints
 * Uses publicApi for login/refresh (no auto token)
 * Uses api for authenticated endpoints (auto token from localStorage)
 */
export const authApi = {
  /**
   * Login user (public endpoint - no token required)
   * Role is read from localStorage (set before API call)
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Get role from localStorage (set before calling this function)
    const role = localStorage.getItem('userRole') || 'admin'

    const response = await publicApi.post<LoginResponse>('/auth/login', credentials, {
      headers: {
        'x-role': role,
      },
    })
    return response.data
  },

  /**
   * Refresh access token (public endpoint - uses refresh token)
   * Can pass custom refresh token via config if needed
   */
  refreshToken: async (refreshToken?: string, customToken?: string): Promise<LoginResponse> => {
    const config: { headers?: Record<string, string> } = {}

    // If custom token provided, use it; otherwise use refreshToken from param or localStorage
    if (customToken) {
      config.headers = {
        Authorization: `Bearer ${customToken}`,
      }
    } else if (refreshToken) {
      config.headers = {
        Authorization: `Bearer ${refreshToken}`,
      }
    }

    const response = await publicApi.post<LoginResponse>(
      '/auth/refresh',
      refreshToken ? { refreshToken } : {},
      config,
    )
    return response.data
  },

  /**
   * Get current user details (authenticated endpoint - auto token)
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  /**
   * Logout user (authenticated endpoint - auto token)
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}
