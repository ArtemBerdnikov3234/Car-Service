<template>
  <div>
    <!-- Модальное окно для создания новой записи -->
    <BaseModal :show="isBookingModalOpen" @close="isBookingModalOpen = false">
      <!-- 
        Компонент AdminBookingForm будет отображаться внутри модального окна.
        Он будет сообщать родительскому компоненту (Dashboard), когда запись сохранена.
      -->
      <AdminBookingForm
        v-if="isBookingModalOpen"
        @close="isBookingModalOpen = false"
        @saved="onBookingSaved"
      />
    </BaseModal>

    <!-- Блок со статистикой -->
    <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-xl border border-white/10 bg-card-dark p-5 shadow-lg">
        <h3 class="text-sm font-medium text-secondary-text">Записей сегодня</h3>
        <p class="mt-1 text-4xl font-bold text-white">12</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-card-dark p-5 shadow-lg">
        <h3 class="text-sm font-medium text-secondary-text">Выручка сегодня</h3>
        <p class="mt-1 text-4xl font-bold text-white">35,500 ₽</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-card-dark p-5 shadow-lg">
        <h3 class="text-sm font-medium text-secondary-text">Загрузка</h3>
        <p class="mt-1 text-4xl font-bold text-white">75%</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-card-dark p-5 shadow-lg">
        <h3 class="text-sm font-medium text-secondary-text">Новых клиентов</h3>
        <p class="mt-1 text-4xl font-bold text-white">3</p>
      </div>
    </div>

    <!-- ОСНОВНОЙ БЛОК: ТАБЛИЦА ЗАПИСЕЙ -->
    <div class="rounded-2xl border border-white/10 bg-card-dark p-6 shadow-lg">
      <div
        class="mb-6 flex flex-col items-center justify-between gap-4 md:flex-row"
      >
        <h2 class="text-2xl font-bold text-white">Все записи</h2>
        <BaseButton @click="isBookingModalOpen = true">
          <i class="fas fa-plus mr-2"></i>Создать запись
        </BaseButton>
      </div>

      <div v-if="loading" class="py-10 text-center text-secondary-text">
        <i class="fas fa-spinner fa-spin text-2xl"></i>
      </div>
      <div v-if="error" class="py-10 text-center text-red-400">{{ error }}</div>

      <div v-if="!loading && appointments.length > 0" class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead
            class="border-b border-white/10 text-xs uppercase text-secondary-text"
          >
            <tr>
              <th class="p-3">Дата и время</th>
              <th class="p-3">Клиент и Авто</th>
              <th class="p-3">Статус</th>
              <th class="p-3 min-w-[150px]">Мастер</th>
              <th class="p-3 min-w-[150px]">Бокс</th>
              <th class="p-3 text-center">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10 text-secondary-text">
            <tr
              v-for="apt in sortedAppointments"
              :key="apt.appointment_id"
              class="align-top transition hover:bg-white/5"
            >
              <td class="p-3 font-medium text-white">
                <p>{{ formatDate(apt.start_time) }}</p>
                <p class="text-secondary-text">
                  {{ formatTime(apt.start_time) }}
                </p>
              </td>
              <td class="p-3">
                <p class="font-semibold text-white">
                  {{ apt.users_appointments_client_idTousers.first_name }}
                  {{ apt.users_appointments_client_idTousers.last_name }}
                </p>
                <p class="text-secondary-text">
                  {{ apt.cars.make }} {{ apt.cars.model }} ({{
                    apt.cars.license_plate
                  }})
                </p>
              </td>
              <td class="p-3">
                <span
                  :class="getStatusClass(apt.status)"
                  class="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold"
                >
                  {{ getStatusText(apt.status) }}
                </span>
              </td>
              <td class="p-3">
                <select
                  v-model="apt.selectedMasterId"
                  class="w-full rounded-md border-white/20 bg-dark text-white shadow-sm focus:border-brand-red focus:ring focus:ring-brand-red/50"
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
                  class="w-full rounded-md border-white/20 bg-dark text-white shadow-sm focus:border-brand-red focus:ring focus:ring-brand-red/50"
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
                <BaseButton
                  @click="assignMasterAndBox(apt)"
                  :disabled="apt.isSaving || !isChanged(apt)"
                  class="!py-2 !px-4 !text-xs"
                >
                  <span v-if="apt.isSaving"
                    ><i class="fas fa-spinner fa-spin mr-1"></i
                    >Сохранение...</span
                  >
                  <span v-else>Сохранить</span>
                </BaseButton>
                <p v-if="apt.saveError" class="mt-1 text-xs text-red-400">
                  {{ apt.saveError }}
                </p>
                <p v-if="apt.saveSuccess" class="mt-1 text-xs text-green-400">
                  Сохранено!
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="!loading && appointments.length === 0"
        class="py-10 text-center text-secondary-text"
      >
        <p>Записей не найдено.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";
import BaseButton from "@/components/BaseButton.vue";
import BaseModal from "@/components/BaseModal.vue";
import AdminBookingForm from "@/components/AdminBookingForm.vue";

const isBookingModalOpen = ref(false);

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

const onBookingSaved = () => {
  isBookingModalOpen.value = false;
  fetchData(); // Обновляем список записей
};

const sortedAppointments = computed(() => {
  return [...appointments.value].sort(
    (a, b) => new Date(b.start_time) - new Date(a.start_time)
  );
});

const isChanged = (appointment) => {
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
      const originalAppointment = appointments.value[index];
      Object.assign(originalAppointment, {
        ...response.data,
        selectedMasterId: response.data.master_id || null,
        selectedBoxId: response.data.box_id || null,
        saveSuccess: true,
      });
    }
    setTimeout(() => {
      appointment.saveSuccess = false;
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
    scheduled: "bg-blue-500/20 text-blue-300",
    in_progress: "bg-yellow-500/20 text-yellow-300",
    completed: "bg-green-500/20 text-green-300",
    cancelled: "bg-red-500/20 text-red-300",
  }[status] || "bg-gray-500/20 text-gray-300");
</script>
