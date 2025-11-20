<template>
  <AppModal
    :status="status"
    icon-name="mdi-send"
    :title="getTitle"
    title-id="text--add-or-edit-training-modal-title"
    @closeOverlay="handleClose"
  >
    <template #overlay-header>
      <v-list-item class="k-overlay__list-item k-overlay__header">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon class="ml-2" color="blue" left medium>mdi-send</v-icon>
        </div>
        <v-list-item-content>
          <v-list-item-title class="k-overlay__title">Send Training</v-list-item-title>
          <v-list-item-subtitle>{{ selectedRow && selectedRow.trainingName }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
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
            >{{ labels.EnrollmentSettings }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.TargetAudience }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--training-send-summary"
            class="k-stepper__step"
            :complete="step > 3"
            :step="3"
            >{{ labels.Summary }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.EnrollmentSettings"
              :subtitle="labels.EnrollmentSettingsSub"
            />
            <TrainingLibrarySendTrainingSettings
              ref="refSendTrainingSettings"
              :selected-row="selectedRow"
              :enum-types="enumTypes"
              :distribution-delay-time-types="distributionDelayTimeTypes"
              :total-phone-number-user-count="totalPhoneNumberUserCount"
              :phone-number-items="phoneNumberItems"
              :phone-numbers="phoneNumbers"
              :language-options="languages"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.SelectRecipients"
              :subtitle="labels.SelectRecipientsSub"
            />
            <TrainingLibrarySendTrainingSelectUsers
              ref="refSendTrainingSelectUsers"
              :is-proxy="isTrainingProxy"
              :is-sms-notification="isSmsNotification"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-2"
              :title="labels.Summary"
              :subtitle="labels.SendTrainingSummarySub"
            />
            <TrainingLibrarySendTrainingSummary
              ref="refSendTrainingSummary"
              :selected-row="selectedRow"
              :form-data="getTrainingSummaryFormData"
              @on-show-training-summary="$emit('on-show-training-summary')"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="3"
        :ids="stepperIds"
        :step="step"
        :disabled-statuses="{
          nextButton: isActionButtonDisabled,
          submitButton: isActionButtonDisabled
        }"
        :save-button-text="getSaveButtonText"
        @on-cancel="handleClose"
        @on-back="changeStep(-1)"
        @on-next="changeStep()"
        @on-submit="handleSubmit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal.vue'
import labels from '@/model/constants/labels'
import { EMITS } from '@/components/AwarenessEducator/utils'
import StepperFooter from '@/components/Stepper/StepperFooter.vue'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { getErrorMessage, scrollToComponent } from '@/utils/functions'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import { getDefaultEmailTemplate } from '@/api/company'
import { mapActions, mapGetters } from 'vuex'
import TrainingLibrarySendTrainingSettings from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSettings.vue'
import TrainingLibrarySendTrainingSelectUsers from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSelectUsers.vue'
import TrainingLibrarySendTrainingSummary from '@/components/TrainingLibrary/TrainingLibrarySendModal/TrainingLibrarySendTrainingSummary.vue'
import { emptyTrainingSendModalObj, getAutoEnrollText } from '@/components/TrainingLibrary/utils'
import {
  endTypeItems,
  awardCertificateTypes,
  enrollmentAutoEnrollTypeItems,
  enrollmentAutoEnrollDayOfWeekItems,
  periodTypeItems
} from '@/components/AwarenessEducator/SendTraining/utils'
import { getDeliveryMethodLabel, DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'

export default {
  name: 'TrainingLibraryTrainingSendModal',
  components: {
    TrainingLibrarySendTrainingSummary,
    TrainingLibrarySendTrainingSelectUsers,
    TrainingLibrarySendTrainingSettings,
    DefaultErrorDialog,
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
    }
  },
  data() {
    return {
      phoneNumbers: [],
      phoneNumberItems: [],
      labels,
      stepperIds: {
        cancelButton: 'btn-cancel--send-training-modal',
        backButton: 'btn-back--send-training-modal',
        nextButton: 'btn-next--send-training-modal',
        saveButton: 'btn-save--send-training-modal'
      },
      isActionButtonDisabled: false,
      createErrorMessage: '',
      step: 1,
      certificateData: null,
      reminderData: null,
      enrollmentData: null,
      userCountDetailResponse: {},
      totalActiveUserCount: 0,
      totalPhoneNumberUserCount: 0,
      trainingPreviewData: {
        name: this?.selectedRow?.trainingName,
        category: this?.selectedRow?.category,
        createdBy: this?.selectedRow?.createdBy,
        description: this?.selectedRow?.description,
        scormPlayerUrl: null,
        trainingUrl: null
      }
    }
  },
  computed: {
    ...mapGetters({
      getTimezones: 'common/getTimezones',
      enumTypes: 'trainingLibraryHelpers/getEnumTypes',
      distributionDelayTimeTypes: 'trainingLibraryHelpers/getDistributionDelayTimeTypes',
      certificateEmailNotificationTemplateTypeResourceId:
        'trainingLibraryHelpers/getCertificateEmailNotificationTemplateTypeResourceId',
      reminderEmailNotificationTemplateTypeResourceId:
        'trainingLibraryHelpers/getReminderEmailNotificationTemplateTypeResourceId',
      trainingEmailNotificationTemplateTypeResourceId:
        'trainingLibraryHelpers/getTrainingEmailNotificationTemplateTypeResourceId',
      languages: 'trainingLibraryHelpers/getLanguages'
    }),
    isSmsNotification() {
      if (this.step === 2 || this.step === 3)
        return this?.$refs?.refSendTrainingSettings?.formData?.isSendSMSNotification
      return false
    },
    isTrainingProxy() {
      if (this.step === 2 || this.step === 3)
        return this?.$refs?.refSendTrainingSettings?.formData?.isProxy
      return false
    },
    getTitle() {
      return `Send Training - ${this?.selectedRow?.trainingName}`
    },
    getSaveButtonText() {
      const scheduleTypeId = this.$refs?.refSendTrainingSettings?.formData?.scheduleTypeId
      if (this.step === 3 && this?.$refs?.refSendTrainingSettings?.formData?.isProxy) {
        return 'SAVE & DOWNLOAD'
      }
      if (scheduleTypeId === '1') {
        return 'LAUNCH'
      }
      return 'SCHEDULE'
    },
    getTrainingSummaryFormData() {
      let formData = {}
      if (this.step !== 3) return formData
      const { refSendTrainingSelectUsers, refSendTrainingSettings } = this.$refs
      const languages = refSendTrainingSettings.formData.languageIds
        .map(
          (lang) =>
            refSendTrainingSettings.$refs.refInputContentLanguage.contentLanguageItems.find(
              (item) => item.value === lang
            ).text
        )
        ?.join(', ')
      formData.trainingInfo = {
        'Target Users': `${refSendTrainingSelectUsers.totalTargetUserCount} users`,
        'Content Type': this?.selectedRow?.type,
        Languages: languages
      }
      formData.selectedStep2 = refSendTrainingSelectUsers.selectedRadioGroupIndex
      if (formData.selectedStep2)
        formData.selectedCampaign = refSendTrainingSelectUsers.selectedCampaign
      formData.selectedTargetGroups = refSendTrainingSelectUsers.selectedTargetGroups
      formData.userCountDetailResponse = this.userCountDetailResponse
      const isProxy = refSendTrainingSettings?.formData?.isProxy
      const sendReminderEvery = refSendTrainingSettings?.sendReminderEvery
      const enrollmentReminder = refSendTrainingSettings?.formData?.enrollmentReminder
      const enrollmentAutoEnroll = refSendTrainingSettings?.formData?.enrollmentAutoEnroll
      const preferredLanguageLabel = !refSendTrainingSettings?.formData
        ?.sendTemplatesInPreferredLanguage
        ? 'Company Language'
        : 'Target Users Language'
      if (
        refSendTrainingSettings?.formData?.deliveryMethod === DELIVERY_METHODS.EMAIL ||
        refSendTrainingSettings?.formData?.deliveryMethod === DELIVERY_METHODS.MICROSOFT_TEAMS
      ) {
        formData.settings = {
          Languages: languages.includes('All Languages') ? 'All Languages' : languages,
          'Delivery Method': getDeliveryMethodLabel(
            refSendTrainingSettings?.formData?.deliveryMethod
          ),
          'Preferred Language': preferredLanguageLabel,
          Reminder: sendReminderEvery,
          'Award Certificate': refSendTrainingSettings.formData.awardCertificate
            ? awardCertificateTypes?.find?.(
                (item) => item.value === refSendTrainingSettings.formData.certificateConfigSendType
              )?.text
            : 'No',
          'Auto-enroll': refSendTrainingSettings.isAutoEnroll,
          Schedule:
            refSendTrainingSettings.formData.scheduleTypeId === '1'
              ? 'Now'
              : `${
                  refSendTrainingSettings.formData.enrollmentScheduler.scheduledDate
                } ${this.getTimeZoneText(
                  refSendTrainingSettings.formData.enrollmentScheduler.scheduledTimeZoneId
                )}`,
          'Mark as Test': refSendTrainingSettings.formData.markedAsTest ? 'Yes' : 'No'
        }
      } else if (refSendTrainingSettings?.formData?.deliveryMethod === DELIVERY_METHODS.SMS) {
        formData.settings = {
          Languages: languages.includes('All Languages') ? 'All Languages' : languages,
          'Delivery Method': getDeliveryMethodLabel(
            refSendTrainingSettings?.formData?.deliveryMethod
          ),
          'Preferred Language': preferredLanguageLabel,
          Reminder: sendReminderEvery,
          'Sender Phone Number':
            refSendTrainingSettings?.$refs?.refSendTrainingSMSSettings?.formData?.phoneNumber,
          'SMS Text':
            refSendTrainingSettings?.$refs?.refSendTrainingSMSSettings?.formData?.smsTextTemplate,
          'Award Certificate': refSendTrainingSettings.formData.awardCertificate
            ? awardCertificateTypes?.find?.(
                (item) => item.value === refSendTrainingSettings.formData.certificateConfigSendType
              )?.text
            : 'No',
          'Auto-enroll': refSendTrainingSettings.isAutoEnroll,
          Schedule:
            refSendTrainingSettings.formData.scheduleTypeId === '1'
              ? 'Now'
              : `${
                  refSendTrainingSettings.formData.enrollmentScheduler.scheduledDate
                } ${this.getTimeZoneText(
                  refSendTrainingSettings.formData.enrollmentScheduler.scheduledTimeZoneId
                )}`,
          'Mark as Test': refSendTrainingSettings.formData.markedAsTest ? 'Yes' : 'No'
        }
      } else {
        formData.settings = {
          Languages: languages.includes('All Languages') ? 'All Languages' : languages,
          'Preferred Language': preferredLanguageLabel,
          'Mark as Test': refSendTrainingSettings.formData.markedAsTest ? 'Yes' : 'No',
          'Delivery Method': getDeliveryMethodLabel(
            refSendTrainingSettings?.formData?.deliveryMethod
          )
        }
      }
      if (refSendTrainingSettings?.formData?.deliveryMethod !== DELIVERY_METHODS.LMS) {
        if (sendReminderEvery) {
          const reminderEndType =
            endTypeItems.find((item) => item.value === enrollmentReminder.endType)?.text || ''
          let endText = reminderEndType
          if (enrollmentReminder.endType === 'OnDate') {
            endText = 'on ' + enrollmentReminder.stopTime
          } else if (enrollmentReminder.endType === 'AfterOccurrences') {
            endText = 'after occurrences ' + enrollmentReminder.occurrenceCount + ' times'
          }
          formData.settings.Reminder = `Every ${
            enrollmentReminder.periodCount === '1' ? '' : enrollmentReminder.periodCount
          } ${
            enrollmentReminder.periodCount > 1
              ? enrollmentReminder.periodType.toLowerCase() + 's'
              : enrollmentReminder.periodType.toLowerCase()
          } - Ends ${endText}`
        } else formData.settings['Reminder'] = 'No'
        if (refSendTrainingSettings.isAutoEnroll) {
          const autoEnrollType =
            enrollmentAutoEnrollTypeItems?.find?.(
              (item) => item.value === enrollmentAutoEnroll.type
            )?.text || ''
          const autoEnrollDayOfWeek =
            enrollmentAutoEnrollDayOfWeekItems?.find?.(
              (item) => item.value === enrollmentAutoEnroll.dayOfWeek
            )?.text || ''
          const autoEnrollPeriodType =
            periodTypeItems?.find?.(
              (item) => item.value === enrollmentAutoEnroll.emailPeriodTypeEnum
            )?.text || ''
          formData.settings['Auto-enroll'] = getAutoEnrollText(
            autoEnrollType,
            autoEnrollDayOfWeek,
            enrollmentAutoEnroll,
            autoEnrollPeriodType
          )
        } else formData.settings['Auto-enroll'] = 'No'
      }
      if (
        !refSendTrainingSettings?.formData?.isSendSMSNotification &&
        refSendTrainingSettings?.formData?.deliveryMethod !== DELIVERY_METHODS.LMS
      ) {
        delete formData.settings['Sender Phone Number']
        delete formData.settings['SMS Text']
      }
      if (isProxy) {
        delete formData.settings['Auto-enroll']
        delete formData.settings['Schedule']
      }

      formData.certificateData = refSendTrainingSettings.formData.awardCertificate
        ? this.certificateData
        : null
      if (refSendTrainingSettings?.formData?.deliveryMethod !== DELIVERY_METHODS.LMS) {
        formData.reminderData = refSendTrainingSettings.sendReminderEvery ? this.reminderData : null
      }
      formData.enrollmentData = this.enrollmentData
      formData.trainingData = this.trainingPreviewData
      formData.isProxy = isProxy
      return formData
    }
  },
  created() {
    this.callForFormDetails()
    this.callForPhoneNumbers()
  },
  methods: {
    ...mapActions({
      setTrainingSendModal: 'trainingLibrary/setTrainingSendModal'
    }),
    getTimeZoneText(timeZoneId) {
      return (
        this.getTimezones?.timeZoneList?.find?.((item) => item.id === timeZoneId)?.displayName || ''
      )
    },
    callForPhoneNumbers() {
      AwarenessEducatorService.getPhoneNumbers().then((response) => {
        this.phoneNumberItems = response.data.data
        this.phoneNumbers = response.data.data.map((item) => item.phoneNumber)
      })
    },
    callForFormDetails() {
      //get reminder email
      getDefaultEmailTemplate(this.reminderEmailNotificationTemplateTypeResourceId).then(
        (response) => {
          const {
            data: { data }
          } = response
          this.reminderData = {
            createdBy: this?.$store?.state?.auth?.selectedCompanyName,
            template: data.template.template,
            name: data.template.name || 'Default Reminder Email'
          }
        }
      )
      //get certificate email
      getDefaultEmailTemplate(this.certificateEmailNotificationTemplateTypeResourceId).then(
        (response) => {
          const {
            data: { data }
          } = response
          this.certificateData = {
            createdBy: this?.$store?.state?.auth?.selectedCompanyName,
            template: data.template.template,
            name: data.template.name || 'Default Certificate Email'
          }
        }
      )
      //get training email
      getDefaultEmailTemplate(this.trainingEmailNotificationTemplateTypeResourceId).then(
        (response) => {
          const {
            data: { data }
          } = response
          this.enrollmentData = {
            createdBy: this?.$store?.state?.auth?.selectedCompanyName,
            template: data.template.template,
            name: data.template.name || 'Default Training Email'
          }
        }
      )
      //get template
      const languages = this.languages || []
      AwarenessEducatorService.getTrainingUrlForPreview(
        this.selectedRow.trainingId,
        languages.find(
          (lang) =>
            lang.isoFriendlyName === this.selectedRow.languages[0] ||
            lang.code === this.selectedRow.languages[0]
        ).id
      ).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingPreviewData.scormPlayerUrl = data.scormPlayerUrl
        this.trainingPreviewData.trainingUrl = data.trainingUrl
      })
    },
    handleClose() {
      this.setTrainingSendModal(emptyTrainingSendModalObj)
    },
    async changeStep(flag = 1) {
      if (this.step === 2 && flag === 1) {
        const { refSendTrainingSelectUsers, refSendTrainingSettings } = this.$refs
        if (refSendTrainingSettings?.formData?.isProxy) {
          this.step += flag
          return
        }
        if (refSendTrainingSelectUsers.selectedRadioGroupIndex === 0) {
          const ids = refSendTrainingSelectUsers.formData.targetGroupResourceIds.map(
            (item) => item.value
          )
          const targetGroups = refSendTrainingSelectUsers.selectedTargetGroups

          if (!ids.length) {
            refSendTrainingSelectUsers.isShowTargetGroupUsersError = true
            refSendTrainingSelectUsers.isTargetGroupsValid = false
            return
          }
          this.isActionButtonDisabled = true
          const totalUserCount = targetGroups.reduce((acc, item) => {
            acc += item.userCount
            return acc
          }, 0)
          if (totalUserCount) {
            refSendTrainingSelectUsers.totalTargetUserCount = totalUserCount
            refSendTrainingSelectUsers.isShowTargetGroupUsersError = false
            refSendTrainingSelectUsers.isTargetGroupsValid = true
            const targetGroupResourceIds = targetGroups.map((group) => group.resourceId)
            this.userCountDetailResponse = await getTargetGroupCountDetail(targetGroupResourceIds)
            this.totalActiveUserCount = this.userCountDetailResponse?.data?.data?.reduce(
              (acc, row) => {
                if (row.status !== 'Active') return acc
                const verifiedUserCount =
                  row?.domainAllowList?.find((r) => r.status === 'Verified')?.count || 0
                return acc + verifiedUserCount
              },
              0
            )
            this.totalPhoneNumberUserCount = this.userCountDetailResponse?.data?.data?.reduce(
              (acc, row) => {
                if (row.status !== 'Active') return acc
                const phoneNumberCount =
                  row?.hasPhoneNumber?.find((r) => r.status === 'Yes')?.count || 0
                return acc + phoneNumberCount
              },
              0
            )
            this.step += flag
          } else {
            refSendTrainingSelectUsers.isShowTargetGroupUsersError = true
            refSendTrainingSelectUsers.isTargetGroupsValid = false
            this.$nextTick(() => {
              const el = refSendTrainingSelectUsers.$refs.refForm.$el.querySelector('.error--text')
              scrollToComponent(el)
            })
          }
          this.isActionButtonDisabled = false
        } else if (refSendTrainingSelectUsers.selectedRadioGroupIndex === 1) {
          const {
            formData: {
              userWhoOpenedEmail,
              userWhoClickedEmail,
              userWhoSubmittedData,
              userWhoDownloadedAttachment,
              userWhoReportedAsSuspicious
            }
          } = refSendTrainingSelectUsers
          const selections = [
            userWhoOpenedEmail,
            userWhoClickedEmail,
            userWhoSubmittedData,
            userWhoDownloadedAttachment,
            userWhoReportedAsSuspicious
          ]
          if (selections.every((selection) => !selection)) {
            refSendTrainingSelectUsers.targetUserCheckboxSelectionError = true
          }
          if (refSendTrainingSelectUsers.totalTargetUserCount) {
            this.step += flag
          }
        }
      } else if (this.step === 1 && flag === 1) {
        const { refSendTrainingSettings } = this.$refs
        if (
          refSendTrainingSettings &&
          refSendTrainingSettings.validateForm() &&
          refSendTrainingSettings.checkDateIsValid()
        ) {
          if (
            this.$refs?.refSendTrainingSettings?.formData?.isSendSMSNotification &&
            !this.$refs?.refSendTrainingSettings?.$refs?.refSendTrainingSMSSettings?.validateForm()
          ) {
            this.$nextTick(() => {
              const el = refSendTrainingSettings.$refs.refForm.$el.querySelector('.error--text')
              scrollToComponent(el)
            })
            return
          }
          if (
            this.$refs?.refSendTrainingSettings?.formData?.isSendSMSNotification &&
            !this.$refs?.refSendTrainingSettings?.$refs?.refSendTrainingSMSSettings?.formData?.smsTextTemplate.includes(
              '{TRAININGURL}'
            )
          ) {
            this.$store.dispatch('common/createSnackBar', {
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-information',
              message: `You cannot save without adding a {TRAININGURL} to the SMS text field`
            })
            return
          }
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
    handleSetPhishingCampaignConditionTypes(formData = {}) {
      const phishingCampaignConditionTypes = []
      const {
        userWhoOpenedEmail,
        userWhoClickedEmail,
        userWhoSubmittedData,
        userWhoSubmittedMFACode,
        userWhoDownloadedAttachment,
        userWhoReportedAsSuspicious
      } = formData
      if (userWhoOpenedEmail) phishingCampaignConditionTypes.push('EmailOpened')
      if (userWhoClickedEmail) phishingCampaignConditionTypes.push('PhishingLinkClicked')
      if (userWhoSubmittedData) phishingCampaignConditionTypes.push('DataSubmitted')
      if (userWhoSubmittedMFACode) phishingCampaignConditionTypes.push('MfaDataSubmitted')
      if (userWhoDownloadedAttachment) phishingCampaignConditionTypes.push('AttachmentDownloaded')
      if (userWhoReportedAsSuspicious) phishingCampaignConditionTypes.push('ReportedAsSuspicious')
      return phishingCampaignConditionTypes
    },
    handleSubmit() {
      if (this?.$refs?.refSendTrainingSettings?.formData?.isProxy)
        return this.handleDownloadPackage(this.selectedRow)
      const { refSendTrainingSelectUsers, refSendTrainingSettings } = this.$refs
      const selectedIndex = refSendTrainingSelectUsers.selectedRadioGroupIndex
      const { sendReminderEvery, isAutoEnroll } = refSendTrainingSettings
      const {
        enrollmentScheduler,
        enrollmentAutoEnroll,
        enrollmentReminder,
        scheduleTypeId,
        markedAsTest,
        awardCertificate,
        certificateConfigSendType,
        languageIds,
        name
      } = refSendTrainingSettings.formData
      const newLanguageIds = languageIds.filter((languageId) => languageId !== 'All')
      const phishingCampaignConditionTypes = []
      if (selectedIndex === 1) {
        phishingCampaignConditionTypes.push(
          ...this.handleSetPhishingCampaignConditionTypes(refSendTrainingSelectUsers.formData)
        )
      }
      if (enrollmentScheduler.scheduledTimeZoneId) enrollmentScheduler.useOwnTimeZone = false
      const payload = {
        name,
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
        certificateConfigSendType,
        languageIds: newLanguageIds
      }

      if (this.$refs?.refSendTrainingSettings?.formData?.isSendSMSNotification) {
        payload[
          'smsTextTemplate'
        ] = this.$refs?.refSendTrainingSettings?.$refs?.refSendTrainingSMSSettings?.formData?.smsTextTemplate
        payload[
          'smsProviderNumberResourceId'
        ] = this.$refs?.refSendTrainingSettings?.$refs?.refSendTrainingSMSSettings?.formData?.smsProviderNumberResourceId
      }
      if (
        this.$refs?.refSendTrainingSettings?.formData?.deliveryMethod ===
        DELIVERY_METHODS.MICROSOFT_TEAMS
      ) {
        payload['sendTeamsNotification'] = true
      }
      this.isActionButtonDisabled = true
      AwarenessEducatorService.createEnrollment(payload)
        .then(this.showSuccessSnackbarAndRouteToEnrollments)
        .catch((error) => {
          this.createErrorMessage = getErrorMessage(error)
        })
        .finally(() => (this.isActionButtonDisabled = false))
    },
    showSuccessSnackbarAndRouteToEnrollments(response = {}) {
      this.$store.dispatch('common/createSnackBar', {
        message: response.data.message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-check-circle'
      })
      this.handleClose()
      this.routeToEnrollments()
    },
    routeToEnrollments() {
      this.$router.push({ name: 'Enrollments' })
      this.$emit(EMITS.ON_CLOSE, true)
    },
    handleDownloadPackage(row) {
      const languageIds = this.$refs?.refSendTrainingSettings?.formData?.languageIds.filter(
        (language) => language !== 'All'
      )
      const contentLanguageItems = this.$refs?.refSendTrainingSettings?.$refs
        ?.refInputContentLanguage?.contentLanguageItems
      this.isActionButtonDisabled = true
      const promises = []
      languageIds.forEach((languageId) => {
        promises.push(
          AwarenessEducatorService.downloadTrainingPackage({
            trainingId: row.trainingId,
            languageId,
            name: this.$refs?.refSendTrainingSettings?.formData?.name || ''
          })
        )
      })
      Promise.all(promises)
        .then((responses) => {
          responses.forEach((response, index) => {
            const { data } = response
            const languageText = contentLanguageItems.find(
              (item) => item.value === languageIds[index]
            ).text
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(data)
            link.download = `${row.trainingId}-${languageText}_Scorm.zip`
            link.click()
          })
          this.routeToEnrollments()
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>
