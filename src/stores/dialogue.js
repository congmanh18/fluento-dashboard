import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';
import { useLanguageStore } from './language';
import { contentApi } from 'src/boot/axios';
import prompts from '../promt';

export const useDialogStore = defineStore('dialogs', {
  state: () => ({
    dialogues: [],
    pagination: {
      limit: 10,
      page: 1,
      sort: 'desc',
      total_rows: 0,
      total_pages: 1
    },
    dialogs: {},
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
      { label: 'Approved', value: 'approved' }
    ],
    pendingReorder: false,
    currentPrompt: '',
    promptSettings: {
      topic: '',
      lesson: '',
      level: '',
      character1: '',
      character2: '',
      sentenceCount: 6,
      sourceLanguage: '',
    },
  }),

  actions: {
    // Add new dialogue
    async addDialogue(dialogueData) {
      try {
        console.log('Sending dialogue data:', dialogueData);
        const response = await contentApi.createDialogue(dialogueData);
        console.log('Server response:', response);

        if (response.code === 200) {
          this.dialogues.unshift(response.detail);
          this.pagination.total_rows += 1;
          this.pagination.total_pages = Math.ceil(this.pagination.total_rows / this.pagination.limit);

          Notify.create({
            type: 'positive',
            message: response.message || 'Dialogue created successfully'
          });
        }

        return response;
      } catch (error) {
        console.error('Failed to add dialogue:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });
        Notify.create({
          type: 'negative',
          message: 'Failed to add dialogue: ' + (error.response?.data?.message || error.message)
        });
        throw error;
      }
    },

    // Update dialogue
    updateDialogue(id, updates) {
      const index = this.dialogues.findIndex(d => d.id === id);
      if (index !== -1) {
        this.dialogues[index] = { ...this.dialogues[index], ...updates };
      }
    },

    // Delete dialogue
    deleteDialogue(id) {
      const index = this.dialogues.findIndex(d => d.id === id);
      if (index !== -1) {
        this.dialogues.splice(index, 1);
        this.pagination.total_rows -= 1;
        this.pagination.total_pages = Math.ceil(this.pagination.total_rows / this.pagination.limit);
      }
    },

    // Update multiple dialogues
    updateDialogues(dialogues) {
      this.dialogues = dialogues;
    },

    // Generate prompt
    generatePrompt(settings) {
      if (settings) {
        this.promptSettings = { ...this.promptSettings, ...settings };
      }
      return prompts.dialogue({
        topic: this.promptSettings.topic,
        lesson: this.promptSettings.lesson,
        level: this.promptSettings.level,
        character1: this.promptSettings.character1,
        character2: this.promptSettings.character2,
        sentenceCount: this.promptSettings.sentenceCount,
        sourceLanguage: this.promptSettings.sourceLanguage
      });
    },

    // Update prompt settings
    updatePromptSettings(settings) {
      this.promptSettings = { ...this.promptSettings, ...settings };
    },

    // Fetch dialogues
    async fetchDialogues(params = {}) {
      try {
        const { limit = 20, page = 1, sort = 'asc', search = '' } = params;
        const response = await contentApi.getDialogues({
          limit,
          page,
          sort,
          search
        });

        this.dialogues = response.data.detail.rows;
        this.pagination = {
          limit: response.data.detail.limit,
          page: response.data.detail.page,
          sort: response.data.detail.sort,
          total_rows: response.data.detail.total_rows,
          total_pages: response.data.detail.total_pages
        };
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Reorder dialogues
    async reorderDialogue(dialogue) {
      try {
        const totalDialogue = dialogue.length;
        const reorderedDialogue = dialogue.map((topic, index) => ({
          ...topic,
          order: totalDialogue - index
        }));

        const reorderData = reorderedDialogue.map(topic => ({
          id: topic.id,
          order: topic.order
        }));

        const response = await contentApi.reorderDialogues(reorderData);
        if (response.data.code === 200) {
          this.dialogues = reorderedDialogue;

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
        await this.fetchDialogue({
          limit: this.pagination.limit,
          page: this.pagination.page,
          sort: this.pagination.sort
        });
      }
    },

    // Handle drag end
    handleDragEnd(dialogue) {
      this.dialogues = dialogue;
      this.reorderDialogue(dialogue);
    },

    // Sort dialogues
    sortDialogueByOrder(order) {
      this.pagination.sort = order;
      this.fetchDialogue({
        limit: this.pagination.limit,
        page: this.pagination.page,
        sort: order
      });
    },

    // Fetch dialogs for a topic
    async fetchDialogs(topicId, params = {}) {
      try {
        const { limit = 10, page = 1, sort = 'asc' } = params;
        const response = await contentApi.getLessons(topicId, {
          limit,
          page,
          sort
        });

        this.dialogs[topicId] = response.data.detail.rows;
        this.lessonPagination[topicId] = {
          limit: response.data.detail.limit,
          page: response.data.detail.page,
          sort: response.data.detail.sort,
          total_rows: response.data.detail.total_rows,
          total_pages: response.data.detail.total_pages
        };
        return response;
      } catch (error) {
        throw error;
      }
    },

    // Reorder dialogs
    async reorderDialogs(topicId, dialogs) {
      try {
        this.dialogs[topicId] = dialogs.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        const reorderData = dialogs.map(lesson => ({
          id: lesson.id,
          order: lesson.order
        }));

        const response = await contentApi.reorderLessons(topicId, reorderData);
        if (response.data.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Dialogs reordered successfully'
          });
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
        await this.fetchDialogs(topicId, {
          limit: this.lessonPagination[topicId]?.limit || 10,
          page: this.lessonPagination[topicId]?.page || 1,
          sort: this.lessonPagination[topicId]?.sort || 'asc'
        });
      }
    },
  },
});
