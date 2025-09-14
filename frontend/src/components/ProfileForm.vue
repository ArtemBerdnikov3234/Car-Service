<template>
  <div
    class="bg-brand-gray rounded-xl shadow-xl p-8 border border-brand-light-gray max-w-3xl mx-auto"
  >
    <h1 class="text-4xl font-bold text-center mb-8 text-brand-white">
      Редактирование профиля
    </h1>
    <form @submit.prevent="submitProfile" class="space-y-6">
      <h2
        class="text-2xl font-bold border-b border-brand-light-gray pb-4 text-brand-white"
      >
        Личные данные
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput v-model="form.first_name" label="Имя" required />
        <BaseInput v-model="form.last_name" label="Фамилия" required />
      </div>
      <BaseInput v-model="form.phone_number" label="Контактный телефон" />
      <div>
        <label class="block text-brand-text font-semibold mb-2">Email</label>
        <div
          class="w-full px-4 py-3 bg-brand-dark border border-gray-600 rounded-lg text-gray-400 flex items-center"
        >
          <i class="fas fa-lock mr-3"></i>{{ initialProfile.email }}
        </div>
        <p class="text-xs text-gray-500 mt-2">
          <i class="fas fa-info-circle mr-1"></i>Email нельзя изменить. Для
          смены обратитесь в поддержку.
        </p>
      </div>

      <p v-if="successMessage" class="text-green-400">{{ successMessage }}</p>
      <p v-if="error" class="text-red-400">{{ error }}</p>

      <div class="pt-6 flex justify-end gap-4 border-t border-brand-light-gray">
        <button
          @click="$emit('close')"
          type="button"
          class="py-2 px-6 bg-brand-light-gray text-brand-white rounded-lg hover:bg-gray-600 transition"
        >
          Назад
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="py-2 px-6 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-lg transition disabled:opacity-50"
        >
          <span v-if="loading">Сохранение...</span>
          <span v-else><i class="fas fa-save mr-2"></i>Сохранить</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import apiClient from "@/services/api";
import BaseInput from "@/components/BaseInput.vue";

const emit = defineEmits(["close", "profile-updated"]);

const initialProfile = ref({});
const form = reactive({
  first_name: "",
  last_name: "",
  phone_number: "",
});

const loading = ref(false);
const error = ref(null);
const successMessage = ref("");

onMounted(async () => {
  try {
    const { data } = await apiClient.get("/users/me");
    initialProfile.value = data;
    Object.assign(form, data);
  } catch (err) {
    error.value = "Не удалось загрузить данные профиля.";
  }
});

const submitProfile = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = "";
  try {
    await apiClient.put("/users/me", form);
    successMessage.value = "Профиль успешно обновлен!";
    emit("profile-updated");
    setTimeout(() => emit("close"), 2000); // Закрыть через 2 секунды
  } catch (err) {
    error.value =
      err.response?.data?.message || "Ошибка при обновлении профиля.";
  } finally {
    loading.value = false;
  }
};
</script>
