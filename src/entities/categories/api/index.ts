import { publicApi } from '@/api/client'
import type { Category } from '../model/typing'

export interface CategoriesListResponse {
  categories: Category[]
}

export const getCategories = () => {
  return publicApi.get('categories').json<CategoriesListResponse>()
}
