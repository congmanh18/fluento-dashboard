import axios from 'axios'
import { Notify } from 'quasar'

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const api = axios.create({
  baseURL: 'https://api.lucas-dev.click',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  }
})

const uploadApi = axios.create({
  baseURL: 'https://api.lucas-dev.click',
  headers: {
    'Content-Type': 'multipart/form-data',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
  }
})

// Add a request interceptor for retry logic
api.interceptors.request.use(
  config => {
    config.retryCount = config.retryCount || 0;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    // Check if response is JSON
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      Notify.create({
        type: 'negative',
        message: 'Server returned non-JSON response'
      });
      return Promise.reject('Invalid response format');
    }

    // Check if response has the expected structure
    if (!response.data || typeof response.data !== 'object') {
      Notify.create({
        type: 'negative',
        message: 'Invalid response format from server'
      });
      return Promise.reject('Invalid response format');
    }

    if (response.data.code !== 200) {
      Notify.create({
        type: 'negative',
        message: response.data.message || 'An error occurred'
      });
      return Promise.reject(response.data.message);
    }
    return response.data;
  },
  async error => {
    const config = error.config;

    // Log the error details
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // If we have retries left and it's a server error (5xx) or network error
    if (config.retryCount < MAX_RETRIES &&
        (error.response?.status >= 500 || !error.response)) {
      config.retryCount += 1;

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * config.retryCount));

      // Retry the request
      return api(config);
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred';

      if (status === 401) {
        message = 'Authentication failed. Please log in again.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }

      Notify.create({
        type: 'negative',
        message: message
      });
    } else if (error.request) {
      Notify.create({
        type: 'negative',
        message: 'No response received from server. Please check your connection.'
      });
    } else {
      Notify.create({
        type: 'negative',
        message: 'Request failed: ' + error.message
      });
    }

    return Promise.reject(error);
  }
);

// Add a request interceptor for retry logic
uploadApi.interceptors.request.use(
  config => {
    config.retryCount = config.retryCount || 0;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for upload API
uploadApi.interceptors.response.use(
  response => {
    // For image uploads, we don't need to check content-type
    if (!response.data || typeof response.data !== 'object') {
      Notify.create({
        type: 'negative',
        message: 'Invalid response format from server'
      });
      return Promise.reject('Invalid response format');
    }

    if (response.data.code !== 200) {
      Notify.create({
        type: 'negative',
        message: response.data.message || 'An error occurred'
      });
      return Promise.reject(response.data.message);
    }
    return response.data;
  },
  async error => {
    const config = error.config;

    // Log the error details
    console.error('Upload API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    // If we have retries left and it's a server error (5xx) or network error
    if (config.retryCount < MAX_RETRIES &&
        (error.response?.status >= 500 || !error.response)) {
      config.retryCount += 1;

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * config.retryCount));

      // Retry the request
      return uploadApi(config);
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      let message = 'An error occurred';

      if (status === 401) {
        message = 'Authentication failed. Please log in again.';
      } else if (status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (status === 404) {
        message = 'The requested resource was not found.';
      } else if (status >= 500) {
        message = 'Server error. Please try again later.';
      }

      Notify.create({
        type: 'negative',
        message: message
      });
    } else if (error.request) {
      Notify.create({
        type: 'negative',
        message: 'No response received from server. Please check your connection.'
      });
    } else {
      Notify.create({
        type: 'negative',
        message: 'Request failed: ' + error.message
      });
    }

    return Promise.reject(error);
  }
);

export const imageApi = {
  getImages: (params) => uploadApi.get('/base/images', { params }),
  createImage: (data, onProgress) => uploadApi.post('/base/image', data, {
    onUploadProgress: onProgress,
    headers: {
      'Accept': 'application/json'
    }
  })
}

export const contentApi = {
  // Base
  getCharacters: (params) => api.get('/base/characters', { params }),
  getLanguageLevels: (params) => api.get('/base/language-levels', { params }),
  getImages: (params) => api.get('/base/images', { params }),
  // createImage: (data, onProgress) => api.post('/base/image', data, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     'Accept': 'application/json'
  //   },
  //   onUploadProgress: onProgress
  // }),

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
  getDialogues: (lessonId, params) => api.get(`/content/lessons/${lessonId}/tasks/dialog`, { params }),
  createDialogue: (data) => api.post('/content/tasks/dialogues', data),
  updateDialogue: (id, data) => api.patch(`/content/tasks/dialogues/${id}`, data),
  deleteDialogue: (id) => api.delete(`/content/tasks/dialogues/${id}`),
  reorderDialogues: (data) => api.patch('/content/tasks/dialogues/reorder', data),

  // Stories
  getStories: (lessonId, params) => api.get(`/content/lessons/${lessonId}/tasks/story`, { params }),
  createStory: (data) => api.post('/content/tasks/stories', data),
  updateStory: (id, data) => api.patch(`/content/tasks/stories/${id}`, data),
  deleteStory: (id) => api.delete(`/content/tasks/stories/${id}`),
  reorderStories: (data) => api.patch('/content/tasks/stories/reorder', data),

  // Karaoke
  getKaraokes: (params) => api.get('/content/tasks/karaokes', { params }),
  createKaraoke: (data) => api.post('/content/tasks/karaokes', data),
  updateKaraoke: (id, data) => api.patch(`/content/tasks/karaokes/${id}`, data),
  deleteKaraoke: (id) => api.delete(`/content/tasks/karaokes/${id}`),
  reorderKaraokes: (data) => api.patch('/content/tasks/karaokes/reorder', data),

  // Dictionaries
  getDictionaries: (params) => api.get('/content/dictionaries', { params }),
  createDictionary: (data) => api.post('/content/dictionaries', data),
  updateDictionary: (id, data) => api.patch(`/content/dictionaries/${id}`, data),
  deleteDictionary: (id) => api.delete(`/content/dictionaries/${id}`),
  reorderDictionaries: (data) => api.patch('/content/dictionaries/reorder', data)
}

export default ({ app }) => {
  app.config.globalProperties.$api = contentApi
}
