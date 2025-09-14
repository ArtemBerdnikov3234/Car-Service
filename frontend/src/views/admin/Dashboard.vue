<template>
  <div>
    <!-- Блок со статистикой -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- ... ваш код статистики ... -->
    </div>

    <!-- ОСНОВНОЙ БЛОК: ТАБЛИЦА ЗАПИСЕЙ -->
    <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div
        class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4"
      >
        <h2 class="text-2xl font-bold text-gray-800">Все записи</h2>
        <button
          class="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>Создать запись
        </button>
      </div>

      <div v-if="loading" class="text-center p-10 text-gray-500">
        Загрузка записей...
      </div>
      <div v-if="error" class="text-center p-10 text-red-500">{{ error }}</div>

      <div v-if="!loading && appointments.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-600">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="p-3">Дата и время</th>
              <th class="p-3">Клиент и Авто</th>
              <th class="p-3">Статус</th>
              <th class="p-3 min-w-[150px]">Мастер</th>
              <th class="p-3 min-w-[150px]">Бокс</th>
              <th class="p-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="apt in sortedAppointments"
              :key="apt.appointment_id"
              class="hover:bg-gray-50 align-top"
            >
              <td class="p-3 font-medium text-gray-900">
                <p>{{ formatDate(apt.start_time) }}</p>
                <p class="text-gray-500">{{ formatTime(apt.start_time) }}</p>
              </td>
              <td class="p-3">
                <p class="font-semibold text-gray-800">
                  {{ apt.users_appointments_client_idTousers.first_name }}
                  {{ apt.users_appointments_client_idTousers.last_name }}
                </p>
                <p class="text-gray-500">
                  {{ apt.cars.make }} {{ apt.cars.model }} ({{
                    apt.cars.license_plate
                  }})
                </p>
              </td>
              <td class="p-3">
                <span
                  :class="getStatusClass(apt.status)"
                  class="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                  >{{ getStatusText(apt.status) }}</span
                >
              </td>
              <td class="p-3">
                <select
                  v-model="apt.selectedMasterId"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option :value="null">Не назначен</option>
                  <option
                    v-for="master in allMasters"
                    :key="master.employee_id"
                    :value="master.employee_id"
                  >
                    {{ master.users.first_name }} {{ master.users.last_name }}
                  </option>
                </select>
              </td>
              <td class="p-3">
                <select
                  v-model="apt.selectedBoxId"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option :value="null">Не назначен</option>
                  <option
                    v-for="box in allBoxes"
                    :key="box.box_id"
                    :value="box.box_id"
                  >
                    Бокс №{{ box.box_number }}
                  </option>
                </select>
              </td>
              <td class="p-3 text-center">
                <button
                  @click="assignMasterAndBox(apt)"
                  :disabled="apt.isSaving || !isChanged(apt)"
                  class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-2 text-xs rounded-lg transition disabled:bg-indigo-300 disabled:cursor-not-allowed"
                >
                  <span v-if="apt.isSaving"
                    ><i class="fas fa-spinner fa-spin"></i> Сохранение...</span
                  >
                  <span v-else>Сохранить</span>
                </button>
                <p v-if="apt.saveError" class="text-red-500 text-xs mt-1">
                  {{ apt.saveError }}
                </p>
                <p v-if="apt.saveSuccess" class="text-green-500 text-xs mt-1">
                  Сохранено!
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!loading && appointments.length === 0"
        class="text-center text-gray-500 py-10"
      >
        <p>Записей не найдено.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";

const appointments = ref([]);
const allMasters = ref([]);
const allBoxes = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [appointmentsRes, mastersRes, boxesRes] = await Promise.all([
      apiClient.get("/appointments"),
      apiClient.get("/employees"),
      apiClient.get("/boxes"),
    ]);

    appointments.value = appointmentsRes.data.map((apt) => ({
      ...apt,
      selectedMasterId: apt.master_id || null,
      selectedBoxId: apt.box_id || null,
      isSaving: false,
      saveError: null,
      saveSuccess: false,
    }));

    allMasters.value = mastersRes.data.filter(
      (emp) => emp.users.role === "master"
    );
    allBoxes.value = boxesRes.data;
  } catch (err) {
    console.error("Ошибка при загрузке данных:", err);
    error.value = "Не удалось загрузить данные. Пожалуйста, попробуйте позже.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const sortedAppointments = computed(() => {
  return [...appointments.value].sort(
    (a, b) => new Date(b.start_time) - new Date(a.start_time)
  );
});

const isChanged = (appointment) => {
  // Сравниваем то, что выбрано в селекте, с тем, что изначально пришло с сервера
  // Важно: master_id может быть null, поэтому сравниваем аккуратно.
  const masterChanged =
    (appointment.selectedMasterId || null) !== (appointment.master_id || null);
  const boxChanged =
    (appointment.selectedBoxId || null) !== (appointment.box_id || null);
  return masterChanged || boxChanged;
};

const assignMasterAndBox = async (appointment) => {
  appointment.isSaving = true;
  appointment.saveError = null;
  appointment.saveSuccess = false;

  try {
    const response = await apiClient.put(
      `/appointments/${appointment.appointment_id}/admin-update`,
      {
        master_id: appointment.selectedMasterId,
        box_id: appointment.selectedBoxId,
      }
    );

    const index = appointments.value.findIndex(
      (a) => a.appointment_id === appointment.appointment_id
    );
    if (index !== -1) {
      // "УМНОЕ" ОБНОВЛЕНИЕ
      const originalAppointment = appointments.value[index];

      // Обновляем только ключевые поля, сохраняя всю остальную структуру
      originalAppointment.master_id = response.data.master_id;
      originalAppointment.employees = response.data.employees;
      originalAppointment.box_id = response.data.box_id;
      originalAppointment.boxes = response.data.boxes;

      // Обновляем значения в селектах, чтобы isChanged() снова стал false
      originalAppointment.selectedMasterId = response.data.master_id || null;
      originalAppointment.selectedBoxId = response.data.box_id || null;

      // Показываем сообщение об успехе
      originalAppointment.saveSuccess = true;
    }

    setTimeout(() => {
      const currentApt = appointments.value.find(
        (a) => a.appointment_id === appointment.appointment_id
      );
      if (currentApt) {
        currentApt.saveSuccess = false;
      }
    }, 2000);
  } catch (err) {
    console.error("Ошибка при назначении:", err);
    appointment.saveError = err.response?.data?.message || "Ошибка сохранения";
    appointment.selectedMasterId = appointment.master_id || null;
    appointment.selectedBoxId = appointment.box_id || null;
  } finally {
    appointment.isSaving = false;
  }
};

const formatDate = (isoString) =>
  new Date(isoString).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
    cancelled: "Отменено",
  }[status] || status);
const getStatusClass = (status) =>
  ({
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }[status] || "bg-gray-100 text-gray-800");
</script>
