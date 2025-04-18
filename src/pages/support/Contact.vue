<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-primary q-mb-md animate__animated animate__fadeIn">Contact Requests</div>
    <q-input v-model="search" filled label="Search requests..." class="q-mb-md animate__animated animate__fadeInDown">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <div class="row q-col-gutter-md">
      <div v-for="request in filteredRequests" :key="request.id" class="col-12 col-md-6 col-lg-4">
        <q-card class="my-card animate__animated animate__pulse" @mouseenter="hoverCard" @mouseleave="leaveCard">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ request.name }}</div>
            <div class="text-subtitle2">{{ request.email }}</div>
          </q-card-section>
          <q-card-section>
            <div><strong>Message:</strong> {{ request.message }}</div>
            <div><strong>Status:</strong> {{ request.status }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" label="Mark as Resolved" @click="markResolved(request.id)" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import 'animate.css'

const search = ref('')
const requests = ref([
  { id: 1, name: 'Alice Brown', email: 'alice@example.com', message: 'Need help with account.', status: 'Open' },
  { id: 2, name: 'Bob Wilson', email: 'bob@example.com', message: 'Billing issue.', status: 'Pending' }
])

const filteredRequests = computed(() => {
  return requests.value.filter(
    (req) =>
      req.name.toLowerCase().includes(search.value.toLowerCase()) ||
      req.email.toLowerCase().includes(search.value.toLowerCase())
  )
})

const markResolved = (id) => {
  const request = requests.value.find((req) => req.id === id)
  if (request) request.status = 'Resolved'
}

const hoverCard = (event) => {
  event.currentTarget.classList.add('shadow-8')
}

const leaveCard = (event) => {
  event.currentTarget.classList.remove('shadow-8')
}
</script>

<style scoped>
.my-card {
  transition: all 0.3s;
}
.my-card:hover {
  transform: translateY(-5px);
}
</style>
