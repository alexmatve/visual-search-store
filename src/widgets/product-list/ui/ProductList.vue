<script setup lang="ts">
import { formatProductName, type Product } from '@/entities/products'
import { Card, CardContent } from '@/shared/ui/shadcn/ui/card'
import { Button } from '@/shared/ui/shadcn/ui/button'
// import { Badge } from '@/shared/ui/shadcn/ui/badge'
import { Heart, Search, ShoppingCart } from 'lucide-vue-next'
import { Input } from '@/shared/ui/shadcn/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
} from '@/shared/ui/shadcn/ui/pagination'
import { RouteNames } from '@/shared/router'
import { CURRENCY } from '@/shared/config'

interface ProductListProps {
  products: Product[]
  total: number
  currentPage: number
  itemsPerPage: number
}

const props = defineProps<ProductListProps>()
const emit = defineEmits<{
  'update:page': [number]
}>()
</script>

<template>
  <div class="pb-4 flex flex-col gap-4 sm:mb-6">
    <div class="flex items-center gap-4">
      <div class="relative flex-1 sm:flex-initial">
        <Search
          class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform"
        />
        <Input placeholder="Search products..." class="w-full pl-10 sm:w-64" />
      </div>
    </div>
  </div>

  <div class="flex flex-col">
    <div class="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4">
      <!-- grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 -->
      <!-- grid gap-4 sm:gap-6 xs:grid-cols-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 -->
      <Card
        v-for="product of products"
        :key="product.id"
        class="p-3 sm:p-4 hover:shadow-lg transition"
      >
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

              <!-- <Badge variant="destructive" class="text-xs"> -{{product.discount}}% </Badge> -->
            </div>
            <p class="text-muted-foreground text-xs">Brand: {{ product.brand }}</p>
            <div class="flex gap-2 pt-2">
              <Button variant="outline" class="flex-1" size="sm">
                <ShoppingCart class="mr-1 h-4 w-4 sm:mr-2" />
                <span class="xs:inline hidden">Add to cart</span>
                <span class="xs:hidden">Add</span>
              </Button>
              <Button variant="outline" size="sm" class="bg-transparent px-2 sm:px-3">
                <Heart class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="mt-6 self-end w-fit">
      <Pagination
        :page="currentPage"
        @update:page="emit('update:page', $event)"
        :items-per-page="itemsPerPage"
        :total="total"
        :default-page="1"
        :sibling-count="2"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationFirst />
          <template v-for="(item, index) in items" :key="index">
            <PaginationItem
              v-if="item.type === 'page'"
              :value="item.value"
              :is-active="item.value === props.currentPage"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :index="index" />
          </template>
          <PaginationLast />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>
