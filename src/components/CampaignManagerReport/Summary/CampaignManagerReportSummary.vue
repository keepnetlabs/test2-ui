<template>
  <div id="campaign-manager-report-summary" class="campaign-manager-report-summary">
    <CampaignManagerReportSummaryHeader
      :phishing-scenario-name="phishingScenarioName"
      :resend-dialog-items="getResendDialogItems"
      :id="id"
    />
    <CampaignManagerReportSummaryCards :items="getCardsData" :is-loading="isLoading" />
    <div class="campaign-manager-report-summary__general-info mt-6">
      <CampaignManagerReportSummaryCampaignInfo :items="getCampaignSummaryItems" />
      <CampaignManagerReportSummarySettings :items="getSettingsItems" />
    </div>
    <CampaignManagerReportSummaryTargetGroups
      :items="targetGroups"
      :randomly-selected-users-count="getRandomlySelectedUsersCount"
      :is-show-randomly-selected="getIsShowRandomlySelected"
      :target-users-count="getTotalUsers"
    />
    <div class="campaign-manager-report-summary__general-info mt-4">
      <CampaignManagerReportSummaryScenarioInfo :items="getScenarioInfoItems" />
      <CampaignManagerReportSummaryScenarioStats
        :chart-data="getChartData"
        :chart-labels="chartLabels"
        :percents="getPercents"
      />
    </div>
    <CampaignManagerReportSummaryEmail :form-data="getEmailTemplateData" />
    <CampaignManagerReportSummaryLanginPage :form-data="getLandingPageTemplateData" />
  </div>
</template>

