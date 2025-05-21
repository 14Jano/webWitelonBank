<template>
  <div class="login-page">
    <Login v-if="!awaiting2FA" @2fa-required="on2FARequired" />
    <TwoFA v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Login from '../components/Login.vue'
import TwoFA from '../components/TwoFactor.vue'

const awaiting2FA = ref(false)

const on2FARequired = () => {
  awaiting2FA.value = true
}
</script>

<style scoped>
.login-page {
  padding: 2rem;
}
</style>
