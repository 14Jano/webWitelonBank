<template>
  <div class="dashboard">
    <h2>💰 Twoje konto</h2>
    <p>Saldo: <strong>{{ balance }} PLN</strong></p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const balance = ref<number>(0)

onMounted(async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + '/account/balance')
    balance.value = res.data.balance
  } catch (e) {
    console.error('Nie udało się pobrać salda')
  }
})
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
</style>
