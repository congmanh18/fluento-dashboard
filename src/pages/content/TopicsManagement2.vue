<template>
  <div class="q-pa-md">
      <div class="col-12 col-md-6">
        <q-card class="my-card">
            <topic-lesson />
        </q-card>
      </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useTopicStore } from '../../stores/topicStore'
import TopicLesson from '../../components/Topic-Lesson2.vue'

export default defineComponent({
  name: 'Template3',

  components: {
    TopicLesson
  },

  setup() {
    const topicStore = useTopicStore()
    const topicName = ref('')
    const topicStatus = ref('draft')

    const statusOptions = [
      { label: 'Draft', value: 'draft' },
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' }
    ]

    const onSubmit = () => {
      if (topicStore.isCreatingNew) {
        topicStore.saveTopic()
      } else if (topicStore.isEditing) {
        topicStore.saveEdit()
      }
      resetForm()
    }

    const onCancel = () => {
      if (topicStore.isCreatingNew) {
        topicStore.cancelCreate()
      } else if (topicStore.isEditing) {
        topicStore.cancelEdit()
      }
      resetForm()
    }

    const resetForm = () => {
      topicName.value = ''
      topicStatus.value = 'draft'
    }

    return {
      topicName,
      topicStatus,
      statusOptions,
      onSubmit,
      onCancel
    }
  }
})
</script>

<style scoped>
.my-card {
  height: 100%;
}
</style>
