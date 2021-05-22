<template>
  <v-app class="login-page">
    <v-snackbar v-model.trim="snackbar" :color="getColor" top right :timeout="3000">
      {{ getErrors }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-overlay :value="isLoading > 0" z-index="999">
      <div class="text-center">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </div>
    </v-overlay>
    <div class="background"></div>
    <v-content>
      <v-container
        style="height: 100%;"
        fluid
        class="ml-0 pl-0 pr-0 pt-0 pb-0 mr-0 d-flex align-center justify-center"
      >
        <v-row align="center" justify="center" style="height: 100%;">
          <v-col class="login-card-wrapper" lg="12" xs="12">
            <v-card max-width="720" class="mx-auto my-auto v-card-login-wrapper">
              <v-card-title
                class="d-flex pa-0 align-center justify-center login-card-wrapper__logo"
              >
                <div style="max-width: 180px; height: 60px;">
                  <img
                    id="img--login-main-logo"
                    style="height: 100%;"
                    :src="loginWhiteLabel.mainLogoUrl"
                  />
                </div>
              </v-card-title>
              <div v-if="pageNumber === 1">
                <v-card-text class="pa-0">
                  <div id="text--login-title" class="login-title">
                    {{
                      isSessionExpired
                        ? 'Session Expired'
                        : `Welcome To ${loginWhiteLabel.brandName}`
                    }}
                  </div>
                  <div id="text--login-description" class="login-desc mb-14">
                    {{
                      isSessionExpired
                        ? 'Your session has been timed out. Please log in.'
                        : showPasswordField
                        ? `Enter password for ${email}`
                        : 'Please Login'
                    }}
                  </div>
                  <div v-if="isErrorActive" class="login-error-container">
                    <div v-if="isErrorActive" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div id="text--login-error" class="login-error-message pr-1">
                        {{ getErrors }}
                      </div>
                    </div>
                  </div>
                  <div v-if="showMfaMessage" class="login-error-container">
                    <div class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div id="text--multifactor-message" class="login-error-message pr-1">
                        {{ 'Multifactor authentication is required' }}
                      </div>
                    </div>
                  </div>
                  <div v-if="isPasswordStep5Complete" class="login-success-container">
                    <div v-if="isPasswordStep5Complete" class="login-success-wrapper">
                      <div class="login-success-icon dark pr-2">
                        <v-icon large color="#ffffff"> mdi-check-circle-outline</v-icon>
                      </div>
                      <div
                        id="text--password-has-been-set-message"
                        class="login-success-message pr-1"
                      >
                        Your password has been set successfully
                      </div>
                    </div>
                  </div>
                  <div v-if="isMfaAuthenticated" class="login-success-container">
                    <div v-if="isMfaAuthenticated" class="login-success-wrapper">
                      <div class="login-success-icon dark pr-2">
                        <v-icon large color="#ffffff"> mdi-check-circle-outline</v-icon>
                      </div>
                      <div id="text--mfa-authenticated-message" class="login-success-message pr-1">
                        {{ mfaAuthenticatedMessage }}
                      </div>
                    </div>
                  </div>
                  <div class="login-user-pass-wrapper">
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0 pb-4" md="6" sm="12">
                        <v-form
                          @submit="(event) => event.preventDefault()"
                          v-model.trim="validEmail"
                          autocomplete="off"
                          :ref="showPasswordField ? 'password' : 'email'"
                        >
                          <v-text-field
                            v-if="!showPasswordField"
                            id="input--login-email"
                            :type="'email'"
                            name="email"
                            ref="email"
                            v-model.trim="email"
                            :rules="[
                              rules.required,
                              rules.min,
                              rules.email,
                              rules.max,
                              rules.controlEmail
                            ]"
                            class="username-field"
                            required
                            label="Username or email"
                            outlined
                            @keyup.enter="toNext"
                            :class="{ 'input-error': isErrorActive }"
                            validate-on-blur
                            autocomplete="disabled"
                          ></v-text-field>
                          <v-text-field
                            v-else
                            id="input--login-password"
                            :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? '' : 'password'"
                            name="password"
                            ref="password"
                            v-model.trim="password"
                            class="username-field input-group--focused"
                            @click:append="show1 = !show1"
                            v-on:keyup.enter="onLoginClicked()"
                            label="Password"
                            outlined
                            :class="{ 'input-error': isErrorActive }"
                            validate-on-blur
                            autocomplete="disabled"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                    <v-row v-if="showPasswordField" align="center" justify="center">
                      <v-col class="pl-0 pt-0 pr-2 pb-0" md="6" xs="12">
                        <div class="login-remember d-flex">
                          <v-checkbox
                            v-model.trim="rememberMe"
                            id="input--is-remember-me"
                            :label="`Remember`"
                            style="visibility: hidden;"
                            class="remember-me-check"
                            hide-details
                            dense
                            color="#2196f3"
                          >
                          </v-checkbox>

                          <div
                            id="btn--login-forget-password"
                            @click="onForgetPasswordButtonClick()"
                            class="forgot-password"
                          >
                            Forgot Password
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <div v-if="wrongLoginAttempt > 2" class="captcha-wrapper">
                  <vue-recaptcha
                    :sitekey="recaptcha"
                    :loadRecaptchaScript="true"
                    ref="recaptcha"
                    @verify="onCaptchaVerified"
                    @expired="onCaptchaExpired"
                  ></vue-recaptcha>
                </div>
                <v-card-actions class="justify-center login-button mt-0">
                  <v-btn
                    color="blue"
                    id="btn--login-continue"
                    class="pl-4 white--text login-btn"
                    rounded
                    @click="handleContinueClick"
                  >
                    CONTINUE
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber == 2">
                <v-card-text>
                  <div id="text--login-reset-your-password-title" class="login-title">
                    Reset Your Password
                  </div>
                  <div id="text--login-reset-your-password-subtitle" class="login-desc">
                    <p class="mb-2">Enter your email address to</p>
                    <p class="mb-0">recieve the reset password link</p>
                  </div>
                  <div v-if="resetPasswordError" class="login-error-container">
                    <div v-if="resetPasswordError" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div
                        id="text--login-reset-password-error-text"
                        class="login-error-message pr-1"
                      >
                        {{ resetPasswordErrorText }}
                      </div>
                    </div>
                  </div>
                  <div class="reset-password-wrapper">
                    <v-row align="center" justify="center">
                      <v-col md="6" sm="12">
                        <v-form ref="resetEmail">
                          <InputEmail
                            v-model.trim="resePasswordModel"
                            id="input--login-reset-password"
                            class="reset-pass-textfield"
                            @click="resetPasswordError = false"
                            :class="{ 'input-error': isErrorActive }"
                            validate-on-blur
                          />
                          <div class="captcha-wrapper p-0" style="height: 78px;">
                            <vue-recaptcha
                              :sitekey="recaptcha"
                              :loadRecaptchaScript="true"
                              ref="resetRecaptcha"
                              @verify="captchaVerifiedForReset"
                              @expired="onCaptchaExpired"
                            ></vue-recaptcha>
                          </div>
                        </v-form>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    id="btn--login-send-reset-link"
                    color="blue"
                    class="pl-4 white--text"
                    rounded
                    @click="onResetClick"
                  >
                    SEND RESET LINK
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber == 3" class="reset-password-wrapper__success">
                <v-card-text>
                  <div id="text--login-check-your-email-title" class="login-title">
                    Check Your Email
                  </div>
                  <div id="text--login-check-your-email-subtitle" class="login-desc">
                    <p class="mb-2">We have sent an email to your email address.</p>
                    <p class="mb-0">Click the link the email to reset your password</p>
                    <div v-if="pageNumber === 3">
                      <div
                        id="text--login-check-your-email-i-didnt-receive-email"
                        class="back-to-reset-password"
                        @click="
                          pageNumber = 2
                          clearError()
                        "
                      >
                        I didn’t recieve the email
                        <v-icon right dark class="pr-2">mdi-arrow-right</v-icon>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </div>
              <div v-if="pageNumber === 5">
                <v-card-text>
                  <div id="text--login-reset-your-new-password-title" class="login-title">
                    Reset Your Password
                  </div>
                  <div id="text--login-reset-your-new-password-subtitle" class="login-desc">
                    Enter your new password
                  </div>
                  <div
                    id="container--login-new-password-error"
                    v-if="newPasswordError"
                    class="login-error-container"
                  >
                    <div v-if="newPasswordError" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div
                        id="text--login-new-password-error-text"
                        class="login-error-message pr-1"
                      >
                        {{ newPasswordErrorText }}
                      </div>
                    </div>
                  </div>
                  <div v-if="isPassworAreEqual()" class="login-error-container">
                    <div v-if="isPassworAreEqual()" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div
                        id="text--login-new-password-confirm-password-do-not-match"
                        class="login-error-message pr-1"
                      >
                        ‘New password’ and ‘Confirm password’ do no match
                      </div>
                    </div>
                  </div>
                  <div class="new-password-wrapper">
                    <v-row align="center" justify="center">
                      <v-col sm="12">
                        <v-form ref="newPassword" :lazy-validation="false">
                          <div>
                            <label
                              id="label--login-new-password"
                              class="new-password-wrapper__label"
                              >New Password</label
                            >
                            <v-text-field
                              id="input--login-new-password"
                              :append-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                              :type="show2 ? '' : 'password'"
                              @click:append="show2 = !show2"
                              v-model.trim="newPassword"
                              placeholder="Enter new password"
                              class="reset-pass-textfield mb-6"
                              :rules="[
                                rules.required,
                                rules.minPassword,
                                rules.equalToConfirmPassword(reNewPassword)
                              ]"
                              @click="newPasswordError = false"
                              outlined
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                              :class="{ 'input-error': isErrorActive }"
                              validate-on-blur
                              autocomplete="disabled"
                            ></v-text-field>
                          </div>
                          <div>
                            <PasswordChecker :password="newPassword" />
                          </div>
                          <div>
                            <label
                              id="label--login-confirm-password"
                              class="new-password-wrapper__label"
                              >Confirm Password</label
                            >
                            <v-text-field
                              v-model.trim="reNewPassword"
                              id="input--login-confirm-password"
                              :rules="[
                                rules.required,
                                rules.minPassword,
                                rules.equalToNewPassword(newPassword)
                              ]"
                              placeholder="Enter new password again"
                              class="reset-pass-textfield"
                              @click="newPasswordError = false"
                              outlined
                              :class="{ 'input-error': isErrorActive }"
                              validate-on-blur
                              :append-icon="
                                showReNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                              "
                              :type="showReNewPassword ? '' : 'password'"
                              @click:append="showReNewPassword = !showReNewPassword"
                              autocomplete="disabled"
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                            ></v-text-field>
                          </div>
                        </v-form>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    id="btn--login-set-password"
                    color="blue"
                    class="pl-4 white--text"
                    rounded
                    @click="setPassword"
                  >
                    SET PASSWORD
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber === 6">
                <MFAWelcome
                  :mfaDetails="mfaDetails"
                  @withoutContinueMFA="withoutContinueMFA()"
                  @setupMFA="setupMFA"
                  :rules="rules"
                  ref="refMfaWelcome"
                />
              </div>
              <div v-if="pageNumber === 7">
                <div v-if="isErrorActive" class="login-error-container">
                  <div v-if="isErrorActive" class="login-error-wrapper">
                    <div class="login-error-icon dark pr-2">
                      <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                    </div>
                    <div class="login-error-message pr-1">
                      {{ getErrors ? getErrors : mfaSetupErrorText }}
                    </div>
                  </div>
                </div>
                <MFASetup
                  :mfaCode="mfaCode"
                  :mfaSetupDetails="mfaSetupDetails"
                  @confirmSetupMFA="confirmSetupMFA"
                  :rules="rules"
                  ref="refMfaSetup"
                  :isLogin="true"
                />
              </div>
              <div v-if="pageNumber === 8">
                <div v-if="isErrorActive" class="login-error-container">
                  <div v-if="isErrorActive" class="login-error-wrapper">
                    <div class="login-error-icon dark pr-2">
                      <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                    </div>
                    <div class="login-error-message pr-1">
                      {{ getErrors }}
                    </div>
                  </div>
                </div>
                <MFALogin
                  :validReset="validReset"
                  :verificationCode="verificationCode"
                  :rememberMeOnThisDevice="rememberMeOnThisDevice"
                  @onCantLoginButtonClick="onCantLoginButtonClick"
                  @verificationCodeLogin="verificationCodeLogin"
                  :rules="rules"
                  ref="refMfaLogin"
                />
              </div>
              <div v-if="pageNumber === 9">
                <div v-if="isErrorActive" class="login-error-container">
                  <div v-if="isErrorActive" class="login-error-wrapper">
                    <div class="login-error-icon dark pr-2">
                      <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                    </div>
                    <div class="login-error-message pr-1">
                      {{ getErrors }}
                    </div>
                  </div>
                </div>
                <MFACantLogin
                  :phoneNumber="phoneNumber"
                  :validReset="validReset"
                  :verificationCode="verificationCode"
                  :rememberMeOnThisDevice="rememberMeOnThisDevice"
                  @onCantLoginButtonClick="onCantLoginButtonClick"
                  @verificationCodeLogin="verificationCodeLogin"
                  :rules="rules"
                  ref="refMfaCantLogin"
                />
              </div>
              <div v-if="[2, 3, 5, 6, 7, 8, 9].includes(pageNumber) || showPasswordField">
                <div id="btn-back--login" class="back-to-login" @click="onBackButtonClick()">
                  <v-icon right dark class="pr-2" color="#2196f3">mdi-arrow-left</v-icon>
                  {{ labels.Back }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import { mapActions, mapGetters } from 'vuex'
import AuthenticationService from '../services/authentication'
import AuthenticationStatus from '../model/constants/authenticationStatus'
import {
  cantLogin,
  createPasswordByToken,
  getMfaQRCode,
  getSaml,
  loginAction,
  loginWithSaml,
  loginWithUsername,
  resetPassword,
  resetPasswordByToken,
  setMFA
} from '../api/auth'
import PasswordChecker from '../components/Common/PasswordChecker/PasswordChecker'
import indexStore from '../store/index'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getCompanyList } from '@/api/company'
import jwt_decode from 'jwt-decode'
import { setGlobalUserData } from '@/utils/functions'
import store from '../store/index'
import MFAWelcome from '@/components/MFA/MFAWelcome'
import MFASetup from '@/components/MFA/MFASetup'
import MFACantLogin from '@/components/MFA/MFACantLogin'
import MFALogin from '@/components/MFA/MFALogin'
import { getWhiteLabelByUrl } from '@/api/whitelabel'
export default {
  name: 'Login',
  components: {
    MFALogin,
    MFACantLogin,
    MFASetup,
    MFAWelcome,
    VueRecaptcha,
    PasswordChecker,
    InputEmail
  },
  data() {
    return {
      showMfaMessage: false,
      mfaSetupErrorText: null,
      phoneNumber: null,
      showPasswordField: false,
      recoveryCode: null,
      mfaDetails: null,
      mfaSetupDetails: null,
      mfaAuthenticatedMessage: '',
      mfaCode: null,
      labels,
      showReNewPassword: false,
      isPasswordStep5Complete: false,
      blurConfirm: false,
      resetType: null,
      newPassword: null,
      reNewPassword: null,
      newPasswordError: null,
      isMfaAuthenticated: false,
      newPasswordErrorText: null,
      resetPasswordError: null,
      resetPasswordErrorText: null,
      captchaVerified: false,
      email: '',
      password: '',
      verificationCode: '',
      resePasswordModel: '',
      rememberMe: '',
      rememberMeOnThisDevice: false,
      show1: false,
      show2: false,
      show3: false,
      rules: {
        email: (v) => Validations.email(v),
        controlEmail: (v) => Validations.controlEmailLength(v, labels.InvalidEmailAddress),
        min: (v) => v.length >= 8 || 'Minimum 8 characters',
        max: (v) => v.length < 254 || 'Email address cannot exceed 320 characters',
        required: (value) => !!value || 'Required',
        minPassword: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
          return (
            pattern.test(value) ||
            'Password must be at least 8 characters with 1 capital letter, 1 lowercase letter, 1 special character and 1 number'
          )
        },
        equalToNewPassword: (v, t) => {
          return v === this.reNewPassword || "'New password' and 'Confirm password' do not match"
        },
        equalToConfirmPassword: (v, t) => {
          return v === this.newPassword || "'New password' and 'Confirm password' do not match"
        }
      },
      recaptcha: '6LfA498UAAAAACJkiU-j27rjI3KBL0nl95yVcdj9',
      validEmail: false,
      validPassword: false,
      validReset: false
    }
  },
  beforeCreate() {},
  created() {
    this.isSessionExpired = this.$route.params && this.$route.params.isSessionExpired
    this.$store.dispatch('whitelabel/resetState')
    if (this.$route.query && this.$route.query.mfaRequired) {
      this.showMfaMessage = true
      if (this.$route.name === 'login') {
        this.pageNumber = 1
      } else {
        this.$router.replace('/login')
      }
      //this.$router.replace('/login') login change
    }

    if (this.$route.query.authcode) {
      const { authcode } = this.$route.query
      const newAuthCode = encodeURIComponent(authcode)
      loginWithSaml({ authcode: newAuthCode })
        .then((response) => {
          this.onSuccessLogin({}, response)
        })
        .catch((err) => {
          this.onErrorLogin({}, err)
        })
    }

    if (localStorage.getItem('isRemember')) {
      this.rememberMe = localStorage.getItem('isRemember')
      this.$vlf.getItem('username', (err, username = '') => {
        if (!err) {
          this.email = username
        }
      })
    }
    if (AuthenticationService.getAuthenticationStatus() === AuthenticationStatus.AUTHENTICATED) {
      if (
        (this.$route.query &&
          !!this.$route.query.communityResourceId &&
          !!this.$route.query.communityPostResourceId) ||
        !!this.$route.query['amp;communityPostResourceId']
      ) {
        this.$router.push(
          `/community/${this.$route.query.communityResourceId}?postId=${
            this.$route.query.communityPostResourceId ||
            this.$route.query['amp;communityPostResourceId']
          }`
        )
      } else if (this.$route.query && !!this.$route.query.CommunityRequestId) {
        this.$router.push(
          `/threat-sharing?CommunityRequestId=${this.$route.query.CommunityRequestId}`
        )
      } else if (this.$route.query && !!this.$route.query.showInvitation) {
        this.$router.push({
          path: `/threat-sharing`,
          query: { showInvitation: this.$route.query.showInvitation }
        })
      } else if (this.$route.query && !!this.$route.query.CommunityId) {
        this.$router.push(`/threat-sharing/${this.$route.query.CommunityId}`)
      } else if (this.$route.query) {
        if (this.$route.query.cp) {
          this.pageNumber = 5
          this.token = this.getToken('cp', window.location.href)
          this.resetType = 'createPassword'
        } else if (this.$route.query.rp) {
          this.pageNumber = 5
          this.token = this.getToken('rp', window.location.href)
          this.resetType = 'resetPassword'
        }
      } else {
        this.$router.push('/')
      }
    } else if (this.$route.query) {
      if (this.$route.query.cp) {
        this.pageNumber = 5
        this.token = this.getToken('cp', window.location.href)
        this.resetType = 'createPassword'
      } else if (this.$route.query.rp) {
        this.pageNumber = 5
        this.token = this.getToken('rp', window.location.href)
        this.resetType = 'resetPassword'
      }
    }
  },
  mounted() {
    localStorage.removeItem('isSelectCompany')
    localStorage.removeItem('selectedCompanyName')
    localStorage.removeItem('selectedCompanyRequestId')
    if (this.$route.query) {
      // TO-DO
      // You should do redirect after login in here for users which come from email links
      // And also you have to dispatch a accept Community invitaion or which parameter came on here.
    }
    /*
      setTimeout(() => {
        let labels = document.getElementsByClassName('v-label')
        if (labels && labels.length) {
          labels[0].classList.add('v-label--active')
          labels[1].classList.add('v-label--active')
        }
      }, 0)
      */
  },
  computed: {
    ...mapGetters({
      isLoadingFromStore: 'common/getIsLoading',
      getPageNumber: 'login/getPageNumber',
      getErrors: 'common/getErrors',
      getSnackStatus: 'common/getSnackStatus',
      getColor: 'common/getColor',
      isErrorActive: 'common/getErrorStatus',
      loginWhiteLabel: 'login/loginWhiteLabel'
    }),
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    snackbar: {
      get() {
        return this.getSnackStatus
      },
      set(val) {
        this.setSnackStatus(val)
      }
    },
    pageNumber: {
      get() {
        return this.getPageNumber
      },
      set(newValue) {
        this.setPageNumber(newValue)
      }
    },
    isLoading: {
      get() {
        return this.isLoadingFromStore
      },
      set() {}
    },
    wrongLoginAttempt() {
      return this.$store.state.login.wrongLoginAttempt
    }
  },

  methods: {
    ...mapActions({
      loginAction2: 'login/loginAction',
      setPageNumber: 'login/setPageNumber',
      setSnackStatus: 'common/setSnackStatus',
      twoStepLogin: 'login/twoStepLogin'
    }),
    handleContinueClick() {
      if (this.showPasswordField) {
        this.onLoginClicked()
      } else {
        if (this.$refs.email.validate()) {
          loginWithUsername({ username: this.email }).then((response) => {
            const {
              data: { data }
            } = response
            if (data.authenticationTypeId === 1) {
              this.showPasswordField = true
            }
          })
        }
      }
    },
    onCantLoginButtonClick() {
      let payload = {
        email: this.email,
        password: this.password
      }
      cantLogin(payload)
        .then((response) => {
          this.phoneNumber = response.data.data.phoneNumber
          this.pageNumber = 9
          this.$refs.refMfaCantLogin.showCount = true
        })
        .catch(() => {})
    },
    verificationCodeLogin(isCantLogin, verificationCode, rememberMeOnThisDevice) {
      let payload = {
        email: this.email,
        password: this.password,
        mfa: this.mfaDetails,
        recovery_code: isCantLogin ? verificationCode : '',
        code: isCantLogin ? '' : verificationCode,
        rememberMeOnThisDevice: rememberMeOnThisDevice,
        skipMfa: 'forced'
      }
      if (this.pageNumber === 8) {
        if (this.$refs.refMfaLogin.$refs.refMfaLoginForm.validate()) {
          this.loginAction(payload)
        }
      } else if (this.pageNumber === 9) {
        if (this.$refs.refMfaCantLogin.$refs.refMfaCantLoginForm.validate()) {
          this.loginAction(payload)
        }
      }
    },
    confirmSetupMFA(code) {
      if (this.$refs.refMfaSetup.$refs.refMfaSetupForm.validate()) {
        let payload = {
          email: this.email,
          password: this.password,
          code: code
        }
        setMFA(payload)
          .then((response) => {
            this.isMfaAuthenticated = true
            this.mfaAuthenticatedMessage = response.data.message
            this.pageNumber = 1
            this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              this.mfaSetupErrorText =
                error.response.data.message || error.response.data.validationMessages[0]
            }
            this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          })
      }
    },
    withoutContinueMFA() {
      let payload = {
        email: this.email,
        password: this.password,
        router: this.$router,
        mfa: this.mfaDetails
      }
      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
      this.loginAction(payload)
    },
    setupMFA() {
      let payload = {
        email: this.email,
        password: this.password
      }
      getMfaQRCode(payload)
        .then((response) => {
          this.pageNumber = 7
          this.mfaSetupDetails = response.data['data']
        })
        .catch(() => {})
    },
    loginAction(payload) {
      loginAction(payload)
        .then((response) => {
          this.onSuccessLogin(payload, response)
        })
        .catch((error) => {
          this.onErrorLogin(payload, error)
        })
        .finally(() => {
          this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          })
        })
    },
    onSuccessLogin(payload, response) {
      let _this = this
      let isSessionExpired = payload.sessionExpired
      this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
      AuthenticationService.setToken(
        response.data.access_token,
        response.data.expiredIn || 9999999999999,
        response.data.status || 1
      )
      if (response.data.status === 3) {
        this.$store.commit('SET_PAGE_NUMBER', 4)
      } else {
        this.$store.commit('EMPTY_LOGIN_ATTEMPT', 0)
      }
      if (payload.sessionExpired) {
        getCompanyList().then((response) => {
          const result = response.data.data && response.data.data
          this.$store.commit('SET_DROPDOWN_COMPANIES', result)
        })
      }
      if (isSessionExpired) {
        let token = JSON.parse(localStorage.getItem('auth-token')).token
        let tokenData = jwt_decode(token)
        let currentUserData = setGlobalUserData(tokenData)
        localStorage.setItem('userData', JSON.stringify(currentUserData))
        localStorage.setItem('selectedCompanyName', currentUserData.name)
        localStorage.setItem('selectedCompanyRequestId', currentUserData.id)
        if (
          currentUserData &&
          currentUserData.role &&
          currentUserData.role.name !== 'CompanyAdmin'
        ) {
          this.$store.dispatch('dashboard/selectCompany', currentUserData, { root: true })
        }
        let payload = {
          currentUserData: currentUserData,
          isSelectCompany: false,
          permissions: tokenData.Permission
        }
        this.$store.commit('SET_CURRENTUSER', payload)
        this.$store.dispatch('common/changeSessionExpiredStatus', false).then((response) => {
          location.reload()
        })
      }
      if (
        (_this.$route.query &&
          !!_this.$route.query.communityResourceId &&
          !!_this.$route.query.communityPostResourceId) ||
        !!_this.$route.query['amp;communityPostResourceId']
      ) {
        this.pageNumber = 1
        _this.$router.push(
          `/community/${_this.$route.query.communityResourceId}?postId=${
            _this.$route.query.communityPostResourceId ||
            _this.$route.query['amp;communityPostResourceId']
          }`
        )
      } else if (_this.$route.query && !!_this.$route.query.CommunityRequestId) {
        this.pageNumber = 1
        _this.$router.push(
          `/threat-sharing?CommunityRequestId=${_this.$route.query.CommunityRequestId}`
        )
      } else if (this.$route.query && !!this.$route.query.showInvitation) {
        this.pageNumber = 1
        this.$router.push({
          path: `/threat-sharing`,
          query: { showInvitation: this.$route.query.showInvitation }
        })
      } else if (_this.$route.query && !!_this.$route.query.CommunityId) {
        _this.$router.push(`/community/${_this.$route.query.CommunityId}`)
      } else if (_this.$route.query) {
        if (_this.$route.query.cp) {
          _this.pageNumber = 5
          _this.token = _this.getToken('cp', window.location.href)
          _this.resetType = 'createPassword'
        } else if (_this.$route.query.rp) {
          _this.pageNumber = 5
          _this.token = _this.getToken('rp', window.location.href)
          _this.resetType = 'resetPassword'
        } else if (!indexStore.getters['common/getSessionCheck']) {
          this.pageNumber = 1
          _this.$router.push('/')
        } else {
          this.pageNumber = 1
          _this.$router.push('/')
        }
      } else if (!indexStore.getters['common/getSessionCheck']) {
        this.pageNumber = 1
        _this.$router.push('/')
      } else {
        this.pageNumber = 1
        _this.$router.push('/')
      }

      setTimeout(() => {
        if (_this.rememberMe) {
          this.$vlf.setItem('username', _this.email)
          localStorage.setItem('isRemember', _this.rememberMe)
        } else {
          localStorage.removeItem('username')
          localStorage.removeItem('password')
          localStorage.removeItem('isRemember')
          this.$vlf.removeItem('username')
          this.$vlf.removeItem('password')
        }
      }, 500)
    },
    onErrorLogin(payload, error) {
      let _this = this
      if (
        error.response.data &&
        error.response.data.mfa &&
        error.response.data.mfa.StatusId === 1
      ) {
        this.pageNumber = 8
      } else if (
        error.response.data &&
        error.response.data.mfa &&
        error.response.data.mfa.StatusId === 0
      ) {
        this.mfaDetails = error.response.data.mfa
        this.pageNumber = 6
      } else {
        this.$store.commit('WRONG_LOGIN_ATTEMPT', 1)
        if (error.response && error.response.status === 401) {
          this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          this.$store.commit('common/SET_ERROR_MESSAGE', error.response.data.errors[0].message, {
            root: true
          })
        } else {
          this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          let content =
            error.response.data && error.response.data.error_description
              ? error.response.data.error_description
              : error.response.data.Message
              ? error.response.data.Message
              : 'Unknown Error Occured !!!'
          this.$store.commit('common/SET_ERROR_MESSAGE', content, { root: true })
        }
      }
    },
    onBackButtonClick() {
      this.isPasswordStep5Complete = false
      this.isMfaAuthenticated = false
      this.showPasswordField = false
      if (this.pageNumber === 1) {
        this.$nextTick(() => {
          if (this.$refs && this.$refs.email) {
            this.$refs.email.validate()
          }
        })
      }
      if (this.pageNumber === 7) {
        this.pageNumber = 6
      } else if (this.pageNumber === 9) {
        this.pageNumber = 8
      } else {
        this.pageNumber = 1
      }
      this.clearError()
    },
    onForgetPasswordButtonClick() {
      this.isPasswordStep5Complete = false
      this.isMfaAuthenticated = false
      this.pageNumber = 2
      this.clearError()
    },
    isPassworAreEqual() {
      if (this.reNewPassword !== this.newPassword && this.blurConfirm) {
        return this.reNewPassword !== this.newPassword
      } else {
        return false
      }
    },
    clearError() {
      this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
    },
    getToken(name, url) {
      if (!url) url = location.href
      name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
      let regexS = '[\\?&]' + name + '=([^&#]*)'
      let regex = new RegExp(regexS)
      let results = regex.exec(url)
      return results == null ? null : results[1]
    },
    setPassword() {
      if (this.$refs.newPassword.validate()) {
        let payload = {
          Token: this.token,
          NewPassword: this.newPassword,
          ConfirmNewPassword: this.reNewPassword
        }
        switch (this.resetType) {
          case 'createPassword':
            createPasswordByToken(payload)
              .then((response) => {
                let url = new URL(location.href)
                this.$router.replace({ query: {} })
                url.searchParams.delete('cp')
                this.blurConfirm = false
                this.isPasswordStep5Complete = true
                this.pageNumber = 1
              })
              .catch((error) => {
                this.newPasswordError = true
                this.newPasswordErrorText =
                  (error.response && error.response.data && error.response.data.message) ||
                  (error.response && error.response.data && error.response.data.Message)
              })
            break
          case 'resetPassword':
            resetPasswordByToken(payload)
              .then((response) => {
                let url = new URL(location.href)
                this.$router.replace({ query: {} })
                url.searchParams.delete('rp')
                this.blurConfirm = false
                this.isPasswordStep5Complete = true
                this.pageNumber = 1
              })
              .catch((error) => {
                this.newPasswordError = true
                this.newPasswordErrorText =
                  (error.response && error.response.data && error.response.data.message) ||
                  (error.response && error.response.data && error.response.data.Message)
              })
            break
          default:
            break
        }
      }
    },
    toNext() {
      this.$refs.password.$el[1].focus()
    },
    onTwoStepLogin() {
      this.twoStepLogin({
        code: this.verificationCode,
        router: this.$router
      })
    },
    onLoginClicked() {
      const mainUrl = this.$router.currentRoute
      const _this = this

      this.isPasswordStep5Complete = false
      this.isMfaAuthenticated = false
      if (this.$refs.password.validate() && this.wrongLoginAttempt < 3) {
        let payload = { email: this.email, password: this.password, router: this.$router }
        this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
        this.loginAction(payload)
      } else if (this.$refs.password.validate() && this.wrongLoginAttempt >= 3) {
        if (window.grecaptcha.getResponse() == '') {
        } else {
          let payload = {
            email: this.email,
            password: this.password,
            router: this.$router
          }
          this.loginAction(payload)
          this.$refs.recaptcha.reset()
        }
      }
    },
    onCaptchaVerified() {
      /*this.$store.dispatch('login/loginAction', {
        email: this.email,
        password: this.password,
        router: this.$router
      })*/
    },
    onCaptchaExpired() {
      this.captchaVerified = false
      this.$refs.recaptcha.reset()
    },
    captchaVerifiedForReset() {
      this.resetPasswordError = false
      this.captchaVerified = true
      //this.onResetClick()
    },
    onResetClick() {
      if (this.$refs.resetEmail.validate() && this.captchaVerified) {
        resetPassword(this.resePasswordModel)
          .then((response) => {
            this.resetPasswordError = false
            this.resetPasswordErrorText = null
            this.pageNumber = 3
          })
          .catch((error) => {
            this.resetPasswordError = true
            this.resetPasswordErrorText =
              (error.response && error.response.data && error.response.data.message) ||
              (error.response && error.response.data && error.response.data.Message)
          })
      }
    }
  },

  watch: {
    pageNumber(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
        this.showMfaMessage = false
      }
    }
  }
}
</script>

