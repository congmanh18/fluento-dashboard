<template>
  <TopicSearch />
  <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
    <q-card class="card" bordered>
      <q-tabs
        v-model="activeTab"
        dense
        class="tabs sticky-tabs"
        active-color="white"
        indicator-color="transparent"
        align="justify"
      >
        <q-tab
          v-for="option in topicStore.statusOptions.filter(opt => opt.value)"
          :key="option.value"
          :name="option.value"
          :class="activeTab === option.value ? 'active-tab' : ''"
          :icon="getTabIcon(option.value)"
          :label="option.label"
        >
          <q-badge color="red" floating v-if="getTopicCount(option.value) > 0">
            {{ getTopicCount(option.value) }}
          </q-badge>
        </q-tab>
      </q-tabs>

      <q-separator class="separator" />

      <q-tab-panels v-model="activeTab">
        <q-tab-panel
          v-for="option in topicStore.statusOptions.filter(opt => opt.value)"
          :key="option.value"
          :name="option.value"
          class="tab-panel"
        >
          <q-list class="scrollable-list" separator>
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
                  class="item"
                  :class="{ 'selected': topicStore.selectedTopic?.id === element.id }"
                  @click="topicStore.selectTopic(element)"
                >
                  <q-item-section>
                    <div class="topic-title-container">
                      <template v-if="editingTopic?.id === element.id">
                        <q-input
                          ref="editInput"
                          v-model="editingTopic.name"
                          dense
                          class="editing"
                          @keydown="handleKeyDown($event, element)"
                        />
                      </template>
                      <template v-else>
                        <q-item-label
                          class="topic-title"
                          @dblclick="handleDoubleClick(element)"
                        >
                          {{ element.name }}
                        </q-item-label>
                      </template>
                    </div>
                  </q-item-section>
                  <q-item-section side>
                    <div class="action-buttons">
                      <q-btn
                        v-if="element.status === 'draft' || element.status === 'pending'"
                        flat
                        round
                        dense
                        color="primary"
                        icon="send"
                        @click.stop="handleSubmit(element)"
                        class="action-btn"
                      >
                        <q-tooltip>{{ element.status === 'draft' ? 'Submit for Review' : 'Approve' }}</q-tooltip>
                      </q-btn>
                      <q-btn
                        flat
                        round
                        dense
                        color="negative"
                        icon="delete"
                        @click.stop="handleDelete(element)"
                        class="action-btn"
                      >
                        <q-tooltip>Delete</q-tooltip>
                      </q-btn>
                    </div>
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
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import Draggable from 'vuedraggable';
import { useTopicStore } from '../../stores/topicStore';
import { useQuasar } from 'quasar';
import TopicSearch from './TopicSearch.vue';
const topicStore = useTopicStore();
const $q = useQuasar();
const activeTab = ref('draft'); // Tab mặc định là "Draft"
const editingTopic = ref(null);
const editInput = ref(null);

// Hàm lấy biểu tượng cho tab
const getTabIcon = (status) => {
  switch (status) {
    case 'draft':
      return 'edit';
    case 'pending':
      return 'hourglass_empty';
    case 'approved':
      return 'check_circle';
  }
};

// Hàm lấy số lượng chủ đề theo trạng thái
const getTopicCount = (status) => {
  return filteredTopics(status).length;
};

// Hàm lọc chủ đề theo trạng thái và searchQuery
const filteredTopics = (status) => {
  let topics = topicStore.topics.filter((topic) => topic.status === status);

  if (topicStore.searchQuery) {
    const query = topicStore.searchQuery.toLowerCase();
    topics = topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query)
    );
  }

  return topics;
};

// Cập nhật thứ tự chủ đề sau khi kéo thả
const updateTopics = (newOrder, status) => {
  // Lấy các topic không thuộc status hiện tại
  const otherTopics = topicStore.topics.filter((topic) => topic.status !== status);

  // Cập nhật order cho các topic trong newOrder
  const updatedTopics = newOrder.map((topic, index) => ({
    ...topic,
    order: index
  }));

  // Kết hợp và sắp xếp lại toàn bộ topics
  const allTopics = [...otherTopics, ...updatedTopics];
  topicStore.reorderTopics(allTopics);
};

