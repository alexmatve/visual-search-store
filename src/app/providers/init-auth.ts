import { useUserStore } from '@/stores/user'

export async function initAuth() {
  const userStore = useUserStore()
  await userStore.initAuth()
}
