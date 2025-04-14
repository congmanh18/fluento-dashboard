<template>
  <div class="q-gutter-sm">
    <q-chip
      color="deep-orange-1"
      text-color="deep-orange-9"
      class="q-px-lg rounded-borders shadow-1 text-h6"
    >
      {{ detail.title }}
    </q-chip>

    <div class="text-body1 q-mt-sm">
      {{ detail.content }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  detail: {
    type: Object,
    required: true,
  },
})
</script>

<!-- <template>
  <div class="text-body1 text-primary">Story Task: {{ detail }}</div>
</template>

<script setup>
defineProps({
  detail: String,
})
</script> -->
