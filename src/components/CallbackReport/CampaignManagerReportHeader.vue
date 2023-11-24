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
