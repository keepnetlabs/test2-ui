<template>
  <div class="campaign-manager-target-groups-and-users-info">
    <div>
      <div
        v-for="item in items"
        :key="item.text"
        class="campaign-manager-target-groups-and-users-info__item"
      >
        <div>
          {{ item.targetGroupName }}
        </div>
        <div>
          {{ getUserCount(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampaignManagerTargetGroupsAndUserSummaryInfo',
  props: {
    items: {
      type: Array
    },
    isPhoneNumber: {
      type: Boolean
    }
  },
  methods: {
    getUserCount(item) {
      if (this.isPhoneNumber) {
        return item?.hasPhoneNumber?.find((row) => row.status === 'Yes')?.count || 0
      }
      return item?.domainAllowList?.find((row) => row.status === 'Verified')?.count || 0
    }
  }
}
</script>
