import { authApi } from '@/api/auth'
import { api } from '@/api/client'
import type { LoginDTO, RegisterDTO, User } from '@/entities/user'
import { authStorage } from '@/shared/lib'
import { useStorage } from '@vueuse/core'
import { HTTPError } from 'ky'
import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(authStorage.getToken())
  const isLoading = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value) && user.value)

  const setAuth = (accessToken: string, userData: User) => {
    token.value = accessToken
    user.value = userData
    authStorage.setToken(accessToken)
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    authStorage.removeToken()
  }

  const login = async (payload: LoginDTO) => {
    isLoading.value = true

    try {
      const response = await authApi.login(payload)
      setAuth(response.accessToken, response.user)
    } finally {
      isLoading.value = false
    }
  }

  const register = async (payload: RegisterDTO) => {
    isLoading.value = true

    try {
      const response = await authApi.register(payload)
      setAuth(response.accessToken, response.user)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMe = async () => {
    if (!token.value) return

    try {
      const profile = await authApi.getProfile()
      user.value = profile
    } catch (error) {
      if (error instanceof HTTPError && error.response.status === 401) {
        clearAuth()
        return
      }
      throw error
    }
  }

  const initAuth = async () => {
    const savedToken = authStorage.getToken()

    if (!savedToken) {
      clearAuth()
      return
    }

    token.value = savedToken

    try {
      await fetchMe()
    } catch {
      clearAuth()
    }
  }

  const logout = () => {
    clearAuth()
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    fetchMe,
    initAuth,
    logout,
    clearAuth,
  }
})
