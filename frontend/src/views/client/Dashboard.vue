<template>
  <div class="container mx-auto px-6 py-12">
    <BaseModal :show="isProfileModalOpen" @close="isProfileModalOpen = false">
      <ProfileForm
        @close="isProfileModalOpen = false"
        @profile-updated="onProfileUpdated"
      />
    </BaseModal>
    <BaseModal :show="isCarModalOpen" @close="isCarModalOpen = false">
      <CarForm
        :car-to-edit="carToEdit"
        @close="isCarModalOpen = false"
        @car-saved="onCarSaved"
      />
    </BaseModal>

    <div class="mb-10">
      <h1 class="text-5xl font-bold text-brand-red">Личный кабинет</h1>
    </div>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-3">
      <div class="space-y-10 lg:col-span-2">
        <section
          class="rounded-2xl border border-brand-red-light bg-card-dark p-8"
        >
          <div
            class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
          >
            <h2 class="text-2xl font-bold text-white">Ближайшие записи</h2>
            <BaseButton
              :to="{ name: 'NewBooking' }"
              tag="router-link"
              variant="link"
            >
              <i class="fas fa-plus-circle mr-1"></i>Новая запись
            </BaseButton>
          </div>

          <div v-if="bookingsLoading" class="text-center text-secondary-text">
            <i class="fas fa-spinner fa-spin mr-2"></i> Загрузка записей...
          </div>

          <p v-else-if="bookingsError" class="text-red-400">
            {{ bookingsError }}
          </p>

          <div v-else-if="upcomingBookings.length" class="space-y-4">
            <div
              v-for="booking in upcomingBookings"
              :key="booking.appointment_id"
              class="rounded-lg border border-white/10 bg-light-dark p-4"
            >
              <p class="font-bold text-white">
                {{
                  booking.appointment_services
                    .map((s) => s.services.name)
                    .join(", ")
                }}
              </p>
              <p class="text-sm text-secondary-text">
                {{ booking.cars.make }} {{ booking.cars.model }}
              </p>
              <p class="mt-2 text-sm text-brand-red">
                <i class="far fa-clock mr-2"></i
                >{{ formatDateTime(booking.start_time) }}
              </p>
            </div>
          </div>

          <p v-else class="text-secondary-text">
            У вас нет предстоящих записей.
          </p>
        </section>

        <section
          class="rounded-2xl border border-brand-red-light bg-card-dark p-8"
        >
          <div class="flex items-center justify-between">
            <h2 class="mb-6 text-2xl font-bold text-white">Мои автомобили</h2>
            <BaseButton @click="openAddCarForm" variant="link">
              <i class="fas fas fa-plus-circle mr-1"></i>Добавить
            </BaseButton>
          </div>

          <div v-if="carsLoading" class="text-center text-secondary-text">
            <i class="fas fa-spinner fa-spin mr-2"></i> Загрузка автомобилей...
          </div>

          <p v-else-if="carsError" class="text-red-400">{{ carsError }}</p>

          <div v-else-if="cars.length" class="space-y-4">
            <div
              v-for="car in cars"
              :key="car.car_id"
              class="flex flex-col items-start gap-4 rounded-lg border border-white/10 bg-light-dark p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p class="font-bold text-white">
                  {{ car.make }} {{ car.model }}
                </p>
                <p class="text-sm text-secondary-text">
                  {{ car.license_plate || "Без номера" }}
                </p>
              </div>
              <div class="flex shrink-0 space-x-2">
                <button
                  @click="openEditCarForm(car)"
                  class="rounded-md bg-white/5 px-3 py-1.5 text-sm font-semibold text-secondary-text transition hover:bg-white/10 hover:text-white"
                >
                  <i class="fas fa-pencil-alt text-xs"></i
                  ><span class="ml-2">Редактировать</span>
                </button>
                <button
                  @click="handleDeleteCar(car.car_id)"
                  class="rounded-md bg-brand-red/10 px-3 py-1.5 text-sm font-semibold text-brand-red transition hover:bg-brand-red hover:text-white"
                >
                  <i class="fas fa-trash-alt text-xs"></i
                  ><span class="ml-2">Удалить</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Если машин нет -->
          <p v-else class="text-secondary-text">
            У вас пока нет добавленных автомобилей.
          </p>
        </section>
      </div>

      <div class="space-y-10">
        <section
          class="rounded-2xl border border-brand-red-light bg-card-dark p-8"
        >
          <h2 class="mb-6 text-2xl font-bold text-white">Мой профиль</h2>

          <div v-if="profileLoading" class="text-center text-secondary-text">
            <i class="fas fa-spinner fa-spin mr-2"></i> Загрузка профиля...
          </div>

          <p v-else-if="profileError" class="text-red-400">
            {{ profileError }}
          </p>

          <div v-else-if="profile" class="space-y-3 text-secondary-text">
            <p>
              <strong>Имя:</strong>
              <span class="text-white"
                >{{ profile.first_name }} {{ profile.last_name }}</span
              >
            </p>
            <p>
              <strong>Email:</strong>
              <span class="text-white">{{ profile.email }}</span>
            </p>
            <p>
              <strong>Телефон:</strong>
              <span class="text-white">{{
                profile.phone_number || "Не указан"
              }}</span>
            </p>
          </div>

          <BaseButton
            @click="isProfileModalOpen = true"
            variant="danger-outline"
            class="mt-6 w-full"
            :disabled="profileLoading"
          >
            Редактировать профиль
          </BaseButton>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";

