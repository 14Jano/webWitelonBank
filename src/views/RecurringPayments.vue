<template>
  <div class="p-6">
    <h2 class="text-2xl font-semibold mb-4">Zlecenia stałe</h2>

    <div v-if="zlecenia.length > 0" class="space-y-4">
      <div
          v-for="zlecenie in zlecenia"
          :key="zlecenie.id"
          class="border p-4 rounded shadow-sm bg-white"
      >
        <p><strong>Odbiorca:</strong> {{ zlecenie.nazwa_odbiorcy }}</p>
        <p><strong>Kwota:</strong> {{ zlecenie.kwota }} PLN</p>
        <p><strong>Częstotliwość:</strong> {{ zlecenie.czestotliwosc }}</p>
        <p><strong>Data startu:</strong> {{ zlecenie.data_startu }}</p>
        <p><strong>Data zakończenia:</strong> {{ zlecenie.data_zakonczenia }}</p>
        <p>
          <strong>Status:</strong>
          <span :class="zlecenie.aktywne ? 'text-green-600' : 'text-gray-500'">
            {{ zlecenie.aktywne ? 'Aktywne' : 'Nieaktywne' }}
          </span>
        </p>
        <div class="mt-2 flex gap-2">
          <button
              @click="pokazSzczegolyZlecenia(zlecenie.id)"
              class="text-sm text-blue-600 hover:underline"
          >
            Szczegóły
          </button>
          <button
              @click="edytujZlecenie(zlecenie)"
              class="text-sm text-yellow-600 hover:underline"
          >
            Edytuj
          </button>
          <button
              @click="usunZlecenie(zlecenie.id)"
              class="text-sm text-red-600 hover:underline"
          >
            Usuń
          </button>

        </div>
      </div>
    </div>
    <p v-else class="text-gray-500">Brak aktywnych zleceń stałych.</p>

    <div
        v-if="szczegolyZlecenia"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
            @click="szczegolyZlecenia = null"
            class="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          &times;
        </button>
        <h3 class="text-lg font-semibold mb-4">Szczegóły zlecenia stałego</h3>
        <p><strong>Odbiorca:</strong> {{ szczegolyZlecenia.nazwa_odbiorcy }}</p>
        <p><strong>Numer konta docelowego:</strong> {{ szczegolyZlecenia.nr_konta_docelowego }}</p>
        <p><strong>Tytuł przelewu:</strong> {{ szczegolyZlecenia.tytul_przelewu }}</p>
        <p><strong>Kwota:</strong> {{ szczegolyZlecenia.kwota }} PLN</p>
        <p><strong>Częstotliwość:</strong> {{ szczegolyZlecenia.czestotliwosc }}</p>
        <p><strong>Data startu:</strong> {{ szczegolyZlecenia.data_startu }}</p>
        <p><strong>Data zakończenia:</strong> {{ szczegolyZlecenia.data_zakonczenia }}</p>
        <p>
          <strong>Status:</strong>
          <span :class="szczegolyZlecenia.aktywne ? 'text-green-600' : 'text-gray-500'">
            {{ szczegolyZlecenia.aktywne ? 'Aktywne' : 'Nieaktywne' }}
          </span>
        </p>
      </div>
    </div>

    <!-- Przycisk: pokaż formularz -->
    <div class="mt-6">
      <button
          @click="showForm = !showForm"
          class="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {{ showForm ? 'Anuluj' : 'Dodaj zlecenie stałe' }}
      </button>
    </div>

    <!-- Formularz -->
    <div v-if="showForm" class="mt-8 border-t pt-6 max-w-xl">
      <h3 class="text-lg font-semibold mb-4">Nowe zlecenie stałe</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label>Konto źródłowe</label>
          <select v-model="form.id_konta_zrodlowego" class="input" required>
            <option disabled value="">Wybierz konto</option>
            <option
                v-for="konto in kontaUzytkownika"
                :key="konto.id"
                :value="konto.id"
            >
              {{ konto.numer_konta }} ({{ konto.saldo }} PLN)
            </option>
          </select>
        </div>

        <div>
          <label>Numer konta docelowego</label>
          <input v-model="form.nr_konta_docelowego" class="input" required />
        </div>
        <div>
          <label>Nazwa odbiorcy</label>
          <input v-model="form.nazwa_odbiorcy" class="input" required />
        </div>
        <div>
          <label>Tytuł przelewu</label>
          <input v-model="form.tytul_przelewu" class="input" required />
        </div>
        <div>
          <label>Kwota (PLN)</label>
          <input type="number" v-model.number="form.kwota" class="input" required />
        </div>
        <div>
          <label>Częstotliwość</label>
          <select v-model="form.czestotliwosc" class="input" required>
            <option value="miesiecznie">Miesięcznie</option>
            <option value="tygodniowo">Tygodniowo</option>
          </select>
        </div>
        <div>
          <label>Data rozpoczęcia</label>
          <input type="date" v-model="form.data_startu" class="input" required />
        </div>
        <div>
          <label>Data zakończenia</label>
          <input type="date" v-model="form.data_zakonczenia" class="input" required />
        </div>
        <div>
          <label>
            <input type="checkbox" v-model="form.aktywne" />
            Aktywne
          </label>
        </div>
        <button type="submit" class="btn bg-green-600 hover:bg-green-700 text-white">
          Zapisz zlecenie
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

