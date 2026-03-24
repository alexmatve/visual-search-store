import type { Category } from '@/entities/categories'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: Category
  image: string
  brand: string
  favorite: boolean
}
