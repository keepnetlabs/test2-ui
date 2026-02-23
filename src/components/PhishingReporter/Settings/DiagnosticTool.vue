<template>
  <v-container fill-height fluid tag="div">
    <v-list-item
      v-if="showHeader"
      class="pl-0 other-settings__list-item mt-0 pr-0 mr-2 diagnostic-tool__header"
    >
      <v-list-item-content>
        <v-list-item-title class="diagnostic-tool__title">
          Diagnostic Tool
        </v-list-item-title>
        <v-list-item-subtitle class="diagnostic-tool__sub-title mb-3">
          Helper tool to check status of the add-in and diagnose problems
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <div class="diagnostic-tool" id="diagnostic-tool" v-if="!isInModal">
      <v-list-item class="px-0 diagnostic-tool__list-item">
        <v-list-item-content>
          <div class="diagnostic-tool__list-item-header">
            Proxy Settings
          </div>
          <v-form ref="refForm">
            <v-radio-group
              v-model="formValues.proxyMode"
              id="input--target-group-priority"
              class="mt-1 mb-6"
              hide-details
              row
              :readonly="!showForm"
            >
              <v-radio
                :value="PROXY_MODE.NO_PROXY"
                id="input--diagnostic-tool-no-proxy"
                label="No Proxy"
                color="#2196f3"
              ></v-radio>
              <v-radio
                :value="PROXY_MODE.AUTO"
                id="input--diagnostic-tool-auto"
                label="Auto"
                color="#2196f3"
              ></v-radio>
              <v-radio
                :value="PROXY_MODE.CUSTOM"
                id="input--diagnostic-tool-custom"
                label="Custom"
                color="#2196f3"
              ></v-radio>
            </v-radio-group>
            <div v-if="formValues.proxyMode === PROXY_MODE.CUSTOM">
              <form-group title="Proxy Address" has-hint>
                <div class="new-smtp-setting__server-address-container">
                  <InputUrl
                    v-model.trim="formValues.proxyAddress"
                    id="input--diagnostic-tool-proxy-address"
                    placeholder="Enter proxy address"
                    :rules="proxyAddressRules"
                    :readonly="!showForm"
                  />
                  <v-text-field
                    ref="refTextField"
                    id="input--diagnostic-tool-server-port"
                    :value="formValues.proxyPort"
                    outlined
                    dense
                    :placeholder="labels.Port"
                    :rules="proxyPortRules"
                    :readonly="!showForm"
                    @input="onPortChange"
                  ></v-text-field>
                </div>
              </form-group>
              <form-group title="Authentication Method" has-hint class-name="mb-4">
                <v-radio-group
                  v-model="authenticationTypeId"
                  class="send-welcome-email__radio-group"
                  hide-details
                  row
                  :readonly="!showForm"
                  @change="handleAuthenticationMethodChange"
                >
                  <v-radio
                    :value="0"
                    label="Transparent (No authentication)"
                    color="#2196f3"
                  ></v-radio>
                  <v-radio :value="1" label="Basic" color="#2196f3"></v-radio>
                </v-radio-group>
              </form-group>
              <form-group
                v-if="authenticationTypeId === 1"
                title="Proxy User Name or Email Address"
              >
                <v-text-field
                  v-model.trim="formValues.proxyUserName"
                  id="input--diagnostic-tool-username"
                  outlined
                  dense
                  persistentHint
                  hint="*Required"
                  placeholder="Enter proxy username"
                  :rules="getUserNameRules"
                  :readonly="!showForm"
                ></v-text-field>
              </form-group>
              <form-group v-if="authenticationTypeId === 1" title="Password">
                <v-text-field
                  v-model.trim="formValues.proxyUserPassword"
                  id="input--smtp-settings-password"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  persistentHint
                  hint="*Required"
                  placeholder="Enter password"
                  class="username-field input-group--focused mb-3"
                  :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                  :rules="getPasswordRules"
                  :readonly="!showForm"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </form-group>
            </div>
          </v-form>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 diagnostic-tool__list-item">
        <v-list-item-content style="display: block;">
          <div class="diagnostic-tool__list-item-header">Optional Features</div>
          <v-checkbox
            v-model="formValues.isEnableAddIn"
            class="diagnostic-tool__checkbox k-checkbox mb-4"
            id="input--phishing-reporter-is-enable-add-in"
            hide-details
            color="#2196f3"
            label="Check and enable all disabled add-ins automatically"
            :readonly="!showForm"
          ></v-checkbox>
        </v-list-item-content>
      </v-list-item>
    </div>
    <phishing-settings-footer
      v-if="showFooter"
      className="mt-4"
      :saveDisable="saveDisable"
      :saveButtonDisabled="saveButtonDisabled"
      @submit="submit($event)"
      @submitWithDownload="submit($event, true)"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { generateDiagnosticTool, downloadDiagnosticTool } from '@/api/phishingReporter'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'DiagnosticTool',
  components: {
    InputUrl,
    FormGroup,
    PhishingSettingsFooter
  },
  props: {
    isInModal: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: null
    },
    showHeaderLink: {
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
    },
    saveButtonDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formValues: {
        isEnableAddIn: false,
        writeAddinStatusToHKLM: false,
        writeAddinStatusToHKCU: false,
        proxyMode: 0,
        proxyAddress: '',
        proxyPort: '',
        proxyUserName: '',
        proxyUserPassword: ''
      },
      initialFormValues: {
        isEnableAddIn: false,
        writeAddinStatusToHKLM: false,
        writeAddinStatusToHKCU: false,
        proxyMode: 0,
        proxyAddress: '',
        proxyPort: '',
        proxyUserName: '',
        proxyUserPassword: ''
      },
      PROXY_MODE: {
        NO_PROXY: 0,
        AUTO: 1,
        CUSTOM: 2
      },
      authenticationTypeId: 0,
      spinnerStatus: false,
      showPassword: false,
      menu2: false,
      showTimePicker: false,
      intervalItems: ['Daily', 'Weekly', 'Monthly'],
      dayItems: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      validations,
      labels,
      proxyAddressRules: [
        (v) => validations.required(v),
        (v) =>
          validations.maxLength(v, 200, labels.getMaxLengthMessage('Proxy Address or IP', 200)),
        (v) => validations.isProxyAddressOrIp(v)
      ],
      proxyPortRules: [(v) => validations.required(v), (v) => validations.port(v)]
    }
  },
  computed: {
    ...mapGetters({
      timezones: 'common/getTimezones'
    }),
    getUserNameRules() {
      const rules = [
        (v) =>
          validations.maxLength(
            v,
            200,
            labels.getMaxLengthMessage(labels.UserNameOrEmailAddress, 200)
          )
      ]
      if (this.authenticationTypeId === 1) rules.unshift((v) => validations.required(v))
      return rules
    },
    getPasswordRules() {
      const rules = [
        (v) => validations.maxLength(v, 200, labels.getMaxLengthMessage(labels.Password, 200))
      ]
      if (this.authenticationTypeId === 1) rules.unshift((v) => validations.required(v))
      return rules
    }
  },
  watch: {
    formValues: {
      handler(val) {
        if (JSON.stringify(val) !== JSON.stringify(this.initialFormValues)) {
          this.$emit('formValuesChanged', val)
        }
      },
      deep: true
    }
  },
  created() {
    if (this.formData) {
      this.formValues.isEnableAddIn = this.formData.isEnableAddIn
      this.formValues.writeAddinStatusToHKCU = this.formData.writeAddinStatusToHKCU
      this.formValues.writeAddinStatusToHKLM = this.formData.writeAddinStatusToHKLM
      this.formValues.proxyMode = this.formData.proxyMode
      this.formValues.proxyPort = this.formData.proxyPort
      this.formValues.proxyAddress = this.formData.proxyAddress
      this.formValues.proxyUserName = this.formData.proxyUserName
      this.formValues.proxyUserPassword = this.formData.proxyUserPassword
      if (this.formValues.proxyUserName || this.formValues.proxyUserPassword) {
        this.authenticationTypeId = 1
      }
    }
    this.initialFormValues = structuredClone(this.formValues)
    this.$emit('getInitialFormValues', this.formValues)
  },
  methods: {
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    getCurrentValues() {
      return this.formValues
    },
    onPortChange(val) {
      if (val.length) {
        const numberVal = Number(val)
        const newVal = Number.isNaN(numberVal) ? '' : val
        const renderedValue = /\d/gi.test(newVal) ? newVal : this.formValues.proxyPort
        this.formValues.proxyPort = renderedValue
        this.$refs.refTextField.lazyValue = renderedValue
      } else {
        this.formValues.proxyPort = ''
        this.$refs.refTextField.lazyValue = ''
      }
    },
    handleAuthenticationMethodChange(val) {
      if (val === 0) {
        this.formValues.proxyUserName = ''
        this.formValues.proxyUserPassword = ''
      }
    },
    getFormValues() {
      return this.formValues
    },
    callForGenerateDiagnosticTool() {
      generateDiagnosticTool().then((response) => {
        this.callForDownloadDiagnosticTool(response.data.data.resourceId)
      })
    },
    callForDownloadDiagnosticTool(id) {
      this.spinnerStatus = true
      downloadDiagnosticTool(id)
        .then((response) => {
          this.spinnerStatus = false
          const { data } = response
          const link = document.createElement('a')
          link.href = globalThis.URL.createObjectURL(data)
          link.download = `DiagnosticTool.msi`
          link.click()
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.spinnerStatus = true
            setTimeout(() => {
              this.callForDownloadDiagnosticTool(id)
            }, 7500)
          } else {
            this.spinnerStatus = false
          }
        })
    }
  }
}
</script>
