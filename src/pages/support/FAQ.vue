<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-primary q-mb-md animate__animated animate__fadeIn">FAQ Editor</div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card class="my-card animate__animated animate__fadeInUp">
          <q-card-section>
            <div class="text-h6">Add/Edit FAQ</div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="newFaq.question" filled label="Question" class="q-mb-md" />
            <q-input v-model="newFaq.answer" filled label="Answer" type="textarea" />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Clear" color="negative" flat @click="clearForm" />
            <q-btn label="Add FAQ" color="primary" @click="addFaq" />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card class="my-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
          <q-card-section>
            <div class="text-h6">FAQ Preview</div>
          </q-card-section>
          <q-card-section>
            <q-list>
              <q-item v-for="(faq, index) in faqs" :key="index" clickable @click="editFaq(index)">
                <q-item-section>
                  <q-item-label>{{ faq.question }}</q-item-label>
                  <q-item-label caption>{{ faq.answer }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round color="negative" icon="delete" @click.stop="deleteFaq(index)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import 'animate.css'

const newFaq = ref({ question: '', answer: '' })
const faqs = ref([
  { question: 'How do I reset my password?', answer: 'Go to settings and click "Reset Password".' },
  { question: 'Is there a dark mode?', answer: 'Yes, available in v2.1.0.' }
])

const addFaq = () => {
  if (newFaq.value.question && newFaq.value.answer) {
    faqs.value.push({ ...newFaq.value })
    clearForm()
  }
}

const editFaq = (index) => {
  newFaq.value = { ...faqs.value[index] }
  faqs.value.splice(index, 1)
}

const deleteFaq = (index) => {
  faqs.value.splice(index, 1)
}

const clearForm = () => {
  newFaq.value = { question: '', answer: '' }
}
</script>

<style scoped>
.my-card {
  min-height: 300px;
}
</style>
