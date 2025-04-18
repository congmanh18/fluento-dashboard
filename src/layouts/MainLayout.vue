<template>
  <q-layout view="lHh Lpr lFf">
    <AppHeader @toggleDrawer="toggleLeftDrawer" />
    <AppDrawer v-model="leftDrawerOpen" />
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from 'components/AppHeader.vue'
import AppDrawer from 'components/AppDrawer.vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
