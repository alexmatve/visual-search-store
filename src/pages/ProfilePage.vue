<script setup lang="ts">
import type { EditProfileDTO } from '@/entities/user'
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
import { useAsyncState, useDateFormat } from '@vueuse/core'
import { Calendar, Camera, MapPin, Phone } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { reactive, ref, watch } from 'vue'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const isEditModeOff = ref<boolean>(true)

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
          <Button variant="default" :disabled="!isEditModeOff" @click="isEditModeOff = false"
            >Edit Profile</Button
          >
        </div>
      </CardContent>
    </Card>

    <Tabs defaultValue="personal" class="space-y-6">
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

            <Button v-if="!isEditModeOff" variant="default" @click="handleEditProfile"
              >Confirm</Button
            >
            <Button v-if="!isEditModeOff" variant="default" @click="cancelEditProfile"
              >Cancel</Button
            >
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
