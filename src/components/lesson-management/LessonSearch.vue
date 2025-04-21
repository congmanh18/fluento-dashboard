<template>
  <q-input
    v-model="topicStore.searchQuery"
    @update:model-value="topicStore.updateSearchQuery"
    placeholder="Search topics..."
    dense
    outlined
    bg-color="white"
    color="primary"
    class="fb-input"
    style="width: 400px;"
    clearable
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script setup>
import { useTopicStore } from '../../stores/topicStore';

const topicStore = useTopicStore();
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

@media (max-width: 768px) {
  .fb-input {
    width: 100% !important;
  }
}
</style>