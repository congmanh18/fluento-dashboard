<template>
  <div class="q-pa-md">

    <!-- Thanh tìm kiếm, nút chọn ẩn/hiện cột và xóa -->
    <div class="row q-mb-md items-center">
      <div class="col-8">
        <q-input
          v-model="filter"
          dense
          outlined
          label="Search topic name"
          class="full-width"
          @update:model-value="handleSearch"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-2 q-px-sm">
        <q-btn
          color="primary"
          label="Delete Topic"
          class="full-width"
          @click="showDeleteWarning"
        />
      </div>
      <div class="col-2">
        <q-btn-dropdown
          flat
          dense
          label="Columns"
          class="full-width"
        >
          <q-list>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Topic</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.topicName" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Status</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.status" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Actions</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.actions" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Danh sách topic -->
    <div class="topic-list">
      <div class="topic-header row items-center q-pa-sm bg-grey-2">
        <div class="col-1 text-left">
          <div class="row q-gutter-sm">
            <q-btn
              flat
              dense
              round
              :icon="sortOrder === 'desc' ? 'arrow_upward' : 'arrow_downward'"
              @click="toggleSortOrder"
              color="primary"
              size="sm"
            />
          </div>
        </div>

        <!-- Chọn tất cả -->

        <!-- Tên Topic -->
        <div class="col-5" v-if="visibleColumns.topicName">Topic</div>

        <!-- Trạng thái -->
        <div class="col-3 text-left" v-if="visibleColumns.status">
          <div class="status-display">
            <span class="status-text">Status</span>
          </div>
        </div>
        <div class="col-2 text-center" v-if="visibleColumns.actions">Actions</div>
        <div class="col-1 text-left" v-if="isDeleteMode">
          <q-checkbox v-model="selectAll" @update:model-value="toggleSelectAll" />
        </div>
        <div class="col-1 text-left" v-else></div>
      </div>


      <!-- Nút tạo topic mới -->
      <div class="row items-center q-pa-sm">
        <div class="col-1 text-left"></div>
        <div class="col-5" v-if="visibleColumns.topicName">
          <q-input
            v-model="newTopicName"
            dense
            outlined
            placeholder="New topic name"
            @keyup.enter="createTopic"
            autofocus
          />
        </div>

        <!-- Trạng thái -->
        <div class="col-3 text-left" v-if="visibleColumns.status">
          <div class="row q-gutter-sm justify-center">
            <q-radio
              v-model="newTopicStatus"
              val="draft"
              label="Draft"
              color="grey"
            />
            <q-radio
              v-model="newTopicStatus"
              val="approved"
              label="Approved"
              color="positive"
            />
          </div>
        </div>

        <!-- Nút tạo topic mới -->
        <div class="col-2 text-center" v-if="visibleColumns.actions">
          <div class="row justify-center">
            <q-btn
              flat
              dense
              round
              icon="add"
              color="positive"
              @click="createTopic"
            />
          </div>
        </div>
      </div>

      <!-- Danh sách topic -->
      <draggable
        v-model="filteredTopics"
        group="topics"
        item-key="id"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
        class="topic-items"
        :disabled="isDeleteMode"
      >
        <!-- Thẻ topic -->
        <template #item="{ element }">
          <q-card flat bordered class="q-mb-sm" :class="{ 'selected': selectedTopics.includes(element) }">
            <q-card-section
              class="row items-center cursor-pointer"
              @click="!editingTopic && toggleTopic(element)"
            >
              <div class="col-1 text-left">
                <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
              </div>

              <!-- Tên topic -->
              <div class="col-5 topic-name" v-if="visibleColumns.topicName">
                <template v-if="editingTopic === element">
                  <q-input
                    v-model="editingTopicName"
                    dense
                    outlined
                    @keyup.enter="saveTopic(element)"
                    autofocus
                  />
                </template>
                <template v-else>
                  {{ element.name }}
                </template>
              </div>

              <!-- Trạng thái -->
              <div class="col-3 text-left" v-if="visibleColumns.status">
                <template v-if="editingTopic === element">
                  <div class="row q-gutter-sm justify-center">
                    <q-radio
                      v-model="editingTopicStatus"
                      val="draft"
                      label="Draft"
                      color="grey"
                      @click.stop
                    />
                    <q-radio
                      v-model="editingTopicStatus"
                      val="approved"
                      label="Approved"
                      color="positive"
                      @click.stop
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="status-display">
                    <span class="status-dot" :style="{ backgroundColor: getStatusColor(element.status) }"></span>
                    <span class="status-text">{{ getStatusLabel(element.status) }}</span>
                  </div>
                </template>
              </div>

              <!-- Nút thao tác -->
              <div class="col-2 text-center" v-if="visibleColumns.actions">
                <div class="row justify-center">
                  <template v-if="editingTopic === element">
                    <q-btn
                      flat
                      dense
                      round
                      icon="close"
                      color="negative"
                      @click.stop="cancelEditTopic"
                      class="q-ml-sm"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      icon="check"
                      color="positive"
                      @click.stop="saveTopic(element)"
                      :loading="isUpdating"
                      class="q-ml-sm"
                    />
                  </template>
                  <template v-else>
                    <q-btn
                      flat
                      dense
                      round
                      icon="edit"
                      @click.stop="startEditTopic(element)"
                      class="q-ml-sm"
                    />
                  </template>
                </div>
              </div>

              <!-- Chọn topic -->
              <div class="col-1 text-left">
                <q-checkbox v-model="selectedTopics" :val="element" @click.stop v-if="isDeleteMode" />
              </div>
            </q-card-section>

            <!-- Danh sách bài học -->
            <q-slide-transition>
              <div v-show="element.expanded">
                <q-separator />
                <q-card-section class="q-pa-none">
                  <div class="lesson-list">
                    <!-- Nút tạo bài học mới -->
                    <div class="row items-center q-pa-sm">
                      <div class="col-1 text-left"></div>

                      <!-- Tên bài học -->
                      <div class="col-2">
                        <q-input
                          v-model="newLessonName"
                          dense
                          outlined
                          placeholder="New lesson name"
                          @keyup.enter="createLesson(element)"
                          autofocus
                        />
                      </div>

                      <!-- Hình ảnh bài học -->
                      <div class="col-5 text-center">
                        <div class="column items-center">
                          <q-btn
                            outline
                            color="primary"
                            icon="image"
                            @click="$refs.newImageUpload.click()"
                            class="q-mb-sm"
                          />
                          <input
                            type="file"
                            ref="newImageUpload"
                            accept="image/*"
                            style="display: none"
                            @change="handleFileUpload($event)"
                          />
                          <div v-if="newLessonImageURL" class="image-preview">
                            <img
                              :src="newLessonImageURL"
                              alt="Preview"
                              style="max-width: 100px; max-height: 100px; object-fit: contain;"
                              class="rounded-borders"
                            />
                          </div>
                          <q-linear-progress
                            v-if="uploadProgress > 0 && uploadProgress < 100"
                            :value="uploadProgress / 100"
                            color="primary"
                            class="q-mt-sm"
                          />
                        </div>
                      </div>

                      <!-- Nút tạo bài học mới -->
                      <div class="col-3 text-center">
                        <div class="row justify-center">
                          <q-btn
                            flat
                            dense
                            round
                            icon="add"
                            color="positive"
                            @click="createLesson(element)"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Danh sách bài học -->
                    <draggable
                      v-model="getDraggableLessons(element.id).value"
                      group="lessons"
                      item-key="id"
                      handle=".handle"
                      @start="drag=true"
                      @end="drag=false; handleLessonDragEnd(element, getDraggableLessons(element.id).value)"
                      class="lesson-items"
                      :disabled="isDeleteMode"
                    >
                      <!-- Thẻ bài học -->
                      <template #item="{ element: lesson, index }">
                        <div class="row items-center q-pa-sm lesson-item" :class="{ 'selected': selectedLessons.includes(lesson) }">
                          <div class="col-1 text-left">
                            <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
                          </div>
                          <!-- Tên bài học -->
                          <div class="col-2 lesson-name">
                            <template v-if="editingLesson === lesson">
                              <q-input
                                v-model="editingLessonName"
                                dense
                                outlined
                                @keyup.enter="saveLesson(element, lesson)"
                                autofocus
                              />
                            </template>
                            <template v-else>
                              {{ lesson.name }}
                            </template>
                          </div>

                          <!-- Hình ảnh bài học -->
                          <div class="col-5 text-center lesson-image">
                            <template v-if="editingLesson === lesson">
                              <div class="column items-center">
                                <q-btn
                                  outline
                                  color="primary"
                                  icon="image"
                                  @click="$refs.imageUpload.click()"
                                  class="q-mb-sm"
                                />
                                <input
                                  type="file"
                                  ref="imageUpload"
                                  accept="image/*"
                                  style="display: none"
                                  @change="handleFileUpload($event, true)"
                                />
                                <div v-if="editingLessonImageURL" class="image-preview">
                                  <img
                                    :src="editingLessonImageURL"
                                    alt="Preview"
                                    style="max-width: 100px; max-height: 100px; object-fit: contain;"
                                    class="rounded-borders"
                                  />
                                </div>
                                <q-linear-progress
                                  v-if="uploadProgress > 0 && uploadProgress < 100"
                                  :value="uploadProgress / 100"
                                  color="primary"
                                  class="q-mt-sm"
                                />
                              </div>
                            </template>
                            <template v-else>
                              <img
                                :src="lesson.imageURL"
                                alt="lesson image"
                                style="width: 50px; height: 50px; object-fit: cover;"
                                class="rounded-borders"
                                @error="handleImageError"
                              />
                            </template>
                          </div>

                          <!-- Nút thao tác -->
                          <div class="col-3 text-center lesson-actions">
                            <div class="row justify-center">
                              <template v-if="editingLesson === lesson">
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="close"
                                  color="negative"
                                  @click="cancelEditLesson"
                                  class="q-ml-sm"
                                />
                              </template>
                              <template v-else>
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="edit"
                                  @click="startEditLesson(element, lesson)"
                                />
                              </template>
                            </div>
                          </div>
                        </div>
                      </template>
                    </draggable>
                  </div>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </template>
      </draggable>

      <!-- Thêm nút actions cho chế độ xóa -->
      <div class="delete-actions row justify-end q-mt-md" v-if="isDeleteMode">
        <q-btn label="Cancel" color="primary" @click="cancelDeleteMode" class="q-mr-sm" />
        <q-btn
          color="primary"
          label="Delete selected"
          :disable="selectedTopics.length === 0"
          @click="openDeleteConfirmDialog"
        />
      </div>
    </div>

    <!-- Xác nhận xóa -->
    <q-dialog v-model="deleteDialog" persistent transition-show="bounce" transition-hide="fade">
      <q-card
        style="min-width: 400px; max-width: 500px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);"
        class="bg-gradient-red"
      >
        <!-- Icon & tiêu đề cảnh báo -->
        <q-card-section class="column items-center q-pt-md q-px-md">
          <q-icon
            name="warning"
            color="negative"
            size="48px"
            class="q-mb-sm animate-shake"
          />
          <div class="text-center text-h6 text-negative text-weight-bold q-mt-sm">
            Are you sure you want to delete {{ selectedTopics.length > 1 ? 'these topics' : 'this topic' }}?
          </div>
        </q-card-section>

        <!-- Nhập tên xác nhận -->
        <q-card-section v-if="selectedTopics.length > 0" class="q-px-md">
          <div class="text-subtitle2 q-mb-sm text-center text-weight-medium">
            Please enter "{{ selectedTopics[0].name }}" to confirm:
          </div>
          <q-input
            dense
            v-model="confirmTopicName"
            label="Topic Name"
            :rules="[val => val === selectedTopics[0].name || 'Topic name does not match']"
            autofocus
            outlined
            class="q-mx-sm"
            color="negative"
          />
        </q-card-section>

        <!-- Hành động -->
        <q-card-actions align="right" class="q-pa-sm">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="cancelDelete"
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Delete"
            color="negative"
            v-close-popup
            @click="confirmDelete"
            :disable="!canDelete"
            :loading="isDeleting"
            class="shadow-2"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Warning dialog -->
    <q-dialog v-model="deleteWarningDialog" persistent transition-show="scale" transition-hide="fade">
      <q-card
        style="min-width: 400px; max-width: 500px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);"
        class="bg-gradient-red"
      >
        <q-card-section class="column items-center q-pt-md q-px-md">
          <q-icon
            name="warning"
            color="negative"
            size="48px"
            class="q-mb-sm animate-shake"
          />
          <div class="text-center text-h5 text-negative text-weight-bold q-mt-sm">
            WARNING
          </div>
          <div class="text-center text-h6 text-negative text-weight-bold q-mt-sm">
            This action will permanently delete all topics and their lessons.
          </div>
        </q-card-section>

        <q-card-section class="q-px-md q-pt-none q-pb-sm">
          <p class="text-center text-negative text-bold q-mt-md">
            Are you absolutely sure you want to continue?
          </p>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-sm">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            class="q-mr-sm"
          />
          <q-btn
            unelevated
            label="Yes, continue"
            color="negative"
            v-close-popup
            @click="activateDeleteMode"
            class="shadow-2"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </div>
