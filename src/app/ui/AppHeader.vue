<script setup lang="ts">
import { RouteNames } from '@/shared/router'
import { Button } from '@/shared/ui/shadcn/ui/button'
import { useUserStore } from '@/stores/user'
import { User } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()
</script>

<template>
  <header class="bg-black text-white">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink :to="{ name: RouteNames.ProductList }">
        <div class="text-lg font-semibold tracking-wide">VisualStore</div>
      </RouterLink>

      <div v-if="userStore.user">
        <RouterLink :to="{ name: RouteNames.Profile }"
          ><Button variant="ghost">{{ userStore.user.nickname }} <User /></Button
        ></RouterLink>
        <Button variant="ghost" @click="userStore.logout">Logout</Button>
      </div>
      <div v-else>
        <RouterLink :to="{ name: RouteNames.Login }"
          ><Button variant="ghost">Login</Button></RouterLink
        >
        <RouterLink :to="{ name: RouteNames.Register }"
          ><Button variant="ghost">Signup</Button></RouterLink
        >
      </div>
    </div>
  </header>
</template>
