<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getModalTitle"
    :icon-name="getModalIcon"
    confirm-button-id="btn-save--direct-email-creation-template-modal"
    cancel-button-id="btn-cancel--direct-email-creation-template-modal"
    title-id="text--certificates-direct-email-creation-modal-title"
    :save-disable="isActionButtonDisabled"
    @closeOverlay="handleClose()"
    @submit="submit"
  >
    <template #overlay-body>
      <TestEmailDialog
        v-if="isShowTestEmailDialog"
        ref="refTestEmailDialog"
        :status="isShowTestEmailDialog"
        :is-action-button-disabled="isTestEmailActionDisabled"
        @closeDialog="toggleShowTestEmailDialog"
        @confirm="callForTestEmail"
      />
      <TestEmailErrorDialog
        v-if="isShowTestEmailErrorDialog"
        :is-show-error-message="isShowTestEmailErrorDialog"
        :error-message="testEmailErrorMessage"
        @closeDialog="toggleShowTestEmailErrorDialog"
      />
      <AppModalBodyHeader :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <VForm ref="refForm" class="mt-8">
        <FormGroup has-hint title="Configuration Name">
          <InputEntityName
            v-model.trim="formData.name"
            id="input--direct-email-creation-name"
            initial-placeholder="Enter a configuration name"
          />
        </FormGroup>
        <FormGroup v-if="!isEdit" has-hint title="Client ID">
          <template #subTitle>
            <v-list-item-subtitle class="k-form-group__sub-title">
              Copying the 'Client ID' information and pasting it into the appropriate field on the
              Google Workspace configuration page is necessary. Learn
              <a
                style="color: #2196f3; text-decoration: none;"
                href="https://doc.keepnetlabs.com/Next-Generation-Product/platform/company/company-settings/direct-email-creation/direct-email-creation-for-google-workspace"
                target="_blank"
                >how to set a client ID</a
              >
            </v-list-item-subtitle>
          </template>
          <InputWithCopyToClipboard copyKey="clientId" @on-copy="handleCopyToClipboard">
            <template #input>
              <VTextField
                v-model.trim="clientId"
                style="min-width: 554px;"
                outlined
                dense
                disabled
              ></VTextField>
            </template>
          </InputWithCopyToClipboard>
        </FormGroup>
        <FormGroup has-hint :title="labels.Domains" :sub-title="labels.DomainsSub">
          <InputDomain
            v-model="formData.domains"
            :items="domainItems"
            :is-loading="isDomainsLoading"
            :show-loader="isShowDomainsLoader"
            :rules="domainRules"
            @on-focus="handleDomainFocus"
          />
        </FormGroup>
        <FormGroup :title="labels.TestEmail" :sub-title="labels.TestEmailSub">
          <VBtn
            id="btn--connection--direct-email-creation"
            class="fw-600 no-box-shadow"
            color="#2196f3"
            rounded
            outlined
            @click="toggleShowTestEmailDialog"
          >
            SEND TEST EMAIL
            <VIcon class="ml-1 mr-0" style="margin-top: 1px;" color="#2196F3" left medium
              >mdi-send</VIcon
            >
          </VBtn>
        </FormGroup>
      </VForm>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import TestEmailDialog from '@/components/Company Settings/SmtpSettings/TestEmailDialog'
