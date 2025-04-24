<template>
  <div class="q-pa-md">
    <!-- Top controls -->
    <div class="row q-mb-md items-center">
      <div class="col-4">
      </div>
      <div class="col-4">
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
                <q-item-label>Dialog Result</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.dialogResult" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Vocabulary</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.vocabulary" />
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

    <!-- Main content area -->
    <div class="row q-col-gutter-md">
      <!-- Column 1: Prompt -->
      <div class="col-4">
        <q-card class="full-height">
          <q-card-section class="column full-height">
            <div class="column q-gutter-md prompt-container">
              <q-select
                v-model="selectedTopic"
                :options="topicOptions"
                label="Select Topic"
                outlined
                dense
                emit-value
                map-options
              />
              <q-select
                v-model="selectedLesson"
                :options="lessonOptions"
                label="Select Lesson"
                outlined
                dense
                emit-value
                map-options
              />
              <q-input
                v-model="prompt"
                type="textarea"
                outlined
                dense
                autogrow
                :placeholder="defaultPrompt"
                class="prompt-input"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Column 2: Settings -->
      <div class="col-4">
        <q-card class="full-height">
          <q-card-section class="column full-height">
            <div class="settings-container">
              <!-- Row 1: AI Model & Level -->
              <div class="settings-row">
                <div>
                  <q-select
                    v-model="settings.modelAI"
                    :options="modelAIOptions"
                    label="AI Model"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
                <div>
                  <q-select
                    v-model="settings.level"
                    :options="levelOptions"
                    label="Level"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
              </div>

              <!-- Row 2: Character 1 & Character 2 -->
              <div class="settings-row">
                <div>
                  <q-select
                    v-model="settings.character1"
                    :options="characterOptions"
                    label="Character 1"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
                <div>
                  <q-select
                    v-model="settings.character2"
                    :options="characterOptions"
                    label="Character 2"
                    outlined
                    dense
                    emit-value
                    map-options
                  />
                </div>
              </div>

              <!-- Row 3: Sentence Count & Generate -->
              <div class="settings-row">
                <div>
                  <q-input
                    v-model="settings.sentenceCount"
                    type="number"
                    outlined
                    dense
                    label="Sentence Count"
                    :min="1"
                    :max="20"
                  />
                </div>
                <div>
                  <q-btn
                    color="primary"
                    label="Generate"
                    @click="generateDialogue"
                    :loading="isGenerating"
                    class="full-width"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Column 3: Preview -->
      <div class="col-4">
        <q-card class="full-height">
          <q-card-section class="column full-height">
            <div class="preview-content">
              <template v-if="previewDialog.length > 0">
                <div
                  v-for="(line, index) in previewDialog"
                  :key="index"
                  class="q-mb-sm"
                >
                  <span class="text-weight-bold">{{ line.speaker }}:</span>
                  {{ line.text }}
                </div>
              </template>
              <template v-else>
                <div class="text-grey text-center q-pa-md">
                  No preview available. Please generate a dialogue.
                </div>
              </template>
            </div>
            <div class="q-mt-auto">
              <q-btn
                color="primary"
                label="Submit"
                class="full-width"
                @click="submitDialogue"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>


    <!-- Dialog list -->
    <div class="dialogue-list q-mt-md">
      <div class="dialogue-header row items-center">
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

        <!-- Dialog Result -->
        <div class="col-3" v-if="visibleColumns.dialogResult">
          <div class="text-weight-bold">Dialog Result</div>
        </div>

        <!-- Vocabulary Sub-columns -->
        <div class="col-1" v-if="visibleColumns.word_text">
          <div class="text-weight-bold">Word</div>
        </div>
        <div class="col-1" v-if="visibleColumns.part_of_speech">
          <div class="text-weight-bold">Part of Speech</div>
        </div>
        <div class="col-1" v-if="visibleColumns.phonetic">
          <div class="text-weight-bold">Phonetic</div>
        </div>
        <div class="col-1" v-if="visibleColumns.definition">
          <div class="text-weight-bold">Definition</div>
        </div>
        <div class="col-1" v-if="visibleColumns.usage_note">
          <div class="text-weight-bold">Usage Note</div>
        </div>
        <div class="col-1" v-if="visibleColumns.example">
          <div class="text-weight-bold">Example</div>
        </div>

        <!-- Actions -->
        <div class="col-1" v-if="visibleColumns.actions">
          <div class="text-weight-bold text-center">Actions</div>
        </div>

        <!-- Checkbox -->
        <div class="col-1 text-left" v-if="isDeleteMode">
          <q-checkbox v-model="selectAll" @update:model-value="toggleSelectAll" />
        </div>
        <div class="col-1 text-left" v-else></div>
      </div>

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
        <template #item="{ element }">
          <q-card flat bordered class="q-mb-sm" :class="{ 'selected': selectedDialogues.includes(element) }">
            <q-card-section class="row">
              <div class="col-1 handle-cell">
                <q-icon name="drag_indicator" class="handle cursor-move" style="font-size: 24px;" />
              </div>

              <!-- Dialog Result -->
              <div class="col-3 dialog-cell" v-if="visibleColumns.dialogResult">
                <div class="dialog-result">
                  <div v-for="(line, index) in element.dialogResult" :key="index">
                    <span class="text-weight-bold">{{ line.speaker }}:</span> {{ line.text }}
                  </div>
                </div>
              </div>

              <!-- Vocabulary Sub-columns -->
              <div class="col-1 vocabulary-column" v-if="visibleColumns.word_text">
                <div v-for="(word, index) in element.vocabulary" :key="index" class="vocabulary-item">
                  {{ word.word_text }}
                </div>
              </div>
              <div class="col-1 vocabulary-column" v-if="visibleColumns.part_of_speech">
                <div v-for="(word, index) in element.vocabulary" :key="index" class="vocabulary-item">
                  {{ word.part_of_speech }}
                </div>
              </div>
              <div class="col-1 vocabulary-column" v-if="visibleColumns.phonetic">
                <div v-for="(word, index) in element.vocabulary" :key="index" class="vocabulary-item">
                  {{ word.phonetic }}
                </div>
              </div>
              <div class="col-1 vocabulary-column" v-if="visibleColumns.definition">
                <div v-for="(word, index) in element.vocabulary" :key="index" class="vocabulary-item">
                  {{ word.definition }}
                </div>
              </div>
              <div class="col-1 vocabulary-column" v-if="visibleColumns.usage_note">
                <div v-for="(word, index) in element.vocabulary" :key="index" class="vocabulary-item">
                  {{ word.usage_note }}
                </div>
              </div>
              <div class="col-1 vocabulary-column" v-if="visibleColumns.example">
                <div v-for="(word, index) in element.vocabulary" :key="index" class="vocabulary-item">
                  {{ word.example }}
                </div>
              </div>

              <!-- Actions -->
              <div class="col-1 actions-column" v-if="visibleColumns.actions">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="startEditDialogue(element)"
                />
              </div>

              <!-- Checkbox -->
              <div class="col-1 actions-column">
                <q-checkbox v-model="selectedDialogues" :val="element" @click.stop v-if="isDeleteMode" />
              </div>
            </q-card-section>
          </q-card>
        </template>
      </draggable>

      <!-- Delete actions -->
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

    <!-- Delete confirmation dialog -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">Are you sure you want to delete selected dialogues?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" v-close-popup @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete warning dialog -->
    <q-dialog v-model="deleteWarningDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">This will permanently delete the selected dialogues. Continue?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Continue" color="negative" v-close-popup @click="activateDeleteMode" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
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
    const drag = ref(false)
    const sortOrder = ref('desc')
    const isDeleteMode = ref(false)
    const deleteDialog = ref(false)
    const deleteWarningDialog = ref(false)
    const isDeleting = ref(false)
    const isUpdating = ref(false)
    const isGenerating = ref(false)
    const selectAll = ref(false)
    const selectedDialogues = ref([])
    const selectedDialogs = ref([])
    const confirmDialogueName = ref('')

    // Select options
    const selectedTopic = ref(null)
    const selectedLesson = ref(null)

    // Prompt and settings
    const prompt = ref('')
    const defaultPrompt = ref('Hãy viết cho tôi một hội thoại về chủ đề {topicname} thuộc bài học {lesson}. Có các mẫu câu:')
    const settings = ref({
      modelAI: 'gpt4',
      level: 'beginner',
      sentenceCount: 6,
      modelAI: 'gpt4',
      character1: 'john',
      character2: 'mary'
    })

    // Preview dialog
    const previewDialog = ref([])

    // Mock data for selects
    const topicOptions = [
      { label: 'Topic 1', value: 1 },
      { label: 'Topic 2', value: 2 },
      { label: 'Topic 3', value: 3 }
    ]

    const lessonOptions = [
      { label: 'Lesson 1', value: 1 },
      { label: 'Lesson 2', value: 2 },
      { label: 'Lesson 3', value: 3 }
    ]

    const modelAIOptions = [
      { label: 'GPT-4', value: 'gpt4' },
      { label: 'GPT-3.5', value: 'gpt35' },
      { label: 'Claude', value: 'claude' }
    ]

    const levelOptions = [
      { label: 'Beginner', value: 'beginner' },
      { label: 'Intermediate', value: 'intermediate' },
      { label: 'Advanced', value: 'advanced' }
    ]

    const characterOptions = [
      { label: 'John', value: 'john', voice_code: 'en-US-John' },
      { label: 'Mary', value: 'mary', voice_code: 'en-US-Mary' },
      { label: 'David', value: 'david', voice_code: 'en-US-David' },
      { label: 'Sarah', value: 'sarah', voice_code: 'en-US-Sarah' },
      { label: 'Michael', value: 'michael', voice_code: 'en-US-Michael' }
    ]

    // Column visibility
    const visibleColumns = ref({
      dialogResult: true,
      word_text: true,
      part_of_speech: true,
      phonetic: true,
      definition: true,
      usage_note: true,
      example: true,
      actions: true
    })

    // Mock data for dialogues
    const dialogues = ref([
      {
        id: 1,
        prompt: 'Create a dialogue about ordering food at a restaurant',
        sentenceCount: 10,
        modelAI: 'gpt4',
        character1: 'john',
        character2: 'mary',
        dialogResult: [
          { speaker: 'John', text: 'Hello, I would like to order some food.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' },
          { speaker: 'John', text: 'I would like to order a pizza.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' }
        ],
        vocabulary: [
          {
            word_text: 'order',
            part_of_speech: 'verb',
            phonetic: '/ˈɔːdər/',
            definition: 'to request something to be made, supplied, or served',
            usage_note: 'commonly used in restaurants',
            example: 'I would like to order a pizza.'
          },
          {
            word_text: 'pizza',
            part_of_speech: 'noun',
            phonetic: '/ˈpɪtsə/',
            definition: 'a flat, round bread made from a mixture of flour, water, and yeast',
            usage_note: 'commonly used in restaurants',
            example: 'I would like to order a pizza.'
          },
          {
            word_text: 'restaurant',
            part_of_speech: 'noun',
            phonetic: '/ˈrɛstərənt/',
            definition: 'a place where food is served and eaten',
            usage_note: 'commonly used in restaurants',
            example: 'I would like to order a pizza.'
          }
        ]
      },
      {
        id: 2,
        prompt: 'Create a dialogue about ordering food at a restaurant',
        sentenceCount: 10,
        modelAI: 'gpt4',
        character1: 'john',
        character2: 'mary',
        dialogResult: [
          { speaker: 'John', text: 'Hello, I would like to order some food.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' },
          { speaker: 'John', text: 'I would like to order a pizza.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' }
        ],
        vocabulary: [
          {
            word_text: 'order',
            part_of_speech: 'verb',
            phonetic: '/ˈɔːdər/',
            definition: 'to request something to be made, supplied, or served',
            usage_note: 'commonly used in restaurants',
            example: 'I would like to order a pizza.'
          },
          {
            word_text: 'pizza',
            part_of_speech: 'noun',
            phonetic: '/ˈpɪtsə/',
            definition: 'a flat, round bread made from a mixture of flour, water, and yeast',
            usage_note: 'commonly used in restaurants',
            example: 'I would like to order a pizza.'
          },
          {
            word_text: 'a',
            part_of_speech: 'noun',
            phonetic: '/ˈrɛstərənt/',
            definition: 'a place where food is served and eaten',
            usage_note: 'commonly used in restaurants',
            example: 'I would like to order a pizza.'
          }
        ]
      }
    ])

    // Computed properties
    const filteredDialogues = computed({
      get: () => dialogues.value,
      set: (value) => {
        dialogues.value = value
      }
    })

    // Watch for changes in topic and lesson
    watch([selectedTopic, selectedLesson], ([newTopic, newLesson]) => {
      if (newTopic && newLesson) {
        const topic = topicOptions.find(t => t.value === newTopic)
        const lesson = lessonOptions.find(l => l.value === newLesson)
        prompt.value = defaultPrompt.value
          .replace('{topicname}', topic.label)
          .replace('{lesson}', lesson.label)
      }
    })

    // Functions
    const generateDialogue = () => {
      isGenerating.value = true
      console.log('Generate dialogue:', {
        prompt: prompt.value,
        settings: settings.value
      })
      // Mock API call
      setTimeout(() => {
        isGenerating.value = false
        // Generate preview dialog with alternating characters
        const character1 = characterOptions.find(c => c.value === settings.value.character1)
        const character2 = characterOptions.find(c => c.value === settings.value.character2)
        const previewLines = []

        for (let i = 0; i < settings.value.sentenceCount; i++) {
          previewLines.push({
            speaker: i % 2 === 0 ? character1.label : character2.label,
            text: `This is sample sentence ${i + 1}`
          })
        }

        previewDialog.value = previewLines
        Notify.create({
          message: 'Dialogue generated successfully',
          color: 'positive'
        })
      }, 2000)
    }

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    }

    const handleSearch = () => {
      console.log('Handle search')
    }

    const loadDialogues = () => {
      console.log('Load dialogues')
    }

    const handleDragEnd = () => {
      console.log('Handle drag end')
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

    const submitDialogue = () => {
      console.log('Submit dialogue')
    }

    return {
      // State variables
      dialogues,
      filteredDialogues,
      drag,
      visibleColumns,
      sortOrder,
      isDeleteMode,
      deleteDialog,
      deleteWarningDialog,
      isDeleting,
      isUpdating,
      isGenerating,
      selectAll,
      selectedDialogues,
      selectedDialogs,
      confirmDialogueName,
      canDelete,

      // Select options
      selectedTopic,
      selectedLesson,
      topicOptions,
      lessonOptions,
      modelAIOptions,
      levelOptions,
      characterOptions,

      // Prompt and settings
      prompt,
      defaultPrompt,
      settings,
      previewDialog,

      // Functions
      generateDialogue,
      toggleSortOrder,
      handleSearch,
      loadDialogues,
      handleDragEnd,
      showDeleteWarning,
      activateDeleteMode,
      cancelDeleteMode,
      openDeleteConfirmDialog,
      toggleSelectAll,
      cancelDelete,
      confirmDelete,
      submitDialogue
    }
  }
})
</script>

