<template>
  <BaseModal :show="show" @close="$emit('close')">
    <div class="text-center">
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 text-3xl text-brand-red"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3 class="mb-4 text-2xl font-bold text-white">{{ title }}</h3>
      <p class="text-secondary-text">{{ message }}</p>
      <div class="mt-8 flex justify-center gap-4">
        <BaseButton @click="$emit('cancel')" variant="secondary"
          >Отмена</BaseButton
        >
        <BaseButton @click="$emit('confirm')">Подтвердить</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from "./BaseModal.vue";
import BaseButton from "./BaseButton.vue";
defineProps({
  show: Boolean,
  title: { type: String, default: "Вы уверены?" },
  message: { type: String, default: "Это действие нельзя будет отменить." },
});
defineEmits(["close", "confirm", "cancel"]);
</script>
