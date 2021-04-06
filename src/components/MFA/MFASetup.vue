<template>
  <div class="mfa-setup" :class="{ 'mfa-setup--dashboard': !isLogin }">
    <v-card-text>
      <div class="login-title" v-if="isLogin">
        Setup Multi-factor Authentication
      </div>
      <div class="mfa-setup__content">
        <v-row align="center" justify="center">
          <v-col sm="12">
            <p class="mfa-setup__content--header">
              1. Install an MFA app on your mobile device
            </p>
            <p class="mfa-setup__content--text">
              Compatible MFA applications to login with: <br />
              Authy, Duo Mobile, LastPass Authenticator, Microsoft Authenticator, Google
              Authenticator
            </p>
          </v-col>
          <v-col sm="12">
            <p class="mfa-setup__content--header mb-3">
              2. Scan the QR code with your device’s camera using your virtual MFA app
            </p>
            <div class="d-flex">
              <div class="mfa-setup__content--image">
                <img :src="mfaSetupDetails && mfaSetupDetails.qrCodeSetupImageUrl" alt="qrCode" />
              </div>
              <div class="mfa-setup__content--qr-details">
                <div class="mb-2 mt-5">
                  If you are unable to scan the QR code, please enter this code manually into the
                  app.
                </div>
                <div class="mfa-setup__content--qr-details--code">
                  {{ mfaSetupDetails && mfaSetupDetails.manualEntryKey }}
                </div>
              </div>
            </div>
          </v-col>
          <v-col sm="12">
            <p class="mfa-setup__content--header">
              3. Enter MFA code
            </p>
          </v-col>
          <v-col sm="12">
            <v-form
              ref="refMfaSetupForm"
              :lazy-validation="false"
              @submit="(event) => event.preventDefault()"
            >
              <div>
                <label class="mfa-setup__content--header p-0">MFA Code</label>
                <v-text-field
                  v-model.trim="mfaCode"
                  :rules="[rules.required]"
                  placeholder="Enter Code"
                  class="mfa-setup__content-textfield"
                  outlined
                  :class="{ 'input-error': isErrorActive }"
                  validate-on-blur
                  autocomplete="disabled"
                  hint="*Required"
                  persistent-hint
                  type="number"
                  onkeypress="return event.keyCode === 8 || event.charCode >= 48 && event.charCode <= 57"
                  v-on:keyup.enter="$emit('confirmSetupMFA', mfaCode)"
                ></v-text-field>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
    <v-card-actions class="justify-center" v-if="isLogin">
      <v-btn
        id="btn-setup--mfa-dashboard-popup"
        color="blue"
        class="pl-4 white--text login_setup-mfa-button"
        rounded
        @click="$emit('confirmSetupMFA', mfaCode)"
      >
        SETUP MFA
        <v-icon right dark>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MFASetup',
  props: {
    mfaSetupDetails: {
      default: false
    },
    rules: {
      required: false
    },
    isLogin: {
      default: false
    }
  },
  data() {
    return {
      mfaCode: null
    }
  },
  computed: {
    ...mapGetters({
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus'
    })
  }
}
</script>

<style lang="scss">
.mfa-setup {
  &--dashboard {
    .mfa-setup__content-textfield {
      .v-text-field__slot {
        input {
          padding-bottom: 0 !important;
          padding-top: 0 !important;
        }
      }
    }
    .v-card__text {
      padding-top: 0;
    }
    .mfa-setup__content {
      .row {
        :first-child {
          padding-top: 0;
        }
      }
    }
  }
}
</style>