<style scoped>
/* Thêm style này vào phần <style> của component */
.q-pa-md {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: calc(100vh - 16px);
  padding: 16px;
}

.main-content {
  height: 25vh; /* Fixed height */
  min-height: 180px;
  max-height: 25vh; /* Add max-height to prevent growing */
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  padding: 8px;
  margin: 0;
  margin-left: 0;
  overflow: hidden; /* Prevent content from overflowing */
}

.row.q-mb-md, .row.items-center.q-pa-sm {
  flex: 0 0 auto;
}

.dialogue-list {
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 50px; /* Increased from 24px to create more space between main content and table */
}

.dialogue-header {
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: #f5f5f5;
  padding: 12px 8px;
  width: 100%;
  display: flex;
  align-items: center;
}

.dialogue-header > div {
  padding: 0 4px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dialogue-items {
  overflow-y: auto;
  flex: 1 1 auto;
  width: 100%;
}

.dialogue-items .q-card {
  margin: 4px 0;
  border: 1px solid #e0e0e0;
  width: 100%;
}

.dialogue-items .q-card-section {
  padding: 12px 8px;
  width: 100%;
  display: flex;
  align-items: stretch;
}

.dialogue-items .q-card-section > div {
  padding-bottom: 8px;
  padding-top: 8px;
}

.dialog-cell {
  display: flex;
  flex-direction: column;
  height: auto;
}

.dialog-result {
  min-height: 100px;
  width: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dialog-result > div {
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
  white-space: normal;
  word-break: break-word;
}

.dialog-result > div:last-child {
  border-bottom: none;
}

.vocabulary-column {
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  justify-content: space-between;
}

.vocabulary-column:last-child {
  border-right: none;
}

.vocabulary-item {
  padding: 4px 2px;
  border-bottom: 1px solid #e0e0e0;
  white-space: normal;
  word-break: break-word;
  flex: 1;
  display: flex;
  align-items: center;
}

.vocabulary-item:last-child {
  border-bottom: none;
}

.actions-column {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 4px;
  height: 100%;
}

.handle-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.full-width {
  width: 100%;
}

.full-height {
  height: 200%;
}

.prompt-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prompt-input {
  height: 120px;
}

/* Reset any conflicting styles */
.q-card-section.column.full-height {
  display: flex;
  flex-direction: column;
}

.q-card.full-height {
  display: flex;
  flex-direction: column;
}

/* Ensure the input is visible */
.q-input {
  display: block !important;
  visibility: visible !important;
}

.settings-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px; /* Increased gap between settings items */
  padding: 4px 0; /* Add some vertical padding */
}

.settings-row {
  display: flex;
  gap: 8px;
  height: 100%;
}

.settings-row > div {
  flex: 1;
}

.preview-content {
  min-height: 100px;
  max-height: 150px;
  overflow-y: auto;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow: hidden; /* Prevent overflow */
}

.preview-content .q-mb-sm {
  padding: 4px;
  border-bottom: 1px solid #e0e0e0;
}

.preview-content .q-mb-sm:last-child {
  border-bottom: none;
}

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
</style>
