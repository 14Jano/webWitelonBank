<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import { useAuthStore } from "./store/auth.ts";

const authStore = useAuthStore();
const storedUser = localStorage.getItem('user');

if (storedUser) {
  authStore.login(JSON.parse(storedUser));
}
</script>

<template>
  <Navbar/>
  <router-view></router-view>
</template>

<style scoped>

</style>
