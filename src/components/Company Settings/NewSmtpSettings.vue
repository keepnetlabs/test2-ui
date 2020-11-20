<template>
  <app-modal
    v-if="status"
    :status="status"
    @closeOverlay="closeOverlay"
    @submit="submit"
    :title="'New SMTP Setting'"
    icon-name="mdi-mailbox"
    class-name="new-smtp-setting"
  >
    <template v-slot:overlay-body>
      <app-modal-body-header
        title="SMTP Server Settings"
        sub-title="Fill information and credentials"
      />
      <v-form ref="refForm">
        <form-group title="SMTP Setting Name" has-hint>
          <v-text-field
            placeholder="Enter SMTP setting name"
            outlined
            dense
            v-model.trim="formValues.name"
            hint="*Required"
            persistent-hint
            :rules="[(v) => validations.required(v, 'Required')]"
          ></v-text-field>
        </form-group>
        <form-group title="Service Provider" has-hint>
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
            :rules="[(v) => validations.required(v, 'Required')]"
            placeholder="Select option"
          ></k-select>
        </form-group>
        <form-group title="SMTP Server Address" has-hint>
          <div class="new-smtp-setting__server-address-container">
            <v-text-field
              placeholder="Server URL or IP Address"
              outlined
              dense
              v-model.trim="formValues.serverAddress"
              hint="*Required"
              persistent-hint
              :rules="[(v) => validations.required(v, 'Required')]"
            ></v-text-field>
            <v-text-field
              placeholder="Port"
              outlined
              ref="refTextField"
              dense
              @input="onPortChange"
              :rules="[(v) => validations.required(v, 'Required')]"
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
            :rules="[(v) => validations.required(v, 'Required')]"
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
            :rules="[(v) => validations.required(v, 'Required')]"
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
        <form-group title="Reply to">
          <v-text-field
            placeholder="Enter Reply to"
            outlined
            dense
            :rules="[(v) => validations.mail(v, 'Invalid email address')]"
            v-model.trim="formValues.replyTo"
          ></v-text-field>
        </form-group>
        <form-group title="Error to">
          <v-text-field
            placeholder="Enter Error to"
            outlined
            dense
            :rules="[(v) => validations.mail(v, 'Invalid email address')]"
            v-model.trim="formValues.errorTo"
          ></v-text-field>
        </form-group>
        <form-group title="CC">
          <v-text-field
            placeholder="Enter CC address"
            outlined
            :rules="[(v) => validations.mail(v, 'Invalid email address')]"
            dense
            v-model.trim="formValues.cC"
          ></v-text-field>
        </form-group>
        <form-group title="BCC">
          <v-text-field
            placeholder="Enter BCC address"
            outlined
            dense
            :rules="[(v) => validations.mail(v, 'Invalid email address')]"
            v-model.trim="formValues.bCC"
          ></v-text-field>
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
import { maxLength, required, mail } from '@/utils/validations'
import { scrollToComponent } from '@/utils/functions'
import { getLookupListByTypeId } from '@/api/common'
import { createSMTPSettings, getSmtpSettings, updateSmtpSettings } from '@/api/smtpSettings'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'NewSmtpSettings',
  components: {
    KSelect,
    AppModal,
    AppModalBodyHeader,
    FormGroup
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
      formValues: {
        name: '',
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
      serviceProviderItems: [],
      companyItems: [],
      validations: {
        maxLength,
        required,
        mail
      }
    }
  },
  methods: {
    submit() {
      const refForm = this.$refs.refForm
      if (refForm.validate()) {
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
          customHeader
        } = this.formValues
        const payload = {
          name,
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
          const el = refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
    },
    callForCreateSmtpSettings(payload = {}) {
      createSMTPSettings(payload)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: 'New SMTP settings has been created',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.$emit('closeOverlayWithUpdate')
        })
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'New SMTP settings can not be created'
          })
        })
    },
    callForUpdateSmtpSettings(payload = {}) {
      updateSmtpSettings({ ...payload, resourceId: this.resourceId })
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: 'SMTP settings have been updated',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.$emit('closeOverlayWithUpdate')
        })
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            message: 'New SMTP settings can not be updated'
          })
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
      const numberVal = Number(val)
      const newVal = isNaN(numberVal) ? '' : val
      const renderedValue = /[0-9]/gi.test(newVal) ? newVal : this.formValues.serverPort
      this.formValues.serverPort = renderedValue
      this.$refs.refTextField.lazyValue = renderedValue
    },
    callForGetSmtpSettings() {
      getSmtpSettings(this.resourceId).then((response) => {
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
              userName
            } = {}
          } = {}
        } = response
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
    }
  },
  created() {
    if (this.isEdit && this.resourceId) {
      this.callForGetSmtpSettings()
    }
    getLookupListByTypeId(12).then((response) => {
      const { data: { data = [] } = {} } = response
      this.serviceProviderItems = data
    })
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
