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
      <template v-if="isInitial">
        <div class="new-direct-email-creation-info">
          <VIcon color="#2196F3">mdi-information</VIcon>
          <div class="new-direct-email-creation-info__text ml-2">
            First, you need to authorize the DEC application for your Microsoft 365 account to
            create a configuration. For that reason, we will redirect you to the Microsoft login
            page to connect with your account and request your permission to access.
          </div>
        </div>
        <FormGroup class="mt-6" :title="labels.Connection">
          <VBtn
            class="fw-600 no-box-shadow"
            color="#2196f3"
            rounded
            outlined
            @click="handleConnectAccount"
          >
            CONNECT ACCOUNT
            <VIcon class="ml-1 mr-0" color="#2196F3" left medium>mdi-arrow-right </VIcon>
          </VBtn>
        </FormGroup>
      </template>
      <VForm v-else ref="refForm" class="mt-8">
        <FormGroup has-hint :title="labels.Name">
          <InputEntityName
            v-model.trim="formData.name"
            id="input--direct-email-creation-name"
            initial-placeholder="Enter a name"
          />
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
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import TestEmailErrorDialog from '@/components/Company Settings/SmtpSettings/TestEmailErrorDialog'
import DirectCreationService from '@/api/direct-creation'
import { PLATFORM_TYPES, EMITS } from '@/components/Company Settings/DirectEmailCreation/utils'
import InputDomain from '@/components/Common/Inputs/InputDomain'
export default {
  name: 'NewMicrosoft365DEC',
  components: {
    InputDomain,
    TestEmailErrorDialog,
    TestEmailDialog,
    InputEntityName,
    FormGroup,
    AppModalBodyHeader,
    AppModal
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
    isInitial: {
      type: Boolean,
      default: true
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    },
    tenantId: {
      type: String,
      default: ''
    }
  },
  emits: [EMITS.ON_CLOSE],
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
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
      editedTenantId: null,
      domainRules: [(v) => !!v.length || labels.Required],
      timeoutId: null
    }
  },
  computed: {
    getModalTitle() {
      return this.isEdit
        ? labels.EditMicrosoft365Configuration
        : labels.CreateMicrosoft365Configuration
    },
    getModalIcon() {
      return this.isEdit ? 'mdi-pencil' : 'mdi-plus-circle'
    },
    getBodyTitle() {
      return this.isEdit
        ? labels.EditMicrosoft365Configuration
        : labels.NewMicrosoft365Configuration
    },
    getBodySubtitle() {
      return this.isEdit
        ? labels.EditMicrosoft365ConfigurationSubtitle
        : labels.NewMicrosoft365ConfigurationSubtitle
    }
  },
  created() {
    this.callForSelectedEmail()
    this.callForApplicationId()
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
        const { name = '', allowedDomains = [], tenantId = '' } = data
        this.editedTenantId = tenantId
        this.formData.name = name
        this.formData.domains = allowedDomains
      })
    },
    callForDomains() {
      if (this.isInitial && !this.isEdit) return
      const payload = {
        tenantId: this.tenantId,
        type: PLATFORM_TYPES.Microsoft365
      }
      if (this.isEdit) {
        payload.tenantId = this.editedTenantId
        payload.resourceId = this.selectedRow.resourceId
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
          domains.unshift({ text: labels.AllDomains, value: labels.AllDomains, disabled: false })
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
    callForApplicationId() {
      if (!this.isInitial) return
      DirectCreationService.getDirectEmailSettings().then((response) => {
        const { data: { data = {} } = {} } = response
        this.connectionUrl = `https://login.microsoftonline.com/common/adminconsent?client_id=${
          data.applicationId
        }&redirect_uri=${data.redirectUri ? data.redirectUri : globalThis.location.href}`
      })
    },
    handleClose(forceUpdate = false) {
      this.$emit(EMITS.ON_CLOSE, forceUpdate)
    },
    submit() {
      if (this.isInitial) {
        return this.$store.dispatch('common/createSnackBar', {
          message: labels.Microsoft365InitialError,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      } else {
        if (!this.$refs.refForm.validate()) return
        const { name, domains } = this.formData
        const payload = {
          name,
          allowedDomains: domains.includes('All')
            ? this.domainItems.map((dItem) => dItem.value)
            : domains,
          tenantId: this.tenantId,
          type: PLATFORM_TYPES.Microsoft365
        }
        this.setActionButtonDisability(true)
        if (this.isEdit) {
          payload.tenantId = this.editedTenantId
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
        tenantId: this.tenantId,
        type: PLATFORM_TYPES.Microsoft365
      }
      if (this.isEdit) {
        payload.tenantId = this.editedTenantId
        payload.resourceId = this.selectedRow.resourceId
      }
      DirectCreationService.testDirectEmailCreation(payload)
        .then(() => {
          this.toggleShowTestEmailDialog()
        })
        .catch((error) => {
          const { response } = error
          this.testEmailErrorMessage = response?.data?.message
          this.toggleShowTestEmailErrorDialog()
        })
        .finally(() => {
          this.isTestEmailActionDisabled = false
        })
    },
    handleConnectAccount() {
      window.location.href = this.connectionUrl
    },
    handleDomainFocus() {
      this.isShowDomainsLoader = this.isDomainsLoading
    }
  }
}
</script>
