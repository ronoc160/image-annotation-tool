import { defineStore } from 'pinia'
import type { Annotation } from '@/types/annotation'

export const useAnnotationStore = defineStore('annotations', {
  state: () => ({
    annotations: [] as Annotation[],
    selectedId: null as string | null,
  }),
  actions: {
    addAnnotation(annotation: Annotation) {
      this.annotations.push(annotation)
    },
    updateAnnotation(updated: Annotation) {
      const index = this.annotations.findIndex((a) => a.id === updated.id)
      if (index !== -1) this.annotations[index] = updated
    },
    removeAnnotation(id: string) {
      this.annotations = this.annotations.filter((a) => a.id !== id)
      if (this.selectedId === id) {
        this.selectedId = null
      }
    },
    selectAnnotation(id: string) {
      this.selectedId = id
    },
    deselectAnnotation() {
      this.selectedId = null
    },
    clearAll() {
      this.annotations = []
      this.selectedId = null
    },
  },
})
