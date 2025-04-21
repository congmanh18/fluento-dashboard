<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="no-shadow" bordered>
      <div class="q-pa-sm">
        <!-- Preview mode -->
        <div
          v-if="!topicStore.isCreatingNew && topicStore.selectedTopic && !topicStore.isEditing"
          class="preview-mode"
        >
          <div class="row justify-end q-mb-md">
            <q-btn
              flat
              icon="add"
              label="Create New"
              color="primary"
              class="fb-btn fb-btn-flat q-mr-sm"
              @click="topicStore.startCreateNew()"
            >
              <q-tooltip>Create New</q-tooltip>
            </q-btn>
            <q-btn
              flat
              icon="edit"
              label="Edit"
              color="primary"
              class="fb-btn fb-btn-flat q-mr-sm"
              @click="topicStore.startEdit()"
            >
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn
              flat
              icon="delete"
              label="Delete"
              color="red"
              class="fb-btn fb-btn-flat"
              @click="confirmDelete"
            >
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </div>
          <div class="topic-content">
            <h3 class="topic-name q-mb-sm">{{ topicStore.selectedTopic.name }}</h3>
            <p class="topic-desc q-mb-md">
              {{ topicStore.selectedTopic.description || 'No description' }}
            </p>

            <!-- Lesson table or form -->
            <div v-if="!topicStore.isCreatingLesson && !topicStore.isEditingLesson">
              <q-table
                :rows="topicStore.selectedTopic?.lessons || []"
                :columns="lessonColumns"
                row-key="id"
                class="lesson-table"
                flat
                bordered
                dense
              >
                <template v-slot:body-cell-imageURL="props">
                  <q-td>
                    <q-img
                      v-if="props.row.imageURL"
                      :src="props.row.imageURL"
                      style="width: 50px; height: 50px;"
                      placeholder-src="https://via.placeholder.com/50"
                    />
                    <span v-else>No image</span>
                  </q-td>
                </template>
                <template v-slot:body-cell-status="props">
                  <q-td>
                    <q-badge
                      :color="topicStore.getStatusColor(props.row.status)"
                      text-color="white"
                      style="font-size: 0.9rem;"
                    >
                      {{ props.row.status }}
                    </q-badge>
                  </q-td>
                </template>
                <template v-slot:body-cell-action="props">
                  <q-td>
                    <q-btn
                      flat
                      icon="edit"
                      color="primary"
                      class="fb-btn fb-btn-flat q-mr-sm"
                      @click="topicStore.startEditLesson(props.row)"
                    >
                      <q-tooltip>Edit Lesson</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      icon="delete"
                      color="red"
                      class="fb-btn fb-btn-flat"
                      @click="confirmDeleteLesson(props.row.id)"
                    >
                      <q-tooltip>Delete Lesson</q-tooltip>
                    </q-btn>
                  </q-td>
                </template>
                <template v-slot:bottom>
                  <q-btn
                    flat
                    icon="add"
                    label="Add Lesson"
                    color="primary"
                    class="fb-btn fb-btn-flat"
                    @click="topicStore.startCreateLesson()"
                  >
                    <q-tooltip>Add New Lesson</q-tooltip>
                  </q-btn>
                </template>
                <template v-slot:no-data>
                  <div class="full-width row justify-center q-pa-md">
                    <q-btn
                      flat
                      icon="add"
                      label="Add Lesson"
                      color="primary"
                      class="fb-btn fb-btn-flat"
                      @click="topicStore.startCreateLesson()"
                    >
                      <q-tooltip>Add New Lesson</q-tooltip>
                    </q-btn>
                  </div>
                </template>
              </q-table>
            </div>
            <div v-else class="lesson-form">
              <div class="row justify-end q-mb-md">
                <q-btn
                  flat
                  :icon="topicStore.isEditingLesson ? 'done' : 'save'"
                  label="Save"
                  color="primary"
                  class="fb-btn fb-btn-flat q-mr-sm"
                  :disable="!topicStore.lessonName"
                  @click="topicStore.saveLesson()"
                >
                  <q-tooltip>{{ topicStore.isEditingLesson ? 'Save Lesson' : 'Save' }}</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  icon="close"
                  label="Cancel"
                  color="grey"
                  class="fb-btn fb-btn-flat"
                  @click="topicStore.cancelLesson()"
                >
                  <q-tooltip>Cancel</q-tooltip>
                </q-btn>
              </div>
              <q-input
                v-model="topicStore.lessonName"
                :label="topicStore.isEditingLesson ? 'Edit Lesson Name' : 'Lesson Name'"
                class="fb-input q-mb-sm"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
              <q-input
                v-model="topicStore.lessonImageURL"
                :label="topicStore.isEditingLesson ? 'Edit Image URL' : 'Image URL'"
                class="fb-input q-mb-sm"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
              <q-select
                v-model="topicStore.lessonStatus"
                :options="topicStore.statusOptions.map(opt => opt.value)"
                :label="topicStore.isEditingLesson ? 'Edit Status' : 'Status'"
                class="fb-input q-mb-md"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
            </div>
          </div>
        </div>

        <!-- Create or Edit Topic mode -->
        <div v-else class="create-mode">
          <div class="row justify-end q-mb-md">
            <q-btn
              flat
              :icon="topicStore.isEditing ? 'done' : 'save'"
              label="Save"
              color="primary"
              class="fb-btn fb-btn-flat q-mr-sm"
              :disable="!topicStore.topicName"
              @click="topicStore.isEditing ? topicStore.saveEdit() : topicStore.saveTopic()"
            >
              <q-tooltip>{{ topicStore.isEditing ? 'Save Edit' : 'Save' }}</q-tooltip>
            </q-btn>
            <q-btn
              flat
              icon="close"
              label="Cancel"
              color="grey"
              class="fb-btn fb-btn-flat"
              @click="cancelEditOrCreate"
            >
              <q-tooltip>Cancel</q-tooltip>
            </q-btn>
          </div>
          <div class="topic-content">
            <q-input
              v-model="topicStore.topicName"
              :label="topicStore.isEditing ? 'Edit Topic Name' : 'Topic Name'"
              class="fb-input q-mb-sm"
              dense
              outlined
              bg-color="white"
              color="primary"
            />
            <q-input
              v-model="topicStore.description"
              :label="topicStore.isEditing ? 'Edit Description' : 'Description'"
              class="fb-input q-mb-md description"
              dense
              outlined
              bg-color="white"
              color="primary"
              type="textarea"
            />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useTopicStore } from '../../stores/topicStore';

