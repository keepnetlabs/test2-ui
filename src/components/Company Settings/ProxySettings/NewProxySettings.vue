<template>
  <app-modal
    v-if="status"
    :status="status"
    :id="isEdit ? 'edit-proxy-settings-modal' : 'new-proxy-settings-modal'"
    confirm-button-id="btn-save--proxy-settings-modal"
    cancel-button-id="btn-cancel--proxy-settings-modal"
    title-id="text--create-proxy-settings-modal-title"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getTitle"
    icon-name="mdi-mailbox"
    class-name="new-proxy-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="Proxy Server Settings"
        sub-title="Fill information and credentials"
      />
      <v-form ref="refForm">
        <form-group :title="'Proxy Setting Name'" has-hint>
          <v-text-field
            v-model.trim="formValues.name"
            id="input--proxy-settings-name"
            placeholder="Enter Proxy setting name"
            outlined
            dense
            hint="*Required"
            persistent-hint
            @input="saveDisable = true"
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Proxy Name'))
            ]"
          ></v-text-field>
        </form-group>
        <form-group :title="'Proxy Address or IP'" has-hint>
          <v-text-field
            v-model.trim="formValues.address"
            id="input--proxy-settings-name"
            placeholder="Enter proxy address or IP"
            outlined
            dense
            hint="*Required"
            persistent-hint
            @input="saveDisable = true"
            :rules="[(v) => validations.required(v)]"
          ></v-text-field>
        </form-group>
        <form-group :title="'Auhtentication Method'" has-hint class-name="mb-4">
          <v-radio-group
            v-model="formValues.authenticationTypeId"
            class="send-welcome-email__radio-group"
            hide-details
            row
            @input="saveDisable = true"
          >
            <v-radio :value="0" label="Transparent (No authentication)" color="#2196f3"></v-radio>
            <v-radio :value="1" label="Basic" color="#2196f3"></v-radio>
          </v-radio-group>
        </form-group>
        <form-group
          title="User Name or Email Address"
          :has-hint="!!getUserNameAndPasswordCommonProps"
          v-if="formValues.authenticationTypeId === 1"
        >
          <v-text-field
            v-bind="getUserNameAndPasswordCommonProps"
            v-model.trim="formValues.userName"
            id="input--smtp-settings-username"
            placeholder="Enter username"
            outlined
            dense
            :rules="getUserNameRules"
            @input="saveDisable = true"
          ></v-text-field>
        </form-group>
        <form-group
          title="Password"
          :has-hint="!!getUserNameAndPasswordCommonProps"
          v-if="formValues.authenticationTypeId === 1"
        >
          <v-text-field
            v-bind="getUserNameAndPasswordCommonProps"
            v-model.trim="formValues.password"
            id="input--smtp-settings-password"
            placeholder="Enter password"
            outlined
            dense
            :type="showPassword ? 'text' : 'password'"
            :append-icon="isEdit ? '' : showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            class="username-field input-group--focused"
            @click:append="showPassword = !showPassword"
            :rules="getPasswordRules"
            @input="saveDisable = true"
          ></v-text-field>
        </form-group>
        <form-group :title="'Make Default Proxy Setting'" class-name="mb-4">
          <v-checkbox
            v-model="formValues.isDefault"
            id="input--proxy-settings-is-authentication"
            class="mt-n3 mb-1"
            color="#2196f3"
            label="Make this setting default"
            @input="saveDisable = true"
          />
        </form-group>
        <form-group title="Test Email" sub-title="Enter a domain to test connection">
          <div class="proxy-test-connection">
            <InputUrl
              placeholder="https://"
              v-model.trim="formValues.testUrl"
              @input="saveDisable = true"
            />
            <v-btn
              id="btn-test-connection--proxy-settings"
              class="white--text btn-util btn-save-changes mb-6"
              rounded
              :disabled="getTestConnectionDisableStatus"
              @click="handleTestConnection"
            >
              <span>Test Connection</span>
              <v-icon v-if="isTesting" class="ml-2 loading-spin" color="#2196f3" left medium
                >mdi-rotate-left
              </v-icon>
            </v-btn>
          </div>
        </form-group>
      </v-form>
    </template>
  </app-modal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import * as validations from '@/utils/validations'
