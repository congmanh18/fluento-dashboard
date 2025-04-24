<template>
  <div class="q-pa-md">

    <!-- Thanh tìm kiếm, nút chọn ẩn/hiện cột và xóa -->
    <div class="row q-mb-md items-center">
      <div class="col-8">
        <q-input
          v-model="filter"
          dense
          outlined
          label="Search dialogue name"
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
          label="Delete Dialogue"
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
                <q-item-label>Dialogue</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.dialogueName" />
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

    <!-- Danh sách dialogue -->
    <div class="dialogue-list">
      <div class="dialogue-header row items-center q-pa-sm bg-grey-2">
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

        <!-- Tên Dialogue -->
        <div class="col-5" v-if="visibleColumns.dialogueName">Dialogue</div>

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

      <!-- Nút tạo dialogue mới -->
      <div class="row items-center q-pa-sm">
        <div class="col-1 text-left"></div>
        <div class="col-5" v-if="visibleColumns.dialogueName">
          <q-input
            v-model="newDialogueName"
            dense
            outlined
            placeholder="New dialogue name"
            @keyup.enter="createDialogue"
            autofocus
          />
        </div>

        <!-- Trạng thái -->
        <div class="col-3 text-left" v-if="visibleColumns.status">
          <div class="row q-gutter-sm justify-center">
            <q-radio
              v-model="newDialogueStatus"
              val="draft"
              label="Draft"
              color="grey"
            />
            <q-radio
              v-model="newDialogueStatus"
              val="approved"
              label="Approved"
              color="positive"
            />
          </div>
        </div>

        <!-- Nút tạo dialogue mới -->
        <div class="col-2 text-center" v-if="visibleColumns.actions">
          <div class="row justify-center">
            <q-btn
              flat
              dense
              round
              icon="add"
              color="positive"
              @click="createDialogue"
            />
          </div>
        </div>
      </div>

      <!-- Danh sách dialogue -->
      <draggable
        v-model="filteredDialogues"
        group="dialogues"
        item-key="id"
        handle=".handle"
        @start="drag=true"
        @end="drag=false"
        class="dialogue-items"
        :disabled="isDeleteMode"
      >
        <!-- Thẻ dialogue -->
        <template #item="{ element }">
          <q-card flat bordered class="q-mb-sm" :class="{ 'selected': selectedDialogues.includes(element) }">
            <q-card-section
              class="row items-center cursor-pointer"
              @click="!editingDialogue && toggleDialogue(element)"
            >
              <div class="col-1 text-left">
                <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
              </div>

              <!-- Tên dialogue -->
              <div class="col-5 dialogue-name" v-if="visibleColumns.dialogueName">
                <template v-if="editingDialogue === element">
                  <q-input
                    v-model="editingDialogueName"
                    dense
                    outlined
                    @keyup.enter="saveDialogue(element)"
                    autofocus
                  />
                </template>
                <template v-else>
                  {{ element.name }}
                </template>
              </div>

              <!-- Trạng thái -->
              <div class="col-3 text-left" v-if="visibleColumns.status">
                <template v-if="editingDialogue === element">
                  <div class="row q-gutter-sm justify-center">
                    <q-radio
                      v-model="editingDialogueStatus"
                      val="draft"
                      label="Draft"
                      color="grey"
                      @click.stop
                    />
                    <q-radio
                      v-model="editingDialogueStatus"
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
                  <template v-if="editingDialogue === element">
                    <q-btn
                      flat
                      dense
                      round
                      icon="close"
                      color="negative"
                      @click.stop="cancelEditDialogue"
                      class="q-ml-sm"
                    />
                    <q-btn
                      flat
                      dense
                      round
                      icon="check"
                      color="positive"
                      @click.stop="saveDialogue(element)"
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
                      @click.stop="startEditDialogue(element)"
                      class="q-ml-sm"
                    />
                  </template>
                </div>
              </div>

              <!-- Chọn dialogue -->
              <div class="col-1 text-left">
                <q-checkbox v-model="selectedDialogues" :val="element" @click.stop v-if="isDeleteMode" />
              </div>
            </q-card-section>

            <!-- Danh sách dialog -->
            <q-slide-transition>
              <div v-show="element.expanded">
                <q-separator />
                <q-card-section class="q-pa-none">
                  <div class="dialog-list">
                    <!-- Nút tạo dialog mới -->
                    <div class="row items-center q-pa-sm">
                      <div class="col-1 text-left"></div>

                      <!-- Tên dialog -->
                      <div class="col-2">
                        <q-input
                          v-model="newDialogName"
                          dense
                          outlined
                          placeholder="New dialog name"
                          @keyup.enter="createDialog(element)"
                          autofocus
                        />
                      </div>

                      <!-- Hình ảnh dialog -->
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
                          <div v-if="newDialogImageURL" class="image-preview">
                            <img
                              :src="newDialogImageURL"
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

                      <!-- Nút tạo dialog mới -->
                      <div class="col-3 text-center">
                        <div class="row justify-center">
                          <q-btn
                            flat
                            dense
                            round
                            icon="add"
                            color="positive"
                            @click="createDialog(element)"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Danh sách dialog -->
                    <draggable
                      v-model="getDraggableDialogs(element.id).value"
                      group="dialogs"
                      item-key="id"
                      handle=".handle"
                      @start="drag=true"
                      @end="drag=false; handleDialogDragEnd(element, getDraggableDialogs(element.id).value)"
                      class="dialog-items"
                      :disabled="isDeleteMode"
                    >
                      <!-- Thẻ dialog -->
                      <template #item="{ element: dialog, index }">
                        <div class="row items-center q-pa-sm dialog-item" :class="{ 'selected': selectedDialogs.includes(dialog) }">
                          <div class="col-1 text-left">
                            <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
                          </div>
                          <!-- Tên dialog -->
                          <div class="col-2 dialog-name">
                            <template v-if="editingDialog === dialog">
                              <q-input
                                v-model="editingDialogName"
                                dense
                                outlined
                                @keyup.enter="saveDialog(element, dialog)"
                                autofocus
                              />
                            </template>
                            <template v-else>
                              {{ dialog.name }}
                            </template>
                          </div>

                          <!-- Hình ảnh dialog -->
                          <div class="col-5 text-center dialog-image">
                            <template v-if="editingDialog === dialog">
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
                                <div v-if="editingDialogImageURL" class="image-preview">
                                  <img
                                    :src="editingDialogImageURL"
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
                                :src="dialog.imageURL"
                                alt="dialog image"
                                style="width: 50px; height: 50px; object-fit: cover;"
                                class="rounded-borders"
                                @error="handleImageError"
                              />
                            </template>
                          </div>

                          <!-- Nút thao tác -->
                          <div class="col-3 text-center dialog-actions">
                            <div class="row justify-center">
                              <template v-if="editingDialog === dialog">
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="close"
                                  color="negative"
                                  @click="cancelEditDialog"
                                  class="q-ml-sm"
                                />
                              </template>
                              <template v-else>
                                <q-btn
                                  flat
                                  dense
                                  round
                                  icon="edit"
                                  @click="startEditDialog(element, dialog)"
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
          :disable="selectedDialogues.length === 0"
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
            Are you sure you want to delete {{ selectedDialogues.length > 1 ? 'these dialogues' : 'this dialogue' }}?
          </div>
        </q-card-section>

        <!-- Nhập tên xác nhận -->
        <q-card-section v-if="selectedDialogues.length > 0" class="q-px-md">
          <div class="text-subtitle2 q-mb-sm text-center text-weight-medium">
            Please enter "{{ selectedDialogues[0].name }}" to confirm:
          </div>
          <q-input
            dense
            v-model="confirmDialogueName"
            label="Dialogue Name"
            :rules="[val => val === selectedDialogues[0].name || 'Dialogue name does not match']"
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
            This action will permanently delete all dialogues and their dialogs.
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
import { useDialogStore } from '../stores/dialogStore'
import { useFileStore } from '../stores/fileStore'
import { Notify } from 'quasar'
import draggable from 'vuedraggable'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'DialogTable',
  components: {
    draggable
  },

  setup() {
    // Initialize stores
    const dialogStore = useDialogStore()
    const fileStore = useFileStore()

    // Basic state variables
    const filter = ref('')
    const drag = ref(false)
    const sortOrder = ref('desc')
    const isDeleteMode = ref(false)
    const deleteDialog = ref(false)
    const deleteWarningDialog = ref(false)
    const isDeleting = ref(false)
    const isUpdating = ref(false)
    const selectAll = ref(false)
    const selectedDialogues = ref([])
    const selectedDialogs = ref([])
    const confirmDialogueName = ref('')

    // Column visibility
    const visibleColumns = ref({
      dialogueName: true,
      status: true,
      actions: true
    })

    // Dialogue states
    const selectedDialogue = ref(null)
    const editingDialogue = ref(null)
    const editingDialogueName = ref('')
    const editingDialogueStatus = ref('draft')
    const newDialogueName = ref('')
    const newDialogueStatus = ref('draft')
    const isCreatingDialogue = ref(false)
    const isCreatingDialog = ref({})

    // Dialog states
    const selectedDialog = ref(null)
    const editingDialog = ref(null)
    const editingDialogName = ref('')
    const editingDialogImageURL = ref('')
    const newDialogName = ref('')
    const newDialogImageURL = ref('')
    const uploadProgress = computed(() => fileStore.uploadProgress)

    // Status options
    const statusOptions = [
      { label: 'Draft', value: 'draft' },
      { label: 'Approved', value: 'approved' },
    ]

    // Mock data for dialogues
    const dialogues = ref([
      {
        id: 1,
        name: 'Sample Dialogue 1',
        status: 'draft',
        expanded: false
      },
      {
        id: 2,
        name: 'Sample Dialogue 2',
        status: 'approved',
        expanded: false
      }
    ])

    // Mock data for dialogs
    const dialogueDialogs = ref({
      1: [
        {
          id: 1,
          name: 'Sample Dialog 1',
          imageURL: 'https://placehold.co/50x50/png?text=Img1'
        }
      ],
      2: [
        {
          id: 2,
          name: 'Sample Dialog 2',
          imageURL: 'https://placehold.co/50x50/png?text=Img2'
        }
      ]
    })

    // Computed properties
    const filteredDialogues = computed({
      get: () => dialogues.value,
      set: (value) => {
        // Mock reorder functionality
        dialogues.value = value
      }
    })

    // Mock functions
    const createDialogue = () => {
      console.log('Create dialogue:', newDialogueName.value, newDialogueStatus.value)
    }

    const createDialog = () => {
      console.log('Create dialog:', newDialogName.value, newDialogImageURL.value)
    }

    const updateDialogueStatus = () => {
      console.log('Update dialogue status')
    }

    const toggleDialogue = (dialogue) => {
      dialogue.expanded = !dialogue.expanded
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'draft': return 'grey'
        case 'approved': return 'green'
        default: return 'grey'
      }
    }

    const getStatusLabel = (status) => {
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.label : status
    }

    const handleImageError = (event) => {
      event.target.src = 'https://placehold.co/50x50/png?text=No+Img'
    }

    const startEditDialogue = (dialogue) => {
      console.log('Start edit dialogue:', dialogue)
    }

    const saveDialogue = () => {
      console.log('Save dialogue')
    }

    const cancelEditDialogue = () => {
      console.log('Cancel edit dialogue')
    }

    const startEditDialog = () => {
      console.log('Start edit dialog')
    }

    const saveDialog = () => {
      console.log('Save dialog')
    }

    const cancelEditDialog = () => {
      console.log('Cancel edit dialog')
    }

    const handleFileUpload = () => {
      console.log('Handle file upload')
    }

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    }

    const handleSearch = () => {
      console.log('Handle search:', filter.value)
    }

    const loadDialogues = () => {
      console.log('Load dialogues')
    }

    const loadDialogs = () => {
      console.log('Load dialogs')
    }

    const getDialogueDialogs = (dialogueId) => {
      return dialogueDialogs.value[dialogueId] || []
    }

    const getDraggableDialogs = (dialogueId) => computed({
      get: () => dialogueDialogs.value[dialogueId] || [],
      set: (value) => {
        dialogueDialogs.value[dialogueId] = value
      }
    })

    const handleDragEnd = () => {
      console.log('Handle drag end')
    }

    const handleDialogDragEnd = () => {
      console.log('Handle dialog drag end')
    }

    const showDeleteWarning = () => {
      deleteWarningDialog.value = true
    }

    const activateDeleteMode = () => {
      isDeleteMode.value = true
    }

    const cancelDeleteMode = () => {
      isDeleteMode.value = false
    }

    const openDeleteConfirmDialog = () => {
      deleteDialog.value = true
    }

    const toggleSelectAll = (value) => {
      if (value) {
        selectedDialogues.value = [...dialogues.value]
      } else {
        selectedDialogues.value = []
      }
    }

    const cancelDelete = () => {
      confirmDialogueName.value = ''
    }

    const confirmDelete = () => {
      console.log('Confirm delete')
    }

    const canDelete = computed(() => {
      if (selectedDialogues.value.length === 0) return false
      return confirmDialogueName.value === selectedDialogues.value[0].name
    })

    return {
      // State variables
      dialogues,
      filteredDialogues,
      filter,
      drag,
      visibleColumns,
      sortOrder,
      isDeleteMode,
      deleteDialog,
      deleteWarningDialog,
      isDeleting,
      isUpdating,
      selectAll,
      selectedDialogues,
      selectedDialogs,
      confirmDialogueName,
      canDelete,

      // Dialogue states
      selectedDialogue,
      editingDialogue,
      editingDialogueName,
      editingDialogueStatus,
      newDialogueName,
      newDialogueStatus,
      isCreatingDialogue,
      isCreatingDialog,

      // Dialog states
      selectedDialog,
      editingDialog,
      editingDialogName,
      editingDialogImageURL,
      newDialogName,
      newDialogImageURL,
      uploadProgress,

      // Options
      statusOptions,

      // Functions
      createDialogue,
      createDialog,
      updateDialogueStatus,
      toggleDialogue,
      getStatusColor,
      getStatusLabel,
      handleImageError,
      startEditDialogue,
      saveDialogue,
      cancelEditDialogue,
      startEditDialog,
      saveDialog,
      cancelEditDialog,
      handleFileUpload,
      toggleSortOrder,
      handleSearch,
      loadDialogues,
      loadDialogs,
      getDialogueDialogs,
      getDraggableDialogs,
      handleDragEnd,
      handleDialogDragEnd,
      showDeleteWarning,
      activateDeleteMode,
      cancelDeleteMode,
      openDeleteConfirmDialog,
      toggleSelectAll,
      cancelDelete,
      confirmDelete
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
