<template>
  <div class="max-w-xl mx-auto space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">Nowy przelew</h2>

    <form @submit.prevent="sendTransfer" class="space-y-4">
      <div class="flex items-center gap-2">
        <input type="checkbox" id="useSaved" v-model="useSavedRecipient" />
        <label for="useSaved" class="font-medium">Użyj zapisanego odbiorcy</label>
      </div>

      <div v-if="useSavedRecipient">
        <label class="block font-medium mb-1">Wybierz odbiorcę</label>
        <select v-model="selectedRecipientId" @change="fillRecipientData" class="input">
          <option value="">-- wybierz --</option>
          <option v-for="recipient in recipients" :key="recipient.id" :value="recipient.id">
            {{ recipient.name }} – {{ maskAccount(recipient.accountNumber) }}
          </option>
        </select>
      </div>

      <div>
        <label class="block font-medium mb-1">Imię i nazwisko odbiorcy</label>
        <input v-model="form.receiverName" class="input" required :disabled="useSavedRecipient" />
      </div>

      <div>
        <label class="block font-medium mb-1">Numer konta odbiorcy</label>
        <input
            v-model="form.accountNumber"
            class="input"
            required
            pattern="\d{26}"
            :disabled="useSavedRecipient"
        />
        <p v-if="form.accountNumber && !/^\d{26}$/.test(form.accountNumber)" class="text-sm text-red-500">
          Numer konta powinien mieć 26 cyfr.
        </p>
      </div>

      <div>
        <label class="block font-medium mb-1">Kwota</label>
        <input v-model.number="form.amount" type="number" step="0.01" class="input" required />
      </div>

      <div>
        <label class="block font-medium mb-1">Tytuł przelewu</label>
        <input v-model="form.title" class="input" required />
      </div>

      <div>
        <label class="block font-medium mb-1">Data przelewu</label>
        <input v-model="form.date" type="date" class="input" />
      </div>

      <div class="flex items-center gap-2">
        <input type="checkbox" id="saveRecipient" v-model="saveRecipient" />
        <label for="saveRecipient" class="text-sm">Zapisz tego odbiorcę do listy zapisanych</label>
      </div>

      <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
        Wyślij przelew
      </button>
    </form>

    <p v-if="success" class="text-green-600 font-medium mt-4">Przelew został wysłany pomyślnie!</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Recipient = {
  id: number
  name: string
  accountNumber: string
}

const saveRecipient = ref(false)


const recipients = ref<Recipient[]>([
  { id: 1, name: 'Jan Nowak', accountNumber: '12345678901234567890123456' },
  { id: 2, name: 'Anna Kowalska', accountNumber: '11112222333344445555666677' },
])

const selectedRecipientId = ref<number | ''>('')
const useSavedRecipient = ref(false)

const form = ref({
  receiverName: '',
  accountNumber: '',
  amount: 0,
  title: '',
  date: '',
})

const success = ref(false)

function fillRecipientData() {
  const recipient = recipients.value.find(r => r.id === selectedRecipientId.value)
  if (recipient) {
    form.value.receiverName = recipient.name
    form.value.accountNumber = recipient.accountNumber
  }
}

function sendTransfer() {
  if (!form.value.receiverName || !form.value.accountNumber || !form.value.amount || !form.value.title) {
    alert('Uzupełnij wszystkie wymagane pola.')
    return
  }
  if (saveRecipient.value) {
    const exists = recipients.value.some(r =>
        r.name === form.value.receiverName &&
        r.accountNumber === form.value.accountNumber
    )
    if (!exists) {
      const newId = Date.now()
      recipients.value.push({
        id: newId,
        name: form.value.receiverName,
        accountNumber: form.value.accountNumber
      })
    }
  }

  console.log('Wysyłanie przelewu:', form.value)

  success.value = true
  setTimeout(() => {
    success.value = false
    form.value = { receiverName: '', accountNumber: '', amount: 0, title: '', date: '' }
    selectedRecipientId.value = ''
    saveRecipient.value = false
  }, 3000)
}

function maskAccount(account: string): string {
  return '••••••' + account.slice(-4)
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
