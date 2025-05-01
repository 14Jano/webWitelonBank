<template>
  <header class="navbar flex justify-between items-center">
      <div class="logo w-10">
        <FontAwesomeIcon :icon="faBank" id="icon" class="ms-3" style="height: 3rem" />

      </div>
      <nav class="navbar-links">
        <ul class="navbar-list flex gap-4 float-end p-5">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
        </ul>
      </nav>
  </header>
</template>

<script setup lang="ts">

import {faBank} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


</script>


<style scoped>
.navbar {
  padding: 0;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
#icon:hover {
  transition: 0.5s ease;
  color: #e11313;
}
</style>
