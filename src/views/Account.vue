<template>
  <div class="profile">
    <h2>👤 Twój profil</h2>
    <ul>
      <li>Email: {{ user.email }}</li>
      <li>Imię i nazwisko: {{ user.name }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref({ email: '', name: '' })

onMounted(async () => {
  const res = await axios.get(import.meta.env.VITE_API_URL + '/user/profile')
  user.value = res.data
})
</script>

<style scoped>
.profile {
  padding: 2rem;
}
</style>
