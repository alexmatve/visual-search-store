import { api } from '@/api/client'
import type { Category } from '../model/typing'

export interface CategoriesListResponse {
  categories: Category[]
}

export const getCategories = () => {
  return api.get('categories').json<CategoriesListResponse>()
}
