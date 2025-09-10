<template>
  <div class="bg-white flex items-center justify-center py-12 px-4">
    <div
      class="w-full max-w-lg bg-gray-100 rounded-xl shadow-lg p-8 border border-gray-300"
    >
      <div class="text-center mb-8">
        <router-link
          :to="{ name: 'Home' }"
          class="text-4xl font-bold text-gray-900"
          >Auto<span class="text-gray-500">Service</span></router-link
        >
        <h2 class="text-3xl font-bold mt-4 text-gray-900">Создание аккаунта</h2>
        <p class="text-gray-600 mt-2">
          Уже есть аккаунт?
          <router-link
            :to="{ name: 'Login' }"
            class="text-gray-900 font-semibold hover:underline"
            >Войдите</router-link
          >
        </p>
      </div>
      <form @submit.prevent="handleRegister" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="first_name"
              class="block text-gray-700 font-semibold mb-2"
              >Имя</label
            >
            <input
              v-model="form.first_name"
              type="text"
              id="first_name"
              class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg"
              required
            />
          </div>
          <div>
            <label
              for="last_name"
              class="block text-gray-700 font-semibold mb-2"
              >Фамилия</label
            >
            <input
              v-model="form.last_name"
              type="text"
              id="last_name"
              class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg"
              required
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-gray-700 font-semibold mb-2"
            >Email</label
          >
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-gray-700 font-semibold mb-2"
            >Пароль</label
          >
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="w-full px-4 py-3 bg-white border border-gray-400 rounded-lg"
            required
          />
        </div>
        <p v-if="error" class="text-red-500 text-center">{{ error }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-4 rounded-lg transition text-lg flex items-center justify-center disabled:opacity-50"
        >
          <span v-if="!loading">Зарегистрироваться</span>
          <span v-else>Регистрация...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const form = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
});
const error = ref(null);
const loading = ref(false);

const handleRegister = async () => {
  error.value = null;
  loading.value = true;
  try {
    await authStore.register(form);
  } catch (err) {
    error.value =
      err.response?.data?.message || "Произошла ошибка при регистрации.";
  } finally {
    loading.value = false;
  }
};
</script>
