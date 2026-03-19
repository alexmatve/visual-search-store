<script setup lang="ts">
import { RouteNames } from '@/shared/router'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { Input } from '@/shared/ui/shadcn/ui/input'
import authImage from '@/assets/images/auth_background.jpg'
import { useUserStore } from '@/stores/user'
import { useAsyncState } from '@vueuse/core'
import { reactive } from 'vue'
import type { RegisterDTO } from '@/entities/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const formState = reactive<RegisterDTO>({
  nickname: '',
  password: '',
  name: '',
})

const registerLoader = useAsyncState(
  async (userData: RegisterDTO) => userStore.register(userData),
  null,
  {
    immediate: false,
  },
)

const handleRegister = async () => {
  try {
    await registerLoader.execute(0, formState)
    await router.push({ name: RouteNames.ProductList })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="relative h-screen container md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
      <div
        class="bg-primary/5 absolute inset-0"
        :style="{
          backgroundImage: `url(${authImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }"
      />
      <div class="relative z-20 mt-auto max-w-3xl text-white/70 mb-10">
        <blockquote class="leading-normal text-balance">
          &ldquo;This project is for educational purposes only. It is recommended not to use real
          login credentials.&rdquo;
        </blockquote>
      </div>
    </div>
    <div class="flex items-center justify-center lg:h-screen lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
        <div class="flex flex-col gap-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Signup</h1>
          <p class="text-muted-foreground text-sm">Enter your data below to signup</p>
        </div>

        <div class="grid gap-6">
          <form @submit.prevent="handleRegister">
            <div class="grid gap-2">
              <Input
                id="nickname"
                v-model="formState.nickname"
                placeholder="Your user name"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <Input
                id="name"
                v-model="formState.name"
                placeholder="Alexander"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <Input
                id="tel"
                v-model="formState.tel"
                placeholder="+7-123-567-89-01"
                type="tel"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <Input
                id="password"
                v-model="formState.password"
                placeholder="password"
                type="password"
                autoCapitalize="none"
                autoCorrect="off"
              />
              <Button type="submit" :disabled="!registerLoader.isLoading"> Sign Up </Button>
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t" />
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-background text-muted-foreground px-2"
                    >Already have an account?</span
                  >
                </div>
              </div>

              <RouterLink :to="{ name: RouteNames.Login }"
                ><Button class="w-full">Sign In</Button></RouterLink
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
