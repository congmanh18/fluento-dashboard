<template>
  <div class="q-pa-md">
    <div class="row q-mb-md">
      <div class="col-8">
        <q-input
          v-model="filter"
          dense
          outlined
          label="Search"
          class="q-mr-md"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-4">
        <div class="row items-center">
          <q-btn-dropdown
            flat
            dense
            label="Columns"
            class="q-mr-md"
          >
            <template v-slot:default>
              <q-list>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Topic</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-checkbox v-model="visibleColumns.topicName" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Status</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-checkbox v-model="visibleColumns.status" />
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple>
                  <q-item-section>
                    <q-item-label>Actions</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-checkbox v-model="visibleColumns.actions" />
                  </q-item-section>
                </q-item>
              </q-list>
            </template>
          </q-btn-dropdown>
        </div>
      </div>
    </div>

    <div class="topic-list">
      <div class="topic-header row items-center q-pa-sm bg-grey-2">
        <div class="col-1 text-left"></div>
        <div class="col-1 text-left">
          <q-checkbox v-model="selectAll" @update:model-value="toggleSelectAll" />
        </div>
        <div class="col-4" v-if="visibleColumns.topicName">Topic</div>
        <div class="col-3 text-left" v-if="visibleColumns.status">
          <div class="status-display">
            <span class="status-text">Status</span>
          </div>
        </div>
        <div class="col-3 text-center" v-if="visibleColumns.actions">Actions</div>
      </div>

      <!-- New Topic Button -->
      <div class="row items-center q-pa-sm">
        <div class="col-1 text-left"></div>
        <div class="col-1 text-left"></div>
        <div class="col-4 text-center" v-if="visibleColumns.topicName">
          <q-btn
            v-if="!isCreatingTopic"
            class="new-button"
            color="primary"
            icon="add"
            label="New Topic"
            @click="isCreatingTopic = true"
          />
          <div v-else class="row items-center q-gutter-sm">
            <div class="col-12">
              <q-input
                v-model="newTopicName"
                dense
                outlined
                placeholder="New topic name"
                @keyup.enter="createTopic"
                autofocus
              />
            </div>
          </div>
        </div>
        <div class="col-3 text-center" v-if="visibleColumns.status">
          <div v-if="isCreatingTopic" class="row q-gutter-sm justify-center">
            <q-radio
              v-model="newTopicStatus"
              val="draft"
              label="Draft"
            />
            <q-radio
              v-model="newTopicStatus"
              val="approved"
              label="Approved"
            />
            <q-radio
              v-model="newTopicStatus"
              val="reject"
              label="Reject"
            />
          </div>
        </div>
        <div class="col-3 text-center" v-if="visibleColumns.actions">
          <div v-if="isCreatingTopic" class="row justify-center">
            <q-btn
              flat
              dense
              round
              icon="add"
              color="positive"
              @click="createTopic"
            />
            <q-btn
              flat
              dense
              round
              icon="close"
              color="negative"
              @click="isCreatingTopic = false"
            />
          </div>
        </div>
      </div>

      <draggable
        v-model="filteredTopics"
        group="topics"
        item-key="id"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
        class="topic-items"
        :disabled="isDeleteMode"
      >
        <template #item="{ element }">
          <q-card flat bordered class="q-mb-sm" :class="{ 'selected': selectedTopics.includes(element) }">
            <q-card-section
              class="row items-center cursor-pointer"
              @click="!editingTopic && toggleTopic(element)"
            >
              <div class="col-1 text-left">
                <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
              </div>
              <div class="col-1 text-left">
                <q-checkbox v-model="selectedTopics" :val="element" @click.stop />
              </div>
              <div class="col-4 topic-name" v-if="visibleColumns.topicName">
                <template v-if="editingTopic === element">
                  <q-input
                    v-model="editingTopicName"
                    dense
                    outlined
                    @keyup.enter="saveTopic(element)"
                    autofocus
                  />
                </template>
                <template v-else>
                  {{ element.name }}
                </template>
              </div>
              <div class="col-3 text-left" v-if="visibleColumns.status">
                <template v-if="editingTopic === element">
                  <div class="row q-gutter-sm">
                    <q-radio
                      v-model="editingTopicStatus"
                      val="draft"
                      label="Draft"
                      @click.stop
                    />
                    <q-radio
                      v-model="editingTopicStatus"
                      val="approved"
                      label="Approved"
                      @click.stop
                    />
                    <q-radio
                      v-model="editingTopicStatus"
                      val="reject"
                      label="Reject"
                      @click.stop
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="status-display">
                    <span class="status-dot" :style="{ backgroundColor: getStatusColor(element.status) }"></span>
                    <span class="status-text">{{ getStatusLabel(element.status) }}</span>
                  </div>
                </template>
              </div>
              <div class="col-3 text-center" v-if="visibleColumns.actions">
                <div class="row justify-center">
                  <template v-if="editingTopic === element">
                    <q-btn
                      flat
                      dense
                      round
                      icon="close"
                      color="negative"
                      @click.stop="cancelEditTopic"
                      class="q-ml-sm"
                    />
                  </template>
                  <template v-else>
                    <q-btn
                      flat
                      dense
                      round
                      icon="edit"
                      @click.stop="startEditTopic(element)"
                      class="q-ml-sm"
                    />
                  </template>
                </div>
              </div>
            </q-card-section>

            <q-slide-transition>
              <div v-show="element.expanded">
                <q-separator />
                <q-card-section class="q-pa-none">
                  <div class="lesson-list">
                    <!-- New Lesson Button -->
                    <div class="row items-center q-pa-sm">
                      <div class="col-1 text-left"></div>
                      <div class="col-1 text-left"></div>
                      <div class="col-4 text-center">
                        <q-btn
                          v-if="!isCreatingLesson[element.id]"
                          class="new-button"
                          color="primary"
                          icon="add"
                          label="New Lesson"
                          @click="isCreatingLesson[element.id] = true"
                        />
                        <div v-else class="row items-center q-gutter-sm">
                          <div class="col-12">
                            <q-input
                              v-model="newLessonName"
                              dense
                              outlined
                              placeholder="New lesson name"
                              @keyup.enter="createLesson(element)"
                              autofocus
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-3 text-center">
                        <div v-if="isCreatingLesson[element.id]">
                          <q-input
                            v-model="newLessonImageURL"
                            dense
                            outlined
                            placeholder="Image URL"
                            @keyup.enter="createLesson(element)"
                          />
                        </div>
                      </div>
                      <div class="col-3 text-center">
                        <div v-if="isCreatingLesson[element.id]" class="row justify-center">
                          <q-btn
                            flat
                            dense
                            round
                            icon="add"
                            color="positive"
                            @click="createLesson(element)"
                          />
                          <q-btn
                            flat
                            dense
                            round
                            icon="close"
                            color="negative"
                            @click="isCreatingLesson[element.id] = false"
                          />
                        </div>
                      </div>
                    </div>
                    <draggable
                      v-model="element.lessons"
                      group="lessons"
                      item-key="id"
                      handle=".handle"
                      @start="drag=true"
                      @end="drag=false; updateLessonOrder(element)"
                      class="lesson-items"
                      :disabled="isDeleteMode"
                    >
                      <template #item="{ element: lesson, index }">
                        <div class="row items-center q-pa-sm lesson-item" :class="{ 'selected': selectedLessons.includes(lesson) }">
                          <div class="col-1 text-left">
                            <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
                          </div>
                          <div class="col-1 text-left">
                            <q-checkbox v-model="selectedLessons" :val="lesson" />
                          </div>
                          <div class="col-4 lesson-name">
                            <template v-if="editingLesson === lesson">
                              <q-input
                                v-model="editingLessonName"
                                dense
                                outlined
                                @keyup.enter="saveLesson(element, lesson)"
                                autofocus
                              />
                            </template>
                            <template v-else>
                              {{ lesson.name }}
                            </template>
                          </div>
                          <div class="col-3 text-center lesson-image">
                            <template v-if="editingLesson === lesson">
                              <q-input
                                v-model="editingLessonImageURL"
                                dense
                                outlined
                                @keyup.enter="saveLesson(element, lesson)"
                              />
                            </template>
                            <template v-else>
                              <img
                                :src="lesson.imageURL"
                                alt="lesson image"
                                style="width: 50px; height: 50px; object-fit: cover;"
                                class="rounded-borders"
                                @error="handleImageError"
                              />
                            </template>
                          </div>
                          <div class="col-3 text-center lesson-actions">
                            <div class="row justify-center">
                              <template v-if="editingLesson === lesson">
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="close"
                                  color="negative"
                                  @click="cancelEditLesson"
                                  class="q-ml-sm"
                                />
                              </template>
                              <template v-else>
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="edit"
                                  @click="startEditLesson(element, lesson)"
                                />
                              </template>
                            </div>
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </template>
      </draggable>
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="primary" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete {{ selectedTopics.length > 1 ? 'these topics' : 'this topic' }}?</span>
        </q-card-section>

        <q-card-section v-if="selectedTopics.length > 0">
          <div class="text-subtitle2 q-mb-sm">Please enter the topic name to confirm:</div>
          <q-input
            v-model="confirmTopicName"
            label="Topic Name"
            :rules="[val => val === selectedTopics[0].name || 'Topic name does not match']"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="cancelDelete" />
          <q-btn flat label="Delete" color="negative" v-close-popup @click="confirmDelete" :disable="!canDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useTopicStore } from '../stores/topic'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'TopicTable',
  components: {
    draggable
  },

  setup() {
    const topicStore = useTopicStore()
    const deleteType = ref('topic')

    const filter = ref('')
    const drag = ref(false)

    // Column visibility
    const visibleColumns = ref({
      topicName: true,
      status: true,
      actions: true
    })

    // Topic states
    const selectedTopic = ref(null)
    const editingTopic = ref(null)
    const editingTopicName = ref('')
    const editingTopicStatus = ref('draft')
    const newTopicName = ref('')
    const newTopicStatus = ref('draft')
    const isCreatingTopic = ref(false)
    const isCreatingLesson = ref({})

    // Lesson states
    const selectedLesson = ref(null)
    const editingLesson = ref(null)
    const editingLessonName = ref('')
    const editingLessonImageURL = ref('')
    const newLessonName = ref('')
    const newLessonImageURL = ref('')

    const statusOptions = [
      { label: 'Draft', value: 'draft' },
      { label: 'Approved', value: 'approved' },
      { label: 'Reject', value: 'reject' }
    ]

    const topics = computed(() => topicStore.topics)

    const filteredTopics = computed({
      get: () => {
        let filtered = topics.value

        if (filter.value) {
          const searchTerm = filter.value.toLowerCase()
          filtered = filtered.filter(topic =>
            topic.name.toLowerCase().includes(searchTerm)
          )
        }

        return filtered
      },
      set: (value) => {
        topicStore.reorderTopics(value)
      }
    })

    const createTopic = () => {
      if (newTopicName.value.trim()) {
        topicStore.createTopic({
          name: newTopicName.value.trim(),
          status: newTopicStatus.value,
          lessons: []
        })
        newTopicName.value = ''
        newTopicStatus.value = 'draft'
        isCreatingTopic.value = false
      }
    }

    const createLesson = (topic) => {
      if (newLessonName.value.trim()) {
        topicStore.createLesson(topic.id, {
          name: newLessonName.value.trim(),
          imageURL: newLessonImageURL.value || 'https://placehold.co/50x50/png?text=No+Img',
          order: topic.lessons ? topic.lessons.length + 1 : 1
        })
        newLessonName.value = ''
        newLessonImageURL.value = ''
        isCreatingLesson.value[topic.id] = false
      }
    }

    const updateTopicStatus = (topic) => {
      topicStore.updateTopic({
        ...topic,
        status: topic.status
      })
    }

    const toggleTopic = (topic) => {
      topic.expanded = !topic.expanded
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'draft': return 'grey'
        case 'reject': return 'red'
        case 'approved': return 'green'
        default: return 'grey'
      }
    }

    const getStatusLabel = (status) => {
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.label : status
    }

    const handleImageError = (event) => {
      event.target.src = 'https://placehold.co/50x50/png?text=No+Img'
    }

    const updateLessonOrder = (topic) => {
      if (topic.lessons) {
        topic.lessons.forEach((lesson, index) => {
          lesson.order = index + 1
        })
      }
    }

    // Topic CRUD methods
    const startEditTopic = (topic) => {
      editingTopic.value = topic
      editingTopicName.value = topic.name
      editingTopicStatus.value = topic.status
    }

    const saveTopic = (topic) => {
      if (editingTopicName.value.trim() || editingTopicStatus.value !== topic.status) {
        topicStore.updateTopic({
          ...topic,
          name: editingTopicName.value.trim() || topic.name,
          status: editingTopicStatus.value
        })
      }
      cancelEditTopic()
    }

    const cancelEditTopic = () => {
      editingTopic.value = null
      editingTopicName.value = ''
      editingTopicStatus.value = 'draft'
    }

    // Lesson CRUD methods
    const startEditLesson = (topic, lesson) => {
      editingLesson.value = lesson
      editingLessonName.value = lesson.name
      editingLessonImageURL.value = lesson.imageURL
    }

    const saveLesson = (topic, lesson) => {
      if (editingLessonName.value.trim() || editingLessonImageURL.value !== lesson.imageURL) {
        topicStore.updateLesson(topic.id, {
          ...lesson,
          name: editingLessonName.value.trim() || lesson.name,
          imageURL: editingLessonImageURL.value
        })
      }
      cancelEditLesson()
    }

    const cancelEditLesson = () => {
      editingLesson.value = null
      editingLessonName.value = ''
      editingLessonImageURL.value = ''
    }

    // Delete mode
    const isDeleteMode = ref(false)
    const selectedTopics = ref([])
    const selectedLessons = ref([])
    const selectAll = ref(false)
    const confirmTopicName = ref('')
    const deleteDialog = ref(false)

    const canDelete = computed(() => {
      if (selectedTopics.value.length === 0) return false
      return confirmTopicName.value === selectedTopics.value[0].name
    })

    const toggleDeleteMode = () => {
      isDeleteMode.value = !isDeleteMode.value
      if (!isDeleteMode.value) {
        selectedTopics.value = []
        selectAll.value = false
      }
    }

    const toggleSelectAll = (value) => {
      if (value) {
        selectedTopics.value = [...filteredTopics.value]
      } else {
        selectedTopics.value = []
      }
    }

    const cancelDelete = () => {
      confirmTopicName.value = ''
    }

    const confirmDelete = () => {
      if (selectedTopics.value.length > 0) {
        selectedTopics.value.forEach(topic => {
          topicStore.deleteTopic(topic.id)
        })
        toggleDeleteMode()
        confirmTopicName.value = ''
      }
    }

    return {
      topics,
      filteredTopics,
      filter,
      drag,
      visibleColumns,
      toggleTopic,
      getStatusColor,
      getStatusLabel,
      handleImageError,
      updateLessonOrder,
      updateTopicStatus,
      // Delete mode
      isDeleteMode,
      selectedTopics,
      selectedLessons,
      selectAll,
      confirmTopicName,
      canDelete,
      toggleDeleteMode,
      toggleSelectAll,
      cancelDelete,
      confirmDelete,
      // Topic CRUD
      editingTopic,
      editingTopicName,
      editingTopicStatus,
      statusOptions,
      startEditTopic,
      saveTopic,
      cancelEditTopic,
      // New topic/lesson
      newTopicName,
      newTopicStatus,
      newLessonName,
      newLessonImageURL,
      isCreatingTopic,
      isCreatingLesson,
      createTopic,
      createLesson,
      // Lesson CRUD
      editingLesson,
      editingLessonName,
      editingLessonImageURL,
      startEditLesson,
      saveLesson,
      cancelEditLesson,
      // Delete dialog
      deleteDialog
    }
  }
})
</script>

