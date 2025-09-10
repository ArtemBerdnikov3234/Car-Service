<!-- src/views/client/Dashboard.vue -->
<template>
  <div class="container mx-auto px-6 py-12">
    <!-- === УСЛОВНОЕ ОТОБРАЖЕНИЕ: ФОРМА ИЛИ ОСНОВНОЙ ДАШБОРД === -->
    <ProfileForm
      v-if="activeView === 'edit-profile'"
      @close="activeView = 'dashboard'"
      @profile-updated="onProfileUpdated"
    />
    <CarForm
      v-else-if="activeView === 'car-form'"
      :car-to-edit="carToEdit"
      @close="activeView = 'dashboard'"
      @car-saved="onCarSaved"
    />

    <div v-else>
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
      >
        <h1 class="text-5xl font-bold text-brand-white">Личный кабинет</h1>
        <router-link
          :to="{ name: 'NewBooking' }"
          class="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-6 rounded-lg transition mt-4 md:mt-0"
        >
          <i class="fas fa-plus-circle mr-3"></i>Новая запись
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-20 text-brand-text">
        Загрузка данных вашего кабинета...
      </div>
      <div v-if="error" class="text-center py-20 text-red-400">{{ error }}</div>

      <div
        v-if="!loading && !error"
        class="grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        <div class="lg:col-span-2 space-y-10">
          <section
            class="bg-brand-gray rounded-xl shadow-xl p-8 border border-brand-light-gray"
          >
            <h2 class="text-2xl font-bold mb-6 text-brand-white">
              Ближайшие записи
            </h2>
            <div v-if="upcomingBookings.length" class="space-y-4">
              <div
                v-for="booking in upcomingBookings"
                :key="booking.appointment_id"
                class="bg-brand-light-gray rounded-lg border border-gray-600 p-4"
              >
                <div
                  class="flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div>
                    <p class="font-bold text-brand-white text-lg">
                      {{
                        booking.appointment_services
                          .map((s) => s.services.name)
                          .join(", ")
                      }}
                    </p>
                    <p class="text-sm text-brand-text mt-1">
                      {{ booking.cars.make }} {{ booking.cars.model }} ({{
                        booking.cars.license_plate || "Без номера"
                      }})
                    </p>
                    <p class="text-sm text-gray-400 mt-2">
                      <i class="far fa-clock mr-2"></i
                      >{{ formatDateTime(booking.start_time) }}
                    </p>
                  </div>
                  <div class="text-right mt-3 sm:mt-0">
                    <span
                      class="bg-blue-900/50 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full capitalize"
                      >{{ getStatusText(booking.status) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-brand-text">У вас нет предстоящих записей.</p>
            </div>
          </section>

          <section
            class="bg-brand-gray rounded-xl shadow-xl p-8 border border-brand-light-gray"
          >
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-brand-white">
                Мои автомобили
              </h2>
              <button
                @click="openAddCarForm"
                class="text-brand-accent hover:underline font-semibold flex items-center"
              >
                <i class="fas fa-plus mr-2"></i>Добавить
              </button>
            </div>
            <div v-if="cars.length" class="space-y-4">
              <div
                v-for="car in cars"
                :key="car.car_id"
                class="bg-brand-light-gray rounded-lg border border-gray-600 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
              >
                <div>
                  <p class="font-bold text-brand-white">
                    {{ car.make }} {{ car.model }}
                  </p>
                  <p class="text-sm text-brand-text">
                    {{ car.license_plate || "Без номера" }} |
                    {{ car.vin_code || "VIN не указан" }}
                  </p>
                </div>
                <div class="mt-3 sm:mt-0 space-x-4">
                  <button
                    @click="openEditCarForm(car)"
                    class="text-sm text-gray-400 hover:text-brand-accent transition"
                  >
                    <i class="fas fa-pencil-alt mr-1"></i> Редактировать
                  </button>
                  <button
                    @click="handleDeleteCar(car.car_id)"
                    class="text-sm text-gray-400 hover:text-red-500 transition"
                  >
                    <i class="fas fa-trash-alt mr-1"></i> Удалить
                  </button>
                </div>
              </div>
            </div>
            <div v-else><p>У вас пока нет добавленных автомобилей.</p></div>
          </section>
        </div>

        <div class="space-y-10">
          <section
            class="bg-brand-gray rounded-xl shadow-xl p-8 border border-brand-light-gray"
          >
            <h2 class="text-2xl font-bold mb-6 text-brand-white">
              Мой профиль
            </h2>
            <div v-if="profile" class="space-y-3 text-brand-text">
              <p>
                <strong>Имя:</strong>
                <span class="text-brand-white"
                  >{{ profile.first_name }} {{ profile.last_name }}</span
                >
              </p>
              <p>
                <strong>Email:</strong>
                <span class="text-brand-white">{{ profile.email }}</span>
              </p>
              <p>
                <strong>Телефон:</strong>
                <span class="text-brand-white">{{
                  profile.phone_number || "Не указан"
                }}</span>
              </p>
            </div>
            <button
              @click="activeView = 'edit-profile'"
              class="mt-6 w-full border border-brand-light-gray rounded-lg py-2.5 hover:bg-brand-light-gray transition font-semibold text-brand-white"
            >
              Редактировать профиль
            </button>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";
import CarForm from "@/components/CarForm.vue";
import ProfileForm from "@/components/ProfileForm.vue";

const activeView = ref("dashboard");
const cars = ref([]);
const bookings = ref([]);
const profile = ref(null);
const loading = ref(true);
const error = ref(null);
const carToEdit = ref(null);

const upcomingBookings = computed(() =>
  bookings.value.filter((b) => ["scheduled", "in_progress"].includes(b.status))
);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [carsRes, bookingsRes, profileRes] = await Promise.all([
      apiClient.get("/cars"),
      apiClient.get("/appointments/my"),
      apiClient.get("/users/me"),
    ]);
    cars.value = carsRes.data;
    bookings.value = bookingsRes.data;
    profile.value = profileRes.data;
  } catch (err) {
    error.value =
      "Не удалось загрузить данные кабинета. Пожалуйста, попробуйте обновить страницу.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const openAddCarForm = () => {
  carToEdit.value = null;
  activeView.value = "car-form";
};
const openEditCarForm = (car) => {
  carToEdit.value = { ...car };
  activeView.value = "car-form";
};
const onCarSaved = () => {
  activeView.value = "dashboard";
  fetchData();
};
const handleDeleteCar = async (carId) => {
  if (confirm("Вы уверены, что хотите удалить этот автомобиль?")) {
    try {
      await apiClient.delete(`/cars/${carId}`);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Ошибка при удалении автомобиля.");
    }
  }
};
const onProfileUpdated = () => {
  fetchData();
  activeView.value = "dashboard";
};
const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
const getStatusText = (status) =>
  ({
    scheduled: "Запланировано",
    in_progress: "В работе",
    completed: "Выполнено",
    cancelled: "Отменено",
  }[status] || status);
</script>
