<template>
  <main class="container mx-auto max-w-4xl px-6 py-12">
    <h1 class="mb-10 text-center text-5xl font-bold text-brand-red">
      Новая запись
    </h1>

    <div class="mb-10 flex justify-center">
      <ol
        class="flex w-full max-w-2xl items-center text-sm font-medium text-secondary-text"
      >
        <li
          class="flex w-full items-center after:w-full after:border-b after:border-white/20 after:content-['']"
          :class="{ 'text-brand-red': step >= 1 }"
        >
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="
                step > 1
                  ? 'border-brand-red bg-brand-red text-white'
                  : step >= 1
                  ? 'border-brand-red'
                  : 'border-white/20'
              "
              >1</span
            >
            Автомобиль
          </div>
        </li>
        <li
          class="flex w-full items-center after:w-full after:border-b after:border-white/20 after:content-['']"
          :class="{ 'text-brand-red': step >= 2 }"
        >
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="
                step > 2
                  ? 'border-brand-red bg-brand-red text-white'
                  : step >= 2
                  ? 'border-brand-red'
                  : 'border-white/20'
              "
              >2</span
            >
            Услуги
          </div>
        </li>
        <li
          class="flex w-full items-center after:w-full after:border-b after:border-white/20 after:content-['']"
          :class="{ 'text-brand-red': step >= 3 }"
        >
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="
                step > 3
                  ? 'border-brand-red bg-brand-red text-white'
                  : step >= 3
                  ? 'border-brand-red'
                  : 'border-white/20'
              "
              >3</span
            >
            Время
          </div>
        </li>
        <li class="flex items-center" :class="{ 'text-brand-red': step >= 4 }">
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="step >= 4 ? 'border-brand-red' : 'border-white/20'"
              >4</span
            >
            Подтверждение
          </div>
        </li>
      </ol>
    </div>

    <div
      class="rounded-2xl border border-brand-red-light bg-card-dark p-8 shadow-2xl"
    >
      <div v-if="step === 1">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 1: Выберите автомобиль
        </h2>
        <div v-if="carsLoading" class="text-center text-secondary-text">
          Загрузка ваших автомобилей...
        </div>
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="car in userCars"
            :key="car.car_id"
            @click="selectedCarId = car.car_id"
            class="relative flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 bg-light-dark p-6 text-center transition sm:flex-row sm:text-left"
            :class="
              selectedCarId === car.car_id
                ? 'border-brand-red bg-brand-red/10'
                : 'border-white/10 hover:border-white/30'
            "
          >
            <i class="fas fa-car text-2xl text-secondary-text"></i>
            <div>
              <p class="font-bold text-white">{{ car.make }} {{ car.model }}</p>
              <p class="text-sm text-secondary-text">
                {{ car.license_plate || "Без номера" }}
              </p>
            </div>
            <i
              v-if="selectedCarId === car.car_id"
              class="fas fa-check-circle absolute top-4 right-4 text-brand-red"
            ></i>
          </div>
        </div>
      </div>

      <div v-if="step === 2">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 2: Выберите услуги
        </h2>
        <div v-if="servicesLoading" class="text-center text-secondary-text">
          Загрузка услуг...
        </div>
        <div v-else class="max-h-[400px] space-y-3 overflow-y-auto pr-2">
          <div
            v-for="service in allServices"
            :key="service.service_id"
            @click="toggleService(service.service_id)"
            class="relative flex cursor-pointer flex-row items-center justify-between rounded-lg border-2 bg-light-dark p-4 transition"
            :class="
              selectedServiceIds.has(service.service_id)
                ? 'border-brand-red bg-brand-red/10'
                : 'border-white/10 hover:border-white/30'
            "
          >
            <div>
              <p class="font-bold text-white">{{ service.name }}</p>
              <p class="text-sm text-secondary-text">
                ~{{ service.duration_minutes }} мин.
              </p>
            </div>
            <div class="text-right">
              <p class="font-semibold text-brand-red">{{ service.price }} ₽</p>
              <i
                v-if="selectedServiceIds.has(service.service_id)"
                class="fas fa-check-circle mt-1 text-brand-red"
              ></i>
            </div>
          </div>
        </div>
        <div
          v-if="!servicesLoading && totalPrice > 0"
          class="mt-6 border-t border-white/10 pt-4 text-right"
        >
          <p class="text-secondary-text">
            Итого:
            <span class="text-xl font-bold text-white">{{ totalPrice }} ₽</span>
          </p>
          <p class="text-sm text-secondary-text">
            Общая длительность: {{ totalDuration }} мин.
          </p>
        </div>
      </div>

      <div v-if="step === 3">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 3: Выберите дату и время
        </h2>
        <p class="text-center text-secondary-text">
          (Здесь будет календарь и выбор времени)
        </p>
        <p class="mt-4 text-center text-white">
          Для демонстрации, давайте представим, что вы выбрали время.
        </p>
      </div>

      <div v-if="step === 4">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 4: Проверьте и подтвердите
        </h2>
        <div
          v-if="selectedCar && selectedServices.length"
          class="space-y-4 text-lg"
        >
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Автомобиль</p>
            <p class="font-bold text-white">
              {{ selectedCar.make }} {{ selectedCar.model }}
            </p>
          </div>
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Услуги</p>
            <ul class="font-bold text-white">
              <li v-for="s in selectedServices" :key="s.service_id">
                {{ s.name }} ({{ s.price }} ₽)
              </li>
            </ul>
          </div>
          <div class="border-t border-white/10 pt-4 text-right">
            <p class="text-secondary-text">Итоговая стоимость</p>
            <p class="text-3xl font-bold text-brand-red">{{ totalPrice }} ₽</p>
          </div>
        </div>
      </div>

      <div
        class="mt-10 flex items-center justify-between border-t border-white/10 pt-6"
      >
        <BaseButton v-if="step > 1" @click="prevStep" variant="secondary">
          Назад
        </BaseButton>
        <div v-else></div>

        <BaseButton
          v-if="step < 4"
          @click="nextStep"
          :disabled="isNextStepDisabled"
        >
          Далее
        </BaseButton>
        <BaseButton v-if="step === 4" @click="submitBooking">
          <i class="fas fa-calendar-check mr-2"></i>
          Подтвердить запись
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";
import BaseButton from "@/components/BaseButton.vue";

