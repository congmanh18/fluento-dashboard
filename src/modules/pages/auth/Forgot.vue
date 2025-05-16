<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="q-mt-none q-mb-md">Forgot Password</h4>
        <p class="text-grey-7 q-mb-lg">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
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

          <div>
            <q-btn
              label="Send Reset Link"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-sm">
            Remember your password?
            <q-btn flat color="primary" label="Login" to="/auth/login" />
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
  name: 'ForgotPasswordPage',
  setup () {
    const $q = useQuasar()
    const email = ref('')
    const loading = ref(false)

    const isValidEmail = (val) => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Invalid email'
    }

    const onSubmit = async () => {
      try {
        loading.value = true
        // TODO: Implement forgot password logic here
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
        $q.notify({
          color: 'positive',
          message: 'Password reset link sent to your email'
        })
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Failed to send reset link'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      email,
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
