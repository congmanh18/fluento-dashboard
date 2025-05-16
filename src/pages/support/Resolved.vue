<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-primary q-mb-md animate__animated animate__fadeIn">Resolved Items</div>
    <q-timeline color="primary" class="animate__animated animate__slideInLeft">
      <q-timeline-entry v-for="item in resolvedItems" :key="item.id" :title="item.title" :subtitle="item.date">
        <div>
          <strong>User:</strong> {{ item.user }}<br />
          <strong>Details:</strong> {{ item.details }}<br />
          <strong>Resolution:</strong> {{ item.resolution }}
        </div>
      </q-timeline-entry>
    </q-timeline>
  </q-page>
</template>

<script setup>
import 'animate.css'

const resolvedItems = [
  {
    id: 1,
    title: 'Feedback: Dark Mode Request',
    user: 'John Doe',
    date: '2025-04-15',
    details: 'Requested dark mode for better usability.',
    resolution: 'Implemented in v2.1.0'
  },
  {
    id: 2,
    title: 'Contact: Billing Issue',
    user: 'Bob Wilson',
    date: '2025-04-10',
    details: 'Incorrect billing amount.',
    resolution: 'Refund issued and corrected.'
  }
]
</script>

<style scoped>
.q-timeline {
  max-width: 800px;
  margin: auto;
}
</style>
