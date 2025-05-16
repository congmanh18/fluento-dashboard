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
        <div v-if="selected.length > 0" class="row q-gutter-sm">
          <q-btn
            color="negative"
            icon="delete"
            label="Delete"
            @click="deleteSelected"
          />
        </div>
      </div>

      <!-- Right side: Export, Column Visibility, and Pagination -->
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
          icon="table_chart"
          label="Columns"
          class="q-mr-sm"
        >
          <q-menu>
            <q-list dense>
              <q-item v-for="col in columnConfig" :key="col.key" clickable>
                <q-item-section>
                  <q-checkbox v-model="col.visible" :label="col.label" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          color="primary"
          icon="file_download"
          label="Export CSV"
          @click="exportToCSV"
          class="q-mr-sm"
        />
        <q-select
          v-model="itemsPerPage"
          :options="[5, 10, 25, 50]"
          dense
          outlined
          style="width: 100px;"
          class="q-mr-sm"
        />
      </div>
    </div>

    <!-- Custom Table -->
    <div class="custom-table">
      <!-- Table Header -->
      <div class="table-header row q-pa-sm bg-grey-2">
        <div class="col-1 drag-handle">Drag</div>
        <div class="col-1">
          <q-checkbox v-model="selectAll" @update:model-value="toggleAll" />
        </div>
        <div class="col-1">Order</div>
        <div
          v-for="col in visibleColumns"
          :key="col.key"
          :class="col.class"
          @click="sortColumn(col.key)"
        >
          {{ col.label }}
          <q-icon
            v-if="sortKey === col.key"
            :name="sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'"
            size="sm"
          />
        </div>
      </div>

      <!-- Table Body with Draggable -->
      <draggable
        v-model="paginatedRows"
        tag="div"
        item-key="id"
        class="table-body"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <div class="table-row row q-pa-sm items-center" :class="{ 'selected': element.selected }">
            <div class="col-1 drag-handle">
              <q-icon name="drag_indicator" class="drag-icon" />
            </div>
            <div class="col-1">
              <q-checkbox v-model="element.selected" />
            </div>
            <div class="col-1 order-number">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </div>
            <div v-if="getColumn('name').visible" class="col-2">
              <div @dblclick="startEdit(element)" class="editable-name">
                {{ element.name }}
              </div>
            </div>
            <div v-if="getColumn('level').visible" class="col-2">
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
            <div v-if="getColumn('detail').visible" class="col-2">
              <div class="commune-list">
                <div v-for="lesson in element.lessons" :key="lesson.id" class="commune-item">
                  {{ lesson.name }}
                </div>
              </div>
            </div>
            <div v-if="getColumn('image').visible" class="col-2">
              <q-img
                :src="element.image"
                style="width: 100px; height: 75px; object-fit: cover;"
              />
            </div>
            <div v-if="getColumn('status').visible" class="col-1">
              <q-chip :color="getStatusColor(element.status)" text-color="white">
                {{ element.status }}
              </q-chip>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Pagination -->
    <div class="row justify-between q-mt-md">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :max-pages="5"
        direction-links
        boundary-links
      />
      <div class="q-ml-md">
        Showing {{ paginatedRows.length }} of {{ filteredRows.length }} items
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import draggable from 'vuedraggable'

const $q = useQuasar()

// Table configuration
const columnConfig = ref([
  { key: 'name', label: 'Name', visible: true, class: 'col-2' },
  { key: 'level', label: 'Level', visible: true, class: 'col-2' },
  { key: 'detail', label: 'Detail', visible: true, class: 'col-2' },
  { key: 'image', label: 'Image', visible: true, class: 'col-2' },
  { key: 'status', label: 'Status', visible: true, class: 'col-1' },
])

// Table data
const rows = ref([
  {
    id: 1,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'draft',
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' },
    ],
  },
  {
    id: 2,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'pending',
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' },
    ],
  },
  {
    id: 3,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'approved',
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' },
    ],
  },
  {
    id: 4,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'rejected',
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' },
    ],
  },
  {
    id: 5,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'rejected',
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' },
    ],
  },
  {
    id: 6,
    name: 'Huyện Đông Anh',
    detail: 'Xã Cổ Loa, Xã Dục Tú, Xã Đại Mạch, Xã Vĩnh Ngọc, Xã Việt Hùng',
    image: 'https://picsum.photos/400/300',
    status: 'rejected',
    level: 'Hà Nội',
    lessons: [
      { id: 1, name: 'Xã Cổ Loa', link: '/commune/1' },
      { id: 2, name: 'Xã Dục Tú', link: '/commune/2' },
      { id: 3, name: 'Xã Đại Mạch', link: '/commune/3' },
      { id: 4, name: 'Xã Vĩnh Ngọc', link: '/commune/4' },
      { id: 5, name: 'Xã Việt Hùng', link: '/commune/5' },
    ],
  },
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
  'Đồng Nai',
]

// Search and selection
const search = ref('')
const selected = ref([])
const selectAll = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Sorting
const sortKey = ref('')
const sortOrder = ref('asc')

// Dialog states
const deleteDialog = ref(false)

// Computed properties
const visibleColumns = computed(() => columnConfig.value.filter(col => col.visible))

const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const searchLower = search.value.toLowerCase()
  return rows.value.filter(row =>
    row.name.toLowerCase().includes(searchLower) ||
    row.detail.toLowerCase().includes(searchLower)
  )
})

const totalPages = computed(() => Math.ceil(filteredRows.value.length / itemsPerPage.value))

const paginatedRows = computed({
  get() {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    let sortedRows = [...filteredRows.value]
    if (sortKey.value) {
      sortedRows.sort((a, b) => {
        const valA = a[sortKey.value]
        const valB = b[sortKey.value]
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })
    }
    return sortedRows.slice(start, end)
  },
  set(newValue) {
    rows.value = newValue
  },
})

// Methods
const getColumn = key => columnConfig.value.find(col => col.key === key)

const toggleAll = () => {
  if (selectAll.value) {
    selected.value = [...paginatedRows.value]
    paginatedRows.value.forEach(row => (row.selected = true))
  } else {
    selected.value = []
    paginatedRows.value.forEach(row => (row.selected = false))
  }
}

const sortColumn = key => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const onDragStart = event => {
  event.item.classList.add('dragging')
}

const onDragEnd = event => {
  event.item.classList.remove('dragging')
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
    message: 'Items deleted successfully',
  })
}

const createNewRow = () => {
  rows.value.unshift({
    id: rows.value.length + 1,
    name: 'New Item',
    detail: '',
    image: 'https://picsum.photos/400/300',
    status: 'draft',
    level: 'Hà Nội',
    lessons: [],
    selected: false,
  })
  $q.notify({
    color: 'positive',
    message: 'New item created',
  })
}

const startEdit = row => {
  row.name = row.name + ' (Edited)'
  $q.notify({
    color: 'positive',
    message: 'Name updated successfully',
  })
}

const exportToCSV = () => {
  const headers = visibleColumns.value.map(col => col.label).join(',')
  const content = [
    headers,
    ...filteredRows.value.map(row =>
      visibleColumns.value.map(col => `"${row[col.key] || ''}"`).join(',')
    ),
  ].join('\n')
  exportFile('table-data.csv', content, 'text/csv')
}

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
  cursor: pointer;
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

.q-btn {
  margin-right: 8px;
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

.order-number {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #666;
}
</style>
