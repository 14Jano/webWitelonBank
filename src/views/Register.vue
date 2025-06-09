<template>
  <router-link to="/navbar"></router-link>
  <div class="register-form">
    <h1>{{ $t('registerPage.title') }}</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="firstName">{{ $t('registerPage.form.firstNameLabel') }}</label>
        <input v-model="form.firstName" type="text" id="firstName" :placeholder="$t('registerPage.form.firstNamePlaceholder')" required />
      </div>
      <div class="form-group">
        <label for="lastName">{{ $t('registerPage.form.lastNameLabel') }}</label>
        <input v-model="form.lastName" type="text" id="lastName" :placeholder="$t('registerPage.form.lastNamePlaceholder')" required />
      </div>
      <div class="form-group">
        <label for="email">{{ $t('registerPage.form.emailLabel') }}</label>
        <input v-model="form.email" type="email" id="email" :placeholder="$t('registerPage.form.emailPlaceholder')" required />
      </div>
      <div class="form-group">
        <label for="email">{{ $t('registerPage.form.phoneLabel') }}</label>
        <input v-model="form.tel" type="tel" id="tel" :placeholder="$t('registerPage.form.phonePlaceholder')" />
      </div>
      <div class="form-group">
        <label for="password">{{ $t('registerPage.form.passwordLabel') }}</label>
        <input v-model="form.password" type="password" id="password" :placeholder="$t('registerPage.form.passwordPlaceholder')" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">{{ $t('registerPage.form.confirmPasswordLabel') }}</label>
        <input v-model="form.confirmPassword" type="password" id="confirmPassword" :placeholder="$t('registerPage.form.confirmPasswordPlaceholder')" required />
      </div>
      <button type="submit" class="submit-button">{{ $t('registerPage.form.submitButton') }}</button>

      <p class="mt-3 items-center">{{ $t('registerPage.form.alreadyHaveAccount') }} <router-link to="/login" id="link">{{ $t('registerPage.form.loginLink') }}</router-link></p>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  firstName: '',
  lastName: '',
  tel: '',
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

  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/register', {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      tel: form.value.tel,
      email: form.value.email,
      password: form.value.password
    })

    console.log('Zarejestrowano:', response.data)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Błąd podczas rejestracji.'
  }
}
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1a202c;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3182ce;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #2b6cb0;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
#link:hover {
  color: #2563eb;
  text-decoration: none;
}
</style>