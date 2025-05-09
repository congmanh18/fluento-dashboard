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
        console.log('Create Dialogue Response:', response);

        if (response.code === 200) {
          // Add a small delay to allow the server to process the new dialogue
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Fetch the updated list of dialogues
          const lessonId = dialogueData.setting.lesson_id;
          console.log('Fetching dialogues for lesson:', lessonId);
          await this.fetchDialogues(lessonId);

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
    async fetchDialogues(lessonId, params = {}) {
      try {
        if (!lessonId) {
          console.log('No lessonId provided, skipping fetch');
          return;
        }

        const { limit = 20, page = 1, sort = 'asc', search = '' } = params;
        console.log('Fetching dialogues with params:', { lessonId, limit, page, sort, search });

        const response = await contentApi.getDialogues(lessonId, {
          limit,
          page,
          sort,
          search
        });

        console.log('Raw Fetch Dialogues Response:', response);

        // Check if response exists and has the expected structure
        if (!response) {
          throw new Error('No response from server');
        }

        // Transform the response data to match our store structure
        if (response.detail && response.detail.rows) {
          console.log('Processing dialogues from response:', response.detail);

          if (response.detail.rows.tasks.length === 0) {
            // Set empty state with a message
            this.dialogues = [{
              id: 'no-dialog',
              lang: 'en',
              task_type: 'dialog',
              dialog: [],
              isEmpty: true,
              message: 'This lesson has no dialogues yet'
            }];
          } else {
            this.dialogues = response.detail.rows.tasks.map(dialog => {
              console.log('Processing dialog item:', dialog);
              return {
                id: dialog.id,
                lang: dialog.lang,
                task_type: dialog.task_type,
                dialog: dialog.detail.map(line => ({
                  id: line.id,
                  speaker: line.speaker,
                  text: line.text
                })),
                vocabulary: response.detail.rows.vocabularies,
                isEmpty: false
              };
            });
          }

          this.pagination = {
            limit: response.detail.limit || 10,
            page: response.detail.page || 1,
            sort: response.detail.sort || 'asc',
            total_rows: response.detail.total_rows || 0,
            total_pages: response.detail.total_pages || 1
          };

          console.log('Updated dialogues state:', this.dialogues);
          console.log('Updated pagination state:', this.pagination);
        } else {
          console.log('No valid dialogues data in response, setting empty state');
          // If no data, set empty arrays and default pagination
          this.dialogues = [{
            id: 'no-dialog',
            lang: 'en',
            task_type: 'dialog',
            dialog: [],
            isEmpty: true,
            message: 'This lesson has no dialogues yet'
          }];
          this.pagination = {
            limit: 10,
            page: 1,
            sort: 'asc',
            total_rows: 0,
            total_pages: 1
          };
        }

        return response;
      } catch (error) {
        console.error('Failed to fetch dialogues:', error);
        // Set empty state on error
        this.dialogues = [{
          id: 'no-dialog',
          lang: 'en',
          task_type: 'dialog',
          dialog: [],
          isEmpty: true,
          message: 'This lesson has no dialogues yet'
        }];
        this.pagination = {
          limit: 10,
          page: 1,
          sort: 'asc',
          total_rows: 0,
          total_pages: 1
        };
        Notify.create({
          type: 'negative',
          message: 'Failed to fetch dialogues: ' + (error.response?.data?.message || error.message)
        });
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
