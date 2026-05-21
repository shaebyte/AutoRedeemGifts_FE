<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/client'

const accounts = ref([])
const attempts = ref([])
const editing = ref(null)
const saveMsg = ref('')

onMounted(async () => {
  const [a, r] = await Promise.all([
    api.get('/accounts'),
    api.get('/redeem-attempts'),
  ])
  accounts.value = a.data
  attempts.value = r.data
})

function startEdit(acc) {
  editing.value = { player_id: acc.player_id, name: acc.name, comments: acc.comments ?? '' }
}

async function saveEdit(acc) {
  await api.put(`/accounts/${acc.player_id}`, {
    name: editing.value.name,
    comments: editing.value.comments,
  })
  acc.name = editing.value.name
  acc.comments = editing.value.comments
  editing.value = null
  saveMsg.value = 'Opgeslagen!'
  setTimeout(() => (saveMsg.value = ''), 2000)
}

async function toggleBlacklist(acc) {
  await api.put(`/accounts/${acc.player_id}`, { blacklisted: !acc.blacklisted })
  acc.blacklisted = !acc.blacklisted
}
</script>

<template>
  <section>
    <h2>Accounts</h2>
    <p v-if="saveMsg" class="msg-ok">{{ saveMsg }}</p>
    <table>
      <thead>
        <tr>
          <th>Player ID</th>
          <th>Naam</th>
          <th>Status</th>
          <th>Comments</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="acc in accounts" :key="acc.player_id">
          <td>{{ acc.player_id }}</td>
          <td>
            <span v-if="editing?.player_id !== acc.player_id">{{ acc.name }}</span>
            <input v-else v-model="editing.name" style="width:120px" />
          </td>
          <td>
            <button
              :class="acc.blacklisted ? 'tag-unban' : 'tag-ban'"
              @click="toggleBlacklist(acc)"
            >
              {{ acc.blacklisted ? 'Unban' : 'Ban' }}
            </button>
          </td>
          <td>
            <span v-if="editing?.player_id !== acc.player_id">{{ acc.comments }}</span>
            <input v-else v-model="editing.comments" style="width:160px" />
          </td>
          <td>
            <button v-if="editing?.player_id !== acc.player_id" @click="startEdit(acc)">
              Bewerken
            </button>
            <button v-else @click="saveEdit(acc)">Opslaan</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <section>
    <h2>Redeem Pogingen</h2>
    <table>
      <thead>
        <tr>
          <th>Player ID</th>
          <th>Code</th>
          <th>Status</th>
          <th>Pogingen</th>
          <th>Fout</th>
          <th>Tijdstip</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in attempts" :key="`${r.player_id}-${r.gift_code}`">
          <td>{{ r.player_id }}</td>
          <td>{{ r.gift_code }}</td>
          <td>{{ r.status }}</td>
          <td>{{ r.attempt_count }}</td>
          <td>{{ r.error_message ?? '-' }}</td>
          <td>{{ r.redeemed_at }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
