<template>
  <div>
    <h2>Karty Płatnicze</h2>
    <div v-if="loading">Ładowanie kart...</div>
    <div v-else>
      <div v-if="cards.length" class="card-grid">
        <div
            v-for="card in cards"
            :key="card.id"
            class="payment-card"
            @click="openCard(card)"
        >
          <div class="card-top">
            <span class="bank-name">{{ bankName }}</span>
            <span class="chip"></span>
          </div>
          <div class="card-number">
            {{ maskCardNumber(card.nr_karty) }}
          </div>
          <div class="card-bottom">
            <div class="expiry">
              <label>Ważna do: </label>
              <span>{{ formatDateShort(card.data_waznosci) }}</span>
            </div>
            <p>Status:
              <span :class="card.zablokowana ? 'text-red-600' : 'text-green-600'">
                {{ card.zablokowana ? 'Zablokowana' : 'Aktywna' }}
              </span>
            </p>
            <button
                v-if="card.zablokowana"
                @click.stop="confirmUnblock(card.id)"
                class="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Odblokuj kartę
            </button>
            <button
                v-else
                @click.stop="confirmBlock(card.id)"
                class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Zablokuj kartę
            </button>

            <button
                @click.stop="changeLimit(card)"
                class="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
            >
              Zmień limit
            </button>
            <button
                @click.stop="changePaymentSettings(card)"
                class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Ustawienia płatności
            </button>


          </div>
        </div>
      </div>
      <div v-else>
        Brak kart do wyświetlenia.
      </div>
    </div>

    <div v-if="selectedCard" class="modal-overlay">
      <div class="modal-content">
        <h3>Szczegóły Karty</h3>
        <p><strong>ID:</strong> {{ selectedCard.id }}</p>
        <p><strong>Numer karty:</strong> {{ selectedCard.nr_karty_masked }}</p>
        <p><strong>Data ważności:</strong> {{ formatDate(selectedCard.data_waznosci) }}</p>
        <p><strong>Limit dzienny:</strong> {{ selectedCard.limit_dzienny }} PLN</p>
        <p>
          <strong>Status:</strong>
          <span :style="{ color: selectedCard.zablokowana ? 'red' : 'green' }">
            {{ selectedCard.zablokowana ? ' Zablokowana' : ' Aktywna' }}
          </span>
        </p>
        <p><strong>Płatności internetowe:</strong>
          <span :style="{ color: selectedCard.platnosci_internetowe_aktywne ? 'green' : 'red' }">
            {{ selectedCard.platnosci_internetowe_aktywne ? 'Aktywne' : 'Zablokowane' }}
          </span>
        </p>
        <p><strong>Płatności zbliżeniowe:</strong>
          <span :style="{ color: selectedCard.platnosci_zblizeniowe_aktywne ? 'green' : 'red' }">
            {{ selectedCard.platnosci_zblizeniowe_aktywne ? 'Aktywne' : 'Zablokowane' }}
        </span>
        </p>

        <button @click="closeModal">Zamknij</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const token = authStore.token;
const user = authStore.user;

const accounts = ref([]);
const cards = ref([]);
const loading = ref(true);
const selectedCard = ref(null);
const bankName = 'Witelon Bank';

function maskCardNumber(number) {
  if (!number) return '**** **** **** ****';
  return number.replace(/(\d{4})(?=\d)/g, '$1 ').replace(/.(?=.{5})/g, '*');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

function openCard(card) {
  selectedCard.value = card;
}

function closeModal() {
  selectedCard.value = null;
}

async function fetchAccounts() {
  try {
    const response = await axios.get('/api/konta', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    accounts.value = response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
}

async function fetchCards(accountId) {

  try {
    const response = await axios.get(`/api/konta/${accountId}/karty`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    cards.value = response.data;
    console.log('Odebrane karty:', response.data);
  } catch (error) {
    console.error('Error fetching cards:', error);
  } finally {
    loading.value = false;
  }
}

const confirmBlock = async (cardId) => {
  if (confirm('Czy na pewno chcesz zablokować tę kartę?')) {
    await blockCard(cardId);
  }
};

const confirmUnblock = async (cardId) => {
  if (confirm('Czy na pewno chcesz odblokować tę kartę?')) {
    await unblockCard(cardId);
  }
};

async function blockCard(cardId) {
  try {
    await axios.patch(`/api/karty/${cardId}/zablokuj`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } catch (error) {
    console.error('Błąd podczas blokowania karty:', error);
  }
}

async function unblockCard(cardId) {
  try {
    await axios.patch(`/api/karty/${cardId}/odblokuj`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } catch (error) {
    console.error('Błąd podczas odblokowywania karty:', error);
  }
}

async function changeLimit(card) {
  const newLimit = prompt(`Podaj nowy dzienny limit dla karty ${card.nr_karty_masked}:`, card.limit_dzienny);
  if (!newLimit || isNaN(newLimit) || Number(newLimit) <= 0) {
    alert('Nieprawidłowy limit.');
    return;
  }

  try {
    await axios.patch(`/api/karty/${card.id}/limit`, {
      limit_dzienny: parseFloat(newLimit)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } catch (error) {
    console.error('Błąd podczas zmiany limitu:', error);
    alert('Nie udało się zmienić limitu.');
  }
}

async function changePaymentSettings(card) {
  const last4 = card.nr_karty ? card.nr_karty.slice(-4) : '****';

  const newOnline = confirm(`Czy aktywować płatności internetowe dla karty kończącej się na ${last4}?\n(OK = Tak, Anuluj = Nie)`);
  const newContactless = confirm(`Czy aktywować płatności zbliżeniowe dla tej karty?\n(OK = Tak, Anuluj = Nie)`);

  try {
    await axios.patch(`/api/karty/${card.id}/ustawienia-platnosci`, {
      platnosci_internetowe_aktywne: newOnline,
      platnosci_zblizeniowe_aktywne: newContactless
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert('Zmieniono ustawienia płatności.');
    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } catch (error) {
    console.error('Błąd ustawień płatności:', error);
    alert('Nie udało się zmienić ustawień płatności.');
  }
}



onMounted(async () => {
  if (user && user.konta && user.konta.length) {
    accounts.value = user.konta;
  } else {
    await fetchAccounts();
  }
  if (accounts.value.length) {
    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } else {
    loading.value = false;
    console.warn('Brak kont użytkownika.');
  }
});
</script>

<style scoped>
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.payment-card {
  width: 300px;
  height: 180px;
  border-radius: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease;
}
.payment-card:hover {
  transform: scale(1.03);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bank-name {
  font-size: 1.2em;
  font-weight: bold;
}

.chip {
  width: 40px;
  height: 30px;
  background: gold;
  border-radius: 5px;
}

.card-number {
  font-size: 1.4em;
  letter-spacing: 2px;
  margin-top: 20px;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.expiry {
  font-size: 0.9em;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  width: 100%;
}
</style>
