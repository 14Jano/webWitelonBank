<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10">
    <h2 class="text-4xl font-extrabold text-gray-900 mb-12 text-center drop-shadow-sm">{{ $t('recurringPayments.title') }}</h2>

    <div v-if="zlecenia.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <div
          v-for="zlecenie in zlecenia"
          :key="zlecenie.id"
          class="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.01] border border-gray-100 flex flex-col justify-between"
      >
        <div>
          <h3 class="text-xl font-bold text-blue-700 mb-3 border-b pb-2 border-blue-100">
            {{ $t('recurringPayments.card.recipient') }} {{ zlecenie.nazwa_odbiorcy }}
          </h3>
          <p class="text-gray-700 text-base mb-1">
            <span class="font-semibold text-gray-500">{{ $t('recurringPayments.card.amount') }}</span>
            <span class="font-extrabold text-2xl text-green-600 ml-2">{{ zlecenie.kwota }}</span> PLN
          </p>
          <p class="text-gray-700 text-sm mb-1">
            <span class="font-medium text-gray-500">{{ $t('recurringPayments.card.frequency') }}</span> {{ zlecenie.czestotliwosc }}
          </p>
          <p class="text-gray-700 text-sm mb-1">
            <span class="font-medium text-gray-500">{{ $t('recurringPayments.card.start') }}</span> {{ zlecenie.data_startu }}
          </p>
          <p class="text-gray-700 text-sm mb-3">
            <span class="font-medium text-gray-500">{{ $t('recurringPayments.card.end') }}</span> {{ zlecenie.data_zakonczenia || 'Brak' }}
          </p>
          <div class="mb-4">
            <span
                :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold uppercase',
                    zlecenie.aktywne ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
            >
              {{ zlecenie.aktywne ? $t('recurringPayments.card.active') : $t('recurringPayments.card.inactive') }}
            </span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
          <button
              @click="pokazSzczegolyZlecenia(zlecenie.id)"
              class="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-sm"
          >
            {{ $t('recurringPayments.card.detailsButton') }}
          </button>
          <button
              @click="edytujZlecenie(zlecenie)"
              class="flex-1 px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-50 rounded-lg hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-200 shadow-sm"
          >
            {{ $t('recurringPayments.card.editButton') }}
          </button>
          <button
              @click="usunZlecenie(zlecenie.id)"
              class="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 shadow-sm"
          >
            {{ $t('recurringPayments.card.deleteButton') }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-gray-600 text-xl text-center p-12 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
      <p class="mb-4">{{ $t('recurringPayments.noOrders.message1') }}</p>
      <p class="text-base text-gray-500">{{ $t('recurringPayments.noOrders.message2') }}</p>
    </div>

    <Transition name="fade">
      <div
          v-if="szczegolyZlecenia"
          class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      >
        <div class="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full relative transform transition-all duration-300 ease-out scale-95 opacity-0"
             :class="{ 'scale-100 opacity-100': szczegolyZlecenia }"
        >
          <button
              @click="szczegolyZlecenia = null"
              class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-4xl font-light leading-none focus:outline-none transition-colors duration-200"
          >
            &times;
          </button>
          <h3 class="text-3xl font-bold text-gray-900 mb-6 border-b pb-4 border-gray-200">Szczegóły zlecenia</h3>
          <div class="space-y-4 text-gray-700 text-lg">
            <p><strong>{{ $t('recurringPayments.detailsModal.recipient') }}</strong> <span class="font-semibold">{{ szczegolyZlecenia.nazwa_odbiorcy }}</span></p>
            <p><strong>{{ $t('recurringPayments.detailsModal.accountNumber') }}</strong> <span class="font-mono bg-gray-100 px-2 py-1 rounded text-base inline-block">{{ szczegolyZlecenia.nr_konta_docelowego }}</span></p>
            <p><strong>{{ $t('recurringPayments.detailsModal.transferTitle') }}</strong> {{ szczegolyZlecenia.tytul_przelewu }}</p>
            <p><strong>{{ $t('recurringPayments.detailsModal.amount') }}</strong> <span class="font-bold text-green-600">{{ szczegolyZlecenia.kwota }} PLN</span></p>
            <p><strong>{{ $t('recurringPayments.detailsModal.frequency') }}</strong> {{ szczegolyZlecenia.czestotliwosc }}</p>
            <p><strong>{{ $t('recurringPayments.detailsModal.startDate') }}</strong> {{ szczegolyZlecenia.data_startu }}</p>
            <p><strong>{{ $t('recurringPayments.detailsModal.endDate') }}</strong> {{ szczegolyZlecenia.data_zakonczenia || $t('recurringPayments.detailsModal.noEndDate') }}</p>
            <p>
              <strong>{{ $t('recurringPayments.detailsModal.status') }}</strong>
              <span :class="[
                  'px-3 py-1 rounded-full text-sm font-semibold uppercase ml-2',
                  szczegolyZlecenia.aktywne ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ szczegolyZlecenia.aktywne ? $t('recurringPayments.detailsModal.active') : $t('recurringPayments.detailsModal.inactive') }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="mt-12 text-center">
      <button
          @click="toggleFormAndScroll()"
          class="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        {{ showForm ? $t('recurringPayments.toggleFormButton.cancel') : $t('recurringPayments.toggleFormButton.add') }}
      </button>
    </div>

    <Transition name="slide-fade">
      <div v-if="showForm" ref="formSection" class="mt-10 p-8 bg-white rounded-xl shadow-2xl max-w-2xl mx-auto border border-gray-200">
        <h3 class="text-3xl font-bold text-gray-900 mb-8 text-center">{{ edytowanyId ? $t('recurringPayments.form.editTitle') : $t('recurringPayments.form.newTitle') }}</h3>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="id_konta_zrodlowego" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.sourceAccount.label') }}</label>
            <select id="id_konta_zrodlowego" v-model="form.id_konta_zrodlowego" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" required>
              <option disabled value="">{{ $t('recurringPayments.form.sourceAccount.placeholder') }}</option>
              <option
                  v-for="konto in kontaUzytkownika"
                  :key="konto.id"
                  :value="konto.id"
              >
                {{ konto.numer_konta }} ({{ $t('recurringPayments.form.sourceAccount.balance') }} {{ konto.saldo }} PLN)
              </option>
            </select>
          </div>

          <div>
            <label for="nr_konta_docelowego" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.targetAccountNumber.label') }}</label>
            <input type="text" id="nr_konta_docelowego" v-model="form.nr_konta_docelowego" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" required placeholder="np. PL00000000000000000000000000" />
          </div>
          <div>
            <label for="nazwa_odbiorcy" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.recipientName.label') }}</label>
            <input type="text" id="nazwa_odbiorcy" v-model="form.nazwa_odbiorcy" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" required :placeholder="$t('recurringPayments.form.recipientName.placeholder')" />
          </div>
          <div>
            <label for="tytul_przelewu" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.transferTitle.label') }}</label>
            <input type="text" id="tytul_przelewu" v-model="form.tytul_przelewu" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" required :placeholder="$t('recurringPayments.form.transferTitle.placeholder')" />
          </div>
          <div>
            <label for="kwota" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.amount.label') }}</label>
            <input type="number" id="kwota" v-model.number="form.kwota" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" min="0.01" step="0.01" required :placeholder="$t('recurringPayments.form.amount.placeholder')" />
          </div>
          <div>
            <label for="czestotliwosc" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.frequency.label') }}</label>
            <select id="czestotliwosc" v-model="form.czestotliwosc" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" required>
              <option value="miesiecznie">{{ $t('recurringPayments.form.frequency.monthly') }}</option>
              <option value="tygodniowo">{{ $t('recurringPayments.form.frequency.weekly') }}</option>
              <option value="kwartalnie">{{ $t('recurringPayments.form.frequency.quarterly') }}</option>
              <option value="rocznie">{{ $t('recurringPayments.form.frequency.annually') }}</option>
            </select>
          </div>
          <div>
            <label for="data_startu" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.startDate.label') }}</label>
            <input type="date" id="data_startu" v-model="form.data_startu" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" required />
          </div>
          <div>
            <label for="data_zakonczenia" class="block text-gray-700 text-base font-semibold mb-2">{{ $t('recurringPayments.form.endDate.label') }}</label>
            <input type="date" id="data_zakonczenia" v-model="form.data_zakonczenia" class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-800" />
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="aktywne" v-model="form.aktywne" class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md cursor-pointer" />
            <label for="aktywne" class="ml-3 block text-gray-700 text-base font-semibold cursor-pointer">{{ $t('recurringPayments.form.activeOrder.label') }}</label>
          </div>
          <button type="submit" class="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-[1.01]">
            {{ edytowanyId ? $t('recurringPayments.form.saveButton') : $t('recurringPayments.form.addButton') }}
          </button>
        </form>
      </div>
    </Transition>
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

