<template>
  <div class="q-pa-md">
    <!-- Top controls -->
    <div class="row q-mb-md items-center">
      <div class="col-4">
      </div>
      <div class="col-4">
      </div>
      <div class="col-4">
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
                <q-item-label>Audio</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.audio" />
              </q-item-section>
            </q-item>
            <q-item tag="label" v-ripple>
              <q-item-section>
                <q-item-label>Image</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-checkbox v-model="visibleColumns.image" />
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
      <!-- Vocabulary Section -->
      <div v-if="filteredDialogues.length > 0 && !filteredDialogues[0].isEmpty" class="q-mb-md">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">vocabulary</div>
            <div class="vocabulary-section">
              <q-chip
                v-for="(word, index) in filteredDialogues[0].vocabulary"
                :key="index"
                color="primary"
                text-color="white"
                dense
                class="q-ma-xs"
              >
                {{ word }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Add new section for submitted dialog -->
      <div v-if="previewDialog.length > 0" class="q-mb-md">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Submitted Dialog Preview</div>
            <div class="row q-col-gutter-md">
              <!-- Dialog Preview -->
              <div class="col-8">
                <div class="text-subtitle2 q-mb-sm">Dialog:</div>
                <div class="dialog-preview">
                  <div v-for="(line, index) in previewDialog[0].dialog" :key="index" class="q-pa-sm">
                    <span class="text-weight-bold">{{ line.speaker }}:</span> {{ line.text }}
                  </div>
                </div>
              </div>
              <!-- Vocabulary Preview -->
              <div class="col-4">
                <div class="text-subtitle2 q-mb-sm">Vocabulary:</div>
                <div class="vocabulary-preview">
                  <q-chip
                    v-for="(word, index) in previewDialog[0].vocabulary"
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
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="dialogue-header row items-center q-pa-sm bg-grey-2">
        <div class="col-1 text-center">
        </div>

        <!-- Dialog Result -->
        <div class="col-6" v-if="visibleColumns.dialogResult">
          <div class="text-weight-bold">Dialog Result</div>
        </div>

        <!-- Audio -->
        <!-- <div class="col-1 text-center" v-if="visibleColumns.audio">
          <div class="text-weight-bold">Audio</div>
        </div> -->

        <!-- Image -->
        <!-- <div class="col-2 text-center" v-if="visibleColumns.image">
          <div class="text-weight-bold">Image</div>
        </div> -->
      </div>

      <div class="dialogue-items">
        <template v-for="element in filteredDialogues" :key="element.id">
          <q-card flat bordered class="q-mb-sm">
            <q-card-section class="row items-center">
              <div class="col-1 text-left">
              </div>

              <!-- Dialog Result -->
              <div class="col-6 dialog-cell" v-if="visibleColumns.dialogResult">
                <div class="dialog-result" :class="{ 'empty-state': element.isEmpty }">
                  <template v-if="element.isEmpty">
                    <div class="empty-message">
                      <q-icon name="info" size="24px" color="grey-7" class="q-mr-sm" />
                      {{ element.message }}
                    </div>
                  </template>
                  <template v-else>
                    <div v-for="(line, index) in element.dialog" :key="line.id" class="dialog-line">
                      <span class="text-weight-bold">{{ line.speaker }}:</span> {{ line.text }}
                    </div>
                  </template>
                </div>
              </div>

              <!-- Audio -->
              <!-- <div class="col-1 text-center" v-if="visibleColumns.audio">
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
              </div> -->

              <!-- Image -->
              <!-- <div class="col-2 text-center" v-if="visibleColumns.image">
                <div class="row q-gutter-sm justify-center">
                  <q-img :src="element.image" />
                </div>
              </div> -->
            </q-card-section>
          </q-card>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { useDialogStore } from '../stores/dialogue'
import { useFileStore } from '../stores/file'
import { useLanguageStore } from '../stores/language'
import { useBaseStore } from '../stores/base'

import { Notify } from 'quasar'
import { debounce } from 'lodash'
import { languageOptions } from '../constants/language'
import { useTopicStore } from '../stores/topic'
export default defineComponent({
  name: 'DialogTable',
  components: {
  },

  setup() {
    // Initialize stores
    const topicStore = useTopicStore()
    const dialogStore = useDialogStore()
    const fileStore = useFileStore()
    const languageStore = useLanguageStore()
    const baseStore = useBaseStore()

    // Basic state variables
    const isUpdating = ref(false)
    const isGenerating = ref(false)

    // Select options
    const selectedTopic = ref(null)
    const selectedLesson = ref(null)
    const selectedLevel = ref(null)
    const selectedCharacter = ref(null)
    const selectedCharacter2 = ref(null)
    const selectedSentenceCount = ref(8)
    const selectedSourceLanguage = computed(() => languageStore.sourceLanguage)

    // Prompt and settings
    const prompt = ref('')
    const defaultPrompt = ref(dialogStore.generatePrompt())
    const settings = ref(dialogStore.settings)

    // Preview dialog
    const previewDialog = ref([])

    // Add new state variables
    const previewTab = ref('raw')
    const rawJson = ref('')

    // Mock data for selects
    const topicOptions = computed(() => topicStore.topics.map(topic => ({
      label: topic.name,
      value: topic.id
    })))

    const lessonOptions = computed(() => {
      if (!selectedTopic.value) return []
      const lessons = topicStore.lessons[selectedTopic.value] || []
      return lessons.map(lesson => ({
        label: lesson.name,
        value: lesson.id
      }))
    })

    const levelOptions = baseStore.getLanguageLevels.map(level => ({
      label: level.name,
      value: level.code
    }))
    const characterOptions = baseStore.getCharacters.map(character => ({
      label: character.name,
      value: character.id,
      voice_code: character.voice_code,
      name: character.name
    }))

    const modelAIOptions = dialogStore.modelAIOptions
    const statusOptions = dialogStore.statusOptions

    // Column visibility
    const visibleColumns = ref({
      dialogResult: true,
      audio: true,
      image: true
    })

    // Computed properties
    const filteredDialogues = computed({
      get: () => dialogStore.dialogues,
      set: (value) => {
        dialogStore.updateDialogues(value)
      }
    })

    // Fetch all dialogues on mount
    onMounted(async () => {
      try {
        // Fetch all topics first
        await topicStore.fetchTopics()

        // If there are topics, fetch lessons for the first topic
        if (topicStore.topics.length > 0) {
          const firstTopic = topicStore.topics[0]
          selectedTopic.value = firstTopic.id
          await topicStore.fetchLessons(firstTopic.id)

          // If there are lessons, fetch dialogues for the first lesson
          if (topicStore.lessons[firstTopic.id]?.length > 0) {
            const firstLesson = topicStore.lessons[firstTopic.id][0]
            selectedLesson.value = firstLesson.id
            await dialogStore.fetchDialogues(firstLesson.id)
          }
        }
      } catch (error) {
        console.error('Failed to initialize data:', error)
        Notify.create({
          type: 'negative',
          message: 'Failed to load initial data'
        })
      }
    })

    // Watch for topic changes to load lessons
    watch(selectedTopic, async (newTopicId) => {
      if (newTopicId) {
        try {
          await topicStore.fetchLessons(newTopicId)
          // Reset selected lesson when topic changes
          selectedLesson.value = null
        } catch (error) {
          console.error('Failed to fetch lessons:', error)
          Notify.create({
            type: 'negative',
            message: 'Failed to load lessons'
          })
        }
      }
    }, { immediate: true })

    // Watch for lesson changes to load dialogues
    watch(selectedLesson, async (newLessonId) => {
      if (newLessonId) {
        try {
          await dialogStore.fetchDialogues(newLessonId)
        } catch (error) {
          console.error('Failed to fetch dialogues:', error)
          Notify.create({
            type: 'negative',
            message: 'Failed to load dialogues'
          })
        }
      }
    })

    // Add new function for generating prompt
    const generatePrompt = () => {
      if (!selectedTopic.value || !selectedLesson.value) return defaultPrompt.value

      const selectedTopicObj = topicOptions.value.find(t => t.value === selectedTopic.value)
      const lesson = lessonOptions.value.find(l => l.value === selectedLesson.value)

      // Debug logging
      console.log('Selected Character 1:', selectedCharacter.value)
      console.log('Character Options:', characterOptions)
      console.log('Found Character 1:', characterOptions.find(c => c.value === selectedCharacter.value))

      const character1 = characterOptions.find(c => c.value === selectedCharacter.value)
      const character2 = characterOptions.find(c => c.value === selectedCharacter2.value)
      const sourceLanguage = languageOptions.find(l => l.value === selectedSourceLanguage.value)

      // Get the actual selected character names from the selected values
      const character1Name = selectedCharacter.value ? character1?.name || '' : ''
      const character2Name = selectedCharacter2.value ? character2?.name || '' : ''

      // Debug logging
      console.log('Character 1 Name:', character1Name)
      console.log('Character 2 Name:', character2Name)

      return dialogStore.generatePrompt({
        topic: selectedTopicObj?.label || '',
        lesson: lesson?.label || '',
        level: selectedLevel.value || '',
        character1: character1Name,
        character2: character2Name,
        sentenceCount: selectedSentenceCount.value || '',
        sourceLanguage: sourceLanguage?.label || ''
      })
    }

    // Watch for changes in all relevant parameters
    watch(
      [
        selectedTopic,
        selectedLesson,
        selectedLevel,
        selectedCharacter,
        selectedCharacter2,
        selectedSentenceCount,
        selectedSourceLanguage
      ],
      () => {
        prompt.value = generatePrompt()
      },
      { immediate: true }
    )

    // Functions
    const submitDialogue = async () => {
      try {
        if (!rawJson.value) {
          Notify.create({
            message: 'Please enter JSON input',
            color: 'negative'
          })
          return
        }

        const dialogueData = JSON.parse(rawJson.value)

        // Validate required fields
        if (!dialogueData.dialog || !Array.isArray(dialogueData.dialog)) {
          throw new Error('Invalid dialogue format')
        }

        // Get selected character details
        const character1 = characterOptions.find(c => c.value === selectedCharacter.value)
        const character2 = characterOptions.find(c => c.value === selectedCharacter2.value)

        // Create the complete dialogue data with image and setting
        const completeDialogueData = {
          dialog: dialogueData.dialog,
          vocabulary: dialogueData.vocabulary || [],
          image: {
            id: ["Ivi5COLKkSSI"], // Default image ID
            start_time: [10], // Default start time
            url: ["https://example.com/image1.jpg"] // Default image URL
          },
          setting: {
            bitrate: "12k",
            lang: selectedSourceLanguage.value,
            lesson_id: selectedLesson.value,
            level: selectedLevel.value,
            order: 1, // Default order
            topic_id: selectedTopic.value,
            voice_code_1: character1?.voice_code,
            voice_code_2: character2?.voice_code
          }
        }

        // Submit to API using store
        const response = await dialogStore.addDialogue(completeDialogueData)

        // Only clear the JSON input
        rawJson.value = ''

        // Refresh dialogues list
        await dialogStore.fetchDialogues(selectedLesson.value)

        Notify.create({
          message: 'Dialogue created successfully',
          color: 'positive'
        })
      } catch (error) {
        Notify.create({
          message: error.message || 'Failed to create dialogue',
          color: 'negative'
        })
      }
    }

    const handleSearch = () => {
      console.log('Handle search')
    }

    const loadDialogues = () => {
      console.log('Load dialogues')
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
      filteredDialogues,
      visibleColumns,
      isUpdating,
      isGenerating,

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
      submitDialogue,
      handleSearch,
      loadDialogues,
      playAudio,
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
  align-items: center;
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
  padding: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.dialog-result.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  background-color: #fafafa;
}

.empty-message {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 1.1em;
  text-align: center;
  padding: 16px;
}

.dialog-line {
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}

.dialog-line:last-child {
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

/* Dialog Preview */
.dialog-preview {
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.dialog-preview > div {
  padding: 4px 8px;
  border-bottom: 1px solid #e0e0e0;
  white-space: normal;
  word-break: break-word;
  line-height: 1.4;
}

.dialog-preview > div:last-child {
  border-bottom: none;
}

/* Vocabulary Preview */
.vocabulary-preview {
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 8px;
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* Vocabulary Section */
.vocabulary-section {
  background-color: #f5f5f5;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.vocabulary-section .q-chip {
  font-size: 14px;
  height: 28px;
}

.vocabulary-section .q-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
</style>
