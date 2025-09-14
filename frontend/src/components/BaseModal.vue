<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 px-4 backdrop-blur-sm"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-show="show"
            class="relative w-full max-w-lg rounded-2xl border border-brand-red-light bg-card-dark p-8 shadow-2xl"
          >
            <button
              @click="close"
              class="absolute top-4 right-4 text-2xl text-secondary-text transition duration-300 hover:rotate-90 hover:text-brand-red"
            >
              <i class="fas fa-times"></i>
            </button>
            <slot></slot>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
const props = defineProps({ show: { type: Boolean, default: false } });
const emit = defineEmits(["close"]);
const close = () => emit("close");
const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) close();
};
onMounted(() => document.addEventListener("keydown", closeOnEscape));
onUnmounted(() => document.removeEventListener("keydown", closeOnEscape));
</script>
