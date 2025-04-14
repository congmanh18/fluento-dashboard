<template>
  <div class="q-gutter-sm">
    <q-chip
      v-for="item in detail"
      :key="item.id"
      color="blue-1"
      text-color="blue-9"
      size="md"
      class="q-px-md q-py-xs text-body1"
    >
      {{ item.text }}
    </q-chip>
  </div>
</template>

<script setup>
defineProps({
  detail: {
    type: Array,
    required: true,
  },
})
</script>
