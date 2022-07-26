<template>
  <AppModal
    :status="status"
    icon-name="mdi-send"
    :title="getTitle"
    title-id="text--add-or-edit-training-modal-title"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <DefaultErrorDialog
        v-if="!!createErrorMessage"
        :status="!!createErrorMessage"
        :error-message="createErrorMessage"
        @on-close="createErrorMessage = ''"
      />
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--training-select-users"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.SelectUsers }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.Settings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-send-preview"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.Preview }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.SelectRecipients"
              :subtitle="labels.SelectRecipientsSub"
            />
            <SendTrainingSelectUsers ref="refSendTrainingSelectUsers" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Settings"
              :subtitle="labels.SendTrainingSettingsSub"
            />
            <SendTrainingSettings
              ref="refSendTrainingSettings"
              :selected-row="selectedRow"
              :enum-types="enumTypes"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.Summary"
              :subtitle="labels.SendTrainingSummarySub"
            />
            <SendTrainingSummary
              ref="refSendTrainingSummary"
              :form-data="getTrainingSummaryFormData"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="3"
        :ids="{
          cancelButton: 'btn-cancel--send-training-modal',
          backButton: 'btn-back--send-training-modal',
          saveButton: 'btn-next--send-training-modal'
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
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import { EMITS } from '@/components/AwarenessEducator/utils'
import StepperFooter from '@/components/Stepper/StepperFooter'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import SendTrainingSelectUsers from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsers'
import SendTrainingSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSettings'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { searchTargetGroups } from '@/api/targetUsers'
import { scrollToComponent } from '@/utils/functions'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import SendTrainingSummary from '@/components/AwarenessEducator/SendTraining/SendTrainingSummary'
import { getEmailTemplate } from '@/api/company'

