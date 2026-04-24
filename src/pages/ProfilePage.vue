<script setup lang="ts">
import type { EditProfileDTO } from '@/entities/user'
import { addLike, getFavoriteProducts, removeLike } from '@/features/toggle-like'
import { NO_DATA } from '@/shared/config'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/shadcn/ui/avatar'
import { Button } from '@/shared/ui/shadcn/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/shadcn/ui/card'
import { Input } from '@/shared/ui/shadcn/ui/input'
import { Label } from '@/shared/ui/shadcn/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/shadcn/ui/tabs'
import { useUserStore } from '@/stores/user'
import { ProductCard } from '@/widgets/profile'
import { useAsyncState, useDateFormat } from '@vueuse/core'
import { Calendar, Camera, MapPin, Phone } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { reactive, ref, watch } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isEditModeOff = ref<boolean>(true)

const loader = useAsyncState(async () => getFavoriteProducts(), null, {
  onError(error) {
    console.error('Failed to load products:', error)
  },
  immediate: true,
  shallow: false,
})

const getInitialFormState = (): EditProfileDTO => ({
  name: user.value?.name ?? '',
  address: user.value?.address ?? '',
  tel: user.value?.tel ?? '',
})

const formState = reactive<EditProfileDTO>(getInitialFormState())

const editLoader = useAsyncState(
  async (data: EditProfileDTO) => userStore.editProfile(data),
  null,
  { immediate: false },
)

const handleEditProfile = async () => {
  await editLoader.execute(0, formState)
  isEditModeOff.value = true
}
const cancelEditProfile = () => {
  Object.assign(formState, getInitialFormState())
  isEditModeOff.value = true
}

async function setLikeState(productId: number, isLiked: boolean) {
  if (isLiked) {
    await removeLike(productId)
  } else {
    await addLike(productId)
  }

  loader.state.value = loader.state.value!.map((product) =>
    product.id === productId ? { ...product, favorite: !isLiked } : product,
  )
}

const currentTab = ref('personal')

watch(
  user,
  () => {
    if (isEditModeOff.value) {
      Object.assign(formState, getInitialFormState())
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-6 px-4 py-10">
    <Card>
      <CardContent>
        <div class="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div class="relative">
            <Avatar class="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback class="text-2xl">{{
                user?.name.charAt(0).toUpperCase()
              }}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              class="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          <div class="flex-1 space-y-2">
            <div class="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 class="text-2xl font-bold">{{ user?.name }}</h1>
            </div>
            <p class="text-muted-foreground">{{ user?.nickname }}</p>
            <div class="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div class="flex items-center gap-1">
                <Phone class="size-4" />
                {{ user?.tel }}
              </div>
              <div class="flex items-center gap-1">
                <MapPin class="size-4" />
                {{ user?.address ?? NO_DATA }}
              </div>
              <div class="flex items-center gap-1">
                <Calendar class="size-4" />
                {{ useDateFormat(user?.createdAt, 'DD MMM YYYY') }}
              </div>
            </div>
          </div>
          <Button
            v-if="currentTab === 'personal'"
            variant="default"
            :disabled="!isEditModeOff"
            @click="isEditModeOff = false"
            >Edit Profile</Button
          >
        </div>
      </CardContent>
    </Card>

    <Tabs defaultValue="personal" v-model:modelValue="currentTab" class="space-y-6">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile information.</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div class="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Alexander"
                  v-model="formState.name"
                  :readonly="isEditModeOff"
                />
              </div>
              <div class="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (555) 123-4567"
                  v-model="formState.tel"
                  :readonly="isEditModeOff"
                />
              </div>
              <div class="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Moscow, Developerskaya, 404"
                  v-model="formState.address"
                  :readonly="isEditModeOff"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3">
              <Button v-if="!isEditModeOff" variant="default" @click="handleEditProfile"
                >Confirm</Button
              >
              <Button v-if="!isEditModeOff" variant="default" @click="cancelEditProfile"
                >Cancel</Button
              >
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="favorites">
        <div class="bg-background min-h-screen p-4 lg:p-8">
          <div class="mx-auto max-w-7xl">
            <div class="bg-card border-cart-border rounded-lg border p-6">
              <h1 class="mb-6 text-2xl font-semibold">Favorites</h1>

              <div class="space-y-4">
                <ProductCard
                  v-for="product of loader.state.value"
                  :key="product.id"
                  :product="product"
                  @toggleLike="setLikeState"
                />
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
