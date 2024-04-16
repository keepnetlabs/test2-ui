<template>
  <app-modal
    v-if="status"
    :status="status"
    icon-name="$domain"
    :title="getTitle"
    className="mail-configuration__modal"
    ref="domain__modal"
    title-id="text--create-domain-modal-title"
    @closeOverlay="status = false"
  >
    <template v-slot:overlay-body>
      <v-form ref="domainForm">
        <app-modal-body-header
          :title="'New Domain'"
          sub-title="Create a phishing domain for your phishing landing pages"
        />
        <form-group title="Domain" has-hint>
          <InputEntityName
            v-model.trim="formValues.domain"
            id="input--domain"
            entityName="domain"
            initialPlaceholder="yourdomain.com"
            :initialRules="domainRules"
          />
        </form-group>
        <form-group title="DNS Service" has-hint>
          <k-select
            v-model="formValues.dnsServiceProviderId"
            :items="domainData['dnsServiceProviders']"
            custom-menu-class="menu--provider"
            placeholder="Select DNS Service"
            dense
            deletable-chips
            autocomplete="off"
            outlined
            persistent-hint
            hint="*Required"
            item-value="value"
            no-data-text="No DNS service available"
            item-text="text"
            :rules="[(v) => Validations.required(v, labels.Required)]"
          ></k-select>
        </form-group>
        <div v-if="isShowCustomizeDnsRecords">
          <v-checkbox
            v-model="isShowCustomizeDnsRecordsDetail"
            :class="['k-checkbox', isShowCustomizeDnsRecordsDetail ? 'mb-4' : 'mb-7']"
            label="Customize DNS Record"
            color="#2196f3"
            id="input--is-show-dns-records-detail"
            hide-details
          />
          <form-group
            v-if="isShowCustomizeDnsRecordsDetail"
            class-name="dns-customize-records-detail"
            has-hint
            title="DNS Record"
          >
            <k-select
              v-model.trim="formValues.recordTypeId"
              style="max-width: 134px;"
              :items="domainData['recordTypes']"
              placeholder="Select option"
              outlined
              dense
              :rules="[(v) => Validations.required(v, labels.Required)]"
            />
            <v-text-field
              v-bind="getPropsByRecordTypeId"
              v-model="formValues.dnsRecord"
              class="ml-2"
              outlined
              dense
              persistent-hint
              hint="*Required"
            ></v-text-field>
          </form-group>
        </div>
        <form-group title="Proxy Status">
          <div class="d-flex">
            <v-radio-group
              v-model.trim="formValues.proxyStatusId"
              class="mt-4 mb-6"
              style="margin-top: 16px !important;"
              row
            >
              <v-radio
                v-for="item in domainData.proxyStatuses"
                :key="item.value"
                hide-details
                color="#2196f3"
                :value="item.value"
                :label="item.text"
                class="mr-4"
              />
            </v-radio-group>
          </div>
        </form-group>
        <form-group title="Schema">
          <div class="d-flex">
            <v-radio-group
              v-model.trim="formValues.urlSchemaTypeId"
              class="mt-4 mb-6"
              style="margin-top: 16px !important;"
              row
            >
              <v-radio
                v-for="item in domainData.urlSchemas"
                :key="item.value"
                color="#2196f3"
                hide-details
                :value="item.value"
                :label="item.text"
                class="mr-4"
                :disabled="formValues.proxyStatusId === '2'"
              />
            </v-radio-group>
          </div>
        </form-group>
        <form-group title="Zone ID" has-hint sub-title="Enter Cloudflare Zone ID">
          <InputEntityName
            v-model.trim="formValues.zoneId"
            placeholder="Enter Zone ID"
            id="input--zoneId"
            entityName="zone id"
            initialPlaceholder="Enter Zone ID"
            :initialRules="zoneIdRules"
          />
        </form-group>
        <make-available-for
          ref="refMakeAvailableFor"
          v-model="availableForRequests"
          sub-title="Select companies that should see this landing page template in their libraries"
        />

        <form-group :title="labels.TestConnection" class="mt-2">
          <TestConnection
            ref="testConnection"
            :values="formValues"
            @testConnectionValues="onTestConnectionValuesChange"
            @testConnectionClicked="handleTestConnectionClick"
            @loading="onTestConnectionLoadingChange"
            @save-button-disabled="onTestConnectionSaveButtonDisabledChange"
          />
        </form-group>
      </v-form>
    </template>
    <template #overlay-footer>
      <AppModalFooter
        :ids="{
          saveButton: 'btn-save--mail-configurations-modal',
          cancelButton: 'btn-cancel--mail-configurations-modal'
        }"
        :action-button-disabled="saveButtonDisabled"
        @on-cancel="cancelDomain"
        @on-save="submit"
      />
    </template>
  </app-modal>
