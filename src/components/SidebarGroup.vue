<!-- components/SidebarGroup.vue -->
<template>
  <q-expansion-item :icon="icon" :label="label">
    <q-list class="q-pl-lg">
      <slot />
    </q-list>
  </q-expansion-item>
</template>

<script setup>
defineProps({
  label: String,
  icon: String,
})
</script>
