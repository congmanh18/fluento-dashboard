<template>
  <q-select
    options-dense
    popup-content-class="language-popup"
    :model-value="modelValue"
    :options="options"
    :label="label"
    emit-value
    map-options
    dense
    borderless
    class="language-select"
    color="grey-8"
    label-color="grey-8"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <template #prepend>
      <q-icon :name="icon" class="icon-style" />
    </template>
    <template #selected-item="{ opt }">
      <div class="selected-item">
        <span>{{ opt.label }}</span>
      </div>
    </template>
    <template #option="{ opt, selected, itemProps }">
      <q-item v-bind="itemProps" class="option-style">
        <q-item-section>
          <q-item-label :class="{ 'selected-option': selected }">
            {{ opt.label }} ({{ opt.value.toUpperCase() }})
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
defineProps({
  modelValue: String,
  label: String,
  icon: String,
  options: Array
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.language-select {
  width: 180px; /* Tăng chiều rộng cho nổi bật */
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(15px);
  border: 1px solid transparent;
  transition: all 0.4s ease;
  padding: 4px 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.language-select:hover {
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3), 0 0 15px rgba(147, 197, 253, 0.2);
  border: 1px solid transparent;
  background: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)) padding-box,
              linear-gradient(to right, rgba(59, 130, 246, 0.5), rgba(167, 139, 250, 0.5)) border-box;
}

.language-select .q-field__control {
  background: transparent !important;
  color: #1e293b !important;
  padding: 0 12px;
  height: 42px; /* Tăng chiều cao nhẹ */
  display: flex;
  align-items: center;
  justify-content: center;
}

.language-select .q-field__label {
  color: #6b7280;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  transition: color 0.3s ease;
  top: -1px;
  text-align: center;
}

.language-select .q-field__native {
  color: #1e293b;
  font-weight: 500;
  font-size: 15px;
  text-align: center;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  font-size: 15px;
  font-weight: 500;
}

.icon-style {
  color: #3b82f6;
  font-size: 20px;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Hiệu ứng đàn hồi */
}

.language-select:hover .icon-style {
  color: #a78bfa; /* Chuyển sang tím nhạt */
  transform: rotate(360deg) scale(1.2);
}

.language-popup {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid transparent;
  background: linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box,
              linear-gradient(to right, rgba(59, 130, 246, 0.4), rgba(167, 139, 250, 0.4)) border-box;
  animation: popup-open 0.3s ease-out;
  text-align: center;
}

@keyframes popup-open {
  from {
    transform: translateY(-15px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.option-style {
  color: #1e293b;
  padding: 8px 14px;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  width: 100%;
  position: relative;
  animation: slide-in 0.3s ease-out;
}

@keyframes slide-in {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.option-style:hover {
  background: rgba(59, 130, 246, 0.15);
  transform: scale(1.05);
}

.option-style:active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 0.5s ease-out;
}

@keyframes ripple {
  to {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

.selected-option {
  color: #3b82f6;
  font-weight: 600;
}

.language-popup .q-item--active {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

/* Custom scrollbar */
.language-popup::-webkit-scrollbar {
  width: 8px;
}

.language-popup::-webkit-scrollbar-track {
  background: transparent;
}

.language-popup::-webkit-scrollbar-thumb {
  background: linear-gradient(rgba(59, 130, 246, 0.5), rgba(167, 139, 250, 0.5));
}

.language-popup::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(rgba(59, 130, 246, 0.7), rgba(167, 139, 250, 0.7));
}
</style>