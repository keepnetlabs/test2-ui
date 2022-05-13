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
                    <div v-if="isShowSamlError" class="login-error-wrapper">
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
                            label="Username or email"
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
                            ref="password"
                            label="Password"
                            outlined
                            validate-on-blur
                            autocomplete="disabled"
                            :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            @keyup.enter="onLoginClicked()"
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
                              id="input--login-new-password"
                              :append-icon="show2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                              :type="show2 ? '' : 'password'"
                              data-recording-ignore="mask"
                              placeholder="Enter new password"
                              class="reset-pass-textfield mb-6"
                              :rules="[
                                rules.required,
                                rules.minPassword,
                                rules.equalToConfirmPassword(reNewPassword)
                              ]"
                              outlined
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                              :class="{ 'input-error': isErrorActive }"
                              validate-on-blur
                              autocomplete="disabled"
                              @click:append="show2 = !show2"
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
                              id="input--login-confirm-password"
                              data-recording-ignore="mask"
                              placeholder="Enter new password again"
                              class="reset-pass-textfield"
                              outlined
                              :class="{ 'input-error': isErrorActive }"
                              validate-on-blur
                              :append-icon="
                                showReNewPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                              "
                              :type="showReNewPassword ? '' : 'password'"
                              autocomplete="disabled"
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter, 1 number and 1 special character"
                              :rules="[
                                rules.required,
                                rules.minPassword,
                                rules.equalToNewPassword(newPassword)
                              ]"
                              @click:append="showReNewPassword = !showReNewPassword"
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
                  @withoutContinueMFA="withoutContinueMFA()"
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
import indexStore from '../store/index'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getCompanyList } from '@/api/company'
import jwt_decode from 'jwt-decode'
import { setGlobalUserData } from '@/utils/functions'
import MFAWelcome from '@/components/MFA/MFAWelcome'
import MFASetup from '@/components/MFA/MFASetup'
import MFACantLogin from '@/components/MFA/MFACantLogin'
import MFALogin from '@/components/MFA/MFALogin'
import * as Sentry from '@sentry/browser'