export default {
  name: 'SendTrainingModal',
  components: {
    SendTrainingSummary,
    DefaultErrorDialog,
    SendTrainingSettings,
    SendTrainingSelectUsers,
    ConfigureCompanyStepHeader,
    StepperFooter,
    AppModal
  },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    certificateEmailNotificationTemplateTypeResourceId: {
      type: String
    },
    reminderEmailNotificationTemplateTypeResourceId: {
      type: String
    },
    trainingEmailNotificationTemplateTypeResourceId: {
      type: String
    },
    enumTypes: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isActionButtonDisabled: false,
      createErrorMessage: '',
      step: 1
    }
  },
  computed: {
    getTitle() {
      return `Send Training - ${this?.selectedRow?.trainingName}`
    },
    getTrainingSummaryFormData() {
      let formData = {}
      if (this.step === 3) {
        const { refSendTrainingSelectUsers, refSendTrainingSettings } = this.$refs
        formData.trainingInfo = {
          'Target Users': `${refSendTrainingSelectUsers.totalTargetUserCount} users`,
          'Content Type': this?.selectedRow?.type,
          Languages: refSendTrainingSettings.formData.languageIds.join(', ')
        }
        formData.settings = {
          'Auto-enroll new users': refSendTrainingSettings.isAutoEnroll ? 'Yes' : 'No',
          'Exclude From Reports(Test)': refSendTrainingSettings.formData.markedAsTest
            ? 'Yes'
            : 'No',
          Schedule:
            refSendTrainingSettings.formData.scheduleTypeId === '1'
              ? 'Starting now'
              : refSendTrainingSettings.formData.enrollmentScheduler.scheduledDate
        }
      }
      return formData
    }
  },
  created() {
    this.callForFormDetails()
  },
  methods: {
    callForFormDetails() {
      //get reminder email
      getEmailTemplate(this.reminderEmailNotificationTemplateTypeResourceId).then((response) => {
        debugger
      })
      //get certificate email
      getEmailTemplate(this.certificateEmailNotificationTemplateTypeResourceId).then((response) => {
        debugger
      })
      //get training email
      getEmailTemplate(this.trainingEmailNotificationTemplateTypeResourceId).then((response) => {
        debugger
      })
    },
    callForSelectedTargetGroups(ids) {
      return searchTargetGroups({
        pageNumber: 1,
        pageSize: 2000000,
        orderBy: 'CreateTime',
        ascending: false,
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'AND',
              FilterItems: [],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [{ FieldName: 'resourceId', Value: ids.join(','), Operator: 'Include' }],
              FilterGroups: []
            }
          ]
        }
      })
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
    },
    changeStep(flag = 1) {
      if (this.step === 1 && flag === 1) {
        const { refSendTrainingSelectUsers } = this.$refs
        if (refSendTrainingSelectUsers.selectedRadioGroupIndex === 0) {
          const ids = refSendTrainingSelectUsers.formData.targetGroupResourceIds.map(
            (item) => item.value
          )
          if (!ids.length) {
            refSendTrainingSelectUsers.isShowTargetGroupUsersError = true
            refSendTrainingSelectUsers.isTargetGroupsValid = false
            return
          }
          this.isActionButtonDisabled = true
          this.callForSelectedTargetGroups(ids)
            .then((response) => {
              const { results } = response?.data?.data || []
              //User must have user count greater than 0
              const totalUserCount = results.reduce((acc, item) => {
                acc += item.userCount
                return acc
              }, 0)

              if (totalUserCount) {
                refSendTrainingSelectUsers.isShowTargetGroupUsersError = false
                refSendTrainingSelectUsers.isTargetGroupsValid = true
                this.step += flag
              } else {
                refSendTrainingSelectUsers.isShowTargetGroupUsersError = true
                refSendTrainingSelectUsers.isTargetGroupsValid = false
                this.$nextTick(() => {
                  const el = refSendTrainingSelectUsers.$refs.refForm.$el.querySelector(
                    '.error--text'
                  )
                  scrollToComponent(el)
                })
              }
              refSendTrainingSelectUsers.totalTargetUserCount = totalUserCount
              refSendTrainingSelectUsers.formData.selectedTargetGroups = results
            })
            .finally(() => (this.isActionButtonDisabled = false))
        } else if (refSendTrainingSelectUsers.selectedRadioGroupIndex === 1) {
          this.step += flag
        }
      } else if (this.step === 2 && flag === 1) {
        const { refSendTrainingSettings } = this.$refs
        if (refSendTrainingSettings.validateForm()) {
          this.step += flag
        } else {
          this.$nextTick(() => {
            const el = refSendTrainingSettings.$refs.refForm.$el.querySelector('.error--text')
            scrollToComponent(el)
          })
        }
      } else {
        this.step += flag
      }
    },
    handleSubmit() {
      const { refSendTrainingSelectUsers, refSendTrainingSettings } = this.$refs
      const selectedIndex = refSendTrainingSelectUsers.selectedRadioGroupIndex
      const {
        userWhoOpenedEmail,
        userWhoClickedEmail,
        userWhoSubmittedData,
        userWhoDownloadedAttachment,
        userWhoReportedAsSuspicious
      } = refSendTrainingSelectUsers.formData
      const { sendReminderEvery, isAutoEnroll } = refSendTrainingSettings
      const {
        enrollmentScheduler,
        enrollmentAutoEnroll,
        enrollmentReminder,
        scheduleTypeId,
        markedAsTest,
        awardCertificate,
        languageIds
      } = refSendTrainingSettings.formData
      const phishingCampaignConditionTypes = []
      if (selectedIndex === 1) {
        if (userWhoOpenedEmail) phishingCampaignConditionTypes.push('EmailOpened')
        if (userWhoClickedEmail) phishingCampaignConditionTypes.push('PhishingLinkClicked')
        if (userWhoSubmittedData) phishingCampaignConditionTypes.push('DataSubmitted')
        if (userWhoDownloadedAttachment) phishingCampaignConditionTypes.push('AttachmentDownloaded')
        if (userWhoReportedAsSuspicious) phishingCampaignConditionTypes.push('ReportedAsSuspicious')
      }
      if (enrollmentScheduler.scheduledTimeZoneId) enrollmentScheduler.useOwnTimeZone = false
      const payload = {
        trainingId: this.selectedRow.trainingId,
        targetGroupResourceIds:
          selectedIndex === 0
            ? refSendTrainingSelectUsers.formData.targetGroupResourceIds.map(
                (tResourceId) => tResourceId.value
              )
            : [],
        phishingCampaignResourceId:
          selectedIndex === 1 ? refSendTrainingSelectUsers.formData.campaignResourceId : '',
        phishingCampaignConditionTypes,
        enrollmentScheduler: scheduleTypeId === '1' ? null : enrollmentScheduler,
        enrollmentAutoEnroll: isAutoEnroll ? enrollmentAutoEnroll : null,
        enrollmentReminder: sendReminderEvery ? enrollmentReminder : null,
        markedAsTest,
        awardCertificate,
        languageIds
      }
      this.isActionButtonDisabled = true
      AwarenessEducatorService.createEnrollment(payload)
        .then((response) => {
          this.$store.dispatch('common/createSnackBar', {
            message: response.data.message,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.$emit(EMITS.ON_CLOSE, true)
        })
        .catch((error) => {
          this.createErrorMessage = error?.response?.data?.message
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
