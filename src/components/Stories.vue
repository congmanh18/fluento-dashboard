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
                <q-item-label>Status</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.status" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Audio</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.audio" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Vocabulary</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.word" />
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

      <!-- Column 1: Settings -->
      <div class="col-3">
        <q-card class="full-height">
          <q-card-section class="column full-height">
            <div class="settings-container">
              <!-- Row 1: AI Model & Level -->
              <!-- <q-select
                v-model="settings.modelAI"
                :options="modelAIOptions"
                label="AI Model"
                outlined
                dense
                emit-value
                map-options
              /> -->
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
              <q-select
                v-model="selectedLevel"
                :options="levelOptions"
                label="Level"
                outlined
                dense
                emit-value
                map-options
              />
              <q-select
                v-model="selectedCharacter"
                :options="characterOptions"
                label="Character 1"
                outlined
                dense
                emit-value
                map-options
              />
              <q-select
                v-model="selectedCharacter2"
                :options="characterOptions"
                label="Character 2"
                outlined
                dense
                emit-value
                map-options
              />
              <q-input
                v-model="selectedSentenceCount"
                type="number"
                outlined
                dense
                label="Sentence Count"
                :min="1"
                :max="20"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Column 2: Content -->
      <div class="col-9">
        <q-card class="full-height">
          <q-card-section class="column full-height">
            <div class="row q-col-gutter-md full-height">
              <!-- Left Column: Prompt -->
              <div class="col-4">
                <div class="prompt-section full-height">
                  <div class="text-subtitle2 q-mb-sm">Suggested Prompt:</div>
                  <textarea
                    v-model="prompt"
                    class="custom-textarea prompt-textarea"
                    readonly
                    :placeholder="defaultPrompt"
                  ></textarea>
                  <q-btn
                    color="primary"
                    label="Copy"
                    class="q-mt-sm"
                    @click="copyPrompt"
                  />
                </div>
              </div>

              <!-- Right Column: JSON Input -->
              <div class="col-8">
                <div class="json-section full-height">
                  <div class="text-subtitle2 q-mb-sm">JSON Input:</div>
                  <textarea
                    v-model="rawJson"
                    class="custom-textarea json-textarea"
                    placeholder="Enter JSON here..."
                  ></textarea>
                  <q-btn
                    color="primary"
                    label="Submit"
                    class="full-width q-mt-md"
                    @click="submitDialogue"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

    </div>


    <!-- Dialog list -->
    <div class="dialogue-list q-mt-md">
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

        <!-- Dialog Result -->
        <div class="col-3" v-if="visibleColumns.dialogResult">
          <div class="text-weight-bold">Dialog Result</div>
        </div>

        <!-- Status -->
        <div class="col-2" v-if="visibleColumns.status">
          <div class="text-weight-bold">Status</div>
        </div>

        <!-- Audio -->
        <div class="col-1 text-center" v-if="visibleColumns.audio">
          <div class="text-weight-bold">Audio</div>
        </div>

        <!-- Image -->
        <div class="col-1 text-center" v-if="visibleColumns.image">
          <div class="text-weight-bold">Image</div>
        </div>

        <!-- Vocabulary -->
        <div class="col-2 text-center" v-if="visibleColumns.word">
          <div class="text-weight-bold">Vocabulary</div>
        </div>

        <!-- Actions -->
        <div class="col-2 text-center" v-if="visibleColumns.actions">
          <div class="text-weight-bold">Actions</div>
        </div>
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
            <q-card-section class="row items-center">
              <div class="col-1 text-left">
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

              <!-- Status -->
              <div class="col-2 text-left" v-if="visibleColumns.status && element">
                <div class="status-display">
                  <q-radio
                    v-model="element.status"
                    val="draft"
                    label="Draft"
                    color="grey"
                    dense
                  />
                  <q-radio
                    v-model="element.status"
                    val="approved"
                    label="Approved"
                    color="positive"
                    dense
                  />
                </div>
              </div>

              <!-- Audio -->
              <div class="col-1 text-center" v-if="visibleColumns.audio">
                <div class="row q-gutter-sm justify-center">
                  <q-btn
                    flat
                    dense
                    round
                    icon="play_circle"
                    color="primary"
                    @click="playAudio(element.audio)"
                  />
                </div>
              </div>

              <!-- Image -->
              <div class="col-1 text-center" v-if="visibleColumns.image">
                <div class="row q-gutter-sm justify-center">
                  <q-img :src="element.image" />
                </div>
              </div>

              <!-- Vocabulary -->
              <div class="col-2 word-column" v-if="visibleColumns.word && element">
                <div class="word-list">
                  <q-chip
                    v-for="(word, index) in element.word || []"
                    :key="index"
                    color="primary"
                    text-color="white"
                    dense
                    class="q-ma-xs"
                  >
                    {{ word }}
                  </q-chip>
                </div>
              </div>

              <!-- Actions -->
              <div class="col-2 text-center" v-if="visibleColumns.actions">
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  @click="startEditDialogue(element)"
                />
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
import { useDialogStore } from '../stores/dialogue'
import { useFileStore } from '../stores/file'
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
    const selectedLevel = ref(null)
    const selectedCharacter = ref(null)
    const selectedCharacter2 = ref(null)
    const selectedSentenceCount = ref(null)

    // Prompt and settings
    const prompt = ref('')
    const defaultPrompt = ref('Please write a dialogue about the topic {topicname} in lesson {lesson}. The dialogue should be at {level} level, between {character1} and {character2}. Include {sentenceCount} sentences with the following patterns:')
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

    // Add new state variables
    const previewTab = ref('raw')
    const rawJson = ref('')

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

    // Status options
    const statusOptions = [
      { label: 'Draft', value: 'draft' },
      { label: 'Approved', value: 'approved' }
    ]

    // Mock data for dialogues
    const dialogues = ref([
      {
        id: 1,
        prompt: 'Create a dialogue about ordering food at a restaurant',
        sentenceCount: 10,
        modelAI: 'gpt4',
        character1: 'john',
        character2: 'mary',
        status: 'draft',
        audio: 'https://example.com/audio1.mp3',
        dialogResult: [
          { speaker: 'John', text: 'Hello, I would like to order some food.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' },
          { speaker: 'John', text: 'I would like to order a pizza.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' }
        ],
        word: [
          'order',
          'pizza',
          'restaurant',
          'a',
          'the',
          'and',
          'what'
        ]
      },
      {
        id: 2,
        prompt: 'Create a dialogue about ordering food at a restaurant',
        sentenceCount: 10,
        modelAI: 'gpt4',
        character1: 'john',
        character2: 'mary',
        status: 'approved',
        audio: 'https://example.com/audio2.mp3',
        dialogResult: [
          { speaker: 'John', text: 'Hello, I would like to order some food.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' },
          { speaker: 'John', text: 'I would like to order a pizza.' },
          { speaker: 'Mary', text: 'Of course, what would you like to have?' }
        ],
        word: [
          'order',
          'pizza',
          'restaurant',
          'a',
          'the',
          'and',
          'or',
          'but'
        ]
      }
    ])

    // Column visibility
    const visibleColumns = ref({
      dialogResult: true,
      word: true,
      status: true,
      audio: true,
      actions: true
    })

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
          .replace('{level}', selectedLevel.value)
          .replace('{character1}', selectedCharacter.value)
          .replace('{character2}', selectedCharacter2.value)
          .replace('{sentenceCount}', selectedSentenceCount.value)
      }
    })

    // Add watch for rawJson changes
    watch(rawJson, (newValue) => {
      try {
        const parsed = JSON.parse(newValue)
        prettyJson.value = JSON.stringify(parsed, null, 2)
      } catch (e) {
        prettyJson.value = 'Invalid JSON'
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

    // Status handling
    const getStatusColor = (status) => {
      switch (status) {
        case 'draft': return 'grey'
        case 'approved': return 'positive'
        default: return 'grey'
      }
    }

    const getStatusLabel = (status) => {
      if (!status) return 'Unknown'
      const option = statusOptions.find(opt => opt.value === status)
      return option ? option.label : status
    }

    // Audio handling
    const playAudio = (audioUrl) => {
      console.log('Audio URL:', audioUrl)
      if (!audioUrl) {
        Notify.create({
          message: 'No audio available',
          color: 'negative'
        })
        return
      }
      // Implement audio playback logic
    }

    const uploadAudio = (element) => {
      console.log('Uploading audio for element:', element.id)
      // Implement audio upload logic
    }

    // Add new function for copying prompt
    const copyPrompt = () => {
      navigator.clipboard.writeText(prompt.value)
      Notify.create({
        message: 'Prompt copied to clipboard',
        color: 'positive'
      })
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
      selectedLevel,
      selectedCharacter,
      selectedCharacter2,
      selectedSentenceCount,
      topicOptions,
      lessonOptions,
      modelAIOptions,
      levelOptions,
      characterOptions,
      statusOptions,

      // Prompt and settings
      prompt,
      defaultPrompt,
      settings,
      previewDialog,

      // New state variables
      previewTab,
      rawJson,

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
      submitDialogue,

      // Status handling
      getStatusColor,
      getStatusLabel,

      // Audio handling
      playAudio,
      uploadAudio,

      // New function for copying prompt
      copyPrompt
    }
  }
})
</script>

