<template>
  <main class="container mx-auto max-w-4xl px-6 py-24">
    <h1 class="mb-10 text-center text-5xl font-bold text-brand-red">
      Новая запись
    </h1>

    <!-- Индикатор шагов -->
    <div class="mb-10 flex justify-center">
      <ol
        class="flex w-full max-w-3xl items-center text-sm font-medium text-secondary-text"
      >
        <!-- Шаг 1 -->
        <li
          class="flex w-full items-center after:w-full after:border-b after:border-white/20 after:content-['']"
          :class="{ 'text-brand-red': step >= 1 }"
        >
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="{
                'border-brand-red': step >= 1,
                'bg-brand-red text-white': step > 1,
                'border-white/20': step < 1,
              }"
              >1</span
            >
            Автомобиль
          </div>
        </li>
        <!-- Шаг 2 -->
        <li
          class="flex w-full items-center after:w-full after:border-b after:border-white/20 after:content-['']"
          :class="{ 'text-brand-red': step >= 2 }"
        >
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="{
                'border-brand-red': step >= 2,
                'bg-brand-red text-white': step > 2,
                'border-white/20': step < 2,
              }"
              >2</span
            >
            Услуги
          </div>
        </li>
        <!-- Шаг 3 -->
        <li
          class="flex w-full items-center after:w-full after:border-b after:border-white/20 after:content-['']"
          :class="{ 'text-brand-red': step >= 3 }"
        >
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="{
                'border-brand-red': step >= 3,
                'bg-brand-red text-white': step > 3,
                'border-white/20': step < 3,
              }"
              >3</span
            >
            Время
          </div>
        </li>
        <!-- Шаг 4 -->
        <li class="flex items-center" :class="{ 'text-brand-red': step >= 4 }">
          <div class="flex items-center">
            <span
              class="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              :class="{
                'border-brand-red': step >= 4,
                'border-white/20': step < 4,
              }"
              >4</span
            >
            Подтверждение
          </div>
        </li>
      </ol>
    </div>

    <!-- Основной блок Wizard -->
    <div
      class="rounded-2xl border border-brand-red-light bg-card-dark p-8 shadow-2xl"
    >
      <!-- Шаг 1 -->
      <div v-if="step === 1">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 1: Выберите автомобиль
        </h2>
        <div v-if="carsLoading" class="text-center text-secondary-text">
          Загрузка ваших автомобилей...
        </div>
        <div
          v-else-if="!userCars.length"
          class="text-center text-secondary-text"
        >
          <p>У вас еще нет добавленных автомобилей.</p>
          <router-link
            :to="{ name: 'ClientDashboard' }"
            class="mt-4 inline-block text-brand-red hover:underline"
            >Добавить в личном кабинете</router-link
          >
        </div>
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="car in userCars"
            :key="car.car_id"
            @click="selectedCarId = car.car_id"
            class="relative flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 bg-light-dark p-6 text-center transition sm:flex-row sm:text-left border-white/10 hover:border-white/30"
            :class="{
              'border-brand-red bg-brand-red/10': selectedCarId === car.car_id,
            }"
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

      <!-- Шаг 2 -->
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

      <!-- Шаг 3: Выбор даты и времени -->
      <div v-if="step === 3">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 3: Выберите дату и время
        </h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <!-- Календарь -->
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
                class="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-transparent transition"
                :class="getDayClasses(day)"
                :title="getDayTitle(day)"
              >
                <span v-if="day">{{ day.date.getDate() }}</span>
                <span
                  v-if="day && isDateBookedByMe(formatDateToYYYYMMDD(day.date))"
                  class="absolute bottom-1 h-1 w-1 rounded-full bg-yellow-400"
                ></span>
              </div>
            </div>
          </div>

          <!-- Выбор времени -->
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
              Нет свободных слотов на эту дату
            </div>
            <div v-else class="grid grid-cols-3 gap-3">
              <button
                v-for="time in availableSlots"
                :key="time"
                @click="selectTime(time)"
                class="relative rounded-lg py-2 font-semibold transition"
                :class="getTimeSlotClasses(time)"
                :disabled="isTimeSlotBookedByMe(time)"
                :title="getTimeSlotTitle(time)"
              >
                {{ time }}
                <span
                  v-if="isTimeSlotBookedByMe(time)"
                  class="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-400"
                  title="У вас уже есть запись на это время"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Шаг 4 -->
      <div v-if="step === 4">
        <h2 class="mb-8 text-center text-3xl font-bold text-white">
          Шаг 4: Проверьте и подтвердите
        </h2>
        <div
          v-if="
            selectedCar &&
            selectedServices.length &&
            selectedDate &&
            selectedTime
          "
          class="space-y-4 text-lg"
        >
          <div class="rounded-lg bg-light-dark p-4">
            <p class="text-sm text-secondary-text">Автомобиль</p>
            <p class="font-bold text-white">
              {{ selectedCar.make }} {{ selectedCar.model }}
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
                <span>{{ s.name }}</span>
                <span>{{ s.price }} ₽</span>
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
        <div v-else class="text-center text-secondary-text">
          <p>
            Пожалуйста, вернитесь на предыдущие шаги и заполните все данные для
            подтверждения.
          </p>
        </div>
      </div>

      <!-- Навигация -->
      <div
        class="mt-10 flex items-center justify-between border-t border-white/10 pt-6"
      >
        <BaseButton v-if="step > 1" @click="prevStep" variant="secondary"
          >Назад</BaseButton
        >
        <div v-else></div>
        <BaseButton
          v-if="step < 4"
          @click="nextStep"
          :disabled="isNextStepDisabled"
          >Далее</BaseButton
        >
        <BaseButton
          v-if="step === 4"
          @click="submitBooking"
          :disabled="bookingLoading"
        >
          <span v-if="bookingLoading">Создание записи...</span>
          <span v-else
            ><i class="fas fa-calendar-check mr-2"></i>Подтвердить</span
          >
        </BaseButton>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api";
