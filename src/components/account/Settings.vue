<template>
  <div class="max-w-2xl mx-auto p-6 space-y-8 bg-gray-50 rounded-lg shadow-lg">
    <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-6">Ustawienia Konta</h2>

    <div class="flex justify-center">
      <button
          class="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
          @click="goToResetPassword"
      >
        Resetowanie hasła
      </button>
    </div>

    <section class="bg-white p-8 rounded-xl shadow-lg border border-red-400">
      <p class="mb-6 text-gray-700 leading-relaxed text-center">
        Jeśli chcesz zamknąć konto, kliknij przycisk poniżej. Możesz to zrobić tylko, jeśli saldo konta wynosi <span class="font-bold text-red-600">0 zł</span>.
      </p>
      <div class="flex justify-center">
        <button
            @click="zamknijKonto"
            class="w-full sm:w-auto px-8 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
            :disabled="loading"
        >
          {{ loading ? 'Przetwarzanie...' : 'Zgłoś zamknięcie konta' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../store/auth.ts'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()


const konto = computed(() => authStore.user?.konta?.[0])
const kontoId = computed(() => konto.value?.id)
console.log('Zalogowany użytkownik:', authStore.user)
console.log('Lista kont:', authStore.user?.konta)
console.log('kontoId:', kontoId.value)


const loading = ref(false)

const goToResetPassword = () => {
  router.push('/reset-password')
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
</style>
