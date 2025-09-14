<template>
  <div class="rounded-2xl border border-white/10 bg-card-dark p-6 shadow-lg">
    <h2 class="mb-6 text-2xl font-bold text-white">Список клиентов</h2>

    <div v-if="loading" class="py-10 text-center text-secondary-text">
      <i class="fas fa-spinner fa-spin text-2xl"></i>
    </div>
    <div v-if="error" class="py-10 text-center text-red-400">{{ error }}</div>

    <div v-if="!loading && clients.length" class="overflow-x-auto">
      <table class="w-full text-left">
        <thead
          class="border-b border-white/10 text-sm uppercase text-secondary-text"
        >
          <tr>
            <th class="p-4">ID</th>
            <th class="p-4">Имя</th>
            <th class="p-4">Email</th>
            <th class="p-4">Телефон</th>
            <th class="p-4">Статус</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/10 text-secondary-text">
          <tr
            v-for="client in clients"
            :key="client.user_id"
            class="transition hover:bg-white/5"
          >
            <td class="p-4">{{ client.user_id }}</td>
            <td class="p-4 font-medium text-white">
              {{ client.first_name }} {{ client.last_name }}
            </td>
            <td class="p-4">{{ client.email }}</td>
            <td class="p-4">{{ client.phone_number || "-" }}</td>
            <td class="p-4">
              <span v-if="client.is_active" class="font-semibold text-green-400"
                >Активен</span
              >
              <span v-else class="font-semibold text-red-400">Неактивен</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="!loading && !clients.length"
      class="py-10 text-center text-secondary-text"
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
