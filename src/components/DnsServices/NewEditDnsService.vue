<template>
  <app-modal
    :status="status"
    v-if="status"
    @closeOverlay="status = false"
    :icon-name="'mdi-book-search'"
    :title="
      status && resourceId
        ? 'Edit New DNS Provider Integration'
        : 'Create New DNS Provider Integration'
    "
    className="mail-configuration__modal"
    ref="mail-configuration__modal"
    title-id="text--create-dns-mail-configuration-modal-title"
  >
    <template v-slot:overlay-body>
      <v-form ref="dnsForm">
        <app-modal-body-header
          :title="'Integrate with a DNS Provider'"
          sub-title="Create a DNS provider integration for phishing domains"
        />
        <form-group title="DNS Name" has-hint>
          <v-text-field
            placeholder="Enter DNS name"
            id="input--dns-name"
            outlined
            dense
            v-model.trim="formValues.dnsServiceProviderName"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
            ]"
            hint="*Required"
            persistent-hint
            height="40"
          ></v-text-field>
        </form-group>
        <form-group title="Service Type">
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
            class="pop-up-card__invite-member"
            :rules="[(v) => validations.required(v, labels.Required)]"
            hint="*Required"
            reuired
            persistent-hint
          ></k-select>
        </form-group>
        <form-group title="Email" has-hint>
          <v-text-field
            placeholder="Enter Email"
            outlined
            class="new-client__textfield new-client__api-key__textfield mt-2"
            v-model="formValues.username"
            required
            height="40"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Email, 64))
            ]"
          />
        </form-group>
        <form-group title="API Key" has-hint>
          <v-text-field
            placeholder="Enter API Key from your provider"
            outlined
            class="new-client__textfield new-client__api-key__textfield mt-2"
            v-model="formValues.password"
            required
            height="40"
            :rules="[
              (v) => validations.required(v, labels.Required),
              (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Name, 64))
            ]"
          />
        </form-group>
        <make-available-for
          v-if="isRenderMakeAvailableFor"
          ref="refMakeAvailableFor"
          v-model="formValues.availableForRequests"
          :disabled="!showMakeAvailableFor"
        />

        <v-list-item class="add-user-overlay__list-item">
          <v-list-item-content class="test-connection-wrapper">
            <TestConnection
              :values="formValues"
              ref="testConnection"
              @testConnectionValues="testConnectionValues"
              @loading="saveButtonDisabled = false"
            />
          </v-list-item-content>
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
          @click="canceldns"
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
import companyName from '@/components/GrapesJs/Newsletter/mergedTexts/companyName'
import { getAvailableForValues } from '@/utils/helperFunctions'
import { createPhishingEmailTemplate, updatePhishingEmailTemplate } from '@/api/phishingsimulator'
import { scrollToComponent } from '@/utils/functions'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import MakeAvailableFor from '@/components/Common/MakeAvailableFor/MakeAvailableFor'
import KSelect from '@/components/Common/Inputs/KSelect'
import { createDnsServiceList, getDnsService, updateDnsServiceList } from '@/api/dnsServices'
import * as Validations from '@/utils/validations'
import * as validations from '@/utils/validations'
export default {
  name: 'NewEditDnsService',
  components: {
    AppModal,
    TestConnection,
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
    }
  },
  created() {
    if (this.isEdit) {
      this.formValues.resourceId = this.resourceId
      getDnsService(this.resourceId).then((res) => {
        debugger
        this.formValues = res.data.data
        this.formValues.dnsServiceProviderTypeId.toString()
      })
    }
    setTimeout(() => {
      if (this.$refs.refMakeAvailableFor) {
        this.formValues.availableForRequests = this.$refs.refMakeAvailableFor.getAvailableForListFromBackend(
          response.data.data.availableForList
        )
      } else {
        this.nonEditableAvailableForRequests = getAvailableForListFromBackend(
          response.data.data.availableForList
        )
      }
      if (this.formValues.AvailableForRequests) {
        this.formValues.availableForRequests = this.formValues.AvailableForRequests
      }
    }, 300)
  },
  data() {
    return {
      isValidate: null,
      providerTypes: [{ text: 'Cloudflare', value: 1 }],
      formValues: {
        dnsServiceProviderTypeId: null,
        dnsServiceProviderName: null,
        username: null,
        password: null,
        AvailableForRequests: [],
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
    testConnectionValues() {},
    canceldns() {
      ;(this.formValues = {
        dnsServiceProviderTypeId: null,
        dnsServiceProviderName: null,
        username: null,
        password: null,
        AvailableForRequests: [],
        resourceId: null
      }),
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
      if (this.$refs.dnsForm.validate() && isValid) {
        let payload = {
          ...this.formValues,
          AvailableForRequests: this.showMakeAvailableFor
            ? this.$refs.refMakeAvailableFor.getAvailableForValues(
                this.formValues.availableForRequests
              )
            : companyName === this.$store.state.auth
            ? getAvailableForValues(this.nonEditableAvailableForRequests)
            : null
        }
        if (this.isEdit && !this.isDuplicate) {
          updateDnsServiceList(payload, this.resourceId)
            .then((response) => {
              this.$emit('changeStatus', false, true)
            })
            .finally(() => {
              this.saveButtonDisabled = false
            })
        } else {
          createDnsServiceList(payload)
            .then((response) => {
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

<style scoped></style>
