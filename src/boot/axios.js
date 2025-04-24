import axios from 'axios'
import { Notify } from 'quasar'

const api = axios.create({
  baseURL: 'https://api.lucas-dev.click',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a response interceptor
api.interceptors.response.use(
  response => {
    if (response.data.code !== 200) {
      Notify.create({
        type: 'negative',
        message: response.data.message || 'An error occurred'
      })
      return Promise.reject(response.data.message)
    }
    return response.data
  },
  error => {
    Notify.create({
      type: 'negative',
      message: error.message || 'An error occurred'
    })
    return Promise.reject(error)
  }
)

export const contentApi = {
  // Topics
  getTopics: (params) => api.get('/content/topics', { params }),
  createTopic: (data) => api.post('/content/topics', data),
  updateTopic: (id, data) => api.patch(`/content/topics/${id}`, data),
  deleteTopic: (id) => api.delete(`/content/topics/${id}`),
  reorderTopics: (data) => api.patch('/content/topics/reorder', data),

  // Lessons
  getLessons: (topicId, params) => api.get(`/content/topics/${topicId}/lessons`, { params }),
  createLesson: (topicId, data) => api.post(`/content/topics/${topicId}/lessons`, data),
  updateLesson: (topicId, lessonId, data) => api.patch(`/content/topics/${topicId}/lessons/${lessonId}`, data),
  deleteLesson: (topicId, lessonId) => api.delete(`/content/topics/${topicId}/lessons/${lessonId}`),
  reorderLessons: (topicId, data) => api.patch(`/content/topics/${topicId}/lessons/reorder`, data),

  // Dialogs
  getDialogues: (params) => api.get('/content/dialogues', { params }),
  createDialogue: (data) => api.post('/content/dialogues', data),
  updateDialogue: (id, data) => api.patch(`/content/dialogues/${id}`, data),
  deleteDialogue: (id) => api.delete(`/content/dialogues/${id}`),
  reorderDialogues: (data) => api.patch('/content/dialogues/reorder', data)
}

export default ({ app }) => {
  app.config.globalProperties.$api = contentApi
}
