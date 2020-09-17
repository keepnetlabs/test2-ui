<template>
  <div class="session-expired">
    <v-form lazy-validation ref="refSessionExpiredForm" @submit="onLoginClicked">
      <v-card light class="pb-5">
        <v-list-item>
          <v-list-item-content class="d-flex flex-wrap flex-row mt-10 pt-10">
            <v-list-item-title class="session-expired__title">Session Expired</v-list-item-title>
            <v-list-item-subtitle class="v-card-title"
              >Your session has been timed out. Please log in.</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
        <div class="session-expired__body">
          <div class="login-user-pass-wrapper pt-10">
            <div>
              <v-text-field
                :rules="[rules.required, rules.min]"
                v-model="userName"
                outlined
                label="Username"
              ></v-text-field>
            </div>

            <div>
              <v-text-field
                :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-2"
                label="Password"
                hint="At least 8 characters"
                v-model="password"
                outlined
                @click:append="show1 = !show1"
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
        <div class="session-expired__footer">
          <v-divider />
          <div class="session-expired__footer-text">
            <div>
              Not registered yet?
            </div>
            <a href="https://www.keepnetlabs.com/free-trial/" target="_blank">
              Click Here
            </a>
          </div>
          <v-divider />
        </div>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
  methods: {
    ...mapActions({
      loginAction2: 'login/loginAction'
    }),
    handleForgetPasswordClick() {
      this.$router.push('/login')
    },
    onLoginClicked() {
      if (this.$refs.refSessionExpiredForm.validate()) {
        this.$store
          .dispatch('login/loginAction', {
            email: this.userName,
            password: this.password,
            router: this.$router
          })
          .then((resp) => {
            this.$emit('closeSessionExpired')
          })
      }
    }
  }
}
</script>

<style lang="scss">
.session-expired {
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
}
</style>
