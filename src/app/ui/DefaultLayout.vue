<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import { Toaster } from '@/shared/ui/shadcn/ui/sonner'
</script>

<template>
  <div>
    <Toaster position="top-center" />
    <AppHeader />
    <main>
      <slot />
    </main>
  </div>
</template>
