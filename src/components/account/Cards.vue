<template>
  <div class="space-y-8">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">Twoje karty płatnicze</h2>
      <button @click="showAddCard = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        + Dodaj kartę
      </button>
    </div>

    <div v-if="cards.length === 0" class="text-gray-500">Brak zapisanych kart.</div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="card in cards" :key="card.id" class="rounded-xl p-5 text-white shadow-lg relative" :class="card.bg">
        <div class="flex justify-between items-center mb-4">
          <div>
            <p class="text-lg font-semibold">{{ card.bankName }}</p>
            <p class="text-sm opacity-75">{{ cardType(card.number) }}</p>
          </div>
          <img :src="cardLogo(card.number)" alt="Card type" class="w-10 h-10" />
        </div>

        <div class="font-mono tracking-widest text-xl mb-2">{{ maskCardNumber(card.number) }}</div>
        <div class="text-sm flex justify-between">
          <span>Ważna do: {{ card.expiry }}</span>
          <span>CVV: ***</span>
        </div>
        <div class="mt-4 text-sm">Właściciel: {{ card.owner }}</div>

        <button @click="removeCard(card.id)" class="absolute top-3 right-3 text-sm text-white/80 hover:text-red-300 transition">
          ✕
        </button>
      </div>
    </div>

    <div v-if="showAddCard" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-semibold mb-4">Dodaj nową kartę</h3>
        <div class="space-y-3">
          <input v-model="newCard.bankName" placeholder="Nazwa banku" class="input" />
          <input v-model="newCard.number" placeholder="Numer karty" class="input" />
          <input v-model="newCard.expiry" placeholder="MM/RR" class="input" />
          <input v-model="newCard.owner" placeholder="Imię i nazwisko właściciela" class="input" />
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button @click="showAddCard = false" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Anuluj</button>
          <button @click="addCard" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Zapisz</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Card = {
  id: number
  number: string
  expiry: string
  owner: string
  bankName: string
  bg?: string
}

const cards = ref<Card[]>([
  {
    id: 1,
    number: '1234123412341234',
    expiry: '12/26',
    owner: 'Jan Kowalski',
    bankName: 'Bank Nowoczesny',
    bg: 'bg-gradient-to-r from-blue-700 to-blue-500'
  }
])

const showAddCard = ref(false)
const newCard = ref<Card>({
  id: 0,
  number: '',
  expiry: '',
  owner: '',
  bankName: '',
  bg: 'bg-gradient-to-r from-gray-600 to-gray-400'
})

function maskCardNumber(number: string): string {
  return number.replace(/\d{12}(\d{4})/, '**** **** **** $1')
}

function cardType(number: string) {
  if (/^4/.test(number)) return 'Visa'
  if (/^5[1-5]/.test(number)) return 'Mastercard'
  return 'Nieznany typ'
}

function cardLogo(number: string): string {
  if (/^4/.test(number)) return 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png'
  if (/^5[1-5]/.test(number)) return 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png'
  return 'https://img.favpng.com/3/23/12/credit-card-font-awesome-bank-debit-card-png-favpng-6SytA4rRMLv886APfxKbWGJKY.jpg'
}

function addCard() {
  if (!newCard.value.number || !newCard.value.expiry || !newCard.value.owner || !newCard.value.bankName) return

  const id = Date.now()
  const bg = generateGradient()
  cards.value.push({ ...newCard.value, id, bg })
  newCard.value = { id: 0, number: '', expiry: '', owner: '', bankName: '', bg: '' }
  showAddCard.value = false
}

function removeCard(id: number) {
  cards.value = cards.value.filter(c => c.id !== id)
}

function generateGradient(): string {
  const gradients = [
    'bg-gradient-to-r from-indigo-600 to-purple-500',
    'bg-gradient-to-r from-green-500 to-teal-400',
    'bg-gradient-to-r from-pink-500 to-red-400',
    'bg-gradient-to-r from-gray-700 to-gray-500',
    'bg-gradient-to-r from-blue-800 to-blue-600',
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: #2563eb;
}
</style>
