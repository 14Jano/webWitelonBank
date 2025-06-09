<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold mb-6 text-gray-800">Historia transakcji</h2>

      <div class="flex flex-wrap items-center gap-4 mb-6">
        <div class="relative flex-grow">
          <input
              v-model="searchTerm"
              placeholder="Szukaj tytułu..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>

        <select v-model="filterType" class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">Wszystkie</option>
          <option value="incoming">Przychodzące</option>
          <option value="outgoing">Wychodzące</option>
        </select>

        <input type="date" v-model="dateFrom" class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="date" v-model="dateTo" class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <button @click="exportToPDF" class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
          <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Eksportuj do PDF
        </button>
      </div>

      <div v-if="loading" class="text-gray-600 text-center py-8">Ładowanie transakcji...</div>
      <div v-else-if="sortedAndFilteredTransactions.length === 0" class="text-gray-600 text-center py-8">Brak transakcji do wyświetlenia.</div>

      <div v-else class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('date')">
              Data
              <span v-if="sortColumn === 'date'">
                  <span v-if="sortDirection === 'asc'">&#9650;</span>
                  <span v-else>&#9660;</span>
                </span>
            </th>
            <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('title')">
              Tytuł
              <span v-if="sortColumn === 'title'">
                  <span v-if="sortDirection === 'asc'">&#9650;</span>
                  <span v-else>&#9660;</span>
                </span>
            </th>
            <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('amount')">
              Kwota
              <span v-if="sortColumn === 'amount'">
                  <span v-if="sortDirection === 'asc'">&#9650;</span>
                  <span v-else>&#9660;</span>
                </span>
            </th>
            <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                @click="sortBy('raw.typ')">
              Typ
              <span v-if="sortColumn === 'raw.typ'">
                  <span v-if="sortDirection === 'asc'">&#9650;</span>
                  <span v-else>&#9660;</span>
                </span>
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr
              v-for="tx in sortedAndFilteredTransactions"
              :key="tx.id"
              class="hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
              @click="openModal(tx)"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(tx.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tx.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                :class="{ 'text-green-600': tx.isIncoming, 'text-red-600': !tx.isIncoming }">
              <span>{{ Math.abs(tx.amount).toFixed(2) }}</span>
              <span class="ml-1 text-xs text-gray-500">{{ tx.currency }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              {{ tx.raw.typ }}
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
          <h3 class="text-xl font-bold mb-5 text-gray-800">Szczegóły transakcji</h3>
          <ul class="space-y-3 text-sm text-gray-700">
            <li><strong>Data zlecenia:</strong> {{ formatDate(selectedTx.dateCreated) }}</li>
            <li><strong>Data realizacji:</strong> {{ formatDate(selectedTx.date) }}</li>
            <li><strong>Tytuł:</strong> <span class="font-medium">{{ selectedTx.title }}</span></li>
            <li><strong>Kwota:</strong> <span class="font-semibold" :class="{ }">{{ selectedTx.amount.toFixed(2) }} {{ selectedTx.currency }}</span></li>
            <li><strong>Typ transakcji:</strong> <span class="font-medium">{{ selectedTx.raw.typ }}</span></li>
            <li><strong>Status:</strong> <span class="font-medium text-blue-600">{{ selectedTx.raw.status }}</span></li>
            <li><strong>Nr konta nadawcy:</strong> <span class="font-mono">{{ selectedTx.raw.nr_konta_nadawcy }}</span></li>
            <li><strong>Nr konta odbiorcy:</strong> <span class="font-mono">{{ selectedTx.raw.nr_konta_odbiorcy }}</span></li>
            <li><strong>Nazwa odbiorcy:</strong> {{ selectedTx.raw.nazwa_odbiorcy }}</li>
            <li><strong>Adres odbiorcy:</strong><br>
              {{ selectedTx.raw.adres_odbiorcy_linia1 }}<br>
              {{ selectedTx.raw.adres_odbiorcy_linia2 }}
            </li>
            <li v-if="selectedTx.raw.informacja_zwrotna"><strong>Informacja zwrotna:</strong> <span class="italic">{{ selectedTx.raw.informacja_zwrotna }}</span></li>
          </ul>
          <button
              @click="closeModal"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
              aria-label="Zamknij">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'

axios.defaults.baseURL = 'https://witelonapi.host358482.xce.pl'

interface RawTx {
  id: number
  typ: string
  id_konta_nadawcy: number
  nr_konta_nadawcy: string
  nr_konta_odbiorcy: string
  nazwa_odbiorcy: string
  adres_odbiorcy_linia1: string
  adres_odbiorcy_linia2: string
  tytul: string
  kwota: number
  waluta: string
  waluta_przelewu?: string
  status: string
  data_zlecenia: string
  data_realizacji: string
  informacja_zwrotna?: string
  utworzono: string
}

type Tx = {
  id: number
  date: string
  dateCreated: string
  title: string
  amount: number
  currency: string
  isIncoming: boolean
  raw: RawTx
}

const auth = useAuthStore()
const transactions = ref<Tx[]>([])
const loading = ref(true)
const showModal = ref(false)
const selectedTx = ref<Tx>({
  id: 0,
  date: '',
  dateCreated: '',
  title: '',
  amount: 0,
  currency: '',
  isIncoming: true,
  raw: {} as RawTx
})

const searchTerm = ref('')
const filterType = ref('all')
const dateFrom = ref('')
const dateTo = ref('')

const sortColumn = ref<keyof Tx | `raw.${keyof RawTx}` | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const filteredTransactions = computed(() => {
  return transactions.value.filter(tx => {
    const matchSearch = tx.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchType =
        filterType.value === 'all' ||
        (filterType.value === 'incoming' && tx.isIncoming) ||
        (filterType.value === 'outgoing' && !tx.isIncoming)
    const txDate = new Date(tx.date)
    const from = dateFrom.value ? new Date(dateFrom.value) : null
    const to = dateTo.value ? new Date(dateTo.value) : null
    const matchDate =
        (!from || txDate >= from) && (!to || txDate <= to)

    return matchSearch && matchType && matchDate
  })
})

const sortedAndFilteredTransactions = computed(() => {
  const sorted = [...filteredTransactions.value]

  if (sortColumn.value) {
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortColumn.value!.startsWith('raw.')) {
        const rawKey = sortColumn.value!.split('.')[1] as keyof RawTx;
        aValue = a.raw[rawKey];
        bValue = b.raw[rawKey];
      } else {
        aValue = a[sortColumn.value as keyof Tx];
        bValue = b[sortColumn.value as keyof Tx];
      }

      let comparison = 0
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        comparison = (aValue === bValue) ? 0 : (aValue ? 1 : -1)
      }
      if (sortColumn.value === 'date' && aValue && bValue) {
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      }


      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }
  return sorted
})

