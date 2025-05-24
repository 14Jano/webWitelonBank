<template>
  <div class="p-4">
    <h2 class="text-xl font-semibold mb-4">Twoje konta</h2>

    <div v-if="loading" class="text-gray-500">Ładowanie kont...</div>
    <div v-else-if="konta.length === 0" class="text-gray-500">Brak dostępnych kont.</div>

    <table v-else class="min-w-full bg-white border border-gray-200 rounded shadow">
      <thead>
      <tr class="bg-gray-100 text-left">
        <th class="px-4 py-2 border-b">Numer konta</th>
        <th class="px-4 py-2 border-b">Saldo</th>
        <th class="px-4 py-2 border-b">Waluta</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="konto in konta"
          :key="konto.id"
          @click="selectKonto(konto.id)"
          class="hover:bg-gray-50 cursor-pointer"
      >
        <td class="px-4 py-2 border-b">{{ konto.nr_konta }}</td>
        <td class="px-4 py-2 border-b">{{ konto.saldo }}</td>
        <td class="px-4 py-2 border-b">{{ konto.waluta }} PLN</td>
      </tr>
      </tbody>
    </table>

    <AccountDetails v-if="selectedKontoId" :konto-id="selectedKontoId" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import AccountDetails from './AccountDetails.vue'

const konta = ref([])
const loading = ref(true)
const selectedKontoId = ref(null)
const authStore = useAuthStore()

const selectKonto = (id) => {
  selectedKontoId.value = id
}

onMounted(async () => {
  try {
    const response = await axios.get('https://witelonapi.host358482.xce.pl/api/konta', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    konta.value = response.data
  } catch (error) {
    console.error('Błąd podczas pobierania kont:', error)
  } finally {
    loading.value = false
  }
})
</script>