import { scrollToComponent } from '@/utils/functions'
import { getLookupListByTypeId } from '@/api/common'
import {
  createProxySettings,
  getProxySettings,
  testConnection,
  updateProxySettings
} from '@/api/proxySettings'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import labels from '@/model/constants/labels'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
export default {
  name: 'NewProxySettings',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    InputUrl
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: String
    }
  },
  data() {
    return {
      isTesting: false,
      labels,
      isTestEmailDialogShowing: false,
      isTestEmailActionDisabled: false,
      isTestEmailErrorDialogShowing: false,
      getTestConnectionDisableStatus: false,
      saveDisable: true,
      formValues: {
        name: '',
        address: '',
        port: '8080',
        authenticationTypeId: 0,
        username: '',
        password: '',
        isDefault: false,
        testUrl: ''
      },
      initialFormValues: null,
      showPassword: false,
      testEmailErrorMessage: '',
      nonEditableAvailableForRequests: [],
      serviceProviderItems: [],
      validations: validations,
      isTestMailSend: false
    }
  },
  computed: {
    getTitle() {
      return this.isEdit && this.resourceId ? 'Edit Proxy Setting' : 'Create Proxy Setting'
    },
    getUserNameAndPasswordCommonProps() {
      if (!this.formValues.useAuthentication) {
        return null
      }
      return { hint: '*Required', persistentHint: true }
    },
    getUserNameRules() {
      const rules = [
        (v) =>
          validations.maxLength(
            v,
            128,
            labels.getMaxLengthMessage(labels.UserNameOrEmailAddress, 320)
          )
      ]
      if (this.formValues.useAuthentication) rules.unshift((v) => validations.required(v))
      return rules
    },
    getPasswordRules() {
      const rules = [
        (v) => validations.maxLength(v, 128, labels.getMaxLengthMessage(labels.Password, 128))
      ]
      if (this.formValues.useAuthentication) rules.unshift((v) => validations.required(v))
      return rules
    },
    showMakeAvailableFor() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    }
  },
  methods: {
    submit() {
      const { refForm } = this.$refs
      if (refForm.validate()) {
        const payload = {
          Address: this.formValues.address,
          Name: this.formValues.name,
          AuthenticationType: this.formValues.authenticationTypeId,
          Username: this.formValues.authenticationTypeId === 0 ? '' : this.formValues.userName,
          Password: this.formValues.authenticationTypeId === 0 ? '' : this.formValues.password,
          TestUrl: this.formValues.testUrl,
          Port: this.formValues.port,
          IsDefault: this.formValues.isDefault
        }

        if (this.isEdit) {
          this.callForUpdateProxySettings(payload)
        } else {
          this.callForCreateProxySettings(payload)
        }
      } else {
        return this.$nextTick(() => {
          this.saveDisable = false
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    callForCreateProxySettings(payload = {}) {
      createProxySettings(payload)
        .then(() => {
          this.$emit('closeOverlayWithUpdate')
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    callForUpdateProxySettings(payload = {}) {
      updateProxySettings({ ...payload, resourceId: this.resourceId })
        .then(() => {
          this.$emit('closeOverlayWithUpdate')
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    handleChangeServiceProvider(item = '') {
      if (item !== ':') {
        const [serverAddress, serverPort] = item.split(':')
        this.formValues.serverAddress = serverAddress
        this.formValues.serverPort = serverPort
      } else {
        this.formValues.serverAddress = ''
        this.formValues.serverPort = ''
      }
    },
    handleTestConnection() {
      const { refForm } = this.$refs
      if (refForm.validate() && !this.isTesting) {
        this.isTesting = true
        let payload = {
          Address: this.formValues.address,
          AuthenticationType: this.formValues.authenticationTypeId,
          Username: this.formValues.authenticationTypeId === 0 ? '' : this.formValues.userName,
          Password: this.formValues.authenticationTypeId === 0 ? '' : this.formValues.password,
          TestUrl: this.formValues.testUrl,
          Port: this.formValues.port
        }
        testConnection(payload)
          .then((response) => {
            this.saveDisable = false
          })
          .catch(() => {
            this.saveDisable = true
          })
          .finally(() => {
            this.isTesting = false
          })
      }
    },
    toggleTestConnectionDialog() {
      this.isTestEmailDialogShowing = !this.isTestEmailDialogShowing
    },
    toggleTestEmailErrorDialog() {
      this.isTestEmailErrorDialogShowing = !this.isTestEmailErrorDialogShowing
    },
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    onPortChange(val) {
      if (val.length) {
        const numberVal = Number(val)
        const newVal = isNaN(numberVal) ? '' : val
        const renderedValue = /[0-9]/gi.test(newVal) ? newVal : this.formValues.serverPort
        this.formValues.serverPort = renderedValue
        this.$refs.refTextField.lazyValue = renderedValue
      } else {
        this.formValues.serverPort = ''
        this.$refs.refTextField.lazyValue = ''
      }
    },
    callForGetProxySettings() {
      return getProxySettings(this.resourceId).then((response) => {
        const {
          data: {
            data: {
              name,
              address,
              port,
              authenticationTypeId,
              username,
              password,
              isDefault,
              testUrl
            } = {}
          } = {}
        } = response
        this.formValues.name = name
        this.formValues.address = address
        this.formValues.port = port
        this.formValues.authenticationTypeId = authenticationTypeId
        this.formValues.userName = username
        this.formValues.password = password
        this.formValues.isDefault = isDefault
        this.formValues.testUrl = testUrl
      })
    }
  },
  created() {
    if (this.isEdit && this.resourceId) {
      this.callForGetProxySettings()
    }
  }
}
</script>

<style lang="scss">
.new-proxy-setting {
  &__server-address-container {
    display: flex;
    & > div:first-child {
      flex-basis: 90%;
    }
    & > div:last-child {
      flex-basis: 15%;
      margin-left: 16px;
    }
  }
  .btn-save-changes {
    color: #2196f3 !important;
    border-color: #2196f3 !important;
    box-shadow: none !important;
    border-radius: 18px;
    border: solid 1px #2196f3;
  }
  .proxy-test-connection {
    display: flex;
    .v-input {
      padding-right: 8px;
    }
  }
}
</style>
