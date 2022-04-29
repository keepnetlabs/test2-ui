<template>
  <app-modal
    v-if="status"
    :status="status"
    :icon-name="'mdi-book-search'"
    :title="getTitle"
    className="mail-configuration__modal"
    ref="mail-configuration__modal"
    title-id="text--create-dns-mail-configuration-modal-title"
    @closeOverlay="cancelDns"
  >
    <template v-slot:overlay-body>
      <v-form ref="dnsForm">
        <app-modal-body-header
          :title="'Integrate with a DNS Provider'"
          sub-title="Create a DNS provider integration for phishing domains"
        />
        <form-group title="DNS Name" has-hint>
          <InputEntityName
            v-model.trim="formValues.dnsServiceProviderName"
            id="input--dns-name"
            entityName="dns name"
            initialPlaceholder="Enter DNS name"
          />
        </form-group>
        <form-group title="Service Type" has-hint>
          <k-select
            :items="providerTypes"
            custom-menu-class="menu--provider"
            placeholder="Select Service Type"
            dense
            deletable-chips
            autocomplete="off"
            outlined
            v-model.trim="formValues.dnsServiceProviderTypeId"
            item-value="value"
            item-text="text"
            :rules="[(v) => validations.required(v, labels.Required)]"
            no-data-text="No service type available"
            hint="*Required"
            persistent-hint
          ></k-select>
        </form-group>
        <form-group title="Email Address" has-hint>
          <InputEmail
            placeholder="Enter email address"
            v-model.trim="formValues.username"
            :required="true"
          />
        </form-group>
        <form-group title="API Key" has-hint>
          <InputEntityName
            v-model="formValues.password"
            id="input--password"
            entityName="api key"
            class="new-client__textfield new-client__api-key__textfield"
            initialPlaceholder="Enter API Key from your provider"
            :initialRules="apiKeyRules"
          />
        </form-group>
        <make-available-for
          v-model="availableForRequests"
          ref="refMakeAvailableFor"
          sub-title="Select companies that should see this landing page template in their libraries"
        />

        <form-group :title="labels.TestConnection" class="mt-2">
          <TestConnection
            :values="formValues"
            ref="testConnection"
            @testConnectionValues="testConnectionValues"
            @loading="saveButtonDisabled = false"
          />
        </form-group>
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
          @click="cancelDns"
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
import TestConnection from './TestConnection'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import KSelect from '@/components/Common/Inputs/KSelect'
import { createDnsServiceList, getDnsService, updateDnsServiceList } from '@/api/dnsServices'
import * as Validations from '@/utils/validations'
import InputEmail from '@/components/Common/Inputs/InputEmail'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
export default {
  name: 'NewEditDnsService',
  components: {
    AppModal,
    TestConnection,
    AppModalBodyHeader,
    FormGroup,
    MakeAvailableFor,
    KSelect,
    InputEmail,
    InputEntityName
  },
  props: {
    status,
    resourceId: {
      required: false
    },
    isEdit: {
      required: false
    }
  },
  created() {
    if (!this.isEdit) {
      this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
    }
    if (this.isEdit) {
      this.formValues.resourceId = this.resourceId
      getDnsService(this.resourceId).then((res) => {
        this.formValues = JSON.parse(JSON.stringify(res.data.data))
        delete this.formValues.availableForList
        this.formValues.dnsServiceProviderTypeId.toString()
        if (this.$refs.refMakeAvailableFor) {
          this.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
            res.data.data.availableForList
          )
        } else {
          this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
            res.data.data.availableForList
          )
        }
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
      })
    }
  },
  data() {
    return {
      isValidate: null,
      providerTypes: [{ text: 'Cloudflare', value: 1 }],
      availableForRequests: [],
      initialFormValues: {},
      formValues: {
        dnsServiceProviderTypeId: 1,
        dnsServiceProviderName: null,
        username: null,
        password: null,
        resourceId: null
      },
      nonEditableAvailableForRequests: [],
      labels,
      validations: Validations,
      saveButtonDisabled: false,
      apiKeyRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
      ]
    }
  },
  computed: {
    getTitle() {
      return this.status && this.resourceId
        ? 'Edit DNS Provider Integration'
        : 'Create New DNS Provider Integration'
    }
  },
  methods: {
    testConnectionValues() {},
    resetForm() {
      this.formValues = {
        dnsServiceProviderTypeId: null,
        dnsServiceProviderName: null,
        username: null,
        password: null,
        availableForRequests: [],
        resourceId: null
      }
    },
    cancelDns() {
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
      this.saveButtonDisabled = true
      let isValid = true
      const { refMakeAvailableFor } = this.$refs
      if (refMakeAvailableFor) {
        refMakeAvailableFor.validateAvailableFor(this.availableForRequests)
        isValid = refMakeAvailableFor.isAvailableForValid
      }
      if (this.$refs.dnsForm.validate() && isValid) {
        let payload = {
          ...this.formValues,
          availableForRequests: refMakeAvailableFor.getAvailableForValues(this.availableForRequests)
        }
        if (this.isEdit && !this.isDuplicate) {
          updateDnsServiceList(payload, this.resourceId)
            .then(() => {
              this.$emit('changeStatus', false, true)
            })
            .finally(() => {
              this.saveButtonDisabled = false
            })
        } else {
          createDnsServiceList(payload)
            .then(() => {
              this.$emit('changeStatus', false, true)
            })
            .finally(() => {
              this.saveButtonDisabled = false
            })
        }
      } else {
        this.saveButtonDisabled = false
        const el = this.$refs.dnsForm.$el.querySelector('.v-messages__message')
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
