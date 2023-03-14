<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getModalTitle"
    icon-name="mdi-plus-circle"
    confirm-button-id="btn-save--direct-email-creation-template-modal"
    cancel-button-id="btn-cancel--direct-email-creation-template-modal"
    title-id="text--certificates-direct-email-creation-modal-title"
    :save-disable="isActionButtonDisabled"
    @closeOverlay="handleClose"
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
      <template v-if="isInitial">
        <AppModalBodyHeader :title="getBodyTitle" :sub-title="getBodySubtitle" />
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
          <KSelect
            v-bind="getDomainProps"
            :value="formData.domains"
            id="input--direct-email-creation-domains"
            outlined
            dense
            persistent-hint
            multiple
            hint="*Required"
            placeholder="Select a item"
            :items="domainItems"
            @change="handleDomainChange"
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
import KSelect from '@/components/Common/Inputs/KSelect'
import TestEmailDialog from '@/components/Company Settings/SmtpSettings/TestEmailDialog'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import TestEmailErrorDialog from '@/components/Company Settings/SmtpSettings/TestEmailErrorDialog'
import DirectCreationService from '@/api/direct-creation'
export default {
  name: 'NewDirectMicrosoftEmailCreation',
  components: {
    TestEmailErrorDialog,
    TestEmailDialog,
    KSelect,
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
    }
  },
  emits: ['on-close'],
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      isShowTestEmailDialog: false,
      isShowTestEmailErrorDialog: false,
      isTestEmailActionDisabled: false,
      testEmailErrorMessage: '',
      connectionUrl: '',
      formData: {
        name: '',
        domains: []
      },
      domainItems: []
    }
  },
  computed: {
    getModalTitle() {
      return this.isEdit
        ? labels.EditMicrosoft365Configuration
        : labels.NewMicrosoft365Configuration
    },
    getBodyTitle() {
      return this.isEdit
        ? labels.CreateMicrosoft365Configuration
        : labels.CreateMicrosoft365Configuration
    },
    getBodySubtitle() {
      return this.isEdit
        ? labels.EditMicrosoft365ConfigurationSubtitle
        : labels.NewMicrosoft365ConfigurationSubtitle
    },
    getDomainProps() {
      return this.formData.domains.includes('All')
        ? {}
        : {
            smallChips: true,
            deletableChips: true
          }
    }
  },
  created() {
    this.callForDomains()
    this.callForClientId()
    this.callForSelectedEmail()
  },
  methods: {
    callForSelectedEmail() {
      if (!this.isEdit) return
      DirectCreationService.getDirectEmailCreation(
        this.selectedRow.resourceId
      ).then((response) => {})
    },
    callForDomains() {
      if (this.isInitial && !this.isEdit) return
      DirectCreationService.getDomains().then((domains) => {
        this.domainItems = domains
      })
    },
    callForClientId() {
      if (!this.isInitial) return
      DirectCreationService.getClientId().then((clientId) => {
        this.connectionUrl = `https://login.microsoftonline.com/common/adminconsent?client_id=${clientId}&redirect_uri=${window.location.href}`
      })
    },
    handleClose() {
      this.$emit('on-close')
    },
    submit() {
      if (this.isInitial) {
        return this.$store.dispatch('common/createSnackBar', {
          message: labels.Microsoft365InitialError,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      } else {
      }
    },
    handleDomainChange(val = []) {
      const isValIncludes = val.includes('All')
      this.formData.domains = isValIncludes ? ['All'] : val
      this.setDomainItemsDisability(isValIncludes)
    },
    setDomainItemsDisability(val = false) {
      this.domainItems.forEach((item) => {
        if (item.value !== 'All') {
          item.disabled = val
        }
      })
    },
    toggleShowTestEmailDialog() {
      this.isShowTestEmailDialog = !this.isShowTestEmailDialog
    },
    toggleShowTestEmailErrorDialog() {
      this.isShowTestEmailErrorDialog = !this.isShowTestEmailErrorDialog
    },
    callForTestEmail() {},
    handleConnectAccount() {
      window.location.href = this.connectionUrl
    }
  }
}
</script>
