<!-- src/components/TopicManagement.vue -->
<template>
  <div class="q-pa-md fb-container" :class="{ 'dark': isDark }">
    <!-- <div class="row items-center q-mb-lg">
      <q-space />
    </div> -->
    <div class="row q-gutter-md no-wrap full-height">
      <div class="col-7 q-pa-md fb-panel rounded shadow-1">
        <TopicForm />
      </div>
      <div class="col-5 q-pa-lg topic-list-container fb-panel-light rounded shadow-1">
        <TopicSearch />
        <TopicList />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import TopicSearch from '../../components/topic-management/TopicSearch.vue';
import TopicList from '../../components/topic-management/TopicList.vue';
import TopicForm from '../../components/topic-management/TopicForm.vue';

const $q = useQuasar();
const isDark = ref($q.dark.isActive);
</script>

<style scoped>
.fb-container {
  background: #f5f7fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  padding: 16px;
  color: #1f2a44;
}

.full-height {
  min-height: calc(100vh - 120px); /* Đảm bảo chiều cao đầy đủ */
}

.topic-title {
  font-size: 1.2rem; /* Đồng bộ với topic-name */
  font-weight: 600;
  color: #1f2a44;
}

.topic-list-container {
  max-height: calc(100vh - 120px); /* Giới hạn chiều cao */
  overflow-y: auto; /* Cuộn dọc */
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.topic-list-container::-webkit-scrollbar {
  width: 10px;
}

.topic-list-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 5px;
}

.topic-list-container::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 5px;
}

/* Dark mode */
.dark .fb-container {
  background: #1f2a44;
  color: #e5e7eb;
}

.dark .topic-title {
  color: #e5e7eb;
}

.dark .topic-list-container {
  scrollbar-color: #6b7280 #374151;
}

.dark .topic-list-container::-webkit-scrollbar-track {
  background: #374151;
}

.dark .topic-list-container::-webkit-scrollbar-thumb {
  background: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .fb-container {
    padding: 12px;
  }
  .full-height {
    flex-direction: column;
  }
  .col-7,
  .col-5 {
    width: 100%;
  }
  .topic-list-container {
    max-height: 400px;
  }
}
</style>
