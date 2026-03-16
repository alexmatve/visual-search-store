import ky from 'ky'

const api = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  timeout: 30_000,
})

export const publicApi = api
