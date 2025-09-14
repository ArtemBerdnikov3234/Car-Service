<template>
  <div>
    <!-- Модальное окно для формы Услуги -->
    <BaseModal :show="isServiceModalOpen" @close="closeServiceModal">
      <ServiceForm
        v-if="modalContent === 'service'"
        :service-to-edit="itemToEdit"
        @close="closeServiceModal"
        @saved="onSaved"
      />
    </BaseModal>

    <!-- Модальное окно для подтверждения удаления -->
    <ConfirmDialog
      :show="isConfirmModalOpen"
      title="Подтвердите удаление"
      :message="`Вы уверены, что хотите удалить услугу '${serviceToDelete?.name}'? Это действие нельзя отменить.`"
      @close="isConfirmModalOpen = false"
      @cancel="isConfirmModalOpen = false"
      @confirm="confirmDelete"
    />

    <!-- Табы -->
    <div class="mb-8 border-b border-white/10">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'services'"
          :class="
            activeTab === 'services'
              ? 'border-brand-red text-brand-red'
              : 'border-transparent text-secondary-text hover:border-gray-500 hover:text-white'
          "
          class="border-b-2 px-1 py-4 font-semibold transition"
        >
          Услуги
        </button>
        <button
          @click="activeTab = 'employees'"
          :class="
            activeTab === 'employees'
              ? 'border-brand-red text-brand-red'
              : 'border-transparent text-secondary-text hover:border-gray-500 hover:text-white'
          "
          class="border-b-2 px-1 py-4 font-semibold transition"
        >
          Персонал
        </button>
      </nav>
    </div>

    <!-- Индикаторы загрузки и ошибок -->
    <div v-if="loading" class="py-10 text-center text-secondary-text">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
    </div>
    <div v-if="error" class="py-10 text-center text-red-400">{{ error }}</div>

    <!-- Таблица Услуг -->
    <div
      v-if="!loading && activeTab === 'services'"
      class="rounded-2xl border border-white/10 bg-card-dark p-6 shadow-lg"
    >
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Список услуг</h2>
        <BaseButton @click="openServiceModal(null)">
          <i class="fas fa-plus mr-2"></i>Добавить услугу
        </BaseButton>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead
            class="border-b border-white/10 text-sm uppercase text-secondary-text"
          >
            <tr>
              <th class="p-4">Название</th>
              <th class="p-4">Цена</th>
              <th class="p-4">Длительность</th>
              <th class="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10 text-secondary-text">
            <tr
              v-for="service in services"
              :key="service.service_id"
              class="transition hover:bg-white/5"
            >
              <td class="p-4 font-medium text-white">{{ service.name }}</td>
              <td class="p-4">{{ service.price }} ₽</td>
              <td class="p-4">{{ service.duration_minutes }} мин</td>
              <td class="p-4 text-right">
                <div class="relative inline-block text-left">
                  <button
                    @click.stop="toggleDropdown(service.service_id)"
                    class="rounded-full p-2 text-secondary-text transition hover:bg-white/10 hover:text-white"
                  >
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                  <div
                    v-if="activeDropdownId === service.service_id"
                    class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border border-white/10 bg-light-dark shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="py-1">
                      <a
                        href="#"
                        @click.prevent="openServiceModal(service)"
                        class="flex w-full items-center px-4 py-2 text-sm text-secondary-text transition hover:bg-white/5 hover:text-white"
                      >
                        <i class="fas fa-pencil-alt mr-3 w-4"></i>Редактировать
                      </a>
                      <a
                        href="#"
                        @click.prevent="handleDeleteService(service)"
                        class="flex w-full items-center px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                      >
                        <i class="fas fa-trash-alt mr-3 w-4"></i>Удалить
                      </a>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Таблица Персонала -->
    <div
      v-if="!loading && activeTab === 'employees'"
      class="rounded-2xl border border-white/10 bg-card-dark p-6 shadow-lg"
    >
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Список персонала</h2>
        <BaseButton>
          <i class="fas fa-plus mr-2"></i>Добавить сотрудника
        </BaseButton>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead
            class="border-b border-white/10 text-sm uppercase text-secondary-text"
          >
            <tr>
              <th class="p-4">Имя</th>
              <th class="p-4">Email</th>
              <th class="p-4">Роль</th>
              <th class="p-4">Статус</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10 text-secondary-text">
            <tr
              v-for="employee in employees"
              :key="employee.employee_id"
              class="transition hover:bg-white/5"
            >
              <td class="p-4 font-medium text-white">
                {{ employee.users.first_name }} {{ employee.users.last_name }}
              </td>
              <td class="p-4">{{ employee.users.email }}</td>
              <td class="p-4 capitalize">{{ employee.users.role }}</td>
              <td class="p-4">
                <span
                  v-if="employee.users.is_active"
                  class="font-semibold text-green-400"
                  >Активен</span
                >
                <span v-else class="font-semibold text-red-400">Неактивен</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import apiClient from "@/services/api";
import BaseModal from "@/components/BaseModal.vue";
import ServiceForm from "@/components/ServiceForm.vue";
import BaseButton from "@/components/BaseButton.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const activeTab = ref("services");
const services = ref([]);
const employees = ref([]);
const loading = ref(true);
const error = ref(null);

const isServiceModalOpen = ref(false);
const modalContent = ref("");
const itemToEdit = ref(null);

const isConfirmModalOpen = ref(false);
const serviceToDelete = ref(null);
const activeDropdownId = ref(null);

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [servicesRes, employeesRes] = await Promise.all([
      apiClient.get("/services"),
      apiClient.get("/employees"),
    ]);
    services.value = servicesRes.data;
    employees.value = employeesRes.data;
  } catch (err) {
    error.value = "Не удалось загрузить данные справочников.";
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const openServiceModal = (item = null) => {
  modalContent.value = "service";
  itemToEdit.value = item ? { ...item } : null;
  isServiceModalOpen.value = true;
  closeDropdown();
};

const closeServiceModal = () => {
  isServiceModalOpen.value = false;
  itemToEdit.value = null;
};

const onSaved = () => {
  closeServiceModal();
  fetchData();
};

const handleDeleteService = (service) => {
  serviceToDelete.value = service;
  isConfirmModalOpen.value = true;
  closeDropdown();
};

const confirmDelete = async () => {
  if (!serviceToDelete.value) return;
  try {
    await apiClient.delete(`/services/${serviceToDelete.value.service_id}`);
    fetchData();
  } catch (err) {
    console.error("Ошибка при удалении услуги:", err);
    error.value = err.response?.data?.message || "Не удалось удалить услугу.";
  } finally {
    isConfirmModalOpen.value = false;
    serviceToDelete.value = null;
  }
};

const toggleDropdown = (serviceId) => {
  if (activeDropdownId.value === serviceId) {
    activeDropdownId.value = null;
  } else {
    activeDropdownId.value = serviceId;
  }
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

const handleClickOutside = (event) => {
  if (
    activeDropdownId.value &&
    !event.target.closest(".relative.inline-block")
  ) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