const step = ref(1);

const userCars = ref([]);
const carsLoading = ref(true);
const allServices = ref([]);
const servicesLoading = ref(true);

const selectedCarId = ref(null);
const selectedServiceIds = ref(new Set());

onMounted(async () => {
  carsLoading.value = true;
  try {
    const carsRes = await apiClient.get("/cars");
    userCars.value = carsRes.data;
  } catch (error) {
    console.error("Ошибка загрузки автомобилей:", error);
  } finally {
    carsLoading.value = false;
  }

  servicesLoading.value = true;
  try {
    const servicesRes = await apiClient.get("/services");
    allServices.value = servicesRes.data;
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
  } finally {
    servicesLoading.value = false;
  }
});

const selectedCar = computed(() =>
  userCars.value.find((c) => c.car_id === selectedCarId.value)
);
const selectedServices = computed(() =>
  allServices.value.filter((s) => selectedServiceIds.value.has(s.service_id))
);
const totalPrice = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + s.price, 0)
);
const totalDuration = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + s.duration_minutes, 0)
);

const isNextStepDisabled = computed(() => {
  if (step.value === 1) return !selectedCarId.value;
  if (step.value === 2) return selectedServiceIds.value.size === 0;
  if (step.value === 3) return false;
  return false;
});

const nextStep = () => {
  if (step.value < 4) step.value++;
};
const prevStep = () => {
  if (step.value > 1) step.value--;
};

const toggleService = (serviceId) => {
  if (selectedServiceIds.value.has(serviceId)) {
    selectedServiceIds.value.delete(serviceId);
  } else {
    selectedServiceIds.value.add(serviceId);
  }
};

const submitBooking = () => {
  alert(`Запись подтверждена!
    Авто: ${selectedCar.value.make} ${selectedCar.value.model}
    Услуги: ${selectedServices.value.map((s) => s.name).join(", ")}
    Сумма: ${totalPrice.value} ₽`);
};
</script>
