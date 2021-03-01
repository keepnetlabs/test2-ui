<template>
  <div class="mfa-welcome">
    <v-card-text>
      <div class="login-title">
        Setup Multi-factor Authentication
      </div>
      <div class="login-desc">
        You must enable multi-factor authentication on your account until
        {{ getExpireTime }}. From that date login will require multi-factor authentication.
      </div>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="blue"
        class="pl-4 white--text login_without-continue-button"
        rounded
        @click="$emit('withoutContinueMFA')"
        v-if="mfaDetails && !mfaDetails.IsExpired"
      >
        CONTINUE WITHOUT MFA
      </v-btn>
      <v-btn
        color="blue"
        class="pl-4 white--text login_setup-mfa-button"
        rounded
        @click="$emit('setupMFA')"
      >
        SETUP MFA
        <v-icon right dark>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { datePrettier } from '@/utils/functions'

export default {
  name: 'MFAWelcome',
  props: {
    mfaDetails: {
      required: false
    },
    rules: {
      required: false
    }
  },
  computed: {
    ...mapGetters({
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus'
    }),
    getExpireTime() {
      if (!this.mfaDetails || !this.mfaDetails.ExpireTime) {
        return false
      }
      return datePrettier(this.mfaDetails.ExpireTime)
    }
  }
}
</script>

<style scoped></style>
