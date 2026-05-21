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
  <header>
    <nav>
      <RouterLink to="/">Redeem.ME</RouterLink>
<RouterLink v-if="isMod" to="/mod">Moderator</RouterLink>
      <RouterLink v-if="!isMod" to="/mod/login">Mod Login</RouterLink>
      <button v-if="isMod" @click="handleLogout">Uitloggen</button>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #22223B; color: #222; }
header { background: #22223B; padding: 1rem 2rem; }
nav { display: flex; gap: 1.5rem; align-items: center; }
nav a { color: #eee; text-decoration: none; }
nav a.router-link-active { color: #e94560; font-weight: bold; }
nav button { margin-left: auto; background: #e94560; border: none; color: white; padding: 0.4rem 1rem; cursor: pointer; border-radius: 4px; }
main { max-width: 960px; margin: 2rem auto; padding: 0 1rem; }
section { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
h2 { margin-bottom: 1rem; font-size: 1.1rem; }
input { padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; margin-right: 0.5rem; }
button { padding: 0.4rem 1rem; background: #22223B; color: white; border: none; border-radius: 4px; cursor: pointer; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { text-align: left; padding: 0.5rem 0.75rem; border-bottom: 1px solid #eee; }
th { background: #f0f0f0; }
.tag-ban { background: #e94560; color: white; border: none; border-radius: 4px; padding: 0.2rem 0.6rem; cursor: pointer; font-size: 0.8rem; }
.tag-unban { background: #2ecc71; color: white; border: none; border-radius: 4px; padding: 0.2rem 0.6rem; cursor: pointer; font-size: 0.8rem; }
.msg-ok { color: green; margin-top: 0.5rem; }
.msg-err { color: red; margin-top: 0.5rem; }
</style>
