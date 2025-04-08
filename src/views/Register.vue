<template>
  <div class="register">
    <h1>Otwarcie konta</h1>
    <form @submit.prevent="register">
      <div>
        <label for="email">Email</label>
        <input v-model="form.email" type="email" id="email" required />
      </div>
      <div>
        <label for="password">Hasło</label>
        <input v-model="form.password" type="password" id="password" required />
      </div>
      <div>
        <label for="confirmPassword">Potwierdź hasło</label>
        <input v-model="form.confirmPassword" type="password" id="confirmPassword" required />
      </div>
      <button type="submit">Załóż konto</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')

const register = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Hasła się nie zgadzają!'
    return
  }


  // API ANRZEJ
  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/register', {
      email: form.value.email,
      password: form.value.password
    })

    // TODO: Przekierowanie po sukcesie
    console.log('Zarejestrowano:', response.data)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Błąd podczas rejestracji.'
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
input {
  display: block;
  margin-bottom: 1rem;
  width: 100%;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
