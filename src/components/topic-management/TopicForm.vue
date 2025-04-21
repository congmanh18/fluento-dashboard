<template>
  <div>
    <!-- Preview mode -->
    <div v-if="!topicStore.isCreatingNew && topicStore.selectedTopic && !topicStore.isEditing" class="preview-mode">
      <q-carousel
        v-model="carouselSlide"
        transition-prev="fade"
        transition-next="fade"
        animated
        control-color="primary"
        class="rounded"
        style="height: 400px;"
      >
        <q-carousel-slide
          :key="topicStore.selectedTopic.id"
          :name="0"
          :img-src="topicStore.selectedTopic.image"
          style="object-fit: cover;"
        />
      </q-carousel>
      <div class="q-mt-md">
        <h3 class="topic-name">{{ topicStore.selectedTopic.name }}</h3>
      </div>
      <div class="row q-mt-md items-center">
        <q-btn
          round
          icon="edit"
          class="q-mr-sm fb-btn"
          color="primary"
          @click="topicStore.startEdit()"
        >
          <q-tooltip>Edit</q-tooltip>
        </q-btn>
        <q-btn
          round
          icon="delete"
          class="fb-btn negative"
          color="red"
          @click="confirmDelete"
        >
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
        <q-btn
          round
          icon="add"
          class="q-ml-auto fb-btn"
          color="primary"
          @click="topicStore.startCreateNew()"
        >
          <q-tooltip>Create New</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- Create or Edit mode -->
    <div v-else class="create-mode">
      <div class="row items-center q-mb-md">
        <q-input
          v-model="topicStore.topicName"
          :label="topicStore.isEditing ? 'Edit Topic Name' : 'Topic Name'"
          class="fb-input col"
          dense
          outlined
          bg-color="white"
          color="primary"
        />
        <q-btn
          round
          :icon="topicStore.isEditing ? 'done' : 'save'"
          class="fb-btn q-ml-sm"
          color="primary"
          :disable="!topicStore.topicName || (!topicStore.previewImage && !topicStore.isEditing)"
          @click="topicStore.isEditing ? topicStore.saveEdit() : topicStore.saveTopic()"
        >
          <q-tooltip>{{ topicStore.isEditing ? 'Save Edit' : 'Save' }}</q-tooltip>
        </q-btn>
      </div>
      <div
        class="upload-area q-pa-md rounded"
        role="button"
        aria-label="Upload image"
        tabindex="0"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="onFileDrop($event)"
        @keyup.enter="$refs.fileInput.click()"
      >
        <div v-if="topicStore.previewImage || (topicStore.isEditing && topicStore.selectedTopic.image)" class="preview">
          <q-img
            :src="topicStore.previewImage || topicStore.selectedTopic.image"
            alt="Image Preview"
            class="rounded"
            style="max-height: 200px; width: 100%; object-fit: cover; display: block;"

          />
        </div>
        <div
          v-else
          class="upload-placeholder text-center"
          @click="$refs.fileInput.click()"
          @dragover.prevent
          @dragenter.prevent
        >
          <q-icon name="cloud_upload" size="xl" class="fb-icon" />
          <p class="q-mb-sm text-grey-8">Drag & drop or click to upload</p>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden-file-input"
            aria-label="Upload topic image"
            @change="onFileChange($event.target.files[0])"
            style="display: none"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useTopicStore } from '../../stores/topicStore';

const $q = useQuasar();
const topicStore = useTopicStore();
const carouselSlide = ref(0);

const onFileChange = (file) => {
  console.log('File selected:', file);
  topicStore.handleFile(file);
};

const onFileDrop = (event) => {
  console.log('File dropped:', event.dataTransfer.files[0]);
  topicStore.handleFile(event.dataTransfer.files[0]);
};

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
</script>

<style scoped>
.fb-input {
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #1f2a44;
  transition: border-color 0.2s ease;
}

.fb-input:hover,
.fb-input:focus {
  border-color: #3b82f6;
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

.upload-area {
  background: #f8fafc;
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}

.upload-area:hover {
  border-color: #3b82f6;
}

.upload-placeholder {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
}

.carousel {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e4e7eb;
}

.q-img {
  transition: transform 0.3s ease;
}

.q-img:hover {
  transform: scale(1.03);
}

.dark .fb-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #e5e7eb;
}

.dark .topic-name {
  color: #e5e7eb;
}
</style>