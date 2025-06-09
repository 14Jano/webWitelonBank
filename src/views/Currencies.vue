<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center text-blue-800 mb-4">{{$t('currencies')}}</h1>
    <p class="text-center text-sm text-gray-500 mb-6">{{$t('update')}}: {{ lastUpdated || 'Ładowanie...' }}</p>

    <div class="overflow-x-auto rounded-xl shadow-lg bg-white">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-blue-50">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider">{{ $t('currency') }}</th>
          <th @click="sortBy('bid')" class="px-6 py-3 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider cursor-pointer">
            {{ $t('purchase') }}
            <span v-if="sortKey === 'bid'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th @click="sortBy('ask')" class="px-6 py-3 text-left text-sm font-semibold text-blue-800 uppercase tracking-wider cursor-pointer">
            {{ $t('sale') }}
            <span v-if="sortKey === 'ask'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
        </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
        <tr v-for="rate in sortedRates" :key="rate.code" class="hover:bg-blue-50 transition">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex items-center gap-3">
            <img :src="getFlagUrl(rate.code)" :alt="rate.code" class="w-6 h-4 object-cover rounded shadow-sm border"/>
            {{ rate.currency }}
            <span class="text-gray-500 text-xs">({{ rate.code }})</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
            {{ rate.bid.toFixed(4) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
            {{ rate.ask.toFixed(4) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const rates = ref([])
const lastUpdated = ref(null)
const sortKey = ref(null)
const sortAsc = ref(true)

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedRates = computed(() => {
  if (!sortKey.value) return rates.value
  return [...rates.value].sort((a, b) => {
    const valA = a[sortKey.value]
    const valB = b[sortKey.value]
    return sortAsc.value ? valA - valB : valB - valA
  })
})

const getFlagUrl = (code) => {
  const mapping = {
    EUR: 'eu',
    USD: 'us',
    GBP: 'gb',
    CHF: 'ch',
    JPY: 'jp',
    CNY: 'cn',
    NOK: 'no',
    SEK: 'se',
    DKK: 'dk',
    CAD: 'ca',
    AUD: 'au',
    CZK: 'cz',
    HUF: 'hu',
    PLN: 'pl'
  }
  const countryCode = mapping[code] || code.slice(0, 2).toLowerCase()
  return `https://flagcdn.com/w40/${countryCode}.png`
}

onMounted(async () => {
  try {
    const res = await fetch('https://api.nbp.pl/api/exchangerates/tables/C?format=json')
    const data = await res.json()
    rates.value = data[0].rates
    lastUpdated.value = data[0].effectiveDate
  } catch (err) {
    console.error('Błąd podczas pobierania kursów walut:', err)
  }
})
</script>
