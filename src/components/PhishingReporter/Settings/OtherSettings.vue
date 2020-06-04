<template>
  <v-container fluid id="other-settings" class="other-settings">
    <v-form ref="refForm">
      <v-list-group
        no-action
        :class="{ 'margin-status-optional': marginStatusOptional }"
        class="other-settings__list-group"
      >
        <template v-slot:activator>
          <v-list-item-content class="other-settings__list-item">
            <div class="other-settings__list-item-header" @click="handleMarginStatusForOptional">
              Optional Features
            </div>
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content>
            <div>
              <v-checkbox
                v-model="formValues.deleteOriginalMail"
                class="other-settings__checkbox k-checkbox mt-3"
                color="#2196f3"
                label="Delete Original Email"
              ></v-checkbox>
            </div>
            <div>
              <v-checkbox
                v-model="formValues.enableProxy"
                class="other-settings__checkbox k-checkbox"
                color="#2196f3"
                label="Enable proxy"
              ></v-checkbox>
            </div>
            <div>
              <v-checkbox
                v-model="formValues.isOnPremise"
                color="#2196f3"
                class="other-settings__checkbox k-checkbox"
                label="On-premise settings"
              ></v-checkbox>
            </div>
            <div class="site-url__container mt-n3">
              <span class="site-url__message site-url__message--1">Site URL</span>
              <v-text-field
                placeholder="https://dashboard.abc.com/"
                outlined
                dense
                :disabled="!formValues.isOnPremise"
                class="k-textfield site-url__textfield site-url__textfield--1 mt-2"
                v-model="formValues.apiUrl"
                id="site-url"
                height="40"
                color="rgba(0, 0, 0, 0.72)"
              ></v-text-field>
            </div>
            <div class="site-url__container">
              <span class="site-url__message">Company ID</span>
              <v-text-field
                placeholder="Company ID"
                :disabled="!formValues.isOnPremise"
                outlined
                dense
                class="k-textfield site-url__textfield site-url__textfield--2"
                v-model="formValues.companyId"
                id="company-id"
                height="40"
                color="rgba(0, 0, 0, 0.72)"
              ></v-text-field>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="extra-message-text"
            >Extra Message</label
          >
          <v-text-field
            placeholder="Extra message in the dialog boxes"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.extraMessage"
            id="extra-message-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="screen-tip-text">Screen Tip</label>
          <v-text-field
            placeholder="Popup tooltip text"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.screenTip"
            id="screen-tip-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="no-internet-connection-message"
            >No Connection Message</label
          >
          <v-text-field
            placeholder="No internet connection. Please try again later."
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.noInternetConnectionMessage"
            id="no-internet-connection-message"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="yes-button-text"
            >Yes Button Text</label
          >
          <v-text-field
            placeholder="Yes"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.msgBoxBtnYesText"
            id="yes-button-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="no-button-text"
            >No Button Text</label
          >
          <v-text-field
            placeholder="No"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.msgBoxBtnNoText"
            id="no-button-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="cancel-button-text"
            >Cancel Button Text</label
          >
          <v-text-field
            placeholder="Cancel"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.msgBoxBtnCancelText"
            id="cancel-button-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="okay-button-text"
            >Okay Button Text</label
          >
          <v-text-field
            placeholder="Okay"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.msgBoxBtnOkText"
            id="super-tip-text"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="email-sending-message"
            >Email Sending Error Message</label
          >
          <v-text-field
            placeholder="Email cannot be sent"
            outlined
            dense
            class="k-textfield mt-2"
            v-model="formValues.emailSendingErrorMessage"
            id="email-sending-message"
            height="40"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-group no-action class="mb-6 other-settings__list-group">
        <template v-slot:activator>
          <v-list-item-content>
            <label class="other-settings__list-item-header" for="alertbox-text"
              >Enterprise Vault</label
            >
          </v-list-item-content>
        </template>
        <v-list-item>
          <v-list-item-content
            class="enterprise-vault-url"
            :class="[inModal ? 'enterprise-vault-url-margin' : '']"
          >
            <v-checkbox
              v-model="formValues.enableEnterpriseVault"
              class="other-settings__checkbox k-checkbox mt-2"
              @change="handleEnterpriseVaultChange"
              color="#2196f3"
              label="Enable enterprise vault"
            ></v-checkbox>
            <div class="site-url__container mt-n3">
              <span class="site-url__message site-url__message--3">Enterprise vault URL</span>
              <v-text-field
                placeholder="www.bc.com"
                outlined
                :disabled="enterpriseVaultDisabled"
                dense
                class="k-textfield site-url__textfield site-url__textfield--3 mt-2"
                v-model="formValues.enterpriseVaultUrl"
                height="40"
              ></v-text-field>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <div class="other-settings__footer" v-if="showFooter">
        <div class="d-flex justify-center">
          <v-btn
            @click="submit"
            rounded
            class="white--text other-settings__btn-util"
            color="#2196f3"
          >
            SAVE CHANGES
          </v-btn>
        </div>
        <div>
          <a
            href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
            class="other-settings__link"
            target="_blank"
          >
            Installation and configuration guide
          </a>
        </div>
      </div>
    </v-form>
  </v-container>
