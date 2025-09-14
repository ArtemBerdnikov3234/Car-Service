<template>
  <main class="container mx-auto px-6 py-12">
    <h1 class="text-5xl font-bold text-center mb-12 text-brand-white">
      Наши услуги
    </h1>

    <div class="relative mx-auto mb-12 max-w-2xl">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5"
      >
        <i class="fas fa-search text-secondary-text"></i>
      </div>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по названию услуги..."
        class="w-full rounded-full border border-white/20 bg-light-dark py-4 pl-14 pr-6 text-white placeholder-secondary-text focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
      />
    </div>

    <div v-if="loading" class="text-center py-10 text-brand-text">
      Загрузка услуг...
    </div>
    <div v-if="error" class="text-center py-10 text-red-400">{{ error }}</div>

    <section v-if="!loading && filteredServices.length">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <router-link
          v-for="service in filteredServices"
          :key="service.service_id"
          :to="{ name: 'ServiceDetail', params: { id: service.service_id } }"
          class="group block bg-brand-gray rounded-xl shadow-lg p-8 flex flex-col h-full border border-brand-light-gray hover:border-brand-accent transition-all duration-300 transform hover:-translate-y-1"
        >
          <h3
            class="font-bold text-2xl mb-3 text-brand-white group-hover:text-brand-accent transition-colors"
          >
            {{ service.name }}
          </h3>
          <p class="text-brand-text mb-5 flex-grow min-h-[60px]">
            {{
              service.description ||
              "Качественное выполнение работ по стандартам производителя."
            }}
          </p>
          <div class="text-sm text-gray-400 mb-5">
            <p>
              <i class="far fa-clock mr-2 text-brand-accent"></i>Длительность:
              ~{{ service.duration_minutes }} минут
            </p>
          </div>
          <div
            class="flex justify-between items-center mt-auto border-t border-brand-light-gray pt-5"
          >
            <span class="font-bold text-2xl text-brand-white"
              >{{ service.price }} ₽</span
            >
            <span class="text-brand-accent font-bold">Подробнее</span>
          </div>
        </router-link>
      </div>
    </section>

    <div
      v-if="!loading && !filteredServices.length"
      class="text-center py-10 text-gray-500"
    >
      <h2 class="text-2xl font-bold text-brand-white">Услуги не найдены</h2>
      <p class="mt-2">
        По вашему запросу ничего не найдено. Попробуйте изменить поисковый
        запрос.
      </p>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";

const allServices = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref("");

const filteredServices = computed(() => {
  if (!searchQuery.value) {
    return allServices.value;
  }
  return allServices.value.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(async () => {
  try {
    const response = await apiClient.get("/services");
    allServices.value = response.data;
  } catch (err) {
    console.error("Failed to load services:", err);
    error.value =
      "Не удалось загрузить список услуг. Пожалуйста, попробуйте позже.";
  } finally {
    loading.value = false;
  }
});
</script>
