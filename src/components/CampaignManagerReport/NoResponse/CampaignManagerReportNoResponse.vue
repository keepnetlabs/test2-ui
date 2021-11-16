<template>
  <div id="campaign-manager-report-no-response" class="campaign-manager-report-no-response">
    <CampaignManagerReportHeader
      :title="labels.UserWhoHaventOpened"
      :subtitle="phishingScenarioName"
    />
    <CampaignManagerReportNoResponseTable
      ref="refNoResponseTable"
      class="mt-6"
      :id="id"
      @on-resend="handleOnResend"
    />
  </div>
</template>

<script>
import CampaignManagerReportHeader from '@/components/CampaignManagerReport/CampaignManagerReportHeader'
import labels from '@/model/constants/labels'
import CampaignManagerReportNoResponseTable from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponseTable'
import {
  resendNoResponsePhishingCampaignJob,
  resendPhishingCampaignToUserList
} from '@/api/phishingsimulator'
export default {
  name: 'CampaignManagerReportNoResponse',
  components: { CampaignManagerReportNoResponseTable, CampaignManagerReportHeader },
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
      labels
    }
  },
  methods: {
    handleOnResend(payload) {
      resendPhishingCampaignToUserList(payload, this.id).then(() => {
        this.$refs.refNoResponseTable.callForData()
      })
    }
  }
}
</script>
