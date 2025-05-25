<template>
  <aside class="sidebar">
    <div
      v-for="ann in annotationStore.annotations"
      :key="ann.id"
      class="zone-item"
      :class="{ selected: ann.id === annotationStore.selectedId }"
      @click="select(ann.id)"
    >
      <!-- VIEW MODE -->
      <div v-if="!isEditing(ann.id)" class="zone-content">
        <div class="check-icon">✓</div>
        <div class="text-block">
          <div class="zone-name">{{ ann.name }}</div>
          <div class="zone-sub">{{ ann.subLabel || 'Operational Area' }}</div>
        </div>
        <div class="actions">
          <button class="rename" @click.stop="startEditing(ann)">✏️</button>
          <button class="delete" @click.stop="deleteZone(ann.id)">🗑️</button>
        </div>
      </div>

      <!-- EDIT MODE -->
      <div v-else class="edit-container">
        <!-- Grey Header -->
        <div class="zone-header">
          <div class="check-icon">✓</div>
          <div class="text-block">
            <div class="zone-name">{{ editedName }}</div>
            <div class="zone-sub">{{ editedSub }}</div>
          </div>
        </div>

        <!-- Editable fields -->
        <div class="edit-controls">
          <div class="edit-line">
            <div class="check-icon small">✓</div>
            <input v-model="editedName" placeholder="Zone Name" />
          </div>
          <div class="edit-line">
            <div class="check-icon small">✓</div>
            <input v-model="editedSub" placeholder="Sub Label" />
          </div>
          <div class="edit-actions">
            <button class="save" @click.stop="saveName(ann)">Save</button>
            <button class="cancel" @click.stop="cancelEdit">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAnnotationStore } from '@/stores/annotations'
import type { Annotation } from '@/types/annotation'

const annotationStore = useAnnotationStore()

const editingId = ref<string | null>(null)
const editedName = ref('')
const editedSub = ref('')

const startEditing = (ann: Annotation) => {
  editingId.value = ann.id
  editedName.value = ann.name
  editedSub.value = ann.subLabel || 'Operational Area'
}

const cancelEdit = () => {
  editingId.value = null
  editedName.value = ''
  editedSub.value = ''
}

const saveName = (ann: Annotation) => {
  ann.name = editedName.value
  ann.subLabel = editedSub.value
  annotationStore.updateAnnotation({ ...ann })
  cancelEdit()
}

const isEditing = (id: string) => editingId.value === id
const select = (id: string) => annotationStore.selectAnnotation(id)
const deleteZone = (id: string) => {
  console.log('Deleting annotation:', id)
  if (annotationStore.selectedId === id) {
    annotationStore.deselectAnnotation()
    console.log('Deselected:', id)
  }
  annotationStore.removeAnnotation(id)
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: #f9f9f9;
  padding: 1rem;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.zone-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.zone-item.selected {
  border: 2px solid #10b981;
}

.zone-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem;
}

.text-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.zone-name {
  font-weight: 600;
  font-size: 16px;
  color: #111827;
}

.zone-sub {
  font-size: 14px;
  color: #6b7280;
}

.check-icon {
  width: 28px;
  height: 28px;
  border: 2px solid #10b981;
  border-radius: 6px;
  color: #10b981;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  flex-shrink: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.rename,
.delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  color: #4b5563;
}
.rename:hover,
.delete:hover {
  color: #111;
}

.edit-container {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.zone-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #e6ebef;
  padding: 1rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.edit-controls {
  background: #ecfdf5;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #d1fae5;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.edit-line input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #111827;
  padding: 2px 0;
}

.check-icon.small {
  width: 20px;
  height: 20px;
  font-size: 12px;
  border: 2px solid #10b981;
  border-radius: 4px;
  background: #fff;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.edit-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  padding-top: 0.5rem;
}

.edit-actions .save {
  color: #10b981;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}

.edit-actions .cancel {
  color: #ef4444;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
}
</style>
