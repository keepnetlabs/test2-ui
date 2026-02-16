<template>
  <AppModal
    v-if="status"
    :status="status"
    :id="selectedItem ? 'edit-siem-integrations-modal' : 'new-siem-integrations-modal'"
    :title="getModalTitle"
    :save-disable="isActionButtonDisabled"
    icon-name="mdi-plus"
    confirm-button-id="btn-save--siem-integrations-template-modal"
    cancel-button-id="btn-siem-integrations--notification-template-modal"
    title-id="text--siem-integrations-modal-title"
    @closeOverlay="handleClose"
    @submit="handleSubmit"
  >
    <template v-slot:overlay-body>
      <AppModalBodyHeader :title="getModalTitle" :sub-title="getBodySubtitle" />
      <v-form ref="refForm" lazy-validation>
        <FormGroup :title="labels.IntegrationName" has-hint>
          <InputEntityName
            v-model.trim="formData.name"
            id="input--siem-integration-name"
            entity-name="Integration"
          />
        </FormGroup>
        <FormGroup title="History Logs" class-name="mb-2">
          <div>
            <v-checkbox
              v-model="formData.isForwardHistoricalAuditLog"
              id="input--siem-integration-forward-historical-audit-log"
              label="History Logs"
              color="#2196f3"
              style="margin-top: 2px;"
            ></v-checkbox>
          </div>
        </FormGroup>
        <FormGroup :title="labels.IntegrationType" has-hint>
          <KSelect
            v-model.trim="formData.typeId"
            persistent-hint
            dense
            outlined
            autocomplete="off"
            item-value="value"
            item-text="text"
            no-data-text="No service type available"
            hint="*Required"
            custom-menu-class="menu--provider"
            placeholder="Select Integration Type"
            :rules="[(v) => Validations.required(v, labels.Required)]"
            :items="providerTypes"
          ></KSelect>
        </FormGroup>
        <FormGroup
          v-if="isSplunkIntegration"
          has-hint
          :title="labels.SIEMAddress"
          :subTitle="labels.URLOrIPAddress"
        >
          <InputUrl
            v-model.trim="formData.apiUrl"
            id="input--siem-integrations-url-splunk"
            placeholder="Enter SIEM URL/IP address"
            :rules="apiUrlRules"
          />
        </FormGroup>
        <FormGroup v-if="isSplunkIntegration" :title="labels.SecretToken" has-hint>
          <v-text-field
            v-model.trim="formData.token"
            id="input--siem-integrations-secret-token"
            outlined
            dense
            persistent-hint
            placeholder="Enter GUID Token"
            hint="*Required"
            :rules="secretTokenRules"
          ></v-text-field>
        </FormGroup>
        <FormGroup v-if="isSyslogIntegration" has-hint :title="labels.ServerAddress">
          <div class="siem-integration-modal__server-address">
            <InputUrl
              v-model.trim="formData.serverAddress"
              id="input--siem-integrations-url-syslog"
              placeholder="Enter server address"
              :rules="serverAddressRules"
            />
            <div class="siem-integration-modal__server-address-port">
              <InputEntityName
                v-model.trim="formData.port"
                id="input--siem-integrations-port"
                initialPlaceholder="Enter port"
                entityName="port"
                :initialRules="portRules"
              />
            </div>
          </div>
        </FormGroup>
        <FormGroup v-if="isSyslogIntegration" has-hint :title="labels.ConnectionType">
          <v-radio-group
            v-model="formData.connectionType"
            id="input--siem-integrations-connection-type"
            class="mt-1 mb-6"
            hide-details
            row
          >
            <v-radio value="UDP" label="UDP" color="#2196f3"></v-radio>
            <v-radio value="TCP" label="TCP" color="#2196f3"></v-radio>
          </v-radio-group>
        </FormGroup>
        <FormGroup :title="labels.TestConnection">
          <v-btn
            id="btn-test-connection--proxy-settings"
            class="btn-util btn-save-changes"
            rounded
            color="white"
            style="box-shadow: none !important;"
            :style="getTestConnectionStyle"
            @click="handleTestConnection(false)"
          >
            <span>Test Connection</span>
            <v-icon v-if="isTesting" class="ml-2 loading-spin" color="#2196f3" left medium
              >mdi-rotate-left
            </v-icon>
            <v-icon
              v-if="isTested && !isTesting"
              :id="`btn--siem-integration-api-key-check`"
              class="ml-2"
              color="#43a047"
              left
              medium
              >mdi-check
            </v-icon>
          </v-btn>
        </FormGroup>
        <FormGroup has-hint class-name="mt-6" title="Status">
          <v-switch
            v-model.trim="formData.statusId"
            id="input--switch-siem-integration-status"
            class="k-switch"
            hide-details
            color="#2196f3"
            style="max-width: 100px;"
            :label="formData.statusId ? 'Active' : 'Inactive'"
          />
        </FormGroup>
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import { scrollToComponent } from '@/utils/functions'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputUrl from '@/components/Common/Inputs/InputUrl'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import KSelect from '@/components/Common/Inputs/KSelect'
import {
  createSIEMIntegration,
  getSIEMIntegration,
  testSIEMIntegration,
  updateSIEMIntegration
} from '@/api/siemIntegrations'

