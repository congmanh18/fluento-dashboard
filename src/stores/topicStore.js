// src/stores/topicStore.js
import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { debounce } from 'lodash'; // Import debounce từ lodash

export const useTopicStore = defineStore('topics', {
  state: () => ({
    topics: [
      {
        id: 1,
        name: 'Nebula Hub',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'public',
        order: 1,
      },
      {
        id: 2,
        name: 'Starfield',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'pending',
        order: 2,
      },
      {
        id: 3,
        name: 'Quantum Core',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'draft',
        order: 3,
      },
      {
        id: 4,
        name: 'Galactic Drift',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'rejected',
        order: 4,
      },
      {
        id: 5,
        name: 'Cosmic Cascade',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'approved',
        order: 5,
      },
      {
        id: 6,
        name: 'Astral Veil',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'public',
        order: 6,
      },
      {
        id: 7,
        name: 'Stellar Nexus',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'approved',
        order: 7,
      },
      {
        id: 8,
        name: 'Lunar Pulse',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'pending',
        order: 8,
      },
      {
        id: 9,
        name: 'Orbit Shift',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'rejected',
        order: 9,
      },
      {
        id: 10,
        name: 'Cosmic Tide',
        image: 'https://tiki.vn/blog/wp-content/uploads/2023/01/oLkoHpw9cqRtLPTbg67bgtUvUdV1BnXRnAqqBZOVkEtPgf-_Ct3ADFJYXIjfDd0fTyECLEsWq5yZ2CCOEGxIsuHSmNNNUZQcnQT5-Ld6yoK19Q_Sphb0MmX64ga-O_TIPjItNkTL5ns4zqP1Z0OBzsIoeYKtcewnrjnVsw8vfG8uYwwCDkXaoozCrmH1kA.jpg',
        status: 'draft',
        order: 10,
      },
      // ... other initial topics
    ],
    selectedTopic: null,
    topicName: '',
    previewImage: null,
    isCreatingNew: false,
    isEditing: false,
    searchQuery: '',
    debouncedSearchQuery: '', // Thêm để lưu giá trị đã debounce
    statusFilter: null,
    statusOptions: [
      { label: 'All', value: null },
      { label: 'Public', value: 'public' },
      { label: 'Pending', value: 'pending' },
      { label: 'Draft', value: 'draft' },
      { label: 'Rejected', value: 'rejected' },
      { label: 'Approved', value: 'approved' },
    ],
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
        case 'public': return 'green';
        case 'pending': return 'orange';
        case 'draft': return 'grey';
        case 'rejected': return 'red';
        case 'approved': return 'blue';
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
    // ... other actions (selectTopic, startCreateNew, startEdit, handleFile, saveTopic, saveEdit, deleteTopic, reorderTopics, resetForm)
    selectTopic(topic) {
      this.selectedTopic = { ...topic };
      this.topicName = topic.name;
      this.previewImage = null;
      this.isCreatingNew = false;
      this.isEditing = false;
    },
    startCreateNew() {
      this.isCreatingNew = true;
      this.selectedTopic = null;
      this.topicName = '';
      this.previewImage = null;
    },
    startEdit() {
      this.isEditing = true;
      this.topicName = this.selectedTopic.name;
      this.previewImage = this.selectedTopic.image;
    },
    handleFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        Notify.create({
          message: 'Please upload an image file!',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 2000,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
        Notify.create({
          message: 'Image preview updated!',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 2000,
        });
      };
      reader.onerror = () => {
        Notify.create({
          message: 'Failed to read image file!',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 2000,
        });
      };
      reader.readAsDataURL(file);
    },
    saveTopic() {
      if (this.topicName && this.previewImage) {
        const newTopic = {
          id: Date.now(),
          name: this.topicName,
          image: this.previewImage,
          status: 'draft',
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
          message: 'Please provide a topic name and image!',
          color: 'negative',
          icon: 'error',
          position: 'top',
          timeout: 2000,
        });
      }
    },
    saveEdit() {
      if (this.selectedTopic && this.topicName) {
        const index = this.topics.findIndex((t) => t.id === this.selectedTopic.id);
        if (index !== -1) {
          this.topics[index] = {
            ...this.topics[index],
            name: this.topicName,
            image: this.previewImage || this.topics[index].image,
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
      this.previewImage = null;
      this.isCreatingNew = false;
      this.isEditing = false;
      this.selectedTopic = null;
    },
  },
});