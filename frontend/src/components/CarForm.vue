<template>
  <div>
    <h1 class="mb-8 text-center text-3xl font-bold text-brand-red">
      {{ carToEdit ? "Редактирование" : "Добавление" }} автомобиля
    </h1>
    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <BaseInput
          v-model="form.make"
          label="Марка"
          placeholder="Например, Toyota"
          required
        />
        <BaseInput
          v-model="form.model"
          label="Модель"
          placeholder="Например, Camry"
          required
        />
      </div>

      <div>
        <label for="year" class="mb-2 block font-semibold text-secondary-text"
          >Год выпуска</label
        >
        <select
          v-model.number="form.year_of_manufacture"
          id="year"
          class="w-full rounded-lg border border-white/20 bg-dark px-4 py-3 text-white transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
          required
        >
          <option disabled value="">Выберите год</option>
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <BaseInput
        v-model="form.vin_code"
        label="VIN-код"
        placeholder="XXXXXXXXXXXXXXXXX"
        maxlength="17"
      />

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <BaseInput
          v-model="form.license_plate"
          label="Госномер"
          placeholder="А123БВ 777"
        />
        <BaseInput
          v-model.number="form.mileage"
          type="number"
          label="Пробег (км)"
          placeholder="50000"
        />
      </div>

      <div>
        <label for="notes" class="mb-2 block font-semibold text-secondary-text"
          >Примечания</label
        >
        <textarea
          v-model="form.notes"
          id="notes"
          rows="3"
          class="w-full rounded-lg border border-white/20 bg-dark px-4 py-3 text-white transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
          placeholder="Дополнительная информация (например, установлено ГБО)"
        ></textarea>
      </div>

      <p v-if="error" class="text-center text-red-400">{{ error }}</p>

      <div class="flex justify-end gap-4 border-t border-white/10 pt-6">
        <BaseButton type="button" @click="$emit('close')" variant="secondary"
          >Отмена</BaseButton
        >
        <BaseButton type="submit" :disabled="loading">
          <i v-if="!loading" class="fas fa-save mr-2"></i>
          {{ loading ? "Сохранение..." : "Сохранить" }}
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import apiClient from "@/services/api";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";

const props = defineProps({ carToEdit: { type: Object, default: null } });
const emit = defineEmits(["close", "car-saved"]);
const form = reactive({
  make: "",
  model: "",
  year_of_manufacture: "",
  vin_code: "",
  license_plate: "",
  mileage: null,
  notes: "",
});
const loading = ref(false);
const error = ref(null);

watch(
  () => props.carToEdit,
  (newVal) => {
    if (newVal) {
      Object.assign(form, { ...newVal });
    } else {
      Object.assign(form, {
        make: "",
        model: "",
        year_of_manufacture: "",
        vin_code: "",
        license_plate: "",
        mileage: null,
        notes: "",
      });
    }
  },
  { immediate: true }
);

const currentYear = new Date().getFullYear();
const yearOptions = computed(() => {
  const years = [];
  for (let year = currentYear + 1; year >= 1950; year--) {
    years.push(year);
  }
  return years;
});

const submitForm = async () => {
  loading.value = true;
  error.value = null;
  try {
    const carData = Object.fromEntries(
      Object.entries(form).filter(([_, v]) => v != null && v !== "")
    );
    if (props.carToEdit?.car_id) {
      await apiClient.put(`/cars/${props.carToTedit.car_id}`, carData);
    } else {
      await apiClient.post("/cars", carData);
    }
    emit("car-saved");
    emit("close");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Произошла непредвиденная ошибка.";
  } finally {
    loading.value = false;
  }
};
</script>