</template>

<script>
import { defineComponent, computed, ref } from 'vue'
import { useTopicStore } from '../../stores/topic'
import { useFileStore } from '../../stores/file'
import { Notify } from 'quasar'
import draggable from 'vuedraggable'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'TopicTable',
  components: {
    draggable
  },

  setup() {
    const topicStore = useTopicStore()
    const fileStore = useFileStore()
    const deleteType = ref('topic')

    const filter = ref('')
    const drag = ref(false)

    // Cột hiển thị
    const visibleColumns = ref({
      topicName: true,
      status: true,
      actions: true
    })

    // Topic states
    const selectedTopic = ref(null)
    const editingTopic = ref(null)
    const editingTopicName = ref('')
    const editingTopicStatus = ref('draft')
    const newTopicName = ref('')
    const newTopicStatus = ref('draft')
    const isCreatingTopic = ref(false)
    const isCreatingLesson = ref({})

    // Lesson states
    const selectedLesson = ref(null)
    const editingLesson = ref(null)
    const editingLessonName = ref('')
    const editingLessonImageURL = ref('')
    const newLessonName = ref('')
    const newLessonImageURL = ref('')
    const uploadProgress = computed(() => fileStore.uploadProgress)

    // Trạng thái
    const statusOptions = [
      { label: 'Draft', value: 'draft' },
      { label: 'Approved', value: 'approved' },
    ]

    // Danh sách topic
    const topics = computed(() => topicStore.topics)

    // Lọc topic
    const filteredTopics = computed({
      get: () => {
        let filtered = topics.value

        if (filter.value) {
          const searchTerm = filter.value.toLowerCase()
          filtered = filtered.filter(topic =>
            topic.name.toLowerCase().includes(searchTerm)
          )
        }

        return filtered
      },
      set: (value) => {
        topicStore.reorderTopics(value)
      }
    })

    // Tạo topic
    const createTopic = async () => {
      if (newTopicName.value.trim()) {
        try {
          // Tính toán order mới dựa trên order lớn nhất trong danh sách
          const maxOrder = Math.max(...topics.value.map(topic => topic.order || 0), 0)
          const newOrder = maxOrder + 1

          await topicStore.createTopic({
            name: newTopicName.value.trim(),
            status: newTopicStatus.value,
            order: newOrder
          });

          // Reset form
          newTopicName.value = '';
          newTopicStatus.value = 'draft';

          // Tải lại danh sách topic để hiển thị topic mới ở đầu
          await loadTopics();
        } catch (error) {
          console.error('Failed to create topic:', error);
        }
      }
    }

    // Tạo bài học
    const createLesson = async (topic) => {
      if (newLessonName.value.trim()) {
        try {
          const response = await topicStore.createLesson(topic.id, {
            name: newLessonName.value.trim(),
            image_url: newLessonImageURL.value || null
          });

          if (response.code === 200) {
            // Tải lại danh sách bài học của topic
            await loadLessons(topic.id);

            // Reset form
            newLessonName.value = '';
            newLessonImageURL.value = '';

            Notify.create({
              type: 'positive',
              message: 'Lesson created successfully'
            });
          }
        } catch (error) {
          console.error('Failed to create lesson:', error);
          Notify.create({
            type: 'negative',
            message: 'Failed to create lesson'
          });
        }
      }
    }

    // Cập nhật trạng thái topic
    const updateTopicStatus = (topic) => {
      topicStore.updateTopic({
        ...topic,
        id: topic.id.toString(),
        status: topic.status
      })
    }

    // Tạo bài học
    const toggleTopic = async (topic) => {
      topic.expanded = !topic.expanded;
      if (topic.expanded) {
        try {
          const lessons = await loadLessons(topic.id);
          // Khởi tạo topicLessons cho topic này
          if (!topicLessons.value[topic.id]) {
            topicLessons.value[topic.id] = lessons;
          }
        } catch (error) {
          console.error('Failed to fetch lessons:', error);
          Notify.create({
            type: 'negative',
            message: 'Failed to load lessons'
          });
        }
      }
    }

    // Lấy màu trạng thái
    const getStatusColor = (status) => {
      switch (status) {
        case 'draft': return 'grey'
        case 'approved': return 'green'
        default: return 'grey'
      }
    }

    // Lấy nhãn trạng thái
    const getStatusLabel = (status) => {
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.label : status
    }

    // Xử lý lỗi hình ảnh
    const handleImageError = (event) => {
      event.target.src = 'https://placehold.co/50x50/png?text=No+Img'
    }

    // Cập nhật thứ tự bài học
    const updateLessonOrder = (topic) => {
      if (topic.lessons) {
        topic.lessons.forEach((lesson, index) => {
          lesson.order = index + 1
        })
      }
    }

    // Chỉnh sửa topic
    const startEditTopic = (topic) => {
      editingTopic.value = topic;
      editingTopicName.value = topic.name;
      editingTopicStatus.value = topic.status;
    };

    const isUpdating = ref(false)

    // Lưu topic
    const saveTopic = async (topic) => {
      if (editingTopicName.value.trim() || editingTopicStatus.value !== topic.status) {
        isUpdating.value = true;
        try {
          await topicStore.updateTopic({
            ...topic,
            name: editingTopicName.value.trim() || topic.name,
            status: editingTopicStatus.value
          });
          cancelEditTopic();
        } catch (error) {
          console.error('Failed to update topic:', error);
        } finally {
          isUpdating.value = false;
        }
      } else {
        cancelEditTopic();
      }
    };

    // Hủy chỉnh sửa topic
    const cancelEditTopic = () => {
      editingTopic.value = null;
      editingTopicName.value = '';
      editingTopicStatus.value = 'draft';
    };

    // Chỉnh sửa bài học
    const startEditLesson = (topic, lesson) => {
      editingLesson.value = lesson
      editingLessonName.value = lesson.name
      editingLessonImageURL.value = lesson.imageURL
    }

    // Lưu bài học
    const saveLesson = async (topic, lesson) => {
      if (editingLessonName.value.trim()) {
        try {
          const response = await topicStore.updateLesson(topic.id, {
            ...lesson,
            id: lesson.id,
            name: editingLessonName.value.trim(),
            image_url: editingLessonImageURL.value || lesson.image_url,
            order: lesson.order || 0
          });

          if (response.code === 200) {
            // Cập nhật bài học trong danh sách bài học của topic
            if (topicLessons.value[topic.id]) {
              const index = topicLessons.value[topic.id].findIndex(l => l.id === lesson.id);
              if (index !== -1) {
                topicLessons.value[topic.id][index] = {
                  ...topicLessons.value[topic.id][index],
                  name: editingLessonName.value.trim(),
                  image_url: editingLessonImageURL.value || lesson.image_url
                };
              }
            }

            // Hủy chỉnh sửa bài học
            cancelEditLesson();
            Notify.create({
              type: 'positive',
              message: 'Lesson updated successfully'
            });
          }
        } catch (error) {
          console.error('Failed to update lesson:', error);
          Notify.create({
            type: 'negative',
            message: 'Failed to update lesson'
          });
        }
      } else {
        cancelEditLesson();
      }
    };

    // Xóa bài học
    const deleteLesson = async (topicId, lessonId) => {
      try {
        const response = await topicStore.deleteLesson(topicId, lessonId);
        if (response.code === 200) {
          // Xóa bài học khỏi danh sách bài học của topic
          if (topicLessons.value[topicId]) {
            topicLessons.value[topicId] = topicLessons.value[topicId].filter(l => l.id !== lessonId);
          }

          Notify.create({
            type: 'positive',
            message: 'Lesson deleted successfully'
          });
        }
      } catch (error) {
        console.error('Failed to delete lesson:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to delete lesson'
        });
      }
    };

    const cancelEditLesson = () => {
      editingLesson.value = null
      editingLessonName.value = ''
      editingLessonImageURL.value = ''
    }

    // Chế độ xóa
    const isDeleteMode = ref(false)
    const selectedTopics = ref([])
    const selectedLessons = ref([])
    const selectAll = ref(false)
    const confirmTopicName = ref('')
    const deleteDialog = ref(false)
    const isDeleting = ref(false)

    const canDelete = computed(() => {
      if (selectedTopics.value.length === 0) return false
      return confirmTopicName.value === selectedTopics.value[0].name
    })

    // Chuyển chế độ xóa
    const toggleDeleteMode = () => {
      isDeleteMode.value = !isDeleteMode.value
      if (!isDeleteMode.value) {
        selectedTopics.value = []
        selectAll.value = false
      }
    }

    // Chọn tất cả
    const toggleSelectAll = (value) => {
      if (value) {
        selectedTopics.value = [...filteredTopics.value]
      } else {
        selectedTopics.value = []
      }
    }

    // Hủy xóa
    const cancelDelete = () => {
      confirmTopicName.value = ''
    }

    // Xác nhận xóa
    const confirmDelete = async () => {
      if (selectedTopics.value.length > 0) {
        isDeleting.value = true;
        try {
          for (const topic of selectedTopics.value) {
            await topicStore.deleteTopic(topic.id);
          }
          Notify.create({
            type: 'positive',
            message: 'Topics deleted successfully'
          });
          toggleDeleteMode();
          confirmTopicName.value = '';
        } catch (error) {
          console.error('Failed to delete topics:', error);
        } finally {
          isDeleting.value = false;
        }
      }
    }

    // Xử lý tải lên hình ảnh
    const handleFileUpload = async (event, isEditing = false) => {
      const file = event.target.files[0]
      if (!file) return

      try {
        const imageUrl = await fileStore.uploadFile(file)
        if (isEditing) {
          editingLessonImageURL.value = imageUrl
        } else {
          newLessonImageURL.value = imageUrl
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    // Sắp xếp
    const sortOrder = ref('desc')
    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      loadTopics()
    }

    // Xử lý tìm kiếm
    const handleSearch = debounce(async () => {
      await topicStore.fetchTopics({
        sort: sortOrder.value,
        search: filter.value
      })
    }, 300)

    // Tải topic
    const loadTopics = async () => {
      try {
        await topicStore.fetchTopics({
          sort: sortOrder.value,
          search: filter.value
        });
      } catch (error) {
        console.error('Failed to load topics:', error);
        Notify.create({
          type: 'negative',
          message: 'Failed to load topics. Please try again later.'
        });
      }
    }

    // Tải bài học
    const loadLessons = async (topicId) => {
      try {
        const response = await topicStore.fetchLessons(topicId)

        if (response.detail) {
          // Cập nhật danh sách bài học
          if (!topicLessons.value[topicId]) {
            topicLessons.value[topicId] = []
          }
          topicLessons.value[topicId] = response.detail.rows || []
        }

        return response.detail?.rows || []
      } catch (error) {
        console.error('Failed to load lessons:', error)
        return []
      }
    }

    const topicLessons = ref({})

    // Lấy danh sách bài học của topic
    const getTopicLessons = (topicId) => {
      if (!topicLessons.value[topicId]) {
        topicLessons.value[topicId] = topicStore.lessons[topicId] || []
      }
      return topicLessons.value[topicId]
    }

    // Lấy danh sách bài học có thể sắp xếp
    const getDraggableLessons = (topicId) => computed({
      get: () => topicLessons.value[topicId] || [],
      set: (value) => {
        topicLessons.value[topicId] = value
      }
    })

    // Sắp xếp topic
    const debouncedReorder = debounce((topics) => {
      topicStore.reorderTopics(topics);
    }, 1000);

    // Sắp xếp topic
    const handleDragEnd = (topics) => {
      // Cập nhật trạng thái local ngay lập tức
      topicStore.topics = topics.map((topic, index) => ({
        ...topic,
        order: index + 1
      }));

      // Debounce the API call
      debouncedReorder(topics);
    };

    // Sắp xếp bài học
    const debouncedReorderLessons = debounce((topicId, lessons) => {
      topicStore.reorderLessons(topicId, lessons);
    }, 1000);

    const handleLessonDragEnd = (topic, lessons) => {
      // Cập nhật trạng thái local ngay lập tức
      topicLessons.value[topic.id] = lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }));

      // Sắp xếp bài học
      debouncedReorderLessons(topic.id, lessons);
    };

    // Khởi tạo
    loadTopics()

    // Thêm các biến state mới
    const deleteWarningDialog = ref(false)

    // Function hiển thị cảnh báo ban đầu
    const showDeleteWarning = () => {
      deleteWarningDialog.value = true
    }

    // Function kích hoạt chế độ xóa
    const activateDeleteMode = () => {
      isDeleteMode.value = true
      selectedTopics.value = []
      selectAll.value = false
    }

    // Function hủy chế độ xóa
    const cancelDeleteMode = () => {
      isDeleteMode.value = false
      selectedTopics.value = []
      selectAll.value = false
    }

    // Function mở dialog xác nhận xóa
    const openDeleteConfirmDialog = () => {
      if (selectedTopics.value.length > 0) {
        confirmTopicName.value = ''
        deleteDialog.value = true
      }
    }

    return {
      topics,
      filteredTopics,
      filter,
      drag,
      visibleColumns,
      toggleTopic,
      getStatusColor,
      getStatusLabel,
      handleImageError,
      updateLessonOrder,
      updateTopicStatus,
      isUpdating,
      // Chế độ xóa
      isDeleteMode,
      selectedTopics,
      selectedLessons,
      selectAll,
      confirmTopicName,
      canDelete,
      toggleDeleteMode,
      toggleSelectAll,
      cancelDelete,
      confirmDelete,
      isDeleting,

      // Chỉnh sửa topic
      editingTopic,
      editingTopicName,
      editingTopicStatus,
      statusOptions,
      startEditTopic,
      saveTopic,
      cancelEditTopic,
      // Tạo topic/bài học
      newTopicName,
      newTopicStatus,
      newLessonName,
      newLessonImageURL,
      isCreatingTopic,
      isCreatingLesson,
      createTopic,
      createLesson,
      // Chỉnh sửa bài học
      editingLesson,
      editingLessonName,
      editingLessonImageURL,
      startEditLesson,
      saveLesson,
      cancelEditLesson,
      // Xác nhận xóa
      deleteDialog,
      uploadProgress,
      handleFileUpload,
      // Sắp xếp
      sortOrder,
      toggleSortOrder,
      handleSearch,
      loadTopics,
      getTopicLessons,
      handleDragEnd,
      handleLessonDragEnd,
      topicLessons,
      getDraggableLessons,
      deleteWarningDialog,
      showDeleteWarning,
      activateDeleteMode,
      cancelDeleteMode,
      openDeleteConfirmDialog
    }
  }
})
</script>

