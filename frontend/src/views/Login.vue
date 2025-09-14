<template>
  <div class="flex min-h-screen items-center justify-center bg-light-dark p-4">
    <div
      class="w-full max-w-md rounded-2xl border border-brand-red-light bg-card-dark p-8 shadow-2xl"
    >
      <div class="mb-8 text-center">
        <router-link
          :to="{ name: 'Home' }"
          class="text-4xl font-bold text-brand-red"
          >Auto<span class="text-white">Service</span></router-link
        >
        <h2 class="mt-4 text-3xl font-bold text-white">Вход в систему</h2>
        <div
          v-if="$route.query.registered"
          class="mt-4 rounded-lg bg-green-500/20 p-3 text-green-300"
        >
          Регистрация прошла успешно! Теперь вы можете войти.
        </div>
        <p v-else class="mt-2 text-secondary-text">
          Нет аккаунта?
          <router-link
            :to="{ name: 'Register' }"
            class="font-semibold text-brand-red hover:underline"
            >Зарегистрируйтесь</router-link
          >
        </p>
      </div>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <BaseInput v-model="form.email" type="email" label="Email" required />
        <BaseInput
          v-model="form.password"
          type="password"
          label="Пароль"
          required
        />
        <p v-if="error" class="text-center text-red-400">{{ error }}</p>
        <BaseButton type="submit" :disabled="loading" class="w-full">
          <span v-if="loading">Вход...</span>
          <span v-else>Войти</span>
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useAuthStore } from "@/store/auth";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
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