// Hiệu ứng kéo thả cơ bản
const dragStart = () => {
  document.querySelectorAll('.item').forEach((item) => {
    item.style.transition = 'transform 0.2s ease';
    item.style.transform = 'scale(1.02)';
  });
};

const dragEnd = () => {
  document.querySelectorAll('.item').forEach((item) => {
    item.style.transform = 'scale(1)';
  });
};

// Hàm xử lý double click để edit
const handleDoubleClick = (topic) => {
  editingTopic.value = topic;
  // Focus vào input sau khi DOM được cập nhật
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
    }
  });
};

// Hàm lưu khi nhấn Enter
const handleKeyDown = (event, topic) => {
  if (event.key === 'Enter') {
    saveEdit(topic);
  }
};

// Hàm lưu khi click ra ngoài
const handleClickOutside = (event) => {
  if (editingTopic.value && !event.target.closest('.editing')) {
    saveEdit(editingTopic.value);
  }
};

// Hàm lưu thay đổi
const saveEdit = (topic) => {
  if (editingTopic.value) {
    topic.name = editingTopic.value.name;
    topicStore.updateTopicName(topic.id, editingTopic.value.name);
    editingTopic.value = null;
  }
};

// Hàm xử lý xóa topic
const handleDelete = (topic) => {
  // Select topic trước khi xóa
  topicStore.selectTopic(topic);

  $q.dialog({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this topic?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      flat: true
    },
    cancel: {
      label: 'Cancel',
      color: 'grey',
      flat: true
    }
  }).onOk(() => {
    topicStore.deleteTopic(topic.id);
  });
};

// Hàm xử lý submit topic
const handleSubmit = (topic) => {
  topicStore.selectTopic(topic);

  if (topic.status === 'draft') {
    // Draft -> Pending
    topicStore.updateTopicStatus(topic.id, 'pending');
    // Chuyển sang tab pending
    activeTab.value = 'pending';
  } else if (topic.status === 'pending') {
    // Pending -> Approved
    topicStore.updateTopicStatus(topic.id, 'approved');
    // Chuyển sang tab approved
    activeTab.value = 'approved';
  }
};

// Thêm event listener cho click outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Card */
.card {
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  font-family: system-ui, -apple-system, sans-serif;
  height: 100%;
}

/* Tabs */
.tabs {
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f5f5f5;
}

.q-tab {
  border-radius: 4px;
  margin: 2px;
  text-transform: none;
  font-weight: 500;
  color: #424242;
}

.active-tab {
  background: #1976d2;
  color: white !important;
}

.q-tab .q-icon {
  color: #424242;
}

.active-tab .q-icon {
  color: white;
}

/* Separator */
.separator {
  background: #e0e0e0;
  height: 1px;
}

/* Tab panels */
.tab-panel {
  padding: 8px;
}

/* Scrollable list */
.scrollable-list {
  max-height: calc(100vh - 180px - 40px); /* Trừ header, tabs, separator */
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  scrollbar-color: #bdbdbd #f5f5f5;
}

.scrollable-list::-webkit-scrollbar {
  width: 6px;
}

.scrollable-list::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.scrollable-list::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 3px;
}

/* Topic items */
.item {
  border-radius: 4px;
  margin: 6px 0;
  padding: 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item:active {
  cursor: grabbing;
}

.item.selected {
  border-left: 3px solid #1976d2;
  background: #f5f5f5;
}

.topic-title-container {
  position: relative;
}

.topic-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212121;
  cursor: text;
  line-height: 1.4;
}

/* Action buttons */
.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  opacity: 0.7;
  transition: opacity 0.2s;
}

.item:hover .action-btn {
  opacity: 1;
}
</style>