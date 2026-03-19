import {
  type AuthResponse,
  type EditProfileDTO,
  type LoginDTO,
  type RegisterDTO,
  type User,
} from '@/entities/user'
import { api } from './client'

export const authApi = {
  login(data: LoginDTO) {
    return api.post('auth/login', { json: data }).json<AuthResponse>()
  },

  register(data: RegisterDTO) {
    return api.post('auth/register', { json: data }).json<AuthResponse>()
  },

  getProfile() {
    return api.get('auth/user').json<User>()
  },

  editProfile(data: EditProfileDTO) {
    return api.put('auth/user', { json: data }).json<User>()
  },
}
