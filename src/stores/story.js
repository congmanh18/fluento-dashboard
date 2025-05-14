import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';
import { useLanguageStore } from './language';
import { contentApi } from 'src/boot/axios';
import prompts from '../promt';

export const useStoryStore = defineStore('stories', {
  state: () => ({
    stories: [],
    pagination: {
      limit: 10,
      page: 1,
      sort: 'desc',
      total_rows: 0,
      total_pages: 1
    },
    stories: {},
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
    // Add new story
    async addStory(storyData) {
      try {
        console.log('Sending story data:', storyData);
        const response = await contentApi.createStory(storyData);
        console.log('Create Story Response:', response);

        if (response.code === 200) {
          // Add a small delay to allow the server to process the new story
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Fetch the updated list of stories
          const lessonId = storyData.setting.lesson_id;
          console.log('Fetching stories for lesson:', lessonId);

          try {
            await this.fetchStories(lessonId);
          } catch (error) {
            console.error('Error fetching stories after adding:', error);
            // Don't throw the error, just log it
          }

          Notify.create({
            type: 'positive',
            message: response.message || 'Story created successfully'
          });
        }

        return response;
      } catch (error) {
        console.error('Failed to add story:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });
        Notify.create({
          type: 'negative',
          message: 'Failed to add story: ' + (error.response?.data?.message || error.message)
        });
        throw error;
      }
    },

    // Update story
    updateStory(id, updates) {
      const index = this.stories.findIndex(s => s.id === id);
      if (index !== -1) {
        this.stories[index] = { ...this.stories[index], ...updates };
      }
    },

    // Delete story
    deleteStory(id) {
      const index = this.stories.findIndex(s => s.id === id);
      if (index !== -1) {
        this.stories.splice(index, 1);
        this.pagination.total_rows -= 1;
        this.pagination.total_pages = Math.ceil(this.pagination.total_rows / this.pagination.limit);
      }
    },

    // Update multiple stories
    updateStories(stories) {
      this.stories = stories;
    },

    // Generate prompt
    generatePrompt(settings) {
      if (settings) {
        this.promptSettings = { ...this.promptSettings, ...settings };
      }
      return prompts.story({
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

    // Fetch stories
    async fetchStories(lessonId, params = {}) {
      try {
        if (!lessonId) {
          console.log('No lessonId provided, skipping fetch');
          return;
        }

        const { limit = 20, page = 1, sort = 'asc'} = params;
        console.log('=== Fetch Stories API Call ===');
        console.log('Request params:', {
          lessonId,
          limit,
          page,
          sort,
        });

        let response;
        try {
          console.log('Making API call to getStories...');
          response = await contentApi.getStories(lessonId, {
            limit,
            page,
            sort,
          });

          console.log('Raw API Response:', response);

          // Handle case where response is undefined or null
          if (!response) {
            console.error('API returned null or undefined response');
            throw new Error('Empty response from API');
          }

          // Check if response has the expected structure
          if (!response.detail?.rows?.tasks) {
            console.error('Invalid response format:', response);
            throw new Error('Invalid response format from server');
          }

          const { tasks, vocabularies } = response.detail.rows;

          console.log('Processing stories:', {
            totalStories: tasks.length,
            totalVocabularies: vocabularies?.length || 0
          });

          if (tasks.length === 0) {
            console.log('No stories found, setting empty state');
            this.stories = [{
              id: 'no-story',
              lang: 'en',
              task_type: 'story',
              story: [],
              isEmpty: true,
              message: 'This lesson has no stories yet'
            }];
          } else {
            console.log('Processing tasks...');
            this.stories = tasks.map(story => {
              const { id, lang, task_type, detail } = story;
              const { title, speaker, content } = detail;

              console.log('Processing story:', {
                id,
                title,
                contentLength: content?.length
              });

              // Parse the content into story lines
              const contentLines = content.split('. ').filter(line => line.trim());
              const storyLines = contentLines.map((line, index) => {
                // Extract speaker and text from the line
                const speakerMatch = line.match(/^([^:]+):/);
                const lineSpeaker = speakerMatch ? speakerMatch[1].trim() : speaker || '';
                const text = speakerMatch ? line.substring(speakerMatch[0].length).trim() : line.trim();

                // Extract speaker from quoted text if no speaker in line
                if (!lineSpeaker && text.includes("'")) {
                  const quoteMatch = text.match(/'([^']+)'/);
                  if (quoteMatch) {
                    const quotedText = quoteMatch[1];
                    if (quotedText.includes(':')) {
                      const [quotedSpeaker, quotedContent] = quotedText.split(':').map(s => s.trim());
                      return {
                        id: `${id}-${index}`,
                        speaker: quotedSpeaker,
                        text: quotedContent
                      };
                    }
                  }
                }

                return {
                  id: `${id}-${index}`,
                  speaker: lineSpeaker,
                  text: text
                };
              });

              console.log('Story processed:', {
                id,
                title,
                linesCount: storyLines.length,
                firstLine: storyLines[0]
              });

              return {
                id,
                lang: lang || 'en',
                task_type: task_type || 'story',
                title: title || '',
                story: storyLines,
                vocabulary: vocabularies || [],
                isEmpty: false
              };
            });
          }

          // Set pagination from response
          this.pagination = {
            limit: response.detail.limit || limit,
            page: response.detail.page || page,
            sort: response.detail.sort || sort,
            total_rows: response.detail.total_rows || tasks.length,
            total_pages: response.detail.total_pages || Math.ceil(tasks.length / limit)
          };

          console.log('=== Fetch Stories Complete ===');
          console.log('Final state:', {
            storiesCount: this.stories.length,
            pagination: this.pagination,
            firstStoryId: this.stories[0]?.id,
            firstStoryTitle: this.stories[0]?.title
          });

          return response;
        } catch (error) {
          console.error('API call failed:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            error: error,
            errorType: error.constructor.name,
            errorStack: error.stack
          });
          throw new Error(`Failed to fetch stories from API: ${error.message}`);
        }
      } catch (error) {
        console.error('=== Fetch Stories Error ===');
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });

        // Set empty state on error
        this.stories = [{
          id: 'no-story',
          lang: 'en',
          task_type: 'story',
          story: [],
          isEmpty: true,
          message: 'This lesson has no stories yet'
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
          message: 'Failed to fetch stories: ' + (error.response?.data?.message || error.message)
        });
        throw error;
      }
    },

    // Reorder stories
    async reorderStory(story) {
      try {
        const totalStory = story.length;
        const reorderedStory = story.map((topic, index) => ({
          ...topic,
          order: totalStory - index
        }));

        const reorderData = reorderedStory.map(topic => ({
          id: topic.id,
          order: topic.order
        }));

        const response = await contentApi.reorderStories(reorderData);
        if (response.data.code === 200) {
          this.stories = reorderedStory;

          Notify.create({
            type: 'positive',
            message: 'Story reordered successfully'
          });
        }
      } catch (error) {
        console.error('Failed to reorder story:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to reorder story'
        });
        await this.fetchStories({
          limit: this.pagination.limit,
          page: this.pagination.page,
          sort: this.pagination.sort
        });
      }
    },

    // Handle drag end
    handleDragEnd(story) {
      this.stories = story;
      this.reorderStory(story);
    },

    // Sort stories
    sortStoryByOrder(order) {
      this.pagination.sort = order;
      this.fetchStories({
        limit: this.pagination.limit,
        page: this.pagination.page,
        sort: order
      });
    },

    // Reorder stories
    async reorderStories(topicId, stories) {
      try {
        this.stories[topicId] = stories.map((lesson, index) => ({
          ...lesson,
          order: index + 1
        }));

        const reorderData = stories.map(lesson => ({
          id: lesson.id,
          order: lesson.order
        }));

        const response = await contentApi.reorderLessons(topicId, reorderData);
        if (response.data.code === 200) {
          Notify.create({
            type: 'positive',
            message: 'Stories reordered successfully'
          });
          await this.fetchStories(topicId, {
            limit: this.lessonPagination[topicId]?.limit || 10,
            page: this.lessonPagination[topicId]?.page || 1,
            sort: this.lessonPagination[topicId]?.sort || 'asc'
          });
        }
      } catch (error) {
        console.error('Failed to reorder stories:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to reorder stories'
        });
        await this.fetchStories(topicId, {
          limit: this.lessonPagination[topicId]?.limit || 10,
          page: this.lessonPagination[topicId]?.page || 1,
          sort: this.lessonPagination[topicId]?.sort || 'asc'
        });
      }
    },
  },
});
