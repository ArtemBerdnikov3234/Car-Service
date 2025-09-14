<template>
  <main class="container mx-auto px-6 py-24">
    <div v-if="loading" class="py-20 text-center text-secondary-text">
      <i class="fas fa-spinner fa-spin text-3xl"></i>
      <p class="mt-4 text-lg">Загрузка данных об услуге...</p>
    </div>
    <div v-if="error" class="py-20 text-center text-red-400">{{ error }}</div>

    <div v-if="service" class="grid grid-cols-1 gap-12 lg:grid-cols-5">
      <div class="lg:col-span-3">
        <h1 class="mb-4 text-5xl font-bold text-brand-red">
          {{ service.name }}
        </h1>
        <p class="mb-8 text-lg text-secondary-text">
          {{
            service.description || "Подробное описание услуги скоро появится."
          }}
        </p>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-lg bg-light-dark p-4">
            <i class="fas fa-clock mb-2 text-2xl text-brand-red"></i>
            <p class="font-semibold text-white">Длительность</p>
            <p class="text-secondary-text">
              ~{{ service.duration_minutes }} минут
            </p>
          </div>
          <div class="rounded-lg bg-light-dark p-4">
            <i class="fas fa-wrench mb-2 text-2xl text-brand-red"></i>
            <p class="font-semibold text-white">Специалист</p>
            <p class="text-secondary-text">
              {{ service.required_spec_id ? "Требуется" : "Не требуется" }}
            </p>
          </div>
          <div class="rounded-lg bg-light-dark p-4 sm:col-span-2">
            <i class="fas fa-check-circle mb-2 text-2xl text-brand-red"></i>
            <p class="font-semibold text-white">Гарантия</p>
            <p class="text-secondary-text">
              Мы предоставляем гарантию на все выполненные работы
            </p>
          </div>
        </div>

        <div
          class="mt-8 rounded-2xl bg-gradient-to-br from-card-dark to-light-dark p-8 shadow-2xl shadow-black/30"
        >
          <div
            class="flex flex-col items-center justify-between gap-6 sm:flex-row"
          >
            <div class="text-center sm:text-left">
              <p class="text-secondary-text">Стоимость услуги</p>
              <p
                class="bg-gradient-to-r from-brand-red to-brand-red-dark bg-clip-text text-5xl font-extrabold text-transparent"
              >
                {{ service.price }} ₽
              </p>
            </div>

            <div class="w-full shrink-0 sm:w-auto">
              <BaseButton
                :to="{ name: 'NewBooking' }"
                tag="router-link"
                class="w-full"
              >
                <i class="fas fa-calendar-check mr-2"></i>
                Записаться
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-center rounded-2xl border-2 border-brand-red-light bg-card-dark p-2 shadow-lg lg:col-span-2"
      >
        <img
          src="@/assets/service_placeholder.jpg"
          alt="Изображение услуги"
          class="h-full w-full rounded-xl object-cover"
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
