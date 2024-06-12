<template>
  <v-container fluid id="other-settings" class="other-settings">
    <v-list-item
      v-if="showHeader"
      class="pl-0 other-settings__list-item mt-0 pr-0 mr-2 other-settings__header"
    >
      <v-list-item-content>
        <v-list-item-title class="other-settings__title">
          Other Settings
        </v-list-item-title>
        <v-list-item-subtitle class="other-settings__sub-title mb-3">
          Extra settings
        </v-list-item-subtitle>
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
              id="input--phishing-reporter-is-enable-proxy"
              class="other-settings__checkbox k-checkbox mt-n3"
              color="#2196f3"
              label="Detect and use the proxy settings on your computer"
              :readonly="!showForm"
            ></v-checkbox>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 other-settings__list-item other-settings__list-item-container mt-n1">
        <v-list-item-content>
          <label class="other-settings__list-item-header">Phishing Reporter API Settings</label>
          <div class="other-settings__api-settings-container">
            <label class="mt-n2">Site URL</label>
            <v-text-field
              placeholder="Enter a site url"
              outlined
              dense
              v-bind="getHintValues"
              class="mt-2 other-settings__list-item-container-item--1"
              id="input--phishing-reporter-api-settings"
              v-model.trim="formValues.apiUrl"
              :rules="siteUrlRules"
              height="40"
              :readonly="!showForm"
            ></v-text-field>
          </div>
          <div class="other-settings__api-settings-container mt-n3">
            <label class="other-settings__list-item-header mt-n2">{{ labels.ApiKey }}</label>
            <v-text-field
              placeholder="Enter an api key"
              outlined
              dense
              id="input--phishing-reporter-api-key"
              v-bind="getHintValues"
              class="mt-2 other-settings__list-item-container-item--2"
              v-model.trim="formValues.apiKey"
              :rules="apiKeyRules"
              height="40"
              :readonly="!showForm"
            ></v-text-field>
          </div>
          <div class="other-settings__api-settings-container">
            <label class="other-settings__list-item-header mt-n5">{{ labels.CompanyId }}</label>
            <v-text-field
              v-bind="getHintValues"
              v-model.trim="formValues.companyKey"
              placeholder="Enter a Company ID"
              outlined
              dense
              class="mt-n1 ml-6"
              id="input--phishing-reporter-company-id"
              height="40"
              :rules="apiKeyRules"
              :readonly="!showForm"
            ></v-text-field>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 other-settings__list-item mt-n1">
        <v-list-item-content>
          <label class="other-settings__list-item-header">Enterprise Vault</label>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 other-settings__list-item other-settings__list-item-enter-prise">
        <v-list-item-content class="enterprise-vault-url">
          <v-checkbox
            v-model.trim="formValues.enableEnterpriseVault"
            id="input--phishing-reporter-is-enable-enterprise-vault"
            class="other-settings__checkbox k-checkbox mt-n1"
            color="#2196f3"
            label="Enable enterprise vault"
            :readonly="!showForm"
            @change="handleEnterpriseVaultChange"
          ></v-checkbox>
          <template v-if="formValues.enableEnterpriseVault">
            <transition appear name="fade">
              <div class="site-url__container mt-n4">
                <span class="site-url__message site-url__message--3">Enterprise vault URL</span>
                <v-text-field
                  v-model.trim="formValues.enterpriseVaultUrl"
                  placeholder="Enter enterprise vault url"
                  id="input--phishing-reporter-enterprise-vault-url"
                  outlined
                  dense
                  persistent-hint
                  hint="*Required"
                  class="k-textfield mt-2"
                  height="40"
                  :disabled="enterpriseVaultDisabled"
                  :readonly="!showForm"
                  :rules="getVaultUrlRules"
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
        :saveDisable="saveDisable"
      />
    </v-form>
  </v-container>
</template>

<script>
import * as validations from '@/utils/validations'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
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
    },
    saveDisable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formData: {
      handler(data) {
        const { companyKey, enterpriseVaultUrl, apiUrl, isEnableProxy, apiKey } = data
        this.formValues.companyKey = companyKey || ''
        this.formValues.enterpriseVaultUrl = enterpriseVaultUrl || ''
        this.formValues.enableEnterpriseVault = !!enterpriseVaultUrl || false
        this.enterpriseVaultDisabled = !enterpriseVaultUrl
        this.formValues.apiUrl = apiUrl || ''
        this.formValues.isEnableProxy = isEnableProxy || false
        this.formValues.apiKey = apiKey || ''
      }
    }
  },
  data() {
    return {
      labels,
      formValues: {
        isEnableProxy: false,
        apiUrl: '',
        companyKey: '',
        enableEnterpriseVault: null,
        enterpriseVaultUrl: '',
        apiKey: ''
      },
      enterpriseVaultDisabled: true,
      validations
    }
  },
  computed: {
    siteUrlRules() {
      return this.showForm
        ? [
            (v) => validations.required(v, labels.Required),
            (v) => validations.urlWithPort(v, labels.InvalidURL),
            (v) => validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000))
          ]
        : []
    },
    apiKeyRules() {
      return this.showForm
        ? [
            (v) => validations.required(v, labels.Required),
            (v) => validations.startsWithSpace(v),
            (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.ApiKey, 256))
          ]
        : []
    },
    getHintValues() {
      return this.showForm && { persistentHint: true, hint: '*Required' }
    },
    getVaultUrlRules() {
      const rules = []

      if (this.formValues.enableEnterpriseVault && this.showForm) {
        rules.push(
          (v) => validations.required(v, labels.Required),
          (v) => validations.url(v, labels.InvalidURL),
          (v) => validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000))
        )
      }
      return rules
    }
  },
  methods: {
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        const el = this.$refs.refForm.$el.querySelector('.error--text')
        scrollToComponent(el)
        return false
      }
    },
    getCurrentValues() {
      return this.formValues
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
      if (!value) this.formValues.enterpriseVaultUrl = ''
    }
  },
  created() {
    if (this.formData) {
      const { companyKey, enterpriseVaultUrl, apiUrl, isEnableProxy, apiKey } = this.formData
      this.formValues.companyKey = companyKey || ''
      this.formValues.enterpriseVaultUrl = enterpriseVaultUrl || ''
      this.formValues.enableEnterpriseVault = enterpriseVaultUrl || false
      this.enterpriseVaultDisabled = !enterpriseVaultUrl
      this.formValues.apiUrl = apiUrl || ''
      this.formValues.isEnableProxy = isEnableProxy || false
      this.formValues.apiKey = apiKey || ''
    } else {
      this.formValues.companyKey = localStorage.getItem('companyId')
      this.formValues.enableEnterpriseVault = false
      this.formValues.apiKey =
        APP_CONFIG.VUE_APP_API_KEY || '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX'
      this.formValues.apiUrl =
        APP_CONFIG.VUE_APP_PHISHING_REPORTER_URL || 'https://test-addin-api.devkeepnet.com/api'
    }
    this.$emit('getInitialFormValues', this.formValues)
  }
}
</script>
