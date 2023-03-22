<template>
  <KContainer id="advanced-reports">
    <el-tabs v-model="tab" ref="refTabContainer">
      <el-tab-pane :label="labels.Reports" name="reports" id="reports-content">
        <AdvancedReportsList />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import labels from '@/model/constants/labels'
import AdvancedReportsList from '@/components/AdvancedReports/AdvancedReportsList'
export default {
  name: 'AdvancedReports',
  components: { AdvancedReportsList, KContainer },
  data() {
    return {
      tab: 'reports',
      labels
    }
  }
}
</script>