export default {
  name: 'SIEMIntegrationsAddOrEditModal',
  components: {
    KSelect,
    InputEntityName,
    InputUrl,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedItem: {
      type: Object
    }
  },
  data() {
    return {
      isTesting: false,
      isTested: false,
      providerTypes: [
        { text: 'Splunk', value: 1 },
        {
          text: 'Syslog',
          value: 2
        }
      ],
      formData: {
        name: '',
        apiUrl: '',
        token: '',
        serverAddress: '',
        port: '',
        connectionType: '',
        typeId: '',
        isForwardHistoricalAuditLog: false,
        statusId: 1
      },
      ENUMS: {
        URL: labels.URL.toUpperCase()
      },
      secretTokenRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.maxLength(v, 2000, labels.getMaxLengthMessage(labels.SecretToken, 2000))
      ],
      apiUrlRules: [
        (v) => Validations.startsWithHttpOrHttps(v, labels.MustStartWithHttpOrHttps),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.urlOrIpAddress(v),
        (v) => Validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000))
      ],
      serverAddressRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.urlOrIpAddress(v),
        (v) => Validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000))
      ],
      portRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.port(v)
      ],
      isActionButtonDisabled: false,
      labels,
      Validations
    }
  },
  computed: {
    isSplunkIntegration() {
      return this.formData.typeId === 1
    },
    isSyslogIntegration() {
      return this.formData.typeId === 2
    },
    getModalTitle() {
      return this.selectedItem ? labels.EditSIEMIntegration : labels.NewSIEMIntegration
    },
    getBodySubtitle() {
      return labels.SIEMSettingSubtitle
    },
    getTestConnectionDisableStatus() {
      if (this.isSplunkIntegration) {
        return (
          !this.formData.apiUrl ||
          !this.formData.token ||
          !this.formData.typeId ||
          this.isTesting ||
          Validations.urlOrIpAddress(this.formData.apiUrl) === 'Invalid URL'
        )
      }

      if (this.isSyslogIntegration) {
        return (
          !this.formData.serverAddress ||
          !this.formData.port ||
          !this.formData.connectionType ||
          !this.formData.typeId ||
          this.isTesting ||
          Validations.urlOrIpAddress(this.formData.serverAddress) === 'Invalid URL'
        )
      }

      return true
    },
    getTestConnectionStyle() {
      const style = {
        border: '1px solid #2196f3 !important',
        color: '#2196f3',
        opacity: '1',
        pointerEvents: 'auto'
      }
      if (this.getTestConnectionDisableStatus) {
        style.opacity = '.5'
        style.pointerEvents = 'none'
      }
      return style
    }
  },
  watch: {
    formData(val, oldVal) {
      if (
        val.apiUrl !== oldVal.apiUrl ||
        val.token !== oldVal.token ||
        val.typeId !== oldVal.typeId
      ) {
        this.isTested = false
      }
    }
  },
  created() {
    if (this.selectedItem) {
      getSIEMIntegration(this.selectedItem.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = data[key]
        })
      })
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleSubmit() {
      if (this.$refs.refForm.validate()) {
        if (this.formData.statusId) {
          if (this.isTested) this.submitForm()
          else this.handleTestConnection(true)
        } else {
          this.submitForm()
        }
      } else {
        this.$nextTick(() => {
          scrollToComponent(this.$refs.refForm.$el.querySelector('.error--text'))
        })
      }
    },
    submitForm() {
      this.isActionButtonDisabled = true
      const payload = {
        ...this.formData,
        statusId: Number(this.formData.statusId),
        apiUrl: this.isSplunkIntegration ? this.formData.apiUrl : null,
        token: this.isSplunkIntegration ? this.formData.token : null,
        serverAddress: this.isSyslogIntegration ? this.formData.serverAddress : null,
        port: this.isSyslogIntegration ? this.formData.port : null,
        connectionType: this.isSyslogIntegration ? this.formData.connectionType : null
      }
      if (!this.selectedItem) {
        createSIEMIntegration(payload)
          .then(() => {
            this.$emit('on-submit')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        updateSIEMIntegration(this.selectedItem.resourceId, payload)
          .then(() => {
            this.$emit('on-submit')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    },
    handleTestConnection(isSubmitForm = false) {
      this.isTesting = true
      let payload
      if (this.isSyslogIntegration) {
        payload = {
          resourceId: '',
          serverAddress: this.formData.serverAddress,
          port: this.formData.port,
          connectionType: this.formData.connectionType,
          typeId: this.formData.typeId
        }
      }
      if (this.isSplunkIntegration) {
        payload = {
          resourceId: '',
          apiUrl: this.formData.apiUrl,
          token: this.formData.token,
          typeId: this.formData.typeId
        }
      }

      if (this.selectedItem) {
        payload.resourceId = this.selectedItem.resourceId
      }
      this.isActionButtonDisabled = true
      testSIEMIntegration(payload)
        .then(() => {
          this.isTested = true
          if (isSubmitForm) this.submitForm()
          else this.isActionButtonDisabled = false
        })
        .catch(() => {
          this.isTested = false
          this.isActionButtonDisabled = false
        })
        .finally(() => {
          this.isTesting = false
        })
    }
  }
}
</script>
