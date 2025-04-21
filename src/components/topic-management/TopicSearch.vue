<template>
  <div class="col-5">
    <q-input
      v-model="topicStore.searchQuery"
      @update:model-value="topicStore.updateSearchQuery"
      placeholder="Search topics..."
      dense
      outlined
      bg-color="white"
      color="primary"
      class="fb-input"
      clearable
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { useTopicStore } from '../../stores/topicStore';

const topicStore = useTopicStore();
</script>

<style scoped>
.fb-input {
  border-radius: 4px; /* Đồng bộ với TopicForm */
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #1f2a44;
  transition: border-color 0.2s ease;
}

.fb-input:hover,
.fb-input:focus {
  border-color: #3b82f6;
}

.dark .fb-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #e5e7eb;
}

@media (max-width: 768px) {
  .fb-input {
    width: 100%;
  }
}
</style>