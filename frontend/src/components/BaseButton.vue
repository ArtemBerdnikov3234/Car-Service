<template>
  <component
    :is="tag"
    :to="to"
    :class="buttonClasses"
    class="inline-flex items-center justify-center gap-2 font-semibold transition duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  tag: { type: String, default: "button" },
  to: { type: [String, Object], default: null },
  variant: { type: String, default: "primary" },
});

const buttonClasses = computed(() => {
  // Основная красная кнопка
  if (props.variant === "primary") {
    return "rounded-full px-8 py-3 text-base bg-gradient-to-r from-brand-red to-brand-red-dark text-white hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-1";
  }
  // Второстепенная белая контурная кнопка
  if (props.variant === "secondary") {
    return "rounded-full px-8 py-3 text-base bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50";
  }
  // Второстепенная красная контурная кнопка
  if (props.variant === "danger-outline") {
    return "rounded-full px-8 py-3 text-base bg-transparent border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white";
  }
  // вариант "ССЫЛКА"
  if (props.variant === "link") {
    return "p-0 text-brand-red hover:underline";
  }
  return "";
});
</script>