</template>

<script>
export default {
  name: 'OtherSettings',
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: null
    },
    inModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValues: {
        deleteOriginalMail: true,
        enableProxy: false,
        isOnPremise: false,
        apiUrl: '',
        companyId: '',
        extraMessage: '',
        screenTip: '',
        enableEnterpriseVault: false,
        enterpriseVaultUrl: '',
        superTip: '',
        noInternetConnectionMessage: '',
        msgBoxBtnYesText: '',
        msgBoxBtnNoText: '',
        msgBoxBtnCancelText: '',
        msgBoxBtnOkText: '',
        emailSendingErrorMessage: ''
      },
      marginStatusOptional: true,
      enterpriseVaultDisabled: true
    }
  },
  methods: {
    submit() {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', this.formValues)
        return this.formValues
      } else {
        return false
      }
    },
    handleEnterpriseVaultChange(value) {
      this.enterpriseVaultDisabled = !value
    },
    handleMarginStatusForOptional() {
      this.marginStatusOptional = !this.marginStatusOptional
    }
  },
  created() {
    if (this.formData) {
      const {
        companyId,
        noInternetConnectionMessage,
        msgBoxBtnYesText,
        msgBoxBtnNoText,
        msgBoxBtnOkText,
        msgBoxBtnCancelText,
        emailSendingErrorMessage,
        enterpriseVaultUrl,
        apiUrl,
        isOnPremise
      } = this.formData
      this.formValues.companyId = companyId || ''
      this.formValues.noInternetConnectionMessage = noInternetConnectionMessage || ''
      this.formValues.msgBoxBtnYesText = msgBoxBtnYesText || ''
      this.formValues.msgBoxBtnNoText = msgBoxBtnNoText || ''
      this.formValues.msgBoxBtnOkText = msgBoxBtnOkText || ''
      this.formValues.msgBoxBtnCancelText = msgBoxBtnCancelText || ''
      this.formValues.emailSendingErrorMessage = emailSendingErrorMessage || ''
      this.formValues.enterpriseVaultUrl = enterpriseVaultUrl || ''
      this.formValues.enableEnterpriseVault = !!enterpriseVaultUrl
      this.enterpriseVaultDisabled = !enterpriseVaultUrl
      this.formValues.apiUrl = apiUrl || ''
      this.formValues.isOnPremise = isOnPremise || ''
    } else {
      this.formValues.companyId = localStorage.getItem('companyId')
      this.formValues.extraMessage = 'Extra message in the dialog boxes'
      this.formValues.screenTip = 'Popup tooltip text'
      this.formValues.noInternetConnectionMessage =
        'No internet connection. Please try again later.'
      this.formValues.msgBoxBtnYesText = 'Yes'
      this.formValues.msgBoxBtnNoText = 'No'
      this.formValues.msgBoxBtnCancelText = 'Cancel'
      this.formValues.msgBoxBtnOkText = 'Okay'
      this.formValues.emailSendingErrorMessage = 'Email cannot be sent'
    }
  }
}
</script>

<style lang="scss">
.other-settings {
  margin-top: -12px;

  &__link {
    font-family: 'Open Sans', sans-serif !important;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    flex-basis: 100%;
    text-align: center;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: 768px) {
      margin-top: 10px;
      justify-content: center;
    }
  }

  &__checkbox {
    .v-input__slot {
      margin-bottom: 0 !important;
      margin-top: -5px;
    }
    &.v-input--selection-controls {
      margin-top: 0 !important;
      padding-top: 0 !important;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__list-item {
    font-family: 'Open Sans', sans-serif !important;
    max-width: 554px;
    .v-list-item__content {
      padding: 0 !important;
    }

    .v-list-item {
      padding: 0 !important;

      &--active {
        border-left: none !important;
      }
    }

    .v-list-group__header {
      max-width: 554px;
    }

    &-header {
      font-family: 'Open Sans', sans-serif !important;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      font-stretch: normal;
      font-style: normal;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
    }
  }

  &__list-group {
    .v-list-group__header {
      padding: 0 !important;
      border-left: none !important;
      max-width: 554px;
    }
    .v-list-group__items {
      .v-list-item {
        padding: 0 !important;
        overflow: visible;
      }
      .v-list-item__content {
        overflow: visible;
      }
    }
    .v-list-item__content {
      padding: 0 !important;
    }
  }

  &__btn-util {
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    max-height: 36px;
  }

  .v-list-item__content > *:not(:last-child) {
    margin-bottom: 0;
  }
}

.site-url {
  &__container {
    margin-left: 41px;
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0;
    }
  }

  &__message {
    opacity: 0.7;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    display: inline-block;
    margin-right: 21px;

    &--1 {
      margin-top: 18px !important;
      margin-right: 47px;
    }

    &--2 {
      margin-top: 10px !important;
      @media (max-width: 768px) {
        margin-bottom: 10px;
      }
    }

    &--3 {
      margin-top: 17px !important;
    }
  }

  &__textfield {
    max-width: 409px !important;
    &--1 {
    }
    &--2 {
      margin-top: -9px;
    }

    &--3 {
    }
  }
}

.margin-status-optional {
  margin-bottom: 12px;
}
</style>
