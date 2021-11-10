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
    }
  },
  data() {
    return {
      labels,
      isShowTargetUserDetail: false
    }
  },
  computed: {
    getOtherSettingsItems() {
      return { isRandomSelected: true }
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      const itemsLength = this.items.length
      if (itemsLength) {
        text = `${this.getTotalUsers} user(s) from ${itemsLength} group(s)`
      }
      return text
    },
    getTotalUsers() {
      return this.items.reduce((acc, item) => {
        acc += item['usersCount']
        return acc
      }, 0)
    }
  }
}
</script>
