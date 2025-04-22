<template>
  <div class="container">
    <div class="row content-row no-wrap">
      <div class="col-5 panel">
        <q-card class="card">
          <TopicList />
        </q-card>
      </div>
      <div class="col-7 panel topic-list-container">
        <q-card class="card">
          <TopicForm />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import TopicList from '../../components/topic-management/TopicList.vue';
import TopicForm from '../../components/topic-management/TopicForm.vue';

const $q = useQuasar();
const isDark = computed(() => $q.dark.isActive); // Giữ để tương thích, nhưng không dùng
</script>

<style scoped>
/* Container */
.container {
  padding: 16px;
  background: #fff;
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
}

/* Header row */
.header-row {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}

.search-wrapper {
  max-width: 250px;
}

/* Content row */
.content-row {
  min-height: calc(100vh - 120px);
  height: calc(100vh - 120px);
  display: flex;
}

/* Panels */
.panel {
  padding: 8px;
  height: 100%;
  display: flex;
}

.topic-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.topic-list-container .card {
  flex: 1;
}

/* Card */
.card {
  border-radius: 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.card :deep(.q-card__section) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Title */
.topic-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #212121;
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    padding: 12px;
  }

  .col-7 {
    width: 60%;
  }

  .col-5 {
    width: 40%;
  }

  .search-wrapper {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 8px;
  }

  .header-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-wrapper {
    max-width: 100%;
    width: 100%;
    margin-top: 4px;
  }

  .content-row {
    flex-direction: column;
  }

  .col-7,
  .col-5 {
    width: 100%;
  }

  .panel {
    margin-bottom: 8px;
  }
}
</style>