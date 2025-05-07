<template>
  <div class="q-pa-md">
      <div class="col-12 col-md-6">
        <q-card class="my-card">
            <dialogs />
        </q-card>
      </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useTopicStore } from '../../stores/topic'
import Dialogs from '../../components/Dialogs.vue'

export default defineComponent({
  name: 'Dialogs Page',

  components: {
    Dialogs
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
.q-pa-md {
  height: calc(105vh - 100px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.row.q-mb-md, .topic-header, .row.items-center.q-pa-sm {
  flex: 0 0 auto;
}

.topic-list {
  flex: 1 1 auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 200px);
}

.topic-items {
  overflow-y: auto;
  flex: 1 1 auto;
}

.my-card {
  height: 100%;
}
</style>
