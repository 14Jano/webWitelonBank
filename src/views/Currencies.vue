<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Kursy walut</h1>
    <table class="w-full table-auto border">
      <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2 border">Waluta</th>
        <th class="px-4 py-2 border">Kupno</th>
        <th class="px-4 py-2 border">Sprzedaż</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="rate in rates" :key="rate.code">
        <td class="px-4 py-2 border">{{ rate.currency }} ({{ rate.code }})</td>
        <td class="px-4 py-2 border">{{ rate.bid }}</td>
        <td class="px-4 py-2 border">{{ rate.ask }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const rates = ref([]);

onMounted(async () => {
  const res = await fetch('https://api.nbp.pl/api/exchangerates/tables/C?format=json');
  const data = await res.json();
  rates.value = data[0].rates;
});
</script>
