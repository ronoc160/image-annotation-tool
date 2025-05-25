<template>
  <div class="upload-area" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop">
    <div v-if="!imageUrl" class="placeholder">
      <p>Drag & drop an image here, or click to upload</p>
      <input type="file" accept="image/*" @change="onFileChange" />
    </div>

    <div v-if="imageUrl" class="image-wrapper">
      <img :src="imageUrl" class="uploaded-image" ref="imageRef" @load="onImageLoad" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useImageStore } from '@/stores/image'

const imageStore = useImageStore()
const imageRef = ref<HTMLImageElement | null>(null)
const imageUrl = ref<string | null>(null)

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) loadImage(file)
}

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    loadImage(file)
  }
}

const loadImage = (file: File) => {
  const url = URL.createObjectURL(file)
  imageUrl.value = url
}

const onImageLoad = () => {
  if (imageRef.value && imageUrl.value) {
    imageStore.setImage(imageUrl.value, imageRef.value.naturalWidth, imageRef.value.naturalHeight)
  }
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #888;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  position: relative;
}
.placeholder {
  color: #ccc;
}
.uploaded-image {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}
</style>
