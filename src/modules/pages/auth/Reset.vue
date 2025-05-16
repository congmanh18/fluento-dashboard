<template>
  <q-page class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <h4 class="q-mt-none q-mb-md">Reset Password</h4>
        <p class="text-grey-7 q-mb-lg">
          Please enter your new password below.
        </p>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="password"
            label="New Password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              val => !!val || 'Password is required',
              val => val.length >= 8 || 'Password must be at least 8 characters'
            ]"
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

          <q-input
            v-model="confirmPassword"
            label="Confirm New Password"
            :type="isPwd ? 'password' : 'text'"
            :rules="[
              val => !!val || 'Please confirm your password',
              val => val === password || 'Passwords do not match'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <div>
            <q-btn
              label="Reset Password"
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
import { useRoute } from 'vue-router'

export default {
  name: 'ResetPasswordPage',
  setup () {
    const $q = useQuasar()
    const route = useRoute()
    const password = ref('')
    const confirmPassword = ref('')
    const isPwd = ref(true)
    const loading = ref(false)

    const onSubmit = async () => {
      try {
        loading.value = true
        // TODO: Implement password reset logic here
        // You can get the reset token from route.query.token
        const token = route.query.token
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
        $q.notify({
          color: 'positive',
          message: 'Password has been reset successfully'
        })
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Failed to reset password'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      password,
      confirmPassword,
      isPwd,
      loading,
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