<script>
import CampaignManagerReportSummaryHeader from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryHeader'
import CampaignManagerReportSummaryCards from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCards'
import CampaignManagerReportSummaryCampaignInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryCampaignInfo'
import CampaignManagerReportSummarySettings from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummarySettings'
import CampaignManagerReportSummaryTargetGroups from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryTargetGroups'
import CampaignManagerReportSummaryScenarioInfo from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryScenarioInfo'
import CampaignManagerReportSummaryScenarioStats from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryScenarioStats'
import CampaignManagerReportSummaryEmail from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryEmail'
import CampaignManagerReportSummaryLanginPage from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryLanginPage'
import { getCampaignJobSummary, getCampaignJobSummaryTargetGroups } from '@/api/phishingsimulator'
import { difficulties, methods } from '@/components/CampaignManager/CampaignManagerInfo/utils'
import { useLoading } from '@/hooks/useLoading'
export default {
  name: 'CampaignManagerReportSummary',
  components: {
    CampaignManagerReportSummaryLanginPage,
    CampaignManagerReportSummaryEmail,
    CampaignManagerReportSummaryScenarioStats,
    CampaignManagerReportSummaryScenarioInfo,
    CampaignManagerReportSummaryTargetGroups,
    CampaignManagerReportSummarySettings,
    CampaignManagerReportSummaryCampaignInfo,
    CampaignManagerReportSummaryCards,
    CampaignManagerReportSummaryHeader
  },
  mixins: [useLoading],
  props: {
    id: {
      type: String
    },
    phishingScenarioName: {
      type: String
    }
  },
  data() {
    return {
      targetGroups: [],
      campaignSummary: {},
      interval: null,
      chartLabels: [
        'Opened email',
        'Clicked link',
        'Submitted data',
        'No response',
        'Not delivered'
      ]
    }
  },
  computed: {
    getPercents() {
      if (!this.getChartData.length) return [0, 0, 0, 0, 0]
      const cardsData = this.getCardsData
      return [
        cardsData.openedEmail.userPercent,
        cardsData.clickedEmail.userPercent,
        cardsData.submittedEmail.userPercent,
        cardsData.noResponse.userPercent,
        cardsData.notDelivered.userPercent
      ]
    },
    getCampaignSummaryItems() {
      const { campaignInfo = {} } = this.campaignSummary
      const {
        startDate,
        endDate,
        totalTargetUserCount = 0,
        emailDeliveredUserCount = 0
      } = campaignInfo
      return {
        'Start Date': startDate,
        'End Date': endDate,
        'Total Target Users': totalTargetUserCount,
        'Not Delivered': totalTargetUserCount - emailDeliveredUserCount
      }
    },
    getSettingsItems() {
      const { settings = {} } = this.campaignSummary
      const { duration, excludeFromReports, languages, smtpName = 0 } = settings
      return {
        Languages: languages || 'English',
        'Excluded from reports': excludeFromReports ? 'Yes' : 'No',
        Duration: `${duration || 0} Day(s)`,
        SMTP: smtpName
      }
    },
    getRandomlySelectedUsersCount() {
      const { targetUsers = {} } = this.campaignSummary
      return targetUsers['randomlyUsersCount'] || 0
    },
    getIsShowRandomlySelected() {
      const { targetUsers = {} } = this.campaignSummary
      return !!targetUsers.sendRandomlyUsers
    },
    getScenarioInfoItems() {
      const { scenarioInfo = {} } = this.campaignSummary
      const { name, difficultyTypeId = 1, methodTypeId = 1, languages } = scenarioInfo
      return {
        Name: name,
        Method: methods[methodTypeId - 1].text,
        Difficulty: difficulties[difficultyTypeId - 1].text,
        Languages: languages || 'English'
      }
    },
    getResendDialogItems() {
      const [
        openedEmail = 0,
        clickedEmail = 0,
        submittedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0
      ] = this.getChartData
      return this.getChartData.length
        ? {
            clickedEmail,
            noResponseEmail,
            notDelivered,
            openedEmail,
            submittedEmail
          }
        : {}
    },
    getChartData() {
      const { scenarioStats = {} } = this.campaignSummary
      const {
        clickedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0,
        openedEmail = 0,
        submittedEmail = 0
      } = scenarioStats
      const dataContainer = [
        openedEmail,
        clickedEmail,
        submittedEmail,
        noResponseEmail,
        notDelivered
      ]
      return dataContainer.every((item) => item === 0) ? [] : dataContainer
    },
    getCardsData() {
      if (!this.getChartData.length) return {}
      const [
        openedEmail = 0,
        clickedEmail = 0,
        submittedEmail = 0,
        noResponseEmail = 0,
        notDelivered = 0
      ] = this.getChartData
      return {
        noResponse: {
          userCount: noResponseEmail,
          userPercent: ((noResponseEmail / this.getTotalUsers) * 100).toFixed()
        },
        openedEmail: {
          userCount: openedEmail,
          userPercent: ((openedEmail / this.getTotalUsers) * 100).toFixed()
        },
        clickedEmail: {
          userCount: clickedEmail,
          userPercent: ((clickedEmail / this.getTotalUsers) * 100).toFixed()
        },
        submittedEmail: {
          userCount: submittedEmail,
          userPercent: ((submittedEmail / this.getTotalUsers) * 100).toFixed()
        },
        notDelivered: {
          userCount: notDelivered,
          userPercent: ((notDelivered / this.getTotalUsers) * 100).toFixed()
        }
      }
    },
    getTotalUsers() {
      const { campaignInfo = {} } = this.campaignSummary
      return campaignInfo['totalTargetUserCount'] || 0
    },
    getEmailTemplateData() {
      const { emailTemplate = {} } = this.campaignSummary
      const {
        name,
        difficultyResourceId,
        categoryResourceId,
        fromName,
        fromAddress,
        template
      } = emailTemplate

      return Object.keys(emailTemplate).length
        ? {
            difficulty: difficulties.find((item) => item.value === difficultyResourceId)?.text,
            method: methods.find((item) => item.value === categoryResourceId)?.text,
            fromName,
            fromAddress,
            emailTemplate: template,
            name
          }
        : {}
    },
    getLandingPageTemplateData() {
      const { landingPageTemplate = {} } = this.campaignSummary
      const {
        urlTemplate,
        name,
        landingPages,
        difficultyTypeId = 1,
        methodTypeId = 1
      } = landingPageTemplate
      return Object.keys(landingPageTemplate).length
        ? {
            name,
            urlTemplate,
            landingPageTemplate: landingPages[0].content,
            method: methods[methodTypeId - 1].text,
            difficulty: difficulties[difficultyTypeId - 1].text
          }
        : {}
    }
  },
  created() {
    this.callForData()
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    callForData() {
      this.callApis(true)
      this.interval = setInterval(() => {
        this.callApis()
      }, 15000)
    },
    callApis(isUseLoading = false) {
      if (isUseLoading) {
        this.setLoading(true)
      }
      getCampaignJobSummary(this.id)
        .then((response) => {
          this.campaignSummary = response?.data?.data
          this.$store.dispatch(
            'common/setActivePageRouterName',
            this.campaignSummary['phishingCampaignName']
          )
        })
        .finally(() => {
          if (isUseLoading) {
            this.setLoading(false)
          }
        })
      getCampaignJobSummaryTargetGroups(this.id).then((response) => {
        this.targetGroups = response?.data?.data?.groups
      })
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-summary {
  &__general-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .campaign-manager-summary-card__body-item {
    justify-content: space-between;
  }
}
</style>
