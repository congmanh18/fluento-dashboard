<!-- src/components/TopicManagement.vue -->
<template>
  <div class="q-pa-md fb-container" :class="{ 'dark': isDark }">
    <div class="row items-center q-mb-lg">
      <h2 class="q-my-none text-h5 text-weight-bold">Topic Management</h2>
      <q-space />
      <TopicSearch />
    </div>

    <div class="row q-gutter-md no-wrap full-height">
      <div class="col-8 q-pa-md fb-panel rounded shadow-1">
        <TopicForm />
      </div>
      <div class="col-4 q-pa-lg topic-list-container fb-panel-light rounded shadow-1">
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
  padding: 24px;
  color: #1f2a44;
}

.full-height {
  min-height: calc(100vh - 48px);
}

.fb-panel {
  background: #ffffff;
  border: 1px solid #e4e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fb-panel:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.fb-panel-light {
  background: #fafafa;
  border: 1px solid #e4e7eb;
  border-radius: 16px;
  height: calc(100vh - 48px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
  isolation: isolate;
}

.fb-panel-light::-webkit-scrollbar {
  width: 10px;
}

.fb-panel-light::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 5px;
}

.fb-panel-light::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .fb-container {
    padding: 16px;
  }
  .full-height {
    flex-direction: column;
  }
  .col-8,
  .col-4 {
    width: 100%;
  }
  .fb-panel {
    margin-bottom: 16px;
  }
  .fb-panel-light {
    height: auto;
    max-height: 400px;
  }
}
</style>
