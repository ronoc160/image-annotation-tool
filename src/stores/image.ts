import { defineStore } from 'pinia'

export const useImageStore = defineStore('image', {
  state: () => ({
    imageUrl: null as string | null,
    naturalWidth: 0,
    naturalHeight: 0,
  }),
  actions: {
    setImage(url: string, width: number, height: number) {
      this.imageUrl = url
      this.naturalWidth = width
      this.naturalHeight = height
    },
    clearImage() {
      this.imageUrl = null
      this.naturalWidth = 0
      this.naturalHeight = 0
    },
  },
})
