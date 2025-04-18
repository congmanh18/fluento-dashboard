<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn flat dense round @click="$emit('toggleDrawer')" icon="menu" aria-label="Menu" />
      <q-toolbar-title>Fluent Dashboard</q-toolbar-title>
      <q-space />
      <div class="q-gutter-sm row items-center no-wrap">
        <!-- Select Source Language -->
        <LanguageSelectItem
          v-model="sourceLanguage"
          :options="languageOptions"
          label="Source"
          icon="public"
        />
        <LanguageSelectItem
          v-model="nativeLanguage"
          :options="languageOptions"
          label="Native"
          icon="translate"
        />
        <q-btn
          round dense flat color="white"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm"
        />
        <q-btn round dense flat color="white" icon="notifications">
          <q-badge color="red" text-color="white" floating>5</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <messages />
              <q-card class="text-center no-shadow no-border">
                <q-btn label="View All" style="max-width: 120px !important;" flat dense class="text-indigo-8" />
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn round flat>
          <q-avatar size="26px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { languageOptions } from 'src/constants/language'
import { useLanguageStore } from 'src/stores/language'
import Messages from './Messages.vue'
import LanguageSelectItem from './select/LanguageSelectItem.vue'
const languageStore = useLanguageStore()

const sourceLanguage = ref(languageStore.sourceLanguage)
const nativeLanguage = ref(languageStore.nativeLanguage)

watch(sourceLanguage, (newVal) => {
  languageStore.setSourceLanguage(newVal)
})

watch(nativeLanguage, (newVal) => {
  languageStore.setNativeLanguage(newVal)
})

const $q = useQuasar()
</script>

<style scoped>
.select-style {
  width: 100px;
}
</style>
