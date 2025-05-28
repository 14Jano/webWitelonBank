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
      <p class="mb-4">
        Jeśli chcesz zamknąć konto, kliknij przycisk poniżej. Możesz to zrobić tylko, jeśli saldo konta wynosi 0 zł.
      </p>
      <button
          @click="zamknijKonto"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          :disabled="loading"
      >
        {{ loading ? 'Przetwarzanie...' : 'Zgłoś zamknięcie konta' }}
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref(authStore.user?.firstName || '')
const lastName = ref(authStore.user?.lastName || '')
const email = ref(authStore.user?.email || '')

const konto = computed(() => authStore.user?.konta?.[0])
const kontoId = computed(() => konto.value?.id)
console.log('Zalogowany użytkownik:', authStore.user)
console.log('Lista kont:', authStore.user?.konta)
console.log('kontoId:', kontoId.value)


const loading = ref(false)

const goToResetPassword = () => {
  router.push('/reset-password')
}

const updateProfile = async () => {
  try {
    alert('Dane zaktualizowane pomyślnie.')
  } catch (error) {
    alert('Błąd aktualizacji danych.')
  }
}

const zamknijKonto = async () => {
  if (!kontoId.value) {
    alert('Nie znaleziono informacji o koncie.')
    return
  }

  loading.value = true

  try {
    const response = await axios.post(
        `https://witelonapi.host358482.xce.pl/api/konta/${kontoId.value}/zglos-zamkniecie`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        }
    )

    alert('Wysłano email z linkiem potwierdzającym zamknięcie konta.')
    console.log(response.data)
  } catch (error: any) {
    const status = error.response?.status
    const msg = error.response?.data?.message

    if (status === 403) {
      alert('Nie masz uprawnień do tego konta.')
    } else if (status === 404) {
      alert('Konto nie zostało znalezione.')
    } else if (status === 409) {
      alert('Nie można zamknąć konta: saldo musi wynosić 0 zł lub konto już zostało zablokowane.')
    } else if (status === 500) {
      alert('Wystąpił błąd przy wysyłaniu wiadomości email.')
    } else {
      alert(msg || 'Nieznany błąd podczas zamykania konta.')
    }

    console.error('Błąd:', status, msg)
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

.btn-primary:hover {
  background-color: #1d4ed8;
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