<style lang="scss">
.verification-code-wrapper {
  &--textfield {
  }
  &__cant-login {
    font-size: 11px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.87);
    height: 20px;
    justify-content: center;
    display: flex;
    cursor: pointer;
  }
  &__remember {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 6px;
    .v-input--checkbox {
      .mdi-checkbox-blank-outline {
        color: rgba(0, 0, 0, 0.26) !important;
      }

      label.v-label.theme--light {
        font-size: 11px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
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
}
.mfa-setup__content {
  max-width: 540px;
  margin: 0 auto;
  &-textfield {
    max-width: 350px;
  }
  &--header {
    font-size: 20px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #383b41;
    margin-bottom: 1px !important;
  }
  &--text {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #383b41;
    margin-bottom: 8px !important;
  }
  &--image {
    border: solid 1px #e0e0e0;
    background-color: #ffffff;
    max-width: 128px;
    margin-right: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
    }
  }
  &--qr-details {
    display: flex;
    flex-flow: column;
    align-items: center;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: #383b41;
    &--code {
      padding: 8px 14px 8px 12px;
      background-color: #f1f8fe;
    }
  }
}
.v-card__actions {
  .login {
    &_without-continue-button {
      box-shadow: none !important;
      background-color: white !important;
      color: #2196f3 !important;
      border: 1px solid #2196f3;
      padding: 0 16px !important;
    }
  }
}
.back-to-login {
  left: 16px;
  background-color: white;
  position: absolute;
  top: 24px;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  color: #2196f3;
  display: flex;

  i {
    color: #2196f3;
  }
  cursor: pointer;
}

.login-page {
  .login-button {
    margin-top: 30px;
  }
  .input-error {
    .v-input__slot {
      background-color: #f5eff0 !important;
      fieldset {
        border-color: #d0021b !important;
      }
    }
  }
  .new-password-wrapper {
    &__label {
      font-size: 20px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87);
      padding: 0 8px;
      margin-bottom: 8px;
      display: block;
    }
  }
  .back-to-reset-password {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #757575;
    margin-top: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      color: #757575;
    }
    cursor: pointer;
  }
  .reset-pass-textfield {
    padding: 0 8px !important;
  }
  .login-error-container {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    width: 100%;
    overflow: auto;
  }

  .login-error-wrapper {
    width: 300px;
    border-radius: 3px;
    background-color: rgba(245, 108, 108, 0.2);
    padding: 22px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: auto;
    max-height: 100px;
    .login-error-icon {
      i {
        font-size: 24px !important;
        margin-bottom: -1px;
      }
    }

    .login-error-message {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000000;
    }
  }

  .login-success-container {
    align-items: center;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    width: 100%;
    overflow: auto;
  }

  .login-success-wrapper {
    width: 300px;
    border-radius: 3px;
    background-color: #43a047;
    padding: 22px 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .login-success-icon {
      i {
        font-size: 24px !important;
        margin-bottom: -1px;
      }
    }

    .login-success-message {
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #ffffff;
    }
  }

  .reset-password-wrapper {
    .v-text-field.v-text-field--solo .v-input__control {
      min-height: 20px !important;
      padding: 0;
    }
    &__success {
      min-height: 231px;
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
    margin-bottom: 24px;
  }

  .login-title {
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
    padding-top: 1px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 46px;
  }

  .background {
    height: 100%;
    width: 100%;
    background-image: url('../assets/img/login-bg.svg') !important;
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
    height: 24px !important;
    margin-bottom: 4px;
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
  .v-btn__content {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: right;
    i {
      font-size: 18px;
    }
  }

  .captcha-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 16px;

    > div {
      max-width: 300px;
    }
  }

  .login-user-pass-wrapper {
    padding: 8px 0;
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

  .login-card-wrapper {
    &__logo {
      margin-top: 64px;
      margin-bottom: 36px;
    }
  }

  @media only screen and (max-width: 769px) {
    .login-card-wrapper {
      padding: 10px !important;
      padding-right: 16px !important;
    }
  }
}
</style>
