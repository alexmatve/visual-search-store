<script setup lang="ts">
import { RouterView } from 'vue-router'
import DefaultLayout from './app/ui/DefaultLayout.vue'
</script>

<template>
  <component :is="DefaultLayout">
    <router-view />
  </component>
</template>
