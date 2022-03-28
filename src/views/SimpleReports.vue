<template>
  <div class="campaign-reports" id="campaign-reports">
    <div class="campaign-reports__content">
      <CampaignReportsTable just-show-report-action @on-view-report="handleViewReport" />
    </div>
  </div>
</template>

<script>
import CampaignReportsTable from '@/components/CampaignReports/CampaignReportsTable'
export default {
  name: 'SimpleReports',
  components: { CampaignReportsTable },
  methods: {
    handleViewReport(row) {
      this.$router.push({
        name: 'Simple Report Details',
        params: { id: row.resourceId }
      })
    }
  }
}
</script>
