<template>
  <div class="bg-white flex items-center justify-center py-12 px-4">
    <div
      class="w-full max-w-md bg-gray-100 rounded-xl shadow-lg p-8 border border-gray-300"
    >
      <div class="text-center mb-8">
        <router-link
          :to="{ name: 'Home' }"
          class="text-4xl font-bold text-gray-900"
          >Auto<span class="text-gray-500">Service</span></router-link
        >
        <h2 class="text-3xl font-bold mt-4 text-gray-900">Вход в систему</h2>
        <div
          v-if="$route.query.registered"
          class="mt-2 p-3 bg-green-100 text-green-800 rounded-lg"
        >
          Регистрация прошла успешно! Теперь вы можете войти.
        </div>
        <p v-else class="text-gray-600 mt-2">
          Нет аккаунта?
          <router-link
            :to="{ name: 'Register' }"
            class="text-gray-900 font-semibold hover:underline"
            >Зарегистрируйтесь</router-link
          >
        </p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
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
          <i v-if="!loading" class="fas fa-sign-in-alt mr-3"></i>
          <span v-if="!loading">Войти</span>
          <span v-else>Вход...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();
const form = reactive({ email: "", password: "" });
const error = ref(null);
const loading = ref(false);

const handleLogin = async () => {
  error.value = null;
  loading.value = true;
  try {
    await authStore.login(form);
  } catch (err) {
    error.value = err.response?.data?.message || "Произошла ошибка при входе.";
  } finally {
    loading.value = false;
  }
};
</script>
