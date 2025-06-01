<template>
  <div class="p-6 space-y-6 max-w-4xl mx-auto">
    <section class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-4">Dodaj nowego odbiorcę</h2>
      <form @submit.prevent="dodajOdbiorce" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Nazwa zdefiniowana</label>
          <input v-model="nowy.nazwa" type="text" class="input" required />
        </div>
        <div>
          <label class="block mb-1">Numer konta odbiorcy</label>
          <input v-model="nowy.nr" type="text" class="input font-mono" required />
        </div>
        <div class="md:col-span-2">
          <label class="block mb-1">Rzeczywista nazwa odbiorcy</label>
          <input v-model="nowy.rzeczywista" type="text" class="input" required />
        </div>
        <div class="md:col-span-2 text-right">
          <button type="submit" class="btn-primary">Zapisz odbiorcę</button>
        </div>
      </form>
    </section>

    <section class="bg-white p-4 rounded shadow">
      <h2 class="text-lg font-semibold mb-4">Zapisani odbiorcy</h2>
      <div v-if="loading" class="text-gray-500">Ładowanie...</div>
      <div v-else-if="recipients.length === 0" class="text-gray-500">Brak zapisanych odbiorców.</div>
      <table v-else class="w-full table-auto border-collapse">
        <thead class="bg-gray-100">
        <tr>
          <th class="p-2 text-left">Nazwa</th>
          <th class="p-2 text-left">Nr konta</th>
          <th class="p-2 text-left">Rzeczywista nazwa</th>
          <th class="p-2 text-left">Dodano</th>
          <th class="p-2 text-left">Akcje</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="recipient in recipients" :key="recipient.id">
          <td>{{ recipient.nazwa_zdefiniowana }}</td>
          <td>{{ recipient.nr_konta }}</td>
          <td>{{ recipient.rzeczywista_nazwa }}</td>
          <td>{{ recipient.dodano }}</td>
          <td>
            <button @click="openEditModal(recipient)">Edytuj</button>
            <button @click="deleteRecipient(recipient.id)">Usuń</button>
          </td>
        </tr>
        </tbody>
      </table>
    </section>

    <div v-if="showEdit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Edytuj odbiorcę</h3>
        <form @submit.prevent="updateOdbiorce" class="space-y-4">
          <div>
            <label class="block mb-1">Nazwa zdefiniowana</label>
            <input v-model="editing.nazwa" type="text" class="input" required />
          </div>
          <div>
            <label class="block mb-1">Numer konta odbiorcy</label>
            <input v-model="editing.nr" type="text" class="input font-mono" required />
          </div>
          <div>
            <label class="block mb-1">Rzeczywista nazwa odbiorcy</label>
            <input v-model="editing.rzeczywista" type="text" class="input" required />
          </div>
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closeEditModal" class="btn-secondary">Anuluj</button>
            <button type="submit" class="btn-primary">Zapisz</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../store/auth'

interface Recipient {
  id: number
  id_uzytkownika: number
  nazwa_odbiorcy_zdefiniowana: string
  nr_konta_odbiorcy: string
  rzeczywista_nazwa_odbiorcy: string
  created_at: string
  updated_at: string
}

axios.defaults.baseURL = 'https://witelonapi.host358482.xce.pl'

const auth = useAuthStore()
const recipients = ref<Recipient[]>([])
const loading = ref(true)

const nowy = reactive({
  nazwa: '',
  nr: '',
  rzeczywista: ''
})

const editing = reactive({
  id: 0,
  nazwa: '',
  nr: '',
  rzeczywista: ''
})
const showEdit = ref(false)

function formatDate(d: string) {
  const dt = new Date(d)
  return isNaN(dt.getTime())
      ? d
      : dt.toLocaleDateString('pl-PL', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}

async function fetchRecipients() {
  loading.value = true
  try {
    const token = auth.token
    if (!token) throw new Error('Brak tokenu')
    const res = await axios.get('/api/zapisani-odbiorcy', {
      headers: { Authorization: `Bearer ${token}` }
    })
    console.log('Odpowiedź z API:', res.data)
    if (Array.isArray(res.data)) {
      recipients.value = res.data
    } else if (Array.isArray(res.data.data)) {
      recipients.value = res.data.data
    } else {
      recipients.value = []
    }
  } catch (err) {
    console.error('Błąd pobierania odbiorców:', err)
  } finally {
    loading.value = false
  }
}

async function dodajOdbiorce() {
  try {
    const userId = auth.user?.id
    if (!userId) throw new Error('Brak zalogowanego użytkownika')
    const payload = {
      id_uzytkownika: userId,
      nazwa_odbiorcy_zdefiniowana: nowy.nazwa,
      nr_konta_odbiorcy: nowy.nr,
      rzeczywista_nazwa_odbiorcy: nowy.rzeczywista
    }
    await axios.post('/api/zapisani-odbiorcy', payload, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    await fetchRecipients()
    nowy.nazwa = nowy.nr = nowy.rzeczywista = ''
  } catch (err) {
    console.error('Błąd przy dodawaniu odbiorcy:', err)
    alert('Nie udało się zapisać odbiorcy.')
  }
}

function openEditModal(r: Recipient) {
  editing.id = r.id
  editing.nazwa = r.nazwa_odbiorcy_zdefiniowana
  editing.nr = r.nr_konta_odbiorcy
  editing.rzeczywista = r.rzeczywista_nazwa_odbiorcy
  showEdit.value = true
}

function closeEditModal() {
  showEdit.value = false
}

async function updateOdbiorce() {
  try {
    await axios.put(`/api/zapisani-odbiorcy/${editing.id}`, {
      nazwa_odbiorcy_zdefiniowana: editing.nazwa,
      nr_konta_odbiorcy: editing.nr,
      rzeczywista_nazwa_odbiorcy: editing.rzeczywista
    }, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    await fetchRecipients()
    closeEditModal()
  } catch (err) {
    console.error('Błąd przy edycji odbiorcy:', err)
    alert('Nie udało się zaktualizować odbiorcy.')
  }
}

async function deleteRecipient(id: number) {
  if (!confirm('Na pewno usunąć tego odbiorcę?')) return
  try {
    await axios.delete(`/api/zapisani-odbiorcy/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    await fetchRecipients()
  } catch (err) {
    console.error('Błąd przy usuwaniu odbiorcy:', err)
    alert('Nie udało się usunąć odbiorcy.')
  }
}

onMounted(fetchRecipients)
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}
.btn-primary {
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
</style>
