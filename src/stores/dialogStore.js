import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';
import { useLanguageStore } from './language';
import { contentApi } from 'src/boot/axios';

export const useDialogStore = defineStore('dialogs', {
  state: () => ({
    dialogues: [],
    pagination: {
      limit: 10,
      page: 1,
      sort: 'asc',
      total_rows: 0,
      total_pages: 0
    },
    dialogs: {},
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
    async fetchDialogue(params = {}) {
      try {
        const { limit = 20, page = 1, sort = 'asc', search = '' } = params;
        const response = await contentApi.getDialogue({
          limit,
          page,
          sort,
          search
        });

        this.dialogue = response.detail.rows;
        this.pagination = {
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

    // Tạo topic mới
    async createTopic(topic) {
      try {
        const languageStore = useLanguageStore();
        const response = await contentApi.createTopic({
          ...topic,
          lang: languageStore.sourceLanguage
        });

        // Cập nhật danh sách topic
        await this.fetchDialogue({
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
          await this.fetchDialogue({
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
          this.dialogue = this.dialogue.filter(topic => topic.id !== id);
          // Cập nhật phân trang nếu cần
          if (this.dialogue.length === 0 && this.pagination.page > 1) {
            this.pagination.page -= 1;
            await this.fetchDialogue({
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
    async reorderDialogue(dialogue) {
      try {
        // Cập nhật trạng thái local trước
        const totalDialogue = dialogue.length;
        const reorderedDialogue = dialogue.map((topic, index) => ({
          ...topic,
          order: totalDialogue - index
        }));

        // Chuẩn bị dữ liệu cho API
        const reorderData = reorderedDialogue.map(topic => ({
          id: topic.id,
          order: topic.order
        }));

        const response = await contentApi.reorderDialogue(reorderData);
        if (response.code === 200) {
          // Cập nhật trạng thái local với order mới
          this.dialogue = reorderedDialogue;

          Notify.create({
            type: 'positive',
            message: 'Dialogue reordered successfully'
          });
        }
      } catch (error) {
        console.error('Failed to reorder dialogue:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to reorder dialogue'
        });
        // Quay lại trạng thái trước đó trên lỗi
        await this.fetchDialogue({
          limit: this.pagination.limit,
          page: this.pagination.page,
          sort: this.pagination.sort
        });
      }
    },

    // Xử lý kết thúc sắp xếp
    handleDragEnd(dialogue) {
      this.dialogue = dialogue;
      this.reorderDialogue(dialogue);
    },

    // Sắp xếp topic theo thứ tự
    sortDialogueByOrder(order) {
      this.pagination.sort = order;
      this.fetchDialogue({
        limit: this.pagination.limit,
        page: this.pagination.page,
        sort: order
      });
    },

    // Lấy danh sách bài học
    async fetchDialogs(topicId, params = {}) {
      try {
        const { limit = 10, page = 1, sort = 'asc' } = params;
        const response = await contentApi.getDialogs(topicId, {
          limit,
          page,
          sort
        });

        this.dialogs[topicId] = response.detail.rows;
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
          await this.fetchDialogs(topicId, {
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
          await this.fetchDialogs(topicId, {
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
          await this.fetchDialogs(topicId, {
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
    async reorderDialogs(topicId, dialogs) {
      try {
        // Cập nhật trạng thái local trước
        this.dialogs[topicId] = dialogs.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        // Chuẩn bị dữ liệu cho API
        const reorderData = dialogs.map(lesson => ({
          id: lesson.id,
          order: lesson.order
        }));

        const response = await contentApi.reorderDialogs(topicId, reorderData);
        if (response.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Dialogs reordered successfully'
          });
          // Cập nhật danh sách bài học để đảm bảo tính nhất quán
          await this.fetchDialogs(topicId, {
            limit: this.lessonPagination[topicId]?.limit || 10,
            page: this.lessonPagination[topicId]?.page || 1,
            sort: this.lessonPagination[topicId]?.sort || 'asc'
          });
        }
      } catch (error) {
        console.error('Failed to reorder dialogs:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to reorder dialogs'
        });
        // Quay lại trạng thái trước đó trên lỗi
        await this.fetchDialogs(topicId, {
          limit: this.lessonPagination[topicId]?.limit || 10,
          page: this.lessonPagination[topicId]?.page || 1,
          sort: this.lessonPagination[topicId]?.sort || 'asc'
        });
      }
    },
  },
});
