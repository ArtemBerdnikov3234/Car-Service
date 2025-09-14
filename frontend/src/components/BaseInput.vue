<template>
  <div>
    <label
      v-if="label"
      :for="uuid"
      class="mb-2 block font-semibold text-secondary-text"
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
      class="w-full rounded-lg border border-white/20 bg-dark px-4 py-3 text-white transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: "text" },
  placeholder: String,
  required: Boolean,
  maxlength: [String, Number],
  min: [String, Number],
  max: [String, Number],
});
defineEmits(["update:modelValue"]);
const uuid = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);
</script>
