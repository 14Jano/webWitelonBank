<template>
  <nav class="sidebar">
    <RouterLink to="/dashboard">Dashboard</RouterLink>
    <RouterLink to="/profile">Profil</RouterLink>
    <RouterLink to="/transactions">Transakcje</RouterLink>
    <RouterLink to="/logout">Wyloguj</RouterLink>
  </nav>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #1e293b;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}
a {
  color: white;
  margin-bottom: 1rem;
  text-decoration: none;
}
a.router-link-exact-active {
  font-weight: bold;
}
</style>
