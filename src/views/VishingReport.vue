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
          :custom-fields="customFields"
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
import VishingReportDialedNumber from '@/components/VishingReport/VishingReportDialedNumber'
import VishingReportNoResponse from '@/components/VishingReport/VishingReportNoResponse'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
export default {
  name: 'VishingReport',
  components: { KContainer },
  data() {
    return {
      customFields: [],
      isLoading: false,
      tab: labels.Summary,
      tabItems: [
        {
          name: labels.Summary,
          id: 'vishing-report-summary-content',
          label: labels.Summary,
          component: VishingReportSummary,
          isVisible: this.$store.getters['permissions/getVishingReportsSummParyPermissions']
        },
        {
          name: labels.Users,
          id: 'vishing-report-users-content',
          label: labels.Users,
          component: VishingReportUsers,
          isVisible: this.$store.getters['permissions/getVishingRepPortsUsersPermissions']
        },
        {
          name: labels.Answered,
          id: 'vishing-report-answered-content',
          label: labels.Answered,
          component: VishingReportAnswered,
          isVisible: this.$store.getters['permissions/getVishingRePportsAnsweredPermissions']
        },
        {
          name: labels.DialedNumber,
          id: 'vishing-report-dialed-number-content',
          label: labels.DialedNumber,
          component: VishingReportDialedNumber,
          isVisible: this.$store.getters['permissions/getVishingRPeportsDialedNumberPermissions']
        },
        {
          name: labels.NoResponse,
          id: 'vishing-report-no-response-content',
          label: labels.NoResponse,
          component: VishingReportNoResponse,
          isVisible: this.$store.getters['permissions/getVishingRePportsNoResponsePermissions']
        }
      ]
    }
  },
  created() {
    this.callForCustomFields()
  },
  computed: {
    id() {
      return this.$route?.params?.id
    },
    getVishingName() {
      return this.$store?.state?.common?.activePageRouterName || 'Vishing Name'
    }
  },
  methods: {
    callForCustomFields() {
      getTargetUserCustomFieldsByCompanyId({ snackbar: { hideError: true } }).then((response) => {
        this.customFields = response?.data?.data
      })
    }
  }
}
</script>
