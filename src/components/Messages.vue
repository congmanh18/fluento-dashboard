<template>
  <div>
    <q-item v-for="(msg, index) in messages" :key="index" clickable>
      <q-item-section>
        <q-item-label>{{ msg }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
const messages = [
  'New user signed up',
  'Product added to cart',
  'Server restarted successfully'
]
</script>