<style scoped>
.topic-list {
  border: 1px solid #ddd;
  border-radius: 4px;
}

.topic-header, .lesson-header {
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.topic-items, .lesson-items {
  min-height: 50px;
}

.lesson-list {
  border: 1px solid #eee;
  margin: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.lesson-item {
  border-bottom: 1px solid #eee;
  background-color: #ffffff;
}

.lesson-item:last-child {
  border-bottom: none;
}

.handle {
  cursor: move;
  cursor: -webkit-grabbing;
  color: #666;
  transition: color 0.3s;
}

.handle:hover {
  color: #000;
}

.q-card {
  transition: all 0.3s;
}

.q-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-select :deep(.q-field__label) {
  font-weight: bold;
}

.header-select :deep(.q-field__native) {
  font-weight: bold;
}

.status-filter {
  position: relative;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  height: 100%;
  width: 100%;
}

.status-label .q-icon {
  margin-left: 4px;
  font-size: 16px;
}

.status-menu {
  z-index: 1000;
}

.status-menu .q-item {
  min-height: 32px;
  padding: 4px 16px;
  cursor: pointer;
}

.status-menu .q-item:hover {
  background-color: #f5f5f5;
}

.status-menu .q-item-section {
  padding: 0;
}

.status-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.status-text {
  text-transform: capitalize;
  font-weight: 500;
}

.lesson-name {
  padding-left: 20px;
  font-size: 14px;
}

.topic-name {
  font-size: 16px;
  font-weight: bold;
}

.lesson-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lesson-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.q-card.selected {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}

.lesson-item.selected {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}

.new-button {
  border-radius: 20px;
  animation: pulse 2s infinite;
  padding: 8px 24px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
}
</style>
