<template>
  <div>
    <h1 class="mb-8 text-center text-3xl font-bold text-brand-red">
      Создание новой записи
    </h1>
    <div class="mb-8 flex justify-center">
      <ol
        class="flex w-full flex-wrap items-center justify-center text-center text-sm font-medium text-secondary-text"
      >
        <li
          class="relative flex w-1/5 flex-col items-center p-2 sm:w-auto sm:flex-1 sm:flex-row sm:after:absolute sm:after:top-1/2 sm:after:left-full sm:after:h-px sm:after:w-full sm:after:-translate-y-1/2 sm:after:bg-white/20 sm:after:content-['']"
          :class="{
            'text-brand-red': step >= 1,
            'sm:after:bg-brand-red': step > 1,
          }"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
            :class="{
              'border-brand-red': step >= 1,
              'bg-brand-red text-white': step > 1,
            }"
            >1</span
          >
          <span class="ml-0 mt-2 text-xs font-semibold sm:ml-3 sm:mt-0 sm:block"
            >Клиент</span
          >
        </li>
        <li
          class="relative flex w-1/5 flex-col items-center p-2 sm:w-auto sm:flex-1 sm:flex-row sm:after:absolute sm:after:top-1/2 sm:after:left-full sm:after:h-px sm:after:w-full sm:after:-translate-y-1/2 sm:after:bg-white/20 sm:after:content-['']"
          :class="{
            'text-brand-red': step >= 2,
            'sm:after:bg-brand-red': step > 2,
          }"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
            :class="{
              'border-brand-red': step >= 2,
              'bg-brand-red text-white': step > 2,
            }"
            >2</span
          >
          <span class="ml-0 mt-2 text-xs font-semibold sm:ml-3 sm:mt-0 sm:block"
            >Авто</span
          >
        </li>
        <li
          class="relative flex w-1/5 flex-col items-center p-2 sm:w-auto sm:flex-1 sm:flex-row sm:after:absolute sm:after:top-1/2 sm:after:left-full sm:after:h-px sm:after:w-full sm:after:-translate-y-1/2 sm:after:bg-white/20 sm:after:content-['']"
          :class="{
            'text-brand-red': step >= 3,
            'sm:after:bg-brand-red': step > 3,
          }"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
            :class="{
              'border-brand-red': step >= 3,
              'bg-brand-red text-white': step > 3,
            }"
            >3</span
          >
          <span class="ml-0 mt-2 text-xs font-semibold sm:ml-3 sm:mt-0 sm:block"
            >Услуги</span
          >
        </li>
        <li
          class="relative flex w-1/5 flex-col items-center p-2 sm:w-auto sm:flex-1 sm:flex-row sm:after:absolute sm:after:top-1/2 sm:after:left-full sm:after:h-px sm:after:w-full sm:after:-translate-y-1/2 sm:after:bg-white/20 sm:after:content-['']"
          :class="{
            'text-brand-red': step >= 4,
            'sm:after:bg-brand-red': step > 4,
          }"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
            :class="{
              'border-brand-red': step >= 4,
              'bg-brand-red text-white': step > 4,
            }"
            >4</span
          >
          <span class="ml-0 mt-2 text-xs font-semibold sm:ml-3 sm:mt-0 sm:block"
            >Время</span
          >
        </li>
        <li
          class="relative flex w-1/5 flex-col items-center p-2 sm:w-auto sm:flex-1 sm:flex-row"
          :class="{ 'text-brand-red': step >= 5 }"
        >
          <span
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300"
            :class="{ 'border-brand-red': step >= 5 }"
            >5</span
          >
          <span class="ml-0 mt-2 text-xs font-semibold sm:ml-3 sm:mt-0 sm:block"
            >Итог</span
          >
        </li>
      </ol>
    </div>

    <div>
      <div v-if="step === 1" class="space-y-6">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 1: Данные клиента
        </h2>
        <p class="text-center text-sm text-secondary-text -mt-6">
          Введите информацию о клиенте для записи.
        </p>
        <BaseInput v-model="clientForm.first_name" label="Имя" required />
        <BaseInput v-model="clientForm.last_name" label="Фамилия" required />
        <BaseInput
          v-model="clientForm.phone_number"
          label="Контактный телефон"
          placeholder="+7 (999) 123-45-67"
          required
        />
        <BaseInput
          v-model="clientForm.email"
          type="email"
          label="Email (необязательно)"
        />
      </div>

      <div v-if="step === 2" class="space-y-6">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 2: Данные автомобиля
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="carForm.make"
            label="Марка"
            placeholder="Toyota"
            required
          />
          <BaseInput
            v-model="carForm.model"
            label="Модель"
            placeholder="Camry"
            required
          />
        </div>
        <BaseInput
          v-model.number="carForm.year_of_manufacture"
          type="number"
          label="Год выпуска"
          placeholder="2020"
        />
        <BaseInput
          v-model="carForm.license_plate"
          label="Госномер"
          placeholder="А123БВ 777"
        />
        <BaseInput v-model="carForm.vin_code" label="VIN-код (необязательно)" />
      </div>

      <div v-if="step === 3">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 3: Выберите услуги
        </h2>
        <div v-if="servicesLoading" class="text-center text-secondary-text">
          Загрузка услуг...
        </div>
        <div v-else class="max-h-[400px] space-y-3 overflow-y-auto pr-2">
          <div
            v-for="service in allServices"
            :key="service.service_id"
            @click="toggleService(service.service_id)"
            class="relative flex cursor-pointer flex-row items-center justify-between rounded-lg border-2 bg-light-dark p-4 transition border-white/10 hover:border-white/30"
            :class="{
              'border-brand-red bg-brand-red/10': selectedServiceIds.has(
                service.service_id
              ),
            }"
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

      <div v-if="step === 4">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 4: Выберите дату и время
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div class="mb-4 flex items-center justify-between">
              <button
                @click="prevMonth"
                class="px-3 py-1 text-xl hover:text-brand-red"
              >
                &lt;
              </button>
              <h3 class="text-lg font-semibold text-white">
                {{ monthYearHeader }}
              </h3>
              <button
                @click="nextMonth"
                class="px-3 py-1 text-xl hover:text-brand-red"
              >
                &gt;
              </button>
            </div>
            <div
              class="grid grid-cols-7 text-center text-xs text-secondary-text"
            >
              <div
                v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
                :key="day"
                class="p-2"
              >
                {{ day }}
              </div>
            </div>
            <div class="grid grid-cols-7 text-center">
              <div
                v-for="(day, index) in calendarGrid"
                :key="index"
                @click="selectDate(day)"
                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent transition"
                :class="getDayClasses(day)"
              >
                <span v-if="day">{{ day.date.getDate() }}</span>
              </div>
            </div>
          </div>
          <div
            class="border-t border-white/10 pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8"
          >
            <h3 class="mb-4 text-lg font-semibold text-white">
              Доступное время:
            </h3>
            <div
              v-if="slotsLoading"
              class="flex items-center justify-center py-10"
            >
              <i
                class="fas fa-spinner fa-spin text-2xl text-secondary-text"
              ></i>
            </div>
            <div
              v-else-if="!selectedDate"
              class="text-center text-secondary-text"
            >
              Выберите дату в календаре
            </div>
            <div v-else-if="slotsError" class="text-center text-red-400">
              {{ slotsError }}
            </div>
            <div
              v-else-if="!availableSlots.length"
              class="text-center text-secondary-text"
            >
              Нет свободных слотов
            </div>
            <div v-else class="grid grid-cols-3 gap-3">
              <button
                v-for="time in availableSlots"
                :key="time"
                @click="selectTime(time)"
                class="rounded-lg py-2 font-semibold transition"
                :class="
                  selectedTime === time
                    ? 'bg-brand-red text-white'
                    : 'bg-light-dark text-secondary-text hover:bg-card-dark'
                "
              >
                {{ time }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="step === 5">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 5: Проверьте и подтвердите
        </h2>
        <div class="space-y-4 text-lg">
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Клиент</p>
            <p class="font-bold text-white">
              {{ clientForm.first_name }} {{ clientForm.last_name }} ({{
                clientForm.phone_number
              }})
            </p>
          </div>
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Автомобиль</p>
            <p class="font-bold text-white">
              {{ carForm.make }} {{ carForm.model }} ({{
                carForm.license_plate || "Без номера"
              }})
            </p>
          </div>
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Дата и время</p>
            <p class="font-bold text-white">
              {{ selectedDateFormatted }} в {{ selectedTime }}
            </p>
          </div>
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Услуги</p>
            <ul class="font-bold text-white">
              <li
                v-for="s in selectedServices"
                :key="s.service_id"
                class="flex justify-between"
              >
                <span>{{ s.name }}</span
                ><span>{{ s.price }} ₽</span>
              </li>
            </ul>
          </div>
          <div class="border-t border-white/10 pt-4 text-right">
            <p class="text-secondary-text">Итоговая стоимость</p>
            <p class="text-3xl font-bold text-brand-red">{{ totalPrice }} ₽</p>
          </div>
          <p v-if="bookingError" class="mt-4 text-center text-red-400">
            {{ bookingError }}
          </p>
        </div>
      </div>

      <div
        class="mt-10 flex items-center justify-between border-t border-white/10 pt-6"
      >
        <BaseButton v-if="step > 1" @click="prevStep" variant="secondary"
          >Назад</BaseButton
        >
        <div v-else></div>
        <BaseButton
          v-if="step < 5"
          @click="nextStep"
          :disabled="isNextStepDisabled"
          >Далее</BaseButton
        >
        <BaseButton
          v-if="step === 5"
          @click="submitBookingByAdmin"
          :disabled="bookingLoading"
        >
          <span v-if="bookingLoading">Создание...</span>
          <span v-else>Создать запись</span>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import apiClient from "@/services/api";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";

const emit = defineEmits(["close", "saved"]);

const step = ref(1);

const clientForm = reactive({
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
});
const carForm = reactive({
  make: "",
  model: "",
  year_of_manufacture: null,
  license_plate: "",
  vin_code: "",
});

const allServices = ref([]);
const servicesLoading = ref(true);
const selectedServiceIds = ref(new Set());
const currentDate = ref(new Date());
const selectedDate = ref(null);
const availableSlots = ref([]);
const slotsLoading = ref(false);
const slotsError = ref(null);
const selectedTime = ref(null);
const bookingLoading = ref(false);
const bookingError = ref(null);

onMounted(async () => {
  servicesLoading.value = true;
  try {
    const servicesRes = await apiClient.get("/services");
    allServices.value = servicesRes.data.filter((s) => s.is_active);
  } catch (error) {
    console.error("Ошибка загрузки услуг:", error);
  } finally {
    servicesLoading.value = false;
  }
});

const selectedServices = computed(() =>
  allServices.value.filter((s) => selectedServiceIds.value.has(s.service_id))
);
const totalDuration = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + Number(s.duration_minutes), 0)
);
const totalPrice = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + Number(s.price), 0)
);

