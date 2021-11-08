<template>
  <div class="campaign-manager-report-header-container">
    <div class="campaign-manager-report-header__title">
      {{ title }}
    </div>
    <div class="campaign-manager-report-summary-header__subtitle">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'CampaignManagerReportHeader',
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    }
  }
}
</script>

<style lang="scss">
.campaign-manager-report-header {
  &-container {
    display: flex;
    flex-direction: column;
  }
  &__title {
    font-weight: 600;
    font-size: 20px;
    color: #383b41;
    line-height: 24px;
  }
  &__subtitle {
    font-weight: normal;
    font-size: 16px;
    color: #383b41;
    line-height: 22px;
  }
}
</style>
