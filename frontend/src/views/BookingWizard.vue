<!-- src/views/BookingWizard.vue -->
<template>
  <main class="container mx-auto px-6 py-12 max-w-4xl">
    <h1 class="text-5xl font-bold text-center mb-10 text-brand-white">
      Новая запись
    </h1>

    <!-- Шаги -->
    <div class="mb-10 flex justify-center">
      <ol
        class="flex items-center space-x-4 text-sm font-medium text-brand-text"
      >
        <!-- Шаг 1 -->
        <li
          class="flex items-center"
          :class="{ 'text-brand-accent': step === 1 }"
        >
          <span
            class="flex items-center justify-center w-8 h-8 mr-2 text-xs border rounded-full shrink-0"
            :class="
              step >= 1 ? 'border-2 border-brand-accent' : 'border-gray-500'
            "
          >
            1
          </span>
          Автомобиль
          <i class="fas fa-chevron-right text-gray-600 ml-4"></i>
        </li>
        <!-- Шаг 2 -->
        <li
          class="flex items-center"
          :class="{ 'text-brand-accent': step === 2 }"
        >
          <span
            class="flex items-center justify-center w-8 h-8 mr-2 text-xs border rounded-full shrink-0"
            :class="
              step >= 2 ? 'border-2 border-brand-accent' : 'border-gray-500'
            "
          >
            2
          </span>
          Услуги
          <i class="fas fa-chevron-right text-gray-600 ml-4"></i>
        </li>
        <!-- Шаг 3 -->
        <li
          class="flex items-center"
          :class="{ 'text-brand-accent': step === 3 }"
        >
          <span
            class="flex items-center justify-center w-8 h-8 mr-2 text-xs border rounded-full shrink-0"
            :class="
              step >= 3 ? 'border-2 border-brand-accent' : 'border-gray-500'
            "
          >
            3
          </span>
          Время
        </li>
      </ol>
    </div>

    <!-- Контент Wizard -->
    <div
      class="bg-brand-gray rounded-xl shadow-xl p-8 border border-brand-light-gray"
    >
      <!-- Шаг 1: Выбор автомобиля -->
      <div v-if="step === 1">
        <h2 class="text-3xl font-bold mb-8 text-brand-white">
          Шаг 1: Выберите автомобиль
        </h2>
        <!-- Здесь будет динамический список машин -->
      </div>
      <!-- Другие шаги (2 и 3) будут здесь -->

      <div class="mt-10 flex justify-between items-center">
        <button
          v-if="step > 1"
          @click="step--"
          class="py-3 px-10 rounded-lg transition bg-brand-light-gray hover:bg-gray-600 text-brand-white"
        >
          Назад
        </button>
        <div v-else></div>
        <!-- Пустой div для выравнивания кнопки "Далее" -->
        <button
          @click="step < 3 ? step++ : submitBooking()"
          class="py-3 px-10 rounded-lg transition bg-brand-accent hover:bg-brand-accent-hover text-white font-bold"
        >
          {{ step < 3 ? "Далее" : "Подтвердить" }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";

const step = ref(1); // Управляем текущим шагом

const submitBooking = () => {
  // Здесь будет логика отправки формы на последнем шаге
  alert("Отправка формы записи!");
};
</script>
