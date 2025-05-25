<template>
  <header class="camera-header">
    <button class="nav-button" @click="handleBack">
      <span class="icon">←</span>
      <span class="label">Prev Camera</span>
    </button>

    <div class="status-indicator">
      <span class="icon">✅</span>
      <span class="label">All Cameras Annotated</span>
    </div>

    <button class="nav-button">
      <span class="label">Next Camera</span>
      <span class="icon">→</span>
    </button>

    <!-- Tool Buttons -->
    <div class="tool-controls">
      <button
        :class="{ active: uiStore.currentTool === 'select' }"
        @click="uiStore.setTool('select')"
      >
        Select
      </button>
      <button
        :class="{ active: uiStore.currentTool === 'polygon' }"
        @click="uiStore.setTool('polygon')"
      >
        Polygon
      </button>
      <button
        :class="{ active: uiStore.currentTool === 'arrow' }"
        @click="uiStore.setTool('arrow')"
      >
        Arrow
      </button>
    </div>

    <button v-if="showUploaderToggle" class="upload-toggle" @click="$emit('toggle-uploader')">
      {{ showUploader ? 'Hide' : 'Show' }} Image Uploader
    </button>
  </header>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import { useAnnotationStore } from '@/stores/annotations'

const annotationStore = useAnnotationStore()

const handleBack = () => {
  annotationStore.deselectAnnotation()
}

defineProps<{
  showUploader: boolean
  showUploaderToggle: boolean
}>()
defineEmits(['toggle-uploader'])

const uiStore = useUIStore()
</script>

<style scoped>
.camera-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  align-items: center;
  background-color: #000;
  color: white;
  padding: 0.75rem 1rem;
  font-size: 14px;
}

.nav-button {
  background: #1f2937;
  color: #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
}

.status-indicator {
  background: #1f2937;
  color: #10b981;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tool-controls {
  display: flex;
  gap: 0.5rem;
}

.tool-controls button,
.upload-toggle {
  background: #374151;
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.tool-controls button.active {
  background-color: #10b981;
  color: white;
}
.tool-controls button:hover,
.upload-toggle:hover {
  background: #4b5563;
}
</style>
