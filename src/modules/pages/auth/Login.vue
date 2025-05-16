<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="q-mt-none q-mb-md">Login</h4>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required', isValidEmail]"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[val => !!val || 'Password is required']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <div class="row items-center justify-between">
            <q-checkbox v-model="rememberMe" label="Remember me" />
            <q-btn flat color="primary" label="Forgot Password?" to="/auth/forgot" />
          </div>

          <div>
            <q-btn
              label="Login"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-sm">
            Don't have an account?
            <q-btn flat color="primary" label="Register" to="/auth/register" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'LoginPage',
  setup () {
    const $q = useQuasar()
    const email = ref('')
    const password = ref('')
    const isPwd = ref(true)
    const rememberMe = ref(false)
    const loading = ref(false)

    const isValidEmail = (val) => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    }

    const onSubmit = async () => {
      try {
        loading.value = true
        // TODO: Implement login logic here
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
        $q.notify({
          color: 'positive',
          message: 'Login successful'
        })
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Login failed'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      isPwd,
      rememberMe,
      loading,
      isValidEmail,
      onSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>
