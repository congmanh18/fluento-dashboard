<template>
  <div class="q-gutter-sm">
    <div
      v-for="item in detail"
      :key="item.id"
      class="q-px-sm q-py-xs q-mb-xs flex items-center gap-2"
    >
      <!-- Speaker -->
      <q-chip
        color="blue-1"
        text-color="blue-9"
        class="q-px-lg full-height rounded-borders shadow-1"
      >
        {{ item.speaker }}
      </q-chip>

      <!-- Nội dung -->
      <div class="text-body2">
        {{ item.content }}
      </div>
    </div>
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
