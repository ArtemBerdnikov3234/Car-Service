<template>
  <footer class="border-t border-brand-red-light bg-[#0a0a0a] pt-16 pb-8">
    <div class="container mx-auto px-6">
      <div
        class="grid grid-cols-1 gap-12 text-center md:grid-cols-4 md:text-left"
      >
        <div>
          <h3 class="mb-4 text-xl font-bold text-brand-red">AutoService</h3>
          <p class="text-secondary-text">
            Профессиональное обслуживание вашего автомобиля с гарантией
            качества.
          </p>
        </div>
        <div>
          <h3 class="mb-4 text-lg font-semibold text-white">Навигация</h3>
          <router-link
            to="/services"
            class="mb-2 block text-secondary-text transition hover:text-brand-red"
            >Услуги</router-link
          >
          <a
            href="#"
            class="mb-2 block text-secondary-text transition hover:text-brand-red"
            >Контакты</a
          >
          <a
            href="#"
            class="mb-2 block text-secondary-text transition hover:text-brand-red"
            >Политика конфиденциальности</a
          >
        </div>
        <div>
          <h3 class="mb-4 text-lg font-semibold text-white">Контакты</h3>
          <p class="mb-2 text-secondary-text">
            <i class="fas fa-phone mr-2"></i> +7 (999) 123-45-67
          </p>
          <p class="mb-2 text-secondary-text">
            <i class="fas fa-envelope mr-2"></i> info@autoservice.ru
          </p>
          <p class="mb-2 text-secondary-text">
            <i class="fas fa-clock mr-2"></i> Пн-Вс: 09:00-21:00
          </p>
        </div>
        <div>
          <h3 class="mb-4 text-lg font-semibold text-white">Соцсети</h3>
          <div class="flex justify-center space-x-6 md:justify-start">
            <a
              href="#"
              class="text-xl text-secondary-text transition hover:text-brand-red"
              ><i class="fab fa-vk"></i
            ></a>
            <a
              href="#"
              class="text-xl text-secondary-text transition hover:text-brand-red"
              ><i class="fab fa-telegram-plane"></i
            ></a>
          </div>
        </div>
      </div>
      <div
        class="mt-12 border-t border-white/10 pt-8 text-center text-gray-500"
      >
        <p>&copy; 2025 AutoService. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>
