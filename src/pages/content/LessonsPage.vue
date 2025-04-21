<template>
  <div class="q-pa-md fb-container" :class="{ 'dark': isDark }">
    <div class="row q-gutter-md no-wrap full-height">
      <!-- Left Panel -->
      <div class="col-8 q-pa-md fb-panel rounded shadow-1">
        <div v-if="!isCreatingNew && selectedLesson" class="preview-mode">
          <h3 class="topic-name">{{ selectedLesson.name }}</h3>
          <div class="q-mt-md">
            <div v-if="isEditing" class="edit-mode">
              <q-input
                v-model="lessonName"
                label="Edit Lesson Name"
                class="fb-input"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
              <q-select
                v-model="selectedTopic"
                :options="topics"
                option-label="name"
                option-value="id"
                label="Select Topic"
                class="fb-input q-mt-md"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
            </div>
            <div v-else class="q-mt-md">
              <p class="text-grey-8">Topic: {{ getTopicName(selectedLesson.topicId) }}</p>
            </div>
          </div>
          <div class="row q-mt-md items-center">
            <q-btn
              round
              :icon="isEditing ? 'done' : 'edit'"
              class="q-mr-sm fb-btn"
              color="primary"
              @click="isEditing ? saveEdit() : startEdit()"
            >
              <q-tooltip>{{ isEditing ? 'Save' : 'Edit' }}</q-tooltip>
            </q-btn>
            <q-btn
              round
              icon="delete"
              class="fb-btn negative"
              color="red"
              @click="deleteLesson"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
            <q-btn
              round
              icon="add"
              class="q-ml-auto fb-btn"
              color="primary"
              @click="startCreateNew"
            >
              <q-tooltip>Create New</q-tooltip>
            </q-btn>
          </div>
        </div>
        <div v-else class="create-mode">
          <q-select
            v-model="selectedTopic"
            :options="topics"
            option-label="name"
            option-value="id"
            label="Select Topic"
            class="fb-input"
            dense
            outlined
            bg-color="white"
            color="primary"
          />
          <div class="row items-center q-mb-md">
            <q-input
              v-model="lessonName"
              label="Lesson Name"
              class="fb-input col"
              dense
              outlined
              bg-color="white"
              color="primary"
            />
            <q-btn
              round
              icon="save"
              class="fb-btn q-ml-sm"
              color="primary"
              :disable="!lessonName || !selectedTopic"
              @click="saveLesson"
            >
              <q-tooltip>Save</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>

      <!-- Right Panel -->
      <div class="col-4 q-pa-md lesson-list-container fb-panel-light rounded shadow-1">
        <Draggable
          v-model="lessons"
          item-key="id"
          animation="200"
          class="lesson-list"
          @start="dragStart"
          @end="dragEnd"
        >
          <template #item="{ element }">
            <div
              class="lesson-card rounded shadow-1"
              :class="{ 'selected': selectedLesson?.id === element.id }"
              @click="selectLesson(element)"
            >
              <div class="row no-wrap items-center">
                <div class="q-pa-md flex-grow">
                  <div class="text-ellipsis text-grey-9">{{ element.name }}</div>
                  <div class="text-caption text-grey-7">{{ getTopicName(element.topicId) }}</div>
                </div>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Draggable from 'vuedraggable';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const isDark = ref($q.dark.isActive);

// State
const lessonName = ref('');
const lessons = ref([
  { id: 1, name: 'Introduction to Nebula', topicId: 1 },
  { id: 2, name: 'Starfield Basics', topicId: 2 },
  { id: 3, name: 'Quantum Mechanics', topicId: 3 },
]);
const topics = ref([
  { id: 1, name: 'Nebula Hub' },
  { id: 2, name: 'Starfield' },
  { id: 3, name: 'Quantum Core' },
  { id: 4, name: 'Galactic Drift' },
  { id: 5, name: 'Cosmic Cascade' },
  { id: 6, name: 'Astral Veil' },
  { id: 7, name: 'Stellar Nexus' },
  { id: 8, name: 'Lunar Pulse' },
  { id: 9, name: 'Orbit Shift' },
  { id: 10, name: 'Cosmic Tide' },
]);
const selectedLesson = ref(null);
const selectedTopic = ref(null);
const isCreatingNew = ref(false);
const isEditing = ref(false);

// Notifications
const showNotification = (message, type = 'positive') => {
  $q.notify({
    message,
    color: type,
    icon: type === 'positive' ? 'check_circle' : 'error',
    position: 'top',
    timeout: 2000,
  });
};

// Helper
const getTopicName = (topicId) => {
  const topic = topics.value.find((t) => t.id === topicId);
  return topic ? topic.name : 'Unknown Topic';
};

// Lesson actions
const selectLesson = (lesson) => {
  selectedLesson.value = { ...lesson };
  lessonName.value = lesson.name;
  selectedTopic.value = topics.value.find((t) => t.id === lesson.topicId) || null;
  isCreatingNew.value = false;
  isEditing.value = false;
};

const startCreateNew = () => {
  isCreatingNew.value = true;
  selectedLesson.value = null;
  lessonName.value = '';
  selectedTopic.value = null;
};