import { getSystemUserSettings } from '@/api/settings'
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
      verifiedCaptchaResponse: null,
      isShowSamlError: false,
      samlErrorMessage: '',
      showMfaLoginError: false,
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
      mailForResetPassword: '',
      rememberMe: '',
      rememberMeOnThisDevice: false,
      show1: false,
      show2: false,
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
      validReset: false
    }
  },
  updated() {
    console.log('updated')
  },
  created() {
    //if it is not logined then remove permissions from local storage
    localStorage.removeItem('permissions')

    this.pageNumber = 1
    this.isSessionExpired = this.$route.params && this.$route.params.isSessionExpired
    this.$store.dispatch('whitelabel/resetState')

    if (this.$route.query && this.$route.query.mfaRequired) {
      this.showMfaMessage = true
      if (this.$route.name === 'login') {
        this.pageNumber = 1
      } else {
        this.$router.replace('/login')
      }
    }

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
      } else if (this.$route.query && !!this.$route.query.investigationDetailsResourceId) {
        this.$router.push(
          `/investigation-details/${this.$route.query.investigationDetailsResourceId}`
        )
      } else if (this.$route.query && !!this.$route.query.analysisDetailsResourceId) {
        this.$router.push(
          `/incident-responder/reported-emails/email-details/${this.$route.query.analysisDetailsResourceId}`
        )
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
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(() => {
            this.$router.push('/')
          })
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
    ...mapActions({
      getCurrentUser: 'auth/getCurrentUser'
    }),
    getLoginTitle() {
      return this.isSessionExpired
        ? 'Session Expired'
        : `Welcome To ${this.loginWhiteLabel.brandName}`
    },
    getLoginDescription() {
      return this.isSessionExpired
        ? 'Your session has been timed out. Please log in.'
        : this.showPasswordField
        ? `Enter password for ${this.email}`
        : 'Please Login'
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
      loginAction2: 'login/loginAction',
      setPageNumber: 'login/setPageNumber',
      setSnackStatus: 'common/setSnackStatus',
      twoStepLogin: 'login/twoStepLogin',
      setPermissionsList: 'permissions/setPermissionsList'
    }),
    handleContinueClick() {
      if (this.showPasswordField) {
        this.onLoginClicked()
      } else {
        if (this.$refs.email.validate()) {
          const payload = {
            username: this.email
          }
          if (
            this.$route.query &&
            this.$route.query.bypasssaml &&
            this.$route.query.bypasssaml === 'true'
          ) {
            payload.bypassSaml = true
          }
          loginWithUsername(payload)
            .then((response) => {
              this.clearError()
              const {
                data: { data }
              } = response
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
              this.$store.commit('common/SET_ERROR_MESSAGE', e?.response?.data?.message || '', {
                root: true
              })
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
      this.setPermissionsList([
        'phishing-simulator/email-templates/{resourceId}|DELETE',
        'company-groups/{resourceId}|DELETE',
        'investigations/{resourceId}/actions-warning|POST',
        'mail-configurations/ews/{resourceId}|DELETE',
        'analysis-engines/{resourceId}|GET',
        'available-for/can-i-access-it|POST',
        'target-users/{transactionId}/search/export|POST',
        'system-users/mfa/resync|PUT',
        'phishing-simulator/phishing-scenario/preview/{emailTemplateResourceId}/{landingPageTemplateResourceId}|GET',
        'mail-configurations/gsuite/check-all-users-access|POST',
        'companies/proxy-settings/search/export|POST',
        'company-groups/{resourceId}|PUT',
        'mail-configurations/o365/check-all-users-access|POST',
        'feedback|POST',
        'target-groups/{resourceId}/users/export|POST',
        'mail-configurations/gsuite/check-create-new-category|POST',
        'roles/{resourceId}|GET',
        'company-groups/{resourceId}|GET',
        'phishing-simulator/phishing-scenario/preview/{resourceId}|GET',
        'roles|GET',
        'target-users/{resourceId}|PUT',
        'phishing-reporter/history/search/export|POST',
        'system-users/search/export|POST',
        'mail-configurations/o365/{resourceId}|DELETE',
        'target-groups/{resourceId}|PUT',
        'community-posts/{communityPostResourceId}/comments|GET',
        'investigations/{resourceId}/search-email/export|POST',
        'phishing-reporter/download/outlook-addin/{resourceId}|GET',
        'company-groups/{resourceId}/participants|PUT',
        'communities/membershiprequest/{resourceId}/accept|PUT',
        'available-for/search|POST',
        'phishing-simulator/phishing-campaign-job/start/{resourceId}|POST',
        'system-users/notification-setting|POST',
        'analysis-engines/{resourceId}/disable|PUT',
        'custom-fields/bulk-update|POST',
        'mail-configurations/o365/list-related-domains|POST',
        'mail-configurations/o365/check-api-connectivity|POST',
        'phishing-simulator/landing-page-template|POST',
        'analysis-engines|POST',
        'companies/clients/{resourceId}|DELETE',
        'mail-configurations/gsuite/check-privileges-access|POST',
        'scim/{resourceId}/revoke|POST',
        'mail-configurations/o365/check-inbox-access|POST',
        'notified-emails/{resourceId}|PUT',
        'phishing-simulator/phishing-campaign-job-report/search/export|POST',
        'heartbeat|POST',
        'phishing-simulator/phishing-campaign-job/pause/{resourceId}|PATCH',
        'companies/clients/{resourceId}|PUT',
        'companies/smtp-settings/search/export|POST',
        'playbooks/{resourceId}|DELETE',
        'ldap-setting/test-connection|POST',
        'notified-emails/fortisandbox-attachments-report/{resourceId}|GET',
        'target-groups/search-name|POST',
        'investigations/{resourceId}/summary|GET',
        'phishing-simulator/phishing-campaign/search/export|POST',
        'whitelabeling/resolve-whitelabeling|GET',
        'phishing-simulator/dns-services/{resourceId}|DELETE',
        'target-users/search-email|POST',
        'codetypes|GET',
        'ldap-job/create|POST',
        'phishing-reporter/search|POST',
        'communities/membershiprequest/{resourceId}/cancel|PUT',
        'mail-configurations/ews/check-api-connectivity|POST',
        'investigations/{resourceId}/search-email|POST',
        'investigations/{resourceId}/user|POST',
        'CompanyAdminPermission|GET',
        'phishing-simulator/phishing-campaign-job/email-activity/{resourceId}|GET',
        'phishing-simulator/phishing-campaign-job-report/{searchType}/search/export/{resourceId}|POST',
        'dashboard/widgets|POST',
        'companies/email-templates/{resourceId}|PUT',
        'companies/{resourceId}/license-check|GET',
        'ResellerPermission|GET',
        'phishing-simulator/phishing-campaign/{resourceId}|DELETE',
        'community-posts/top-posts|GET',
        'target-groups/upload/{transactionId}|GET',
        'system-users/search|POST',
        'phishing-simulator/phishing-scenario/{resourceId}|PUT',
        'target-users/example-file|POST',
        'investigations/search/export|POST',
        'mail-configurations/gsuite/check-email-access|POST',
        'custom-fields|POST',
        'ir/dashboard/running-investigations|GET',
        'company-groups|GET',
        'phishing-simulator/phishing-campaign-job-report/summary/{resourceId}|GET',
        'community-posts/my-last-posts|GET',
        'community-posts/comments/{resourceId}|DELETE',
        'mail-configurations/ews/check-inbox-access|POST',
        'custom-fields/groups/{resourceId}|GET',
        'mail-configurations/ews/check-mail-filter|POST',
        'mail-configurations/gsuite/check-delete-email|POST',
        'mail-configurations/gsuite/check-inbox-access|POST',
        'phishing-simulator/email-templates/{resourceId}|GET',
        'phishing-simulator/domain-records/form-details|GET',
        'playbooks/{resourceId}|PUT',
        'phishing-simulator/phishing-scenario/search/export|POST',
        'companies/siem-settings/search/export|POST',
        'phishing-simulator/email-templates/merge-tags|GET',
        'jobs|GET',
        'companies/{resourceId}|PUT',
        'companies/saml-settings|POST',
        'community-posts/{resourceId}|DELETE',
        'ldap-setting/{resourceId}|GET',
        'investigations/actions-delete|PUT',
        'companies/clients/search/export|POST',
        'phishing-simulator/phishing-scenario/{resourceId}|GET',
        'system-users/{resourceId}|PUT',
        'companies/siem-settings/{resourceId}|GET',
        'target-users/{transactionId}/update|PUT',
        'communities/{resourceId}/member|POST',
        'communities/my-invitations|GET',
        'analysis-engines/{resourceId}|DELETE',
        'companies/email-templates|POST',
        'target-users/upload|POST',
        'phishing-simulator/phishing-campaign-job/resume/{resourceId}|PATCH',
        'phishing-simulator/phishing-campaign/root-company-shared-smtp-resource-id|GET',
        'phishing-reporter/generate/diagnostic-tool|GET',
        'analysis-engines/analysis-exclusions|GET',
        'phishing-simulator/email-templates/{resourceId}|PUT',
        'system-users/{resourceId}|DELETE',
        'companies/clients/{resourceId}|GET',
        'communities/{resourceId}/membershiprequest|POST',
        'whitelabeling|GET',
        'companies/proxy-settings/{resourceId}|GET',
        'system-info/version|GET',
        'phishing-simulator/email-templates/download-attachment/{resourceId}|GET',
        'lookups/licenses|GET',
        'system-users/{resourceId}/send-information-email|POST',
        'phishing-simulator/landing-page-template/{resourceId}|GET',
        'communities|POST',
        'mail-configurations/o365/check-email-access|POST',
        'target-groups|POST',
        'company-groups/search/export|POST',
        'communities/invitations/{resourceId}/decline|PUT',
        'notified-emails/{resourceId}|GET',
        'target-users/{transactionId}/search|POST',
        'communities/{resourceId}/remove-member|DELETE',
        'scim|POST',
        'analysis-engines-types/{resourceId}/test-connection|PUT',
        'file/upload|POST',
        'companies/search/export|POST',
        'investigations/{resourceId}/progress|PUT',
        'target-groups|GET',
        'analysis-engines/{resourceId}/enable|PUT',
        'companies|POST',
        'notified-emails/msg-files/{resourceId}|GET',
        'phishing-simulator/phishing-campaign/preview/{smtpSettingResourceId}/{phishingScenarioResourceId}|GET',
        'companies/smtp-settings|POST',
        'jobs/{resourceId}|GET',
        'audit-logs/search/export|POST',
        'phishing-simulator/phishing-campaign/preview/{resourceId}|GET',
        'companies/saml-settings/{resourceId}|DELETE',
        'system-users/{resourceId}/role|POST',
        'phishing-simulator/landing-page-template/search|POST',
        'company-groups/{resourceId}/companies/search/export|POST',
        'target-users/search|POST',
        'mail-configurations/googleworkspace/{resourceId}|GET',
        'communities/{resourceId}/membershiprequest-count|GET',
        'investigations/{resourceId}/actions-delete-and-notify|POST',
        'system-users/change-password|PUT',
        'company-groups/{resourceId}/companies/search|POST',
        'phishing-simulator/phishing-campaign-job-report/{searchType}/search/{resourceId}|POST',
        'companies/proxy-settings/search|POST',
        'analysis-engines|GET',
        'companies/siem-settings/{resourceId}|PUT',
        'audit-logs/search|POST',
        'mail-configurations/search|POST',
        'phishing-reporter/generate/gsuite-addin|GET',
        'phishing-simulator/dns-services/{resourceId}|GET',
        'target-users/{resourceId}|GET',
        'notified-emails/bulk-update|PUT',
        'phishing-simulator/phishing-scenario/search|POST',
        'roles|POST',
        'analysis-engines/analysis-exclusions|PUT',
        'community-posts/notified-email-preview/{resourceId}|GET',
        'mail-configurations/{providerName}/{resourceId}|GET',
        'ldap-fields|GET',
        'phishing-simulator/phishing-campaign-job-report/search-email-submitted/{resourceId}|POST',
        'companies/email-templates/search/export|POST',
        'companies/email-templates/{resourceId}|DELETE',
        'companies/smtp-settings/search|POST',
        'ldap-setting|POST',
        'investigations/{resourceId}/search-user/export|POST',
        'target-users/mapping-job/{resourceId}|GET',
        'phishing-simulator/phishing-campaign-job-report/{resourceId}/search|POST',
        'mail-configurations/gsuite/check-update-category|POST',
        'phishing-simulator/phishing-campaign-job/resend/{resourceId}|POST',
        'scim/{resourceId}|DELETE',
        'companies/{resourceId}|DELETE',
        'phishing-simulator/email-templates|POST',
        'mail-configurations/o365/check-update-category|POST',
        'target-groups/{resourceId}|GET',
        'phishing-simulator/dns-services/{resourceId}/test|POST',
        'notify/url|POST',
        'analysis-engines/search|POST',
        'companies/saml-settings/{resourceId}|GET',
        'notified-emails/matching-playbooks/{playbookResourceId}/search|POST',
        'companies/saml-settings/default|GET',
        'mail-configurations/o365/check-delete-email|POST',
        'communities/{resourceId}/leave|POST',
        'system-users/{userResourceId}/role/{roleResourceId}|DELETE',
        'companies/my|GET',
        'phishing-simulator/phishing-campaign-job-report/summary/target-groups/{resourceId}|GET',
        'phishing-simulator/email-templates/search|POST',
        'available-for/process-available-for-requests|POST',
        'dashboard/reported-email-trends|POST',
        'phishing-simulator/phishing-campaign-job/stop/{resourceId}|PATCH',
        'companies/clients|POST',
        'target-groups/search/export|POST',
        'companies/email-templates/categorylookup|GET',
        'companies/{resourceId}|GET',
        'roles/{resourceId}|PUT',
        'phishing-simulator/phishing-campaign/{resourceId}|GET',
        'companies/siem-settings/test|POST',
        'phishing-simulator/phishing-scenario|POST',
        'available-for/validate-available-for-requests|POST',
        'target-users|POST',
        'communities/{resourceId}|GET',
        'investigations/actions-delete-and-notify|PUT',
        'phishing-reporter/img|GET',
        'phishing-simulator/domain-records/test|POST',
        'file/{resourceId}|GET',
        'phishing-simulator/phishing-campaign/bulk-delete|DELETE',
        'system-users/mfa/status|GET',
        'is/dashboard/search-stats|POST',
        'ir/dashboard/summary|GET',
        'communities/my-invitations-count|GET',
        'companies/saml-settings/parse-metadata-file|POST',
        'communities/invitations/{resourceId}/accept|PUT',
        'ldap-setting/create-mapping|POST',
        'file/delete|DELETE',
        'system-users/settings|GET',
        'company-groups/search|POST',
        'investigations/search|POST',
        'phishing-simulator/phishing-campaign-job-report/search-email-opened-attachment/{resourceId}|POST',
        'permissions/all|GET',
        'ldap-setting/check-status/{transactionId}|POST',
        'community-posts/{resourceId}/preview|GET',
        'phishing-reporter/summary|GET',
        'community-posts/comments/{resourceId}|PUT',
        'phishing-simulator/phishing-campaign-job/resend/list/{resourceId}|POST',
        'notify/email|POST',
        'companies/email-templates/search|POST',
        'system-users/notification-setting|PUT',
        'custom-fields/{resourceId}|GET',
        'community-posts/{resourceId}|GET',
        'RootPermission|GET',
        'analysis-engines/search/export|POST',
        'companies/saml-settings/search/export|POST',
        'investigations/actions-warning|PUT',
        'target-users/{resourceId}/groups|POST',
        'mail-configurations/googleworkspace/search|POST',
        'phishing-simulator/phishing-scenario/{resourceId}|DELETE',
        'phishing-simulator/phishing-campaign/form-details|GET',
        'phishing-simulator/phishing-campaign-job-report/search-email-reported/{resourceId}|POST',
        'phishing-simulator/phishing-campaign-job-report/export/{resourceId}|GET',
        'companies/my/search|POST',
        'audit-logs|POST',
        'phishing-simulator/landing-page-template/{resourceId}|DELETE',
        'analysis-engines/form-details|GET',
        'mail-configurations|GET',
        'companies/saml-settings/{resourceId}|PUT',
        'system-info/summary|GET',
        'communities/membershiprequest/{resourceId}/refuse|PUT',
        'phishing-simulator/domain-records|POST',
        'mail-configurations/search/export|POST',
        'phishing-simulator/landing-page-template/search/export|POST',
        'target-groups/{resourceId}|DELETE',
        'companies/siem-settings/{resourceId}|DELETE',
        'phishing-simulator/landing-page-template/form-details|GET',
        'target-users/{transactionId}/import|POST',
        'mail-configurations/ews/check-email-body-access|POST',
        'lookups/{typeId}|GET',
        'phishing-simulator/phishing-campaign-job/{resourceId}|DELETE',
        'communities/{resourceId}/appoint-owner|POST',
        'mail-configurations/googleworkspace/{resourceId}|PUT',
        'communities/suggested|GET',
        'mail-configurations/o365|POST',
        'phishing-reporter/generate/microsoft365-addin|GET',
        'companies/community-companies|GET',
        'ir/dashboard/top-rules|GET',
        'phishing-simulator/phishing-scenario/form-details|GET',
        'mail-configurations/ews/{resourceId}|PUT',
        'phishing-simulator/dns-services/search/export|POST',
        'companies/proxy-settings/{resourceId}|DELETE',
        'companies/email-templates/typelookup|GET',
        'companies/email-templates/{resourceId}|GET',
        'mail-configurations/o365/check-create-new-category|POST',
        'phishing-simulator/landing-page-template/{resourceId}|PUT',
        'target-groups/{resourceId}/users|DELETE',
        'whitelabeling/{resourceId}|DELETE',
        'investigations/{resourceId}|GET',
        'companies/proxy-settings|POST',
        'phishing-simulator/email-templates/search/export|POST',
        'companies/smtp-settings/{resourceId}|DELETE',
        'whitelabeling/{resourceId}|PUT',
        'communities/{resourceId}/join|POST',
        'mail-configurations/googleworkspace|POST',
        'is/dashboard/search-log/export|POST',
        'system-users|POST',
        'phishing-simulator/domain-records/search|POST',
        'notify/attachment-hash|POST',
        'mail-configurations/o365/check-privileges-access|POST',
        'companies/smtp-settings/test|POST',
        'ldap-setting/search|POST',
        'scim/{resourceId}|PUT',
        'community-posts/{resourceId}/like|POST',
        'is/dashboard/summary|POST',
        'companies/roi-settings|GET',
        'phishing-simulator/phishing-campaign-job-report/search-email-opened/{resourceId}|POST',
        'ldap-setting/{resourceId}|DELETE',
        'target-groups/upload|POST',
        'phishing-reporter/download/diagnostic-tool/{resourceId}|GET',
        'phishing-simulator/domain-records/search/export|POST',
        'is/dashboard/search-stats/export|POST',
        'tags/search|POST',
        'file/all|GET',
        'mail-configurations/gsuite/check-api-connectivity|POST',
        'phishing-simulator/phishing-campaign|POST',
        'system-users/mfa/setup|GET',
        'community-posts/message-file-preview|POST',
        'notified-emails/matching-playbooks/{playbookResourceId}/search/export|POST',
        'mail-configurations/ews/check-email-header-access|POST',
        'scim/fields|GET',
        'mail-configurations/googleworkspace/{resourceId}|DELETE',
        'companies/clients/search|POST',
        'phishing-simulator/phishing-campaign-job-report/search-email-clicked/{resourceId}|POST',
        'notify/result|POST',
        'companies/proxy-settings/test|POST',
        'target-users/upload/{transactionId}|GET',
        'target-groups/{resourceId}/users|PUT',
        'communities/{resourceId}|PUT',
        'phishing-simulator/phishing-campaign-job-report/{resourceId}/search/export|POST',
        'companies/email-templates/merge-tags/{resourceId}|GET',
        'target-groups/{resourceId}/users|POST',
        'audit|POST',
        'file/uploaded|GET',
        'diagnostic|POST',
        'system-users/bulk-delete|DELETE',
        'phishing-simulator/phishing-campaign-job-report/search|POST',
        'community-posts/parse-email-url|POST',
        'phishing-simulator/phishing-campaign-job/form-details|GET',
        'community-posts|POST',
        'analysis-engines/types|GET',
        'playbooks/search|POST',
        'ldap-setting/{resourceId}|PUT',
        'target-groups/upload/{transactionId}/search|GET',
        'mail-configurations/ews|POST',
        'dashboard/reporters|GET',
        'playbooks/search/export|POST',
        'phishing-simulator/dns-services/search|POST',
        'roles/search|POST',
        'phishing-reporter-users/{resourceId}|DELETE',
        'companies/siem-settings/search|POST',
        'companies/roi-settings|PUT',
        'investigations/scan-types|GET',
        'phishing-reporter|GET',
        'notified-emails/{resourceId}/reanalyze|GET',
        'phishing-simulator/phishing-campaign/search|POST',
        'companies/email-templates/check-availability|POST',
        'scim/search|POST',
        'mail-configurations/googleworkspace/search/export|POST',
        'communities/search/all|POST',
        'communities/search/my|POST',
        'mail-configurations/o365/{resourceId}|PUT',
        'phishing-simulator/phishing-campaign/{resourceId}|PUT',
        'phishing-reporter/search/export|POST',
        'timezone/timezones|GET',
        'investigations/{resourceId}/cancel|PUT',
        'community-posts/{resourceId}/share|POST',
        'companies/siem-settings|POST',
        'playbooks/{resourceId}|GET',
        'investigations/{resourceId}/actions-delete|POST',
        'phishing-simulator/phishing-campaign/calculate-sending-info|POST',
        'dashboard/widgets|GET',
        'communities/{resourceId}/invite|POST',
        'is/dashboard/search-log|POST',
        'investigations/{resourceId}/result|POST',
        'target-users/{resourceId}|DELETE',
        'phishing-reporter/history/search|POST',
        'phishing-reporter/generate/outlook-addin|GET',
        'target-groups/search|POST',
        'phishing-simulator/domain-records/{resourceId}|DELETE',
        'phishing-simulator/dns-services|POST',
        'scim/{resourceId}|GET',
        'community-posts/{resourceId}|PUT',
        'target-users/bulk-delete|DELETE',
        'community-posts/search|POST',
        'roles/{resourceId}|DELETE',
        'notified-emails/search/export|POST',
        'communities/{resourceId}|DELETE',
        'dashboard/summary|GET',
        'companies/saml-settings/search|POST',
        'system-users/mfa/disable|PUT',
        'phishing-reporter|POST',
        'investigations|POST',
        'lookups|POST',
        'active-directory/users|POST',
        'system-users/settings|PUT',
        'active-directory/groups|POST',
        'custom-fields/{resourceId}|PUT',
        'community-posts/search/{communityResourceId}|POST',
        'file/compress-html|POST',
        'company-groups/{resourceId}/participants|DELETE',
        'investigations/{resourceId}/search-user|POST',
        'companies/search|POST',
        'target-users/search/export|POST',
        'analysis-engines/{resourceId}|PUT',
        'phishing-simulator/dns-services/form-details|GET',
        'playbooks|POST',
        'target-users/create-mapping|POST',
        'companies/proxy-settings/{resourceId}|PUT',
        'notified-emails/search|POST',
        'companies/smtp-settings/{resourceId}|GET',
        'mail-configurations/ews/check-privileges-access|POST',
        'companies/smtp-settings/{resourceId}|PUT',
        'company-groups|POST',
        'phishing-simulator/domain-records/{resourceId}|GET',
        'notified-emails/attachments/{resourceId}|GET',
        'account/logout|GET',
        'file/parse-email-file|POST',
        'investigations/{resourceId}/user|PUT',
        'custom-fields/company|GET',
        'companies/clients/generate-client-credentials|GET',
        'community-posts/{communityPostResourceId}/comments|POST',
        'phishing-simulator/domain-records/{resourceId}|PUT',
        'phishing-simulator/dns-services/{resourceId}|PUT'
      ])
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
          this.$store.dispatch('dashboard/selectCompany', currentUserData, {
            root: true
          })
        }
        let payload = {
          currentUserData: currentUserData,
          isSelectCompany: false,
          permissions: tokenData.Permission
        }
        this.$store.commit('SET_CURRENTUSER', payload)
        this.$store.dispatch('common/changeSessionExpiredStatus', false).then(() => {
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
      } else if (this.$route.query && !!this.$route.query.investigationDetailsResourceId) {
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(() => {
            this.$router.push(
              `/investigation-details/${this.$route.query.investigationDetailsResourceId}`
            )
            this.pageNumber = 1
          })
      } else if (this.$route.query && !!this.$route.query.analysisDetailsResourceId) {
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(() => {
            this.$router.push(
              `/incident-responder/reported-emails/email-details/${this.$route.query.analysisDetailsResourceId}`
            )
            this.pageNumber = 1
          })
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
          let token = JSON.parse(localStorage.getItem('auth-token')).token
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
              this.$router.push('/')
            })
        } else {
          getSystemUserSettings()
            .then((response) => {
              localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
              localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
            })
            .finally(() => {
              this.$router.push('/')
              this.pageNumber = 1
            })
        }
      } else if (!indexStore.getters['common/getSessionCheck']) {
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(() => {
            this.$router.push('/')
            this.pageNumber = 1
          })
      } else {
        getSystemUserSettings()
          .then((response) => {
            localStorage.setItem('selectedDateFormat', response.data.data.dateFormat)
            localStorage.setItem('selectedTimeFormat', response.data.data.timeFormat)
          })
          .finally(() => {
            this.$router.push('/')
            this.pageNumber = 1
          })
      }
    },
    onErrorLogin(payload, error) {
      if (
        error &&
        error.response.data &&
        error.response.data.mfa &&
        error.response.data.mfa.StatusId === 1
      ) {
        this.pageNumber = 8
      } else if (
        error &&
        error.response.data &&
        error.response.data.mfa &&
        error.response.data.mfa.StatusId === 0
      ) {
        this.mfaDetails = error.response.data.mfa
        this.pageNumber = 6
      } else {
        this.$store.commit('WRONG_LOGIN_ATTEMPT', 1)
        if (error && error.response && error.response.status === 401) {
          this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          this.$store.commit('common/SET_ERROR_MESSAGE', error.response.data.errors[0].message, {
            root: true
          })
        } else {
          this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
          let content =
            error && error.response && error.response.data && error.response.data.error_description
              ? error.response.data.error_description
              : error.response.data.Message
              ? error.response.data.Message
              : 'Unknown Error Occured !!!'
          this.$store.commit('common/SET_ERROR_MESSAGE', content, {
            root: true
          })
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
        switch (this.resetType) {
          case 'createPassword':
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
            break
          case 'resetPassword':
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
            break
          default:
            break
        }
      }
    },
    toNext() {
      this.handleContinueClick()
    },
    onTwoStepLogin() {
      this.twoStepLogin({
        code: this.verificationCode,
        router: this.$router
      })
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
      if (this.$refs && this.$refs.recaptcha) {
        this.$refs.recaptcha.reset()
      }
    },
    captchaVerifiedForReset() {
      this.resetPasswordError = false
      this.captchaVerified = true
    },
    onResetClick() {
      if (this.$refs.resetEmail.validate() && this.captchaVerified) {
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
    max-height: 120px;
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
    -webkit-box-shadow: 0 0 0 1000px #fff inset;
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
