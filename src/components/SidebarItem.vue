<!-- components/SidebarItem.vue -->
<template>
  <q-item :to="to" active-class="q-item-no-link-highlighting" :class="customClass">
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  to: String,
  icon: String,
  label: String,
  customClass: {
    type: String,
    default: '',
  }
})
</script>
