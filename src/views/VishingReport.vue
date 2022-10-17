<template>
  <KContainer id="vishing-report">
    <el-tabs v-model="tab">
      <el-tab-pane
        v-for="item in tabItems"
        :key="item.name"
        :id="item.id"
        :name="item.name"
        :label="item.label"
        :disabled="isLoading"
      >
        <span slot="label">
          <v-skeleton-loader v-if="isLoading" :loading="isLoading" type="chip" />
          <template v-else> {{ item.label }} </template>
        </span>
        <component
          v-if="item.name === tab"
          :is="item.component"
          :id="id"
          :vishing-name="getVishingName"
        />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import labels from '@/model/constants/labels'
import VishingReportSummary from '@/components/VishingReport/VishingReportSummary'
import VishingReportUsers from '@/components/VishingReport/VishingReportUsers'
import VishingReportAnswered from '@/components/VishingReport/VishingReportAnswered'
export default {
  name: 'VishingReport',
  components: { KContainer },
  data() {
    return {
      isLoading: false,
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'vishing-report-summary-content',
          label: labels.Summary,
          component: VishingReportSummary
        },
        {
          name: labels.Users,
          id: 'vishing-report-users-content',
          label: labels.Users,
          component: VishingReportUsers
        },
        {
          name: labels.Answered,
          id: 'vishing-report-users-content',
          label: labels.Answered,
          component: VishingReportAnswered
        }
      ]
    }
  },
  computed: {
    id() {
      return this.$route?.params?.id
    },
    getVishingName() {
      return this.$store?.state?.common?.activePageRouterName || 'Vishing Name'
    }
  }
}
</script>
