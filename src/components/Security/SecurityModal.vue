<template>
  <app-dialog
    v-if="openPasswordChange"
    :status="openPasswordChange"
    icon="mdi-lock"
    :title="getTitle"
    size="big"
    title-id="text--login-popup-title"
    :max-height-size="'500'"
    :hideOverlay="true"
    custom-size="650"
    :max-height="true"
    @changeStatus="$emit('changePasswordChange')"
  >
    <template #app-dialog-body>
      <div v-if="loadingSecurityModal">
        <PostCardLoading :loading="loadingSecurityModal" />
      </div>
      <div v-else>
        <v-card-text class="password-modal" v-if="step === 1">
          <div class="new-password-wrapper">
            <v-row align="center" justify="center" class="mr-0">
              <v-col sm="12" class="p-0">
                <div class="password-modal__list-header">
                  <div
                    id="text--security-popup-login-password"
                    class="new-password-wrapper__label mb-0"
                  >
                    {{ labels.LoginPassword }}
                  </div>
                  <v-btn
                    id="btn-change--security-login-password-dashboard-popup"
                    style="font-weight: 600;"
                    outlined
                    rounded
                    medium
                    color="blue"
                    @click="step = 2"
                    >{{ labels.Change }}</v-btn
                  >
                </div>
                <div class="password-modal__list-header mt-6">
                  <div id="text--security-popup-mfa" class="new-password-wrapper__label mb-0">
                    {{ labels.Mfa }}
                  </div>
                  <v-btn
                    id="btn-status--security-mfa-dashboard-popup"
                    style="font-weight: 600;"
                    outlined
                    rounded
                    medium
                    color="blue"
                    :disabled="mfaStatus === 2"
                    @click="onMfaStatusChangeButton"
                    >{{ mfaStatus === 1 ? labels.Resync : labels.Enable }}</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-text class="password-modal" v-if="step === 2">
          <div class="new-password-wrapper">
            <v-row align="center" justify="center">
              <v-col sm="12" class="p-0 pt-2 pb-6">
                <v-form ref="newPasswordByMain">
                  <div>
                    <label
                      id="label--security-popup-current-password"
                      for="input--security-popup-current-password"
                      class="new-password-wrapper__label d-block mb-2"
                      >Current Password</label
                    >
                    <v-text-field
                      v-model="currentPassword"
                      label="Current password"
                      class="reset-pass-textfield mb-6"
                      data-sentry-mask
                      :rules="[rules.required, rules.minPassword]"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                      :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="show1 ? '' : 'password'"
                      autocomplete="new"
                      id="input--security-popup-current-password"
                      persistent-hint
                      @click:append="show1 = !show1"
                    ></v-text-field>
                  </div>
                  <div>
                    <label
                      id="label--security-popup-new-password"
                      class="new-password-wrapper__label d-block mb-2"
                      for="input--security-popup-new-password"
                      >New Password</label
                    >
                    <v-text-field
                      v-model="newPassword"
                      label="Enter new password"
                      class="reset-pass-textfield mb-6"
                      data-sentry-mask
                      :rules="[rules.required, rules.minPassword, rules.maxPassword, rules.equal]"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                      :append-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="show2 ? '' : 'password'"
                      autocomplete="password"
                      id="input--security-popup-new-password"
                      persistent-hint
                      @click:append="show2 = !show2"
                    ></v-text-field>
                  </div>
                  <div class="pl-2 pr-2">
                    <PasswordChecker :password="newPassword" />
                  </div>
                  <div>
                    <label
                      id="label--security-popup-confirm-password"
                      for="input--security-popup-re-new-password"
                      class="new-password-wrapper__label d-block mb-2"
                      >Confirm Password</label
                    >
                    <v-text-field
                      v-model="reNewPassword"
                      :rules="[rules.required, rules.minPassword, rules.maxPassword, rules.equal]"
                      label="Enter new password again"
                      class="reset-pass-textfield"
                      data-sentry-mask
                      :append-icon="showNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="showNewPassword ? '' : 'password'"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                      autocomplete="new-password"
                      id="input--security-popup-re-new-password"
                      persistent-hint
                      @click:append="showNewPassword = !showNewPassword"
                    ></v-text-field>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-text class="password-modal" v-if="step === 3">
          <div class="new-password-wrapper">
            <v-row align="center" justify="center" class="mr-0">
              <v-col sm="12" class="p-0">
                <v-form ref="refDisableMfa">
                  <div>
                    <label
                      id="label--security-popup-mfa-code"
                      class="new-password-wrapper__label d-block mb-2"
                      for="input--security-popup-mfa-code"
                      >Enter MFA code to disable your MFA status</label
                    >
                    <v-text-field
                      v-model="mfaCode"
                      type="number"
                      id="input--security-popup-mfa-code"
                      placeholder="MFA Code"
                      class="reset-pass-textfield mt-3 max-width-228"
                      outlined
                      hint="*Required"
                      persistent-hint
                      autocomplete="nope"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </div>
                </v-form>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-text class="password-modal" v-if="step === 4">
          <div class="new-password-wrapper">
            <v-row align="center" justify="center" class="mr-0">
              <v-col sm="12" class="p-0">
                <v-form ref="newPasswordByMain">
                  <MFASetup
                    :mfaCode="mfaCode"
                    :mfaSetupDetails="mfaSetupDetails"
                    @confirmSetupMFA="confirmSetupMFA"
                    :rules="rules"
                    :isLogin="false"
                    ref="mfaSetup"
                  />
                </v-form>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </div>
    </template>
    <template v-slot:app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end" v-if="step === 1">
        <v-btn
          text
          id="btn-close--security-dashboard-popup"
          color="#2196f3"
          class="k-dialog__button"
          @click="$emit('changePasswordChange')"
          >{{ labels.Close }}</v-btn
        >
      </div>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end" v-if="step === 2">
        <v-btn
          id="btn-cancel--security-dashboard-popup-step-2"
          text
          color="#f56c6c"
          class="k-dialog__button"
          @click="step = 1"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-confirm--security-dashboard-popup"
          text
          color="#2196f3"
          class="k-dialog__button"
          @click="changePassword"
          >{{ labels.Confirm }}</v-btn
        >
      </div>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end" v-if="step === 3">
        <v-btn
          id="btn-cancel--security-dashboard-popup-step-3"
          text
          color="#f56c6c"
          class="k-dialog__button"
          @click="step = 1"
          >{{ labels.Cancel }}</v-btn
        >
        <v-btn
          id="btn-confirm--security-dashboard-popup"
          text
          color="#2196f3"
          class="k-dialog__button"
          @click="disableMFA"
          >{{ labels.Confirm }}</v-btn
        >
      </div>
      <div
        id="btn-close--security-dashboard-popup"
        class="d-flex download-buttons flex-row flex-wrap justify-end"
        v-if="step === 4"
      >
        <v-btn text color="#f56c6c" class="k-dialog__button" @click="step = 1">{{
          labels.Close
        }}</v-btn>
        <v-btn
          id="btn-confirm--security-dashboard-popup"
          text
          color="#2196f3"
          class="k-dialog__button"
          @click="confirmSetupMFA"
          >{{ labels.Confirm }}</v-btn
        >
      </div>
    </template>
  </app-dialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
