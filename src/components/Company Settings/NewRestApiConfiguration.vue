<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    :title="'New Rest API Configuration'"
    icon-name="mdi-domain"
    class-name="new-rest-api-configuration"
  >
    <template v-slot:overlay-body>
      <v-list-item class="pl-0 pr-0 mt-8">
        <v-list-item-content>
          <v-list-item-title class="new-smtp-setting__title">
            Rest API Configuration
          </v-list-item-title>
          <v-list-item-subtitle class="new-smtp-setting__sub-title mb-6">
            Set new API
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-form lazy-validation ref="refForm">
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">URL</label>
            <v-text-field
              placeholder="Enter URL"
              outlined
              dense
              :rules="[(v) => validations.url(v, 'Invalid URL')]"
              v-model.trim="formValues.url"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <div class="auth-key">
          <label class="add-user-overlay__label">Auth. Key</label>
          <div class="mt-2 auth-key__container">
            <v-text-field
              placeholder="Generate Key"
              outlined
              dense
              class="auth-key__textfield"
              v-model.trim="formValues.authKey"
            ></v-text-field>
            <v-btn
              text
              v-if="isAuthKeyApiCreated"
              color="#2196f3"
              class="auth-key__button"
              @click="handleCopyToClipboardOfAuthKey"
              :ripple="false"
            >
              Copy to clipboard
            </v-btn>
            <v-btn
              text
              :color="isAuthKeyApiCreated ? '#00bcd4' : '#2196f3'"
              class="auth-key__button"
              :class="[isAuthKeyApiCreated && 'ml-0']"
              @click="handleGenerateApiKeyForAuthKey"
              :ripple="false"
            >
              {{ isAuthKeyApiCreated ? 'Re-Generate API Key' : 'Generate Api Key' }}
            </v-btn>
          </div>
        </div>
        <div class="auth-key">
          <label class="add-user-overlay__label">Auth. Secret</label>
          <div class="mt-2 auth-key__container">
            <v-text-field
              placeholder="Generate Secret"
              outlined
              dense
              class="auth-key__textfield"
              v-model.trim="formValues.authSecret"
            ></v-text-field>
            <v-btn
              text
              v-if="isAuthSecretApiCreated"
              color="#2196f3"
              class="auth-key__button"
              @click="handleCopyToClipboardOfAuthSecret"
              :ripple="false"
            >
              Copy to clipboard
            </v-btn>
            <v-btn
              text
              :color="isAuthSecretApiCreated ? '#00bcd4' : '#2196f3'"
              class="auth-key__button"
              @click="handleGenerateApiKeyForAuthSecret"
              :ripple="false"
              :class="[isAuthSecretApiCreated && 'ml-0']"
            >
              {{ isAuthSecretApiCreated ? 'Re-Generate API Key' : 'Generate Secret Key' }}
            </v-btn>
          </div>
        </div>
        <div class="auth-key">
          <label class="add-user-overlay__label">Company ID</label>
          <div class="mt-2 auth-key__container">
            <v-text-field
              placeholder="Enter Company ID"
              disabled
              outlined
              class="auth-key__textfield"
              dense
              v-model.trim="formValues.companyId"
            ></v-text-field>
            <v-btn
              text
              color="#2196f3"
              class="auth-key__button"
              @click="handleCopyToClipboardOfCompanyId"
              :ripple="false"
            >
              Copy To Clipboard
            </v-btn>
          </div>
        </div>
        <v-list-item class="white-labeling__list-item">
          <v-list-item-content>
            <label class="add-user-overlay__label">Status</label>
            <v-switch
              class="playbook-rule-form__switch mt-2"
              v-model="formValues.isActive"
              :label="formValues.isActive ? 'Active' : 'Inactive'"
              color="#2196f3"
            />
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <v-btn class="new-integration__footer-btn-cancel" @click="closeOverlay" rounded>
        CANCEL
      </v-btn>
      <div class="new-integration__footer__right-col">
        <v-btn
          class="new-integration__footer-btn-save white--text"
          color="#2196f3"
          rounded
          @click="submit"
        >
          SAVE
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import { url } from '@/utils/validations'
export default {
  name: 'NewRestApiConfiguration',
  components: {
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValues: {
        url: '',
        authKey: '',
        authSecret: '',
        companyId: '',
        isActive: true
      },
      isAuthSecretApiCreated: false,
      isAuthKeyApiCreated: false,
      validations: {
        url
      }
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    handleGenerateApiKeyForAuthKey() {
      this.isAuthKeyApiCreated = true
    },
    handleGenerateApiKeyForAuthSecret() {
      this.isAuthSecretApiCreated = true
    },
    handleCopyToClipboardOfCompanyId() {
      navigator.clipboard.writeText(this.formValues.companyId)
    },
    handleCopyToClipboardOfAuthKey() {
      navigator.clipboard.writeText(this.formValues.authKey)
    },
    handleCopyToClipboardOfAuthSecret() {
      navigator.clipboard.writeText(this.formValues.authSecret)
    },
    submit() {}
  },
  created() {
    this.formValues.companyId = localStorage.getItem('companyId')
  }
}
</script>

<style lang="scss">
.auth-key {
  &__container {
    display: flex;
  }
  &__button {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #2196f3;
    margin-left: 8px;
    margin-top: 2px;
  }
  &__textfield {
    max-width: 554px;
  }
}
</style>
