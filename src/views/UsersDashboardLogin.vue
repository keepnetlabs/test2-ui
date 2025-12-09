<template>
  <v-app class="login-page users-dashboard-login-page">
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
                    id="img--users-dashboard-login-main-logo"
                    style="height: 100%; max-width: 100%;"
                    :src="loginWhiteLabel.mainLogoUrl"
                    :alt="loginWhiteLabel.mainLogoUrl ? 'main-logo-login' : ''"
                  />
                </div>
              </v-card-title>
              <v-card-text class="pa-0">
                <!-- Step 3: Email Verification -->
                <template v-if="showEmailVerification">
                  <div
                    id="text--users-dashboard-login-email-verification-title"
                    class="login-title"
                  >
                    Check Your Email
                  </div>
                  <div
                    id="text--users-dashboard-login-email-verification-description"
                    class="login-desc users-dashboard-login-desc"
                  >
                    Check your inbox at {{ companyEmail }} to continue.
                  </div>
                  <div class="login-user-pass-wrapper mt-8">
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0 pb-0" md="6" sm="12">
                        <v-btn
                          id="btn--users-dashboard-login-resend-email"
                          class="social-login-btn"
                          outlined
                          block
                          :style="{
                            opacity: countdown > 0 ? '0.7' : '1',
                            pointerEvents: countdown > 0 ? 'none' : 'auto'
                          }"
                          @click="handleResendEmail"
                        >
                          <div class="social-login-btn__content">
                            <v-icon class="social-login-btn__icon">mdi-email-outline</v-icon>
                            <span class="social-login-btn__text">
                              {{
                                countdown > 0
                                  ? `Resend sign-in email (${countdown}s)`
                                  : 'Resend sign-in email'
                              }}
                            </span>
                          </div>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pt-10 pl-0 pr-0 pb-0" md="6" sm="12">
                        <div class="back-button-wrapper">
                          <a
                            id="btn--users-dashboard-login-email-verification-back"
                            class="back-button"
                            href="#"
                            @click.prevent="handleBackFromEmailVerification"
                          >
                            <v-icon left class="back-button__icon">mdi-arrow-left</v-icon>
                            BACK
                          </a>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </template>

                <!-- Step 2: Sign-In Methods -->
                <template v-else-if="showSignInMethods">
                  <div id="text--users-dashboard-login-title" class="login-title">
                    Choose Your Sign-In Method
                  </div>
                  <div
                    id="text--users-dashboard-login-description"
                    class="login-desc users-dashboard-login-desc"
                  >
                    Your organization doesn't have a linked sign-in yet.
                  </div>
                  <div class="login-user-pass-wrapper">
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0 pb-0" md="6" sm="12">
                        <v-text-field
                          v-model.trim="companyEmail"
                          id="input--users-dashboard-login-company-email-disabled"
                          class="username-field"
                          placeholder="Enter Company Email"
                          outlined
                          disabled
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row v-if="samlProvider === 'microsoft'" align="center" justify="center">
                      <v-col class="pt-4 pl-0 pr-0 pb-0" md="6" sm="12">
                        <v-btn
                          id="btn--users-dashboard-login-microsoft"
                          class="social-login-btn"
                          outlined
                          block
                          @click="handleMicrosoftLogin"
                        >
                          <div class="social-login-btn__content">
                            <img
                              src="../assets/img/microsoft-mini.svg"
                              alt="Microsoft"
                              class="social-login-btn__icon"
                            />
                            <span class="social-login-btn__text">Continue with Microsoft</span>
                          </div>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row v-if="samlProvider === 'google'" align="center" justify="center">
                      <v-col class="pt-4 pl-0 pr-0 pb-0" md="6" sm="12">
                        <v-btn
                          id="btn--users-dashboard-login-google"
                          class="social-login-btn"
                          outlined
                          block
                          @click="handleGoogleLogin"
                        >
                          <div class="social-login-btn__content">
                            <img
                              src="../assets/img/google-mini.svg"
                              alt="Google"
                              class="social-login-btn__icon"
                            />
                            <span class="social-login-btn__text">Continue with Google</span>
                          </div>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pt-4 pl-0 pr-0 pb-0" md="6" sm="12">
                        <v-btn
                          id="btn--users-dashboard-login-email"
                          class="social-login-btn"
                          outlined
                          block
                          @click="handleMagicLink"
                        >
                          <div class="social-login-btn__content">
                            <v-icon class="social-login-btn__icon">mdi-email-outline</v-icon>
                            <span class="social-login-btn__text">Continue with Email</span>
                          </div>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pt-10 pl-0 pr-0 pb-0" md="6" sm="12">
                        <div class="back-button-wrapper">
                          <a
                            id="btn--users-dashboard-login-back"
                            class="back-button"
                            href="#"
                            @click.prevent="handleBack"
                          >
                            <v-icon left class="back-button__icon">mdi-arrow-left</v-icon>
                            BACK
                          </a>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </template>

                <!-- Step 1: Email Input -->
                <template v-else>
                  <div id="text--users-dashboard-login-title" class="login-title">
                    Access Your Security Growth Dashboard
                  </div>
                  <div
                    id="text--users-dashboard-login-description"
                    class="login-desc users-dashboard-login-desc"
                  >
                    We'll identify your organization's sign-in method securely.
                  </div>
                  <div v-if="isErrorActive" class="login-error-container">
                    <div v-if="isErrorActive" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div id="text--users-dashboard-login-error" class="login-error-message pr-1">
                        {{ getErrors }}
                      </div>
                    </div>
                  </div>
                  <div class="login-user-pass-wrapper">
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0 pb-4" md="6" sm="12">
                        <v-form
                          v-model.trim="validForm"
                          autocomplete="off"
                          data-sentry-mask
                          ref="loginForm"
                          @submit.prevent="handleContinue"
                        >
                          <v-text-field
                            v-model.trim="companyEmail"
                            :class="{ 'input-error': isErrorActive }"
                            id="input--users-dashboard-login-company-email"
                            data-sentry-mask
                            name="companyEmail"
                            ref="companyEmail"
                            class="username-field"
                            placeholder="Enter Company Email"
                            outlined
                            validate-on-blur
                            autocomplete="disabled"
                            :rules="[rules.required, rules.email]"
                            @keyup.enter="handleContinue"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0 pb-0" md="6" sm="12">
                        <div
                          v-if="showCaptcha && !showSignInMethods && !showEmailVerification"
                          class="captcha-wrapper mt-0"
                        >
                          <vue-recaptcha
                            ref="recaptcha"
                            :sitekey="recaptcha"
                            :loadRecaptchaScript="true"
                            @verify="onCaptchaVerified"
                            @expired="onCaptchaExpired"
                          ></vue-recaptcha>
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </template>
              </v-card-text>
              <v-card-actions
                v-if="!showSignInMethods && !showEmailVerification"
                class="justify-center login-button mt-0"
              >
                <v-btn
                  color="blue"
                  id="btn--users-dashboard-login-continue"
                  class="pl-4 white--text login-btn"
                  rounded
                  :loading="isLoading > 0"
                  :style="isContinueDisabled ? { opacity: 0.5, pointerEvents: 'none' } : {}"
                  @click="!isContinueDisabled && handleContinue()"
                >
                  CONTINUE
                  <v-icon right dark>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import { mapGetters, mapActions } from 'vuex'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { loginWithSaml, loginWithMagicLink, sendMagicLink } from '@/api/usersDashboard'

