<template>
  <div class="mfa-login">
    <v-card-text>
      <div class="login-title">
        Multi-factor Authentication
      </div>
      <div class="login-desc">
        <p class="mb-2">Please enter your verification code</p>
      </div>
      <div class="verification-code-wrapper">
        <v-row align="center" justify="center">
          <v-col md="6" sm="12" class="mb-6">
            <v-form ref="refMfaLoginForm" @submit="(event) => event.preventDefault()">
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
                type="number"
                v-on:keyup.enter="
                  $emit('verificationCodeLogin', false, verificationCode, rememberMeOnThisDevice)
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
                :label="`Don't ask again on this computer`"
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
                Can't login?
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        id="btn--login-continue"
        color="blue"
        class="pl-4 white--text"
        rounded
        @click="$emit('verificationCodeLogin', false, verificationCode, rememberMeOnThisDevice)"
      >
        Continue
        <v-icon right dark>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MFALogin',
  computed: {
    ...mapGetters({
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus'
    })
  },
  props: {
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