const startEdit = () => {
  isEditing.value = true;
  lessonName.value = selectedLesson.value.name;
  selectedTopic.value = topics.value.find((t) => t.id === selectedLesson.value.topicId) || null;
};

const saveLesson = () => {
  if (lessonName.value && selectedTopic.value) {
    lessons.value.push({
      id: Date.now(),
      name: lessonName.value,
      topicId: selectedTopic.value.id,
    });
    lessonName.value = '';
    selectedTopic.value = null;
    isCreatingNew.value = false;
    selectedLesson.value = null;
    showNotification('New lesson created!');
  } else {
    showNotification('Please provide a lesson name and select a topic!', 'negative');
  }
};

const saveEdit = () => {
  if (selectedLesson.value && lessonName.value && selectedTopic.value) {
    const index = lessons.value.findIndex((l) => l.id === selectedLesson.value.id);
    if (index !== -1) {
      lessons.value[index] = {
        ...lessons.value[index],
        name: lessonName.value,
        topicId: selectedTopic.value.id,
      };
      selectedLesson.value = { ...lessons.value[index] };
      isEditing.value = false;
      lessonName.value = '';
      selectedTopic.value = null;
      showNotification('Lesson updated!');
    } else {
      showNotification('Lesson not found!', 'negative');
    }
  } else {
    showNotification('Please provide a lesson name and select a topic!', 'negative');
  }
};

const deleteLesson = () => {
  if (selectedLesson.value) {
    $q.dialog({
      title: 'Confirm Delete',
      message: `Delete "${selectedLesson.value.name}"?`,
      cancel: true,
    }).onOk(() => {
      lessons.value = lessons.value.filter((l) => l.id !== selectedLesson.value.id);
      selectedLesson.value = null;
      lessonName.value = '';
      selectedTopic.value = null;
      isCreatingNew.value = false;
      isEditing.value = false;
      showNotification('Lesson deleted!');
    });
  } else {
    showNotification('No lesson selected!', 'negative');
  }
};

// Drag and drop
const dragStart = () => {
  document.querySelectorAll('.lesson-card').forEach((card) => {
    card.style.transition = 'transform 0.2s ease';
    card.style.transform = 'scale(1.05)';
  });
};

const dragEnd = () => {
  document.querySelectorAll('.lesson-card').forEach((card) => {
    card.style.transform = 'scale(1)';
  });
  showNotification('Lessons reordered!');
};
</script>

<style scoped>
/* Modern, clean, and minimalistic design */
.fb-container {
  background: #f5f7fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  padding: 24px;
  color: #1f2a44;
}

.full-height {
  min-height: calc(100vh - 48px);
}

.fb-panel {
  background: #ffffff;
  border: 1px solid #e4e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fb-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.fb-panel-light {
  background: #fafafa;
  border: 1px solid #e4e7eb;
  border-radius: 16px;
  height: calc(100vh - 48px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
  isolation: isolate;
}

.fb-panel-light::-webkit-scrollbar {
  width: 10px;
}

.fb-panel-light::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 5px;
}

.fb-panel-light::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 5px;
}

.fb-btn {
  border-radius: 50%;
  padding: 10px;
  background: #3b82f6;
  color: #ffffff;
  transition: all 0.2s ease;
}

.fb-btn:hover {
  background: #1d4ed8;
  transform: scale(1.15);
}

.fb-btn[color="primary"] {
  background: #3b82f6;
}

.fb-btn[color="primary"]:hover {
  background: #1d4ed8;
}

.fb-btn[color="red"] {
  background: #ef4444;
}

.fb-btn[color="red"]:hover {
  background: #b91c1c;
}

.fb-input {
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #1f2a44;
  transition: border-color 0.2s ease;
}

.fb-input:hover, .fb-input:focus {
  border-color: #3b82f6;
}

.fb-icon {
  color: #6b7280;
  transition: color 0.2s ease;
}

.fb-icon:hover {
  color: #3b82f6;
}

.topic-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2a44;
  letter-spacing: 0.5px;
}

.lesson-card {
  background: #ffffff;
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 12px;
  border: 1px solid #e4e7eb;
  transition: all 0.2s ease;
  padding: 8px;
}

.lesson-card:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.lesson-card.selected {
  background: #e0f2fe;
  border-left: 5px solid #3b82f6;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 1.1rem;
  font-weight: 500;
  color: #1f2a44;
}

/* Dark mode */
.dark .fb-container {
  background: #1f2a44;
}

.dark .fb-panel {
  background: #374151;
  border-color: #4b5563;
}

.dark .fb-panel-light {
  background: #374151;
  border-color: #4b5563;
}

.dark .fb-btn {
  color: #ffffff;
}

.dark .fb-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #e5e7eb;
}

.dark .topic-name {
  color: #e5e7eb;
}

.dark .lesson-card {
  background: #374151;
  border-color: #4b5563;
}

.dark .lesson-card.selected {
  background: #4b5563;
}

.dark .text-ellipsis {
  color: #e5e7eb;
}

@media (max-width: 768px) {
  .fb-container {
    padding: 16px;
  }
  .full-height {
    flex-direction: column;
  }
  .col-8, .col-4 {
    width: 100%;
  }
  .fb-panel {
    margin-bottom: 16px;
  }
  .fb-panel-light {
    height: auto;
    max-height: 400px;
  }
}
</style>