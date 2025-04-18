<template>
  <q-page class="q-pa-md">
    <q-card class="my-card animate__animated animate__fadeIn">
      <q-card-section>
        <div class="text-h5 text-primary">User Feedback</div>
        <div class="text-subtitle2">Manage and respond to user feedback</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :rows="feedbacks"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          @row-click="openFeedbackDialog"
          class="animate__animated animate__zoomIn"
        >
          <template v-slot:top-right>
            <q-btn color="primary" icon="refresh" round flat @click="fetchFeedbacks" />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round color="primary" icon="visibility" @click.stop="openFeedbackDialog(null, props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Feedback Detail Dialog -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="dialog-card animate__animated animate__bounceIn">
        <q-card-section class="row items-center">
          <div class="text-h6">Feedback Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>User</q-item-label>
                <q-item-label caption>{{ selectedFeedback?.user }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Message</q-item-label>
                <q-item-label caption>{{ selectedFeedback?.message }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label>Status</q-item-label>
                <q-item-label caption>{{ selectedFeedback?.status }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-input v-model="response" filled label="Your Response" type="textarea" class="q-mt-md" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancel" color="negative" v-close-popup />
          <q-btn label="Send Response" color="primary" @click="sendResponse" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import 'animate.css'

const columns = [
  { name: 'id', label: 'ID', field: 'id', sortable: true },
  { name: 'user', label: 'User', field: 'user', sortable: true },
  { name: 'message', label: 'Message', field: 'message', sortable: true },
  { name: 'status', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions' }
]

const feedbacks = ref([
  { id: 1, user: 'John Doe', message: 'Great app, but needs dark mode.', status: 'Pending' },
  { id: 2, user: 'Jane Smith', message: 'Crashes on login.', status: 'Open' }
])

const pagination = ref({
  rowsPerPage: 10,
  page: 1,
  sortBy: 'id',
  descending: false
})

const loading = ref(false)
const showDialog = ref(false)
const selectedFeedback = ref(null)
const response = ref('')

const fetchFeedbacks = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const openFeedbackDialog = (evt, row) => {
  selectedFeedback.value = row
  showDialog.value = true
}

const sendResponse = () => {
  // Simulate sending response
  console.log('Response sent:', response.value)
  showDialog.value = false
  response.value = ''
}
</script>

<style scoped>
.my-card {
  max-width: 1200px;
  margin: auto;
}
.dialog-card {
  min-width: 500px;
}
</style>
