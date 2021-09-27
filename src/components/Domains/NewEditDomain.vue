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
        <form-group title="Record Type">
          <k-select
            :items="domainData.recordTypes"
            custom-menu-class="menu--provider"
            placeholder="Select Record Type"
            dense
            deletable-chips
            autocomplete="off"
            outlined
            v-model="formValues.recordTypeId"
            item-value="value"
            item-text="text"
            class="pop-up-card__invite-member"
            persistent-hint
          ></k-select>
        </form-group>
        <form-group title="DNS Service">
          <k-select
            :items="domainData.dnsServiceProviders"
            custom-menu-class="menu--provider"
            placeholder="Select DNS Service"
            dense
            deletable-chips
            autocomplete="off"
            outlined
            v-model="formValues.dnsServiceProviderId"
            item-value="value"
            item-text="text"
            class="pop-up-card__invite-member"
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
            <v-checkbox
              v-for="item in domainData.proxyStatuses"
              v-model="formValues.proxyStatusId"
              :key="item.value"
              color="#2196f3"
              :value="item.value"
              :label="item.text"
              class="mr-4"
            >
            </v-checkbox>
          </div>
        </form-group>
        <form-group title="Schema">
          <div class="d-flex">
            <v-checkbox
              v-for="item in domainData.urlSchemas"
              v-model="formValues.urlSchemaTypeId"
              :key="item.value"
              color="#2196f3"
              :value="item.value"
              :label="item.text"
              class="mr-4"
            >
            </v-checkbox>
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
        <make-available-for
          v-if="isRenderMakeAvailableFor"
          ref="refMakeAvailableFor"
          v-model="formValues.availableForRequests"
          :disabled="!showMakeAvailableFor"
        />

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
        this.formValues.recordTypeId = this.formValues.recordTypeId.toString()
        this.formValues.proxyStatusId = this.formValues.proxyStatusId.toString()
        this.formValues.zoneId = this.formValues.zoneId.toString()
        this.formValues.urlSchemaTypeId = this.formValues.urlSchemaTypeId.toString()
        this.formValues.dnsServiceProviderId = this.formValues.dnsServiceProviderId.toString()
        delete this.formValues.availableForList
        if (this.$refs.refMakeAvailableFor) {
          this.formValues.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
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
      formValues: {
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
      },
      nonEditableAvailableForRequests: [],
      labels,
      validations: Validations,
      saveButtonDisabled: false
    }
  },
  computed: {
    isRenderMakeAvailableFor() {
      if (this.editItemsDisabled) {
        return false
      }
      if (this.$store.state.auth.userRoleName === 'CompanyAdmin') {
        return !!this.selectedItem
      }
      return true
    },
    showMakeAvailableFor() {
      return this.$store.state.auth.userRoleName !== 'CompanyAdmin'
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
        refMakeAvailableFor.validateAvailableFor(this.formValues.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      let payload = this.formValues
      if (this.$refs.domainForm.validate() && isValid) {
        if (this.isEdit && !this.isDuplicate) {
          updateDomain(payload, this.resourceId)
            .then((response) => {
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

<style scoped></style>