const formSection = ref(null)

const form = ref({
  id_konta_zrodlowego: '',
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
    if (kontaUzytkownika.value.length > 0 && !edytowanyId.value && !form.value.id_konta_zrodlowego) {
      form.value.id_konta_zrodlowego = kontaUzytkownika.value[0].id
    }
  } catch (err) {
    console.error('Błąd przy pobieraniu kont użytkownika:', err)
    alert(`Błąd przy pobieraniu kont użytkownika: ${err.response?.data?.message || err.message}`)
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
    alert(`Błąd podczas pobierania zleceń: ${err.response?.data?.message || err.message}`)
  }
}

async function submitForm() {
  try {
    if (form.value.data_startu && form.value.data_zakonczenia && new Date(form.value.data_startu) > new Date(form.value.data_zakonczenia)) {
      alert('Data rozpoczęcia nie może być późniejsza niż data zakończenia.')
      return
    }

    if (edytowanyId.value) {
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
      alert('Zlecenie zaktualizowane pomyślnie!')
    } else {
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
      alert('Zlecenie dodane pomyślnie!')
    }

    await fetchZlecenia()
    resetForm()
    showForm.value = false
  } catch (err) {
    console.error('Błąd podczas zapisu zlecenia:', err)
    alert(`Błąd podczas zapisu zlecenia: ${err.response?.data?.message || err.message}`)
  }
}

