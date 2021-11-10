<template>
  <div
    id="campaign-manager-report"
    class="campaign-manager-report integrations campaign-manager-report"
  >
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="pl-0 integrations__tab-container" cols="12">
        <v-card id="pr-card" class="pr-card pr-6">
          <el-tabs v-model="tab">
            <el-tab-pane
              v-for="item in tabItems"
              :key="item.name"
              :id="item.id"
              :name="item.name"
              :label="item.label"
            >
              <component v-if="item.name === tab" :is="item.component" />
            </el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerReportSummary from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummary'
import CampaignManagerReportOpened from '@/components/CampaignManagerReport/Opened/CampaignManagerReportOpened'
import CampaignManagerReportClicked from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClicked'
import CampaignManagerReportSubmittedData from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedData'
import CampaignManagerReportNoResponse from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponse'
import CampaignManagerReportSendingReport from '@/components/CampaignManagerReport/SendingReport/CampaignManagerReportSendingReport'
export default {
  name: 'CampaignManagerReport',
  data() {
    return {
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'campaign-manager-report-summary-content',
          label: labels.Summary,
          component: CampaignManagerReportSummary
        },
        {
          name: labels.Opened,
          id: 'campaign-manager-report-opened-content',
          label: labels.Opened,
          component: CampaignManagerReportOpened
        },
        {
          name: labels.Clicked,
          id: 'campaign-manager-report-clicked-content',
          label: labels.Clicked,
          component: CampaignManagerReportClicked
        },
        {
          name: labels.SubmittedData,
          id: 'campaign-manager-report-submitted-date-content',
          label: labels.SubmittedData,
          component: CampaignManagerReportSubmittedData
        },
        {
          name: labels.NoResponse,
          id: 'campaign-manager-report-no-response-content',
          label: labels.NoResponse,
          component: CampaignManagerReportNoResponse
        },
        {
          name: labels.SendingReport,
          id: 'campaign-manager-report-sending-response-content',
          label: labels.SendingReport,
          component: CampaignManagerReportSendingReport
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report {
  .k-table__wrapper {
    padding-bottom: 6px;
  }
}
</style>
