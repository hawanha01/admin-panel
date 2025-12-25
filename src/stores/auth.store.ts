import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/utils/api'
import type { LoginRequest, User } from '@/types/auth.types'
import { useToast } from 'vue-toastification'
import { getUserIdFromToken } from '@/utils/jwt'
import { getErrorMessage } from '@/utils/error-handler'

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()

  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed<boolean>(() => {
    return !!accessToken.value && !!user.value
  })

  const userRole = computed<string | null>(() => {
    return user.value?.role || null
  })

  // Actions
  const login = async (credentials: LoginRequest): Promise<void> => {
    loading.value = true
    error.value = null

    // Store role in localStorage BEFORE API call (so it persists even after logout clears cache)
    const role = 'admin' // Admin panel always uses 'admin' role
    localStorage.setItem('userRole', role)

    try {
      const response = await authApi.login(credentials)

      if (response && response.accessToken) {
        accessToken.value = response.accessToken
        refreshToken.value = response.refreshToken

        // Store tokens in localStorage (userId will be extracted from JWT)
        localStorage.setItem('accessToken', response.accessToken)
        localStorage.setItem('refreshToken', response.refreshToken)

        // Fetch user details (userId will be extracted from JWT token)
        await fetchCurrentUser()

        toast.success('Login successful!')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'An error occurred during login. Please try again.')
      error.value = errorMessage
      toast.error(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      // Extract userId from JWT token instead of localStorage
      const token = accessToken.value || localStorage.getItem('accessToken')
      if (!token) {
        return
      }

      const userId = getUserIdFromToken(token)
      if (userId) {
        // This is a placeholder - replace with actual API call when endpoint is available
        user.value = {
          id: userId,
          email: '',
          username: '',
          role: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          fullName: 'Admin User',
          phone: '',
          avatar: null,
          isEmailVerified: true,
          lastLoginAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, 'Failed to fetch user details')
      error.value = errorMessage
      toast.error(errorMessage)
    }
  }

  const logout = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Call backend API to delete refreshToken from user entity
      await authApi.logout()
    } catch (err: unknown) {
      // Even if API call fails, we still want to clear local storage
      const errorMessage = getErrorMessage(err, 'Failed to logout on server')
      console.error('Logout API error:', errorMessage)
      // Don't show error toast - we'll still clear local storage
    } finally {
      // Clear all auth-related state
      user.value = null
      accessToken.value = null
      refreshToken.value = null

      // Clear auth-related localStorage items
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      // Clear all sessionStorage (typically used for session data)
      sessionStorage.clear()

      loading.value = false
      toast.success('Logged out successfully')
    }
  }

  const initializeAuth = (): void => {
    const storedToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedToken && storedRefreshToken) {
      accessToken.value = storedToken
      refreshToken.value = storedRefreshToken
      fetchCurrentUser()
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    // Actions
    login,
    logout,
    fetchCurrentUser,
    initializeAuth,
  }
})
