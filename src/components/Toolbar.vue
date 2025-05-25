<template>
  <div class="toolbar">
    <button @click="exportAnnotations">Export JSON</button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppToolbar' })
import { useAnnotationStore } from '@/stores/annotations'

const annotationStore = useAnnotationStore()

const exportAnnotations = () => {
  const json = JSON.stringify(annotationStore.annotations, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'annotations.json'
  a.click()

  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.toolbar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}
button {
  background: #222;
  color: white;
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 4px;
  cursor: pointer;
}
</style>