import BaseModal from "@/components/BaseModal.vue";
import CarForm from "@/components/CarForm.vue";
import ProfileForm from "@/components/ProfileForm.vue";
import BaseButton from "@/components/BaseButton.vue";

const profile = ref(null);
const profileLoading = ref(true);
const profileError = ref(null);

const cars = ref([]);
const carsLoading = ref(true);
const carsError = ref(null);

const bookings = ref([]);
const bookingsLoading = ref(true);
const bookingsError = ref(null);

const carToEdit = ref(null);
const isProfileModalOpen = ref(false);
const isCarModalOpen = ref(false);

const upcomingBookings = computed(() =>
  bookings.value.filter((b) => ["scheduled", "in_progress"].includes(b.status))
);

const fetchProfile = async () => {
  profileLoading.value = true;
  profileError.value = null;
  try {
    const { data } = await apiClient.get("/users/me");
    profile.value = data;
  } catch (err) {
    profileError.value = "Ошибка загрузки профиля.";
  } finally {
    profileLoading.value = false;
  }
};

const fetchCars = async () => {
  carsLoading.value = true;
  carsError.value = null;
  try {
    const { data } = await apiClient.get("/cars");
    cars.value = data;
  } catch (err) {
    carsError.value = "Ошибка загрузки автомобилей.";
  } finally {
    carsLoading.value = false;
  }
};

const fetchBookings = async () => {
  bookingsLoading.value = true;
  bookingsError.value = null;
  try {
    const { data } = await apiClient.get("/appointments/my");
    bookings.value = data;
  } catch (err) {
    bookingsError.value = "Ошибка загрузки записей.";
  } finally {
    bookingsLoading.value = false;
  }
};

onMounted(() => {
  fetchProfile();
  fetchCars();
  fetchBookings();
});

const openAddCarForm = () => {
  carToEdit.value = null;
  isCarModalOpen.value = true;
};
const openEditCarForm = (car) => {
  carToEdit.value = { ...car };
  isCarModalOpen.value = true;
};
const onCarSaved = () => {
  isCarModalOpen.value = false;
  fetchCars();
};
const onProfileUpdated = () => {
  isProfileModalOpen.value = false;
  fetchProfile();
};

const handleDeleteCar = async (carId) => {
  if (confirm("Вы уверены, что хотите удалить этот автомобиль?")) {
    try {
      await apiClient.delete(`/cars/${carId}`);
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || "Ошибка при удалении автомобиля.");
    }
  }
};

const formatDateTime = (isoString) =>
  new Date(isoString).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
</script>
