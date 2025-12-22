<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from 'vue-toastification'
import GenericInput from '@/components/generic/GenericInput.vue'
import GenericButton from '@/components/generic/GenericButton.vue'
import GenericText from '@/components/generic/GenericText.vue'
import GenericCard from '@/components/generic/GenericCard.vue'

interface LoginForm {
  email: string
  password: string
}

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref<LoginForm>({
  email: '',
  password: '',
})

const isSubmitting = ref<boolean>(false)

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password) {
    return { valid: false, message: 'Password is required' }
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return {
      valid: false,
      message: 'Password must contain at least one special character',
    }
  }

  return { valid: true }
}

const validateForm = (): boolean => {
  if (!form.value.email) {
    toast.error('Email is required')
    return false
  }

  if (!validateEmail(form.value.email)) {
    toast.error('Please enter a valid email address')
    return false
  }

  const passwordValidation = validatePassword(form.value.password)
  if (!passwordValidation.valid) {
    toast.error(passwordValidation.message || 'Invalid password')
    return false
  }

  return true
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
    })

    toast.success('Login successful! Redirecting...')
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
  } catch (error) {
    // Error is already handled by the store with toast
    console.error('Login error:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-12"
    @keydown.enter="handleSubmit"
  >
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/50"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <GenericText variant="h1" size="3xl" weight="bold" class="mb-2 text-white">
          Welcome Back
        </GenericText>
        <GenericText variant="p" size="lg" color="text-gray-300">
          Sign in to continue to Admin Panel
        </GenericText>
      </div>

      <GenericCard variant="elevated" class="backdrop-blur-sm bg-white/95 shadow-2xl">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <GenericInput
              v-model="form.email"
              type="email"
              label="Email Address"
              placeholder="admin@example.com"
              :disabled="isSubmitting || authStore.loading"
              required
              autocomplete="email"
            />
          </div>

          <div>
            <GenericInput
              v-model="form.password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              :disabled="isSubmitting || authStore.loading"
              required
              autocomplete="current-password"
            />
            <GenericText variant="p" size="xs" color="text-gray-500" class="mt-2">
              Must contain: 8+ characters, uppercase, lowercase, number, special character
            </GenericText>
          </div>

          <GenericButton
            type="submit"
            variant="primary"
            :disabled="isSubmitting || authStore.loading"
            :loading="isSubmitting || authStore.loading"
            class="w-full"
            size="lg"
          >
            <span v-if="!isSubmitting && !authStore.loading">Sign In</span>
            <span v-else>Signing in...</span>
          </GenericButton>
        </form>
      </GenericCard>

      <div class="mt-6 text-center">
        <GenericText variant="p" size="sm" color="text-gray-400">
          Secure admin access portal
        </GenericText>
      </div>
    </div>
  </div>
</template>
