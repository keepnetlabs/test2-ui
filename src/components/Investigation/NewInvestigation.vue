<template>
  <AppModal
    :status="status"
    title-id="text--incident-responder-new-investigation-modal-title"
    icon-name="$book-search"
    :title="labels.StartNewManualInvestigation"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <VStepper v-model="step" class="k-stepper">
        <VStepperHeader class="k-stepper__header">
          <v-stepper-step
            id="step--investigation-add-or-edit-modal-settings"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.Settings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--investigation-add-or-edit-modal-filters"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.Filters }}
          </v-stepper-step>
        </VStepperHeader>
        <VStepperItems class="k-stepper__items">
          <VStepperContent class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Settings"
              :subtitle="labels.NewInvestigationSub"
            />
            <NewInvestigationSettings ref="refNewInvestigationSettings" />
          </VStepperContent>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Filters"
              :subtitle="labels.NewInvestigationFiltersSub"
            />
            <NewInvestigationFilters ref="refNewInvestigationFilters" />
          </v-stepper-content>
        </VStepperItems>
      </VStepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="2"
        :ids="{
          cancelButton: 'btn-cancel--add-or-edit-investigation-modal',
          backButton: 'btn-back--add-or-edit-investigation-modal',
          nextButton: 'btn-next--add-or-edit-investigation-modal',
          saveButton: 'btn-save--add-or-edit-investigation-modal'
        }"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        @on-cancel="handleClose"
        @on-back="changeStep(-1)"
        @on-next="changeStep()"
        @on-submit="handleSubmit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '../AppModal'