export default {
  name: 'UsersDashboardLogin',
  components: {
    VueRecaptcha
  },
  data() {
    return {
      verifiedCaptchaResponse: null,
      companyEmail: '',
      showSignInMethods: false,
      showEmailVerification: false,
      countdown: 30,
      countdownInterval: null,
      loginErrorCount: 0,
      rules: {
        email: (v) => Validations.email(v),
        required: (value) => !!value || 'Required'
      },
      validForm: false,
      labels,
      recaptcha: APP_CONFIG.VUE_APP_RECAPTCHA_SITEKEY
    }
  },
  created() {
    // Initialize usersDashboard store from localStorage
    this.$store.dispatch('usersDashboard/initializeFromStorage')
    // Reset whitelabel state
    this.$store.dispatch('whitelabel/resetState')
    // Get whitelabel info
    this.$store.dispatch('login/getWhiteLabelByUrl')

    // Check for Magic Link callback
    if (this.$route.query.ml) {
      this.handleMagicLinkCallback()
      return
    }

    // Check for SAML callback
    if (this.$route.query.authcode && this.$route.query.uid && this.$route.query.state) {
      this.handleSamlCallback()
      return
    }

    // Check if already authenticated
    if (this.isUsersDashboardAuthenticated) {
      this.$router.push('/users-dashboard')
    }
  },
  beforeDestroy() {
    // Clear countdown interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
      this.countdownInterval = null
    }
  },
  computed: {
    ...mapGetters({
      isLoadingFromStore: 'common/getIsLoading',
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus',
      loginWhiteLabel: 'login/loginWhiteLabel',
      isUsersDashboardAuthenticated: 'usersDashboard/isAuthenticated',
      samlProvider: 'usersDashboard/getSamlProvider',
      samlRedirectUrl: 'usersDashboard/getSamlRedirectUrl',
      userEmail: 'usersDashboard/getUserInfo'
    }),
    showCaptcha() {
      // Show captcha after 2 failed attempts or if captcha is already verified
      return this.loginErrorCount >= 2 || !!this.verifiedCaptchaResponse
    },
    isContinueDisabled() {
      // Disable continue button if captcha is shown but not verified
      return this.showCaptcha && !this.verifiedCaptchaResponse
    },
    isLoading: {
      get() {
        return this.isLoadingFromStore
      },
      set() {}
    }
  },
  methods: {
    ...mapActions({
      usersDashboardLogin: 'usersDashboard/login',
      setCompanyEmail: 'usersDashboard/setCompanyEmail',
      setToken: 'usersDashboard/setToken'
    }),
    async handleSamlCallback() {
      const { authcode, uid } = this.$route.query

      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })

      try {
        const response = await loginWithSaml({
          authcode: authcode,
          username: uid
        })

        if (response && response.data) {
          // Reset error count on successful login
          this.loginErrorCount = 0

          // Set token in store
          this.setToken({
            token: response.data.access_token || response.data.token,
            expiredIn: response.data.expiredIn || response.data.expired,
            status: response.data.status
          })

          // Redirect to users-dashboard
          this.$router.push('/users-dashboard')
        }
      } catch (error) {
        this.onErrorLogin(error)
      } finally {
        this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
          root: true
        })
      }
    },
    async handleMagicLinkCallback() {
      const magicLinkToken = this.$route.query.ml

      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })

      try {
        const response = await loginWithMagicLink(magicLinkToken)

        if (response && response.data) {
          // Reset error count on successful login
          this.loginErrorCount = 0

          // Set token in store
          this.setToken({
            token: response.data.access_token || response.data.token,
            expiredIn: response.data.expiredIn || response.data.expired,
            status: response.data.status
          })

          // Redirect to users-dashboard
          this.$router.push('/users-dashboard')
        }
      } catch (error) {
        this.onErrorLogin(error)
      } finally {
        this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
          root: true
        })
      }
    },
    handleContinue() {
      if (!this.$refs.loginForm.validate()) {
        return
      }

      // Extra check: if captcha is shown but not verified, don't proceed
      if (this.showCaptcha && !this.verifiedCaptchaResponse) {
        return
      }

      this.clearError()
      // Set company email in store
      this.setCompanyEmail(this.companyEmail)

      // Call login API with email
      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })

      const payload = {
        companyEmail: this.companyEmail,
        loginMethod: 'email',
        captchaResponse: this.verifiedCaptchaResponse
      }

      this.usersDashboardLogin(payload)
        .then((response) => {
          console.log('response', response)
          // Reset error count on successful login
          this.loginErrorCount = 0
          // Show sign-in methods based on SAML provider
          if (response && response.data && response.data.data) {
            this.showSignInMethods = true
          }
        })
        .catch((error) => {
          this.onErrorLogin(error)
        })
        .finally(() => {
          this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          })
          // Reset captcha
          this.$refs?.recaptcha?.reset()
        })
    },
    handleMicrosoftLogin() {
      if (this.samlRedirectUrl) {
        window.location.href = this.samlRedirectUrl
      }
    },
    handleGoogleLogin() {
      if (this.samlRedirectUrl) {
        window.location.href = this.samlRedirectUrl
      }
    },
    async handleMagicLink() {
      this.clearError()
      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, {
        root: true
      })

      try {
        await sendMagicLink(this.companyEmail)
        // Show email verification screen
        this.showEmailVerification = true
        this.showSignInMethods = false

        // Start countdown
        this.countdown = 30
        this.startCountdown()
      } catch (error) {
        this.onErrorLogin(error)
      } finally {
        this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
          root: true
        })
      }
    },
    async handleResendEmail() {
      this.clearError()
      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, {
        root: true
      })

      try {
        await sendMagicLink(this.companyEmail)
        // Restart countdown
        this.countdown = 30
        this.startCountdown()
      } catch (error) {
        this.onErrorLogin(error)
      } finally {
        this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
          root: true
        })
      }
    },
    startCountdown() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
      }

      this.countdownInterval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval)
          this.countdownInterval = null
        }
      }, 1000)
    },
    handleBackFromEmailVerification() {
      this.showEmailVerification = false
      this.showSignInMethods = true
      // Clear countdown
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
        this.countdownInterval = null
      }
      this.countdown = 30
    },
    onErrorLogin(error) {
      // Increment error count for captcha logic
      this.loginErrorCount++

      this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
      const errorMessage =
        error?.response?.data?.error_description ||
        error?.response?.data?.Message ||
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        labels.ServiceUnavailable
      this.$store.commit('common/SET_ERROR_MESSAGE', errorMessage, {
        root: true
      })
    },
    handleBack() {
      this.showSignInMethods = false
      // Reset captcha states when going back
      this.verifiedCaptchaResponse = null
      this.loginErrorCount = 0
      // Reset captcha component if it exists
      if (this.$refs.recaptcha) {
        this.$refs.recaptcha.reset()
      }
    },
    clearError() {
      this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
    },
    onCaptchaVerified(response) {
      this.verifiedCaptchaResponse = response
    },
    onCaptchaExpired() {
      this.verifiedCaptchaResponse = null
    }
  }
}
</script>
