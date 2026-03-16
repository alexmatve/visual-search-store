import type { Category } from '@/entities/categories'

// нужно создать интерфейса Category с gender
export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: Category
  image: string
  brand: string
}