import { scrollToComponent, isDifferent } from '@/utils/functions'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader.vue'
import NewInvestigationSettings from '@/components/Investigation/NewInvestigationSettings.vue'
import StepperFooter from '@/components/Stepper/StepperFooter.vue'
import {
  ACTION_TYPES,
  TARGET_USER_TYPES,
  DURATION_TYPES,
  HEADER_KEYS,
  BODY_KEYS,
  ATTACHMENT_KEYS,
  createHeaderDataFactory,
  createBodyDataFactory,
  createAttachmentDataFactory,
  OPERATORS,
  TEXT_OPERATORS
} from '@/components/Investigation/utils'
import NewInvestigationFilters from '@/components/Investigation/NewInvestigationFilters.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  components: {
    NewInvestigationFilters,
    StepperFooter,
    NewInvestigationSettings,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    isDuplicate: {
      type: Boolean,
      default: false
    },
    investigationDetailsData: {
      type: Object,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    },
    selectedMail: {
      type: Object,
      default: null
    },
    isTs: {
      type: Boolean,
      default: false
    },
    isIr: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 1,
      initialFormData: null,
      isActionButtonDisabled: false,
      labels,
      errorMessages: []
    }
  },
  mounted() {
    this.checkIsDuplicate()
    this.checkIsSelectedMail()
    this.setInitialFormData()
  },
  methods: {
    setInitialFormData() {
      this.initialFormData = this.getCurrentFormData()
    },
    getStepOneFormData() {
      const { refNewInvestigationSettings } = this.$refs
      const { formData = {} } = refNewInvestigationSettings || {}
      return {
        investigationName: formData.investigationName,
        targetUsers: formData.targetUsers,
        emailDateRange: formData.date,
        scanTypes: formData.scanTypes,
        duration: formData.duration,
        action: formData.action
      }
    },
    getStepTwoFormData() {
      const { refNewInvestigationFilters } = this.$refs
      return refNewInvestigationFilters.query
    },
    getCurrentFormData() {
      return {
        ...this.getStepOneFormData(),
        query: this.getStepTwoFormData()
      }
    },
    changeStep(flag = 1) {
      if (this.step === 1 && flag === 1) {
        const { refNewInvestigationSettings } = this.$refs
        if (refNewInvestigationSettings.validateForm()) {
          this.step += flag
          return
        }
        return this.scrollToErrorMessage(refNewInvestigationSettings.$refs.refForm.$el)
      } else this.step += flag
    },
    scrollToErrorMessage(el = {}) {
      this.$nextTick(() => {
        scrollToComponent(el.querySelector('.error--text') || el.querySelector('.date-row'))
      })
    },
    handleClose() {
      if (!isDifferent(this.getCurrentFormData(), this.initialFormData))
        return this.$emit('closeAdd')
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('closeAdd')
        }
      })
    },
    handleSubmit() {
      const { refNewInvestigationFilters, refNewInvestigationSettings } = this.$refs
      const { formValid, queryValid, filtersValid } = refNewInvestigationFilters.validateForm()
      if (formValid && queryValid && filtersValid.ipValid && filtersValid.fromValid) {
        const { query } = refNewInvestigationFilters
        const headers = []
        const bodies = []
        const attachments = []
        query.children.forEach((item) => {
          const { operand, value } = item.query
          if (HEADER_KEYS.includes(operand))
            headers.push(createHeaderDataFactory({ [operand]: value }))
          else if (BODY_KEYS.includes(operand))
            bodies.push(createBodyDataFactory({ [operand]: value }))
          else if (ATTACHMENT_KEYS.includes(operand))
            attachments.push(createAttachmentDataFactory({ [operand]: value }))
        })
        const { formData } = refNewInvestigationSettings
        const [startDate, endDate] = formData.emailDateRange
        const payload = {
          headers,
          bodies,
          attachments,
          name: formData.investigationName,
          startDate,
          endDate,
          duration: formData.duration,
          targetUserType: formData.targetUserType,
          targetUsers: formData.targetUsersValue,
          scanTypes: formData.scanTypes,
          autoAction: {
            type: formData.action,
            isPermanentDelete: formData.action === ACTION_TYPES.Delete,
            warningMessage: formData.warningMessage
          },
          logicalOperator:
            query.logicalOperator === TEXT_OPERATORS.AND ? OPERATORS.AND : OPERATORS.OR
        }
        this.isActionButtonDisabled = true
        this.$store
          .dispatch('investigations/createInvestigation', payload)
          .then((resp) => {
            this.$emit('closeWithRoute', resp)
            this.$emit('closeAdd', true)
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else if (!formValid) {
        this.scrollToErrorMessage(this.$refs.refNewInvestigationFilters.$refs.refForm.$el)
      } else if (!filtersValid.ipValid || !filtersValid.fromValid) {
        if (!filtersValid.fromValid) {
          this.$store.dispatch('common/createSnackBar', {
            message: labels.ErrorDuplicateFilterFrom,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
        if (!filtersValid.ipValid) {
          this.$store.dispatch('common/createSnackBar', {
            message: labels.ErrorDuplicateFilterIp,
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert-circle'
          })
        }
      } else {
        this.$store.dispatch('common/createSnackBar', {
          message: refNewInvestigationFilters.getErrorMessage(),
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
    },
    checkIsDuplicate() {
      if (!this.isDuplicate) return
      const duplicatedNewInvestigationSettings = {
        investigationName: this?.investigationDetailsData?.name || '',
        scanTypes: this.investigationDetailsData.scanConfigurationDetails.map(
          ({ mailConfigurationResourceId, type }) => ({
            mailConfigurationResourceId,
            type
          })
        ),
        duration: this.investigationDetailsData.duration || DURATION_TYPES.OneDay,
        targetUserType: this.investigationDetailsData.targetUserType,
        selectedAction: ACTION_TYPES.NoAction,
        targetUsersValue: ''
      }
      if (this.investigationDetailsData.targetUserType === TARGET_USER_TYPES.Groups) {
        duplicatedNewInvestigationSettings.targetUsersValue = this.investigationDetailsData.targetUsers.map(
          (item) => {
            return {
              name: item.targetUser,
              resourceId: item.targetGroupResourceId
            }
          }
        )
      } else if (this.investigationDetailsData.targetUserType === TARGET_USER_TYPES.Users) {
        duplicatedNewInvestigationSettings.targetUsersValue = this.investigationDetailsData.targetUsers.map(
          (item) => item.targetUser
        )
      }
      this.$refs.refNewInvestigationSettings.setFormData(duplicatedNewInvestigationSettings)
      this.setFormQuery(
        this.investigationDetailsData.logicalOperator ?? OPERATORS.AND,
        this.getEditedFilters()
      )
    },
    checkIsSelectedMail() {
      if (!this.selectedMail) return
      const filterList = []
      if (this.isIr) {
        this.selectedMail.urls = this.selectedMail.notifiedEmailInvestigation.urls
        this.selectedMail.attachments = this.selectedMail.notifiedEmailInvestigation.attachments
      }
      filterList.push(
        ...this.getSelectedMailFromFilter(),
        ...this.getSelectedMailSubjectFilter(),
        ...this.getSelectedMailAttachmentFilter(),
        ...this.getSelectedMailBccFilter(),
        ...this.getSelectedMailCcFilter(),
        ...this.getSelectedMailToFilter(),
        ...this.getSelectedMailUrlFilter(),
        ...this.getSelectedMailSenderIpFilter()
      )
      this.setFormQuery(this?.selectedEmail?.logicalOperator ?? OPERATORS.AND, filterList)
    },
    setFormQuery(logicalOperator = OPERATORS.AND, children = []) {
      this.$refs.refNewInvestigationFilters.setQuery({
        logicalOperator: logicalOperator === OPERATORS.AND ? TEXT_OPERATORS.AND : TEXT_OPERATORS.OR,
        children
      })
    },
    getSelectedMailAttachmentFilter() {
      if (!this.selectedMail.attachments) return []
      const filterList = []
      this.selectedMail.attachments.forEach((item) => {
        const attachmentCase = this.isTs ? !item.isHidden && item.isFlagged : true
        if (!attachmentCase) return
        filterList.push(
          {
            query: { operand: 'md5', value: item.md5, rule: 'conditions' },
            type: 'query-builder-rule'
          },
          {
            query: { operand: 'sha512', value: item.sha512, rule: 'conditions' },
            type: 'query-builder-rule'
          }
        )
      })
      return filterList
    },
    getSelectedMailBccFilter() {
      const bccCase = this.isTs
        ? !this.selectedMail.isBccHidden && this.selectedMail.isBccFlagged
        : true
      if (!bccCase || !this.selectedMail.bcc) return []
      return this.selectedMail.bcc.map((value) => {
        return {
          query: { operand: 'bcc', value, rule: 'conditions' },
          type: 'query-builder-rule'
        }
      })
    },
    getSelectedMailCcFilter() {
      const ccCase = this.isTs
        ? !this.selectedMail.isCcHidden && this.selectedMail.isCcFlagged
        : true
      if (!ccCase || !this.selectedMail.cc) return []
      return this.selectedMail.cc.map((value) => {
        return {
          query: { operand: 'cc', value, rule: 'conditions' },
          type: 'query-builder-rule'
        }
      })
    },
    getSelectedMailFromFilter() {
      const fromCase = this.isTs
        ? !this.selectedMail.isFromHidden && this.selectedMail.isFromFlagged
        : true
      if (!fromCase || !this.selectedMail.from) return []
      return [
        {
          query: { operand: 'from', value: this.selectedMail.from, rule: 'conditions' },
          type: 'query-builder-rule'
        }
      ]
    },
    getSelectedMailSubjectFilter() {
      const subjectCase = this.isTs
        ? !this.selectedMail.isSubjectHidden && this.selectedMail.isSubjectFlagged
        : true
      if (!subjectCase || !this.selectedMail.subject) return []
      return [
        {
          query: {
            operand: 'subject',
            value: this.selectedMail.subject,
            rule: 'conditions'
          },
          type: 'query-builder-rule'
        }
      ]
    },
    getSelectedMailToFilter() {
      const toCase = this.isTs
        ? !this.selectedMail.isToHidden && this.selectedMail.isToFlagged
        : true
      if (!toCase || !this.selectedMail.to || this.isIr) return []
      return this.selectedMail.to.map((value) => {
        return {
          query: { operand: 'to', value, rule: 'conditions' },
          type: 'query-builder-rule'
        }
      })
    },
    getSelectedMailUrlFilter() {
      if (!this.selectedMail.urls) return []
      const filterList = []
      this.selectedMail.urls.forEach((item) => {
        const urlCase = this.isTs ? !item.isHidden && item.isFlagged : true
        if (!urlCase) return
        filterList.push({
          query: { operand: 'url', value: item.url, rule: 'conditions' },
          type: 'query-builder-rule'
        })
      })
      return filterList
    },
    getSelectedMailSenderIpFilter() {
      if (!this.selectedMail.senderIp) return []
      return [
        {
          query: {
            operand: 'ip',
            value: this.selectedMail.senderIp,
            rule: 'conditions'
          },
          type: 'query-builder-rule'
        }
      ]
    },
    getEditedFilters() {
      const headers = this?.investigationDetailsData?.headers?.reduce((acc, item) => {
        for (let [key, value] of Object.entries(item)) {
          if (value && key !== 'resourceId') {
            acc.push({
              query: { operand: key, value, rule: 'conditions' },
              type: 'query-builder-rule'
            })
          }
        }
        return acc
      }, [])
      const body = this?.investigationDetailsData?.bodies?.reduce((acc, item) => {
        for (let [key, value] of Object.entries(item)) {
          if (value && key !== 'resourceId') {
            acc.push({
              query: { operand: key, value, rule: 'conditions' },
              type: 'query-builder-rule'
            })
          }
        }
        return acc
      }, [])
      const attachments = this?.investigationDetailsData?.attachments?.reduce((acc, item) => {
        for (let [key, value] of Object.entries(item)) {
          if (value && key !== 'resourceId') {
            acc.push({
              query: { operand: key, value, rule: 'conditions' },
              type: 'query-builder-rule'
            })
          }
        }
        return acc
      }, [])
      return [...headers, ...body, ...attachments]
    }
  }
}
</script>