import PasswordChecker from '@/components/Common/PasswordChecker/PasswordChecker'
import {
  disableMfaStatus,
  getMfaStatus,
  updatePassword,
  getMfaSetup,
  setMfaResync
} from '@/api/auth'
import MFASetup from '@/components/MFA/MFASetup'
import PostCardLoading from '@/components/SkeletonLoading/PostCardLoading'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import * as Validations from '@/utils/validations'
export default {
  name: 'SecurityModal',
  props: {
    openPasswordChange: { required: true }
  },
  components: {
    MFASetup,
    AppDialog,
    PasswordChecker,
    PostCardLoading
  },
  data() {
    return {
      labels,
      currentPassword: null,
      newPassword: null,
      reNewPassword: null,
      showNewPassword: false,
      show1: false,
      show2: false,
      step: 1,
      rules: {
        email: (value) => {
          return Validations.email(value)
        },
        min: (v) => v.length >= 8 || 'Minimum 8 characters',
        max: (v) => v.length < 254 || 'Email address cannot exceed 254 characters',
        required: (value) => !!value || 'Required',
        minPassword: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
          return (
            pattern.test(value) ||
            'At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character'
          )
        },
        maxPassword: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
          return (
            (value && value.length < 1000 && pattern.test(value)) ||
            'Password must be at most 1000 characters 1 capital letter, 1 lowercase letter, 1 special character and 1 number'
          )
        },
        equal: (v) => v === this.newPassword || "'New password' and 'Confirm password' do not match"
      },
      mfaStatus: null,
      mfaCode: null,
      mfaSetupDetails: null,
      email: null,
      password: null,
      loadingSecurityModal: false
    }
  },
  created() {
    this.getMfaStatus()
  },
  computed: {
    getTitle() {
      let title = null
      if (this.step === 1) {
        title = labels.Security
      }
      if (this.step === 2) {
        title = labels.LoginPassword
      }
      if (this.step === 3) {
        title = labels.DisableMfa
      }
      if (this.step === 4) {
        title = labels.EnableMfa
      }
      return title
    }
  },
  methods: {
    confirmSetupMFA() {
      let payload = {
        code: this.$refs.mfaSetup.mfaCode
      }
      setMfaResync(payload)
        .then(() => {
          this.$emit('changePasswordChange')
          this.$store.dispatch('common/createSnackBar', {
            message: 'Multi-factor authentication enabled',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
          })
        })
        .catch(() => {})
    },
    setupMFA() {
      getMfaSetup()
        .then((response) => {
          this.mfaSetupDetails = response.data['data']
          this.step = 4
        })
        .catch(() => {})
    },
    disableMFA() {
      const payload = { code: this.mfaCode }
      if (this.$refs.refDisableMfa.validate()) {
        disableMfaStatus(payload).then(() => {
          this.$emit('changePasswordChange')
        })
      }
    },
    onMfaStatusChangeButton() {
      this.setupMFA()
    },
    getMfaStatus() {
      this.loadingSecurityModal = true
      getMfaStatus()
        .then((response) => {
          this.mfaStatus = response.data.data.statusId
        })
        .catch(() => {
          this.$emit('changePasswordChange')
        })
        .finally(() => {
          this.loadingSecurityModal = false
        })
    },
    changePassword() {
      if (this.$refs.newPasswordByMain.validate()) {
        let payload = {
          CurrentPassword: this.currentPassword,
          NewPassword: this.newPassword,
          ConfirmNewPassword: this.reNewPassword
        }
        updatePassword(payload).then(() => {
          this.$emit('changePasswordChange')
        })
      }
    }
  }
}
</script>
