<template>
  <v-app class="login-page">
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
                <!-- Step 1: Email Input -->
                <template v-if="!showSignInMethods">
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
                  </div>
                </template>

                <!-- Step 2: Sign-In Methods -->
                <template v-else>
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
                    <v-row align="center" justify="center">
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
                              src="../assets/img/microsoft-icon-logo.png"
                              alt="Microsoft"
                              class="social-login-btn__icon"
                            />
                            <span class="social-login-btn__text">Continue with Microsoft</span>
                          </div>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
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
                              src="../assets/img/google.svg"
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
                        <div class="magic-link-wrapper">
                          <a
                            id="link--users-dashboard-login-magic-link"
                            class="magic-link"
                            href="#"
                            @click.prevent="handleMagicLink"
                          >
                            Use a magic link instead
                          </a>
                        </div>
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
              </v-card-text>
              <v-card-actions v-if="!showSignInMethods" class="justify-center login-button mt-0">
                <v-btn
                  color="blue"
                  id="btn--users-dashboard-login-continue"
                  class="pl-4 white--text login-btn"
                  rounded
                  :loading="isLoading > 0"
                  @click="handleContinue"
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
import { mapGetters, mapActions } from 'vuex'
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'

export default {
  name: 'UsersDashboardLogin',
  data() {
    return {
      companyEmail: '',
      showSignInMethods: false,
      rules: {
        email: (v) => Validations.email(v),
        required: (value) => !!value || 'Required'
      },
      validForm: false,
      labels
    }
  },
  created() {
    // Initialize usersDashboard store from localStorage
    this.$store.dispatch('usersDashboard/initializeFromStorage')
    // Reset whitelabel state
    this.$store.dispatch('whitelabel/resetState')
    // Get whitelabel info
    this.$store.dispatch('login/getWhiteLabelByUrl')
    // Check if already authenticated
    if (this.isUsersDashboardAuthenticated) {
      this.$router.push('/users-dashboard')
    }
  },
  computed: {
    ...mapGetters({
      isLoadingFromStore: 'common/getIsLoading',
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus',
      loginWhiteLabel: 'login/loginWhiteLabel',
      isUsersDashboardAuthenticated: 'usersDashboard/isAuthenticated'
    }),
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
      setCompanyEmail: 'usersDashboard/setCompanyEmail'
    }),
    handleContinue() {
      if (!this.$refs.loginForm.validate()) {
        return
      }
      this.clearError()
      // Set company email in store
      this.setCompanyEmail(this.companyEmail)
      // TODO: Implement company email verification logic
      // For now, show sign-in methods
      this.showSignInMethods = true
    },
    handleMicrosoftLogin() {
      this.performLogin('microsoft')
    },
    handleGoogleLogin() {
      this.performLogin('google')
    },
    handleMagicLink() {
      this.performLogin('magic-link')
    },
    performLogin(loginMethod) {
      this.clearError()
      this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.ENABLELOADER, { root: true })

      const payload = {
        companyEmail: this.companyEmail,
        loginMethod: loginMethod
      }

      this.usersDashboardLogin(payload)
        .then(() => {
          // Redirect to users-dashboard
          this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          })
          this.$router.push('/users-dashboard')
        })
        .catch((error) => {
          this.onErrorLogin(error)
        })
        .finally(() => {
          this.$store.dispatch('common/activateLoader', COMMON_CONSTANTS.DISABLELOADER, {
            root: true
          })
        })
    },
    onErrorLogin(error) {
      this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
      const errorMessage =
        error?.response?.data?.error_description ||
        error?.response?.data?.Message ||
        error?.response?.data?.errors?.[0]?.message ||
        labels.ServiceUnavailable
      this.$store.commit('common/SET_ERROR_MESSAGE', errorMessage, {
        root: true
      })
    },
    handleBack() {
      this.showSignInMethods = false
    },
    clearError() {
      this.$store.commit('common/SET_ERROR_STATE', false, { root: true })
    }
  }
}
</script>
