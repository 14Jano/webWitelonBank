<template>
  <div class="cards-container">
    <h2>{{ $t('cardsPage.title') }}</h2>
    <div v-if="loading" class="loading-state">{{ $t('cardsPage.loading') }}</div>

    <div v-else>
      <div v-if="cards.length" class="card-list">
        <div v-for="card in cards" :key="card.id" class="card-item-wrapper">
          <div class="payment-card" @click="openCard(card)">
            <div class="card-header">
              <span class="bank-logo"></span>
              <span class="bank-name">{{ $t('cardsPage.bankName') }}</span>
            </div>
            <div class="card-number-display">
              {{ maskCardNumber(card.nr_karty) }}
            </div>
            <div class="card-details">
              <div class="expiry-date">
                <label>{{ $t('cardsPage.cardDetails.validUntil') }}</label>
                <span>{{ formatDateShort(card.data_waznosci) }}</span>
              </div>
              <div class="card-status">
                <p>{{ $t('cardsPage.cardDetails.status') }}
                  <span :class="card.zablokowana ? 'status-red' : 'status-green'">
                    {{ card.zablokowana ? $t('cardsPage.cardStatus.blocked') : $t('cardsPage.cardStatus.active') }}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="card-actions">
            <button
                v-if="!card.zablokowana"
                @click.stop="confirmBlock(card.id)"
                class="action-button block-button">
              {{ $t('cardsPage.actions.blockCard') }}
            </button>
            <button
                v-if="card.zablokowana"
                @click.stop="confirmUnblock(card.id)"
                class="action-button unblock-button">
              {{ $t('cardsPage.actions.unblockCard') }}
            </button>
            <button
                @click.stop="openLimitModal(card)"
                class="action-button limit-button">
              {{ $t('cardsPage.actions.changeLimit') }}
            </button>
            <button
                @click.stop="openPaymentSettingsModal(card)"
                class="action-button settings-button">
              {{ $t('cardsPage.actions.paymentSettings') }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-cards-state">
        {{ $t('cardsPage.noCards') }}
      </div>
    </div>

    <div v-if="selectedCard" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>{{ $t('cardsPage.modals.cardDetailsTitle') }}</h3>
        <p><strong>{{ $t('cardsPage.cardDetails.cardNumber') }}</strong> {{ selectedCard.nr_karty ? maskCardNumber(selectedCard.nr_karty) : 'Brak danych' }}</p>
        <p><strong>{{ $t('cardsPage.cardDetails.expirationDate') }}</strong> {{ formatDate(selectedCard.data_waznosci) }}</p>
        <p><strong>{{ $t('cardsPage.cardDetails.dailyLimit') }}</strong> {{ selectedCard.limit_dzienny }} PLN</p>
        <p>
          <strong>{{ $t('cardsPage.cardDetails.status') }}</strong>
          <span :class="selectedCard.zablokowana ? 'status-red' : 'status-green'">
            {{ selectedCard.zablokowana ? $t('cardsPage.cardStatus.blocked') : $t('cardsPage.cardStatus.active') }}
          </span>
        </p>
        <p><strong>{{ $t('cardsPage.cardDetails.onlinePayments') }}</strong>
          <span :class="selectedCard.platnosci_internetowe_aktywne ? 'status-green' : 'status-red'">
            {{ selectedCard.platnosci_internetowe_aktywne ? $t('cardsPage.cardDetails.active') : $t('cardsPage.cardDetails.blocked') }}          </span>
        </p>
        <p><strong>{{ $t('cardsPage.cardDetails.contactlessPayments') }}</strong>
          <span :class="selectedCard.platnosci_zblizeniowe_aktywne ? 'status-green' : 'status-red'">
            {{ selectedCard.platnosci_zblizeniowe_aktywne ? $t('cardsPage.cardDetails.active') : $t('cardsPage.cardDetails.blocked') }}
        </span>
        </p>

        <button @click="closeModal" class="modal-close-button">{{ $t('cardsPage.modals.closeButton') }}</button>
      </div>
    </div>

    <div v-if="showLimitModal" class="modal-overlay" @click.self="closeLimitModal">
      <div class="modal-content">
        <h3>{{ $t('cardsPage.modals.changeLimit.title') }}</h3>
        <p>{{ $t('cardsPage.modals.changeLimit.card') }} {{ maskCardNumber(editingCard.nr_karty) }}</p>
        <div class="form-group">
          <label for="newLimit">{{ $t('cardsPage.modals.changeLimit.newLimitLabel') }}</label>
          <input type="number" id="newLimit" v-model.number="newLimitValue" min="0.01" step="0.01" />
        </div>
        <div class="modal-actions">
          <button @click="submitLimitChange" class="action-button settings-button">{{ $t('cardsPage.modals.changeLimit.saveButton') }}</button>
          <button @click="closeLimitModal" class="modal-close-button">{{ $t('cardsPage.modals.changeLimit.cancelButton') }}</button>
        </div>
      </div>
    </div>

    <div v-if="showPaymentSettingsModal" class="modal-overlay" @click.self="closePaymentSettingsModal">
      <div class="modal-content">
        <h3>{{ $t('cardsPage.modals.paymentSettings.title') }}</h3>
        <p>{{ $t('cardsPage.modals.paymentSettings.card') }} {{ maskCardNumber(editingCard.nr_karty) }}</p>
        <div class="form-group">
          <input type="checkbox" id="onlinePayments" v-model="onlinePaymentsActive" />
          <label for="onlinePayments">{{ $t('cardsPage.modals.paymentSettings.onlinePaymentsCheckbox') }}</label>
        </div>
        <div class="form-group">
          <input type="checkbox" id="contactlessPayments" v-model="contactlessPaymentsActive" />
          <label for="contactlessPayments">{{ $t('cardsPage.modals.paymentSettings.contactlessPaymentsCheckbox') }}</label>
        </div>
        <div class="modal-actions">
          <button @click="submitPaymentSettingsChange" class="action-button settings-button">{{ $t('cardsPage.modals.paymentSettings.saveButton') }}</button>
          <button @click="closePaymentSettingsModal" class="modal-close-button">{{ $t('cardsPage.modals.paymentSettings.cancelButton') }}</button>
        </div>
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

const showLimitModal = ref(false);
const showPaymentSettingsModal = ref(false);
const editingCard = ref(null);
const newLimitValue = ref(0);
const onlinePaymentsActive = ref(false);
const contactlessPaymentsActive = ref(false);

function maskCardNumber(number) {
  if (!number) return '**** **** **** ****';
  const numString = String(number);
  return `**** **** **** ${numString.slice(-4)}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pl-PL');
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

function openLimitModal(card) {
  editingCard.value = card;
  newLimitValue.value = card.limit_dzienny;
  showLimitModal.value = true;
}

function closeLimitModal() {
  showLimitModal.value = false;
  editingCard.value = null;
  newLimitValue.value = 0;
}

async function submitLimitChange() {
  if (!newLimitValue.value || isNaN(newLimitValue.value) || Number(newLimitValue.value) <= 0) {
    alert('Nieprawidłowy limit. Wprowadź liczbę większą od zera.');
    return;
  }

  try {
    await axios.patch(`/api/karty/${editingCard.value.id}/limit`, {
      limit_dzienny: parseFloat(newLimitValue.value)
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Limit zmieniony pomyślnie!');
    closeLimitModal();
    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } catch (error) {
    console.error('Błąd podczas zmiany limitu:', error);
    alert('Nie udało się zmienić limitu.');
  }
}

function openPaymentSettingsModal(card) {
  editingCard.value = card;
  onlinePaymentsActive.value = card.platnosci_internetowe_aktywne;
  contactlessPaymentsActive.value = card.platnosci_zblizeniowe_aktywne;
  showPaymentSettingsModal.value = true;
}

function closePaymentSettingsModal() {
  showPaymentSettingsModal.value = false;
  editingCard.value = null;
  onlinePaymentsActive.value = false;
  contactlessPaymentsActive.value = false;
}

async function submitPaymentSettingsChange() {
  try {
    await axios.patch(`/api/karty/${editingCard.value.id}/ustawienia-platnosci`, {
      platnosci_internetowe_aktywne: onlinePaymentsActive.value,
      platnosci_zblizeniowe_aktywne: contactlessPaymentsActive.value
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert('Zmieniono ustawienia płatności.');
    closePaymentSettingsModal();
    const accountId = accounts.value[0].id;
    await fetchCards(accountId);
  } catch (error) {
    console.error('Błąd ustawień płatności:', error);
    alert('Nie udało się zmienić ustawień płatności.');
  }
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
    alert('Nie udało się zablokować karty.');
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
    alert('Nie udało się odblokować karty.');
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
.cards-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  color: #333;
  margin-bottom: 25px;
  font-size: 1.8em;
  font-weight: 600;
}

.loading-state, .no-cards-state {
  text-align: center;
  color: #666;
  font-size: 1.1em;
  margin-top: 30px;
}

.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
}

.card-item-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.payment-card {
  width: 320px;
  height: 200px;
  border-radius: 15px;
  padding: 25px;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.payment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
}

.payment-card::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background-color: #ffc107;
  border-radius: 10px;
  transform: rotate(45deg);
  box-shadow: 0 0 15px rgba(255, 193, 7, 0.7);
}

.card-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 15px;
}

.bank-name {
  font-size: 1.3em;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #fff;
  margin-left: auto;
}

.card-number-display {
  font-size: 1.8em;
  letter-spacing: 3px;
  font-weight: 500;
  margin-top: 30px;
  text-align: center;
}

.card-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.expiry-date {
  font-size: 0.95em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.expiry-date label {
  font-size: 0.8em;
  margin-bottom: 2px;
  opacity: 0.8;
}

.expiry-date span {
  font-weight: 600;
}

.card-status {
  font-size: 0.95em;
  text-align: right;
}

.card-status p {
  margin: 0;
}

.status-red {
  color: #f87171;
  font-weight: bold;
}

.status-green {
  color: #4ade80;
  font-weight: bold;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
}

.action-button {
  padding: 10px 18px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  flex: 1 1 auto;
  min-width: 140px;
  white-space: nowrap;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.block-button {
  background-color: #ef4444;
}
.block-button:hover {
  background-color: #dc2626;
}

.unblock-button {
  background-color: #22c55e;
}
.unblock-button:hover {
  background-color: #16a34a;
}

.limit-button {
  background-color: #f59e0b;
}
.limit-button:hover {
  background-color: #d97706;
}

.settings-button {
  background-color: #3b82f6;
}
.settings-button:hover {
  background-color: #2563eb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 450px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-content h3 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-content p {
  margin-bottom: 10px;
  line-height: 1.5;
  color: #555;
}

.modal-content strong {
  color: #333;
}

.modal-close-button {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1em;
  transition: background-color 0.2s ease;
}

.modal-close-button:hover {
  background-color: #5a6268;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-group label {
  margin-right: 10px;
  color: #333;
  font-weight: 500;
}

.form-group input[type="number"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex-grow: 1;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
  transform: scale(1.2);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

@media (min-width: 768px) {
  .card-item-wrapper {
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
  }

  .card-actions {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: auto;
    max-width: fit-content;
  }
}

@media (max-width: 767px) {
  .card-item-wrapper {
    flex-direction: column;
    align-items: center;
  }
  .card-actions {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 320px;
  }
  .action-button {
    min-width: 130px;
    padding: 8px 15px;
  }
}
</style>