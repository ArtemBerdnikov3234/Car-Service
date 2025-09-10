<!-- src/components/BaseModal.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show"
        class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70"
      >
        <div
          class="flex items-start justify-center min-h-screen px-4 pt-20 pb-20 text-center"
          @click.self="close"
        >
          <Transition
            enter-active-class="transition ease-out duration-300 transform"
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-200 transform"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 scale-95"
          >
            <div
              v-show="show"
              class="relative w-full max-w-lg p-8 mx-auto text-left bg-brand-gray rounded-xl shadow-xl border border-brand-light-gray"
            >
              <button
                @click="close"
                class="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-white"
              >
                <i class="fas fa-times text-2xl"></i>
              </button>
              <slot></slot>
              <!-- Сюда будет вставляться содержимое модального окна (наша форма) -->
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};

const closeOnEscape = (e) => {
  if (e.key === "Escape" && props.show) {
    close();
  }
};

onMounted(() => document.addEventListener("keydown", closeOnEscape));
onUnmounted(() => document.removeEventListener("keydown", closeOnEscape));
</script>
