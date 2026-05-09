import { authStorage } from '@/shared/lib'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = authStorage.getToken()

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          authStorage.removeToken()
        }
      },
    ],
  },
  timeout: 30_000,
})

export const fileApi = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = authStorage.getToken()

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          authStorage.removeToken()
        }
      },
    ],
  },
  timeout: 30_000,
})
