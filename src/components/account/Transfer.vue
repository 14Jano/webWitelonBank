<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">Wykonaj przelew</h2>

      <div v-if="!idKontaNadawcy" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        <strong class="font-bold">Błąd!</strong>
        <span class="block sm:inline ml-2">Nie udało się załadować konta nadawcy.</span>
      </div>

      <form v-else @submit.prevent="wyslijPrzelew" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label for="nr_konta_odbiorcy" class="block text-sm font-medium text-gray-700 mb-1">Numer konta odbiorcy</label>
          <input
              id="nr_konta_odbiorcy"
              v-model="form.nr_konta_odbiorcy"
              type="text"
              required
              class="input-field"
              placeholder="np. PLXX XXXX XXXX XXXX XXXX XXXX XXXX"
          />
        </div>

        <div>
          <label for="nazwa_odbiorcy" class="block text-sm font-medium text-gray-700 mb-1">Nazwa odbiorcy</label>
          <input
              id="nazwa_odbiorcy"
              v-model="form.nazwa_odbiorcy"
              type="text"
              required
              class="input-field"
              placeholder="Imię i Nazwisko / Nazwa firmy"
          />
        </div>

        <div class="md:col-span-2">
          <label for="adres_odbiorcy_linia1" class="block text-sm font-medium text-gray-700 mb-1">Adres odbiorcy - linia 1</label>
          <input
              id="adres_odbiorcy_linia1"
              v-model="form.adres_odbiorcy_linia1"
              type="text"
              required
              class="input-field"
              placeholder="Ulica i numer domu/mieszkania"
          />
        </div>

        <div class="md:col-span-2">
          <label for="adres_odbiorcy_linia2" class="block text-sm font-medium text-gray-700 mb-1">Adres odbiorcy - linia 2</label>
          <input
              id="adres_odbiorcy_linia2"
              v-model="form.adres_odbiorcy_linia2"
              type="text"
              required
              class="input-field"
              placeholder="Kod pocztowy i miasto"
          />
        </div>

        <div class="md:col-span-2">
          <label for="tytul" class="block text-sm font-medium text-gray-700 mb-1">Tytuł przelewu</label>
          <input
              id="tytul"
              v-model="form.tytul"
              type="text"
              required
              class="input-field"
              placeholder="np. Rachunek za prąd, Zwrot pożyczki"
          />
        </div>

        <div>
          <label for="kwota" class="block text-sm font-medium text-gray-700 mb-1">Kwota</label>
          <input
              id="kwota"
              v-model.number="form.kwota"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="input-field"
              placeholder="np. 100.00"
          />
        </div>

        <div>
          <label for="waluta_przelewu" class="block text-sm font-medium text-gray-700 mb-1">Waluta</label>
          <select id="waluta_przelewu" v-model="form.waluta_przelewu" class="input-field">
            <option value="PLN">PLN</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div class="md:col-span-2 text-center mt-4">
          <button type="submit" class="submit-button">Wyślij przelew</button>
        </div>
      </form>

      <div v-if="komunikat" class="mt-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center" role="alert">
        <strong class="font-bold">Sukces!</strong>
        <span class="block sm:inline ml-2">{{ komunikat }}</span>
      </div>
      <div v-if="blad" class="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
        <strong class="font-bold">Błąd!</strong>
        <span class="block sm:inline ml-2">{{ blad }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const idKontaNadawcy = ref(null)
const nrKontaNadawcy = ref('')
const komunikat = ref('')
const blad = ref('')

const form = ref({
  nr_konta_odbiorcy: '',
  nazwa_odbiorcy: '',
  adres_odbiorcy_linia1: '',
  adres_odbiorcy_linia2: '',
  tytul: '',
  kwota: null,
  waluta_przelewu: 'PLN'
})

onMounted(async () => {
  try {
    const res = await axios.get('https://witelonapi.host358482.xce.pl/api/konta', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    const konta = res.data
    if (konta.length > 0) {
      const konto = konta[0]
      idKontaNadawcy.value = konto.id
      nrKontaNadawcy.value = konto.nr_konta
      console.log('ID konta nadawcy:', idKontaNadawcy.value)
      console.log('Numer konta nadawcy:', nrKontaNadawcy.value)
    } else {
      blad.value = 'Użytkownik nie posiada żadnego konta.'
    }
  } catch (err) {
    blad.value = 'Błąd podczas pobierania konta nadawcy.'
    console.error(err)
  }
})

const wyslijPrzelew = async () => {
  blad.value = ''
  komunikat.value = ''

  if (!idKontaNadawcy.value) {
    blad.value = 'Brak ID konta nadawcy.'
    return
  }

  if (form.value.nr_konta_odbiorcy === nrKontaNadawcy.value) {
    blad.value = 'Nie możesz wykonać przelewu na własne konto.'
    return
  }

  const dane = {
    id_konta_nadawcy: idKontaNadawcy.value,
    ...form.value
  }

  try {
    const res = await axios.post('https://witelonapi.host358482.xce.pl/api/przelewy', dane, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    komunikat.value = 'Przelew został wysłany pomyślnie.'
    console.log('Odpowiedź serwera:', res.data)
    form.value = {
      nr_konta_odbiorcy: '',
      nazwa_odbiorcy: '',
      adres_odbiorcy_linia1: '',
      adres_odbiorcy_linia2: '',
      tytul: '',
      kwota: null,
      waluta_przelewu: 'PLN'
    }
  } catch (err) {
    blad.value = 'Błąd podczas wykonywania przelewu.'
    console.error(err)
  }
}
</script>

<style scoped>

.input-field {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.15s ease-in-out;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

.submit-button {
  display: inline-flex;
  justify-content: center;
  padding: 0.5rem 1.5rem;
  border: 1px solid transparent;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: #ffffff;
  background-color: #2563eb;
  transition: all 0.15s ease-in-out;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6;
}
</style>
