import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    currentTool: 'select' as 'polygon' | 'arrow' | 'select',
    isDrawingPolygon: false,
  }),
  actions: {
    setTool(tool: 'polygon' | 'arrow' | 'select') {
      this.currentTool = tool
      this.isDrawingPolygon = false
    },
    startPolygonDrawing() {
      this.currentTool = 'polygon'
      this.isDrawingPolygon = true
    },
    stopPolygonDrawing() {
      this.isDrawingPolygon = false
    },
  },
})
