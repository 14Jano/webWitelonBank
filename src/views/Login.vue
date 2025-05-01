<template>
  <div class="login-form">
    <h2>Logowanie</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Wprowadź email"
            required
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>
      <div class="form-group">
        <label for="password">Hasło:</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Wprowadź hasło"
            required
        />
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>
      <div class="form-group">
        <label for="rememberMe">
          <input
              type="checkbox"
              id="rememberMe"
              v-model="rememberMe"
          />
          Zapamiętaj mnie
        </label>
      </div>
      <button type="submit" class="btn">Zaloguj</button>

      <p class="mt-3 items-center">Nie masz konta? <router-link to="/register" id="link">Założysz je tutaj</router-link></p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errors = ref<{ email?: string; password?: string }>({});
const errorMessage = ref('');

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!email.value) {
    errors.value.email = 'Email jest wymagany.';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Podaj poprawny adres email.';
    isValid = false;
  }

  if (!password.value) {
    errors.value.password = 'Hasło jest wymagane.';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.value.password = 'Hasło musi mieć co najmniej 6 znaków.';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    // Przykładowe wywołanie API
    const response = await fetch(import.meta.env.VITE_API_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Nieprawidłowe dane logowania.');
    }

    const data = await response.json();
    console.log('Zalogowano:', data);
  } catch (err: any) {
    errorMessage.value = err.message || 'Wystąpił błąd podczas logowania.';
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
}
h2 {
  text-align: center;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
}
input[type="checkbox"] {
  margin-right: 0.5rem;
}
button {
  width: 100%;
  padding: 0.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #1d4ed8;
}
.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
#link:hover {
  color: #2563eb;
  text-decoration: none;
}
</style>