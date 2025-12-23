<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStoreOwnerStore } from '@/stores/store-owner.store'
import GenericCard from '@/components/generic/GenericCard.vue'
import GenericInput from '@/components/generic/GenericInput.vue'
import GenericButton from '@/components/generic/GenericButton.vue'
import GenericText from '@/components/generic/GenericText.vue'
import type { CreateStoreOwnerRequest } from '@/types/store-owner.types'

const router = useRouter()
const storeOwnerStore = useStoreOwnerStore()

const form = ref<CreateStoreOwnerRequest>({
  email: '',
  username: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'store_owner', // Pre-populated and fixed
})

const errors = ref<Partial<Record<keyof CreateStoreOwnerRequest, string>>>({})

// Format role display name (e.g., "store_owner" -> "Store Owner")
const formatRoleDisplay = (role: string): string => {
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone: string): boolean => {
  // Basic phone validation - allows +, digits, spaces, hyphens, parentheses
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

const validateUsername = (username: string): boolean => {
  // Username: 3-30 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
  return usernameRegex.test(username)
}

const validateForm = (): boolean => {
  errors.value = {}

  // Email validation
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }

  // Username validation
  if (!form.value.username) {
    errors.value.username = 'Username is required'
  } else if (!validateUsername(form.value.username)) {
    errors.value.username =
      'Username must be 3-30 characters and contain only letters, numbers, and underscores'
  }

  // First name validation
  if (!form.value.firstName) {
    errors.value.firstName = 'First name is required'
  } else if (form.value.firstName.length < 2) {
    errors.value.firstName = 'First name must be at least 2 characters'
  }

  // Last name validation
  if (!form.value.lastName) {
    errors.value.lastName = 'Last name is required'
  } else if (form.value.lastName.length < 2) {
    errors.value.lastName = 'Last name must be at least 2 characters'
  }

  // Phone validation
  if (!form.value.phone) {
    errors.value.phone = 'Phone number is required'
  } else if (!validatePhone(form.value.phone)) {
    errors.value.phone = 'Please enter a valid phone number'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) {
    return
  }

  const response = await storeOwnerStore.inviteStoreOwner(form.value)

  if (response) {
    // Reset form on success (keep role)
    form.value = {
      email: '',
      username: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'store_owner', // Keep role
    }
    errors.value = {}

    // Optionally redirect to dashboard after a delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }
}

const handleCancel = (): void => {
  router.push('/dashboard')
}

onMounted(() => {
  storeOwnerStore.clearError()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <GenericText variant="h1" size="3xl" weight="bold" class="mb-2">
          Invite Store Owner
        </GenericText>
        <GenericText variant="p" size="lg" color="text-gray-600">
          Create a new store owner account and send them an invitation email
        </GenericText>
      </div>

      <!-- Form Card -->
      <GenericCard variant="elevated">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email -->
          <div>
            <GenericInput
              v-model="form.email"
              type="email"
              label="Email Address"
              placeholder="store.owner@example.com"
              :error="errors.email || storeOwnerStore.fieldErrors.email"
              :disabled="storeOwnerStore.loading"
              required
              autocomplete="email"
            />
          </div>

          <!-- Username -->
          <div>
            <GenericInput
              v-model="form.username"
              type="text"
              label="Username"
              placeholder="store_owner_001"
              :error="errors.username || storeOwnerStore.fieldErrors.username"
              :disabled="storeOwnerStore.loading"
              required
              autocomplete="username"
            />
            <GenericText variant="p" size="xs" color="text-gray-500" class="mt-1">
              3-30 characters, letters, numbers, and underscores only
            </GenericText>
          </div>

          <!-- First Name -->
          <div>
            <GenericInput
              v-model="form.firstName"
              type="text"
              label="First Name"
              placeholder="John"
              :error="errors.firstName || storeOwnerStore.fieldErrors.firstName"
              :disabled="storeOwnerStore.loading"
              required
              autocomplete="given-name"
            />
          </div>

          <!-- Last Name -->
          <div>
            <GenericInput
              v-model="form.lastName"
              type="text"
              label="Last Name"
              placeholder="Doe"
              :error="errors.lastName || storeOwnerStore.fieldErrors.lastName"
              :disabled="storeOwnerStore.loading"
              required
              autocomplete="family-name"
            />
          </div>

          <!-- Phone -->
          <div>
            <GenericInput
              v-model="form.phone"
              type="tel"
              label="Phone Number"
              placeholder="+1234567890"
              :error="errors.phone || storeOwnerStore.fieldErrors.phone"
              :disabled="storeOwnerStore.loading"
              required
              autocomplete="tel"
            />
          </div>

          <!-- Role (Read-only, pre-populated) -->
          <div>
            <GenericInput
              :model-value="formatRoleDisplay(form.role)"
              type="text"
              label="Role"
              placeholder="Store Owner"
              :disabled="true"
              readonly
            />
            <GenericText variant="p" size="xs" color="text-gray-500" class="mt-1">
              This field is automatically set and cannot be changed
            </GenericText>
          </div>

          <!-- General Error Message (only if no field-specific errors) -->
          <div
            v-if="storeOwnerStore.error && !storeOwnerStore.hasFieldErrors"
            class="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <GenericText variant="p" size="sm" color="text-red-600">
              {{ storeOwnerStore.error }}
            </GenericText>
          </div>

          <!-- Actions -->
          <div class="flex gap-4 pt-4">
            <GenericButton
              type="button"
              variant="secondary"
              :disabled="storeOwnerStore.loading"
              @click="handleCancel"
              class="flex-1"
            >
              Cancel
            </GenericButton>
            <GenericButton
              type="submit"
              variant="primary"
              :disabled="storeOwnerStore.loading"
              :loading="storeOwnerStore.loading"
              class="flex-1"
            >
              <span v-if="!storeOwnerStore.loading">Invite Store Owner</span>
              <span v-else>Inviting...</span>
            </GenericButton>
          </div>
        </form>
      </GenericCard>

      <!-- Info Card -->
      <GenericCard variant="outlined" class="mt-6">
        <GenericText variant="h3" size="md" weight="semibold" class="mb-4">
          What happens next?
        </GenericText>
        <div class="space-y-3">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
            <GenericText variant="p" size="sm" color="text-gray-600">
              A secure password will be automatically generated for the store owner
            </GenericText>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
            <GenericText variant="p" size="sm" color="text-gray-600">
              A welcome email will be sent with login credentials and a verification link
            </GenericText>
          </div>
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
            <GenericText variant="p" size="sm" color="text-gray-600">
              The store owner must verify their email before accessing their account
            </GenericText>
          </div>
        </div>
      </GenericCard>
    </div>
  </div>
</template>
