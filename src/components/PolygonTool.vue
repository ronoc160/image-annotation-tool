<template>
  <g>
    <!-- Preview lines -->
    <polyline
      v-if="points.length > 0"
      :points="convertPoints(points)"
      fill="none"
      stroke="lime"
      stroke-width="2"
    />

    <!-- In-progress line to cursor -->
    <line
      v-if="points.length > 0 && mouse.x >= 0"
      :x1="lastPointX"
      :y1="lastPointY"
      :x2="mouse.x"
      :y2="mouse.y"
      stroke="lime"
      stroke-dasharray="4"
    />

    <!-- Points -->
    <circle
      v-for="(pt, index) in points"
      :key="index"
      :cx="pt.x"
      :cy="pt.y"
      r="4"
      fill="white"
      stroke="lime"
    />
  </g>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAnnotationStore } from '@/stores/annotations'
import { nanoid } from 'nanoid'
import type { Point } from '@/types/annotation'

const props = defineProps<{
  dimensions: { width: number; height: number }
}>()

const emit = defineEmits(['cancel'])

const points = ref<{ x: number; y: number }[]>([])
const mouse = ref({ x: -1, y: -1 })

const annotationStore = useAnnotationStore()

const lastPointX = computed(() => points.value[points.value.length - 1]?.x || 0)
const lastPointY = computed(() => points.value[points.value.length - 1]?.y || 0)

const convertPoints = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(' ')

const toRelative = (pt: { x: number; y: number }): Point => ({
  x: pt.x / props.dimensions.width,
  y: pt.y / props.dimensions.height,
})

const handleClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (points.value.length >= 3) {
    const first = points.value[0]
    const dx = x - first.x
    const dy = y - first.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 10) {
      savePolygon()
      return
    }
  }

  points.value.push({ x, y })
}

const handleMouseMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  mouse.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    cancelDrawing()
  }
}

const cancelDrawing = () => {
  points.value = []
  mouse.value = { x: -1, y: -1 }
  emit('cancel')
}

const savePolygon = () => {
  if (points.value.length < 3) return
  const id = nanoid()
  const relativePoints = points.value.map(toRelative)
  annotationStore.addAnnotation({
    id,
    name: `Zone ${annotationStore.annotations.length + 1}`,
    type: 'polygon',
    points: relativePoints,
  })
  points.value = []
  mouse.value = { x: -1, y: -1 }
}
onMounted(() => {
  const svg = document.querySelector('svg')
  if (!svg) return
  svg.addEventListener('click', handleClick)
  svg.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  const svg = document.querySelector('svg')
  if (!svg) return
  svg.removeEventListener('click', handleClick)
  svg.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('keydown', handleKeydown)
})
</script>
