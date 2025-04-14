<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-md">
      <!-- Cột Topic -->
      <div class="col-4">
        <div class="text-h5 text-weight-bold text-indigo-9 text-center q-my-md">
          Topic
          <q-btn
            flat
            dense
            round
            :icon="topicPagination.sort === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
            @click="toggleTopicSort"
            color="primary"
            :title="topicPagination.sort === 'asc' ? 'Tăng dần' : 'Giảm dần'"
          />
        </div>
        <!-- Add Topic -->
        <q-card flat bordered class="q-pa-sm q-mb-sm rounded-borders shadow-1">
          <div class="row q-col-gutter-sm">
            <!-- Cột 1: Input + Select -->
            <div class="col">
              <q-input
                v-model="newTopicName"
                placeholder="Tên chủ đề"
                dense
                outlined
                class="q-mb-xs"
              />
            </div>

            <!-- Cột 2: Nút Send -->
            <div class="col-auto flex items-stretch">
              <q-btn
                color="primary"
                icon="send"
                no-caps
                unelevated
                rounded
                class="q-px-lg full-height rounded-borders shadow-1"
                @click="addTopic"
              />
            </div>
          </div>
        </q-card>

        <!-- List Topic -->
        <div class="scroll-container">
          <q-card
            v-for="topic in topics"
            :key="topic.id"
            flat
            bordered
            class="q-mb-sm cursor-pointer"
            :class="{
              'bg-blue-1 text-blue-10': selectedTopicId === topic.id,
            }"
            @click="selectTopic(topic.id)"
          >
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-h6">
                  <q-input
                    v-if="editingTopicId === topic.id"
                    v-model="editingTopicName"
                    dense
                    outlined
                    autofocus
                    color="primary"
                    class="q-my-xs bg-white shadow-2 full-width"
                    input-class="text-weight-bold text-blue-10"
                    @keyup.enter="saveTopic(topic.id)"
                  />
                  <div v-else>
                    {{ topic.name }}
                  </div>
                </div>
              </div>

              <div class="row q-gutter-xs">
                <q-btn
                  dense
                  flat
                  :icon="
                    editingTopicId === topic.id ? 'mdi-content-save' : 'mdi-square-edit-outline'
                  "
                  color="primary"
                  @click.stop="
                    editingTopicId === topic.id ? saveTopic(topic.id) : startEditTopic(topic)
                  "
                />
                <q-btn
                  dense
                  flat
                  icon="mdi-delete"
                  color="negative"
                  @click.stop="deleteTopic(topic.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Cột Lesson -->
      <div class="col-4">
        <div class="text-h5 text-weight-bold text-indigo-9 text-center q-my-md">
          Lesson
          <q-btn
            flat
            dense
            round
            :icon="lessonPagination.sort === 'asc' ? 'mdi-sort-ascending' : 'mdi-sort-descending'"
            @click="toggleLessonSort"
            color="primary"
            :title="lessonPagination.sort === 'asc' ? 'Tăng dần' : 'Giảm dần'"
          />
        </div>

        <!-- Add Lesson -->
        <q-card flat bordered class="q-pa-sm q-mb-sm rounded-borders shadow-1">
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-input
                v-model="newLessonName"
                placeholder="Tên bài học"
                dense
                outlined
                class="q-mb-xs"
              />
            </div>
            <div class="col-auto flex items-stretch">
              <q-btn
                color="primary"
                icon="send"
                no-caps
                unelevated
                rounded
                class="q-px-lg full-height rounded-borders shadow-1"
                @click="addLesson"
              />
            </div>
          </div>
        </q-card>

        <!-- List Lesson -->
        <div class="scroll-container">
          <q-card
            v-for="lesson in lessons"
            :key="lesson.id"
            flat
            bordered
            class="q-mb-sm cursor-pointer"
            :class="{
              'bg-blue-1 text-blue-10': selectedLessonId === lesson.id,
            }"
            @click="selectLesson(lesson.id)"
          >
            <q-card-section class="row items-center justify-between">
              <div>
                <div class="text-h6">
                  <q-input
                    v-if="editingLessonId === lesson.id"
                    v-model="editingLessonName"
                    dense
                    outlined
                    autofocus
                    color="primary"
                    class="q-my-xs bg-white shadow-2 full-width"
                    input-class="text-weight-bold text-blue-10"
                    @keyup.enter="saveLesson(lesson.id)"
                  />
                  <div v-else>
                    {{ lesson.name }}
                  </div>
                </div>
              </div>
              <div class="row q-gutter-xs">
                <q-btn
                  dense
                  flat
                  :icon="
                    editingLessonId === lesson.id ? 'mdi-content-save' : 'mdi-square-edit-outline'
                  "
                  color="primary"
                  @click.stop="
                    editingLessonId === lesson.id ? saveLesson(lesson.id) : startEditLesson(lesson)
                  "
                />
                <q-btn
                  dense
                  flat
                  icon="mdi-delete"
                  color="negative"
                  @click.stop="deleteLesson(lesson.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Cột Task -->
      <div class="col-4">
        <div class="text-h5 text-weight-bold text-indigo-9 text-center q-my-md">Task</div>
        <div class="scroll-container">
          <q-expansion-item
            v-for="type in fixedTaskTypes"
            :key="type"
            :label="typeLabel(type)"
            :icon="taskTypeIcons[type]"
            dense
            expand-separator
            default-opened
            class="q-mb-sm shadow-1 rounded-borders"
          >
            <template #header>
              <q-item>
                <q-item-section avatar>
                  <q-icon :name="taskTypeIcons[type]" color="primary" />
                </q-item-section>

                <q-item-section side v-if="tasksByType[type]">
                  <q-badge color="primary" transparent>
                    {{ tasksByType[type].length }}
                  </q-badge>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold text-uppercase">
                    {{ typeLabel(type) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>

            <template v-if="tasksByType[type]?.length">
              <q-card
                v-for="task in tasksByType[type]"
                :key="task.id"
                flat
                bordered
                class="q-mb-xs"
              >
                <q-card-section>
                  <component :is="resolveTaskComponent(type)" :detail="task.detail" />
                </q-card-section>
              </q-card>
            </template>
            <template v-else>
              <div class="text-caption text-grey-6 q-pa-sm">No Task</div>
            </template>
          </q-expansion-item>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useLanguageStore } from 'src/stores/language'
import VocabularyTask from 'src/components/Task/VocabularyTask.vue'
import DialogTask from 'src/components/Task/DialogTask.vue'
import StoryTask from 'src/components/Task/StoryTask.vue'
const languageStore = useLanguageStore()

const sourceLang = languageStore.sourceLanguage
// const nativeLang = languageStore.nativeLanguage
// import draggable from 'vuedraggable'

const $q = useQuasar()

const topics = ref([])
const lessons = ref([])
const tasks = ref([])
const selectedTopicId = ref(null)
const newTopicName = ref('')
const newTopicLang = ref('vi')
const editingTopicId = ref(null)
const editingTopicName = ref('')

const selectedLessonId = ref(null)
const newLessonName = ref('')
const newLessonLang = ref('vi')
const editingLessonId = ref(null)
const editingLessonName = ref('')

const topicPagination = ref({
  page: 1,
  limit: 100,
  total: 0,
  sort: 'desc',
})

const lessonPagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  sort: 'asc',
})