const $q = useQuasar();
const topicStore = useTopicStore();

// Cột của bảng lesson
const lessonColumns = [
  { name: 'imageURL', label: 'Image', field: 'imageURL', align: 'left' },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' },
  { name: 'action', label: 'Action', field: 'action', align: 'right' },
];

const confirmDelete = () => {
  if (topicStore.selectedTopic) {
    $q.dialog({
      title: 'Confirm Delete',
      message: `Delete "${topicStore.selectedTopic.name}"?`,
      cancel: true,
    }).onOk(() => {
      topicStore.deleteTopic();
    });
  }
};

const confirmDeleteLesson = (lessonId) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Delete this lesson?',
    cancel: true,
  }).onOk(() => {
    topicStore.deleteLesson(lessonId);
  });
};

const cancelEditOrCreate = () => {
  if (topicStore.isEditing) {
    topicStore.cancelEdit();
  } else if (topicStore.isCreatingNew) {
    topicStore.cancelCreate();
  }
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.topic-content {
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.topic-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2a44;
}

.topic-desc {
  font-size: 0.875rem;
  color: #666;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fb-input {
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #1f2a44;
  transition: border-color 0.2s ease;
}

.fb-input:hover,
.fb-input:focus {
  border-color: #3b82f6;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lesson-table {
  margin-top: 16px;
  border-radius: 4px;
  overflow: hidden;
}

.lesson-table :deep(.q-table) {
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.lesson-table :deep(.q-table th) {
  background: #f0f0f0;
  color: #1f2a44;
  font-weight: 600;
}

.lesson-table :deep(.q-table td) {
  color: #1f2a44;
}

.lesson-table :deep(.q-table tr:hover) {
  background: #f0f0f0;
}

.lesson-form {
  margin-top: 16px;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
}

.fb-btn {
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  text-transform: none;
  transition: all 0.2s ease;
}

.fb-btn-flat {
  background: transparent;
  border: 1px solid;
}

.fb-btn-flat[color="primary"] {
  border-color: #3b82f6;
  color: #3b82f6;
}

.fb-btn-flat[color="primary"]:hover {
  background: #3b82f6;
  color: #ffffff;
  transform: translateY(-2px);
}

.fb-btn-flat[color="primary"][disabled] {
  border-color: #a3bffa;
  color: #a3bffa;
  opacity: 0.6;
}

.fb-btn-flat[color="red"] {
  border-color: #ef4444;
  color: #ef4444;
}

.fb-btn-flat[color="red"]:hover {
  background: #ef4444;
  color: #ffffff;
  transform: translateY(-2px);
}

.fb-btn-flat[color="grey"] {
  border-color: #9ca3af;
  color: #9ca3af;
}

.fb-btn-flat[color="grey"]:hover {
  background: #9ca3af;
  color: #ffffff;
  transform: translateY(-2px);
}

/* Dark mode styles */
.dark .q-card {
  background: #374151;
  border-color: #4b5563;
}

.dark .topic-content {
  background: #374151;
}

.dark .topic-name {
  color: #e5e7eb;
}

.dark .topic-desc {
  color: #9ca3af;
}

.dark .fb-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #e5e7eb;
}

.dark .description {
  color: #9ca3af;
}

.dark .lesson-table :deep(.q-table) {
  background: #374151;
  border-color: #4b5563;
}

.dark .lesson-table :deep(.q-table th) {
  background: #4b5563;
  color: #e5e7eb;
}

.dark .lesson-table :deep(.q-table td) {
  color: #e5e7eb;
}

.dark .lesson-table :deep(.q-table tr:hover) {
  background: #4b5563;
}

.dark .lesson-form {
  background: #374151;
  border-color: #4b5563;
}

.dark .fb-btn-flat[color="primary"] {
  border-color: #60a5fa;
  color: #60a5fa;
}

.dark .fb-btn-flat[color="primary"]:hover {
  background: #60a5fa;
  color: #1f2a44;
}

.dark .fb-btn-flat[color="primary"][disabled] {
  border-color: #93c5fd;
  color: #93c5fd;
  opacity: 0.6;
}

.dark .fb-btn-flat[color="red"] {
  border-color: #f87171;
  color: #f87171;
}

.dark .fb-btn-flat[color="red"]:hover {
  background: #f87171;
  color: #1f2a44;
}

.dark .fb-btn-flat[color="grey"] {
  border-color: #d1d5db;
  color: #d1d5db;
}

.dark .fb-btn-flat[color="grey"]:hover {
  background: #d1d5db;
  color: #1f2a44;
}
</style>
