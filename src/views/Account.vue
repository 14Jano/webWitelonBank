<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow p-5 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">{{ $t('myAccount.title') }}</h1>
    </header>

    <nav class="bg-white shadow p-3 flex gap-4 overflow-x-auto">
      <button v-for="tab in tabs" :key="tab.name"
              @click="activeTab = tab.name"
              :class="[
                'px-4 py-2 rounded-full font-medium',
                activeTab === tab.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              ]">
        {{ tab.label }}
      </button>
    </nav>
    <AccountList/>

    <main class="p-6">
      <component :is="currentTabComponent"></component>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SaldoHistoria from '../components/account/History.vue'
// @ts-ignore
import KartyZarzadzanie from '../components/account/Cards.vue'
// @ts-ignore
import Transfer from '../components/account/Transfer.vue'
import UstawieniaKonta from '../components/account/Settings.vue'
// @ts-ignore
import AccountList from "../components/AccountList.vue";
// @ts-ignore
import PlatnosciCykliczne from '../views/RecurringPayments.vue'
import ListaOdbiorcow from '../views/Recipients.vue'

import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

defineExpose({ SaldoHistoria, KartyZarzadzanie })

const tabs = [
  { name: 'saldo', label: 'Saldo i Historia' },
  { name: 'przelewy', label: 'Przelewy' },
  { name: 'karty', label: 'Karty Płatnicze' },
  { name: 'cykliczne', label: 'Zlecenia Stałe' },
  { name: 'odbiorcy', label: 'Odbiorcy' },
  { name: 'ustawienia', label: 'Ustawienia Konta' },
]

const activeTab = ref('saldo')
const authStore = useAuthStore()
const router = useRouter()


const currentTabComponent = computed(() => {
  switch (activeTab.value) {
    case 'saldo': return SaldoHistoria
    case 'przelewy': return Transfer
    case 'karty': return KartyZarzadzanie
    case 'cykliczne': return PlatnosciCykliczne
    case 'odbiorcy': return ListaOdbiorcow
    case 'ustawienia': return UstawieniaKonta
    default: return 'SaldoHistoria'
  }
})
watch(
    () => authStore.token,
    (newToken) => {
      if (!newToken) {
        router.push('/login')
      }
    },
    { immediate: true }
)
</script>

<style scoped>
nav::-webkit-scrollbar {
  height: 6px;
}
nav::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}
</style>
