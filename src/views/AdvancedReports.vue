<template>
  <KContainer id="advanced-reports">
    <el-tabs v-model="tab" ref="refTabContainer">
      <el-tab-pane
        v-if="canRenderSystemTab"
        label="System Reports"
        name="system"
        id="system-reports-content"
      >
        <AdvancedReportsList
          :isLoading="isLoading"
          :reports="getReportsByGroup(REPORT_GROUPS.SYSTEM)"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="canRenderResellerTab"
        label="Reseller Reports"
        name="reseller"
        id="reseller-reports-content"
      >
        <AdvancedReportsList
          :isLoading="isLoading"
          :reports="getReportsByGroup(REPORT_GROUPS.RESELLER)"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="canRenderCompanyTab"
        label="Company Reports"
        name="company"
        id="company-reports-content"
      >
        <AdvancedReportsList
          :isLoading="isLoading"
          :reports="getReportsByGroup(REPORT_GROUPS.COMPANY)"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import labels from '@/model/constants/labels'
import AdvancedReportsList from '@/components/AdvancedReports/AdvancedReportsList'
import ReportsService from '@/api/reports'
import { mapGetters } from 'vuex'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'AdvancedReports',
  components: { AdvancedReportsList, KContainer },
  mixins: [useLoading],
  data() {
    return {
      reports: [],
      tab: 'system',
      labels,
      REPORT_GROUPS: {
        SYSTEM: 1,
        RESELLER: 2,
        COMPANY: 3
      }
    }
  },
  computed: {
    ...mapGetters({
      getUser: 'auth/userGetter'
    }),
    userRole() {
      return this.getUser?.role?.name
    },
    canRenderSystemTab() {
      return this.userRole === 'Root'
    },
    canRenderResellerTab() {
      return this.userRole === 'Root' || this.userRole === 'Reseller'
    },
    canRenderCompanyTab() {
      return (
        this.userRole === 'Root' ||
        this.userRole === 'Reseller' ||
        this.userRole === 'Company Admin' ||
        this.$store.getters['permissions/getAdvancedReportsSearchPermissions']
      )
    }
  },
  created() {
    this.callForData()
  },
  watch: {
    userRole: {
      immediate: true,
      handler(val) {
        if (val === 'Root') this.tab = 'system'
        if (val === 'Reseller') this.tab = 'reseller'
        if (
          val === 'Company Admin' ||
          this.$store.getters['permissions/getAdvancedReportsSearchPermissions']
        )
          this.tab = 'company'
      }
    }
  },
  methods: {
    callForData() {
      this.setLoading(true)
      ReportsService.getReports()
        .then((response) => {
          const { data: { data = [] } = {} } = response || {}
          this.reports = data.sort((a, b) => a.orderNumber - b.orderNumber)
        })
        .finally(this.setLoading)
    },
    getReportsByGroup(reportGroup) {
      const reports = this.reports?.filter((report) => report.reportGroup === reportGroup)
      return reports
    }
  }
}
</script>