<style scoped>
/* Thêm style này vào phần <style> của component */
.q-pa-md {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.row.q-mb-md, .row.items-center.q-pa-sm {
  flex: 0 0 auto;
}

.topic-list {
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.topic-header {
  flex: 0 0 auto;
}

.topic-items {
  overflow-y: auto;
  flex: 1 1 auto;
}

/* Topic list */
.topic-list {
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Header */
.topic-header, .lesson-header {
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

/* Topic items */
.topic-items, .lesson-items {
  min-height: 50px;
}

/* Lesson list */
.lesson-list {
  border: 1px solid #eee;
  margin: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

/* Lesson item */
.lesson-item {
  border-bottom: 1px solid #eee;
  background-color: #ffffff;
}

/* Last lesson item */
.lesson-item:last-child {
  border-bottom: none;
}

/* Handle */
.handle {
  cursor: move;
  cursor: -webkit-grabbing;
  color: #666;
  transition: color 0.3s;
}

/* Handle hover */
.handle:hover {
  color: #000;
}

/* Card transition */
.q-card {
  transition: all 0.3s;
}

/* Card hover */
.q-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Header select */
.header-select :deep(.q-field__label) {
  font-weight: bold;
}

/* Header select native */
.header-select :deep(.q-field__native) {
  font-weight: bold;
}

/* Status filter */
.status-filter {
  position: relative;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Status label */
.status-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  height: 100%;
  width: 100%;
}

/* Status label icon */
.status-label .q-icon {
  margin-left: 4px;
  font-size: 16px;
}

/* Status menu */
.status-menu {
  z-index: 1000;
}

/* Status menu item */
.status-menu .q-item {
  min-height: 32px;
  padding: 4px 16px;
  cursor: pointer;
}

/* Status menu item hover */
.status-menu .q-item:hover {
  background-color: #f5f5f5;
}

/* Status menu item section */
.status-menu .q-item-section {
  padding: 0;
}

/* Status display */
.status-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

/* Status dot */
.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

/* Status text */
.status-text {
  text-transform: capitalize;
  font-weight: 500;
  text-align: center;
}

/* Lesson name */
.lesson-name {
  padding-left: 20px;
  font-size: 14px;
}

/* Topic name */
.topic-name {
  font-size: 16px;
  font-weight: bold;
}

/* Lesson image */
.lesson-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Lesson actions */
.lesson-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Selected lesson */
.q-card.selected {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}

/* Selected lesson */
.lesson-item.selected {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}

/* New button */
.new-button {
  border-radius: 20px;
  animation: pulse 2s infinite;
  padding: 8px 24px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* New button pulse */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
}

/* Linear progress */
.q-linear-progress {
  margin-left: 8px;
}

/* Image preview */
.image-preview {
  margin-top: 8px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

/* Image preview img */
.image-preview img {
  display: block;
  margin: 0 auto;
}

/* Thêm vào phần CSS */
.full-width {
  width: 100%;
}

/* Đối với màn hình nhỏ, điều chỉnh layout */
@media (max-width: 600px) {
  .row.q-mb-md.items-center {
    flex-direction: column;
  }

  .row.q-mb-md.items-center > div {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
    margin-bottom: 8px;
  }
}

/* Gradient nền đỏ nhạt */
.bg-gradient-red {
  background: linear-gradient(145deg, #fff, #ffe6e6);
}

/* Hiệu ứng rung nhẹ cho biểu tượng */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}
.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
