<template>
  <div class="q-pa-md">
    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete selected items?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="editingName"
            dense
            autofocus
            @keyup.enter="confirmEdit"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="confirmEdit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Top toolbar -->
    <div class="row q-mb-md items-center">
      <!-- Left side: Search and Action buttons -->
      <div class="col-12 col-md-6 row items-center">
        <q-input
          v-model="search"
          outlined
          dense
          placeholder="Search..."
          class="col-12 col-md-6 q-mr-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <!-- Action buttons (only visible when rows are selected) -->
        <div v-if="selected.length > 0" class="row q-gutter-sm">
          <q-btn
            color="negative"
            icon="delete"
            label="Delete"
            @click="deleteSelected"
          />
        </div>
      </div>

      <!-- Right side: Export and Fullscreen buttons -->
      <div class="col-12 col-md-6 row justify-end items-center">
        <q-btn
          color="primary"
          icon="add"
          label="Create New"
          @click="createNewRow"
          class="q-mr-sm"
        />
        <q-btn
          color="primary"
          icon="picture_as_pdf"
          label="Export PDF"
          @click="exportToPDF"
          class="q-mr-sm"
        />
        <q-btn
          color="primary"
          :icon="isFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="toggleFullscreen"
        />
      </div>
    </div>

    <!-- Custom Table -->
    <div class="custom-table">
      <!-- Table Header -->
      <div class="table-header row q-pa-sm bg-grey-2">
        <div class="col-1 drag-handle">Drag</div>
        <div class="col-1">
          <q-checkbox
            v-model="selectAll"
            @update:model-value="toggleAll"
          />
        </div>
        <div class="col-2">Name</div>
        <div class="col-2">Level</div>
        <div class="col-2">Detail</div>
        <div class="col-2">Image</div>
        <div class="col-1">Status</div>
        <div class="col-1">Options</div>
      </div>

      <!-- Table Body with Draggable -->
      <draggable
        v-model="rows"
        tag="div"
        item-key="id"
        class="table-body"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <div class="table-row row q-pa-sm items-center" :class="{ 'selected': element.selected }">
            <div class="col-1 drag-handle">
              <q-icon name="drag_indicator" class="drag-icon" />
            </div>
            <div class="col-1">
              <q-checkbox v-model="element.selected" />
            </div>
            <div class="col-2">
              <template v-if="element.editing">
                <q-input
                  v-model="element.name"
                  dense
                  autofocus
                  @keyup.enter="saveEdit(element)"
                  @blur="saveEdit(element)"
                />
              </template>
              <template v-else>
                <div @dblclick="startEdit(element)" class="editable-name">
                  {{ element.name }}
                </div>
              </template>
            </div>
            <div class="col-2">
              <q-select
                v-model="element.level"
                :options="levelOptions"
                dense
                outlined
                emit-value
                map-options
                style="min-width: 120px;"
              />
            </div>
            <div class="col-2">
              <div class="commune-list">
                <div v-for="lesson in element.lessons" :key="lesson.id" class="commune-item">
                  {{ lesson.name }}
                </div>
              </div>
            </div>
            <div class="col-2">
              <q-img
                :src="element.image"
                style="width: 100px; height: 75px; object-fit: cover;"
              />
            </div>
            <div class="col-1">
              <q-chip
                :color="getStatusColor(element.status)"
                text-color="white"
              >
                {{ element.status }}
              </q-chip>
            </div>
            <div class="col-1">
              <div class="column q-gutter-sm">
                <q-checkbox
                  v-model="element.selectedOptions"
                  val="A"
                  label="A"
                />
                <q-checkbox
                  v-model="element.selectedOptions"
                  val="B"
                  label="B"
                />
                <q-checkbox
                  v-model="element.selectedOptions"
                  val="C"
                  label="C"
                />
                <q-checkbox
                  v-model="element.selectedOptions"
                  val="D"
                  label="D"
                />
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import draggable from 'vuedraggable'

const $q = useQuasar()

// Fullscreen state
const isFullscreen = ref(false)

// Table data
const rows = ref([
  {
    id: 1,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'draft',
    selectedOptions: ['A', 'B'],
    order: 1,
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' }
    ]
  },
  {
    id: 2,
    name: 'Huyện Gia Lâm',
    detail: 'Xã Đặng Xá, Xã Đình Xuyên, Xã Dương Hà, Xã Dương Quang, Xã Dương Xá',
    image: 'https://picsum.photos/400/300',
    status: 'approved',
    selectedOptions: ['C', 'D'],
    order: 2,
    level: 'Hà Nội',
    lessons: [
      { id: 6, name: 'Xã Đặng Xá', link: '/commune/6' },
      { id: 7, name: 'Xã Đình Xuyên', link: '/commune/7' },
      { id: 8, name: 'Xã Dương Hà', link: '/commune/8' },
      { id: 9, name: 'Xã Dương Quang', link: '/commune/9' },
      { id: 10, name: 'Xã Dương Xá', link: '/commune/10' }
    ]
  },
  {
    id: 3,
    name: 'Huyện Ba Vì',
    detail: 'Xã Ba Trại, Xã Ba Vì, Xã Cẩm Lĩnh, Xã Cam Thượng, Xã Châu Sơn',
    image: 'https://picsum.photos/400/300',
    status: 'rejected',
    selectedOptions: ['A', 'B', 'C', 'D'],
    order: 3,
    level: 'Hà Nội',
    lessons: [
      { id: 11, name: 'Xã Ba Trại', link: '/commune/11' },
      { id: 12, name: 'Xã Ba Vì', link: '/commune/12' },
      { id: 13, name: 'Xã Cẩm Lĩnh', link: '/commune/13' },
      { id: 14, name: 'Xã Cam Thượng', link: '/commune/14' },
      { id: 15, name: 'Xã Châu Sơn', link: '/commune/15' }
    ]
  },
  {
    id: 4,
    name: 'Huyện Mỹ Đức',
    detail: 'Xã An Mỹ, Xã An Phú, Xã An Tiến, Xã Bột Xuyên, Xã Đại Hưng',
    image: 'https://picsum.photos/400/300',
    status: 'pending',
    selectedOptions: ['A', 'C'],
    order: 4,
    level: 'Hà Nội',
    lessons: [
      { id: 16, name: 'Xã An Mỹ', link: '/commune/16' },
      { id: 17, name: 'Xã An Phú', link: '/commune/17' },
      { id: 18, name: 'Xã An Tiến', link: '/commune/18' },
      { id: 19, name: 'Xã Bột Xuyên', link: '/commune/19' },
      { id: 20, name: 'Xã Đại Hưng', link: '/commune/20' }
    ]
  }
])