<style scoped>
/* Main container */
.q-pa-md {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow: hidden;
}

/* Main content area */
.main-content-area {
  height: 50vh;
  min-height: 300px;
  max-height: 50vh;
  margin-bottom: 16px;
}

/* Card container */
.q-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.q-card-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/* Content columns */
.content-row {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.prompt-section, .json-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flex child scrolling */
}

/* Dialog list */
.dialogue-list {
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.dialogue-header {
  flex: 0 0 auto;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
}

.dialogue-items {
  overflow-y: auto;
  flex: 1 1 auto;
  min-height: 50px;
}

/* Dialog items */
.dialogue-items .q-card {
  transition: all 0.3s;
  margin: 4px 0;
  border: 1px solid #e0e0e0;
  width: 100%;
  height: auto; /* Thay đổi từ height: 100% */
}

.dialogue-items .q-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dialogue-items .q-card-section {
  padding: 8px;
  display: flex;
  align-items: center; /* Thay đổi từ flex-start */
  min-height: 60px; /* Thêm chiều cao tối thiểu */
}

.dialogue-items .q-card-section > div {
  padding: 4px;
  display: flex;
  align-items: center; /* Thay đổi từ flex-start */
}

/* Handle */
.handle {
  cursor: move;
  cursor: -webkit-grabbing;
  color: #666;
  transition: color 0.3s;
}

.handle:hover {
  color: #000;
}

/* Dialog cell */
.dialog-cell {
  display: flex;
  flex-direction: column;
  padding: 0;
}

.dialog-result {
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 4px 0;
}

.dialog-result > div {
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
  white-space: normal;
  word-break: break-word;
  line-height: 1.2;
}

.dialog-result > div:last-child {
  border-bottom: none;
}

/* Word column */
.word-column {
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  justify-content: center; /* Thay đổi từ flex-start */
}

.word-column:last-child {
  border-right: none;
}

.word-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  align-content: center; /* Thay đổi từ flex-start */
}

/* Status display */
.status-display {
  display: flex;
  flex-direction: row;
  gap: 4px;
  padding: 4px 0;
  justify-content: center; /* Thêm vào */
}

.q-radio {
  margin: 2px 0;
}

/* Selected dialog */
.q-card.selected {
  background-color: #e8f5e9;
  transition: background-color 0.3s ease;
}

/* Delete actions */
.delete-actions {
  margin-top: 16px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

/* Textareas */
.custom-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
  flex: 1;
  min-height: 0;
}

.prompt-textarea {
  height: calc(50vh - 100px);
  background-color: #f5f5f5;
  resize: none;
  overflow-y: auto;
}

.json-textarea {
  height: calc(50vh - 100px);
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre;
  resize: none;
  overflow-y: auto;
  overflow-x: auto;
}

/* Responsive styles */
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

/* Gradient background for dialogs */
.bg-gradient-red {
  background: linear-gradient(145deg, #fff, #ffe6e6);
}

/* Shake animation for warning icon */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Full width utility */
.full-width {
  width: 100%;
}

/* Full height utility */
.full-height {
  height: 100%;
}

/* Settings container */
.settings-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  padding: 4px 0;
}
</style>
