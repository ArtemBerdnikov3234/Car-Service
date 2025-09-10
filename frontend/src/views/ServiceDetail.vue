<!-- src/views/ServiceDetail.vue -->
<template>
  <main class="container mx-auto px-6 py-12">
    <div v-if="loading" class="text-center py-20">
      Загрузка данных об услуге...
    </div>
    <div v-if="error" class="text-center py-20 text-red-500">{{ error }}</div>

    <div v-if="service" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Service Info -->
      <div class="text-gray-900">
        <h1 class="text-4xl font-bold mb-4">{{ service.name }}</h1>
        <p class="text-gray-600 mb-6 text-lg">
          {{
            service.description || "Подробное описание услуги скоро появится."
          }}
        </p>

        <ul class="space-y-3 mb-6 text-gray-700">
          <li>
            <i class="far fa-clock mr-2 text-gray-500 w-5 text-center"></i>
            Длительность: ~{{ service.duration_minutes }} минут
          </li>
          <!-- В будущем можно добавить вывод специализации -->
          <li>
            <i class="fas fa-wrench mr-2 text-gray-500 w-5 text-center"></i>
            Требуется специалист: {{ service.required_spec_id ? "Да" : "Нет" }}
          </li>
          <li>
            <i class="fas fa-check mr-2 text-gray-500 w-5 text-center"></i>
            Гарантия на выполненные работы
          </li>
        </ul>

        <p class="text-2xl font-bold mb-6">Цена: {{ service.price }} ₽</p>

        <router-link
          :to="{ name: 'NewBooking' }"
          class="inline-block bg-gray-900 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          Записаться на услугу
        </router-link>
      </div>

      <!-- Image Placeholder -->
      <div
        class="bg-gray-200 rounded-lg h-80 flex items-center justify-center border border-gray-300"
      >
        <span class="text-gray-500">Здесь будет изображение услуги</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/services/api";

const route = useRoute();
const service = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  const serviceId = route.params.id;
  try {
    const { data } = await apiClient.get(`/services/${serviceId}`);
    service.value = data;
  } catch (err) {
    error.value = "Не удалось загрузить данные об услуге.";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
