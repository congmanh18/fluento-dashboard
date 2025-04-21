```html
<template>
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="no-shadow" bordered>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab
          v-for="option in topicStore.statusOptions"
          :key="option.value"
          :name="option.value || 'all'"
          :class="activeTab === (option.value || 'all') ? 'text-blue' : ''"
          :icon="getTabIcon(option.value)"
          :label="option.label"
        >
          <q-badge color="red" floating v-if="getTopicCount(option.value) > 0">
            {{ getTopicCount(option.value) }}
          </q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel
          v-for="option in topicStore.statusOptions"
          :key="option.value || 'all'"
          :name="option.value || 'all'"
          class="q-pa-sm"
        >
          <q-list class="rounded-borders scrollable-list" separator>
            <Draggable
              :modelValue="filteredTopics(option.value)"
              item-key="id"
              animation="200"
              @update:modelValue="updateTopics($event, option.value)"
              @start="dragStart"
              @end="dragEnd"
            >
              <template #item="{ element }">
                <q-item
                  clickable
                  v-ripple
                  :class="{ 'selected': topicStore.selectedTopic?.id === element.id }"
                  @click="topicStore.selectTopic(element)"
                >
                  <q-item-section>
                    <q-item-label class="text-weight-medium" style="font-size: 1.2rem;">
                      {{ element.name }}
                    </q-item-label>
                    <q-item-label caption class="description">
                      {{ element.description || 'No description available' }}
                    </q-item-label>
                    <q-badge
                      :color="topicStore.getStatusColor(element.status)"
                      text-color="white"
                      class="q-mt-xs"
                      style="font-size: 0.9rem;"
                    >
                      {{ element.status }}
                    </q-badge>
                  </q-item-section>
                </q-item>
              </template>
            </Draggable>
            <q-item v-if="filteredTopics(option.value).length === 0">
              <q-item-section>
                <q-item-label caption>No topics available</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Draggable from 'vuedraggable';
import { useTopicStore } from '../../stores/topicStore';

const topicStore = useTopicStore();
const activeTab = ref('all'); // Tab mặc định là "All"

// Hàm lấy biểu tượng cho tab
const getTabIcon = (status) => {
  switch (status) {
    case 'public':
      return 'public';
    case 'pending':
      return 'hourglass_empty';
    case 'draft':
      return 'edit';
    case 'rejected':
      return 'cancel';
    case 'approved':
      return 'check_circle';
    default:
      return 'list'; // Biểu tượng cho tab "All"
  }
};

// Hàm lấy số lượng chủ đề theo trạng thái
const getTopicCount = (status) => {
  return filteredTopics(status).length;
};

// Hàm lọc chủ đề theo trạng thái và searchQuery
const filteredTopics = (status) => {
  let topics = status
    ? topicStore.topics.filter((topic) => topic.status === status)
    : topicStore.topics; // Tab "All"

  if (topicStore.searchQuery) {
    const query = topicStore.searchQuery.toLowerCase();
    topics = topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        (topic.description && topic.description.toLowerCase().includes(query))
    );
  }

  return topics;
};

// Cập nhật thứ tự chủ đề sau khi kéo thả
const updateTopics = (newOrder, status) => {
  if (!status) {
    // Tab "All": Cập nhật toàn bộ topics
    topicStore.reorderTopics(newOrder);
  } else {
    // Tab trạng thái cụ thể: Chỉ cập nhật thứ tự trong trạng thái đó
    const otherTopics = topicStore.topics.filter((topic) => topic.status !== status);
    const updatedTopics = [...otherTopics, ...newOrder].sort((a, b) => a.order - b.order);
    topicStore.reorderTopics(updatedTopics);
  }
};

// Hiệu ứng kéo thả
const dragStart = () => {
  document.querySelectorAll('.q-item').forEach((item) => {
    item.style.transition = 'transform 0.2s ease';
    item.style.transform = 'scale(1.05)';
  });
};

const dragEnd = () => {
  document.querySelectorAll('.q-item').forEach((item) => {
    item.style.transform = 'scale(1)';
  });
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
}

.q-tab-panel {
  padding: 8px;
}

.scrollable-list {
  max-height: 800px;
  overflow-y: auto; /* Thêm cuộn dọc */
  padding-right: 8px; /* Khoảng cách để tránh thanh cuộn che nội dung */
}

.q-item {
  border-radius: 4px;
  transition: background 0.2s ease;
}

.q-item:hover {
  background: #f0f0f0;
}

.q-item.selected {
  background: #eaeaea;
  border-left: 4px solid #3b82f6;
}

.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #666;
}

.q-badge {
  font-weight: 500;
}

.dark .q-card {
  background: #374151;
  border-color: #4b5563;
}

.dark .q-item:hover {
  background: #4b5563;
}

.dark .q-item.selected {
  background: #4b5563;
  border-left: 4px solid #60a5fa;
}

.dark .description {
  color: #9ca3af;
}
</style>
```