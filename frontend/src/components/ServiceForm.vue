<template>
  <div>
    <h2 class="mb-8 text-center text-3xl font-bold text-brand-red">
      {{ serviceToEdit ? "Редактировать услугу" : "Добавить новую услугу" }}
    </h2>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Название -->
      <BaseInput
        v-model="form.name"
        label="Название услуги"
        placeholder="Например, Замена масла"
        required
      />

      <!-- Описание -->
      <div>
        <label
          for="description"
          class="mb-2 block font-semibold text-secondary-text"
          >Описание</label
        >
        <textarea
          v-model="form.description"
          id="description"
          rows="3"
          placeholder="Краткое описание того, что входит в услугу"
          class="w-full rounded-lg border border-white/20 bg-dark px-4 py-3 text-white transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
        ></textarea>
      </div>

      <!-- Цена и Длительность -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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

      <!-- Чекбокс "Активна" -->
      <div class="flex items-center">
        <input
          v-model="form.is_active"
          type="checkbox"
          id="is_active"
          class="h-5 w-5 rounded border-white/20 bg-dark text-brand-red transition focus:ring-2 focus:ring-brand-red/50 focus:ring-offset-2 focus:ring-offset-card-dark"
        />
        <label
          for="is_active"
          class="ml-3 block text-sm font-medium text-secondary-text"
        >
          Услуга активна и доступна для записи
        </label>
      </div>

      <!-- Сообщение об ошибке -->
      <p v-if="error" class="text-center text-red-400">{{ error }}</p>

      <!-- Кнопки управления -->
      <div class="flex justify-end gap-4 border-t border-white/10 pt-6">
        <BaseButton @click="$emit('close')" type="button" variant="secondary">
          Отмена
        </BaseButton>
        <BaseButton type="submit" :disabled="loading">
          <span v-if="loading"
            ><i class="fas fa-spinner fa-spin mr-2"></i>Сохранение...</span
          >
          <span v-else><i class="fas fa-save mr-2"></i>Сохранить</span>
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import apiClient from "@/services/api";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue"; // <-- Не забудьте импортировать

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

watch(
  () => props.serviceToEdit,
  (newVal) => {
    if (newVal) {
      Object.assign(form, { ...newVal });
    } else {
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
      await apiClient.put(
        `/services/${props.serviceToEdit.service_id}`,
        serviceData
      );
    } else {
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
