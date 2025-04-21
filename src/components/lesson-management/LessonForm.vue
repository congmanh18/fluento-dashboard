<template>
  <div>
    <!-- Preview mode -->
    <div v-if="!topicStore.isCreatingNew && topicStore.selectedTopic && !topicStore.isEditing" class="preview-mode">
      <div class="q-mt-md">
        <h3 class="topic-name">{{ topicStore.selectedTopic.name }}</h3>
        <div class="text-body2 q-mt-sm" style="color: #666;">
          {{ topicStore.selectedTopic.desc || 'No description available' }}
        </div>
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
        <div class="col">
          <q-input
            v-model="topicStore.topicName"
            :label="topicStore.isEditing ? 'Edit Topic Name' : 'Topic Name'"
            class="fb-input"
            dense
            outlined
            bg-color="white"
            color="primary"
          />
          <q-input
            v-model="topicStore.topicDesc"
            :label="topicStore.isEditing ? 'Edit Description' : 'Description'"
            class="fb-input q-mt-sm"
            dense
            outlined
            bg-color="white"
            color="primary"
            type="textarea"
          />
        </div>
        <q-btn
          round
          :icon="topicStore.isEditing ? 'done' : 'save'"
          class="fb-btn q-ml-sm"
          color="primary"
          :disable="!topicStore.topicName"
          @click="topicStore.isEditing ? topicStore.saveEdit() : topicStore.saveTopic()"
        >
          <q-tooltip>{{ topicStore.isEditing ? 'Save Edit' : 'Save' }}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { useTopicStore } from '../../stores/topicStore';

const $q = useQuasar();
const topicStore = useTopicStore();

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

.topic-name {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2a44;
  letter-spacing: 0.5px;
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