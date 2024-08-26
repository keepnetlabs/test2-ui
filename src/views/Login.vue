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
                    style="height: 100%; max-width: 100%;"
                    :src="loginWhiteLabel.mainLogoUrl"
                    :alt="loginWhiteLabel.mainLogoUrl ? 'main-logo-login' : ''"
                  />
                </div>
              </v-card-title>
              <div v-if="pageNumber === 1">
                <v-card-text class="pa-0">
                  <div id="text--login-title" class="login-title">
                    {{ getLoginTitle }}
                  </div>
                  <div id="text--login-description" class="login-desc mb-14">
                    {{ getLoginDescription }}
                  </div>
                  <div v-if="!!mfaLoginErrors.length" class="login-error-container">
                    <div class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div id="text--multifactor-message-error" class="login-error-message pr-1">
                        <p>
                          Required fields cannot be acquired from SAML integration. Please contact
                          your system administrator.
                        </p>
                        <ul>
                          <li v-for="item in mfaLoginErrors" :key="item">
                            {{ item }}
                          </li>
                        </ul>
                      </div>
                    </div>
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
                  <div v-if="isShowSamlError" class="login-error-container">
                    <div class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div id="text--login-saml-error" class="login-error-message pr-1">
                        {{ samlErrorMessage }}
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
                          v-model.trim="validEmail"
                          autocomplete="off"
                          data-recording-ignore="mask"
                          :ref="showPasswordField ? 'password' : 'email'"
                          @submit="(event) => event.preventDefault()"
                        >
                          <v-text-field
                            v-show="!showPasswordField"
                            v-model.trim="email"
                            :class="{ 'input-error': isErrorActive }"
                            id="input--login-email"
                            data-recording-ignore="mask"
                            name="email"
                            ref="email"
                            class="username-field"
                            label="Email address"
                            outlined
                            validate-on-blur
                            autocomplete="disabled"
                            :rules="[
                              rules.required,
                              rules.min,
                              rules.email,
                              rules.max,
                              rules.controlEmail
                            ]"
                            @keyup.enter="toNext"
                          ></v-text-field>
                          <v-text-field
                            v-if="showPasswordField"
                            v-model.trim="password"
                            id="input--login-password"
                            class="username-field input-group--focused"
                            :class="{ 'input-error': isErrorActive }"
                            data-recording-ignore="mask"
                            name="password"
                            label="Password"
                            outlined
                            validate-on-blur
                            autocomplete="disabled"
                            :append-icon="getPasswordFieldIcon"
                            :rules="[rules.required, rules.min]"
                            :type="getPasswordFieldType"
                            @click:append="isHidePassword = !isHidePassword"
                            @keyup.enter="onLoginClicked"
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
                            class="forgot-password"
                            @click="onForgetPasswordButtonClick()"
                          >
                            Forgot Password
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <div v-if="getReCaptcha" class="captcha-wrapper">
                  <vue-recaptcha
                    ref="recaptcha"
                    :sitekey="recaptcha"
                    :loadRecaptchaScript="true"
                    @verify="onCaptchaVerified"
                    @expired="onCaptchaExpired"
                  ></vue-recaptcha>
                </div>
                <v-card-actions class="justify-center login-button mt-0">
                  <v-btn
                    color="blue"
                    id="btn--login-continue"
                    class="pl-4 white--text login-btn"
                    :style="isSamlLoading ? { width: '260px' } : ''"
                    rounded
                    :loading="isSamlLoading"
                    @click="handleContinueClick"
                  >
                    {{ isSamlLoading ? 'REDIRECTING FOR SSO LOGIN' : 'CONTINUE' }}
                    <v-icon right dark>mdi-arrow-right</v-icon>
                    <template #loader>
                      <span style="font-size: 14px; font-weight: 600; text-transform: capitalize;">
                        REDIRECTING FOR SSO LOGIN
                      </span>
                      <img
                        src="../assets/img/spinner.svg"
                        class="add-in-settings__spinner"
                        alt="spinner"
                      />
                    </template>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber === 2">
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
                            v-model.trim="mailForResetPassword"
                            id="input--login-reset-password"
                            :class="{ 'reset-pass-textfield': true, 'input-error': isErrorActive }"
                            style="padding: 0 !important;"
                            validate-on-blur
                            @click="resetPasswordError = false"
                          />
                          <div :class="['captcha-wrapper p-0']" style="height: 78px;">
                            <div :class="isShowResetFormError ? 'captcha-reset-wrapper-error' : ''">
                              <vue-recaptcha
                                :sitekey="recaptcha"
                                :loadRecaptchaScript="true"
                                ref="resetRecaptcha"
                                @verify="captchaVerifiedForReset"
                                @expired="onCaptchaExpired"
                              ></vue-recaptcha>
                            </div>
                          </div>
                          <div class="captcha-reset-error">
                            <CustomError
                              :is-valid="!isShowResetFormError"
                              :style="!isShowResetFormError && { marginLeft: '12px' }"
                            />
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
                    :disabled="isResentLinkApiCalling"
                    @click="onResetClick"
                  >
                    SEND RESET LINK
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber === 3" class="reset-password-wrapper__success">
                <v-card-text>
                  <div id="text--login-check-your-email-title" class="login-title">
                    Check Your Email
                  </div>
                  <div id="text--login-check-your-email-subtitle" class="login-desc">
                    <p class="mb-2">
                      We have sent an email to your email address.
                    </p>
                    <p class="mb-0">
                      Click the link the email to reset your password
                    </p>
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
                  <div v-if="isPasswordAreEqual" class="login-error-container">
                    <div v-if="isPasswordAreEqual" class="login-error-wrapper">
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
                              v-model.trim="newPassword"
                              data-recording-ignore="mask"
                              id="input--login-new-password"
                              :class="[
                                'reset-pass-textfield mb-6',
                                { 'input-error': isErrorActive }
                              ]"
                              placeholder="Enter new password"
                              outlined
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                              autocomplete="disabled"
                              :append-icon="getNewPasswordFieldIcon"
                              :type="getNewPasswordFieldType"
                              :rules="[
                                rules.required,
                                rules.minPassword,
                                rules.maxPassword,
                                rules.equalToConfirmPassword(reNewPassword)
                              ]"
                              @click:append="isHideNewPassword = !isHideNewPassword"
                              @click="newPasswordError = false"
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
                              data-recording-ignore="mask"
                              id="input--login-confirm-password"
                              :class="['reset-pass-textfield', { 'input-error': isErrorActive }]"
                              placeholder="Enter new password again"
                              outlined
                              autocomplete="disabled"
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                              :append-icon="getReNewPasswordFieldIcon"
                              :type="getReNewPasswordFieldType"
                              :rules="[
                                rules.required,
                                rules.minPassword,
                                rules.maxPassword,
                                rules.equalToNewPassword(newPassword)
                              ]"
                              @click:append="isHideReNewPassword = !isHideReNewPassword"
                              @click="newPasswordError = false"
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
                  ref="refMfaWelcome"
                  :mfaDetails="mfaDetails"
                  :rules="rules"
                  @withoutContinueMFA="withoutContinueMFA"
                  @setupMFA="setupMFA"
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
                  ref="refMfaSetup"
                  :mfaCode="mfaCode"
                  :mfaSetupDetails="mfaSetupDetails"
                  :rules="rules"
                  :isLogin="true"
                  @confirmSetupMFA="confirmSetupMFA"
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
                  ref="refMfaLogin"
                  :validReset="validReset"
                  :verificationCode="verificationCode"
                  :rememberMeOnThisDevice="rememberMeOnThisDevice"
                  :recaptcha="recaptcha"
                  :rules="rules"
                  @onCantLoginButtonClick="onCantLoginButtonClick"
                  @verificationCodeLogin="verificationCodeLogin"
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
                  ref="refMfaCantLogin"
                  :phoneNumber="phoneNumber"
                  :validReset="validReset"
                  :verificationCode="verificationCode"
                  :rememberMeOnThisDevice="rememberMeOnThisDevice"
                  :rules="rules"
                  @onCantLoginButtonClick="onCantLoginButtonClick"
                  @verificationCodeLogin="verificationCodeLogin"
                />
              </div>
              <div v-if="isBackButtonRendered">
                <div id="btn-back--login" class="back-to-login" @click="onBackButtonClick">
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
  loginAction,
  loginWithSaml,
  loginWithUsername,
  resetPassword,
  resetPasswordByToken,
  setMFA
} from '@/api/auth'
import PasswordChecker from '../components/Common/PasswordChecker/PasswordChecker'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import jwt_decode from 'jwt-decode'
import { setGlobalUserData } from '@/utils/functions'
import MFAWelcome from '@/components/MFA/MFAWelcome'
import MFASetup from '@/components/MFA/MFASetup'
import MFACantLogin from '@/components/MFA/MFACantLogin'
import MFALogin from '@/components/MFA/MFALogin'
import * as Sentry from '@sentry/browser'

