<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { getProducts, type ProductsListQuery } from '@/entities/products'
import { CatalogFilters, LIMIT } from '@/widgets/catalog-filters'
import { ProductList } from '@/widgets/product-list'
import { useUserStore } from '@/stores/user'

const { user } = useUserStore()

const query = ref<ProductsListQuery>({
  limit: LIMIT,
  offset: 0,
})

const loader = useAsyncState(
  async () => getProducts(query.value),
  {
    products: [],
    total: 0,
  },
  {
    onError(error) {
      console.error('Failed to load products:', error)
    },
    immediate: false,
  },
)

const currentPage = ref<number>(1)

function onPaginationChange(page: number) {
  currentPage.value = page
  query.value.offset = LIMIT * (currentPage.value - 1)
  loader.execute()
}

function onUpdateQuery(newQuery: ProductsListQuery) {
  query.value = {
    ...newQuery,
    offset: 0,
  }
  currentPage.value = 1
  loader.execute()
}

onMounted(() => {
  console.log(user?.id, user?.name, user?.nickname)
})
</script>

<template>
  <div class="px-4 py-4 sm:py-6">
    <div class="flex flex-col gap-30 lg:flex-row">
      <aside class="hidden w-64 lg:block">
        <div class="p-4 gap-3">
          <CatalogFilters :query="query" @update:query="onUpdateQuery" />
        </div>
      </aside>

      <div v-if="loader.state.value" class="flex-1 ml-10 mr-10 max-w-7xl">
        <ProductList
          :products="loader.state.value.products"
          :total="loader.state.value.total"
          :current-page="currentPage"
          :items-per-page="LIMIT"
          @update:page="onPaginationChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