const toggleTopicSort = () => {
  topicPagination.value.sort = topicPagination.value.sort === 'asc' ? 'desc' : 'asc'
  fetchTopics()
}

const toggleLessonSort = () => {
  lessonPagination.value.sort = lessonPagination.value.sort === 'asc' ? 'desc' : 'asc'
  if (selectedTopicId.value) {
    fetchLessons(selectedTopicId.value)
  }
}
const resolveTaskComponent = (type) => {
  switch (type) {
    case 'vocabulary':
      return VocabularyTask
    case 'dialog':
      return DialogTask
    case 'story':
      return StoryTask
    default:
      return null
  }
}

const fixedTaskTypes = ['vocabulary', 'dialog', 'story', 'song']

const typeLabel = (type) => {
  switch (type) {
    case 'vocabulary':
      return 'Vocabulary'
    case 'dialog':
      return 'Dialog'
    case 'story':
      return 'Story'
    case 'song':
      return 'Karaoke'
    default:
      return type
  }
}

const taskTypeIcons = {
  vocabulary: 'mdi-book-open-page-variant',
  dialog: 'mdi-chat-outline',
  story: 'mdi-book-open-variant',
  song: 'mdi-music-note-outline',
}

const tasksByType = computed(() => {
  const result = {}
  fixedTaskTypes.forEach((type) => {
    result[type] = tasks.value.filter((task) => task.task_type === type)
  })
  return result
})

