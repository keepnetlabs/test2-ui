<template>
  <KContainer id="email-threat-simulator-report">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getEtsQuickScanReportPermissionStat"
        label="Summary"
        name="summary"
        id="tab-summary"
      >
        <Summary v-if="tab === 'summary'" ref="Summary" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getEtsQuickScanReportPermissionSearch"
        label="Sent Attacks"
        name="sentAttacks"
        id="tab-send-attacks"
      >
        <sent-attacks v-if="tab === 'sentAttacks'" ref="refSentAttacks" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import SentAttacks from '@/components/EmailThreatSmulatorReports/SentAttacks'
import Summary from '@/components/EmailThreatSmulatorReports/Summary'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'

export default {
  name: 'EMailThreatSimulatorReports',
  components: {
    KContainer,
    SentAttacks,
    Summary
  },
  data() {
    return {
      tab: 'summary'
    }
  },
  computed: {
    ...mapGetters({
      getEtsQuickScanReportPermissionStat: 'permissions/getEtsQuickScanReportPermissionStat',
      getEtsQuickScanReportPermissionSearch: 'permissions/getEtsQuickScanReportPermissionSearch'
    })
  },
  created() {
    if (!this.getEtsQuickScanReportPermissionStat && this.getEtsQuickScanReportPermissionSearch) {
      this.tab = 'sentAttacks'
    } else if (
      this.getEtsQuickScanReportPermissionSearch &&
      !this.getEtsQuickScanReportPermissionSearch
    ) {
      this.tab = 'summary'
    }
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    }
  }
}
</script>