const zlecenia = ref([])
const showForm = ref(false)

const szczegolyZlecenia = ref(null)
const edytowanyId = ref(null)

const form = ref({
  id_konta_zrodlowego: 0,
  nr_konta_docelowego: '',
  nazwa_odbiorcy: '',
  tytul_przelewu: '',
  kwota: 0,
  czestotliwosc: 'miesiecznie',
  data_startu: '',
  data_zakonczenia: '',
  aktywne: true,
})

const kontaUzytkownika = ref([])

async function fetchKonta() {
  try {
    const res = await axios.get('https://witelonapi.host358482.xce.pl/api/konta', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    kontaUzytkownika.value = res.data
    if (res.data.length > 0) {
      form.value.id_konta_zrodlowego = res.data[0].id
    }
  } catch (err) {
    console.error('Błąd przy pobieraniu kont użytkownika:', err)
  }
}


async function fetchZlecenia() {
  try {
    const res = await axios.get('https://witelonapi.host358482.xce.pl/api/zlecenia-stale', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    zlecenia.value = res.data
  } catch (err) {
    console.error('Błąd podczas pobierania zleceń:', err)
  }
}

async function submitForm() {
  try {
    if (edytowanyId.value) {
      // Edycja istniejącego zlecenia
      const res = await axios.put(
          `https://witelonapi.host358482.xce.pl/api/zlecenia-stale/${edytowanyId.value}`,
          form.value,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
      )
      console.log('Zlecenie zaktualizowane:', res.data)
    } else {
      // Tworzenie nowego zlecenia
      const res = await axios.post(
          'https://witelonapi.host358482.xce.pl/api/zlecenia-stale',
          form.value,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
      )
      console.log('Zlecenie dodane:', res.data)
    }

    await fetchZlecenia()
    resetForm()
    edytowanyId.value = null
    showForm.value = false
  } catch (err) {
    console.error('Błąd podczas zapisu zlecenia:', err)
  }
}

function edytujZlecenie(zlecenie) {
  form.value = {
    id_konta_zrodlowego: zlecenie.id_konta_zrodlowego,
    nr_konta_docelowego: zlecenie.nr_konta_docelowego,
    nazwa_odbiorcy: zlecenie.nazwa_odbiorcy,
    tytul_przelewu: zlecenie.tytul_przelewu,
    kwota: zlecenie.kwota,
    czestotliwosc: zlecenie.czestotliwosc,
    data_startu: zlecenie.data_startu,
    data_zakonczenia: zlecenie.data_zakonczenia,
    aktywne: zlecenie.aktywne,
  }
  edytowanyId.value = zlecenie.id
  showForm.value = true
}

async function usunZlecenie(idZlecenia) {
  if (!confirm('Czy na pewno chcesz usunąć to zlecenie stałe?')) return

  try {
    await axios.delete(
        `https://witelonapi.host358482.xce.pl/api/zlecenia-stale/${idZlecenia}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
    )

    await fetchZlecenia()
  } catch (err) {
    console.error('Błąd podczas usuwania zlecenia:', err)
  }
}


function resetForm() {
  form.value = {
    id_konta_zrodlowego: 0,
    nr_konta_docelowego: '',
    nazwa_odbiorcy: '',
    tytul_przelewu: '',
    kwota: 0,
    czestotliwosc: 'miesiecznie',
    data_startu: '',
    data_zakonczenia: '',
    aktywne: true,
  }
  edytowanyId.value = null
}

async function pokazSzczegolyZlecenia(id) {
  try {
    const res = await axios.get(`https://witelonapi.host358482.xce.pl/api/zlecenia-stale/${id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    szczegolyZlecenia.value = res.data
  } catch (err) {
    console.error('Błąd przy pobieraniu szczegółów zlecenia:', err)
  }
}

onMounted(() => {
  fetchZlecenia()
  fetchKonta()
})

</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