</template>

<script>
import labels from '@/model/constants/labels'
import AppModal from '@/components/AppModal'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as Validations from '@/utils/validations'
import { createDomain, getDomainEditData, updateDomain } from '@/api/domains'
import TestConnection from '@/components/Settings/Domains/TestConnection'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import AppModalFooter from '@/components/AppModalFooter'

const ENUMS = {
  CNAME: '1',
  A: '2'
}
export default {
  name: 'NewEditDnsService',
  components: {
    AppModalFooter,
    TestConnection,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    MakeAvailableFor,
    KSelect,
    InputEntityName
  },
  props: {
    status,
    resourceId: {
      required: false
    },
    isEdit: {
      required: false
    },
    domainData: {
      required: false
    }
  },
  data() {
    return {
      isShowCustomizeDnsRecordsDetail: true,
      isValidate: null,
      availableForRequests: [],
      isTestConnectionWorkedBefore: false,
      initialFormValues: {
        domain: null,
        recordTypeId: '2',
        dnsServiceProviderId: null,
        dnsRecord: null,
        proxyStatusId: '1',
        urlSchemaTypeId: '1',
        zoneId: null,
        active: true,
        resourceId: null
      },
      formValuesAfterTest: {
        domain: null,
        recordTypeId: '2',
        dnsServiceProviderId: null,
        dnsRecord: null,
        proxyStatusId: '1',
        urlSchemaTypeId: '1',
        zoneId: null,
        active: true,
        resourceId: null
      },
      formValues: {
        domain: null,
        recordTypeId: '2',
        dnsServiceProviderId: null,
        dnsRecord: null,
        proxyStatusId: '1',
        urlSchemaTypeId: '1',
        zoneId: null,
        active: true,
        resourceId: null
      },
      nonEditableAvailableForRequests: [],
      labels,
      Validations,
      saveButtonDisabled: false,
      domainRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
      ],
      zoneIdRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.ZoneID, 64))
      ]
    }
  },
  computed: {
    getTitle() {
      return this.status && this.resourceId ? 'Edit Domain' : 'Create New Domain'
    },
    isShowCustomizeDnsRecords() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
    },
    getPropsByRecordTypeId() {
      const props = {}
      const { recordTypeId } = this.formValues
      if (recordTypeId === ENUMS.A) {
        props.placeholder = 'Enter IP Address'
        props.rules = [
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.ip(v)
        ]
      } else if (recordTypeId === ENUMS.CNAME) {
        props.placeholder = 'Server name (e.g. test.domain.com)'
        props.rules = [
          (v) => Validations.startsWithSpace(v),
          (v) => Validations.required(v, labels.Required),
          (v) => Validations.url(v, labels.InvalidURL),
          (v) => Validations.maxLength(v, 5000, labels.getMaxLengthMessage(labels.URL, 5000))
        ]
      }
      return props
    }
  },
  watch: {
    isShowCustomizeDnsRecordsDetail(val) {
      if (val && !this.formValues.recordTypeId) {
        this.formValues.recordTypeId = this.domainData['recordTypes'][1]?.value
      }
    }
  },
  created() {
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit) {
      this.formValues.resourceId = this.resourceId
      getDomainEditData(this.resourceId).then((res) => {
        this.formValues = JSON.parse(JSON.stringify(res.data.data))
        this.formValues.domain = res?.data?.data?.domain
        this.formValues.recordTypeId = this.formValues.recordTypeId?.toString()
        this.formValues.proxyStatusId = this.formValues.proxyStatusId?.toString()
        this.formValues.zoneId = this.formValues.zoneId?.toString()
        this.formValues.urlSchemaTypeId = this.formValues.urlSchemaTypeId?.toString()
        this.formValues.dnsServiceProviderId = this.formValues.dnsServiceProviderId?.toString()
        if (this.formValues.recordTypeId) this.isShowCustomizeDnsRecordsDetail = true
        delete this.formValues.availableForList
        const availableForList = res?.data?.data?.availableForList
        if (this.$refs.refMakeAvailableFor && availableForList?.length) {
          const availableForListFromBackend = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
            availableForList
          )
          if (!availableForListFromBackend.length) {
            this.availableForRequests = [
              {
                id: 'MyCompanyOnly',
                label: 'My company only',
                type: 'MyCompanyOnly',
                resourceId: null
              }
            ]
          } else {
            this.availableForRequests = availableForListFromBackend
          }
        } else {
          this.availableForRequests = [
            {
              id: 'MyCompanyOnly',
              label: 'My company only',
              type: 'MyCompanyOnly',
              resourceId: null
            }
          ]
          this.nonEditableAvailableForRequests = getAvailableForListFromBackend(availableForList)
        }
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  },
  methods: {
    onTestConnectionLoadingChange(newValue) {
      this.saveButtonDisabled = !newValue
    },
    onTestConnectionSaveButtonDisabledChange(newValue) {
      this.saveButtonDisabled = newValue
    },
    onTestConnectionValuesChange(isSuccess, isSave) {
      this.formValuesAfterTest = JSON.parse(JSON.stringify(this.formValues))
      if (isSuccess) {
        this.isTestConnectionWorkedBefore = true
        if (isSave) {
          const { refMakeAvailableFor } = this.$refs
          let payload = {
            ...this.formValues,
            availableForRequests: refMakeAvailableFor.getAvailableForValues(
              this.availableForRequests
            )
          }
          if (!this.isShowCustomizeDnsRecordsDetail) {
            this.formValues.recordTypeId = null
            this.formValues.dnsRecord = null
          }
          if (this.isEdit && !this.isDuplicate) {
            updateDomain(payload, this.resourceId)
              .then(() => {
                this.$emit('changeStatus', false, true)
              })
              .finally(() => {
                this.saveButtonDisabled = false
              })
          } else {
            createDomain(payload)
              .then(() => {
                this.$emit('changeStatus', false, true)
              })
              .finally(() => {
                this.saveButtonDisabled = false
              })
          }
        }
      }
    },
    resetForm() {
      this.formValues = {
        domain: null,
        recordTypeId: null,
        dnsServiceProviderId: null,
        dnsRecord: '',
        proxyStatusId: null,
        urlSchemaTypeId: null,
        zoneId: null,
        availableForRequests: null,
        active: true,
        resourceId: null
      }
    },
    cancelDomain() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        this.resetForm()
        this.$emit('changeStatus')
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.resetForm()
          this.$emit('changeStatus')
        }
      })
    },
    submit() {
      this.handleTestConnectionClick(true)
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    },
    handleTestConnectionClick(isSave = false) {
      this.saveButtonDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }

      if (this.$refs.domainForm.validate() && isValid) {
        this.$refs.testConnection.testConnection(isSave)
        setTimeout(() => {
          let el = this.$el.querySelector('.test-connection__testing-content__item')
          scrollToComponent(el)
        }, 50)
      } else {
        this.saveButtonDisabled = false
        const el = this.$refs.domainForm.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
      }
    }
  }
}
</script>
