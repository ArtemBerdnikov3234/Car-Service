<template>
  <main>
    <HeroSection />

    <section class="py-24">
      <div class="container mx-auto px-6">
        <h2
          class="mb-16 text-center text-4xl font-bold text-brand-red md:text-5xl"
        >
          Популярные услуги
        </h2>
        <div v-if="loading" class="text-center text-secondary-text">
          Загрузка...
        </div>
        <div v-if="error" class="text-center text-red-500">{{ error }}</div>
        <div
          v-else
          class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <router-link
            v-for="service in featuredServices"
            :key="service.service_id"
            :to="{ name: 'ServiceDetail', params: { id: service.service_id } }"
            class="group relative block overflow-hidden rounded-2xl border border-brand-red-light bg-card-dark transition-all duration-300 hover:-translate-y-2 hover:border-brand-red hover:shadow-2xl hover:shadow-black/50"
          >
            <div class="p-8">
              <h3 class="mb-3 text-2xl font-bold">{{ service.name }}</h3>
              <p class="min-h-[50px] text-secondary-text">
                {{
                  service.description
                    ? service.description.substring(0, 80) + "..."
                    : "Качественное выполнение работ."
                }}
              </p>
              <div class="mt-4 text-xl font-semibold text-brand-red">
                от {{ service.price }} ₽
              </div>
            </div>
            <i
              class="fas fa-arrow-right absolute bottom-8 right-8 text-3xl text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
            ></i>
          </router-link>
        </div>
      </div>
    </section>

    <section class="bg-light-dark py-24">
      <div class="container mx-auto px-6">
        <h2
          class="mb-16 text-center text-4xl font-bold text-brand-red md:text-5xl"
        >
          Наши преимущества
        </h2>
        <div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <div
            class="rounded-2xl border border-transparent bg-black/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red-light hover:bg-brand-red/10"
          >
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-dark text-3xl text-brand-red"
            >
              <i class="fas fa-calendar-check"></i>
            </div>
            <h3 class="text-xl font-bold">Онлайн-запись</h3>
            <p class="text-secondary-text">
              Экономьте время, записываясь через сайт в удобное для вас время.
            </p>
          </div>
          <div
            class="rounded-2xl border border-transparent bg-black/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red-light hover:bg-brand-red/10"
          >
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-dark text-3xl text-brand-red"
            >
              <i class="fas fa-shield-halved"></i>
            </div>
            <h3 class="text-xl font-bold">Гарантия качества</h3>
            <p class="text-secondary-text">
              Мы используем сертифицированные запчасти и даем гарантию на все
              работы.
            </p>
          </div>
          <div
            class="rounded-2xl border border-transparent bg-black/20 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red-light hover:bg-brand-red/10"
          >
            <div
              class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-dark text-3xl text-brand-red"
            >
              <i class="fas fa-users-gear"></i>
            </div>
            <h3 class="text-xl font-bold">Опытные мастера</h3>
            <p class="text-secondary-text">
              Наша команда — сертифицированные специалисты с многолетним опытом.
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";
import HeroSection from "@/components/HeroSection.vue";

const allServices = ref([]);
const loading = ref(true);
const error = ref(null);
const featuredServices = computed(() => allServices.value.slice(0, 6));

onMounted(async () => {
  try {
    const response = await apiClient.get("/services");
    allServices.value = response.data;
  } catch (err) {
    error.value = "Не удалось загрузить услуги.";
  } finally {
    loading.value = false;
  }
});
</script>
