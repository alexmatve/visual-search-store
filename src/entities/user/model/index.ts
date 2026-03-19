export interface User {
  id: string
  nickname: string
  name: string
  address?: string
  tel?: string
  role: string
  createdAt: string
}

export interface LoginDTO {
  nickname: string
  password: string
}

export interface RegisterDTO {
  nickname: string
  password: string
  name: string
  address?: string
  tel?: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface EditProfileDTO {
  name: string
  address: string
  tel: string
}
