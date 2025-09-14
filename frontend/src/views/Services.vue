<template>
  <main class="container mx-auto px-6 py-24">
    <h1 class="mb-12 text-center text-5xl font-bold text-brand-red">
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
        class="w-full rounded-full border border-white/20 bg-light-dark py-4 pl-14 pr-6 text-white placeholder-secondary-text transition focus:border-brand-red focus:outline-none focus:ring-0"
      />
    </div>

   
    <div v-if="loading" class="py-10 text-center text-secondary-text">
      <i class="fas fa-spinner fa-spin text-3xl"></i>
      <p class="mt-4">Загрузка услуг...</p>
    </div>
    <div v-if="error" class="py-10 text-center text-red-400">{{ error }}</div>

  
    <section v-if="!loading && filteredServices.length">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <router-link
          v-for="service in filteredServices"
          :key="service.service_id"
          :to="{ name: 'ServiceDetail', params: { id: service.service_id } }"
          class="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-red-light bg-card-dark p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-brand-red hover:shadow-2xl hover:shadow-black/50"
        >
          
          <div class="flex-grow">
            <h3
              class="mb-3 text-2xl font-bold text-white group-hover:text-brand-red"
            >
              {{ service.name }}
            </h3>
            <p class="min-h-[72px] text-secondary-text">
              {{
                service.description?.substring(0, 100) +
                  (service.description?.length > 100 ? "..." : "") ||
                "Качественное выполнение работ по стандартам производителя."
              }}
            </p>
          </div>

         
          <div class="mt-6 border-t border-white/10 pt-6">
            <div class="mb-4 flex items-center text-sm text-secondary-text">
              <i class="far fa-clock mr-2 text-brand-red"></i>
              <span>~{{ service.duration_minutes }} минут</span>
            </div>
            <div class="flex items-end justify-between">
              <div>
                <p class="text-sm text-secondary-text">Стоимость</p>
                <p class="text-3xl font-bold text-white">
                  {{ service.price }} ₽
                </p>
              </div>
              <i
                class="fas fa-arrow-right text-2xl text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white"
              ></i>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    
    <div
      v-if="!loading && !filteredServices.length"
      class="py-10 text-center text-gray-500"
    >
      <h2 class="text-2xl font-bold text-white">Услуги не найдены</h2>
      <p class="mt-2 text-secondary-text">
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
    return allServices.value.filter((service) => service.is_active);
  }
  return allServices.value.filter(
    (service) =>
      service.is_active &&
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
