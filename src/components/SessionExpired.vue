<template>
  <div class="session-expired">
    <v-form
      lazy-validation
      ref="refSessionExpiredForm"
      @submit="onLoginClicked"
      autocomplete="disabled"
    >
      <v-card light class="pb-5">
        <v-card-title class="d-flex pa-0 align-center">
          <div class="logo-wrapper">
            <div class="v-responsive">
              <img src="../assets/img/logo-kep.png" />
            </div>
          </div>
        </v-card-title>
        <v-list-item>
          <v-list-item-content class="d-flex flex-wrap flex-row">
            <v-list-item-title class="session-expired__title">Session Expired</v-list-item-title>
            <v-list-item-subtitle class="v-card-title"
              >Your session has been timed out. Please log in.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
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
        <div class="session-expired__body">
          <div class="login-user-pass-wrapper">
            <div>
              <label class="new-password-wrapper__label p-0 mb-2">Username</label>
              <v-text-field
                id="email"
                :type="'email'"
                name="email"
                ref="email"
                v-model="userName"
                :rules="[rules.required, rules.email, rules.max]"
                class="username-field"
                required
                placeholder="Username"
                autocomplete="disabled"
                outlined
                autofocus
                @keyup.enter="onLoginClicked"
              ></v-text-field>
            </div>

            <div>
              <label class="new-password-wrapper__label p-0 mb-2">Password</label>
              <v-text-field
                :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-2"
                placeholder="Password"
                v-model="password"
                outlined
                @click:append="show1 = !show1"
                autocomplete="disabled"
                @keyup.enter="onLoginClicked"
              ></v-text-field>
            </div>
            <div>
              <div class="session-expired__forget">
                <v-checkbox
                  hide-details
                  dense
                  v-model="rememberMe"
                  color="#2196f3"
                  :label="`Remember me`"
                ></v-checkbox>
                <div class="flex-grow-1"></div>
                <span
                  style="cursor: pointer;"
                  color="blue"
                  v-on:click="pageNumber = 2"
                  class="forget-password"
                  @click="handleForgetPasswordClick"
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          </div>
        </div>

        <v-card-actions class="justify-center mt-0 pt-8 mb-10">
          <v-btn color="blue" class="pl-4 white--text" rounded @click="onLoginClicked">
            CONTINUE
            <v-icon right dark>mdi-arrow-right</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AuthenticationService from '../services/authentication'
import store from '../store'
import { getCompanyList } from '../api/company'

export default {
  name: 'SessionExpired',
  data() {
    return {
      userName: '',
      password: '',
      verificationCode: '',
      resePasswordModel: '',
      pageNumber: 1,
      rememberMe: '',
      show1: false,
      isLoading: false,
      rules: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => "The email and password you entered don't match"
      }
    }
  },
  computed: {
    ...mapGetters({
      getErrors: 'common/getErrors',
      isErrorActive: 'common/getErrorStatus',
      sessionCheck: 'common/getSessionCheck'
    })
  },
  created() {
    if (localStorage.getItem('isRemember')) {
      this.rememberMe = localStorage.getItem('isRemember')
      this.email = localStorage.getItem('username')
      this.password = localStorage.getItem('password')
    }
  },
  methods: {
    ...mapActions({
      loginAction2: 'login/loginAction'
    }),
    handleForgetPasswordClick() {
      AuthenticationService.removeToken()
      this.$store.dispatch('common/changeSessionExpiredStatus', false)
      this.$router.push('/login')
    },
    onLoginClicked() {
      if (this.$refs.refSessionExpiredForm.validate()) {
        this.$store
          .dispatch('login/loginAction', {
            email: this.userName,
            password: this.password,
            router: this.$router,
            sessionExpired: true
          })
          .then((resp) => {
            this.$emit('closeSessionExpired')
          })
      }
    }
  },
  mounted() {
    window.addEventListener('unload', this.refresh)
  }
}
</script>

<style lang="scss">
.session-expired {
  .new-password-wrapper {
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
  .logo-wrapper {
    margin-top: 64px;
    margin-bottom: 36px;
  }
  &__title {
    font-size: 36px;
    font-weight: 600;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }

  &__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70%;
    margin: 0 auto;
    &-text {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 16px;
      div {
        font-size: 16px;
        font-weight: normal;
        letter-spacing: normal;
      }
      div:first-child {
        color: rgba(0, 0, 0, 0.87) !important;
      }
      a {
        color: #0097fa !important;
        margin-left: 4px;
        cursor: pointer;
        text-decoration: none;
      }
    }
  }

  &__body {
    display: flex;
    justify-content: center;
  }

  &__forget {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: -4px;
    .forget-password {
      font-size: 12px;
      font-weight: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
    .v-input--checkbox.v-input--selection-controls {
      padding-top: 0;
      margin-top: 1px;
    }
    .v-input--selection-controls .v-input__slot > .v-label,
    .v-input--selection-controls .v-radio > .v-label {
      font-size: 12px;
      font-weight: normal;
      line-height: 1.58;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }
  }
  .login-user-pass-wrapper {
    min-width: 300px;
    max-width: 300px;
    .v-text-field.v-text-field--enclosed .v-text-field__details {
      margin-bottom: 1px;
    }
  }
  .click-here {
    text-decoration: none;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 16px;
    color: #0097fa;
  }
  .full-line {
    border-bottom: 2px solid #757575;
    opacity: 0.45;
    margin-left: 16px;
    margin-right: 16px;
    width: 20%;
  }

  .v-sheet {
    border-radius: 20px !important;
    background-color: white;
  }

  .v-card-headline {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 36px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.4;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }

  .v-card-title {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
    letter-spacing: normal;
    text-align: center;
    color: rgba(0, 0, 0, 0.54) !important;
  }

  ///LOGIN

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
    margin-bottom: 64px;
  }

  .login-title {
    margin-top: 131px;
    margin-bottom: 8px;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 36px;
    font-weight: 100;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #2196f3;
  }
  .v-icon.v-icon {
    text-indent: -2px !important;
  }

  .v-sheet {
    border-radius: 20px;
  }

  .v-card-login-wrapper {
    padding-top: 24px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 80px;
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
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
  }
}
</style>
