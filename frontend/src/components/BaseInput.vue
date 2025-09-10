<!-- src/components/BaseInput.vue -->
<template>
  <div>
    <label
      v-if="label"
      :for="uuid"
      class="block text-brand-text font-semibold mb-2"
      >{{ label }}</label
    >
    <input
      :id="uuid"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :maxlength="maxlength"
      :min="min"
      :max="max"
      class="w-full px-4 py-3 bg-brand-light-gray border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent text-brand-white"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

// Определяем пропсы, которые компонент может принимать
defineProps({
  modelValue: [String, Number], // Для v-model
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  required: Boolean,
  maxlength: [String, Number],
  min: [String, Number],
  max: [String, Number],
});

// Определяем событие для v-model
defineEmits(["update:modelValue"]);

// Генерируем уникальный ID для связи <label> и <input>
const uuid = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);
</script>
