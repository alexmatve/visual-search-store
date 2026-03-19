import { publicApi } from '@/api/client'
import type { User } from '@/entities/user'

interface LoginData {
  user: {
    id: string
    email: string
    password_hash: string
    name: string
    address?: string
    tel?: string
    role: User['role']
    created_at: string
  }
  token: string
}

export const login = (payload: { email: string; password: string }): Promise<LoginData | null> => {
  return publicApi.post('/auth/login', { json: payload }).json<LoginData>()
}