// Level options
const levelOptions = [
  'Hà Nội',
  'Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Bắc Ninh',
  'Bình Dương',
  'Đồng Nai'
]

// Search functionality
const search = ref('')

// Selection functionality
const selected = ref([])
const selectAll = ref(false)

const toggleAll = () => {
  if (selectAll.value) {
    selected.value = [...rows.value]
    rows.value.forEach(row => row.selected = true)
  } else {
    selected.value = []
    rows.value.forEach(row => row.selected = false)
  }
}

// Watch for changes in individual selections
watch(() => rows.value.map(row => row.selected), (newSelections) => {
  selected.value = rows.value.filter((_, index) => newSelections[index])
  selectAll.value = newSelections.every(selected => selected)
}, { deep: true })

// Status color mapping
const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    pending: 'orange',
    approved: 'green',
    rejected: 'red'
  }
  return colors[status] || 'grey'
}

// Drag and drop handlers
const onDragStart = (event) => {
  event.item.classList.add('dragging')
}

const onDragEnd = (event) => {
  event.item.classList.remove('dragging')
}

// Dialog states
const deleteDialog = ref(false)
const editDialog = ref(false)
const editingName = ref('')
const editingRow = ref(null)

// Row actions
const startEdit = (row) => {
  row.editing = true
}

const saveEdit = (row) => {
  row.editing = false
  $q.notify({
    color: 'positive',
    message: 'Name updated successfully'
  })
}

const deleteSelected = () => {
  deleteDialog.value = true
}

const confirmDelete = () => {
  const selectedIds = selected.value.map(row => row.id)
  rows.value = rows.value.filter(row => !selectedIds.includes(row.id))
  selected.value = []
  selectAll.value = false

  $q.notify({
    color: 'positive',
    message: 'Items deleted successfully'
  })
}

const createNewRow = () => {
  console.log('Create new row')
}

// Export to PDF
const exportToPDF = () => {
  const content = rows.value.map(row =>
    `Name: ${row.name}\nDetail: ${row.detail}\nStatus: ${row.status}\n\n`
  ).join('')

  exportFile('topics.pdf', content, 'application/pdf')
}

// Fullscreen toggle
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  const element = document.querySelector('.custom-table')
  if (isFullscreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  }
}

// Navigation
const navigateToLesson = (lesson) => {
  console.log('Navigating to lesson:', lesson)
}
</script>

<style scoped>
.custom-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  background-color: #f5f5f5;
}

.table-header > div {
  padding: 12px;
  border-right: 1px solid #ddd;
}

.table-header > div:last-child {
  border-right: none;
}

.table-body {
  border-bottom: 1px solid #ddd;
}

.table-row {
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.table-row > div {
  padding: 12px;
  border-right: 1px solid #eee;
  min-height: 100px;
  display: flex;
  align-items: flex-start;
}

.table-row > div:last-child {
  border-right: none;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.table-row.selected {
  background-color: #e3f2fd;
}

.table-row.dragging {
  opacity: 0.5;
  background-color: #f5f5f5;
}

/* Add some spacing between buttons */
.q-btn {
  margin-right: 8px;
}

.column {
  display: flex;
  flex-direction: column;
}

.q-checkbox {
  margin-bottom: 4px;
}

/* Style for lessons buttons */
.table-row .col-2:nth-child(4) {
  flex-direction: column;
  gap: 8px;
}

/* Style for options checkboxes */
.table-row .col-2:last-child {
  flex-direction: column;
  gap: 8px;
}

/* Style for image container */
.table-row .col-2:nth-child(5) {
  justify-content: center;
  align-items: center;
}

/* Style for status chip */
.table-row .col-1:nth-child(6) {
  justify-content: center;
  align-items: center;
}

.drag-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
}

.drag-icon {
  opacity: 0;
  transition: opacity 0.2s;
}

.table-row:hover .drag-icon {
  opacity: 1;
}

.table-header .drag-handle {
  cursor: default;
}

.commune-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.commune-item {
  padding: 4px 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 0.9em;
}

.editable-name {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.editable-name:hover {
  background-color: #f5f5f5;
}
</style>
