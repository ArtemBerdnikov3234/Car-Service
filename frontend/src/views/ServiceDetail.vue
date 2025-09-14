<template>
  <main class="container mx-auto px-6 py-12">
    <div v-if="loading" class="py-20 text-center text-secondary-text">
      Загрузка данных об услуге...
    </div>
    <div v-if="error" class="py-20 text-center text-red-400">{{ error }}</div>

    <div v-if="service" class="grid grid-cols-1 gap-12 lg:grid-cols-5">
      <div
        class="rounded-2xl border border-brand-red-light bg-card-dark p-8 shadow-lg lg:col-span-3"
      >
        <h1 class="mb-4 text-4xl font-bold text-white">{{ service.name }}</h1>
        <p class="mb-8 text-lg text-secondary-text">
          {{
            service.description || "Подробное описание услуги скоро появится."
          }}
        </p>

        <ul
          class="mb-8 space-y-4 border-t border-white/10 pt-6 text-secondary-text"
        >
          <li class="flex items-center">
            <i class="far fa-clock mr-3 w-5 text-center text-brand-red"></i>
            <span>Длительность: ~{{ service.duration_minutes }} минут</span>
          </li>
          <li class="flex items-center">
            <i class="fas fa-wrench mr-3 w-5 text-center text-brand-red"></i>
            <span
              >Требуется специалист:
              {{ service.required_spec_id ? "Да" : "Нет" }}</span
            >
          </li>
          <li class="flex items-center">
            <i class="fas fa-check mr-3 w-5 text-center text-brand-red"></i>
            <span>Гарантия на выполненные работы</span>
          </li>
        </ul>

        <div class="border-t border-white/10 pt-6">
          <p class="mb-6 text-3xl font-bold text-white">
            Цена: {{ service.price }} ₽
          </p>
          <BaseButton :to="{ name: 'NewBooking' }" tag="router-link">
            Записаться на услугу
          </BaseButton>
        </div>
      </div>

      <div
        class="flex items-center justify-center rounded-2xl bg-card-dark lg:col-span-2"
      >
        <img
          src="@/assets/service_placeholder.jpg"
          alt="Изображение услуги"
          class="h-full w-full rounded-2xl object-cover"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import apiClient from "@/services/api";
import BaseButton from "@/components/BaseButton.vue";

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
  } finally {
    loading.value = false;
  }
});
</script>
