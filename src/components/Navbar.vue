<template>
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <router-link to="/" class="flex items-center gap-2">
        <img src="../assets/WitelonBankLogo.png" alt="Bank Logo" class="h-10 w-10" />
        <span class="text-xl font-semibold text-gray-800">WitelonBank</span>
      </router-link>

      <nav class="flex items-center gap-10">
        <ul class="flex items-center gap-2 text-base font-medium text-gray-700">
          <li>
            <router-link
                to="/"
                class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
              {{ $t('home') }}
            </router-link>
          </li>
          <li>
            <router-link
                to="/currencies"
                class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
              {{ $t('currencies') }}
            </router-link>
          </li>
          <li v-if="user">
            <router-link
                to="/account"
                class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
              {{ $t('account') }}
            </router-link>
          </li>
          <li>
            <router-link
                to="/about"
                class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
              {{ $t('about') }}
            </router-link>
          </li>
          <li>
            <router-link
                to="/help"
                class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
              {{ $t('help') }}
            </router-link>
          </li>
          <li>
            <router-link
                to="/promo"
                class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
              {{ $t('promotion') }}
            </router-link>
          </li>
        </ul>

        <ul class="flex items-center gap-4 text-sm text-gray-600">
          <template v-if="user">
            <span class="text-gray-700">
              {{ $t('welcome') }}, <strong>{{ user.imie }} {{ user.nazwisko }}</strong>
            </span>
            <button
                @click="authStore.logout"
                class="text-red-600 hover:text-red-800 transition">
              {{ $t('logout') }}
            </button>
          </template>
          <template v-else>
            <FontAwesomeIcon :icon="faUnlock" class="text-gray-500" />
            <li>
              <router-link
                  to="/login"
                  class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                  exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
                {{ $t('login') }}
              </router-link>
            </li>
            <li>
              <router-link
                  to="/register"
                  class="px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-700"
                  exact-active-class="bg-blue-100 text-blue-700 font-semibold border border-blue-300 shadow-sm">
                {{ $t('register') }}
              </router-link>
            </li>
          </template>
        </ul>
      </nav>
    </div>
  </header>
  <div class="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
    <div class="flex flex-col bg-white shadow-md rounded-l-lg border border-gray-200 overflow-hidden">
      <button @click="changeLang('pl')" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" id="Pl-Poland--Streamline-Flagpack" height="24" width="24"><desc>PL Poland Streamline Icon: https://streamlinehq.com</desc><path fill="#f7fcff" fill-rule="evenodd" d="M0 4v24h32V4H0Z" clip-rule="evenodd"></path><mask id="a" width="32" height="24" x="0" y="4" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#ffffff" fill-rule="evenodd" d="M0 4v24h32V4H0Z" clip-rule="evenodd"></path></mask><g mask="url(#a)"><path fill="#c51918" fill-rule="evenodd" d="M0 16v12h32V16H0Z" clip-rule="evenodd"></path></g></svg></button>

      <button @click="changeLang('en')" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" id="Gb-Ukm-United-Kingdom--Streamline-Flagpack" height="24" width="24"><desc>GB UKM United Kingdom Streamline Icon: https://streamlinehq.com</desc><path fill="#2e42a5" fill-rule="evenodd" d="M0 4v24h32V4H0Z" clip-rule="evenodd"></path><mask id="a" width="32" height="24" x="0" y="4" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#ffffff" fill-rule="evenodd" d="M0 4v24h32V4H0Z" clip-rule="evenodd"></path></mask><g mask="url(#a)"><path fill="#ffffff" d="m-3.563 26.285 7.042 2.978 28.68-22.025 3.715-4.426-7.53-.995-11.698 9.491-9.416 6.395-10.793 8.582Z"></path><path fill="#f50100" d="M-2.599 28.372.99 30.1 34.54 2.401h-5.038L-2.6 28.371Z"></path><path fill="#ffffff" d="m35.563 26.285-7.042 2.978L-.159 7.238l-3.715-4.426 7.53-.995 11.698 9.491 9.416 6.395 10.793 8.582Z"></path><path fill="#f50100" d="m35.323 27.782-3.587 1.729-14.287-11.86-4.236-1.325L-4.231 2.827H.806L18.24 16.006l4.631 1.589 12.452 10.188Z"></path><mask id="b" fill="#ffffff"><path fill-rule="evenodd" d="M19.778 2h-7.556v10H-1.972v8h14.194v10h7.556V20h14.25v-8h-14.25V2Z" clip-rule="evenodd"></path></mask><path fill="#f50100" fill-rule="evenodd" d="M19.778 2h-7.556v10H-1.972v8h14.194v10h7.556V20h14.25v-8h-14.25V2Z" clip-rule="evenodd"></path><path fill="#ffffff" d="M12.222 2V0h-2v2h2Zm7.556 0h2V0h-2v2Zm-7.556 10v2h2v-2h-2Zm-14.194 0v-2h-2v2h2Zm0 8h-2v2h2v-2Zm14.194 0h2v-2h-2v2Zm0 10h-2v2h2v-2Zm7.556 0v2h2v-2h-2Zm0-10v-2h-2v2h2Zm14.25 0v2h2v-2h-2Zm0-8h2v-2h-2v2Zm-14.25 0h-2v2h2v-2Zm-7.556-8h7.556V0h-7.556v4Zm2 8V2h-4v10h4Zm-16.194 2h14.194v-4H-1.972v4Zm2 6v-8h-4v8h4Zm12.194-2H-1.972v4h14.194v-4Zm2 12V20h-4v10h4Zm5.556-2h-7.556v4h7.556v-4Zm-2-8v10h4V20h-4Zm16.25-2h-14.25v4h14.25v-4Zm-2-6v8h4v-8h-4Zm-12.25 2h14.25v-4h-14.25v4Zm-2-12v10h4V2h-4Z" mask="url(#b)"></path></g></svg>      </button>

      <button @click="changeLang('de')" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="De-Germany--Streamline-Flagpack" height="24" width="24"><desc>DE Germany Streamline Icon: https://streamlinehq.com</desc><path fill="#ffd018" fill-rule="evenodd" d="M0 15h24v6H0v-6Z" clip-rule="evenodd" stroke-width="0.75"></path><path fill="#e31d1c" fill-rule="evenodd" d="M0 9h24v6H0v-6Z" clip-rule="evenodd" stroke-width="0.75"></path><path fill="#272727" fill-rule="evenodd" d="M0 3h24v6H0V3Z" clip-rule="evenodd" stroke-width="0.75"></path></svg>
      </button>
    </div>
  </div>
  <!--    {{$t('tekst do tlumaczenia dla przyciskow')}}-->
<!--  <h1 class="text-2xl font-bold" style="text-align: center">{{ $t('welcome') }}</h1>-->
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth.ts'
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUnlock } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

function changeLang(lang: string) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>