import BaseButton from "@/components/BaseButton.vue";

// === ОСНОВНЫЕ ПЕРЕМЕННЫЕ ===
const step = ref(1);
const router = useRouter();
const userCars = ref([]);
const allServices = ref([]);
const myBookings = ref([]);
const selectedCarId = ref(null);
const selectedServiceIds = ref(new Set());
const currentDate = ref(new Date());
const selectedDate = ref(null);
const availableSlots = ref([]);
const selectedTime = ref(null);

// === СТАТУСЫ ЗАГРУЗКИ ===
const carsLoading = ref(true);
const servicesLoading = ref(true);
const bookingsLoading = ref(true);
const slotsLoading = ref(false);
const slotsError = ref(null);
const bookingLoading = ref(false);
const bookingError = ref(null);

// === ФУНКЦИИ ===

/**
 * Надежная функция для форматирования объекта Date в строку YYYY-MM-DD,
 * игнорируя часовые пояса.
 */
const formatDateToYYYYMMDD = (date) => {
  if (!date) return null;
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Загрузка всех начальных данных при монтировании компонента
 */
onMounted(async () => {
  bookingsLoading.value = true;
  carsLoading.value = true;
  servicesLoading.value = true;
  try {
    const [carsRes, servicesRes, bookingsRes] = await Promise.all([
      apiClient.get("/cars"),
      apiClient.get("/services"),
      apiClient.get("/appointments/my"),
    ]);
    userCars.value = carsRes.data;
    allServices.value = servicesRes.data.filter((s) => s.is_active);
    myBookings.value = bookingsRes.data.filter(
      (b) => b.status !== "cancelled" && b.status !== "completed"
    );
  } catch (error) {
    console.error("Ошибка при начальной загрузке данных:", error);
  } finally {
    bookingsLoading.value = false;
    carsLoading.value = false;
    servicesLoading.value = false;
  }
});

/**
 * Запрос свободных слотов на сервере
 */
const triggerSlotsRequest = async () => {
  if (!selectedDate.value || selectedServiceIds.value.size === 0) {
    availableSlots.value = [];
    return;
  }
  slotsLoading.value = true;
  slotsError.value = null;
  availableSlots.value = [];
  selectedTime.value = null;

  try {
    const serviceIdsString = Array.from(selectedServiceIds.value).join(",");
    const response = await apiClient.get(`/appointments/available-slots`, {
      params: {
        date: selectedDate.value,
        serviceIds: serviceIdsString,
      },
    });
    availableSlots.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки слотов времени:", error);
    slotsError.value =
      error.response?.data?.message || "Не удалось загрузить слоты.";
  } finally {
    slotsLoading.value = false;
  }
};
watch(selectedDate, triggerSlotsRequest);

/**
 * Проверяет, есть ли у пользователя запись на эту дату
 */
const isDateBookedByMe = (dateStr) => {
  if (!dateStr || bookingsLoading.value) return false;
  // Преобразуем UTC дату с сервера в локальную YYYY-MM-DD для сравнения
  return myBookings.value.some((booking) => {
    const localDate = new Date(booking.start_time);
    return formatDateToYYYYMMDD(localDate) === dateStr;
  });
};

/**
 * Проверяет, есть ли у пользователя запись на это конкретное время
 */
const isTimeSlotBookedByMe = (timeStr) => {
  if (!selectedDate.value || !timeStr) return false;
  return myBookings.value.some((booking) => {
    const localDate = new Date(booking.start_time);
    const bookingDateStr = formatDateToYYYYMMDD(localDate);
    const bookingTimeStr = localDate.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return bookingDateStr === selectedDate.value && bookingTimeStr === timeStr;
  });
};

const selectDate = (day) => {
  if (!day || !day.isCurrentMonth || day.isPast) return;
  selectedDate.value = formatDateToYYYYMMDD(day.date);
};

const selectTime = (time) => {
  if (isTimeSlotBookedByMe(time)) return; // Блокируем клик
  selectedTime.value = time;
};

const getDayClasses = (day) => {
  if (!day) return "invisible";
  const dateStr = formatDateToYYYYMMDD(day.date);
  return {
    "opacity-50 cursor-not-allowed": !day.isCurrentMonth,
    "cursor-not-allowed text-gray-600": day.isPast && day.isCurrentMonth,
    "hover:border-white/50": !day.isPast && day.isCurrentMonth,
    "bg-brand-red text-white font-bold":
      selectedDate.value === dateStr && !day.isPast,
    "border-yellow-500/50": isDateBookedByMe(dateStr),
  };
};

const getDayTitle = (day) => {
  if (!day) return "";
  const dateStr = formatDateToYYYYMMDD(day.date);
  const bookingOnDate = myBookings.value.find(
    (b) => formatDateToYYYYMMDD(new Date(b.start_time)) === dateStr
  );
  return bookingOnDate
    ? `У вас уже есть запись в ${formatTime(bookingOnDate.start_time)}`
    : "";
};

const getTimeSlotClasses = (time) => {
  const isBooked = isTimeSlotBookedByMe(time);
  return {
    "bg-brand-red text-white": selectedTime.value === time && !isBooked,
    "bg-light-dark text-secondary-text hover:bg-card-dark":
      !isBooked && selectedTime.value !== time,
    "bg-yellow-500/20 text-yellow-400 cursor-not-allowed": isBooked,
  };
};

const getTimeSlotTitle = (time) => {
  return isTimeSlotBookedByMe(time) ? "У вас уже есть запись на это время" : "";
};

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const selectedCar = computed(() =>
  userCars.value.find((c) => c.car_id === selectedCarId.value)
);
const selectedServices = computed(() =>
  allServices.value.filter((s) => selectedServiceIds.value.has(s.service_id))
);
const totalPrice = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + Number(s.price), 0)
);
const totalDuration = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + Number(s.duration_minutes), 0)
);

