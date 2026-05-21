<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const { isMod, logout } = useAuth()

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <v-app>
    <v-app-bar density="comfortable">
      <template v-slot:prepend>
        <v-btn
          :ripple="false"
          @click="router.push('/')"
          class="home-btn"
        >
          <v-icon icon="mdi-gift" class="mr-2"></v-icon>
          <span class="text-subtitle-1 font-weight-bold">RedeemMe</span>
        </v-btn>
      </template>

      <v-spacer></v-spacer>

      <template v-slot:append>
        <v-btn v-if="isMod" to="/mod" icon="mdi-cog" size="small" color="pink-lighten-1"></v-btn>
        <v-btn v-if="!isMod" to="/mod/login"  icon="mdi-login" size="small"></v-btn>
        <v-btn v-if="isMod" icon="mdi-logout" size="small" @click="handleLogout"></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.home-btn {
  letter-spacing: 0.05em;
}
</style>