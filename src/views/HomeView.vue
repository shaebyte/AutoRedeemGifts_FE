<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/client'

const searchId = ref('')
const found = ref(null)
const searchMsg = ref('')
const searchIcon = ref('mdi-alert-circle')
const notFound = ref(false)

const showCreateForm = ref(false)
const newName = ref('')
const createMsg = ref('')
const createOk = ref(false)
const createLoading = ref(false)
const createAlert = ref(false)

const BASE = import.meta.env.VITE_CODE_API
const codes = ref([])
const codesLoading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch(`${BASE}/gift-codes`)
    const json = await res.json()
    codes.value = json.data.giftCodes
  } catch (e) {
    console.error('Failed to load gift codes', e)
  } finally {
    codesLoading.value = false
  }
})

async function search() {
  found.value = null
  searchMsg.value = ''
  notFound.value = false
  showCreateForm.value = false
  newName.value = ''
  createMsg.value = ''
  createOk.value = false

  if (!searchId.value.trim()) return

  try {
    const { data } = await api.get(`/accounts/${searchId.value.trim()}`)
    if (data.blacklisted) {
      searchMsg.value = 'Hooray you are E X C L U D E D.'
      searchIcon.value = 'mdi-emoticon-kiss-outline'
    } else {
      found.value = data
    }
  } catch {
    searchMsg.value = 'Account not found.'
    searchIcon.value = 'mdi-alert-circle'
    notFound.value = true
  }
}

async function create() {
  createMsg.value = ''
  createOk.value = false
  createAlert.value = false

  if (!newName.value.trim()) {
    createMsg.value = 'Enter a name.'
    return
  }

  createLoading.value = true
  try {
    const { data } = await api.post('/accounts', {
      player_id: searchId.value.trim(),
      name: newName.value.trim(),
    })
    createOk.value = true
    createMsg.value = 'Account created!'
    createAlert.value = true
    searchMsg.value = ''
    found.value = {
      player_id: searchId.value.trim(),
      name: newName.value.trim(),
      ...data,  // eventuele extra velden uit de response
    }
    notFound.value = false
    showCreateForm.value = false
    newName.value = ''
  } catch (e) {
    createMsg.value = e.response?.data?.detail ?? 'Something went wrong.'
  } finally {
    createLoading.value = false
  }
}
</script>

<template>
  <v-container>

    <!-- Search card -->
    <v-row>
      <v-col>
        <v-card title="Subscribe" class="pt-3 pl-3">
          <v-card-text>

            <!-- Search input -->
            <v-row no-gutters align="baseline" class="mt-3">
              <v-col>
                <v-text-field
                  label="Player ID"
                  v-model="searchId"
                  @keyup.enter="search"
                  variant="underlined"
                  hide-details
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon="mdi-magnify"
                  variant="plain"
                  size="x-small"
                  class="ml-2"
                  @click="search"
                />
              </v-col>
            </v-row>

            <!-- Found -->
            <v-row v-if="found" no-gutters align="center" class="mt-6">
              <v-col cols="auto" class="d-flex align-center mr-4">
                <v-icon icon="mdi-check-circle" size="large" color="success" class="mr-2" />
                {{ found.player_id }}
              </v-col>
              <v-col cols="auto" class="d-flex align-center">
                <v-icon icon="mdi-account-circle" size="large" color="pink-lighten-1" class="mr-2" />
                {{ found.name }}
              </v-col>
            </v-row>

            <!-- Nieuw: alert na aanmaken account -->
            <v-row v-if="createAlert" no-gutters class="mt-3">
              <v-col>
                <v-alert
                  type="success"
                  density="compact"
                  closable
                  @click:close="createAlert = false"
                >
                  {{ createMsg }}
                </v-alert>
              </v-col>
            </v-row>

            <!-- Not found / blacklisted message -->
            <v-row v-else-if="searchMsg && !found" no-gutters align="center" class="mt-6">
              <v-col cols="auto" class="d-flex align-center">
                <v-icon :icon="searchIcon" size="large" color="red" class="mr-2" />
                <span class="msg-err">{{ searchMsg }}</span>
              </v-col>
            </v-row>

            <!-- Register prompt -->
            <v-row v-if="notFound && !showCreateForm" no-gutters class="mt-4">
              <v-col>
                <v-btn
                  variant="tonal"
                  color="primary"
                  prepend-icon="mdi-account-plus"
                  @click="showCreateForm = true"
                >
                  Subscribe
                </v-btn>
              </v-col>
            </v-row>

            <!-- Register form (progressive disclosure) -->
            <template v-if="showCreateForm">
              <v-row no-gutters align="baseline" class="mt-5">
                <v-col>
                  <v-text-field
                    label="Name"
                    v-model="newName"
                    @keyup.enter="create"
                    variant="underlined"
                    hide-details
                    autofocus
                  />
                </v-col>
                <v-col cols="auto" class="d-flex align-center ml-2 gap-1">
                  <v-btn
                    icon="mdi-check"
                    color="success"
                    variant="plain"
                    size="x-small"
                    :loading="createLoading"
                    @click="create"
                  />
                  <v-btn
                    icon="mdi-close"
                    color="error"
                    variant="plain"
                    size="x-small"
                    @click="showCreateForm = false"
                  />
                </v-col>
              </v-row>

              <v-row v-if="createMsg" no-gutters class="mt-2">
                <v-col>
                  <span :class="createOk ? 'msg-ok' : 'msg-err'">{{ createMsg }}</span>
                </v-col>
              </v-row>
            </template>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gift Codes -->
    <v-row class="mt-10">
      <v-col>
        <v-card title="Gift Codes" class="pt-3 pl-3" style="overflow: hidden">
          <v-card-text class="px-0 pb-2">
            <p v-if="codesLoading">Loading...</p>
            <v-table v-else-if="codes.length" class="rounded-0">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Expiration date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in codes" :key="c.id">
                  <td>{{ c.code }}</td>
                  <td>{{ c.expiresAt ? c.expiresAt.slice(0, 10) : '' }}</td>
                </tr>
              </tbody>
            </v-table>
            <p v-else>No gift codes found.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>