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
                <img src="../assets/img/logo-kep.png" />
              </v-card-title>
              <div v-if="pageNumber === 1">
                <v-card-text class="pa-0">
                  <div class="login-title">
                    Welcome To Keepnet Labs
                  </div>
                  <div class="login-desc">
                    Please Login
                  </div>
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
                  <div v-if="isPasswordStep5Complete" class="login-success-container">
                    <div v-if="isPasswordStep5Complete" class="login-success-wrapper">
                      <div class="login-success-icon dark pr-2">
                        <v-icon large color="#ffffff"> mdi-check-circle-outline</v-icon>
                      </div>
                      <div class="login-success-message pr-1">
                        Your password has been set successfully
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
                          ref="email"
                        >
                          <label class="new-password-wrapper__label p-0 mb-2">Username</label>
                          <v-text-field
                            id="email"
                            :type="'email'"
                            name="email"
                            ref="email"
                            v-model.trim="email"
                            :rules="[rules.required, rules.email, rules.max]"
                            class="username-field"
                            required
                            label="Username"
                            outlined
                            @keyup.enter="toNext"
                            :class="{ 'input-error': isErrorActive }"
                            validate-on-blur
                            autocomplete="disabled"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0" md="6" sm="12">
                        <v-form
                          @submit="(event) => event.preventDefault()"
                          v-model.trim="validPassword"
                          ref="password"
                        >
                          <label class="new-password-wrapper__label p-0 mb-2">Password</label>
                          <v-text-field
                            :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? '' : 'password'"
                            name="password"
                            ref="password"
                            id="password"
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
                    <v-row align="center" justify="center">
                      <v-col class="pl-0 pt-1 pr-5 pb-0" md="6" xs="12">
                        <div class="login-remember d-flex">
                          <v-checkbox
                            v-model.trim="rememberMe"
                            :label="`Remember`"
                            class="remember-me-check"
                            hide-details
                            dense
                            color="#2196f3"
                          >
                          </v-checkbox>

                          <div @click="onForgetPasswordButtonClick()" class="forgot-password">
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
                <v-card-actions class="justify-center login-button">
                  <v-btn
                    color="blue"
                    class="pl-4 white--text login-btn"
                    rounded
                    @click="onLoginClicked"
                  >
                    CONTINUE
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber == 2">
                <v-card-text>
                  <div class="login-title">
                    Reset Your Password
                  </div>
                  <div class="login-desc">
                    <p class="mb-2">Enter your email address to</p>
                    <p class="mb-0">recieve the reset password link</p>
                  </div>
                  <div v-if="resetPasswordError" class="login-error-container">
                    <div v-if="resetPasswordError" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div class="login-error-message pr-1">
                        {{ resetPasswordErrorText }}
                      </div>
                    </div>
                  </div>
                  <div class="reset-password-wrapper">
                    <v-row align="center" justify="center">
                      <v-col md="6" sm="12">
                        <v-form v-model.trim="validReset" ref="resetEmail">
                          <v-text-field
                            v-model.trim="resePasswordModel"
                            :rules="[rules.required, rules.email, rules.max]"
                            label="Email Address"
                            class="reset-pass-textfield"
                            @click="resetPasswordError = false"
                            outlined
                            :class="{ 'input-error': isErrorActive }"
                            validate-on-blur
                            autocomplete="disabled"
                          ></v-text-field>
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
                  <v-btn color="blue" class="pl-4 white--text" rounded @click="onResetClick">
                    SEND RESET LINK
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber == 3" class="reset-password-wrapper__success">
                <v-card-text>
                  <div class="login-title">
                    Check Your Email
                  </div>
                  <div class="login-desc">
                    <p class="mb-2">We have sent an email to your email address.</p>
                    <p class="mb-0">Click the link the email to reset your password</p>
                    <div v-if="pageNumber === 3">
                      <div
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
              <div v-if="pageNumber == 4">
                <v-card-text>
                  <div class="login-title">
                    2-Step Authentication
                  </div>
                  <div class="login-desc">
                    Please enter your verification code
                  </div>
                  <div class="reset-password-wrapper">
                    <v-row align="center" justify="center">
                      <v-col md="6" sm="12">
                        <v-text-field
                          solo
                          outlined
                          v-model.trim="verificationCode"
                          label="Verification Code"
                          v-on:keyup.enter="onTwoStepLogin"
                          autocomplete="disabled"
                          validate-on-blur
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="blue"
                    class="pr-4 mr-2 white--text"
                    rounded
                    @click="
                      pageNumber = 1
                      clearError()
                    "
                  >
                    <v-icon right dark class="pr-2" color="#2196f3">mdi-arrow-left</v-icon>
                    BACK
                  </v-btn>
                  <v-btn color="blue" class="pl-4 white--text" rounded @click="onTwoStepLogin">
                    LOGIN
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber === 5">
                <v-card-text>
                  <div class="login-title">
                    Reset Your Password
                  </div>
                  <div class="login-desc">
                    Enter your new password
                  </div>
                  <div v-if="newPasswordError" class="login-error-container">
                    <div v-if="newPasswordError" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div class="login-error-message pr-1">
                        {{ newPasswordErrorText }}
                      </div>
                    </div>
                  </div>
                  <div v-if="isPassworAreEqual()" class="login-error-container">
                    <div v-if="isPassworAreEqual()" class="login-error-wrapper">
                      <div class="login-error-icon dark pr-2">
                        <v-icon dark large color="#f56c6c">mdi-close-circle</v-icon>
                      </div>
                      <div class="login-error-message pr-1">
                        ‘New password’ and ‘Confirm password’ do no match
                      </div>
                    </div>
                  </div>
                  <div class="new-password-wrapper">
                    <v-row align="center" justify="center">
                      <v-col sm="12">
                        <v-form ref="newPassword" :lazy-validation="false">
                          <div>
                            <label class="new-password-wrapper__label">New Password</label>
                            <v-text-field
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
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter and 1 number"
                              :class="{ 'input-error': isErrorActive }"
                              validate-on-blur
                              autocomplete="disabled"
                            ></v-text-field>
                          </div>
                          <div>
                            <PasswordChecker :password="newPassword" />
                          </div>
                          <div>
                            <label class="new-password-wrapper__label">Confirm Password</label>
                            <v-text-field
                              v-model.trim="reNewPassword"
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
                              hint="At least 8 characters with 1 capital letter, 1 lowercase letter and 1 number"
                            ></v-text-field>
                          </div>
                        </v-form>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn color="blue" class="pl-4 white--text" rounded @click="setPassword">
                    SET PASSWORD
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>
              <div v-if="pageNumber === 2 || pageNumber === 3 || pageNumber === 5">
                <div class="back-to-login" @click="onBackButtonClick()">
                  <v-icon right dark class="pr-2" color="#2196f3">mdi-arrow-left</v-icon>
                  BACK
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
import { createPasswordByToken, resetPassword, resetPasswordByToken } from '../api/auth'
import PasswordChecker from '../components/Common/PasswordChecker/PasswordChecker'

