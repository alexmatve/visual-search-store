<script setup lang="ts">
import { getCartProducts, removeProductFromCart } from '@/features/handle-cart'
import { CURRENCY } from '@/shared/config'
import { Button } from '@/shared/ui/shadcn/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/shadcn/ui/dialog'
import { useUserStore } from '@/stores/user'
import { Label } from '@/shared/ui/shadcn/ui/label'
import { Input } from '@/shared/ui/shadcn/ui/input'

import { ProductCard } from '@/widgets/profile'
import { useAsyncState } from '@vueuse/core'
import { computed, reactive, ref, watch } from 'vue'
import { CheckCircle } from 'lucide-vue-next'

const userStore = useUserStore()

const isOrderDialogOpen = ref(false)
const isOrderConfirmed = ref(false)

const orderForm = reactive({
  name: '',
  address: '',
  phone: '',
})

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

const confirmOrder = () => {
  isOrderConfirmed.value = true
}

watch(isOrderDialogOpen, (isOpen) => {
  if (isOpen) {
    isOrderConfirmed.value = false

    orderForm.name = userStore.user?.name ?? ''
    orderForm.address = userStore.user?.address ?? ''
    orderForm.phone = userStore.user?.tel ?? ''
  }
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

            <Dialog v-model:open="isOrderDialogOpen">
              <DialogTrigger as-child>
                <Button class="mt-6 h-12 w-full">Make an order</Button>
              </DialogTrigger>

              <DialogContent>
                <template v-if="!isOrderConfirmed">
                  <DialogHeader>
                    <DialogTitle>Confirm your order</DialogTitle>
                    <DialogDescription>
                      Please check your order details before confirmation.
                    </DialogDescription>
                  </DialogHeader>

                  <div class="space-y-6">
                    <div class="flex items-center justify-between rounded-lg border p-4">
                      <span class="font-medium">Order total</span>
                      <span class="text-xl font-bold">{{ CURRENCY }}{{ total }}</span>
                    </div>

                    <form class="space-y-4" @submit.prevent="confirmOrder">
                      <div class="space-y-2">
                        <Label for="name">Name</Label>
                        <Input id="name" v-model="orderForm.name" required />
                      </div>

                      <div class="space-y-2">
                        <Label for="address">Address</Label>
                        <Input id="address" v-model="orderForm.address" required />
                      </div>

                      <div class="space-y-2">
                        <Label for="phone">Phone</Label>
                        <Input id="phone" v-model="orderForm.phone" required />
                      </div>

                      <DialogFooter>
                        <Button type="submit" class="w-full"> Confirm order </Button>
                      </DialogFooter>
                    </form>
                  </div>
                </template>

                <template v-else>
                  <div class="flex flex-col items-center text-center space-y-4 py-6">
                    <CheckCircle class="h-16 w-16 text-black-500 animate-scale-in" />
                    <DialogHeader>
                      <DialogTitle>Thank you for your order!</DialogTitle>
                      <DialogDescription> We will contact you shortly. </DialogDescription>
                    </DialogHeader>

                    <DialogFooter class="w-full">
                      <Button class="w-full" @click="isOrderDialogOpen = false"> Close </Button>
                    </DialogFooter>
                  </div>
                </template>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
