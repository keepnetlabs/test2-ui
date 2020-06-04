<template>
  <div>
    <v-card class="pb-5">
      <v-list-item>
        <v-list-item-content class="d-flex flex-wrap flex-row mt-10 pt-10">
          <v-list-item-title class="v-card-headline">Session Expired</v-list-item-title>
          <v-list-item-subtitle class="v-card-title"
            >Your session has been timed out. Please log in.</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-container>
        <div class="login-user-pass-wrapper pt-10">
          <v-row align="center" justify="center">
            <v-col md="6" sm="12">
              <v-text-field
                dark
                color="#2196f3"
                v-model="userName"
                style="color: black;"
                label="Username"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row align="center" justify="center">
            <v-col class="pt-0" md="6" sm="12">
              <v-text-field
                :append-icon="show1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-2"
                label="Password"
                hint="At least 8 characters"
                v-model="password"
                class="input-group--focused black--text"
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col class="pt-1" md="6" xs="12">
              <div class="login-remember d-flex">
                <v-checkbox
                  class="black--text"
                  dense
                  v-model="rememberMe"
                  color="#2196f3"
                  :label="`Remember me`"
                ></v-checkbox>
                <div class="flex-grow-1"></div>
                <span color="blue" v-on:click="pageNumber = 2" class="forgot-password">
                  Forgot Password
                </span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
      <v-card-actions class="justify-center mt-0 pt-5 mb-8">
        <v-btn color="blue" class="pl-4 white--text" rounded @click="onLoginClicked">
          CONTINUE
          <v-icon right dark>mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SessionExpired',
  data() {
    return {
      userName: 'test@test.com',
      password: 'gerqI9-xyvbaz-dudwyd',
      verificationCode: '',
      resePasswordModel: '',
      pageNumber: 1,
      rememberMe: '',
      show1: false,
      isLoading: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => "The email and password you entered don't match"
      }
    }
  },
  methods: {
    ...mapActions({
      loginAction2: 'login/loginAction'
    }),
    onLoginClicked() {
      this.isLoading = true
      this.$store
        .dispatch('login/loginAction', {
          email: this.userName,
          password: this.password,
          router: this.$router
        })
        .then(resp => {
          this.$emit('closeSessionExpired')
        })
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .v-input--selection-controls__input {
  height: 19px !important;
  width: 19px !important;
}
::v-deep .v-input--selection-controls__ripple {
  height: 17px !important;
  width: 17px !important;
  left: -3px !important;
  top: calc(50% - 13px) !important;
  margin: 5px !important;
}
::v-deep .v-icon.v-icon {
  line-height: 0 !important;
  text-indent: -1px !important;
  border-radius: 5px !important;
  font-size: 19px !important;
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
::v-deep .v-label.v-label--active.theme--dark {
  top: 4px !important;
}

::v-deep .v-messages.theme--dark {
  top: 2px !important;
}

::v-deep .v-messages.theme--dark.error--text {
  top: -1px !important;
}

::v-deep .v-messages.error--text {
  margin-top: 4px !important;
}

::v-deep .v-input__append-inner {
  margin-top: -5px;
}

::v-deep .v-text-field .v-label {
  top: -6px;
}

::v-deep .v-label.theme--dark.error--text {
  top: -6px;
}

::v-deep .v-text-field.v-text-field--solo .v-label {
  top: calc(50% - 6px) !important;
}

::v-deep .mdi-eye-off-outline::before {
  color: rgba(0, 0, 0, 0.26);
}

::v-deep .v-input .v-label {
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  height: 16px;
  font-weight: 400;
}
.login-user-pass-wrapper {
  margin-bottom: -29px;
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
.v-list-item__subtitle {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.2 !important;
  letter-spacing: normal;
  color: rgba(0, 0, 0, 0.87) !important;
  margin-left: 2px;
}

::v-deep .v-list-item__title {
  justify-content: center;
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
.theme--dark.v-input:not(.v-input--is-disabled) input,
.theme--dark.v-input:not(.v-input--is-disabled) textarea {
  color: rgba(0, 0, 0, 0.54) !important;
}

.reset-password-wrapper {
  ::v-deep
    .v-text-field.v-text-field--solo:not(.v-text-field--solo-flat)
    > .v-input__control
    > .v-input__slot {
    box-shadow: none !important;
  }

  ::v-deep .v-input {
    // border: solid 1px rgba(0, 0, 0, 0.16);
    border-radius: 6px;
    height: 43px;
    padding-left: 12px;
    padding-right: 10px;
  }

  ::v-deep .v-text-field.v-text-field--solo .v-input__control {
    min-height: 20px !important;
    padding: 0;
  }
}

.forgot-password {
  align-items: center;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.87) !important;
  cursor: pointer;
  padding-top: 4px;
}

.login-remember {
  .v-input--checkbox {
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

::v-deep .v-input .v-label {
  height: 21px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.87) !important;
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
  height: 40px;
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
::v-deep .v-input--selection-controls__input {
  border: #2196f3 2px solid;
  border-radius: 5px;
}
::v-deep .v-icon.v-icon {
  text-indent: -2px !important;
}
::v-deep .v-input--selection-controls__ripple:before {
  left: -3px !important;
  right: 2px !important;
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
::v-deep .theme--dark.v-input:not(.v-input--is-disabled) input {
  color: black !important;
}
</style>
