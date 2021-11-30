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
        <span v-if="isShowRandomlySelected">
          Randomly selected {{ randomlySelectedUsersCount }} user(s) from</span
        >
        <span> {{ getTotalTargetGroupsAndUsersCount }} </span>
      </div>
      <div v-if="isShowTargetUserDetail">
        <CampaignManagerTargetGroupsAndUserSummaryInfo :items="items" />
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
  props: {
    items: {
      type: Array
    },
    randomlySelectedUsersCount: {
      type: Number
    },
    targetUsersCount: {
      type: Number
    },
    isShowRandomlySelected: {
      type: Boolean
    }
  },
  data() {
    return {
      labels,
      isShowTargetUserDetail: false
    }
  },
  computed: {
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      const itemsLength = this.items.length
      if (itemsLength) {
        text = `${this.targetUsersCount} user(s) from ${itemsLength} group(s)`
      }
      return text
    }
  }
}
</script>
