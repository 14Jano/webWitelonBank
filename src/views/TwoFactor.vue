<template>
  <div class="twofa-form">
    <h2>Weryfikacja dwuetapowa</h2>
    <form @submit.prevent="submitCode">
      <input v-model="code" type="text" placeholder="Wpisz kod z e-maila" required />
      <button type="submit" class="btn">Zweryfikuj</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.ts';

const authStore = useAuthStore();
const router = useRouter();

const code = ref('');
const error = ref('');

const submitCode = async () => {
  try {
    await authStore.verify2FA(code.value);
    router.push('/account');
  } catch (err: any) {
    error.value = 'Nieprawidłowy kod lub wygasł.';
  }
};
</script>

<style scoped>
.twofa-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}
input {
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
button.btn {
  width: 100%;
  padding: 0.7rem;
  font-size: 1rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
