<template>
  <div class="container mx-auto px-6 py-12">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10"
    >
      <h1 class="text-5xl font-bold text-brand-white">Мои задачи</h1>
    </div>

    <div v-if="loading" class="text-center text-brand-text py-10">
      Загрузка задач...
    </div>
    <div v-if="error" class="text-center text-red-400 py-10">{{ error }}</div>

    <div v-if="!loading && tasks.length" class="space-y-6">
      <div
        v-for="task in tasks"
        :key="task.appointment_id"
        class="bg-brand-gray rounded-xl shadow-lg p-6 border-l-4"
        :class="statusBorderColor(task.status)"
      >
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
          <div class="md:col-span-2">
            <p class="font-bold text-xl text-brand-white">
              {{
                task.appointment_services
                  .map((s) => s.services.name)
                  .join(", ") || "Набор услуг"
              }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              <i class="far fa-clock mr-2"></i
              >{{ formatTime(task.start_time) }} -
              {{ formatTime(task.end_time) }}
            </p>
            <span
              class="mt-2 inline-block text-xs font-semibold px-3 py-1 rounded-full"
              :class="statusBgColor(task.status)"
              >{{ getStatusText(task.status) }}</span
            >
          </div>
          <div>
            <p class="font-semibold text-brand-white">
              {{ task.users_appointments_client_idTousers.first_name }}
              {{ task.users_appointments_client_idTousers.last_name }}
            </p>
            <p class="text-gray-400 text-sm">
              {{ task.cars.make }} {{ task.cars.model }} ({{
                task.cars.license_plate
              }})
            </p>
          </div>
          <div class="md:col-span-1">
            <p class="text-sm text-gray-300">
              <strong class="text-brand-white">Заметки:</strong>
              {{ task.notes || "-" }}
            </p>
          </div>
          <div class="md:col-span-1 md:text-right">
            <button
              v-if="task.status === 'scheduled'"
              class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              <i class="fas fa-play mr-2"></i>Начать
            </button>
            <button
              v-if="task.status === 'in_progress'"
              class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              <i class="fas fa-check mr-2"></i>Завершить
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!loading && !tasks.length"
      class="text-center text-gray-500 py-10"
    >
      <p>На сегодня назначенных задач нет.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/services/api";

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const { data } = await apiClient.get("/appointments/tasks");
    tasks.value = data;
  } catch (err) {
    error.value = "Не удалось загрузить задачи.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const getStatusText = (status) =>
  ({
    scheduled: "Ожидает",
    in_progress: "В работе",
    completed: "Выполнено",
  }[status] || status);

const statusBorderColor = (status) =>
  ({
    scheduled: "border-blue-500",
    in_progress: "border-yellow-500",
    completed: "border-green-500",
  }[status] || "border-gray-500");

const statusBgColor = (status) =>
  ({
    scheduled: "bg-blue-900/50 text-blue-300",
    in_progress: "bg-yellow-900/50 text-yellow-300",
    completed: "bg-green-900/50 text-green-300",
  }[status] || "bg-gray-700 text-gray-300");
</script>
