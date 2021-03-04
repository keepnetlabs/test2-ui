<template>
  <div class="mfa-cant-login">
    <v-card-text>
      <div class="login-title">
        Login with SMS Authentication
      </div>
      <div class="login-desc">
        <p class="mb-2">
          An SMS with verification code is sent to {{ phoneNumber }}. Enter the verification code
          below to continue
        </p>
      </div>
      <div class="verification-code-wrapper">
        <v-row align="center" justify="center">
          <v-col md="6" sm="12" class="mb-6">
            <v-form ref="refMfaCantLoginForm" @submit="(event) => event.preventDefault()">
              <v-text-field
                v-model.trim="verificationCode"
                class="verification-code-wrapper--textfield"
                :class="{ 'input-error': isErrorActive }"
                validate-on-blur
                placeholder="Verification Code"
                hint="*Required"
                persistent-hint
                outlined
                dense
                autocomplete="disabled"
                required
                :rules="[rules.required]"
                v-on:keyup.enter="
                  $emit('verificationCodeLogin', true, verificationCode, rememberMeOnThisDevice)
                "
              />
            </v-form>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col class="pl-0 pt-1 pb-0" md="6" xs="12">
            <div class="verification-code-wrapper__remember d-flex">
              <v-checkbox
                v-model.trim="rememberMeOnThisDevice"
                :label="`Remember me on this device`"
                class="remember-me-check"
                hide-details
                dense
                color="#2196f3"
              >
              </v-checkbox>

              <div
                @click="$emit('onCantLoginButtonClick')"
                class="verification-code-wrapper__cant-login"
              >
                Resend message
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="blue"
        class="pl-4 white--text"
        rounded
        @click="$emit('verificationCodeLogin', true, verificationCode, rememberMeOnThisDevice)"
      >
        Login
        <v-icon right dark>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MFACantLogin',
  computed: {
    ...mapGetters({
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus'
    })
  },
  props: {
    phoneNumber: {
      required: false
    },
    validReset: {
      required: false
    },
    verificationCode: {
      required: false
    },
    rememberMeOnThisDevice: {
      required: false
    },
    onCantLoginButtonClick: {
      required: false
    },
    verificationCodeLogin: {
      required: false
    },
    rules: {
      required: false
    }
  }
}
</script>

<style scoped></style>
