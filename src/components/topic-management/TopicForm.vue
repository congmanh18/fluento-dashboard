<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="card" bordered>
      <div class="q-pa-md">
        <!-- Preview mode -->
        <div
          v-if="!topicStore.isCreatingNew && topicStore.selectedTopic && !topicStore.isEditing"
          class="preview-mode"
        >
          <div class="row justify-between items-center q-mb-md">
            <h3
              class="topic-name q-my-none"
              @dblclick="topicStore.startEdit()"
            >
              {{ topicStore.selectedTopic.name }}
            </h3>
            <div class="row">
              <q-btn
                flat
                icon="add"
                color="primary"
                class="btn btn-flat q-mr-sm"
                @click="topicStore.startCreateNew()"
              >
                <q-tooltip>Create New Topic</q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="topic-content">
            <!-- Lesson table or form -->
            <div v-if="!topicStore.isCreatingLesson && !topicStore.isEditingLesson">
              <div class="row q-col-gutter-md">
                <div
                  v-for="lesson in topicStore.selectedTopic?.lessons || []"
                  :key="lesson.id"
                  class="col-12 col-sm-6 col-md-4"
                >
                  <q-card
                    class="lesson-card"
                    @dblclick="startEditLesson(lesson)"
                  >
                    <div class="image-container">
                      <q-btn
                        flat
                        icon="delete"
                        color="red"
                        class="delete-btn"
                        @click.stop="confirmDeleteLesson(lesson.id)"
                      >
                        <q-tooltip>Delete Lesson</q-tooltip>
                      </q-btn>
                      <q-img
                        v-if="lesson.imageURL"
                        :src="lesson.imageURL"
                        :ratio="16/9"
                        class="lesson-image"
                        placeholder-src="https://via.placeholder.com/400x225"
                      />
                      <div v-else class="placeholder-image">
                        <q-icon name="image" size="48px" color="grey-5" />
                      </div>
                      <div class="image-overlay">
                        <q-btn
                          flat
                          icon="add_photo_alternate"
                          color="white"
                          class="upload-btn"
                          @click.stop="handleImageClick(lesson)"
                        >
                          <q-tooltip>Upload Image</q-tooltip>
                        </q-btn>
                        <input
                          type="file"
                          :ref="el => setImageInputRef(el, lesson)"
                          accept=".jpg,.jpeg,.png,.gif"
                          style="display: none"
                          @change="handleImageChange($event, lesson)"
                        />
                      </div>
                    </div>
                    <q-card-section>
                      <template v-if="editingLesson?.id === lesson.id">
                        <q-input
                          ref="lessonNameInput"
                          v-model="editingLesson.name"
                          dense
                          autofocus
                          @keydown.enter="saveLessonEdit"
                        />
                        <q-select
                          v-model="editingLesson.status"
                          :options="topicStore.statusOptions.map(opt => opt.value)"
                          dense
                          class="q-mt-sm"
                          outlined
                          emit-value
                          map-options
                        />
                        <div class="row justify-end q-mt-sm">
                          <q-btn
                            flat
                            icon="done"
                            color="primary"
                            size="sm"
                            @click="saveLessonEdit"
                          >
                            <q-tooltip>Save</q-tooltip>
                          </q-btn>
                          <q-btn
                            flat
                            icon="close"
                            color="grey"
                            size="sm"
                            @click="cancelLessonEdit"
                          >
                            <q-tooltip>Cancel</q-tooltip>
                          </q-btn>
                        </div>
                      </template>
                      <template v-else>
                        <div class="text-h6 q-mb-xs">{{ lesson.name }}</div>
                        <q-badge
                          :color="topicStore.getStatusColor(lesson.status)"
                          text-color="white"
                          class="badge"
                        >
                          {{ lesson.status || 'Unknown' }}
                        </q-badge>
                      </template>
                    </q-card-section>
                  </q-card>
                </div>
                <!-- Add Lesson Card -->
                <div v-if="!isCreatingNewLesson" class="col-12 col-sm-6 col-md-4">
                  <q-card
                    class="lesson-card add-card"
                    @click="startCreateLesson"
                  >
                    <div class="image-container">
                      <div class="placeholder-image">
                        <q-icon name="add" size="48px" color="primary" />
                      </div>
                    </div>
                    <q-card-section>
                      <div class="text-h6 q-mb-xs">Add New Lesson</div>
                    </q-card-section>
                  </q-card>
                </div>

                <!-- New Lesson Form Card -->
                <div v-if="isCreatingNewLesson" class="col-12 col-sm-6 col-md-4">
                  <q-card class="lesson-card">
                    <div class="image-container">
                      <q-img
                        v-if="newLesson.imageURL"
                        :src="newLesson.imageURL"
                        :ratio="16/9"
                        class="lesson-image"
                        placeholder-src="https://via.placeholder.com/400x225"
                      />
                      <div v-else class="placeholder-image">
                        <q-icon name="image" size="48px" color="grey-5" />
                      </div>
                      <div class="image-overlay">
                        <q-btn
                          flat
                          icon="add_photo_alternate"
                          color="white"
                          class="upload-btn"
                          @click.stop="handleImageClick(null)"
                        >
                          <q-tooltip>Upload Image</q-tooltip>
                        </q-btn>
                        <input
                          type="file"
                          :ref="el => setImageInputRef(el, null)"
                          accept=".jpg,.jpeg,.png,.gif"
                          style="display: none"
                          @change="handleImageChange($event, null)"
                        />
                      </div>
                    </div>
                    <q-card-section>
                      <q-input
                        ref="lessonNameInput"
                        v-model="newLesson.name"
                        dense
                        autofocus
                        placeholder="Lesson Name"
                        @keydown.enter="saveNewLesson"
                        @blur="saveNewLesson"
                      />
                      <q-select
                        v-model="newLesson.status"
                        :options="topicStore.statusOptions.map(opt => opt.value)"
                        dense
                        class="q-mt-sm"
                      />
                      <div class="row justify-end q-mt-sm">
                        <q-btn
                          flat
                          icon="close"
                          color="grey"
                          size="sm"
                          @click="cancelNewLesson"
                        >
                          <q-tooltip>Cancel</q-tooltip>
                        </q-btn>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
            <div v-else class="lesson-form">
              <div class="row justify-end q-mb-md">
                <q-btn
                  flat
                  :icon="topicStore.isEditingLesson ? 'done' : 'save'"
                  label="Save"
                  color="primary"
                  class="btn btn-flat q-mr-sm"
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
                  class="btn btn-flat"
                  @click="topicStore.cancelLesson()"
                >
                  <q-tooltip>Cancel</q-tooltip>
                </q-btn>
              </div>
              <q-input
                v-model="topicStore.lessonName"
                :label="topicStore.isEditingLesson ? 'Edit Lesson Name' : 'Lesson Name'"
                class="input q-mb-sm"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
              <q-input
                v-model="topicStore.lessonImageURL"
                :label="topicStore.isEditingLesson ? 'Edit Image URL' : 'Image URL'"
                class="input q-mb-sm"
                dense
                outlined
                bg-color="white"
                color="primary"
              />
              <q-select
                v-model="topicStore.lessonStatus"
                :options="topicStore.statusOptions.map(opt => opt.value)"
                :label="topicStore.isEditingLesson ? 'Edit Status' : 'Status'"
                class="input q-mb-md"
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
              class="btn btn-flat q-mr-sm"
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
              class="btn btn-flat"
              @click="cancelEditOrCreate"
            >
              <q-tooltip>Cancel</q-tooltip>
            </q-btn>
          </div>
          <div class="topic-content">
            <q-input
              v-model="topicStore.topicName"
              :label="topicStore.isEditing ? 'Edit Topic Name' : 'Topic Name'"
              class="input q-mb-sm"
              dense
              outlined
              bg-color="white"
              color="primary"
            />
            <q-select
              v-model="topicStore.topicStatus"
              :options="topicStore.statusOptions.map(opt => opt.value)"
              :label="topicStore.isEditing ? 'Edit Status' : 'Status'"
              class="input q-mb-md"
              dense
              outlined
              bg-color="white"
              color="primary"
            />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useTopicStore } from '../../stores/topicStore';

