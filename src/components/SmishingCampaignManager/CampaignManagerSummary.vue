<template>
  <div class="campaign-manager-last-step">
    <CampaignManagerScheduleDialog
      v-if="showSchedule && isShowScheduleDialog"
      :type="DISTRIBUTION_TYPES.SMISHING"
      :status="isShowScheduleDialog"
      :campaign-name="formData.name"
      :selected-frequency="getSelectedFrequency"
      :frequency-id="getSelectedFrequencyId"
      :schedule-type-id="getScheduleTypeId"
      :phishing-scenarios="getPhishingScenarios"
      :scheduled-date-time-zone-id="getScheduledDateTimeZoneId"
      :scheduled-date="getScheduledDate"
      :items="getScheduledDialogItems"
      @on-close="toggleScheduleDialog"
    />
    <div class="campaign-manager-last-step__header" :style="getHeaderStyle">
      <CampaignManagerSummaryCard
        icon="mdi-alert-circle"
        :title="labels.CampaignInfo"
        :items="getCampaignInfoItems"
      />
      <CampaignManagerSummaryCard
        icon="mdi-cog"
        :title="labels.Settings"
        :items="getSettingsItems"
      >
        <template  #body="{ items }">
      <div class="campaign-manager-summary-card__body">
        <div class="campaign-manager-summary-card__body-container">
          <div
            v-for="(val, key) in items"
            :key="key"
            class="campaign-manager-summary-card__body-item"
          >
              <div class="campaign-manager-summary-card__body-item-key">
                {{ key.slice(0, 1).toUpperCase() + key.slice(1) }}
              </div>
              <div v-if="key === 'Sender Phone Numbers'" class="campaign-manager-summary-card__body-item-value">
                <div class="d-flex align-center">
                  <span style="color: #2196F3; font-weight: 600;">Multiple phone numbers</span>
                  <v-btn class="ml-1" icon @click="handleSenderPhoneNumbersClick">
                    <v-icon center size="20" color="#2196F3">mdi-eye</v-icon>
                  </v-btn>
                </div>
              </div>
              <div v-else class="campaign-manager-summary-card__body-item-value">
                {{ val }}
              </div>
          </div>
        </div>
      </div>
        </template>
      </CampaignManagerSummaryCard>
      <CampaignManagerSummaryCard
        v-if="Object.keys(getOtherSettingsItems).length"
        class="campaign-manager-last-step__other-settings"
        icon="mdi-memory"
        hide-label
        :title="labels.Other"
        :items="getOtherSettingsItems"
      />
    </div>
    <div class="campaign-manager-last-step__target-users mt-4">
      <CampaignManagerSummaryCard
        detailable
        icon="mdi-account-multiple"
        :show-body-detail.sync="isShowTargetUserDetail"
        :title="labels.TargetUsers"
      >
        <template #body>
          <div class="campaign-manager-last-step__target-users-body pb-4">
            <span v-if="getOtherSettingsItems.isRandomSelected">
              {{ getTotalRandomlySelectedUserCount }}
            </span>
            <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
            <div v-if="isShowTargetUserDetail" class="mt-4">
              <CampaignManagerTargetGroupsAndUserSummaryInfo
                :items="getTargetGroupItems"
                isPhoneNumber
              />
            </div>
            <AlertBox
              v-if="canRenderPhoneNumberAlertBox"
              class="mt-4"
              :text="getPhoneNumberWarningText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
            <AlertBox
              v-if="canRenderNoPhoneNumberAlertBox"
              class="mt-4"
              icon-color="#B83A3A"
              style="background-color: #f56c6c33;"
              text="There are 0 target users with phone numbers in the selected groups. MFA scenario(s) in the campaign won’t be able to launched."
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
            <AlertBox
              v-if="canRenderTimeZoneAlertBox"
              class="mt-4 bg-aqua-light"
              icon-color="#2196f3"
              :text="getTimeZoneWarningText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="my-6 d-flex justify-space-between align-center">
      <span class="campaign-manager-last-step__phishing-scenario-label">Smishing Scenarios</span>
      <VTooltip v-if="phishingScenarios.length > 5" bottom>
        <template #activator="{ on }">
          <span v-on="on" class="campaign-manager-last-step__phishing-scenario-badge ml-4"
            >Total {{ phishingScenarios.length }} Scenarios</span
          >
        </template>
        <div v-for="(methodWrapper, index) in getMethodDetail" :key="index">
          {{ methodWrapper.method }} ({{ methodWrapper.count }})
        </div>
      </VTooltip>
      <div v-if="showSchedule">
        <v-btn
          class="campaign-manager-summary-card__button pr-4 mr-6"
          rounded
          outlined
          color="#2196f3"
          @click="handleSchedule"
        >
          <v-icon style="font-size: 20px; margin-right: 4px;">mdi-calendar-range</v-icon>
          Schedule
        </v-btn>
      </div>
    </div>
    <ElTabs
      v-if="phishingScenarios.length"
      v-model="selectedScenarioResourceId"
      class="k-sub-tab campaign-manager-last-step__phishing-scenario-tab"
      @tab-click="callForScenarioDetail($event)"
    >
      <ElTabPane
        v-for="(template, index) in phishingScenarios"
        :key="index"
        :name="template.resourceId"
        :label="template.name"
      />
    </ElTabs>
    <div class="campaign-manager-last-step__email-template mt-4">
      <CampaignManagerSummaryCard
        icon="mdi-message-alert"
        title="Text Message Template that will be sent to users"
      >
        <template #body>
          <div
            v-if="isFormData && textTemplateParams && phishingScenarios.length"
            class="campaign-manager-last-step__email-template-body pb-4"
          >
            <div class="campaign-manager-last-step__email-template-body-header">
              <div class="campaign-manager-last-step__email-template-body-header-left">
                {{ textTemplateParams.name }}
              </div>
              <div class="campaign-manager-last-step__email-template-body-header-right">
                <v-btn style="display: none;"></v-btn>
                <Badge
                  size="mini"
                  :color="getBadgeColor(textTemplateParams.difficulty)"
                  :text="getBadgeText(textTemplateParams.difficulty)"
                  :outline="false"
                />
                <Badge
                  v-if="landingPageParams.method || textTemplateParams.method"
                  size="mini"
                  color="#E0E0E0"
                  class-name="badge-middle px-2 py-2"
                  :text="getBadgeText(landingPageParams.method || textTemplateParams.method)"
                  :outline="false"
                />
                <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
                  <template #content>
                    <v-icon>mdi-web</v-icon>{{ textTemplateParams.languageShortCode }}
                  </template>
                </Badge>
              </div>
            </div>
            <div class="campaign-manager-last-step__email-template-body-header-sub">
              <span style="font-weight: 600;">Text Message:</span>
              {{ textTemplateParams.template }}
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerSummaryLandingPage :formData="landingPageParams" :isMethodMfa="isMethodMfa" />
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerReportSummaryTraining
        v-if="isRenderTrainingCard"
        :selected-row="selectedTraining"
        :training-params="trainingParams"
        :selected-training-languages="selectedTrainingLanguages"
      />
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'
import Badge from '@/components/Badge'
import { getDifficultyBadgeColor } from '@/utils/functions'
import AlertBox from '@/components//AlertBox'
import { SEND_RANDOMLY_USERS_CALCULATE_TYPES } from '@/components/CampaignManager/utils'
import SmishingService from '@/api/smishing'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import CampaignManagerSummaryLandingPage from '@/components/SmishingCampaignManager/CampaignManagerSummaryLandingPage'
import CampaignManagerScheduleDialog from '@/components/CampaignManager/CampaignManagerScheduleDialog.vue'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'
import CampaignManagerReportSummaryTraining from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTraining.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapGetters } from 'vuex'

