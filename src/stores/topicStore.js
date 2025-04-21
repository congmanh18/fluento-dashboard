import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';

export const useTopicStore = defineStore('topics', {
  state: () => ({
    topics: [
      {
        id: 1,
        name: 'Nebula Hub',
        status: 'draft',
        order: 1,
        lessons: [
          {
            id: 1,
            name: 'Topic 1 Lesson 1',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 1,
          },
          {
            id: 2,
            name: 'Topic 1 Lesson 2',
            imageURL: 'https://picsum.photos/200/300',
            status: 'pending',
            order: 2,
          },
          {
            id: 3,
            name: 'Topic 1 Lesson 3',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 3,
          },
        ],
      },
      {
        id: 2,
        name: 'Starfield',
        status: 'pending',
        order: 2,
        lessons: [
          {
            id: 1,
            name: 'Topic 2 Lesson 1',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 1,
          },
          {
            id: 2,
            name: 'Topic 2 Lesson 2',
            imageURL: 'https://picsum.photos/200/300',
            status: 'pending',
            order: 2,
          },
          {
            id: 3,
            name: 'Topic 2 Lesson 3',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 3,
          },
        ],
      },
      {
        id: 3,
        name: 'Quantum Core',
        status: 'draft',
        order: 3,
        lessons: [
          {
            id: 1,
            name: 'Topic 3 Lesson 1',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 1,
          },
          {
            id: 2,
            name: 'Topic 3 Lesson 2',
            imageURL: 'https://picsum.photos/200/300',
            status: 'pending',
            order: 2,
          },
          {
            id: 3,
            name: 'Topic 3 Lesson 3',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 3,
          },
        ],
      },
      {
        id: 4,
        name: 'Galactic Drift',
        status: 'pending',
        order: 4,
        lessons: [
          {
            id: 1,
            name: 'Topic 4 Lesson 1',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 1,
          },
          {
            id: 2,
            name: 'Topic 4 Lesson 2',
            imageURL: 'https://picsum.photos/200/300',
            status: 'pending',
            order: 2,
          },
          {
            id: 3,
            name: 'Topic 4 Lesson 3',
            imageURL: 'https://picsum.photos/200/300',
            status: 'draft',
            order: 3,
          },
        ],
      },
      {
        id: 5,
        name: 'Cosmic Cascade',
        status: 'approved',
        order: 5,
      },
      {
        id: 6,
        name: 'Astral Veil',
        status: 'draft',
        order: 6,
      },
      {
        id: 7,
        name: 'Stellar Nexus',
        status: 'approved',
        order: 7,
      },
      {
        id: 8,
        name: 'Lunar Pulse',
        status: 'pending',
        order: 8,
      },
      {
        id: 9,
        name: 'Orbit Shift',
        status: 'pending',
        order: 9,
      },
      {
        id: 10,
        name: 'Cosmic Tide',
        status: 'draft',
        order: 10,
      },
    ],
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
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
    ],
    // Lesson-related states
    isCreatingLesson: false,
    isEditingLesson: false,
    lessonId: null,
    lessonName: '',
    lessonImageURL: '',
    lessonStatus: 'draft',
    // Lesson actions
    startCreateLesson() {
      this.isCreatingLesson = true;
      this.lessonName = '';
      this.lessonImageURL = '';
      this.lessonStatus = 'draft';
    },
    startEditLesson(lesson) {
      this.isEditingLesson = true;
      this.lessonId = lesson.id;
      this.lessonName = lesson.name;
      this.lessonImageURL = lesson.imageURL;
      this.lessonStatus = lesson.status;
    },
    saveLesson() {
      if (!this.selectedTopic || !this.lessonName) return;
      const lesson = {
        id: this.isEditingLesson ? this.lessonId : Date.now(), // Giả lập ID
        name: this.lessonName,
        imageURL: this.lessonImageURL,
        status: this.lessonStatus,
      };
      if (this.isEditingLesson) {
        const lessonIndex = this.selectedTopic.lessons.findIndex(l => l.id === this.lessonId);
        if (lessonIndex !== -1) {
          this.selectedTopic.lessons[lessonIndex] = lesson;
        }
      } else {
        this.selectedTopic.lessons.push(lesson);
      }
      this.cancelLesson();
    },
    deleteLesson(lessonId) {
      if (this.selectedTopic) {
        this.selectedTopic.lessons = this.selectedTopic.lessons.filter(l => l.id !== lessonId);
      }
    },
    cancelLesson() {
      this.isCreatingLesson = false;
      this.isEditingLesson = false;
      this.lessonId = null;
      this.lessonName = '';
      this.lessonImageURL = '';
      this.lessonStatus = 'draft';
    },
  }),

  getters: {
    displayedTopics: (state) => {
      let filtered = state.topics.slice().sort((a, b) => a.order - b.order);
      if (state.debouncedSearchQuery) {
        filtered = filtered.filter((topic) =>
          topic.name.toLowerCase().includes(state.debouncedSearchQuery.toLowerCase())
        );
      }
      if (state.statusFilter) {
        filtered = filtered.filter((topic) => topic.status === state.statusFilter);
      }
      return filtered;
    },
    isTopicVisible: (state) => (topic) => {
      const matchesSearch = state.debouncedSearchQuery
        ? topic.name.toLowerCase().includes(state.debouncedSearchQuery.toLowerCase())
        : true;
      const matchesStatus = state.statusFilter
        ? topic.status === state.statusFilter
        : true;
      return matchesSearch && matchesStatus;
    },
    getStatusColor: () => (status) => {
      switch (status) {
        case 'draft': return 'grey';
        case 'pending': return 'orange';
        case 'approved': return 'green';
        default: return 'grey';
      }
    },
  },

  actions: {
    updateSearchQuery(value) {
      this.searchQuery = value;
      this.debounceSearch();
    },
    debounceSearch: debounce(function () {
      this.debouncedSearchQuery = this.searchQuery;
    }, 300),
    selectTopic(topic) {
      this.selectedTopic = { ...topic };
      this.topicName = topic.name;
      this.topicStatus = topic.status;
      this.isCreatingNew = false;
      this.isEditing = false;
    },
    startCreateNew() {
      this.isCreatingNew = true;
      this.isEditing = false;
      this.selectedTopic = null;
      this.topicName = '';
      this.topicStatus = 'draft';
    },
    startEdit() {
      if (this.selectedTopic) {
        this.isEditing = true;
        this.isCreatingNew = false;
        this.topicName = this.selectedTopic.name;
        this.topicStatus = this.selectedTopic.status;
      }
    },
    saveTopic() {
      if (this.topicName) {
        const newTopic = {
          id: Date.now(),
          name: this.topicName,
          status: this.topicStatus || 'draft',
          order: this.topics.length + 1,
        };
        this.topics.push(newTopic);
        this.resetForm();
        Notify.create({
          message: 'New topic created!',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 2000,
        });
      } else {
        Notify.create({
          message: 'Please provide a topic name!',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 2000,
        });
      }
    },
    saveEdit() {
      if (this.selectedTopic && this.topicName)

 {
        const index = this.topics.findIndex((t) => t.id === this.selectedTopic.id);
        if (index !== -1) {
          this.topics[index] = {
            ...this.topics[index],
            name: this.topicName,
            status: this.topicStatus || this.topics[index].status,
          };
          this.selectedTopic = { ...this.topics[index] };
          this.resetForm();
          Notify.create({
            message: 'Topic updated!',
            color: 'positive',
            icon: 'check_circle',
            position: 'top',
            timeout: 2000,
          });
        } else {
          Notify.create({
            message: 'Topic not found!',
            color: 'negative',
            icon: 'error',
            position: 'top',
            timeout: 2000,
          });
        }
      } else {
        Notify.create({
          message: 'Please provide a topic name!',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 2000,
        });
      }
    },
    deleteTopic() {
      if (this.selectedTopic) {
        this.topics = this.topics.filter((t) => t.id !== this.selectedTopic.id);
        this.topics.forEach((topic, index) => {
          topic.order = index + 1;
        });
        this.resetForm();
        Notify.create({
          message: 'Topic deleted!',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 2000,
        });
      } else {
        Notify.create({
          message: 'No topic selected!',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 2000,
        });
      }
    },
    cancelEdit() {
      if (this.selectedTopic) {
        this.topicName = this.selectedTopic.name;
        this.topicStatus = this.selectedTopic.status;
      }
      this.isEditing = false;
    },
    cancelCreate() {
      this.isCreatingNew = false;
      this.resetForm();
    },
    reorderTopics(newTopics) {
      this.topics = newTopics;
      this.topics.forEach((topic, index) => {
        topic.order = index + 1;
      });
      Notify.create({
        message: 'Topics reordered!',
        color: 'positive',
        icon: 'check_circle',
        position: 'top',
        timeout: 2000,
      });
    },
    resetForm() {
      this.topicName = '';
      this.topicStatus = null;
      this.isCreatingNew = false;
      this.isEditing = false;
      this.selectedTopic = null;
    },
    updateLesson(updatedLesson) {
      if (!this.selectedTopic) return;

      const lessonIndex = this.selectedTopic.lessons.findIndex(l => l.id === updatedLesson.id);
      if (lessonIndex !== -1) {
        this.selectedTopic.lessons[lessonIndex] = {
          ...this.selectedTopic.lessons[lessonIndex],
          ...updatedLesson
        };

        // Update in topics array
        const topicIndex = this.topics.findIndex(t => t.id === this.selectedTopic.id);
        if (topicIndex !== -1) {
          this.topics[topicIndex] = { ...this.selectedTopic };
        }
      }
    },
    createLesson(newLesson) {
      if (!this.selectedTopic) return;

      const lesson = {
        id: Date.now(),
        name: newLesson.name,
        imageURL: newLesson.imageURL,
        status: newLesson.status || 'draft',
        order: (this.selectedTopic.lessons?.length || 0) + 1
      };

      if (!this.selectedTopic.lessons) {
        this.selectedTopic.lessons = [];
      }

      this.selectedTopic.lessons.push(lesson);

      // Update in topics array
      const topicIndex = this.topics.findIndex(t => t.id === this.selectedTopic.id);
      if (topicIndex !== -1) {
        this.topics[topicIndex] = { ...this.selectedTopic };
      }
    },
    deleteLesson(lessonId) {
      if (!this.selectedTopic) return;

      this.selectedTopic.lessons = this.selectedTopic.lessons.filter(l => l.id !== lessonId);

      // Update in topics array
      const topicIndex = this.topics.findIndex(t => t.id === this.selectedTopic.id);
      if (topicIndex !== -1) {
        this.topics[topicIndex] = { ...this.selectedTopic };
      }
    },
  },
});