function sortBy(column: keyof Tx | `raw.${keyof RawTx}`) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

async function fetchTransactions() {
  loading.value = true
  try {
    const token = auth.token
    if (!token) throw new Error('Brak tokenu')

    const kontaRes = await axios.get('/api/konta', { headers: { Authorization: `Bearer ${token}` } })
    const accounts = Array.isArray(kontaRes.data) ? kontaRes.data : kontaRes.data.data || []
    if (!accounts.length) return
    const accountId = accounts[0].id
    const userAccountNumber = accounts[0].nr_rachunku;

    const resp = await axios.get(`/api/konta/${accountId}/przelewy`, { headers: { Authorization: `Bearer ${token}` } })
    const raw: RawTx[] = Array.isArray(resp.data) ? resp.data : resp.data.data || resp.data.przelewy || []

    transactions.value = raw.map(tx => ({
      id: tx.id,
      date: tx.data_realizacji,
      dateCreated: tx.data_zlecenia,
      title: tx.tytul,
      amount: tx.kwota,
      currency: tx.waluta,
      isIncoming: tx.nr_konta_odbiorcy === userAccountNumber,
      raw: tx
    }))
  } catch (e) {
    console.error('Błąd pobierania transakcji:', e)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function openModal(tx: Tx) {
  selectedTx.value = tx
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function exportToPDF() {
  try {
    const token = auth.token
    if (!token) throw new Error('Brak tokenu')

    const kontaRes = await axios.get('/api/konta', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const accounts = Array.isArray(kontaRes.data) ? kontaRes.data : kontaRes.data.data || []
    if (!accounts.length) throw new Error('Brak kont użytkownika')

    const accountId = accounts[0].id

    const response = await axios.get(`/api/konta/${accountId}/przelewy/export`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `historia_transakcji_konto_${accountId}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Błąd podczas eksportu PDF:', e)
    alert('Nie udało się pobrać pliku PDF z serwera.')
  }
}

onMounted(fetchTransactions)
</script>

<style scoped>
</style>
