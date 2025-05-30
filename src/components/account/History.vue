<template>
  <div class="p-4 space-y-6">
    <h2 class="text-xl font-bold">Historia transakcji</h2>

    <div class="flex flex-wrap gap-4 items-center mb-4">
      <input v-model="searchTerm" placeholder="Szukaj tytułu..." class="border p-2 rounded" />
      <select v-model="filterType" class="border p-2 rounded">
        <option value="all">Wszystkie</option>
        <option value="incoming">Przychodzące</option>
        <option value="outgoing">Wychodzące</option>
      </select>
      <input type="date" v-model="dateFrom" class="border p-2 rounded" />
      <input type="date" v-model="dateTo" class="border p-2 rounded" />
      <button @click="exportToPDF" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Eksportuj PDF
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">Ładowanie transakcji...</div>
    <div v-else-if="transactions.length === 0" class="text-gray-500">Brak transakcji do wyświetlenia.</div>

    <table v-else class="min-w-full bg-white rounded shadow">
      <thead class="bg-gray-100">
      <tr>
        <th class="text-left p-2">Data</th>
        <th class="text-left p-2">Tytuł</th>
        <th class="text-left p-2">Kwota</th>
        <th class="text-left p-2">Typ</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="tx in transactions"
          :key="tx.id"
          class="border-t hover:bg-gray-50 cursor-pointer"
          @click="openModal(tx)"
      >
        <td class="p-2">{{ formatDate(tx.date) }}</td>
        <td class="p-2">{{ tx.title }}</td>
        <td
            class="p-2 font-semibold"
            :class="tx.isIncoming"
        >
          <span>{{ Math.abs(tx.amount).toFixed(2) }}</span>
          <span class="ml-1 text-sm text-gray-500">{{ tx.currency }}</span>
        </td>
        <td class="p-2 font-medium" :class="tx.isIncoming">
          {{ tx.raw.typ }}
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative overflow-y-auto max-h-[90vh]">
        <h3 class="text-lg font-semibold mb-4">Szczegóły transakcji</h3>
        <ul class="space-y-2 text-sm">
          <li><strong>ID Transakcji:</strong> {{ selectedTx.id }}</li>
          <li><strong>Data zlecenia:</strong> {{ formatDate(selectedTx.dateCreated) }}</li>
          <li><strong>Data realizacji:</strong> {{ formatDate(selectedTx.date) }}</li>
          <li><strong>Tytuł:</strong> {{ selectedTx.title }}</li>
          <li><strong>Kwota:</strong> {{ selectedTx.amount.toFixed(2) }} {{ selectedTx.currency }}</li>
          <li><strong>Typ transakcji:</strong> {{ selectedTx.raw.typ }}</li>
          <li><strong>Status:</strong> {{ selectedTx.raw.status }}</li>
          <li><strong>Nr konta nadawcy:</strong> {{ selectedTx.raw.nr_konta_nadawcy }}</li>
          <li><strong>Nr konta odbiorcy:</strong> {{ selectedTx.raw.nr_konta_odbiorcy }}</li>
          <li><strong>Nazwa odbiorcy:</strong> {{ selectedTx.raw.nazwa_odbiorcy }}</li>
          <li><strong>Adres odbiorcy:</strong><br>
            {{ selectedTx.raw.adres_odbiorcy_linia1 }}<br>
            {{ selectedTx.raw.adres_odbiorcy_linia2 }}
          </li>
          <li v-if="selectedTx.raw.informacja_zwrotna"><strong>Informacja zwrotna:</strong> {{ selectedTx.raw.informacja_zwrotna }}</li>
          <li><strong>Utworzono:</strong> {{ formatDate(selectedTx.raw.utworzono) }}</li>
        </ul>
        <button
            @click="closeModal"
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../store/auth'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

const searchTerm = ref('') // ✅ Nowe
const filterType = ref('all') // ✅ Nowe: all/incoming/outgoing
const dateFrom = ref('')
const dateTo = ref('')

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

async function fetchTransactions() {
  loading.value = true
  try {
    const token = auth.token
    if (!token) throw new Error('Brak tokenu')

    const kontaRes = await axios.get('/api/konta', { headers: { Authorization: `Bearer ${token}` } })
    const accounts = Array.isArray(kontaRes.data) ? kontaRes.data : kontaRes.data.data || []
    if (!accounts.length) return
    const accountId = accounts[0].id

    const resp = await axios.get(`/api/konta/${accountId}/przelewy`, { headers: { Authorization: `Bearer ${token}` } })
    const raw: RawTx[] = Array.isArray(resp.data) ? resp.data : resp.data.data || resp.data.przelewy || []

    transactions.value = raw.map(tx => ({
      id: tx.id,
      date: tx.data_realizacji,
      dateCreated: tx.data_zlecenia,
      title: tx.tytul,
      amount: tx.kwota,
      currency: tx.waluta,
      isIncoming: tx.nr_konta_odbiorcy === accounts[0].nr_rachunku,
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

// ✅ Eksport do PDF
function exportToPDF() {
  const doc = new jsPDF()
  doc.text('Historia transakcji', 14, 15)

  const rows = filteredTransactions.value.map(tx => [
    formatDate(tx.date),
    tx.title,
    `${tx.amount.toFixed(2)} ${tx.currency}`,
    tx.isIncoming ? 'Przychodząca' : 'Wychodząca'
  ])

  autoTable(doc, {
    startY: 20,
    head: [['Data', 'Tytuł', 'Kwota', 'Typ']],
    body: rows
  })

  // ✅ Dodaj podsumowanie
  const incomingSum = filteredTransactions.value
      .filter(tx => tx.isIncoming)
      .reduce((sum, tx) => sum + tx.amount, 0)

  const outgoingSum = filteredTransactions.value
      .filter(tx => !tx.isIncoming)
      .reduce((sum, tx) => sum + tx.amount, 0)

  doc.text(`Suma przychodzących: ${incomingSum.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10)
  doc.text(`Suma wychodzących: ${outgoingSum.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20)

  doc.save('historia_transakcji.pdf')
}

onMounted(fetchTransactions)
</script>


<style scoped>
table th,
table td {
  text-align: left;
  padding: 0.5rem;
}
</style>
