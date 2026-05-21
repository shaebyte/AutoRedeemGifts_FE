<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const password = ref('')
const error = ref('')
const router = useRouter()
const { login } = useAuth()

async function submit() {
  error.value = ''
  try {
    await login(password.value)
    router.push('/mod')
  } catch {
    error.value = 'Wrong password.'
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card title="Login" class="pt-3 pl-3">
          <v-card-text>

            <v-row no-gutters align="baseline" class="mt-3">
              <v-col>
                <v-text-field
                  label="Password"
                  v-model="password"
                  type="password"
                  @keyup.enter="submit"
                  variant="underlined"
                  hide-details
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  icon="mdi-login"
                  variant="plain"
                  size="small"
                  class="ml-2"
                  @click="submit"
                />
              </v-col>
            </v-row>

            <v-row v-if="error" no-gutters class="mt-2">
              <v-col>
                <span class="msg-err">{{ error }}</span>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>