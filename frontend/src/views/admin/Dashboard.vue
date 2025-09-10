<!-- src/views/admin/Dashboard.vue -->
<template>
  <div>
    <!-- Статистические карточки -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
        <h3 class="text-gray-500 text-sm font-medium">
          Активных записей сегодня
        </h3>
        <p class="text-4xl font-bold mt-1 text-gray-800">
          {{ todayStats.activeBookings }}
        </p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
        <h3 class="text-gray-500 text-sm font-medium">Выручка за сегодня</h3>
        <p class="text-4xl font-bold mt-1 text-gray-800">
          {{ todayStats.revenue }} ₽
        </p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
        <h3 class="text-gray-500 text-sm font-medium">Загрузка мастеров</h3>
        <p class="text-4xl font-bold mt-1 text-gray-800">
          {{ todayStats.mastersLoad }}%
        </p>
      </div>
      <div class="bg-white p-5 rounded-lg shadow border border-gray-200">
        <h3 class="text-gray-500 text-sm font-medium">
          Новых клиентов сегодня
        </h3>
        <p class="text-4xl font-bold mt-1 text-gray-800">
          {{ todayStats.newClients }}
        </p>
      </div>
    </div>

    <!-- Календарь/Список записей -->
    <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div
        class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      >
        <h2 class="text-2xl font-bold text-gray-800">Записи на сегодня</h2>
        <div class="flex gap-4">
          <button
            class="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center"
          >
            <i class="fas fa-plus mr-2"></i>Создать запись
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center p-10 text-gray-500">
        Загрузка расписания...
      </div>
      <div v-if="error" class="text-center p-10 text-red-500">{{ error }}</div>

      <div v-if="!loading && appointments.length > 0" class="overflow-x-auto">
        <ul class="space-y-3">
          <li
            v-for="apt in appointments"
            :key="apt.appointment_id"
            class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center"
          >
            <div>
              <p class="font-bold text-gray-900">
                {{ formatTime(apt.start_time) }} -
                {{ formatTime(apt.end_time) }}
              </p>
              <p class="text-sm text-gray-600">
                {{ apt.cars.make }} {{ apt.cars.model }} ({{
                  apt.cars.license_plate
                }})
              </p>
              <p class="text-sm text-gray-800">
                Клиент:
                {{ apt.users_appointments_client_idTousers.first_name }}
                {{ apt.users_appointments_client_idTousers.last_name }}
              </p>
              <p v-if="apt.employees" class="text-sm text-gray-500">
                Мастер: {{ apt.employees.users.first_name }}
                {{ apt.employees.users.last_name }}
              </p>
            </div>
            <span
              :class="getStatusClass(apt.status)"
              class="text-xs font-semibold px-3 py-1 rounded-full"
              >{{ getStatusText(apt.status) }}</span
            >
          </li>
        </ul>
      </div>

      <div
        v-if="!loading && appointments.length === 0"
        class="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center"
      >
        <p class="text-gray-500 text-lg">На сегодня записей нет</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";

const appointments = ref([]);
const loading = ref(true);
const error = ref(null);

const todayStats = computed(() => ({
  activeBookings: appointments.value.filter((a) => a.status !== "completed")
    .length,
  revenue: appointments.value
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + parseFloat(a.final_price || 0), 0),
  mastersLoad: 50, // Placeholder
  newClients: 0, // Placeholder
}));

const fetchAppointments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiClient.get("/appointments");
    const today = new Date().toISOString().slice(0, 10);
    appointments.value = response.data.filter((apt) =>
      apt.start_time.startsWith(today)
    );
  } catch (err) {
    error.value = "Не удалось загрузить расписание.";
  } finally {
    loading.value = false;
  }
};
onMounted(fetchAppointments);

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
const getStatusText = (status) =>
  ({
    scheduled: "Запланировано",
    in_progress: "В работе",
    completed: "Выполнено",
  }[status] || status);
const getStatusClass = (status) =>
  ({
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
  }[status] || "bg-gray-100 text-gray-800");
</script>
