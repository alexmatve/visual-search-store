<script setup lang="ts">
import { formatProductName, type Product } from '@/entities/products'
import { addToCart } from '@/features/handle-cart'
import { CURRENCY } from '@/shared/config'
import { RouteNames } from '@/shared/router'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { Heart, Minus, Plus, Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'

interface ProductCardProps {
  product: Product
  isCart?: boolean
  quantity?: number
}

const props = defineProps<ProductCardProps>()

const emit = defineEmits<{
  updateQuantity: [number, number]
  toggleLike: [number, boolean]
  deleteProduct: [number]
}>()

const userQuantity = ref<number>(props.quantity ?? 1)

const onLikeClick = (product_id: number, isLiked: boolean) => {
  emit('toggleLike', product_id, isLiked)
}

const onDeleteClick = (product_id: number) => {
  emit('deleteProduct', product_id)
}

watch(userQuantity, async () => {
  if (props.quantity) {
    await addToCart(props.product.id, userQuantity.value)
    emit('updateQuantity', props.product.id, userQuantity.value)
  }
})
</script>

<template>
  <div class="bg-cart-item border-cart-border flex items-center gap-4 rounded-lg border p-4">
    <div class="bg-muted flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
      <img
        :src="`data:image/png;base64,${product.image}`"
        :alt="product.name"
        class="h-full w-full rounded-md object-cover"
      />
    </div>

    <div class="min-w-0 flex-1">
      <RouterLink :to="{ name: RouteNames.ProductDetail, params: { id: product.id } }">
        <h3 class="text-foreground line-clamp-2 text-sm font-medium lg:text-base">
          {{ formatProductName(product.name) }}
        </h3>
      </RouterLink>
      <p class="mt-1 text-sm">
        Brand: <span>{{ product.brand }}</span>
      </p>
    </div>

    <div class="min-w-[80px] text-right text-sm font-semibold lg:text-base">
      {{ CURRENCY }}{{ product.price }}
    </div>

    <template v-if="isCart">
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8 bg-transparent"
          @click="userQuantity -= 1"
          :disabled="userQuantity <= 1"
        >
          <Minus class="h-4 w-4" />
        </Button>
        <div
          class="flex h-8 w-12 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium dark:border-gray-800 dark:bg-gray-950"
        >
          {{ userQuantity }}
        </div>
        <Button
          variant="outline"
          size="icon"
          class="h-8 w-8 bg-transparent"
          @click="userQuantity += 1"
        >
          <Plus class="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="bg-transparent px-2 sm:px-3"
        @click="onDeleteClick(product.id)"
      >
        <Trash2 class="h-4 w-4 stroke-black transition-all duration-300 ease-in-out" />
      </Button>
    </template>
    <template v-else>
      <Button
        variant="ghost"
        size="sm"
        class="bg-transparent px-2 sm:px-3"
        @click="onLikeClick(product.id, product.favorite)"
      >
        <Heart
          class="h-4 w-4 stroke-black transition-all duration-300 ease-in-out"
          :class="props.product.favorite ? 'fill-black' : 'fill-transparent'"
        />
      </Button>
    </template>
  </div>
</template>
