<template>
  <div class="campaign-manager-target-groups-and-users-info">
    <div>
      <div
        v-for="item in items"
        :key="item.text"
        class="campaign-manager-target-groups-and-users-info__item"
      >
        <div>
          {{ item.name }}
        </div>
        <div>
          {{ item.userCount || item['userCount'] || 0 }}
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
    }
  }
}
</script>