function edytujZlecenie(zlecenie) {
  form.value = { ...zlecenie }
  form.value.data_startu = zlecenie.data_startu ? new Date(zlecenie.data_startu).toISOString().split('T')[0] : '';
  form.value.data_zakonczenia = zlecenie.data_zakonczenia ? new Date(zlecenie.data_zakonczenia).toISOString().split('T')[0] : '';
  edytowanyId.value = zlecenie.id
  showForm.value = true

  if (formSection.value) {
    formSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

async function usunZlecenie(idZlecenia) {
  if (!confirm('Czy na pewno chcesz usunąć to zlecenie stałe? Tej operacji nie można cofnąć.')) return

  try {
    await axios.delete(
        `https://witelonapi.host358482.xce.pl/api/zlecenia-stale/${idZlecenia}`,
        {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
    )
    alert('Zlecenie usunięte pomyślnie!')
    await fetchZlecenia()
  } catch (err) {
    console.error('Błąd podczas usuwania zlecenia:', err)
    alert(`Błąd podczas usuwania zlecenia: ${err.response?.data?.message || err.message}`)
  }
}


function resetForm() {
  form.value = {
    id_konta_zrodlowego: kontaUzytkownika.value.length > 0 ? kontaUzytkownika.value[0].id : '',
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
    alert(`Błąd przy pobieraniu szczegółów zlecenia: ${err.response?.data?.message || err.message}`)
  }
}

function toggleFormAndScroll() {
  showForm.value = !showForm.value;
  if (!showForm.value) {
    resetForm();
  } else {
    if (kontaUzytkownika.value.length > 0 && !edytowanyId.value && !form.value.id_konta_zrodlowego) {
      form.value.id_konta_zrodlowego = kontaUzytkownika.value[0].id
    }
    setTimeout(() => {
      if (formSection.value) {
        formSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

onMounted(() => {
  fetchZlecenia()
  fetchKonta()
})

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>