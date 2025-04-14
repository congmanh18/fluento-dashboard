<template>
  <q-item clickable v-ripple :to="to" active-class="bg-grey-3 text-primary">
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-medium">{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  to: String,
  icon: String,
  label: String,
})
</script>
