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
            :class="{ 'input-error': errors.email }"
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
            v-model="haslo"
            :class="{ 'input-error': errors.haslo }"
            placeholder="Wprowadź hasło"
            required
        />
        <p v-if="errors.haslo" class="error">{{ errors.haslo }}</p>
      </div>
      <button type="submit" class="btn">Zaloguj</button>

      <p class="mt-3 items-center">Nie masz konta? <router-link to="/register" id="link">Założysz je tutaj</router-link></p>
      <p class="mt-2">
        <router-link to="/forgot-password" id="link">Nie pamiętasz hasła?</router-link>
      </p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from "../store/auth.ts";
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(['2fa-required']);
const authStore = useAuthStore();

const email = ref('');
const haslo = ref('');
const errors = ref<{ email?: string; haslo?: string }>({});
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

  if (!haslo.value) {
    errors.value.haslo = 'Hasło jest wymagane.';
    isValid = false;
  } else if (haslo.value.length < 6) {
    errors.value.haslo = 'Hasło musi mieć co najmniej 6 znaków.';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    const response = await fetch('https://witelonapi.host358482.xce.pl/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        haslo: haslo.value
      }),
    });

    if (!response.ok) {
      throw new Error('Nieprawidłowe dane logowania.');
    }

    const data = await response.json();
    console.log('Zalogowano:', data);

    authStore.setTempToken(data.token);
    authStore.setLoginEmail(email.value);

    await router.push({path: '/2fa'});
  } catch (err: any) {
    errorMessage.value = err.message || 'Wystąpił błąd podczas logowania.';
  }
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #1e293b;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #334155;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input-error {
  border-color: red;
}

button.btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn:hover {
  background-color: #1d4ed8;
}

button.btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.alt-link {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

#link {
  color: #2563eb;
  font-weight: 500;
}

#link:hover {
  text-decoration: underline;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>