export default {
  name: 'Login',
  components: { VueRecaptcha, PasswordChecker },
  data() {
    return {
      showReNewPassword: false,
      isPasswordStep5Complete: false,
      blurConfirm: false,
      resetType: null,
      newPassword: null,
      reNewPassword: null,
      newPasswordError: null,
      newPasswordErrorText: null,
      resetPasswordError: null,
      resetPasswordErrorText: null,
      captchaVerified: false,
      email: '',
      password: '',
      verificationCode: '',
      resePasswordModel: '',
      rememberMe: '',
      show1: false,
      show2: false,
      show3: false,
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        min: (v) => v.length >= 8 || 'Minimum 8 characters',
        max: (v) => v.length < 254 || 'Email address cannot exceed 254 characters',
        required: (value) => !!value || 'Required.',
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
  created() {
    //AuthenticationService.removeToken()
    if (localStorage.getItem('isRemember')) {
      this.rememberMe = localStorage.getItem('isRemember')
      this.email = localStorage.getItem('username')
      this.password = localStorage.getItem('password')
    }
    if (AuthenticationService.getAuthenticationStatus() === AuthenticationStatus.AUTHENTICATED) {
      if (
        this.$route.query &&
        !!this.$route.query.communityResourceId &&
        !!this.$route.query.communityPostResourceId
      ) {
        this.$router.push(
          `/community/${this.$route.query.communityResourceId}?postId=${this.$route.query.communityPostResourceId}`
        )
      } else if (this.$route.query && !!this.$route.query.CommunityRequestId) {
        this.$router.push(
          `/threat-sharing?CommunityRequestId=${this.$route.query.CommunityRequestId}`
        )
      } else if (this.$route.query && !!this.$route.query.CommunityId) {
        this.$router.push(`/community/${this.$route.query.CommunityId}`)
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
      isErrorActive: 'common/getErrorStatus'
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
    onBackButtonClick() {
      this.isPasswordStep5Complete = false
      this.pageNumber = 1
      this.clearError()
    },
    onForgetPasswordButtonClick() {
      this.isPasswordStep5Complete = false
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
      if (
        this.$refs.email.validate() &&
        this.$refs.password.validate() &&
        this.wrongLoginAttempt < 3
      ) {
        // this.isLoading = true
        this.$store
          .dispatch('login/loginAction', {
            email: this.email,
            password: this.password,
            router: this.$router
          })
          .then(() => {
            setTimeout(() => {
              if (this.rememberMe) {
                localStorage.setItem('username', this.email)
                localStorage.setItem('password', this.password)
                localStorage.setItem('isRemember', this.rememberMe)
              } else {
                localStorage.removeItem('username')
                localStorage.removeItem('password')
                localStorage.removeItem('isRemember')
              }

              /*if (!!Object.keys(mainUrl.query).length) { @todo query forward iceman
                _this.$router.push(mainUrl.fullPath)
              }*/
            }, 500)
          })
      } else if (
        this.$refs.email.validate() &&
        this.$refs.password.validate &&
        this.wrongLoginAttempt >= 3
      ) {
        //this.isLoading = true
        if (window.grecaptcha.getResponse() == '') {
          // Business decided no need for Robot error
          /*
              this.$store.commit('common/SET_SNACK_STATUS', true, { root: true })
              this.$store.commit('common/SET_SNACKBAR_COLOR', 'red', { root: true })
              this.$store.commit('common/SET_ERROR_STATE', true, { root: true })
              this.$store.commit('common/SET_ERROR_MESSAGE', 'Prove you are not a robot', {
                root: true
              })
            */
        } else {
          this.$store.dispatch('login/loginAction', {
            email: this.email,
            password: this.password,
            router: this.$router
          })
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
  }
}
</script>

<style lang="scss">
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
    padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
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
