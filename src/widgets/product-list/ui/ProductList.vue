<script setup lang="ts">
import { ProductCatalogCard, type Product } from '@/entities/products'

// import { Badge } from '@/shared/ui/shadcn/ui/badge'
import { Search } from 'lucide-vue-next'
import { Input } from '@/shared/ui/shadcn/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
} from '@/shared/ui/shadcn/ui/pagination'

interface ProductListProps {
  products: Product[]
  total: number
  currentPage: number
  itemsPerPage: number
}

const props = defineProps<ProductListProps>()
const emit = defineEmits<{
  'update:page': [number]
  toggleLike: [number, boolean]
  addToCart: [number]
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
      <ProductCatalogCard
        v-for="product of products"
        :key="product.id"
        :product="product"
        @toggle-like="({ productId, favorite }) => emit('toggleLike', productId, favorite)"
        @add-to-cart="emit('addToCart', $event)"
      />
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
