<script setup lang="ts">
import { getCartProducts, removeProductFromCart } from '@/features/handle-cart'
import { CURRENCY } from '@/shared/config'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { ProductCard } from '@/widgets/profile'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'

const loader = useAsyncState(async () => getCartProducts(), null, {
  onError(error) {
    console.log('Failed to load products:', error)
  },
  immediate: true,
  shallow: false,
})

async function removeProduct(productId: number) {
  loader.state.value = loader.state.value!.filter((item) => item.product.id !== productId)

  try {
    await removeProductFromCart(productId)
  } catch (e) {
    console.error(e)
    loader.execute(0)
  }
}

const onQuantityChange = (product_id: number, quantity: number) => {
  loader.state.value = loader.state.value!.map((val) =>
    val.product.id === product_id ? { ...val, quantity: quantity } : val,
  )
}

const total = computed(() => {
  return (
    loader.state.value?.reduce((prev, val) => (prev += val.product.price * val.quantity), 0)! - 10
  )
})
</script>

<template>
  <div class="bg-background min-h-screen p-4 lg:p-8">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <div class="bg-card border-cart-border rounded-lg border p-6">
            <h1 class="mb-6 text-2xl font-semibold">Shopping Cart</h1>

            <div class="space-y-4">
              <ProductCard
                v-for="productInfo of loader.state.value"
                :key="productInfo.product.id"
                :product="productInfo.product"
                :is-cart="true"
                :quantity="productInfo.quantity"
                @delete-product="removeProduct"
                @update-quantity="onQuantityChange"
              />
            </div>
          </div>
        </div>
        <div class="space-y-6">
          <div class="bg-card border-cart-border rounded-lg border p-6">
            <h2 class="mb-6 text-xl font-semibold">Order Summary</h2>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Delivery</span>
                <span class="font-medium">{{ CURRENCY }}10</span>
              </div>

              <hr class="border-cart-border" />

              <div class="flex items-center justify-between">
                <span class="text-lg font-semibold">Total</span>
                <span class="text-xl font-bold">{{ CURRENCY }}{{ total }}</span>
              </div>
            </div>

            <Button class="mt-6 h-12 w-full"> Make an order </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
