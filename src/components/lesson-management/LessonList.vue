<template>
  <div>
    <q-btn-dropdown
      flat
      color="primary"
      label="Filter by Status"
      class="fb-btn-filter"
      :icon="topicStore.statusFilter ? 'filter_alt' : 'filter_alt_off'"
    >
      <q-list dense>
        <q-item
          v-for="option in topicStore.statusOptions"
          :key="option.value"
          clickable
          v-close-popup
          @click="topicStore.statusFilter = option.value"
        >
          <q-item-section>
            <q-item-label>{{ option.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <Draggable
      v-model="localTopics"
      item-key="id"
      animation="200"
      class="topic-list"
      @start="dragStart"
      @end="dragEnd"
    >
      <template #item="{ element }">
        <div
          v-if="topicStore.isTopicVisible(element)"
          class="topic-card rounded shadow-1"
          :class="{ 'selected': topicStore.selectedTopic?.id === element.id }"
          @click="topicStore.selectTopic(element)"
        >
          <div class="row no-wrap items-center">
            <q-img
              v-if="element.image"
              :src="element.image"
              alt="Topic Image"
              class="rounded-left"
              style="width: 80px; height: 80px; object-fit: cover;"
              transition="fade"

            />
            <div
              v-else
              class="placeholder-image rounded-left flex items-center justify-center"
              style="width: 80px; height: 80px; background: #E4E6EB;"
            >
              <q-icon name="image" size="md" class="fb-icon" />
            </div>
            <div class="q-pa-md flex-grow">
              <div class="text-ellipsis text-weight-medium" style="font-size: 1.2rem;">
                {{ element.name }}
              </div>
              <q-badge
                :color="topicStore.getStatusColor(element.status)"
                text-color="white"
                class="q-mt-xs"
                style="font-size: 0.9rem;"
              >
                {{ element.status }}
              </q-badge>
            </div>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Draggable from 'vuedraggable';
import { useTopicStore } from '../../stores/topicStore';

const topicStore = useTopicStore();
const localTopics = ref(topicStore.topics);

// Sync topics
watch(localTopics, (newValue) => {
  topicStore.reorderTopics(newValue);
});
watch(() => topicStore.topics, (newValue) => {
  localTopics.value = newValue;
});

// Drag and drop
const dragStart = () => {
  document.querySelectorAll('.topic-card').forEach((card) => {
    card.style.transition = 'transform 0.2s ease';
    card.style.transform = 'scale(1.05)';
  });
};

const dragEnd = () => {
  document.querySelectorAll('.topic-card').forEach((card) => {
    card.style.transform = 'scale(1)';
  });
};
</script>

<style scoped>
.fb-btn-filter {
  border: 1px solid #ccc;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  width: 100%;
  text-transform: none;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.topic-card {
  background: transparent;
  margin-bottom: 12px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 8px;
  transition: background 0.2s ease;
}

.topic-card:hover {
  background: #f0f0f0;
}

.topic-card.selected {
  background: #eaeaea;
  border-left: 4px solid #999;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder-image {
  background: #f0f0f0;
}

.dark .fb-btn-filter,
.dark .topic-card,
.dark .topic-card.selected,
.dark .text-ellipsis {
  all: unset;
}
</style>
