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
        <form-group title="User Name or Email Address" has-hint>
          <v-text-field
            placeholder="Enter username"
            outlined
            dense
            v-model.trim="formValues.userName"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v)]"
          ></v-text-field>
        </form-group>
        <form-group title="Password" has-hint>
          <v-text-field
            placeholder="Enter password"
            outlined
            dense
            v-model.trim="formValues.password"
            hint="*Required"
            persistent-hint
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            class="username-field input-group--focused"
            @click:append="showPassword = !showPassword"
            :rules="[(v) => validations.required(v)]"
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
import { createSMTPSettings, getSmtpSettings, updateSmtpSettings } from '@/api/smtpSettings'
import KSelect from '@/components/Common/Inputs/KSelect'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import labels from '@/model/constants/labels'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
export default {
  name: 'NewSmtpSettings',
  components: {
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
      showPassword: false,
      nonEditableAvailableForRequests: [],
      serviceProviderItems: [],
      validations: validations
    }
  },
  computed: {
    getTitle() {
      return this.isEdit && this.resourceId ? labels.EditSMTPSetting : labels.NewSMTPSetting
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
