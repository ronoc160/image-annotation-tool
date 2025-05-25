<template>
  <g>
    <line
      v-if="start && hover"
      :x1="start.x"
      :y1="start.y"
      :x2="hover.x"
      :y2="hover.y"
      stroke="blue"
      stroke-dasharray="4"
    />
  </g>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAnnotationStore } from '@/stores/annotations'
import { nanoid } from 'nanoid'

const props = defineProps<{
  dimensions: { width: number; height: number }
}>()

const annotationStore = useAnnotationStore()
const start = ref<{ x: number; y: number } | null>(null)
const hover = ref<{ x: number; y: number } | null>(null)

const toRelative = (pt: { x: number; y: number }) => ({
  x: pt.x / props.dimensions.width,
  y: pt.y / props.dimensions.height,
})

const snapToAngle = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const angle = Math.round((Math.atan2(dy, dx) * 180) / Math.PI / 45) * 45
  const length = Math.sqrt(dx * dx + dy * dy)
  const rad = (angle * Math.PI) / 180
  return {
    x: x1 + Math.cos(rad) * length,
    y: y1 + Math.sin(rad) * length,
  }
}

const handleClick = (e: MouseEvent) => {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (!start.value) {
    start.value = { x, y }
  } else {
    const id = nanoid()
    annotationStore.addAnnotation({
      id,
      name: `Arrow ${annotationStore.annotations.length + 1}`,
      type: 'arrow',
      start: toRelative(start.value),
      end: toRelative({ x, y }),
    })
    start.value = null
    hover.value = null
  }
}

const handleMouseMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (start.value) {
    hover.value = snapToAngle(start.value.x, start.value.y, x, y)
  } else {
    hover.value = { x, y }
  }
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
})
</script>