const fetchTopics = async () => {
  const res = await api.get(
    `/topics?limit=${topicPagination.value.limit}&page=${topicPagination.value.page}&sort=${topicPagination.value.sort}`,
  )
  topics.value = res.data.data.rows
  topicPagination.value.total = res.data.data.total
}

const fetchLessons = async (topicId) => {
  const res = await api.get(
    `/topics/${topicId}/lessons?limit=${lessonPagination.value.limit}&page=${lessonPagination.value.page}&sort=${lessonPagination.value.sort}`,
  )
  lessons.value = res.data.data.rows
  lessonPagination.value.total = res.data.data.total
}

const fetchTasks = async (lessonId) => {
  const res = await api.get(`/lessons/${lessonId}/tasks`)
  tasks.value = res.data.data
}

const selectTopic = (id) => {
  selectedTopicId.value = id
  fetchLessons(id)
}

const selectLesson = (id) => {
  selectedLessonId.value = id
  fetchTasks(id)
}

const addTopic = async () => {
  if (!newTopicName.value) {
    $q.notify({
      type: 'negative',
      message: 'Tên chủ đề là bắt buộc!',
    })
    return
  }
  await api.post(`/topics`, {
    name: newTopicName.value,
    lang: sourceLang,
  })
  newTopicName.value = ''
  newTopicLang.value = 'vi'
  fetchTopics()
}

const deleteTopic = async (id) => {
  await api.delete(`/topics/${id}`)
  fetchTopics()
}

const startEditTopic = (topic) => {
  editingTopicId.value = topic.id
  editingTopicName.value = topic.name
}

const saveTopic = async (id) => {
  await api.patch(`/topics/${id}`, {
    name: editingTopicName.value,
    lang: topics.value.find((t) => t.id === id)?.lang || 'vi',
  })
  editingTopicId.value = null
  editingTopicName.value = ''
  fetchTopics()
}

const addLesson = async () => {
  if (!newLessonName.value) {
    $q.notify({
      type: 'negative',
      message: 'Tên bài học là bắt buộc!',
    })
    return
  }
  await api.post(`/topics/${selectedTopicId.value}/lessons`, {
    name: newLessonName.value,
    lang: sourceLang,
  })
  newLessonName.value = ''
  newLessonLang.value = 'vi'
  fetchLessons(selectedTopicId.value)
}

const deleteLesson = async (id) => {
  await api.delete(`/topics/${selectedTopicId.value}/lessons/${id}`)
  fetchLessons(selectedTopicId.value)
}

const startEditLesson = (lesson) => {
  editingLessonId.value = lesson.id
  editingLessonName.value = lesson.name
}

const saveLesson = async (id) => {
  await api.patch(`/topics/${selectedTopicId.value}/lessons/${id}`, {
    name: editingLessonName.value,
    lang: lessons.value.find((l) => l.id === id)?.lang || 'vi',
  })
  editingLessonId.value = null
  editingLessonName.value = ''
  fetchLessons(selectedTopicId.value)
}

onMounted(() => {
  fetchTopics()
})
</script>

<style scoped>
.q-card {
  border-radius: 12px;
  transition: all 0.3s;
}
.q-card:hover {
  opacity: 0.85;
  transform: translateY(-2px);
}
.scroll-container {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 4px; /* để tránh mất nội dung khi có scrollbar */
}
</style>