const triggerSlotsRequest = async () => {
  if (!selectedDate.value) return;
  slotsLoading.value = true;
  slotsError.value = null;
  availableSlots.value = [];
  selectedTime.value = null;
  try {
    const response = await apiClient.get(`/appointments/available-slots`, {
      params: { date: selectedDate.value, duration: totalDuration.value },
    });
    availableSlots.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки слотов времени:", error);
    slotsError.value = "Не удалось загрузить слоты.";
  } finally {
    slotsLoading.value = false;
  }
};
watch(selectedDate, triggerSlotsRequest);

const isNextStepDisabled = computed(() => {
  if (step.value === 1)
    return (
      !clientForm.first_name ||
      !clientForm.last_name ||
      !clientForm.phone_number
    );
  if (step.value === 2) return !carForm.make || !carForm.model;
  if (step.value === 3) return selectedServiceIds.value.size === 0;
  if (step.value === 4) return !selectedTime.value;
  return false;
});

const nextStep = () => {
  if (!isNextStepDisabled.value && step.value < 5) step.value++;
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
  if (step.value === 4 && selectedDate.value) {
    triggerSlotsRequest();
  }
};

const submitBookingByAdmin = async () => {
  bookingLoading.value = true;
  bookingError.value = null;
  try {
    const carDataPayload = { ...carForm };
    if (!carDataPayload.year_of_manufacture) {
      delete carDataPayload.year_of_manufacture;
    }

    const bookingData = {
      client_data: { ...clientForm },
      car_data: carDataPayload,
      service_ids: Array.from(selectedServiceIds.value),
      start_time: new Date(
        `${selectedDate.value}T${selectedTime.value}:00`
      ).toISOString(),
    };
    await apiClient.post("/appointments/admin-create", bookingData);
    emit("saved");
    emit("close");
  } catch (error) {
    console.error("Ошибка при создании записи администратором:", error);
    bookingError.value =
      error.response?.data?.message || "Не удалось создать запись.";
  } finally {
    bookingLoading.value = false;
  }
};

