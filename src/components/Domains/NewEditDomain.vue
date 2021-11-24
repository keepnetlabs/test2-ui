<template>
  <app-modal
    :status="status"
    v-if="status"
    @closeOverlay="status = false"
    :icon-name="'mdi-book-search'"
    :title="status && resourceId ? 'Edit Domain' : 'Create New Domain'"
    className="mail-configuration__modal"
    ref="domain__modal"
    title-id="text--create-domain-modal-title"
  >
    <template v-slot:overlay-body>
      <v-form ref="domainForm">
        <app-modal-body-header
          :title="'New Domain'"
          sub-title="Create a phishing domain for your phishing landing pages"
        />
        <form-group title="Domain" has-hint>
          <v-text-field
            placeholder="Enter Domain"
            id="input--domain"
            outlined
            dense
            v-model.trim="formValues.domain"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
            ]"
            hint="*Required"
            persistent-hint
            height="40"
          ></v-text-field>
        </form-group>
        <form-group title="Record Type" has-hint>
          <k-select
            v-model="formValues.recordTypeId"
            :items="domainData.recordTypes"
            custom-menu-class="menu--provider"
            placeholder="Select Record Type"
            dense
            deletable-chips
            autocomplete="off"
            outlined
            item-value="value"
            hint="*Required"
            item-text="text"
            persistent-hint
            :rules="[(v) => validations.required(v, labels.Required)]"
          ></k-select>
        </form-group>
        <form-group title="DNS Service" has-hint>
          <k-select
            :items="domainData.dnsServiceProviders"
            custom-menu-class="menu--provider"
            placeholder="Select DNS Service"
            dense
            deletable-chips
            autocomplete="off"
            outlined
            v-model="formValues.dnsServiceProviderId"
            persistent-hint
            hint="*Required"
            item-value="value"
            item-text="text"
            :rules="[(v) => validations.required(v, labels.Required)]"
          ></k-select>
        </form-group>
        <form-group title="DNS Record" has-hint>
          <v-text-field
            placeholder="Enter DNS Record"
            id="input--domain"
            outlined
            dense
            v-model.trim="formValues.dnsRecord"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.IpAddress, 64))
            ]"
            hint="*Required"
            persistent-hint
            height="40"
          ></v-text-field>
        </form-group>
        <form-group title="Proxy Status">
          <div class="d-flex">
            <v-radio-group v-model.trim="formValues.proxyStatusId" row>
              <v-radio
                v-for="item in domainData.proxyStatuses"
                :key="item.value"
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
            <v-radio-group v-model.trim="formValues.urlSchemaTypeId" row>
              <v-radio
                v-for="item in domainData.urlSchemas"
                :key="item.value"
                color="#2196f3"
                :value="item.value"
                :label="item.text"
                class="mr-4"
                :disabled="formValues.proxyStatusId == 2"
              />
            </v-radio-group>
          </div>
        </form-group>
        <form-group title="Zone ID" has-hint sub-title="Enter Cloudflare Zone ID">
          <v-text-field
            placeholder="Enter Zone ID"
            id="input--domain"
            outlined
            dense
            v-model.trim="formValues.zoneId"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.ZoneID, 64))
            ]"
            hint="*Required"
            persistent-hint
            height="40"
          ></v-text-field>
        </form-group>
        <make-available-for ref="refMakeAvailableFor" v-model="availableForRequests" />

        <v-list-item class="add-user-overlay__list-item">
          <v-list-item-content class="test-connection-wrapper"> </v-list-item-content>
        </v-list-item>
      </v-form>
    </template>
    <template v-slot:overlay-footer>
      <div class="text-left">
        <v-btn
          id="btn-cancel--mail-configurations-modal"
          class="playbook-rule-form__button"
          outlined
          rounded
          color="error"
          @click="cancelDomain"
          >{{ labels.Cancel }}</v-btn
        >
      </div>
      <div>
        <v-btn
          id="btn-save--mail-configurations-modal"
          class="playbook-rule-form__button white--text"
          rounded
          color="#2196f3"
          @click="submit"
          :disabled="saveButtonDisabled"
        >
          {{ labels.Save }}
        </v-btn>
      </div>
    </template>
  </app-modal>
</template>

<script>
import labels from '@/model/constants/labels'
import AppModal from '../AppModal'
import { getAvailableForListFromBackend, getAvailableForValues } from '@/utils/helperFunctions'
import { scrollToComponent } from '@/utils/functions'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import KSelect from '@/components/Common/Inputs/KSelect'
import { createDnsServiceList, getDnsService, updateDnsServiceList } from '@/api/dnsServices'
import * as Validations from '@/utils/validations'
import { createDomain, getDomainEditData, updateDomain, updateDomains } from '@/api/domains'
export default {
  name: 'NewEditDnsService',
  components: {
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    MakeAvailableFor,
    KSelect
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
  created() {
    if (this.isEdit) {
      this.formValues.resourceId = this.resourceId
      getDomainEditData(this.resourceId).then((res) => {
        this.formValues = JSON.parse(JSON.stringify(res.data.data))
        this.formValues.recordTypeId = this.formValues.recordTypeId?.toString()
        this.formValues.proxyStatusId = this.formValues.proxyStatusId?.toString()
        this.formValues.zoneId = this.formValues.zoneId?.toString()
        this.formValues.urlSchemaTypeId = this.formValues.urlSchemaTypeId?.toString()
        this.formValues.dnsServiceProviderId = this.formValues.dnsServiceProviderId?.toString()
        delete this.formValues.availableForList
        if (this.$refs.refMakeAvailableFor) {
          this.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
            res.data.data.availableForList
          )
        } else {
          this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
            res.data.data.availableForList
          )
        }
      })
    }
  },
  data() {
    return {
      isValidate: null,
      availableForRequests: [],
      formValues: {
        domain: null,
        recordTypeId: null,
        dnsServiceProviderId: null,
        dnsRecord: null,
        proxyStatusId: null,
        urlSchemaTypeId: null,
        zoneId: null,
        active: true,
        resourceId: null
      },
      nonEditableAvailableForRequests: [],
      labels,
      validations: Validations,
      saveButtonDisabled: false
    }
  },
  methods: {
    cancelDomain() {
      this.formValues = {
        domain: null,
        recordTypeId: null,
        dnsServiceProviderId: null,
        dnsRecord: null,
        proxyStatusId: null,
        urlSchemaTypeId: null,
        zoneId: null,
        availableForRequests: null,
        active: true,
        resourceId: null
      }
      this.$emit('changeStatus')
    },
    submit() {
      this.saveButtonDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      let payload = {
        ...this.formValues,
        availableForRequests: refMakeAvailableFor.getAvailableForValues(this.availableForRequests)
      }
      if (this.$refs.domainForm.validate() && isValid) {
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
            .then((response) => {
              this.$emit('changeStatus', false, true)
            })
            .finally(() => {
              this.saveButtonDisabled = false
            })
        }
      } else {
        this.saveButtonDisabled = false
        const el = this.$refs.domainForm.$el.querySelector('.v-messages__message')
        scrollToComponent(el)
      }
    },
    validateAvailableFor(value = {}) {
      this.isAvailableForValidated = true
      this.isAvailableForValid = !!value.length
      this.$emit('validation', this.isAvailableForValid)
    }
  }
}
</script>

<style scoped>
.v-input--radio-group {
  margin-top: 0 !important;
}
</style>
