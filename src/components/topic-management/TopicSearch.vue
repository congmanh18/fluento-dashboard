<template>
  <div class="col-5 search-container">
    <q-card class="modern-search-card" bordered>
      <q-input
        v-model="topicStore.searchQuery"
        @update:model-value="topicStore.updateSearchQuery"
        placeholder="Search topics..."
        dense
        outlined
        bg-color="white"
        color="primary"
        class="modern-input"
        clearable
      >
        <template v-slot:prepend>
          <q-icon name="search" class="search-icon">
            <q-tooltip>Search topics</q-tooltip>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon
            v-if="topicStore.searchQuery"
            name="clear"
            class="clear-icon"
            @click="topicStore.searchQuery = ''"
          />
        </template>
      </q-input>
    </q-card>
  </div>
</template>

<script setup>
import { useTopicStore } from '../../stores/topicStore';

const topicStore = useTopicStore();
</script>

<style scoped>
/* Search container */
.search-container {
  padding: 8px;
}

/* Card styling */
.modern-search-card {
  border-radius: 8px;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  font-family: system-ui, -apple-system, sans-serif;
}

.modern-search-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
}

/* Input styling */
.modern-input {
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: #1f2a44;
  transition: all 0.3s ease;
}

.modern-input:hover {
  border-color: #3b82f6;
}

.modern-input:focus-within {
  border-color: transparent;
  background: linear-gradient(90deg, #ffffff, #f0f0f0);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  transform: scale(1.02);
}

/* Placeholder animation */
.modern-input :deep(.q-field__label) {
  transform-origin: left;
  transition: transform 0.2s ease, color 0.2s ease;
  color: #6b7280;
}

.modern-input:focus-within :deep(.q-field__label) {
  transform: translateY(-4px) scale(0.9);
  color: #3b82f6;
}

/* Icons */
.search-icon {
  color: #6b7280;
  transition: transform 0.3s ease, color 0.3s ease;
}

.search-icon:hover,
.modern-input:focus-within .search-icon {
  color: #3b82f6;
  transform: rotate(15deg) scale(1.2);
}

.clear-icon {
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.clear-icon:hover {
  color: #ef4444;
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 768px) {
  .search-container {
    padding: 4px;
  }

  .col-5 {
    width: 100%;
  }

  .modern-input {
    font-size: 0.9rem;
  }
}

/* Dark mode */
.dark .modern-search-card {
  background: linear-gradient(145deg, #1f2937, #374151);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.dark .modern-search-card:hover {
  box-shadow: 0 4px 16px rgba(96, 165, 250, 0.3);
}

.dark .modern-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #e5e7eb;
}

.dark .modern-input:hover {
  border-color: #60a5fa;
}

.dark .modern-input:focus-within {
  border-color: transparent;
  background: linear-gradient(90deg, #4b5563, #374151);
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
}

.dark .modern-input :deep(.q-field__label) {
  color: #9ca3af;
}

.dark .modern-input:focus-within :deep(.q-field__label) {
  color: #60a5fa;
}

.dark .search-icon {
  color: #9ca3af;
}

.dark .search-icon:hover,
.dark .modern-input:focus-within .search-icon {
  color: #60a5fa;
}

.dark .clear-icon {
  color: #d1d5db;
}

.dark .clear-icon:hover {
  color: #f87171;
}
</style>