<template>
  <v-container fluid id="other-settings" class="other-settings">
    <v-list-item
      class="pl-0 other-settings__list-item mt-0 pr-0 mr-2"
      style="max-width: 100%;"
      v-if="showHeader"
    >
      <v-list-item-content>
        <v-list-item-title class="other-settings__title">
          Other Settings
        </v-list-item-title>
        <v-list-item-subtitle class="other-settings__sub-title mb-3">
          Extra settings
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <a
          href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
          class="other-settings__link"
          target="_blank"
          v-if="showHeaderLink"
        >
          Installation and configuration guide
        </a>
      </v-list-item-content>
    </v-list-item>
    <v-form ref="refForm">
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <div class="other-settings__list-item-header">
            Proxy Settings
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item">
        <v-list-item-content>
          <div>
            <v-checkbox
              v-model="formValues.isEnableProxy"
              class="other-settings__checkbox k-checkbox mt-n2"
              color="#2196f3"
              label="Detect and use the proxy settings on your computer"
              :readonly="!showForm"
            ></v-checkbox>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 other-settings__list-item" style="max-width: 630px;">
        <v-list-item-content>
          <label class="other-settings__list-item-header">Phishing Reporter API Settings</label>
          <div class="other-settings__api-settings-container">
            <label class="mt-n2">Site URL</label>
            <v-text-field
              placeholder="https://dashboard.abc.com/"
              outlined
              dense
              class="mt-2"
              style="margin-left: 50px;"
              v-model.trim="formValues.apiUrl"
              :rules="showForm ? [(v) => validations.required(v, 'Required')] : []"
              height="40"
              :readonly="!showForm"
            ></v-text-field>
          </div>
          <div class="other-settings__api-settings-container mt-n3">
            <label
              class="other-settings__list-item-header mt-n2"
              for="no-internet-connection-message"
              >Api Key</label
            >
            <v-text-field
              placeholder="Api Key"
              outlined
              dense
              class="mt-2"
              style="margin-left: 56px;"
              v-model.trim="formValues.apiKey"
              :rules="showForm ? [(v) => validations.required(v, 'Required')] : []"
              height="40"
              :readonly="!showForm"
            ></v-text-field>
          </div>
          <div class="other-settings__api-settings-container">
            <label
              class="other-settings__list-item-header mt-n5"
              for="no-internet-connection-message"
              >Company ID</label
            >
            <v-text-field
              placeholder="Company ID"
              outlined
              dense
              class="mt-n1"
              style="margin-left: 24px;"
              v-model="formValues.companyKey"
              :rules="showForm ? [(v) => validations.required(v, 'Required')] : []"
              height="40"
              :readonly="!showForm"
            ></v-text-field>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 other-settings__list-item mt-n1">
        <v-list-item-content>
          <label class="other-settings__list-item-header" for="alertbox-text"
            >Enterprise Vault</label
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        class="px-0 other-settings__list-item"
        style="min-height: auto; margin-top: 5px; max-width: 591px;"
      >
        <v-list-item-content class="enterprise-vault-url">
          <v-checkbox
            v-model.trim="formValues.enableEnterpriseVault"
            class="other-settings__checkbox k-checkbox mt-n1"
            @change="handleEnterpriseVaultChange"
            color="#2196f3"
            label="Enable enterprise vault"
            :readonly="!showForm"
          ></v-checkbox>
          <template v-if="formValues.enableEnterpriseVault">
            <transition appear name="fade">
              <div class="site-url__container mt-n4">
                <span class="site-url__message site-url__message--3">Enterprise vault URL</span>
                <v-text-field
                  placeholder="www.bc.com"
                  outlined
                  :disabled="enterpriseVaultDisabled"
                  dense
                  class="k-textfield mt-2"
                  v-model.trim="formValues.enterpriseVaultUrl"
                  height="40"
                  :readonly="!showForm"
                ></v-text-field>
              </div>
            </transition>
          </template>
        </v-list-item-content>
      </v-list-item>

      <phishing-settings-footer
        v-if="showFooter"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
        class-name="mt-4"
      />
    </v-form>
  </v-container>
</template>

<script>
import { required } from '../../../utils/validations'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'

