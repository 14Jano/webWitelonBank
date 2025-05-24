<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Wykonaj przelew</h2>

    <div v-if="!idKontaNadawcy">
      <p class="text-red-600">Nie udało się załadować konta nadawcy.</p>
    </div>

    <form v-else @submit.prevent="wyslijPrzelew" class="grid gap-4 max-w-xl">
      <div>
        <label class="font-semibold">Numer konta odbiorcy</label>
        <input v-model="form.nr_konta_odbiorcy" type="text" required class="input" />
      </div>

      <div>
        <label class="font-semibold">Nazwa odbiorcy</label>
        <input v-model="form.nazwa_odbiorcy" type="text" required class="input" />
      </div>

      <div>
        <label class="font-semibold">Adres odbiorcy - linia 1</label>
        <input v-model="form.adres_odbiorcy_linia1" type="text" required class="input" />
      </div>

      <div>
        <label class="font-semibold">Adres odbiorcy - linia 2</label>
        <input v-model="form.adres_odbiorcy_linia2" type="text" required class="input" />
      </div>

      <div>
        <label class="font-semibold">Tytuł przelewu</label>
        <input v-model="form.tytul" type="text" required class="input" />
      </div>

      <div>
        <label class="font-semibold">Kwota</label>
        <input v-model.number="form.kwota" type="number" step="0.01" min="0.01" required class="input" />
      </div>

      <div>
        <label class="font-semibold">Waluta</label>
        <select v-model="form.waluta_przelewu" class="input">
          <option value="PLN">PLN</option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <button type="submit" class="btn">Wyślij przelew</button>
    </form>

    <div v-if="komunikat" class="mt-4 text-green-600">{{ komunikat }}</div>
    <div v-if="blad" class="mt-4 text-red-600">{{ blad }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
const idKontaNadawcy = ref(null)
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
      idKontaNadawcy.value = konta[0].id
      console.log('ID konta nadawcy:', idKontaNadawcy.value)
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

</style>
