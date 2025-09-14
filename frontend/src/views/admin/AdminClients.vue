<template>
  <div class="bg-white rounded-lg shadow p-6 border border-gray-200">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Список клиентов</h2>

    <div v-if="loading" class="text-center p-10 text-gray-500">Загрузка...</div>
    <div v-if="error" class="text-center p-10 text-red-500">{{ error }}</div>

    <div v-if="!loading && clients.length" class="overflow-x-auto">
      <table class="w-full text-left text-gray-600">
        <thead class="text-xs text-gray-500 uppercase bg-gray-50">
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Имя</th>
            <th class="p-4">Email</th>
            <th class="p-4">Телефон</th>
            <th class="p-4">Статус</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="client in clients"
            :key="client.user_id"
            class="hover:bg-gray-50"
          >
            <td class="p-4">{{ client.user_id }}</td>
            <td class="p-4 font-medium text-gray-900">
              {{ client.first_name }} {{ client.last_name }}
            </td>
            <td class="p-4">{{ client.email }}</td>
            <td class="p-4">{{ client.phone_number || "-" }}</td>
            <td class="p-4">
              <span v-if="client.is_active" class="text-green-600 font-semibold"
                >Активен</span
              >
              <span v-else class="text-red-600 font-semibold">Неактивен</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="!loading && !clients.length"
      class="text-center text-gray-500 py-10"
    >
      <p>В системе пока нет зарегистрированных клиентов.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/services/api";

const clients = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const { data } = await apiClient.get("/users/clients");
    clients.value = data;
  } catch (err) {
    console.error("Failed to fetch clients", err);
    error.value = "Не удалось загрузить список клиентов.";
  } finally {
    loading.value = false;
  }
});
</script>
