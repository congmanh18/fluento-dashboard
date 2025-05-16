<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="text-h5 q-mb-md">Trang Tổng Quan</div>

    <!-- Filter by language -->
    <q-select
      filled
      v-model="selectedLanguage"
      :options="languageOptions"
      label="Lọc theo ngôn ngữ"
      class="q-mb-lg"
    />

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <q-card class="col-xs-12 col-sm-4 bg-blue text-white">
        <q-card-section>
          <div class="text-h6">Số Topic</div>
          <div class="text-subtitle2">{{ stats.topics }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-xs-12 col-sm-4 bg-green text-white">
        <q-card-section>
          <div class="text-h6">Số Lesson</div>
          <div class="text-subtitle2">{{ stats.lessons }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-xs-12 col-sm-4 bg-orange text-white">
        <q-card-section>
          <div class="text-h6">Số Task</div>
          <div class="text-subtitle2">{{ stats.tasks }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Task List -->
    <div class="text-h6 q-mb-sm">Nhiệm vụ đang xử lý</div>
    <q-table
      :rows="filteredTasks"
      :columns="columns"
      row-key="id"
      dense
      bordered
      flat
      no-data-label="Không có nhiệm vụ nào"
    >
      <template #body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="getStatusColor(props.row.status)" text-color="white" dense>
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const selectedLanguage = ref('Vietnamese')
const languageOptions = ['Vietnamese', 'English', 'Japanese', 'Korean', 'Chinese']

const stats = ref({
  topics: 18,
  lessons: 42,
  tasks: 105
})

const tasks = ref([
  { id: 1, title: 'Hội thoại chào hỏi', type: 'Dialog', status: 'Đang làm', language: 'Vietnamese' },
  { id: 2, title: 'Từ vựng món ăn', type: 'Vocabulary', status: 'Chờ duyệt', language: 'Vietnamese' },
  { id: 3, title: 'Bài hát karaoke 1', type: 'Karaoke', status: 'Đã hoàn thành', language: 'English' },
  { id: 4, title: 'Trắc nghiệm giao tiếp', type: 'Quiz', status: 'Đang làm', language: 'Japanese' },
])

const columns = [
  { name: 'title', label: 'Tiêu đề', field: 'title', align: 'left' },
  { name: 'type', label: 'Loại Task', field: 'type', align: 'left' },
  { name: 'status', label: 'Trạng thái', field: 'status', align: 'left' },
  { name: 'language', label: 'Ngôn ngữ', field: 'language', align: 'left' }
]

const filteredTasks = computed(() => {
  return tasks.value.filter(t => t.language === selectedLanguage.value)
})

function getStatusColor(status) {
  switch (status) {
    case 'Đang làm': return 'blue'
    case 'Chờ duyệt': return 'orange'
    case 'Đã hoàn thành': return 'green'
    default: return 'grey'
  }
}
</script>
