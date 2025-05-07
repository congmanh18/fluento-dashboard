import { defineStore } from 'pinia';
import { contentApi } from 'src/boot/axios';

export const useStoryStore = defineStore('story', {
  state: () => ({
    stories: [
      {
        id: 1,
        title: 'The Adventure of the Red-Headed League',
        content: 'Here is the content of the story, this is a story about a red-headed league. Have fun! Just kidding! And this is the end of the story.',
        modelAI: 'gpt4',
        character: 'John',
        status: 'draft',
      },
      {
        id: 2,
        title: 'We are the world',
        content: 'To be or not to be, that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them to die, to sleep no more. ',
        modelAI: 'gpt4',
        character: 'Mary',
        status: 'draft',
      }
    ],
    pagination: {
      limit: 10,
      page: 1,
      sort: 'asc',
      total_rows: 2,
      total_pages: 1
    },
    story: {},
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
    pendingReorder: false,
    currentPrompt: '',
    promptSettings: {
      topic: '',
      lesson: '',
      level: '',
      character: '',
      sentenceCount: 6
    },
    topicOptions: [
      { label: 'Food & Dining', value: 'food' },
      { label: 'Travel & Directions', value: 'travel' },
      { label: 'Shopping', value: 'shopping' },
      { label: 'Health & Fitness', value: 'health' },
      { label: 'Work & Business', value: 'work' }
    ],
    lessonOptions: [
      { label: 'Lesson 1: Basic Conversations', value: 'basic' },
      { label: 'Lesson 2: Advanced Topics', value: 'advanced' },
      { label: 'Lesson 3: Business English', value: 'business' },
      { label: 'Lesson 4: Travel English', value: 'travel' },
      { label: 'Lesson 5: Social Interactions', value: 'social' }
    ],
    modelAIOptions: [
      { label: 'GPT-4', value: 'gpt4' },
      { label: 'GPT-3.5', value: 'gpt35' },
      { label: 'Claude', value: 'claude' }
    ],
    levelOptions: [
      { label: 'Beginner', value: 'beginner' },
      { label: 'Intermediate', value: 'intermediate' },
      { label: 'Advanced', value: 'advanced' }
    ],
    characterOptions: [
      { label: 'John', value: 'john', voice_code: 'en-US-John' },
      { label: 'Mary', value: 'mary', voice_code: 'en-US-Mary' },
      { label: 'David', value: 'david', voice_code: 'en-US-David' },
      { label: 'Sarah', value: 'sarah', voice_code: 'en-US-Sarah' },
      { label: 'Michael', value: 'michael', voice_code: 'en-US-Michael' }
    ]
  }),
  actions: {
    async fetchStories() {
      const response = await contentApi.get('/stories');
      this.stories = response.data;
    },
  },
});