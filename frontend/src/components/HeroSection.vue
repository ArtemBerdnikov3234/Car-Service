<template>
  <header
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0 bg-dark/70"></div>

    <div class="container relative z-10 mx-auto px-6 text-center">
      <h1
        class="bg-gradient-to-r from-brand-red to-brand-red-dark bg-clip-text text-5xl font-black !leading-tight text-transparent md:text-7xl"
      >
        Премиальное обслуживание<br />вашего автомобиля
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-secondary-text md:text-xl">
        Ваш автомобиль в надежных руках профессионалов. Гарантия качества,
        современное оборудование и прозрачные цены.
      </p>

      <div class="mt-12 flex flex-wrap items-center justify-center gap-6">
        <BaseButton :to="{ name: 'Services' }" tag="router-link">
          <i class="fas fa-wrench mr-2"></i>Выбрать услугу
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import BaseButton from "@/components/BaseButton.vue";
</script>
