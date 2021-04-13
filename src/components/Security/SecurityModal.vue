<template>
  <app-dialog
    :status="openPasswordChange"
    v-if="openPasswordChange"
    icon="mdi-lock"
    :title="getTitle"
    size="big"
    @changeStatus="$emit('changePasswordChange')"
    :max-height-size="'500'"
  >
    <template v-slot:app-dialog-body>
      <div v-if="loadingSecurityModal">
        <PostCardLoading :loading="loadingSecurityModal" />
      </div>
      <div v-else>
        <v-card-text class="password-modal" v-if="step === 1">
          <div class="new-password-wrapper">
            <v-row align="center" justify="center" class="mr-0">
              <v-col sm="12" class="p-0">
                <div class="password-modal__list-header">
                  <label class="new-password-wrapper__label mb-0">{{ labels.LoginPassword }}</label>
                  <v-btn
                    id="btn-change--security-login-password-dashboard-popup"
                    outlined
                    rounded
                    medium
                    color="blue"
                    @click="step = 2"
                    >{{ labels.Change }}</v-btn
                  >
                </div>
                <div class="password-modal__list-header mt-6">
                  <label class="new-password-wrapper__label mb-0">{{ labels.Mfa }}</label>
                  <v-btn
                    id="btn-status--security-mfa-dashboard-popup"
                    outlined
                    rounded
                    medium
                    color="blue"
                    @click="onMfaStatusChangeButton"
                    >{{ mfaStatus ? labels.Resync : labels.Enable }}</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-text class="password-modal" v-if="step === 2">
          <div class="new-password-wrapper">
            <v-row align="center" justify="center">
              <v-col sm="12" class="p-0">
                <v-form ref="newPasswordByMain">
                  <div>
                    <label class="new-password-wrapper__label d-block mb-2">Current Password</label>
                    <v-text-field
                      v-model="currentPassword"
                      label="Current password"
                      class="reset-pass-textfield mb-6"
                      :rules="[rules.required, rules.minPassword]"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                      :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="show1 ? '' : 'password'"
                      @click:append="show1 = !show1"
                      autocomplete="new"
                      :id="dynamicID"
                      browser-autocomplete="username"
                      persistent-hint
                    ></v-text-field>
                  </div>
                  <div>
                    <label class="new-password-wrapper__label d-block mb-2">New Password</label>
                    <v-text-field
                      v-model="newPassword"
                      label="Enter new password"
                      class="reset-pass-textfield mb-6"
                      :rules="[rules.required, rules.minPassword, rules.equal]"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                      :append-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="show2 ? '' : 'password'"
                      @click:append="show2 = !show2"
                      autocomplete="password"
                      :id="dynamicID"
                      browser-autocomplete="password"
                      persistent-hint
                    ></v-text-field>
                  </div>
                  <div class="pl-2 pr-2">
                    <PasswordChecker :password="newPassword" />
                  </div>
                  <div>
                    <label class="new-password-wrapper__label d-block mb-2">Confirm Password</label>
                    <v-text-field
                      v-model="reNewPassword"
                      :rules="[rules.required, rules.minPassword, rules.equal]"
                      label="Enter new password again"
                      class="reset-pass-textfield"
                      :append-icon="showNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                      :type="showNewPassword ? '' : 'password'"
                      @click:append="showNewPassword = !showNewPassword"
                      outlined
                      hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                      autocomplete="new-password"
                      :id="dynamicID"
                      browser-autocomplete="new-password"
                      persistent-hint
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
                    <label class="new-password-wrapper__label d-block mb-2"
                      >Enter MFA code to disable your MFA status</label
                    >
                    <v-text-field
                      type="number"
                      v-model="mfaCode"
                      placeholder="MFA Code"
                      class="reset-pass-textfield mt-3 max-width-228"
                      :rules="[rules.required]"
                      outlined
                      hint="*Required"
                      persistent-hint
                      autocomplete="nope"
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
        <v-btn text color="#f56c6c" class="k-dialog__button" @click="step = 1">{{
          labels.Cancel
        }}</v-btn>
        <v-btn text color="#2196f3" class="k-dialog__button" @click="changePassword">{{
          labels.Confirm
        }}</v-btn>
      </div>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end" v-if="step === 3">
        <v-btn text color="#f56c6c" class="k-dialog__button" @click="step = 1">{{
          labels.Cancel
        }}</v-btn>
        <v-btn text color="#2196f3" class="k-dialog__button" @click="disableMFA">{{
          labels.Confirm
        }}</v-btn>
      </div>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end" v-if="step === 4">
        <v-btn text color="#f56c6c" class="k-dialog__button" @click="step = 1">{{
          labels.Close
        }}</v-btn>
        <v-btn text color="#2196f3" class="k-dialog__button" @click="confirmSetupMFA">{{
          labels.Confirm
        }}</v-btn>
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
  getMfaQRCode,
  setMFA,
  updatePassword,
  getMfaSetup,
  setMfaResync
} from '@/api/auth'
import MFASetup from '@/components/MFA/MFASetup'
import PostCardLoading from '@/components/SkeletonLoading/PostCardLoading'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
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
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
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
    dynamicID() {
      return 'dynamicID-' + Math.floor(Math.random() * Date.now().toString())
    },
    getTitle() {
      let title = null
      switch (this.step) {
        case 1:
          title = labels.Security
          break
        case 2:
          title = labels.LoginPassword
          break
        case 3:
          title = labels.DisableMfa
          break
        case 4:
          title = labels.EnableMfa
          break
        default:
          break
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
      let email, password
      this.$vlf.getItem('username', (err, username = '') => {
        if (!err) {
          email = username
        }
      })

      this.$vlf.getItem('password', (err, password) => {
        if (!err) {
          password = password
          let payload = {
            email,
            password
          }
          getMfaSetup(payload)
            .then((response) => {
              this.mfaSetupDetails = response.data['data']
              this.step = 4
            })
            .catch(() => {})
        }
      })
    },
    disableMFA() {
      const payload = { code: this.mfaCode }
      if (this.$refs.refDisableMfa.validate()) {
        disableMfaStatus(payload).then((response) => {
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
        .catch((response) => {
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

<style lang="scss">
.password-modal {
  padding: 0 !important;
  .v-text-field__slot {
    input {
      pointer-events: none;
    }
  }
  &__list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .new-password-wrapper {
    .v-btn {
      min-width: 95px;
    }
    &__label {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding: 0 15px;
      margin-bottom: 8px;
    }
  }
  .back-to-reset-password {
    display: flex;
    background-color: white;
    position: absolute;
    bottom: 24px;
    right: 24px;
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    text-transform: uppercase;
    i {
      color: #2196f3;
    }
    cursor: pointer;
  }
  .reset-pass-textfield {
    padding: 0 15px !important;
  }
  .login-error-container {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 15px;
    width: 100%;
  }

  .login-error-wrapper {
    width: 300px;
    border-radius: 3px;
    background-color: rgba(245, 108, 108, 0.2);
    padding: 22px 16px;
    display: flex;
    flex-direction: row;

    .login-error-icon {
      i {
        font-size: 24px !important;
        margin-bottom: -1px;
      }
    }

    .login-error-message {
      align-self: center;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
    }
  }

  .reset-password-wrapper {
    .v-text-field.v-text-field--solo .v-input__control {
      min-height: 20px !important;
      padding: 0;
    }
    &__success {
      min-height: 300px;
    }
  }

  .forgot-password {
    align-items: center;
    text-decoration: none;
    color: black;
    cursor: pointer;
    font-size: 11px;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
  }

  .login-remember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .v-input--checkbox {
      label.v-label.theme--light {
        font-size: 11px;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: rgba(0, 0, 0, 0.87) !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light {
        font-size: 20px !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light.accent--text {
        font-size: 20px !important;
      }
    }
  }

  .mdi-eye-off-outline::before {
    color: rgba(0, 0, 0, 0.26);
  }

  .v-input {
    height: 40px !important;
  }

  .v-input .v-label {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    height: 20px;
    font-weight: 600;
  }

  .login-desc {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.54);
    margin-bottom: 32px;
  }

  .login-title {
    margin-top: 88px;
    margin-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 36px;
    font-weight: 600;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }

  .v-sheet {
    border-radius: 20px;
  }

  .v-card-login-wrapper {
    border-radius: 20px !important;
    padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
  }

  .background {
    height: 100%;
    width: 100%;
    background-image: url('../../assets/img/login-bg.svg') !important;
    background-position: left top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
    flex-flow: column !important;
    position: absolute;
  }

  .v-input--selection-controls__ripple {
    margin-right: 0 !important;
    width: 20px !important;
    height: 20px !important;
    left: -5px !important;
    top: calc(50% - 17px) !important;
  }

  .remember-me-check {
    &.v-input--checkbox.v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
      height: auto !important;
    }
    padding-left: 5px;

    label {
      color: rgba(0, 0, 0, 0.87) !important;
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400 !important;
      font-size: 9px;
      left: -8px !important;
    }
  }

  .login-btn {
    height: 36px !important;
    min-width: 132px !important;
  }

  .captcha-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    width: 100%;
    margin-top: 16px;

    > div {
      max-width: 300px;
    }
  }

  .login-user-pass-wrapper > .row > div {
    max-width: 300px;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
  }

  .login-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  @media only screen and (max-width: 769px) {
    .login-card-wrapper {
      padding: 10px !important;
      padding-right: 16px !important;
    }
  }
}
</style>
