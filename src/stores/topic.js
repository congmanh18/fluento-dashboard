// src/stores/topic.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTopics } from 'src/apis/topic'

export const useTopicStore = defineStore('topic', () => {
  const topics = ref([])
  const pagination = ref({ page: 1, limit: 10, total: 0 })
  const loading = ref(false)

  async function fetchTopics(params) {
    loading.value = true
    try {
      const { data } = await getTopics(params)
      topics.value = data.items
      pagination.value.total = data.total
    } finally {
      loading.value = false
    }
  }

  return {
    topics,
    pagination,
    loading,
    fetchTopics,
  }
})
