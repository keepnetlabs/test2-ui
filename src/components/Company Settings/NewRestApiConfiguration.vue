<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New Rest API Configuration'"
    icon-name="mdi-domain"
    class-name="new-rest-api-configuration"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header title="Rest API Configuration" sub-title="Set new API" />
      <v-form lazy-validation ref="refForm">
        <form-group title="URL">
          <v-text-field
            placeholder="Enter URL"
            outlined
            dense
            :rules="[(v) => validations.url(v, 'Invalid URL')]"
            v-model.trim="formValues.url"
          ></v-text-field>
        </form-group>
        <form-group title="Auth. Key" class-name="auth-key">
          <div class="auth-key__container">
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
        </form-group>
        <form-group title="Auth. Secret" class-name="auth-key">
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
        </form-group>
        <form-group title="Company ID" class-name="auth-key">
          <div class="auth-key__container">
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
        </form-group>
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
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { url } from '@/utils/validations'
export default {
  name: 'NewRestApiConfiguration',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup
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
  max-width: 100% !important;
  &__container {
    display: flex;
  }
  &__button {
    font-size: 14px;
    font-weight: 600;
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
