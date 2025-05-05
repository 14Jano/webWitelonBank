<template>
  <main class="min-h-screen bg-gray-50 py-16 px-4 flex flex-col items-center">

    <div class="text-center max-w-3xl mb-16">
      <h1 class="text-5xl font-bold text-blue-900 mb-4">Poznaj Nasz Bank</h1>
      <p class="text-lg text-gray-600">
        Twoje zaufanie jest naszym kapitałem. Od ponad 20 lat wspieramy miliony klientów w Polsce i Europie.
      </p>
    </div>

    <div class="grid md:grid-cols-3 gap-10 max-w-6xl mb-20">
      <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-center flex flex-col items-center">
        <ShieldCheck class="w-12 h-12 text-blue-600 mb-4" />
        <h3 class="text-xl font-semibold mb-2">Bezpieczeństwo</h3>
        <p class="text-gray-600">Twoje środki są u nas w pełni chronione dzięki nowoczesnym zabezpieczeniom klasy premium.</p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-center flex flex-col items-center">
        <Rocket class="w-12 h-12 text-blue-600 mb-4" />
        <h3 class="text-xl font-semibold mb-2">Innowacje</h3>
        <p class="text-gray-600">Nowoczesne aplikacje i systemy, które sprawiają, że bankowanie jest łatwe i przyjemne.</p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition text-center flex flex-col items-center">
        <Handshake class="w-12 h-12 text-blue-600 mb-4" />
        <h3 class="text-xl font-semibold mb-2">Zaufanie</h3>
        <p class="text-gray-600">Ponad 5 milionów klientów zaufało nam na całym świecie — dołącz do naszej społeczności.</p>
      </div>
    </div>

    <div class="flex flex-col md:flex-row items-center gap-12 max-w-6xl mb-20">
      <img src="https://cdn.pixabay.com/photo/2015/03/29/08/55/entrepreneur-696976_1280.png"
           alt="Bank"
           class="rounded-lg shadow-lg w-full md:w-1/2" />
      <div class="md:w-1/2 text-center md:text-left">
        <h2 class="text-3xl font-semibold text-blue-800 mb-4">Nowoczesne podejście do finansów</h2>
        <p class="text-gray-600 mb-6">
          Korzystaj z naszych usług wszędzie tam, gdzie jesteś — dzięki aplikacji mobilnej i nowoczesnemu systemowi online.
        </p>
        <button class="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-800 transition">
          <router-link to="/register">Dołącz teraz</router-link>
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-8 max-w-6xl text-center">
      <div>
        <div class="text-4xl font-bold text-blue-800 mb-2">20+</div>
        <p class="text-gray-600">Lat na rynku</p>
      </div>
      <div>
        <div class="text-4xl font-bold text-blue-800 mb-2">5M+</div>
        <p class="text-gray-600">Zadowolonych klientów</p>
      </div>
      <div>
        <div class="text-4xl font-bold text-blue-800 mb-2">24/7</div>
        <p class="text-gray-600">Obsługa klienta</p>
      </div>
    </div>

  </main>
</template>



<script setup lang="ts">
import { ShieldCheck, Rocket, Handshake } from 'lucide-vue-next'



</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.6s ease forwards;
}
.delay-200 {
  animation-delay: 0.2s;
}
</style>
