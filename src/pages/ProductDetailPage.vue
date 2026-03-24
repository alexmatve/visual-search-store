<script setup lang="ts">
import { getProduct } from '@/entities/products'
import { useAsyncState } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { ArrowLeft, Minus, Plus, Share2, ShoppingBagIcon } from 'lucide-vue-next'
import { Separator } from '@/shared/ui/shadcn/ui/separator'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const loader = useAsyncState(async () => getProduct(route.params.id as string), undefined, {
  onError(error) {
    console.error('Failed to load product:', error)
  },
})

const quantity = ref<number>(1)

const CURRENCY = '$'

const copyProductUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('URL скопирован в буфер обмена')
  } catch (error) {
    console.error(error)
    toast.error('Не удалось скопировать ссылку')
  }
}

const goBack = () => {
  if (history.length > 2) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div v-if="loader.state.value" class="mx-auto max-w-7xl space-y-6 px-4 py-8">
    <div class="flex items-start justify-between">
      <div class="grid gap-2">
        <Button
          variant="outline"
          size="sm"
          class="gap-2 w-fit ml-[-100px] h-10 w-20"
          @click="goBack"
        >
          <ArrowLeft />
        </Button>
        <div class="text-sm text-gray-500">{{ loader.state.value.category.name }}</div>
        <h1 class="text-3xl font-bold">{{ loader.state.value.name }}</h1>
        <h3>{{ loader.state.value.brand }}</h3>
      </div>

      <Button variant="ghost" size="icon" class="rounded-full" @click="copyProductUrl">
        <Share2 class="h-5 w-5" />
      </Button>
    </div>
    <Separator />
    <div class="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
      <div class="grid items-start gap-8 md:grid-cols-2 lg:grid-cols-[400px_1fr] lg:gap-12">
        <div class="relative">
          <img
            :src="`data:image/png;base64,${loader.state.value.image}`"
            :alt="loader.state.value.name"
            class="aspect-[2/3] h-full w-full rounded-md object-cover border"
          />
        </div>
      </div>

      <div class="grid gap-6">
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold">{{ CURRENCY }}{{ loader.state.value.price }}</span>
        </div>
        <div class="text-sm text-gray-500">N products sold out</div>

        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label htmlFor="composition" class="text-base font-medium"> Description </Label>
            <p class="text-sm text-gray-500">{{ loader.state.value.description }}</p>
          </div>

          <div class="grid gap-2">
            <Label htmlFor="quantity" class="text-base font-medium"> Quantity </Label>
            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 bg-transparent"
                @click="quantity -= 1"
                :disabled="quantity <= 1"
              >
                <Minus class="h-4 w-4" />
              </Button>
              <div
                class="flex h-8 w-12 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium dark:border-gray-800 dark:bg-gray-950"
              >
                {{ quantity }}
              </div>
              <Button
                variant="outline"
                size="icon"
                class="h-8 w-8 bg-transparent"
                @click="quantity += 1"
              >
                <Plus class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-2 min-[400px]:flex-row">
            <Button class="h-12 flex-1 text-lg">
              <ShoppingBagIcon />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
