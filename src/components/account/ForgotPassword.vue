<!-- src/components/account/ForgotPassword.vue -->
<template>
  <div class="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Przypomnij hasło</h2>
    <form @submit.prevent="sendResetEmail">
      <div class="mb-4">
        <label class="block mb-1">Email</label>
        <input v-model="email" type="email" class="input" required />
      </div>
      <button class="btn-primary" type="submit" :disabled="loading">Wyślij link resetujący</button>
      <p v-if="error" class="text-red-600 mt-2">{{ error }}</p>
      <p v-if="success" class="text-green-600 mt-2">Jeśli email istnieje, wysłaliśmy link do resetu hasła.</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const sendResetEmail = async () => {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + '/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Błąd wysyłania emaila.')
    }
    success.value = true
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s;
}
.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
</style>