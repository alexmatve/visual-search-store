<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/shared/ui/shadcn/ui/radio-group'
import { Label } from '@/shared/ui/shadcn/ui/label'
import { Separator } from '@/shared/ui/shadcn/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/ui/tabs'
import { Slider } from '@/shared/ui/shadcn/ui/slider'
import { CategoryName, formatCategoryName, getCategories } from '@/entities/categories'
import { MAX_PRICE, MIN_PRICE, STEP_PRICE } from '../model/constants'
import { CURRENCY } from '@/shared/config'
import { computed, ref, watch } from 'vue'
import { useAsyncState } from '@vueuse/core'
import type { ProductsListQuery } from '@/entities/products'
import { Input } from '@/shared/ui/shadcn/ui/input'

const props = defineProps<{ query: ProductsListQuery }>()

const emit = defineEmits<{
  'update:query': [ProductsListQuery]
}>()

const selectedCategory = ref<string>('All')
const selectedGenderTab = ref<'men' | 'women'>('men')

const categoriesLoader = useAsyncState(
  async () => getCategories(),
  {
    categories: [],
  },
  {
    onError(error) {
      console.error('Failed to load categories:', error)
    },
    immediate: true,
  },
)

const filteredCategories = computed(() => {
  const categories = categoriesLoader.state.value.categories.filter(
    (c) => c.gender === selectedGenderTab.value,
  )
  return [{ id: 0, name: CategoryName.All }, ...categories]
})

const priceRange = ref<[number, number]>([MIN_PRICE, MAX_PRICE])

function emitQueryPatch(patch: Partial<ProductsListQuery>) {
  emit('update:query', {
    ...props.query,
    ...patch,
  })
}

function applyPriceFilters() {
  emitQueryPatch({
    minPrice: priceRange.value[0],
    maxPrice: priceRange.value[1],
  })
}

function onPriceCommit(value: number[]) {
  priceRange.value = value as [number, number]
  applyPriceFilters()
}

function onMinPriceInput(val: string | number) {
  priceRange.value = [Number(val), priceRange.value[1]]
  applyPriceFilters()
}

function onMaxPriceInput(val: string | number) {
  priceRange.value = [priceRange.value[0], Number(val)]
  applyPriceFilters()
}

watch(
  [selectedCategory, selectedGenderTab],
  ([newCategory, newGender]) => {
    emitQueryPatch({
      category: newCategory !== 'All' ? newCategory : undefined,
      gender: newGender,
    })
  },
  { immediate: true },
)
</script>
<template>
  <Tabs v-model="selectedGenderTab">
    <TabsList class="mb-4 w-full rounded-lg border bg-muted p-1">
      <TabsTrigger value="men" class="flex-1 uppercase !hover:bg-muted">Men</TabsTrigger>
      <TabsTrigger value="women" class="flex-1 uppercase !hover:bg-muted">Women</TabsTrigger>
    </TabsList>

    <h3 class="mb-3 font-semibold">Categories</h3>
    <RadioGroup v-model="selectedCategory" name="category">
      <div class="flex flex-col gap-3 text-sm">
        <div
          v-for="category of filteredCategories"
          :key="category.id"
          class="flex items-center gap-2"
        >
          <RadioGroupItem :value="category.name" :id="`category-${category.id}`" />
          <Label :for="`category-${category.id}`" class="cursor-pointer text-sm font-normal">
            {{ formatCategoryName(category.name) }}
          </Label>
        </div>
      </div>
    </RadioGroup>
  </Tabs>
  <Separator class="my-4 bg-gray-300" />

  <div>
    <h3 class="mb-3 font-semibold">Price</h3>
    <div class="space-y-4">
      <Slider
        v-model="priceRange"
        @value-commit="onPriceCommit"
        :max="MAX_PRICE"
        :step="STEP_PRICE"
        class="w-full"
      />
      <div class="flex items-center space-x-2">
        <div class="flex-1">
          <Label htmlFor="price-from" class="text-muted-foreground text-xs"> From </Label>
          <div class="relative">
            <span class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {{ CURRENCY }}
            </span>
            <Input
              id="price-from"
              type="number"
              :model-value="priceRange[0]"
              @update:modelValue="onMinPriceInput"
              class="h-8 pl-6"
              :min="MIN_PRICE"
              :max="MAX_PRICE"
              :step="STEP_PRICE"
            />
          </div>
        </div>
        <div class="flex-1">
          <Label htmlFor="price-to" class="text-muted-foreground text-xs"> To </Label>
          <div class="relative">
            <span class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {{ CURRENCY }}
            </span>
            <Input
              id="price-to"
              type="number"
              :model-value="priceRange[1]"
              @update:modelValue="onMaxPriceInput"
              class="h-8 pl-6"
              :min="MIN_PRICE"
              :max="MAX_PRICE"
              :step="STEP_PRICE"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