import { copyToClipboard } from '@/utils/functions'
import TestEmailErrorDialog from '@/components/Company Settings/SmtpSettings/TestEmailErrorDialog'
import DirectCreationService from '@/api/direct-creation'
import { PLATFORM_TYPES, EMITS } from '@/components/Company Settings/DirectEmailCreation/utils'
import InputDomain from '@/components/Common/Inputs/InputDomain'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
export default {
  name: 'NewMicrosoft365DEC',
  components: {
    InputDomain,
    TestEmailErrorDialog,
    TestEmailDialog,
    InputEntityName,
    FormGroup,
    AppModalBodyHeader,
    AppModal,
    InputWithCopyToClipboard
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
    selectedRow: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [EMITS.ON_CLOSE],
  data() {
    return {
      labels,
      isActionButtonDisabled: !this.isEdit,
      isShowTestEmailDialog: false,
      isShowTestEmailErrorDialog: false,
      isTestEmailActionDisabled: false,
      testEmailErrorMessage: '',
      connectionUrl: '',
      isDomainsLoading: false,
      isShowDomainsLoader: false,
      formData: {
        name: '',
        domains: []
      },
      domainItems: [],
      clientId: '',
      domainRules: [(v) => !!v.length || labels.Required],
      timeoutId: null
    }
  },
  computed: {
    getModalTitle() {
      return this.isEdit
        ? `Edit Google Workspace Configuration`
        : 'Create Google Workspace Configuration'
    },
    getModalIcon() {
      return this.isEdit ? 'mdi-pencil' : 'mdi-plus-circle'
    },
    getBodyTitle() {
      return this.isEdit
        ? `Edit Google Workspace Configuration`
        : `New Google Workspace Configuration`
    },
    getBodySubtitle() {
      return this.isEdit
        ? `Edit Google Workspace configuration for direct email creation (DEC).`
        : `Create a new Google Workspace configuration for direct email creation (DEC).`
    }
  },
  created() {
    this.callForSelectedEmail()
    this.callForClientId()
    this.callForDomains()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  },
  methods: {
    callForSelectedEmail() {
      if (!this.isEdit) return
      DirectCreationService.getDirectEmailCreation(this.selectedRow.resourceId).then((response) => {
        const { data: { data = {} } = {} } = response || {}
        const { name = '', allowedDomains = [] } = data
        this.formData.name = name
        this.formData.domains = allowedDomains
      })
    },
    callForDomains() {
      const payload = {
        tenantId: null,
        resourceId: null,
        type: PLATFORM_TYPES.GoogleWorkspace
      }
      this.isDomainsLoading = true
      DirectCreationService.getDomains(payload)
        .then((response) => {
          const { data: { data = [] } = {} } = response
          const domains = data.map((item) => ({
            text: item,
            value: item,
            disabled: this.isEdit ? this.formData.domains.includes(labels.AllDomains) : true
          }))
          domains.unshift({
            text: labels.AllDomains,
            value: labels.AllDomains,
            disabled: false
          })
          domains.splice(1, 0, { divider: true })
          this.domainItems = domains
          if (!this.isEdit) this.formData.domains = [labels.AllDomains]
          this.isDomainsLoading = false
          this.isShowDomainsLoader = false
        })
        .catch(() => {
          if (this.timeoutId) clearTimeout(this.timeoutId)
          this.timeoutId = setTimeout(() => {
            this.callForDomains()
          }, 1000)
        })
    },
    callForClientId() {
      DirectCreationService.getGoogleWorkspaceClientId().then((response) => {
        this.clientId = response?.data?.data
      })
    },
    handleClose(forceUpdate = false) {
      this.$emit(EMITS.ON_CLOSE, forceUpdate)
    },
    submit() {
      if (!this.$refs.refForm.validate()) return
      const { name, domains } = this.formData
      const payload = {
        name,
        allowedDomains: domains.includes('All')
          ? this.domainItems.map((dItem) => dItem.value)
          : domains,
        tenantId: null,
        type: PLATFORM_TYPES.GoogleWorkspace
      }
      this.setActionButtonDisability(true)
      if (this.isEdit) {
        DirectCreationService.updateDirectEmailCreation(this.selectedRow.resourceId, payload)
          .then(() => {
            this.handleClose(true)
          })
          .finally(this.setActionButtonDisability)
      } else {
        DirectCreationService.createDirectEmailCreation(payload)
          .then(() => {
            this.handleClose(true)
          })
          .finally(this.setActionButtonDisability)
      }
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    toggleShowTestEmailDialog() {
      this.isShowTestEmailDialog = !this.isShowTestEmailDialog
    },
    toggleShowTestEmailErrorDialog() {
      this.isShowTestEmailErrorDialog = !this.isShowTestEmailErrorDialog
    },
    callForTestEmail(data = {}) {
      this.isTestEmailActionDisabled = true
      const payload = {
        ...data,
        tenantId: null,
        type: PLATFORM_TYPES.GoogleWorkspace
      }
      if (this.isEdit) {
        payload.resourceId = this.selectedRow.resourceId
      }
      DirectCreationService.testDirectEmailCreation(payload)
        .then(() => {
          this.isActionButtonDisabled = false
          this.toggleShowTestEmailDialog()
        })
        .catch((error) => {
          const { response } = error
          this.testEmailErrorMessage = response?.data?.message
          this.isActionButtonDisabled = true
          this.toggleShowTestEmailErrorDialog()
        })
        .finally(() => {
          this.isTestEmailActionDisabled = false
        })
    },
    handleDomainFocus() {
      this.isShowDomainsLoader = this.isDomainsLoading
    },
    handleCopyToClipboard(key = '') {
      copyToClipboard(this.formData[key] || this[key])
    }
  }
}
</script>
