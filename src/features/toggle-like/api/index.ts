import { api } from '@/api/client'
import type { Product, ProductsListResponse } from '@/entities/products'

export const addLike = (product_id: number) => {
  api.post(`favorites/${product_id}`)
}

export const removeLike = (product_id: number) => {
  api.delete(`favorites/${product_id}`)
}

export const getFavoriteProducts = (): Promise<Product[]> => {
  return api.get('favorites').json<Product[]>()
}
