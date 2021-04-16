<template>
  <app-modal
    v-if="status"
    :status="status"
    :id="isEdit ? 'edit-smtp-settings-modal' : 'new-smtp-settings-modal'"
    confirm-button-id="btn-save--smtp-settings-modal"
    cancel-button-id="btn-cancel--smtp-settings-modal"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="getTitle"
    icon-name="mdi-mailbox"
    class-name="new-smtp-setting"
    :saveDisable="saveDisable"
  >
    <template v-slot:overlay-body>
      <test-email-dialog
        v-if="isTestEmailDialogShowing"
        ref="refTestEmailDialog"
        :status="isTestEmailDialogShowing"
        :is-action-button-disabled="isTestEmailActionDisabled"
        @closeDialog="toggleTestConnectionDialog"
        @confirm="callForTestConnection"
      />
      <test-email-error-dialog
        v-if="isTestEmailErrorDialogShowing"
        :is-show-error-message="isTestEmailErrorDialogShowing"
        :error-message="testEmailErrorMessage"
        @closeDialog="toggleTestEmailErrorDialog"
      />
      <app-modal-body-header
        title="SMTP Server Settings"
        sub-title="Fill information and credentials"
      />
      <v-form ref="refForm">
        <form-group :title="labels.SMTPSettingName" has-hint>
          <v-text-field
            placeholder="Enter SMTP setting name"
            outlined
            dense
            v-model.trim="formValues.name"
            hint="*Required"
            persistent-hint
            :rules="[
              (v) => validations.required(v),
              (v) => validations.startsWithSpace(v),
              (v) =>
                validations.maxLength(
                  v,
                  64,
                  labels.getMaxLengthMessage(labels.SMTPSettingNameSecondLower)
                )
            ]"
          ></v-text-field>
        </form-group>
        <form-group :title="labels.ServiceProvider" has-hint>
          <k-select
            v-model.trim="formValues.serviceProvider"
            :items="serviceProviderItems"
            class="new-integration__select"
            dense
            outlined
            hint="*Required"
            item-text="name"
            item-value="code"
            :menu-props="{ offsetY: true }"
            persistent-hint
            @change="handleChangeServiceProvider"
            :rules="[(v) => validations.required(v)]"
            placeholder="Select option"
          ></k-select>
        </form-group>
        <form-group :title="labels.SMTPServerAddress" has-hint>
          <div class="new-smtp-setting__server-address-container">
            <InputUrl
              placeholder="Server URL or IP Address"
              v-model.trim="formValues.serverAddress"
              :rules="[
                (v) => validations.required(v),
                (v) => validations.startsWithSpace(v),
                (v) =>
                  validations.maxLength(
                    v,
                    200,
                    labels.getMaxLengthMessage(labels.SMTPServerAddressSecondLower, 200)
                  )
              ]"
            ></InputUrl>
            <v-text-field
              :placeholder="labels.Port"
              outlined
              ref="refTextField"
              dense
              @input="onPortChange"
              :rules="[
                (v) => validations.required(v),
                (v) => validations.maxLength(v, 10, labels.getMaxLengthMessage(labels.Port, 10))
              ]"
              :value="formValues.serverPort"
            ></v-text-field>
          </div>
        </form-group>
        <form-group
          title="User Name or Email Address"
          :has-hint="!!getUserNameAndPasswordCommonProps"
        >
          <v-text-field
            v-bind="getUserNameAndPasswordCommonProps"
            placeholder="Enter username"
            outlined
            dense
            v-model.trim="formValues.userName"
            :rules="getUserNameRules"
          ></v-text-field>
        </form-group>
        <form-group title="Password" :has-hint="!!getUserNameAndPasswordCommonProps">
          <v-text-field
            v-bind="getUserNameAndPasswordCommonProps"
            placeholder="Enter password"
            outlined
            dense
            v-model.trim="formValues.password"
            :type="showPassword ? 'text' : 'password'"
            :append-icon="isEdit ? '' : showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            class="username-field input-group--focused"
            @click:append="showPassword = !showPassword"
            :rules="getPasswordRules"
          ></v-text-field>
        </form-group>
        <form-group>
          <v-checkbox
            v-model="formValues.useAuthentication"
            class="mt-n3 mb-1"
            color="#2196f3"
            label="Use Authentication"
          />
          <v-checkbox v-model="formValues.useSSL" class="mb-1" color="#2196f3" label="Use SSL" />
          <v-checkbox
            v-model="formValues.hasSMTPRelay"
            class="mb-2"
            color="#2196f3"
            label="Has SMTP Relay"
          />
        </form-group>
        <make-available-for
          v-if="showMakeAvailableFor"
          ref="refMakeAvailableFor"
          v-model="formValues.availableForRequests"
          class="mb-2"
        />
        <form-group title="Reply to" sub-title="Send replies to this email address">
          <InputEmail
            placeholder="Enter Reply to"
            v-model.trim="formValues.replyTo"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="Error to" sub-title="Send error messages to this email address">
          <InputEmail
            placeholder="Enter Error to"
            v-model.trim="formValues.errorTo"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="CC">
          <InputEmail
            placeholder="Enter CC address"
            v-model.trim="formValues.cC"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="BCC">
          <InputEmail
            placeholder="Enter BCC address"
            v-model.trim="formValues.bCC"
            :hint="null"
            :persistent-hint="false"
            :required="false"
          />
        </form-group>
        <form-group title="Custom Header">
          <v-textarea
            outlined
            dense
            rows="2"
            no-resize
            placeholder="Enter Custom Header"
            height="100"
            v-model.trim="formValues.customHeader"
          ></v-textarea>
        </form-group>
        <form-group title="Test Email" sub-title="Send an email to test SMTP settings">
          <v-btn
            id="btn-test-connection--smtp-settings"
            class="white--text btn-util btn-save-changes mb-6"
            color="#2196f3"
            rounded
            :disabled="getTestConnectionDisableStatus"
            @click="handleTestConnection"
          >
            <span>Send Test email</span>
            <v-icon class="ml-2">mdi-send</v-icon>
          </v-btn>
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
  createSMTPSettings,
  getSmtpSettings,
  testConnection,
  updateSmtpSettings
} from '@/api/smtpSettings'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import labels from '@/model/constants/labels'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import TestEmailDialog from '@/components/Company Settings/SmtpSettings/TestEmailDialog'
import TestEmailErrorDialog from '@/components/Company Settings/SmtpSettings/TestEmailErrorDialog'
export default {
  name: 'NewSmtpSettings',
  components: {
    TestEmailErrorDialog,
    TestEmailDialog,
    MakeAvailableFor,
    KSelect,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    InputUrl,
    InputEmail
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
      labels,
      isTestEmailDialogShowing: false,
      isTestEmailActionDisabled: false,
      isTestEmailErrorDialogShowing: false,
      getTestConnectionDisableStatus: false,
      saveDisable: false,
      formValues: {
        name: '',
        availableForRequests: [],
        serviceProvider: '',
        serverAddress: '',
        serverPort: '',
        userName: '',
        password: '',
        useAuthentication: false,
        useSSL: false,
        hasSMTPRelay: false,
        replyTo: '',
        errorTo: '',
        cC: '',
        bCC: '',
        customHeader: ''
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
      return this.isEdit && this.resourceId ? labels.EditSMTPSetting : labels.NewSMTPSetting
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
      const { refForm, refMakeAvailableFor } = this.$refs
      let isValid = true
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }

      if (refForm.validate() && isValid) {
        if (!this.isTestMailSend) {
          this.isTestEmailDialogShowing = true
          return false
        }
        if (JSON.stringify(this.initialFormValues) !== JSON.stringify(this.formValues)) {
          this.isTestEmailDialogShowing = true
          return false
        }
        this.saveDisable = true
        const {
          name,
          serverAddress,
          serverPort,
          userName,
          password,
          useAuthentication,
          useSSL,
          hasSMTPRelay,
          replyTo,
          errorTo,
          cC,
          bCC,
          customHeader,
          availableForRequests
        } = this.formValues
        const { companyName, selectedCompanyName } = this.$store.state.auth
        const payload = {
          name,
          availableForRequests: this.showMakeAvailableFor
            ? refMakeAvailableFor.getAvailableForValues(availableForRequests)
            : companyName === selectedCompanyName
            ? getAvailableForValues(this.nonEditableAvailableForRequests)
            : null,
          serverAddress,
          serverPort,
          userName,
          password,
          useAuthentication: Number(useAuthentication),
          useSSL: Number(useSSL),
          hasSMTPRelay: Number(hasSMTPRelay),
          replyTo,
          errorTo,
          cC,
          bCC,
          customHeader
        }

        if (this.isEdit) {
          this.callForUpdateSmtpSettings(payload)
        } else {
          this.callForCreateSmtpSettings(payload)
        }
      } else {
        return this.$nextTick(() => {
          this.saveDisable = false
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    callForTestConnection(testEmailPayload = {}) {
      this.isTestEmailActionDisabled = true
      this.saveDisable = true
      const payload = {
        ...testEmailPayload,
        serverAddress: this.formValues.serverAddress,
        port: Number(this.formValues.serverPort),
        username: this.formValues.userName,
        password: this.formValues.password,
        resourceId: this.resourceId,
        useAuthentication: Number(this.formValues.useAuthentication),
        useSsl: Number(this.formValues.useSSL)
      }
      testConnection(payload)
        .then(() => {
          this.isTestEmailDialogShowing = false
          this.isTestMailSend = true
          this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
        })
        .catch((error) => {
          const { response } = error
          this.testEmailErrorMessage = response.data.message
          this.isTestEmailErrorDialogShowing = true
        })
        .finally(() => {
          this.isTestEmailActionDisabled = false
          this.saveDisable = false
        })
    },
    callForCreateSmtpSettings(payload = {}) {
      createSMTPSettings(payload)
        .then(() => {
          this.$emit('closeOverlayWithUpdate')
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    callForUpdateSmtpSettings(payload = {}) {
      updateSmtpSettings({ ...payload, resourceId: this.resourceId })
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
      this.toggleTestConnectionDialog()
      this.$nextTick(() => {
        this.$refs.refTestEmailDialog.formValues.message = `This is a test email by ${this.formValues.name}`
      })
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
    callForGetSmtpSettings() {
      return getSmtpSettings(this.resourceId).then((response) => {
        const {
          data: {
            data: {
              cc,
              bcc,
              customHeader,
              errorTo,
              hasSMTPRelay,
              name,
              password,
              replyTo,
              serverAddress,
              serverPort,
              useAuthentication,
              useSSL,
              userName,
              availableForList
            } = {}
          } = {}
        } = response
        if (this.$refs.refMakeAvailableFor) {
          this.formValues.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
            availableForList
          )
        } else {
          this.nonEditableAvailableForRequests = getAvailableForListFromBackend(availableForList)
        }
        this.formValues.cC = cc
        this.formValues.bCC = bcc
        this.formValues.customHeader = customHeader
        this.formValues.errorTo = errorTo
        this.formValues.hasSMTPRelay = hasSMTPRelay
        this.formValues.name = name
        this.formValues.password = password
        this.formValues.replyTo = replyTo
        this.formValues.serverAddress = serverAddress
        this.formValues.serverPort = serverPort
        this.formValues.useAuthentication = useAuthentication
        this.formValues.useSSL = useSSL
        this.formValues.userName = userName
        this.formValues.serviceProvider = `${serverAddress}:${serverPort}`
      })
    },
    callForServiceProviderItems() {
      getLookupListByTypeId(12).then((response) => {
        const { data: { data = [] } = {} } = response
        this.serviceProviderItems = data
        if (this.isEdit && this.resourceId) {
          if (
            !this.serviceProviderItems.find((item) => item.code === this.formValues.serviceProvider)
          ) {
            this.formValues.serviceProvider = this.serviceProviderItems.find(
              (item) => item.name === 'Custom'
            )
          }
        }
        this.isTestMailSend = true
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  },
  created() {
    if (this.isEdit && this.resourceId) {
      this.callForGetSmtpSettings().finally(() => {
        this.callForServiceProviderItems()
      })
    } else {
      this.callForServiceProviderItems()
    }
  }
}
</script>

<style lang="scss">
.new-smtp-setting {
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
}
</style>
