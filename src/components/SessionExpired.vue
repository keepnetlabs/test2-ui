<template>
  <div class="session-expired">
    <v-card light class="pb-5">
      <v-list-item>
        <v-list-item-content class="d-flex flex-wrap flex-row mt-10 pt-10">
          <v-list-item-title class="v-card-headline">Session Expired</v-list-item-title>
          <v-list-item-subtitle class="v-card-title"
            >Your session has been timed out. Please log in.</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-col>
        <div class="login-user-pass-wrapper pt-10">
          <v-row align="center" justify="center">
            <v-col md="6" sm="12">
              <v-text-field v-model="userName" outlined label="Username"></v-text-field>
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
                outlined
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col class="pt-1" md="6" xs="12">
              <div class="login-remember d-flex">
                <v-checkbox
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
      </v-col>
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
    onLoginClicked() {
      this.isLoading = true
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
</script>

<style lang="scss">
.session-expired {
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
