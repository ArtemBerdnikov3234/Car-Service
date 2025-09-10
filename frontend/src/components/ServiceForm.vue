<!-- src/components/ServiceForm.vue -->
<template>
  <div>
    <h2 class="text-3xl font-bold mb-6 text-gray-800">
      {{ serviceToEdit ? "Редактировать услугу" : "Добавить новую услугу" }}
    </h2>
    <form @submit.prevent="submitForm" class="space-y-6">
      <BaseInput
        v-model="form.name"
        label="Название услуги"
        placeholder="Например, Замена масла"
        required
      />

      <div>
        <label for="description" class="block text-gray-700 font-semibold mb-2"
          >Описание</label
        >
        <textarea
          v-model="form.description"
          id="description"
          rows="3"
          class="form-input"
          placeholder="Краткое описание того, что входит в услугу"
        ></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BaseInput
          v-model.number="form.price"
          label="Цена, ₽"
          type="number"
          placeholder="1500"
          required
        />
        <BaseInput
          v-model.number="form.duration_minutes"
          label="Длительность, мин"
          type="number"
          placeholder="30"
          required
        />
      </div>

      <div class="flex items-center">
        <input
          v-model="form.is_active"
          type="checkbox"
          id="is_active"
          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label for="is_active" class="ml-2 block text-sm text-gray-900"
          >Услуга активна и доступна для записи</label
        >
      </div>

      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>

      <div class="pt-6 flex justify-end gap-4 border-t border-gray-200">
        <button @click="$emit('close')" type="button" class="btn-secondary">
          Отмена
        </button>
        <button type="submit" :disabled="loading" class="btn-primary">
          <span v-if="loading">Сохранение...</span>
          <span v-else><i class="fas fa-save mr-2"></i>Сохранить</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import apiClient from "@/services/api";
import BaseInput from "@/components/BaseInput.vue"; // Импортируем наш базовый инпут

const props = defineProps({
  serviceToEdit: { type: Object, default: null },
});

const emit = defineEmits(["close", "saved"]);

const form = reactive({
  name: "",
  description: "",
  price: null,
  duration_minutes: null,
  is_active: true,
});

const loading = ref(false);
const error = ref(null);

// Заполняем форму, если передали услугу для редактирования
watch(
  () => props.serviceToEdit,
  (newVal) => {
    if (newVal) {
      Object.assign(form, { ...newVal });
    } else {
      // Сбрасываем форму для создания новой услуги
      Object.assign(form, {
        name: "",
        description: "",
        price: null,
        duration_minutes: null,
        is_active: true,
      });
    }
  },
  { immediate: true }
);

const submitForm = async () => {
  loading.value = true;
  error.value = null;
  try {
    const serviceData = { ...form };

    if (props.serviceToEdit?.service_id) {
      // Режим редактирования
      await apiClient.put(
        `/services/${props.serviceToEdit.service_id}`,
        serviceData
      );
    } else {
      // Режим создания
      await apiClient.post("/services", serviceData);
    }
    emit("saved");
    emit("close");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Произошла непредвиденная ошибка.";
  } finally {
    loading.value = false;
  }
};
</script>
