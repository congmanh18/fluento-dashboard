import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash';

export const useTopicStore = defineStore('topics', {
  state: () => ({
    topics: [
      {
        id: 1,
        name: 'Chào hỏi giao tiếp căn bản',
        status: 'draft',
        order: 1,
        lessons: [
          {
            id: 1,
            name: 'Chào hỏi',
            imageURL: 'https://picsum.photos/200/300',
            order: 1,
          },
          {
            id: 2,
            name: 'Tự giới thiệu',
            imageURL: 'https://picsum.photos/200/300',
            order: 2,
          },
          {
            id: 3,
            name: 'Chia sẻ thông tin cá nhân',
            imageURL: 'https://picsum.photos/200/300',
            order: 3,
          },
        ],
      },
      {
        id: 2,
        name: 'Văn hóa và lịch sử',
        status: 'draft',
        order: 2,
        lessons: [
          {
            id: 1,
            name: 'Văn hóa Việt Nam',
            imageURL: 'https://picsum.photos/200/300',
            order: 1,
          },
          {
            id: 2,
            name: 'Lịch sử Việt Nam',
            imageURL: 'https://picsum.photos/200/300',
            order: 2,
          },
          {
            id: 3,
            name: 'Văn hóa thế giới',
            imageURL: 'https://picsum.photos/200/300',
            order: 3,
          },
        ],
      },
      {
        id: 3,
        name: 'Khoa học và công nghệ',
        status: 'draft',
        order: 3,
        lessons: [
          {
            id: 1,
            name: 'Khoa học Việt Nam',
            imageURL: 'https://picsum.photos/200/300',
            order: 1,
          },
          {
            id: 2,
            name: 'Công nghệ thông tin',
            imageURL: 'https://picsum.photos/200/300',
            order: 2,
          },
          {
            id: 3,
            name: 'Khoa học thế giới',
            imageURL: 'https://picsum.photos/200/300',
            order: 3,
          },
        ],
      },
      {
        id: 4,
        name: 'Đời sống hàng ngày',
        status: 'draft',
        order: 4,
        lessons: [
          {
            id: 1,
            name: 'Đồ dùng hàng ngày',
            imageURL: 'https://picsum.photos/200/300',
            order: 1,
          },
          {
            id: 2,
            name: 'Thức ăn hàng ngày',
            imageURL: 'https://picsum.photos/200/300',
            order: 2,
          },
          {
            id: 3,
            name: 'Đồ uống hàng ngày',
            imageURL: 'https://picsum.photos/200/300',
            order: 3,
          },
        ],
      },
      {
        id: 5,
        name: 'Công việc và sự nghiệp',
        status: 'reject',
        order: 5,
      },
      {
        id: 6,
        name: 'Lễ hội và tết trung thu',
        status: 'reject',
        order: 6,
      },
      {
        id: 7,
        name: 'Du lịch và văn hóa',
        status: 'reject',
        order: 7,
      },
      {
        id: 8,
        name: 'Tài chính và đầu tư',
        status: 'approved',
        order: 8,
      },
      {
        id: 9,
        name: 'Địa điểm du lịch',
        status: 'approved',
        order: 9,
      },
      {
        id: 10,
        name: 'Làm việc với người khác',
        status: 'approved',
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
      { label: 'Reject', value: 'reject' },
      { label: 'Approved', value: 'approved' },
    ],
  }),

  actions: {
    updateTopic(topic) {
      const index = this.topics.findIndex(t => t.id === topic.id);
      if (index !== -1) {
        this.topics[index] = topic;
      }
    },

    createTopic(topic) {
      const newTopic = {
        ...topic,
        id: Date.now(),
        order: 1,
      };
      this.topics.forEach(t => t.order += 1);
      this.topics.unshift(newTopic);
    },

    deleteTopic(id) {
      this.topics = this.topics.filter(t => t.id !== id);
    },

    reorderTopics(topics) {
      this.topics = topics;
    },

    updateLesson(topicId, lesson) {
      const topic = this.topics.find(t => t.id === topicId);
      if (topic && topic.lessons) {
        const lessonIndex = topic.lessons.findIndex(l => l.id === lesson.id);
        if (lessonIndex !== -1) {
          topic.lessons[lessonIndex] = lesson;
        }
      }
    },

    createLesson(topicId, lesson) {
      const topic = this.topics.find(t => t.id === topicId);
      if (topic) {
        if (!topic.lessons) {
          topic.lessons = [];
        }
        const newLesson = {
          ...lesson,
          id: Date.now(),
          order: topic.lessons.length + 1,
        };
        topic.lessons.push(newLesson);
      }
    },

    deleteLesson(topicId, lessonId) {
      const topic = this.topics.find(t => t.id === topicId);
      if (topic && topic.lessons) {
        topic.lessons = topic.lessons.filter(l => l.id !== lessonId);
      }
    },

    sortTopicsByOrder(order) {
      const sortedTopics = [...this.topics].sort((a, b) => {
        if (order === 'asc') {
          return a.order - b.order;
        } else {
          return b.order - a.order;
        }
      });
      this.topics = sortedTopics;
    },
  },
});
