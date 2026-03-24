<script setup lang="ts">
import type { Product } from '@/entities/products'
import { CURRENCY } from '@/shared/config'
import { RouteNames } from '@/shared/router'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { Heart } from 'lucide-vue-next'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  toggleLike: [number, boolean]
}>()

const onLikeClick = (product_id: number, isLiked: boolean) => {
  emit('toggleLike', product_id, isLiked)
}
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
          {{ product.name }}
        </h3>
      </RouterLink>
      <p class="mt-1 text-sm">{{ CURRENCY }}{{ product.price }}</p>
    </div>

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
  </div>
</template>
