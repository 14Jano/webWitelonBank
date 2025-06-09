<template>
  <div class="twofa-form">
    <h2>{{ $t('twoFactorAuth.title') }}</h2>
    <form @submit.prevent="submit">
      <input v-model="dwuetapowy_kod" :placeholder="$t('twoFactorAuth.placeholder')" required />
      <button type="submit">{{ $t('twoFactorAuth.confirmButton') }}</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../store/auth.ts';
import { useRouter } from 'vue-router';


const error = ref('');
const auth = useAuthStore();
const email = auth.loginEmail || '';
const dwuetapowy_kod = ref('');
const router = useRouter();

const submit = async () => {
  try {
    if (!email) {
      error.value = 'Brak adresu email.';
      return;
    }
    await auth.verify2FA(email, dwuetapowy_kod.value);
    router.push('/account');
  } catch (e) {
    error.value = 'Nieprawidłowy kod lub wygasł.';
  }
};
</script>

<style scoped>
.twofa-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
input {
  width: 100%;
  padding: 0.7rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  width: 100%;
  padding: 0.7rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
}
.error {
  color: red;
}
</style>
