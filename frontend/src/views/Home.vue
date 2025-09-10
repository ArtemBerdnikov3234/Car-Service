<!-- src/views/Home.vue -->
<template>
  <main class="container mx-auto px-6 py-12">
    <!-- Hero Section -->
    <div
      class="bg-brand-gray h-96 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center text-center border border-brand-light-gray relative overflow-hidden"
    >
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <h1
        class="text-5xl font-extrabold mb-4 leading-tight text-brand-white z-10"
      >
        Профессиональный автосервис: <br />быстро и качественно
      </h1>
      <p class="text-lg mb-8 text-brand-text z-10">
        Ваш автомобиль в надежных руках
      </p>
      <div class="z-10">
        <router-link
          :to="{ name: 'Services' }"
          class="bg-brand-accent hover:bg-brand-accent-hover text-white font-bold py-3 px-8 rounded-lg transition duration-300"
        >
          Выбрать услугу
        </router-link>
      </div>
    </div>

    <!-- Services Section -->
    <section class="mt-20">
      <h2 class="text-4xl font-bold text-center mb-12 text-brand-white">
        Популярные услуги
      </h2>
      <div v-if="loading" class="text-center text-brand-text">
        Загрузка популярных услуг...
      </div>
      <div v-if="error" class="text-center text-red-400">{{ error }}</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Оборачиваем ВСЮ карточку в router-link -->
        <router-link
          v-for="service in featuredServices"
          :key="service.service_id"
          :to="{ name: 'ServiceDetail', params: { id: service.service_id } }"
          class="group block bg-brand-gray rounded-2xl shadow-lg border border-brand-light-gray hover:border-brand-accent transition duration-300 overflow-hidden transform hover:-translate-y-1"
        >
          <div class="p-8 flex flex-col h-full">
            <h3
              class="font-bold text-xl mb-3 text-brand-white group-hover:text-brand-accent transition duration-300"
            >
              {{ service.name }}
            </h3>
            <p class="text-brand-text text-sm mb-5 flex-grow h-12">
              {{
                service.description
                  ? service.description.length > 80
                    ? service.description.substring(0, 80) + "..."
                    : service.description
                  : "Качественное выполнение работ."
              }}
            </p>
            <div
              class="flex justify-between items-center border-t border-brand-light-gray pt-4 mt-auto"
            >
              <span class="font-bold text-lg text-brand-white"
                >{{ service.price }} ₽</span
              >
              <span class="text-brand-accent font-semibold flex items-center">
                Подробнее <i class="fas fa-arrow-right ml-2 text-sm"></i>
              </span>
            </div>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Advantages Section -->
    <section
      class="mt-20 bg-brand-gray rounded-2xl shadow-xl p-12 border border-brand-light-gray"
    >
      <h2 class="text-4xl font-bold text-center mb-12 text-brand-white">
        Наши преимущества
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div>
          <div
            class="flex items-center justify-center h-20 w-20 mx-auto bg-brand-light-gray rounded-full mb-6 border-2 border-gray-600"
          >
            <i class="fas fa-calendar-check text-3xl text-brand-accent"></i>
          </div>
          <h3 class="font-bold text-2xl mb-3 text-brand-white">
            Онлайн-запись
          </h3>
          <p class="text-brand-text">
            Экономьте свое время, записывайтесь в удобное для вас время через
            сайт.
          </p>
        </div>
        <div>
          <div
            class="flex items-center justify-center h-20 w-20 mx-auto bg-brand-light-gray rounded-full mb-6 border-2 border-gray-600"
          >
            <i class="fas fa-award text-3xl text-brand-accent"></i>
          </div>
          <h3 class="font-bold text-2xl mb-3 text-brand-white">
            Гарантия качества
          </h3>
          <p class="text-brand-text">
            Мы используем только сертифицированные запчасти и даем гарантию на
            все работы.
          </p>
        </div>
        <div>
          <div
            class="flex items-center justify-center h-20 w-20 mx-auto bg-brand-light-gray rounded-full mb-6 border-2 border-gray-600"
          >
            <i class="fas fa-gem text-3xl text-brand-accent"></i>
          </div>
          <h3 class="font-bold text-2xl mb-3 text-brand-white">
            Программа лояльности
          </h3>
          <p class="text-brand-text">
            Накапливайте бонусы и получайте скидки на последующие обслуживания.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: linear-gradient(
      rgba(249, 250, 251, 0.07) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(249, 250, 251, 0.07) 1px, transparent 1px);
  background-size: 2rem 2rem;
}
</style>

<script setup>
import { ref, onMounted, computed } from "vue";
import apiClient from "@/services/api";

const allServices = ref([]);
const loading = ref(true);
const error = ref(null);

const featuredServices = computed(() => allServices.value.slice(0, 4));

onMounted(async () => {
  try {
    const response = await apiClient.get("/services");
    allServices.value = response.data;
  } catch (err) {
    console.error("Failed to load services on Home page:", err);
    error.value = "Не удалось загрузить услуги.";
  } finally {
    loading.value = false;
  }
});
</script>
