import { api } from '@/api/client'
import type { Product } from '@/entities/products'

export interface CartProductResponse {
  product: Product
  quantity: number
}

export const addToCart = (product_id: number, quantity: number) => {
  api.post(`cart/${product_id}`, { json: { quantity } })
}

export const removeProductFromCart = (product_id: number) => {
  api.delete(`cart/${product_id}`)
}

export const getCartProducts = (): Promise<CartProductResponse[]> => {
  return api.get('cart').json<CartProductResponse[]>()
}
