<template>
  <app-modal
    v-if="status"
    :status="status"
    :id="isEdit ? 'edit-proxy-settings-modal' : 'new-proxy-settings-modal'"
    confirm-button-id="btn-save--proxy-settings-modal"
    cancel-button-id="btn-cancel--proxy-settings-modal"
    title-id="text--create-proxy-settings-modal-title"
    :title="getTitle"
    icon-name="mdi-mailbox"
    class-name="new-proxy-setting"
    :saveDisable="saveDisable"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template #overlay-body>
      <app-modal-body-header
        title="Proxy Server Settings"
        sub-title="Fill information and credentials"
      />
      <v-form ref="refForm">
        <form-group :title="'Proxy Setting Name'" has-hint>
          <InputEntityName
            v-model.trim="formValues.name"
            id="input--proxy-settings-name"
            entity-name="Proxy setting"
          />
        </form-group>
        <form-group :title="'Proxy Address or IP'" has-hint>
          <InputEntityName
            v-model.trim="formValues.address"
            id="input--proxy-settings-name"
            initialPlaceholder="Enter proxy address or IP"
            entityName="Proxy address"
            :initialRules="proxyAddressRules"
            @input="saveDisable = true"
          />
        </form-group>
        <form-group :title="'Port'" has-hint>
          <InputEntityName
            v-model.trim="formValues.port"
            id="input--proxy-settings-name"
            initialPlaceholder="Enter port"
            entityName="port"
            :initialRules="portRules"
            @input="saveDisable = true"
          />
        </form-group>
        <form-group :title="'Authentication Method'" has-hint class-name="mb-4">
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
          <InputEntityName
            v-bind="getUserNameAndPasswordCommonProps"
            v-model.trim="formValues.userName"
            id="input--smtp-settings-username"
            initialPlaceholder="Enter username"
            entityName="username"
            :initialRules="getUserNameRules"
            :required="false"
            @input="saveDisable = true"
          />
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
            :type="passwordFieldType"
            :append-icon="passwordAppendIcon"
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
            class="mt-n1 mb-n2"
            color="#2196f3"
            label="Make this setting default"
          />
        </form-group>
        <form-group title="Test Connection" sub-title="Enter a domain to test connection">
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
              <v-icon
                v-if="testConnectionSuccess && !isTesting"
                class="ml-2"
                color="#43a047"
                left
                medium
                >mdi-check
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
import { scrollToComponent, isDifferent } from '@/utils/functions'
import {
  createProxySettings,
  getProxySettings,
  testConnection,
  updateProxySettings
} from '@/api/proxySettings'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import labels from '@/model/constants/labels'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
export default {
  name: 'NewProxySettings',
  components: {
    InputEntityName,
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
      testConnectionSuccess: false,
      labels,
      isTestEmailDialogShowing: false,
      isTestEmailActionDisabled: false,
      isTestEmailErrorDialogShowing: false,
      getTestConnectionDisableStatus: false,
      timeoutId: null,
      saveDisable: true,
      initialFormValues: null,
      formValues: {
        name: '',
        address: '',
        port: '',
        authenticationTypeId: 0,
        username: '',
        password: '',
        isDefault: false,
        testUrl: 'https://www.google.com'
      },
      showPassword: false,
      testEmailErrorMessage: '',
      nonEditableAvailableForRequests: [],
      serviceProviderItems: [],
      validations: validations,
      isTestMailSend: false,
      proxyAddressRules: [
        (v) => validations.required(v),
        (v) =>
          validations.maxLength(v, 5000, labels.getMaxLengthMessage('Proxy Address or IP', 5000)),
        (v) => validations.isProxyAddressOrIp(v)
      ],
      portRules: [(v) => validations.required(v), (v) => validations.port(v)]
    }
  },
  computed: {
    passwordAppendIcon() {
      if (this.isEdit) return ''
      return this.showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
    },
    passwordFieldType() {
      return this.showPassword ? 'text' : 'password'
    },
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
  created() {
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit && this.resourceId) {
      this.callForGetProxySettings()
      this.saveDisable = false
    }
  },
  beforeDestroy() {
    this.clearTimeoutIfHasTimeout()
  },
  methods: {
    submit() {
      const { refForm } = this.$refs
      if (refForm.validate()) {
        const payload = {
          Address: this.formValues.address,
          Name: this.formValues.name,
          AuthenticationTypeId: this.formValues.authenticationTypeId,
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
        const [serverAddress, serverPort] = item?.split(':')
        this.formValues.serverAddress = serverAddress
        this.formValues.serverPort = serverPort
      } else {
        this.formValues.serverAddress = ''
        this.formValues.serverPort = ''
      }
    },
    clearTimeoutIfHasTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
    },
    handleTestConnection() {
      const { refForm } = this.$refs
      if (refForm.validate() && !this.isTesting) {
        this.isTesting = true
        let payload = {
          resourceId: this.resourceId,
          Address: this.formValues.address,
          AuthenticationTypeId: this.formValues.authenticationTypeId,
          Username: this.formValues.authenticationTypeId === 0 ? '' : this.formValues.userName,
          Password: this.formValues.authenticationTypeId === 0 ? '' : this.formValues.password,
          TestUrl: this.formValues.testUrl,
          Port: this.formValues.port
        }
        testConnection(payload)
          .then(() => {
            this.saveDisable = false
            this.testConnectionSuccess = true
            this.clearTimeoutIfHasTimeout()
            this.timeoutId = setTimeout(() => {
              this.testConnectionSuccess = false
            }, 3000)
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
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('closeOverlay')
      } else {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback: () => {
            this.$emit('closeOverlay')
          }
        })
      }
    },
    onPortChange(val) {
      if (val.length) {
        const numberVal = Number(val)
        const newVal = isNaN(numberVal) ? '' : val
        const renderedValue = /\d/gi.test(newVal) ? newVal : this.formValues.serverPort
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
            data: { name, address, port, authenticationTypeId, username, password, isDefault } = {}
          } = {}
        } = response
        this.formValues.name = name
        this.formValues.address = address
        this.formValues.port = port
        this.formValues.authenticationTypeId = authenticationTypeId
        this.formValues.userName = username
        this.formValues.password = password
        this.formValues.isDefault = isDefault
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  }
}
</script>