export default {
  name: 'CampaignManagerSummary',
  components: {
    CampaignManagerReportSummaryTraining,
    CampaignManagerScheduleDialog,
    Badge,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    CampaignManagerSummaryCard,
    CampaignManagerSummaryLandingPage,
    AlertBox
  },
  props: {
    formData: {
      type: Object
    },
    isVishing: {
      type: Boolean,
      default: false
    },
    languageOptions: {
      type: Array,
      default: () => []
    },
    showSchedule: {
      type: Boolean,
      default: false
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      DISTRIBUTION_TYPES,
      labels,
      isSenderPhoneNumbersModalVisible: false,
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false,
      isScenarioDetailLoading: false,
      selectedScenarioResourceId: '',
      selectedScenarioMethodTypeId: '',
      isShowScheduleDialog: false,
      trainingParams: null,
      selectedTraining: null,
      trainingLanguages: [],
      selectedTrainingLanguages: [],
      textTemplateParams: {},
      landingPageParams: {}
    }
  },
  computed: {
    ...mapGetters({
      getSelectedTimeZoneName: 'common/getSelectedTimeZoneName'
    }),
    canRenderTimeZoneAlertBox() {
      return this.getActiveUsersWithoutTimeZoneCount > 0 && this.formData?.useTargetUserTimeZone
    },
    getTargetGroupItems() {
      const activeItems = this.formData?.userCountDetailResponse?.data?.data?.filter?.(row => row.status === 'Active') || []
      return activeItems
    },
    isRenderTrainingCard() {
      return this.trainingParams
    },
    getScheduledDialogItems() {
      return this?.formData?.scheduleItems || []
    },
    getSelectedFrequency() {
      return this?.formData?.frequency || ''
    },
    getSelectedFrequencyId() {
      return this?.formData?.frequencyId || ''
    },
    getScheduleTypeId() {
      return this?.formData?.selectedScheduleId || ''
    },
    getPhishingScenarios() {
      return this?.formData?.selectedPhishingScenarios || []
    },
    getScheduledDateTimeZoneId() {
      return this?.formData?.scheduledDateTimeZoneId || ''
    },
    getScheduledDate() {
      return this?.formData?.scheduledDate || ''
    },
    isMethodMfa() {
      return this.selectedScenarioMethodTypeId === 4
    },
    getMethodDetail() {
      const mappedObj = this.phishingScenarios.reduce(
        (acc, pScenario) => {
          acc[pScenario.method] += 1
          return acc
        },
        {
          'Click-Only': 0,
          'Data Submission': 0,
          Attachment: 0
        }
      )
      const mappedArr = []
      Object.keys(mappedObj).forEach((key) => {
        if (mappedObj[key] > 0) {
          mappedArr.push({
            method: key,
            count: mappedObj[key]
          })
        }
      })
      return mappedArr
    },
    getHeaderStyle() {
      return {
        gridTemplateColumns: Object.keys(this.getOtherSettingsItems).length
          ? '1fr 1fr 1fr'
          : '1fr 1fr'
      }
    },
    phishingScenarios() {
      return this.formData?.selectedPhishingScenarios || []
    },
    canRenderAlertbox() {
      return this.getUsersFromUnverifiedDomainsCount > 0 && !this.isVishing
    },
    canRenderPhoneNumberAlertBox() {
      return this.getActiveUsersWithoutPhoneNumberCount > 0 && this.isMFAScenarioSelected
    },
    canRenderNoPhoneNumberAlertBox() {
      return this.getActiveUsersWithPhoneNumberCount === 0 && this.isMFAScenarioSelected
    },
    getUnverifiedDomainsText() {
      return `There ${this.getUsersFromUnverifiedDomainsCount > 1 ? 'are' : 'is'} ${
        this.getUsersFromUnverifiedDomainsCount
      } active user${
        this.getUsersFromUnverifiedDomainsCount > 1 ? 's' : ''
      } with unverified domains in the selected groups. Please verify the domains in order to send emails.`
    },
    getPhoneNumberWarningText() {
      return `There ${this.getActiveUsersWithPhoneNumberCount > 1 ? 'are' : 'is'} ${
        this.getActiveUsersWithPhoneNumberCount
      } active user${this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''} with phone number${
        this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''
      } and ${this.getActiveUsersWithoutPhoneNumberCount} active user${
        this.getActiveUsersWithoutPhoneNumberCount > 1 ? 's' : ''
      } without phone number${
        this.getActiveUsersWithoutPhoneNumberCount > 1 ? 's' : ''
      } in this group. Only the ${this.getActiveUsersWithPhoneNumberCount} user${
        this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''
      } with phone number${
        this.getActiveUsersWithPhoneNumberCount > 1 ? 's' : ''
      } will receive MFA scenario.`
    },
    getTimeZoneWarningText() {
      return `There ${this.getActiveUsersWithoutTimeZoneCount > 1 ? 'are' : 'is'} ${
        this.getActiveUsersWithoutTimeZoneCount
      } active user${
        this.getActiveUsersWithoutTimeZoneCount > 1 ? 's' : ''
      } without time zone information in the selected groups. They will receive the campaign based on the your own time zone (${
        this.getSelectedTimeZoneName
      }).`
    },
    getActiveUsersWithoutTimeZoneCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const withoutTimeZoneCount = row?.timeZone?.find((r) => r.status === 'No')?.count || 0
        return acc + withoutTimeZoneCount
      }, 0)
    },
    getUsersFromUnverifiedDomainsCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const unVerifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === 'Unverified')?.count || 0
        return acc + unVerifiedUserCount
      }, 0)
    },
    getActiveUsersWithPhoneNumberCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const phoneNumberCount = row?.hasPhoneNumber?.find((r) => r.status === 'Yes')?.count || 0
        return acc + phoneNumberCount
      }, 0)
    },
    getActiveUsersWithoutPhoneNumberCount() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const withoutPhoneNumberCount =
          row?.hasPhoneNumber?.find((r) => r.status === 'No')?.count || 0
        return acc + withoutPhoneNumberCount
      }, 0)
    },
    isFormData() {
      return Object.keys(this.formData).length
    },
    isAttachmentBasedScenario() {
      return this.landingPageParams?.method === 'Attachment' || false
    },
    getCampaignInfoItems() {
      const { formData, phishingScenarios } = this
      const methodSet = new Set()
      const difficultySet = new Set()
      phishingScenarios.forEach((pScenario) => {
        methodSet.add(pScenario.method)
        difficultySet.add(pScenario.difficulty)
      })
      return {
        name: formData.name,
        method: [...methodSet].join(', '),
        difficulty: [...difficultySet].join(', ')
      }
    },
    getTotalRandomlySelectedUserCount() {
      let text = ''
      if (Object.keys(this.formData).length && this.formData.targetGroupResourceIds) {
        const {
          targetGroupResourceIds,
          sendRandomlyUsersCalculateTypeId,
          sendRandomlyUsersCount
        } = this.formData
        let totalActiveUsers = this.getTotalActiveUsers
        const totalGroupLength = targetGroupResourceIds.length
        if (totalGroupLength && totalActiveUsers === 0) {
          totalActiveUsers = 1
        }

        if (sendRandomlyUsersCalculateTypeId === '1') {
          const total = Math.round((totalActiveUsers / 100) * Number(sendRandomlyUsersCount))
          text = `Randomly selected %${sendRandomlyUsersCount} (${total || 1} users) from`
        } else {
          text = `Randomly selected ${Number(sendRandomlyUsersCount)} users from`
        }
      }
      return text
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      if (Object.keys(this.formData)?.length && this.formData.targetGroupResourceIds) {
        const { targetGroupResourceIds } = this.formData
        text = `${this.getTotalActiveUsersWithPhoneNumber} active user${
          this.getTotalActiveUsersWithPhoneNumber > 1 ? 's' : ''
        } with phone numbers from ${targetGroupResourceIds.length} group(s)`
      }
      return text
    },
    getTotalActiveUsersWithPhoneNumber() {
      return this.formData.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const phoneNumberCount = row?.hasPhoneNumber?.find((r) => r.status === 'Yes')?.count || 0
        return acc + phoneNumberCount
      }, 0)
    },
    getTotalUsers() {
      const { selectedTargetGroups } = this.formData
      return selectedTargetGroups.reduce((acc, item) => {
        acc += item.userCount
        return acc
      }, 0)
    },
    getTotalActiveUsers() {
      const { userCountDetailResponse } = this.formData
      return userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const verifiedUserCount =
          row?.domainAllowList?.find((r) => r.status === 'Verified')?.count || 0
        return acc + verifiedUserCount
      }, 0)
    },
    getSettingsItems() {
      const { selectedSchedule, duration, senderPhoneNumber, useTargetUserTimeZone, frequency } = this.formData
      let startingText = selectedSchedule
      if (selectedSchedule !== 'Later' && useTargetUserTimeZone) {
        startingText = `${selectedSchedule} - Target users’ time zones`
      }

      if (senderPhoneNumber?.length === 1) {
      return {
        Starting: startingText,
        Duration: duration,
        'Sender Phone Number': senderPhoneNumber[0],
        Frequency: frequency
      }
      }
      return {
        Starting: startingText,
        Duration: duration,
        'Sender Phone Numbers': senderPhoneNumber,
        Frequency: frequency
      }
    },
    getOtherSettingsItems() {
      const {
        excludeFromReports,
        sendOnlyActiveUsers,
        sendRandomlyUsers,
        sendRandomlyUsersCount,
        sendRandomlyUsersCalculateTypeId
      } = this.formData
      let data = {}
      if (excludeFromReports) data.isExcludeFromReports = 'Excluded from reports'
      if (sendOnlyActiveUsers) data.isOnlyActiveUsers = 'Only to active users'
      if (sendRandomlyUsers)
        data.isRandomSelected = `Randomly selected ${sendRandomlyUsersCount}${
          sendRandomlyUsersCalculateTypeId === SEND_RANDOMLY_USERS_CALCULATE_TYPES.PERCENTAGE
            ? '%'
            : ' users'
        }`
      return data
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.selectedScenarioResourceId = val?.selectedPhishingScenarios?.[0]?.resourceId
        this.callForScenarioDetail({ name: this.selectedScenarioResourceId, index: 0 })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.callForTrainingLanguages()
  },
  methods: {
    callForScenarioDetail(event = {}) {
      const resourceId = event?.name || ''
      if (!resourceId) return
      const training = this?.formData?.trainings?.[resourceId]
      if (training && training.trainingId) {
        this.selectedTraining = training
        this.callForTrainingDetail(training.trainingId)
      } else this.trainingParams = null
      this.isScenarioDetailLoading = true
      SmishingService.previewSmishingScenario(resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const {
            textTemplate,
            landingPageTemplate,
            methodTypeId: scenarioMethodTypeId,
            mfaTextTemplate,
            mfaSmsSenderNumber
          } = data
          const {
            template,
            name,
            difficultyResourceId,
            languageTypeResourceId: languageOfEmailTemplate,
            method
          } = textTemplate || {}

          this.textTemplateParams = {
            name,
            difficulty:
              difficulties.find((item) => item.value === difficultyResourceId)?.text || '',
            languageTypeResourceId: languageOfEmailTemplate,
            template,
            method
          }
          this.textTemplateParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.textTemplateParams.languageTypeResourceId
          )?.text
          const {
            name: landingPageName = '',
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            languageTypeResourceId,
            methodTypeId
          } = landingPageTemplate || {}
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            languageTypeResourceId,
            landingPageTemplates: landingPages,
            mfaTextTemplate,
            mfaSmsSenderNumber
          }
          this.landingPageParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.landingPageParams.languageTypeResourceId
          )?.text
          this.selectedScenarioMethodTypeId = scenarioMethodTypeId
        })
        .finally(() => (this.isScenarioDetailLoading = false))
    },
    callForTrainingDetail(trainingId = '') {
      AwarenessEducatorService.getTraining(trainingId).then((response) => {
        const {
          data: { data }
        } = response
        this.trainingParams = { ...data }
        let selectedLanguages = []
        this.selectedTraining.trainingLanguageIds.forEach((lang) => {
          const language = this.trainingLanguages.find((item) => item.id === lang)
          if (language)
            selectedLanguages.push({
              text: language.name,
              value: language.id,
              code: language.code
            })
        })
        this.selectedTrainingLanguages = selectedLanguages
        this.trainingParams.languages = this.selectedTrainingLanguages
          .map((lang) => lang.code)
          .join(' | ')
      })
    },
    callForTrainingLanguages() {
      AwarenessEducatorService.getLanguages().then((res) => {
        this.trainingLanguages = res?.data?.data || []
      })
    },
    getBadgeColor(text = '') {
      return getDifficultyBadgeColor(text)
    },
    getBadgeText(text = '') {
      return text
    },
    handleSchedule() {
      this.toggleScheduleDialog()
    },
    toggleScheduleDialog() {
      this.isShowScheduleDialog = !this.isShowScheduleDialog
    },
    handleSenderPhoneNumbersClick() {
      this.isSenderPhoneNumbersModalVisible = true
    },
    handleCloseSenderPhoneNumbersModal() {
      this.isSenderPhoneNumbersModalVisible = false
    }
  }
}
</script>