const $q = useQuasar();
const topicStore = useTopicStore();
const editingLesson = ref(null);
const isCreatingNewLesson = ref(false);
const newLesson = ref({
  name: '',
  status: 'draft',
  imageURL: null
});
const imageInputs = ref({});
const lessonNameInput = ref(null);

// Image handling
const setImageInputRef = (el, lesson) => {
  if (lesson) {
    imageInputs.value[lesson.id] = el;
  } else {
    imageInputs.value['new'] = el;
  }
};

const handleImageClick = (lesson) => {
  if (lesson) {
    imageInputs.value[lesson.id]?.click();
  } else {
    imageInputs.value['new']?.click();
  }
};

const handleImageChange = (event, lesson) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (lesson) {
        if (editingLesson.value?.id === lesson.id) {
          editingLesson.value = {
            ...editingLesson.value,
            imageURL: e.target.result
          };
        } else {
          const updatedLesson = {
            ...lesson,
            imageURL: e.target.result
          };
          topicStore.updateLesson(updatedLesson);
        }
      } else {
        newLesson.value = {
          ...newLesson.value,
          imageURL: e.target.result
        };
      }
    };
    reader.readAsDataURL(file);
  }
  event.target.value = '';
};

// Lesson editing
const startEditLesson = (lesson) => {
  editingLesson.value = { ...lesson };
  nextTick(() => {
    lessonNameInput.value?.focus();
  });
};

