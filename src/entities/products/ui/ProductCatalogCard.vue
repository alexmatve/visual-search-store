<script setup lang="ts">
import { ref } from 'vue'
import { formatProductName, type Product } from '@/entities/products'
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { Heart, ShoppingCart, Check } from 'lucide-vue-next'
import { RouteNames } from '@/shared/router'
import { CURRENCY } from '@/shared/config'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  toggleLike: [{ productId: number; favorite: boolean }]
  addToCart: [number]
}>()

const isAdded = ref(false)
let addedTimer: ReturnType<typeof setTimeout> | null = null

const onLikeClick = () => {
  emit('toggleLike', {
    productId: props.product.id,
    favorite: props.product.favorite,
  })
}

const onCartButtonClick = async () => {
  emit('addToCart', props.product.id)

  isAdded.value = true

  if (addedTimer) {
    clearTimeout(addedTimer)
  }

  addedTimer = setTimeout(() => {
    isAdded.value = false
  }, 1000)
}
</script>

<template>
  <Card class="p-3 sm:p-4 hover:shadow-lg transition">
    <CardContent class="p-3 sm:p-4">
      <div class="relative mb-3 sm:mb-4 aspect-[2/3] overflow-hidden rounded-md">
        <img
          :src="`data:image/png;base64,${product.image}`"
          :alt="product.name"
          class="h-full w-full rounded-md object-cover"
        />
      </div>

      <div class="space-y-2">
        <RouterLink :to="{ name: RouteNames.ProductDetail, params: { id: product.id } }">
          <h3 class="line-clamp-2 text-sm leading-tight font-medium">
            {{ formatProductName(product.name) }}
          </h3>
        </RouterLink>
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-base font-bold text-blue-600 sm:text-lg">
            {{ CURRENCY }}{{ product.price.toFixed(2) }}
          </span>
        </div>
        <p class="text-muted-foreground text-xs">Brand: {{ product.brand }}</p>
        <div class="flex gap-2 pt-2">
          <Button
            variant="outline"
            class="flex-1 transition-all duration-300"
            size="sm"
            @click="onCartButtonClick"
          >
            <template v-if="isAdded">
              <Check class="mr-1 h-4 w-4 sm:mr-2" />
              <span class="xs:inline">Product added</span>
            </template>

            <template v-else>
              <ShoppingCart class="mr-1 h-4 w-4 sm:mr-2" />
              <span class="xs:inline hidden">Add to cart</span>
              <span class="xs:hidden">Add</span>
            </template>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="bg-transparent px-2 sm:px-3"
            @click="onLikeClick"
          >
            <Heart
              class="h-4 w-4 stroke-black transition-all duration-300 ease-in-out"
              :class="product.favorite ? 'fill-black' : 'fill-transparent'"
            />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