const selectTime = (time) => {
  selectedTime.value = time;
};
const monthYearHeader = computed(() => {
  const date = currentDate.value;
  const month = date.toLocaleString("ru-RU", { month: "long" });
  return `${
    month.charAt(0).toUpperCase() + month.slice(1)
  } ${date.getFullYear()}`;
});
const calendarGrid = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const days = [];
  let startDayOfWeek = firstDayOfMonth.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true, isPast: date < today });
  }
  return days;
});
const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.setMonth(currentDate.value.getMonth() - 1, 1)
  );
};
const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.setMonth(currentDate.value.getMonth() + 1, 1)
  );
};
const formatDateToYYYYMMDD = (date) => date.toISOString().split("T")[0];
const selectDate = (day) => {
  if (!day || !day.isCurrentMonth || day.isPast) return;
  selectedDate.value = formatDateToYYYYMMDD(day.date);
};
const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return "";
  const date = new Date(selectedDate.value);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString(
    "ru-RU",
    { day: "numeric", month: "long", year: "numeric" }
  );
});
const getDayClasses = (day) => {
  if (!day) return "invisible";
  return {
    "cursor-not-allowed text-gray-600": day.isPast,
    "hover:border-white/50": !day.isPast,
    "bg-brand-red text-white font-bold":
      selectedDate.value === formatDateToYYYYMMDD(day.date) && !day.isPast,
  };
};
</script>
