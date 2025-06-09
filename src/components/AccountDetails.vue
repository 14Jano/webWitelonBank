<template>
  <div class="mt-6 p-4 border border-gray-200 rounded shadow bg-gray-50">
    <h3 class="text-lg font-semibold mb-4">Szczegóły konta</h3>

    <div v-if="loading" class="text-gray-500">Ładowanie danych konta...</div>

    <div v-else-if="konto">
      <p><strong>Numer konta:</strong> {{ konto.nr_konta }}</p>
      <p><strong>Saldo:</strong> {{ konto.saldo }} PLN</p>
      <p><strong>Limit przelewu:</strong> {{ konto.limit_przelewu }} PLN</p>
      <p><strong>Status:</strong>
        <span :class="konto.zablokowane ? 'text-red-600' : 'text-green-600'">
          {{ konto.zablokowane ? ' Zablokowane' : ' Aktywne' }}
        </span>
      </p>
    </div>

    <div v-else class="text-red-500">Nie udało się pobrać danych konta.</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const props = defineProps({
  kontoId: {
    type: Number,
    required: true
  }
})

const konto = ref(null)
const loading = ref(true)
const authStore = useAuthStore()

const fetchKontoDetails = async () => {
  if (!props.kontoId) return
  loading.value = true
  konto.value = null

  try {
    const response = await axios.get(`https://witelonapi.host358482.xce.pl/api/konta/${props.kontoId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    konto.value = response.data
    console.log('Dane konta:', konto.value)
  } catch (error) {
    console.error('Błąd pobierania danych konta:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchKontoDetails)
watch(() => props.kontoId, fetchKontoDetails)
</script>