const isNextStepDisabled = computed(() => {
  if (step.value === 1) return !selectedCarId.value;
  if (step.value === 2) return selectedServiceIds.value.size === 0;
  if (step.value === 3) return !selectedTime.value;
  return false;
});

const nextStep = () => {
  if (!isNextStepDisabled.value && step.value < 4) step.value++;
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
  if (step.value === 3 && selectedDate.value) {
    triggerSlotsRequest();
  }
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

const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return "";
  const [year, month, day] = selectedDate.value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
});

const submitBooking = async () => {
  if (
    !selectedCarId.value ||
    selectedServiceIds.value.size === 0 ||
    !selectedDate.value ||
    !selectedTime.value
  ) {
    bookingError.value =
      "Пожалуйста, заполните все необходимые данные на каждом шаге.";
    return;
  }
  bookingLoading.value = true;
  bookingError.value = null;

  // Формируем строку без информации о часовом поясе.
  // Бэкенд (new Date()) интерпретирует ее как локальное время сервера.
  const startTimeString = `${selectedDate.value}T${selectedTime.value}:00`;

  const bookingData = {
    car_id: selectedCarId.value,
    service_ids: Array.from(selectedServiceIds.value),
    start_time: startTimeString,
  };

  try {
    await apiClient.post("/appointments", bookingData);
    router.push({ name: "ClientDashboard", query: { bookingSuccess: "true" } });
  } catch (error) {
    console.error("Ошибка при создании записи:", error);
    bookingError.value =
      error.response?.data?.message ||
      "Не удалось создать запись. Произошла ошибка на сервере.";
  } finally {
    bookingLoading.value = false;
  }
};
</script>
