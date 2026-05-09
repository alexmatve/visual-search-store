import { fileApi } from '@/api/client'
import type { ProductsListResponse } from '@/entities/products'

export async function searchByImage(file: File): Promise<ProductsListResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return fileApi
    .post('ai/predict', {
      body: formData,
    })
    .json()
}
