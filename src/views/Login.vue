<template>
  <v-app>
    <v-snackbar v-model="snackbar" :color="getColor" top right :timeout="3000">
      {{ getErrors }}
      <v-btn dark text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-overlay :value="isLoading>0" z-index="999">
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
        <v-row align="center" justify="center" style="height: 100%">
          <v-col class="login-card-wrapper" lg="12" xs="12">
            <v-card max-width="769" class="mx-auto my-auto v-card-login-wrapper">
              <v-card-title class="d-flex pa-0">
                <div class="logo-wrapper">
                  <div class="v-responsive">
                    <img src="../assets/img/logo-kep.png" />
                  </div>
                </div>
                <div class="flex-grow-1"></div>
                <a
                  style="text-decoration: none !important"
                  href="https://www.keepnetlabs.com/free-trial/"
                  target="_blank"
                >
                  <v-btn color="blue" class="pl-4 white--text login-btn" rounded>
                    TRY FOR FREE!
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </a>
              </v-card-title>
              <div v-if="pageNumber == 1">
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
                        <v-icon dark large color="red">mdi-close-circle</v-icon>
                      </div>
                      <div class="login-error-message pr-1">
                        {{ getErrors }}
                      </div>
                    </div>
                  </div>
                  <div class="login-user-pass-wrapper">
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0 pb-4" md="6" sm="12">
                        <v-form v-model="validEmail" ref="email">
                          <label class="login-label" for="email">Username</label>
                          <v-text-field
                            id="email"
                            :type="'email'"
                            name="email"
                            v-model="email"
                            :rules="[rules.required, rules.email, rules.max]"
                            class="username-field"
                            required
                            placeholder="Username"
                            aria-autocomplete="on"
                            autocomplete="on"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pt-0 pl-0 pr-0" md="6" sm="12">
                        <v-form v-model="validPassword" ref="password">
                          <label class="login-label" for="password">Password</label>
                          <v-text-field
                            :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                            :rules="[rules.required, rules.min]"
                            :type="show1 ? '' : 'password'"
                            name="password"
                            hint="At least 8 characters"
                            id="password"
                            v-model="password"
                            class="username-field input-group--focused"
                            @click:append="show1 = !show1"
                            v-on:keyup.enter="onLoginClicked"
                            placeholder="Password"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                    <v-row align="center" justify="center">
                      <v-col class="pl-0 pt-1 pr-5 pb-0" md="6" xs="12">
                        <div class="login-remember d-flex">
                          <v-checkbox
                            dense
                            v-model="rememberMe"
                            :label="`Remember`"
                            class="remember-me-check"
                          >
                          </v-checkbox>
                          <div class="flex-grow-1"></div>
                          <div v-on:click="pageNumber = 2" class="forgot-password">
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
                <v-card-actions class="justify-center pt-4">
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
                    Enter your email address to recieve the reset password link
                  </div>
                  <div class="reset-password-wrapper">
                    <v-row align="center" justify="center">
                      <v-col md="6" sm="12">
                        <v-form v-model="validReset" ref="resetEmail">
                          <v-text-field
                            v-model="resePasswordModel"
                            :rules="[rules.required, rules.email, rules.max]"
                            label="Email Address"
                            class="reset-pass-textfield"
                            v-on:keyup.enter="onResetClick"
                          ></v-text-field>
                        </v-form>
                      </v-col>
                    </v-row>
                  </div>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn
                    color="blue"
                    class="pr-4 mr-2 white--text"
                    rounded
                    @click="() => (pageNumber = 1)"
                  >
                    <v-icon right dark class="pr-2">mdi-arrow-left</v-icon>
                    BACK
                  </v-btn>
                  <v-btn color="blue" class="pl-4 white--text" rounded @click="onResetClick">
                    SEND RESET LINK
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
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
                          v-model="verificationCode"
                          label="Verification Code"
                          v-on:keyup.enter="onTwoStepLogin"
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
                    @click="() => (pageNumber = 1)"
                  >
                    <v-icon right dark class="pr-2">mdi-arrow-left</v-icon>
                    BACK
                  </v-btn>
                  <v-btn color="blue" class="pl-4 white--text" rounded @click="onTwoStepLogin">
                    LOGIN
                    <v-icon right dark>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
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

  export default {
    name: 'Login',
    components: { VueRecaptcha },
    data() {
      return {
        email: '',
        password: '',
        verificationCode: '',
        resePasswordModel: '',
        rememberMe: '',
        show1: false,
        rules: {
          required: value => !!value || 'Required.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          },
          min: v => v.length >= 8 || 'Minimum 8 characters',
          max: v => v.length < 254 || 'Email address cannot exceed 254 characters'
        },
        recaptcha: '6LfA498UAAAAACJkiU-j27rjI3KBL0nl95yVcdj9',
        validEmail: false,
        validPassword: false,
        validReset: false
      }
    },
    mounted() {
      if (this.$route.query) {
        // TO-DO
        // You should do redirect after login in here for users which come from email links
        // And also you have to dispatch a accept Community invitaion or which parameter came on here.
        console.log(this.$route.query)
      }
      if (AuthenticationService.getAuthenticationStatus() === AuthenticationStatus.AUTHENTICATED) {
        this.$router.push('/')
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
        resetPassword: 'login/resetPassword',
        twoStepLogin: 'login/twoStepLogin'
      }),
      onTwoStepLogin() {
        this.twoStepLogin({
          code: this.verificationCode,
          router: this.$router
        })
      },
      onLoginClicked() {
        if (
          this.$refs.email.validate() &&
          this.$refs.password.validate() &&
          this.wrongLoginAttempt < 3
        ) {
         // this.isLoading = true
          this.$store.dispatch('login/loginAction', {
            email: this.email,
            password: this.password,
            router: this.$router
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
        this.$store.dispatch('login/loginAction', {
          email: this.email,
          password: this.password,
          router: this.$router
        })
      },
      onCaptchaExpired() {
        this.$refs.recaptcha.reset()
      },
      onResetClick() {
        if (this.$refs.resetEmail.validate()) {
          this.resetPassword(this.resePasswordModel)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  html,
  body {
    min-height: 100%;
    height: 100%;
  }

  @media only screen and (max-width: 1025px) {
    html,
    body {
      max-height: 100vh !important;
      overflow: hidden !important;
    }
    .row {
      margin-left: unset !important;
      margin-right: unset !important;
    }
  }

  .login-error-container {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 15px;
    width: 100%;
  }

  .login-error-wrapper {
    max-width: 303px;
    border-radius: 3px;
    background-color: rgba(245, 108, 108, 0.2);
    padding: 22px 16px;
    display: flex;
    flex-direction: row;

    .login-error-icon {
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
    ::v-deep
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
    > .v-input__control
    > .v-input__slot {
      box-shadow: none !important;
    }

    ::v-deep .v-input {
      border: solid 1px rgba(0, 0, 0, 0.16);
      border-radius: 6px;
      height: 40px;
      padding-left: 12px;
      padding-right: 10px;
    }

    ::v-deep .v-text-field.v-text-field--solo .v-input__control {
      min-height: 20px !important;
      padding: 0;
    }

    ::v-deep .v-text-field input {
      -webkit-box-flex: 1;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      line-height: 20px;
      max-width: 100%;
      min-width: 0px;
      padding-top: 9px;
      width: 100%;
    }
  }

  .forgot-password {
    align-items: center;
    text-decoration: none;
    color: black;
    cursor: pointer;
    font-size: 11px;
    margin-top: 3px;
  }

  .login-remember {
    ::v-deep .v-input--checkbox {
      border: none;
      font-size: 11px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: center;
      padding-top: 0px;
      margin-top: 0px;

      label.v-label.theme--light {
        font-size: 11px;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-blank-outline.theme--light {
        font-size: 20px !important;
      }

      i.v-icon.notranslate.mdi.mdi-checkbox-marked.theme--light.accent--text {
        font-size: 20px !important;
      }
    }
  }

  ::v-deep .v-text-field > .v-input__control > .v-input__slot:after {
    border-color: currentColor;
    border-style: none;
    border-width: unset;
    -webkit-transform: scaleX(0);
    transform: scaleX(0);
  }

  ::v-deep .v-text-field input {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    color: rgba(0, 0, 0, 0.54);
    flex: 1 1 auto;
    line-height: 20px;
    padding: 3px 0;
    max-width: 100%;
    width: 100%;
  }

  ::v-deep .v-label.v-label--active.theme--light {
    top: 8px !important;
  }

  ::v-deep .v-messages.theme--light {
    top: 2px !important;
  }

  ::v-deep .v-messages.theme--light.error--text {
    top: -1px !important;
  }

  ::v-deep .v-messages.error--text {
    margin-top: 4px !important;
  }

  ::v-deep .v-input__append-inner {
    margin-top: 0 !important;
  }

  ::v-deep .v-text-field .v-label {
    top: -3px;
  }

  ::v-deep .v-label.theme--light.error--text {
    top: -3px;
  }

  ::v-deep .v-text-field.v-text-field--solo .v-label {
    top: calc(50% - 6px) !important;
  }

  ::v-deep .mdi-eye-off-outline::before {
    color: rgba(0, 0, 0, 0.26);
  }

  ::v-deep .v-input {
    height: 40px !important;
  }
  ::v-deep .v-input .v-label {
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    height: 16px;
    font-weight: 600;
  }

  ::v-deep .v-input--is-focused {
    border: 0px;
  }
  ::v-deep .v-input__slot {
    margin-bottom: -1px;
  }

  ::v-deep .v-input__slot:before {
    border-style: none !important;
    border-width: 0px !important;
  }

  .v-input {
    border: solid 1px rgba(0, 0, 0, 0.16);
    border-radius: 6px;
    font-size: 13px;
    padding-left: 14px;
    padding-right: 10px;
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
    background-image: url('../assets/img/login-bg.svg') !important;
    background-position: left top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover;
    flex-flow: column !important;
    position: absolute;
  }

  ::v-deep .v-input--selection-controls__ripple {
    margin-right: 0 !important;
    width: 20px !important;
    height: 20px !important;
    left: -5px !important;
    top: calc(50% - 17px) !important;
  }

  ::v-deep .remember-me-check {
    padding-left: 5px;

    label {
      color: rgba(0, 0, 0, 0.87) !important;
      font-family: 'Open Sans', sans-serif !important;
      font-weight: 400 !important;
      font-size: 9px;
      left: -8px !important;
    }
  }

  ::v-deep .login-btn {
    height: 36px !important;
    min-width: 132px !important;
  }

  .captcha-wrapper {
    align-items: center;
    display: flex;
    justify-content: center;
    padding-bottom: 30px;
    width: 100%;

    > div {
      max-width: 300px;
    }
  }

  .login-user-pass-wrapper > .row > div {
    max-width: 300px;
  }

  ::v-deep input:-webkit-autofill,
  ::v-deep input:-webkit-autofill:hover,
  ::v-deep input:-webkit-autofill:focus,
  ::v-deep input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
  }
  .login-label {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }
  .username-field {
    padding-left: 8px !important;
    padding-top: 7px !important;

    .v-input__append-inner {
      margin-top: 0 !important;
    }

    ::v-deep .v-text-field__details {
      margin-top: 4px;
    }
  }
  @media only screen and (max-width: 769px) {
    .login-card-wrapper {
      padding: 10px !important;
      padding-right: 16px !important;
    }
  }
</style>
