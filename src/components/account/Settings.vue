<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <h2 class="text-2xl font-bold text-gray-800">Ustawienia Konta</h2>

    <section class="bg-white p-6 rounded-xl shadow">
      <h3 class="text-lg font-semibold mb-4">Dane osobowe</h3>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium">Imię</label>
            <input v-model="firstName" type="text" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium">Nazwisko</label>
            <input v-model="lastName" type="text" class="input" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input v-model="email" type="email" class="input" />
        </div>
        <button class="btn-primary" type="submit">Zapisz zmiany</button>
      </form>
    </section>

    <button class="btn-primary mt-4" @click="goToResetPassword">
      Resetowanie hasła
    </button>

    <section class="bg-white p-6 rounded-xl shadow border border-red-300">
      <h3 class="text-lg font-semibold mb-4 text-red-600">Usuń konto</h3>
      <p class="text-sm text-gray-700 mb-4">
        Ta operacja jest nieodwracalna. Konto zostanie trwale usunięte z systemu.
      </p>
      <button class="btn-danger" @click="deleteAccount">Usuń konto</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
function goToResetPassword() {
  router.push('/reset-password')
}

const authStore = useAuthStore()

const firstName = ref(authStore.user?.firstName || '')
const lastName = ref(authStore.user?.lastName || '')
const email = ref(authStore.user?.email || '')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')


const updateProfile = async () => {
  try {
    // TODO: Wywołaj endpoint do aktualizacji danych
    alert('Dane zaktualizowane pomyślnie.')
  } catch (error) {
    alert('Błąd aktualizacji danych.')
  }
}

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Hasła nie są zgodne.')
    return
  }
  try {
    // TODO: Wywołaj endpoint zmiany hasła
    alert('Hasło zostało zmienione.')
  } catch (error) {
    alert('Błąd podczas zmiany hasła.')
  }
}

const deleteAccount = async () => {
  const confirmed = confirm('Czy na pewno chcesz usunąć konto? Tej operacji nie można cofnąć.')
  if (!confirmed) return

  try {
    // TODO: Wywołaj endpoint usuwania konta
    alert('Konto usunięte.')
    authStore.logout()
  } catch (error) {
    alert('Błąd podczas usuwania konta.')
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

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #1e293b;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
}

.btn-danger:hover {
  background-color: #b91c1c;
}
</style>
