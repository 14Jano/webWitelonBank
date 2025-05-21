<template>
  <div class="space-y-6">
    <div class="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-600">Twoje saldo</h2>
        <p class="text-3xl font-bold text-green-600">
          {{ formattedBalance }} PLN
        </p>
      </div>
      <div>

        <button
            @click="exportToCSV"
            class="flex items-center gap-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        >
          <ArrowDownToLine class="w-5 h-5" />
          Eksportuj do CSV
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow p-4 flex flex-wrap items-center gap-4">
      <div class="flex gap-2 items-center">
        <label class="text-sm text-gray-600">Data od:</label>
        <input type="date" v-model="dateFrom" class="input" />
      </div>
      <div class="flex gap-2 items-center">
        <label class="text-sm text-gray-600">Data do:</label>
        <input type="date" v-model="dateTo" class="input" />
      </div>
      <div class="flex-1">
        <input v-model="searchQuery" type="text" placeholder="Szukaj transakcji..."
               class="input w-full" />
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow overflow-x-auto">
      <table class="min-w-full">
        <thead>
        <tr class="bg-gray-100 text-left">
          <th v-for="column in columns" :key="column.key"
              @click="sortBy(column.key)"
              class="px-4 py-2 cursor-pointer select-none">
            <div class="flex items-center gap-1">
              {{ column.label }}
              <ChevronUp v-if="sortColumn === column.key && sortOrder === 'asc'" class="w-4 h-4" />
              <ChevronDown v-if="sortColumn === column.key && sortOrder === 'desc'" class="w-4 h-4" />
            </div>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="tx in filteredTransactions" :key="tx.id" class="border-t hover:bg-gray-50">
          <td class="px-4 py-2">{{ formatDate(tx.date) }}</td>
          <td class="px-4 py-2 flex items-center gap-2">
            <Banknote v-if="tx.type === 'debit'" class="text-red-500 w-4 h-4" />
            <ArrowDownCircle v-else class="text-green-500 w-4 h-4" />
            {{ tx.title }}
          </td>
          <td class="px-4 py-2">{{ tx.amount.toFixed(2) }} PLN</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Banknote, ArrowDownCircle, ChevronUp, ChevronDown, ArrowDownToLine } from 'lucide-vue-next'
import { useAuthStore } from '../../store/auth.ts'

const auth = useAuthStore()

const transactions = ref([
  { id: 1, date: '2025-05-14', type: 'credit', title: 'Wpłata wynagrodzenia', amount: 3200 },
  { id: 2, date: '2025-05-13', type: 'debit', title: 'Zakupy Biedronka', amount: -156.77 },
  { id: 3, date: '2025-05-11', type: 'debit', title: 'Abonament Spotify', amount: -19.99 },
])

const balance = computed(() => {
  return transactions.value.reduce((sum, t) => sum + t.amount, 0)
})

const formattedBalance = computed(() => balance.value.toFixed(2))

const dateFrom = ref('')
const dateTo = ref('')
const searchQuery = ref('')
const sortColumn = ref('date')
const sortOrder = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'date', label: 'Data' },
  { key: 'title', label: 'Tytuł' },
  { key: 'amount', label: 'Kwota' },
]

function sortBy(column: string) {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

const filteredTransactions = computed(() => {
  return [...transactions.value]
      .filter(t => {
        if (dateFrom.value && t.date < dateFrom.value) return false
        if (dateTo.value && t.date > dateTo.value) return false
        if (searchQuery.value && !t.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        const valA = a[sortColumn.value as keyof typeof a]
        const valB = b[sortColumn.value as keyof typeof b]
        return sortOrder.value === 'asc'
            ? valA > valB ? 1 : -1
            : valA < valB ? 1 : -1
      })
})

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pl-PL')
}

function exportToCSV() {
  const rows = [
    ['Data', 'Tytuł', 'Kwota'],
    ...filteredTransactions.value.map(tx => [tx.date, tx.title, tx.amount.toFixed(2)])
  ]
  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', 'historia_transakcji.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 0.875rem;
}
</style>
