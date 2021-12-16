<template>
  <div class="campaign-reports" id="campaign-reports">
    <div class="campaign-reports__content">
      <CampaignReportsTable />
    </div>
  </div>
</template>

<script>
import CampaignReportsTable from '@/components/CampaignReports/CampaignReportsTable'
export default {
  name: 'CampaignReports',
  components: { CampaignReportsTable }
}
</script>

<style lang="scss">
.campaign-reports {
  min-height: 80vh;
  padding: 11px 16px 16px 16px;
  &__content {
    background: white;
    box-shadow: 0 10px 15px -5px hsla(0, 0%, 80.4%, 0.5) !important;
    padding: 24px 24px 0 24px !important;
    border-radius: 20px !important;
  }
}
</style>