export default {
  name: 'OtherSettings',
  components: { PhishingSettingsFooter },
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeaderLink: {
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
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showForm: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    formData: {
      handler(data) {
        const {
          companyKey,
          enterpriseVaultUrl,
          apiUrl,
          isEnableProxy,
          apiKey,
          enableEnterpriseVault
        } = data
        this.formValues.companyKey = companyKey
        this.formValues.enterpriseVaultUrl = enterpriseVaultUrl || ''
        this.formValues.enableEnterpriseVault = enableEnterpriseVault || false
        this.enterpriseVaultDisabled = !enterpriseVaultUrl
        this.formValues.apiUrl = apiUrl || ''
        this.formValues.isEnableProxy = isEnableProxy || false
        this.formValues.apiKey = apiKey || ''
      }
    }
  },
  data() {
    return {
      formValues: {
        isEnableProxy: false,
        apiUrl: '',
        companyKey: '',
        enableEnterpriseVault: null,
        enterpriseVaultUrl: '',
        apiKey: ''
      },
      enterpriseVaultDisabled: true,
      validations: {
        required
      }
    }
  },
  methods: {
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        return false
      }
    },
    getFormValues() {
      if (this.$refs.refForm.validate()) {
        return this.formValues
      } else {
        return false
      }
    },
    handleEnterpriseVaultChange(value) {
      this.enterpriseVaultDisabled = !value
    }
  },
  created() {
    if (this.formData) {
      const {
        companyKey,
        enterpriseVaultUrl,
        apiUrl,
        isEnableProxy,
        apiKey,
        enableEnterpriseVault
      } = this.formData
      this.formValues.companyKey = companyKey
      this.formValues.enterpriseVaultUrl = enterpriseVaultUrl || ''
      this.formValues.enableEnterpriseVault = enableEnterpriseVault || false
      this.enterpriseVaultDisabled = !enterpriseVaultUrl
      this.formValues.apiUrl = apiUrl || ''
      this.formValues.isEnableProxy = isEnableProxy || false
      this.formValues.apiKey = apiKey || ''
    } else {
      this.formValues.companyKey = localStorage.getItem('companyId')
      this.formValues.enableEnterpriseVault = false
      this.formValues.apiKey =
        process.env.VUE_APP_API_KEY || '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX'
      this.formValues.apiUrl =
        process.env.VUE_APP_WEB_API_TEST || 'https://apitest.keepnetlabs.com/api'
    }
  }
}
</script>

<style lang="scss">
.other-settings {
  &__link {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3 !important;
    flex-basis: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    @media (max-width: 768px) {
      margin-top: 10px;
      justify-content: center;
    }
  }

  &__footer {
    &-disabled {
    }
  }

  &__api-settings {
    &-container {
      display: flex;
      align-items: center;
      .v-text-field.v-text-field--enclosed .v-text-field__details {
        margin-bottom: 2px;
      }
      .v-input--dense > .v-input__control > .v-input__slot {
        margin-bottom: 0;
      }
      label {
        font-size: 14px;
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
        opacity: 0.7;
      }
    }
  }

  &__title {
    font-size: 24px;
    line-height: 1.29 !important;
    opacity: 0.9;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87) !important;
    overflow: visible;
  }
  &__sub-title {
    font-size: 14px;
    line-height: 1.5 !important;
    letter-spacing: normal;
    opacity: 0.9;
    color: rgba(0, 0, 0, 0.87) !important;
    overflow: visible;
  }

  &__checkbox {
    .v-input__slot {
      margin-bottom: 0 !important;
      margin-top: -5px;
    }
    &.v-input--selection-controls {
      padding-top: 0 !important;
    }
    .v-label {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
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
    //margin-top: -2px;
    max-width: 554px;
    overflow: visible;
    .v-list-item__content {
      padding: 0 !important;
      overflow: visible;
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
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
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
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    letter-spacing: normal;
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
    font-size: 14px;
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
      margin-top: -9px !important;
      @media (max-width: 768px) {
        margin-top: 8px !important;
      }
    }

    &--3 {
    }
  }
}

.margin-status-optional {
  margin-bottom: 12px;
}
</style>
