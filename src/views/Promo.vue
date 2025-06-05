<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Aktualne promocje
      </h1>
      <p class="text-gray-600 mt-1">Skorzystaj z wyjątkowych ofert dostępnych tylko przez ograniczony czas.</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6">

      <div class="bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-500 rounded-2xl shadow p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-blue-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c1.656 0 3-1.343 3-3S13.656 2 12 2 9 3.343 9 5s1.344 3 3 3zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-blue-800">300 zł za otwarcie konta</h2>
        </div>
        <p class="text-gray-700 mb-4">
          Załóż konto osobiste i spełnij warunki promocji, a otrzymasz <strong>bonus 300 zł</strong> bez haczyków.
        </p>
        <button class="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
          <router-link to="/register" class="btn btn-secondary">Załóż konto</router-link>
        </button>
      </div>

      <div class="bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 rounded-2xl shadow p-5">
        <div class="flex items-center gap-3 mb-2">
          <div class="bg-green-500 text-white p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a4 4 0 00-8 0v2M5 12h14l-1.5 9h-11z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-green-800">0% prowizji za przelewy zagraniczne</h2>
        </div>
        <p class="text-gray-700 mb-4">
          Wysyłaj przelewy międzynarodowe <strong>bez prowizji</strong> do końca czerwca – bez ukrytych opłat.
        </p>
        <button class="mt-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200">
          Sprawdź szczegóły
        </button>
      </div>
    </div>
  </div>
</template>
