import { api, publicApi } from '@/api/client'
import type { Product } from '../model/typing'
import { createPaginationSearchParams } from '@/api/pagination'

export interface ProductsListQuery {
  limit?: number
  offset?: number
  category?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
}

export interface ProductsListResponse {
  products: Product[]
  total: number
}

export const getProducts = (query: ProductsListQuery = {}): Promise<ProductsListResponse> => {
  const params = createPaginationSearchParams(query)
  query.category && params.set('category', query.category)
  query.gender && params.set('gender', query.gender)
  query.minPrice && params.set('minPrice', query.minPrice.toString())
  query.maxPrice && params.set('maxPrice', query.maxPrice.toString())
  return publicApi.get('products', { searchParams: params }).json<ProductsListResponse>()
}

export const getProduct = (id: string): Promise<Product> => {
  return publicApi.get(`products/${id}`).json<Product>()
}
