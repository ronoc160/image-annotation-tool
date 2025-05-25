<template>
  <div ref="containerRef" class="annotation-canvas">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      class="annotated-image"
      ref="imageRef"
      @load="onImageLoad"
    />

    <svg v-if="imageUrl" class="overlay" :width="containerWidth" :height="containerHeight">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="blue" />
        </marker>
      </defs>

      <template v-for="ann in annotationStore.annotations" :key="ann.id">
        <polygon
          v-if="ann.type === 'polygon'"
          :points="convertPointsToSVG(ann.points)"
          :stroke="isSelected(ann.id) ? 'orange' : 'lime'"
          fill="rgba(0,255,0,0.2)"
          stroke-width="2"
          @click.stop="select(ann.id)"
          @mousedown.stop="startPolygonDrag(ann)"
          cursor="move"
        />

        <g v-if="ann.type === 'polygon' && isSelected(ann.id)">
          <circle
            v-for="(pt, i) in ann.points"
            :key="i"
            :cx="pt.x * containerWidth"
            :cy="pt.y * containerHeight"
            r="6"
            fill="white"
            stroke="black"
            stroke-width="1"
            cursor="pointer"
            @mousedown.stop="startDragPoint(i, ann)"
            @mouseup="endDragPoint"
            @click.stop
            @dblclick.stop="deletePoint(i)"
          />
        </g>

        <line
          v-if="ann.type === 'arrow'"
          :x1="ann.start.x * containerWidth"
          :y1="ann.start.y * containerHeight"
          :x2="ann.end.x * containerWidth"
          :y2="ann.end.y * containerHeight"
          stroke="blue"
          stroke-width="2"
          marker-end="url(#arrowhead)"
          @click.stop="select(ann.id)"
        />

        <g v-if="ann.type === 'arrow' && isSelected(ann.id)">
          <circle
            :cx="ann.start.x * containerWidth"
            :cy="ann.start.y * containerHeight"
            r="6"
            fill="white"
            stroke="blue"
            stroke-width="2"
            cursor="pointer"
            @mousedown.stop="startArrowDrag(ann, 'start')"
            @dblclick.stop="deleteAnnotation(ann.id)"
          />
          <circle
            :cx="ann.end.x * containerWidth"
            :cy="ann.end.y * containerHeight"
            r="6"
            fill="white"
            stroke="blue"
            stroke-width="2"
            cursor="pointer"
            @mousedown.stop="startArrowDrag(ann, 'end')"
            @dblclick.stop="deleteAnnotation(ann.id)"
          />
          <circle
            :cx="((ann.start.x + ann.end.x) / 2) * containerWidth"
            :cy="((ann.start.y + ann.end.y) / 2) * containerHeight"
            r="6"
            fill="blue"
            opacity="0.4"
            cursor="move"
            @mousedown.stop="startMoveArrow(ann)"
          />
        </g>
      </template>

      <PolygonTool
        v-if="uiStore.currentTool === 'polygon'"
        :dimensions="{ width: containerWidth, height: containerHeight }"
        @cancel="uiStore.setTool('select')"
      />
      <DirectionTool
        v-if="uiStore.currentTool === 'arrow'"
        :dimensions="{ width: containerWidth, height: containerHeight }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAnnotationStore } from '@/stores/annotations'
import { useImageStore } from '@/stores/image'
import { useUIStore } from '@/stores/ui'
import type { Annotation, PolygonAnnotation, ArrowAnnotation } from '@/types/annotation'
import PolygonTool from './PolygonTool.vue'
import DirectionTool from './DirectionTool.vue'

const imageStore = useImageStore()
const annotationStore = useAnnotationStore()
const uiStore = useUIStore()

const imageUrl = computed(() => imageStore.imageUrl)
const containerRef = ref<HTMLDivElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const containerWidth = ref(0)
const containerHeight = ref(0)
let isDraggingPoint = false

const onImageLoad = () => updateContainerSize()
const updateContainerSize = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth
    containerHeight.value = containerRef.value.clientHeight
  }
}

onMounted(() => {
  updateContainerSize()
  window.addEventListener('resize', updateContainerSize)
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
  window.removeEventListener('keydown', onKeyDown)
})

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    cancelCurrentAction()
  }
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (annotationStore.selectedId) {
      annotationStore.removeAnnotation(annotationStore.selectedId)
    }
  }
}

const cancelCurrentAction = () => {
  draggingIndex.value = null
  currentAnnotation.value = null
  draggingPolygon.value = null
  dragStart.value = null
  draggingArrow.value = null
  draggingHandle = null
  annotationStore.deselectAnnotation()
  uiStore.setTool('select')
}

const convertPointsToSVG = (points: { x: number; y: number }[]) =>
  points.map((pt) => `${pt.x * containerWidth.value},${pt.y * containerHeight.value}`).join(' ')

