<template>
  <q-layout view="hHh Lpr fFf">
    <!-- HEADER -->
    <q-header class="bg-white text-grey-8 shadow-1">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold text-primary">
          MultiLang Dashboard
        </q-toolbar-title>
        <q-space />

        <!-- Select Source Language -->
        <q-select
          options-dense
          popup-content-class="bg-grey-2 text-black"
          v-model="sourceLanguage"
          :options="languageOptions"
          label="Source"
          emit-value
          map-options
          dense
          borderless
          class="select-style"
        >
          <template #prepend>
            <q-icon name="public" color="white" />
          </template>
        </q-select>

        <!-- Select Native Language -->
        <q-select
          options-dense
          popup-content-class="bg-grey-2 text-black"
          v-model="nativeLanguage"
          :options="languageOptions"
          label="Native"
          emit-value
          map-options
          dense
          borderless
          class="select-style"
        >
          <template #prepend>
            <q-icon name="translate" color="white" />
          </template>
        </q-select>
      </q-toolbar>
    </q-header>

    <!-- SIDEBAR -->
    <q-drawer show-if-above v-model="leftDrawerOpen" bordered class="bg-grey-1">
      <q-list>
        <SidebarItem to="/" icon="fas fa-home" label="Trang chủ" />
        <SidebarItem to="/topic" icon="fas fa-book" label="Chủ đề" />
        <SidebarItem to="/lesson" icon="fas fa-book" label="Bài học" />
        <SidebarItem to="/task" icon="fas fa-book" label="Nhiệm vụ" />
        <SidebarItem to="/vocabulary" icon="fas fa-book-open" label="Vocabulary" />
        <SidebarItem to="/dialog" icon="fas fa-comments" label="Dialog" />
        <SidebarItem to="/story" icon="fas fa-book" label="Story" />
        <SidebarItem to="/song" icon="fas fa-music" label="Song" />
      </q-list>
    </q-drawer>

    <!-- CONTENT -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { languageOptions } from 'src/constants/language'
import { useLanguageStore } from 'src/stores/language'
import SidebarItem from 'src/components/SidebarItem.vue'

const leftDrawerOpen = ref(false)
const languageStore = useLanguageStore()

const sourceLanguage = ref(languageStore.sourceLanguage)
const nativeLanguage = ref(languageStore.nativeLanguage)

watch(sourceLanguage, (newVal) => {
  languageStore.setSourceLanguage(newVal)
})

watch(nativeLanguage, (newVal) => {
  languageStore.setNativeLanguage(newVal)
})
</script>

<style scoped></style>
