<!-- src/components/CarForm.vue -->
<template>
  <div
    class="bg-gray-100 rounded-xl shadow-lg p-8 border border-gray-300 max-w-3xl mx-auto"
  >
    <h1 class="text-4xl lg:text-5xl font-bold text-center mb-10 text-gray-900">
      {{ carToEdit ? "Редактирование" : "Добавление" }} автомобиля
    </h1>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Марка / Модель -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="make" class="block text-gray-700 font-semibold mb-2"
            >Марка</label
          >
          <input
            v-model="form.make"
            type="text"
            id="make"
            placeholder="Например, Toyota"
            class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
            required
          />
        </div>
        <div>
          <label for="model" class="block text-gray-700 font-semibold mb-2"
            >Модель</label
          >
          <input
            v-model="form.model"
            type="text"
            id="model"
            placeholder="Например, Camry"
            class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
            required
          />
        </div>
      </div>
      <!-- Год -->
      <div>
        <label for="year" class="block text-gray-700 font-semibold mb-2"
          >Год выпуска</label
        >
        <select
          v-model.number="form.year_of_manufacture"
          id="year"
          class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
          required
        >
          <option disabled value="">Выберите год</option>
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
      <!-- VIN -->
      <div>
        <label for="vin" class="block text-gray-700 font-semibold mb-2"
          >VIN-код</label
        >
        <input
          v-model="form.vin_code"
          type="text"
          id="vin"
          placeholder="XXXXXXXXXXXXXXXXX"
          maxlength="17"
          class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
        />
        <p class="text-xs text-gray-500 mt-1">Должно быть 17 символов</p>
      </div>
      <!-- Госномер / Пробег -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="license_plate"
            class="block text-gray-700 font-semibold mb-2"
            >Госномер</label
          >
          <input
            v-model="form.license_plate"
            type="text"
            id="license_plate"
            placeholder="А123БВ 777"
            class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
          />
        </div>
        <div>
          <label for="mileage" class="block text-gray-700 font-semibold mb-2"
            >Пробег (км)</label
          >
          <input
            v-model.number="form.mileage"
            type="number"
            id="mileage"
            placeholder="50000"
            class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
      <!-- Примечания -->
      <div>
        <label for="notes" class="block text-gray-700 font-semibold mb-2"
          >Примечания</label
        >
        <textarea
          v-model="form.notes"
          id="notes"
          rows="4"
          class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-900 placeholder-gray-500"
          placeholder="Дополнительная информация (например, установлено ГБО)"
        ></textarea>
      </div>
      <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
      <!-- Кнопки -->
      <div class="pt-6 flex justify-end gap-4 border-t border-gray-300">
        <button
          @click="$emit('close')"
          type="button"
          class="py-3 px-8 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Отмена
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="py-3 px-8 bg-gray-900 hover:bg-gray-700 text-white font-bold rounded-lg transition flex items-center disabled:opacity-50"
        >
          <i v-if="!loading" class="fas fa-save mr-3"></i>
          <span>{{ loading ? "Сохранение..." : "Сохранить" }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<!-- Блок <style> полностью удален -->

<script setup>
import { ref, reactive, watch, computed } from "vue";
import apiClient from "@/services/api";

const props = defineProps({
  carToEdit: { type: Object, default: null },
});
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
      await apiClient.put(`/cars/${props.carToEdit.car_id}`, carData);
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
