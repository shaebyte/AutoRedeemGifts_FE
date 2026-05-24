<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import logo from './assets/logo.png'

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
          variant="plain"
        >
          <img :src="logo" alt="RedeemMe" class="logo" />
        </v-btn>
      </template>

      <v-spacer></v-spacer>

      <template v-slot:append>
        <v-btn v-if="isMod" to="/mod" icon="mdi-cog" size="small" color="pink-lighten-1"></v-btn>
        <v-btn v-if="!isMod" to="/mod/login" icon="mdi-login" size="small"></v-btn>
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
  min-width: unset;
  padding: 0 8px;
}

.logo {
  height: 24px;
  width: auto;
  display: block;
}
</style>