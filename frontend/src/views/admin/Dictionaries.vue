<template>
  <div>
    <BaseModal :show="isModalOpen" @close="isModalOpen = false">
      <ServiceForm
        v-if="modalContent === 'service'"
        :service-to-edit="itemToEdit"
        @close="isModalOpen = false"
        @saved="onSaved"
      />
    </BaseModal>

    <div class="mb-8 border-b border-gray-200">
      <nav class="flex space-x-8">
        <button
          @click="activeTab = 'services'"
          :class="[
            activeTab === 'services'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
          class="py-3 px-1 border-b-2 font-semibold transition"
        >
          Услуги
        </button>
        <button
          @click="activeTab = 'employees'"
          :class="[
            activeTab === 'employees'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ]"
          class="py-3 px-1 border-b-2 font-semibold transition"
        >
          Персонал
        </button>
      </nav>
    </div>

    <div v-if="loading" class="text-center p-10 text-gray-500">
      Загрузка данных...
    </div>
    <div v-if="error" class="text-center p-10 text-red-500">{{ error }}</div>

    <div
      v-if="!loading && activeTab === 'services'"
      class="bg-white rounded-lg shadow p-6 border border-gray-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Список услуг</h2>
        <button
          @click="openModal('service')"
          class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>Добавить услугу
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-gray-600">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="p-4">Название</th>
              <th class="p-4">Цена</th>
              <th class="p-4">Длительность (мин)</th>
              <th class="p-4 text-center">Действия</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="service in services"
              :key="service.service_id"
              class="hover:bg-gray-50"
            >
              <td class="p-4 font-medium text-gray-900">{{ service.name }}</td>
              <td class="p-4">{{ service.price }} ₽</td>
              <td class="p-4">{{ service.duration_minutes }}</td>
              <td class="p-4 text-center space-x-4">
                <button
                  @click="openModal('service', service)"
                  class="text-gray-400 hover:text-indigo-600"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="text-gray-400 hover:text-red-600">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="!loading && activeTab === 'employees'"
      class="bg-white rounded-lg shadow p-6 border border-gray-200"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Список персонала</h2>
        <button
          class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
        >
          <i class="fas fa-plus mr-2"></i>Добавить сотрудника
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-gray-600">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th class="p-4">Имя</th>
              <th class="p-4">Email</th>
              <th class="p-4">Роль</th>
              <th class="p-4">Статус</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="employee in employees"
              :key="employee.employee_id"
              class="hover:bg-gray-50"
            >
              <td class="p-4 font-medium text-gray-900">
                {{ employee.users.first_name }} {{ employee.users.last_name }}
              </td>
              <td class="p-4">{{ employee.users.email }}</td>
              <td class="p-4">
                <span class="capitalize">{{ employee.users.role }}</span>
              </td>
              <td class="p-4">
                <span
                  v-if="employee.users.is_active"
                  class="text-green-600 font-semibold"
                  >Активен</span
                >
                <span v-else class="text-red-600 font-semibold">Неактивен</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/services/api";
import BaseModal from "@/components/BaseModal.vue";
import ServiceForm from "@/components/ServiceForm.vue";

const activeTab = ref("services");
const services = ref([]);
const employees = ref([]);
const loading = ref(true);
const error = ref(null);

const isModalOpen = ref(false);
const modalContent = ref("");
const itemToEdit = ref(null);

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

const openModal = (type, item = null) => {
  modalContent.value = type;
  itemToEdit.value = item ? { ...item } : null;
  isModalOpen.value = true;
};

const onSaved = () => {
  isModalOpen.value = false;
  fetchData();
};
</script>
