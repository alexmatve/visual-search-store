<script setup lang="ts">
import type { ProductsListResponse } from '@/entities/products'
import { searchByImage } from '@/features/visual-search'
import { computed, ref, watch } from 'vue'

const emit = defineEmits<{
  'update:products': [ProductsListResponse]
}>()

const selectedFile = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function onFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (file) {
    selectedFile.value = file
    const result = await searchByImage(selectedFile.value)
    emit('update:products', result)
  }
}

async function onDrop(event: DragEvent) {
  event.preventDefault()

  const file = event.dataTransfer?.files?.[0]

  if (file) {
    selectedFile.value = file
    const result = await searchByImage(selectedFile.value)
    emit('update:products', result)
  }
}

function openFileDialog() {
  fileInputRef.value?.click()
}

const previewUrl = computed(() => {
  if (!selectedFile.value) return null
  return URL.createObjectURL(selectedFile.value)
})

function resetFile() {
  selectedFile.value = null

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  emit('update:products', { products: [], total: 0 })
}

watch(selectedFile, (newFile, oldFile) => {
  if (oldFile) {
    URL.revokeObjectURL(URL.createObjectURL(oldFile))
  }
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div v-if="selectedFile" class="relative w-full min-h-64 rounded-2xl overflow-hidden border">
      <img :src="previewUrl!" alt="preview" class="h-full w-full object-cover" />

      <button
        class="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded-md text-sm"
        @click.stop="resetFile"
      >
        ✕
      </button>
    </div>

    <div
      v-else
      class="flex min-h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center"
      @dragover.prevent
      @drop="onDrop"
      @click="openFileDialog"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileSelect"
      />

      <p class="text-lg font-medium">Drag image here</p>
      <p class="text-sm text-muted-foreground">or click to select a file</p>
    </div>
  </div>
</template>
