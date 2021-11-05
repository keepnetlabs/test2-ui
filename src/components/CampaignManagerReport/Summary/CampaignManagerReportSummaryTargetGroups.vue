<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-account-multiple"
    :show-body-detail.sync="isShowTargetUserDetail"
    :title="labels.TargetUsers"
  >
    <template #body>
      <div class="campaign-manager-last-step__target-users-body pb-4">
        <span v-if="getOtherSettingsItems.isRandomSelected">
          Randomly selected %10 (9 users) from</span
        >
        <span> 420 users from 19 groups </span>
      </div>
      <div v-if="isShowTargetUserDetail">
        <CampaignManagerTargetGroupsAndUserSummaryInfo :items="formData.targetGroupResourceIds" />
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'
import labels from '@/model/constants/labels'
export default {
  name: 'CampaignManagerReportSummaryTargetGroups',
  components: { CampaignManagerTargetGroupsAndUserSummaryInfo, CampaignManagerSummaryCard },
  data() {
    return {
      labels,
      isShowTargetUserDetail: false,
      formData: {
        targetGroupResourceIds: []
      }
    }
  },
  computed: {
    getOtherSettingsItems() {
      return { isRandomSelected: true }
    }
  }
}
</script>