const saveLessonEdit = () => {
  if (editingLesson.value) {
    if (!editingLesson.value.name) {
      $q.notify({
        message: 'Lesson name cannot be empty',
        color: 'negative',
        icon: 'error'
      });
      return;
    }
    topicStore.updateLesson(editingLesson.value);
    editingLesson.value = null;
  }
};

const cancelLessonEdit = () => {
  editingLesson.value = null;
};

// New lesson creation
const startCreateLesson = () => {
  isCreatingNewLesson.value = true;
  newLesson.value = {
    name: '',
    status: 'draft',
    imageURL: null
  };
  nextTick(() => {
    lessonNameInput.value?.focus();
  });
};

const saveNewLesson = () => {
  if (!newLesson.value.name) {
    $q.notify({
      message: 'Lesson name cannot be empty',
      color: 'negative',
      icon: 'error'
    });
    return;
  }
  topicStore.createLesson(newLesson.value);
  isCreatingNewLesson.value = false;
  newLesson.value = {
    name: '',
    status: 'draft',
    imageURL: null
  };
};

const cancelNewLesson = () => {
  isCreatingNewLesson.value = false;
  newLesson.value = {
    name: '',
    status: 'draft',
    imageURL: null
  };
};

const confirmDeleteLesson = (lessonId) => {
  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this lesson?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    topicStore.deleteLesson(lessonId);
    if (editingLesson.value?.id === lessonId) {
      editingLesson.value = null;
    }
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
/* Card */
.card {
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  font-family: system-ui, -apple-system, sans-serif;
}

/* Topic content */
.topic-content {
  padding: 8px;
  background: #fff;
}

.topic-name {
  font-size: 1.2rem;
  font-weight: 500;
  color: #212121;
  margin-bottom: 8px;
  cursor: pointer;
}

/* Inputs */
.input {
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  color: #212121;
}

.input:hover,
.input:focus {
  border-color: #1976d2;
}

/* Table */
.table {
  margin-top: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e0e0e0;
}

.table :deep(.q-table th) {
  background: #f5f5f5;
  color: #212121;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px;
}

.table :deep(.q-table td) {
  color: #212121;
  font-size: 0.9rem;
  padding: 8px;
}

.table :deep(.q-table tr:hover) {
  background: #f5f5f5;
  cursor: pointer;
}

/* Badge */
.badge {
  font-weight: 500;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Buttons */
.btn {
  border-radius: 4px;
  padding: 8px 16px;
  font-weight: 500;
  text-transform: none;
}

.btn-flat {
  background: transparent;
  border: 1px solid;
}

.btn-flat[color="primary"] {
  border-color: #1976d2;
  color: #1976d2;
}

.btn-flat[color="primary"]:hover {
  background: #1976d2;
  color: #fff;
}

.btn-flat[color="red"] {
  border-color: #f44336;
  color: #f44336;
}

.btn-flat[color="red"]:hover {
  background: #f44336;
  color: #fff;
}

.btn-flat[color="grey"] {
  border-color: #9e9e9e;
  color: #9e9e9e;
}

.btn-flat[color="grey"]:hover {
  background: #9e9e9e;
  color: #fff;
}

/* Lesson form */
.lesson-form {
  margin-top: 8px;
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
}

/* Dark mode */
.dark .card {
  background: #424242;
  border-color: #616161;
}

.dark .topic-content {
  background: #424242;
}

.dark .topic-name {
  color: #f5f5f5;
}

.dark .input {
  background: #616161;
  border-color: #757575;
  color: #f5f5f5;
}

.dark .input:hover,
.dark .input:focus {
  border-color: #64b5f6;
}

.dark .table {
  background: #424242;
  border-color: #616161;
}

.dark .table :deep(.q-table th) {
  background: #616161;
  color: #f5f5f5;
}

.dark .table :deep(.q-table td) {
  color: #f5f5f5;
}

.dark .table :deep(.q-table tr:hover) {
  background: #616161;
}

.dark .lesson-form {
  background: #424242;
  border-color: #616161;
}

.dark .btn-flat[color="primary"] {
  border-color: #64b5f6;
  color: #64b5f6;
}

.dark .btn-flat[color="primary"]:hover {
  background: #64b5f6;
  color: #424242;
}

.dark .btn-flat[color="red"] {
  border-color: #ef5350;
  color: #ef5350;
}

.dark .btn-flat[color="red"]:hover {
  background: #ef5350;
  color: #424242;
}

.dark .btn-flat[color="grey"] {
  border-color: #bdbdbd;
  color: #bdbdbd;
}

.dark .btn-flat[color="grey"]:hover {
  background: #bdbdbd;
  color: #424242;
}

/* Lesson card */
.lesson-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 100%;
}

.lesson-card:hover {
  transform: translateY(-4px);
}

.lesson-image {
  border-radius: 4px 4px 0 0;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.2s;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
}

.delete-btn :deep(.q-btn__content) {
  padding: 0;
}

.delete-btn :deep(.q-icon) {
  font-size: 18px;
}

.lesson-card:hover .delete-btn {
  opacity: 1;
}

/* Dark mode */
.dark .lesson-card {
  background: #424242;
}

.dark .lesson-card .text-h6 {
  color: #f5f5f5;
}

/* Add card */
.add-card {
  cursor: pointer;
  background: #f5f5f5;
}

.add-card:hover {
  background: #e0e0e0;
}

.dark .add-card {
  background: #616161;
}

.dark .add-card:hover {
  background: #757575;
}

/* Input styles */
.q-input, .q-select {
  background: white;
  border-radius: 4px;
}

.dark .q-input, .dark .q-select {
  background: #424242;
  color: white;
}

/* Uploader styles */
.q-uploader {
  border: 1px dashed #e0e0e0;
  border-radius: 4px;
}

.dark .q-uploader {
  border-color: #616161;
}

.q-uploader__header {
  background: #f5f5f5;
}

.dark .q-uploader__header {
  background: #616161;
}

/* Image container */
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #f5f5f5;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-container:hover .image-overlay {
  opacity: 1;
}

.upload-btn {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
}

.dark .image-container {
  background: #616161;
}

.dark .placeholder-image {
  background: #616161;
}
</style>