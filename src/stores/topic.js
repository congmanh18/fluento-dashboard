import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';
import { useLanguageStore } from './language';
import { contentApi } from 'src/boot/axios';

export const useTopicStore = defineStore('topics', {
  state: () => ({
    topics: [],
    pagination: {
      limit: 20,
      page: 1,
      sort: 'desc',
      total_rows: 0,
      total_pages: 0
    },
    lessons: {},
    lessonPagination: {},
    selectedTopic: null,
    topicName: '',
    topicStatus: null,
    isCreatingNew: false,
    isEditing: false,
    searchQuery: '',
    debouncedSearchQuery: '',
    statusFilter: null,
    statusOptions: [
      { label: 'All', value: null },
      { label: 'Draft', value: 'draft' },
      { label: 'Rejected', value: 'rejected' },
      { label: 'Approved', value: 'approved' },
    ],
    pendingReorder: false
  }),

  actions: {
    // Lấy danh sách topic
    async fetchTopics(params = {}) {
      try {
        const languageStore = useLanguageStore();
        const { limit = 100, page = 1, sort = 'asc', search = '', lang = languageStore.sourceLanguage } = params;
        const response = await contentApi.getTopics({
          limit,
          page,
          sort,
          search,
          lang
        });

        if (!response.detail) {
          throw new Error('Invalid response format from server');
        }

        this.topics = response.detail.rows;
        this.pagination = {
          limit: response.detail.limit,
          page: response.detail.page,
          sort: response.detail.sort,
          total_rows: response.detail.total_rows,
          total_pages: response.detail.total_pages
        };
        return response;
      } catch (error) {
        console.error('Error fetching topics:', error);
        const errorMessage = error.response?.data?.message ||
                           error.response?.data?.error ||
                           error.message ||
                           'Failed to fetch topics';
        Notify.create({
          type: 'negative',
          message: errorMessage,
          caption: `Status: ${error.response?.status || 'Unknown'}`
        });
        throw error;
      }
    },

    // Tạo topic mới
    async createTopic(topic) {
      try {
        const languageStore = useLanguageStore();
        const response = await contentApi.createTopic({
          ...topic,
          lang: languageStore.sourceLanguage
        });

        // Cập nhật danh sách topic
        await this.fetchTopics({
          limit: this.pagination.limit,
          page: this.pagination.page,
          sort: this.pagination.sort
        });
        return response.detail.topic_id;
      } catch (error) {
        throw error;
      }
    },

    // Cập nhật topic
    async updateTopic(topic) {
      try {
        const languageStore = useLanguageStore();
        const response = await contentApi.updateTopic(topic.id, {
          ...topic,
          lang: languageStore.sourceLanguage
        });

        if (response.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Topic updated successfully'
          });
          // Cập nhật danh sách topic
          await this.fetchTopics({
            limit: this.pagination.limit,
            page: this.pagination.page,
            sort: this.pagination.sort
          });
        }
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Xóa topic
    async deleteTopic(id) {
      try {
        const response = await contentApi.deleteTopic(id);
        if (response.code === 200) {
          // Xóa topic khỏi danh sách topic
          this.topics = this.topics.filter(topic => topic.id !== id);
          // Cập nhật phân trang nếu cần
          if (this.topics.length === 0 && this.pagination.page > 1) {
            this.pagination.page -= 1;
            await this.fetchTopics({
              limit: this.pagination.limit,
              page: this.pagination.page,
              sort: this.pagination.sort
            });
          }
        }
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Sắp xếp lại topic
    async reorderTopics(topics) {
      try {
        // Cập nhật trạng thái local trước
        const totalTopics = topics.length;
        const reorderedTopics = topics.map((topic, index) => ({
          ...topic,
          order: totalTopics - index
        }));

        // Chuẩn bị dữ liệu cho API
        const reorderData = reorderedTopics.map(topic => ({
          id: topic.id,
          order: topic.order
        }));

        const response = await contentApi.reorderTopics(reorderData);
        if (response.code === 200) {
          // Cập nhật trạng thái local với order mới
          this.topics = reorderedTopics;

          Notify.create({
            type: 'positive',
            message: 'Topics reordered successfully'
          });
        }
      } catch (error) {
        console.error('Failed to reorder topics:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to reorder topics'
        });
        // Quay lại trạng thái trước đó trên lỗi
        await this.fetchTopics({
          limit: this.pagination.limit,
          page: this.pagination.page,
          sort: this.pagination.sort
        });
      }
    },

    // Xử lý kết thúc sắp xếp
    handleDragEnd(topics) {
      this.topics = topics;
      this.reorderTopics(topics);
    },

    // Sắp xếp topic theo thứ tự
    sortTopicsByOrder(order) {
      this.pagination.sort = order;
      this.fetchTopics({
        limit: this.pagination.limit,
        page: this.pagination.page,
        sort: order
      });
    },

    // Lấy danh sách bài học
    async fetchLessons(topicId, params = {}) {
      try {
        const { limit = 10, page = 1, sort = 'asc' } = params;
        const response = await contentApi.getLessons(topicId, {
          limit,
          page,
          sort
        });

        this.lessons[topicId] = response.detail.rows;
        this.lessonPagination[topicId] = {
          limit: response.detail.limit,
          page: response.detail.page,
          sort: response.detail.sort,
          total_rows: response.detail.total_rows,
          total_pages: response.detail.total_pages
        };
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Tạo bài học mới
    async createLesson(topicId, lesson) {
      try {
        const languageStore = useLanguageStore();
        const response = await contentApi.createLesson(topicId, {
          ...lesson,
          lang: languageStore.sourceLanguage,
          order: 0
        });

        if (response.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Lesson created successfully'
          });
          // Cập nhật danh sách bài học
          await this.fetchLessons(topicId, {
            limit: this.lessonPagination[topicId]?.limit || 10,
            page: this.lessonPagination[topicId]?.page || 1,
            sort: this.lessonPagination[topicId]?.sort || 'asc'
          });
        }
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Cập nhật bài học
    async updateLesson(topicId, lesson) {
      try {
        const languageStore = useLanguageStore();
        const response = await contentApi.updateLesson(topicId, lesson.id, {
          ...lesson,
          lang: languageStore.sourceLanguage,
          order: lesson.order || 0
        });

        if (response.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Lesson updated successfully'
          });
          // Cập nhật danh sách bài học
          await this.fetchLessons(topicId, {
            limit: this.lessonPagination[topicId]?.limit || 10,
            page: this.lessonPagination[topicId]?.page || 1,
            sort: this.lessonPagination[topicId]?.sort || 'asc'
          });
        }
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Xóa bài học
    async deleteLesson(topicId, lessonId) {
      try {
        const response = await contentApi.deleteLesson(topicId, lessonId);
        if (response.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Lesson deleted successfully'
          });
          // Cập nhật danh sách bài học
          await this.fetchLessons(topicId, {
            limit: this.lessonPagination[topicId]?.limit || 10,
            page: this.lessonPagination[topicId]?.page || 1,
            sort: this.lessonPagination[topicId]?.sort || 'asc'
          });
        }
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Sắp xếp lại bài học
    async reorderLessons(topicId, lessons) {
      try {
        // Cập nhật trạng thái local trước
        this.lessons[topicId] = lessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        // Chuẩn bị dữ liệu cho API
        const reorderData = lessons.map(lesson => ({
          id: lesson.id,
          order: lesson.order
        }));

        const response = await contentApi.reorderLessons(topicId, reorderData);
        if (response.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Lessons reordered successfully'
          });
          // Cập nhật danh sách bài học để đảm bảo tính nhất quán
          await this.fetchLessons(topicId, {
            limit: this.lessonPagination[topicId]?.limit || 10,
            page: this.lessonPagination[topicId]?.page || 1,
            sort: this.lessonPagination[topicId]?.sort || 'asc'
          });
        }
      } catch (error) {
        console.error('Failed to reorder lessons:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to reorder lessons'
        });
        // Quay lại trạng thái trước đó trên lỗi
        await this.fetchLessons(topicId, {
          limit: this.lessonPagination[topicId]?.limit || 10,
          page: this.lessonPagination[topicId]?.page || 1,
          sort: this.lessonPagination[topicId]?.sort || 'asc'
        });
      }
    },
  },

  watch: {
    'useLanguageStore().sourceLanguage': {
      handler(newLang) {
        if (newLang) {
          this.pagination.page = 1;
          this.fetchTopics({
            limit: this.pagination.limit,
            page: 1,
            sort: this.pagination.sort,
            lang: newLang
          });
        }
      },
      immediate: true,
      deep: true
    }
  }
});