const isSelected = (id: string) => annotationStore.selectedId === id
const select = (id: string) => annotationStore.selectAnnotation(id)
const deleteAnnotation = (id: string) => annotationStore.removeAnnotation(id)

// Polygon editing
const draggingIndex = ref<number | null>(null)
const currentAnnotation = ref<PolygonAnnotation | null>(null)

const startDragPoint = (index: number, ann: Annotation) => {
  isDraggingPoint = false
  draggingIndex.value = index
  currentAnnotation.value = ann as PolygonAnnotation
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}

const endDragPoint = () => {
  if (draggingIndex.value === null || !currentAnnotation.value) return
  setTimeout(() => {
    isDraggingPoint = true
  }, 500)
}

const onDrag = (e: MouseEvent) => {
  if (!currentAnnotation.value || draggingIndex.value === null || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / containerWidth.value
  const y = (e.clientY - rect.top) / containerHeight.value
  currentAnnotation.value.points[draggingIndex.value] = { x, y }
  annotationStore.updateAnnotation({ ...currentAnnotation.value })
}

const stopDrag = () => {
  draggingIndex.value = null
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const deletePoint = (index: number) => {
  if (!currentAnnotation.value) return
  currentAnnotation.value.points.splice(index, 1)
  if (currentAnnotation.value.points.length < 3) {
    annotationStore.removeAnnotation(currentAnnotation.value.id)
    currentAnnotation.value = null
  } else {
    annotationStore.updateAnnotation({ ...currentAnnotation.value })
  }
}

const draggingPolygon = ref<PolygonAnnotation | null>(null)
const dragStart = ref<{ x: number; y: number } | null>(null)

const startPolygonDrag = (ann: Annotation) => {
  if (ann.type !== 'polygon') return
  draggingPolygon.value = { ...ann }
  dragStart.value = null
  window.addEventListener('mousemove', onPolygonDrag)
  window.addEventListener('mouseup', stopPolygonDrag)
}

const onPolygonDrag = (e: MouseEvent) => {
  if (!draggingPolygon.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / containerWidth.value
  const y = (e.clientY - rect.top) / containerHeight.value
  if (!dragStart.value) {
    dragStart.value = { x, y }
    return
  }
  const dx = x - dragStart.value.x
  const dy = y - dragStart.value.y
  draggingPolygon.value.points = draggingPolygon.value.points.map((p) => ({
    x: p.x + dx,
    y: p.y + dy,
  }))
  dragStart.value = { x, y }
  annotationStore.updateAnnotation({ ...draggingPolygon.value })
}

const stopPolygonDrag = () => {
  draggingPolygon.value = null
  dragStart.value = null
  window.removeEventListener('mousemove', onPolygonDrag)
  window.removeEventListener('mouseup', stopPolygonDrag)
}

const draggingArrow = ref<ArrowAnnotation | null>(null)
let draggingHandle: 'start' | 'end' | null = null

const startArrowDrag = (ann: ArrowAnnotation, handle: 'start' | 'end') => {
  draggingArrow.value = { ...ann }
  draggingHandle = handle
  window.addEventListener('mousemove', onArrowDrag)
  window.addEventListener('mouseup', stopArrowDrag)
}

const onArrowDrag = (e: MouseEvent) => {
  if (!draggingArrow.value || !draggingHandle || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / containerWidth.value
  const y = (e.clientY - rect.top) / containerHeight.value
  draggingArrow.value[draggingHandle] = { x, y }
  annotationStore.updateAnnotation({ ...draggingArrow.value })
}

const startMoveArrow = (ann: ArrowAnnotation) => {
  draggingArrow.value = { ...ann }
  dragStart.value = null
  window.addEventListener('mousemove', onMoveArrow)
  window.addEventListener('mouseup', stopArrowDrag)
}

const onMoveArrow = (e: MouseEvent) => {
  if (!draggingArrow.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / containerWidth.value
  const y = (e.clientY - rect.top) / containerHeight.value
  if (!dragStart.value) {
    dragStart.value = { x, y }
    return
  }
  const dx = x - dragStart.value.x
  const dy = y - dragStart.value.y
  draggingArrow.value.start.x += dx
  draggingArrow.value.start.y += dy
  draggingArrow.value.end.x += dx
  draggingArrow.value.end.y += dy
  dragStart.value = { x, y }
  annotationStore.updateAnnotation({ ...draggingArrow.value })
}

const stopArrowDrag = () => {
  draggingArrow.value = null
  draggingHandle = null
  window.removeEventListener('mousemove', onArrowDrag)
  window.removeEventListener('mousemove', onMoveArrow)
  window.removeEventListener('mouseup', stopArrowDrag)
}
</script>

<style scoped>
.annotation-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: #111;
  overflow: scroll;
}
.annotated-image {
  width: 100%;
  height: auto;
  display: block;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
