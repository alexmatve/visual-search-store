<script setup lang="ts">
import { RouteNames } from '@/shared/router'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { Input } from '@/shared/ui/shadcn/ui/input'
import authImage from '@/assets/images/auth_background.jpg'
import { useUserStore } from '@/stores/user'
import { useAsyncState } from '@vueuse/core'
import { reactive } from 'vue'
import type { LoginDTO } from '@/entities/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const formState = reactive<LoginDTO>({
  nickname: '',
  password: '',
})

const loginLoader = useAsyncState(async (userData: LoginDTO) => userStore.login(userData), null, {
  immediate: false,
})

const handleLogin = async () => {
  try {
    await loginLoader.execute(0, formState)
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
    <div class="flex items-center justify-center h-full lg:h-full lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
        <div class="flex flex-col gap-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Login</h1>
          <p class="text-muted-foreground text-sm">Enter your nickname below to login</p>
        </div>

        <div class="grid gap-6">
          <form @submit.prevent="handleLogin">
            <div class="grid gap-2">
              <Input
                id="nickname"
                v-model="formState.nickname"
                placeholder="name@example.com"
                type="text"
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
              <Button type="submit" :disabled="!loginLoader.isLoading"> Sign In </Button>
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t" />
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-background text-muted-foreground px-2">Or create an account</span>
                </div>
              </div>

              <RouterLink :to="{ name: RouteNames.Register }"
                ><Button class="w-full">Sign Up</Button></RouterLink
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
