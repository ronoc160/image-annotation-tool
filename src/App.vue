<template>
  <div id="app">
    <CameraHeader
      :showUploader="showUploader"
      :showUploaderToggle="showUploaderToggle"
      @toggle-uploader="toggleUploader"
    />

    <div class="main-layout">
      <Sidebar class="sidebar" />

      <div class="content">
        <Toolbar class="toolbar" />
        <ImageUploader v-if="showUploader" />
        <AnnotationCanvas class="canvas" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import CameraHeader from './components/CameraHeader.vue'
import Sidebar from './components/Sidebar.vue'
import Toolbar from './components/Toolbar.vue'
import AnnotationCanvas from './components/AnnotationCanvas.vue'
import ImageUploader from './components/ImageUploader.vue'
import { useImageStore } from '@/stores/image'

const imageStore = useImageStore()
const headerRef = ref()

const showUploader = ref(true)
const showUploaderToggle = ref(false)
const toggleUploader = () => {
  showUploader.value = !showUploader.value
}
onMounted(() => {
  if (headerRef.value?.showUploader) {
    showUploader.value = headerRef.value.showUploader
  }

  watch(
    () => imageStore.imageUrl,
    (url) => {
      if (url) {
        showUploader.value = false
        showUploaderToggle.value = true
      }
    },
  )
})
</script>
<style scoped>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: #f9f9f9;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.toolbar {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.canvas {
  flex: 1;
  overflow: hidden;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }

  .content {
    height: auto;
  }
}
</style>
