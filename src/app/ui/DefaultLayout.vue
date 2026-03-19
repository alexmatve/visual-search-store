<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import { Toaster } from '@/shared/ui/shadcn/ui/sonner'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Toaster position="top-center" />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