import { getSystemUserSettings } from '@/api/settings'
import CookieKeys from '@/model/constants/cookieKeys'
import CustomError from '@/components/CustomError.vue'
export default {
  name: 'Login',
  components: {
    CustomError,
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
      verifiedCaptchaResponse: null,
      isShowSamlError: false,
      samlErrorMessage: '',
      showMfaLoginError: false,
      isResentLinkApiCalling: false,
      isShowResetFormError: false,
      mfaLoginErrors: [],
      showMfaMessage: false,
      mfaSetupErrorText: null,
      isSamlLoading: false,
      phoneNumber: null,
      showPasswordField: false,
      recoveryCode: null,
      mfaDetails: null,
      mfaSetupDetails: null,
      mfaAuthenticatedMessage: '',
      mfaCode: null,
      labels,
      isHideReNewPassword: false,
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
      mailForResetPassword: '',
      rememberMe: '',
      rememberMeOnThisDevice: false,
      isHidePassword: false,
      isHideNewPassword: false,
      rules: {
        email: (v) => Validations.email(v),
        controlEmail: (v) => Validations.controlEmailLength(v, labels.InvalidEmailAddress),
        min: (v) => v.length >= 8 || 'Minimum 8 characters',
        max: (v) => v.length < 254 || 'Email address cannot exceed 320 characters',
        required: (value) => !!value || 'Required',
        maxPassword: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
          return (
            (value && value.length < 1000 && pattern.test(value)) ||
            'Password must be at most 1000 characters 1 capital letter, 1 lowercase letter, 1 special character and 1 number'
          )
        },
        minPassword: (value) => {
          const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/
          return (
            pattern.test(value) ||
            'Password must be at least 8 characters with 1 capital letter, 1 lowercase letter, 1 special character and 1 number'
          )
        },
        equalToNewPassword: (v) => {
          return v === this.reNewPassword || "'New password' and 'Confirm password' do not match"
        },
        equalToConfirmPassword: (v) => {
          return v === this.newPassword || "'New password' and 'Confirm password' do not match"
        }
      },
      recaptcha: APP_CONFIG.VUE_APP_RECAPTCHA_SITEKEY,
      validEmail: false,
      validPassword: false,
      validReset: false,
      isSessionExpired: false
    }
  },
  created() {
    this.pageNumber = 1
    //checking is session expired
    this.isSessionExpired = this.$route.params && this.$route.params.isSessionExpired
    //resetting whitelabel state
    this.$store.dispatch('whitelabel/resetState')
    //looking mfa cases
    if (this.$route.query && this.$route.query.mfaRequired) {
      this.showMfaMessage = true
      if (this.$route.name === 'login') {
        this.pageNumber = 1
      } else {
        this.$router.replace('/login')
      }
    }
    //looking saml cases
    if (this.$route.query && this.$route.query['saml_error']) {
      this.samlErrorMessage = this.$route.query['saml_error_data']
        ? this.$route.query['saml_error_data']
        : this.$route.query['saml_error']
      this.isShowSamlError = true
    }
    if (this.$route.query.authcode && !this.$route.query.bypasssaml) {
      const { authcode, uid } = this.$route.query
      const newAuthCode = encodeURIComponent(authcode)
      const username = uid
      this.isSamlLoading = true
      loginWithSaml({ authcode: newAuthCode, username })
        .then((response) => {
          //lets remove old permissions
          this.$store.dispatch('permissions/resetState')
          localStorage.removeItem('permissions')
          this.onSuccessLogin({}, response)
        })
        .catch((err) => {
          try {
            this.onErrorLogin({}, err)
          } catch (e) {
            this.throwSentryEvent(e)
          }
        })
        .finally(() => {
          setTimeout(() => {
            if (this && this.isSamlLoading) {
              this.isSamlLoading = false
            }
          }, 2000)
        })
    }
    if (AuthenticationService.getAuthenticationStatus() === AuthenticationStatus.AUTHENTICATED) {
      if (this.checkQueryHasCommunityPostId()) {
        this.redirectToCommunityPost()
      } else if (this.checkQueryHasCommunityRequestId()) {
        this.redirectToCommunityRequest()
      } else if (this.checkQueryHasInvitation()) {
        this.redirectToInvitationPage()
      } else if (this.checkQueryHasCommunityId()) {
        this.redirectToThreatSharingCommunity()
      } else if (this.checkQueryHasInvestigationDetailsId()) {
        this.redirectToInvestigationDetails()
      } else if (this.checkQueryHasAnalysisDetailsId()) {
        this.redirectToAnalysisDetails()
      } else if (this.checkQueryHasResetPasswordOrCreatePassword()) {
        this.setQueryResetPasswordOrCreatePassword()
      } else {
        //go to main page
        if (this.$route.name !== 'Dashboard') {
          this.$router.push('/')
        }
      }
    } else {
      //if it is not logined then remove permissions from local storage
      this.$store.dispatch('permissions/resetState')
      localStorage.removeItem('permissions')
      if (this.checkQueryHasResetPasswordOrCreatePassword()) {
        this.setQueryResetPasswordOrCreatePassword()
      }
    }
  },
  mounted() {
    localStorage.removeItem('isSelectCompany')
    localStorage.removeItem('selectedCompanyName')
    localStorage.removeItem('selectedCompanyRequestId')
  },
  computed: {
    ...mapGetters({
      isLoadingFromStore: 'common/getIsLoading',
      getPageNumber: 'login/getPageNumber',
      getErrors: 'common/getErrors',
      getSnackStatus: 'common/getSnackStatus',
      getColor: 'common/getColor',
      isErrorActive: 'common/getErrorStatus',
      loginWhiteLabel: 'login/loginWhiteLabel',
      getReCaptcha: 'common/getReCaptcha'
    }),
    getPasswordFieldIcon() {
      return this.isHidePassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
    },
    getPasswordFieldType() {
      return this.isHidePassword ? 'text' : 'password'
    },
    getNewPasswordFieldIcon() {
      return this.isHideNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
    },
    getNewPasswordFieldType() {
      return this.isHideNewPassword ? 'text' : 'password'
    },
    getReNewPasswordFieldIcon() {
      return this.isHideReNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
    },
    getReNewPasswordFieldType() {
      return this.isHideReNewPassword ? 'text' : 'password'
    },
    getLoginTitle() {
      return this.isSessionExpired
        ? 'Session Expired'
        : `Welcome To ${this.loginWhiteLabel.brandName}`
    },
    getLoginDescription() {
      if (this.isSessionExpired) return 'Your session has been timed out. Please log in.'
      return this.showPasswordField ? `Enter password for ${this.email}` : 'Please Login'
    },
    isBackButtonRendered() {
      return [2, 3, 5, 6, 7, 8, 9].includes(this.pageNumber) || this.showPasswordField
    },
    isPasswordAreEqual() {
      if (this.reNewPassword !== this.newPassword && this.blurConfirm) {
        return this.reNewPassword !== this.newPassword
      } else {
        return false
      }
    },
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
      setPageNumber: 'login/setPageNumber',
      setSnackStatus: 'common/setSnackStatus',
      twoStepLogin: 'login/twoStepLogin',
      setPermissionsList: 'permissions/setPermissionsList'
    }),
    checkQueryHasCommunityPostId() {
      return (
        (this.$route.query &&
          !!this.$route.query.communityResourceId &&
          !!this.$route.query.communityPostResourceId) ||
        !!this.$route.query['amp;communityPostResourceId']
      )
    },
    checkQueryHasCommunityRequestId() {
      return this.$route.query && !!this.$route.query.CommunityRequestId
    },
    checkQueryHasInvitation() {
      return this.$route.query && !!this.$route.query.showInvitation
    },
    checkQueryHasCommunityId() {
      return this.$route.query && !!this.$route.query.CommunityId
    },
    checkQueryHasInvestigationDetailsId() {
      return this.$route.query && !!this.$route.query.investigationDetailsResourceId
    },
    checkQueryHasAnalysisDetailsId() {
      return this.$route.query && !!this.$route.query.analysisDetailsResourceId
    },
    checkQueryHasResetPasswordOrCreatePassword() {
      return this?.$route?.query?.cp || this?.$route?.query?.rp
    },
    setQueryResetPasswordOrCreatePassword() {
      if (this.$route.query.cp) {
        this.pageNumber = 5
        this.token = this.getToken('cp', window.location.href)
        this.resetType = 'createPassword'
      } else if (this.$route.query.rp) {
        this.pageNumber = 5
        this.token = this.getToken('rp', window.location.href)
        this.resetType = 'resetPassword'
      }
    },
    redirectToInvitationPage() {
      this.$router.push({
        path: `/threat-sharing`,
        query: { showInvitation: this.$route.query.showInvitation }
      })
    },
    redirectToThreatSharingCommunity() {
      this.$router.push(`/threat-sharing/community/${this.$route.query.CommunityId}`)
    },
    redirectToInvestigationDetails() {
      this.$router.push(
        `/incident-responder/investigations/investigation-details/${this.$route.query.investigationDetailsResourceId}`
      )
    },
    redirectToAnalysisDetails() {
      this.$router.push(
        `/incident-responder/reported-emails/email-details/${this.$route.query.analysisDetailsResourceId}`
      )
    },
    redirectToCommunityPost() {
      this.$router.push(
        `/threat-sharing/community/${this.$route.query.communityResourceId}?postId=${
          this.$route.query.communityPostResourceId ||
          this.$route.query['amp;communityPostResourceId']
        }`
      )
    },
    redirectToCommunityRequest() {
      this.$router.push(
        `/threat-sharing?CommunityRequestId=${this.$route.query.CommunityRequestId}`
      )
    },
    handleContinueClick() {
      if (this.showPasswordField) {
        this.onLoginClicked()
      } else {
        if (!this.$refs.email.validate()) return
        const payload = {
          username: this.email
        }
        if (this?.$route?.query?.bypasssaml === 'true') payload.bypassSaml = true
        loginWithUsername(payload)
          .then((response) => {
            this.clearError()
            const {
              data: { data }
            } = response
            const companyUpdateRequired = data?.companyUpdateRequired || false
            if (companyUpdateRequired)
              this.$store.dispatch('auth/setCompanyUpdateRequired', companyUpdateRequired)
            if (data.authenticationTypeId === 1) {
              this.showPasswordField = true
            } else if (data.authenticationTypeId === 2) {
              const anchor = document.createElement('a')
              anchor.href = data.redirectUrl
              anchor.click()
            }
          })
          .catch((e) => {
            this.$store.commit('common/SET_ERROR_STATE', true, {
              root: true
            })
            this.$store.commit(
              'common/SET_ERROR_MESSAGE',
              e?.response?.data?.message || labels.ServiceUnavailable,
              {
                root: true
              }
            )
          })
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
    verificationCodeLogin(
      isCantLogin,
      verificationCode,
      rememberMeOnThisDevice,
      verifiedCaptchaResponse
    ) {
      let payload = {
        email: this.email,
        password: this.password,
        mfa: this.mfaDetails,
        recovery_code: isCantLogin ? verificationCode : '',
        code: isCantLogin ? '' : verificationCode,
        rememberMeOnThisDevice: rememberMeOnThisDevice,
        skipMfa: 'forced',
        captchaResponse: verifiedCaptchaResponse
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
            if (error && error.response && error.response.data) {
              this.mfaSetupErrorText =
                error?.response?.data?.message ||
                error?.response?.data?.validationMessages?.[0] ||
                'Something went wrong'
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
      if (this.verifiedCaptchaResponse) {
        payload.captchaResponse = this.verifiedCaptchaResponse
      }
      loginAction(payload)
        .then((response) => {
          this.onSuccessLogin(payload, response)
        })
        .catch((error) => {
          try {
            this.onErrorLogin(payload, error)
          } catch (e) {
            this.throwSentryEvent(e)
          }
        })
        .finally(() => {
          this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          })
          this.$refs?.recaptcha?.reset()
        })
    },
    throwSentryEvent(e) {
      if (!APP_CONFIG?.VUE_APP_SENTRY_STATUS) return
      Sentry.captureException(e)
    },
    onSuccessLogin(payload, response) {
      this.setPermissionsList(response?.data?.permissions)
      this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
      //set token
      AuthenticationService.setToken(
        response.data.access_token,
        response.data.expiredIn,
        response.data.status
      )
      if (response?.data?.uuid) {
        localStorage.setItem(
          'uuid',
          JSON.stringify({
            email: payload.email,
            uuid: response.data.uuid
          })
        )
      }
      if (this.checkQueryHasCommunityPostId()) {
        this.redirectToCommunityPost()
      } else if (this.checkQueryHasCommunityRequestId()) {
        this.redirectToCommunityRequest()
      } else if (this.checkQueryHasInvestigationDetailsId()) {
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(this.redirectToInvestigationDetails)
      } else if (this.checkQueryHasAnalysisDetailsId()) {
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(this.redirectToAnalysisDetails)
      } else if (this.checkQueryHasInvitation()) {
        this.redirectToInvitationPage()
      } else if (this.checkQueryHasCommunityId()) {
        this.redirectToThreatSharingCommunity()
      } else {
        if (this.$route.query && this.checkQueryHasResetPasswordOrCreatePassword()) {
          this.setQueryResetPasswordOrCreatePassword()
        } else {
          //login to the application
          let token = JSON.parse(localStorage.getItem(CookieKeys.AUTH_KEY)).token
          let tokenData = jwt_decode(token)
          let currentUserData = setGlobalUserData(tokenData)
          localStorage.setItem('userData', JSON.stringify(currentUserData))
          localStorage.setItem('selectedCompanyName', currentUserData.name)
          localStorage.setItem('selectedCompanyRequestId', currentUserData.id)
          getSystemUserSettings()
            .then((response) => {
              localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
              localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
            })
            .finally(() => {
              if (this.$route.name !== 'Dashboard') {
                this.$router.push('/')
              }
            })
        }
      }
    },
    onErrorLogin(payload, error) {
      if (error?.response?.data?.mfa?.StatusId === 1) {
        this.pageNumber = 8
      } else if (error?.response?.data?.mfa?.StatusId === 0) {
        this.mfaDetails = error.response.data.mfa
        this.pageNumber = 6
      } else {
        if (error && error.response && error.response.status === 401) {
          this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          this.$store.commit('common/SET_ERROR_MESSAGE', error.response.data.errors[0].message, {
            root: true
          })
        } else {
          this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          this.$store.commit('common/SET_ERROR_MESSAGE', this.getLoginErrorMessage(error), {
            root: true
          })
        }
      }
    },
    getLoginErrorMessage(error) {
      if (error?.response?.data?.error_description) return error?.response?.data?.error_description
      return error?.response?.data?.Message
        ? error.response.data.Message
        : labels.ServiceUnavailable
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
    clearError() {
      this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
    },
    getToken(name, url) {
      if (!url) url = location.href
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
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
        if (this.resetType === 'createPassword') {
          createPasswordByToken(payload)
            .then(() => {
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
                error?.response?.data?.message || error?.response?.data?.Message || ''
            })
        }
        if (this.resetType === 'resetPassword') {
          resetPasswordByToken(payload)
            .then(() => {
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
                error?.response?.data?.message || error?.response?.data?.Message || ''
            })
        }
      }
    },
    toNext() {
      this.handleContinueClick()
    },
    onLoginClicked() {
      this.isPasswordStep5Complete = false
      this.isMfaAuthenticated = false
      this.isShowSamlError = false
      this.samlErrorMessage = ''
      if (this.$refs.password.validate() && this.wrongLoginAttempt < 3) {
        let payload = {
          email: this.email,
          password: this.password,
          router: this.$router
        }
        this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })
        this.loginAction(payload)
      }
    },
    onCaptchaVerified(response) {
      this.verifiedCaptchaResponse = response
    },
    onCaptchaExpired() {
      this.captchaVerified = false
      this.isShowResetFormError = true
      if (this.$refs && this.$refs.recaptcha) {
        this.$refs.recaptcha.reset()
      }
    },
    captchaVerifiedForReset() {
      this.resetPasswordError = false
      this.captchaVerified = true
      this.isShowResetFormError = false
    },
    onResetClick() {
      if (!this.$refs.resetEmail.validate() || !this.captchaVerified) {
        this.isShowResetFormError = true
        return
      }
      this.isResentLinkApiCalling = true
      resetPassword(this.mailForResetPassword)
        .then(() => {
          this.resetPasswordError = false
          this.resetPasswordErrorText = null
          this.pageNumber = 3
        })
        .catch((error) => {
          this.resetPasswordError = true
          this.resetPasswordErrorText =
            error?.response?.data?.message || error?.response?.data?.Message || ''
        })
        .finally(() => {
          this.isResentLinkApiCalling = false
        })
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
