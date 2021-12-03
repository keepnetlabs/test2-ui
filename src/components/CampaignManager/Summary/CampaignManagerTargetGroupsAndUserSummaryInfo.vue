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
          {{ item.userCount || item['usersCount'] || 0 }}
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

<style lang="scss">
.campaign-manager-target-groups-and-users-info {
  padding-left: 24px;
  background-color: #fafafa;
  border-radius: 12px;

  & > div {
    border-top: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  &__item {
    display: flex;
    align-items: center;
    flex-basis: 33%;
    font-weight: normal;
    font-size: 14px;
    color: #383b41;
    border-bottom: 1px solid #e0e0e0;
    &:not(:nth-child(3n)) {
      border-right: 1px solid #e0e0e0;
    }
    padding: 16px;
    div {
      &:first-child {
        flex-basis: 85%;
      }
    }
  }
}
</style>
