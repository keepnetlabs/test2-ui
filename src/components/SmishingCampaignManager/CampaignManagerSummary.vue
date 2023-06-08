<template>
  <div class="campaign-manager-last-step">
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
      />
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
                :items="formData.selectedTargetGroups"
              />
            </div>
            <AlertBox
              v-if="canRenderAlertbox"
              class="mt-4"
              :text="getUnverifiedDomainsText"
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="my-6">
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
              Text Message: {{ textTemplateParams.template }}
            </div>
          </div>
        </template>
      </CampaignManagerSummaryCard>
    </div>
    <div class="campaign-manager-last-step__landing-page-template mt-4">
      <CampaignManagerReportSummaryLandingPage :formData="landingPageParams" />
    </div>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'
import Badge from '@/components/Badge'
import CampaignManagerReportSummaryLandingPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLandingPage'
import { getDifficultyBadgeColor } from '@/utils/functions'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import AlertBox from '@/components//AlertBox'
import { SEND_RANDOMLY_USERS_CALCULATE_TYPES } from '@/components/CampaignManager/utils'
import { getPhishingScenarioLandingPageAndEmailTemplateByPhishingScenarioId } from '@/api/phishingsimulator'
import SmishingService from '@/api/smishing'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'

export default {
  name: 'CampaignManagerSummary',
  components: {
    Badge,
    CampaignManagerTargetGroupsAndUserSummaryInfo,
    CampaignManagerSummaryCard,
    CampaignManagerReportSummaryLandingPage,
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
    }
  },
  data() {
    return {
      labels,
      isShowTargetUserDetail: false,
      isShowEmailTemplate: false,
      isShowLandingPageTemplate: false,
      isScenarioDetailLoading: false,
      selectedScenarioResourceId: '',
      selectedScenarioName: '',
      textTemplateParams: {},
      landingPageParams: {}
    }
  },
  computed: {
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
    getUnverifiedDomainsText() {
      return `There are ${this.getUsersFromUnverifiedDomainsCount} active users with unverified domains in the selected groups. Please verify the domains in order to send emails.`
    },
    getUsersFromUnverifiedDomainsCount() {
      return (
        this.formData.userCountDetailResponse?.data?.data
          ?.find((row) => row.status === 'Active')
          ?.domainAllowList?.find((row) => row.status === 'Unverified')?.count || 0
      )
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
        text = `${this.getTotalActiveUsers} active user(s) with verified domain(s) from ${targetGroupResourceIds.length} group(s)`
      }
      return text
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
      const totalActiveUsersCount =
        userCountDetailResponse?.data.data
          ?.find((row) => row.status === 'Active')
          ?.domainAllowList?.find((row) => row.status === 'Verified')?.count || 0
      return totalActiveUsersCount
    },
    getSettingsItems() {
      const { selectedSchedule, duration, senderPhoneNumber } = this.formData
      const obj = {
        Starting: selectedSchedule,
        Duration: duration,
        'Sender Phone Number': senderPhoneNumber
      }
      return obj
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
  methods: {
    callForScenarioDetail(event = {}) {
      const resourceId = event?.name || ''
      if (!resourceId) return
      if (this.phishingScenarios.length) {
        this.selectedScenarioName = this.phishingScenarios[parseInt(event.index)].name
      }
      this.isScenarioDetailLoading = true
      SmishingService.previewSmishingScenario(resourceId)
        .then((response) => {
          const { data: { data = {} } = {} } = response
          const { textTemplate, landingPageTemplate, methodTypeId } = data
          const {
            template,
            name,
            difficultyResourceId,
            languageTypeResourceId: languageOfEmailTemplate
          } = textTemplate || {}

          this.textTemplateParams = {
            name,
            difficulty:
              difficulties.find((item) => item.value === difficultyResourceId)?.text || '',
            languageTypeResourceId: languageOfEmailTemplate,
            template
          }
          this.textTemplateParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.textTemplateParams.languageOfEmailTemplate
          )?.text
          const {
            name: landingPageName = '',
            description,
            landingPages,
            urlTemplate,
            difficultyTypeId,
            languageTypeResourceId
          } = landingPageTemplate || {}
          this.landingPageParams = {
            name: landingPageName,
            description,
            urlTemplate,
            difficulty: difficulties[difficultyTypeId - 1]?.text || '',
            method: methods[methodTypeId - 1]?.text || '',
            languageTypeResourceId,
            landingPageTemplates: landingPages
          }
          this.landingPageParams.languageShortCode = this.languageOptions.find(
            (language) => language.value === this.landingPageParams.languageTypeResourceId
          )?.text
        })
        .finally(() => (this.isScenarioDetailLoading = false))
    },
    getBadgeColor(text = '') {
      return getDifficultyBadgeColor(text)
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>
